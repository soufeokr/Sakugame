-- 320 — Taux des portails : mythique 0,125 % → 0,050 %, compensé sur la rareté commune (+0,075 %).
-- Unités : millièmes de pour cent (100000 = 100 %). Le grimoire spécial (gemmes) ne change pas.
--   portail ordinaire : [44575,29800,18000,7000,500,125,0]  → [44650,29800,18000,7000,500,50,0]
--   portail spécial   : [44565,29800,18000,7000,500,125,10] → [44640,29800,18000,7000,500,50,10]
do $$
declare d text;
begin
  select pg_get_functiondef('public.summon_buy'::regproc) into d;
  if position('ARRAY[44575,29800,18000,7000,500,125,0]' in d) = 0 or position('ARRAY[44565,29800,18000,7000,500,125,10]' in d) = 0 then
    if position('ARRAY[44650,29800,18000,7000,500,50,0]' in d) > 0 then return; end if;  -- déjà appliquée
    raise exception 'summon_buy : tableaux de taux introuvables';
  end if;
  d := replace(d, 'ARRAY[44575,29800,18000,7000,500,125,0]', 'ARRAY[44650,29800,18000,7000,500,50,0]');
  d := replace(d, 'ARRAY[44565,29800,18000,7000,500,125,10]', 'ARRAY[44640,29800,18000,7000,500,50,10]');
  execute d;
end $$;
