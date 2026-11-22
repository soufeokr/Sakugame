-- 314 — Quêtes : paliers rapprochés, pour qu'aucun objectif ne paraisse hors d'atteinte.
-- • Collection : un palier par % (1 → 100). Mythiques, légendaires, boosters, doublons, améliorations :
--   écart d'environ 15 à 30 % entre deux paliers (petits pas au début).
-- • Quêtes de jeu : 21 paliers au lieu de 5 (3 → 500 parties ; 1 → 100 victoires, au lieu de 500).
-- • Récompense = taux × écart avec le palier précédent (au moins 100 pièces, au plus 10 000) : le total
--   gagné reste proche de l'ancienne échelle, mais il arrive plus souvent.
-- • Les paliers déjà récupérés sont reportés (nouveau palier = nombre de nouveaux objectifs <= dernier objectif récupéré).

create table if not exists backup_beta.player_progress_tiers_314 as select user_id, collection_tiers, game_tiers from public.player_progress;

create temporary table old_goals(q text primary key, goals integer[]) on commit drop;
insert into old_goals values
  ('collection', array[1,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100]),
  ('mythics', array[1,5,10,25,50]),
  ('boosters', array[1,10,25,50,100,200,350,500,750,1000,1500,2000,3000,5000]),
  ('duplicates', array[1,10,25,50,100,250,500,1000,1500,2500,4000,6000,8000,10000]),
  ('legendaries', array[1,5,10,15,25,40,60,80,100,150,200,300,400,500]),
  ('upgrades', array[1,5,10,20,35,50,75,100,150,250,400,600,800,1000]),
  ('_games', array[3,30,100,250,500]);

create or replace function public.progress_milestone_goals(p_quest text)
returns integer[] language sql immutable set search_path to '' as $$
  select case p_quest
    when 'collection'  then (select array_agg(g order by g) from generate_series(1,100) g)
    when 'mythics'     then array[1,2,3,4,5,7,9,12,15,18,21,25,30,35,40,45,50,60,70,80,90,100,115,130,145,160,180,200,220,240]
    when 'legendaries' then array[1,2,3,5,7,10,13,16,20,25,30,35,40,50,60,70,80,90,100,115,130,145,160,180,200,225,250,275,300,330,360,400,440,480,511]
    when 'boosters'    then array[1,3,5,10,15,20,30,40,50,65,80,100,125,150,175,200,250,300,350,400,450,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2250,2500,2750,3000,3500,4000,4500,5000]
    when 'duplicates'  then array[1,3,5,10,15,25,40,60,80,100,130,160,200,250,300,375,450,550,650,800,950,1100,1300,1500,1750,2000,2300,2600,3000,3500,4000,4500,5000,5750,6500,7250,8000,9000,10000]
    when 'upgrades'    then array[1,3,5,10,15,20,30,40,50,65,80,100,125,150,175,200,250,300,350,400,450,500,600,700,800,900,1000,1200,1400,1600,1800,2000]
    when 'explorer'    then array[2,4,6,8]
  end
$$;

-- pièces par unité d'objectif
create or replace function public.progress_milestone_rate(p_quest text)
returns numeric language sql immutable set search_path to '' as $$
  select case p_quest when 'collection' then 500 when 'mythics' then 150 when 'legendaries' then 80
    when 'boosters' then 10 when 'duplicates' then 5 when 'upgrades' then 25 else 0 end::numeric
$$;

create or replace function public.progress_milestone_reward(p_quest text, p_tier integer)
returns integer language plpgsql immutable set search_path to '' as $$
declare g integer[]; d integer;
begin
  if p_quest = 'explorer' then return (array[100,250,500,1000])[p_tier + 1]; end if;
  g := public.progress_milestone_goals(p_quest);
  if g is null or p_tier < 0 or p_tier >= cardinality(g) then return null; end if;
  d := g[p_tier + 1] - coalesce(g[p_tier], 0);
  return least(10000, greatest(100, (round(public.progress_milestone_rate(p_quest) * d / 50.0) * 50)::integer));
