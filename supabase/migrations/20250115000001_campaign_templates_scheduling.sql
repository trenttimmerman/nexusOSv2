-- Add template and scheduling support to campaigns table
-- Migration: 20250115000001_campaign_templates_scheduling

-- Add template_id column to store which email template is being used
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS template_id TEXT;

-- Add template_variables column to store dynamic template variables as JSONB
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS template_variables JSONB DEFAULT '{}'::jsonb;

-- Add index on template_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_campaigns_template_id ON campaigns(template_id);

-- Add index on scheduled_for for finding campaigns to send
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled_for ON campaigns(scheduled_for) WHERE status = 'scheduled';

-- Add index on status for filtering campaigns
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);

-- Add comment explaining the new columns
COMMENT ON COLUMN campaigns.template_id IS 'ID of the email template from EmailTemplates.tsx (e.g., welcome, promotional-sale, abandoned-cart)';
COMMENT ON COLUMN campaigns.template_variables IS 'Key-value pairs for template variable substitution (e.g., {"customer_name": "John", "discount_code": "SAVE20"})';
