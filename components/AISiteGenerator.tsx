import React, { useState, useCallback } from 'react';
import { Sparkles, Loader, CheckCircle, AlertTriangle, Layout, ShoppingBag, FileText, Palette, Wand2, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { GoogleGenAI } from '@google/genai';
import { PageBlock } from '../types';

interface AISiteGeneratorProps {
  storeId: string;
  onComplete?: () => void;
  onNavigateToPage?: (pageId: string) => void;
}

type GeneratorStep = 'input' | 'generating' | 'review' | 'saving' | 'complete';

interface GeneratedPage {
  name: string;
  type: 'home' | 'custom';
  blocks: PageBlock[];
  slug: string;
}

interface GeneratedProduct {
  name: string;
  description: string;
  price: number;
  category: string;
}

interface GeneratedSite {
  businessType: string;
  pages: GeneratedPage[];
  products: GeneratedProduct[];
  customHeader: any;
  customSections: any[];
  designTheme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fonts: {
      heading: string;
      body: string;
    };
  };
}

export default function AISiteGenerator({ storeId, onComplete, onNavigateToPage }: AISiteGeneratorProps) {
  const [step, setStep] = useState<GeneratorStep>('input');
  const [prompt, setPrompt] = useState('');
  const [numPages, setNumPages] = useState(3);
  const [numProducts, setNumProducts] = useState(5);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedSite, setGeneratedSite] = useState<GeneratedSite | null>(null);
  const [createdPageIds, setCreatedPageIds] = useState<string[]>([]);

  // Check if AI is available
  const getGenAI = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GOOGLE_AI_API_KEY not configured. Please add it to your environment variables.');
    }
    return new GoogleGenAI({ apiKey: apiKey });
  };

  const generateSiteStructure = async (genAI: any, userPrompt: string): Promise<any> => {
    const structurePrompt = `You are a website structure architect. Based on this business description, create a complete website structure.

Business Description: "${userPrompt}"

Return a JSON object with this EXACT structure (valid JSON only, no markdown):
{
  "businessType": "restaurant|ecommerce|portfolio|service|blog",
  "businessName": "Name of the business",
  "pages": [
    {"name": "Home", "type": "home", "slug": "home"},
    {"name": "About", "type": "about", "slug": "about"},
    {"name": "Contact", "type": "contact", "slug": "contact"}
  ],
  "hasProducts": true|false,
  "designTheme": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "backgroundColor": "#hex",
    "headingFont": "Font Name",
    "bodyFont": "Font Name"
  }
}

Limit to ${numPages} pages. Return ONLY valid JSON, no other text.`;

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: structurePrompt
    });

    const text = result.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid JSON response from AI');
    return JSON.parse(jsonMatch[0]);
  };

  const generatePageContent = async (genAI: any, pageName: string, pageType: string, siteContext: any): Promise<PageBlock[]> => {
    const contentPrompt = `Create gorgeous, complete page content for a "${pageName}" page on a ${siteContext.businessType} website: ${siteContext.businessName}.

Design theme colors:
- Primary: ${siteContext.designTheme.primaryColor}
- Secondary: ${siteContext.designTheme.secondaryColor}
- Background: ${siteContext.designTheme.backgroundColor}

Generate 3-5 sections with COMPLETE, compelling copy. Return a JSON array:
[
  {
    "id": "block_1",
    "type": "system-hero",
    "name": "Hero Section",
    "content": "",
    "variant": "impact",
    "data": {
      "heading": "Write a powerful, specific headline (not generic)",
      "subheading": "Write an engaging 2-sentence description that sells the value",
      "buttonText": "Clear Call to Action",
      "image": "https://images.unsplash.com/photo-${siteContext.businessType === 'restaurant' ? '1504674900247-0877df9cc836' : siteContext.businessType === 'coffee' ? '1447933601403-0c61db6f49a7' : siteContext.businessType === 'fashion' || siteContext.businessType === 'ecommerce' ? '1483985988355-763728e1935b' : '1451187580459-43490279c0fa'}?w=1200&h=800&q=80&auto=format&fit=crop",
      "style": {
        "backgroundColor": "${siteContext.designTheme.primaryColor}",
        "textColor": "#FFFFFF",
        "padding": "xl",
        "alignment": "center"
      }
    }
  },
  {
    "id": "block_2",
    "type": "system-rich-text",
    "name": "About Section",
    "content": "<h2>Section Heading</h2><p>Paragraph with real, compelling copy about the business. Make it specific and engaging, not generic placeholder text.</p>",
    "data": {
      "style": {
        "backgroundColor": "#FFFFFF",
        "textColor": "#000000",
        "padding": "l"
      }
    }
  }
]

IMPORTANT:
- Write REAL, compelling copy - not "Lorem ipsum" or generic placeholders
- Include real Unsplash image URLs related to the business type (use photo IDs: restaurant=1504674900247-0877df9cc836, coffee=1447933601403-0c61db6f49a7, fashion/ecommerce=1483985988355-763728e1935b, tech/service=1451187580459-43490279c0fa)
- Use the provided theme colors in style objects
- Make headings specific to the business (not "Welcome" or "About Us")
- Valid block types: system-hero, system-rich-text, system-gallery, system-contact, system-promo, system-layout, system-collection
- Valid hero variants: impact, minimal, centered, split
Return ONLY valid JSON array.`;

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: contentPrompt
    });

    const text = result.text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  };

  const generateProducts = async (genAI: any, businessType: string, count: number): Promise<GeneratedProduct[]> => {
    const productPrompt = `Generate ${count} realistic products for a ${businessType} business.

Return a JSON array with this structure:
[
  {
    "name": "Product Name",
    "description": "2-3 sentence product description",
    "price": 2999,
    "category": "Category Name"
  }
]

Prices in cents (e.g., 2999 = $29.99). Return ONLY valid JSON array.`;

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: productPrompt
    });

    const text = result.text.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]);
  };

  const generateCustomHeader = async (genAI: any, businessType: string, designTheme: any): Promise<any> => {
    const headerPrompt = `Create a unique header design for a ${businessType} website.

Design theme: ${JSON.stringify(designTheme)}

Return JSON with this structure:
{
  "name": "Descriptive Header Name (e.g., 'Modern Coffee Shop Header')",
  "componentJsx": "<!-- Simple HTML header structure -->",
  "editControls": [
    {"field": "logoText", "type": "text", "label": "Logo Text"},
    {"field": "backgroundColor", "type": "color", "label": "Background Color"}
  ]
}

Return ONLY valid JSON.`;

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: headerPrompt
    });

    const text = result.text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a business description');
      return;
    }

    try {
      setError(null);
      setStep('generating');
      setProgress(5);
      setCurrentTask('Analyzing your business...');

      const genAI = getGenAI();

      // Step 1: Generate site structure
      setProgress(15);
      const structure = await generateSiteStructure(genAI, prompt);
      console.log('[AISiteGenerator] Generated structure:', structure);

      setCurrentTask('Creating pages...');
      setProgress(30);

      // Step 2: Generate page content
      const pages: GeneratedPage[] = [];
      for (let i = 0; i < structure.pages.length; i++) {
        const page = structure.pages[i];
        setCurrentTask(`Creating ${page.name} page...`);
        setProgress(30 + (i / structure.pages.length) * 30);

        const blocks = await generatePageContent(genAI, page.name, page.type, structure);
        console.log(`[AISiteGenerator] Generated blocks for ${page.name}:`, blocks);
        pages.push({
          name: page.name,
          type: page.type === 'home' ? 'home' : 'custom',
          slug: page.slug,
          blocks: blocks
        });
      }

      // Step 3: Generate products if needed
      let products: GeneratedProduct[] = [];
      if (structure.hasProducts && numProducts > 0) {
        setCurrentTask('Generating products...');
        setProgress(65);
        products = await generateProducts(genAI, structure.businessType, numProducts);
      }

      // Step 4: Generate custom header
      setCurrentTask('Creating custom header design...');
      setProgress(80);
      const customHeader = await generateCustomHeader(genAI, structure.businessType, structure.designTheme);

      // Step 5: Store results
      setProgress(95);
      setCurrentTask('Preparing preview...');

      setGeneratedSite({
        businessType: structure.businessType,
        pages: pages,
        products: products,
        customHeader: customHeader,
        customSections: [],
        designTheme: {
          primaryColor: structure.designTheme.primaryColor,
          secondaryColor: structure.designTheme.secondaryColor,
          backgroundColor: structure.designTheme.backgroundColor,
          fonts: {
            heading: structure.designTheme.headingFont,
            body: structure.designTheme.bodyFont
          }
        }
      });

      setProgress(100);
      setStep('review');

    } catch (error: any) {
      console.error('[AISiteGenerator] Generation error:', error);
      setError(error.message || 'Failed to generate website');
      setStep('input');
      setProgress(0);
    }
  }, [prompt, numPages, numProducts]);

  const handleSaveToDatabase = useCallback(async () => {
    if (!generatedSite || !storeId) return;

    try {
      setStep('saving');
      setProgress(10);
      setCurrentTask('Saving design theme...');

      // Save design theme
      const { data: designData, error: designError } = await supabase
        .from('store_designs')
        .insert({
          store_id: storeId,
          name: `${generatedSite.businessType} AI Generated Design`,
          is_active: true,
          primary_color: generatedSite.designTheme.primaryColor,
          secondary_color: generatedSite.designTheme.secondaryColor,
          background_color: generatedSite.designTheme.backgroundColor,
          store_vibe: 'modern',
          typography: {
            headingFont: generatedSite.designTheme.fonts.heading,
            bodyFont: generatedSite.designTheme.fonts.body,
            headingColor: '#000000',
            bodyColor: '#737373',
            linkColor: generatedSite.designTheme.primaryColor,
            baseFontSize: '16px',
            headingScale: 'default',
            headingWeight: '700',
            bodyWeight: '400'
          }
        })
        .select()
        .single();

      if (designError) throw designError;

      setProgress(30);
      setCurrentTask('Creating pages...');

      // Save pages
      const pageIds: string[] = [];
      for (let i = 0; i < generatedSite.pages.length; i++) {
        const page = generatedSite.pages[i];
        const pageId = `ai_page_${Date.now()}_${i}`;
        
        console.log(`[AISiteGenerator] Saving page ${page.name} with ${page.blocks?.length || 0} blocks:`, page.blocks);
        
        const { error: pageError } = await supabase
          .from('pages')
          .insert({
            id: pageId,
            store_id: storeId,
            title: page.name,
            slug: `${page.slug}-${Date.now()}`,
            type: page.type,
            blocks: page.blocks
          });

        if (pageError) {
          console.error(`[AISiteGenerator] Error saving page ${page.name}:`, pageError);
        } else {
          console.log(`[AISiteGenerator] Successfully saved page ${page.name} with ID ${pageId}`);
          pageIds.push(pageId);
        }
        setProgress(30 + ((i + 1) / generatedSite.pages.length) * 40);
      }

      setProgress(70);
      setCurrentTask('Creating products...');

      // Save products
      for (let i = 0; i < generatedSite.products.length; i++) {
        const product = generatedSite.products[i];
        await supabase
          .from('products')
          .insert({
            id: `ai_product_${Date.now()}_${i}`,
            store_id: storeId,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: 100,
            category: product.category
          });
        setProgress(70 + ((i + 1) / generatedSite.products.length) * 20);
      }

      setProgress(95);
      setCurrentTask('Saving custom header...');

      // Save custom header
      if (generatedSite.customHeader) {
        await supabase
          .from('custom_headers')
          .insert({
            store_id: storeId,
            name: generatedSite.customHeader.name,
            component_jsx: generatedSite.customHeader.componentJsx,
            edit_controls: generatedSite.customHeader.editControls
          });
      }

      setCreatedPageIds(pageIds);
      setProgress(100);
      setCurrentTask('Opening your new website...');
      
      // Auto-navigate to first page in designer after short delay
      setTimeout(() => {
        setStep('complete');
        if (pageIds.length > 0 && onNavigateToPage) {
          onNavigateToPage(pageIds[0]);
        }
      }, 1500);

    } catch (error: any) {
      console.error('[AISiteGenerator] Save error:', error);
      setError(error.message || 'Failed to save website');
      setStep('review');
    }
  }, [generatedSite, storeId, onNavigateToPage]);

  // Render steps
  if (step === 'input') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Wand2 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Website Generator</h2>
                <p className="text-purple-100 mt-1">Describe your business and we'll build your entire website</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Business
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Modern coffee shop with online ordering and delivery. Focus on artisanal coffee and cozy atmosphere. Target audience is young professionals."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
                style={{ color: '#000000' }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Be specific! Include your business type, target audience, and key features.
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Pages
                </label>
                <input
                  type="number"
                  value={numPages}
                  onChange={(e) => setNumPages(Math.max(1, Math.min(8, parseInt(e.target.value) || 3)))}
                  min={1}
                  max={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  style={{ color: '#000000' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Products (if applicable)
                </label>
                <input
                  type="number"
                  value={numProducts}
                  onChange={(e) => setNumProducts(Math.max(0, Math.min(20, parseInt(e.target.value) || 5)))}
                  min={0}
                  max={20}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  style={{ color: '#000000' }}
                />
              </div>
            </div>

            {/* Examples */}
            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">Example Prompts:</h4>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• "Luxury fashion boutique selling designer handbags and accessories"</li>
                <li>• "Tech startup offering AI-powered marketing automation software"</li>
                <li>• "Local bakery specializing in artisan bread and custom cakes"</li>
                <li>• "Fitness coaching service with online training programs"</li>
              </ul>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!prompt}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate My Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'generating' || step === 'saving') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <Loader className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
            <h3 className="text-xl font-bold mb-2">{currentTask}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'review' && generatedSite) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Review Your Website</h2>
                  <p className="text-purple-100 mt-1">Your AI-generated website is ready!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <Layout className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-900">{generatedSite.pages.length}</div>
                <div className="text-sm text-blue-700">Pages Created</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <ShoppingBag className="w-6 h-6 text-green-600 mb-2" />
                <div className="text-2xl font-bold text-green-900">{generatedSite.products.length}</div>
                <div className="text-sm text-green-700">Products Generated</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <Palette className="w-6 h-6 text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-purple-900">1</div>
                <div className="text-sm text-purple-700">Custom Header</div>
              </div>
            </div>

            {/* Pages List */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Pages</h3>
              <div className="space-y-2">
                {generatedSite.pages.map((page, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{page.name}</h4>
                        <p className="text-sm text-gray-600">{page.blocks.length} sections</p>
                      </div>
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                onClick={() => {
                  setStep('input');
                  setGeneratedSite(null);
                  setPrompt('');
                  setProgress(0);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Start Over
              </button>
              <button
                onClick={handleSaveToDatabase}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 font-semibold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Save & Open in Designer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Website Created! 🎉</h2>
                <p className="text-green-100 mt-1">Your AI-generated website is live</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">What Was Created:</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span><strong>{generatedSite?.pages.length || 0} pages</strong> with complete content and sections</span>
                </li>
                {generatedSite && generatedSite.products.length > 0 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span><strong>{generatedSite.products.length} products</strong> added to your store</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span><strong>Custom header</strong> saved to Header Studio under "Custom" tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span><strong>Design theme</strong> created with colors and fonts (activate in Design Library)</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep('input');
                  setGeneratedSite(null);
                  setPrompt('');
                  setProgress(0);
                  setCreatedPageIds([]);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Generate Another
              </button>
              {createdPageIds.length > 0 && onNavigateToPage && (
                <button
                  onClick={() => onNavigateToPage(createdPageIds[0])}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
                >
                  <Layout className="w-5 h-5" />
                  Open in Designer
                </button>
              )}
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
