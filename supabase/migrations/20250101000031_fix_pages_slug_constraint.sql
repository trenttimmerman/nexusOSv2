-- Migration: Fix pages slug constraint to be per-store unique
-- Created: 2025-12-28
-- Purpose: Allow same slug across different stores

-- Drop the global unique constraint
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_slug_key;

-- Drop and recreate composite unique constraint (store_id + slug)
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_store_slug_unique;
ALTER TABLE pages ADD CONSTRAINT pages_store_slug_unique UNIQUE (store_id, slug);

-- Add comment explaining the change
COMMENT ON CONSTRAINT pages_store_slug_unique ON pages IS 'Slug must be unique within a store, not globally';
