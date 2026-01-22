-- Shopify Migration Schema Extensions
-- Phase 1: Complete Data Import Support
-- Created: January 22, 2026

-- ============================================
-- EXTEND EXISTING TABLES FOR SHOPIFY MIGRATION
-- ============================================

-- Extend products table with Shopify fields
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS barcode text,
  ADD COLUMN IF NOT EXISTS vendor text,
  ADD COLUMN IF NOT EXISTS product_type text,
  ADD COLUMN IF NOT EXISTS shopify_id text,
  ADD COLUMN IF NOT EXISTS shopify_data jsonb;

-- Extend customers table with Shopify fields
ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS client_type text DEFAULT 'individual',
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS tax_exempt boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS tax_number text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS tags text[],
  ADD COLUMN IF NOT EXISTS email_marketing boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS shopify_id text,
  ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id);

-- Extend orders table with detailed Shopify fields
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS subtotal numeric,
  ADD COLUMN IF NOT EXISTS tax_amount numeric,
  ADD COLUMN IF NOT EXISTS shipping_amount numeric,
  ADD COLUMN IF NOT EXISTS discount_amount numeric,
  ADD COLUMN IF NOT EXISTS discount_code text,
  ADD COLUMN IF NOT EXISTS discount_id uuid,
  ADD COLUMN IF NOT EXISTS customer_note text,
  ADD COLUMN IF NOT EXISTS staff_note text,
  ADD COLUMN IF NOT EXISTS order_tags text[],
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS payment_method_details jsonb,
  ADD COLUMN IF NOT EXISTS financial_status text,
  ADD COLUMN IF NOT EXISTS shipping_address_line1 text,
  ADD COLUMN IF NOT EXISTS shipping_address_line2 text,
  ADD COLUMN IF NOT EXISTS shipping_city text,
  ADD COLUMN IF NOT EXISTS shipping_state text,
  ADD COLUMN IF NOT EXISTS shipping_postal_code text,
  ADD COLUMN IF NOT EXISTS shipping_country text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS tracking_number text,
  ADD COLUMN IF NOT EXISTS carrier text,
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
  ADD COLUMN IF NOT EXISTS shopify_id text,
  ADD COLUMN IF NOT EXISTS shopify_order_number text;

-- Extend order_items table
ALTER TABLE order_items 
  ADD COLUMN IF NOT EXISTS variant_id text,
  ADD COLUMN IF NOT EXISTS variant_title text,
  ADD COLUMN IF NOT EXISTS shopify_id text;

-- ============================================
-- NEW TABLES FOR SHOPIFY MIGRATION
-- ============================================

-- Customer Addresses Table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  address_line1 text,
  address_line2 text,
  city text,
  province text,
  postal_code text,
  country text,
  phone text,
  is_default boolean DEFAULT false,
  shopify_id text,
  created_at timestamptz DEFAULT NOW()
);

-- Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  reason text,
  restock boolean DEFAULT false,
  shopify_id text,
  created_at timestamptz DEFAULT NOW()
);

-- Refund Line Items Table
CREATE TABLE IF NOT EXISTS refund_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  refund_id uuid REFERENCES refunds(id) ON DELETE CASCADE,
  order_item_id uuid REFERENCES order_items(id) ON DELETE CASCADE,
  quantity integer,
  subtotal numeric,
  created_at timestamptz DEFAULT NOW()
);

-- Carts Table (Abandoned Cart Support)
CREATE TABLE IF NOT EXISTS carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  session_id text,
  email text,
  total_amount numeric,
  abandoned_at timestamptz,
  recovered_at timestamptz,
  shopify_id text,
  created_at timestamptz DEFAULT NOW()
);

-- Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid REFERENCES carts(id) ON DELETE CASCADE,
  product_id text,
  variant_id text,
  quantity integer DEFAULT 1,
  price numeric,
  created_at timestamptz DEFAULT NOW()
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id text PRIMARY KEY,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  handle text NOT NULL,
  shopify_id text,
  created_at timestamptz DEFAULT NOW()
);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id text PRIMARY KEY,
  blog_id text REFERENCES blogs(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  author text,
  image text,
  published_at timestamptz,
  tags text[],
  seo jsonb,
  shopify_id text,
  created_at timestamptz DEFAULT NOW()
);

-- Article Comments Table
CREATE TABLE IF NOT EXISTS article_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id text REFERENCES articles(id) ON DELETE CASCADE,
  author_name text,
  author_email text,
  content text,
  status text DEFAULT 'pending', -- pending, approved, spam
  created_at timestamptz DEFAULT NOW()
);

-- Shopify Import Jobs Table (Track Migration Progress)
CREATE TABLE IF NOT EXISTS shopify_import_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  import_type text NOT NULL, -- products, collections, customers, orders, all
  status text DEFAULT 'pending', -- pending, in_progress, completed, failed
  total_count integer,
  imported_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  errors jsonb DEFAULT '[]'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT NOW()
);