end $$;

-- quêtes de jeu
create or replace function public.progress_game_games()
returns integer[] language sql immutable set search_path to '' as $$
  select array[3,5,10,15,20,30,40,50,65,80,100,125,150,175,200,250,300,350,400,450,500]
$$;
create or replace function public.progress_game_wins()
returns integer[] language sql immutable set search_path to '' as $$
  select array[1,1,2,3,4,6,8,10,13,16,20,25,30,35,40,50,60,70,80,90,100]
$$;
create or replace function public.progress_game_rewards()
returns integer[] language sql immutable set search_path to '' as $$
  select array_agg(least(10000, greatest(100, (round(40 * (g.v - coalesce(g.prev, 0)) / 50.0) * 50)::integer)) order by g.i)
  from (select i, v, lag(v) over (order by i) prev from unnest(public.progress_game_games()) with ordinality u(v, i)) g
$$;

do $$ declare d text; n text; begin
  d := pg_get_functiondef('public.progress_snapshot(uuid,boolean)'::regprocedure);
  if position('progress_game_games' in d) = 0 then
    n := replace(d, 'gg integer[] := array[3,30,100,250,500]; gw integer[] := array[1,15,75,200,500]; gc integer[] := array[200,500,1500,5000,10000];',
      'gg integer[] := public.progress_game_games(); gw integer[] := public.progress_game_wins(); gc integer[] := public.progress_game_rewards();');
    n := replace(n, 'done := tier >= 5;', 'done := tier >= cardinality(gg);');
    n := replace(n, '''id'', g, ''rounds'', scale = 10, ''tier'', tier,', '''id'', g, ''rounds'', scale = 10, ''tier'', tier, ''tiers'', cardinality(gg),');
    if n = d or position('progress_game_games' in n) = 0 or position('cardinality(gg)' in n) = 0 or position('''tiers'', cardinality(gg)' in n) = 0 then raise exception 'patch snapshot'; end if;
    execute n;
  end if;
  d := pg_get_functiondef('public.progress_claim_game(text,integer)'::regprocedure);
  if position('progress_game_games' in d) = 0 then
    n := replace(d, 'gg integer[] := array[3,30,100,250,500]; gw integer[] := array[1,15,75,200,500]; gc integer[] := array[200,500,1500,5000,10000];',
      'gg integer[] := public.progress_game_games(); gw integer[] := public.progress_game_wins(); gc integer[] := public.progress_game_rewards();');
    n := replace(n, 'p_tier > 4', 'p_tier >= cardinality(gg)');
    if position('progress_game_games' in n) = 0 or position('p_tier >= cardinality(gg)' in n) = 0 then raise exception 'patch claim game'; end if;
    execute n;
  end if;
end $$;

-- report des paliers déjà récupérés
update public.player_progress p set collection_tiers = p.collection_tiers || x.patch
from (
  select pp.user_id, jsonb_object_agg(o.q, (
      select count(*) from unnest(public.progress_milestone_goals(o.q)) g
       where g <= o.goals[(pp.collection_tiers ->> o.q)::integer])) patch
  from public.player_progress pp join old_goals o on o.q <> '_games' and (pp.collection_tiers ->> o.q)::integer between 1 and cardinality(o.goals)
  group by pp.user_id) x
where x.user_id = p.user_id;

update public.player_progress p set game_tiers = p.game_tiers || x.patch
from (
  select pp.user_id, jsonb_object_agg(e.key, (
      select count(*) from unnest(public.progress_game_games()) g
       where g <= (select goals from old_goals where q = '_games')[(e.value #>> '{}')::integer])) patch
  from public.player_progress pp, jsonb_each(pp.game_tiers) e
  where jsonb_typeof(e.value) = 'number' and (e.value #>> '{}')::integer between 1 and 5
  group by pp.user_id) x
where x.user_id = p.user_id;
