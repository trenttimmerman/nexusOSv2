/**
 * AI Header Generation API - Vercel Serverless Function
 * Generates 3 unique header designs using Gemini AI
 * Endpoint: POST /api/ai/generate-headers
 * 
 * Designer V3 - Phase 2: API Infrastructure
 * 
 * IMPORTANT: This file is fully self-contained for Vercel serverless.
 * Do NOT import from ../../ai/ (causes bundling/runtime crashes).
 */

import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

// Full training prompt inlined for Vercel serverless reliability.
// Vercel treats every .ts in api/ as a handler — external files crash.
const HEADER_AGENT_PROMPT = `You are an expert e-commerce UI designer specializing in header navigation components. You generate production-ready header configurations for the HeaderCanvas2026 component system.

Generate 3 EXTREMELY DIFFERENT header design variants as a JSON array. Each variant must produce a visually distinct, production-ready header.

The HeaderCanvas2026 component renders: Announcement Bar (optional), Utility Bar (optional), Main Header (logo + nav + icons), Mobile Menu Drawer.
All configuration goes into the "style" object. The component merges your values with defaults.

COMPLETE FIELD REFERENCE:

Feature Toggles (boolean):
showSearch (default true), showAccount (true), showCart (true), showCTA (false), showMobileMenu (true), showAnnouncementBar (false), showUtilityBar (false), showCommandPalette (false), enableSmartScroll (false), enableMegaMenu (false), enableSpotlightBorders (false), enableGlassmorphism (false), showCurrencySelector (true), showLanguageSelector (true), announcementDismissible (true), announcementMarquee (false), sticky (true)

Colors (hex strings):
backgroundColor (#ffffff), borderColor (#f3f4f6), textColor (#6b7280), textHoverColor (#000000), accentColor (#3b82f6), cartBadgeColor (#000000), cartBadgeTextColor (#ffffff), iconHoverBackgroundColor (transparent), announcementBackgroundColor (#000000), announcementTextColor (#ffffff), utilityBarBackgroundColor (#f9fafb), utilityBarTextColor (#6b7280), mobileMenuBackgroundColor (#ffffff), mobileMenuTextColor (#000000), searchBackgroundColor (transparent), searchBorderColor (inherit), searchInputTextColor (inherit), ctaBackgroundColor (accent), ctaHoverColor (darker)

Layout & Spacing:
maxWidth (7xl - options: full/7xl/6xl/5xl), paddingX (24px), paddingY (16px), borderWidth (1px - options: 0px/1px/2px), iconSize (20 - range 16-28), mobileMenuPosition (left or right), mobileMenuWidth (320px), mobileMenuOverlayOpacity (50 - range 0-100)

Navigation Style:
navActiveStyle (dot - options: none/dot/underline/capsule/glow/brutalist/minimal/overline/double/bracket/highlight/skewed)
megaMenuStyle (traditional or bento)

Glassmorphism (when enableGlassmorphism: true):
blurIntensity (xl - options: sm/md/lg/xl), glassBackgroundOpacity (60 - range 0-100)

Smart Scroll (when enableSmartScroll: true):
smartScrollThreshold (100), smartScrollDuration (300)

Text Content (goes in "data" object, NOT "style"):
announcementText, searchPlaceholder, ctaText, utilityBarLinks (array of {label, href})

RESPONSE FORMAT - Return ONLY a valid JSON array with exactly 3 objects:
[{"variantName":"Name","layout":"minimal|professional|creative","componentType":"canvas","style":{...all style fields...},"data":{"logo":"BRAND_NAME","announcementText":"...","ctaText":"...","utilityLinks":[...]},"designTrends":["trend1","trend2"]}]

DESIGN RULES:
1. VISUAL DISTINCTION IS CRITICAL - 3 completely different headers. Vary colors, features, glassmorphism, spacing, nav styles.
2. COLOR HARMONY - Minimal: white/light bg, subtle accent. Professional: rich/dark colors, premium. Bold: strong contrast, unexpected combos.
3. FEATURE DIFFERENTIATION - V1: clean (no announcement/utility). V2: full features (announcement+utility+CTA+glassmorphism). V3: selective+unique (spotlight borders, bold nav).
4. PRODUCTION QUALITY - Valid hex colors, correct types, parseable JSON.
5. 2026 TRENDS - Glassmorphism, brutalist nav, generous spacing, micro-interactions, dark mode options.
6. NAV STYLES - Use DIFFERENT navActiveStyle per variant: dot, underline, capsule, glow, bracket, highlight, brutalist.

EXAMPLE for coffee shop (primary #8B4513, secondary #D2691E):
[{"variantName":"Clean Morning Brew","layout":"minimal","componentType":"canvas","style":{"backgroundColor":"#FFFBF5","textColor":"#8B7355","textHoverColor":"#8B4513","accentColor":"#8B4513","borderColor":"#F5E6D3","borderWidth":"1px","showAnnouncementBar":false,"showUtilityBar":false,"enableGlassmorphism":false,"navActiveStyle":"underline","paddingX":"32px","paddingY":"20px","iconSize":18,"cartBadgeColor":"#8B4513"},"data":{"logo":"Bean & Brew"},"designTrends":["Warm Minimal","2026 Clean"]},{"variantName":"Premium Roast","layout":"professional","componentType":"canvas","style":{"backgroundColor":"#1C1210","textColor":"#C4A882","textHoverColor":"#F5E6D3","accentColor":"#D2691E","borderColor":"#2A1F1A","borderWidth":"0px","showCTA":true,"showAnnouncementBar":true,"showUtilityBar":true,"enableGlassmorphism":true,"navActiveStyle":"glow","paddingX":"24px","paddingY":"16px","iconSize":20,"announcementBackgroundColor":"#D2691E","announcementTextColor":"#FFFFFF","utilityBarBackgroundColor":"#150E0B","utilityBarTextColor":"#8B7355","cartBadgeColor":"#D2691E","blurIntensity":"xl","glassBackgroundOpacity":40,"ctaBackgroundColor":"#D2691E"},"data":{"logo":"Bean & Brew","announcementText":"New Single Origin: Ethiopian Yirgacheffe","ctaText":"Order Now","utilityLinks":[{"label":"Find a Store","href":"#"},{"label":"Rewards","href":"#"}]},"designTrends":["Dark Luxury","Glassmorphism"]},{"variantName":"Artisan Bold","layout":"creative","componentType":"canvas","style":{"backgroundColor":"#F5E6D3","textColor":"#5C3D2E","textHoverColor":"#1C1210","accentColor":"#8B4513","borderColor":"#D2B48C","borderWidth":"2px","showAnnouncementBar":true,"enableSpotlightBorders":true,"navActiveStyle":"brutalist","paddingX":"40px","paddingY":"24px","iconSize":24,"announcementBackgroundColor":"#5C3D2E","announcementTextColor":"#F5E6D3","announcementMarquee":true,"cartBadgeColor":"#8B4513","maxWidth":"full"},"data":{"logo":"Bean & Brew","announcementText":"HAND-ROASTED DAILY - FREE LOCAL DELIVERY"},"designTrends":["Neo-Brutalist","Spotlight Borders"]}]

CRITICAL: Return ONLY the JSON array. No markdown fences. No explanation. All hex codes must be valid #RRGGBB. data.logo = brand name.`;

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

  // Wrap EVERYTHING in try-catch so we never get opaque FUNCTION_INVOCATION_FAILED
  try {
    // --- Step 1: Validate environment ---
    const apiKey = process.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'AI service not configured',
        message: 'VITE_GOOGLE_AI_API_KEY environment variable is not set',
        step: 'env-check'
      });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

    // --- Step 2: Parse request body ---
    const {
      storeId,
      brandName,
      brandDescription = '',
      industry = '',
      colorPreferences = [],
      stylePreferences = ['modern'],
    } = req.body || {};

    if (!storeId || !brandName) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['storeId', 'brandName'],
        step: 'validation'
      });
    }

    console.log('[AI Generate Headers] Starting generation for:', brandName);

    // --- Step 3: Get store context from Supabase ---
    let vibe: any = {
      name: stylePreferences[0] || 'modern',
      description: brandDescription || `A ${stylePreferences[0] || 'modern'} ${industry || 'business'}`,
    };
    let palette: any = {
      primary: colorPreferences[0] || '#3b82f6',
      secondary: colorPreferences[1] || '#8b5cf6',
      background: '#ffffff',
    };

    try {
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

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

        if (existingVibe) vibe = existingVibe;
        if (existingPalette) palette = existingPalette;
      }
    } catch (dbErr: any) {
      // Non-fatal: proceed with defaults
      console.warn('[AI Generate Headers] DB lookup failed (using defaults):', dbErr.message);
    }

    // --- Step 4: Build prompt from training file ---
    const userPrompt = `${brandName} - ${brandDescription || industry || 'professional business'}`;

    console.log('[AI Generate Headers] Prompt loaded, length:', HEADER_AGENT_PROMPT.length);

    // Build the full prompt with training + context
    const prompt = `${HEADER_AGENT_PROMPT}

---

## Generation Request

**Brand Name:** ${brandName}
**Brand Description:** ${brandDescription || 'Not provided'}
**Industry:** ${industry || 'Not specified'}
**Vibe:** ${vibe.name} - ${vibe.description || ''}
**Color Palette:**
- Primary: ${palette.primary}
- Secondary: ${palette.secondary}
- Background: ${palette.background}
**Style Preferences:** ${stylePreferences.join(', ')}

Generate 3 headers for "${brandName}" now. Use their brand colors. Set data.logo to "${brandName}".
Return ONLY the JSON array.`;

    // --- Step 5: Call Gemini AI ---
    console.log('[AI Generate Headers] Calling Gemini...');
    let genAI: GoogleGenAI;
    try {
      genAI = new GoogleGenAI({ apiKey });
    } catch (initErr: any) {
      return res.status(500).json({
        error: 'Failed to initialize AI client',
        message: initErr.message,
        step: 'ai-init'
      });
    }

    let aiText: string;
    try {
      const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      aiText = (result.text || '').trim();
      console.log('[AI Generate Headers] Gemini response length:', aiText.length);
    } catch (aiErr: any) {
      return res.status(500).json({
        error: 'Gemini API call failed',
        message: aiErr.message,
        step: 'ai-call'
      });
    }

    // --- Step 6: Parse AI response ---
    let variants: any[];
    try {
      // Strip markdown fences if present
      const cleaned = aiText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      // Find the JSON array
      const startIdx = cleaned.indexOf('[');
      if (startIdx === -1) throw new Error('No JSON array found in AI response');
      
      let depth = 0;
      let endIdx = -1;
      for (let i = startIdx; i < cleaned.length; i++) {
        if (cleaned[i] === '[') depth++;
        else if (cleaned[i] === ']') { depth--; if (depth === 0) { endIdx = i; break; } }
      }
      if (endIdx === -1) throw new Error('Unclosed JSON array in AI response');
      
      variants = JSON.parse(cleaned.substring(startIdx, endIdx + 1));
      console.log('[AI Generate Headers] Parsed variants:', variants.length);
    } catch (parseErr: any) {
      return res.status(500).json({
        error: 'Failed to parse AI response',
        message: parseErr.message,
        aiResponsePreview: aiText.substring(0, 300),
        step: 'parse'
      });
    }

    // --- Step 7: Transform to response format ---
    const headers = variants.map((variant: any, index: number) => ({
      id: `ai-header-${Date.now()}-${index}`,
      name: variant.variantName || `${brandName} Header ${index + 1}`,
      config: {
        variant: variant.componentType || 'canvas',
        style: variant.style || {},
        data: variant.data || {},
        layout: variant.layout || 'minimal'
      },
      preview: `/api/headers/preview?id=placeholder-${index}`,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'gemini-2.5-flash',
        designTrends: variant.designTrends || ['2026 Modern', 'AI Generated']
      }
    }));

    // --- Step 8: Save all 3 headers to shared_header_library ---
    try {
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const libraryEntries = headers.map((h: any) => ({
          name: h.name,
          description: `AI-generated ${h.config.layout || 'modern'} header`,
          component: `// AI Generated Header: ${h.name}\n// Model: gemini-2.5-flash\n// Generated: ${new Date().toISOString()}`,
          config: h.config,
          preview: '',
          created_by: storeId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          times_used: 0,
          tags: ['AI Generated', h.config.layout || 'modern'],
          ai_generated: true,
          design_trends: h.metadata.designTrends || ['2026 Modern'],
          status: 'public'
        }));

        const { data: savedHeaders, error: saveError } = await supabase
          .from('shared_header_library')
          .insert(libraryEntries)
          .select();

        if (saveError) {
          console.warn('[AI Generate Headers] Library save failed (non-fatal):', saveError.message);
        } else {
          console.log('[AI Generate Headers] Saved', savedHeaders?.length, 'headers to library');
          // Update response IDs with real DB IDs
          if (savedHeaders) {
            savedHeaders.forEach((saved: any, i: number) => {
              if (headers[i]) headers[i].id = saved.id;
            });
          }
        }
      }
    } catch (saveErr: any) {
      console.warn('[AI Generate Headers] Library save error (non-fatal):', saveErr.message);
    }

    // --- Step 9: Log for analytics (fire-and-forget) ---
    try {
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        supabase.from('ai_generation_log').insert({
          store_id: storeId,
          generation_type: 'header',
          prompt: userPrompt,
          variants_generated: headers.length,
          model: 'gemini-2.5-flash',
          created_at: new Date().toISOString()
        }).then(({ error }) => {
          if (error) console.error('[AI Generate Headers] Log error:', error);
        });
      }
    } catch (_) { /* non-fatal */ }

    console.log('[AI Generate Headers] Success! Returning', headers.length, 'headers');
    return res.status(200).json({ success: true, headers });

  } catch (error: any) {
    console.error('[AI Generate Headers] Unhandled error:', error);
    return res.status(500).json({
      error: 'Header generation failed',
      message: error.message || 'Unknown error',
      stack: error.stack?.split('\n').slice(0, 5),
      step: 'unhandled'
    });
  }
}
