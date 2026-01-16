/**
 * Email Unsubscribe API - Vercel Serverless Function  
 * Handles email unsubscribe requests
 * Endpoint: GET /api/unsubscribe?token=xxx&reason=xxx
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  try {
    const { token, reason } = req.query;

    if (!token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invalid Unsubscribe Link</title>
            <style>
              body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              h1 { color: #ef4444; }
            </style>
          </head>
          <body>
            <h1>Invalid Link</h1>
            <p>This unsubscribe link is invalid or has expired.</p>
          </body>
        </html>
      `);
    }

    // Get email details from token (email_log_id)
    const { data: emailLog, error: logError } = await supabase
      .from('email_logs')
      .select('email_address, campaign_id')
      .eq('id', token)
      .single();

    if (logError || !emailLog) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Link Not Found</title>
            <style>
              body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              h1 { color: #ef4444; }
            </style>
          </head>
          <body>
            <h1>Link Not Found</h1>
            <p>This unsubscribe link could not be found.</p>
          </body>
        </html>
      `);
    }

    // Get campaign to find store_id
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('store_id')
      .eq('id', emailLog.campaign_id)
      .single();

    const storeId = campaign?.store_id;

    if (!storeId) {
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error</title>
            <style>
              body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              h1 { color: #ef4444; }
            </style>
          </head>
          <body>
            <h1>Error</h1>
            <p>Unable to process unsubscribe request.</p>
          </body>
        </html>
      `);
    }

    // Handle POST request (form submission with reason)
    if (req.method === 'POST') {
      const { reason: submittedReason } = req.body || {};

      // Add to unsubscribe list
      await supabase.from('email_unsubscribes').upsert({
        store_id: storeId,
        email_address: emailLog.email_address,
        reason: submittedReason || reason || 'No reason provided',
      });

      // Record unsubscribe event
      await supabase.from('email_events').insert({
        email_log_id: token,
        event_type: 'unsubscribe',
        event_data: { reason: submittedReason || reason || 'No reason provided' },
      });

      // Show confirmation page
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribed Successfully</title>
            <style>
              body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
              h1 { color: #10b981; }
              p { color: #6b7280; line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>✓ You've Been Unsubscribed</h1>
            <p><strong>${emailLog.email_address}</strong> has been removed from our email list.</p>
            <p>You will no longer receive marketing emails from us.</p>
            <p>If you change your mind, you can resubscribe by signing up on our website.</p>
          </body>
        </html>
      `);
    }

    // GET request - show unsubscribe form
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe</title>
          <style>
            body { 
              font-family: system-ui; 
              max-width: 600px; 
              margin: 50px auto; 
              padding: 20px; 
              background: #f9fafb;
            }
            .card {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            h1 { color: #111827; margin-top: 0; }
            p { color: #6b7280; line-height: 1.6; }
            .email { 
              font-weight: 600; 
              color: #111827;
              background: #f3f4f6;
              padding: 10px 15px;
              border-radius: 4px;
              display: inline-block;
              margin: 10px 0;
            }
            label {
              display: block;
              margin: 20px 0 8px;
              color: #374151;
              font-weight: 500;
            }
            select {
              width: 100%;
              padding: 10px;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              font-size: 14px;
              margin-bottom: 20px;
            }
            button {
              width: 100%;
              padding: 12px;
              background: #ef4444;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              font-weight: 600;
              cursor: pointer;
            }
            button:hover {
              background: #dc2626;
            }
            .info {
              margin-top: 20px;
              padding: 15px;
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              border-radius: 4px;
              font-size: 14px;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Unsubscribe from Emails</h1>
            <p>We're sorry to see you go. You're about to unsubscribe:</p>
            <div class="email">${emailLog.email_address}</div>
            
            <form method="POST">
              <label for="reason">Why are you unsubscribing? (Optional)</label>
              <select name="reason" id="reason">
                <option value="">Select a reason...</option>
                <option value="too-many-emails">I receive too many emails</option>
                <option value="not-relevant">Content is not relevant to me</option>
                <option value="never-signed-up">I never signed up for this</option>
                <option value="privacy-concerns">Privacy concerns</option>
                <option value="other">Other</option>
              </select>
              
              <button type="submit">Confirm Unsubscribe</button>
            </form>
            
            <div class="info">
              <strong>Note:</strong> You'll stop receiving promotional emails, but may still receive important transactional emails (order confirmations, shipping updates, etc.).
            </div>
          </div>
        </body>
      </html>
    `);

  } catch (error: any) {
    console.error('Unsubscribe error:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: system-ui; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
            h1 { color: #ef4444; }
          </style>
        </head>
        <body>
          <h1>Error</h1>
          <p>An error occurred while processing your request. Please try again later.</p>
        </body>
      </html>
    `);
  }
}
