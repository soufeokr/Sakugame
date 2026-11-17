-- Parrainage : codes, filleuls, tirages bonus, paliers, inventaire (ticket spécial).
-- Règles anti-comptes secondaires :
--   • le compte Discord du filleul doit avoir au moins 15 jours (date tirée de l'identifiant Discord) ;
--   • le code se saisit dans les 7 jours suivant l'inscription sur Sakugame, une seule fois ;
--   • un compte Discord ne peut être parrainé qu'une fois, même après suppression et recréation du compte ;
--   • pas de parrainage croisé (A parraine B puis B parraine A).

alter table public.player_free_draws add column if not exists bonus integer not null default 0;
do $$ begin
  alter table public.player_free_draws add constraint player_free_draws_bonus_check check (bonus >= 0);
exception when duplicate_object then null; end $$;

create table if not exists public.referral_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null unique check (code ~ '^[A-HJ-NP-Z2-9]{6}$'),
  created_at timestamptz not null default now());

create table if not exists public.referrals (
  referred_discord text primary key,
  referred uuid unique references auth.users(id) on delete set null,
  referrer uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now());
create index if not exists referrals_referrer_idx on public.referrals (referrer, created_at);

create table if not exists public.referral_claims (
  user_id uuid not null references auth.users(id) on delete cascade,
  tier integer not null,
  claimed_at timestamptz not null default now(),
  primary key (user_id, tier));

create table if not exists public.player_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  item text not null,
  quantity integer not null default 0 check (quantity >= 0),
  primary key (user_id, item));

alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;
alter table public.referral_claims enable row level security;
alter table public.player_items enable row level security;
revoke all on public.referral_codes, public.referrals, public.referral_claims, public.player_items from anon, authenticated;

-- Paliers : nombre de filleuls → récompense.
create or replace function public.referral_tiers()
returns jsonb language sql immutable set search_path to '' as $$
  select jsonb_build_array(
    jsonb_build_object('goal', 3,  'reward', 'bonus_draws',    'amount', 5),
    jsonb_build_object('goal', 5,  'reward', 'coins',          'amount', 1500),
    jsonb_build_object('goal', 10, 'reward', 'coins',          'amount', 5000),
    jsonb_build_object('goal', 20, 'reward', 'special_ticket', 'amount', 1))
$$;

-- Date de création d'un compte Discord, lue dans son identifiant (snowflake).
create or replace function public.referral_discord_created(p_user uuid)
returns timestamptz language plpgsql stable security definer set search_path to '' as $$
declare pid text;
begin
  select provider_id into pid from auth.identities where user_id = p_user and provider = 'discord' order by created_at limit 1;
  if pid is null or pid !~ '^[0-9]{15,20}$' then return null; end if;
  return to_timestamp(((pid::bigint >> 22) + 1420070400000) / 1000.0);
end $$;

create or replace function public.referral_discord_id(p_user uuid)
returns text language sql stable security definer set search_path to '' as $$
  select provider_id from auth.identities where user_id = p_user and provider = 'discord' order by created_at limit 1
$$;

create or replace function public.referral_ensure_code(p_user uuid)
returns text language plpgsql security definer set search_path to '' as $$
declare c text; alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; b bytea; i integer; tries integer := 0;
begin
  select code into c from public.referral_codes where user_id = p_user;
  if c is not null then return c; end if;
  loop
    tries := tries + 1;
    b := extensions.gen_random_bytes(6); c := '';
    for i in 0..5 loop c := c || substr(alphabet, (get_byte(b, i) % 32) + 1, 1); end loop;
    begin
      insert into public.referral_codes(user_id, code) values (p_user, c);
      return c;
    exception when unique_violation then
      select code into c from public.referral_codes where user_id = p_user;
      if c is not null then return c; end if;
      if tries > 20 then raise exception 'code_generation_failed'; end if;
    end;
  end loop;
end $$;

create or replace function public.referral_status()
returns jsonb language plpgsql security definer set search_path to '' as $$
declare
  who uuid := auth.uid(); acc timestamptz; dc timestamptz; mine record; n integer; list jsonb; tiers jsonb; t jsonb;
  out_tiers jsonb := '[]'::jsonb; bonus integer; tickets integer; window_end timestamptz;
