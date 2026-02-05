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
  layout: 'fullimage' | 'split' | 'diagonal';
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

**CRITICAL: Each design must use a COMPLETELY DIFFERENT LAYOUT STRUCTURE:**

**Design 1: FULL CENTERED or MINIMAL CORNER - Dark Cyberpunk**
- **Layout**: "centered" OR "minimal-corner" (pick ONE)
- Background: Pitch black (#000000), very dark urban/night imagery
- Overlay: BLACK (#000000) with 0.7-0.85 opacity for ultra-dark mood
- Text: Pure WHITE (#FFFFFF)
- Button: ELECTRIC NEON - Must use (#00FF00 lime, #FF00FF magenta, #00FFFF cyan, or #FFFF00 yellow)
- Button Hover: Slightly darker neon
- ${requirements.features.includes('particles') ? 'Particles: Matching neon color\n' : ''}${requirements.features.includes('animation') ? 'Animation: "glitch" or "slide-up"\n' : ''}- Copy: Aggressive, edgy, urban tone

**Design 2: SPLIT or BOTTOM - Bright Lifestyle**
- **Layout**: "split-left" OR "bottom-aligned" (pick ONE, must be DIFFERENT from Design 1)
- Background: Bright, sunny, energetic imagery (beaches, nature, people, sky)
- Overlay: WHITE (#FFFFFF, #F5F5F5) with 0.15-0.25 opacity (shows image clearly!)
- Text: PURE BLACK (#000000) or very dark (#1A1A1A)
- Button: BOLD SATURATED - Must use (#FF3366 hot pink, #7C3AED purple, #0EA5E9 sky blue, #10B981 emerald, or #F59E0B amber)
- Button Hover: Darker shade
- ${requirements.features.includes('particles') ? 'Particles: Soft white or matching button color\n' : ''}${requirements.features.includes('animation') ? 'Animation: "fade-in" or "float"\n' : ''}- Copy: Uplifting, aspirational, positive tone

**Design 3: DIAGONAL - Futuristic Gradient**
- **Layout**: "diagonal" (MANDATORY - dramatically angled, skewed elements)
- Background: Abstract, futuristic, or tech imagery (architecture, space, geometric)
- Overlay: MUST use gradientOverlay with bold combinations like "from-purple-900/75 to-pink-900/75"
- Text: WHITE (#FFFFFF) with skew effects  
- Button: Gradient-matching - use (#EC4899 pink, #8B5CF6 purple, #06B6D4 cyan, #EF4444 red, #F59E0B orange)
- Button Hover: Darker shade
- ${requirements.features.includes('particles') ? 'Particles: White or gradient-matching\n' : ''}${requirements.features.includes('animation') ? 'Animation: "zoom-in" or "float"\n' : ''}- Copy: Innovative, future-forward tone

**LAYOUT REQUIREMENTS (CRITICAL):**
- All 3 designs MUST use DIFFERENT layouts
- Available layouts: "centered", "split-left", "diagonal", "minimal-corner", "bottom-aligned"
- Design 1: Pick centered or minimal-corner
- Design 2: Pick split-left or bottom-aligned  
- Design 3: MUST use diagonal
- This creates 3 COMPLETELY DIFFERENT hero structures!
- Button Hover: Slightly darker neon
- ${requirements.features.includes('particles') ? 'Particles: Matching neon color\n' : ''}${requirements.features.includes('animation') ? 'Animation: "glitch" or "slide-up"\n' : ''}- Copy: Aggressive, edgy, urban tone

**Design 2: SPLIT LAYOUT - Bold Modern**
- **Layout**: "split" (text on left half, image on right half - completely different structure!)
- Background: Bright, sunny, energetic imagery (beaches, nature, people, sky)
- Left side: Solid color panel, Right side: Full image
- Text: PURE BLACK (#000000) or very dark (#1A1A1A) on solid left panel
- Button: BOLD SATURATED - Must use (#FF3366 hot pink, #7C3AED purple, #0EA5E9 sky blue, #10B981 emerald, or #F59E0B amber)
- Button Hover: Darker shade of button color
- ${requirements.features.includes('particles') ? 'Particles: Soft white or matching button color\n' : ''}${requirements.features.includes('animation') ? 'Animation: "fade-in" or "float"\n' : ''}- Copy: Uplifting, aspirational, positive tone

**Design 3: DIAGONAL HERO - Sci-Fi Edge**
- **Layout**: "diagonal" (dramatic angled/skewed design - totally unique structure!)
- Background: Abstract, futuristic, or tech imagery (architecture, space, geometric)
- Overlay: MUST use gradientOverlay with bold combinations:
  * "from-purple-900/75 to-pink-900/75" (purple to pink)
  * "from-blue-900/70 to-cyan-900/70" (blue to cyan)
  * "from-orange-900/75 to-red-900/75" (orange to red)
  * "from-emerald-900/70 to-teal-900/70" (green to teal)
- Text: WHITE (#FFFFFF) with skew effects
- Button: Complementary to gradient - use (#EC4899 pink, #8B5CF6 purple, #06B6D4 cyan, #EF4444 red, or #F59E0B orange)
- Button Hover: Darker shade
- ${requirements.features.includes('particles') ? 'Particles: White or gradient-matching color\n' : ''}${requirements.features.includes('animation') ? 'Animation: "zoom-in" or "float"\n' : ''}- Copy: Innovative, future-forward, tech-savvy tone

**Copy Guidelines:**
- Headings: 2-6 words, POWERFUL and specific to ${requirements.industry} (e.g., "Unleash The Night", "Ride Free, Live Bold")
- Subheadings: 10-18 words, clear CUSTOMER-FACING value proposition for ${requirements.industry} customers${requirements.features.includes('video') || requirements.features.includes('animation') ? ' with dynamic, action-oriented language' : ''}${requirements.features.includes('particles') || requirements.features.includes('3d') ? ' emphasizing visual impact and innovation' : ''}
- Buttons: 1-3 words, action-driven (e.g., "Shop Now", "Explore Pro", "Discover Innovation")
- **CRITICAL**: Do NOT write meta-descriptions like "A hero section featuring..." - write actual customer-facing marketing copy!

**Image Selection (CRITICAL - Pick EXTREMELY DISTINCT images):**
${requirements.features.includes('particles') ? '- Prioritize images with bokeh, light particles, sparks, stars, or atmospheric effects\n' : ''}${requirements.features.includes('video') ? '- Choose dynamic, cinematic scenes with motion blur or action (sports, cities, nature in motion)\n' : ''}${requirements.features.includes('3d') ? '- Select images with 3D objects, architecture, geometric shapes, or strong perspective\n' : ''}${requirements.features.includes('parallax') ? '- Find images with clear depth layers (mountains with sky, buildings with clouds)\n' : ''}${requirements.features.includes('animation') ? '- Pick images with visual rhythm, patterns, or elements that suggest movement\n' : ''}${requirements.features.includes('carousel') ? '- Ensure strong visual hierarchy and clear focal points\n' : ''}- **Design 1**: Night cityscapes, industrial warehouses, dark streets, neon-lit alleys, urban underground${requirements.features.includes('particles') ? ', with light trails or bokeh' : ''}
- **Design 2**: Sunrise/sunset beaches, mountain peaks with blue sky, vibrant festivals, people in action, bright modern interiors${requirements.features.includes('video') ? ', action sports' : ''}  
- **Design 3**: Futuristic architecture, space nebulas, abstract 3D renders, holographic effects, geometric patterns${requirements.features.includes('3d') ? ', 3D geometric shapes' : ''}

**FORCE MAXIMUM VISUAL CONTRAST:**
- If Design 1 uses #00FF00 green button, Design 2 MUST use #FF3366 pink, and Design 3 MUST use #8B5CF6 purple
- Design 1 = DARK image + BLACK overlay, Design 2 = BRIGHT image + WHITE overlay, Design 3 = ABSTRACT image + GRADIENT overlay
- NO TWO DESIGNS can use similar button colors - they must be completely different hues
- Overlay opacities must vary dramatically: ~0.75 (dark), ~0.2 (light), gradient (medium)

**MANDATORY COLOR REQUIREMENTS (NO EXCEPTIONS):**
- Design 1 button: Choose ONE from (#00FF00 lime green, #FF00FF magenta, #00FFFF cyan, #FFFF00 yellow)
- Design 2 button: Choose ONE from (#FF3366 hot pink, #7C3AED purple, #0EA5E9 sky blue, #10B981 emerald, #F59E0B amber)  
- Design 3 button: MUST match gradient theme - use (#EC4899 pink, #8B5CF6 purple, #06B6D4 cyan, #EF4444 red, #F59E0B orange)
- All 3 button colors MUST be different hues (no pink + magenta, no purple + purple, etc.)
- Text contrast: Design 1 & 3 use #FFFFFF white, Design 2 uses #000000 black

**Effect-Specific Guidelines:**
${requirements.features.includes('particles') ? `- PARTICLES: Set "enableParticles": true and choose particle colors (#FFFFFF for white, #00FFFF for cyan, #FF00FF for magenta, #00FF00 for green). Make each design use DIFFERENT particle colors.\n` : ''}${requirements.features.includes('animation') ? `- ANIMATIONS: Choose from: "fade-in" (classic), "slide-up" (modern), "zoom-in" (bold), "glitch" (edgy), "float" (smooth). Make each design use DIFFERENT animations.\n` : ''}${requirements.features.includes('parallax') ? `- PARALLAX: Set "enableParallax": true with speed 0.3-0.7 (lower = slower, higher = faster). Vary speeds across designs.\n` : ''}${requirements.features.includes('3d') || requirements.features.includes('video') ? `- GRADIENT OVERLAYS: Set "gradientOverlay": true with Tailwind gradient classes like "from-purple-900/70 to-pink-900/70", "from-blue-900/60 to-cyan-900/60", or "from-amber-900/70 to-red-900/70". Each design should use DIFFERENT gradient combinations.\n` : ''}
**RETURN ONLY THIS JSON (no markdown, no explanation):**
[
  {
    "name": "Design Name (2-4 words)",
    "description": "Technical description of the visual style ONLY for the design card (mention colors, effects, mood) - NOT shown to customers",
    "layout": "centered" | "split-left" | "diagonal" | "minimal-corner" | "bottom-aligned",
    "data": {
      "variant": SAME AS LAYOUT VALUE,
      "heading": "Customer-Facing Marketing Headline",
      "subheading": "Customer-facing benefit statement that sells the product/service to ${requirements.industry} customers",
      "buttonText": "Action Verb",
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

**EXAMPLES OF GOOD vs BAD:**
❌ BAD subheading: "A modern hero section with bold typography and particle effects"
✅ GOOD subheading: "Transform your skateboarding with premium boards designed for ultimate performance"

❌ BAD subheading: "Features dark overlay and neon accents for an urban aesthetic"
✅ GOOD subheading: "Experience unmatched freedom and explore new horizons with boards designed for the open road"

**EXTREME DIVERSITY EXAMPLE:**
If all 3 designs look similar, you FAILED. They must look like completely different websites:
- Design 1: Dark + Neon Green Button = Cyberpunk/Underground vibe
- Design 2: Bright + Hot Pink Button = Modern/Lifestyle vibe  
- Design 3: Purple Gradient + Purple Button = Futuristic/Tech vibe

**IMPORTANT:** Each design MUST have different ${requirements.features.length > 0 ? 'animation types, particle colors, and button colors' : 'button colors, overlays, and visual approaches'} to justify $99 exclusive pricing. NO SIMILAR DESIGNS ALLOWED!`;
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
      layout: design.layout || 'fullimage',
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
