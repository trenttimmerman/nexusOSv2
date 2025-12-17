-- Add wizard design settings to store_config
ALTER TABLE store_config 
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#8B5CF6',
ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#FFFFFF',
ADD COLUMN IF NOT EXISTS store_type TEXT,
ADD COLUMN IF NOT EXISTS store_vibe TEXT DEFAULT 'minimal',
ADD COLUMN IF NOT EXISTS color_palette TEXT;

-- Add comment for documentation
COMMENT ON COLUMN store_config.secondary_color IS 'Secondary/accent color from wizard';
COMMENT ON COLUMN store_config.background_color IS 'Background color from wizard';
COMMENT ON COLUMN store_config.store_type IS 'Store type selected in wizard (clothes, art, food, etc)';
COMMENT ON COLUMN store_config.store_vibe IS 'Store vibe/style from wizard (playful, minimal, bold, cozy, luxury, retro)';
COMMENT ON COLUMN store_config.color_palette IS 'Color palette ID from wizard';
