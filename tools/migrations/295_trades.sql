-- 295 — Échanges directs entre joueurs (proposés depuis la vitrine, reçus dans « Mes affaires »).
-- Les cartes offertes sont réservées dès la proposition (comme une mise en vente) et rendues
-- en cas de refus, d'annulation ou d'expiration. Les cartes demandées sont prises à l'acceptation
-- (exemplaire du plus bas niveau, non verrouillé). Les limites par paire sur 14 jours
-- (1 spéciale, 3 mythiques, 15 légendaires) comptent ventes, enchères ET échanges.

create table if not exists public.trades(
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  state text not null default 'pending' check (state in ('pending','accepted','declined','cancelled','expired')),
  message text check (message is null or char_length(message)<=200),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now()+interval '7 days',
  closed_at timestamptz,
  unique(from_user,request_id),
  check (from_user<>to_user)
);
create index if not exists trades_to_idx on public.trades(to_user,state);
create index if not exists trades_from_idx on public.trades(from_user,state);

create table if not exists public.trade_items(
  trade_id uuid not null references public.trades(id) on delete cascade,
  side text not null check (side in ('give','want')),
  card_id text not null check (char_length(card_id) between 1 and 128),
  level smallint check (level is null or level between 0 and 3),
  quantity integer not null default 1 check (quantity between 1 and 5),
  rarity text
);
create index if not exists trade_items_trade_idx on public.trade_items(trade_id);

alter table public.trades enable row level security;
alter table public.trade_items enable row level security;
revoke all on public.trades, public.trade_items from anon, authenticated;

-- Cartes d'une rareté déjà engagées entre deux comptes via les échanges (acceptés sur 14 jours + en attente).
create or replace function public.trade_pair_used(p_a uuid, p_b uuid, p_rarity text, p_skip uuid)
returns integer language sql stable security definer set search_path to '' as $$
  select coalesce(sum(i.quantity),0)::integer from public.trades t join public.trade_items i on i.trade_id=t.id
  where t.id is distinct from p_skip and i.rarity=p_rarity
    and ((t.from_user=p_a and t.to_user=p_b) or (t.from_user=p_b and t.to_user=p_a))
    and (t.state='pending' and t.expires_at>now() or (t.state='accepted' and t.closed_at>now()-interval '14 days'))
$$;

-- Les ventes et enchères comptent désormais aussi les échanges.
create or replace function public.market_pair_check(p_a uuid, p_b uuid, p_card text, p_skip uuid)
returns void language plpgsql stable security definer set search_path to '' as $function$
declare r text:=public.market_card_rarity(p_card); lim integer:=public.market_pair_limit(r); used integer;
begin
 if lim is null or p_a is null or p_b is null then return; end if;
 select count(*) into used from public.market_listings l
  where l.id is distinct from p_skip and public.market_card_rarity(l.card_id)=r
   and ((l.state='sold' and l.closed_at>now()-interval '14 days' and ((l.seller=p_a and l.buyer=p_b) or (l.seller=p_b and l.buyer=p_a)))
     or (l.state='active' and l.kind='auction' and ((l.seller=p_a and l.bidder=p_b) or (l.seller=p_b and l.bidder=p_a))));
 used:=used+public.trade_pair_used(p_a,p_b,r,null);
 if used>=lim then raise exception 'pair_limit'; end if;
end $function$;

-- Vérifie qu'un échange (déjà inséré ou non, p_skip) tient dans les limites de la paire.
create or replace function public.trade_pair_fits(p_trade uuid, p_a uuid, p_b uuid)
returns void language plpgsql stable security definer set search_path to '' as $function$
declare r record; lim integer; used integer;
begin
 for r in select i.rarity, sum(i.quantity)::integer n from public.trade_items i where i.trade_id=p_trade group by i.rarity loop
  lim:=public.market_pair_limit(r.rarity);
  if lim is null then continue; end if;
  select count(*) into used from public.market_listings l
   where public.market_card_rarity(l.card_id)=r.rarity
    and ((l.state='sold' and l.closed_at>now()-interval '14 days' and ((l.seller=p_a and l.buyer=p_b) or (l.seller=p_b and l.buyer=p_a)))
      or (l.state='active' and l.kind='auction' and ((l.seller=p_a and l.bidder=p_b) or (l.seller=p_b and l.bidder=p_a))));
  used:=used+public.trade_pair_used(p_a,p_b,r.rarity,p_trade);
  if used+r.n>lim then raise exception 'pair_limit'; end if;
 end loop;
