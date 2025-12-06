-- Fix Superuser Access
-- This migration will run on deployment and attempt to fix the superuser role for 'trent@3thirty3.ca'
-- It also ensures a Demo Store exists.

-- 0. Fix store_config id to be auto-incrementing
-- The initial migration set default id=1, which causes conflicts for multi-tenant setups.
DO $$
BEGIN
    -- Create sequence if not exists
    CREATE SEQUENCE IF NOT EXISTS store_config_id_seq;
    
    -- Sync sequence to max id
    PERFORM setval('store_config_id_seq', COALESCE((SELECT MAX(id) FROM store_config), 0) + 1, false);
    
    -- Set new default
    ALTER TABLE store_config ALTER COLUMN id SET DEFAULT nextval('store_config_id_seq');
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Schema fix for store_config might have already been applied: %', SQLERRM;
END $$;

DO $$
DECLARE
  target_user_id uuid;
  demo_store_id uuid;
BEGIN
  -- 1. Get the user ID (if exists)
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'trent@3thirty3.ca';

  -- 2. Ensure Demo Store exists
  INSERT INTO stores (name, slug)
  VALUES ('Demo Store', 'demo-store')
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO demo_store_id;

  -- 3. If user exists, make them superuser
  IF target_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, store_id, role)
    VALUES (target_user_id, demo_store_id, 'superuser')
    ON CONFLICT (id) DO UPDATE
    SET role = 'superuser',
        store_id = demo_store_id;

    RAISE NOTICE 'User trent@3thirty3.ca promoted to superuser.';
  ELSE
    RAISE NOTICE 'User trent@3thirty3.ca not found. Please sign up first.';
  END IF;

  -- 4. Ensure Store Config exists for Demo Store
  INSERT INTO store_config (store_id, name, currency, header_style, hero_style, product_card_style, footer_style)
  VALUES (demo_store_id, 'Demo Store', 'USD', 'minimal', 'split', 'minimal', 'minimal')
  ON CONFLICT (store_id) DO NOTHING;

  -- 5. Ensure Subscription exists for Demo Store
  INSERT INTO subscriptions (store_id, plan_id, status)
  VALUES (demo_store_id, 'enterprise', 'active')
  ON CONFLICT (store_id) DO NOTHING;

END $$;
