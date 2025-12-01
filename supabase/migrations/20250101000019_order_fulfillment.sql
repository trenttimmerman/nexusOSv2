
-- Add fulfillment columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS carrier text,
ADD COLUMN IF NOT EXISTS shipped_at timestamptz;
