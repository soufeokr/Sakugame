-- 305 — Vue d'administration : pseudo Discord de tous les comptes (toujours à jour).
-- Visible dans le tableau de bord Supabase (Table Editor > admin_discord_accounts).
-- Inaccessible depuis le site : aucun droit pour anon / authenticated, et security_invoker
-- (les visiteurs n'ont de toute façon pas accès à auth.users). Les e-mails ne sont pas repris.
create or replace view public.admin_discord_accounts with (security_invoker = true) as
select u.id as user_id,
       u.raw_user_meta_data->>'full_name' as discord_pseudo,
       u.raw_user_meta_data->'custom_claims'->>'global_name' as discord_nom_affiche,
       u.raw_user_meta_data->>'provider_id' as discord_id,
       p.display_name as pseudo_sakugame,
       u.created_at as inscrit_le,
       u.last_sign_in_at as derniere_connexion,
       (b.user_id is not null) as banni
  from auth.users u
  left join public.player_public_profiles p on p.user_id = u.id
  left join public.player_bans b on b.user_id = u.id
 order by u.created_at;
revoke all on public.admin_discord_accounts from public, anon, authenticated;
