-- Customer Import System
-- Track all customer import operations

CREATE TABLE IF NOT EXISTS customer_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  source_platform TEXT DEFAULT 'csv', -- 'shopify', 'woocommerce', 'bigcommerce', 'csv', 'manual'
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'partial'
  
  -- Counts
  total_records INTEGER DEFAULT 0,
  customers_created INTEGER DEFAULT 0,
  customers_updated INTEGER DEFAULT 0,
  customers_skipped INTEGER DEFAULT 0,
  addresses_created INTEGER DEFAULT 0,
  contacts_created INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  
  -- Configuration
  mapping_config JSONB DEFAULT '{}', -- Field mapping rules
  import_options JSONB DEFAULT '{}', -- Duplicate handling, B2B settings, etc.
  
  -- File info
  filename TEXT,
  file_size INTEGER,
  
  -- Results
  error_log JSONB DEFAULT '[]', -- Array of {row, error, data}
  summary JSONB DEFAULT '{}', -- Final summary stats
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_imports_store_id ON customer_imports(store_id);
CREATE INDEX IF NOT EXISTS idx_customer_imports_status ON customer_imports(status);
CREATE INDEX IF NOT EXISTS idx_customer_imports_created_at ON customer_imports(created_at DESC);

-- Enable RLS
ALTER TABLE customer_imports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Tenant Read Customer Imports" ON customer_imports
FOR SELECT
USING (
  store_id IN (
    SELECT store_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Tenant Insert Customer Imports" ON customer_imports
FOR INSERT
WITH CHECK (
  store_id IN (
    SELECT store_id FROM profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Tenant Update Customer Imports" ON customer_imports
FOR UPDATE
USING (
  store_id IN (
    SELECT store_id FROM profiles WHERE id = auth.uid()
  )
);
