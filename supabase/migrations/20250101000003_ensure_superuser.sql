-- Ensure trent@3thirty3.ca is superuser and assigned to Demo Store
-- This is a re-run to ensure it catches the user created after the initial migration
DO $$
DECLARE
  target_user_id uuid;
  demo_store_id uuid;
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'trent@3thirty3.ca';
  
  -- Create or Get Demo Store
  INSERT INTO stores (name, slug)
  VALUES ('Demo Store', 'demo-store')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO demo_store_id;

  IF target_user_id IS NOT NULL THEN
    -- Update or Insert into profiles
    INSERT INTO profiles (id, store_id, role)
    VALUES (target_user_id, demo_store_id, 'superuser')
    ON CONFLICT (id) DO UPDATE
    SET role = 'superuser',
        store_id = demo_store_id;
  END IF;
END $$;