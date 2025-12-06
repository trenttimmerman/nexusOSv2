
-- Add shipping address columns to orders table
alter table orders 
add column if not exists shipping_address_line1 text,
add column if not exists shipping_city text,
add column if not exists shipping_postal_code text,
add column if not exists shipping_country text default 'US';

-- Also add phone to orders just in case it differs from customer profile
alter table orders
add column if not exists customer_phone text;

-- Add customer_email snapshot to orders (good practice in case customer changes email later)
alter table orders
add column if not exists customer_email text;
