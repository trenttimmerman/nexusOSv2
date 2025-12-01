create table if not exists domains (
  id uuid default gen_random_uuid() primary key,
  store_id uuid references stores(id) on delete cascade not null,
  domain text unique not null,
  status text default 'pending' check (status in ('pending', 'active', 'error')),
  verified_at timestamptz,
  created_at timestamptz default now()
);

-- RLS Policies
alter table domains enable row level security;

-- Public read access (needed for domain resolution)
create policy "Domains are viewable by everyone" 
  on domains for select 
  using (true);

-- Store owners can manage their domains
create policy "Store owners can manage their domains" 
  on domains for all 
  using (
    store_id in (
      select store_id from profiles 
      where id = auth.uid()
    )
  );
