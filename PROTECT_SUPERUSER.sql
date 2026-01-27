-- Protect superuser account from deletion and role changes
-- Run this in Supabase SQL Editor

-- 1. Create function to prevent superuser deletion
CREATE OR REPLACE FUNCTION prevent_superuser_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.email = 'trent@3thirty3.ca' THEN
    RAISE EXCEPTION 'Cannot delete superuser account trent@3thirty3.ca';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 2. Create trigger on auth.users to prevent deletion
DROP TRIGGER IF EXISTS protect_superuser_delete ON auth.users;
CREATE TRIGGER protect_superuser_delete
  BEFORE DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_superuser_deletion();

-- 3. Create function to prevent superuser role change
CREATE OR REPLACE FUNCTION prevent_superuser_role_change()
RETURNS TRIGGER AS $$
DECLARE
  user_email text;
BEGIN
  -- Get the email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = NEW.id;

  -- If this is the superuser account, prevent role changes
  IF user_email = 'trent@3thirty3.ca' THEN
    IF OLD.role = 'superuser' AND NEW.role != 'superuser' THEN
      RAISE EXCEPTION 'Cannot change role of superuser account trent@3thirty3.ca';
    END IF;
    -- Also ensure store_id cannot be changed
    IF OLD.store_id IS DISTINCT FROM NEW.store_id THEN
      RAISE EXCEPTION 'Cannot change store assignment of superuser account trent@3thirty3.ca';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger on profiles to prevent role changes
DROP TRIGGER IF EXISTS protect_superuser_profile ON profiles;
CREATE TRIGGER protect_superuser_profile
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_superuser_role_change();

-- 5. Create function to prevent profile deletion
CREATE OR REPLACE FUNCTION prevent_superuser_profile_deletion()
RETURNS TRIGGER AS $$
DECLARE
  user_email text;
BEGIN
  -- Get the email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = OLD.id;

  IF user_email = 'trent@3thirty3.ca' THEN
    RAISE EXCEPTION 'Cannot delete profile of superuser account trent@3thirty3.ca';
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger on profiles to prevent deletion
DROP TRIGGER IF EXISTS protect_superuser_profile_delete ON profiles;
CREATE TRIGGER protect_superuser_profile_delete
  BEFORE DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_superuser_profile_deletion();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '🔒 Superuser account protection enabled:';
  RAISE NOTICE '   ✅ Cannot delete trent@3thirty3.ca from auth.users';
  RAISE NOTICE '   ✅ Cannot delete trent@3thirty3.ca profile';
  RAISE NOTICE '   ✅ Cannot change role from superuser';
  RAISE NOTICE '   ✅ Cannot change store assignment';
END $$;
