-- Category Migration Verification Queries
-- Run these queries to check the current state of the migration
-- Date: January 16, 2026

-- ========================================
-- 1. OVERALL STATISTICS
-- ========================================

-- Count products with/without category_id
select 
  count(*) as total_products,
  count(category_id) as products_with_category_id,
  count(category) as products_with_old_category,
  count(*) - count(category_id) as products_missing_category_id,
  round(100.0 * count(category_id) / count(*), 2) as percent_migrated
from products;

-- ========================================
-- 2. CATEGORY USAGE BREAKDOWN
-- ========================================

-- Show all categories and their product counts
select 
  c.id,
  c.name,
  c.slug,
  c.is_visible,
  count(p.id) as product_count
from categories c
left join products p on p.category_id = c.id
group by c.id, c.name, c.slug, c.is_visible
order by product_count desc;

-- ========================================
-- 3. UNMIGRATED PRODUCTS
-- ========================================

-- Products with old category but no category_id
select 
  id,
  name,
  category as old_category_string,
  category_id
from products
where category_id is null
  and category is not null
  and category != ''
order by name
limit 20;

-- ========================================
-- 4. OLD CATEGORY VALUES
-- ========================================

-- Unique category strings still in use (old column)
select 
  category as old_category_value,
  count(*) as product_count
from products
where category is not null and category != ''
group by category
order by product_count desc;

-- ========================================
-- 5. PRODUCTS WITH BOTH OLD AND NEW
-- ========================================

-- Products that have both category (old) and category_id (new)
select 
  p.id,
  p.name,
  p.category as old_value,
  c.name as new_category_name,
  c.id as category_id
from products p
left join categories c on p.category_id = c.id
where p.category is not null 
  and p.category != ''
  and p.category_id is not null
limit 20;

-- ========================================
-- 6. ORPHANED CATEGORIES
-- ========================================

-- Categories with no products assigned
select 
  id,
  name,
  slug,
  created_at
from categories
where id not in (
  select distinct category_id 
  from products 
  where category_id is not null
)
order by created_at desc;

-- ========================================
-- 7. VALIDATION CHECK
-- ========================================

-- Verify all category_id values reference valid categories
select 
  count(*) as invalid_references
from products p
where p.category_id is not null
  and not exists (
    select 1 from categories c where c.id = p.category_id
  );

-- Should return 0 - if > 0, there are broken foreign key references

-- ========================================
-- 8. READY TO DROP OLD COLUMN?
-- ========================================

-- Check if we can safely drop the old 'category' column
-- Returns 'YES' if all products are migrated, 'NO' if not
select 
  case 
    when count(*) filter (where category_id is null) = 0 
    then 'YES - Safe to drop old category column'
    else 'NO - ' || count(*) filter (where category_id is null) || ' products still need migration'
  end as can_drop_old_column
from products;
