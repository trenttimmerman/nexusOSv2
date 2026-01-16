import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Collection Analytics API
 * Retrieves analytics data for collections
 * 
 * Endpoints:
 * - /api/collection-analytics?type=summary&storeId=xxx&period=week
 * - /api/collection-analytics?type=trending&storeId=xxx
 * - /api/collection-analytics?type=top-products&collectionId=xxx&period=week
 * - /api/collection-analytics?type=funnel&collectionId=xxx&period=week
 */

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, storeId, collectionId, period = 'all_time', limit = 10 } = req.query;

    if (!type) {
      return res.status(400).json({ error: 'Missing required parameter: type' });
    }

    switch (type) {
      case 'summary':
        return await getCollectionSummary(res, storeId, period);
      
      case 'trending':
        return await getTrendingCollections(res, storeId);
      
      case 'top-products':
        return await getTopProducts(res, collectionId, period, limit);
      
      case 'funnel':
        return await getConversionFunnel(res, collectionId, period);
      
      case 'stats':
        return await getCollectionStats(res, collectionId, period);
      
      default:
        return res.status(400).json({ 
          error: 'Invalid type. Must be one of: summary, trending, top-products, funnel, stats' 
        });
    }

  } catch (error: any) {
    console.error('Error in collection-analytics:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Get summary of all collections for a store
async function getCollectionSummary(res: any, storeId: string, period: string) {
  if (!storeId) {
    return res.status(400).json({ error: 'Missing required parameter: storeId' });
  }

  const { data, error } = await supabase
    .from('collection_stats')
    .select(`
      *,
      collections!inner(id, name, type)
    `)
    .eq('store_id', storeId)
    .eq('period', period)
    .order('revenue', { ascending: false });

  if (error) {
    console.error('Error fetching collection summary:', error);
    return res.status(500).json({ error: 'Failed to fetch collection summary' });
  }

  return res.status(200).json({ success: true, data });
}

// Get trending collections
async function getTrendingCollections(res: any, storeId: string) {
  if (!storeId) {
    return res.status(400).json({ error: 'Missing required parameter: storeId' });
  }

  const { data, error } = await supabase
    .from('trending_collections')
    .select('*')
    .eq('store_id', storeId)
    .order('recent_activity', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching trending collections:', error);
    return res.status(500).json({ error: 'Failed to fetch trending collections' });
  }

  return res.status(200).json({ success: true, data });
}

// Get top performing products in a collection
async function getTopProducts(res: any, collectionId: string, period: string, limit: number) {
  if (!collectionId) {
    return res.status(400).json({ error: 'Missing required parameter: collectionId' });
  }

  const { data, error } = await supabase.rpc('get_top_collection_products', {
    p_collection_id: collectionId,
    p_period: period,
    p_limit: parseInt(limit as string) || 10
  });

  if (error) {
    console.error('Error fetching top products:', error);
    return res.status(500).json({ error: 'Failed to fetch top products' });
  }

  return res.status(200).json({ success: true, data });
}

// Get conversion funnel for a collection
async function getConversionFunnel(res: any, collectionId: string, period: string) {
  if (!collectionId) {
    return res.status(400).json({ error: 'Missing required parameter: collectionId' });
  }

  // Determine date filter
  let dateFilter = '1970-01-01';
  switch (period) {
    case 'today':
      dateFilter = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
      break;
    case 'week':
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = weekAgo.toISOString();
      break;
    case 'month':
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = monthAgo.toISOString();
      break;
  }

  const { data, error } = await supabase
    .from('collection_events')
    .select('event_type')
    .eq('collection_id', collectionId)
    .gte('created_at', dateFilter);

  if (error) {
    console.error('Error fetching conversion funnel:', error);
    return res.status(500).json({ error: 'Failed to fetch conversion funnel' });
  }

  // Calculate funnel metrics
  const events = data || [];
  const views = events.filter(e => e.event_type === 'view').length;
  const clicks = events.filter(e => e.event_type === 'click').length;
  const addToCarts = events.filter(e => e.event_type === 'add_to_cart').length;
  const purchases = events.filter(e => e.event_type === 'purchase').length;

  const funnel = {
    views,
    clicks,
    addToCarts,
    purchases,
    clickRate: views > 0 ? ((clicks / views) * 100).toFixed(2) : '0.00',
    cartRate: clicks > 0 ? ((addToCarts / clicks) * 100).toFixed(2) : '0.00',
    conversionRate: views > 0 ? ((purchases / views) * 100).toFixed(2) : '0.00',
    purchaseRate: addToCarts > 0 ? ((purchases / addToCarts) * 100).toFixed(2) : '0.00'
  };

  return res.status(200).json({ success: true, data: funnel });
}

// Get stats for a specific collection
async function getCollectionStats(res: any, collectionId: string, period: string) {
  if (!collectionId) {
    return res.status(400).json({ error: 'Missing required parameter: collectionId' });
  }

  const { data, error } = await supabase
    .from('collection_stats')
    .select('*')
    .eq('collection_id', collectionId)
    .eq('period', period)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error fetching collection stats:', error);
    return res.status(500).json({ error: 'Failed to fetch collection stats' });
  }

  // If no stats exist yet, return zeros
  if (!data) {
    return res.status(200).json({ 
      success: true, 
      data: {
        collection_id: collectionId,
        period,
        views: 0,
        clicks: 0,
        add_to_carts: 0,
        purchases: 0,
        revenue: 0,
        conversion_rate: 0,
        avg_order_value: 0
      }
    });
  }

  return res.status(200).json({ success: true, data });
}
