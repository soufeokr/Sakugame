-- b328 — Chargement du compte en un seul aller-retour.
-- Renvoie solde, cartes, options de cartes, profil, progression et tirages gratuits.
-- Les parties facultatives (progression, tirages) n'empêchent pas le reste si elles échouent.
create or replace function public.account_bootstrap()
returns jsonb
language plpgsql
security definer
set search_path to ''
as $$
declare
  who uuid := auth.uid();
  out jsonb;
begin
  if who is null then raise exception 'not_authenticated'; end if;
  out := jsonb_build_object(
    'uid', who,
    'coins', (select w.coins from public.player_wallets w where w.user_id = who),
    'cards', coalesce((select jsonb_agg(jsonb_build_object('card_id', c.card_id, 'level', c.level, 'quantity', c.quantity) order by c.card_id, c.level)
                       from public.player_cards c where c.user_id = who), '[]'::jsonb),
    'options', coalesce((select jsonb_agg(jsonb_build_object('card_id', o.card_id, 'wishlist', o.wishlist, 'favorite', o.favorite, 'locked', o.locked) order by o.card_id)
                         from public.player_card_options o where o.user_id = who), '[]'::jsonb),
    'profile', coalesce((select p.data from public.player_profile_data p where p.user_id = who), '{}'::jsonb)
  );
  begin
    out := out || jsonb_build_object('progress', public.progress_get());
  exception when others then null;
  end;
  begin
    out := out || jsonb_build_object('free', public.get_free_draw_status(who));
  exception when others then null;
  end;
  return out;
end $$;

revoke all on function public.account_bootstrap() from public;
revoke all on function public.account_bootstrap() from anon;
grant execute on function public.account_bootstrap() to authenticated;
