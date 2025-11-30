-- Allow public to create orders
DROP POLICY IF EXISTS "Tenant Insert Orders" ON orders;
CREATE POLICY "Public Insert Orders" ON orders FOR INSERT WITH CHECK (true);

-- Allow public to create order items
DROP POLICY IF EXISTS "Tenant Insert Order Items" ON order_items;
CREATE POLICY "Public Insert Order Items" ON order_items FOR INSERT WITH CHECK (true);

-- Allow public to create customers (for guest checkout)
DROP POLICY IF EXISTS "Tenant Insert Customers" ON customers;
CREATE POLICY "Public Insert Customers" ON customers FOR INSERT WITH CHECK (true);

-- Allow public to read products (Storefront needs this!)
DROP POLICY IF EXISTS "Tenant Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Allow public to read store config
DROP POLICY IF EXISTS "Tenant Read Config" ON store_config;
CREATE POLICY "Public Read Config" ON store_config FOR SELECT USING (true);

-- Allow public to read pages
DROP POLICY IF EXISTS "Tenant Read Pages" ON pages;
CREATE POLICY "Public Read Pages" ON pages FOR SELECT USING (true);

-- Allow public to read media
DROP POLICY IF EXISTS "Tenant Read Media" ON media_assets;
CREATE POLICY "Public Read Media" ON media_assets FOR SELECT USING (true);
