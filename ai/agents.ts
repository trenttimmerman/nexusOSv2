/**
 * AI Website Generation Agents
 * 
 * Two-stage AI generation system:
 * 1. Architect Agent: Converts user prompt -> Structured JSON blueprint
 * 2. Page Builder Agent: Converts blueprint -> PageBlock arrays for each page
 */

import { GoogleGenAI } from '@google/genai';
import { PageBlock } from '../types';

// Initialize Gemini AI
const getGenAI = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GOOGLE_AI_API_KEY not configured');
  }
  return new GoogleGenAI({ apiKey });
};

// Load prompts (these will be imported as strings via Vite)
import architectPrompt from './prompts/architect.md?raw';
import pageBuilderPrompt from './prompts/page-builder.md?raw';

/**
 * Robust JSON extraction from AI responses
 * Handles markdown wrappers, extra text, and malformed responses
 */
function extractJSON(text: string): string {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Find the first { and last } that form valid JSON
  const firstBrace = cleaned.indexOf('{');
  const firstBracket = cleaned.indexOf('[');
  
  if (firstBrace === -1 && firstBracket === -1) {
    throw new Error('No JSON object or array found in response');
  }
  
  // Determine if we're looking for object {} or array []
  const isObject = firstBracket === -1 || (firstBrace !== -1 && firstBrace < firstBracket);
  const startChar = isObject ? '{' : '[';
  const endChar = isObject ? '}' : ']';
  const startIndex = isObject ? firstBrace : firstBracket;
  
  // Find matching closing brace/bracket by counting depth
  let depth = 0;
  let endIndex = -1;
  
  for (let i = startIndex; i < cleaned.length; i++) {
    const char = cleaned[i];
    
    if (char === startChar) {
      depth++;
    } else if (char === endChar) {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  
  if (endIndex === -1) {
    throw new Error('No matching closing brace/bracket found');
  }
  
  return cleaned.substring(startIndex, endIndex + 1);
}

/**
 * Site Blueprint Schema
 * This is the structured data output from the Architect agent
 */
export interface SiteBlueprint {
  brand: {
    name: string;
    tagline: string;
    vibe: string;
    industry: string;
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontStyle: 'sans' | 'serif' | 'mono';
    headingFont: string;
    bodyFont: string;
  };
  styles: {
    headerStyle: string;
    heroStyle: string;
    productCardStyle: string;
    footerStyle: string;
  };
  content: {
    heroHeadline: string;
    heroSubheadline: string;
    ctaText: string;
    heroImagePrompt: string;
    aboutHeadline: string;
    aboutText: string;
  };
  products: Array<{
    name: string;
    price: number;
    description: string;
    category: string;
    imagePrompt: string;
  }>;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  testimonialsEnabled: boolean;
  testimonials?: Array<{
    name: string;
    role: string;
    text: string;
    rating: number;
  }>;
}

/**
 * AGENT 1: ARCHITECT
 * Converts natural language -> Structured blueprint
 */
export async function generateSiteBlueprint(userPrompt: string): Promise<SiteBlueprint> {
  const genAI = getGenAI();
  
  const model = genAI.models;
  
  const fullPrompt = `${architectPrompt}\n\n---\n\nUser's Business Description:\n"${userPrompt}"\n\nGenerate the complete JSON blueprint now:`;
  
  console.log('[Architect Agent] Generating blueprint...');
  
  const result = await model.generateContent({
    model: 'gemini-2.5-flash',
    contents: fullPrompt,
  });

  const text = result.text.trim();
  console.log('[Architect Agent] Raw response:', text.substring(0, 200) + '...');
  
  // Extract JSON from response using robust extraction
  try {
    const jsonText = extractJSON(text);
    const blueprint = JSON.parse(jsonText);
    console.log('[Architect Agent] Blueprint created:', blueprint.brand.name);
    return blueprint;
  } catch (error) {
    console.error('[Architect Agent] JSON extraction failed');
    console.error('[Architect Agent] Full response:', text);
    console.error('[Architect Agent] Error:', error);
    throw new Error('Failed to parse architect response: ' + (error as Error).message);
  }
}

/**
 * AGENT 2: PAGE BUILDER
 * Converts blueprint -> PageBlock arrays
 */
export async function generatePageContent(
  blueprint: SiteBlueprint,
  pageType: 'home' | 'about' | 'shop' | 'contact',
  pageName: string
): Promise<PageBlock[]> {
  const genAI = getGenAI();
  const model = genAI.models;
  
  const contextPrompt = `${pageBuilderPrompt}\n\n---\n\nSite Blueprint:\n${JSON.stringify(blueprint, null, 2)}\n\n---\n\nPage Information:\n- Page Type: ${pageType}\n- Page Name: ${pageName}\n\nGenerate the PageBlock array for this page now:`;
  
  console.log(`[Page Builder Agent] Generating ${pageType} page...`);
  
  const result = await model.generateContent({
    model: 'gemini-2.5-flash',
    contents: contextPrompt,
  });

  const text = result.text.trim();
  console.log(`[Page Builder Agent] Raw response length: ${text.length} chars`);
  
  // Extract JSON array using robust extraction
  try {
    const jsonText = extractJSON(text);
    const blocks = JSON.parse(jsonText);
    console.log(`[Page Builder Agent] Created ${blocks.length} blocks for ${pageName}`);
    return blocks;
  } catch (error) {
    console.error('[Page Builder Agent] JSON extraction failed');
    console.error('[Page Builder Agent] Full response:', text);
    console.error('[Page Builder Agent] Error:', error);
    throw new Error('Failed to parse page builder response: ' + (error as Error).message);
  }
}

/**
 * Generate product data with images
 */
export async function generateProductImages(products: SiteBlueprint['products']): Promise<Array<{
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
}>> {
  // For now, use Unsplash placeholder images based on prompts
  // In production, you could integrate with DALL-E, Midjourney API, etc.
  
  return products.map((product, index) => ({
    ...product,
    // Generate deterministic Unsplash URLs based on product type
    image: `https://images.unsplash.com/photo-${getUnsplashPhotoId(product.category)}?w=800&h=800&q=80&auto=format&fit=crop&seed=${index}`
  }));
}

/**
 * Helper to get relevant Unsplash photo IDs by category
 */
function getUnsplashPhotoId(category: string): string {
  const categoryMap: Record<string, string> = {
    'coffee': '1447933601403-0c61db6f49a7',
    'candles': '1602874801006-95e39d3b50d9',
    'fashion': '1483985988355-763728e1935b',
    'clothing': '1515886657613-9f3515b0c78f',
    'jewelry': '1515562141207-7a88fb7ce338',
    'tech': '1451187580459-43490279c0fa',
    'electronics': '1518770660439-4636190af475',
    'food': '1504674900247-0877df9cc836',
    'beauty': '1596462502278-27a10e11f9d8',
    'cosmetics': '1522335789203-aabd1fc54bc9',
    'fitness': '1534438327276-14e5300c3a48',
    'home': '1513694203232-719657d8cb1f',
    'decor': '1556912167-f556f1f39fdf',
    'plants': '1501004415730-b2de0c6c0d2a',
    'art': '1460661419201-fd4cecdf8a8b',
    'books': '1495446815901-a0a0aaa1f8cb',
  };
  
  const normalizedCategory = category.toLowerCase();
  
  // Try exact match
  if (categoryMap[normalizedCategory]) {
    return categoryMap[normalizedCategory];
  }
  
  // Try partial match
  for (const [key, photoId] of Object.entries(categoryMap)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return photoId;
    }
  }
  
  // Default fallback
  return '1441986300917-64674bd600d8';
}

/**
 * Master orchestrator: Full site generation
 */
export async function generateCompleteSite(userPrompt: string, numPages: number = 3) {
  console.log('[AI Generator] Starting complete site generation...');
  
  // Step 1: Create the blueprint
  const blueprint = await generateSiteBlueprint(userPrompt);
  
  // Step 2: Determine pages to create
  const pages: Array<{ name: string; type: 'home' | 'about' | 'shop' | 'contact'; slug: string }> = [
    { name: 'Home', type: 'home', slug: 'home' }
  ];
  
  if (numPages >= 2) {
    pages.push({ name: 'About', type: 'about', slug: 'about' });
  }
  if (numPages >= 3) {
    pages.push({ name: 'Shop', type: 'shop', slug: 'shop' });
  }
  if (numPages >= 4) {
    pages.push({ name: 'Contact', type: 'contact', slug: 'contact' });
  }
  
  // Step 3: Generate content for each page
  const pagesWithContent = [];
  for (const page of pages) {
    const blocks = await generatePageContent(blueprint, page.type, page.name);
    pagesWithContent.push({
      ...page,
      blocks
    });
  }
  
  // Step 4: Enhance products with images
  const products = await generateProductImages(blueprint.products);
  
  console.log('[AI Generator] Site generation complete!');
  
  return {
    blueprint,
    pages: pagesWithContent,
    products
  };
}
