import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Sparkles, ArrowRight, ArrowLeft, Check, Rocket, Heart, Star, Zap, Store, ShoppingBag, Tag, Package } from 'lucide-react';

// =============================================================================
// SUPER SIMPLE WIZARD - So easy a 5 year old could do it!
// =============================================================================

// Fun encouraging messages that rotate
const ENCOURAGEMENTS = [
  "You're doing amazing! ⭐",
  "This is going to be awesome! 🚀",
  "Great choice! 🎉",
  "Love it! 💜",
  "Perfect! ✨",
  "You've got great taste! 👏",
];

// Step 1: What kind of store? (Big emoji buttons)
const STORE_TYPES = [
  { id: 'clothes', emoji: '👕', label: 'Clothes', color: '#EC4899' },
  { id: 'art', emoji: '🎨', label: 'Art', color: '#8B5CF6' },
  { id: 'food', emoji: '🍪', label: 'Food', color: '#F59E0B' },
  { id: 'toys', emoji: '🧸', label: 'Toys', color: '#10B981' },
  { id: 'jewelry', emoji: '💎', label: 'Jewelry', color: '#06B6D4' },
  { id: 'books', emoji: '📚', label: 'Books', color: '#6366F1' },
  { id: 'music', emoji: '🎵', label: 'Music', color: '#EF4444' },
  { id: 'plants', emoji: '🌱', label: 'Plants', color: '#22C55E' },
  { id: 'other', emoji: '✨', label: 'Other', color: '#A855F7' },
];

// Step 2: Pick your colors (Visual color palette)
const COLOR_PALETTES = [
  { id: 'sunset', name: 'Sunset', primary: '#F97316', secondary: '#EC4899', bg: '#FFF7ED', emoji: '🌅' },
  { id: 'ocean', name: 'Ocean', primary: '#0EA5E9', secondary: '#6366F1', bg: '#F0F9FF', emoji: '🌊' },
  { id: 'forest', name: 'Forest', primary: '#22C55E', secondary: '#14B8A6', bg: '#F0FDF4', emoji: '🌲' },
  { id: 'candy', name: 'Candy', primary: '#EC4899', secondary: '#A855F7', bg: '#FDF4FF', emoji: '🍬' },
  { id: 'midnight', name: 'Midnight', primary: '#6366F1', secondary: '#8B5CF6', bg: '#1E1B4B', emoji: '🌙' },
  { id: 'sunshine', name: 'Sunshine', primary: '#FACC15', secondary: '#F97316', bg: '#FEFCE8', emoji: '☀️' },
  { id: 'monochrome', name: 'Classic', primary: '#18181B', secondary: '#52525B', bg: '#FAFAFA', emoji: '⬛' },
  { id: 'rose', name: 'Rose', primary: '#F43F5E', secondary: '#FB7185', bg: '#FFF1F2', emoji: '🌹' },
];

// Step 3: Pick your vibe (Store style)
const STORE_VIBES = [
  { id: 'playful', emoji: '🎈', label: 'Fun & Playful', description: 'Bright, bouncy, full of energy!' },
  { id: 'minimal', emoji: '◻️', label: 'Clean & Simple', description: 'Less is more. Super clean.' },
  { id: 'bold', emoji: '🔥', label: 'Bold & Loud', description: 'Stand out from the crowd!' },
  { id: 'cozy', emoji: '☕', label: 'Warm & Cozy', description: 'Like a hug for your eyes.' },
  { id: 'luxury', emoji: '👑', label: 'Fancy & Elegant', description: 'Premium, sophisticated feel.' },
  { id: 'retro', emoji: '📼', label: 'Retro & Vintage', description: 'Old school cool vibes.' },
];

type Step = 'welcome' | 'name' | 'type' | 'colors' | 'vibe' | 'creating' | 'done';

