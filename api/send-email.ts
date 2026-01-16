/**
 * Email Sending API - Vercel Serverless Function
 * Handles sending emails via Resend API with tracking
 * Endpoint: POST /api/send-email
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Resend API configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';
const TRACKING_DOMAIN = process.env.TRACKING_DOMAIN || 'https://yourdomain.com';

interface SendEmailRequest {
  campaignId: string;
  recipients?: string[]; // Optional - if not provided, uses campaign audience
  testMode?: boolean; // If true, only sends to test email
}

interface EmailRecipient {
  email: string;
  customer_id?: string;
  variables?: Record<string, string>;
}

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { campaignId, recipients, testMode } = req.body as SendEmailRequest;

    if (!campaignId) {
      return res.status(400).json({ error: 'Campaign ID is required' });
    }

    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'Email service not configured. Set RESEND_API_KEY environment variable.' });
    }

    // 1. Fetch campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // 2. Get recipient list
    let emailRecipients: EmailRecipient[] = [];

    if (testMode) {
      // Send only to test email
      const testEmail = process.env.TEST_EMAIL || 'test@example.com';
      emailRecipients = [{ email: testEmail }];
    } else if (recipients && recipients.length > 0) {
      // Use provided recipients
      emailRecipients = recipients.map(email => ({ email }));
    } else {
      // Fetch from audience (e.g., "All Subscribers", "VIP Customers")
      emailRecipients = await getAudienceEmails(campaign.audience, campaign.store_id);
    }

    if (emailRecipients.length === 0) {
      return res.status(400).json({ error: 'No recipients found' });
    }

    // 3. Get email content (template + variables)
    const emailContent = await generateEmailContent(
      campaign.content,
      campaign.template_id,
      campaign.template_variables || {}
    );

    // 4. Send emails
    const results = await sendBatchEmails({
      campaign,
      recipients: emailRecipients,
      content: emailContent,
      subject: campaign.subject || 'Newsletter',
    });

    // 5. Update campaign status
    await supabase
      .from('campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        stats: {
          sent: results.successful.length,
          opened: 0,
          clicked: 0,
        },
      })
      .eq('id', campaignId);

    return res.status(200).json({
      success: true,
      campaign_id: campaignId,
      sent_count: results.successful.length,
      failed_count: results.failed.length,
      results,
    });

  } catch (error: any) {
    console.error('Email sending error:', error);
    return res.status(500).json({ 
      error: 'Failed to send emails', 
      message: error.message 
    });
  }
}

/**
 * Get email addresses based on audience definition
 */
