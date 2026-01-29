# Self-Evolving Library - Activation Steps

## Step 1: Apply Database Migration ⚡

### Option A: Supabase Dashboard (Recommended)
1. Open your Supabase project: https://app.supabase.com
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `component_library_migration.sql`
5. Paste into the editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for success message: "Success. No rows returned"

### Option B: Command Line (if you have direct DB access)
```bash
psql $DATABASE_URL -f component_library_migration.sql
```

## Step 2: Verify Migration Applied ✅

Run this query in Supabase SQL Editor:

```sql
-- Check table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'component_library'
ORDER BY ordinal_position;

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('increment_component_usage', 'calculate_block_similarity');

-- Verify indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'component_library';
```

Expected output:
- 10 columns in component_library table
- 2 functions created
- 4+ indexes created

## Step 3: Test Component Extraction 🧪

### A. Generate AI Website
1. Open your NexusOS admin panel
2. Go to **AI Website Builder** section
3. Enter a business description: "Modern coffee shop in Brooklyn"
4. Click **Generate Website**
5. Wait for generation to complete

### B. Check Console Logs
Open browser DevTools (F12) → Console tab

Look for these messages:
```
[DesignWizard] Extracting components to library...
[DesignWizard] Component extraction complete: {
  extracted: 5,
  skipped: 2,
  errors: []
}
```

### C. Verify Components in Database
Run this query in Supabase:

```sql
SELECT 
  id,
  name,
  type,
  variant_id,
  category,
  metadata->>'usage_count' as uses,
  metadata->>'source' as source,
  created_at
FROM component_library
ORDER BY created_at DESC
LIMIT 10;
```

Expected: You should see 3-8 new components extracted from the AI generation!

## Step 4: Test Component Library Browser 🎨

### Option A: Direct Test (Create Test Page)
1. Create a test page to use ComponentLibraryBrowser
2. Import and render:
```tsx
import ComponentLibraryBrowser from './components/ComponentLibraryBrowser';

<ComponentLibraryBrowser
  type="hero"
  onSelect={(component) => {
    console.log('Selected component:', component);
  }}
/>
```

### Option B: Integration Test
1. Modify DesignWizard to use ComponentLibraryBrowser instead of hardcoded libraries
2. This would be Phase 2 of the implementation

## Step 5: Monitor Growth 📈

After activating, monitor these metrics:

```sql
-- Total components in library
SELECT COUNT(*) as total_components FROM component_library;

-- Components by type
SELECT type, COUNT(*) as count 
FROM component_library 
GROUP BY type 
ORDER BY count DESC;

-- Components by category
SELECT category, COUNT(*) as count 
FROM component_library 
GROUP BY category 
ORDER BY count DESC;

-- Most popular components
SELECT name, type, metadata->>'usage_count' as uses
FROM component_library
ORDER BY (metadata->>'usage_count')::int DESC
LIMIT 10;

-- Recent additions
SELECT name, type, created_at
FROM component_library
ORDER BY created_at DESC
LIMIT 10;
```

## Troubleshooting 🔧

### Migration Fails
**Error**: "relation already exists"
```sql
-- Drop existing table and retry
DROP TABLE IF EXISTS component_library CASCADE;
-- Then re-run migration
```

### No Components Extracted
**Check**:
1. Console logs for errors
2. Supabase credentials in .env
3. RLS policies enabled
4. Service role key (not anon key) being used

**Debug Query**:
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'component_library';
```

### Components Not Appearing in Browser
**Check**:
1. Type filter matches component type
2. No search term filtering results
3. Database connection working
4. Browser console for errors

**Test Query**:
```sql
-- Verify you can read components
SELECT * FROM component_library LIMIT 1;
```

## Success Indicators ✨

✅ Migration applied without errors  
✅ Console shows "extracted: X" after AI generation  
✅ Database query returns new components  
✅ Component names auto-generated (e.g., "Modern Hero")  
✅ Editable fields populated (check editable_fields JSONB)  
✅ Usage count starts at 1  
✅ Source marked as "ai-generated"  

## Next Phase: Integration 🚀

Once verified working:

1. **Replace Hardcoded Libraries**
   - Update DesignWizard hero section to use ComponentLibraryBrowser
   - Update header section
   - Update footer section
   - Update product cards section

2. **Add Thumbnail Generation**
   - Screenshot components on creation
   - Upload to Supabase Storage
   - Update thumbnail_url field

3. **Implement Smart Recommendations**
   - "Users who picked this also picked..."
   - Suggest components by vibe/style

---

**Status**: Ready to activate  
**Estimated Time**: 5-10 minutes  
**Impact**: Self-evolving design library activated  
