-- 302 — « Tout hypothéquer » : Sakugame rachète les doublons (hors marché) à 50 % de leur prix médian.
-- • Seuls les doublons de niveau 0 sont rachetés ; l'exemplaire du meilleur niveau reste toujours au joueur.
-- • Prix de base d'une carte = médiane des ventes de niveau 0 sur 30 jours, à condition qu'il y ait eu au moins
--   3 vendeurs ET 3 acheteurs différents (sinon une vente entre deux comptes complices suffirait à gonfler le prix).
--   À défaut : le prix minimum de la rareté sur le marché. Rachat = moitié du prix de base, arrondi en dessous, 1 pièce minimum.
-- • Les cartes verrouillées ne sont jamais rachetées ; les favoris peuvent être exclus.
-- • « Garder » : nombre de doublons conservés par carte (0..99), ou -1 = garder de quoi monter la carte au niveau 3.

create index if not exists market_listings_sold_card_idx on public.market_listings (card_id, closed_at) where state='sold';

create or replace function public.buyback_values(p_cards text[])
returns table(card_id text, base bigint, value bigint, source text, sales integer)
language sql stable security definer set search_path to '' as $$
  with ids as (select distinct unnest(p_cards) as cid),
  s as (
    select l.card_id cid,
           round(percentile_cont(0.5) within group (order by case when l.kind='auction' then l.bid else l.price end))::bigint med,
           count(*)::integer n, count(distinct l.seller) sellers, count(distinct l.buyer) buyers
      from public.market_listings l
     where l.state='sold' and l.card_level=0 and l.closed_at>now()-interval '30 days' and l.card_id in (select cid from ids)
     group by l.card_id)
  select i.cid,
         b.base,
         greatest(1, b.base/2),
         b.src,
         coalesce(s.n,0)
    from ids i left join s on s.cid=i.cid
    cross join lateral (select case when s.med is not null and s.sellers>=3 and s.buyers>=3 then s.med
                                    else public.market_min_price(public.market_card_rarity(i.cid)) end as base,
                               case when s.med is not null and s.sellers>=3 and s.buyers>=3 then 'median' else 'min' end as src) b
   where b.base is not null
$$;

-- Prix de rachat pour l'aperçu (cartes du joueur connecté).
create or replace function public.buyback_quote(p_cards jsonb)
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); ids text[];
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_cards is null or jsonb_typeof(p_cards)<>'array' or jsonb_array_length(p_cards)>10000 then raise exception 'invalid_request'; end if;
 select array_agg(left(e#>>'{}',128)) into ids from jsonb_array_elements(p_cards) e where jsonb_typeof(e)='string';
 return coalesce((select jsonb_agg(jsonb_build_object('card',v.card_id,'value',v.value,'base',v.base,'source',v.source,'sales',v.sales))
   from public.buyback_values(coalesce(ids,array[]::text[])) v),'[]'::jsonb);
end $function$;

create table if not exists public.buyback_orders (
  user_id uuid not null references public.player_accounts(user_id) on delete cascade,
  request_id uuid not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, request_id));
alter table public.buyback_orders enable row level security;
revoke all on public.buyback_orders from anon, authenticated;

create or replace function public.buyback_sell(p_request uuid, p_cards jsonb, p_keep integer, p_skip_favorites boolean)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); old jsonb; ids text[]; r record; best integer; base_qty integer; keep integer; sell integer;
 total bigint:=0; sold integer:=0; touched integer:=0; per jsonb:='[]'::jsonb; by_rarity jsonb:='{}'::jsonb; rar text; wallet bigint; result jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_request is null or p_keep is null or p_keep not between -1 and 99 or p_cards is null or jsonb_typeof(p_cards)<>'array'
    or jsonb_array_length(p_cards) not between 1 and 10000 then raise exception 'invalid_request'; end if;
 if exists(select 1 from jsonb_array_elements(p_cards) e where jsonb_typeof(e)<>'string' or length(e#>>'{}') not between 1 and 128)
  then raise exception 'invalid_request'; end if;
 select coins into wallet from public.player_wallets where user_id=who for update;
 if not found then raise exception 'account_missing'; end if;
 select b.result into old from public.buyback_orders b where b.user_id=who and b.request_id=p_request;
 if found then return old; end if;
 select array_agg(distinct e#>>'{}') into ids from jsonb_array_elements(p_cards) e;
 for r in select v.card_id, v.value from public.buyback_values(ids) v order by v.card_id loop
  if exists(select 1 from public.player_card_options o where o.user_id=who and o.card_id=r.card_id and (o.locked or (coalesce(p_skip_favorites,false) and o.favorite))) then continue; end if;
  select max(level) into best from public.player_cards where user_id=who and card_id=r.card_id and quantity>0;
  if best is null then continue; end if;
  select quantity into base_qty from public.player_cards where user_id=who and card_id=r.card_id and level=0 for update;
  if not found then continue; end if;
  keep:=case when p_keep>=0 then p_keep else case best when 0 then 7 when 1 then 6 when 2 then 4 else 0 end end;
  sell:=base_qty-(case when best=0 then 1 else 0 end)-keep;
  if sell<=0 then continue; end if;
  if sell=base_qty then delete from public.player_cards where user_id=who and card_id=r.card_id and level=0;
  else update public.player_cards set quantity=quantity-sell where user_id=who and card_id=r.card_id and level=0; end if;
  total:=total+sell*r.value; sold:=sold+sell; touched:=touched+1;
  rar:=coalesce(public.market_card_rarity(r.card_id),'common');
  by_rarity:=jsonb_set(by_rarity,array[rar],to_jsonb(coalesce((by_rarity->>rar)::integer,0)+sell));
  if touched<=500 then per:=per||jsonb_build_array(jsonb_build_object('card',r.card_id,'qty',sell,'value',r.value)); end if;
 end loop;
 if total>0 then update public.player_wallets set coins=coins+total where user_id=who returning coins into wallet; end if;
 result:=jsonb_build_object('request_id',p_request,'cards',touched,'copies',sold,'coins_gained',total,'coins',wallet,
   'keep',p_keep,'by_rarity',by_rarity,'details',per);
 insert into public.buyback_orders(user_id,request_id,result) values(who,p_request,result);
 return result;
end $function$;

revoke all on function public.buyback_values(text[]) from public, anon, authenticated;
revoke all on function public.buyback_quote(jsonb), public.buyback_sell(uuid,jsonb,integer,boolean) from public, anon;
grant execute on function public.buyback_quote(jsonb), public.buyback_sell(uuid,jsonb,integer,boolean) to authenticated;

-- Accélère market_card_rarity (et donc l'aperçu du rachat).
create index if not exists summon_catalog_card_idx on public.summon_catalog (card_id, rarity);
