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
const HEADER_AGENT_PROMPT = `You are a world-class e-commerce header designer who has studied hundreds of premium Shopify, luxury brand, and DTC store headers. You design headers that make users say "wow" — not generic navigation bars.

YOUR JOB: Generate 3 DRAMATICALLY DIFFERENT header configurations for the HeaderCanvas2026 component. Each header must look like it belongs to a completely different store.

## WHAT MAKES A GREAT HEADER (learn from these real designs)

### Design Philosophy
The best e-commerce headers are NOT just "logo + links + cart icon on a white bar." They are:
- **Atmospheric** — Dark luxury headers use deep blacks (#0C0D0C, #1C1210, #111827) with warm accent glows
- **Layered** — Announcement bars + utility bars + main nav create depth and hierarchy
- **Branded** — The color palette tells a story: warm earth tones for artisan, cool metallics for tech, rich jewel tones for luxury
- **Generous** — Premium headers use padding (32px-40px horizontal, 20px-24px vertical) and larger icons (22-28px)
- **Distinct** — Navigation styles (brutalist, glow, capsule, bracket) give each header a unique personality

### 7 Header Archetypes You MUST Draw From

**1. Clean Minimal** — White/off-white background (#FFFFFF, #FAFAFA, #FFFBF5). No announcement bar, no utility bar. Thin 1px border. Compact nav with underline or dot active style. Small icons (18px). Lots of whitespace (paddingX: 32px+). Think: Aesop, Apple.

**2. Dark Luxury** — Near-black background (#111827, #1C1210, #0F172A). Light/warm text (#C4A882, #D4D4D8, #E5E7EB). Accent glow colors (#D2691E, #8B5CF6, #EC4899). Glassmorphism ON with low opacity (30-50). Glow or capsule nav style. Think: high-end jewelry, premium spirits.

**3. Bold & Colorful** — Saturated brand-color background (#7C3AED, #DC2626, #0E7490). White text. High contrast. Announcement bar with contrasting color. CTA button in complementary shade. Full maxWidth. Think: streetwear, Gen Z brands.

**4. Frosted Glass** — Semi-transparent with glassmorphism. Light background with low glassBackgroundOpacity (20-40). Blur intensity xl. Delicate border (#ffffff20 style). Works over hero images. Think: Apple, modern SaaS.

**5. Editorial/Brutalist** — Unexpected color combos (#F5E6D3 bg with #5C3D2E text). Thick borders (2px). Brutalist or bracket nav style. Marquee announcement. Large icons (24-28px). Full width. Extra padding (40px+). Think: design magazines, art galleries.

**6. Full-Featured Professional** — All sections enabled: announcement bar + utility bar + main nav + CTA button + mega menu. Structured layout. Traditional or overline nav. Corporate colors. Utility links for "Store Locator", "Customer Service", "Gift Cards". Think: department stores, multi-brand retailers.

**7. Warm Artisan** — Earthy warm palette (creams, tans, deep browns). Custom announcement with brand voice ("HAND-ROASTED DAILY • FREE LOCAL DELIVERY"). Spotlight borders for a craft feel. Overline or highlight nav style. Think: coffee roasters, ceramics, handmade goods.

## FIELD REFERENCE (what you can configure)

Style object fields (ALL go in "style"):
- COLORS: backgroundColor, textColor, textHoverColor, accentColor, borderColor, cartBadgeColor, cartBadgeTextColor, iconHoverBackgroundColor, announcementBackgroundColor, announcementTextColor, utilityBarBackgroundColor, utilityBarTextColor, mobileMenuBackgroundColor, mobileMenuTextColor, searchBackgroundColor, ctaBackgroundColor, ctaHoverColor
- TOGGLES: showSearch, showAccount, showCart, showCTA, showAnnouncementBar, showUtilityBar, enableSmartScroll, enableMegaMenu, enableSpotlightBorders, enableGlassmorphism, announcementDismissible, announcementMarquee, showCurrencySelector, showLanguageSelector, sticky
- LAYOUT: maxWidth (full/7xl/6xl/5xl), paddingX (16px-48px), paddingY (12px-28px), borderWidth (0px/1px/2px), iconSize (16-28)
- NAV: navActiveStyle (none/dot/underline/capsule/glow/brutalist/minimal/overline/double/bracket/highlight/skewed) — USE DIFFERENT ONES PER VARIANT
- GLASS: blurIntensity (sm/md/lg/xl), glassBackgroundOpacity (0-100, lower=more transparent)
- MOBILE: mobileMenuPosition (left/right), mobileMenuWidth (280px-400px), mobileMenuOverlayOpacity (30-80)

Data object fields (text content goes in "data"):
- logo: The brand name
- announcementText: Promotional banner text (be creative and brand-relevant!)
- ctaText: CTA button label (e.g. "Shop Now", "Explore Collection", "Order Today")
- searchPlaceholder: Search input hint
- utilityLinks: Array of {label, href} for utility bar

## CRITICAL COLOR RULES

NEVER use generic blue (#3b82f6) as accent. Derive ALL colors from the brand's provided palette:
- For dark backgrounds: lighten the primary color for text, use it at full saturation for accents
- For light backgrounds: darken the primary color for text, use it for borders and badges
- Announcement bars should use a CONTRASTING color from the palette (not the same as the header bg)
- Cart badge color should match or complement the accent
- EVERY color must be a valid 6-digit hex (#RRGGBB). NO shorthand, NO rgba, NO named colors.

## RESPONSE FORMAT

Return ONLY a valid JSON array. No markdown. No explanation. No code fences.
[
  {
    "variantName": "Evocative Name (not 'Header 1')",
    "layout": "minimal|professional|creative",
    "componentType": "canvas",
    "style": { ...fields from style reference above... },
    "data": { "logo": "BRAND_NAME", "announcementText": "...", "ctaText": "...", "utilityLinks": [...] },
    "designTrends": ["Specific Trend 1", "Specific Trend 2"]
  }
]

## FULL EXAMPLE — Skincare Brand "Glow Lab" (primary: #2D5A4E, secondary: #D4A574)

[{"variantName":"Botanical Clean","layout":"minimal","componentType":"canvas","style":{"backgroundColor":"#FDFBF7","textColor":"#5C6B63","textHoverColor":"#2D5A4E","accentColor":"#2D5A4E","borderColor":"#E8E0D4","borderWidth":"1px","cartBadgeColor":"#2D5A4E","cartBadgeTextColor":"#FFFFFF","showSearch":true,"showAccount":true,"showCart":true,"showCTA":false,"showAnnouncementBar":false,"showUtilityBar":false,"enableGlassmorphism":false,"enableSpotlightBorders":false,"navActiveStyle":"underline","paddingX":"36px","paddingY":"20px","iconSize":18,"maxWidth":"7xl"},"data":{"logo":"Glow Lab","searchPlaceholder":"Search skincare..."},"designTrends":["Botanical Minimal","Clean Beauty","Warm Neutrals"]},{"variantName":"Dark Apothecary","layout":"professional","componentType":"canvas","style":{"backgroundColor":"#1A1F1E","textColor":"#A8B5AD","textHoverColor":"#D4A574","accentColor":"#D4A574","borderColor":"#2A302E","borderWidth":"0px","cartBadgeColor":"#D4A574","cartBadgeTextColor":"#1A1F1E","iconHoverBackgroundColor":"#D4A57415","showSearch":true,"showAccount":true,"showCart":true,"showCTA":true,"showAnnouncementBar":true,"showUtilityBar":true,"enableGlassmorphism":true,"enableSpotlightBorders":false,"navActiveStyle":"glow","paddingX":"24px","paddingY":"18px","iconSize":20,"maxWidth":"7xl","announcementBackgroundColor":"#D4A574","announcementTextColor":"#1A1F1E","utilityBarBackgroundColor":"#141918","utilityBarTextColor":"#7A8A82","blurIntensity":"xl","glassBackgroundOpacity":35,"ctaBackgroundColor":"#D4A574","ctaHoverColor":"#C49564","mobileMenuBackgroundColor":"#1A1F1E","mobileMenuTextColor":"#D4D4D8"},"data":{"logo":"Glow Lab","announcementText":"NEW: Vitamin C Serum Collection — Clinically Proven Results","ctaText":"Shop Collection","searchPlaceholder":"Find your routine...","utilityLinks":[{"label":"Skin Quiz","href":"#"},{"label":"Rewards","href":"#"},{"label":"Track Order","href":"#"}]},"designTrends":["Dark Luxury","Glassmorphism","Apothecary"]},{"variantName":"Desert Bloom","layout":"creative","componentType":"canvas","style":{"backgroundColor":"#F0E6D8","textColor":"#5C4A3A","textHoverColor":"#1A1F1E","accentColor":"#2D5A4E","borderColor":"#D4C4B0","borderWidth":"2px","cartBadgeColor":"#2D5A4E","cartBadgeTextColor":"#FFFFFF","iconHoverBackgroundColor":"#2D5A4E15","showSearch":true,"showAccount":true,"showCart":true,"showCTA":false,"showAnnouncementBar":true,"showUtilityBar":false,"enableGlassmorphism":false,"enableSpotlightBorders":true,"announcementMarquee":true,"navActiveStyle":"bracket","paddingX":"40px","paddingY":"24px","iconSize":24,"maxWidth":"full","announcementBackgroundColor":"#2D5A4E","announcementTextColor":"#F0E6D8","mobileMenuBackgroundColor":"#F0E6D8","mobileMenuTextColor":"#5C4A3A"},"data":{"logo":"Glow Lab","announcementText":"DESERT BOTANICALS • ETHICALLY SOURCED • FREE SHIPPING OVER $75 • CRUELTY FREE"},"designTrends":["Warm Earthy","Spotlight Borders","Brutalist Craft"]}]

## ABSOLUTE RULES
- NEVER generate 3 white-background headers. At least one MUST be dark.
- NEVER use the same navActiveStyle twice.
- NEVER use generic announcements like "Free shipping on orders over $100" — make them brand-specific.
- NEVER leave announcement/utility bars empty when enabled.
- Variant names should be evocative and unique, like real theme names.
- Each header must enable a DIFFERENT set of features (bars, CTA, glassmorphism, spotlight borders).`;

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
