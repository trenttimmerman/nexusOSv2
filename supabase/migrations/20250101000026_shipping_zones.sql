create table if not exists shipping_zones (
  id uuid primary key default gen_random_uuid(),
  store_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  countries text[] not null default '{}', -- ISO country codes
  created_at timestamptz default now()
);

alter table shipping_zones enable row level security;

create policy "Users can manage their own shipping zones"
  on shipping_zones for all
  using (auth.uid() = store_id);

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

create policy "Users can manage their own shipping rates"
  on shipping_rates for all
  using (
    exists (
      select 1 from shipping_zones
      where shipping_zones.id = shipping_rates.zone_id
      and shipping_zones.store_id = auth.uid()
    )
  );
