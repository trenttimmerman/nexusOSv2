# Email Campaign Backend - Setup Guide

**Date:** January 16, 2026  
**Feature:** Complete email campaign system with sending, tracking, and analytics

---

## 🎯 Overview

The email campaign backend provides a complete email marketing solution with:

✅ **Email Sending** - Send bulk emails via Resend API  
✅ **Email Tracking** - Track opens and clicks automatically  
✅ **Analytics** - Detailed campaign performance metrics  
✅ **Scheduled Sending** - Automated cron job for scheduled campaigns  
✅ **Unsubscribe Management** - One-click unsubscribe with reason tracking  
✅ **Template Support** - Use pre-built templates with variable substitution  
✅ **Audience Segmentation** - Send to all customers, VIPs, or custom segments  

---

## 📁 Files Created

### Database Migrations

1. **`supabase/migrations/20250116000002_email_tracking.sql`**
   - `email_logs` table - Individual email send records
   - `email_events` table - Opens, clicks, unsubscribes
   - `email_unsubscribes` table - Global unsubscribe list
   - Analytics functions and triggers

### API Endpoints

2. **`api/send-email.ts`**
   - Sends campaign emails via Resend
   - Handles audience selection
   - Template variable substitution
   - Creates tracking links

3. **`api/track-email.ts`**
   - Tracks email opens (1x1 pixel)
   - Tracks link clicks
   - Records events in database

4. **`api/unsubscribe.ts`**
   - Unsubscribe form page
   - Adds email to unsubscribe list
   - Records unsubscribe event

5. **`api/cron/send-scheduled-campaigns.ts`**
   - Automated cron job
   - Sends scheduled campaigns
   - Runs every 5 minutes

### Configuration

6. **`vercel.json`** - Updated with cron job config
7. **`.env.example`** - Environment variable template

---

## 🚀 Setup Instructions

### 1. Database Migration

Run the email tracking migration:

```bash
# Using Supabase CLI
npx supabase db execute --file supabase/migrations/20250116000002_email_tracking.sql

# Or manually in Supabase dashboard SQL Editor
```

### 2. Email Service Setup (Resend)

1. **Sign up for Resend**
   - Go to [https://resend.com](https://resend.com)
   - Create a free account
   - Free tier: 3,000 emails/month, 100 emails/day

2. **Get API Key**
   - Dashboard → API Keys → Create API Key
   - Copy the key (starts with `re_`)

3. **Verify Domain** (for production)
   - Dashboard → Domains → Add Domain
   - Add DNS records to verify ownership
   - This allows sending from `noreply@yourdomain.com`

4. **For Testing**
   - You can send from `onboarding@resend.dev` without domain verification
   - Limited to sending to your own email only

### 3. Environment Variables

Add to `.env` file:

```bash
# Required for email sending
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com  # Or onboarding@resend.dev for testing
TRACKING_DOMAIN=https://yourdomain.com

# Testing
TEST_EMAIL=your-email@example.com

# Security (optional)
CRON_SECRET=generate-random-secret-here
```

**To generate CRON_SECRET:**
```bash
openssl rand -hex 32
```

### 4. Vercel Deployment

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Add Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env`
   - Deploy again to apply

3. **Verify Cron Job**
   - Go to Project → Deployments → Functions
   - You should see `/api/cron/send-scheduled-campaigns`
   - Check Cron Jobs tab to see schedule

### 5. Test the System

#### Test Email Sending

```bash
# Create a test campaign via admin panel, then:
curl -X POST https://yourdomain.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "campaignId": "your-campaign-id",
    "testMode": true
  }'
```

#### Test Tracking

```bash
# Visit in browser (should show 1x1 pixel):
https://yourdomain.com/api/track-email?token=email-log-id&type=open

