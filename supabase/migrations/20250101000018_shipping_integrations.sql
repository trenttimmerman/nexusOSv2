
-- Add shipping secrets to store_secrets
ALTER TABLE store_secrets
ADD COLUMN IF NOT EXISTS shippo_api_key text,
ADD COLUMN IF NOT EXISTS easypost_api_key text;

-- Add shipping provider selection to store_config
ALTER TABLE store_config
ADD COLUMN IF NOT EXISTS shipping_provider text DEFAULT 'manual'; -- 'manual', 'shippo', 'easypost'
