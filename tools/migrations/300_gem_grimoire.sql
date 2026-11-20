-- 300 — Grimoire spécial : invocation avec une gemme d'invocation.
-- • Inventaire d'objets (player_items, même définition que la migration 283 du parrainage).
-- • Une gemme (item 'summon_gem') = un paquet de 10 cartes, tirées parmi TOUTES les cartes
--   épiques, légendaires, mythiques et spéciales du catalogue (tous portails confondus).
-- • Taux par carte : épique 50 %, légendaire 30 %, mythique 15 %, spéciale 5 %.
-- • Ce portail n'utilise ni les pièces, ni les tirages gratuits, ni les compteurs de garantie.

create table if not exists public.player_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item text not null,
  quantity integer not null default 0 check (quantity >= 0),
  primary key (user_id, item));
alter table public.player_items enable row level security;
revoke all on public.player_items from anon, authenticated;

-- Pool du grimoire spécial : cartes de rareté unique dans le catalogue, d'épique à spéciale.
create or replace function public.summon_gem_one(p_rarity text)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare n integer; card text;
begin
 select count(*) into n from (select card_id from public.summon_catalog where rarity=p_rarity
   and card_id not in (select card_id from public.summon_catalog group by card_id having count(distinct rarity)>1)
   group by card_id) s;
 if n=0 then raise exception 'catalog_incomplete'; end if;
 select card_id into card from (select card_id from public.summon_catalog where rarity=p_rarity
   and card_id not in (select card_id from public.summon_catalog group by card_id having count(distinct rarity)>1)
   group by card_id) s order by card_id offset public.summon_uniform(n) limit 1;
 return jsonb_build_object('id',card,'rarity',p_rarity);
end $function$;

create or replace function public.summon_gem(p_request uuid)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare
 who uuid:=auth.uid(); old_order public.summon_orders%rowtype; gems integer; wallet bigint;
 tiers text[]:=array['epic','legendary','mythic','special']; weights integer[]:=array[50,30,15,5];
 cards jsonb[]:=array[]::jsonb[]; k integer; i integer; v integer; tier text; x jsonb; result jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_request is null then raise exception 'invalid_request'; end if;
 select coins into wallet from public.player_wallets where user_id=who for update;
 if not found then raise exception 'account_missing'; end if;
 select * into old_order from public.summon_orders where user_id=who and request_id=p_request;
 if found then
  if old_order.portal<>'gem' then raise exception 'request_conflict'; end if;
  return old_order.result;
 end if;
 select quantity into gems from public.player_items where user_id=who and item='summon_gem' for update;
 if coalesce(gems,0)<1 then raise exception 'no_gem'; end if;
 for k in 1..10 loop
  v:=public.summon_uniform(100); tier:=null;
  for i in 1..4 loop
   v:=v-weights[i];
   if v<0 then tier:=tiers[i]; exit; end if;
  end loop;
  cards:=array_append(cards,public.summon_gem_one(tier));
 end loop;
 foreach x in array cards loop
  insert into public.player_cards(user_id,card_id,level,quantity) values(who,x->>'id',0,1)
   on conflict(user_id,card_id,level) do update set quantity=public.player_cards.quantity+1;
 end loop;
 update public.player_items set quantity=quantity-1 where user_id=who and item='summon_gem';
 result:=jsonb_build_object('request_id',p_request,'portal','gem','packs',jsonb_build_array(to_jsonb(cards)),
   'coins',wallet,'gems',gems-1,'free_used',0,'paid_count',0,'price',0);
 insert into public.summon_orders(user_id,request_id,portal,pack_count,result) values(who,p_request,'gem',1,result);
 return result;
end $function$;

-- Inventaire du joueur connecté : {"summon_gem": n, ...}
create or replace function public.player_inventory()
returns jsonb language sql stable security definer set search_path to '' as $$
  select coalesce(jsonb_object_agg(item,quantity),'{}'::jsonb) from public.player_items where user_id=auth.uid() and quantity>0
$$;

revoke all on function public.summon_gem_one(text) from public, anon, authenticated;
revoke all on function public.summon_gem(uuid), public.player_inventory() from public, anon;
grant execute on function public.summon_gem(uuid), public.player_inventory() to authenticated;
