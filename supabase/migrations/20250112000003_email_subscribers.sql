-- Email Subscribers Table
-- This table stores email signups with full multi-tenant isolation
-- Each subscriber is automatically linked to a customer account

CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  
  -- Source tracking
  source_page TEXT,
  source_block_id TEXT,
  form_variant TEXT,
  
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  
  -- Compliance
  accepted_terms BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  double_opt_in_confirmed BOOLEAN DEFAULT false,
  confirmation_token TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  UNIQUE(store_id, email),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_subscribers_store ON email_subscribers(store_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_customer ON email_subscribers(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_token ON email_subscribers(confirmation_token) WHERE confirmation_token IS NOT NULL;

-- Email Settings Table (per-store configuration)
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
  
  -- General Settings
  enabled BOOLEAN DEFAULT true,
  require_double_opt_in BOOLEAN DEFAULT false,
  auto_create_customer BOOLEAN DEFAULT true,
  
  -- Thank You Popup Configuration
  thank_you_enabled BOOLEAN DEFAULT true,
  thank_you_heading TEXT DEFAULT 'Thank You!',
  thank_you_message TEXT DEFAULT 'You''ve successfully subscribed to our newsletter. Check your inbox for exclusive offers!',
  thank_you_button_text TEXT DEFAULT 'Continue Shopping',
  thank_you_button_link TEXT DEFAULT '/',
  thank_you_auto_close BOOLEAN DEFAULT false,
  thank_you_auto_close_delay INTEGER DEFAULT 5,
  
  -- Thank You Popup Styling
  thank_you_bg_color TEXT DEFAULT '#ffffff',
  thank_you_text_color TEXT DEFAULT '#000000',
  thank_you_button_bg_color TEXT DEFAULT '#000000',
  thank_you_button_text_color TEXT DEFAULT '#ffffff',
  
  -- Terms & Conditions
  terms_enabled BOOLEAN DEFAULT true,
  terms_heading TEXT DEFAULT 'Terms and Conditions',
  terms_content TEXT,
  terms_page_slug TEXT DEFAULT 'terms-and-conditions',
  require_terms_acceptance BOOLEAN DEFAULT true,
  terms_checkbox_text TEXT DEFAULT 'I accept the Terms & Conditions',
  
  -- Confirmation Email (if double opt-in)
  confirmation_subject TEXT DEFAULT 'Please confirm your subscription',
  confirmation_body TEXT,
  confirmation_from_name TEXT,
  confirmation_from_email TEXT,
  
  -- Integration Settings (for future use)
  integrations JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email settings
CREATE INDEX IF NOT EXISTS idx_email_settings_store ON email_settings(store_id);

-- Auto-update updated_at timestamp (only create if doesn't exist)
DO $$ BEGIN
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $func$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $func$ LANGUAGE plpgsql;
EXCEPTION
  WHEN duplicate_function THEN NULL;
END $$;

-- Create triggers
DROP TRIGGER IF EXISTS update_email_subscribers_updated_at ON email_subscribers;
CREATE TRIGGER update_email_subscribers_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_settings_updated_at ON email_settings;
CREATE TRIGGER update_email_settings_updated_at
  BEFORE UPDATE ON email_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own store's subscribers
DROP POLICY IF EXISTS "email_subscribers_store_isolation" ON email_subscribers;
CREATE POLICY "email_subscribers_store_isolation" ON email_subscribers
  FOR ALL
  USING (store_id IN (
    SELECT store_id FROM profiles WHERE id = auth.uid()
  ));

-- Policy: Users can only access their own store's settings
DROP POLICY IF EXISTS "email_settings_store_isolation" ON email_settings;
CREATE POLICY "email_settings_store_isolation" ON email_settings
  FOR ALL
  USING (store_id IN (
    SELECT store_id FROM profiles WHERE id = auth.uid()
  ));

-- Insert default settings for existing stores
INSERT INTO email_settings (store_id)
SELECT id FROM stores
WHERE id NOT IN (SELECT store_id FROM email_settings)
ON CONFLICT (store_id) DO NOTHING;
