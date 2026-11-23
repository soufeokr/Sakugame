-- 319 — Notifications (cloche de la barre du haut).
-- Une ligne par événement, écrite uniquement par le serveur :
--   • sale            : une de mes annonces du marché est vendue (prix fixe ou enchère) ;
--   • auction_won     : j'ai remporté une enchère ;
--   • outbid          : quelqu'un a surenchéri sur une enchère où j'étais le meilleur offrant ;
--   • friend_request  : demande d'ami reçue ; friend_accept : ma demande a été acceptée ;
--   • trade_request / trade_counter : proposition d'échange / contre-proposition reçue ;
--   • trade_accepted  : ma proposition a été acceptée ;
--   • referral        : un joueur a rejoint Sakugame avec mon lien de parrainage ;
--   • room_invite     : invitation dans un salon de jeu (notif_room_invite).
-- Les quêtes terminées sont calculées côté navigateur à partir de progress_get (rien à stocker ici).
-- RLS active sans politique : lecture et marquage passent par notif_list / notif_mark_read.

create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  kind text not null,
  actor uuid,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists notifications_user_idx on public.notifications (user_id, id desc);
create index if not exists notifications_invite_idx on public.notifications (actor, created_at) where kind = 'room_invite';
alter table public.notifications enable row level security;
revoke all on public.notifications from public, anon, authenticated;

-- Écriture interne : anti-doublon pour les demandes d'ami (annuler / redemander en boucle),
-- et on ne garde que les 80 dernières notifications de chaque joueur.
create or replace function public.notif_push(p_user uuid, p_kind text, p_actor uuid, p_data jsonb default '{}'::jsonb)
returns void language plpgsql security definer set search_path to '' as $$
begin
  if p_user is null or p_user = p_actor then return; end if;
  if p_kind in ('friend_request', 'friend_accept') and exists (
       select 1 from public.notifications where user_id = p_user and kind = p_kind and actor = p_actor
         and created_at > now() - interval '1 day') then
    return;
  end if;
  insert into public.notifications(user_id, kind, actor, data) values (p_user, p_kind, p_actor, coalesce(p_data, '{}'::jsonb));
  if random() < 0.2 then
    delete from public.notifications where user_id = p_user and id < (
      select id from public.notifications where user_id = p_user order by id desc offset 79 limit 1);
  end if;
end $$;
revoke all on function public.notif_push(uuid, text, uuid, jsonb) from public, anon, authenticated;

-- Marché : vente, enchère gagnée, surenchère.
create or replace function public.notif_market_trg() returns trigger language plpgsql security definer set search_path to '' as $$
declare d jsonb;
begin
  d := jsonb_build_object('card', new.card_id, 'level', new.card_level, 'listing', new.id, 'auction', new.kind = 'auction');
  if new.state = 'sold' and old.state is distinct from 'sold' then
    perform public.notif_push(new.seller, 'sale', new.buyer,
      d || jsonb_build_object('price', case when new.kind = 'auction' then coalesce(new.bid, new.price) else new.price end));
    if new.kind = 'auction' then
      perform public.notif_push(new.buyer, 'auction_won', new.seller, d || jsonb_build_object('price', coalesce(new.bid, new.price)));
    end if;
  elsif new.state = 'active' and old.bidder is not null and new.bidder is distinct from old.bidder then
    perform public.notif_push(old.bidder, 'outbid', new.bidder, d || jsonb_build_object('price', new.bid, 'mine', old.bid, 'ends_at', new.ends_at));
  end if;
  return null;
end $$;
drop trigger if exists notif_market on public.market_listings;
create trigger notif_market after update on public.market_listings for each row execute function public.notif_market_trg();

-- Amis : demande reçue, demande acceptée (la ligne « friend » du demandeur est créée par celui qui accepte).
create or replace function public.notif_social_trg() returns trigger language plpgsql security definer set search_path to '' as $$
begin
  if new.kind = 'incoming' then
    perform public.notif_push(new.owner, 'friend_request', new.other, '{}'::jsonb);
  elsif new.kind = 'friend' and auth.uid() is not null and new.owner <> auth.uid() then
    perform public.notif_push(new.owner, 'friend_accept', new.other, '{}'::jsonb);
  end if;
  return null;
end $$;
drop trigger if exists notif_social on public.social_relations;
create trigger notif_social after insert on public.social_relations for each row execute function public.notif_social_trg();

-- Échanges : proposition ou contre-proposition reçue, proposition acceptée.
create or replace function public.notif_trade_trg() returns trigger language plpgsql security definer set search_path to '' as $$
begin
  if tg_op = 'INSERT' then
    if new.state = 'pending' then
      perform public.notif_push(new.to_user, case when new.counter_of is null then 'trade_request' else 'trade_counter' end, new.from_user,
        jsonb_build_object('trade', new.id));
    end if;
  elsif new.state = 'accepted' and old.state = 'pending' then
    perform public.notif_push(new.from_user, 'trade_accepted', new.to_user, jsonb_build_object('trade', new.id));
  end if;
  return null;
