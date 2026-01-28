import React, { useState, useCallback } from 'react';
import { Sparkles, Loader, CheckCircle, AlertTriangle, Layout, ShoppingBag, FileText, Palette, Wand2, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { generateCompleteSite, SiteBlueprint } from '../ai/agents';
import { PageBlock } from '../types';

interface AISiteGeneratorProps {
  storeId: string;
  onComplete?: () => void;
  onNavigateToPage?: (pageId: string) => void;
  onRefreshData?: () => Promise<void>;
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
  blueprint: SiteBlueprint;
  pages: Array<{
    name: string;
    type: 'home' | 'about' | 'shop' | 'contact';
    slug: string;
    blocks: PageBlock[];
  }>;
  products: Array<{
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
  }>;
}

export default function AISiteGenerator({ storeId, onComplete, onNavigateToPage, onRefreshData }: AISiteGeneratorProps) {
  const [step, setStep] = useState<GeneratorStep>('input');
  const [prompt, setPrompt] = useState('');
  const [numPages, setNumPages] = useState(3);
  const [numProducts, setNumProducts] = useState(5);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generatedSite, setGeneratedSite] = useState<GeneratedSite | null>(null);
  const [createdPageIds, setCreatedPageIds] = useState<string[]>([]);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a business description');
      return;
    }

    try {
      setError(null);
      setStep('generating');
      setProgress(5);
      setCurrentTask('🎨 Analyzing your business with AI Architect...');

      // Step 1: Use the new two-agent system
      setProgress(20);
      setCurrentTask('🏗️ Creating site blueprint...');
      
      const result = await generateCompleteSite(prompt, numPages);
      
      setProgress(50);
      setCurrentTask('✨ Generating page content...');
      
      console.log('[AISiteGenerator] Complete site generated:', result);

      setProgress(90);
      setCurrentTask('🎁 Preparing your preview...');

      setGeneratedSite(result);
      setProgress(100);
      setStep('review');

    } catch (error: any) {
      console.error('[AISiteGenerator] Generation error:', error);
      setError(error.message || 'Failed to generate website. Please try again.');
      setStep('input');
      setProgress(0);
    }
  }, [prompt, numPages]);

  const handleSaveToDatabase = useCallback(async () => {
    if (!generatedSite || !storeId) return;

    try {
      setStep('saving');
      setProgress(10);
      setCurrentTask('Creating new design in library...');

      const { blueprint, pages, products } = generatedSite;

      // Save design theme to design library
      const { data: designData, error: designError } = await supabase
        .from('store_designs')
        .insert({
          store_id: storeId,
          name: `AI Generated - ${blueprint.brand.name}`,
          is_active: true, // Set as active automatically
          header_style: 'canvas',
          header_data: {},
          hero_style: 'impact',
          product_card_style: 'modern',
          footer_style: 'columns',
          scrollbar_style: 'native',
          primary_color: blueprint.design.primaryColor,
          secondary_color: blueprint.design.secondaryColor,
          background_color: blueprint.design.backgroundColor,
          store_type: blueprint.brand.industry,
          store_vibe: blueprint.brand.vibe,
          typography: {
            headingFont: blueprint.design.headingFont,
            bodyFont: blueprint.design.bodyFont,
            headingColor: '#000000',
            bodyColor: '#737373',
            linkColor: blueprint.design.primaryColor,
            baseFontSize: '16px',
            headingScale: 'default',
            headingWeight: '700',
            bodyWeight: '400'
          }
        })
        .select()
        .single();

      if (designError) throw designError;
      
      console.log('[AISiteGenerator] Created design:', designData);

      setProgress(30);
      setCurrentTask('Creating pages...');

      // Save pages
      const pageIds: string[] = [];
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const pageId = `ai_page_${Date.now()}_${i}`;
        
        console.log(`[AISiteGenerator] Saving page ${page.name} with ${page.blocks?.length || 0} blocks`);
        
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
        setProgress(30 + ((i + 1) / pages.length) * 40);
      }

      setProgress(70);
      setCurrentTask('Creating products...');

      // Save products
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        await supabase
          .from('products')
          .insert({
            id: `ai_product_${Date.now()}_${i}`,
            store_id: storeId,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: 100,
            category: product.category,
            images: [product.image]
          });
        setProgress(70 + ((i + 1) / products.length) * 25);
      }

      setProgress(95);
      setCurrentTask('Finalizing design...');

      setCreatedPageIds(pageIds);
      setProgress(100);
      setCurrentTask('Loading your new website...');
      
      // Reload pages from database so new AI pages are in state
      console.log('[AISiteGenerator] Refreshing data to load new pages and activate new design...');
      if (onRefreshData) {
        await onRefreshData();
      }
      
      // Auto-navigate to first page in designer after short delay, and reload to show new design
      setTimeout(() => {
        setStep('complete');
        // Reload the entire page to activate the new design
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error('[AISiteGenerator] Save error:', error);
      setError(error.message || 'Failed to save website');
      setStep('review');
    }
  }, [generatedSite, storeId, onNavigateToPage, onRefreshData]);

  // Render steps
  if (step === 'input') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <Wand2 className="w-8 h-8 text-purple-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">AI Website Generator</h2>
                <p className="text-neutral-300 mt-1">Describe your business and we'll build your entire website</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-200 mb-2">
                Describe Your Business
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Modern coffee shop with online ordering and delivery. Focus on artisanal coffee and cozy atmosphere. Target audience is young professionals."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 resize-none text-white placeholder-neutral-400"
                rows={4}
                style={{ color: '#ffffff' }}
              />
              <p className="text-sm text-neutral-400 mt-2">
                Be specific! Include your business type, target audience, and key features.
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Number of Pages
                </label>
                <input
                  type="number"
                  value={numPages}
                  onChange={(e) => setNumPages(Math.max(1, Math.min(8, parseInt(e.target.value) || 3)))}
                  min={1}
                  max={8}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 text-white"
                  style={{ color: '#ffffff' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Number of Products (if applicable)
                </label>
                <input
                  type="number"
                  value={numProducts}
                  onChange={(e) => setNumProducts(Math.max(0, Math.min(20, parseInt(e.target.value) || 5)))}
                  min={0}
                  max={20}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 text-white"
                  style={{ color: '#ffffff' }}
                />
              </div>
            </div>

            {/* Examples */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-semibold text-purple-300 mb-2">Example Prompts:</h4>
              <ul className="space-y-1 text-sm text-purple-200/80">
                <li>• "Luxury fashion boutique selling designer handbags and accessories"</li>
                <li>• "Tech startup offering AI-powered marketing automation software"</li>
                <li>• "Local bakery specializing in artisan bread and custom cakes"</li>
                <li>• "Fitness coaching service with online training programs"</li>
              </ul>
            </div>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-300">Error</p>
                    <p className="text-sm text-red-200/80 mt-1">{error}</p>
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
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
          <div className="text-center">
            <Loader className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-spin" />
            <h3 className="text-xl font-bold mb-2 text-white">{currentTask}</h3>
            <div className="w-full bg-white/10 rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-neutral-300 mt-2">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'review' && generatedSite) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-b border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Review Your Website</h2>
                  <p className="text-neutral-300 mt-1">Your AI-generated website is ready!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <Layout className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-2xl font-bold text-white">{generatedSite.pages.length}</div>
                <div className="text-sm text-blue-300">Pages Created</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <ShoppingBag className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-2xl font-bold text-white">{generatedSite.products.length}</div>
                <div className="text-sm text-green-300">Products Generated</div>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <Palette className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-2xl font-bold text-white">1</div>
                <div className="text-sm text-purple-300">Custom Header</div>
              </div>
            </div>

            {/* Pages List */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 text-white">Pages</h3>
              <div className="space-y-2">
                {generatedSite.pages.map((page, idx) => (
                  <div key={idx} className="border border-white/10 bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{page.name}</h4>
                        <p className="text-sm text-neutral-400">{page.blocks.length} sections</p>
                      </div>
                      <FileText className="w-5 h-5 text-neutral-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  setStep('input');
                  setGeneratedSite(null);
                  setPrompt('');
                  setProgress(0);
                }}
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 font-medium text-white"
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
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Website Created! 🎉</h2>
                <p className="text-neutral-300 mt-1">Your AI-generated website is live</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4 text-white">What Was Created:</h3>
              <ul className="space-y-3 text-sm text-neutral-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span><strong>{generatedSite?.pages.length || 0} pages</strong> with complete content and sections</span>
                </li>
                {generatedSite && generatedSite.products.length > 0 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span><strong>{generatedSite.products.length} products</strong> added to your store</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span><strong>Custom header</strong> saved to Header Studio under "Custom" tab</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
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
                className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 font-medium text-white"
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
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 font-semibold"
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