# Test click tracking (should redirect):
https://yourdomain.com/api/track-email?token=email-log-id&type=click&url=https://example.com
```

#### Test Unsubscribe

```bash
# Visit in browser:
https://yourdomain.com/api/unsubscribe?token=email-log-id
```

---

## 📊 Database Schema

### email_logs
Individual email send records.

```sql
CREATE TABLE email_logs (
  id TEXT PRIMARY KEY,
  campaign_id TEXT REFERENCES campaigns(id),
  customer_id TEXT REFERENCES customers(id),
  email_address TEXT NOT NULL,
  subject TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivery_status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'bounced', 'failed'
  provider_message_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### email_events  
Tracking events (opens, clicks, unsubscribes).

```sql
CREATE TABLE email_events (
  id TEXT PRIMARY KEY,
  email_log_id TEXT REFERENCES email_logs(id),
  event_type TEXT NOT NULL, -- 'open', 'click', 'unsubscribe', 'spam'
  event_data JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### email_unsubscribes
Global unsubscribe list per store.

```sql
CREATE TABLE email_unsubscribes (
  id TEXT PRIMARY KEY,
  store_id TEXT REFERENCES stores(id),
  email_address TEXT NOT NULL,
  reason TEXT,
  unsubscribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(store_id, email_address)
);
```

---

## 🔧 Usage Examples

### Sending a Campaign

**Via Admin Panel:**
1. Go to Campaigns tab
2. Create new campaign or schedule existing one
3. Click "Send Now" or wait for scheduled time

**Via API:**
```javascript
const response = await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    campaignId: 'campaign-uuid',
    testMode: false, // Set to true for testing
  })
});

const result = await response.json();
console.log(`Sent to ${result.sent_count} recipients`);
```

### Getting Campaign Analytics

```sql
-- Get detailed analytics for a campaign
SELECT get_campaign_analytics('campaign-id');

-- Returns:
{
  "campaign_id": "...",
  "total_sent": 1000,
  "total_delivered": 985,
  "unique_opens": 450,
  "total_opens": 675,
  "unique_clicks": 120,
  "total_clicks": 180,
  "open_rate": 45.68,
  "click_rate": 12.18,
  "unsubscribes": 5,
  "spam_reports": 1
}
```

### Checking Unsubscribe List

```sql
-- Get all unsubscribed emails for a store
SELECT email_address, reason, unsubscribed_at
FROM email_unsubscribes
WHERE store_id = 'your-store-id'
ORDER BY unsubscribed_at DESC;
```

---

## 📈 Analytics & Reporting

### Campaign Performance

The system automatically calculates:

- **Open Rate** = (Unique Opens / Total Sent) × 100
- **Click Rate** = (Unique Clicks / Total Sent) × 100
- **Click-to-Open Rate** = (Unique Clicks / Unique Opens) × 100
- **Bounce Rate** = (Bounces / Total Sent) × 100
- **Unsubscribe Rate** = (Unsubscribes / Total Sent) × 100

### Industry Benchmarks

- **Good Open Rate:** 20-25%
- **Good Click Rate:** 2-5%
- **Good Unsubscribe Rate:** < 0.5%

### Viewing Analytics

```javascript
// Get campaign stats from campaigns table
const { data: campaign } = await supabase
  .from('campaigns')
  .select('*')
  .eq('id', campaignId)
  .single();

console.log(campaign.stats);
// { sent: 1000, opened: 450, clicked: 120 }

// Get detailed analytics
const analytics = await supabase
  .rpc('get_campaign_analytics', { p_campaign_id: campaignId });

console.log(analytics);
```

---

## 🔐 Security Considerations

### 1. Cron Job Protection

The cron endpoint is protected by a secret:

```javascript
// In cron job
if (req.headers['authorization'] !== `Bearer ${CRON_SECRET}`) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

**Setup:**
1. Generate secret: `openssl rand -hex 32`
2. Add to Vercel environment variables: `CRON_SECRET=your-secret`
3. Configure in Vercel Cron Jobs settings

### 2. Email Rate Limiting

The send-email API implements:
- Batch sending (10 emails at a time)
- 1-second delay between batches
- Prevents IP blocking by email providers

### 3. Spam Prevention

- ✅ One-click unsubscribe in email headers
- ✅ Unsubscribe link in every email
- ✅ Checks unsubscribe list before sending
- ✅ Records spam reports

---

## 🐛 Troubleshooting

### Emails Not Sending

