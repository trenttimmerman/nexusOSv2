-- Add store_id to products and update RLS policies

-- Add store_id column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);

-- Drop old policies
DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Public Write Products" ON products;
DROP POLICY IF EXISTS "Public Update Products" ON products;
DROP POLICY IF EXISTS "Public Delete Products" ON products;

-- Create store-isolated RLS policies
DROP POLICY IF EXISTS "Users can view their own products" ON products;
CREATE POLICY "Users can view their own products"
  ON products FOR SELECT
  USING (auth.uid() = store_id);

DROP POLICY IF EXISTS "Users can insert their own products" ON products;
CREATE POLICY "Users can insert their own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = store_id);

DROP POLICY IF EXISTS "Users can update their own products" ON products;
CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = store_id);

DROP POLICY IF EXISTS "Users can delete their own products" ON products;
CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = store_id);

-- Comment
COMMENT ON COLUMN products.store_id IS 'References the store owner (user)';
