-- Update RLS policies to allow superuser access

-- Helper function to check if user is superuser
create or replace function is_superuser()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'superuser'
  );
end;
$$ language plpgsql security definer;

-- Update Policies for Products
drop policy if exists "Tenant Read Products" on products;
create policy "Tenant Read Products" on products
  for select using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Insert Products" on products;
create policy "Tenant Insert Products" on products
  for insert with check (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Update Products" on products;
create policy "Tenant Update Products" on products
  for update using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Delete Products" on products;
create policy "Tenant Delete Products" on products
  for delete using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

-- Update Policies for Pages
drop policy if exists "Tenant Read Pages" on pages;
create policy "Tenant Read Pages" on pages
  for select using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Insert Pages" on pages;
create policy "Tenant Insert Pages" on pages
  for insert with check (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Update Pages" on pages;
create policy "Tenant Update Pages" on pages
  for update using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Delete Pages" on pages;
create policy "Tenant Delete Pages" on pages
  for delete using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

-- Update Policies for Media Assets
drop policy if exists "Tenant Read Media" on media_assets;
create policy "Tenant Read Media" on media_assets
  for select using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Insert Media" on media_assets;
create policy "Tenant Insert Media" on media_assets
  for insert with check (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Update Media" on media_assets;
create policy "Tenant Update Media" on media_assets
  for update using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Delete Media" on media_assets;
create policy "Tenant Delete Media" on media_assets
  for delete using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

-- Update Policies for Campaigns
drop policy if exists "Tenant Read Campaigns" on campaigns;
create policy "Tenant Read Campaigns" on campaigns
  for select using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Insert Campaigns" on campaigns;
create policy "Tenant Insert Campaigns" on campaigns
  for insert with check (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Update Campaigns" on campaigns;
create policy "Tenant Update Campaigns" on campaigns
  for update using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Delete Campaigns" on campaigns;
create policy "Tenant Delete Campaigns" on campaigns
  for delete using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

-- Update Policies for Store Config
drop policy if exists "Tenant Read Config" on store_config;
create policy "Tenant Read Config" on store_config
  for select using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Insert Config" on store_config;
create policy "Tenant Insert Config" on store_config
  for insert with check (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

drop policy if exists "Tenant Update Config" on store_config;
create policy "Tenant Update Config" on store_config
  for update using (
    store_id in (select store_id from profiles where id = auth.uid())
    or is_superuser()
  );

-- Set trent@3thirty3.ca as superuser and assign to Demo Store
DO $$
DECLARE
  target_user_id uuid;
  demo_store_id uuid;
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'trent@3thirty3.ca';
  
  -- Create or Get Demo Store
  INSERT INTO stores (name, slug)
  VALUES ('Demo Store', 'demo-store')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO demo_store_id;

  IF target_user_id IS NOT NULL THEN
    -- Update or Insert into profiles
    INSERT INTO profiles (id, store_id, role)
    VALUES (target_user_id, demo_store_id, 'superuser')
    ON CONFLICT (id) DO UPDATE
    SET role = 'superuser',
        store_id = demo_store_id;
  END IF;
END $$;
