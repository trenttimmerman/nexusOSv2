-- Email Subscribers Table
-- This table stores email signups with full multi-tenant isolation
-- Each subscriber is automatically linked to a customer account

CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
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
  UNIQUE(site_id, email),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_email_subscribers_site ON email_subscribers(site_id);
CREATE INDEX idx_email_subscribers_customer ON email_subscribers(customer_id);
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at DESC);
CREATE INDEX idx_email_subscribers_token ON email_subscribers(confirmation_token) WHERE confirmation_token IS NOT NULL;

-- Email Settings Table (per-site configuration)
CREATE TABLE IF NOT EXISTS email_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE UNIQUE,
  
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
CREATE INDEX idx_email_settings_site ON email_settings(site_id);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_subscribers_updated_at
  BEFORE UPDATE ON email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_settings_updated_at
  BEFORE UPDATE ON email_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own site's subscribers
CREATE POLICY email_subscribers_site_isolation ON email_subscribers
  FOR ALL
  USING (site_id IN (
    SELECT id FROM sites WHERE owner_id = auth.uid()
  ));

-- Policy: Users can only access their own site's settings
CREATE POLICY email_settings_site_isolation ON email_settings
  FOR ALL
  USING (site_id IN (
    SELECT id FROM sites WHERE owner_id = auth.uid()
  ));

-- Insert default settings for existing sites
INSERT INTO email_settings (site_id)
SELECT id FROM sites
WHERE id NOT IN (SELECT site_id FROM email_settings)
ON CONFLICT (site_id) DO NOTHING;

-- Default Terms & Conditions content
UPDATE email_settings
SET terms_content = '
<h1>Terms and Conditions for Email Communications</h1>

<p><strong>Last Updated:</strong> ' || CURRENT_DATE || '</p>

<h2>1. Acceptance of Terms</h2>
<p>By subscribing to our email list, you agree to receive marketing communications, newsletters, and promotional offers from us. You acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>

<h2>2. Email Collection and Usage</h2>
<p>We collect your email address to:</p>
<ul>
  <li>Send you newsletters and updates about our products and services</li>
  <li>Provide exclusive offers and promotions</li>
  <li>Notify you about important changes to our services</li>
  <li>Send transactional emails related to your account or purchases</li>
</ul>

<h2>3. Data Protection and Privacy</h2>
<p>Your email address and personal information are stored securely and will never be sold, rented, or shared with third parties without your explicit consent, except as required by law or as necessary to provide our services.</p>

<p>We implement industry-standard security measures to protect your data, including encryption and secure storage protocols.</p>

<h2>4. Your Rights</h2>
<p>You have the right to:</p>
<ul>
  <li><strong>Unsubscribe:</strong> You can unsubscribe from our emails at any time by clicking the unsubscribe link in any email or contacting us directly</li>
  <li><strong>Access Your Data:</strong> Request a copy of the personal information we hold about you</li>
  <li><strong>Data Deletion:</strong> Request deletion of your personal information from our systems</li>
  <li><strong>Update Information:</strong> Correct or update your email address or preferences</li>
</ul>

<h2>5. Email Frequency</h2>
<p>We respect your inbox. You can expect to receive:</p>
<ul>
  <li>Weekly newsletters (optional)</li>
  <li>Promotional emails for special offers and sales</li>
  <li>Important account and order updates</li>
</ul>

<h2>6. Age Requirements</h2>
<p>You must be at least 13 years old to subscribe to our email list. If you are under 18, you must have parental or guardian consent.</p>

<h2>7. GDPR Compliance</h2>
<p>For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). Your data is processed lawfully, fairly, and transparently based on your explicit consent.</p>

<h2>8. CAN-SPAM Compliance</h2>
<p>We comply with the CAN-SPAM Act. All our emails include:</p>
<ul>
  <li>A clear and conspicuous unsubscribe link</li>
  <li>Our physical mailing address</li>
  <li>Accurate "From" and "Subject" lines</li>
</ul>

<h2>9. Third-Party Services</h2>
<p>We may use third-party email service providers to deliver our communications. These providers are contractually obligated to protect your information and use it only for the purposes we specify.</p>

<h2>10. Changes to Terms</h2>
<p>We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued subscription after changes are posted constitutes acceptance of the modified terms.</p>

<h2>11. Content Ownership</h2>
<p>All content in our emails, including text, images, logos, and designs, is our property or licensed to us and is protected by copyright laws.</p>

<h2>12. Liability</h2>
<p>While we strive to provide accurate information, we are not liable for any errors, omissions, or issues arising from the content of our emails.</p>

<h2>13. Contact Information</h2>
<p>If you have questions about these Terms and Conditions or wish to exercise your rights, please contact us at:</p>
<ul>
  <li>Email: privacy@yourstore.com</li>
  <li>Mail: [Your Business Address]</li>
</ul>

<h2>14. Governing Law</h2>
<p>These Terms and Conditions are governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>

<h2>15. Consent</h2>
<p>By checking the acceptance box and subscribing, you explicitly consent to:</p>
<ul>
  <li>Collection and processing of your email address</li>
  <li>Receipt of marketing communications</li>
  <li>Storage of your data in accordance with our privacy policy</li>
  <li>These Terms and Conditions in their entirety</li>
</ul>
'
WHERE terms_content IS NULL;
