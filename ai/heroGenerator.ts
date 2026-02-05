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
  return `You are an expert web designer and frontend developer. Generate 3 unique, professional hero section designs for a website.

**Client Requirements:**
- Industry: ${requirements.industry}
- Design Style: ${requirements.style}
- Features Requested: ${requirements.features.length > 0 ? requirements.features.join(', ') : 'Standard hero with heading, subheading, and call-to-action'}
- Color Mood: ${requirements.colorMood}
- Additional Context: ${requirements.additionalContext || 'None provided'}

**Your Task:**
Generate 3 distinct hero designs that fit these requirements. Each design should have:
1. A unique visual approach (different color schemes, imagery styles)
2. Professional, conversion-optimized copy
3. Cohesive color palette that matches the mood
4. Appropriate imagery (provide Unsplash URLs)

**Important Guidelines:**
- Headings should be 3-8 words, punchy and benefit-driven
- Subheadings should be 8-15 words, expanding on the value proposition
- Button text should be 1-3 words, action-oriented (e.g., "Get Started", "Learn More", "Shop Now")
- Colors must be in HEX format (#RRGGBB)
- Background images must be high-quality Unsplash URLs (https://images.unsplash.com/photo-...)
- Overlay opacity should be 0.3-0.7 (30-70%) for optimal text readability
- Each design should feel distinctly different from the others

Return ONLY a valid JSON array (no markdown, no explanation) with this exact structure:
[
  {
    "name": "Bold & Modern",
    "description": "High-contrast design with bold typography and vibrant accents",
    "data": {
      "heading": "Transform Your Business Today",
      "subheading": "Join thousands of companies using our platform to scale faster",
      "buttonText": "Get Started",
      "buttonLink": "#",
      "backgroundImage": "https://images.unsplash.com/photo-1441986300917-64674bd600d8",
      "textColor": "#FFFFFF",
      "buttonBackgroundColor": "#000000",
      "buttonTextColor": "#FFFFFF",
      "buttonHoverColor": "#333333",
      "overlayColor": "#000000",
      "overlayOpacity": 0.5,
      "showSubheading": true,
      "showButton": true
    }
  }
]`;
}

/**
 * Generate 3 hero designs using Gemini AI
 */
export async function generateHeroDesigns(requirements: DesignRequirements): Promise<GeneratedHero[]> {
  try {
    const genAI = getGenAI();
    const prompt = buildHeroPrompt(requirements);
    
    // Generate with Gemini (using gemini-2.0-flash-exp model)
    const result = await genAI.models.generate({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        temperature: 0.8, // Higher creativity for diverse designs
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      }
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
