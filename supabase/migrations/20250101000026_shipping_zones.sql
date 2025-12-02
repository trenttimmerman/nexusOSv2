create table if not exists shipping_zones (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references stores(id) on delete cascade not null,
  name text not null,
  countries text[] not null default '{}', -- ISO country codes
  created_at timestamptz default now()
);

alter table shipping_zones enable row level security;

create policy "Tenant Manage Shipping Zones"
  on shipping_zones for all
  using (store_id in (select store_id from profiles where id = auth.uid()));

create table if not exists shipping_rates (
  id uuid primary key default gen_random_uuid(),
  zone_id uuid references shipping_zones(id) on delete cascade not null,
  name text not null, -- e.g. "Standard Shipping"
  type text not null check (type in ('flat', 'weight', 'price')),
  amount numeric not null default 0,
  min_value numeric, -- min weight or price
  max_value numeric, -- max weight or price
  created_at timestamptz default now()
);

alter table shipping_rates enable row level security;

create policy "Tenant Manage Shipping Rates"
  on shipping_rates for all
  using (
    exists (
      select 1 from shipping_zones
      where shipping_zones.id = shipping_rates.zone_id
      and shipping_zones.store_id in (select store_id from profiles where id = auth.uid())
    )
  );

-- Public Read Access for Checkout (needed for fetching rates)
create policy "Public Read Shipping Zones"
  on shipping_zones for select
  using (true);

create policy "Public Read Shipping Rates"
  on shipping_rates for select
  using (true);
