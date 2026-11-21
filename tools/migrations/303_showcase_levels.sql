-- 303 — La vitrine renvoie le niveau de chaque carte (meilleur exemplaire du joueur), pour afficher ses effets.
do $patch$
declare d text;
begin
 d:=pg_get_functiondef('public.showcase_get'::regproc);
 if position('''level'', (select max(pc.level)' in d)>0 then return; end if;
 d:=replace(d, $a$'rarity', coalesce(r.rarity, 'common'))$a$,
   $b$'rarity', coalesce(r.rarity, 'common'), 'level', (select max(pc.level) from public.player_cards pc where pc.user_id = target and pc.card_id = c.id and pc.quantity > 0))$b$);
 if position('''level'', (select max(pc.level)' in d)=0 then raise exception 'showcase_get patch failed'; end if;
 execute d;
end $patch$;
