-- Check for recently created AI-generated pages
SELECT 
  id,
  store_id,
  title,
  slug,
  type,
  jsonb_array_length(blocks) as block_count,
  blocks::text as blocks_preview,
  created_at
FROM pages
WHERE id LIKE 'ai_page_%'
ORDER BY created_at DESC
LIMIT 5;
