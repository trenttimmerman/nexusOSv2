import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  Loader2, Store, CheckCircle2, ArrowRight, ArrowLeft, 
  Shirt, Palette, UtensilsCrossed, Wrench, Package, ShoppingBag,
  CreditCard, Sparkles, Check, Image as ImageIcon
} from 'lucide-react';

// Industry/Category options
const INDUSTRIES = [
  { id: 'apparel', name: 'Clothing & Apparel', icon: Shirt, description: 'T-shirts, hoodies, accessories', color: 'from-pink-500 to-rose-600' },
  { id: 'art', name: 'Art & Prints', icon: Palette, description: 'Artwork, posters, photography', color: 'from-purple-500 to-indigo-600' },
  { id: 'food', name: 'Food & Beverages', icon: UtensilsCrossed, description: 'Baked goods, specialty foods', color: 'from-orange-500 to-amber-600' },
  { id: 'services', name: 'Services', icon: Wrench, description: 'Consulting, coaching, bookings', color: 'from-blue-500 to-cyan-600' },
  { id: 'handmade', name: 'Handmade & Crafts', icon: Package, description: 'Jewelry, crafts, custom items', color: 'from-emerald-500 to-teal-600' },
  { id: 'general', name: 'General Store', icon: ShoppingBag, description: 'Multiple product types', color: 'from-gray-500 to-slate-600' },
];

// Template options per industry
const TEMPLATES: Record<string, { id: string; name: string; preview: string; description: string }[]> = {
  apparel: [
    { id: 'streetwear', name: 'Streetwear', preview: '🔥', description: 'Bold, urban, high-energy' },
    { id: 'minimal-apparel', name: 'Minimal', preview: '◻️', description: 'Clean, modern, sophisticated' },
    { id: 'vintage', name: 'Vintage', preview: '📼', description: 'Retro vibes, nostalgic feel' },
  ],
  art: [
    { id: 'gallery', name: 'Gallery', preview: '🖼️', description: 'Museum-style, focused on artwork' },
    { id: 'portfolio', name: 'Portfolio', preview: '📷', description: 'Showcase your best work' },
    { id: 'prints', name: 'Print Shop', preview: '🎨', description: 'Optimized for print sales' },
  ],
  food: [
    { id: 'bakery', name: 'Bakery', preview: '🥐', description: 'Warm, inviting, delicious' },
    { id: 'specialty', name: 'Specialty Foods', preview: '🫒', description: 'Premium, artisanal feel' },
    { id: 'cafe', name: 'Café & Coffee', preview: '☕', description: 'Cozy, local shop vibe' },
  ],
  services: [
    { id: 'consultant', name: 'Consultant', preview: '💼', description: 'Professional, trustworthy' },
    { id: 'coach', name: 'Coach', preview: '🎯', description: 'Personal, motivational' },
    { id: 'creative', name: 'Creative Agency', preview: '✨', description: 'Bold, innovative' },
  ],
  handmade: [
    { id: 'artisan', name: 'Artisan', preview: '🧶', description: 'Handcrafted, authentic' },
    { id: 'jewelry', name: 'Jewelry', preview: '💎', description: 'Elegant, precious' },
    { id: 'maker', name: 'Maker', preview: '🔨', description: 'Workshop, DIY vibe' },
  ],
  general: [
    { id: 'modern', name: 'Modern', preview: '⚡', description: 'Clean, versatile, fast' },
    { id: 'classic', name: 'Classic', preview: '📦', description: 'Traditional ecommerce' },
    { id: 'bold', name: 'Bold', preview: '🚀', description: 'Stand out, be different' },
  ],
};

// Sample products per industry for first product guidance
const SAMPLE_PRODUCTS: Record<string, { name: string; price: string; description: string }> = {
  apparel: { name: 'Classic Logo Tee', price: '29.99', description: 'Premium cotton t-shirt with your logo' },
  art: { name: 'Limited Edition Print', price: '49.99', description: 'High-quality archival print, signed and numbered' },
  food: { name: 'Signature Blend', price: '18.99', description: 'Our house specialty, made fresh daily' },
  services: { name: 'Consultation Session', price: '99.00', description: '1-hour consultation call' },
  handmade: { name: 'Handcrafted Item', price: '45.00', description: 'Made with love, one at a time' },
  general: { name: 'Featured Product', price: '39.99', description: 'Your best-selling item' },
};