export const SimpleWizard: React.FC = () => {
  const navigate = useNavigate();
  
  // Wizard state
  const [step, setStep] = useState<Step>('welcome');
  const [storeName, setStoreName] = useState('');
  const [storeType, setStoreType] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<string | null>(null);
  const [storeVibe, setStoreVibe] = useState<string | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [encouragement, setEncouragement] = useState(ENCOURAGEMENTS[0]);

  // Rotate encouragement messages
  useEffect(() => {
    const interval = setInterval(() => {
      setEncouragement(ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Check if user already has a store
      const { data: profile } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('id', session.user.id)
        .single();

      if (profile?.store_id) {
        navigate('/admin');
        return;
      }

      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  // Generate store slug from name
  const storeSlug = storeName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'my-store';

  // Create the store!
  const handleCreateStore = async () => {
    setStep('creating');
    setCreating(true);
    setError(null);

    try {
      // Small delay for dramatic effect 
      await new Promise(r => setTimeout(r, 1500));

      // Create the store
      const { error: tenantError } = await supabase.rpc('create_tenant', {
        store_name: storeName || 'My Store',
        store_slug: storeSlug
      });

      if (tenantError) throw tenantError;

      // Get the store ID
      const { data: { session } } = await supabase.auth.getSession();
      const { data: profile } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('id', session?.user.id)
        .single();

      const storeId = profile?.store_id;

      // Save the wizard choices to store settings
      if (storeId) {
        const selectedPalette = COLOR_PALETTES.find(p => p.id === colorPalette);
        
        await supabase
          .from('stores')
          .update({ 
            settings: { 
              store_type: storeType,
              color_palette: colorPalette,
              primary_color: selectedPalette?.primary || '#6366F1',
              secondary_color: selectedPalette?.secondary || '#8B5CF6',
              background_color: selectedPalette?.bg || '#FFFFFF',
              store_vibe: storeVibe,
              onboarding_completed: true,
              wizard_version: 'simple-v1'
            } 
          })
          .eq('id', storeId);

        // Also update store_config with all design settings
        await supabase
          .from('store_config')
          .update({
            primary_color: selectedPalette?.primary || '#6366F1',
            secondary_color: selectedPalette?.secondary || '#8B5CF6',
            background_color: selectedPalette?.bg || '#FFFFFF',
            store_type: storeType,
            store_vibe: storeVibe,
            color_palette: colorPalette,
          })
          .eq('store_id', storeId);
      }

      // Done! 
      setCreating(false);
      setStep('done');

    } catch (err: any) {
      console.error('Store creation error:', err);
      setError(err.message || 'Oops! Something went wrong. Let\'s try again.');
      setStep('vibe'); // Go back
      setCreating(false);
    }
  };

  // Navigation helpers
  const goNext = () => {
    const steps: Step[] = ['welcome', 'name', 'type', 'colors', 'vibe'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    } else {
      handleCreateStore();
    }
  };

  const goBack = () => {
    const steps: Step[] = ['welcome', 'name', 'type', 'colors', 'vibe'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  // Can we proceed?
  const canProceed = () => {
    switch (step) {
      case 'welcome': return true;
      case 'name': return storeName.trim().length >= 2;
      case 'type': return storeType !== null;
      case 'colors': return colorPalette !== null;
      case 'vibe': return storeVibe !== null;
      default: return false;
    }
  };

  // Progress calculation
  const steps: Step[] = ['welcome', 'name', 'type', 'colors', 'vibe'];
  const currentIndex = steps.indexOf(step);
  const progress = step === 'done' || step === 'creating' ? 100 : ((currentIndex) / (steps.length - 1)) * 100;

  // Get current palette for preview
  const currentPalette = COLOR_PALETTES.find(p => p.id === colorPalette);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/70 text-lg">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Fun animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Progress bar - fun rainbow style */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Encouragement bubble */}
      {step !== 'welcome' && step !== 'done' && step !== 'creating' && (
        <div className="fixed top-6 right-6 z-50 animate-bounce-slow hidden md:block">
          <div className="bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 text-sm font-medium">
            {encouragement}
          </div>
        </div>
      )}
      
      {/* Mobile mini preview - shows current choices */}
      {step !== 'welcome' && step !== 'creating' && step !== 'done' && (
        <div className="fixed top-4 left-4 right-4 z-40 lg:hidden">
          <div 
            className="flex items-center gap-3 p-3 rounded-2xl backdrop-blur-xl transition-all duration-500"
            style={{ backgroundColor: (currentPalette?.primary || '#6366f1') + '30' }}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ backgroundColor: currentPalette?.bg || '#ffffff' }}
            >
              {STORE_TYPES.find(t => t.id === storeType)?.emoji || '🏪'}
            </div>
            <div className="flex-1 min-w-0">
              <p 
                className="font-bold text-sm truncate"
                style={{ color: currentPalette?.bg || '#ffffff' }}
              >
                {storeName || 'Your Store'}
              </p>
              <div className="flex items-center gap-2">
                {colorPalette && (
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: currentPalette?.primary }} />
                    <div className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: currentPalette?.secondary }} />
                  </div>
                )}
                {storeVibe && (
                  <span className="text-xs text-white/70">
                    {STORE_VIBES.find(v => v.id === storeVibe)?.emoji}
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
              Live ✨
            </div>
          </div>
        </div>
      )}

      {/* Main content with Live Preview */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-6 pt-20 lg:pt-6">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          
          {/* Left side: Wizard steps */}
          <div className="w-full lg:w-1/2 max-w-xl">
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-center animate-shake">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* ========== STEP: Welcome ========== */}
          {step === 'welcome' && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="text-8xl animate-bounce-slow">🚀</div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                  Let's build your store!
                </h1>
                <p className="text-xl text-white/70 max-w-md mx-auto">
                  It only takes 4 quick steps. Ready?
                </p>
              </div>
              <button
                onClick={goNext}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-900 font-bold text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/20"
              >
                Let's Go! 
                <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* ========== STEP: Name ========== */}
          {step === 'name' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center space-y-4">
                <div className="text-6xl">✏️</div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  What's your store called?
                </h1>
                <p className="text-lg text-white/70">
                  Pick a fun name! You can always change it later.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="My Awesome Store"
                  autoFocus
                  className="w-full px-6 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-2xl text-center font-bold placeholder-white/40 focus:border-white/50 focus:outline-none focus:ring-4 focus:ring-white/20 transition-all"
                />
                {storeName && (
                  <p className="mt-4 text-center text-white/50 text-sm">
                    Your store will be at: <span className="text-white font-medium">evolv.app/{storeSlug}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center max-w-md mx-auto">
                <button onClick={goBack} className="p-4 text-white/50 hover:text-white transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold text-lg rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP: Type ========== */}
          {step === 'type' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center space-y-4">
                <div className="text-6xl">🛍️</div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  What will you sell?
                </h1>
                <p className="text-lg text-white/70">
                  Pick one! (Don't worry, you can sell anything)
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                {STORE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setStoreType(type.id)}
                    className={`relative p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 ${
                      storeType === type.id
                        ? 'bg-white text-gray-900 shadow-2xl shadow-white/30 scale-105'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {storeType === type.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="text-4xl mb-2">{type.emoji}</div>
                    <div className={`font-bold text-sm ${storeType === type.id ? 'text-gray-900' : 'text-white'}`}>
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center max-w-lg mx-auto">
                <button onClick={goBack} className="p-4 text-white/50 hover:text-white transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold text-lg rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP: Colors ========== */}
          {step === 'colors' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center space-y-4">
                <div className="text-6xl">🎨</div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Pick your colors!
                </h1>
                <p className="text-lg text-white/70">
                  Choose the vibe that feels right
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => setColorPalette(palette.id)}
                    className={`relative p-4 rounded-2xl transition-all hover:scale-105 active:scale-95 ${
                      colorPalette === palette.id
                        ? 'ring-4 ring-white shadow-2xl scale-105'
                        : 'hover:ring-2 hover:ring-white/50'
                    }`}
                    style={{ backgroundColor: palette.bg }}
                  >
                    {colorPalette === palette.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex gap-2 mb-3 justify-center">
                      <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: palette.primary }} />
                      <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: palette.secondary }} />
                    </div>
                    <div className="text-2xl mb-1">{palette.emoji}</div>
                    <div className="font-bold text-sm" style={{ color: palette.primary }}>
                      {palette.name}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center max-w-2xl mx-auto">
                <button onClick={goBack} className="p-4 text-white/50 hover:text-white transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold text-lg rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP: Vibe ========== */}
          {step === 'vibe' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-500">
              <div className="text-center space-y-4">
                <div className="text-6xl">✨</div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  Last one! Pick a style
                </h1>
                <p className="text-lg text-white/70">
                  How should your store feel?
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {STORE_VIBES.map((vibe) => (
                  <button
                    key={vibe.id}
                    onClick={() => setStoreVibe(vibe.id)}
                    className={`relative p-5 rounded-2xl text-left transition-all hover:scale-105 active:scale-95 ${
                      storeVibe === vibe.id
                        ? 'bg-white text-gray-900 shadow-2xl shadow-white/30 scale-105'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {storeVibe === vibe.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="text-3xl mb-2">{vibe.emoji}</div>
                    <div className={`font-bold ${storeVibe === vibe.id ? 'text-gray-900' : 'text-white'}`}>
                      {vibe.label}
                    </div>
                    <div className={`text-xs mt-1 ${storeVibe === vibe.id ? 'text-gray-600' : 'text-white/60'}`}>
                      {vibe.description}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center max-w-2xl mx-auto">
                <button onClick={goBack} className="p-4 text-white/50 hover:text-white transition-colors">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-2xl shadow-purple-500/30"
                >
                  <Sparkles className="w-5 h-5" />
                  Create My Store!
                </button>
              </div>
            </div>
          )}

          {/* ========== STEP: Creating ========== */}
          {step === 'creating' && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="text-8xl animate-bounce-slow">🏗️</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight">Building your store...</h1>
                <p className="text-xl text-white/70">This only takes a sec! ⚡</p>
              </div>
              <div className="flex justify-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* ========== STEP: Done! ========== */}
          {step === 'done' && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-700">
              {/* Confetti burst effect */}
              <div className="relative">
                <div className="text-[120px] animate-bounce-slow">🎉</div>
                <div className="absolute -top-4 -left-4 text-4xl animate-ping">⭐</div>
                <div className="absolute -top-4 -right-4 text-4xl animate-ping" style={{ animationDelay: '200ms' }}>✨</div>
                <div className="absolute -bottom-4 left-1/4 text-3xl animate-ping" style={{ animationDelay: '400ms' }}>💫</div>
                <div className="absolute -bottom-4 right-1/4 text-3xl animate-ping" style={{ animationDelay: '300ms' }}>🌟</div>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                  You did it!
                </h1>
                <p className="text-xl text-white/80 max-w-md mx-auto">
                  <span className="font-bold text-white">{storeName || 'Your store'}</span> is ready to go! 
                  Time to add some products and start selling! 🚀
                </p>
              </div>

              {/* Preview card */}
              {currentPalette && (
                <div 
                  className="max-w-sm mx-auto p-6 rounded-2xl shadow-2xl"
                  style={{ backgroundColor: currentPalette.bg }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Store className="w-8 h-8" style={{ color: currentPalette.primary }} />
                    <span className="font-bold text-lg" style={{ color: currentPalette.primary }}>
                      {storeName || 'My Store'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square rounded-lg" style={{ backgroundColor: currentPalette.primary + '20' }} />
                    <div className="aspect-square rounded-lg" style={{ backgroundColor: currentPalette.secondary + '20' }} />
                  </div>
                  <p className="mt-3 text-xs text-center" style={{ color: currentPalette.primary + '99' }}>
                    Preview of your store colors
                  </p>
                </div>
              )}

              <div className="space-y-4 max-w-sm mx-auto">
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full flex items-center justify-center gap-3 px-10 py-5 bg-white text-purple-900 font-bold text-xl rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/20"
                >
                  Go to My Store! <ArrowRight className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => window.open(`/s/${storeSlug}`, '_blank')}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl rounded-xl font-semibold text-white/80 hover:bg-white/20 transition-colors"
                >
                  Preview My Store 👀
                </button>
              </div>

              <div className="pt-8 text-white/50 text-sm">
                <p>Next up: Add your first product! It's super easy.</p>
              </div>
            </div>
          )}

          </div>
          
          {/* Right side: Live Preview Panel */}
          {step !== 'welcome' && step !== 'creating' && step !== 'done' && (
            <div className="hidden lg:block w-full lg:w-1/2 max-w-md sticky top-24">
              <div className="relative">
                {/* Phone frame */}
                <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-black/50">
                  <div className="bg-black rounded-[2.5rem] overflow-hidden relative">
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-20" />
                    
                    {/* Store Preview */}
                    <div 
                      className="min-h-[500px] transition-all duration-500"
                      style={{ 
                        backgroundColor: currentPalette?.bg || '#ffffff',
                      }}
                    >
                      {/* Header */}
                      <div 
                        className="pt-10 pb-4 px-4 border-b transition-all duration-500"
                        style={{ 
                          backgroundColor: currentPalette?.primary || '#6366f1',
                          borderColor: currentPalette?.secondary + '40' || '#a5b4fc40'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-white" />
                            <span className="font-bold text-white text-sm truncate max-w-[120px]">
                              {storeName || 'Your Store'}
                            </span>
                          </div>
                          <ShoppingBag className="w-5 h-5 text-white/80" />
                        </div>
                      </div>
                      
                      {/* Hero Section */}
                      <div 
                        className="p-4 text-center py-8 transition-all duration-500"
                        style={{ backgroundColor: currentPalette?.secondary + '20' || '#e0e7ff' }}
                      >
                        <div className="text-4xl mb-2">
                          {STORE_TYPES.find(t => t.id === storeType)?.emoji || '🏪'}
                        </div>
                        <h2 
                          className={`font-bold text-lg transition-all duration-500 ${
                            storeVibe === 'playful' ? 'font-comic' :
                            storeVibe === 'minimal' ? 'font-light tracking-wide' :
                            storeVibe === 'bold' ? 'font-black uppercase text-xl' :
                            storeVibe === 'cozy' ? 'font-serif italic' :
                            storeVibe === 'luxury' ? 'font-serif tracking-widest uppercase text-sm' :
                            storeVibe === 'retro' ? 'font-mono' : ''
                          }`}
                          style={{ color: currentPalette?.primary || '#6366f1' }}
                        >
                          {storeName || 'Your Store Name'}
                        </h2>
                        <p 
                          className="text-xs mt-1 opacity-70"
                          style={{ color: currentPalette?.primary || '#6366f1' }}
                        >
                          {storeType ? `The best ${storeType} around!` : 'Your tagline here'}
                        </p>
                      </div>
                      
                      {/* Products Grid */}
                      <div className="p-4">
                        <h3 
                          className={`text-xs font-semibold mb-3 transition-all duration-500 ${
                            storeVibe === 'luxury' ? 'tracking-widest uppercase' : ''
                          }`}
                          style={{ color: currentPalette?.primary || '#6366f1' }}
                        >
                          {storeVibe === 'playful' ? '✨ Hot Stuff!' : 
                           storeVibe === 'luxury' ? 'Featured Collection' : 
                           'Featured Products'}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div 
                              key={i}
                              className={`rounded-xl overflow-hidden transition-all duration-500 ${
                                storeVibe === 'bold' ? 'rounded-none' :
                                storeVibe === 'playful' ? 'rounded-2xl rotate-1' :
                                storeVibe === 'luxury' ? 'rounded-sm' : ''
                              }`}
                              style={{ backgroundColor: currentPalette?.secondary + '30' || '#e0e7ff' }}
                            >
                              <div 
                                className="aspect-square flex items-center justify-center"
                                style={{ backgroundColor: currentPalette?.primary + '15' || '#6366f120' }}
                              >
                                <Package 
                                  className="w-8 h-8 opacity-30"
                                  style={{ color: currentPalette?.primary || '#6366f1' }}
                                />
                              </div>
                              <div className="p-2">
                                <div 
                                  className="h-2 rounded-full mb-1 w-3/4"
                                  style={{ backgroundColor: currentPalette?.primary + '40' || '#6366f140' }}
                                />
                                <div 
                                  className="h-2 rounded-full w-1/2"
                                  style={{ backgroundColor: currentPalette?.secondary || '#a5b4fc' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bottom nav preview */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 p-4 border-t flex justify-around"
                        style={{ 
                          backgroundColor: currentPalette?.bg || '#ffffff',
                          borderColor: currentPalette?.primary + '20' || '#6366f120'
                        }}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Store className="w-4 h-4" style={{ color: currentPalette?.primary || '#6366f1' }} />
                          <span className="text-[8px]" style={{ color: currentPalette?.primary || '#6366f1' }}>Shop</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-50">
                          <Heart className="w-4 h-4" style={{ color: currentPalette?.primary || '#6366f1' }} />
                          <span className="text-[8px]" style={{ color: currentPalette?.primary || '#6366f1' }}>Saved</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-50">
                          <ShoppingBag className="w-4 h-4" style={{ color: currentPalette?.primary || '#6366f1' }} />
                          <span className="text-[8px]" style={{ color: currentPalette?.primary || '#6366f1' }}>Cart</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* "Live Preview" label */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Live Preview
                </div>
              </div>
              
              {/* Preview hints */}
              <div className="mt-4 text-center text-white/50 text-sm">
                <p>👆 This updates as you make choices!</p>
              </div>
            </div>
          )}
          
        </div>
      </main>

      {/* Custom animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SimpleWizard;
