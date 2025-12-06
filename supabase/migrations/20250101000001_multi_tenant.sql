-- Create Stores Table
create table if not exists stores (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Create Profiles Table (Links Auth Users to Stores)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  store_id uuid references stores(id) on delete cascade,
  role text default 'admin',
  created_at timestamptz default now()
);

-- Enable RLS on new tables
alter table stores enable row level security;
alter table profiles enable row level security;

-- Add store_id to existing tables
alter table products add column if not exists store_id uuid references stores(id) on delete cascade;
alter table pages add column if not exists store_id uuid references stores(id) on delete cascade;
alter table media_assets add column if not exists store_id uuid references stores(id) on delete cascade;
alter table campaigns add column if not exists store_id uuid references stores(id) on delete cascade;

-- Update store_config to be multi-tenant
-- First, drop the single row constraint
alter table store_config drop constraint if exists single_row;
-- Add store_id
alter table store_config add column if not exists store_id uuid references stores(id) on delete cascade;
-- Make store_id unique (one config per store)
alter table store_config add constraint unique_store_config unique (store_id);

-- RLS Policies for Multi-Tenancy

-- Profiles: Users can read their own profile
create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

-- Stores: Users can read their own store
create policy "Users can read own store" on stores
  for select using (id in (select store_id from profiles where id = auth.uid()));

-- Products: Tenant Isolation
drop policy if exists "Public Read Products" on products;
drop policy if exists "Public Write Products" on products;
drop policy if exists "Public Update Products" on products;
drop policy if exists "Public Delete Products" on products;

create policy "Tenant Read Products" on products
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Insert Products" on products
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Update Products" on products
  for update using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Delete Products" on products
  for delete using (store_id in (select store_id from profiles where id = auth.uid()));

-- Pages: Tenant Isolation
drop policy if exists "Public Read Pages" on pages;
drop policy if exists "Public Write Pages" on pages;
drop policy if exists "Public Update Pages" on pages;
drop policy if exists "Public Delete Pages" on pages;

create policy "Tenant Read Pages" on pages
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Insert Pages" on pages
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Update Pages" on pages
  for update using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Delete Pages" on pages
  for delete using (store_id in (select store_id from profiles where id = auth.uid()));

-- Media: Tenant Isolation
drop policy if exists "Public Read Media" on media_assets;
drop policy if exists "Public Write Media" on media_assets;
drop policy if exists "Public Update Media" on media_assets;
drop policy if exists "Public Delete Media" on media_assets;

create policy "Tenant Read Media" on media_assets
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Insert Media" on media_assets
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Update Media" on media_assets
  for update using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Delete Media" on media_assets
  for delete using (store_id in (select store_id from profiles where id = auth.uid()));

-- Campaigns: Tenant Isolation
drop policy if exists "Public Read Campaigns" on campaigns;
drop policy if exists "Public Write Campaigns" on campaigns;
drop policy if exists "Public Update Campaigns" on campaigns;
drop policy if exists "Public Delete Campaigns" on campaigns;

create policy "Tenant Read Campaigns" on campaigns
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Insert Campaigns" on campaigns
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Update Campaigns" on campaigns
  for update using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Delete Campaigns" on campaigns
  for delete using (store_id in (select store_id from profiles where id = auth.uid()));

-- Store Config: Tenant Isolation
drop policy if exists "Public Read Config" on store_config;
drop policy if exists "Public Update Config" on store_config;

create policy "Tenant Read Config" on store_config
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Insert Config" on store_config
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Update Config" on store_config
  for update using (store_id in (select store_id from profiles where id = auth.uid()));