end $function$;

-- Rend les cartes réservées d'un échange à son auteur (appelé sous verrou de la ligne trades).
create or replace function public.trade_return_reserved(p_trade uuid)
returns void language plpgsql security definer set search_path to '' as $function$
declare t public.trades%rowtype; i record;
begin
 select * into t from public.trades where id=p_trade;
 for i in select card_id,level,quantity from public.trade_items where trade_id=p_trade and side='give' loop
  insert into public.player_cards(user_id,card_id,level,quantity) values(t.from_user,i.card_id,i.level,i.quantity)
   on conflict(user_id,card_id,level) do update set quantity=public.player_cards.quantity+excluded.quantity;
 end loop;
end $function$;

create or replace function public.trade_expire_for(p_user uuid)
returns void language plpgsql security definer set search_path to '' as $function$
declare t record;
begin
 for t in select id from public.trades where state='pending' and expires_at<=now() and (from_user=p_user or to_user=p_user) order by id for update skip locked loop
  perform public.trade_return_reserved(t.id);
  update public.trades set state='expired',closed_at=now() where id=t.id;
 end loop;
end $function$;

create or replace function public.trade_propose(p_request uuid, p_to uuid, p_give jsonb, p_want jsonb, p_message text default null)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); old public.trades%rowtype; row_id uuid; it jsonb; cid text; lvl integer; qty integer; rar text; have integer; shown text[]; msg text;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_request is null or p_to is null or jsonb_typeof(p_give)<>'array' or jsonb_typeof(p_want)<>'array' then raise exception 'invalid_request'; end if;
 if p_to=who then raise exception 'trade_self'; end if;
 -- Sérialise les propositions d'un même joueur (et les requêtes rejouées).
 perform 1 from public.player_wallets where user_id=who for update;
 if not found then raise exception 'account_missing'; end if;
 select * into old from public.trades where from_user=who and request_id=p_request;
 if found then return jsonb_build_object('id',old.id,'state',old.state); end if;
 if jsonb_array_length(p_give) not between 1 and 5 or jsonb_array_length(p_want) not between 1 and 5 then raise exception 'trade_size'; end if;
 if not exists(select 1 from public.player_public_profiles where user_id=p_to) then raise exception 'unavailable'; end if;
 if exists(select 1 from public.social_relations where kind='blocked' and ((owner=p_to and other=who) or (owner=who and other=p_to))) then raise exception 'unavailable'; end if;
 if (select count(*) from public.trades where from_user=who and state='pending' and expires_at>now())>=10 then raise exception 'trade_too_many'; end if;
 if (select count(*) from public.trades where from_user=who and to_user=p_to and state='pending' and expires_at>now())>=3 then raise exception 'trade_too_many'; end if;
 msg:=nullif(btrim(coalesce(p_message,'')),'');
 if msg is not null then msg:=left(msg,200); end if;
 select coalesce(cards,'{}') into shown from public.player_showcases where user_id=p_to;
 shown:=coalesce(shown,'{}');

 insert into public.trades(request_id,from_user,to_user,message) values(p_request,who,p_to,msg) returning id into row_id;

 for it in select * from jsonb_array_elements(p_give) loop
  cid:=it->>'card'; lvl:=coalesce((it->>'level')::integer,-1); qty:=coalesce((it->>'qty')::integer,1);
  if cid is null or length(cid) not between 1 and 128 or lvl not between 0 and 3 or qty not between 1 and 5 then raise exception 'invalid_request'; end if;
  rar:=public.market_card_rarity(cid); if rar is null then raise exception 'catalog_invalid'; end if;
  if exists(select 1 from public.player_card_options where user_id=who and card_id=cid and locked) then raise exception 'card_locked'; end if;
  select quantity into have from public.player_cards where user_id=who and card_id=cid and level=lvl for update;
  if not found or have<qty then raise exception 'card_unavailable'; end if;
  if have=qty then delete from public.player_cards where user_id=who and card_id=cid and level=lvl;
  else update public.player_cards set quantity=quantity-qty where user_id=who and card_id=cid and level=lvl; end if;
  insert into public.trade_items(trade_id,side,card_id,level,quantity,rarity) values(row_id,'give',cid,lvl,qty,rar);
 end loop;

 for it in select * from jsonb_array_elements(p_want) loop
  cid:=it->>'card'; qty:=coalesce((it->>'qty')::integer,1);
  if cid is null or length(cid) not between 1 and 128 or qty not between 1 and 5 then raise exception 'invalid_request'; end if;
  rar:=public.market_card_rarity(cid); if rar is null then raise exception 'catalog_invalid'; end if;
  -- Seules les cartes exposées dans la vitrine peuvent être demandées : la collection reste privée.
  if not (cid = any(shown)) then raise exception 'trade_not_shown'; end if;
  insert into public.trade_items(trade_id,side,card_id,level,quantity,rarity) values(row_id,'want',cid,null,qty,rar);
 end loop;

 if (select count(*) from (select card_id from public.trade_items where trade_id=row_id and side='want' group by card_id having count(*)>1) d)>0 then raise exception 'invalid_request'; end if;
 perform public.trade_pair_fits(row_id,who,p_to);
 return jsonb_build_object('id',row_id,'state','pending');