**Check:**
1. `RESEND_API_KEY` is set correctly
2. Domain is verified (or using `onboarding@resend.dev`)
3. FROM_EMAIL matches verified domain
4. Check Resend dashboard for errors

**Test:**
```bash
curl https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

### Tracking Not Working

**Check:**
1. `TRACKING_DOMAIN` is set to your production URL
2. Tracking pixel URL is accessible
3. Email client allows images (some block by default)
4. Check browser console for errors

### Cron Job Not Running

**Check:**
1. Vercel cron job is enabled (Pro plan required)
2. Path matches exactly: `/api/cron/send-scheduled-campaigns`
3. Check deployment logs in Vercel
4. Verify function is deployed

**Manual Trigger:**
```bash
curl https://yourdomain.com/api/cron/send-scheduled-campaigns \
  -H "Authorization: Bearer your-cron-secret"
```

### High Bounce Rate

**Causes:**
- Invalid email addresses
- Disposable/temporary emails
- Hard bounces (non-existent domains)

**Solutions:**
1. Validate emails at collection time
2. Remove bounced emails from list
3. Use double opt-in for subscriptions

---

## 🎨 Email Template Best Practices

### HTML Email Guidelines

1. **Use inline CSS** - Email clients strip `<style>` tags
2. **Tables for layout** - Flexbox/Grid not widely supported
3. **Alt text for images** - In case images are blocked
4. **Plain text alternative** - For accessibility
5. **Test across clients** - Gmail, Outlook, Apple Mail, etc.

### Tracking Considerations

The system automatically adds:
- **Tracking pixel** - 1x1 image at end of email
- **Click tracking** - Wraps all links with tracking URL
- **Unsubscribe link** - Added to email headers

### Template Variables

Use `{{variable_name}}` syntax:

```html
<p>Hi {{first_name}},</p>
<p>Your order #{{order_number}} has shipped!</p>
<p>Use code {{discount_code}} for 20% off your next purchase.</p>
```

---

## 📊 Performance Optimization

### Database Indexes

Already created by migration:
```sql
CREATE INDEX idx_email_logs_campaign_id ON email_logs(campaign_id);
CREATE INDEX idx_email_events_type ON email_events(event_type);
CREATE INDEX idx_email_unsubscribes_store_email ON email_unsubscribes(store_id, email_address);
```

### Recommended Monitoring

1. **Email delivery rate** - Should be > 95%
2. **API response times** - Should be < 2s for send-email
3. **Cron job execution time** - Should complete within 5 minutes
4. **Database query performance** - Monitor slow queries

---

## 🚀 Future Enhancements

### Planned Features

1. **A/B Testing**
   - Split campaigns with different subject lines
   - Test content variations
   - Auto-select winner

2. **Advanced Segmentation**
   - Segment by purchase history
   - Behavioral triggers (cart abandonment)
   - Geographic targeting

3. **Email Builder**
   - Drag-and-drop email editor
   - More templates
   - Save custom templates

4. **Automation Workflows**
   - Welcome series
   - Win-back campaigns
   - Post-purchase follow-ups

5. **Enhanced Analytics**
   - Revenue attribution
   - Heatmaps (click tracking)
   - Device/client statistics
   - Geographic data

---

## 💰 Cost Estimate

### Resend Pricing

- **Free:** 3,000 emails/month, 100 emails/day
- **Pro:** $20/month for 50,000 emails
- **Scale:** $80/month for 300,000 emails

### Alternative Providers

- **SendGrid** - Similar pricing, more features
- **Mailgun** - Pay-as-you-go, good for transactional
- **Amazon SES** - $0.10 per 1,000 emails (cheapest)

### Vercel Costs

- **Hobby:** Free (cron jobs not included)
- **Pro:** $20/month (includes cron jobs)
- **Enterprise:** Custom pricing

---

## 📞 Support

### Resources

- [Resend Documentation](https://resend.com/docs)
- [Supabase Email Guide](https://supabase.com/docs/guides/auth/managing-user-data)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

### Common Issues

See **Troubleshooting** section above.

---

**Status:** Production Ready  
**Last Updated:** January 16, 2026  
**Version:** 1.0
