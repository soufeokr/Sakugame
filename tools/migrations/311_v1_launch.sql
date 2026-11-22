-- 311 — Lancement de la 1.0 (22/11/2026).
-- 1) Sauvegarde complète des données de jeu de la bêta dans le schéma backup_beta (non exposé).
-- 2) Remise à zéro de tous les comptes : cartes, niveaux de cartes, options de cartes (favori/verrou),
--    pièces (→ 10 000), objets (→ 1 gemme d'invocation), tirages (→ 5, bonus 0), pitié, marché, échanges,
--    cartes de la vitrine, niveau/XP/quêtes, statistiques de parties, parrainages.
--    Conservés : comptes, pseudos, avatars, AniList, amis, apparence de la vitrine, bans, codes de parrainage, liste de souhaits.
-- 3) Compteurs de victoires du profil : époque 1 (le client efface ses compteurs locaux plus anciens ; le serveur refuse
--    les compteurs envoyés par un client d'une époque précédente).
-- 4) Fenêtre d'information de la 1.0 (launch_notices) : une fois par compte, texte spécial pour les bêta-testeurs.
-- 5) Parrainage : les comptes de la bêta ont 7 jours à partir du lancement pour saisir un code.

-- ---------- 1) sauvegarde ----------
create schema if not exists backup_beta;
revoke all on schema backup_beta from public, anon, authenticated;
do $$ declare t text; begin
  foreach t in array array['player_cards','player_card_options','card_upgrades','card_upgrade_batches','market_listings','market_batches',
    'auction_settlement_errors','trades','trade_items','trade_posts','summon_orders','summon_pity','buyback_orders','player_items',
    'player_wallets','player_free_draws','player_progress','player_game_stats','game_reports','player_showcases','player_profile_data',
    'referrals','referral_claims'] loop
    execute format('create table if not exists backup_beta.%I as table public.%I', t, t);
  end loop;
end $$;

-- ---------- 4) fenêtre d'information ----------
create table if not exists public.launch_notices (
  user_id uuid primary key references auth.users(id) on delete cascade,
  beta boolean not null default false,
  seen_at timestamptz);
alter table public.launch_notices enable row level security;
revoke all on public.launch_notices from anon, authenticated;
insert into public.launch_notices(user_id, beta) select user_id, true from public.player_accounts on conflict do nothing;

create or replace function public.launch_notice_get()
returns jsonb language plpgsql stable security definer set search_path to '' as $f$
declare who uuid := auth.uid(); r public.launch_notices%rowtype;
begin
  if who is null then raise exception 'not_authenticated'; end if;
  select * into r from public.launch_notices where user_id = who;
  return jsonb_build_object('show', r.seen_at is null, 'beta', coalesce(r.beta, false));
end $f$;

create or replace function public.launch_notice_seen()
returns jsonb language plpgsql security definer set search_path to '' as $f$
declare who uuid := auth.uid();
begin
  if who is null then raise exception 'not_authenticated'; end if;
  insert into public.launch_notices(user_id, beta, seen_at) values (who, false, now())
    on conflict (user_id) do update set seen_at = coalesce(public.launch_notices.seen_at, now());
  return jsonb_build_object('ok', true);
end $f$;
revoke all on function public.launch_notice_get(), public.launch_notice_seen() from public, anon;
grant execute on function public.launch_notice_get(), public.launch_notice_seen() to authenticated;

-- ---------- 5) parrainage : fenêtre de 7 jours à partir du lancement ----------
do $$ declare d text; begin
  execute format('create or replace function public.v1_launch_at() returns timestamptz language sql immutable set search_path to %L as %L',
    '', 'select ' || quote_literal(now()::text) || '::timestamptz');
  d := pg_get_functiondef('public.referral_status()'::regprocedure);
  if position('v1_launch_at' in d) = 0 then
    if position('window_end := coalesce(acc, now()) + interval ''7 days'';' in d) = 0 then raise exception 'patch status'; end if;
    execute replace(d, 'window_end := coalesce(acc, now()) + interval ''7 days'';', 'window_end := greatest(coalesce(acc, now()), public.v1_launch_at()) + interval ''7 days'';');
  end if;
  d := pg_get_functiondef('public.referral_apply(text)'::regprocedure);
  if position('v1_launch_at' in d) = 0 then
    if position('if now() >= acc + interval ''7 days'' then' in d) = 0 then raise exception 'patch apply'; end if;
    execute replace(d, 'if now() >= acc + interval ''7 days'' then', 'if now() >= greatest(acc, public.v1_launch_at()) + interval ''7 days'' then');
  end if;
