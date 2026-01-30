-- Fix Component Library RLS for Frontend Access
-- Allow anonymous (anon) users to read components
-- Keep authenticated users for insert/update

-- Re-enable RLS (in case it was disabled)
ALTER TABLE component_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view component library" ON component_library;
DROP POLICY IF EXISTS "Authenticated users can insert components" ON component_library;
DROP POLICY IF EXISTS "Authenticated users can update components" ON component_library;

-- Allow ANYONE (anon + authenticated) to view components
CREATE POLICY "Public can view component library"
  ON component_library
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert components (for AI generation)
CREATE POLICY "Authenticated users can insert components"
  ON component_library
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update components (for usage tracking)
CREATE POLICY "Authenticated users can update components"
  ON component_library
  FOR UPDATE
  TO authenticated
  USING (true);
