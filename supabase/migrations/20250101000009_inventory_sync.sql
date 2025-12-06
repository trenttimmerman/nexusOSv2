-- Function to decrement stock safely
-- This function runs with SECURITY DEFINER, meaning it bypasses RLS.
-- This allows public users (guests) to decrement stock without giving them full update access to the products table.

create or replace function decrement_stock(product_id uuid, quantity_to_decrement integer)
returns void
language plpgsql
security definer
as $$
begin
  update products
  set stock = stock - quantity_to_decrement
  where id = product_id
  and stock >= quantity_to_decrement; -- Prevent negative stock
end;
$$;
