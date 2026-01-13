-- Create navigation_menus table for site navigation
CREATE TABLE IF NOT EXISTS navigation_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  handle TEXT NOT NULL, -- 'main', 'footer', 'header', etc.
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(store_id, handle)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_navigation_menus_store_id ON navigation_menus(store_id);
CREATE INDEX IF NOT EXISTS idx_navigation_menus_handle ON navigation_menus(store_id, handle);
CREATE INDEX IF NOT EXISTS idx_navigation_menus_active ON navigation_menus(store_id, is_active);

-- Enable RLS
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view their own navigation menus" ON navigation_menus;
CREATE POLICY "Users can view their own navigation menus"
  ON navigation_menus FOR SELECT
  USING (auth.uid() = store_id);

DROP POLICY IF EXISTS "Users can insert their own navigation menus" ON navigation_menus;
CREATE POLICY "Users can insert their own navigation menus"
  ON navigation_menus FOR INSERT
  WITH CHECK (auth.uid() = store_id);

DROP POLICY IF EXISTS "Users can update their own navigation menus" ON navigation_menus;
CREATE POLICY "Users can update their own navigation menus"
  ON navigation_menus FOR UPDATE
  USING (auth.uid() = store_id);

DROP POLICY IF EXISTS "Users can delete their own navigation menus" ON navigation_menus;
CREATE POLICY "Users can delete their own navigation menus"
  ON navigation_menus FOR DELETE
  USING (auth.uid() = store_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_navigation_menus_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_navigation_menus_updated_at_trigger ON navigation_menus;
CREATE TRIGGER update_navigation_menus_updated_at_trigger
  BEFORE UPDATE ON navigation_menus
  FOR EACH ROW
  EXECUTE FUNCTION update_navigation_menus_updated_at();

-- Add comment
COMMENT ON TABLE navigation_menus IS 'Stores site navigation menus for each store';
COMMENT ON COLUMN navigation_menus.handle IS 'Unique identifier for the menu (e.g., main, footer, header)';
COMMENT ON COLUMN navigation_menus.items IS 'Menu items in nested JSON structure with title, url, type, children';
