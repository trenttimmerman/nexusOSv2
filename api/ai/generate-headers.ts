/**
 * AI Header Generation API - Vercel Serverless Function
 * Generates 3 unique header designs using Gemini AI
 * Endpoint: POST /api/ai/generate-headers
 * 
 * Designer V3 - Phase 2: API Infrastructure
 * 
 * IMPORTANT: This file is fully self-contained for Vercel serverless.
 * Do NOT import from ../../ai/ (causes bundling/runtime crashes).
 * 
 * Version: 2.1.0 - Emergency fix for FUNCTION_INVOCATION_FAILED
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Diagnostic: Log module initialization to help debug FUNCTION_INVOCATION_FAILED
console.log('[Module Init] AI Header Generation module loading...');

// Inlined few-shot examples for Vercel serverless reliability
// DO NOT use fs/promises - file system access is restricted in serverless
// CRITICAL FIX: Using string concatenation instead of template literals to avoid Node.js ESM parser issues
const FEW_SHOT_EXAMPLES = 
  "\n" +
  "---\n" +
  "\n" +
  "### 📚 REFERENCE STANDARDS FOR HIGH-QUALITY HEADERS\n" +
  "\n" +
  "**REQUIRED DESIGN ELEMENTS:**\n" +
  "- Scroll-responsive behavior with data-scrolled attribute toggling\n" +
  "- Glassmorphism effects using backdrop-blur-xl and alpha backgrounds\n" +
  "- Gradient usage for backgrounds, text, and borders\n" +
  "- Hover states with scale transforms, color gradients, and shadow glows\n" +
  "- Active micro-interactions like active:scale-95 for tactile feedback\n" +
  "- Smooth transitions using transition-all duration-300 or similar\n" +
  "\n" +
  "- Smooth transitions using transition-all duration-300 or similar\n" +
  "\n" +
  "**EXAMPLE HEADER CONCEPTS:**\n" +
  "\n" +
  "1. **Glassmorphic Scroll Header**: Starts transparent, becomes frosted glass (backdrop-blur-xl bg-white/70) on scroll. Logo uses gradient text. Nav links have gradient hover backgrounds with scale transforms.\n" +
  "\n" +
  "2. **Animated Marquee Header**: White background with shadow. Scroll triggers animated announcement bar at bottom with marquee text. Gradient hover effects on all links. Active states with subtle scale-down.\n" +
  "\n" +
  "3. **Dark Brutalist Header**: Black background with neon green/pink accents. Mono font. Drop-shadow glows on hover. Hard borders. Scanline overlay effect. High contrast with bold typography.\n" +
  "\n" +
  "**KEY TAKEAWAY:** Generated headers must feel interactive and polished with gradients, glassmorphism, smooth transitions, and scroll effects as the standard.\n" +
  "\n" +
  "---\n";

// Full training prompt inlined for Vercel serverless reliability.
// Vercel treats every .ts in api/ as a handler — external files crash.
const HEADER_AGENT_PROMPT = 
  "ROLE: You are the Lead Design Architect for EvolvCom, a 2026 award-winning design studio known for radical, trend-setting interfaces.\n" +
  "\n" +
  "TASK: Generate 3 DISTINCT, RADICALLY DIFFERENT website headers for HeaderCanvas2026 component.\n" +
  "\n" +
  "CRITICAL RULE: **DO NOT generate three versions of the same layout.**\n" +
  "- If Header 1 is \"Logo Left + Nav Right\", Header 2 MUST be \"Centered Vertical\" or \"Split Island\"\n" +
  "- If Header 1 is \"White Background\", Header 2 MUST be \"Dark\" or \"Glassmorphism\"\n" +
  "- If Header 1 uses \"underline\" navActiveStyle, Header 2 MUST use \"glow\", \"brutalist\", or \"capsule\"\n" +
  "\n" +
  "You are a CREATIVE DIRECTOR who refuses to repeat yourself. Every generation must feel completely different.\n" +
  "\n" +
  "---\n" +
  "\n" +
  "## DESIGN INSPIRATION LIBRARY (Mix and Match Freely)\n" +
  "\n" +
  "**AESTHETIC 1: Minimalist Zen**\n" +
  "Radical negative space, typography-forward, restrained palette, subtle micro-interactions\n" +
  "Examples: underline nav, dot indicators, delicate 1px borders, no announcement bars\n" +
  "\n" +
  "**AESTHETIC 2: Glassmorphism & Depth**\n" +
  "Frosted glass effects, floating islands, alpha backgrounds, blur layers, ethereal feel\n" +
  "Examples: backdrop-blur, transparent backgrounds with color overlays, glow effects\n" +
  "\n" +
  "**AESTHETIC 3: Bold Brutalism**\n" +
  "Thick borders, asymmetric layouts, marquee text, spotlight effects, unapologetic colors\n" +
  "Examples: 2px borders, neon accents, brutalist/bracket nav styles, chunky icons\n" +
  "\n" +
  "**AESTHETIC 4: Gradient Maximalism**\n" +
  "Vibrant gradient backgrounds, color-shifting text, animated borders, high-energy\n" +
  "Examples: bg-gradient-to-r, gradient text with bg-clip-text, capsule nav with gradients\n" +
  "\n" +
  "**AESTHETIC 5: Y2K Cyber**\n" +
  "Metallic sheens, drop shadows with glow, skewed elements, neon on dark, playful chaos\n" +
  "Examples: skewed nav, double underlines, highlight effects, neon color schemes\n" +
  "\n" +
  "**AESTHETIC 6: Organic Craft**\n" +
  "Warm earth tones, spotlight borders, natural textures implied, artisan branding\n" +
  "Examples: overline nav, earthy brand colors, spotlight borders, announcement bars with personality\n" +
  "\n" +
  "**RULES:**\n" +
  "- DO NOT assign aesthetics 1-2-3 in order\n" +
  "- MIX elements from different aesthetics\n" +
  "- RANDOMIZE which aesthetic influences which header position\n" +
  "- BLEND unexpected combinations (e.g., minimalism + gradient, brutalism + glassmorphism)\n" +
  "\n" +
  "---\n" +
  "\n" +
  "## TECHNICAL CONSTRAINTS (The \"Wiring\")\n" +
  "\n" +
  "### Configuration Fields You Can Use\n" +
  "\n" +
  "**Style Object Fields** (ALL go in \"style\"):\n" +
  "- **COLORS:** backgroundColor, textColor, textHoverColor, accentColor, borderColor, cartBadgeColor, cartBadgeTextColor, iconHoverBackgroundColor, announcementBackgroundColor, announcementTextColor, utilityBarBackgroundColor, utilityBarTextColor, mobileMenuBackgroundColor, mobileMenuTextColor, searchBackgroundColor, ctaBackgroundColor, ctaHoverColor\n" +
  "- **TOGGLES:** showSearch, showAccount, showCart, showCTA, showAnnouncementBar, showUtilityBar, enableSmartScroll, enableMegaMenu, enableSpotlightBorders, enableGlassmorphism, announcementDismissible, announcementMarquee, showCurrencySelector, showLanguageSelector, sticky\n" +
  "- **LAYOUT:** maxWidth (full/7xl/6xl/5xl), paddingX (16px-48px string), paddingY (12px-28px string), borderWidth (0px/1px/2px string), iconSize (16-28 number)\n" +
  "- **NAV:** navActiveStyle (none/dot/underline/capsule/glow/brutalist/minimal/overline/double/bracket/highlight/skewed)\n" +
  "- **GLASS:** blurIntensity (sm/md/lg/xl), glassBackgroundOpacity (0-100 number)\n" +
  "- **MOBILE:** mobileMenuPosition (left/right), mobileMenuWidth (280px-400px string), mobileMenuOverlayOpacity (30-80 number)\n" +
  "- **ANTI-BORING (REQUIRED):** scrollBehavior (\"static\"|\"sticky\"|\"hide-on-scroll\"|\"glass-on-scroll\"), animationSpeed (\"slow\"|\"medium\"|\"fast\")\n" +
  "\n" +
  "**Data Object Fields** (text content goes in \"data\"):\n" +
  "- logo: The brand name (string)\n" +
  "- announcementText: Promotional banner text (string, be creative!)\n" +
  "- ctaText: CTA button label (string, e.g. \"Shop Now\", \"Explore Collection\")\n" +
  "- searchPlaceholder: Search input hint (string)\n" +
  "- utilityLinks: Array of {label: string, href: string} for utility bar\n" +
  "\n" +
  "### Color Rules (STRICT)\n" +
  "- **NEVER use generic blue (#3b82f6) as accent**\n" +
  "- All colors derived from provided brand palette (primary, secondary, background)\n" +
  "- For dark backgrounds: lighten primary for text, use full saturation for accents\n" +
  "- For light backgrounds: darken primary for text\n" +
  "- Announcement bars MUST use CONTRASTING color (not same as header background)\n" +
  "- **EVERY color MUST be valid 6-digit hex (#RRGGBB). NO shorthand, NO rgba, NO named colors**\n" +
  "- Alpha hex format allowed for borderColor only (e.g. #ffffff20)\n" +
  "\n" +
  "### Response Format (CRITICAL)\n" +
  "\n" +
  "Return ONLY a valid JSON array. **No markdown code fences. No explanation. No preamble.**\n" +
  "\n" +
  "Structure:\n" +
  "[\n" +
  "  {\n" +
  "    \"variantName\": \"Evocative Name (not 'Header 1'—use design-inspired names)\",\n" +
  "    \"layout\": \"minimal|professional|creative\",\n" +
  "    \"componentType\": \"canvas\",\n" +
  "    \"style\": { ...all style fields... },\n" +
  "    \"data\": { \n" +
  "      \"logo\": \"BRAND_NAME\",\n" +
  "      \"announcementText\": \"...\",\n" +
  "      \"ctaText\": \"...\",\n" +
  "      \"searchPlaceholder\": \"...\",\n" +
  "      \"utilityLinks\": [{\"label\": \"...\", \"href\": \"#\"}]\n" +
  "    },\n" +
  "    \"designTrends\": [\"Specific Trend 1\", \"Specific Trend 2\"]\n" +
  "  },\n" +
  "  // ... 2 more radically different headers\n" +
  "]\n" +
  "\n" +
  "**NOTE:** The example above is just a STRUCTURAL guide. Your variant names and designs MUST be completely different every time.\n" +
  "\n" +
  "---\n" +
  "\n" +
  "## CRITICAL VISUAL REQUIREMENTS — \"Anti-Boring\" Protocol\n" +
  "\n" +
  "**MANDATORY INTERACTIVITY & MOTION:**\n" +
  "\n" +
  "### 1. NO FLAT COLORS (High-Voltage Design)\n" +
  "❌ **NEVER** use plain `bg-white` or `bg-black`\n" +
  "✅ **ALWAYS** use one of:\n" +
  "- `bg-gradient-to-r from-[color1] to-[color2]` (gradients everywhere)\n" +
  "- `bg-white/10` or `bg-black/30` (glassmorphism with alpha)\n" +
  "- `bg-zinc-900` with subtle `bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.02)_50%)]` (texture)\n" +
  "- Animated gradients: `bg-[length:400%_100%] animate-gradient` concept\n" +
  "\n" +
  "### 2. MANDATORY HOVER EFFECTS\n" +
  "Every interactive element (nav links, buttons, icons) **MUST** have \\`hover:\\` states:\n" +
  "\n" +
  "**✅ GOOD Examples:**\n" +
  "\\`\\`\\`\n" +
  "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-600\n" +
  "transition-all duration-300 hover:scale-105\n" +
  "group-hover:translate-x-1\n" +
  "hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]\n" +
  "\\`\\`\\`\n" +
  "\n" +
  "**❌ BAD Examples:**\n" +
  "\\`\\`\\`\n" +
  "hover:text-blue-600  (too simple, no gradient/glow)\n" +
  "(no hover state at all)\n" +
  "\\`\\`\\`\n" +
  "\n" +
  "###3. SCROLL BEHAVIOR INTEGRATION\n" +
  "Design headers to support dynamic scroll states using \\`data-scrolled\\` attribute:\n" +
  "\n" +
  "```\n" +
  "data-[scrolled=true]:backdrop-blur-xl\n" +
  "data-[scrolled=true]:bg-white/80\n" +
  "data-[scrolled=true]:shadow-lg\n" +
  "data-[scrolled=true]:py-2 (shrink effect)\n" +
  "```\n" +
  "\n" +
  "Ensure `scrollBehavior` prop is set to one of:\n" +
  "- `\"sticky\"` - Always visible at top\n" +
  "- `\"glass-on-scroll\"` - Becomes glassmorphic when scrolling\n" +
  "- `\"hide-on-scroll\"` - Hides when scrolling down\n" +
  "- `\"static\"` - No scroll behavior\n" +
  "\n" +
  "### 4. MICRO-INTERACTIONS (Tactile Feedback)\n" +
  "Buttons and clickable elements need:\n" +
  "```\n" +
  "active:scale-95\n" +
  "active:shadow-inner\n" +
  "transition-transform duration-150\n" +
  "```\n" +
  "\n" +
  "### 5. ANIMATION SPEED CONTROL\n" +
  "Set `animationSpeed` prop to:\n" +
  "- `\"slow\"` - 500-800ms transitions (luxury feel)\n" +
  "- `\"medium\"` - 200-400ms transitions (standard)\n" +
  "- `\"fast\"` - 100-200ms transitions (snappy, playful)\n" +
  "\n" +
  "Match animation speed to brand personality.\n" +
  "\n" +
  "---\n" +
  "\n" +
  "## REFERENCE STANDARDS (Match This Quality Level)\n" +
  "\n" +
  "### Example 1: Animated Gradient Border Header\n" +
  "```tsx\n" +
  "<header className=\"relative bg-gray-900 text-white sticky top-0 z-50\">\n" +
  "  <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n" +
  "    <div className=\"flex justify-between items-center h-16\">\n" +
  "      <a href=\"#\" className=\"font-bold text-xl tracking-widest uppercase \n" +
  "        hover:text-transparent hover:bg-clip-text \n" +
  "        hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-600\n" +
  "        transition-all duration-300\">BRAND</a>\n" +
  "      <nav className=\"hidden md:flex space-x-8\">\n" +
  "        <a href=\"#\" className=\"text-gray-300 hover:text-white \n" +
  "          transition-colors duration-200\n" +
  "          hover:shadow-[0_2px_8px_rgba(255,255,255,0.2)]\">Products</a>\n" +
  "      </nav>\n" +
  "    </div>\n" +
  "  </div>\n" +
  "  {/* Animated gradient border */}\n" +
  "  <div className=\"absolute bottom-0 left-0 w-full h-0.5 \n" +
  "    bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 \n" +
  "    bg-[length:200%_100%] animate-[gradient_4s_linear_infinite]\" />\n" +
  "</header>\n" +
  "\\`\\`\\`\n" +
  "\n" +
  "### Example 2: Glassmorphic Scroll Header\n" +
  "\\`\\`\\`tsx\n" +
  "<header className=\"sticky top-0 z-50 \n" +
  "  data-[scrolled=true]:backdrop-blur-xl \n" +
  "  data-[scrolled=true]:bg-white/70 \n" +
  "  data-[scrolled=true]:shadow-lg\n" +
  "  transition-all duration-300\">\n" +
  "  <div className=\"max-w-7xl mx-auto px-6 lg:px-8\">\n" +
  "    <div className=\"flex justify-between items-center h-20 \n" +
  "      data-[scrolled=true]:h-16 transition-all duration-300\">\n" +
  "      <a href=\"#\" className=\"text-2xl font-bold \n" +
  "        bg-gradient-to-r from-indigo-600 to-purple-600 \n" +
  "        bg-clip-text text-transparent\n" +
  "        hover:scale-105 transition-transform duration-200\n" +
  "        active:scale-95\">LOGO</a>\n" +
  "      <nav className=\"hidden md:flex space-x-6\">\n" +
  "        <a href=\"#\" className=\"group relative px-3 py-2\n" +
  "          hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50\n" +
  "          rounded-lg transition-all duration-200\n" +
  "          active:scale-95\">\n" +
  "          <span className=\"relative z-10 text-gray-700 \n" +
  "            group-hover:text-indigo-600 transition-colors\">Products</span>\n" +
  "          <div className=\"absolute inset-0 rounded-lg \n" +
  "            bg-gradient-to-r from-indigo-500 to-purple-500 \n" +
  "            opacity-0 group-hover:opacity-10 \n" +
  "            transition-opacity duration-200\" />\n" +
  "        </a>\n" +
  "      </nav>\n" +
  "    </div>\n" +
  "  </div>\n" +
  "</header>\n" +
  "\\`\\`\\`\n" +
  "\n" +
  "### Example 3: Neon Glow Header (Brutalist Persona)\n" +
  "\\`\\`\\`tsx\n" +
  "<header className=\"relative bg-black border-b-2 border-neon-green\n" +
  "  sticky top-0 z-50\">\n" +
  "  <div className=\"max-w-full px-8 lg:px-12\">\n" +
  "    <div className=\"flex justify-between items-center h-24\">\n" +
  "      <a href=\"#\" className=\"font-mono text-2xl font-black uppercase tracking-wider\n" +
  "        text-white\n" +
  "        hover:text-neon-green hover:drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]\n" +
  "        transition-all duration-200\n" +
  "        active:scale-95\">CYBER</a>\n" +
  "      <nav className=\"hidden md:flex space-x-8\">\n" +
  "        <a href=\"#\" className=\"font-mono uppercase text-sm\n" +
  "          text-gray-400 hover:text-neon-pink\n" +
  "          hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.4)]\n" +
  "          transition-all duration-200\n" +
  "          border-2 border-transparent hover:border-neon-pink\n" +
  "          px-4 py-2\n" +
  "          active:shadow-[4px_4px_0px_0px_rgba(255,0,255,1)]\">ENTER</a>\n" +
  "      </nav>\n" +
  "    </div>\n" +
  "  </div>\n" +
  "  {/* Scanline effect */}\n" +
  "  <div className=\"absolute inset-0 pointer-events-none\n" +
  "    bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.02)_50%)]\n" +
  "    bg-[length:100%_4px] animate-[scan_8s_linear_infinite]\" />\n" +
  "</header>\n" +
  "```\n" +
  "\n" +
  "**NOTICE:** These examples use:\n" +
  "- Gradients as primary backgrounds\n" +
  "- `hover:` states on EVERY interactive element\n" +
  "- Glassmorphism (`backdrop-blur`, alpha backgrounds)\n" +
  "- `active:scale-95` micro-interactions\n" +
  "- `data-[scrolled=true]:` attributes for scroll behavior\n" +
  "- `transition-all duration-X` for smooth animations\n" +
  "- Shadow/glow effects for depth\n" +
  "- NO plain white or black backgrounds\n" +
  "\n" +
  "**YOUR TASK:** Generate headers that match or exceed this visual complexity.\n" +
  "\n" +
  "---\n" +
  "\n" +
  "## ABSOLUTE ENFORCEMENT RULES\n" +
  "\n" +
  "1. **DIVERSITY MANDATE:** NEVER generate 3 white-background headers. At least one MUST be dark (#000000-#2A2A2A range).\n" +
  "2. **NAV VARIETY:** NEVER use the same navActiveStyle twice in one generation.\n" +
  "3. **BRAND VOICE:** NEVER use generic announcements like \"Free shipping on orders over $100\"—make them brand-specific and voice-forward.\n" +
  "4. **FEATURE TOGGLING:** Each header must enable a DIFFERENT set of features (bars, CTA, glassmorphism, spotlight borders, marquee).\n" +
  "5. **NAME CREATIVITY:** Variant names should be evocative and design-inspired, like real commercial theme names (\"Midnight Bloom\", \"Grid Pioneer\", \"Frosted Ember\").\n" +
  "6. **PERSONA COMMITMENT:** Each header MUST clearly embody ONE of the three personas. Do not blend them.\n" +
  "7. **COLOR DISCIPLINE:** Use only the provided brand palette colors. Derive all shades from primary/secondary/background.\n" +
  "8. **ANTI-BORING COMPLIANCE:** Every header MUST include: gradients OR glassmorphism, hover effects on ALL links/buttons, and proper scrollBehavior/animationSpeed props.\n" +
  "\n" +
  "---\n" +
  "\n" +
  "## \uD83D\uDEAB ANTI-REPETITION PROTOCOL (CRITICAL)\n" +
  "\n" +
  "**WARNING:** You are generating headers repeatedly. DO NOT fall into patterns.\n" +
  "\n" +
  "**🚫 ABSOLUTELY FORBIDDEN PATTERNS:**\n" +
  "- Header 1 lightweight + Header 2 glassmorphism + Header 3 dark/bold (CLICHÉ)\n" +
  "- Always putting glassmorphism in position 2 (PREDICTABLE)\n" +
  "- White → Dark Alpha → Black progression (BORING)\n" +
  "- Minimal → Glow → Bracket/Brutalist sequence (ROBOTIC)\n" +
  "\n" +
  "**⚡ MANDATORY CHAOS RULES:**\n" +
  "1. **SHUFFLE EVERYTHING:** Randomize which aesthetic influences which position. Don't go 1→2→3.\n" +
  "2. **USE BRAND COLORS IN BACKGROUNDS:** At least ONE header MUST use the brand's primary or secondary color as background (not just white/black). Example: if primary is blue, try bg: #3b82f6 or a blue gradient.\n" +
  "3. **NAVSTYLE ROULETTE:** Never use the same 3 navActiveStyles twice. Rotate through: none, dot, underline, capsule, glow, brutalist, minimal, overline, double, bracket, highlight, skewed.\n" +
  "4. **SURPRISE GLASSMORPHISM PLACEMENT:** Put glassmorphism in position 1 OR 3 sometimes, not always position 2.\n" +
  "5. **GRADIENT BACKGROUNDS:** Try bg-gradient-to-r using brand colors instead of solid colors.\n" +
  "6. **ANNOUNCEMENT BAR LOTTERY:** Don't always put announcement bars in the same position. Randomize.\n" +
  "7. **FEATURE CHAOS:** One header with minimal features, one heavily loaded, one moderate - but randomize which is which.\n" +
  "\n" +
  "**🎨 CREATIVE MANDATES:**\n" +
  "- Pretend you're 3 DIFFERENT designers with opposing tastes\n" +
  "- Channel design eras: Art Deco, Vaporwave, Swiss Minimalism, Memphis, Bauhaus, Y2K\n" +
  "- BREAK your own patterns - if you notice a tendency, do the opposite\n" +
  "- Mix \"incompatible\" elements: brutalism + pastels, minimalism + gradients, glassmorphism + thick borders\n" +
  "\n" +
  "Generate now. BREAK THE PATTERN. Return ONLY the JSON array. No code fences. No markdown.";

