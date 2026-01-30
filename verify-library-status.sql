-- Verification Script for Self-Evolving Component Library
-- Run this in Supabase SQL Editor to check current status
-- Date: January 30, 2026

-- 1. Check if table exists and row count
SELECT 
  'component_library table exists' as status,
  COUNT(*) as total_components
FROM component_library;

-- 2. See latest components
SELECT 
  name,
  type,
  variant_id,
  category,
  jsonb_array_length(editable_fields) as num_fields,
  metadata->>'usage_count' as uses,
  metadata->>'source' as source,
  created_at
FROM component_library
ORDER BY created_at DESC
LIMIT 10;

-- 3. Group by type
SELECT 
  type,
  COUNT(*) as count,
  AVG((metadata->>'usage_count')::int) as avg_uses
FROM component_library
GROUP BY type
ORDER BY count DESC;

-- 4. Group by category
SELECT 
  category,
  COUNT(*) as count
FROM component_library
GROUP BY category
ORDER BY count DESC;

-- 5. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'component_library';

-- 6. Check functions exist
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('increment_component_usage', 'calculate_block_similarity');
