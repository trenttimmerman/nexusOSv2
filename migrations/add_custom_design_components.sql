-- Create custom_headers table for AI-generated header designs
CREATE TABLE IF NOT EXISTS custom_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  component_jsx TEXT,
  edit_controls JSONB DEFAULT '[]'::jsonb,
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create custom_sections table for AI-generated section designs
CREATE TABLE IF NOT EXISTS custom_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL, -- hero, features, gallery, content, etc.
  variant_name TEXT NOT NULL,
  html TEXT,
  edit_controls JSONB DEFAULT '[]'::jsonb,
  preview_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_headers_store_id ON custom_headers(store_id);
CREATE INDEX IF NOT EXISTS idx_custom_sections_store_id ON custom_sections(store_id);
CREATE INDEX IF NOT EXISTS idx_custom_sections_type ON custom_sections(section_type);

-- Enable RLS
ALTER TABLE custom_headers ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_headers
CREATE POLICY "Users can view their own custom headers"
  ON custom_headers FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own custom headers"
  ON custom_headers FOR INSERT
  WITH CHECK (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own custom headers"
  ON custom_headers FOR UPDATE
  USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own custom headers"
  ON custom_headers FOR DELETE
  USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

-- RLS Policies for custom_sections
CREATE POLICY "Users can view their own custom sections"
  ON custom_sections FOR SELECT
  USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own custom sections"
  ON custom_sections FOR INSERT
  WITH CHECK (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own custom sections"
  ON custom_sections FOR UPDATE
  USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own custom sections"
  ON custom_sections FOR DELETE
  USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));
