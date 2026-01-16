#!/bin/bash

# Category Migration Verification Script
# Checks the current state of product category migration using Supabase CLI
# Run with: bash scripts/verify-category-migration.sh

echo "🔍 Category Migration Verification Report"
echo "============================================================"
echo ""

echo "📊 OVERALL STATISTICS"
echo "------------------------------------------------------------"
npx supabase db execute --file VERIFICATION_QUERIES_CATEGORY_MIGRATION.sql --output table 2>/dev/null || {
    echo "⚠️  Could not connect to Supabase via CLI"
    echo ""
    echo "Alternative: Run queries manually in Supabase Dashboard"
    echo "1. Go to your Supabase project dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Copy and paste queries from: VERIFICATION_QUERIES_CATEGORY_MIGRATION.sql"
    echo ""
    echo "Or run the Node.js script:"
    echo "  node scripts/verify-category-migration.js"
    exit 1
}

echo ""
echo "============================================================"
echo "✅ Verification complete"
echo ""
echo "Next steps:"
echo "1. Review the results above"
echo "2. If products need migration, run:"
echo "   npx supabase db execute --file supabase/migrations/20250116000001_migrate_product_categories.sql"
echo "3. Re-run this verification script to confirm"
echo "4. Once 100% migrated, you can drop the old 'category' column"
