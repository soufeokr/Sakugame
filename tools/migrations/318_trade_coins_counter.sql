-- 318 — Échanges : pièces dans les propositions et contre-propositions.
-- • trades.give_coins : pièces que l'auteur donne (réservées dès l'envoi, comme ses cartes) ;
--   trades.want_coins : pièces qu'il demande (prises au destinataire quand il accepte).
--   Une proposition contient au moins une carte, et des pièces d'un seul côté.
-- • Limite de pièces entre deux joueurs : 50 000 par sens sur 14 jours (échanges acceptés + en attente),
--   comme les limites de cartes rares, pour éviter de vider des comptes secondaires vers un compte principal.
-- • trade_counter : le destinataire remplace une proposition reçue par la sienne (la première est close
--   « countered », ses cartes et pièces réservées sont rendues), dans la même transaction.

alter table public.trades add column if not exists give_coins bigint not null default 0;
alter table public.trades add column if not exists want_coins bigint not null default 0;
alter table public.trades add column if not exists counter_of uuid references public.trades(id) on delete set null;
do $$ begin
  alter table public.trades add constraint trades_coins_check check (give_coins >= 0 and want_coins >= 0 and give_coins <= 100000 and want_coins <= 100000);
exception when duplicate_object then null; end $$;
alter table public.trades drop constraint if exists trades_state_check;
alter table public.trades add constraint trades_state_check check (state = any (array['pending','accepted','declined','cancelled','expired','countered']));

create or replace function public.trade_coin_limit() returns bigint language sql immutable set search_path to '' as $$ select 50000::bigint $$;

-- pièces passées de p_from à p_to sur 14 jours (acceptées) ou en attente
create or replace function public.pair_coins_given(p_from uuid, p_to uuid, p_skip_trade uuid)
returns bigint language sql stable security definer set search_path to '' as $$
  select coalesce(sum(case when t.from_user = p_from then t.give_coins else t.want_coins end), 0)::bigint
    from public.trades t
   where t.id is distinct from p_skip_trade
     and ((t.from_user = p_from and t.to_user = p_to) or (t.from_user = p_to and t.to_user = p_from))
     and ((t.state = 'pending' and t.expires_at > now()) or (t.state = 'accepted' and t.closed_at > now() - interval '14 days'))
$$;

create or replace function public.trade_pair_fits(p_trade uuid, p_a uuid, p_b uuid)
returns void language plpgsql security definer set search_path to '' as $$
declare r record; lim integer; t public.trades%rowtype;
begin
 for r in select i.rarity,
                 coalesce(sum(i.quantity) filter (where i.side='give'),0)::integer g,
                 coalesce(sum(i.quantity) filter (where i.side='want'),0)::integer w
            from public.trade_items i where i.trade_id=p_trade group by i.rarity loop
  lim:=public.market_pair_limit(r.rarity);
  if lim is null then continue; end if;
  if r.g>0 and public.pair_given(p_a,p_b,r.rarity,null,p_trade)+r.g>lim then raise exception 'pair_limit'; end if;
  if r.w>0 and public.pair_given(p_b,p_a,r.rarity,null,p_trade)+r.w>lim then raise exception 'pair_limit_in'; end if;
 end loop;
 select * into t from public.trades where id=p_trade;
 if t.give_coins>0 and public.pair_coins_given(p_a,p_b,p_trade)+t.give_coins>public.trade_coin_limit() then raise exception 'pair_limit_coins'; end if;
 if t.want_coins>0 and public.pair_coins_given(p_b,p_a,p_trade)+t.want_coins>public.trade_coin_limit() then raise exception 'pair_limit_coins_in'; end if;
end $$;

create or replace function public.trade_return_reserved(p_trade uuid)
returns void language plpgsql security definer set search_path to '' as $$
declare t public.trades%rowtype; i record;
begin
 select * into t from public.trades where id=p_trade;
 for i in select card_id,level,quantity from public.trade_items where trade_id=p_trade and side='give' loop
  insert into public.player_cards(user_id,card_id,level,quantity) values(t.from_user,i.card_id,i.level,i.quantity)
   on conflict(user_id,card_id,level) do update set quantity=public.player_cards.quantity+excluded.quantity;
 end loop;
 if t.give_coins>0 then update public.player_wallets set coins=coins+t.give_coins where user_id=t.from_user; end if;
end $$;

