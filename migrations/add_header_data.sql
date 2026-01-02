-- Add header_data column to store_config
ALTER TABLE store_config ADD COLUMN IF NOT EXISTS header_data jsonb DEFAULT '{}'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN store_config.header_data IS 'JSON object storing header customization settings like colors, visibility toggles, and layout options';
