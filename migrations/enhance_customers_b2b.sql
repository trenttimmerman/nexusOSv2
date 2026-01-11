-- Enhance customers table for B2B/B2C support
-- Add organization and tax fields to existing customers table

ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS client_type TEXT DEFAULT 'individual', -- 'organization' or 'individual'
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS tax_exempt BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tax_number TEXT, -- GST/VAT/Tax ID
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create customer_contacts table for multiple contacts per customer
CREATE TABLE IF NOT EXISTS customer_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT, -- 'primary', 'billing', 'shipping', 'technical', etc.
  email TEXT,
  phone TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_addresses table for multiple addresses per customer
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_type TEXT, -- 'billing', 'shipping', 'both'
  label TEXT, -- 'Headquarters', 'Warehouse', 'Office', etc.
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT,
  state_province TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'CA',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_contacts_customer_id ON customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_is_primary ON customer_contacts(is_primary) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default ON customer_addresses(is_default) WHERE is_default = true;

-- Enable RLS on new tables
ALTER TABLE customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_contacts
CREATE POLICY "Tenant Read Customer Contacts" ON customer_contacts
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE site_id IN (
        SELECT site_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Tenant Insert Customer Contacts" ON customer_contacts
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE site_id IN (
        SELECT site_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Tenant Update Customer Contacts" ON customer_contacts
  FOR UPDATE USING (
    customer_id IN (
      SELECT id FROM customers WHERE site_id IN (
        SELECT site_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Tenant Delete Customer Contacts" ON customer_contacts
  FOR DELETE USING (
    customer_id IN (
      SELECT id FROM customers WHERE site_id IN (
        SELECT site_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- RLS Policies for customer_addresses
CREATE POLICY "Tenant Read Customer Addresses" ON customer_addresses
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE site_id IN (
        SELECT site_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Tenant Insert Customer Addresses" ON customer_addresses
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE site_id IN (
        SELECT site_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Tenant Update Customer Addresses" ON customer_addresses
  FOR UPDATE USING (
    customer_id IN (
      SELECT id FROM customers WHERE site_id IN (
        SELECT site_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Tenant Delete Customer Addresses" ON customer_addresses
  FOR DELETE USING (
    customer_id IN (
      SELECT id FROM customers WHERE site_id IN (
        SELECT site_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_contacts_updated_at BEFORE UPDATE ON customer_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
