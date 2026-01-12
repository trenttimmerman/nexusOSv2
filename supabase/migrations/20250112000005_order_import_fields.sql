-- Add order_number, tags, and notes to orders table for import functionality

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS order_number TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add product_name and sku to order_items for imported orders
ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS sku TEXT;

-- Add index on order_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_store_id_order_number ON orders(store_id, order_number);

-- Add unique constraint to prevent duplicate order numbers within a store
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_store_order_number_unique 
ON orders(store_id, order_number) 
WHERE order_number IS NOT NULL;
