-- Update decrement_stock to handle variants
create or replace function decrement_stock(product_id uuid, quantity_to_decrement integer, variant_id text default null)
returns void
language plpgsql
security definer
as $$
begin
  if variant_id is not null then
    -- Update variant stock in JSONB
    update products
    set variants = (
      select jsonb_agg(
        case
          when (item->>'id') = variant_id then
            jsonb_set(item, '{stock}', to_jsonb(GREATEST(0, (item->>'stock')::int - quantity_to_decrement)))
          else
            item
        end
      )
      from jsonb_array_elements(variants) as item
    )
    where id = product_id;
    
    -- Also decrement parent stock
    update products
    set stock = GREATEST(0, stock - quantity_to_decrement)
    where id = product_id;
    
  else
    -- Standard decrement
    update products
    set stock = stock - quantity_to_decrement
    where id = product_id
    and stock >= quantity_to_decrement;
  end if;
end;
$$;
