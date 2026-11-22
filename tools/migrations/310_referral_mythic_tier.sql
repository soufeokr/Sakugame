-- b313 · Parrainage : le palier 20 donne un mythique garanti dans le prochain booster ; la gemme passe au palier 30.
-- Le mythique garanti est un objet 'mythic_pack' (player_items), consommé par le premier booster du prochain achat
-- dans un portail (summon_buy). Si ce booster contient déjà un mythique, rien n'est remplacé ; sinon la carte de plus
-- basse rareté devient un mythique du portail. Ce mythique forcé ne remet pas la jauge de pitié à zéro.

create or replace function public.referral_tiers()
returns jsonb language sql immutable set search_path to '' as $$
  select jsonb_build_array(
    jsonb_build_object('goal', 3,  'reward', 'bonus_draws', 'amount', 5),
    jsonb_build_object('goal', 5,  'reward', 'coins',       'amount', 1500),
    jsonb_build_object('goal', 10, 'reward', 'coins',       'amount', 5000),
    jsonb_build_object('goal', 20, 'reward', 'mythic_pack', 'amount', 1),
    jsonb_build_object('goal', 30, 'reward', 'summon_gem',  'amount', 1))
$$;

do $mig$
declare d text; n text;
begin
  -- summon_buy
  d := pg_get_functiondef('public.summon_buy(uuid,text,integer)'::regprocedure);
  if position('mythic_pack' in d) = 0 then
    n := d;
    if (length(n) - length(replace(n, '    v_has_free_row boolean := false;', ''))) / length('    v_has_free_row boolean := false;') <> 1 then raise exception 'patch declare'; end if;
    n := replace(n, '    v_has_free_row boolean := false;', '    v_has_free_row boolean := false;
    v_guarantee integer := 0;
    v_guarantee_used boolean := false;
    gpos integer; gtier integer;');
    if position('SELECT shared,special_shared INTO pity,sp FROM public.summon_pity WHERE user_id=who FOR UPDATE;' in n) = 0 then raise exception 'patch pity'; end if;
    n := replace(n, 'SELECT shared,special_shared INTO pity,sp FROM public.summon_pity WHERE user_id=who FOR UPDATE;',
      'SELECT shared,special_shared INTO pity,sp FROM public.summon_pity WHERE user_id=who FOR UPDATE;
    SELECT quantity INTO v_guarantee FROM public.player_items WHERE user_id=who AND item=''mythic_pack'' FOR UPDATE;
    v_guarantee := COALESCE(v_guarantee,0);');
    if (length(n) - length(replace(n, '        FOREACH x IN ARRAY cards LOOP', ''))) / length('        FOREACH x IN ARRAY cards LOOP') <> 1 then raise exception 'patch foreach'; end if;
    n := replace(n, '        FOREACH x IN ARRAY cards LOOP', '        -- mythique garanti (parrainage, palier 20) : premier booster de l''achat ; la pitié n''est pas remise à zéro
        IF j=1 AND v_guarantee>0 THEN
            IF NOT EXISTS (SELECT 1 FROM unnest(cards) c WHERE c->>''rarity''=''mythic'') THEN
                gpos := NULL;
                FOR gtier IN 1..5 LOOP
                    SELECT min(o)::integer INTO gpos FROM unnest(cards) WITH ORDINALITY u(c,o) WHERE c->>''rarity''=tiers[gtier];
                    EXIT WHEN gpos IS NOT NULL;
                END LOOP;
                cards[COALESCE(gpos,1)] := public.summon_one(p_portal,''mythic'');
            END IF;
            UPDATE public.player_items SET quantity=quantity-1 WHERE user_id=who AND item=''mythic_pack'';
            v_guarantee_used := true;
        END IF;
        FOREACH x IN ARRAY cards LOOP');
    if position('''bonus_used'',v_bonus_used,' in n) = 0 then raise exception 'patch result'; end if;
    n := replace(n, '''bonus_used'',v_bonus_used,', '''mythic_guaranteed'',v_guarantee_used,''bonus_used'',v_bonus_used,');
    execute n;
  end if;

  -- referral_status : nombre de mythiques garantis en attente
  d := pg_get_functiondef('public.referral_status()'::regprocedure);
  if position('mythic_packs' in d) = 0 then
    if position('''summon_gems'', coalesce(tickets, 0),' in d) = 0 then raise exception 'patch status'; end if;
    n := replace(d, '''summon_gems'', coalesce(tickets, 0),', '''summon_gems'', coalesce(tickets, 0),
    ''mythic_packs'', coalesce((select i.quantity from public.player_items i where i.user_id = who and i.item = ''mythic_pack''), 0),');
    execute n;
  end if;
end $mig$;
