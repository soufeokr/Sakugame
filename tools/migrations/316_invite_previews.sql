-- 316 — Aperçus de lien personnalisés pour les invitations (https://soufeokr.github.io/Sakugame/i/CODE/).
-- Une page statique par code est générée par l'action GitHub « Invites » (tools/gen_invites.js).
-- Seuls les joueurs qui ont copié ou partagé leur lien d'invitation (shared_at) ont une page : leur pseudo
-- et leur photo de profil y apparaissent, puisqu'ils les envoient eux-mêmes avec l'invitation.
alter table public.referral_codes add column if not exists shared_at timestamptz;

create or replace function public.referral_mark_shared()
returns jsonb language plpgsql security definer set search_path to '' as $$
declare who uuid := auth.uid(); c text;
begin
  if who is null then raise exception 'not_authenticated'; end if;
  c := public.referral_ensure_code(who);
  update public.referral_codes set shared_at = coalesce(shared_at, now()) where user_id = who;
  return jsonb_build_object('code', c);
end $$;
revoke all on function public.referral_mark_shared() from public, anon;
grant execute on function public.referral_mark_shared() to authenticated;

create or replace function public.referral_invites_public()
returns jsonb language sql stable security definer set search_path to '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('code', c.code, 'name', coalesce(nullif(p.display_name, ''), 'Un joueur'),
           'avatar', public.player_avatar(c.user_id)) order by c.code), '[]'::jsonb)
  from public.referral_codes c
  left join public.player_public_profiles p on p.user_id = c.user_id
  where c.shared_at is not null
    and not exists (select 1 from public.player_bans b where b.user_id = c.user_id)
$$;
revoke all on function public.referral_invites_public() from public;
grant execute on function public.referral_invites_public() to anon, authenticated;