begin
  if who is null then raise exception 'not_authenticated'; end if;
  select created_at into acc from public.player_accounts where user_id = who;
  dc := public.referral_discord_created(who);
  select r.created_at, r.referrer, coalesce(p.display_name, '') as name into mine
    from public.referrals r left join public.player_public_profiles p on p.user_id = r.referrer where r.referred = who;
  select count(*) into n from public.referrals where referrer = who;
  select coalesce(jsonb_agg(jsonb_build_object('name', coalesce(p.display_name, ''), 'deleted', r.referred is null, 'at', r.created_at) order by r.created_at desc), '[]'::jsonb)
    into list from (select * from public.referrals where referrer = who order by created_at desc limit 50) r
    left join public.player_public_profiles p on p.user_id = r.referred;
  for t in select value from jsonb_array_elements(public.referral_tiers()) loop
    out_tiers := out_tiers || jsonb_build_array(t || jsonb_build_object(
      'claimed', exists (select 1 from public.referral_claims c where c.user_id = who and c.tier = (t->>'goal')::integer),
      'ready', n >= (t->>'goal')::integer));
  end loop;
  select coalesce(f.bonus, 0) into bonus from public.player_free_draws f where f.user_id = who;
  select coalesce(i.quantity, 0) into tickets from public.player_items i where i.user_id = who and i.item = 'special_ticket';
  window_end := coalesce(acc, now()) + interval '7 days';
  return jsonb_build_object(
    'code', public.referral_ensure_code(who),
    'count', n,
    'referrals', list,
    'tiers', out_tiers,
    'referred_by', case when mine.created_at is null then null else jsonb_build_object('name', mine.name, 'at', mine.created_at) end,
    'can_enter', mine.created_at is null and now() < window_end,
    'enter_until', window_end,
    'discord_created', dc,
    'discord_ok', dc is not null and dc <= now() - interval '15 days',
    'discord_ready_at', case when dc is null then null else dc + interval '15 days' end,
    'bonus_draws', coalesce(bonus, 0),
    'special_tickets', coalesce(tickets, 0),
    'rules', jsonb_build_object('reward_draws', 2, 'min_discord_days', 15, 'window_days', 7));
end $$;

create or replace function public.referral_apply(p_code text)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare who uuid := auth.uid(); acc timestamptz; dc timestamptz; my_discord text; sponsor uuid; v_code text := upper(btrim(coalesce(p_code, '')));
begin
  if who is null then raise exception 'not_authenticated'; end if;
  if v_code !~ '^[A-HJ-NP-Z2-9]{6}$' then raise exception 'invalid_code'; end if;
  perform 1 from public.player_accounts where user_id = who for update;
  select created_at into acc from public.player_accounts where user_id = who;
  if acc is null then raise exception 'account_missing'; end if;
  if exists (select 1 from public.referrals where referred = who) then raise exception 'already_referred'; end if;
  my_discord := public.referral_discord_id(who);
  if my_discord is null then raise exception 'discord_required'; end if;
  if exists (select 1 from public.referrals where referred_discord = my_discord) then raise exception 'already_referred'; end if;
  if now() >= acc + interval '7 days' then raise exception 'referral_window_closed'; end if;
  select c.user_id into sponsor from public.referral_codes c where c.code = v_code;
  if sponsor is null then raise exception 'invalid_code'; end if;
  if sponsor = who or public.referral_discord_id(sponsor) = my_discord then raise exception 'own_code'; end if;
  dc := public.referral_discord_created(who);
  if dc is null or dc > now() - interval '15 days' then raise exception 'discord_too_recent'; end if;
  if exists (select 1 from public.referrals where referred = sponsor and referrer = who) then raise exception 'referral_loop'; end if;
  insert into public.referrals(referred_discord, referred, referrer) values (my_discord, who, sponsor);
  perform public.refresh_player_free_draws(who);
  perform public.refresh_player_free_draws(sponsor);
  update public.player_free_draws set bonus = bonus + 2, updated_at = now() where user_id in (who, sponsor);
  return jsonb_build_object('applied', true) || public.referral_status();
end $$;

create or replace function public.referral_claim(p_tier integer)
returns jsonb language plpgsql security definer set search_path to '' as $$
declare who uuid := auth.uid(); t jsonb; n integer;
begin
  if who is null then raise exception 'not_authenticated'; end if;
  select value into t from jsonb_array_elements(public.referral_tiers()) where (value->>'goal')::integer = p_tier;
  if t is null then raise exception 'unknown_tier'; end if;
  perform 1 from public.player_accounts where user_id = who for update;
  if exists (select 1 from public.referral_claims where user_id = who and tier = p_tier) then raise exception 'already_claimed'; end if;
  select count(*) into n from public.referrals where referrer = who;
  if n < p_tier then raise exception 'not_ready'; end if;
  insert into public.referral_claims(user_id, tier) values (who, p_tier);
  if t->>'reward' = 'bonus_draws' then
    perform public.refresh_player_free_draws(who);
    update public.player_free_draws set bonus = bonus + (t->>'amount')::integer, updated_at = now() where user_id = who;
  elsif t->>'reward' = 'coins' then
    update public.player_wallets set coins = coins + (t->>'amount')::integer where user_id = who;
  else
    insert into public.player_items(user_id, item, quantity) values (who, t->>'reward', (t->>'amount')::integer)
      on conflict (user_id, item) do update set quantity = public.player_items.quantity + excluded.quantity;
  end if;
  return jsonb_build_object('claimed', p_tier) || public.referral_status();
