
-- Secure Customer Inserts
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public Insert Customers" ON customers;

-- Create a new policy that allows:
-- 1. Guests (anon) to insert customers with NO auth_user_id
-- 2. Authenticated users to insert customers with THEIR OWN auth_user_id
-- 3. Authenticated users to insert customers with NO auth_user_id (e.g. admin creating a manual customer? No, admins use different policies usually, but for storefront this is fine)

CREATE POLICY "Secure Public Insert Customers" ON customers
FOR INSERT WITH CHECK (
  (auth.role() = 'anon' AND auth_user_id IS NULL) OR
  (auth.role() = 'authenticated' AND (auth_user_id IS NULL OR auth_user_id = auth.uid()))
);

-- Note: We keep "Customer Insert Own Data" from migration 06? 
-- Migration 06 had: create policy "Customer Insert Own Data" on customers for insert with check (auth.uid() = auth_user_id);
-- That one is redundant if we have this new one, but it doesn't hurt (OR logic).
-- Actually, migration 08 dropped "Tenant Insert Customers" but didn't drop "Customer Insert Own Data".
-- So "Customer Insert Own Data" is still active.
-- The new policy covers the Guest case.