end $function$;

create or replace function public.trade_respond(p_trade uuid, p_accept boolean)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); t public.trades%rowtype; i record; c record; need integer; take integer;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_trade is null or p_accept is null then raise exception 'invalid_request'; end if;
 select * into t from public.trades where id=p_trade for update;
 if not found or t.to_user<>who then raise exception 'not_found'; end if;
 if t.state<>'pending' then
  if (p_accept and t.state='accepted') or (not p_accept and t.state='declined') then return jsonb_build_object('id',t.id,'state',t.state); end if;
  raise exception 'trade_closed';
 end if;
 if t.expires_at<=now() then
  perform public.trade_return_reserved(t.id);
  update public.trades set state='expired',closed_at=now() where id=t.id;
  return jsonb_build_object('id',t.id,'state','expired'); -- (pas d'exception : elle annulerait le retour des cartes)
 end if;
 if not p_accept then
  perform public.trade_return_reserved(t.id);
  update public.trades set state='declined',closed_at=now() where id=t.id;
  return jsonb_build_object('id',t.id,'state','declined');
 end if;
 if exists(select 1 from public.social_relations where kind='blocked' and ((owner=t.to_user and other=t.from_user) or (owner=t.from_user and other=t.to_user))) then raise exception 'unavailable'; end if;
 perform public.trade_pair_fits(t.id,t.from_user,t.to_user);
 -- Verrous des deux portefeuilles dans un ordre fixe (comme market_buy).
 perform user_id from public.player_wallets where user_id in (t.from_user,t.to_user) order by user_id for update;
 -- Cartes demandées : prises chez le destinataire, plus bas niveau d'abord.
 for i in select card_id,quantity from public.trade_items where trade_id=t.id and side='want' loop
  if exists(select 1 from public.player_card_options where user_id=who and card_id=i.card_id and locked) then raise exception 'trade_want_locked'; end if;
  need:=i.quantity;
  for c in select level,quantity from public.player_cards where user_id=who and card_id=i.card_id and quantity>0 order by level for update loop
   exit when need=0;
   take:=least(need,c.quantity);
   if take=c.quantity then delete from public.player_cards where user_id=who and card_id=i.card_id and level=c.level;
   else update public.player_cards set quantity=quantity-take where user_id=who and card_id=i.card_id and level=c.level; end if;
   insert into public.player_cards(user_id,card_id,level,quantity) values(t.from_user,i.card_id,c.level,take)
    on conflict(user_id,card_id,level) do update set quantity=public.player_cards.quantity+excluded.quantity;
   update public.trade_items set level=c.level where trade_id=t.id and side='want' and card_id=i.card_id;
   need:=need-take;
  end loop;
  if need>0 then raise exception 'trade_want_missing'; end if;
 end loop;
 -- Cartes offertes (déjà réservées) : remises au destinataire.
 for i in select card_id,level,quantity from public.trade_items where trade_id=t.id and side='give' loop
  insert into public.player_cards(user_id,card_id,level,quantity) values(who,i.card_id,i.level,i.quantity)
   on conflict(user_id,card_id,level) do update set quantity=public.player_cards.quantity+excluded.quantity;
 end loop;
 update public.trades set state='accepted',closed_at=now() where id=t.id;
 return jsonb_build_object('id',t.id,'state','accepted');
end $function$;

create or replace function public.trade_cancel(p_trade uuid)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); t public.trades%rowtype;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 select * into t from public.trades where id=p_trade for update;
 if not found or t.from_user<>who then raise exception 'not_found'; end if;
 if t.state='cancelled' then return jsonb_build_object('id',t.id,'state','cancelled'); end if;
 if t.state<>'pending' then raise exception 'trade_closed'; end if;
 perform public.trade_return_reserved(t.id);
 update public.trades set state=case when t.expires_at<=now() then 'expired' else 'cancelled' end,closed_at=now() where id=t.id;
 return jsonb_build_object('id',t.id,'state','cancelled');