end $$;
drop trigger if exists notif_trade_ins on public.trades;
create trigger notif_trade_ins after insert on public.trades for each row execute function public.notif_trade_trg();
drop trigger if exists notif_trade_upd on public.trades;
create trigger notif_trade_upd after update of state on public.trades for each row execute function public.notif_trade_trg();

-- Parrainage : un filleul rejoint.
create or replace function public.notif_referral_trg() returns trigger language plpgsql security definer set search_path to '' as $$
begin
  perform public.notif_push(new.referrer, 'referral', new.referred, '{}'::jsonb);
  return null;
end $$;
drop trigger if exists notif_referral on public.referrals;
create trigger notif_referral after insert on public.referrals for each row execute function public.notif_referral_trg();

revoke all on function public.notif_market_trg(), public.notif_social_trg(), public.notif_trade_trg(), public.notif_referral_trg() from public, anon, authenticated;

-- Invitation dans un salon de jeu (les salons vivent dans Firebase : on ne transmet que le code).
-- Limites : 30 invitations par 10 minutes, une même invitation (joueur + salon) toutes les 30 s.
-- Un blocage dans un sens ou dans l'autre rend l'invitation silencieuse.
create or replace function public.notif_room_invite(p_to uuid, p_code text, p_game text default null)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare who uuid := auth.uid(); n integer; code text := upper(coalesce(p_code, ''));
begin
  if who is null then raise exception 'not_authenticated'; end if;
  if p_to is null or p_to = who then raise exception 'invalid_target'; end if;
  if code !~ '^[A-Z0-9]{4}$' then raise exception 'invalid_room'; end if;
  if exists (select 1 from public.player_bans where user_id = who) then raise exception 'unavailable'; end if;
  if not exists (select 1 from public.player_accounts where user_id = p_to) then raise exception 'player_unavailable'; end if;
  select count(*) into n from public.notifications where actor = who and kind = 'room_invite' and created_at > now() - interval '10 minutes';
  if n >= 30 then raise exception 'too_many_invites'; end if;
  if exists (select 1 from public.notifications where actor = who and user_id = p_to and kind = 'room_invite'
               and data->>'code' = code and created_at > now() - interval '30 seconds') then
    return jsonb_build_object('ok', true, 'repeat', true);
  end if;
  if exists (select 1 from public.social_relations where kind = 'blocked'
               and ((owner = who and other = p_to) or (owner = p_to and other = who))) then
    return jsonb_build_object('ok', true);
  end if;
  perform public.notif_push(p_to, 'room_invite', who, jsonb_build_object('code', code,
    'game', left(regexp_replace(coalesce(p_game, ''), '[^a-z0-9_-]', '', 'g'), 24)));
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.notif_room_invite(uuid, text, text) from public, anon;
grant execute on function public.notif_room_invite(uuid, text, text) to authenticated;

-- Liste : les 40 dernières notifications (ou seulement celles après p_after) et le nombre de non lues.
create or replace function public.notif_list(p_after bigint default 0)
returns jsonb language plpgsql stable security definer set search_path to '' as $$
declare who uuid := auth.uid(); items jsonb; unread integer;
begin
  if who is null then raise exception 'not_authenticated'; end if;
  select count(*) into unread from public.notifications where user_id = who and read_at is null;
  select coalesce(jsonb_agg(x order by (x->>'id')::bigint desc), '[]'::jsonb) into items from (
    select jsonb_build_object('id', n.id, 'kind', n.kind, 'actor', n.actor, 'data', n.data, 'created_at', n.created_at,
             'read', n.read_at is not null,
             'actor_name', coalesce(nullif(p.display_name, ''), null),
             'actor_avatar', case when n.actor is null then null else public.player_avatar(n.actor) end) x
      from public.notifications n
      left join public.player_public_profiles p on p.user_id = n.actor
     where n.user_id = who and n.id > coalesce(p_after, 0)
     order by n.id desc limit 40) s;
  return jsonb_build_object('items', items, 'unread', unread);
end $$;
revoke all on function public.notif_list(bigint) from public, anon;
grant execute on function public.notif_list(bigint) to authenticated;

create or replace function public.notif_mark_read(p_upto bigint default null)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare who uuid := auth.uid(); n integer;
begin
  if who is null then raise exception 'not_authenticated'; end if;
  update public.notifications set read_at = now()
   where user_id = who and read_at is null and (p_upto is null or id <= p_upto);
  get diagnostics n = row_count;
  return jsonb_build_object('ok', true, 'marked', n);
end $$;
revoke all on function public.notif_mark_read(bigint) from public, anon;
grant execute on function public.notif_mark_read(bigint) to authenticated;
