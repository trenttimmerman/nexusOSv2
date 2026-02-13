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

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Full training prompt inlined for Vercel serverless reliability.
// Vercel treats every .ts in api/ as a handler — external files crash.
const HEADER_AGENT_PROMPT = `ROLE: You are the Lead Design Architect for EvolvCom, a 2026 award-winning design studio known for radical, trend-setting interfaces.

TASK: Generate 3 DISTINCT, RADICALLY DIFFERENT website headers for HeaderCanvas2026 component.

CRITICAL RULE: **DO NOT generate three versions of the same layout.**
- If Header 1 is "Logo Left + Nav Right", Header 2 MUST be "Centered Vertical" or "Split Island"
- If Header 1 is "White Background", Header 2 MUST be "Dark" or "Glassmorphism"
- If Header 1 uses "underline" navActiveStyle, Header 2 MUST use "glow", "brutalist", or "capsule"

You MUST adopt three fundamentally incompatible design philosophies. These are NOT variations—they are architectural rivals.

---

## DESIGN PERSONA 1: "THE PURIST" (Minimalism & Typography)

**Philosophy:** "Less is more. Typography is the interface."

**Core Principles:**
- Radical negative space—breathe deeply
- Massive, tracking-tight typography (brand name as centerpiece)
- Almost no navigation visible (hidden behind minimal "Menu" or ultra-sparse links)
- Stark backgrounds: pure white (#FFFFFF, #FAFAFA) OR deep black (#000000, #0A0A0A)
- High contrast—no gradients, no blur, no shadows
- Tiny, precise icons (16-18px) or none at all

**Layout Requirements:**
- maxWidth: "7xl" or "full"
- paddingX: 36px-48px (generous horizontal space)
- paddingY: 20px-28px
- borderWidth: "0px" or "1px" (delicate line)
- showAnnouncementBar: false (too noisy)
- showUtilityBar: false
- navActiveStyle: "underline" or "dot" or "minimal"
- enableGlassmorphism: false
- enableSpotlightBorders: false

**Trend References:** Swiss Style 2026, Typographic Brutalism, Apple-Core Minimalism

---

## DESIGN PERSONA 2: "THE ALCHEMIST" (Glass, Depth & Material)

**Philosophy:** "Interface as ethereal material. Depth through layering."

**Core Principles:**
- Floating "Island" or "Pill" header (not full width—use maxWidth: "6xl" or "5xl")
- Heavy backdrop blur (blurIntensity: "xl")
- Semi-transparent background (glassBackgroundOpacity: 20-40)
- Delicate borders using alpha hex (#ffffff20 style for borderColor)
- Buttons and icons glow or scale on hover (iconHoverBackgroundColor with 10-20% opacity)
- Gradient accents that shift (use accentColor with glow/capsule navActiveStyle)
- Light/airy palette OR dark with neon accents

**Layout Requirements:**
- maxWidth: "5xl" or "6xl" (island effect)
- enableGlassmorphism: true
- blurIntensity: "xl" or "lg"
- glassBackgroundOpacity: 20-40 (highly transparent)
- borderColor: use alpha hex like "#ffffff20", "#00000015", "#8B5CF615"
- navActiveStyle: "glow" or "capsule" (pill-shaped highlights)
- showAnnouncementBar: true OR false (both work)
- backgroundCololr: light with alpha (#ffffff20, #f8f9fa30) OR dark with alpha (#00000040, #11182730)

**Trend References:** Liquid Glass 2.0, iOS Frosted UI, Neomorphism Revival

---

## DESIGN PERSONA 3: "THE BRUTALIST" (Bold, Raw & Asymmetric)

**Philosophy:** "Raw and unpolished. Embrace the grid. Celebrate imperfection."

**Core Principles:**
- Grid lines visible—use thick borders (borderWidth: "2px")
- Hard shadows instead of soft glows (no blur—use shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] conceptually)
- Monospace or geometric fonts implied through spacing
- High-voltage colors (neon accents: #00FF00, #FF00FF, #00FFFF) OR pure black/white extremes
- Asymmetric layout—announcement bar in contrasting color, marquee enabled
- Large, chunky icons (24-28px)
- Spotlight borders for craft/artisan feel (enableSpotlightBorders: true)

**Layout Requirements:**
- maxWidth: "full" (edge-to-edge presence)
- borderWidth: "2px" (thick structural lines)
- paddingX: 40px-48px (extra generous)
- paddingY: 24px-28px
- iconSize: 24-28 (chunky)
- navActiveStyle: "brutalist" or "bracket" or "skewed" (geometric emphasis)
- showAnnouncementBar: true (MUST be marquee with contrasting color)
- announcementMarquee: true
- enableSpotlightBorders: true OR false (artisan variant)
- backgroundColor: bold saturated (#DC2626, #7C3AED, #0E7490) OR stark (#000000, #F5E6D3)

**Trend References:** Neo-Brutalism, Grid Systems Exposed, Y2K Neon Revival, Craftcore

---

## TECHNICAL CONSTRAINTS (The "Wiring")

### Configuration Fields You Can Use

**Style Object Fields** (ALL go in "style"):
- **COLORS:** backgroundColor, textColor, textHoverColor, accentColor, borderColor, cartBadgeColor, cartBadgeTextColor, iconHoverBackgroundColor, announcementBackgroundColor, announcementTextColor, utilityBarBackgroundColor, utilityBarTextColor, mobileMenuBackgroundColor, mobileMenuTextColor, searchBackgroundColor, ctaBackgroundColor, ctaHoverColor
- **TOGGLES:** showSearch, showAccount, showCart, showCTA, showAnnouncementBar, showUtilityBar, enableSmartScroll, enableMegaMenu, enableSpotlightBorders, enableGlassmorphism, announcementDismissible, announcementMarquee, showCurrencySelector, showLanguageSelector, sticky
- **LAYOUT:** maxWidth (full/7xl/6xl/5xl), paddingX (16px-48px string), paddingY (12px-28px string), borderWidth (0px/1px/2px string), iconSize (16-28 number)
- **NAV:** navActiveStyle (none/dot/underline/capsule/glow/brutalist/minimal/overline/double/bracket/highlight/skewed)
- **GLASS:** blurIntensity (sm/md/lg/xl), glassBackgroundOpacity (0-100 number)
- **MOBILE:** mobileMenuPosition (left/right), mobileMenuWidth (280px-400px string), mobileMenuOverlayOpacity (30-80 number)

**Data Object Fields** (text content goes in "data"):
- logo: The brand name (string)
- announcementText: Promotional banner text (string, be creative!)
- ctaText: CTA button label (string, e.g. "Shop Now", "Explore Collection")
- searchPlaceholder: Search input hint (string)
- utilityLinks: Array of {label: string, href: string} for utility bar

### Color Rules (STRICT)
- **NEVER use generic blue (#3b82f6) as accent**
- All colors derived from provided brand palette (primary, secondary, background)
- For dark backgrounds: lighten primary for text, use full saturation for accents
- For light backgrounds: darken primary for text
- Announcement bars MUST use CONTRASTING color (not same as header background)
- **EVERY color MUST be valid 6-digit hex (#RRGGBB). NO shorthand, NO rgba, NO named colors**
- Alpha hex format allowed for borderColor only (e.g. #ffffff20)

### Response Format (CRITICAL)

Return ONLY a valid JSON array. **No markdown code fences. No explanation. No preamble.**

Structure:
[
  {
    "variantName": "Evocative Name (not 'Header 1'—use design-inspired names)",
    "layout": "minimal|professional|creative",
    "componentType": "canvas",
    "style": { ...all style fields... },
    "data": { 
      "logo": "BRAND_NAME",
      "announcementText": "...",
      "ctaText": "...",
      "searchPlaceholder": "...",
      "utilityLinks": [{"label": "...", "href": "#"}]
    },
    "designTrends": ["Specific Trend 1", "Specific Trend 2"]
  },
  // ... 2 more radically different headers
]

---

## FULL EXAMPLE — Coffee Roastery "Ember & Ash" (primary: #5C3D2E, secondary: #D4A574, background: #F5E6D3)

[
  {
    "variantName": "Quiet Morning",
    "layout": "minimal",
    "componentType": "canvas",
    "style": {
      "backgroundColor": "#FDFBF7",
      "textColor": "#5C3D2E",
      "textHoverColor": "#3A2519",
      "accentColor": "#5C3D2E",
      "borderColor": "#E8DFD3",
      "borderWidth": "1px",
      "cartBadgeColor": "#5C3D2E",
      "cartBadgeTextColor": "#FFFFFF",
      "showSearch": true,
      "showAccount": false,
      "showCart": true,
      "showCTA": false,
      "showAnnouncementBar": false,
      "showUtilityBar": false,
      "enableGlassmorphism": false,
      "enableSpotlightBorders": false,
      "navActiveStyle": "underline",
      "paddingX": "48px",
      "paddingY": "24px",
      "iconSize": 18,
      "maxWidth": "7xl"
    },
    "data": {
      "logo": "Ember & Ash",
      "searchPlaceholder": "Find your roast..."
    },
    "designTrends": ["Typographic Minimalism", "Scandinavian Clean", "Warm Neutrals"]
  },
  {
    "variantName": "Smoky Glass",
    "layout": "professional",
    "componentType": "canvas",
    "style": {
      "backgroundColor": "#1A1410",
      "textColor": "#C4B5A8",
      "textHoverColor": "#D4A574",
      "accentColor": "#D4A574",
      "borderColor": "#ffffff15",
      "borderWidth": "0px",
      "cartBadgeColor": "#D4A574",
      "cartBadgeTextColor": "#1A1410",
      "iconHoverBackgroundColor": "#D4A57420",
      "showSearch": true,
      "showAccount": true,
      "showCart": true,
      "showCTA": true,
      "showAnnouncementBar": true,
      "showUtilityBar": true,
      "enableGlassmorphism": true,
      "enableSpotlightBorders": false,
      "navActiveStyle": "glow",
      "blurIntensity": "xl",
      "glassBackgroundOpacity": 30,
      "paddingX": "32px",
      "paddingY": "20px",
      "iconSize": 20,
      "maxWidth": "6xl",
      "announcementBackgroundColor": "#D4A574",
      "announcementTextColor": "#1A1410",
      "utilityBarBackgroundColor": "#0F0D0A",
      "utilityBarTextColor": "#8A7A6D",
      "ctaBackgroundColor": "#D4A574",
      "ctaHoverColor": "#C49564",
      "mobileMenuBackgroundColor": "#1A1410",
      "mobileMenuTextColor": "#D4D4D8"
    },
    "data": {
      "logo": "Ember & Ash",
      "announcementText": "NEW: Ethiopian Yirgacheffe — Floral & Bright",
      "ctaText": "Shop Beans",
      "searchPlaceholder": "Explore flavors...",
      "utilityLinks": [
        {"label": "Brew Guide", "href": "#"},
        {"label": "Subscriptions", "href": "#"},
        {"label": "Find Us", "href": "#"}
      ]
    },
    "designTrends": ["Dark Glassmorphism", "Artisan Luxury", "Frosted Depth"]
  },
  {
    "variantName": "Roastery Grid",
    "layout": "creative",
    "componentType": "canvas",
    "style": {
      "backgroundColor": "#F5E6D3",
      "textColor": "#3A2519",
      "textHoverColor": "#000000",
      "accentColor": "#5C3D2E",
      "borderColor": "#5C3D2E",
      "borderWidth": "2px",
      "cartBadgeColor": "#5C3D2E",
      "cartBadgeTextColor": "#F5E6D3",
      "iconHoverBackgroundColor": "#5C3D2E20",
      "showSearch": true,
      "showAccount": true,
      "showCart": true,
      "showCTA": false,
      "showAnnouncementBar": true,
      "showUtilityBar": false,
      "enableGlassmorphism": false,
      "enableSpotlightBorders": true,
      "announcementMarquee": true,
      "navActiveStyle": "bracket",
      "paddingX": "40px",
      "paddingY": "28px",
      "iconSize": 26,
      "maxWidth": "full",
      "announcementBackgroundColor": "#5C3D2E",
      "announcementTextColor": "#F5E6D3",
      "mobileMenuBackgroundColor": "#F5E6D3",
      "mobileMenuTextColor": "#3A2519"
    },
    "data": {
      "logo": "Ember & Ash",
      "announcementText": "HAND-ROASTED DAILY • SINGLE ORIGIN • FREE SHIPPING OVER $40 • LOCAL DELIVERY"
    },
    "designTrends": ["Neo-Brutalism", "Craftcore", "Spotlight Borders", "Marquee Revival"]
  }
]

---

## ABSOLUTE ENFORCEMENT RULES

1. **DIVERSITY MANDATE:** NEVER generate 3 white-background headers. At least one MUST be dark (#000000-#2A2A2A range).
2. **NAV VARIETY:** NEVER use the same navActiveStyle twice in one generation.
3. **BRAND VOICE:** NEVER use generic announcements like "Free shipping on orders over $100"—make them brand-specific and voice-forward.
4. **FEATURE TOGGLING:** Each header must enable a DIFFERENT set of features (bars, CTA, glassmorphism, spotlight borders, marquee).
5. **NAME CREATIVITY:** Variant names should be evocative and design-inspired, like real commercial theme names ("Midnight Bloom", "Grid Pioneer", "Frosted Ember").
6. **PERSONA COMMITMENT:** Each header MUST clearly embody ONE of the three personas. Do not blend them.
7. **COLOR DISCIPLINE:** Use only the provided brand palette colors. Derive all shades from primary/secondary/background.

Generate now. Return ONLY the JSON array. No code fences. No markdown.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Wrap EVERYTHING in top-level try-catch to prevent FUNCTION_INVOCATION_FAILED
  try {
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

  // Inner try-catch for API logic
  try {
    // --- Step 1: Validate environment ---
    // Check both VITE_ (for consistency) and regular (for Vercel serverless)
    const apiKey = process.env.VITE_GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'AI service not configured',
        message: 'VITE_GOOGLE_AI_API_KEY or GOOGLE_AI_API_KEY environment variable is not set',
        hint: 'In Vercel, set GOOGLE_AI_API_KEY (without VITE_ prefix) in your environment variables',
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
    let genAI: GoogleGenerativeAI;
    let model: any;
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.9, // High creativity for radical design diversity
        }
      });
    } catch (initErr: any) {
      return res.status(500).json({
        error: 'Failed to initialize AI client',
        message: initErr.message,
        step: 'ai-init'
      });
    }

    let aiText: string;
    try {
      const result = await model.generateContent(prompt);
      aiText = result.response.text().trim();
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

  } catch (topLevelError: any) {
    // Catch ANY error including initialization/import failures
    console.error('[AI Generate Headers] Top-level error:', topLevelError);
    
    // Ensure we ALWAYS return JSON, never let Vercel return opaque error
    try {
      return res.status(500).json({
        error: 'Server initialization failed',
        message: topLevelError?.message || 'Unknown initialization error',
        hint: 'Check Vercel logs for details. Ensure GOOGLE_AI_API_KEY is set.',
        step: 'init-error'
      });
    } catch (jsonError) {
      // Last resort: plain text if JSON also fails
      res.status(500).send(`Error: ${topLevelError?.message || 'Server error'}`);
    }
  }
}
