-- Migration: Convert product.category (text) to product.category_id (UUID reference)
-- Date: January 16, 2026
-- Purpose: Complete the category migration from string values to proper foreign keys

-- Step 1: Create default categories from existing product.category values
insert into categories (id, name, slug, description, is_visible)
select 
  gen_random_uuid()::text as id,
  distinct_category as name,
  lower(regexp_replace(distinct_category, '[^a-zA-Z0-9]+', '-', 'g')) as slug,
  'Auto-generated from product migration' as description,
  true as is_visible
from (
  select distinct category as distinct_category
  from products
  where category is not null 
    and category != ''
    and category not in (select name from categories)
) as unique_categories
on conflict (slug) do nothing;

-- Step 2: Update products to set category_id based on category name
update products p
set category_id = c.id
from categories c
where p.category = c.name
  and p.category_id is null
  and p.category is not null
  and p.category != '';

-- Step 3: Create a default "Uncategorized" category for products with no category
insert into categories (id, name, slug, description, is_visible)
values (
  gen_random_uuid()::text,
  'Uncategorized',
  'uncategorized',
  'Products without a specific category',
  true
)
on conflict (slug) do nothing;

-- Step 4: Set any remaining null category_id products to "Uncategorized"
update products
set category_id = (select id from categories where slug = 'uncategorized')
where category_id is null;

-- Step 5: Verification queries (commented out - run these manually to verify)
-- Check how many products have category_id set:
-- select count(*) as total_products,
--        count(category_id) as products_with_category_id,
--        count(category) as products_with_old_category
-- from products;

-- Check for any products still missing category_id:
-- select id, name, category, category_id
-- from products
-- where category_id is null
-- limit 10;

-- See all categories created:
-- select id, name, slug, (select count(*) from products where category_id = categories.id) as product_count
-- from categories
-- order by product_count desc;

-- Step 6: After verification, you can drop the old category column
-- (Uncomment only after confirming all data is migrated correctly)
-- alter table products drop column if exists category;
