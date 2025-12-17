-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Customers Table
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  phone text,
  created_at timestamptz default now()
);

-- 2. Orders Table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  total_amount numeric default 0,
  currency text default 'USD',
  status text default 'pending', -- pending, paid, fulfilled, cancelled, refunded
  payment_status text default 'unpaid',
  created_at timestamptz default now()
);

-- 3. Order Items Table
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id text, -- referencing products.id (text)
  quantity integer default 1,
  price_at_purchase numeric,
  created_at timestamptz default now()
);

-- 4. Subscriptions Table (SaaS Layer)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade unique, -- One active subscription per store
  plan_id text default 'free', -- free, pro, enterprise
  status text default 'active', -- active, past_due, cancelled, trialing
  current_period_start timestamptz default now(),
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table subscriptions enable row level security;

-- RLS Policies: Tenant Isolation

-- Customers
create policy "Tenant Read Customers" on customers
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Insert Customers" on customers
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Update Customers" on customers
  for update using (store_id in (select store_id from profiles where id = auth.uid()));

-- Orders
create policy "Tenant Read Orders" on orders
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Insert Orders" on orders
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Update Orders" on orders
  for update using (store_id in (select store_id from profiles where id = auth.uid()));

-- Order Items
create policy "Tenant Read Order Items" on order_items
  for select using (order_id in (select id from orders where store_id in (select store_id from profiles where id = auth.uid())));

create policy "Tenant Insert Order Items" on order_items
  for insert with check (order_id in (select id from orders where store_id in (select store_id from profiles where id = auth.uid())));

-- Subscriptions
-- Tenants can read their own subscription
create policy "Tenant Read Own Subscription" on subscriptions
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

-- Only Superusers can update subscriptions (This logic might need a specific superuser check function, 
-- but for now we'll allow reading. Writing should be restricted to system/webhooks or superusers).
-- We'll add a policy for Superusers to read ALL subscriptions.

create policy "Superuser Read All Subscriptions" on subscriptions
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'superuser'
    )
  );

create policy "Superuser Update Subscriptions" on subscriptions
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'superuser'
    )
  );

create policy "Superuser Insert Subscriptions" on subscriptions
  for insert with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'superuser'
    )
  );
