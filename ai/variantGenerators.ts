/**
 * AI Variant Generators
 * Generates 3 unique variants for each wizard step (vibes, colors, components)
 */

import { GoogleGenAI } from '@google/genai';

const getGenAI = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GOOGLE_AI_API_KEY not configured');
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generate visual fingerprint hash from component data (browser-compatible)
 * Used for unique variant naming
 */
export async function generateVariantHash(data: any): Promise<string> {
  const visualProps = JSON.stringify({
    colors: data.colors || data.style?.backgroundColor || '',
    layout: data.layout || data.columns || '',
    spacing: data.padding || data.style?.padding || '',
    typography: data.font || data.style?.fontFamily || ''
  });
  
  // Use Web Crypto API (browser-compatible)
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(visualProps);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex.substring(0, 6);
}

/**
 * Extract clean JSON from AI response
 */
function extractJSON(text: string): string {
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  if (firstBrace === -1 && firstBracket === -1) {
    throw new Error('No JSON found in AI response');
  }
  
  const isObject = firstBracket === -1 || (firstBrace !== -1 && firstBrace < firstBracket);
  const startChar = isObject ? '{' : '[';
  const endChar = isObject ? '}' : ']';
  const startIndex = isObject ? firstBrace : firstBracket;
  
  let depth = 0;
  let endIndex = -1;
  
  for (let i = startIndex; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === startChar) depth++;
    else if (char === endChar) {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  if (endIndex === -1) throw new Error('No matching closing bracket');
  return cleaned.substring(startIndex, endIndex + 1);
}

/**
 * Generate 3 unique store vibe options
 */
export async function generateVibeVariants(userPrompt: string): Promise<any[]> {
  const genAI = getGenAI();
  
  const prompt = `You are a world-class brand strategist. Generate 3 distinct store vibe/aesthetic options for this business:

"${userPrompt}"

Each vibe should have:
- A unique name (2-3 words, memorable)
- Visual direction (colors, mood, typography style)
- Target audience appeal
- Distinct personality

Return ONLY valid JSON array (no markdown, no explanation):
[
  {
    "id": "tech-forward",
    "name": "Tech Forward",
    "description": "Sharp angles, chrome accents, digital energy",
    "mood": ["modern", "innovative", "precise"],
    "colorDirection": "Blues, silvers, high contrast",
    "typography": "Sans-serif, geometric, technical",
    "targetAudience": "Tech-savvy professionals"
  }
]

Make each vibe DISTINCTLY different. One bold, one refined, one unexpected.`;

  const model = genAI.models;
  const result = await model.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  const text = result.text.trim();
  
  const json = extractJSON(text);
  return JSON.parse(json);
}

/**
 * Generate 3 unique color palette options
 */
export async function generateColorPaletteVariants(
  userPrompt: string,
  selectedVibe: any
): Promise<any[]> {
  const genAI = getGenAI();
  
  const prompt = `You are a color theory expert. Generate 3 distinct color palettes for:

Business: "${userPrompt}"
Vibe: ${selectedVibe.name} - ${selectedVibe.description}

Each palette must have:
- primary (main brand color, hex)
- secondary (accent color, hex)
- background (page background, hex)
- All colors must be accessible (WCAG AA compliant)
- Each palette should be DISTINCTLY different while fitting the vibe

Return ONLY valid JSON array (no markdown):
[
  {
    "id": "electric-blue",
    "name": "Electric Blue",
    "primary": "#0066FF",
    "secondary": "#FF6B00",
    "background": "#F5F5F5",
    "mood": "energetic"
  }
]

One palette should be bold, one refined, one unexpected.`;

  const model = genAI.models;
  const result = await model.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  const text = result.text.trim();
  
  const json = extractJSON(text);
  return JSON.parse(json);
}

/**
 * Generate 3 unique component variants (header, hero, footer, product cards)
 */
export async function generateComponentVariants(
  componentType: 'header' | 'hero' | 'footer' | 'product-card',
  userPrompt: string,
  selectedVibe: any,
  selectedPalette: any
): Promise<any[]> {
  const genAI = getGenAI();
  
  const componentSpecs: Record<string, string> = {
    'header': `Navigation header with logo, menu, cart icon. Focus on layout structure, spacing, interaction patterns.`,
    'hero': `Main hero section with headline, subheading, CTA button. Focus on visual impact, content hierarchy.`,
    'footer': `Footer with links, social icons, copyright. Focus on information architecture, visual balance.`,
    'product-card': `Product display card with image, name, price. Focus on commerce optimization, visual appeal.`
  };
  
  let prompt = '';
  
  if (componentType === 'header') {
    // Enhanced header-specific prompt for maximum visual distinction
    prompt = `You are a UI/UX design expert. Generate 3 EXTREMELY DIFFERENT header navigation variants for:

Business: "${userPrompt}"
Vibe: ${selectedVibe.name} - ${selectedVibe.description}
Colors: Primary ${selectedPalette.primary}, Secondary ${selectedPalette.secondary}, Background ${selectedPalette.background}

Create 3 variants with MAXIMUM visual contrast:

VARIANT 1 - MINIMAL/MODERN:
- Clean, minimal approach with maximum negative space
- Subtle logo, understated navigation
- Modern sans-serif feel
- Layout: "minimal" (traditional horizontal layout)

VARIANT 2 - PROFESSIONAL/RICH:
- Feature-rich with utility bar, search, account features
- Professional, all business features visible
- Premium feel with glassmorphism or spotlight effects
- Layout: "professional" (full-featured modern)

VARIANT 3 - BOLD/UNIQUE:
- Creative, unconventional layout (centered, floating, asymmetric)
- Strong visual personality matching vibe
- Eye-catching, memorable design
- Layout: "creative" (innovative layout approach)

Return ONLY valid JSON array (no markdown):
[
  {
    "variantName": "The[BusinessName]_[Style]",
    "layout": "minimal|professional|creative",
    "componentType": "canvas|nexus-elite|quantum|orbit|neon",
    "style": {
      "backgroundColor": "${selectedPalette.background}",
      "primaryColor": "${selectedPalette.primary}",
      "secondaryColor": "${selectedPalette.secondary}",
      "accentColor": "${selectedPalette.secondary}",
      "borderRadius": "0|4|8|16",
      "showAnnouncementBar": true|false,
      "showUtilityBar": true|false,
      "enableGlassmorphism": true|false,
      "enableSpotlightBorders": true|false
    },
    "data": {
      "logo": "${userPrompt.split(' ')[0] || 'Store'}",
      "announcementText": "relevant announcement",
      "utilityLinks": [...]
    }
  }
]

Make each variant look COMPLETELY DIFFERENT when rendered.`;
  } else {
    // Original prompt for other component types
    prompt = `You are a UI/UX design expert. Generate 3 DISTINCT ${componentType} variants for:

Business: "${userPrompt}"
Vibe: ${selectedVibe.name}
Colors: Primary ${selectedPalette.primary}, Secondary ${selectedPalette.secondary}

Component: ${componentSpecs[componentType]}

Each variant should have:
- Unique layout approach
- Different spacing/density
- Distinct visual personality
- Production-ready data structure

Return ONLY valid JSON array (no markdown):
[
  {
    "variantName": "descriptive-name",
    "layout": "compact|spacious|asymmetric",
    "style": {
      "backgroundColor": "${selectedPalette.background}",
      "primaryColor": "${selectedPalette.primary}",
      "secondaryColor": "${selectedPalette.secondary}",
      "padding": "sm|md|lg|xl",
      "borderRadius": "0|4|8|16",
      "fontWeight": "400|500|600|700"
    },
    "data": {
      // Component-specific data (heading, buttons, links, etc.)
    }
  }
]

Make each variant VISUALLY and STRUCTURALLY different.`;
  }

  const model = genAI.models;
  const result = await model.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  const text = result.text.trim();
  
  const json = extractJSON(text);
  const variants = JSON.parse(json);
  
  // Add unique hash-based variant IDs
  const variantsWithIds = await Promise.all(
    variants.map(async (variant: any) => ({
      ...variant,
      variantId: `${variant.variantName}-${await generateVariantHash(variant)}`
    }))
  );
  
  return variantsWithIds;
}