async function getAudienceEmails(audience: string, storeId: string): Promise<EmailRecipient[]> {
  const { data: unsubscribes } = await supabase
    .from('email_unsubscribes')
    .select('email_address')
    .eq('store_id', storeId);

  const unsubscribedEmails = new Set(unsubscribes?.map(u => u.email_address) || []);

  if (audience === 'All Subscribers' || audience === 'All Users') {
    const { data: customers } = await supabase
      .from('customers')
      .select('id, email, first_name, last_name')
      .eq('store_id', storeId)
      .not('email', 'is', null);

    return (customers || [])
      .filter(c => !unsubscribedEmails.has(c.email))
      .map(c => ({
        email: c.email,
        customer_id: c.id,
        variables: {
          customer_name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Valued Customer',
          first_name: c.first_name || 'there',
        },
      }));
  }

  if (audience === 'VIP Customers') {
    // Customers with >5 orders or >$500 total spent
    const { data: vips } = await supabase
      .from('customers')
      .select('id, email, first_name, last_name')
      .eq('store_id', storeId)
      .not('email', 'is', null);
    
    // Would need to join with orders to calculate - simplified for now
    return (vips || [])
      .filter(c => !unsubscribedEmails.has(c.email))
      .map(c => ({
        email: c.email,
        customer_id: c.id,
        variables: {
          customer_name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Valued Customer',
          first_name: c.first_name || 'there',
        },
      }));
  }

  // Default: return all customers
  const { data: allCustomers } = await supabase
    .from('customers')
    .select('id, email, first_name, last_name')
    .eq('store_id', storeId)
    .not('email', 'is', null);

  return (allCustomers || [])
    .filter(c => !unsubscribedEmails.has(c.email))
    .map(c => ({
      email: c.email,
      customer_id: c.id,
      variables: {
        customer_name: `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Valued Customer',
        first_name: c.first_name || 'there',
      },
    }));
}

/**
 * Generate email content from template or custom content
 */
async function generateEmailContent(
  content: string,
  templateId: string | null,
  templateVariables: Record<string, string>
): Promise<string> {
  // If using template, load it
  if (templateId) {
    // Templates are in EmailTemplates.tsx - would need to export as HTML strings
    // For now, use content directly
    return replaceVariables(content, templateVariables);
  }

  return content;
}

/**
 * Replace template variables in content
 */
function replaceVariables(content: string, variables: Record<string, string>): string {
  let result = content;
  
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  
  return result;
}

/**
 * Send batch of emails via Resend
 */
async function sendBatchEmails({
  campaign,
  recipients,
  content,
  subject,
}: {
  campaign: any;
  recipients: EmailRecipient[];
  content: string;
  subject: string;
}): Promise<{ successful: any[]; failed: any[] }> {
  const successful: any[] = [];
  const failed: any[] = [];

  // Send in batches of 10 to avoid rate limits
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    
    await Promise.all(
      batch.map(async (recipient) => {
        try {
          // Create email log entry first to get tracking token
          const { data: emailLog, error: logError } = await supabase
            .from('email_logs')
            .insert({
              campaign_id: campaign.id,
              customer_id: recipient.customer_id,
              email_address: recipient.email,
              subject,
              delivery_status: 'sent',
            })
            .select()
            .single();

          if (logError || !emailLog) {
            throw new Error('Failed to create email log');
          }

          // Generate tracking token
          const trackingToken = emailLog.id;

          // Add tracking pixel and links
          const trackedContent = addTracking(content, trackingToken);

          // Replace personalization variables
          const personalizedContent = replaceVariables(
            trackedContent,
            recipient.variables || {}
          );

          // Send via Resend API
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: FROM_EMAIL,
              to: recipient.email,
              subject,
              html: personalizedContent,
              headers: {
                'List-Unsubscribe': `<${TRACKING_DOMAIN}/api/unsubscribe?token=${trackingToken}>`,
              },
            }),
          });

          const result = await response.json();

          if (response.ok) {
            // Update log with provider message ID
            await supabase
              .from('email_logs')
              .update({
                provider_message_id: result.id,
                delivery_status: 'delivered',
              })
              .eq('id', emailLog.id);

            successful.push({
              email: recipient.email,
              log_id: emailLog.id,
              message_id: result.id,
            });
          } else {
            throw new Error(result.message || 'Failed to send email');
          }

        } catch (error: any) {
          console.error(`Failed to send to ${recipient.email}:`, error);
          
          // Log failure
          await supabase
            .from('email_logs')
            .update({
              delivery_status: 'failed',
              error_message: error.message,
            })
            .eq('campaign_id', campaign.id)
            .eq('email_address', recipient.email);

          failed.push({
            email: recipient.email,
            error: error.message,
          });
        }
      })
    );

    // Rate limiting delay between batches
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return { successful, failed };
}

/**
 * Add tracking pixel and link tracking to email HTML
 */
function addTracking(html: string, trackingToken: string): string {
  // Add tracking pixel for opens
  const trackingPixel = `<img src="${TRACKING_DOMAIN}/api/track-email?token=${trackingToken}&type=open" width="1" height="1" alt="" style="display:none;" />`;
  
  // Insert before closing body tag or at end
  let tracked = html.includes('</body>') 
    ? html.replace('</body>', `${trackingPixel}</body>`)
    : html + trackingPixel;

  // Wrap all links with click tracking
  tracked = tracked.replace(
    /<a\s+href="([^"]+)"([^>]*)>/gi,
    (match, url, attrs) => {
      // Skip if already tracking or is unsubscribe link
      if (url.includes('/api/track-email') || url.includes('/api/unsubscribe')) {
        return match;
      }
      
      const trackingUrl = `${TRACKING_DOMAIN}/api/track-email?token=${trackingToken}&type=click&url=${encodeURIComponent(url)}`;
      return `<a href="${trackingUrl}"${attrs}>`;
    }
  );

  return tracked;
}
