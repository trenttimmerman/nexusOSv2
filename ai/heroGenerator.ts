/**
 * AI Hero Generator Service
 * Uses Gemini to generate custom hero components based on user requirements
 */

import { GoogleGenAI } from '@google/genai';
import { HeroData } from '../components/HeroLibrary';
import { DesignRequirements } from '../components/HeroDesignerModal';

interface GeneratedHero {
  id: string;
  name: string;
  description: string;
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
${requirements.features.includes('video') ? '- Use dynamic, cinematic background imagery that suggests motion/video quality\n' : ''}${requirements.features.includes('animation') ? '- Choose imagery with visual rhythm and energy that implies movement\n' : ''}${requirements.features.includes('particles') ? '- Select backgrounds with particle-like elements (bokeh, dust, sparks, stars)\n' : ''}${requirements.features.includes('3d') ? '- Pick images with depth, 3D objects, or architectural elements\n' : ''}${requirements.features.includes('parallax') ? '- Choose layered, depth-rich imagery (foreground/background separation)\n' : ''}${requirements.features.includes('carousel') ? '- Ensure strong focal points that work well in carousel transitions\n' : ''}` 
    : '';

  return `You are an award-winning 2026 web designer creating CUTTING-EDGE, visually stunning hero sections. These designs must be SO DIFFERENT from each other that customers would pay $99 to own one exclusively.

**Client Requirements:**
- Industry: ${requirements.industry}
- Design Style: ${requirements.style}
- Selected Features: ${requirements.features.length > 0 ? requirements.features.join(', ') : 'Standard hero'}
- Color Mood: ${requirements.colorMood}
- Context: ${requirements.additionalContext || 'Premium quality expected'}
${featureGuidance}

**CRITICAL: Each design must be RADICALLY DIFFERENT:**

**Design 1: DARK & BOLD** 
- Pure black or very dark background (#000000, #0A0A0A, #111111)
- Electric, vibrant neon button colors (#00FF00, #FF00FF, #00FFFF, #FF0066)
- WHITE text (#FFFFFF) for maximum contrast
- Dark/moody background image with HIGH overlay (0.6-0.8 opacity)
- Aggressive, punchy copy

**Design 2: LIGHT & AIRY**
- Light/white overlay (#FFFFFF, #F8F9FA, #E8E8E8)  
- LOW overlay opacity (0.2-0.35) to show beautiful imagery
- Dark text (#000000, #1A1A1A, #2D2D2D) on light overlay
- Vibrant, saturated button colors (#FF3366, #7C3AED, #0EA5E9, #10B981)
- Bright, uplifting background images (nature, sky, lifestyle)
- Elegant, benefit-focused copy

**Design 3: GRADIENT FUTURISTIC**
- Gradient overlay colors (e.g., overlayColor: "#8B5CF6" for purple gradient effect)
- Medium overlay (0.45-0.6)
- Bold accent button with gradient-feel colors (#F59E0B, #EF4444, #8B5CF6, #EC4899)
- Ultra-modern sci-fi or abstract backgrounds
- Forward-thinking, innovative copy

**Copy Guidelines:**
- Headings: 2-6 words, POWERFUL and specific to ${requirements.industry}
- Subheadings: 10-18 words, clear value proposition${requirements.features.includes('video') || requirements.features.includes('animation') ? ' with dynamic, action-oriented language' : ''}${requirements.features.includes('particles') || requirements.features.includes('3d') ? ' emphasizing visual impact and innovation' : ''}
- Buttons: 1-3 words, action-driven

**Image Selection (CRITICAL - Pick visually DISTINCT images based on features):**
${requirements.features.includes('particles') ? '- Prioritize images with bokeh, light particles, sparks, stars, or atmospheric effects\n' : ''}${requirements.features.includes('video') ? '- Choose dynamic, cinematic scenes with motion blur or action (sports, cities, nature in motion)\n' : ''}${requirements.features.includes('3d') ? '- Select images with 3D objects, architecture, geometric shapes, or strong perspective\n' : ''}${requirements.features.includes('parallax') ? '- Find images with clear depth layers (mountains with sky, buildings with clouds)\n' : ''}${requirements.features.includes('animation') ? '- Pick images with visual rhythm, patterns, or elements that suggest movement\n' : ''}${requirements.features.includes('carousel') ? '- Ensure strong visual hierarchy and clear focal points\n' : ''}- Design 1: Dark/moody/urban scenes (night cities, industrial, dramatic${requirements.features.includes('particles') ? ', with bokeh or light trails' : ''})
- Design 2: Bright/vibrant/lifestyle (sunlight, nature, people, energy${requirements.features.includes('video') ? ', action shots' : ''})
- Design 3: Abstract/futuristic/unique perspectives (architecture, tech, art${requirements.features.includes('3d') ? ', 3D renders or geometric shapes' : ''})

**Color Psychology:**
- ${requirements.colorMood === 'Energetic & Bold' ? 'Use neon greens, hot pinks, electric blues' : ''}
- ${requirements.colorMood === 'Professional & Trustworthy' ? 'Use deep blues, rich purples, modern forest greens' : ''}
- ${requirements.colorMood === 'Calm & Minimal' ? 'Use soft pastels, warm earth tones, muted blues' : ''}
- ${requirements.colorMood === 'Luxurious & Premium' ? 'Use gold accents, deep purples, rich blacks' : ''}

**Effect-Specific Guidelines:**
${requirements.features.includes('particles') ? `- PARTICLES: Set "enableParticles": true and choose particle colors (#FFFFFF for white, #00FFFF for cyan, #FF00FF for magenta, #00FF00 for green). Make each design use DIFFERENT particle colors.\n` : ''}${requirements.features.includes('animation') ? `- ANIMATIONS: Choose from: "fade-in" (classic), "slide-up" (modern), "zoom-in" (bold), "glitch" (edgy), "float" (smooth). Make each design use DIFFERENT animations.\n` : ''}${requirements.features.includes('parallax') ? `- PARALLAX: Set "enableParallax": true with speed 0.3-0.7 (lower = slower, higher = faster). Vary speeds across designs.\n` : ''}${requirements.features.includes('3d') || requirements.features.includes('video') ? `- GRADIENT OVERLAYS: Set "gradientOverlay": true with Tailwind gradient classes like "from-purple-900/70 to-pink-900/70", "from-blue-900/60 to-cyan-900/60", or "from-amber-900/70 to-red-900/70". Each design should use DIFFERENT gradient combinations.\n` : ''}
**RETURN ONLY THIS JSON (no markdown, no explanation):**
[
  {
    "name": "Unique Design Name",
    "description": "Specific visual description of visual effects and style",
    "data": {
      "heading": "Industry-Specific Heading",
      "subheading": "Clear value proposition for ${requirements.industry}",
      "buttonText": "Action Word",
      "buttonLink": "#",
      "backgroundImage": "https://images.unsplash.com/photo-[unique-id]",
      "textColor": "#FFFFFF or #000000",
      "buttonBackgroundColor": "#VIBRANT_HEX",
      "buttonTextColor": "#FFFFFF or #000000", 
      "buttonHoverColor": "#DARKER_VERSION",
      "overlayColor": "#HEX_COLOR",
      "overlayOpacity": 0.2-0.8,
      "showSubheading": true,
      "showButton": true,${requirements.features.includes('particles') ? `
      "enableParticles": true,
      "particleColor": "#FFFFFF or neon color",` : ''}${requirements.features.includes('animation') ? `
      "enableAnimation": true,
      "animationType": "fade-in" | "slide-up" | "zoom-in" | "glitch" | "float",` : ''}${requirements.features.includes('parallax') ? `
      "enableParallax": true,
      "parallaxSpeed": 0.3-0.7,` : ''}${requirements.features.includes('3d') || requirements.features.includes('video') ? `
      "gradientOverlay": true,
      "gradientColors": "from-purple-900/70 to-pink-900/70" or similar,` : ''}
    }
  }
]

**IMPORTANT:** Each design MUST have different ${requirements.features.length > 0 ? 'animation types and particle colors' : 'visual approaches'} to justify $99 exclusive pricing.`;
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
    const heroes: GeneratedHero[] = designs.slice(0, 3).map((design, index) => ({
      id: `hero-${Date.now()}-${index}`,
      name: design.name || `Design ${index + 1}`,
      description: design.description || 'A unique hero design',
      data: {
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
      },
      exclusivePrice: 99, // Standard exclusive pricing
    }));
    
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
