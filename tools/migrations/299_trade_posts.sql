-- 299 — Bourse d'échanges du marché : annonces « Proposer » et « Chercher ».
-- • offer : un joueur met une carte (niveau précis) à l'échange ; les autres font des offres (leurs cartes) ;
--   l'auteur de l'annonce valide l'offre finale.
-- • seek  : un joueur cherche une carte ; ceux qui la possèdent la proposent contre des cartes de SA collection ;
--   l'auteur de l'annonce valide.
-- Chaque offre est un échange normal (trades) relié à l'annonce (post_id) : from_user = celui qui répond,
-- to_user = l'auteur de l'annonce, qui accepte avec trade_respond. Limites de don inchangées.

create table if not exists public.trade_posts(
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  owner uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('offer','seek')),
  card_id text not null check (char_length(card_id) between 1 and 128),
  level smallint check (level is null or level between 0 and 3),
  note text check (note is null or char_length(note)<=140),
  state text not null default 'open' check (state in ('open','done','closed')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now()+interval '14 days',
  closed_at timestamptz,
  unique(owner,request_id)
);
create index if not exists trade_posts_open_idx on public.trade_posts(kind,state,created_at desc);
create index if not exists trade_posts_owner_idx on public.trade_posts(owner,state);
alter table public.trade_posts enable row level security;
revoke all on public.trade_posts from anon, authenticated;

alter table public.trades add column if not exists post_id uuid references public.trade_posts(id) on delete set null;
create index if not exists trades_post_idx on public.trades(post_id) where post_id is not null;

create or replace function public.trade_post_create(p_request uuid, p_kind text, p_card text, p_level integer default null, p_note text default null)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); old public.trade_posts%rowtype; row_id uuid; note text; lvl integer;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_request is null or p_kind not in ('offer','seek') or p_card is null or length(p_card) not between 1 and 128 then raise exception 'invalid_request'; end if;
 perform 1 from public.player_wallets where user_id=who for update;
 if not found then raise exception 'account_missing'; end if;
 select * into old from public.trade_posts where owner=who and request_id=p_request;
 if found then return jsonb_build_object('id',old.id,'state',old.state); end if;
 if public.market_card_rarity(p_card) is null then raise exception 'catalog_invalid'; end if;
 if p_kind='offer' then
  lvl:=p_level;
  if lvl is null or lvl not between 0 and 3 then raise exception 'invalid_request'; end if;
  if exists(select 1 from public.player_card_options where user_id=who and card_id=p_card and locked) then raise exception 'card_locked'; end if;
  if not exists(select 1 from public.player_cards where user_id=who and card_id=p_card and level=lvl and quantity>0) then raise exception 'card_unavailable'; end if;
 else lvl:=null; end if;
 if (select count(*) from public.trade_posts where owner=who and kind=p_kind and state='open' and expires_at>now())>=10 then raise exception 'post_too_many'; end if;
 if exists(select 1 from public.trade_posts where owner=who and kind=p_kind and card_id=p_card and level is not distinct from lvl and state='open' and expires_at>now()) then raise exception 'post_duplicate'; end if;
 note:=nullif(btrim(coalesce(p_note,'')),''); if note is not null then note:=left(note,140); end if;
 insert into public.trade_posts(request_id,owner,kind,card_id,level,note) values(p_request,who,p_kind,p_card,lvl,note) returning id into row_id;
 return jsonb_build_object('id',row_id,'state','open');
end $function$;

-- Ferme une annonce et refuse les offres encore en attente (cartes réservées rendues).
create or replace function public.trade_post_close(p_post uuid)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); p public.trade_posts%rowtype; o record;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 select * into p from public.trade_posts where id=p_post for update;
 if not found or p.owner<>who then raise exception 'not_found'; end if;
 if p.state<>'open' then return jsonb_build_object('id',p.id,'state',p.state); end if;
 update public.trade_posts set state='closed',closed_at=now() where id=p.id;
 for o in select id from public.trades where post_id=p.id and state='pending' order by id for update loop
  perform public.trade_return_reserved(o.id);
  update public.trades set state='declined',closed_at=now() where id=o.id;
 end loop;
 return jsonb_build_object('id',p.id,'state','closed');
end $function$;

