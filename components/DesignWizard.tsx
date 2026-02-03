import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { HEADER_OPTIONS, HEADER_COMPONENTS } from './HeaderLibrary';
import { HERO_OPTIONS, HERO_COMPONENTS } from './HeroLibrary';
import { PRODUCT_CARD_OPTIONS, PRODUCT_CARD_COMPONENTS } from './ProductCardLibrary';
import { FOOTER_OPTIONS, FOOTER_COMPONENTS } from './FooterLibrary';
import { HeaderStyleId, HeroStyleId, ProductCardStyleId, FooterStyleId } from '../types';
import { Sparkles, Palette, Layout, Layers, Package, ArrowRight, ArrowLeft, Check, X, Wand2, Loader2, AlertCircle } from 'lucide-react';
import { generateCompleteSite, SiteBlueprint } from '../ai/agents';
import { extractComponentsFromGeneration, fetchComponentLibrary } from '../lib/componentExtractor';
import { generateVibeVariants, generateColorPaletteVariants, generateComponentVariants } from '../ai/variantGenerators';

interface DesignWizardProps {
  storeId: string;
  onComplete: () => void;
  onClose: () => void;
  onRefreshData?: () => Promise<void>;
}

type WizardStep = 'prompt' | 'generating' | 'vibe' | 'colors' | 'header' | 'hero' | 'products' | 'footer' | 'review';

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