type Step = 'industry' | 'store-info' | 'template' | 'first-product' | 'payment' | 'complete';

export const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Wizard state
  const [step, setStep] = useState<Step>('industry');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [skipProduct, setSkipProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [skipPayment, setSkipPayment] = useState(false);
  
  // Progress tracking
  const steps: Step[] = ['industry', 'store-info', 'template', 'first-product', 'payment', 'complete'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100;

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

      // Load any pending data
      const metadata = session.user.user_metadata;
      if (metadata?.pending_store_name) setStoreName(metadata.pending_store_name);
      if (metadata?.pending_store_slug) setStoreSlug(metadata.pending_store_slug);

      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  const handleStoreNameChange = (name: string) => {
    setStoreName(name);
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setStoreSlug(slug);
  };

  // Pre-fill product info when industry changes
  useEffect(() => {
    if (selectedIndustry && SAMPLE_PRODUCTS[selectedIndustry]) {
      const sample = SAMPLE_PRODUCTS[selectedIndustry];
      setProductName(sample.name);
      setProductPrice(sample.price);
      setProductDescription(sample.description);
    }
  }, [selectedIndustry]);

  const handleNext = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleCreateStore = async () => {
    setError(null);
    setCreating(true);

    try {
      // Create the store
      const { data: storeData, error: tenantError } = await supabase.rpc('create_tenant', {
        store_name: storeName,
        store_slug: storeSlug
      });

      if (tenantError) throw tenantError;

      // Get the store ID from the profile
      const { data: { session } } = await supabase.auth.getSession();
      const { data: profile } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('id', session?.user.id)
        .single();

      const storeId = profile?.store_id;

      // Save the selected template and industry to store settings
      if (storeId) {
        await supabase
          .from('stores')
          .update({ 
            settings: { 
              industry: selectedIndustry, 
              template: selectedTemplate,
              onboarding_completed: true
            } 
          })
          .eq('id', storeId);

        // Create the first product if not skipped
        if (!skipProduct && productName && productPrice) {
          await supabase
            .from('products')
            .insert({
              store_id: storeId,
              name: productName,
              price: parseFloat(productPrice),
              description: productDescription,
              inventory: 100,
              images: []
            });
        }
      }

      // Clear pending data
      await supabase.auth.updateUser({
        data: { pending_store_name: null, pending_store_slug: null }
      });

      // Move to complete step
      setStep('complete');
      setCreating(false);
    } catch (err: any) {
      console.error('Store creation error:', err);
      setError(err.message || 'Failed to create store');
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="text-xl font-bold">
          Evolv<span className="text-cyan-400">.</span>
        </div>
        <div className="text-sm text-gray-400">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Industry Selection */}
        {step === 'industry' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">What will you be selling?</h1>
              <p className="text-gray-400 text-lg">This helps us set up your store with the right features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {INDUSTRIES.map((industry) => {
                const Icon = industry.icon;
                const isSelected = selectedIndustry === industry.id;
                return (
                  <button
                    key={industry.id}
                    onClick={() => setSelectedIndustry(industry.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all text-left group ${
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-gray-800 hover:border-gray-700 bg-gray-900/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{industry.name}</h3>
                    <p className="text-sm text-gray-400">{industry.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedIndustry}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Store Info */}
        {step === 'store-info' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Name your store</h1>
              <p className="text-gray-400 text-lg">Don't worry, you can change this later</p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => handleStoreNameChange(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-lg"
                  placeholder="My Awesome Store"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your store URL</label>
                <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl overflow-hidden focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/20">
                  <span className="px-4 text-gray-500 bg-gray-800/50">evolv.app/</span>
                  <input
                    type="text"
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                    placeholder="my-store"
                  />
                </div>
                {storeSlug && (
                  <p className="mt-2 text-sm text-gray-500">
                    Your store will be at: <span className="text-cyan-400">evolv.app/{storeSlug}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!storeName || !storeSlug}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Template Selection */}
        {step === 'template' && selectedIndustry && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Choose your style</h1>
              <p className="text-gray-400 text-lg">Pick a template that matches your brand vibe</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TEMPLATES[selectedIndustry]?.map((template) => {
                const isSelected = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-gray-800 hover:border-gray-700 bg-gray-900/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-6 h-6 text-cyan-500" />
                      </div>
                    )}
                    <div className="text-5xl mb-4">{template.preview}</div>
                    <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedTemplate}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: First Product */}
        {step === 'first-product' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Add your first product</h1>
              <p className="text-gray-400 text-lg">Let's get something in your store right away</p>
            </div>

            {!skipProduct ? (
              <div className="max-w-lg mx-auto space-y-6">
                <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl space-y-4">
                  <div className="w-full h-40 bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-700">
                    <div className="text-center text-gray-500">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">You can add images later</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g. Classic Logo Tee"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                        placeholder="29.99"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
                    <textarea
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none resize-none"
                      placeholder="Tell customers about this product..."
                    />
                  </div>
                </div>

                <button
                  onClick={() => setSkipProduct(true)}
                  className="w-full text-center text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  Skip for now — I'll add products later
                </button>
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center p-8 bg-gray-900/50 border border-gray-800 rounded-2xl">
                <p className="text-gray-400 mb-4">No problem! You can add products anytime from your dashboard.</p>
                <button
                  onClick={() => setSkipProduct(false)}
                  className="text-cyan-400 hover:text-cyan-300 text-sm"
                >
                  Actually, let me add one now
                </button>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!skipProduct && (!productName || !productPrice)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Payment Setup */}
        {step === 'payment' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Get paid easily</h1>
              <p className="text-gray-400 text-lg">Connect a payment provider to accept orders</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <button
                onClick={() => setSkipPayment(false)}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                  !skipPayment ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">Connect Stripe</h3>
                      <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">Recommended</span>
                    </div>
                    <p className="text-sm text-gray-400">Accept credit cards, Apple Pay, Google Pay and more. Takes 2 minutes to set up.</p>
                  </div>
                  {!skipPayment && <CheckCircle2 className="w-6 h-6 text-cyan-500 shrink-0" />}
                </div>
              </button>

              <button
                onClick={() => setSkipPayment(true)}
                className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                  skipPayment ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Set up later</h3>
                    <p className="text-sm text-gray-400">You can connect payments anytime from your settings. Your store will show products but won't process orders yet.</p>
                  </div>
                  {skipPayment && <CheckCircle2 className="w-6 h-6 text-cyan-500 shrink-0" />}
                </div>
              </button>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleCreateStore}
                disabled={creating}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    Create My Store <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Complete */}
        {step === 'complete' && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">You're all set! 🎉</h1>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Your store <span className="text-cyan-400 font-semibold">{storeName}</span> is ready. Let's start selling!
              </p>
            </div>

            <div className="max-w-sm mx-auto space-y-4">
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Go to My Dashboard <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => window.open(`/s/${storeSlug}`, '_blank')}
                className="w-full px-8 py-4 border border-gray-700 rounded-xl font-semibold text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Preview My Store
              </button>
            </div>

            <div className="pt-8 border-t border-gray-800">
              <h3 className="font-semibold mb-4">What's next?</h3>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <span className="px-3 py-1.5 bg-gray-800 rounded-full text-gray-300">Add more products</span>
                <span className="px-3 py-1.5 bg-gray-800 rounded-full text-gray-300">Customize your theme</span>
                <span className="px-3 py-1.5 bg-gray-800 rounded-full text-gray-300">Connect a domain</span>
                <span className="px-3 py-1.5 bg-gray-800 rounded-full text-gray-300">Set up shipping</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OnboardingWizard;
