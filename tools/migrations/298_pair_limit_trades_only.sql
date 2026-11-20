-- 298 — Les limites de don ne concernent plus que les échanges.
-- Le marché (achats, enchères) n'est plus bloqué et ne compte plus dans les limites.
-- Sur 14 jours, un joueur peut donner à un même joueur, par échange, au plus 1 spéciale, 3 mythiques, 15 légendaires.

create or replace function public.pair_given(p_from uuid, p_to uuid, p_rarity text, p_skip_listing uuid, p_skip_trade uuid)
returns integer language sql stable security definer set search_path to '' as $$
  select coalesce(sum(i.quantity),0)::integer from public.trades t join public.trade_items i on i.trade_id=t.id
   where t.id is distinct from p_skip_trade and i.rarity=p_rarity
     and ((t.from_user=p_from and t.to_user=p_to and i.side='give') or (t.from_user=p_to and t.to_user=p_from and i.side='want'))
     and ((t.state='pending' and t.expires_at>now()) or (t.state='accepted' and t.closed_at>now()-interval '14 days'))
$$;

-- Conservée (appelée par market_buy et auction_bid) mais sans effet : plus de limite sur le marché.
create or replace function public.market_pair_check(p_a uuid, p_b uuid, p_card text, p_skip uuid)
returns void language plpgsql stable security definer set search_path to '' as $function$
begin
 return;
end $function$;
