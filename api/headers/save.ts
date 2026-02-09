/**
 * Header Save API - Vercel Serverless Function
 * Saves custom header design to shared library
 * Endpoint: POST /api/headers/save
 * 
 * Designer V3 - Phase 2: API Infrastructure
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface HeaderSaveRequest {
  storeId: string;
  name: string;
  description?: string;
  config: any; // HeaderConfig object
  preview?: string; // Screenshot URL or base64
  tags?: string[];
  status?: 'public' | 'private' | 'community';
  aiGenerated?: boolean;
  designTrends?: string[];
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      storeId, 
      name, 
      description = '',
      config,
      preview = '',
      tags = [],
      status = 'private',
      aiGenerated = false,
      designTrends = []
    } = req.body as HeaderSaveRequest;

    if (!storeId || !name || !config) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['storeId', 'name', 'config']
      });
    }

    // Validate config is an object
    if (typeof config !== 'object') {
      return res.status(400).json({ 
        error: 'Invalid config',
        message: 'Config must be a valid JSON object'
      });
    }

    // Generate component code placeholder (Phase 3: will use template system)
    const componentCode = `// Header: ${name}
// Generated: ${new Date().toISOString()}
// AI Generated: ${aiGenerated}

import React from 'react';
import { Header Canvas } from '../components/HeaderLibrary';

export const ${name.replace(/[^a-zA-Z0-9]/g, '')}Header = (props) => {
  const config = ${JSON.stringify(config, null, 2)};
  return <HeaderCanvas {...props} data={config} />;
};
`;

    // Insert into shared_header_library
    const { data: savedHeader, error } = await supabase
      .from('shared_header_library')
      .insert({
        name,
        description,
        component: componentCode,
        config,
        preview: preview || '/placeholder-header.png',
        created_by: storeId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        times_used: 0,
        tags,
        ai_generated: aiGenerated,
        design_trends: designTrends,
        status
      })
      .select()
      .single();

    if (error) {
      console.error('[Header Save] Insert error:', error);
      return res.status(500).json({ 
        error: 'Failed to save header',
        message: error.message,
        details: error.details
      });
    }

    console.log('[Header Save] Successfully saved header:', savedHeader.id);

    return res.status(201).json({
      success: true,
      header: savedHeader
    });

  } catch (error: any) {
    console.error('[Header Save] Error:', error);
    return res.status(500).json({ 
      error: 'Header save failed',
      message: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
