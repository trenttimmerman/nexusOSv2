-- Component Library Verification Queries
-- Run these after applying the migration to verify everything works

-- ============================================
-- PART 1: VERIFY TABLE STRUCTURE
-- ============================================

-- Check table exists and view columns
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'component_library'
ORDER BY ordinal_position;

-- Expected: 10 columns (id, type, variant_id, name, category, template, editable_fields, thumbnail_url, metadata, created_at, updated_at)


-- ============================================
-- PART 2: VERIFY FUNCTIONS CREATED
-- ============================================

-- Check functions exist
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name IN ('increment_component_usage', 'calculate_block_similarity')
  AND routine_schema = 'public';

-- Expected: 2 functions (increment_component_usage returns void, calculate_block_similarity returns numeric)


-- ============================================
-- PART 3: VERIFY INDEXES CREATED
-- ============================================

-- Check indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'component_library';

-- Expected: 5+ indexes (PK + type + category + usage_count + created_at)


-- ============================================
-- PART 4: VERIFY RLS POLICIES
-- ============================================

-- Check RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'component_library';

-- Expected: 3 policies (select for authenticated, insert/update for service_role)


-- ============================================
-- PART 5: VERIFY CONSTRAINTS
-- ============================================

-- Check unique constraint on type + variant_id
SELECT
  constraint_name,
  constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'component_library';

-- Expected: Primary key + unique constraint on (type, variant_id)


-- ============================================
-- PART 6: TEST FUNCTIONS
-- ============================================

-- Test similarity function (should return 1.0 for identical objects)
SELECT calculate_block_similarity(
  '{"type": "hero", "data": {"heading": "Test"}}'::jsonb,
  '{"type": "hero", "data": {"heading": "Test"}}'::jsonb
) as similarity_identical;

-- Expected: 1.0

-- Test similarity function (should return < 1.0 for different objects)
SELECT calculate_block_similarity(
  '{"type": "hero", "data": {"heading": "Test"}}'::jsonb,
  '{"type": "footer", "data": {"copyright": "2024"}}'::jsonb
) as similarity_different;

-- Expected: < 1.0 (something like 0.33 or 0.5)


-- ============================================
-- PART 7: INSERT TEST COMPONENT
-- ============================================

-- Insert a test component
INSERT INTO component_library (
  type,
  variant_id,
  name,
  category,
  template,
  editable_fields,
  metadata
) VALUES (
  'hero',
  'test-minimal',
  'Test Minimal Hero',
  'layout',
  '{
    "type": "system-hero",
    "variant": "test-minimal",
    "data": {
      "heading": "{{heading}}",
      "subheading": "{{subheading}}",
      "ctaText": "{{ctaText}}"
    }
  }'::jsonb,
  '[
    {
      "type": "text",
      "label": "Heading",
      "path": "data.heading",
      "placeholder": "Enter heading"
    },
    {
      "type": "text",
      "label": "Subheading",
      "path": "data.subheading",
      "placeholder": "Enter subheading"
    },
    {
      "type": "text",
      "label": "CTA Text",
      "path": "data.ctaText",
      "placeholder": "Enter button text"
    }
  ]'::jsonb,
  '{
    "usage_count": 1,
    "source": "manual-test",
    "rating": 5
  }'::jsonb
)
RETURNING id, name, type, variant_id;

-- Expected: Returns the inserted component with ID


-- ============================================
-- PART 8: VERIFY INSERT WORKED
-- ============================================

-- Check the test component was inserted
SELECT 
  id,
  name,
  type,
  variant_id,
  category,
  jsonb_array_length(editable_fields) as num_editable_fields,
  metadata->>'usage_count' as usage_count,
  metadata->>'source' as source,
  created_at
FROM component_library
WHERE variant_id = 'test-minimal';

-- Expected: 1 row with test-minimal variant


-- ============================================
-- PART 9: TEST USAGE INCREMENT
-- ============================================

-- Get the component ID (replace with actual ID from previous query)
-- SELECT increment_component_usage('YOUR-UUID-HERE');

-- Then verify usage count increased:
-- SELECT metadata->>'usage_count' FROM component_library WHERE variant_id = 'test-minimal';
-- Expected: 2 (was 1, now incremented)


-- ============================================
-- PART 10: CLEANUP TEST DATA
-- ============================================

-- Delete the test component
DELETE FROM component_library WHERE variant_id = 'test-minimal';

-- Verify deleted
SELECT COUNT(*) as remaining_test_components 
FROM component_library 
WHERE variant_id = 'test-minimal';

-- Expected: 0


-- ============================================
-- PART 11: CHECK CURRENT STATE
-- ============================================

-- View all components (should be empty if this is first run)
SELECT 
  name,
  type,
  variant_id,
  category,
  metadata->>'usage_count' as uses,
  created_at
FROM component_library
ORDER BY created_at DESC
LIMIT 20;

-- Expected: Empty result set (or components from AI generations if already run)


-- ============================================
-- PART 12: MONITORING QUERIES (Save for Later)
-- ============================================

-- Total components
-- SELECT COUNT(*) as total FROM component_library;

-- Components by type
-- SELECT type, COUNT(*) as count FROM component_library GROUP BY type ORDER BY count DESC;

-- Components by category
-- SELECT category, COUNT(*) as count FROM component_library GROUP BY category ORDER BY count DESC;

-- Most popular components
-- SELECT name, type, metadata->>'usage_count' as uses 
-- FROM component_library 
-- ORDER BY (metadata->>'usage_count')::int DESC 
-- LIMIT 10;

-- Recent additions
-- SELECT name, type, created_at 
-- FROM component_library 
-- ORDER BY created_at DESC 
-- LIMIT 10;


-- ============================================
-- ✅ VERIFICATION COMPLETE
-- ============================================
-- If all queries above execute without errors:
-- ✅ Table structure is correct
-- ✅ Functions are working
-- ✅ Indexes are in place
-- ✅ RLS policies are active
-- ✅ Ready for AI extraction!
