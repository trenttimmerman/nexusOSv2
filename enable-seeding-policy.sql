-- Temporary RLS Disable for Component Library Seeding
-- Completely disable RLS during seeding, re-enable after

-- Disable RLS temporarily
ALTER TABLE component_library DISABLE ROW LEVEL SECURITY;

-- After seeding completes, re-enable with this:
-- ALTER TABLE component_library ENABLE ROW LEVEL SECURITY;
-- 
-- Then restore policies:
-- DROP POLICY IF EXISTS "Allow inserts for seeding" ON component_library;
-- CREATE POLICY "Authenticated users can insert components"
--   ON component_library FOR INSERT TO authenticated WITH CHECK (true);