export const DesignWizard: React.FC<DesignWizardProps> = ({ 
  storeId, 
  onComplete, 
  onClose,
  onRefreshData
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('prompt');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [aiBlueprint, setAiBlueprint] = useState<SiteBlueprint | null>(null);
  const [generatedPages, setGeneratedPages] = useState<any[]>([]);
  const [generatedProducts, setGeneratedProducts] = useState<any[]>([]);
  const [aiProgress, setAiProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [selectedHeader, setSelectedHeader] = useState<HeaderStyleId>('canvas');
  const [selectedHero, setSelectedHero] = useState<HeroStyleId>('impact');
  const [selectedProductCard, setSelectedProductCard] = useState<ProductCardStyleId>('classic');
  const [selectedFooter, setSelectedFooter] = useState<FooterStyleId>('columns');
  const [isApplying, setIsApplying] = useState(false);
  const [dbComponents, setDbComponents] = useState<{header: any[], hero: any[], footer: any[], productCard: any[]}>({
    header: [],
    hero: [],
    footer: [],
    productCard: []
  });
  const [generatedVibes, setGeneratedVibes] = useState<any[]>([]);
  const [vibeLoading, setVibeLoading] = useState(false);
  const [generatedPalettes, setGeneratedPalettes] = useState<any[]>([]);
  const [paletteLoading, setPaletteLoading] = useState(false);
  const [generatedHeaders, setGeneratedHeaders] = useState<any[]>([]);
  const [headerLoading, setHeaderLoading] = useState(false);
  const [generatedHeroes, setGeneratedHeroes] = useState<any[]>([]);
  const [heroLoading, setHeroLoading] = useState(false);
  const [generatedProductCards, setGeneratedProductCards] = useState<any[]>([]);
  const [productCardLoading, setProductCardLoading] = useState(false);
  const [generatedFooters, setGeneratedFooters] = useState<any[]>([]);
  const [footerLoading, setFooterLoading] = useState(false);

  const steps: { id: WizardStep; label: string; icon: any }[] = [
    { id: 'prompt', label: 'AI Prompt', icon: Wand2 },
    { id: 'vibe', label: 'Store Vibe', icon: Sparkles },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'header', label: 'Header', icon: Layout },
    { id: 'hero', label: 'Hero', icon: Layers },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'footer', label: 'Footer', icon: Layout },
    { id: 'review', label: 'Review', icon: Check },
  ];

  const stepIndex = steps.findIndex(s => s.id === currentStep);

  // Load database components on mount AND clean up old AI-generated content
  useEffect(() => {
    const initializeWizard = async () => {
      // STEP 1: Clean slate - Delete all old AI-generated content
      console.log('[DesignWizard] Initializing clean slate...');
      try {
        const { data: existingPages } = await supabase
          .from('pages')
          .select('id')
          .eq('store_id', storeId)
          .like('id', 'ai_page_%');
        
        if (existingPages && existingPages.length > 0) {
          console.log(`[DesignWizard] Deleting ${existingPages.length} old AI pages`);
          await supabase
            .from('pages')
            .delete()
            .eq('store_id', storeId)
            .like('id', 'ai_page_%');
        }

        const { data: existingProducts } = await supabase
          .from('products')
          .select('id')
          .eq('store_id', storeId)
          .like('id', 'ai_product_%');
        
        if (existingProducts && existingProducts.length > 0) {
          console.log(`[DesignWizard] Deleting ${existingProducts.length} old AI products`);
          await supabase
            .from('products')
            .delete()
            .eq('store_id', storeId)
            .like('id', 'ai_product_%');
        }
      } catch (cleanupErr: any) {
        console.error('[DesignWizard] Cleanup error:', cleanupErr);
      }

      // STEP 2: Load database components for selection
      try {
        const [headers, heroes, footers, productCards] = await Promise.all([
          fetchComponentLibrary({ type: 'header', limit: 50 }),
          fetchComponentLibrary({ type: 'hero', limit: 50 }),
          fetchComponentLibrary({ type: 'footer', limit: 50 }),
          fetchComponentLibrary({ type: 'product-card', limit: 50 })
        ]);
        
        setDbComponents({
          header: headers,
          hero: heroes,
          footer: footers,
          productCard: productCards
        });
      } catch (error) {
        console.error('[DesignWizard] Error loading database components:', error);
      }
    };
    
    initializeWizard();
  }, [storeId]);

  // Generate AI vibes when vibe step is reached
  useEffect(() => {
    const generateVibes = async () => {
      if (currentStep === 'vibe' && generatedVibes.length === 0 && userPrompt.trim()) {
        setVibeLoading(true);
        try {
          const vibes = await generateVibeVariants(userPrompt);
          
          // Save ALL 3 to database
          for (const vibe of vibes) {
            await supabase.from('store_vibes').insert({
              vibe_id: vibe.id,
              name: vibe.name,
              description: vibe.description,
              mood: vibe.mood,
              color_direction: vibe.colorDirection,
              typography: vibe.typography,
              target_audience: vibe.targetAudience
            }).select();
          }
          
          setGeneratedVibes(vibes);
          // Auto-select first vibe
          if (vibes.length > 0) {
            setSelectedVibe(vibes[0].id);
          }
        } catch (error) {
          console.error('Vibe generation failed:', error);
          setError('Failed to generate vibes. Using default options.');
        } finally {
          setVibeLoading(false);
        }
      }
    };
    
    generateVibes();
  }, [currentStep, userPrompt, generatedVibes.length]);

  // Generate AI color palettes when color step is reached
  useEffect(() => {
    const generatePalettes = async () => {
      if (currentStep === 'colors' && generatedPalettes.length === 0 && userPrompt.trim() && selectedVibe) {
        setPaletteLoading(true);
        try {
          const selectedVibeData = generatedVibes.find(v => v.id === selectedVibe);
          const palettes = await generateColorPaletteVariants(userPrompt, selectedVibeData);
          
          // Save ALL 3 to database
          for (const palette of palettes) {
            await supabase.from('color_palettes').insert({
              palette_id: palette.id,
              name: palette.name,
              vibe_id: selectedVibe,
              primary_color: palette.primary,
              secondary_color: palette.secondary,
              background_color: palette.background,
              mood: palette.mood
            }).select();
          }
          
          setGeneratedPalettes(palettes);
          // Auto-select first palette
          if (palettes.length > 0) {
            setSelectedPalette({
              id: palettes[0].id,
              name: palettes[0].name,
              primary: palettes[0].primary,
              secondary: palettes[0].secondary,
              background: palettes[0].background,
              vibe: selectedVibe
            });
          }
        } catch (error) {
          console.error('Palette generation failed:', error);
          setError('Failed to generate palettes. Using default options.');
        } finally {
          setPaletteLoading(false);
        }
      }
    };
    
    generatePalettes();
  }, [currentStep, userPrompt, selectedVibe, generatedPalettes.length, generatedVibes]);

  // Generate AI header variants when header step is reached
  useEffect(() => {
    const generateHeaders = async () => {
      if (currentStep === 'header' && generatedHeaders.length === 0 && userPrompt.trim() && selectedVibe && selectedPalette) {
        setHeaderLoading(true);
        try {
          const selectedVibeData = generatedVibes.find(v => v.id === selectedVibe);
          const headers = await generateComponentVariants('header', userPrompt, selectedVibeData, selectedPalette);
          
          // Save ALL 3 to component library
          for (const header of headers) {
            await supabase.from('component_library').insert({
              type: 'header',
              variant_id: header.variantId,
              name: header.variantName,
              data: header.data,
              metadata: {
                layout: header.layout,
                style: header.style,
                vibe_id: selectedVibe,
                palette_id: selectedPalette.id,
                generated_from_prompt: userPrompt
              }
            }).select();
          }
          
          setGeneratedHeaders(headers);
        } catch (error) {
          console.error('Header generation failed:', error);
          setError('Failed to generate headers. Using default options.');
        } finally {
          setHeaderLoading(false);
        }
      }
    };
    
    generateHeaders();
  }, [currentStep, userPrompt, selectedVibe, selectedPalette, generatedHeaders.length, generatedVibes]);

  // Generate AI hero variants when hero step is reached
  useEffect(() => {
    const generateHeroes = async () => {
      if (currentStep === 'hero' && generatedHeroes.length === 0 && userPrompt.trim() && selectedVibe && selectedPalette) {
        setHeroLoading(true);
        try {
          const selectedVibeData = generatedVibes.find(v => v.id === selectedVibe);
          const heroes = await generateComponentVariants('hero', userPrompt, selectedVibeData, selectedPalette);
          
          // Save ALL 3 to component library
          for (const hero of heroes) {
            await supabase.from('component_library').insert({
              type: 'hero',
              variant_id: hero.variantId,
              name: hero.variantName,
              data: hero.data,
              metadata: {
                layout: hero.layout,
                style: hero.style,
                vibe_id: selectedVibe,
                palette_id: selectedPalette.id,
                generated_from_prompt: userPrompt
              }
            }).select();
          }
          
          setGeneratedHeroes(heroes);
        } catch (error) {
          console.error('Hero generation failed:', error);
          setError('Failed to generate heroes. Using default options.');
        } finally {
          setHeroLoading(false);
        }
      }
    };
    
    generateHeroes();
  }, [currentStep, userPrompt, selectedVibe, selectedPalette, generatedHeroes.length, generatedVibes]);

  // Generate AI product card variants when products step is reached
  useEffect(() => {
    const generateProductCards = async () => {
      if (currentStep === 'products' && generatedProductCards.length === 0 && userPrompt.trim() && selectedVibe && selectedPalette) {
        setProductCardLoading(true);
        try {
          const selectedVibeData = generatedVibes.find(v => v.id === selectedVibe);
          const productCards = await generateComponentVariants('product-card', userPrompt, selectedVibeData, selectedPalette);
          
          // Save ALL 3 to component library
          for (const card of productCards) {
            await supabase.from('component_library').insert({
              type: 'product-card',
              variant_id: card.variantId,
              name: card.variantName,
              data: card.data,
              metadata: {
                layout: card.layout,
                style: card.style,
                vibe_id: selectedVibe,
                palette_id: selectedPalette.id,
                generated_from_prompt: userPrompt
              }
            }).select();
          }
          
          setGeneratedProductCards(productCards);
        } catch (error) {
          console.error('Product card generation failed:', error);
          setError('Failed to generate product cards. Using default options.');
        } finally {
          setProductCardLoading(false);
        }
      }
    };
    
    generateProductCards();
  }, [currentStep, userPrompt, selectedVibe, selectedPalette, generatedProductCards.length, generatedVibes]);

  // Generate AI footer variants when footer step is reached
  useEffect(() => {
    const generateFooters = async () => {
      if (currentStep === 'footer' && generatedFooters.length === 0 && userPrompt.trim() && selectedVibe && selectedPalette) {
        setFooterLoading(true);
        try {
          const selectedVibeData = generatedVibes.find(v => v.id === selectedVibe);
          const footers = await generateComponentVariants('footer', userPrompt, selectedVibeData, selectedPalette);
          
          // Save ALL 3 to component library
          for (const footer of footers) {
            await supabase.from('component_library').insert({
              type: 'footer',
              variant_id: footer.variantId,
              name: footer.variantName,
              data: footer.data,
              metadata: {
                layout: footer.layout,
                style: footer.style,
                vibe_id: selectedVibe,
                palette_id: selectedPalette.id,
                generated_from_prompt: userPrompt
              }
            }).select();
          }
          
          setGeneratedFooters(footers);
        } catch (error) {
          console.error('Footer generation failed:', error);
          setError('Failed to generate footers. Using default options.');
        } finally {
          setFooterLoading(false);
        }
      }
    };
    
    generateFooters();
  }, [currentStep, userPrompt, selectedVibe, selectedPalette, generatedFooters.length, generatedVibes]);

  const handleNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleApply = async () => {
    if (!selectedPalette) return;
    
    setIsApplying(true);
    
    try {
      // Create new design in store_designs table
      const { data: designData, error: designError } = await supabase
        .from('store_designs')
        .insert({
          store_id: storeId,
          name: aiBlueprint ? `AI Generated - ${aiBlueprint.brand.name}` : `Wizard Design - ${selectedPalette.name}`,
          is_active: true,
          header_style: selectedHeader,
          hero_style: selectedHero,
          product_card_style: selectedProductCard,
          footer_style: selectedFooter,
          primary_color: selectedPalette.primary,
          secondary_color: selectedPalette.secondary,
          background_color: selectedPalette.background,
          store_vibe: selectedVibe,
          typography: {
            headingFont: aiBlueprint?.design.headingFont || 'Inter',
            bodyFont: aiBlueprint?.design.bodyFont || 'Inter',
            headingColor: '#000000',
            bodyColor: '#737373',
            linkColor: selectedPalette.primary,
            baseFontSize: '16px',
            headingScale: 'default',
            headingWeight: '700',
            bodyWeight: '400'
          }
        })
        .select()
        .single();

      if (designError) throw designError;

      // Deactivate other designs for this store
      if (designData) {
        await supabase
          .from('store_designs')
          .update({ is_active: false })
          .eq('store_id', storeId)
          .neq('id', designData.id);
      }

      // If AI generated content, save pages and products
      if (aiBlueprint && generatedPages.length > 0) {
        console.log('[DesignWizard] Saving AI-generated content...');
        
        // Insert NEW pages (cleanup already done during generation)
        for (let i = 0; i < generatedPages.length; i++) {
          const page = generatedPages[i];
          await supabase.from('pages').insert({
            id: `ai_page_${Date.now()}_${i}`,
            store_id: storeId,
            title: page.name,
            slug: `${page.slug}-${Date.now()}`,
            type: page.type,
            blocks: page.blocks
          });
        }

        // Insert NEW products (cleanup already done during generation)
        for (let i = 0; i < generatedProducts.length; i++) {
          const product = generatedProducts[i];
          await supabase.from('products').insert({
            id: `ai_product_${Date.now()}_${i}`,
            store_id: storeId,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: 100,
            category: product.category,
            images: [product.image]
          });
        }

        // Refresh data if handler provided
        if (onRefreshData) {
          await onRefreshData();
        }
      }

      // Reload to activate design
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (error) {
      console.error('Error applying design:', error);
      alert('Failed to apply design. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!userPrompt.trim()) {
      setError('Please describe your business');
      return;
    }

    setCurrentStep('generating');
    setError('');
    setAiProgress(0);

    try {
      console.log('[DesignWizard] Starting AI generation...');
      setAiProgress(10);

      const result = await generateCompleteSite(userPrompt, 3);
      
      // Validate result structure
      if (!result || !result.blueprint || !result.pages || !Array.isArray(result.pages)) {
        throw new Error('Invalid AI generation result structure');
      }
      
      console.log('[DesignWizard] AI generation complete:', result.blueprint.brand.name);
      setAiProgress(100);
      
      setAiBlueprint(result.blueprint);
      setGeneratedPages(result.pages);
      setGeneratedProducts(result.products || []);

      // Extract unique components to library (runs in background)
      console.log('[DesignWizard] Extracting components to library...');
      extractComponentsFromGeneration(result.pages, storeId, {
        similarityThreshold: 0.85,
        skipExisting: true
      }).then(extractResult => {
        console.log('[DesignWizard] Component extraction complete:', {
          extracted: extractResult.extracted,
          skipped: extractResult.skipped,
          errors: extractResult.errors
        });
      }).catch(err => {
        console.error('[DesignWizard] Component extraction error:', err);
      });

      // Auto-select design based on AI suggestions
      const vibe = result.blueprint?.brand?.vibe?.toLowerCase() || 'modern';
      setSelectedVibe(vibe);
      
      // Find closest color palette
      const closestPalette = findClosestPalette(result.blueprint);
      setSelectedPalette(closestPalette);
      
      // Set component styles from AI (with fallbacks)
      if (result.blueprint?.styles) {
        setSelectedHeader((result.blueprint.styles.headerStyle as HeaderStyleId) || 'modern');
        setSelectedHero((result.blueprint.styles.heroStyle as HeroStyleId) || 'minimal');
        setSelectedProductCard((result.blueprint.styles.productCardStyle as ProductCardStyleId) || 'modern');
        setSelectedFooter((result.blueprint.styles.footerStyle as FooterStyleId) || 'modern');
      }


      // Brief delay to show completion
      setTimeout(() => {
        setCurrentStep('vibe');
      }, 800);

    } catch (err: any) {
      console.error('[DesignWizard] AI generation error:', err);
      setError(err.message || 'Failed to generate website. Please try again.');
      setCurrentStep('prompt');
      setAiProgress(0);
    }
  };

  // Helper function to find closest color palette
  const findClosestPalette = (blueprint: SiteBlueprint): ColorPalette => {
    const vibe = blueprint.brand.vibe.toLowerCase();
    const vibeMatches = COLOR_PALETTES.filter(p => p.vibe === vibe);
    
    if (vibeMatches.length > 0) {
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
    
    // Fallback to first matching vibe
    return COLOR_PALETTES.find(p => p.vibe === vibe) || COLOR_PALETTES[0];
  };

  const colorDistance = (hex1: string, hex2: string): number => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return Infinity;
    
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const filteredPalettes = generatedPalettes.length > 0 
    ? generatedPalettes 
    : (selectedVibe 
        ? COLOR_PALETTES.filter(p => p.vibe === selectedVibe)
        : COLOR_PALETTES);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-b border-purple-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                AI Website Builder
              </h2>
              <p className="text-neutral-300 mt-1">Create your complete website with AI-powered content and custom design</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center gap-2">
            {steps.filter(s => s.id !== 'generating').map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const stepIdx = steps.filter(s => s.id !== 'generating').indexOf(step);
              const currentIdx = steps.filter(s => s.id !== 'generating').findIndex(s => s.id === currentStep);
              const isCompleted = stepIdx < currentIdx;
              
              return (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-purple-500/20 border border-purple-500/30' :
                    isCompleted ? 'bg-green-500/10 border border-green-500/20' :
                    'bg-white/5 border border-white/5'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isActive ? 'text-purple-400' :
                      isCompleted ? 'text-green-400' :
                      'text-neutral-500'
                    }`} />
                    <span className={`text-sm font-medium hidden md:inline ${
                      isActive ? 'text-white' :
                      isCompleted ? 'text-green-400' :
                      'text-neutral-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {stepIdx < steps.filter(s => s.id !== 'generating').length - 1 && (
                    <div className={`h-px flex-1 ${
                      isCompleted ? 'bg-green-500/30' : 'bg-white/10'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 0: AI Prompt */}
          {currentStep === 'prompt' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-white/10">
                  <Wand2 className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Describe Your Business</h3>
                <p className="text-neutral-400">Our AI will generate content and suggest a perfect design for you to customize</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  What kind of business are you creating?
                </label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Example: A modern coffee shop in Portland that roasts organic beans and offers pour-over brewing classes. We focus on sustainability and creating a cozy community space..."
                  className="w-full h-40 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  style={{ color: '#FFFFFF' }}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <p className="text-xs text-neutral-500">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  AI will create 3 pages and 4 products (~30 seconds)
                </p>
                <button
                  onClick={handleGenerateAI}
                  disabled={!userPrompt.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Generate with AI
                </button>
              </div>
            </div>
          )}

          {/* Generating Step */}
          {currentStep === 'generating' && (
            <div className="space-y-6 max-w-md mx-auto text-center py-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-white/10">
                <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Creating Your Website</h3>
                <p className="text-sm text-neutral-400">AI is generating pages, products, and design suggestions...</p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                  style={{ width: `${aiProgress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500">{aiProgress}% complete</p>
            </div>
          )}

          {/* Step 1: Vibe Selection */}
          {currentStep === 'vibe' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Store Vibe</h3>
                <p className="text-neutral-400">
                  {vibeLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      AI is generating 3 unique vibe options for your business...
                    </span>
                  ) : generatedVibes.length > 0 ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI generated 3 unique vibes - select your favorite
                    </span>
                  ) : (
                    'Select the overall personality and aesthetic for your store'
                  )}
                </p>
              </div>

              {vibeLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : generatedVibes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generatedVibes.map(vibe => (
                    <button
                      key={vibe.id}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        selectedVibe === vibe.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <h4 className={`text-lg font-bold mb-2 ${
                        selectedVibe === vibe.id ? 'text-purple-400' : 'text-white'
                      }`}>
                        {vibe.name}
                      </h4>
                      <p className="text-neutral-400 text-sm mb-3">{vibe.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs text-neutral-500">
                          <span className="text-neutral-400 font-medium">Mood:</span> {vibe.mood.join(', ')}
                        </p>
                        <p className="text-xs text-neutral-500">
                          <span className="text-neutral-400 font-medium">Colors:</span> {vibe.colorDirection}
                        </p>
                        <p className="text-xs text-neutral-500">
                          <span className="text-neutral-400 font-medium">Typography:</span> {vibe.typography}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'modern', name: 'Modern', desc: 'Clean, contemporary, and tech-forward', color: 'blue' },
                    { id: 'classic', name: 'Classic', desc: 'Timeless, elegant, and sophisticated', color: 'amber' },
                    { id: 'bold', name: 'Bold', desc: 'Energetic, vibrant, and attention-grabbing', color: 'pink' },
                    { id: 'minimal', name: 'Minimal', desc: 'Simple, clean, and focused', color: 'slate' },
                  ].map(vibe => (
                    <button
                      key={vibe.id}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        selectedVibe === vibe.id
                          ? `border-${vibe.color}-500 bg-${vibe.color}-500/10`
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <h4 className={`text-lg font-bold mb-2 ${
                        selectedVibe === vibe.id ? `text-${vibe.color}-400` : 'text-white'
                      }`}>
                        {vibe.name}
                      </h4>
                      <p className="text-neutral-400 text-sm">{vibe.desc}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Color Palette */}
          {currentStep === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Color Palette</h3>
                <p className="text-neutral-400">
                  {paletteLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      AI is generating 3 color palettes for {generatedVibes.find(v => v.id === selectedVibe)?.name || 'your'} vibe...
                    </span>
                  ) : generatedPalettes.length > 0 ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI generated 3 color palettes - select your favorite
                    </span>
                  ) : (
                    selectedVibe && selectedVibe.length > 0 ? `${selectedVibe.charAt(0).toUpperCase() + selectedVibe.slice(1)} palettes` : 'All available color schemes'
                  )}
                </p>
              </div>

              {paletteLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredPalettes.map(palette => (
                    <button
                      key={palette.id}
                      onClick={() => generatedPalettes.length > 0 ? setSelectedPalette({
                        id: palette.id,
                        name: palette.name,
                        primary: palette.primary,
                        secondary: palette.secondary,
                        background: palette.background,
                        vibe: selectedVibe
                      }) : setSelectedPalette(palette)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedPalette?.id === palette.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex gap-2 mb-3">
                        <div 
                          className="w-12 h-12 rounded-lg"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <div 
                          className="w-12 h-12 rounded-lg"
                          style={{ backgroundColor: palette.secondary }}
                        />
                        <div 
                          className="w-12 h-12 rounded-lg border border-white/20"
                          style={{ backgroundColor: palette.background }}
                        />
                      </div>
                      <h4 className="text-white font-bold">{palette.name}</h4>
                      {generatedPalettes.length > 0 ? (
                        <p className="text-neutral-400 text-xs mt-1">{palette.mood}</p>
                      ) : (
                        <p className="text-neutral-400 text-xs mt-1 capitalize">{palette.vibe}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Header Selection */}
          {currentStep === 'header' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Header Style</h3>
                <p className="text-neutral-400">
                  {headerLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      AI is generating 3 unique header variants...
                    </span>
                  ) : generatedHeaders.length > 0 ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI generated 3 headers - select your favorite
                    </span>
                  ) : (
                    `Select the navigation style for your store ${dbComponents.header.length > 0 ? `(${HEADER_OPTIONS.length + dbComponents.header.length} options)` : ''}`
                  )}
                </p>
              </div>

              {headerLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI Generated Headers - Priority Display */}
                  {generatedHeaders.map((header) => (
                    <button
                      key={header.variantId}
                      onClick={() => setSelectedHeader(header.variantId)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedHeader === header.variantId
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <div className="text-white/40 text-sm">AI Generated Preview</div>
                      </div>
                      <h4 className="text-white font-bold">{header.variantName}</h4>
                      <p className="text-neutral-400 text-sm mt-1 capitalize">{header.layout} layout</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-purple-400">AI Generated ✨</span>
                      </div>
                    </button>
                  ))}
                  
                  {/* Platform Default Headers */}
                  {HEADER_OPTIONS.map(option => {
                    const HeaderComponent = HEADER_COMPONENTS[option.id];
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedHeader(option.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedHeader === option.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden">
                          {HeaderComponent && (
                            <div className="scale-50 origin-top-left w-[200%]">
                              <HeaderComponent
                                logo="Your Store"
                                links={[
                                  { label: 'Shop', href: '/shop' },
                                  { label: 'About', href: '/about' },
                                ]}
                                primaryColor={selectedPalette?.primary || '#3B82F6'}
                                secondaryColor={selectedPalette?.secondary || '#8B5CF6'}
                                backgroundColor={selectedPalette?.background || '#FFFFFF'}
                              />
                            </div>
                          )}
                        </div>
                        <h4 className="text-white font-bold">{option.name}</h4>
                        {option.description && (
                          <p className="text-neutral-400 text-sm mt-1">{option.description}</p>
                        )}
                        <div className="mt-2 text-xs text-purple-400">Platform Default</div>
                      </button>
                    );
                  })}
                  
                  {/* Database Components from Previous AI Generations */}
                  {dbComponents.header.map((component: any) => (
                    <button
                      key={component.id}
                      onClick={() => setSelectedHeader(component.variant_id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedHeader === component.variant_id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <div className="text-white/40 text-sm">Preview</div>
                      </div>
                      <h4 className="text-white font-bold">{component.name}</h4>
                      {component.metadata?.description && (
                        <p className="text-neutral-400 text-sm mt-1">{component.metadata.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-green-400">From Library ✨</span>
                        <span className="text-xs text-neutral-500">Used {component.metadata?.usage_count || 0}×</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Hero Selection */}
          {currentStep === 'hero' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Hero Style</h3>
                <p className="text-neutral-400">
                  {heroLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      AI is generating 3 unique hero variants...
                    </span>
                  ) : generatedHeroes.length > 0 ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI generated 3 heroes - select your favorite
                    </span>
                  ) : (
                    'Select the main banner style for your homepage'
                  )}
                </p>
              </div>

              {heroLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* AI Generated Heroes - Priority Display */}
                  {generatedHeroes.map((hero) => (
                    <button
                      key={hero.variantId}
                      onClick={() => setSelectedHero(hero.variantId)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedHero === hero.variantId
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <div className="text-white/40 text-sm">AI Generated Preview</div>
                      </div>
                      <h4 className="text-white font-bold">{hero.variantName}</h4>
                      <p className="text-neutral-400 text-sm mt-1 capitalize">{hero.layout} layout</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-purple-400">AI Generated ✨</span>
                      </div>
                    </button>
                  ))}
                  
                  {/* Platform Default Heroes */}
                  {HERO_OPTIONS.slice(0, 8).map(option => {
                    const HeroComponent = HERO_COMPONENTS[option.id];
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedHero(option.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedHero === option.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden">
                          {HeroComponent && (
                            <div className="scale-[0.25] origin-top-left w-[400%]">
                              <HeroComponent
                                heading="Welcome to Your Store"
                                subheading="Discover amazing products"
                                buttonText="Shop Now"
                                primaryColor={selectedPalette?.primary || '#3B82F6'}
                                secondaryColor={selectedPalette?.secondary || '#8B5CF6'}
                              />
                            </div>
                          )}
                        </div>
                        <h4 className="text-white font-bold">{option.name}</h4>
                      </button>
                    );
                  })}
                  
                  {/* Database Components from Previous AI Generations */}
                  {dbComponents.hero.map((component: any) => (
                    <button
                      key={component.id}
                      onClick={() => setSelectedHero(component.variant_id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedHero === component.variant_id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <div className="text-white/40 text-sm">Preview</div>
                      </div>
                      <h4 className="text-white font-bold">{component.name}</h4>
                      {component.metadata?.description && (
                        <p className="text-neutral-400 text-sm mt-1">{component.metadata.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-green-400">From Library ✨</span>
                        <span className="text-xs text-neutral-500">Used {component.metadata?.usage_count || 0}×</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Product Card Selection */}
          {currentStep === 'products' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Product Card Style</h3>
                <p className="text-neutral-400">
                  {productCardLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      AI is generating 3 unique product card variants...
                    </span>
                  ) : generatedProductCards.length > 0 ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI generated 3 product cards - select your favorite
                    </span>
                  ) : (
                    'Select how products will be displayed'
                  )}
                </p>
              </div>

              {productCardLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* AI Generated Product Cards - Priority Display */}
                  {generatedProductCards.map((card) => (
                    <button
                      key={card.variantId}
                      onClick={() => setSelectedProductCard(card.variantId)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedProductCard === card.variantId
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-neutral-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <div className="text-white/40 text-sm">AI Generated Preview</div>
                      </div>
                      <h4 className="text-white font-bold">{card.variantName}</h4>
                      <p className="text-neutral-400 text-sm mt-1 capitalize">{card.layout} layout</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-purple-400">AI Generated ✨</span>
                      </div>
                    </button>
                  ))}
                  
                  {/* Platform Default Product Cards */}
                  {PRODUCT_CARD_OPTIONS.map(option => {
                    const CardComponent = PRODUCT_CARD_COMPONENTS[option.id];
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedProductCard(option.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedProductCard === option.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="aspect-[3/4] bg-neutral-900 rounded-lg mb-3 overflow-hidden">
                          {CardComponent && (
                            <div className="scale-75 origin-top">
                              <CardComponent
                                product={{
                                  id: 'preview',
                                  name: 'Sample Product',
                                  price: 2999,
                                  images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30'],
                                  category: 'Preview',
                                  description: 'Preview item',
                                  stock: 10,
                                  store_id: storeId
                                }}
                                primaryColor={selectedPalette?.primary || '#3B82F6'}
                                onAddToCart={() => {}}
                              />
                            </div>
                          )}
                        </div>
                        <h4 className="text-white font-bold">{option.name}</h4>
                      </button>
                    );
                  })}
                  
                  {/* Database Components from Previous AI Generations */}
                  {dbComponents.productCard.map((component: any) => (
                    <button
                      key={component.id}
                      onClick={() => setSelectedProductCard(component.variant_id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedProductCard === component.variant_id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-neutral-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <div className="text-white/40 text-sm">Preview</div>
                      </div>
                      <h4 className="text-white font-bold">{component.name}</h4>
                      {component.metadata?.description && (
                        <p className="text-neutral-400 text-sm mt-1">{component.metadata.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-green-400">From Library ✨</span>
                        <span className="text-xs text-neutral-500">Used {component.metadata?.usage_count || 0}×</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 6: Footer Selection */}
          {currentStep === 'footer' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Footer Style</h3>
                <p className="text-neutral-400">
                  {footerLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                      AI is generating 3 unique footer variants...
                    </span>
                  ) : generatedFooters.length > 0 ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI generated 3 footers - select your favorite
                    </span>
                  ) : (
                    'Select the bottom section style'
                  )}
                </p>
              </div>

              {footerLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* AI Generated Footers - Priority Display */}
                  {generatedFooters.map((footer) => (
                    <button
                      key={footer.variantId}
                      onClick={() => setSelectedFooter(footer.variantId)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedFooter === footer.variantId
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <div className="text-white/40 text-sm">AI Generated Preview</div>
                      </div>
                      <h4 className="text-white font-bold">{footer.variantName}</h4>
                      <p className="text-neutral-400 text-sm mt-1 capitalize">{footer.layout} layout</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-purple-400">AI Generated ✨</span>
                      </div>
                    </button>
                  ))}
                  
                  {/* Platform Default Footers */}
                  {FOOTER_OPTIONS.slice(0, 8).map(option => {
                    const FooterComponent = FOOTER_COMPONENTS[option.id];
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => setSelectedFooter(option.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedFooter === option.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden">
                          {FooterComponent && (
                            <div className="scale-[0.3] origin-top-left w-[333%]">
                              <FooterComponent
                                logo="Your Store"
                                primaryColor={selectedPalette?.primary || '#3B82F6'}
                                secondaryColor={selectedPalette?.secondary || '#8B5CF6'}
                              />
                            </div>
                          )}
                        </div>
                        <h4 className="text-white font-bold">{option.name}</h4>
                      </button>
                    );
                  })}
                  
                  {/* Database Components from Previous AI Generations */}
                  {dbComponents.footer.map((component: any) => (
                    <button
                      key={component.id}
                      onClick={() => setSelectedFooter(component.variant_id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedFooter === component.variant_id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="aspect-video bg-neutral-900 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                        <div className="text-white/40 text-sm">Preview</div>
                      </div>
                      <h4 className="text-white font-bold">{component.name}</h4>
                      {component.metadata?.description && (
                        <p className="text-neutral-400 text-sm mt-1">{component.metadata.description}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-green-400">From Library ✨</span>
                        <span className="text-xs text-neutral-500">Used {component.metadata?.usage_count || 0}×</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 7: Review */}
          {currentStep === 'review' && selectedPalette && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Review Your Design</h3>
                <p className="text-neutral-400">Make sure everything looks perfect before applying</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-bold mb-4">Design Summary</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-neutral-400 text-sm">Vibe</p>
                      <p className="text-white font-medium capitalize">{selectedVibe}</p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-400 text-sm">Color Palette</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-1">
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedPalette.primary }} />
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedPalette.secondary }} />
                          <div className="w-6 h-6 rounded border border-white/20" style={{ backgroundColor: selectedPalette.background }} />
                        </div>
                        <p className="text-white font-medium">{selectedPalette.name}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-neutral-400 text-sm">Header</p>
                      <p className="text-white font-medium">
                        {HEADER_OPTIONS.find(h => h.id === selectedHeader)?.name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-400 text-sm">Hero</p>
                      <p className="text-white font-medium">
                        {HERO_OPTIONS.find(h => h.id === selectedHero)?.name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-400 text-sm">Product Cards</p>
                      <p className="text-white font-medium">
                        {PRODUCT_CARD_OPTIONS.find(p => p.id === selectedProductCard)?.name}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-neutral-400 text-sm">Footer</p>
                      <p className="text-white font-medium">
                        {FOOTER_OPTIONS.find(f => f.id === selectedFooter)?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-bold mb-4">What Happens Next?</h4>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5" />
                      <p className="text-neutral-300">
                        New design will be created and saved to your Design Library
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5" />
                      <p className="text-neutral-300">
                        Design will be automatically activated on your live store
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5" />
                      <p className="text-neutral-300">
                        You can customize colors and settings later in the Designer
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-400 mt-0.5" />
                      <p className="text-neutral-300">
                        Previous designs will be deactivated but saved
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white/5 border-t border-white/10 p-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 'prompt' || currentStep === 'generating'}
            className="px-4 py-2 border border-white/20 hover:bg-white/5 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-neutral-400 text-sm">
            {currentStep === 'generating' ? (
              'Generating...'
            ) : currentStep === 'prompt' ? (
              'Describe your business'
            ) : (
              `Step ${steps.filter(s => s.id !== 'generating').findIndex(s => s.id === currentStep) + 1} of ${steps.filter(s => s.id !== 'generating').length}`
            )}
          </div>

          {currentStep === 'review' ? (
            <button
              onClick={handleApply}
              disabled={isApplying || !selectedPalette}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {aiBlueprint ? 'Creating Website...' : 'Applying...'}
                </>
              ) : (
                <>
                  {aiBlueprint ? 'Create Complete Website' : 'Apply Design'}
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          ) : currentStep === 'prompt' || currentStep === 'generating' ? (
            <div></div>
          ) : (
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 'vibe' && !selectedVibe) ||
                (currentStep === 'colors' && !selectedPalette)
              }
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
