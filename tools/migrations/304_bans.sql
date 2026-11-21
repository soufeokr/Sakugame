-- 304 — Bannissement de comptes.
-- État : PAS ENCORE APPLIQUÉE sur la base (en attente de la confirmation du propriétaire).
-- • player_bans : liste des comptes bannis (motif, date).
-- • Un compte banni ne peut plus se connecter (auth.users.banned_until), ses sessions sont fermées,
--   et il disparaît de la recherche de joueurs et des vitrines publiques.
-- Pour bannir d'autres comptes plus tard : select public.ban_players(array['<uuid>',...]::uuid[], 'motif');
-- Pour lever un bannissement : select public.unban_player('<uuid>');

create table if not exists public.player_bans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  reason text,
  banned_at timestamptz not null default now());
alter table public.player_bans enable row level security;
revoke all on public.player_bans from anon, authenticated;

create or replace function public.ban_players(p_users uuid[], p_reason text)
returns integer language plpgsql security definer set search_path to '' as $function$
declare n integer;
begin
 insert into public.player_bans(user_id, reason) select u, p_reason from unnest(p_users) u
  where exists (select 1 from auth.users x where x.id = u)
  on conflict (user_id) do update set reason = excluded.reason;
 get diagnostics n = row_count;
 update auth.users set banned_until = 'infinity' where id = any(p_users);
 delete from auth.sessions where user_id = any(p_users);
 -- annonces et échanges en cours rendus / annulés
 update public.trade_posts set state = 'closed' where owner = any(p_users) and state = 'open';
 return n;
end $function$;

create or replace function public.unban_player(p_user uuid)
returns void language plpgsql security definer set search_path to '' as $function$
begin
 delete from public.player_bans where user_id = p_user;
 update auth.users set banned_until = null where id = p_user;
end $function$;

revoke all on function public.ban_players(uuid[], text), public.unban_player(uuid) from public, anon, authenticated;

-- Recherche de joueurs : les comptes bannis n'apparaissent plus.
do $patch$
declare d text;
begin
 d := pg_get_functiondef('public.social_search'::regproc);
 if position('player_bans' in d) = 0 then
  d := replace(d, 'where pp.user_id <> who', 'where pp.user_id <> who and not exists (select 1 from public.player_bans x where x.user_id = pp.user_id)');
  if position('player_bans' in d) = 0 then raise exception 'social_search patch failed'; end if;
  execute d;
 end if;
 -- Vitrine : celle d'un compte banni est indisponible pour les autres joueurs.
 d := pg_get_functiondef('public.showcase_get'::regproc);
 if position('player_bans' in d) = 0 then
  d := replace(d, $a$if nm is null then raise exception 'unavailable'; end if;$a$,
    $b$if nm is null then raise exception 'unavailable'; end if;
  if target <> who and exists (select 1 from public.player_bans x where x.user_id = target) then raise exception 'unavailable'; end if;$b$);
  if position('player_bans' in d) = 0 then raise exception 'showcase_get patch failed'; end if;
  execute d;
 end if;
end $patch$;

-- Les 10 comptes « deyze0… » (créés le 11/11/2026 en 16 minutes).
select public.ban_players(array[
 'd699ed9d-9af0-40c1-84d5-89c577b48985','907682cc-afe1-42b1-882d-d820f54c2944','f5bede49-8f02-4422-8d7c-a8d8b4637581',
 '0d778d01-5421-43b9-abde-75c4c68d70f2','bb4c6aaf-105c-4ab2-84f3-feddfd1971ff','93e1a808-7b92-4b04-b97f-5ca7123b53a9',
 '1ce9f347-7f4e-4aa8-9057-cb10c7b6f597','f90f4742-58d0-4b4d-9c2a-32c14bdaa46c','ea5b0fd0-cf1e-459b-8e59-8253d1f42232',
 'bb375fdd-94e7-43f3-915a-f9e89d055d60']::uuid[], 'Comptes multiples (deyze0001 à deyze01010)');
