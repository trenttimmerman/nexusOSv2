-- Run this in Supabase SQL Editor to restore superuser access
-- Dashboard: https://fwgufmjraxiadtnxkymi.supabase.co

DO $$
DECLARE
  target_user_id uuid;
  demo_store_id uuid;
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = 'trent@3thirty3.ca';
  
  -- If user doesn't exist, show message
  IF target_user_id IS NULL THEN
    RAISE NOTICE 'User trent@3thirty3.ca not found in auth.users';
    RAISE NOTICE 'Please create the user first in Authentication > Users';
    RETURN;
  END IF;

  RAISE NOTICE 'Found user ID: %', target_user_id;
  
  -- Get or Create Demo Store
  SELECT id INTO demo_store_id
  FROM stores 
  WHERE slug = 'demo-store';

  IF demo_store_id IS NULL THEN
    INSERT INTO stores (name, slug)
    VALUES ('Demo Store', 'demo-store')
    RETURNING id INTO demo_store_id;
    RAISE NOTICE 'Created Demo Store with ID: %', demo_store_id;
  ELSE
    RAISE NOTICE 'Found Demo Store with ID: %', demo_store_id;
  END IF;

  -- Update or Insert into profiles
  INSERT INTO profiles (id, store_id, role)
  VALUES (target_user_id, demo_store_id, 'superuser')
  ON CONFLICT (id) DO UPDATE
  SET role = 'superuser',
      store_id = demo_store_id;
  
  RAISE NOTICE '✅ SUCCESS: User trent@3thirty3.ca is now a superuser';
  RAISE NOTICE '   Store: Demo Store (%)', demo_store_id;
END $$;
