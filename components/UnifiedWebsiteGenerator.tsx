import React, { useState } from 'react';
import { DesignWizard } from './DesignWizard';
import { generateCompleteSite } from '../ai/agents';
import { supabase } from '../lib/supabaseClient';
import { SiteBlueprint } from '../ai/agents';
import { HeaderStyleId, HeroStyleId, ProductCardStyleId, FooterStyleId } from '../types';
import { Sparkles, Wand2, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

interface UnifiedWebsiteGeneratorProps {
  storeId: string;
  onComplete: () => void;
  onClose: () => void;
  onRefreshData: () => Promise<void>;
}

type FlowStep = 'prompt' | 'generating' | 'wizard' | 'saving' | 'complete';

// Map AI blueprint colors to COLOR_PALETTES from DesignWizard
interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  vibe: string;
}

const COLOR_PALETTES: ColorPalette[] = [
  // Modern vibes
  { id: 'modern-slate', name: 'Modern Slate', primary: '#3B82F6', secondary: '#8B5CF6', background: '#F8FAFC', vibe: 'modern' },
  { id: 'modern-electric', name: 'Electric Blue', primary: '#06B6D4', secondary: '#0EA5E9', background: '#F0F9FF', vibe: 'modern' },
  { id: 'modern-mint', name: 'Fresh Mint', primary: '#10B981', secondary: '#14B8A6', background: '#F0FDF4', vibe: 'modern' },
  
  // Classic vibes
  { id: 'classic-navy', name: 'Navy & Gold', primary: '#1E3A8A', secondary: '#D97706', background: '#FFFBEB', vibe: 'classic' },
  { id: 'classic-burgundy', name: 'Burgundy Wine', primary: '#991B1B', secondary: '#92400E', background: '#FEF2F2', vibe: 'classic' },
  { id: 'classic-forest', name: 'Forest Green', primary: '#065F46', secondary: '#92400E', background: '#ECFDF5', vibe: 'classic' },
  
  // Bold vibes
  { id: 'bold-sunset', name: 'Sunset Fire', primary: '#DC2626', secondary: '#F59E0B', background: '#FFFBEB', vibe: 'bold' },
  { id: 'bold-neon', name: 'Neon Nights', primary: '#EC4899', secondary: '#8B5CF6', background: '#18181B', vibe: 'bold' },
  { id: 'bold-cyber', name: 'Cyberpunk', primary: '#06B6D4', secondary: '#F59E0B', background: '#0F172A', vibe: 'bold' },
  
  // Minimal vibes
  { id: 'minimal-mono', name: 'Pure Mono', primary: '#18181B', secondary: '#52525B', background: '#FFFFFF', vibe: 'minimal' },
  { id: 'minimal-soft', name: 'Soft Gray', primary: '#64748B', secondary: '#94A3B8', background: '#F8FAFC', vibe: 'minimal' },
  { id: 'minimal-warm', name: 'Warm Beige', primary: '#78716C', secondary: '#A8A29E', background: '#FAFAF9', vibe: 'minimal' },
];

function findClosestPalette(blueprint: SiteBlueprint): ColorPalette {
  const vibe = blueprint.brand.vibe.toLowerCase();
  
  // Filter palettes by vibe
  const vibeMatches = COLOR_PALETTES.filter(p => p.vibe === vibe);
  if (vibeMatches.length > 0) {
    // Find closest color match within same vibe
    let closest = vibeMatches[0];
    let minDiff = colorDistance(blueprint.design.primaryColor, vibeMatches[0].primary);
    
    for (const palette of vibeMatches) {
      const diff = colorDistance(blueprint.design.primaryColor, palette.primary);
      if (diff < minDiff) {
        minDiff = diff;
        closest = palette;
      }
    }
    return closest;
  }
  
  // Fallback: find closest color match across all palettes
  let closest = COLOR_PALETTES[0];
  let minDiff = colorDistance(blueprint.design.primaryColor, COLOR_PALETTES[0].primary);
  
  for (const palette of COLOR_PALETTES) {
    const diff = colorDistance(blueprint.design.primaryColor, palette.primary);
    if (diff < minDiff) {
      minDiff = diff;
      closest = palette;
    }
  }
  
  return closest;
}

