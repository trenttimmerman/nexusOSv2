-- Function to create a new tenant (store) for a user
-- This function is SECURITY DEFINER to bypass RLS on stores/profiles during creation
create or replace function create_tenant(
  store_name text,
  store_slug text
) returns uuid
language plpgsql
security definer
as $$
declare
  new_store_id uuid;
  user_id uuid;
begin
  -- Get current user ID
  user_id := auth.uid();
  if user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Check if slug is taken
  if exists (select 1 from stores where slug = store_slug) then
    raise exception 'Store URL is already taken';
  end if;

  -- 1. Create Store
  insert into stores (name, slug)
  values (store_name, store_slug)
  returning id into new_store_id;

  -- 2. Create Profile (Link User to Store as Owner)
  -- Check if profile exists (it shouldn't for a new user, but handle upsert just in case)
  insert into profiles (id, store_id, role)
  values (user_id, new_store_id, 'owner')
  on conflict (id) do update
  set store_id = new_store_id, role = 'owner';

  -- 3. Create Default Store Config
  insert into store_config (
    store_id, 
    name, 
    currency, 
    header_style, 
    hero_style, 
    product_card_style, 
    footer_style,
    tax_regions
  )
  values (
    new_store_id,
    store_name,
    'USD',
    'minimal',
    'split',
    'minimal',
    'minimal',
    '[{"id": "us-tax", "country_code": "US", "region_code": "*", "rate": 0, "name": "Sales Tax"}]'::jsonb
  );

  -- 4. Create Free Subscription
  insert into subscriptions (
    store_id,
    plan_id,
    status,
    current_period_start,
    current_period_end
  )
  values (
    new_store_id,
    'free',
    'trialing',
    now(),
    now() + interval '14 days'
  );

  return new_store_id;
end;
$$;

-- Grant execute to authenticated users so they can create their own store after signup
grant execute on function create_tenant to authenticated;
