/**
 * AI Hero Generator Service
 * Uses Gemini to generate custom hero components based on user requirements
 */

import { GoogleGenAI } from '@google/genai';
import { HeroData } from '../components/AiHeroLibrary';
import { DesignRequirements } from '../components/HeroDesignerModal';

interface GeneratedHero {
  id: string;
  name: string;
  description: string;
  layout: NonNullable<HeroData['variant']>;
  data: HeroData;
  exclusivePrice?: number;
}

const getGenAI = () => {
  // Support both VITE_GEMINI_API_KEY and VITE_GOOGLE_AI_API_KEY
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY or VITE_GOOGLE_AI_API_KEY in your .env file.');
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Extract clean JSON from AI response
 */
function extractJSON(text: string): string {
  // Remove markdown code blocks
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Find the first array bracket
  const firstBracket = cleaned.indexOf('[');
  if (firstBracket === -1) {
    throw new Error('No JSON array found in AI response');
  }
  
  // Find the matching closing bracket
  let depth = 0;
  let endIndex = -1;
  
  for (let i = firstBracket; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '[') depth++;
    else if (char === ']') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  if (endIndex === -1) {
    throw new Error('No matching closing bracket found in AI response');
  }
  
  return cleaned.substring(firstBracket, endIndex + 1);
}

/**
 * Build the prompt for Gemini based on design requirements
 */
function buildHeroPrompt(requirements: DesignRequirements): string {
  const featureGuidance = requirements.features.length > 0
    ? `\n**Selected Features to Emphasize:**
${requirements.features.includes('video') ? '- Use cinematic imagery that suggests motion or video quality\n' : ''}${requirements.features.includes('animation') ? '- Favor imagery with rhythm/energy to match entrance animations\n' : ''}${requirements.features.includes('particles') ? '- Prefer scenes with bokeh, sparks, dust, stars\n' : ''}${requirements.features.includes('3d') ? '- Include depth, 3D objects, or architectural elements\n' : ''}${requirements.features.includes('parallax') ? '- Choose images with clear foreground/background depth layers\n' : ''}${requirements.features.includes('carousel') ? '- Strong focal points that work in a carousel\n' : ''}`
    : '';

  return `You are an award-winning 2026 web designer creating THREE wildly different hero sections. Each design must look exclusive and command a $99 value.

**Client Requirements:**
- Industry: ${requirements.industry}
- Style: ${requirements.style}
- Features: ${requirements.features.length > 0 ? requirements.features.join(', ') : 'Standard hero'}
- Color Mood: ${requirements.colorMood}
- Context: ${requirements.additionalContext || 'Premium quality expected'}
${featureGuidance}

**Layouts (must all differ):**
- Available layouts: "centered", "split-left", "diagonal", "minimal-corner", "bottom-aligned"
- Design 1: centered OR minimal-corner (dark, cyberpunk tone)
- Design 2: split-left OR bottom-aligned (bright lifestyle tone)
- Design 3: diagonal (futuristic gradient tone)

**Color + Effect Requirements:**
- Buttons: pick DIFFERENT hues across designs.
- Overlays: vary opacity and treatment (black/dark, white/light, gradient).
- Text: centered/minimal-corner/diagonal use white; split-left/bottom use dark where appropriate.
${requirements.features.includes('particles') ? '- Particles: enableParticles true; use distinct particle colors per design.\n' : ''}${requirements.features.includes('animation') ? '- Animations: choose different animationType per design (fade-in, slide-up, zoom-in, glitch, float).\n' : ''}${requirements.features.includes('parallax') ? '- Parallax: set enableParallax true with speed 0.3-0.7; vary speeds.\n' : ''}${requirements.features.includes('3d') || requirements.features.includes('video') ? '- Gradient overlays: allow gradientOverlay true with Tailwind gradients like "from-purple-900/70 to-pink-900/70"; each design should differ.\n' : ''}

**Return ONLY JSON array (no markdown):**
[
  {
    "name": "2-4 word design name",
    "description": "Technical card description (colors, effects, mood)",
    "layout": "centered" | "split-left" | "diagonal" | "minimal-corner" | "bottom-aligned",
    "data": {
      "variant": same as layout,
      "heading": "Customer-facing headline",
      "subheading": "Benefit statement for ${requirements.industry}",
      "buttonText": "Action CTA",
      "buttonLink": "#",
      "backgroundImage": "https://images.unsplash.com/photo-[unique]",
      "textColor": "#HEX",
      "buttonBackgroundColor": "#HEX",
      "buttonTextColor": "#HEX",
      "buttonHoverColor": "#HEX",
      "overlayColor": "#HEX",
      "overlayOpacity": 0.2-0.85,
      "showSubheading": true,
      "showButton": true,
      "enableParticles": ${requirements.features.includes('particles') ? 'true' : 'false'},
      "particleColor": "#HEX",
      "enableAnimation": ${requirements.features.includes('animation') ? 'true' : 'false'},
      "animationType": "fade-in" | "slide-up" | "zoom-in" | "glitch" | "float",
      "enableParallax": ${requirements.features.includes('parallax') ? 'true' : 'false'},
      "parallaxSpeed": 0.3-0.7,
      "gradientOverlay": ${requirements.features.includes('3d') || requirements.features.includes('video') ? 'true' : 'false'},
      "gradientColors": "from-purple-900/70 to-pink-900/70"
    }
  }
]

**Copy Rules:** keep subheadings customer-facing (no meta descriptions). All three designs must be visually distinct (layout, color, overlay, effects, button hue, animation).`;
}

/**
 * Generate 3 hero designs using Gemini AI
 */
export async function generateHeroDesigns(requirements: DesignRequirements): Promise<GeneratedHero[]> {
  try {
    const genAI = getGenAI();
    const prompt = buildHeroPrompt(requirements);
    
    // Generate with Gemini
    const model = genAI.models;
    const result = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Extract and parse the response
    const responseText = result.text || '';
    const jsonString = extractJSON(responseText);
    const designs = JSON.parse(jsonString);
    
    // Validate and transform into GeneratedHero format
    if (!Array.isArray(designs) || designs.length === 0) {
      throw new Error('AI did not return valid design array');
    }
    
    // Add IDs and exclusive pricing to each design
    const heroes: GeneratedHero[] = designs.slice(0, 3).map((design, index) => {
      const layout: NonNullable<HeroData['variant']> = design.layout || design.data?.variant || 'centered';

      return {
        id: `hero-${Date.now()}-${index}`,
        name: design.name || `Design ${index + 1}`,
        description: design.description || 'A unique hero design',
        layout,
        data: {
          variant: layout,
          heading: design.data?.heading || 'Welcome',
          subheading: design.data?.subheading || 'Discover something amazing',
          buttonText: design.data?.buttonText || 'Get Started',
          buttonLink: design.data?.buttonLink || '#',
          backgroundImage: design.data?.backgroundImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
          textColor: design.data?.textColor || '#FFFFFF',
          buttonBackgroundColor: design.data?.buttonBackgroundColor || '#000000',
          buttonTextColor: design.data?.buttonTextColor || '#FFFFFF',
          buttonHoverColor: design.data?.buttonHoverColor || '#333333',
          overlayColor: design.data?.overlayColor || '#000000',
          overlayOpacity: design.data?.overlayOpacity ?? 0.5,
          showSubheading: design.data?.showSubheading ?? true,
          showButton: design.data?.showButton ?? true,
          enableParticles: design.data?.enableParticles ?? false,
          particleColor: design.data?.particleColor || '#FFFFFF',
          enableAnimation: design.data?.enableAnimation ?? false,
          animationType: design.data?.animationType || 'fade-in',
          enableParallax: design.data?.enableParallax ?? false,
          parallaxSpeed: design.data?.parallaxSpeed ?? 0.4,
          gradientOverlay: design.data?.gradientOverlay ?? false,
          gradientColors: design.data?.gradientColors,
        },
        exclusivePrice: 99, // Standard exclusive pricing
      };
    });
    
    return heroes;
    
  } catch (error) {
    console.error('Hero generation failed:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to generate heroes: ${error.message}`
        : 'Failed to generate heroes with AI'
    );
  }
}