drop function if exists public.trade_propose(uuid, uuid, jsonb, jsonb, text);
create or replace function public.trade_propose(p_request uuid, p_to uuid, p_give jsonb, p_want jsonb, p_message text,
  p_give_coins bigint default 0, p_want_coins bigint default 0)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare who uuid:=auth.uid(); old public.trades%rowtype; row_id uuid; it jsonb; cid text; lvl integer; qty integer; rar text; have integer; msg text;
        gc bigint:=coalesce(p_give_coins,0); wc bigint:=coalesce(p_want_coins,0); wallet bigint;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_request is null or p_to is null or jsonb_typeof(p_give)<>'array' or jsonb_typeof(p_want)<>'array' then raise exception 'invalid_request'; end if;
 if p_to=who then raise exception 'trade_self'; end if;
 if gc<0 or wc<0 or gc>100000 or wc>100000 or (gc>0 and wc>0) then raise exception 'trade_coins_invalid'; end if;
 select coins into wallet from public.player_wallets where user_id=who for update;
 if not found then raise exception 'account_missing'; end if;
 select * into old from public.trades where from_user=who and request_id=p_request;
 if found then return jsonb_build_object('id',old.id,'state',old.state); end if;
 if jsonb_array_length(p_give)>500 or jsonb_array_length(p_want)>500
    or (jsonb_array_length(p_give)=0 and gc=0) or (jsonb_array_length(p_want)=0 and wc=0)
    or jsonb_array_length(p_give)+jsonb_array_length(p_want)=0 then raise exception 'trade_size'; end if;
 if gc>wallet then raise exception 'insufficient_coins'; end if;
 if not exists(select 1 from public.player_public_profiles where user_id=p_to) then raise exception 'unavailable'; end if;
 if exists(select 1 from public.social_relations where kind='blocked' and ((owner=p_to and other=who) or (owner=who and other=p_to))) then raise exception 'unavailable'; end if;
 if (select count(*) from public.trades where from_user=who and state='pending' and expires_at>now())>=10 then raise exception 'trade_too_many'; end if;
 if (select count(*) from public.trades where from_user=who and to_user=p_to and state='pending' and expires_at>now())>=3 then raise exception 'trade_too_many'; end if;
 if wc>0 and coalesce((select coins from public.player_wallets where user_id=p_to),0)<wc then raise exception 'trade_want_coins'; end if;
 msg:=nullif(btrim(coalesce(p_message,'')),'');
 if msg is not null then msg:=left(msg,200); end if;

 insert into public.trades(request_id,from_user,to_user,message,give_coins,want_coins) values(p_request,who,p_to,msg,gc,wc) returning id into row_id;
 if gc>0 then update public.player_wallets set coins=coins-gc where user_id=who; end if;

 for it in select * from jsonb_array_elements(p_give) loop
  cid:=it->>'card'; lvl:=coalesce((it->>'level')::integer,-1); qty:=coalesce((it->>'qty')::integer,1);
  if cid is null or length(cid) not between 1 and 128 or lvl not between 0 and 3 or qty not between 1 and 100000 then raise exception 'invalid_request'; end if;
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
  if cid is null or length(cid) not between 1 and 128 or qty not between 1 and 100000 then raise exception 'invalid_request'; end if;
  rar:=public.market_card_rarity(cid); if rar is null then raise exception 'catalog_invalid'; end if;
  if exists(select 1 from public.player_card_options where user_id=p_to and card_id=cid and locked)
     or coalesce((select sum(quantity) from public.player_cards where user_id=p_to and card_id=cid),0)<qty then
   raise exception 'trade_want_unavailable';
  end if;
  insert into public.trade_items(trade_id,side,card_id,level,quantity,rarity) values(row_id,'want',cid,null,qty,rar);
 end loop;

 if exists(select 1 from public.trade_items where trade_id=row_id and side='want' group by card_id having count(*)>1) then raise exception 'invalid_request'; end if;
 perform public.trade_pair_fits(row_id,who,p_to);
 return jsonb_build_object('id',row_id,'state','pending');
end $$;
revoke all on function public.trade_propose(uuid,uuid,jsonb,jsonb,text,bigint,bigint) from public, anon;
grant execute on function public.trade_propose(uuid,uuid,jsonb,jsonb,text,bigint,bigint) to authenticated;

revoke all on function public.trade_coin_limit(), public.pair_coins_given(uuid,uuid,uuid), public.trade_pair_fits(uuid,uuid,uuid), public.trade_return_reserved(uuid) from public, anon, authenticated;

