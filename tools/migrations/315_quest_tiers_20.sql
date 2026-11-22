-- 315 — Quêtes de collection : la collection revient à un palier tous les 5 % (récompenses d'origine) ;
-- mythiques, légendaires, boosters, doublons et améliorations passent à 20 paliers (au lieu de 30 à 40).
-- Les paliers déjà récupérés sont reportés (nouveau palier = nombre de nouveaux objectifs <= dernier objectif récupéré).

create table if not exists backup_beta.player_progress_tiers_315 as select user_id, collection_tiers from public.player_progress;

create temporary table old_goals(q text primary key, goals integer[]) on commit drop;
insert into old_goals values
  ('collection', (select array_agg(g order by g) from generate_series(1,100) g)),
  ('mythics', array[1,2,3,4,5,7,9,12,15,18,21,25,30,35,40,45,50,60,70,80,90,100,115,130,145,160,180,200,220,240]),
  ('legendaries', array[1,2,3,5,7,10,13,16,20,25,30,35,40,50,60,70,80,90,100,115,130,145,160,180,200,225,250,275,300,330,360,400,440,480,511]),
  ('boosters', array[1,3,5,10,15,20,30,40,50,65,80,100,125,150,175,200,250,300,350,400,450,500,600,700,800,900,1000,1200,1400,1600,1800,2000,2250,2500,2750,3000,3500,4000,4500,5000]),
  ('duplicates', array[1,3,5,10,15,25,40,60,80,100,130,160,200,250,300,375,450,550,650,800,950,1100,1300,1500,1750,2000,2300,2600,3000,3500,4000,4500,5000,5750,6500,7250,8000,9000,10000]),
  ('upgrades', array[1,3,5,10,15,20,30,40,50,65,80,100,125,150,175,200,250,300,350,400,450,500,600,700,800,900,1000,1200,1400,1600,1800,2000]);

create or replace function public.progress_milestone_goals(p_quest text)
returns integer[] language sql immutable set search_path to '' as $$
  select case p_quest
    when 'collection'  then array[1,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100]
    when 'mythics'     then array[1,2,3,5,7,10,15,20,25,35,45,60,75,90,110,130,155,180,210,240]
    when 'legendaries' then array[1,3,5,10,15,25,35,50,65,80,100,125,150,190,230,280,330,390,450,511]
    when 'boosters'    then array[1,5,10,25,50,75,100,150,200,300,400,500,750,1000,1500,2000,2500,3000,4000,5000]
    when 'duplicates'  then array[1,10,25,50,100,150,250,400,600,800,1000,1500,2000,2500,3000,4000,5000,6500,8000,10000]
    when 'upgrades'    then array[1,5,10,20,35,50,75,100,150,200,300,400,500,650,800,1000,1250,1500,1750,2000]
    when 'explorer'    then array[2,4,6,8]
  end
$$;

create or replace function public.progress_milestone_reward(p_quest text, p_tier integer)
returns integer language plpgsql immutable set search_path to '' as $$
declare g integer[]; d integer;
begin
  if p_quest = 'explorer' then return (array[100,250,500,1000])[p_tier + 1]; end if;
  if p_quest = 'collection' then
    return case when p_tier < 5 then (array[100,250,500,750,1000])[p_tier + 1] else least(5000, 1000 + (p_tier - 4) * 250) end;
  end if;
  g := public.progress_milestone_goals(p_quest);
  if g is null or p_tier < 0 or p_tier >= cardinality(g) then return null; end if;
  d := g[p_tier + 1] - coalesce(g[p_tier], 0);
  return least(10000, greatest(100, (round(public.progress_milestone_rate(p_quest) * d / 50.0) * 50)::integer));
end $$;

update public.player_progress p set collection_tiers = p.collection_tiers || x.patch
from (
  select pp.user_id, jsonb_object_agg(o.q, (
      select count(*) from unnest(public.progress_milestone_goals(o.q)) g
       where g <= o.goals[(pp.collection_tiers ->> o.q)::integer])) patch
  from public.player_progress pp join old_goals o on (pp.collection_tiers ->> o.q)::integer between 1 and cardinality(o.goals)
  group by pp.user_id) x
where x.user_id = p.user_id;
