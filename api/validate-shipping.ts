/**
 * Shipping Validation API - Vercel Serverless Function
 * Tests shipping provider API credentials
 * Endpoint: POST /api/validate-shipping
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ValidationRequest {
  provider: 'shippo' | 'easypost';
  storeId: string;
  apiKey?: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, storeId, apiKey } = req.body as ValidationRequest;

    if (!provider || !storeId) {
      return res.status(400).json({ error: 'Provider and storeId required' });
    }

    let result: { valid: boolean; message: string; details?: any } = { valid: false, message: '' };

    switch (provider) {
      case 'shippo':
        result = await validateShippo(storeId, apiKey);
        break;
      case 'easypost':
        result = await validateEasyPost(storeId, apiKey);
        break;
      default:
        return res.status(400).json({ error: 'Invalid provider' });
    }

    return res.status(200).json(result);

  } catch (error: any) {
    console.error('Shipping validation error:', error);
    return res.status(500).json({
      valid: false,
      message: error.message || 'Validation failed',
    });
  }
}

/**
 * Validate Shippo API key
 */
async function validateShippo(storeId: string, apiKey?: string) {
  try {
    // Get API key from database if not provided
    if (!apiKey) {
      const { data: secrets } = await supabase
        .from('store_secrets')
        .select('shippo_api_key')
        .eq('store_id', storeId)
        .single();
      apiKey = secrets?.shippo_api_key;
    }

    if (!apiKey) {
      return {
        valid: false,
        message: 'Shippo API key not configured',
      };
    }

    // Test Shippo API by fetching account info
    const response = await fetch('https://api.goshippo.com/carrier_accounts', {
      method: 'GET',
      headers: {
        'Authorization': `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        valid: false,
        message: `Shippo validation failed: ${error.detail || 'Invalid API key'}`,
      };
    }

    const data = await response.json();
    const carriers = data.results || [];

    return {
      valid: true,
      message: 'Shippo API key valid',
      details: {
        carrierCount: carriers.length,
        carriers: carriers.slice(0, 5).map((c: any) => c.carrier),
      },
    };

  } catch (error: any) {
    return {
      valid: false,
      message: `Shippo validation error: ${error.message}`,
    };
  }
}

/**
 * Validate EasyPost API key
 */
async function validateEasyPost(storeId: string, apiKey?: string) {
  try {
    // Get API key from database if not provided
    if (!apiKey) {
      const { data: secrets } = await supabase
        .from('store_secrets')
        .select('easypost_api_key')
        .eq('store_id', storeId)
        .single();
      apiKey = secrets?.easypost_api_key;
    }

    if (!apiKey) {
      return {
        valid: false,
        message: 'EasyPost API key not configured',
      };
    }

    // Test EasyPost API by fetching account info
    const auth = Buffer.from(`${apiKey}:`).toString('base64');
    const response = await fetch('https://api.easypost.com/v2/carrier_accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        valid: false,
        message: `EasyPost validation failed: ${error.error?.message || 'Invalid API key'}`,
      };
    }

    const data = await response.json();
    const carriers = data.carrier_accounts || [];

    return {
      valid: true,
      message: 'EasyPost API key valid',
      details: {
        carrierCount: carriers.length,
        carriers: carriers.slice(0, 5).map((c: any) => c.type),
      },
    };

  } catch (error: any) {
    return {
      valid: false,
      message: `EasyPost validation error: ${error.message}`,
    };
  }
}