-- Annonces ouvertes (hors joueurs bloqués). Une offre « offer » disparaît si son auteur n'a plus la carte.
create or replace function public.trade_post_list(p_kind text)
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); res jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_kind not in ('offer','seek') then raise exception 'invalid_request'; end if;
 select coalesce(jsonb_agg(x order by (x->>'created_at') desc),'[]'::jsonb) into res from (
  select jsonb_build_object('id',tp.id,'kind',tp.kind,'card',tp.card_id,'level',tp.level,'note',tp.note,
    'rarity',public.market_card_rarity(tp.card_id),'owner',tp.owner,'owner_name',coalesce(pr.display_name,'Player'),
    'mine',tp.owner=who,'created_at',tp.created_at,'expires_at',tp.expires_at,
    'offers',(select count(*) from public.trades t where t.post_id=tp.id and t.state='pending' and t.expires_at>now()),
    'my_offer',exists(select 1 from public.trades t where t.post_id=tp.id and t.from_user=who and t.state='pending' and t.expires_at>now())) x
  from public.trade_posts tp
  left join public.player_public_profiles pr on pr.user_id=tp.owner
  where tp.kind=p_kind and tp.state='open' and tp.expires_at>now()
    and not exists(select 1 from public.social_relations s where s.kind='blocked' and ((s.owner=tp.owner and s.other=who) or (s.owner=who and s.other=tp.owner)))
    and (tp.kind='seek' or (exists(select 1 from public.player_cards pc where pc.user_id=tp.owner and pc.card_id=tp.card_id and pc.level=tp.level and pc.quantity>0)
         and not exists(select 1 from public.player_card_options o where o.user_id=tp.owner and o.card_id=tp.card_id and o.locked)))
  order by tp.created_at desc limit 300
 ) s;
 return res;
end $function$;

-- Répondre à une annonce.
--  offer : p_cards = cartes que je donne [{card,level,qty}] ; je reçois la carte de l'annonce (niveau exact).
--  seek  : je donne la carte cherchée (mon exemplaire de niveau p_level) ; p_cards = cartes que je demande
--          dans la collection de l'auteur [{card,qty}].
create or replace function public.trade_post_offer(p_request uuid, p_post uuid, p_cards jsonb, p_level integer default null, p_message text default null)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); p public.trade_posts%rowtype; r jsonb; tid uuid;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_request is null or p_post is null or p_cards is null or jsonb_typeof(p_cards)<>'array' then raise exception 'invalid_request'; end if;
 select * into p from public.trade_posts where id=p_post;
 if not found or p.state<>'open' or p.expires_at<=now() then raise exception 'post_closed'; end if;
 if p.owner=who then raise exception 'trade_self'; end if;
 if p.kind='offer' then
  if not exists(select 1 from public.player_cards where user_id=p.owner and card_id=p.card_id and level=p.level and quantity>0)
     or exists(select 1 from public.player_card_options where user_id=p.owner and card_id=p.card_id and locked) then raise exception 'post_closed'; end if;
  r:=public.trade_propose(p_request,p.owner,p_cards,jsonb_build_array(jsonb_build_object('card',p.card_id,'qty',1)),p_message);
  tid:=(r->>'id')::uuid;
  update public.trade_items set level=p.level where trade_id=tid and side='want' and card_id=p.card_id;
 else
  if p_level is null or p_level not between 0 and 3 then raise exception 'invalid_request'; end if;
  r:=public.trade_propose(p_request,p.owner,jsonb_build_array(jsonb_build_object('card',p.card_id,'level',p_level,'qty',1)),p_cards,p_message);
  tid:=(r->>'id')::uuid;
 end if;
 update public.trades set post_id=p.id where id=tid and post_id is null;
 return r;
end $function$;

