-- Re-enable RLS After Seeding
-- Run this after seeding completes successfully

-- Re-enable RLS
ALTER TABLE component_library ENABLE ROW LEVEL SECURITY;

-- Restore proper policies
DROP POLICY IF EXISTS "Allow inserts for seeding" ON component_library;

-- Allow authenticated users to read
CREATE POLICY "Anyone can view component library"
  ON component_library
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert (for AI generation)
CREATE POLICY "Authenticated users can insert components"
  ON component_library
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update (for usage tracking)
CREATE POLICY "Authenticated users can update components"
  ON component_library
  FOR UPDATE
  TO authenticated
  USING (true);
