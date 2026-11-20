-- b294 — Historique des prix du marché : médiane quotidienne des ventes d'une carte (lecture seule).
-- Prix de vente = prix fixe, ou enchère finale pour une vente aux enchères. Seules les ventes conclues comptent.
create or replace function public.market_price_history(p_card text, p_level integer default null, p_days integer default 30)
returns table(day date, median bigint, sales integer, low bigint, high bigint)
language sql stable security definer set search_path to ''
as $$
  select (l.closed_at at time zone 'UTC')::date as day,
         round(percentile_cont(0.5) within group (order by (case when l.kind = 'auction' then l.bid else l.price end)))::bigint as median,
         count(*)::integer as sales,
         min(case when l.kind = 'auction' then l.bid else l.price end)::bigint as low,
         max(case when l.kind = 'auction' then l.bid else l.price end)::bigint as high
  from public.market_listings l
  where l.state = 'sold' and l.card_id = p_card and l.closed_at is not null
    and (p_level is null or l.card_level = p_level)
    and l.closed_at > now() - make_interval(days => least(greatest(coalesce(p_days, 30), 1), 365))
  group by 1
  order by 1
$$;
revoke all on function public.market_price_history(text, integer, integer) from public, anon;
grant execute on function public.market_price_history(text, integer, integer) to authenticated;
