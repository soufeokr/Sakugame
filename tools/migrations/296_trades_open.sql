-- 296 — Échanges : demande parmi toute la collection, plus de limite de cartes, estimation par médiane.
-- • Plus de limite « 5 cartes par côté » ni « 5 exemplaires » (garde-fou technique : 500 lignes, 100 000 ex.).
-- • On peut demander n'importe quelle carte non verrouillée que l'autre joueur possède (trade_collection).
-- • market_card_values : valeur estimée d'une carte = médiane des ventes des 30 derniers jours
--   (au niveau demandé si des ventes existent, sinon tous niveaux), sinon prix minimum de sa rareté.
-- Les limites par paire sur 14 jours (1 spéciale, 3 mythiques, 15 légendaires) restent inchangées.

alter table public.trade_items drop constraint if exists trade_items_quantity_check;
alter table public.trade_items add constraint trade_items_quantity_check check (quantity between 1 and 100000);

-- Collection échangeable d'un joueur (cartes non verrouillées), pour composer une demande.
create or replace function public.trade_collection(p_owner uuid)
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); res jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_owner is null or p_owner=who then raise exception 'trade_self'; end if;
 if not exists(select 1 from public.player_public_profiles where user_id=p_owner) then raise exception 'unavailable'; end if;
 if exists(select 1 from public.social_relations where kind='blocked' and ((owner=p_owner and other=who) or (owner=who and other=p_owner))) then raise exception 'unavailable'; end if;
 select coalesce(jsonb_agg(jsonb_build_object('id',c.card_id,'qty',c.qty,'level',c.lvl,'rarity',public.market_card_rarity(c.card_id)) order by c.card_id),'[]'::jsonb) into res
 from (select pc.card_id, sum(pc.quantity)::integer qty, min(pc.level)::integer lvl from public.player_cards pc
       where pc.user_id=p_owner and pc.quantity>0
         and not exists(select 1 from public.player_card_options o where o.user_id=p_owner and o.card_id=pc.card_id and o.locked)
       group by pc.card_id) c;
 return res;
end $function$;

-- Valeur estimée de cartes : [{card, level|null}] → [{card, level, value, sales, source}]
create or replace function public.market_card_values(p_items jsonb)
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare res jsonb:='[]'::jsonb; it jsonb; cid text; lvl integer; med bigint; n integer; src text; rar text;
begin
 if auth.uid() is null then raise exception 'not_authenticated'; end if;
 if p_items is null or jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)>600 then raise exception 'invalid_request'; end if;
 for it in select * from jsonb_array_elements(p_items) loop
  cid:=left(it->>'card',128); lvl:=case when it ? 'level' and jsonb_typeof(it->'level')='number' then (it->>'level')::integer end;
  if cid is null then continue; end if;
  med:=null; n:=0; src:='min';
  if lvl is not null then
   select round(percentile_cont(0.5) within group (order by case when l.kind='auction' then l.bid else l.price end))::bigint, count(*)
     into med,n from public.market_listings l
    where l.state='sold' and l.card_id=cid and l.card_level=lvl and l.closed_at>now()-interval '30 days';
  end if;
  if med is null then
   select round(percentile_cont(0.5) within group (order by case when l.kind='auction' then l.bid else l.price end))::bigint, count(*)
     into med,n from public.market_listings l
    where l.state='sold' and l.card_id=cid and l.closed_at>now()-interval '30 days';
  end if;
  if med is not null then src:='median';
  else rar:=public.market_card_rarity(cid); med:=public.market_min_price(rar); n:=0; end if;
  res:=res||jsonb_build_array(jsonb_build_object('card',cid,'level',lvl,'value',coalesce(med,0),'sales',coalesce(n,0),'source',src));
 end loop;
 return res;
end $function$;

create or replace function public.trade_propose(p_request uuid, p_to uuid, p_give jsonb, p_want jsonb, p_message text default null)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); old public.trades%rowtype; row_id uuid; it jsonb; cid text; lvl integer; qty integer; rar text; have integer; msg text;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_request is null or p_to is null or jsonb_typeof(p_give)<>'array' or jsonb_typeof(p_want)<>'array' then raise exception 'invalid_request'; end if;
 if p_to=who then raise exception 'trade_self'; end if;
 -- Sérialise les propositions d'un même joueur (et les requêtes rejouées).
 perform 1 from public.player_wallets where user_id=who for update;
 if not found then raise exception 'account_missing'; end if;
 select * into old from public.trades where from_user=who and request_id=p_request;
 if found then return jsonb_build_object('id',old.id,'state',old.state); end if;
 -- Au moins une carte de chaque côté ; 500 lignes max (garde-fou technique, pas une règle de jeu).
 if jsonb_array_length(p_give) not between 1 and 500 or jsonb_array_length(p_want) not between 1 and 500 then raise exception 'trade_size'; end if;
 if not exists(select 1 from public.player_public_profiles where user_id=p_to) then raise exception 'unavailable'; end if;
 if exists(select 1 from public.social_relations where kind='blocked' and ((owner=p_to and other=who) or (owner=who and other=p_to))) then raise exception 'unavailable'; end if;
 if (select count(*) from public.trades where from_user=who and state='pending' and expires_at>now())>=10 then raise exception 'trade_too_many'; end if;
 if (select count(*) from public.trades where from_user=who and to_user=p_to and state='pending' and expires_at>now())>=3 then raise exception 'trade_too_many'; end if;
 msg:=nullif(btrim(coalesce(p_message,'')),'');
 if msg is not null then msg:=left(msg,200); end if;

 insert into public.trades(request_id,from_user,to_user,message) values(p_request,who,p_to,msg) returning id into row_id;

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
  -- Demande possible parmi toute la collection : le joueur doit posséder assez d'exemplaires non verrouillés.
  if exists(select 1 from public.player_card_options where user_id=p_to and card_id=cid and locked)
     or coalesce((select sum(quantity) from public.player_cards where user_id=p_to and card_id=cid),0)<qty then
   raise exception 'trade_want_unavailable';
  end if;
  insert into public.trade_items(trade_id,side,card_id,level,quantity,rarity) values(row_id,'want',cid,null,qty,rar);
 end loop;

 if exists(select 1 from public.trade_items where trade_id=row_id and side='want' group by card_id having count(*)>1) then raise exception 'invalid_request'; end if;
 perform public.trade_pair_fits(row_id,who,p_to);
 return jsonb_build_object('id',row_id,'state','pending');
end $function$;

revoke all on function public.trade_collection(uuid), public.market_card_values(jsonb) from public, anon;
grant execute on function public.trade_collection(uuid), public.market_card_values(jsonb) to authenticated;