end $$;

-- Statut des tirages : ajoute les tirages bonus (hors plafond de 5, sans recharge).
create or replace function public.get_free_draw_status(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path to '' as $function$
DECLARE
  v_available integer;
  v_last_refill timestamptz;
  v_bonus integer;
  v_next_seconds integer := 0;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  v_available := public.refresh_player_free_draws(p_user_id);
  SELECT last_refill_at, bonus INTO v_last_refill, v_bonus FROM public.player_free_draws WHERE user_id = p_user_id;
  IF v_available < 5 THEN
    v_next_seconds := GREATEST(0, CEIL(EXTRACT(EPOCH FROM (v_last_refill + interval '12 minutes' - clock_timestamp())))::integer);
  END IF;
  RETURN jsonb_build_object('available', v_available, 'next_seconds', v_next_seconds, 'bonus', COALESCE(v_bonus, 0));
END;
$function$;

-- Invocation : les tirages gratuits normaux d'abord, puis les tirages bonus, puis les pièces.
CREATE OR REPLACE FUNCTION public.summon_buy(p_request uuid, p_portal text, p_count integer)
 RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
DECLARE
    who uuid := auth.uid();
    wallet bigint;
    old_order public.summon_orders%rowtype;
    pity integer; sp integer; next_pity integer; next_sp integer;
    special_portal boolean;
    weights integer[];
    tiers text[] := ARRAY['common','uncommon','rare','epic','legendary','mythic','special'];
    i integer; j integer; k integer; v integer; tier text; pos integer; x jsonb;
    cards jsonb[]; packs jsonb := '[]'::jsonb; result jsonb;
    has_mythic boolean; has_special boolean; has_high boolean;
    v_free_draws integer := 0;
    v_free_used integer := 0;
    v_bonus integer := 0;
    v_bonus_used integer := 0;
    v_paid_count integer;
    v_price integer := 0;
    v_has_free_row boolean := false;
BEGIN
    IF who IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
    IF p_request IS NULL OR p_portal IS NULL
       OR p_portal NOT IN ('basic','strongest','retro','cinema')
       OR p_count IS NULL OR p_count NOT IN (1,5) THEN
        RAISE EXCEPTION 'invalid_request';
    END IF;

    special_portal := p_portal IN ('strongest','cinema');
    weights := CASE WHEN special_portal
        THEN ARRAY[44065,29000,18000,7000,1800,125,10]
        ELSE ARRAY[44075,29000,18000,7000,1800,125,0]
    END;

    SELECT coins INTO wallet FROM public.player_wallets WHERE user_id=who FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'account_missing'; END IF;
    SELECT * INTO old_order FROM public.summon_orders WHERE user_id=who AND request_id=p_request;
    IF FOUND THEN
        IF old_order.portal<>p_portal OR old_order.pack_count<>p_count THEN
            RAISE EXCEPTION 'request_conflict';
        END IF;
        RETURN old_order.result;
    END IF;

    -- recharge due (12 min par tirage) prise en compte avant de décompter
    PERFORM public.refresh_player_free_draws(who);
    SELECT COALESCE(available,0), COALESCE(bonus,0) INTO v_free_draws, v_bonus
      FROM public.player_free_draws WHERE user_id=who FOR UPDATE;
    v_has_free_row := FOUND;
    v_paid_count := p_count;
    IF v_has_free_row AND v_free_draws>0 THEN
        v_free_used := LEAST(v_free_draws,p_count);
        v_paid_count := p_count-v_free_used;
        UPDATE public.player_free_draws
          SET available=available-v_free_used,
              last_refill_at=CASE WHEN v_free_draws>=5 THEN clock_timestamp() ELSE last_refill_at END,
              updated_at=now()
          WHERE user_id=who;
    END IF;
    -- tirages bonus (parrainage) : utilisés seulement quand les tirages normaux ne suffisent pas
    IF v_has_free_row AND v_paid_count>0 AND v_bonus>0 THEN
        v_bonus_used := LEAST(v_bonus,v_paid_count);
        v_paid_count := v_paid_count-v_bonus_used;
        UPDATE public.player_free_draws SET bonus=bonus-v_bonus_used, updated_at=now() WHERE user_id=who;
    END IF;

    IF v_paid_count>0 THEN
        v_price := v_paid_count * CASE WHEN p_portal IN ('basic','retro') THEN 200 ELSE 300 END;
        IF wallet<v_price THEN RAISE EXCEPTION 'insufficient_coins'; END IF;
    END IF;

    FOR i IN 1..7 LOOP
        IF weights[i]>0 AND NOT EXISTS(
            SELECT 1 FROM public.summon_catalog WHERE portal=p_portal AND rarity=tiers[i]
        ) THEN RAISE EXCEPTION 'catalog_incomplete'; END IF;
    END LOOP;

    INSERT INTO public.summon_pity(user_id) VALUES(who) ON CONFLICT DO NOTHING;
    SELECT shared,special_shared INTO pity,sp FROM public.summon_pity WHERE user_id=who FOR UPDATE;

    FOR j IN 1..p_count LOOP
        next_pity:=pity+1;
        next_sp:=sp+CASE WHEN special_portal THEN 1 ELSE 0 END;
        cards:=ARRAY[]::jsonb[];
        FOR k IN 1..10 LOOP
            v:=public.summon_uniform(100000); tier:=NULL;
            FOR i IN 1..7 LOOP
                v:=v-weights[i];
                IF v<0 THEN tier:=tiers[i]; EXIT; END IF;
            END LOOP;
            cards:=array_append(cards,public.summon_one(p_portal,tier));
        END LOOP;

        SELECT bool_or(c->>'rarity'='mythic'),bool_or(c->>'rarity'='special')
          INTO has_mythic,has_special FROM unnest(cards) c;
        IF special_portal AND next_sp>=1000 AND NOT has_special THEN
            pos:=10;
            WHILE pos>1 AND cards[pos]->>'rarity'='mythic' LOOP pos:=pos-1; END LOOP;
            cards[pos]:=public.summon_one(p_portal,'special');
        END IF;
        SELECT bool_or(c->>'rarity'='mythic'),bool_or(c->>'rarity'='special'),
               bool_or(c->>'rarity' IN ('legendary','mythic','special'))
          INTO has_mythic,has_special,has_high FROM unnest(cards) c;
        IF next_pity>=400 AND NOT has_mythic THEN
            pos:=10;
            WHILE pos>1 AND cards[pos]->>'rarity'='special' LOOP pos:=pos-1; END LOOP;
            cards[pos]:=public.summon_one(p_portal,'mythic');
        ELSIF next_pity%50=0 AND NOT has_high THEN
            cards[10]:=public.summon_one(p_portal,'legendary');
        END IF;
        SELECT bool_or(c->>'rarity'='mythic'),bool_or(c->>'rarity'='special')
          INTO has_mythic,has_special FROM unnest(cards) c;
        pity:=CASE WHEN has_mythic THEN 0 ELSE next_pity END;
        IF special_portal THEN sp:=CASE WHEN has_special THEN 0 ELSE next_sp END; END IF;

        FOREACH x IN ARRAY cards LOOP
            INSERT INTO public.player_cards(user_id,card_id,level,quantity)
              VALUES(who,x->>'id',0,1)
              ON CONFLICT(user_id,card_id,level)
              DO UPDATE SET quantity=public.player_cards.quantity+1;
        END LOOP;
        packs:=packs||jsonb_build_array(to_jsonb(cards));
    END LOOP;

    IF v_paid_count>0 THEN
        UPDATE public.player_wallets SET coins=coins-v_price WHERE user_id=who;
    END IF;
    UPDATE public.summon_pity SET shared=pity,special_shared=sp WHERE user_id=who;

    result:=jsonb_build_object(
        'request_id',p_request,'portal',p_portal,'packs',packs,
        'coins',CASE WHEN v_paid_count>0 THEN wallet-v_price ELSE wallet END,
        'pity',pity,'free_used',v_free_used,'paid_count',v_paid_count,'price',v_price,
        'free_remaining',CASE WHEN v_has_free_row THEN v_free_draws-v_free_used ELSE 0 END,
        'bonus_used',v_bonus_used,
        'bonus_remaining',CASE WHEN v_has_free_row THEN v_bonus-v_bonus_used ELSE 0 END
    );
    INSERT INTO public.summon_orders(user_id,request_id,portal,pack_count,result)
      VALUES(who,p_request,p_portal,p_count,result);
    RETURN result;
END;
$function$;

revoke all on function public.referral_tiers() from public, anon, authenticated;
revoke all on function public.referral_discord_created(uuid) from public, anon, authenticated;
revoke all on function public.referral_discord_id(uuid) from public, anon, authenticated;
revoke all on function public.referral_ensure_code(uuid) from public, anon, authenticated;
revoke all on function public.referral_status() from public, anon;
revoke all on function public.referral_apply(text) from public, anon;
revoke all on function public.referral_claim(integer) from public, anon;
grant execute on function public.referral_status() to authenticated;
grant execute on function public.referral_apply(text) to authenticated;
grant execute on function public.referral_claim(integer) to authenticated;
