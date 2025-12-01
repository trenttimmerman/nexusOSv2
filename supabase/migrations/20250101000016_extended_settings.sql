-- Add columns for extended settings (Shipping, Taxes, Policies, Support)
ALTER TABLE store_config
ADD COLUMN IF NOT EXISTS support_email text,
ADD COLUMN IF NOT EXISTS shipping_rates jsonb DEFAULT '[{"id": "standard", "name": "Standard Shipping", "price": 0, "min_order": 0}]'::jsonb,
ADD COLUMN IF NOT EXISTS tax_rate numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS policy_refund text,
ADD COLUMN IF NOT EXISTS policy_privacy text,
ADD COLUMN IF NOT EXISTS policy_terms text;
