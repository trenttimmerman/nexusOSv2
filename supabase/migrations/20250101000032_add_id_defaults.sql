-- Migration: Add UUID defaults and fix ID auto-generation
-- Created: 2025-12-28
-- Purpose: Ensure pages and products can be created without manually specifying IDs

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Fix pages table - allow id to be auto-generated
ALTER TABLE pages ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- Fix products table - allow id to be auto-generated  
ALTER TABLE products ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- Add missing created_at defaults if not present
ALTER TABLE pages ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE products ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE products ALTER COLUMN updated_at SET DEFAULT now();

-- Add comments
COMMENT ON COLUMN pages.id IS 'Auto-generated UUID if not provided';
COMMENT ON COLUMN products.id IS 'Auto-generated UUID if not provided';
