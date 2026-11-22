-- 307 — Profil joueur synchronisé entre appareils.
-- Avant : pseudo, avatar choisi, lien AniList, statuts AniList suivis et victoires restaient dans le navigateur.
-- • player_profile_data : ces réglages, par compte (un seul document JSON, champs filtrés).
-- • profile_data_get() / profile_data_set(data) : lecture / écriture par le joueur connecté.
-- • Un pseudo choisi dans le jeu devient aussi le nom public (vitrine, amis, classement).

create table if not exists public.player_profile_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now());
alter table public.player_profile_data enable row level security;
revoke all on public.player_profile_data from anon, authenticated;

-- Ne garde que les champs connus, aux formats attendus.
create or replace function public.profile_data_clean(p jsonb)
returns jsonb language plpgsql immutable set search_path to '' as $function$
declare o jsonb:='{}'::jsonb; v jsonb; k text;
begin
 if p is null or jsonb_typeof(p)<>'object' then return o; end if;
 v:=p->'name'; if jsonb_typeof(v)='string' and (v#>>'{}') ~ '^[A-Za-z0-9_]{3,20}$' then o:=o||jsonb_build_object('name',v); end if;
 v:=p->'anilist'; if jsonb_typeof(v)='string' and (v#>>'{}') ~ '^[A-Za-z0-9_-]{1,40}$' then o:=o||jsonb_build_object('anilist',v); end if;
 v:=p->'avatar'; if jsonb_typeof(v)='string' and length(v#>>'{}') between 1 and 600 and (v#>>'{}') !~* '^\s*(data|javascript|vbscript):' then o:=o||jsonb_build_object('avatar',v); end if;
 v:=p->'watchStatuses'; if jsonb_typeof(v)='array' and jsonb_array_length(v)<=10
   and not exists (select 1 from jsonb_array_elements(v) e where jsonb_typeof(e)<>'string' or length(e#>>'{}')>20) then o:=o||jsonb_build_object('watchStatuses',v); end if;
 foreach k in array array['wins','losses','uWins','uLosses','createdAt'] loop
  v:=p->k; if jsonb_typeof(v)='number' and (v#>>'{}')::numeric between 0 and 1e15 then o:=o||jsonb_build_object(k,floor((v#>>'{}')::numeric)); end if;
 end loop;
 return o;
end $function$;

create or replace function public.profile_data_get()
returns jsonb language plpgsql stable security definer set search_path to '' as $function$
declare who uuid:=auth.uid();
begin
 if who is null then raise exception 'not_authenticated'; end if;
 return coalesce((select data from public.player_profile_data where user_id=who),'{}'::jsonb);
end $function$;

create or replace function public.profile_data_set(p_data jsonb)
returns jsonb language plpgsql security definer set search_path to '' as $function$
declare who uuid:=auth.uid(); clean jsonb;
begin
 if who is null then raise exception 'not_authenticated'; end if;
 if p_data is null or jsonb_typeof(p_data)<>'object' or length(p_data::text)>32000 then raise exception 'invalid_request'; end if;
 clean:=public.profile_data_clean(p_data);
 insert into public.player_profile_data(user_id,data,updated_at) values(who,clean,now())
  on conflict(user_id) do update set data=excluded.data, updated_at=now();
 if clean ? 'name' then update public.player_public_profiles set display_name=clean->>'name' where user_id=who; end if;
 return clean;
end $function$;

revoke all on function public.profile_data_clean(jsonb) from public, anon, authenticated;
revoke all on function public.profile_data_get(), public.profile_data_set(jsonb) from public, anon;
grant execute on function public.profile_data_get(), public.profile_data_set(jsonb) to authenticated;

-- Comptes dont le nom public est resté « Joueur » (pseudo Discord pas encore transmis à l'inscription) :
-- on reprend leur pseudo Discord.
update public.player_public_profiles p set display_name=left(u.raw_user_meta_data->>'full_name',40)
  from auth.users u where u.id=p.user_id and p.display_name='Joueur' and coalesce(u.raw_user_meta_data->>'full_name','')<>'';
