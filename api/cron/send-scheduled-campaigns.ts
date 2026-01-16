/**
 * Scheduled Campaign Cron Job - Vercel Serverless Function
 * Automatically sends scheduled campaigns when their time arrives
 * Endpoint: GET /api/cron/send-scheduled-campaigns
 * 
 * Setup in Vercel:
 * 1. Go to Project Settings > Cron Jobs
 * 2. Add cron: */5 * * * * (every 5 minutes)
 * 3. Set path: /api/cron/send-scheduled-campaigns
 * 
 * Or add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/send-scheduled-campaigns",
 *     "schedule": "*/5 * * * *"
 *   }]
 * }
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Vercel Cron Secret for security
const CRON_SECRET = process.env.CRON_SECRET || '';

export default async function handler(req: any, res: any) {
  // Verify cron secret if configured
  if (CRON_SECRET && req.headers['authorization'] !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('[CRON] Checking for scheduled campaigns...');

    // Find campaigns that are scheduled and due to be sent
    const now = new Date().toISOString();
    const { data: scheduledCampaigns, error: fetchError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now) // scheduled_for <= now
      .not('scheduled_for', 'is', null);

    if (fetchError) {
      throw new Error(`Failed to fetch campaigns: ${fetchError.message}`);
    }

    if (!scheduledCampaigns || scheduledCampaigns.length === 0) {
      console.log('[CRON] No campaigns to send');
      return res.status(200).json({
        success: true,
        message: 'No campaigns to send',
        processed: 0,
      });
    }

    console.log(`[CRON] Found ${scheduledCampaigns.length} campaigns to send`);

    // Process each campaign
    const results = await Promise.allSettled(
      scheduledCampaigns.map(async (campaign) => {
        try {
          console.log(`[CRON] Processing campaign: ${campaign.id} - ${campaign.name}`);

          // Call the send-email endpoint
          const sendResponse = await fetch(
            `${req.headers.host || 'http://localhost:3000'}/api/send-email`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                campaignId: campaign.id,
                testMode: false,
              }),
            }
          );

          if (!sendResponse.ok) {
            const errorData = await sendResponse.json();
            throw new Error(errorData.error || 'Failed to send campaign');
          }

          const sendData = await sendResponse.json();
          console.log(`[CRON] ✓ Campaign sent: ${campaign.id} - ${sendData.sent_count} emails`);

          return {
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            success: true,
            sent_count: sendData.sent_count,
          };
        } catch (error: any) {
          console.error(`[CRON] ✗ Failed to send campaign ${campaign.id}:`, error);

          // Mark campaign as failed
          await supabase
            .from('campaigns')
            .update({
              status: 'draft', // Revert to draft so it can be fixed and rescheduled
            })
            .eq('id', campaign.id);

          return {
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            success: false,
            error: error.message,
          };
        }
      })
    );

    // Summarize results
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length;

    const summary = {
      success: true,
      message: `Processed ${scheduledCampaigns.length} campaigns`,
      successful,
      failed,
      details: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Unknown error' }),
    };

    console.log('[CRON] Summary:', summary);

    return res.status(200).json(summary);

  } catch (error: any) {
    console.error('[CRON] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

// Export config for Vercel Cron
export const config = {
  maxDuration: 300, // 5 minutes max execution time
};
