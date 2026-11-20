-- 297 — Limites par paire DIRECTIONNELLES (limite de don).
-- Sur 14 jours, un joueur A peut DONNER à un même joueur B au plus 1 spéciale, 3 mythiques, 15 légendaires.
-- Ce que B donne à A est compté à part (sa propre limite de don envers A).
-- « Donner » = vente sur le marché (vendeur → acheteur, enchère en cours comprise) ou carte cédée dans un échange
-- (accepté sur 14 jours, ou en attente).

create or replace function public.pair_given(p_from uuid, p_to uuid, p_rarity text, p_skip_listing uuid, p_skip_trade uuid)
returns integer language sql stable security definer set search_path to '' as $$
  select (
    select count(*)::integer from public.market_listings l
     where l.id is distinct from p_skip_listing and l.seller=p_from and public.market_card_rarity(l.card_id)=p_rarity
       and ((l.state='sold' and l.buyer=p_to and l.closed_at>now()-interval '14 days')
         or (l.state='active' and l.kind='auction' and l.bidder=p_to))
  ) + (
    select coalesce(sum(i.quantity),0)::integer from public.trades t join public.trade_items i on i.trade_id=t.id
     where t.id is distinct from p_skip_trade and i.rarity=p_rarity
       and ((t.from_user=p_from and t.to_user=p_to and i.side='give') or (t.from_user=p_to and t.to_user=p_from and i.side='want'))
       and ((t.state='pending' and t.expires_at>now()) or (t.state='accepted' and t.closed_at>now()-interval '14 days'))
  )
$$;

-- Marché : p_a = acheteur/enchérisseur (reçoit), p_b = vendeur (donne).
create or replace function public.market_pair_check(p_a uuid, p_b uuid, p_card text, p_skip uuid)
returns void language plpgsql stable security definer set search_path to '' as $function$
declare r text:=public.market_card_rarity(p_card); lim integer:=public.market_pair_limit(r);
begin
 if lim is null or p_a is null or p_b is null then return; end if;
 if public.pair_given(p_b,p_a,r,p_skip,null)>=lim then raise exception 'pair_limit'; end if;
end $function$;

-- Échange : p_a = auteur (donne les cartes « give »), p_b = destinataire (donne les cartes « want »).
create or replace function public.trade_pair_fits(p_trade uuid, p_a uuid, p_b uuid)
returns void language plpgsql stable security definer set search_path to '' as $function$
declare r record; lim integer;
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
end $function$;

-- Ce qui a déjà été donné entre moi et un autre joueur sur 14 jours (pour l'aperçu des limites).
create or replace function public.trade_pair_usage(p_other uuid)
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid();
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_other is null or p_other=who then raise exception 'trade_self'; end if;
 return jsonb_build_object(
  'out',jsonb_build_object('special',public.pair_given(who,p_other,'special',null,null),'mythic',public.pair_given(who,p_other,'mythic',null,null),'legendary',public.pair_given(who,p_other,'legendary',null,null)),
  'in', jsonb_build_object('special',public.pair_given(p_other,who,'special',null,null),'mythic',public.pair_given(p_other,who,'mythic',null,null),'legendary',public.pair_given(p_other,who,'legendary',null,null)));
end $function$;

drop function if exists public.trade_pair_used(uuid,uuid,text,uuid);
revoke all on function public.pair_given(uuid,uuid,text,uuid,uuid) from public, anon, authenticated;
revoke all on function public.trade_pair_usage(uuid) from public, anon;
grant execute on function public.trade_pair_usage(uuid) to authenticated;
