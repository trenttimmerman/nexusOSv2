-- Create Discounts Table
create table if not exists discounts (
  id uuid primary key default uuid_generate_v4(),
  store_id uuid references stores(id) on delete cascade,
  code text not null,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric not null,
  min_order_amount numeric default 0,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  usage_limit integer,
  usage_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  unique(store_id, code)
);

-- Enable RLS
alter table discounts enable row level security;

-- RLS Policies

-- Tenants can read their own discounts
create policy "Tenant Read Discounts" on discounts
  for select using (store_id in (select store_id from profiles where id = auth.uid()));

-- Tenants can insert their own discounts
create policy "Tenant Insert Discounts" on discounts
  for insert with check (store_id in (select store_id from profiles where id = auth.uid()));

-- Tenants can update their own discounts
create policy "Tenant Update Discounts" on discounts
  for update using (store_id in (select store_id from profiles where id = auth.uid()));

-- Tenants can delete their own discounts
create policy "Tenant Delete Discounts" on discounts
  for delete using (store_id in (select store_id from profiles where id = auth.uid()));

-- Public (Checkout) can read active discounts to validate codes
-- We only allow reading if the code matches (security by obscurity for codes?) 
-- Or just allow public read for all discounts of a store? 
-- Usually, you don't want users scraping all codes.
-- So we might restrict this to a specific RPC function or allow select but maybe not list all?
-- For simplicity in this MVP, we'll allow public read of active discounts for the store they are browsing.
-- But ideally, we should use a secure function `validate_discount(code, store_id)`.

-- Let's create a secure function for validation instead of public read access to the table.
-- This prevents scraping.

create or replace function validate_discount(p_code text, p_store_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_discount record;
begin
  select * into v_discount
  from discounts
  where code = p_code
  and store_id = p_store_id
  and is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
  and (usage_limit is null or usage_count < usage_limit);

  if v_discount.id is not null then
    return to_jsonb(v_discount);
  else
    return null;
  end if;
end;
$$;

-- Grant execute to public (anon) and authenticated
grant execute on function validate_discount to anon, authenticated;

-- Superuser Access
create policy "Superuser Read All Discounts" on discounts
  for select using (public.is_superuser());

create policy "Superuser Write All Discounts" on discounts
  for insert with check (public.is_superuser());

create policy "Superuser Update All Discounts" on discounts
  for update using (public.is_superuser());

create policy "Superuser Delete All Discounts" on discounts
  for delete using (public.is_superuser());
