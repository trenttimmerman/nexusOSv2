-- Self-Evolving Design Library - Extended Tables
-- Stores AI-generated vibes and color palettes

-- Store Vibes Table
CREATE TABLE IF NOT EXISTS store_vibes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vibe_id TEXT UNIQUE NOT NULL, -- e.g., "tech-forward"
  name TEXT NOT NULL,
  description TEXT,
  mood TEXT[], -- Array of mood keywords
  color_direction TEXT,
  typography TEXT,
  target_audience TEXT,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Color Palettes Table (extended from existing)
CREATE TABLE IF NOT EXISTS color_palettes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  palette_id TEXT UNIQUE NOT NULL, -- e.g., "electric-blue-a3f2c1"
  name TEXT NOT NULL,
  vibe_id TEXT REFERENCES store_vibes(vibe_id),
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  background_color TEXT NOT NULL,
  mood TEXT,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_store_vibes_vibe_id ON store_vibes(vibe_id);
CREATE INDEX IF NOT EXISTS idx_store_vibes_usage ON store_vibes(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_color_palettes_palette_id ON color_palettes(palette_id);
CREATE INDEX IF NOT EXISTS idx_color_palettes_vibe ON color_palettes(vibe_id);
CREATE INDEX IF NOT EXISTS idx_color_palettes_usage ON color_palettes(usage_count DESC);

-- Enable RLS
ALTER TABLE store_vibes ENABLE ROW LEVEL SECURITY;
ALTER TABLE color_palettes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, authenticated insert/update
CREATE POLICY "Public can view vibes"
  ON store_vibes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert vibes"
  ON store_vibes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vibes"
  ON store_vibes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Public can view palettes"
  ON color_palettes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert palettes"
  ON color_palettes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update palettes"
  ON color_palettes FOR UPDATE
  TO authenticated
  USING (true);

-- Functions to increment usage counts
CREATE OR REPLACE FUNCTION increment_vibe_usage(vibe_id_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE store_vibes
  SET usage_count = usage_count + 1
  WHERE vibe_id = vibe_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_palette_usage(palette_id_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE color_palettes
  SET usage_count = usage_count + 1
  WHERE palette_id = palette_id_param;
END;
$$ LANGUAGE plpgsql;
