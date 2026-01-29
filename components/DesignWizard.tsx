import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { HEADER_OPTIONS, HEADER_COMPONENTS } from './HeaderLibrary';
import { HERO_OPTIONS, HERO_COMPONENTS } from './HeroLibrary';
import { PRODUCT_CARD_OPTIONS, PRODUCT_CARD_COMPONENTS } from './ProductCardLibrary';
import { FOOTER_OPTIONS, FOOTER_COMPONENTS } from './FooterLibrary';
import { HeaderStyleId, HeroStyleId, ProductCardStyleId, FooterStyleId } from '../types';
import { Sparkles, Palette, Layout, Layers, Package, ArrowRight, ArrowLeft, Check, X } from 'lucide-react';

interface DesignWizardProps {
  storeId: string;
  onComplete: () => void;
  onClose: () => void;
}

type WizardStep = 'vibe' | 'colors' | 'header' | 'hero' | 'products' | 'footer' | 'review';

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

export const DesignWizard: React.FC<DesignWizardProps> = ({ storeId, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('vibe');
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null);
  const [selectedHeader, setSelectedHeader] = useState<HeaderStyleId>('canvas');
  const [selectedHero, setSelectedHero] = useState<HeroStyleId>('impact');
  const [selectedProductCard, setSelectedProductCard] = useState<ProductCardStyleId>('classic');
  const [selectedFooter, setSelectedFooter] = useState<FooterStyleId>('columns');
  const [isApplying, setIsApplying] = useState(false);

  const steps: { id: WizardStep; label: string; icon: any }[] = [
    { id: 'vibe', label: 'Store Vibe', icon: Sparkles },
    { id: 'colors', label: 'Colors', icon: Palette },
    { id: 'header', label: 'Header', icon: Layout },
    { id: 'hero', label: 'Hero', icon: Layers },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'footer', label: 'Footer', icon: Layout },
    { id: 'review', label: 'Review', icon: Check },
  ];

  const stepIndex = steps.findIndex(s => s.id === currentStep);

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
          name: `Wizard Design - ${selectedPalette.name}`,
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
            headingFont: 'Inter',
            bodyFont: 'Inter',
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

      onComplete();
    } catch (error) {
      console.error('Error applying design:', error);
      alert('Failed to apply design. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const filteredPalettes = selectedVibe 
    ? COLOR_PALETTES.filter(p => p.vibe === selectedVibe)
    : COLOR_PALETTES;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 border-b border-purple-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Design Wizard
              </h2>
              <p className="text-neutral-300 mt-1">Create your perfect store design in 7 easy steps</p>
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
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === stepIndex;
              const isCompleted = idx < stepIndex;
              
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
                  {idx < steps.length - 1 && (
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
          {/* Step 1: Vibe Selection */}
          {currentStep === 'vibe' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Store Vibe</h3>
                <p className="text-neutral-400">Select the overall personality and aesthetic for your store</p>
              </div>

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
            </div>
          )}

          {/* Step 2: Color Palette */}
          {currentStep === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Color Palette</h3>
                <p className="text-neutral-400">
                  {selectedVibe ? `${selectedVibe.charAt(0).toUpperCase() + selectedVibe.slice(1)} palettes` : 'All available color schemes'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredPalettes.map(palette => (
                  <button
                    key={palette.id}
                    onClick={() => setSelectedPalette(palette)}
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
                    <p className="text-neutral-400 text-xs mt-1 capitalize">{palette.vibe}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Header Selection */}
          {currentStep === 'header' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Header Style</h3>
                <p className="text-neutral-400">Select the navigation style for your store</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Hero Selection */}
          {currentStep === 'hero' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Hero Style</h3>
                <p className="text-neutral-400">Select the main banner style for your homepage</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
            </div>
          )}

          {/* Step 5: Product Card Selection */}
          {currentStep === 'products' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Product Card Style</h3>
                <p className="text-neutral-400">Select how products will be displayed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
            </div>
          )}

          {/* Step 6: Footer Selection */}
          {currentStep === 'footer' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Choose Your Footer Style</h3>
                <p className="text-neutral-400">Select the bottom section style</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
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
            disabled={stepIndex === 0}
            className="px-4 py-2 border border-white/20 hover:bg-white/5 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-neutral-400 text-sm">
            Step {stepIndex + 1} of {steps.length}
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
                  Applying...
                </>
              ) : (
                <>
                  Apply Design
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
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
