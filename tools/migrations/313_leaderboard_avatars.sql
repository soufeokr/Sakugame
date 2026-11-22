-- 313 — Classement : photo de profil des joueurs.
-- Photo choisie dans le jeu (profil synchronisé, https uniquement), sinon photo Discord (comme la liste d'amis).
create or replace function public.player_avatar(p_user uuid)
returns text language sql stable security definer set search_path to '' as $$
  select coalesce(
    (select case when d.data->>'avatar' ~ '^https://[^\s"''<>]+$' and length(d.data->>'avatar') <= 500 then d.data->>'avatar' end
       from public.player_profile_data d where d.user_id = p_user),
    public.social_avatar(p_user))
$$;
revoke all on function public.player_avatar(uuid) from public, anon, authenticated;

do $$ declare f text; d text; begin
  foreach f in array array['public.leaderboard_games(text)','public.leaderboard_collection(text)'] loop
    d := pg_get_functiondef(f::regprocedure);
    if position('player_avatar' in d) = 0 then
      if position('''name'',name,''value''' in d) = 0 then raise exception 'patch %', f; end if;
      execute replace(d, '''name'',name,''value''', '''name'',name,''avatar'',public.player_avatar(user_id),''value''');
    end if;
  end loop;
end $$;
