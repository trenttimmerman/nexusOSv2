-- Migration: Add category_id to collections table
-- This allows collections to be assigned to categories for better organization

-- Add category_id column
ALTER TABLE collections 
ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES categories(id) ON DELETE SET NULL;

-- Create index for faster category-based queries
CREATE INDEX IF NOT EXISTS idx_collections_category_id ON collections(category_id);

-- Add comment for documentation
COMMENT ON COLUMN collections.category_id IS 'Optional category assignment for organizing collections';
