-- Email Campaign Tracking and Analytics
-- Migration: 20250116000002_email_tracking
-- Date: January 16, 2026

-- ========================================
-- 1. EMAIL_LOGS TABLE
-- Track every email sent
-- ========================================

CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  campaign_id TEXT REFERENCES campaigns(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  email_address TEXT NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'bounced', 'failed'
  provider_message_id TEXT, -- SendGrid/Resend message ID for tracking
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id ON email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_customer_id ON email_logs(customer_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email_address ON email_logs(email_address);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_delivery_status ON email_logs(delivery_status);

-- ========================================
-- 2. EMAIL_EVENTS TABLE
-- Track opens, clicks, unsubscribes
-- ========================================

CREATE TABLE IF NOT EXISTS email_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email_log_id TEXT REFERENCES email_logs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'open', 'click', 'unsubscribe', 'spam'
  event_data JSONB DEFAULT '{}'::jsonb, -- Additional data (clicked link, user agent, etc.)
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_email_events_log_id ON email_events(email_log_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_created_at ON email_events(created_at DESC);

-- ========================================
-- 3. EMAIL_UNSUBSCRIBES TABLE
-- Track global unsubscribes
-- ========================================

CREATE TABLE IF NOT EXISTS email_unsubscribes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL,
  reason TEXT,
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id, email_address)
);

CREATE INDEX IF NOT EXISTS idx_email_unsubscribes_store_email ON email_unsubscribes(store_id, email_address);

-- ========================================
-- 4. TRACKING TOKEN GENERATION FUNCTION
-- Creates unique tracking tokens for opens/clicks
-- ========================================

CREATE OR REPLACE FUNCTION generate_tracking_token(
  p_email_log_id TEXT
)
RETURNS TEXT AS $$
DECLARE
  v_token TEXT;
BEGIN
  -- Generate a secure random token
  v_token := encode(gen_random_bytes(32), 'hex');
  
  -- Store it in the email_logs table
  UPDATE email_logs 
  SET provider_message_id = v_token 
  WHERE id = p_email_log_id;
  
  RETURN v_token;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. CAMPAIGN STATS UPDATE FUNCTION
-- Automatically updates campaign.stats when events happen
-- ========================================

CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
DECLARE
  v_campaign_id TEXT;
  v_sent_count INT;
  v_opened_count INT;
  v_clicked_count INT;
BEGIN
  -- Get campaign_id from email_log
  SELECT campaign_id INTO v_campaign_id
  FROM email_logs
  WHERE id = NEW.email_log_id;
  
  IF v_campaign_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Count total sent
  SELECT COUNT(*) INTO v_sent_count
  FROM email_logs
  WHERE campaign_id = v_campaign_id;
  
  -- Count unique opens
  SELECT COUNT(DISTINCT email_log_id) INTO v_opened_count
  FROM email_events
  WHERE event_type = 'open'
    AND email_log_id IN (
      SELECT id FROM email_logs WHERE campaign_id = v_campaign_id
    );
  
  -- Count unique clicks
  SELECT COUNT(DISTINCT email_log_id) INTO v_clicked_count
  FROM email_events
  WHERE event_type = 'click'
    AND email_log_id IN (
      SELECT id FROM email_logs WHERE campaign_id = v_campaign_id
    );
  
  -- Update campaign stats
  UPDATE campaigns
  SET stats = jsonb_build_object(
    'sent', v_sent_count,
    'opened', v_opened_count,
    'clicked', v_clicked_count
  )
  WHERE id = v_campaign_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update stats when events are recorded
DROP TRIGGER IF EXISTS email_events_update_stats ON email_events;
CREATE TRIGGER email_events_update_stats
  AFTER INSERT ON email_events
  FOR EACH ROW
  EXECUTE FUNCTION update_campaign_stats();

-- ========================================
-- 6. HELPER FUNCTION: GET CAMPAIGN ANALYTICS
-- Returns detailed analytics for a campaign
-- ========================================

CREATE OR REPLACE FUNCTION get_campaign_analytics(p_campaign_id TEXT)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'campaign_id', p_campaign_id,
    'total_sent', (SELECT COUNT(*) FROM email_logs WHERE campaign_id = p_campaign_id),
    'total_delivered', (SELECT COUNT(*) FROM email_logs WHERE campaign_id = p_campaign_id AND delivery_status = 'delivered'),
    'total_bounced', (SELECT COUNT(*) FROM email_logs WHERE campaign_id = p_campaign_id AND delivery_status = 'bounced'),
    'total_failed', (SELECT COUNT(*) FROM email_logs WHERE campaign_id = p_campaign_id AND delivery_status = 'failed'),
    'unique_opens', (
      SELECT COUNT(DISTINCT email_log_id) 
      FROM email_events e
      JOIN email_logs l ON e.email_log_id = l.id
      WHERE l.campaign_id = p_campaign_id AND e.event_type = 'open'
    ),
    'total_opens', (
      SELECT COUNT(*) 
      FROM email_events e
      JOIN email_logs l ON e.email_log_id = l.id
      WHERE l.campaign_id = p_campaign_id AND e.event_type = 'open'
    ),
    'unique_clicks', (
      SELECT COUNT(DISTINCT email_log_id) 
      FROM email_events e
      JOIN email_logs l ON e.email_log_id = l.id
      WHERE l.campaign_id = p_campaign_id AND e.event_type = 'click'
    ),
    'total_clicks', (
      SELECT COUNT(*) 
      FROM email_events e
      JOIN email_logs l ON e.email_log_id = l.id
      WHERE l.campaign_id = p_campaign_id AND e.event_type = 'click'
    ),
    'unsubscribes', (
      SELECT COUNT(*) 
      FROM email_events e
      JOIN email_logs l ON e.email_log_id = l.id
      WHERE l.campaign_id = p_campaign_id AND e.event_type = 'unsubscribe'
    ),
    'spam_reports', (
      SELECT COUNT(*) 
      FROM email_events e
      JOIN email_logs l ON e.email_log_id = l.id
      WHERE l.campaign_id = p_campaign_id AND e.event_type = 'spam'
    ),
    'open_rate', (
      SELECT CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND((COUNT(DISTINCT CASE WHEN e.event_type = 'open' THEN e.email_log_id END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
        ELSE 0 
      END
      FROM email_logs l
      LEFT JOIN email_events e ON e.email_log_id = l.id
      WHERE l.campaign_id = p_campaign_id
    ),
    'click_rate', (
      SELECT CASE 
        WHEN COUNT(*) > 0 
        THEN ROUND((COUNT(DISTINCT CASE WHEN e.event_type = 'click' THEN e.email_log_id END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
        ELSE 0 
      END
      FROM email_logs l
      LEFT JOIN email_events e ON e.email_log_id = l.id
      WHERE l.campaign_id = p_campaign_id
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 7. COMMENTS FOR DOCUMENTATION
-- ========================================

COMMENT ON TABLE email_logs IS 'Individual email send log - one row per recipient per campaign';
COMMENT ON TABLE email_events IS 'Email engagement events - opens, clicks, unsubscribes';
COMMENT ON TABLE email_unsubscribes IS 'Global unsubscribe list per store';
COMMENT ON FUNCTION get_campaign_analytics IS 'Returns comprehensive analytics for a campaign including open rates, click rates, etc.';
