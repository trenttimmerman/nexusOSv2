-- Migration: Add public read access to stores table
-- This allows anonymous users (storefront visitors) to view store information
-- Required for the storefront to function without authentication

-- Add public read policy for stores
DROP POLICY IF EXISTS "Public stores are viewable by everyone" ON stores;
CREATE POLICY "Public stores are viewable by everyone" ON stores
  FOR SELECT USING (true);

-- Also ensure store_config is publicly readable for storefront styling
DROP POLICY IF EXISTS "Public store config is viewable by everyone" ON store_config;
CREATE POLICY "Public store config is viewable by everyone" ON store_config
  FOR SELECT USING (true);

-- Comment: This enables anonymous visitors to view storefronts
-- The existing RLS policies for authenticated users still apply for write operations