// Emergency diagnostic: Ensure module completed initialization
console.log('[Module Init] Constants loaded, handler ready to export');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[Handler] Function invoked successfully');
  
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

    // Generate random suggestions to force variety
    const navStyles = ['none', 'dot', 'underline', 'capsule', 'glow', 'brutalist', 'minimal', 'overline', 'double', 'bracket', 'highlight', 'skewed'];
    const shuffledNavStyles = navStyles.sort(() => Math.random() - 0.5);
    const suggestedStyles = shuffledNavStyles.slice(0, 3);
    
    const aesthetics = ['Minimalist Zen', 'Glassmorphism & Depth', 'Bold Brutalism', 'Gradient Maximalism', 'Y2K Cyber', 'Organic Craft'];
    const shuffledAesthetics = aesthetics.sort(() => Math.random() - 0.5);
    
    const backgroundSuggestions = [
      `gradient using ${palette.primary} and ${palette.secondary}`,
      `solid ${palette.primary} as bold background`,
      `glassmorphic with ${palette.primary} alpha overlay`,
      `dark with ${palette.secondary} accents`,
      `light with subtle gradient`,
      `${palette.secondary} as primary background color`
    ];
    const shuffledBgs = backgroundSuggestions.sort(() => Math.random() - 0.5);
    
    // MASSIVE creative name bank to force variety (100+ unique names)
    const creativeNames = [
      // Nature-inspired
      'Midnight Bloom', 'Desert Mirage', 'Ocean Depth', 'Forest Canopy', 'Mountain Peak',
      'Aurora Borealis', 'Coastal Breeze', 'Alpine Meadow', 'Crimson Sunset', 'Lunar Eclipse',
      'Storm Clouds', 'Prairie Wind', 'Coral Reef', 'Canyon Echo', 'Tidal Wash',
      // Urban/Modern
      'Metro Station', 'City Lights', 'Neon District', 'Concrete Jungle', 'Skyline View',
      'Street Art', 'Urban Grid', 'Downtown Pulse', 'Subway Lines', 'Rooftop Garden',
      'Brick & Mortar', 'Glass Tower', 'Warehouse Loft', 'Boulevard Beat', 'Plaza Central',
      // Artistic/Abstract
      'Chromatic Shift', 'Geometric Flow', 'Bold Strokes', 'Linear Motion', 'Radial Bloom',
      'Pixel Perfect', 'Vector Field', 'Gradient Mesh', 'Color Theory', 'Negative Space',
      'Golden Ratio', 'Fibonacci Spiral', 'Bauhaus Grid', 'Memphis Pop', 'Swiss Precision',
      // Temporal/Era
      'Retro Wave', 'Future Vision', 'Vintage Revival', 'Modern Classic', 'Neo Deco',
      'Millennial Pink', 'Gen Z Chaos', 'Y2K Flashback', 'Cyber Punk', 'Steampunk Edge',
      'Atomic Age', 'Space Race', 'Digital Dawn', 'Post Modern', 'Ultra Contemporary',
      // Mood/Emotion
      'Quiet Confidence', 'Bold Statement', 'Subtle Elegance', 'Playful Energy', 'Zen Focus',
      'Dynamic Power', 'Calm Waters', 'Electric Vibe', 'Warm Welcome', 'Cool Detachment',
      'Fierce Attitude', 'Gentle Touch', 'Sharp Edge', 'Soft Landing', 'Loud & Proud',
      // Material/Texture
      'Velvet Touch', 'Silk Screen', 'Brushed Metal', 'Frosted Glass', 'Polished Chrome',
      'Raw Concrete', 'Smooth Marble', 'Rough Grain', 'Matte Finish', 'Glossy Sheen',
      'Canvas Texture', 'Paper Grain', 'Digital Fabric', 'Woven Light', 'Liquid Crystal',
      // Industry-specific
      'Studio Session', 'Gallery Walk', 'Boutique Chic', 'Atelier Craft', 'Workshop Raw',
      'Lab Experiment', 'Kitchen Table', 'Garden Shed', 'Garage Band', 'Corner Cafe',
      'Market Square', 'Trading Floor', 'Creative Suite', 'Design Lab', 'Innovation Hub',
      // Sensory
      'Visual Symphony', 'Color Harmony', 'Contrast Theory', 'Light & Shadow', 'Depth Perception',
      'Motion Blur', 'Sharp Focus', 'Wide Angle', 'Macro Detail', 'Panoramic View'
    ];
    const shuffledNames = creativeNames.sort(() => Math.random() - 0.5);
    const suggestedNames = shuffledNames.slice(0, 6); // Give 6 name examples
    
    // Banned names that keep appearing
    const bannedNames = ['Aether Canopy', 'Grid Core', 'Radiant Stream', 'Smoky Glass', 'Roastery Grid', 'Quiet Morning'];
    
    const randomSeed = Date.now();
    
    // Build the full prompt with training + few-shot examples + context
    // Inject randomized examples to prevent AI from memorizing patterns
    const exampleBrands = [
      { name: 'Ember & Ash', desc: 'Coffee Roastery', primary: '#5C3D2E', secondary: '#D4A574', bg: '#F5E6D3' },
      { name: 'Lunar Tech', desc: 'Software Company', primary: '#1E293B', secondary: '#7C3AED', bg: '#F8FAFC' },
      { name: 'Bloom & Co', desc: 'Flower Shop', primary: '#DB2777', secondary: '#FDE047', bg: '#FFF7ED' },
      { name: 'Steel & Stone', desc: 'Architecture Firm', primary: '#18181B', secondary: '#71717A', bg: '#FAFAFA' },
      { name: 'Wave Rider', desc: 'Surf Shop', primary: '#0EA5E9', secondary: '#F59E0B', bg: '#F0F9FF' }
    ];
    const randomExample = exampleBrands[Math.floor(Math.random() * exampleBrands.length)];
    
    const prompt = `${HEADER_AGENT_PROMPT}${FEW_SHOT_EXAMPLES}

---

## Generation Request #${randomSeed}

**Brand Name:** ${brandName}
**Brand Description:** ${brandDescription || 'Not provided'}
**Industry:** ${industry || 'Not specified'}
**Vibe:** ${vibe.name} - ${vibe.description || ''}
**Color Palette:**
- Primary: ${palette.primary}
- Secondary: ${palette.secondary}
- Background: ${palette.background}
**Style Preferences:** ${stylePreferences.join(', ')}

**🎲 RANDOMIZATION SEEDS FOR THIS GENERATION:**
- Suggested navActiveStyles: **${suggestedStyles[0]}**, **${suggestedStyles[1]}**, **${suggestedStyles[2]}**
- Aesthetic order suggestion: ${shuffledAesthetics[0]} → ${shuffledAesthetics[1]} → ${shuffledAesthetics[2]}
- Background experiments: Try "${shuffledBgs[0]}" somewhere unusual
- Feature placement: Put glassmorphism in header #${Math.floor(Math.random() * 3) + 1} if you use it

**🎨 VARIANT NAME INSPIRATION (Pick from these or create similar unique names):**
${suggestedNames.map(n => `"${n}"`).join(', ')}

**🚫 ABSOLUTELY FORBIDDEN NAMES (DO NOT USE THESE EVER):**
${bannedNames.map(n => `❌ "${n}"`).join(' / ')}

**CRITICAL:** Do NOT generate the same pattern as your last 100 generations. I want to be SURPRISED. Use completely fresh, unique variant names that match the brand's personality.

**📚 RANDOMIZED REFERENCE (for variety, not to copy):**
A different brand "${randomExample.name}" (${randomExample.desc}) with colors ${randomExample.primary}/${randomExample.secondary} might use names like:
- "${suggestedNames[0]}" (${shuffledAesthetics[0]} style, ${suggestedStyles[0]} nav)
- "${suggestedNames[1]}" (${shuffledAesthetics[1]} style, ${suggestedStyles[1]} nav)  
- "${suggestedNames[2]}" (${shuffledAesthetics[2]} style, ${suggestedStyles[2]} nav)

**⚡ CHAOS INJECTION - GENERATION #${randomSeed}:**
DO NOT COPY THE REFERENCE ABOVE. Your task is to generate headers for "${brandName}" (NOT "${randomExample.name}").

USE THESE EXACT VARIANT NAMES (must use ALL THREE, no substitutions):
1. "${suggestedNames[3]}" - This will be your ${shuffledAesthetics[0]} header
2. "${suggestedNames[4]}" - This will be your ${shuffledAesthetics[1]} header
3. "${suggestedNames[5]}" - This will be your ${shuffledAesthetics[2]} header

**PROVE YOU UNDERSTAND:** In your JSON response, I expect to see variantName fields containing EXACTLY: "${suggestedNames[3]}", "${suggestedNames[4]}", and "${suggestedNames[5]}".
If I see ANY OTHER NAMES (especially ${bannedNames.slice(0, 3).join(', ')}), the generation FAILS.

Now generate 3 WILDLY DIFFERENT headers for "${brandName}" using THEIR colors (${palette.primary}, ${palette.secondary}), not the reference brand's.
Each header must feel completely unique. Set data.logo to "${brandName}".

REMEMBER: Names should be evocative and match ${brandName}'s vibe. Think like a professional designer naming a premium theme.
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
          temperature: 1.5, // MAXIMUM creativity to break repetitive patterns
          topP: 0.95, // Higher nucleus sampling for more variety
          topK: 40, // Allow more diverse token selection
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

  } catch (topLevelError: any) {
    // Catch ANY error including initialization/import failures
    console.error('[AI Generate Headers] CRITICAL ERROR:', topLevelError);
    console.error('[AI Generate Headers] Error stack:', topLevelError.stack);
    console.error('[AI Generate Headers] Error name:', topLevelError.name);
    console.error('[AI Generate Headers] Error message:', topLevelError.message);
    
    // Ensure we ALWAYS return JSON, never let Vercel return opaque error
    try {
      return res.status(500).json({
        error: 'Header generation failed',
        message: topLevelError?.message || 'Unknown error',
        errorName: topLevelError?.name || 'UnknownError',
        stack: topLevelError.stack?.split('\n').slice(0, 5),
        hint: 'Check Vercel logs for details. Ensure GOOGLE_AI_API_KEY is set.',
        step: 'error',
        timestamp: new Date().toISOString()
      });
    } catch (jsonError) {
      // Last resort: plain text if JSON also fails
      console.error('[AI Generate Headers] JSON response also failed:', jsonError);
      try {
        res.status(500).send(`CRITICAL ERROR: ${topLevelError?.message || 'Server error'}`);
      } catch (sendError) {
        // If even res.send fails, just end the response
        console.error('[AI Generate Headers] Even res.send failed:', sendError);
        res.end();
      }
    }
  }
}
