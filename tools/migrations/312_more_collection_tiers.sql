-- 312 — Quêtes de collection : plus de paliers pour boosters ouverts, doublons, légendaires et cartes améliorées
-- (14 paliers chacun au lieu de 5). Les paliers déjà récupérés sont reportés sur la nouvelle échelle
-- (nouveau palier = nombre de nouveaux objectifs <= dernier objectif déjà récupéré).

create table if not exists backup_beta.player_progress_tiers_312 as select user_id, collection_tiers from public.player_progress;

-- anciennes échelles, pour le report
create temporary table old_goals(q text primary key, goals integer[]) on commit drop;
insert into old_goals values
  ('boosters', array[1,10,50,100,500]), ('duplicates', array[1,10,50,100,500]),
  ('legendaries', array[1,5,15,40,100]), ('upgrades', array[1,5,20,50,150]);

create or replace function public.progress_milestone_goals(p_quest text)
returns integer[] language sql immutable set search_path to '' as $$
  select case p_quest
    when 'collection'  then array[1,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100]
    when 'boosters'    then array[1,10,25,50,100,200,350,500,750,1000,1500,2000,3000,5000]
    when 'mythics'     then array[1,5,10,25,50]
    when 'duplicates'  then array[1,10,25,50,100,250,500,1000,1500,2500,4000,6000,8000,10000]
    when 'legendaries' then array[1,5,10,15,25,40,60,80,100,150,200,300,400,500]
    when 'upgrades'    then array[1,5,10,20,35,50,75,100,150,250,400,600,800,1000]
    when 'explorer'    then array[2,4,6,8]
  end
$$;

create or replace function public.progress_milestone_reward(p_quest text, p_tier integer)
returns integer language sql immutable set search_path to '' as $$
  select case p_quest
    when 'collection'  then case when p_tier < 5 then (array[100,250,500,750,1000])[p_tier + 1] else least(5000, 1000 + (p_tier - 4) * 250) end
    when 'boosters'    then (array[100,250,400,600,1000,1500,2000,2500,3000,4000,5000,6000,8000,10000])[p_tier + 1]
    when 'duplicates'  then (array[100,250,400,600,1000,1500,2000,2500,3000,4000,5000,6000,8000,10000])[p_tier + 1]
    when 'legendaries' then (array[80,200,300,400,600,1000,1500,2000,3000,4000,5000,6000,8000,10000])[p_tier + 1]
    when 'upgrades'    then (array[100,200,300,500,800,1200,1600,2000,3000,4000,5000,6000,8000,10000])[p_tier + 1]
    when 'explorer'    then (array[100,250,500,1000])[p_tier + 1]
    else (array[100,250,500,1500,5000])[p_tier + 1]
  end
$$;

-- report des paliers déjà récupérés
update public.player_progress p set collection_tiers = p.collection_tiers || x.patch
from (
  select pp.user_id, jsonb_object_agg(o.q, (
      select count(*) from unnest(public.progress_milestone_goals(o.q)) g
       where g <= o.goals[(pp.collection_tiers ->> o.q)::integer])) patch
  from public.player_progress pp join old_goals o on (pp.collection_tiers ->> o.q)::integer between 1 and cardinality(o.goals)
  group by pp.user_id) x
where x.user_id = p.user_id;
