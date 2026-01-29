-- Component Library Migration
-- Self-Evolving Design System: Auto-populate library from AI generations

-- Create component_library table
CREATE TABLE IF NOT EXISTS component_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Component identification
  type TEXT NOT NULL,  -- 'hero', 'rich-text', 'product-grid', 'features', 'testimonials', 'gallery', 'cta', 'contact', 'header', 'footer'
  variant_id TEXT NOT NULL,  -- The variant identifier (e.g., 'aurora', 'minimal', 'centered')
  name TEXT NOT NULL,  -- Human-readable name (auto-generated or user-edited)
  category TEXT,  -- 'layout', 'content', 'commerce', 'forms', etc.
  
  -- Component template
  template JSONB NOT NULL,  -- PageBlock structure with {{placeholders}} for dynamic content
  
  -- Auto-generated editing metadata
  editable_fields JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array of {type, label, path, options}
  
  -- Visual assets
  thumbnail_url TEXT,  -- Screenshot or preview image URL
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,  -- {usage_count, rating, source: 'ai-generated' | 'user-created', original_store_id}
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Uniqueness constraint: one variant per type
  CONSTRAINT unique_type_variant UNIQUE (type, variant_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_component_library_type ON component_library(type);
CREATE INDEX IF NOT EXISTS idx_component_library_category ON component_library(category);
CREATE INDEX IF NOT EXISTS idx_component_library_usage_count ON component_library((metadata->>'usage_count'));
CREATE INDEX IF NOT EXISTS idx_component_library_created_at ON component_library(created_at DESC);

-- Enable RLS (Row Level Security) for multi-tenant safety
ALTER TABLE component_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (allows re-running migration)
DROP POLICY IF EXISTS "Anyone can view component library" ON component_library;
DROP POLICY IF EXISTS "Service role can insert components" ON component_library;
DROP POLICY IF EXISTS "Service role can update components" ON component_library;
DROP POLICY IF EXISTS "Authenticated users can insert components" ON component_library;
DROP POLICY IF EXISTS "Authenticated users can update components" ON component_library;

-- Policy: All authenticated users can read components
CREATE POLICY "Anyone can view component library"
  ON component_library
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert components (AI generation from admin panel)
CREATE POLICY "Authenticated users can insert components"
  ON component_library
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update (for usage counts, ratings)
CREATE POLICY "Authenticated users can update components"
  ON component_library
  FOR UPDATE
  TO authenticated
  USING (true);

-- Function to update usage count when component is used
CREATE OR REPLACE FUNCTION increment_component_usage(component_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE component_library
  SET metadata = jsonb_set(
    metadata,
    '{usage_count}',
    to_jsonb(COALESCE((metadata->>'usage_count')::int, 0) + 1)
  ),
  updated_at = CURRENT_TIMESTAMP
  WHERE id = component_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate similarity between two JSONB objects (0-1 score)
CREATE OR REPLACE FUNCTION calculate_block_similarity(block1 JSONB, block2 JSONB)
RETURNS NUMERIC AS $$
DECLARE
  block1_text TEXT;
  block2_text TEXT;
  common_keys INT;
  total_keys INT;
BEGIN
  -- Simple similarity based on shared JSON structure
  -- Convert to text and compare key overlap
  block1_text := block1::TEXT;
  block2_text := block2::TEXT;
  
  -- If blocks are identical, return 1
  IF block1_text = block2_text THEN
    RETURN 1.0;
  END IF;
  
  -- Count shared keys at top level
  common_keys := (
    SELECT COUNT(*)
    FROM (
      SELECT jsonb_object_keys(block1)
      INTERSECT
      SELECT jsonb_object_keys(block2)
    ) AS shared
  );
  
  total_keys := (
    SELECT COUNT(DISTINCT key)
    FROM (
      SELECT jsonb_object_keys(block1) AS key
      UNION
      SELECT jsonb_object_keys(block2) AS key
    ) AS all_keys
  );
  
  -- Return Jaccard similarity
  IF total_keys = 0 THEN
    RETURN 0.0;
  END IF;
  
  RETURN common_keys::NUMERIC / total_keys::NUMERIC;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Seed initial components from existing hardcoded libraries (optional)
-- This can be run separately to migrate existing components

COMMENT ON TABLE component_library IS 'Self-evolving component library populated from AI generations';
COMMENT ON COLUMN component_library.template IS 'PageBlock structure with {{placeholders}} for reusable templates';
COMMENT ON COLUMN component_library.editable_fields IS 'Auto-generated array of editable field definitions for dynamic forms';
COMMENT ON COLUMN component_library.metadata IS 'Contains usage_count, rating, source, and other metrics';
