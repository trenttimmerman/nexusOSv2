-- Add DELETE and UPDATE policies for customers table
-- These were missing and preventing customer management

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Tenant Delete Customers" ON customers;
DROP POLICY IF EXISTS "Tenant Update Customers" ON customers;

-- Allow authenticated users to delete customers in their store
CREATE POLICY "Tenant Delete Customers" ON customers
  FOR DELETE USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Allow authenticated users to update customers in their store
CREATE POLICY "Tenant Update Customers" ON customers
  FOR UPDATE USING (
    store_id IN (
      SELECT store_id FROM profiles WHERE id = auth.uid()
    )
  );