-- trade_respond : cartes demandées à niveau précis (annonces « offer ») + clôture de l'annonce à l'acceptation.
create or replace function public.trade_respond(p_trade uuid, p_accept boolean)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); t public.trades%rowtype; i record; c record; o record; need integer; take integer;
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
 perform user_id from public.player_wallets where user_id in (t.from_user,t.to_user) order by user_id for update;
 -- Cartes demandées : niveau imposé s'il est fixé (annonce), sinon plus bas niveau d'abord.
 for i in select card_id,quantity,level from public.trade_items where trade_id=t.id and side='want' loop
  if exists(select 1 from public.player_card_options where user_id=who and card_id=i.card_id and locked) then raise exception 'trade_want_locked'; end if;
  need:=i.quantity;
  for c in select level,quantity from public.player_cards where user_id=who and card_id=i.card_id and quantity>0 and (i.level is null or level=i.level) order by level for update loop
   exit when need=0;
   take:=least(need,c.quantity);
   if take=c.quantity then delete from public.player_cards where user_id=who and card_id=i.card_id and level=c.level;
   else update public.player_cards set quantity=quantity-take where user_id=who and card_id=i.card_id and level=c.level; end if;
   insert into public.player_cards(user_id,card_id,level,quantity) values(t.from_user,i.card_id,c.level,take)
    on conflict(user_id,card_id,level) do update set quantity=public.player_cards.quantity+excluded.quantity;
   if i.level is null then update public.trade_items set level=c.level where trade_id=t.id and side='want' and card_id=i.card_id; end if;
   need:=need-take;
  end loop;
  if need>0 then raise exception 'trade_want_missing'; end if;
 end loop;
 for i in select card_id,level,quantity from public.trade_items where trade_id=t.id and side='give' loop
  insert into public.player_cards(user_id,card_id,level,quantity) values(who,i.card_id,i.level,i.quantity)
   on conflict(user_id,card_id,level) do update set quantity=public.player_cards.quantity+excluded.quantity;
 end loop;
 update public.trades set state='accepted',closed_at=now() where id=t.id;
 -- Annonce conclue : on la ferme et on refuse les autres offres en attente.
 if t.post_id is not null then
  update public.trade_posts set state='done',closed_at=now() where id=t.post_id and state='open';
  for o in select id from public.trades where post_id=t.post_id and state='pending' and id<>t.id order by id for update loop
   perform public.trade_return_reserved(o.id);
   update public.trades set state='declined',closed_at=now() where id=o.id;
  end loop;
 end if;
 return jsonb_build_object('id',t.id,'state','accepted');
end $function$;

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
   'post_id',t.post_id,'post_kind',tp.kind,
   'give',(select coalesce(jsonb_agg(jsonb_build_object('card',i.card_id,'level',i.level,'qty',i.quantity,'rarity',i.rarity)),'[]'::jsonb) from public.trade_items i where i.trade_id=t.id and i.side='give'),
   'want',(select coalesce(jsonb_agg(jsonb_build_object('card',i.card_id,'level',i.level,'qty',i.quantity,'rarity',i.rarity)),'[]'::jsonb) from public.trade_items i where i.trade_id=t.id and i.side='want')
  ) x
  from public.trades t
  left join public.player_public_profiles p on p.user_id=case when t.to_user=who then t.from_user else t.to_user end
  left join public.trade_posts tp on tp.id=t.post_id
  where (t.from_user=who or t.to_user=who)
    and (t.state='pending' or t.closed_at>now()-interval '30 days')
  order by t.created_at desc limit 80
 ) s;
 return res;
end $function$;

-- Mes annonces ouvertes (pour « Mes affaires »).
create or replace function public.trade_post_mine()
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); res jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',tp.id,'kind',tp.kind,'card',tp.card_id,'level',tp.level,'note',tp.note,
   'rarity',public.market_card_rarity(tp.card_id),'created_at',tp.created_at,'expires_at',tp.expires_at,
   'offers',(select count(*) from public.trades t where t.post_id=tp.id and t.state='pending' and t.expires_at>now())) order by tp.created_at desc),'[]'::jsonb) into res
 from public.trade_posts tp where tp.owner=who and tp.state='open' and tp.expires_at>now();
 return res;
end $function$;

revoke all on function public.trade_post_create(uuid,text,text,integer,text), public.trade_post_close(uuid), public.trade_post_list(text),
  public.trade_post_offer(uuid,uuid,jsonb,integer,text), public.trade_post_mine() from public, anon;
grant execute on function public.trade_post_create(uuid,text,text,integer,text), public.trade_post_close(uuid), public.trade_post_list(text),
  public.trade_post_offer(uuid,uuid,jsonb,integer,text), public.trade_post_mine() to authenticated;
