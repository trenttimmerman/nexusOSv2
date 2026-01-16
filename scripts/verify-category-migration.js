#!/usr/bin/env node

/**
 * Category Migration Verification Script
 * Checks the current state of product category migration
 * Run with: node scripts/verify-category-migration.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runVerification() {
  console.log('🔍 Category Migration Verification Report');
  console.log('=' .repeat(60));
  console.log('');

  // 1. Overall statistics
  console.log('📊 OVERALL STATISTICS');
  console.log('-'.repeat(60));
  const { data: stats, error: statsError } = await supabase.rpc('get_migration_stats', {});
  
  // Fallback to direct query if RPC doesn't exist
  const { data: products } = await supabase
    .from('products')
    .select('id, category, category_id');

  const total = products?.length || 0;
  const withCategoryId = products?.filter(p => p.category_id).length || 0;
  const withOldCategory = products?.filter(p => p.category).length || 0;
  const missingCategoryId = total - withCategoryId;
  const percentMigrated = total > 0 ? ((withCategoryId / total) * 100).toFixed(2) : 0;

  console.log(`Total products: ${total}`);
  console.log(`Products with category_id: ${withCategoryId}`);
  console.log(`Products with old category: ${withOldCategory}`);
  console.log(`Products missing category_id: ${missingCategoryId}`);
  console.log(`Migration progress: ${percentMigrated}%`);
  console.log('');

  // 2. Category breakdown
  console.log('📁 CATEGORY BREAKDOWN');
  console.log('-'.repeat(60));
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, is_visible');

  if (categories) {
    for (const cat of categories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id);
      
      console.log(`${cat.name} (${cat.slug}): ${count || 0} products${!cat.is_visible ? ' [HIDDEN]' : ''}`);
    }
  }
  console.log('');

  // 3. Unmigrated products
  if (missingCategoryId > 0) {
    console.log('⚠️  UNMIGRATED PRODUCTS');
    console.log('-'.repeat(60));
    const unmigrated = products
      ?.filter(p => !p.category_id && p.category)
      .slice(0, 10);

    if (unmigrated && unmigrated.length > 0) {
      unmigrated.forEach(p => {
        console.log(`- ${p.id}: Old category = "${p.category}"`);
      });
      if (missingCategoryId > 10) {
        console.log(`... and ${missingCategoryId - 10} more`);
      }
    }
    console.log('');
  }

  // 4. Unique old category values
  console.log('🏷️  OLD CATEGORY VALUES STILL IN USE');
  console.log('-'.repeat(60));
  const uniqueOldCategories = products
    ?.filter(p => p.category)
    .reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

  if (uniqueOldCategories && Object.keys(uniqueOldCategories).length > 0) {
    Object.entries(uniqueOldCategories)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`"${cat}": ${count} products`);
      });
  } else {
    console.log('✅ No old category values in use');
  }
  console.log('');

  // 5. Orphaned categories
  console.log('👻 ORPHANED CATEGORIES (no products)');
  console.log('-'.repeat(60));
  let orphanCount = 0;
  if (categories) {
    for (const cat of categories) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', cat.id);
      
      if (count === 0) {
        console.log(`- ${cat.name} (${cat.slug})`);
        orphanCount++;
      }
    }
  }
  if (orphanCount === 0) {
    console.log('✅ No orphaned categories');
  }
  console.log('');

  // 6. Final recommendation
  console.log('🎯 RECOMMENDATION');
  console.log('-'.repeat(60));
  if (missingCategoryId === 0) {
    console.log('✅ All products have been migrated to category_id');
    console.log('✅ Safe to drop the old "category" column');
    console.log('');
    console.log('Next steps:');
    console.log('1. Run migration: supabase/migrations/20250116000001_migrate_product_categories.sql');
    console.log('2. Test thoroughly in staging');
    console.log('3. Deploy to production');
    console.log('4. Monitor for any issues');
  } else {
    console.log(`⚠️  ${missingCategoryId} products still need migration`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Run migration: supabase/migrations/20250116000001_migrate_product_categories.sql');
    console.log('2. This will:');
    console.log('   - Create categories from existing product.category values');
    console.log('   - Link products to category_id');
    console.log('   - Create "Uncategorized" for products without a category');
    console.log('3. Re-run this verification script');
    console.log('4. Once 100% migrated, drop the old category column');
  }
  console.log('');
  console.log('=' .repeat(60));
}

runVerification().catch(error => {
  console.error('❌ Error running verification:', error.message);
  process.exit(1);
});
