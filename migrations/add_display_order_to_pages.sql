-- Add display_order column to pages table for navigation ordering
ALTER TABLE pages ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Set initial display_order based on creation order
UPDATE pages SET display_order = 0 WHERE slug = 'home' OR title ILIKE '%home%';
UPDATE pages SET display_order = 1 WHERE slug = 'about' OR title ILIKE '%about%';

-- Create index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_pages_display_order ON pages (store_id, display_order);

-- Comment for documentation
COMMENT ON COLUMN pages.display_order IS 'Order in which page appears in navigation (0 = first)';
