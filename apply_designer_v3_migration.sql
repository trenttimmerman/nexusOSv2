-- ========================================
-- Designer V3 Migration Application Script
-- Date: 2026-02-09
-- Description: Apply shared_header_library table for Designer V3
-- ========================================

-- This migration creates the shared_header_library table for the Designer V3
-- AI-powered header generation system.
--
-- INSTRUCTIONS:
-- 1. Open Supabase Dashboard: https://app.supabase.com/project/fwgufmjraxiadtnxkymi
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Run the script
-- 5. Verify table creation: SELECT * FROM public.shared_header_library LIMIT 1;

-- ========================================
-- MIGRATION START
-- ========================================

-- Create shared_header_library table
CREATE TABLE IF NOT EXISTS public.shared_header_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  component TEXT NOT NULL,           -- React component code
  config JSONB NOT NULL,             -- HeaderConfig interface
  preview TEXT NOT NULL,             -- Screenshot URL (Supabase Storage)
  
  -- Metadata
  created_by TEXT NOT NULL,          -- store_id or 'ai-generated'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  times_used INTEGER NOT NULL DEFAULT 0,
  average_rating DECIMAL(3, 2),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  design_trends TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Visibility
  status TEXT NOT NULL DEFAULT 'public' CHECK (status IN ('public', 'private', 'community')),
  
  -- Indexes
  CONSTRAINT shared_header_library_name_key UNIQUE (name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shared_header_library_status 
  ON public.shared_header_library(status);

CREATE INDEX IF NOT EXISTS idx_shared_header_library_created_at 
  ON public.shared_header_library(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_shared_header_library_times_used 
  ON public.shared_header_library(times_used DESC);

CREATE INDEX IF NOT EXISTS idx_shared_header_library_ai_generated 
  ON public.shared_header_library(ai_generated);

CREATE INDEX IF NOT EXISTS idx_shared_header_library_tags 
  ON public.shared_header_library USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE public.shared_header_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-run safety)
DROP POLICY IF EXISTS "Public headers are visible to everyone" ON public.shared_header_library;
DROP POLICY IF EXISTS "Private headers visible to creator only" ON public.shared_header_library;
DROP POLICY IF EXISTS "Authenticated users can create headers" ON public.shared_header_library;
DROP POLICY IF EXISTS "Users can update own headers" ON public.shared_header_library;
DROP POLICY IF EXISTS "Users can delete own headers" ON public.shared_header_library;

-- RLS Policy: Public headers are visible to all authenticated users
CREATE POLICY "Public headers are visible to everyone"
  ON public.shared_header_library
  FOR SELECT
  USING (
    status = 'public' 
    OR status = 'community'
  );

-- RLS Policy: Private headers only visible to creator
CREATE POLICY "Private headers visible to creator only"
  ON public.shared_header_library
  FOR SELECT
  USING (
    status = 'private' 
    AND created_by = current_setting('app.current_store_id', true)
  );

-- RLS Policy: Users can insert headers (will be added to library)
CREATE POLICY "Authenticated users can create headers"
  ON public.shared_header_library
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND created_by = current_setting('app.current_store_id', true)
  );

-- RLS Policy: Users can update their own headers
CREATE POLICY "Users can update own headers"
  ON public.shared_header_library
  FOR UPDATE
  USING (created_by = current_setting('app.current_store_id', true))
  WITH CHECK (created_by = current_setting('app.current_store_id', true));

-- RLS Policy: Users can delete their own headers
CREATE POLICY "Users can delete own headers"
  ON public.shared_header_library
  FOR DELETE
  USING (created_by = current_setting('app.current_store_id', true));

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_shared_header_library_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists (for re-run safety)
DROP TRIGGER IF EXISTS trigger_update_shared_header_library_updated_at ON public.shared_header_library;

-- Trigger: Auto-update updated_at
CREATE TRIGGER trigger_update_shared_header_library_updated_at
  BEFORE UPDATE ON public.shared_header_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_shared_header_library_updated_at();

-- Function: Increment times_used counter
CREATE OR REPLACE FUNCTION public.increment_header_usage(header_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.shared_header_library
  SET times_used = times_used + 1
  WHERE id = header_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to authenticated users
GRANT SELECT, INSERT ON public.shared_header_library TO authenticated;
GRANT UPDATE, DELETE ON public.shared_header_library TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_header_usage TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.shared_header_library IS 
  'Designer V3 Community Header Library - AI-generated and user-created header designs';

COMMENT ON COLUMN public.shared_header_library.config IS 
  'HeaderConfig JSON - includes layout, background, navigation, icons, typography, colors, effects';

COMMENT ON COLUMN public.shared_header_library.component IS 
  'React component code string - fully customizable header implementation';

COMMENT ON COLUMN public.shared_header_library.preview IS 
  'Supabase Storage URL for header screenshot preview';

-- ========================================
-- SEED DEFAULT HEADERS (Optional)
-- ========================================

-- Seed a default header for testing
INSERT INTO public.shared_header_library (
  name,
  description,
  component,
  config,
  preview,
  created_by,
  tags,
  ai_generated,
  design_trends,
  status
) VALUES (
  'Modern Professional Header',
  'Clean, modern header with logo, navigation, and cart icon. Perfect for e-commerce.',
  '// Default Canvas Header Component
import React from ''react'';
export const ModernProfessionalHeader = (props) => {
  return <div>Header Component</div>;
};',
  '{"variant": "canvas", "showAnnouncementBar": true, "announcementText": "Free shipping on orders over $50!", "backgroundColor": "#ffffff", "logoColor": "#000000"}',
  '/placeholder-header.png',
  'platform',
  ARRAY['professional', 'modern', 'e-commerce'],
  false,
  ARRAY['2026 Clean Design', 'Minimalist'],
  'public'
) ON CONFLICT (name) DO NOTHING;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Run these after migration to verify success:

-- 1. Check table exists
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'shared_header_library';

-- 2. Check columns
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'shared_header_library';

-- 3. Check indexes
-- SELECT indexname FROM pg_indexes WHERE tablename = 'shared_header_library';

-- 4. Check RLS policies
-- SELECT policyname FROM pg_policies WHERE tablename = 'shared_header_library';

-- 5. Check seed data
-- SELECT id, name, status, ai_generated FROM public.shared_header_library;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

SELECT 
  '✅ Designer V3 Migration Applied Successfully!' as status,
  COUNT(*) as seed_headers_count 
FROM public.shared_header_library;
