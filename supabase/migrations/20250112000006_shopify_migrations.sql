-- Create shopify_migrations table to track theme migrations
CREATE TABLE IF NOT EXISTS shopify_migrations (
  id TEXT PRIMARY KEY,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  theme_name TEXT NOT NULL,
  theme_version TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'analyzing', 'preview', 'mapping', 'importing', 'completed', 'failed'
  original_zip_url TEXT, -- Supabase Storage URL for theme ZIP
  migration_data JSONB, -- Parsed theme structure
  warnings JSONB, -- Array of warning messages
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on store_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_shopify_migrations_store_id ON shopify_migrations(store_id);
CREATE INDEX IF NOT EXISTS idx_shopify_migrations_status ON shopify_migrations(status);

-- Add RLS policies
ALTER TABLE shopify_migrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own store's migrations
DROP POLICY IF EXISTS "Users can view own store migrations" ON shopify_migrations;
CREATE POLICY "Users can view own store migrations" ON shopify_migrations
  FOR SELECT
  USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Users can insert migrations for their own store
DROP POLICY IF EXISTS "Users can insert own store migrations" ON shopify_migrations;
CREATE POLICY "Users can insert own store migrations" ON shopify_migrations
  FOR INSERT
  WITH CHECK (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Users can update their own store's migrations
DROP POLICY IF EXISTS "Users can update own store migrations" ON shopify_migrations;
CREATE POLICY "Users can update own store migrations" ON shopify_migrations
  FOR UPDATE
  USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Users can delete their own store's migrations
DROP POLICY IF EXISTS "Users can delete own store migrations" ON shopify_migrations;
CREATE POLICY "Users can delete own store migrations" ON shopify_migrations
  FOR DELETE
  USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Create storage bucket for theme assets (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('theme-assets', 'theme-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for theme assets
DROP POLICY IF EXISTS "Users can upload theme assets" ON storage.objects;
CREATE POLICY "Users can upload theme assets" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'theme-assets' AND
    auth.uid() IS NOT NULL
  );

DROP POLICY IF EXISTS "Users can view theme assets" ON storage.objects;
CREATE POLICY "Users can view theme assets" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'theme-assets');

DROP POLICY IF EXISTS "Users can delete own theme assets" ON storage.objects;
CREATE POLICY "Users can delete own theme assets" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'theme-assets' AND
    auth.uid() IS NOT NULL
  );
