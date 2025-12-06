
-- 1. Create Store Secrets Table (For sensitive keys)
create table if not exists store_secrets (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade unique,
  stripe_secret_key text,
  paypal_client_secret text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table store_secrets enable row level security;

-- RLS Policies for Store Secrets
-- Only the tenant owner (profile linked to store) can view/edit secrets
create policy "Tenant Read Secrets" on store_secrets
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Insert Secrets" on store_secrets
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

create policy "Tenant Update Secrets" on store_secrets
  for update using (store_id in (select store_id from profiles where id = auth.uid()));

-- 2. Update Store Config (For public keys and settings)
alter table store_config
add column if not exists payment_provider text default 'manual', -- 'stripe', 'paypal', 'manual'
add column if not exists stripe_publishable_key text,
add column if not exists paypal_client_id text;

-- 3. Create Payment Transactions Table (To track payment attempts)
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  provider text not null, -- 'stripe', 'paypal'
  provider_transaction_id text,
  amount numeric not null,
  currency text default 'USD',
  status text default 'pending', -- 'pending', 'succeeded', 'failed'
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

alter table payments enable row level security;

-- RLS for Payments
-- Tenants can see payments for their store
create policy "Tenant Read Payments" on payments
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

-- Public (Checkout) can insert payments (initiate)
-- Actually, usually payments are created by the backend (Edge Function) or via webhook.
-- But for client-side initiation (like PayPal buttons), we might need insert.
-- Let's allow authenticated users (customers) to read their own payments?
create policy "Customer Read Own Payments" on payments
  for select using (
    order_id in (select id from orders where customer_id in (select id from customers where auth_user_id = auth.uid()))
  );

