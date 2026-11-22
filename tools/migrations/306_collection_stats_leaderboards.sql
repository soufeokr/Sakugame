-- 306 — Statistiques de collection exactes + classements.
-- • collection_stats() : cartes possédées / catalogue complet (summon_catalog), par rareté,
--   boosters réellement ouverts (summon_orders) et doublons actuels (exemplaires en trop).
-- • leaderboard_games(kind) : top 50 des victoires pour un jeu.
-- • leaderboard_collection(kind) : top 50 — 'mythic' (mythiques différentes), 'special' (spéciales différentes),
--   'cards' (cartes différentes).
-- Les comptes bannis n'apparaissent pas. Chaque classement renvoie aussi la place du joueur connecté.

create or replace function public.collection_stats()
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); res jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 with cat as (select card_id, min(rarity) rarity from public.summon_catalog group by card_id),
 mine as (select card_id, sum(quantity) q from public.player_cards where user_id=who and quantity>0 group by card_id),
 rar as (select c.rarity, count(*) total, count(m.card_id) owned from cat c left join mine m on m.card_id=c.card_id group by c.rarity)
 select jsonb_build_object(
   'owned',(select count(*) from mine m join cat c on c.card_id=m.card_id),
   'total',(select count(*) from cat),
   'copies',(select coalesce(sum(q),0) from mine),
   'duplicates',(select coalesce(sum(q-1),0) from mine where q>1),
   'boosters',(select coalesce(sum(pack_count),0) from public.summon_orders where user_id=who),
   'rarities',(select coalesce(jsonb_object_agg(rarity,jsonb_build_object('owned',owned,'total',total)),'{}'::jsonb) from rar))
 into res;
 return res;
end $function$;

create or replace function public.leaderboard_games(p_kind text)
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); top jsonb; me jsonb;
begin
 if p_kind is null or p_kind not in ('classic','undercover','battle','race','blur','hotcold','codenames','snapshot') then raise exception 'invalid_kind'; end if;
 with r as (
   select s.user_id, p.display_name name, s.wins, s.games,
          rank() over (order by s.wins desc) pos,
          row_number() over (order by s.wins desc, s.games asc, p.display_name) ord
     from public.player_game_stats s join public.player_public_profiles p on p.user_id=s.user_id
    where s.kind=p_kind and s.wins>0 and not exists (select 1 from public.player_bans b where b.user_id=s.user_id))
 select coalesce((select jsonb_agg(jsonb_build_object('rank',pos,'id',user_id,'name',name,'value',wins,'games',games,'me',user_id=who) order by ord) from r where ord<=50),'[]'::jsonb),
        (select jsonb_build_object('rank',pos,'value',wins,'games',games) from r where user_id=who)
   into top, me;
 return jsonb_build_object('kind',p_kind,'top',top,'me',me);
end $function$;

create or replace function public.leaderboard_collection(p_kind text)
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); top jsonb; me jsonb;
begin
 if p_kind is null or p_kind not in ('mythic','special','cards') then raise exception 'invalid_kind'; end if;
 with cat as (select card_id, min(rarity) rarity from public.summon_catalog group by card_id),
 v as (
   select pc.user_id, count(distinct pc.card_id) n
     from public.player_cards pc join cat c on c.card_id=pc.card_id
    where pc.quantity>0 and (p_kind='cards' or c.rarity=p_kind)
      and not exists (select 1 from public.player_bans b where b.user_id=pc.user_id)
    group by pc.user_id),
 r as (
   select v.user_id, p.display_name name, v.n, rank() over (order by v.n desc) pos,
          row_number() over (order by v.n desc, p.display_name) ord
     from v join public.player_public_profiles p on p.user_id=v.user_id where v.n>0)
 select coalesce((select jsonb_agg(jsonb_build_object('rank',pos,'id',user_id,'name',name,'value',n,'me',user_id=who) order by ord) from r where ord<=50),'[]'::jsonb),
        (select jsonb_build_object('rank',pos,'value',n) from r where user_id=who)
   into top, me;
 return jsonb_build_object('kind',p_kind,'top',top,'me',me);
end $function$;

revoke all on function public.collection_stats(), public.leaderboard_games(text), public.leaderboard_collection(text) from public;
grant execute on function public.collection_stats() to authenticated;
grant execute on function public.leaderboard_games(text), public.leaderboard_collection(text) to anon, authenticated;
