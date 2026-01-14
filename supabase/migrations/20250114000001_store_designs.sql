-- Create store_designs table for multi-theme support
-- Allows customers to create, manage, and switch between multiple website designs

CREATE TABLE IF NOT EXISTS store_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Design',
  is_active BOOLEAN NOT NULL DEFAULT false,
  
  -- Layout Styles
  header_style TEXT DEFAULT 'canvas',
  header_data JSONB DEFAULT '{}'::jsonb,
  hero_style TEXT DEFAULT 'impact',
  product_card_style TEXT DEFAULT 'classic',
  footer_style TEXT DEFAULT 'columns',
  scrollbar_style TEXT DEFAULT 'native',
  
  -- Colors
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#8B5CF6',
  background_color TEXT DEFAULT '#FFFFFF',
  
  -- Store Theme
  store_type TEXT,
  store_vibe TEXT DEFAULT 'minimal',
  color_palette TEXT,
  
  -- Typography
  typography JSONB DEFAULT '{
    "headingFont": "Inter",
    "bodyFont": "Inter",
    "headingColor": "#000000",
    "bodyColor": "#737373",
    "linkColor": "#3b82f6",
    "baseFontSize": "16px",
    "headingScale": "default",
    "headingWeight": "700",
    "bodyWeight": "400"
  }'::jsonb,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_store_designs_store_id ON store_designs(store_id);
CREATE INDEX IF NOT EXISTS idx_store_designs_active ON store_designs(store_id, is_active) WHERE is_active = true;

-- Create partial unique index to ensure only one active design per store
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_design 
  ON store_designs(store_id) 
  WHERE is_active = true;

-- Enable RLS
ALTER TABLE store_designs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their store designs"
  ON store_designs FOR SELECT
  USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
    OR public.is_superuser()
  );

CREATE POLICY "Users can create designs for their stores"
  ON store_designs FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
    OR public.is_superuser()
  );

CREATE POLICY "Users can update their store designs"
  ON store_designs FOR UPDATE
  USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
    OR public.is_superuser()
  );

CREATE POLICY "Users can delete their store designs"
  ON store_designs FOR DELETE
  USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
    OR public.is_superuser()
  );

-- Public read for active designs (for storefront)
CREATE POLICY "Public can view active designs"
  ON store_designs FOR SELECT
  USING (is_active = true);

-- Function to ensure only one active design per store
CREATE OR REPLACE FUNCTION ensure_single_active_design()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    -- Deactivate all other designs for this store
    UPDATE store_designs 
    SET is_active = false, updated_at = NOW()
    WHERE store_id = NEW.store_id 
      AND id != NEW.id 
      AND is_active = true;
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_active_design
  BEFORE INSERT OR UPDATE ON store_designs
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_design();

-- Migrate existing store_config design data to store_designs
-- Create one initial design for each existing store
INSERT INTO store_designs (
  store_id,
  name,
  is_active,
  header_style,
  header_data,
  hero_style,
  product_card_style,
  footer_style,
  scrollbar_style,
  primary_color,
  secondary_color,
  background_color,
  store_type,
  store_vibe,
  color_palette
)
SELECT 
  sc.store_id,
  'Default Design' as name,
  true as is_active,
  COALESCE(sc.header_style, 'canvas'),
  COALESCE(sc.header_data, '{}'::jsonb),
  COALESCE(sc.hero_style, 'impact'),
  COALESCE(sc.product_card_style, 'classic'),
  COALESCE(sc.footer_style, 'columns'),
  COALESCE(sc.scrollbar_style, 'native'),
  COALESCE(sc.primary_color, '#3b82f6'),
  COALESCE(sc.secondary_color, '#8B5CF6'),
  COALESCE(sc.background_color, '#FFFFFF'),
  sc.store_type,
  COALESCE(sc.store_vibe, 'minimal'),
  sc.color_palette
FROM store_config sc
WHERE sc.store_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE store_designs IS 'Multiple design themes per store - customers can create and switch between different designs';
COMMENT ON COLUMN store_designs.is_active IS 'Only one design can be active per store at a time';
COMMENT ON COLUMN store_designs.name IS 'User-friendly name like "Summer Theme" or "Dark Mode"';
COMMENT ON COLUMN store_designs.typography IS 'JSON object with font settings, colors, sizes, and weights';
