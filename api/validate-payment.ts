/**
 * Payment Validation API - Vercel Serverless Function
 * Tests payment provider API credentials
 * Endpoint: POST /api/validate-payment
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface ValidationRequest {
  provider: 'stripe' | 'paypal' | 'square';
  storeId: string;
  credentials?: {
    publishableKey?: string;
    secretKey?: string;
    clientId?: string;
    clientSecret?: string;
    applicationId?: string;
    locationId?: string;
    accessToken?: string;
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, storeId, credentials } = req.body as ValidationRequest;

    if (!provider || !storeId) {
      return res.status(400).json({ error: 'Provider and storeId required' });
    }

    let result: { valid: boolean; message: string; details?: any } = { valid: false, message: '' };

    switch (provider) {
      case 'stripe':
        result = await validateStripe(storeId, credentials);
        break;
      case 'paypal':
        result = await validatePayPal(storeId, credentials);
        break;
      case 'square':
        result = await validateSquare(storeId, credentials);
        break;
      default:
        return res.status(400).json({ error: 'Invalid provider' });
    }

    return res.status(200).json(result);

  } catch (error: any) {
    console.error('Payment validation error:', error);
    return res.status(500).json({
      valid: false,
      message: error.message || 'Validation failed',
    });
  }
}

/**
 * Validate Stripe credentials
 */
async function validateStripe(storeId: string, credentials?: any) {
  try {
    // Get credentials from database if not provided
    let secretKey = credentials?.secretKey;
    let publishableKey = credentials?.publishableKey;

    if (!secretKey) {
      const { data: secrets } = await supabase
        .from('store_secrets')
        .select('stripe_secret_key')
        .eq('store_id', storeId)
        .single();
      secretKey = secrets?.stripe_secret_key;
    }

    if (!publishableKey) {
      const { data: config } = await supabase
        .from('store_config')
        .select('stripe_publishable_key')
        .eq('store_id', storeId)
        .single();
      publishableKey = config?.stripe_publishable_key;
    }

    if (!secretKey) {
      return {
        valid: false,
        message: 'Stripe secret key not configured',
      };
    }

    // Test Stripe API by retrieving account info
    const response = await fetch('https://api.stripe.com/v1/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        valid: false,
        message: `Stripe validation failed: ${error.error?.message || 'Invalid credentials'}`,
      };
    }

    const balance = await response.json();

    return {
      valid: true,
      message: 'Stripe credentials valid',
      details: {
        currency: balance.available?.[0]?.currency || 'usd',
        livemode: balance.livemode,
      },
    };

  } catch (error: any) {
    return {
      valid: false,
      message: `Stripe validation error: ${error.message}`,
    };
  }
}

/**
 * Validate PayPal credentials
 */
async function validatePayPal(storeId: string, credentials?: any) {
  try {
    let clientId = credentials?.clientId;
    let clientSecret = credentials?.clientSecret;

    if (!clientId) {
      const { data: config } = await supabase
        .from('store_config')
        .select('paypal_client_id')
        .eq('store_id', storeId)
        .single();
      clientId = config?.paypal_client_id;
    }

    if (!clientSecret) {
      const { data: secrets } = await supabase
        .from('store_secrets')
        .select('paypal_client_secret')
        .eq('store_id', storeId)
        .single();
      clientSecret = secrets?.paypal_client_secret;
    }

    if (!clientId || !clientSecret) {
      return {
        valid: false,
        message: 'PayPal credentials not configured',
      };
    }

    // Get PayPal OAuth token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      return {
        valid: false,
        message: `PayPal validation failed: ${error.error_description || 'Invalid credentials'}`,
      };
    }

    const tokenData = await tokenResponse.json();

    return {
      valid: true,
      message: 'PayPal credentials valid',
      details: {
        scope: tokenData.scope,
        expiresIn: tokenData.expires_in,
      },
    };

  } catch (error: any) {
    return {
      valid: false,
      message: `PayPal validation error: ${error.message}`,
    };
  }
}

/**
 * Validate Square credentials
 */
async function validateSquare(storeId: string, credentials?: any) {
  try {
    let accessToken = credentials?.accessToken;
    let applicationId = credentials?.applicationId;
    let locationId = credentials?.locationId;

    if (!applicationId) {
      const { data: config } = await supabase
        .from('store_config')
        .select('square_application_id, square_location_id')
        .eq('store_id', storeId)
        .single();
      applicationId = config?.square_application_id;
      locationId = config?.square_location_id;
    }

    if (!accessToken) {
      const { data: secrets } = await supabase
        .from('store_secrets')
        .select('square_access_token')
        .eq('store_id', storeId)
        .single();
      accessToken = secrets?.square_access_token;
    }

    if (!accessToken) {
      return {
        valid: false,
        message: 'Square access token not configured',
      };
    }

    // Test Square API by fetching locations
    const response = await fetch('https://connect.squareup.com/v2/locations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-01-18',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        valid: false,
        message: `Square validation failed: ${error.errors?.[0]?.detail || 'Invalid credentials'}`,
      };
    }

    const data = await response.json();
    const locations = data.locations || [];

    return {
      valid: true,
      message: 'Square credentials valid',
      details: {
        locationCount: locations.length,
        configuredLocation: locationId || locations[0]?.id,
      },
    };

  } catch (error: any) {
    return {
      valid: false,
      message: `Square validation error: ${error.message}`,
    };
  }
}
