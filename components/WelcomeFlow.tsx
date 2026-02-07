import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, ArrowRight, Building2, Palette, Rocket, X, ChevronRight, ChevronLeft, Store, Target, ShoppingBag, Globe, Brush, Camera, Heart, Dumbbell, Cpu, UtensilsCrossed, Home, Briefcase, MoreHorizontal, Check, Settings, Mail, Share2, MapPin, PartyPopper } from 'lucide-react';
import { StoreConfig, AdminTab } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface WelcomeFlowProps {
  config: StoreConfig;
  onConfigChange: (config: StoreConfig) => void;
  onTabChange: (tab: AdminTab) => void;
  onComplete: () => void;
  activeSettingsTab?: string;
  setActiveSettingsTab?: (tab: string) => void;
}

type Phase = 'modal' | 'guided';
type ModalStep = 0 | 1 | 2;

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const INDUSTRIES = [
  { id: 'retail', label: 'Retail', icon: ShoppingBag },
  { id: 'fashion', label: 'Fashion', icon: Brush },
  { id: 'food', label: 'Food & Drink', icon: UtensilsCrossed },
  { id: 'tech', label: 'Technology', icon: Cpu },
  { id: 'beauty', label: 'Health & Beauty', icon: Heart },
  { id: 'home', label: 'Home & Living', icon: Home },
  { id: 'sports', label: 'Sports', icon: Dumbbell },
  { id: 'art', label: 'Art & Creative', icon: Camera },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'other', label: 'Other', icon: MoreHorizontal },
] as const;

const GOALS = [
  { id: 'sell', label: 'Sell Products', description: 'Launch an online store', icon: ShoppingBag },
  { id: 'brand', label: 'Build My Brand', description: 'Establish online presence', icon: Globe },
  { id: 'portfolio', label: 'Showcase Work', description: 'Display portfolio', icon: Camera },
  { id: 'audience', label: 'Grow Audience', description: 'Attract & engage', icon: Target },
] as const;

const GUIDED_STEPS = [
  {
    target: 'welcome-store-details',
    title: 'Store Details',
    description: 'Start here — give your store a name, set your currency, and add a tagline that captures what you do.',
    icon: Store,
    color: 'blue',
  },
  {
    target: 'welcome-company-info',
    title: 'Company Information',
    description: 'Add your legal business name and type. This is used for invoices, receipts, and compliance.',
    icon: Building2,
    color: 'purple',
  },
  {
    target: 'welcome-contact-info',
    title: 'Contact Information',
    description: 'How can customers reach you? Add your support email and phone number.',
    icon: Mail,
    color: 'green',
  },
  {
    target: 'welcome-social-media',
    title: 'Social Media',
    description: 'Connect your social accounts — these can appear in your store\'s header and footer.',
    icon: Share2,
    color: 'pink',
  },
] as const;

// ─── Spotlight Overlay ───────────────────────────────────────────────────────