end $function$;

-- Mes échanges : en attente (reçus/envoyés) et historique des 30 derniers jours.
create or replace function public.trade_list()
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); res jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 perform public.trade_expire_for(who);
 select coalesce(jsonb_agg(x order by x->>'created_at' desc),'[]'::jsonb) into res from (
  select jsonb_build_object(
   'id',t.id,'incoming',t.to_user=who,'state',t.state,'message',t.message,
   'other',case when t.to_user=who then t.from_user else t.to_user end,
   'other_name',coalesce(p.display_name,'Player'),
   'created_at',t.created_at,'expires_at',t.expires_at,'closed_at',t.closed_at,
   'give',(select coalesce(jsonb_agg(jsonb_build_object('card',i.card_id,'level',i.level,'qty',i.quantity,'rarity',i.rarity)),'[]'::jsonb) from public.trade_items i where i.trade_id=t.id and i.side='give'),
   'want',(select coalesce(jsonb_agg(jsonb_build_object('card',i.card_id,'level',i.level,'qty',i.quantity,'rarity',i.rarity)),'[]'::jsonb) from public.trade_items i where i.trade_id=t.id and i.side='want')
  ) x
  from public.trades t
  left join public.player_public_profiles p on p.user_id=case when t.to_user=who then t.from_user else t.to_user end
  where (t.from_user=who or t.to_user=who)
    and (t.state='pending' or t.closed_at>now()-interval '30 days')
  order by t.created_at desc limit 80
 ) s;
 return res;
end $function$;

-- Nombre de propositions reçues en attente (badge du menu).
create or replace function public.trade_pending_count()
returns integer language sql stable security definer set search_path to '' as $$
  select count(*)::integer from public.trades where to_user=auth.uid() and state='pending' and expires_at>now()
$$;

revoke all on function public.trade_pair_used(uuid,uuid,text,uuid), public.trade_pair_fits(uuid,uuid,uuid),
  public.trade_return_reserved(uuid), public.trade_expire_for(uuid) from public, anon, authenticated;
revoke all on function public.trade_propose(uuid,uuid,jsonb,jsonb,text), public.trade_respond(uuid,boolean),
  public.trade_cancel(uuid), public.trade_list(), public.trade_pending_count() from public, anon;
grant execute on function public.trade_propose(uuid,uuid,jsonb,jsonb,text), public.trade_respond(uuid,boolean),
  public.trade_cancel(uuid), public.trade_list(), public.trade_pending_count() to authenticated;