-- Shopify API Credentials Table (Encrypted Storage)
CREATE TABLE IF NOT EXISTS shopify_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
  shop_domain text NOT NULL,
  access_token text NOT NULL, -- Should be encrypted in production
  scopes text[],
  connected_at timestamptz DEFAULT NOW(),
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Product indexes
CREATE INDEX IF NOT EXISTS idx_products_shopify_id ON products(shopify_id);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor, store_id);

-- Customer indexes
CREATE INDEX IF NOT EXISTS idx_customers_shopify_id ON customers(shopify_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(store_id, email);
CREATE INDEX IF NOT EXISTS idx_customers_auth_user ON customers(auth_user_id);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_shopify_id ON orders(shopify_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_store_status ON orders(store_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_financial_status ON orders(store_id, financial_status);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_carts_abandoned ON carts(store_id, abandoned_at) WHERE abandoned_at IS NOT NULL AND recovered_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_carts_email ON carts(email) WHERE email IS NOT NULL;

-- Address indexes
CREATE INDEX IF NOT EXISTS idx_addresses_customer ON customer_addresses(customer_id);

-- Blog/Article indexes
CREATE INDEX IF NOT EXISTS idx_articles_blog ON articles(blog_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING gin(tags);

-- Import job indexes
CREATE INDEX IF NOT EXISTS idx_import_jobs_store ON shopify_import_jobs(store_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Customer Addresses
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Read Customer Addresses" ON customer_addresses;
CREATE POLICY "Tenant Read Customer Addresses" ON customer_addresses
  FOR SELECT USING (
    customer_id IN (SELECT id FROM customers WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "Tenant Insert Customer Addresses" ON customer_addresses;
CREATE POLICY "Tenant Insert Customer Addresses" ON customer_addresses
  FOR INSERT WITH CHECK (
    customer_id IN (SELECT id FROM customers WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "Tenant Update Customer Addresses" ON customer_addresses;
CREATE POLICY "Tenant Update Customer Addresses" ON customer_addresses
  FOR UPDATE USING (
    customer_id IN (SELECT id FROM customers WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

-- Refunds
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Read Refunds" ON refunds;
CREATE POLICY "Tenant Read Refunds" ON refunds
  FOR SELECT USING (
    order_id IN (SELECT id FROM orders WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "Tenant Insert Refunds" ON refunds;
CREATE POLICY "Tenant Insert Refunds" ON refunds
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

-- Carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Read Carts" ON carts;
CREATE POLICY "Tenant Read Carts" ON carts
  FOR SELECT USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Tenant Insert Carts" ON carts;
CREATE POLICY "Tenant Insert Carts" ON carts
  FOR INSERT WITH CHECK (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

-- Cart Items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Read Cart Items" ON cart_items;
CREATE POLICY "Tenant Read Cart Items" ON cart_items
  FOR SELECT USING (
    cart_id IN (SELECT id FROM carts WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "Tenant Insert Cart Items" ON cart_items;
CREATE POLICY "Tenant Insert Cart Items" ON cart_items
  FOR INSERT WITH CHECK (
    cart_id IN (SELECT id FROM carts WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

-- Blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Read Blogs" ON blogs;
CREATE POLICY "Tenant Read Blogs" ON blogs
  FOR SELECT USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Tenant Insert Blogs" ON blogs;
CREATE POLICY "Tenant Insert Blogs" ON blogs
  FOR INSERT WITH CHECK (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

-- Articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Read Articles" ON articles;
CREATE POLICY "Tenant Read Articles" ON articles
  FOR SELECT USING (
    blog_id IN (SELECT id FROM blogs WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "Tenant Insert Articles" ON articles;
CREATE POLICY "Tenant Insert Articles" ON articles
  FOR INSERT WITH CHECK (
    blog_id IN (SELECT id FROM blogs WHERE store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()))
  );

-- Shopify Import Jobs
ALTER TABLE shopify_import_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Read Import Jobs" ON shopify_import_jobs;
CREATE POLICY "Tenant Read Import Jobs" ON shopify_import_jobs
  FOR SELECT USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Tenant Insert Import Jobs" ON shopify_import_jobs;
CREATE POLICY "Tenant Insert Import Jobs" ON shopify_import_jobs
  FOR INSERT WITH CHECK (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Tenant Update Import Jobs" ON shopify_import_jobs;
CREATE POLICY "Tenant Update Import Jobs" ON shopify_import_jobs
  FOR UPDATE USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

-- Shopify Credentials
ALTER TABLE shopify_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tenant Read Own Credentials" ON shopify_credentials;
CREATE POLICY "Tenant Read Own Credentials" ON shopify_credentials
  FOR SELECT USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Tenant Insert Own Credentials" ON shopify_credentials;
CREATE POLICY "Tenant Insert Own Credentials" ON shopify_credentials
  FOR INSERT WITH CHECK (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Tenant Update Own Credentials" ON shopify_credentials;
CREATE POLICY "Tenant Update Own Credentials" ON shopify_credentials
  FOR UPDATE USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Tenant Delete Own Credentials" ON shopify_credentials;
CREATE POLICY "Tenant Delete Own Credentials" ON shopify_credentials
  FOR DELETE USING (store_id IN (SELECT store_id FROM profiles WHERE id = auth.uid()));