const SpotlightOverlay: React.FC<{
  targetSelector: string;
  children: React.ReactNode;
  onClickOutside: () => void;
}> = ({ targetSelector, children, onClickOutside }) => {
  const [rect, setRect] = useState<SpotlightRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const updateRect = useCallback(() => {
    const el = document.querySelector(`[data-welcome-target="${targetSelector}"]`);
    if (el) {
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - 8,
        left: r.left - 8,
        width: r.width + 16,
        height: r.height + 16,
      });
      // Scroll the element into view smoothly
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [targetSelector]);

  useEffect(() => {
    // Small delay so the Settings tab has time to render
    const timer = setTimeout(updateRect, 400);
    const observer = new ResizeObserver(updateRect);
    const el = document.querySelector(`[data-welcome-target="${targetSelector}"]`);
    if (el) observer.observe(el);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [targetSelector, updateRect]);

  if (!rect) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[350]" onClick={(e) => {
      if (e.target === overlayRef.current) onClickOutside();
    }}>
      {/* Spotlight cutout using box-shadow */}
      <div
        className="absolute rounded-2xl transition-all duration-500 ease-out pointer-events-none"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />
      {/* Tooltip card positioned below the spotlight */}
      <div
        className="absolute transition-all duration-500 ease-out"
        style={{
          top: rect.top + rect.height + 16,
          left: Math.max(16, Math.min(rect.left, window.innerWidth - 440)),
          zIndex: 2,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ─── Progress Bar ────────────────────────────────────────────────────────────

const StepProgress: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-500 ${
          i <= current ? 'bg-blue-500 w-8' : 'bg-neutral-700 w-4'
        }`}
      />
    ))}
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export const WelcomeFlow: React.FC<WelcomeFlowProps> = ({
  config,
  onConfigChange,
  onTabChange,
  onComplete,
  setActiveSettingsTab,
}) => {
  const [phase, setPhase] = useState<Phase>('modal');
  const [modalStep, setModalStep] = useState<ModalStep>(0);
  const [guidedStep, setGuidedStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Local form state for Step 1
  const [storeName, setStoreName] = useState(config.name || '');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');

  // Fade-in animation on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const advanceModal = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setModalStep((s) => Math.min(s + 1, 2) as ModalStep);
      setAnimating(false);
    }, 200);
  };

  const handleSaveAndProceed = () => {
    // Persist collected data to config
    const updates: Partial<StoreConfig> = {};
    if (storeName && storeName !== config.name) updates.name = storeName;
    if (industry) {
      // Map industry to businessType where they align
      const industryMap: Record<string, string> = {
        retail: 'individual', fashion: 'individual', food: 'individual',
        tech: 'llc', beauty: 'individual', home: 'individual',
        sports: 'individual', art: 'individual', services: 'llc', other: 'individual',
      };
      updates.businessType = industryMap[industry] as any;
    }
    if (Object.keys(updates).length > 0) {
      onConfigChange({ ...config, ...updates });
    }
    // Store goal in localStorage for UX personalization
    if (goal) localStorage.setItem('webpilot_user_goal', goal);
    if (industry) localStorage.setItem('webpilot_user_industry', industry);
    advanceModal();
  };

  const startGuidedTour = () => {
    // Switch to Settings > General tab
    onTabChange(AdminTab.SETTINGS);
    if (setActiveSettingsTab) setActiveSettingsTab('general');
    setPhase('guided');
    setGuidedStep(0);
  };

  const finishFlow = (destination?: 'design' | 'dashboard') => {
    onComplete();
    if (destination === 'design') {
      onTabChange(AdminTab.DESIGN);
    }
  };

  // ─── Phase 1: Welcome Modal ─────────────────────────────────────────────

  if (phase === 'modal') {
    return (
      <div className={`fixed inset-0 z-[350] flex items-center justify-center p-4 transition-all duration-500 ${mounted ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className={`relative bg-neutral-900 border border-neutral-700/50 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden transition-all duration-500 ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>

          {/* Decorative gradient header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-pink-600/10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            {/* Skip button — always visible */}
            <button
              onClick={() => finishFlow()}
              className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              Skip <X size={14} />
            </button>

            {/* Step 0: Greeting */}
            {modalStep === 0 && (
              <div className="relative px-8 pt-12 pb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                  Welcome to WebPilot
                </h2>
                <p className="text-neutral-400 text-base max-w-sm mx-auto leading-relaxed">
                  Let's get your store set up in just a few minutes. We'll guide you through the essentials.
                </p>
              </div>
            )}

            {/* Step 1: Personalization */}
            {modalStep === 1 && (
              <div className="relative px-8 pt-8 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-white mb-1">Tell us about your store</h3>
                <p className="text-sm text-neutral-500">This helps us personalize your experience.</p>
              </div>
            )}

            {/* Step 2: Recommendation */}
            {modalStep === 2 && (
              <div className="relative px-8 pt-8 pb-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                  <Rocket size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Great start{storeName ? `, ${storeName.split(' ')[0]}` : ''}!</h3>
                <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                  We recommend setting up your store details first. It takes about 2 minutes.
                </p>
              </div>
            )}
          </div>

          {/* Body content per step */}
          <div className="px-8 pb-8">
            {/* Step 0: CTA buttons */}
            {modalStep === 0 && (
              <div className="space-y-3 animate-in fade-in duration-300 delay-200">
                <button
                  onClick={advanceModal}
                  className="w-full group flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl text-white font-bold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                      <Rocket size={20} />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">Let's Get Started</div>
                      <div className="text-xs text-blue-200">Quick setup — takes 2 minutes</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => finishFlow()}
                  className="w-full text-center text-sm text-neutral-500 hover:text-neutral-300 py-2 transition-colors"
                >
                  Skip, I know my way around
                </button>
              </div>
            )}

            {/* Step 1: Personalization Form */}
            {modalStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                {/* Store Name */}
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Store Name</label>
                  <input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-black/60 border border-neutral-700 rounded-xl p-3.5 text-white placeholder-neutral-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all text-sm"
                    placeholder="My Amazing Store"
                    autoFocus
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Industry</label>
                  <div className="grid grid-cols-5 gap-2">
                    {INDUSTRIES.map((ind) => {
                      const Icon = ind.icon;
                      const isSelected = industry === ind.id;
                      return (
                        <button
                          key={ind.id}
                          onClick={() => setIndustry(ind.id)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10'
                              : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
                          }`}
                        >
                          <Icon size={18} />
                          <span className="text-[10px] font-bold leading-tight">{ind.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Goal */}
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Primary Goal</label>
                  <div className="grid grid-cols-2 gap-2">
                    {GOALS.map((g) => {
                      const Icon = g.icon;
                      const isSelected = goal === g.id;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setGoal(g.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                              : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-blue-500/20' : 'bg-neutral-700/50'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <div className="text-xs font-bold">{g.label}</div>
                            <div className="text-[10px] text-neutral-500">{g.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Continue button */}
                <div className="flex items-center justify-between pt-2">
                  <StepProgress current={1} total={3} />
                  <button
                    onClick={handleSaveAndProceed}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Recommendation */}
            {modalStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
                {/* Setup journey illustration */}
                <div className="bg-neutral-800/50 border border-neutral-700/30 rounded-2xl p-5 space-y-3">
                  {[
                    { label: 'Store & Company Details', sublabel: 'Name, business type, contact info', icon: Settings, done: false, active: true },
                    { label: 'Brand & Design', sublabel: 'Logo, colors, header, homepage', icon: Palette, done: false, active: false },
                    { label: 'Products & Content', sublabel: 'Add your first products', icon: ShoppingBag, done: false, active: false },
                    { label: 'Go Live!', sublabel: 'Publish your store to the world', icon: Rocket, done: false, active: false },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${item.active ? 'bg-blue-600/15 border border-blue-500/30' : 'opacity-50'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          item.active ? 'bg-blue-500 text-white' : 'bg-neutral-700 text-neutral-400'
                        }`}>
                          {item.done ? <Check size={16} /> : <Icon size={16} />}
                        </div>
                        <div>
                          <div className={`text-sm font-bold ${item.active ? 'text-white' : 'text-neutral-500'}`}>{item.label}</div>
                          <div className="text-[10px] text-neutral-500">{item.sublabel}</div>
                        </div>
                        {item.active && (
                          <div className="ml-auto">
                            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">UP NEXT</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={startGuidedTour}
                    className="w-full group flex items-center justify-center gap-2 p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-2xl text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
                  >
                    Yes, let's set up my store <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => finishFlow('design')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-neutral-300 text-sm font-medium transition-all"
                    >
                      <Palette size={14} /> Skip to Designer
                    </button>
                    <button
                      onClick={() => finishFlow('dashboard')}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-neutral-300 text-sm font-medium transition-all"
                    >
                      Skip to Dashboard
                    </button>
                  </div>
                </div>

                <div className="flex justify-center pt-1">
                  <StepProgress current={2} total={3} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Phase 2: Guided Settings Walkthrough ──────────────────────────────

  const currentGuide = GUIDED_STEPS[guidedStep];
  const isLastStep = guidedStep === GUIDED_STEPS.length - 1;
  const GuideIcon = currentGuide.icon;

  const colorMap: Record<string, { bg: string; border: string; text: string; accent: string }> = {
    blue: { bg: 'bg-blue-600/15', border: 'border-blue-500/30', text: 'text-blue-400', accent: 'bg-blue-500' },
    purple: { bg: 'bg-purple-600/15', border: 'border-purple-500/30', text: 'text-purple-400', accent: 'bg-purple-500' },
    green: { bg: 'bg-green-600/15', border: 'border-green-500/30', text: 'text-green-400', accent: 'bg-green-500' },
    pink: { bg: 'bg-pink-600/15', border: 'border-pink-500/30', text: 'text-pink-400', accent: 'bg-pink-500' },
  };
  const colors = colorMap[currentGuide.color] || colorMap.blue;

  return (
    <SpotlightOverlay
      targetSelector={currentGuide.target}
      onClickOutside={() => {}}
    >
      <div className={`w-[400px] ${colors.bg} border ${colors.border} rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 backdrop-blur-xl`}>
        {/* Card header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${colors.accent} rounded-xl flex items-center justify-center shadow-lg`}>
                <GuideIcon size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{currentGuide.title}</div>
                <div className="text-[10px] text-neutral-500 font-medium">Step {guidedStep + 1} of {GUIDED_STEPS.length}</div>
              </div>
            </div>
            <button
              onClick={() => finishFlow()}
              className="p-1.5 text-neutral-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Close guide"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed mb-4">
            {currentGuide.description}
          </p>

          {/* Progress */}
          <StepProgress current={guidedStep} total={GUIDED_STEPS.length} />
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex items-center justify-between gap-2">
          <button
            onClick={() => finishFlow()}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors px-2 py-1"
          >
            Done — I'll explore
          </button>
          <div className="flex items-center gap-2">
            {guidedStep > 0 && (
              <button
                onClick={() => setGuidedStep((s) => s - 1)}
                className="flex items-center gap-1 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-neutral-300 text-xs font-bold transition-all"
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}
            {isLastStep ? (
              <button
                onClick={() => finishFlow('design')}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-xl text-white text-xs font-bold transition-all shadow-lg shadow-green-600/20"
              >
                <PartyPopper size={14} /> All Set — Go to Designer
              </button>
            ) : (
              <button
                onClick={() => setGuidedStep((s) => s + 1)}
                className={`flex items-center gap-1 px-4 py-2 ${colors.accent} hover:opacity-90 rounded-xl text-white text-xs font-bold transition-all shadow-lg`}
              >
                Next <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </SpotlightOverlay>
  );
};

export default WelcomeFlow;
