-- Function to check if the current user is a superuser
create or replace function public.is_superuser()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'superuser'
  );
end;
$$ language plpgsql security definer;

-- Grant execute to authenticated users
grant execute on function public.is_superuser to authenticated;

-- Update RLS Policies to allow Superuser Global Access

-- Helper macro for policies (conceptually)
-- We need to update existing policies or add new ones. 
-- Adding new "OR" policies is often cleaner than modifying complex existing ones.

-- PRODUCTS
create policy "Superuser Read All Products" on products
  for select using (public.is_superuser());

create policy "Superuser Write All Products" on products
  for insert with check (public.is_superuser());

create policy "Superuser Update All Products" on products
  for update using (public.is_superuser());

create policy "Superuser Delete All Products" on products
  for delete using (public.is_superuser());

-- PAGES
create policy "Superuser Read All Pages" on pages
  for select using (public.is_superuser());

create policy "Superuser Write All Pages" on pages
  for insert with check (public.is_superuser());

create policy "Superuser Update All Pages" on pages
  for update using (public.is_superuser());

create policy "Superuser Delete All Pages" on pages
  for delete using (public.is_superuser());

-- MEDIA ASSETS
create policy "Superuser Read All Media" on media_assets
  for select using (public.is_superuser());

create policy "Superuser Write All Media" on media_assets
  for insert with check (public.is_superuser());

create policy "Superuser Update All Media" on media_assets
  for update using (public.is_superuser());

create policy "Superuser Delete All Media" on media_assets
  for delete using (public.is_superuser());

-- CAMPAIGNS
create policy "Superuser Read All Campaigns" on campaigns
  for select using (public.is_superuser());

create policy "Superuser Write All Campaigns" on campaigns
  for insert with check (public.is_superuser());

create policy "Superuser Update All Campaigns" on campaigns
  for update using (public.is_superuser());

create policy "Superuser Delete All Campaigns" on campaigns
  for delete using (public.is_superuser());

-- STORE CONFIG
create policy "Superuser Read All Config" on store_config
  for select using (public.is_superuser());

create policy "Superuser Write All Config" on store_config
  for insert with check (public.is_superuser());

create policy "Superuser Update All Config" on store_config
  for update using (public.is_superuser());

-- CUSTOMERS
create policy "Superuser Read All Customers" on customers
  for select using (public.is_superuser());

create policy "Superuser Write All Customers" on customers
  for insert with check (public.is_superuser());

create policy "Superuser Update All Customers" on customers
  for update using (public.is_superuser());

-- ORDERS
create policy "Superuser Read All Orders" on orders
  for select using (public.is_superuser());

create policy "Superuser Write All Orders" on orders
  for insert with check (public.is_superuser());

create policy "Superuser Update All Orders" on orders
  for update using (public.is_superuser());

-- ORDER ITEMS
create policy "Superuser Read All Order Items" on order_items
  for select using (public.is_superuser());

create policy "Superuser Write All Order Items" on order_items
  for insert with check (public.is_superuser());

-- STORES (Allow Superuser to create/edit stores)
create policy "Superuser Read All Stores" on stores
  for select using (public.is_superuser());

create policy "Superuser Write All Stores" on stores
  for insert with check (public.is_superuser());

create policy "Superuser Update All Stores" on stores
  for update using (public.is_superuser());

create policy "Superuser Delete All Stores" on stores
  for delete using (public.is_superuser());

-- PROFILES (Allow Superuser to see all profiles)
create policy "Superuser Read All Profiles" on profiles
  for select using (public.is_superuser());

create policy "Superuser Update All Profiles" on profiles
  for update using (public.is_superuser());
