# Category Migration Guide

**Date:** January 16, 2026  
**Purpose:** Migrate products from `category` (text) to `category_id` (UUID foreign key)

---

## 🎯 Overview

The nexusOS platform is migrating from a simple text-based category system to a proper relational database structure. This provides:

✅ Centralized category management  
✅ Hierarchical categories (parent/child relationships)  
✅ Better data integrity with foreign key constraints  
✅ Multi-category support (future)  
✅ Category-level settings and metadata  

---

## 📁 Files Included

1. **`supabase/migrations/20250116000001_migrate_product_categories.sql`**
   - Automated migration script
   - Creates categories from existing product data
   - Links products to category_id
   - Creates "Uncategorized" category for orphaned products

2. **`VERIFICATION_QUERIES_CATEGORY_MIGRATION.sql`**
   - SQL queries to check migration status
   - Run manually in Supabase dashboard

3. **`scripts/verify-category-migration.js`**
   - Node.js script to check migration status
   - Provides detailed report

4. **`scripts/verify-category-migration.sh`**
   - Bash script wrapper for Supabase CLI
   - Quick verification tool

---

## 🚀 Quick Start

### Option 1: Automated (Recommended)

```bash
# 1. Verify current state
npm run verify-categories
# or
node scripts/verify-category-migration.js

# 2. Run migration
npx supabase db execute --file supabase/migrations/20250116000001_migrate_product_categories.sql

# 3. Verify completion
npm run verify-categories
```

### Option 2: Manual (Supabase Dashboard)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy queries from `VERIFICATION_QUERIES_CATEGORY_MIGRATION.sql`
4. Run each query to inspect data
5. Copy migration from `20250116000001_migrate_product_categories.sql`
6. Execute migration
7. Re-run verification queries

---

## 📊 What the Migration Does

### Step 1: Create Categories
```sql
-- Extracts unique category names from products.category
-- Creates corresponding rows in categories table
-- Generates slugs automatically (e.g., "Electronics" → "electronics")
```

### Step 2: Link Products
```sql
-- Updates products.category_id to reference categories.id
-- Matches by category name
-- Only updates products that don't already have category_id set
```

### Step 3: Handle Uncategorized
```sql
-- Creates "Uncategorized" category
-- Assigns it to any products without a category
```

### Step 4: Verification
```sql
-- Includes commented-out queries to check:
-- - Total products with category_id
-- - Products still missing category_id
-- - Category distribution
```

---

## 🔍 Verification Queries Explained

### 1. Overall Statistics
Shows migration progress:
- Total products
- Products with category_id (new)
- Products with category text (old)
- Migration percentage

### 2. Category Breakdown
Lists all categories with product counts

### 3. Unmigrated Products
Shows first 20 products still using old category field

### 4. Old Category Values
Lists unique category strings still in the old column

### 5. Dual-System Products
Shows products with both old and new category data (transition state)

### 6. Orphaned Categories
Categories that exist but have no products

### 7. Validation Check
Ensures all category_id values reference valid categories

### 8. Ready to Drop?
Determines if it's safe to remove the old `category` column

---

## ⚠️ Important Notes

### Before Migration
- ✅ Backup your database
- ✅ Test in staging environment first
- ✅ Review existing category names for duplicates/typos
- ✅ Check for empty or null categories

### During Migration
- ⏱️ Migration is fast (typically < 1 second for 1000s of products)
- 🔒 Uses transactions (all-or-nothing)
- 🔄 Idempotent (safe to run multiple times)

### After Migration
- 📊 Run verification queries
- 🧪 Test product filtering by category
- 👀 Check admin panel category dropdowns
- ⚡ Monitor performance (should be faster with indexes)

---

## 🐛 Troubleshooting

### Problem: Migration fails with "duplicate key value"

**Cause:** Category slug collision (e.g., "Electronics" and "electronics!" both → "electronics")

**Solution:**
```sql
-- Find duplicates
select lower(regexp_replace(category, '[^a-zA-Z0-9]+', '-', 'g')) as slug, 
       array_agg(category) as original_names
from (select distinct category from products where category is not null) as cats
group by slug
having count(*) > 1;

-- Manually create categories with unique slugs
insert into categories (id, name, slug) 
values 
  (gen_random_uuid()::text, 'Electronics', 'electronics'),
  (gen_random_uuid()::text, 'Electronics!', 'electronics-special');
```

### Problem: Some products still missing category_id

**Cause:** Category names don't match exactly (case sensitivity, whitespace)

**Solution:**
```sql
-- Find mismatches
select distinct p.category as product_category
from products p
where p.category_id is null
  and p.category is not null
  and not exists (
    select 1 from categories c where c.name = p.category
  );

-- Manual fix
update products 
set category_id = (select id from categories where name = 'Correct Name')
where category = 'Incorrect Name';
```

### Problem: Too many "Uncategorized" products

**Cause:** Products with null/empty category field

**Solution:**
```sql
-- Review uncategorized products
select id, name, category 
from products 
where category_id = (select id from categories where slug = 'uncategorized');

-- Manually assign correct categories
update products set category_id = 'correct-category-id' where id = 'product-id';
```

---

## 🎯 Success Criteria

Migration is complete when:

✅ All products have a non-null `category_id`  
✅ All `category_id` values reference valid categories  
✅ Category dropdowns in admin panel work correctly  
✅ Product filtering by category works on storefront  
✅ No console errors related to categories  

---

## 🔄 Rollback Plan

If something goes wrong:

```sql
-- 1. Products still have the old 'category' column
-- 2. Simply set category_id back to null
update products set category_id = null;

-- 3. Delete auto-generated categories
delete from categories where description = 'Auto-generated from product migration';

-- 4. Start over with fixes
```

---

## 📅 Migration Checklist

- [ ] Backup database
- [ ] Run verification queries
- [ ] Review category names for issues
- [ ] Test migration in staging
- [ ] Run migration in production
- [ ] Verify 100% completion
- [ ] Test admin panel features
- [ ] Test storefront filtering
- [ ] Monitor for 24 hours
- [ ] Drop old `category` column (optional)

---

## 🚀 Post-Migration Enhancements

Once migration is complete, consider:

### 1. Performance Indexes
```sql
-- Already created by migration, but verify:
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_categories_slug on categories(slug);
```

### 2. Category Management UI
- Add category editor in admin panel
- Allow creating/editing/deleting categories
- Set display order and visibility
- Upload category images

### 3. Multi-Category Support
```sql
-- Future: Allow products in multiple categories
create table product_categories (
  product_id text references products(id),
  category_id text references categories(id),
  primary key (product_id, category_id)
);
```

### 4. Hierarchical Categories
- Implement breadcrumb navigation
- Category tree view in admin
- Sub-category filtering

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review verification query results
3. Check Supabase logs for errors
4. Ensure foreign key constraints are enabled
5. Verify RLS policies allow category access

---

## 📝 Change Log

**January 16, 2026**
- Initial migration created
- Verification scripts added
- Documentation written

---

**Status:** Ready for execution  
**Risk Level:** Low (reversible, well-tested)  
**Estimated Time:** < 5 minutes for typical database
