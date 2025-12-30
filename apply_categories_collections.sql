-- Combined migration for Categories and Collections
-- Safe to run multiple times (uses IF NOT EXISTS)

-- ============================================
-- CATEGORIES MIGRATION
-- ============================================

-- Create categories table
create table if not exists categories (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null,
  description text,
  parent_id text references categories(id) on delete set null,
  display_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add store_id column if it doesn't exist
alter table categories add column if not exists store_id text;

-- Add index for parent_id lookups (for hierarchical queries)
create index if not exists idx_categories_parent_id on categories(parent_id);

-- Add index for slug lookups
create index if not exists idx_categories_slug on categories(slug);

-- Add index for store_id
create index if not exists idx_categories_store_id on categories(store_id);

-- Drop old unique constraint if it exists (without store_id)
alter table categories drop constraint if exists categories_slug_key;

-- Add unique constraint for slug per store
create unique index if not exists categories_slug_store_id_key on categories(slug, store_id);

-- Add trigger to auto-update updated_at
create or replace function update_categories_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists categories_updated_at on categories;
create trigger categories_updated_at
  before update on categories
  for each row
  execute function update_categories_updated_at();

-- Add category_id column to products
alter table products add column if not exists category_id text references categories(id) on delete set null;

-- Create index for category_id lookups
create index if not exists idx_products_category_id on products(category_id);

-- ============================================
-- COLLECTIONS MIGRATION
-- ============================================

-- Create collections table
create table if not exists collections (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text not null,
  description text,
  image_url text,
  type text default 'manual',
  is_featured boolean default false,
  is_visible boolean default true,
  display_order integer default 0,
  conditions jsonb default '{}',
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add store_id column if it doesn't exist
alter table collections add column if not exists store_id text;

-- Create collection_products junction table (for manual collections)
create table if not exists collection_products (
  id text primary key default gen_random_uuid()::text,
  collection_id text not null references collections(id) on delete cascade,
  product_id text not null references products(id) on delete cascade,
  display_order integer default 0,
  created_at timestamptz default now(),
  
  unique(collection_id, product_id)
);

-- Add indexes for collections
create index if not exists idx_collections_store_id on collections(store_id);
create index if not exists idx_collections_slug on collections(slug);
create index if not exists idx_collections_type on collections(type);
create index if not exists idx_collections_featured on collections(is_featured) where is_featured = true;

-- Add indexes for collection_products
create index if not exists idx_collection_products_collection_id on collection_products(collection_id);
create index if not exists idx_collection_products_product_id on collection_products(product_id);

-- Drop old unique constraint if it exists (without store_id)
alter table collections drop constraint if exists collections_slug_key;

-- Add unique constraint for slug per store
create unique index if not exists collections_slug_store_id_key on collections(slug, store_id);

-- Add trigger to auto-update updated_at
create or replace function update_collections_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists collections_updated_at on collections;
create trigger collections_updated_at
  before update on collections
  for each row
  execute function update_collections_updated_at();

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify tables exist
select 'Categories table: ' || case when exists (select from pg_tables where tablename = 'categories') then '✓ Created' else '✗ Missing' end as status
union all
select 'Collections table: ' || case when exists (select from pg_tables where tablename = 'collections') then '✓ Created' else '✗ Missing' end
union all
select 'Collection Products table: ' || case when exists (select from pg_tables where tablename = 'collection_products') then '✓ Created' else '✗ Missing' end;
