-- Create collections table
create table if not exists collections (
  id text primary key default gen_random_uuid()::text,
  store_id text,
  name text not null,
  slug text not null,
  description text,
  image_url text,
  type text default 'manual', -- 'manual', 'auto-category', 'auto-tag', 'auto-newest', 'auto-bestsellers'
  is_featured boolean default false,
  is_visible boolean default true,
  display_order integer default 0,
  
  -- Auto-collection conditions
  conditions jsonb default '{}', -- For automatic collections: { category_id: 'xyz', tags: ['sale'], etc. }
  
  -- SEO
  seo_title text,
  seo_description text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create collection_products junction table (for manual collections)
create table if not exists collection_products (
  id text primary key default gen_random_uuid()::text,
  collection_id text not null references collections(id) on delete cascade,
  product_id text not null references products(id) on delete cascade,
  display_order integer default 0,
  created_at timestamptz default now(),
  
  unique(collection_id, product_id)
);

-- Add indexes
create index idx_collections_store_id on collections(store_id);
create index idx_collections_slug on collections(slug);
create index idx_collections_type on collections(type);
create index idx_collections_featured on collections(is_featured) where is_featured = true;
create index idx_collection_products_collection_id on collection_products(collection_id);
create index idx_collection_products_product_id on collection_products(product_id);

-- Add unique constraint for slug per store
create unique index collections_slug_store_id_key on collections(slug, store_id);

-- Add trigger to auto-update updated_at
create or replace function update_collections_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger collections_updated_at
  before update on collections
  for each row
  execute function update_collections_updated_at();
