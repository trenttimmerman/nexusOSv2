import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Track Collection Event API
 * Records user interactions with collections for analytics
 * 
 * Events:
 * - view: Collection section displayed
 * - click: User clicked on a product in the collection
 * - add_to_cart: Product from collection added to cart
 * - purchase: Product from collection purchased
 */

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      storeId,
      collectionId,
      sectionId,
      eventType,
      productId,
      customerId,
      sessionId,
      revenue,
      metadata = {}
    } = req.body;

    // Validation
    if (!storeId || !collectionId || !eventType) {
      return res.status(400).json({ 
        error: 'Missing required fields: storeId, collectionId, eventType' 
      });
    }

    const validEventTypes = ['view', 'click', 'add_to_cart', 'purchase'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({ 
        error: `Invalid eventType. Must be one of: ${validEventTypes.join(', ')}` 
      });
    }

    // For purchase events, revenue is required
    if (eventType === 'purchase' && !revenue) {
      return res.status(400).json({ 
        error: 'Revenue is required for purchase events' 
      });
    }

    // Track the event
    const { data, error } = await supabase.rpc('track_collection_event', {
      p_store_id: storeId,
      p_collection_id: collectionId,
      p_section_id: sectionId || null,
      p_event_type: eventType,
      p_product_id: productId || null,
      p_customer_id: customerId || null,
      p_session_id: sessionId || null,
      p_revenue: revenue || 0,
      p_metadata: metadata
    });

    if (error) {
      console.error('Error tracking collection event:', error);
      return res.status(500).json({ error: 'Failed to track event' });
    }

    // Return success with event ID
    return res.status(200).json({ 
      success: true, 
      eventId: data,
      message: `${eventType} event tracked successfully`
    });

  } catch (error: any) {
    console.error('Error in track-collection-event:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
