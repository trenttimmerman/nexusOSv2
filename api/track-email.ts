/**
 * Email Tracking API - Vercel Serverless Function
 * Tracks email opens and clicks
 * Endpoint: GET /api/track-email?token=xxx&type=open|click&url=xxx
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// 1x1 transparent tracking pixel
const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, type, url } = req.query;

    if (!token || !type) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Extract user info from request
    const ipAddress = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Record the event
    const eventData: any = {};
    if (type === 'click' && url) {
      eventData.clicked_url = url;
    }

    await supabase.from('email_events').insert({
      email_log_id: token, // Using email_log id as token
      event_type: type,
      event_data: eventData,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    // Handle response based on type
    if (type === 'open') {
      // Return 1x1 transparent pixel
      res.setHeader('Content-Type', 'image/gif');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.status(200).send(TRACKING_PIXEL);
    }

    if (type === 'click') {
      // Redirect to original URL
      const decodedUrl = decodeURIComponent(url);
      return res.redirect(302, decodedUrl);
    }

    return res.status(200).json({ success: true });

  } catch (error: any) {
    console.error('Tracking error:', error);
    
    // Still return success to avoid breaking user experience
    if (req.query.type === 'open') {
      res.setHeader('Content-Type', 'image/gif');
      return res.status(200).send(TRACKING_PIXEL);
    }
    
    if (req.query.type === 'click' && req.query.url) {
      return res.redirect(302, decodeURIComponent(req.query.url));
    }
    
    return res.status(200).json({ success: false });
  }
}
