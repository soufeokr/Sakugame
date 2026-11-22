-- 308 — Portails temporaires : date de fin par portail, achats refusés après la fin.
-- Basic est permanent (pas de ligne). Fins (heure de Paris, fin de journée) :
--   Cinéma 07/12/2026 · The Strongest 14/12/2026 · Retro 21/12/2026.
-- • portal_schedule_get() : { portal: date de fin } pour l'affichage des compte à rebours (lisible sans compte).
-- • summon_buy refuse l'achat d'un portail terminé ('portal_closed'). Une commande déjà passée reste rejouable.

create table if not exists public.portal_schedule (
  portal text primary key,
  ends_at timestamptz not null);
alter table public.portal_schedule enable row level security;
revoke all on public.portal_schedule from anon, authenticated;

insert into public.portal_schedule(portal, ends_at) values
  ('cinema',    timestamp '2026-12-07 23:59:59' at time zone 'Europe/Paris'),
  ('strongest', timestamp '2026-12-14 23:59:59' at time zone 'Europe/Paris'),
  ('retro',     timestamp '2026-12-21 23:59:59' at time zone 'Europe/Paris')
on conflict (portal) do update set ends_at = excluded.ends_at;

create or replace function public.portal_schedule_get()
returns jsonb language sql stable security definer set search_path to '' as $$
  select jsonb_build_object('now', now(), 'ends', coalesce(jsonb_object_agg(portal, ends_at), '{}'::jsonb)) from public.portal_schedule
$$;
revoke all on function public.portal_schedule_get() from public;
grant execute on function public.portal_schedule_get() to anon, authenticated;

do $patch$
declare d text;
begin
 d := pg_get_functiondef('public.summon_buy'::regproc);
 if position('portal_closed' in d) = 0 then
  d := replace(d, '    -- recharge due (12 min par tirage)',
    '    IF EXISTS (SELECT 1 FROM public.portal_schedule s WHERE s.portal = p_portal AND s.ends_at <= now()) THEN
        RAISE EXCEPTION ''portal_closed'';
    END IF;

    -- recharge due (12 min par tirage)');
  if position('portal_closed' in d) = 0 then raise exception 'summon_buy patch failed'; end if;
  execute d;
 end if;
end $patch$;
