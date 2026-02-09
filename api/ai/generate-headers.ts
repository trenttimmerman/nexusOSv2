/**
 * AI Header Generation API - Vercel Serverless Function
 * Generates 3 unique header designs using Gemini AI
 * Endpoint: POST /api/ai/generate-headers
 * 
 * Designer V3 - Phase 2: API Infrastructure
 */

import { generateComponentVariants } from '../../ai/variantGenerators';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface HeaderGenerationRequest {
  storeId: string;
  brandName: string;
  brandDescription?: string;
  industry?: string;
  colorPreferences?: string[];
  stylePreferences?: ('minimal' | 'bold' | 'elegant' | 'modern')[];
  logoUrl?: string;
}

export interface HeaderGenerationResponse {
  headers: Array<{
    id: string;
    name: string;
    config: any;
    preview: string; // Placeholder for now
    metadata: {
      generatedAt: string;
      model: string;
      designTrends: string[];
    };
  }>;
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
      brandName, 
      brandDescription = '', 
      industry = '', 
      colorPreferences = [],
      stylePreferences = ['modern'],
      logoUrl = ''
    } = req.body as HeaderGenerationRequest;

    if (!storeId || !brandName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['storeId', 'brandName']
      });
    }

    // Check if Google AI API key is configured
    if (!process.env.VITE_GOOGLE_AI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured',
        message: 'Set VITE_GOOGLE_AI_API_KEY environment variable'
      });
    }

    // Fetch or generate vibe and palette for context
    // First try to get existing vibe/palette for this store
    const { data: existingVibe } = await supabase
      .from('store_vibes')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: existingPalette } = await supabase
      .from('color_palettes')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Use existing or create default context
    const vibe = existingVibe || {
      name: stylePreferences[0] || 'modern',
      description: brandDescription || `A ${stylePreferences[0] || 'modern'} ${industry || 'business'}`,
      keywords: [stylePreferences[0] || 'modern', industry || 'professional']
    };

    const palette = existingPalette || {
      primary: colorPreferences[0] || '#3b82f6',
      secondary: colorPreferences[1] || '#8b5cf6',
      background: '#ffffff',
      text: '#000000'
    };

    // Generate user prompt
    const userPrompt = `${brandName} - ${brandDescription || industry || 'professional business'}`;

    // Call AI variant generator
    console.log('[AI Generate Headers] Calling generateComponentVariants with:', {
      componentType: 'header',
      userPrompt,
      vibe: vibe.name,
      palette: palette.primary
    });

    const variants = await generateComponentVariants(
      'header',
      userPrompt,
      vibe,
      palette
    );

    console.log('[AI Generate Headers] Generated variants:', variants.length);

    // Transform variants to response format
    const headers = variants.map((variant: any, index: number) => ({
      id: `ai-header-${Date.now()}-${index}`,
      name: variant.variantName || `${brandName} Header ${index + 1}`,
      config: {
        variant: variant.componentType || 'canvas',
        style: variant.style || {},
        data: variant.data || {},
        layout: variant.layout || 'minimal'
      },
      preview: `/api/headers/preview?id=placeholder-${index}`, // Placeholder
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp',
        designTrends: variant.designTrends || ['2026 Modern', 'AI Generated']
      }
    }));

    // Log generation for analytics
    await supabase.from('ai_generation_log').insert({
      store_id: storeId,
      generation_type: 'header',
      prompt: userPrompt,
      variants_generated: headers.length,
      model: 'gemini-2.0-flash-exp',
      created_at: new Date().toISOString()
    }).catch(err => console.error('[AI Generate Headers] Log error:', err));

    return res.status(200).json({
      success: true,
      headers
    } as HeaderGenerationResponse);

  } catch (error: any) {
    console.error('[AI Generate Headers] Error:', error);
    return res.status(500).json({ 
      error: 'Header generation failed',
      message: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
