-- Verification Queries for Component Library Seeding
-- Run after executing seed script to validate results

-- 1. Total component count
SELECT COUNT(*) as total_components FROM component_library;

-- 2. Components by type
SELECT 
  type,
  COUNT(*) as count,
  AVG((metadata->>'popularity')::int) as avg_popularity
FROM component_library
WHERE metadata->>'source' = 'foundation'
GROUP BY type
ORDER BY count DESC;

-- 3. Components by category
SELECT 
  category,
  COUNT(*) as count
FROM component_library
GROUP BY category
ORDER BY count DESC;

-- 4. Check for missing editable_fields
SELECT 
  type,
  variant_id,
  name,
  jsonb_array_length(editable_fields) as field_count
FROM component_library
WHERE jsonb_array_length(editable_fields) = 0
ORDER BY type, variant_id;

-- 5. Verify expected counts (based on research)
SELECT 
  'hero' as expected_type, 8 as expected_count, COUNT(*) as actual_count 
FROM component_library WHERE type = 'hero'
UNION ALL
SELECT 'header', 5, COUNT(*) FROM component_library WHERE type = 'header'
UNION ALL
SELECT 'footer', 14, COUNT(*) FROM component_library WHERE type = 'footer'
UNION ALL
SELECT 'product-card', 6, COUNT(*) FROM component_library WHERE type = 'product-card'
UNION ALL
SELECT 'section-*', 14, COUNT(*) FROM component_library WHERE type LIKE 'section-%';

-- 6. Sample data inspection (first 5 components)
SELECT 
  type,
  variant_id,
  name,
  category,
  jsonb_array_length(editable_fields) as fields,
  metadata->>'popularity' as popularity,
  metadata->>'source' as source
FROM component_library
ORDER BY type, variant_id
LIMIT 5;

-- 7. Check for duplicates (should return 0 rows)
SELECT type, variant_id, COUNT(*)
FROM component_library
GROUP BY type, variant_id
HAVING COUNT(*) > 1;

-- 8. Validate JSONB structure
SELECT 
  type,
  variant_id,
  CASE 
    WHEN template ? 'type' AND template ? 'variant' THEN '✓ Valid'
    ELSE '❌ Invalid'
  END as template_structure,
  CASE
    WHEN jsonb_typeof(editable_fields) = 'array' THEN '✓ Valid'
    ELSE '❌ Invalid'
  END as fields_structure
FROM component_library
WHERE template IS NULL 
   OR jsonb_typeof(editable_fields) != 'array'
LIMIT 10;
