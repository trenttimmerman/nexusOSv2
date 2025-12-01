ALTER TABLE store_config
ADD COLUMN IF NOT EXISTS store_address JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS store_formats JSONB DEFAULT '{"timezone": "UTC", "weight_unit": "kg", "dimension_unit": "cm"}'::jsonb,
ADD COLUMN IF NOT EXISTS shipping_zones JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tax_regions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS notification_settings JSONB DEFAULT '{}'::jsonb;
