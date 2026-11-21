-- 301 — Améliorer les cartes rapporte de l'XP, et « Tout améliorer » en une seule fois.
-- • XP par amélioration (un niveau gagné), selon la rareté de la carte :
--   commune 1 · peu commune 2 · rare 4 · épique 6 · légendaire 10 · mythique 25 · spéciale 50.
-- • upgrade_card garde le même contrat et renvoie en plus "xp".
-- • upgrade_cards_bulk(request, cartes, niveau visé) : améliore chaque carte de la liste, niveau par niveau,
--   jusqu'au niveau visé ou jusqu'à manquer de doublons. Chaque niveau gagné compte comme une amélioration
--   (ligne dans card_upgrades, donc les quêtes « améliorer des cartes » avancent normalement).
-- Verrous : progression puis porte-monnaie (même ordre que les fins de partie).

create or replace function public.card_upgrade_xp(p_rarity text)
returns integer language sql immutable set search_path to '' as $$
  select case p_rarity when 'common' then 1 when 'uncommon' then 2 when 'rare' then 4 when 'epic' then 6
    when 'legendary' then 10 when 'mythic' then 25 when 'special' then 50 else 1 end
$$;

-- Une amélioration d'un niveau (sans idempotence ni verrou de compte : réservé aux fonctions ci-dessous).
-- Renvoie l'XP gagnée, ou null si les doublons manquent.
create or replace function public.card_upgrade_apply(p_user uuid, p_card text, p_from integer, p_request uuid)
returns integer language plpgsql security definer set search_path to '' as $function$
declare base integer; target integer; cost integer; xp integer;
begin
 cost:=case p_from when 0 then 2 when 1 then 2 else 4 end; -- au niveau 0, l'exemplaire amélioré vient aussi du niveau 0
 select quantity into base from public.player_cards where user_id=p_user and card_id=p_card and level=0 for update;
 if not found or base<cost then return null; end if;
 if p_from>0 then
  select quantity into target from public.player_cards where user_id=p_user and card_id=p_card and level=p_from for update;
  if not found then return null; end if;
  if target=1 then delete from public.player_cards where user_id=p_user and card_id=p_card and level=p_from;
  else update public.player_cards set quantity=quantity-1 where user_id=p_user and card_id=p_card and level=p_from; end if;
 end if;
 if base=cost then delete from public.player_cards where user_id=p_user and card_id=p_card and level=0;
 else update public.player_cards set quantity=quantity-cost where user_id=p_user and card_id=p_card and level=0; end if;
 insert into public.player_cards(user_id,card_id,level,quantity) values(p_user,p_card,p_from+1,1)
  on conflict(user_id,card_id,level) do update set quantity=public.player_cards.quantity+1;
 xp:=public.card_upgrade_xp(public.market_card_rarity(p_card));
 insert into public.card_upgrades(user_id,request_id,card_id,from_level,result)
  values(p_user,p_request,p_card,p_from,jsonb_build_object('card_id',p_card,'from_level',p_from,'to_level',p_from+1,'xp',xp));
 return xp;
end $function$;

create or replace function public.upgrade_card(p_request uuid, p_card text, p_from integer)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); old public.card_upgrades%rowtype; xp integer; result jsonb;
begin
 if who is null then raise exception 'not_authenticated';end if;
 if p_request is null or p_card is null or length(p_card) not between 1 and 128 or p_from is null or p_from not between 0 and 2 then raise exception 'invalid_request';end if;
 perform 1 from public.player_progress where user_id=who for update;
 perform 1 from public.player_wallets where user_id=who for update;
 if not found then raise exception 'account_missing';end if;
 select * into old from public.card_upgrades where user_id=who and request_id=p_request;
 if found then
  if old.card_id<>p_card or old.from_level<>p_from then raise exception 'request_conflict';end if;
  return old.result;
 end if;
 if p_from>0 and not exists(select 1 from public.player_cards where user_id=who and card_id=p_card and level=p_from) then raise exception 'card_unavailable'; end if;
 xp:=public.card_upgrade_apply(who,p_card,p_from,p_request);
 if xp is null then raise exception 'insufficient_duplicates'; end if;
 perform public.progress_add_xp(who,xp);
 select c.result into result from public.card_upgrades c where c.user_id=who and c.request_id=p_request;
 return result;
end $function$;

create table if not exists public.card_upgrade_batches (
  user_id uuid not null references public.player_accounts(user_id) on delete cascade,
  request_id uuid not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, request_id));
alter table public.card_upgrade_batches enable row level security;
revoke all on public.card_upgrade_batches from anon, authenticated;

create or replace function public.upgrade_cards_bulk(p_request uuid, p_cards jsonb, p_target integer)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); old jsonb; cid text; lv integer; got integer; xp_total integer:=0; steps integer:=0;
 touched integer:=0; first_lv integer; per jsonb:='[]'::jsonb; by_rarity jsonb:='{}'::jsonb; r text; result jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_request is null or p_target is null or p_target not between 1 and 3 or p_cards is null or jsonb_typeof(p_cards)<>'array'
    or jsonb_array_length(p_cards) not between 1 and 10000 then raise exception 'invalid_request'; end if;
 if exists(select 1 from jsonb_array_elements(p_cards) e where jsonb_typeof(e)<>'string' or length(e#>>'{}') not between 1 and 128)
  then raise exception 'invalid_request'; end if;
 perform 1 from public.player_progress where user_id=who for update;
 perform 1 from public.player_wallets where user_id=who for update;
 if not found then raise exception 'account_missing'; end if;
 select b.result into old from public.card_upgrade_batches b where b.user_id=who and b.request_id=p_request;
 if found then return old; end if;
 for cid in select distinct e#>>'{}' from jsonb_array_elements(p_cards) e order by 1 loop
  select max(level) into lv from public.player_cards where user_id=who and card_id=cid and quantity>0;
  if lv is null then continue; end if;
  first_lv:=lv;
  while lv<p_target loop
   got:=public.card_upgrade_apply(who,cid,lv,gen_random_uuid());
   exit when got is null;
   xp_total:=xp_total+got; steps:=steps+1; lv:=lv+1;
  end loop;
  if lv>first_lv then
   touched:=touched+1;
   r:=coalesce(public.market_card_rarity(cid),'common');
   by_rarity:=jsonb_set(by_rarity,array[r],to_jsonb(coalesce((by_rarity->>r)::integer,0)+1));
   if touched<=500 then per:=per||jsonb_build_array(jsonb_build_object('card',cid,'from',first_lv,'to',lv)); end if;
  end if;
 end loop;
 if xp_total>0 then perform public.progress_add_xp(who,xp_total); end if;
 result:=jsonb_build_object('request_id',p_request,'target',p_target,'cards',touched,'upgrades',steps,'xp',xp_total,
   'by_rarity',by_rarity,'details',per);
 insert into public.card_upgrade_batches(user_id,request_id,result) values(who,p_request,result);
 return result;
end $function$;

revoke all on function public.card_upgrade_apply(uuid,text,integer,uuid) from public, anon, authenticated;
revoke all on function public.card_upgrade_xp(text) from public, anon;
revoke all on function public.upgrade_card(uuid,text,integer), public.upgrade_cards_bulk(uuid,jsonb,integer) from public, anon;
grant execute on function public.upgrade_card(uuid,text,integer), public.upgrade_cards_bulk(uuid,jsonb,integer) to authenticated;
