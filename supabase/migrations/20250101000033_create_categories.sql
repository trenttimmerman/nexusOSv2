-- Create categories table
create table if not exists categories (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  slug text unique not null,
  description text,
  parent_id text references categories(id) on delete set null,
  display_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add index for parent_id lookups (for hierarchical queries)
create index idx_categories_parent_id on categories(parent_id);

-- Add index for slug lookups
create index idx_categories_slug on categories(slug);

-- Add trigger to auto-update updated_at
create or replace function update_categories_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger categories_updated_at
  before update on categories
  for each row
  execute function update_categories_updated_at();

-- Add category_id column to products
alter table products add column if not exists category_id text references categories(id) on delete set null;

-- Create index for category_id lookups
create index idx_products_category_id on products(category_id);

-- Note: We keep the old 'category' text column for now to allow gradual migration
-- Once all products are migrated, we can drop it with:
-- alter table products drop column category;
