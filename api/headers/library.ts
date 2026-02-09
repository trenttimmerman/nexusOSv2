/**
 * Header Library API - Vercel Serverless Function
 * Fetches shared headers from community library
 * Endpoint: GET /api/headers/library
 * 
 * Designer V3 - Phase 2: API Infrastructure
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      status = 'public',
      limit = 50,
      offset = 0,
      sortBy = 'created_at',
      sortOrder = 'desc',
      tags = '',
      aiGenerated,
      storeId
    } = req.query;

    // Build query
    let query = supabase
      .from('shared_header_library')
      .select('*');

    // Filter by status
    if (status) {
      const statuses = status.split(',');
      if (statuses.length === 1) {
        query = query.eq('status', statuses[0]);
      } else {
        query = query.in('status', statuses);
      }
    }

    // Filter by AI generated
    if (aiGenerated !== undefined) {
      query = query.eq('ai_generated', aiGenerated === 'true');
    }

    // Filter by tags
    if (tags) {
      const tagList = tags.split(',').map((t: string) => t.trim());
      query = query.contains('tags', tagList);
    }

    // Filter by creator (private headers)
    if (storeId) {
      query = query.or(`status.eq.public,status.eq.community,created_by.eq.${storeId}`);
    }

    // Sort
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

    const { data: headers, error, count } = await query;

    if (error) {
      console.error('[Header Library] Query error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch headers',
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      headers: headers || [],
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: count || headers?.length || 0
      }
    });

  } catch (error: any) {
    console.error('[Header Library] Error:', error);
    return res.status(500).json({ 
      error: 'Library fetch failed',
      message: error.message || 'Unknown error'
    });
  }
}