-- acceptation : les pièces demandées passent du destinataire à l'auteur, les pièces offertes (réservées) au destinataire
do $$ declare d text; begin
  d := pg_get_functiondef('public.trade_respond(uuid,boolean)'::regprocedure);
  if position('want_coins' in d) = 0 then
    if position(' for i in select card_id,level,quantity from public.trade_items where trade_id=t.id and side=''give'' loop' in d) = 0 then raise exception 'patch respond'; end if;
    d := replace(d, ' for i in select card_id,level,quantity from public.trade_items where trade_id=t.id and side=''give'' loop',
      ' if t.want_coins>0 then
  if coalesce((select coins from public.player_wallets where user_id=who),0)<t.want_coins then raise exception ''insufficient_coins''; end if;
  update public.player_wallets set coins=coins-t.want_coins where user_id=who;
  update public.player_wallets set coins=coins+t.want_coins where user_id=t.from_user;
 end if;
 if t.give_coins>0 then update public.player_wallets set coins=coins+t.give_coins where user_id=who; end if;
 for i in select card_id,level,quantity from public.trade_items where trade_id=t.id and side=''give'' loop');
    execute d;
  end if;
end $$;

create or replace function public.trade_counter(p_trade uuid, p_request uuid, p_give jsonb, p_want jsonb, p_message text,
  p_give_coins bigint default 0, p_want_coins bigint default 0)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare who uuid:=auth.uid(); t public.trades%rowtype; r jsonb; nid uuid; old public.trades%rowtype;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_trade is null or p_request is null then raise exception 'invalid_request'; end if;
 -- même requête rejouée : on renvoie la contre-proposition déjà créée
 select * into old from public.trades where from_user=who and request_id=p_request;
 if found then return jsonb_build_object('id',old.id,'state',old.state); end if;
 select * into t from public.trades where id=p_trade for update;
 if not found or t.to_user<>who then raise exception 'not_found'; end if;
 if t.state<>'pending' then raise exception 'trade_closed'; end if;
 if t.expires_at<=now() then
  perform public.trade_return_reserved(t.id);
  update public.trades set state='expired',closed_at=now() where id=t.id;
  raise exception 'trade_closed';
 end if;
 perform public.trade_return_reserved(t.id);
 update public.trades set state='countered',closed_at=now() where id=t.id;
 r := public.trade_propose(p_request, t.from_user, p_give, p_want, p_message, p_give_coins, p_want_coins);
 nid := (r->>'id')::uuid;
 update public.trades set counter_of=t.id, post_id=coalesce(post_id,t.post_id) where id=nid;
 return r || jsonb_build_object('countered', t.id);
end $$;
revoke all on function public.trade_counter(uuid,uuid,jsonb,jsonb,text,bigint,bigint) from public, anon;
grant execute on function public.trade_counter(uuid,uuid,jsonb,jsonb,text,bigint,bigint) to authenticated;

-- liste : pièces, contre-propositions
do $$ declare d text; begin
  d := pg_get_functiondef('public.trade_list()'::regprocedure);
  if position('give_coins' in d) = 0 then
    if position('''post_id'',t.post_id,''post_kind'',tp.kind,' in d) = 0 then raise exception 'patch list'; end if;
    execute replace(d, '''post_id'',t.post_id,''post_kind'',tp.kind,', '''post_id'',t.post_id,''post_kind'',tp.kind,''give_coins'',t.give_coins,''want_coins'',t.want_coins,''counter_of'',t.counter_of,');
  end if;
end $$;

-- limites affichées dans le compositeur : pièces en plus ; p_skip = proposition remplacée par une contre-proposition
drop function if exists public.trade_pair_usage(uuid);
create or replace function public.trade_pair_usage(p_other uuid, p_skip uuid default null)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare who uuid:=auth.uid();
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_other is null or p_other=who then raise exception 'trade_self'; end if;
 return jsonb_build_object(
  'out',jsonb_build_object('special',public.pair_given(who,p_other,'special',null,p_skip),'mythic',public.pair_given(who,p_other,'mythic',null,p_skip),'legendary',public.pair_given(who,p_other,'legendary',null,p_skip),'coins',public.pair_coins_given(who,p_other,p_skip)),
  'in', jsonb_build_object('special',public.pair_given(p_other,who,'special',null,p_skip),'mythic',public.pair_given(p_other,who,'mythic',null,p_skip),'legendary',public.pair_given(p_other,who,'legendary',null,p_skip),'coins',public.pair_coins_given(p_other,who,p_skip)),
  'coin_limit',public.trade_coin_limit());
end $$;
revoke all on function public.trade_pair_usage(uuid,uuid) from public, anon;
grant execute on function public.trade_pair_usage(uuid,uuid) to authenticated;