// Simple color distance calculation (RGB Euclidean distance)
function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return Infinity;
  
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export const UnifiedWebsiteGenerator: React.FC<UnifiedWebsiteGeneratorProps> = ({
  storeId,
  onComplete,
  onClose,
  onRefreshData
}) => {
  const [flowStep, setFlowStep] = useState<FlowStep>('prompt');
  const [userPrompt, setUserPrompt] = useState('');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [aiBlueprint, setAiBlueprint] = useState<SiteBlueprint | null>(null);
  const [generatedPages, setGeneratedPages] = useState<any[]>([]);
  const [generatedProducts, setGeneratedProducts] = useState<any[]>([]);

  const handleGenerateContent = async () => {
    if (!userPrompt.trim()) {
      setError('Please describe your business');
      return;
    }

    setFlowStep('generating');
    setError('');
    setProgress(0);

    try {
      console.log('[UnifiedGenerator] Starting AI generation...');
      setProgress(10);

      const result = await generateCompleteSite(userPrompt, 3);
      
      console.log('[UnifiedGenerator] AI generation complete');
      setProgress(100);
      
      setAiBlueprint(result.blueprint);
      setGeneratedPages(result.pages);
      setGeneratedProducts(result.products);

      // Brief delay to show completion
      setTimeout(() => {
        setFlowStep('wizard');
      }, 500);

    } catch (err: any) {
      console.error('[UnifiedGenerator] Generation error:', err);
      setError(err.message || 'Failed to generate website. Please try again.');
      setFlowStep('prompt');
      setProgress(0);
    }
  };

  const handleWizardComplete = async () => {
    // DesignWizard will handle the design save
    // Now we need to save the AI-generated content (pages + products)
    setFlowStep('saving');
    setProgress(0);

    try {
      console.log('[UnifiedGenerator] Saving AI-generated content...');
      setProgress(20);

      // Insert pages
      for (let i = 0; i < generatedPages.length; i++) {
        const page = generatedPages[i];
        const { error: pageError } = await supabase.from('pages').insert({
          id: `ai_page_${Date.now()}_${i}`,
          store_id: storeId,
          title: page.name,
          slug: `${page.slug}-${Date.now()}`,
          type: page.type,
          blocks: page.blocks
        });

        if (pageError) {
          console.error('[UnifiedGenerator] Page insert error:', pageError);
          throw pageError;
        }
        setProgress(20 + (i + 1) / generatedPages.length * 40);
      }

      console.log('[UnifiedGenerator] Pages saved');
      setProgress(60);

      // Insert products
      for (let i = 0; i < generatedProducts.length; i++) {
        const product = generatedProducts[i];
        const { error: productError } = await supabase.from('products').insert({
          id: `ai_product_${Date.now()}_${i}`,
          store_id: storeId,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: 100,
          category: product.category,
          images: [product.image]
        });

        if (productError) {
          console.error('[UnifiedGenerator] Product insert error:', productError);
          throw productError;
        }
        setProgress(60 + (i + 1) / generatedProducts.length * 30);
      }

      console.log('[UnifiedGenerator] Products saved');
      setProgress(90);

      // Refresh data
      await onRefreshData();
      setProgress(100);

      setFlowStep('complete');

      // Auto-reload after 2 seconds to activate design
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err: any) {
      console.error('[UnifiedGenerator] Save error:', err);
      setError(err.message || 'Failed to save website. Please try again.');
      setFlowStep('wizard');
    }
  };

  // STEP 1: AI PROMPT INPUT
  if (flowStep === 'prompt') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-white/10">
                <Wand2 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Website Builder</h2>
                <p className="text-sm text-neutral-400">Describe your business, customize your design</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                What kind of business are you creating?
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Example: A modern coffee shop in Portland that roasts organic beans and offers pour-over brewing classes..."
                className="w-full h-32 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                style={{ color: '#FFFFFF' }}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-neutral-500">
                AI will generate content and suggest a design for you to customize
              </p>
              <button
                onClick={handleGenerateContent}
                disabled={!userPrompt.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate Website
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: GENERATING (AI PROCESSING)
  if (flowStep === 'generating') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-white/10">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Generating Your Website</h3>
              <p className="text-sm text-neutral-400">AI is creating pages, products, and content...</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500">{progress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: DESIGN WIZARD (with AI-suggested values)
  if (flowStep === 'wizard' && aiBlueprint) {
    const suggestedPalette = findClosestPalette(aiBlueprint);
    
    return (
      <DesignWizard
        storeId={storeId}
        onComplete={handleWizardComplete}
        onClose={onClose}
        initialVibe={aiBlueprint.brand.vibe}
        initialPalette={suggestedPalette}
        initialHeader={aiBlueprint.styles.headerStyle as HeaderStyleId}
        initialHero={aiBlueprint.styles.heroStyle as HeroStyleId}
        initialProductCard={aiBlueprint.styles.productCardStyle as ProductCardStyleId}
        initialFooter={aiBlueprint.styles.footerStyle as FooterStyleId}
      />
    );
  }

  // STEP 4: SAVING
  if (flowStep === 'saving') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-white/10">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Saving Your Website</h3>
              <p className="text-sm text-neutral-400">Creating pages and products...</p>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-neutral-500">{progress}% complete</p>
          </div>
        </div>
      </div>
    );
  }

  // STEP 5: COMPLETE
  if (flowStep === 'complete') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center border border-white/10">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Website Created!</h3>
              <p className="text-sm text-neutral-400">
                Your website is ready with {generatedPages.length} pages and {generatedProducts.length} products
              </p>
            </div>
            <p className="text-xs text-neutral-500">Reloading to activate your new design...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