end $$;
revoke all on function public.v1_launch_at() from public, anon, authenticated;

-- ---------- 3) époque des compteurs du profil ----------
do $$ declare d text; begin
  d := pg_get_functiondef('public.profile_data_clean(jsonb)'::regprocedure);
  if position('''epoch''' in d) = 0 then
    if position('array[''wins'',''losses'',''uWins'',''uLosses'',''createdAt'']' in d) = 0 then raise exception 'patch clean'; end if;
    execute replace(d, 'array[''wins'',''losses'',''uWins'',''uLosses'',''createdAt'']', 'array[''wins'',''losses'',''uWins'',''uLosses'',''createdAt'',''epoch'']');
  end if;
end $$;

create or replace function public.profile_data_set(p_data jsonb)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); clean jsonb; old jsonb; old_epoch numeric;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_data is null or jsonb_typeof(p_data)<>'object' or length(p_data::text)>32000 then raise exception 'invalid_request'; end if;
 clean:=public.profile_data_clean(p_data);
 select data into old from public.player_profile_data where user_id=who;
 old_epoch:=coalesce((old->>'epoch')::numeric,0);
 -- un client d'une époque précédente ne peut pas réécrire les compteurs remis à zéro
 if coalesce((clean->>'epoch')::numeric,0) < old_epoch then
   clean:=(clean-'wins'-'losses'-'uWins'-'uLosses'-'epoch')
     || coalesce((select jsonb_object_agg(k,v) from jsonb_each(old) e(k,v) where k in ('wins','losses','uWins','uLosses','epoch')),'{}'::jsonb);
 end if;
 insert into public.player_profile_data(user_id,data,updated_at) values(who,clean,now())
  on conflict(user_id) do update set data=excluded.data, updated_at=now();
 if clean ? 'name' then update public.player_public_profiles set display_name=clean->>'name' where user_id=who; end if;
 return clean;
end $function$;
revoke all on function public.profile_data_set(jsonb) from public, anon;
grant execute on function public.profile_data_set(jsonb) to authenticated;

-- ---------- 2) remise à zéro ----------
delete from public.trade_items;
delete from public.trades;
delete from public.trade_posts;
delete from public.market_batches;
delete from public.auction_settlement_errors;
delete from public.market_listings;
delete from public.buyback_orders;
delete from public.card_upgrade_batches;
delete from public.card_upgrades;
delete from public.summon_orders;
delete from public.summon_pity;
delete from public.player_cards;
update public.player_card_options set favorite=false, locked=false;
delete from public.player_card_options where not wishlist;
delete from public.player_items;
insert into public.player_items(user_id, item, quantity) select user_id, 'summon_gem', 1 from public.player_accounts;
update public.player_wallets set coins=10000;
insert into public.player_wallets(user_id, coins) select user_id, 10000 from public.player_accounts on conflict (user_id) do nothing;
update public.player_free_draws set available=5, bonus=0, last_refill_at=now(), updated_at=now();
update public.player_progress set level=1, xp=0, daily_day=(now() at time zone 'utc')::date, daily_games=0, daily_wins=0, daily_rounds=0,
  daily_round_wins=0, daily_by_game='{}'::jsonb, daily_claimed='{}'::jsonb, last_game_at=null, last_round_at=null,
  game_tiers='{}'::jsonb, collection_tiers='{}'::jsonb, weekly_start='2000-01-03'::date, weekly_full_days=0, weekly_claimed='{}'::jsonb;
delete from public.player_game_stats;
delete from public.game_reports;
update public.player_showcases set cards='{}'::text[], updated_at=now();
update public.player_profile_data set data=(data-'wins'-'losses'-'uWins'-'uLosses') || '{"epoch":1}'::jsonb, updated_at=now();
insert into public.player_profile_data(user_id, data) select user_id, '{"epoch":1}'::jsonb from public.player_accounts on conflict (user_id) do nothing;
delete from public.referral_claims;
delete from public.referrals;
