-- Add specific_customer_ids to discounts table
alter table discounts add column if not exists specific_customer_ids uuid[] default null;

-- Update validate_discount function to check for customer restriction
create or replace function validate_discount(p_code text, p_store_id uuid, p_customer_id uuid default null)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_discount record;
begin
  select * into v_discount
  from discounts
  where code = p_code
  and store_id = p_store_id
  and is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
  and (usage_limit is null or usage_count < usage_limit)
  and (
    specific_customer_ids is null 
    or specific_customer_ids = '{}' 
    or (p_customer_id is not null and p_customer_id = ANY(specific_customer_ids))
  );

  if v_discount.id is not null then
    return to_jsonb(v_discount);
  else
    return null;
  end if;
end;
$$;
