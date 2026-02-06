import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import AIHeroPreview from './AIHeroPreview';
import { HeroData } from './AiHeroLibrary';
import { generateHeroDesigns } from '../ai/heroGenerator';

interface HeroDesignerModalProps {
  onClose: () => void;
  onSelect: (heroData: HeroData) => void;
}

interface GeneratedHero {
  id: string;
  name: string;
  description: string;
  layout?: HeroData['variant'];
  data: HeroData;
  exclusivePrice?: number;
}

export interface DesignRequirements {
  industry: string;
  style: string;
  features: string[];
  colorMood: string;
  additionalContext: string;
}

export const HeroDesignerModal: React.FC<HeroDesignerModalProps> = ({ 
  onClose, 
  onSelect
}) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHeroes, setGeneratedHeroes] = useState<GeneratedHero[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requirements, setRequirements] = useState<DesignRequirements>({
    industry: '',
    style: '',
    features: [],
    colorMood: '',
    additionalContext: '',
  });

  const updateRequirement = (field: keyof DesignRequirements, value: any) => {
    setRequirements(prev => ({ ...prev, [field]: value }));
  };

  const toggleFeature = (feature: string) => {
    setRequirements(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1: return requirements.industry !== '';
      case 2: return requirements.style !== '';
      case 3: return true; // Features optional
      case 4: return requirements.colorMood !== '';
      case 5: return true; // Additional context optional
      default: return false;
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Call Gemini API to generate real hero designs
      const heroes = await generateHeroDesigns(requirements);
      setGeneratedHeroes(heroes);
      setShowPreview(true);
    } catch (err) {
      console.error('Failed to generate heroes:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to generate heroes. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleHeroSelect = (hero: GeneratedHero, makeExclusive: boolean) => {
    // TODO: Handle makeExclusive (save to database with exclusive flag)
    onSelect({ ...hero.data, variant: hero.data.variant || hero.layout || 'centered' });
    onClose();
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setGeneratedHeroes([]);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Design Your Hero</h2>
                <p className="text-sm text-neutral-400 mt-1">AI will generate 3 unique hero sections</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              disabled={isGenerating}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: Industry */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What's your industry?</h3>
                <p className="text-sm text-neutral-400">This helps us design the perfect hero for your niche</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { value: 'ecommerce', label: '🛍️ E-commerce / Retail' },
                  { value: 'saas', label: '💻 SaaS / Software' },
                  { value: 'agency', label: '🎨 Agency / Creative' },
                  { value: 'restaurant', label: '🍴 Restaurant / Food' },
                  { value: 'fitness', label: '💪 Fitness / Health' },
                  { value: 'realestate', label: '🏠 Real Estate' },
                  { value: 'education', label: '📚 Education / Courses' },
                  { value: 'finance', label: '💰 Finance / Consulting' },
                  { value: 'travel', label: '✈️ Travel / Tourism' },
                  { value: 'entertainment', label: '🎬 Entertainment / Media' },
                  { value: 'nonprofit', label: '❤️ Non-Profit / Charity' },
                  { value: 'other', label: '✨ Other' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => updateRequirement('industry', value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      requirements.industry === value
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Style */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What's your style preference?</h3>
                <p className="text-sm text-neutral-400">Choose the aesthetic that matches your brand</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { value: 'modern', label: 'Modern', desc: 'Clean lines, minimalist' },
                  { value: 'bold', label: 'Bold', desc: 'Large text, high contrast' },
                  { value: 'elegant', label: 'Elegant', desc: 'Sophisticated, refined' },
                  { value: 'playful', label: 'Playful', desc: 'Fun, energetic' },
                  { value: 'minimal', label: 'Minimal', desc: 'Less is more' },
                  { value: 'luxurious', label: 'Luxurious', desc: 'Premium, high-end' },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => updateRequirement('style', value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      requirements.style === value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800'
                    }`}
                  >
                    <div className={`font-semibold ${requirements.style === value ? 'text-white' : 'text-neutral-200'}`}>
                      {label}
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Special features? (optional)</h3>
                <p className="text-sm text-neutral-400">Select any advanced features you'd like</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { value: 'video', label: '🎥 Video Background' },
                  { value: 'animation', label: '✨ Animations' },
                  { value: 'particles', label: '🎆 Particle Effects' },
                  { value: '3d', label: '🎮 3D Elements' },
                  { value: 'parallax', label: '🌊 Parallax Scrolling' },
                  { value: 'carousel', label: '🎠 Image Carousel' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => toggleFeature(value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      requirements.features.includes(value)
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-neutral-700 hover:border-neutral-600 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Color Mood */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">What's your color mood?</h3>
                <p className="text-sm text-neutral-400">Choose a color palette direction</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  { value: 'vibrant', label: 'Vibrant', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D'] },
                  { value: 'neutral', label: 'Neutral', colors: ['#E8E8E8', '#A0A0A0', '#606060'] },
                  { value: 'dark', label: 'Dark', colors: ['#1A1A1A', '#333333', '#4A4A4A'] },
                  { value: 'pastel', label: 'Pastel', colors: ['#FFD1DC', '#B4E7CE', '#C7CEEA'] },
                  { value: 'earth', label: 'Earth Tones', colors: ['#8B7355', '#A0826D', '#C9B8A8'] },
                  { value: 'neon', label: 'Neon', colors: ['#00FF00', '#FF00FF', '#00FFFF'] },
                ].map(({ value, label, colors }) => (
                  <button
                    key={value}
                    onClick={() => updateRequirement('colorMood', value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      requirements.colorMood === value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-800'
                    }`}
                  >
                    <div className={`font-semibold mb-2 ${requirements.colorMood === value ? 'text-white' : 'text-neutral-200'}`}>
                      {label}
                    </div>
                    <div className="flex gap-2">
                      {colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-lg border border-neutral-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Additional Context */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Any additional details?</h3>
                <p className="text-sm text-neutral-400">Tell us more about your vision (optional)</p>
              </div>
              <textarea
                value={requirements.additionalContext}
                onChange={(e) => updateRequirement('additionalContext', e.target.value)}
                placeholder="Example: I want a hero that showcases luxury watches with elegant animations and a dark, premium feel. Include a countdown timer for a flash sale."
                className="w-full h-40 bg-neutral-800 border border-neutral-600 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-purple-500 outline-none resize-none"
              />
              
              {/* Summary */}
              <div className="mt-6 p-4 bg-neutral-800/50 rounded-xl border border-neutral-700">
                <div className="text-xs text-neutral-400 uppercase font-semibold mb-3">Your Requirements:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">Industry:</span>
                    <span className="text-white font-medium capitalize">{requirements.industry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">Style:</span>
                    <span className="text-white font-medium capitalize">{requirements.style}</span>
                  </div>
                  {requirements.features.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-500">Features:</span>
                      <span className="text-white font-medium capitalize">{requirements.features.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">Colors:</span>
                    <span className="text-white font-medium capitalize">{requirements.colorMood}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-medium">Generation Failed</p>
              <p className="text-red-300 text-xs mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-red-500/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || isGenerating}
            className="px-4 py-2 text-neutral-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed() || isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate 3 Heroes
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* AI Hero Preview */}
      {showPreview && (
        <AIHeroPreview
          heroes={generatedHeroes}
          onSelect={handleHeroSelect}
          onClose={handleClosePreview}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};
