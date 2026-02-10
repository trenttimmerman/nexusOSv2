-- Migration: Create shared_header_library table for Designer V3
-- Date: 2026-02-07
-- Phase 1: Foundation
-- Description: Community-driven header library with AI-generated designs

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

-- Add comment for documentation
COMMENT ON TABLE public.shared_header_library IS 
  'Designer V3 Community Header Library - AI-generated and user-created header designs';

COMMENT ON COLUMN public.shared_header_library.config IS 
  'HeaderConfig JSON - includes layout, background, navigation, icons, typography, colors, effects';

COMMENT ON COLUMN public.shared_header_library.component IS 
  'React component code string - fully customizable header implementation';

COMMENT ON COLUMN public.shared_header_library.preview IS 
  'Supabase Storage URL for header screenshot preview';
