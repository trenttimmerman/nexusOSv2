import React, { useEffect, useMemo, useState } from 'react';

export interface HeroData {
  variant?: 'centered' | 'split-left' | 'diagonal' | 'minimal-corner' | 'bottom-aligned';
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  textColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  showSubheading?: boolean;
  showButton?: boolean;
  enableParticles?: boolean;
  particleColor?: string;
  enableAnimation?: boolean;
  animationType?: 'fade-in' | 'slide-up' | 'zoom-in' | 'glitch' | 'float';
  enableParallax?: boolean;
  parallaxSpeed?: number;
  gradientOverlay?: boolean;
  gradientColors?: string;
}

const BASE_DEFAULTS: HeroData = {
  variant: 'centered',
  heading: 'Welcome to the Future',
  subheading: 'Elevate your brand with cinematic hero experiences',
  buttonText: 'Get Started',
  buttonLink: '#',
  backgroundImage: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80',
  textColor: '#FFFFFF',
  buttonBackgroundColor: '#00FF00',
  buttonTextColor: '#000000',
  buttonHoverColor: '#00CC00',
  overlayColor: '#000000',
  overlayOpacity: 0.6,
  showSubheading: true,
  showButton: true,
  enableParticles: true,
  particleColor: '#FFFFFF',
  enableAnimation: true,
  animationType: 'fade-in',
  enableParallax: false,
  parallaxSpeed: 0.4,
  gradientOverlay: false,
  gradientColors: 'from-purple-900/70 to-pink-900/70'
};

const VARIANT_DEFAULTS: Record<NonNullable<HeroData['variant']>, Partial<HeroData>> = {
  centered: {
    textColor: '#FFFFFF',
    buttonBackgroundColor: '#00FF00',
    buttonTextColor: '#000000',
    overlayColor: '#000000',
    overlayOpacity: 0.75
  },
  'split-left': {
    textColor: '#000000',
    buttonBackgroundColor: '#FF3366',
    buttonTextColor: '#FFFFFF',
    overlayColor: '#FFFFFF',
    overlayOpacity: 0.2
  },
  diagonal: {
    textColor: '#FFFFFF',
    buttonBackgroundColor: '#8B5CF6',
    buttonTextColor: '#FFFFFF',
    overlayColor: '#000000',
    overlayOpacity: 0.6,
    gradientOverlay: true,
    gradientColors: 'from-purple-900/75 to-pink-900/75'
  },
  'minimal-corner': {
    textColor: '#FFFFFF',
    buttonBackgroundColor: '#00FFFF',
    buttonTextColor: '#000000',
    overlayColor: '#000000',
    overlayOpacity: 0.75
  },
  'bottom-aligned': {
    textColor: '#FFFFFF',
    buttonBackgroundColor: '#7C3AED',
    buttonTextColor: '#FFFFFF',
    overlayColor: '#000000',
    overlayOpacity: 0.55
  }
};

const useMergedData = (data?: HeroData) => {
  const variant = data?.variant || 'centered';
  return useMemo(() => ({
    ...BASE_DEFAULTS,
    ...VARIANT_DEFAULTS[variant],
    ...data,
    variant
  }), [data, variant]);
};

const getAnimationClass = (enable: boolean | undefined, type: HeroData['animationType']) => {
  if (!enable) return '';
  switch (type) {
    case 'slide-up':
      return 'animate-slide-up';
    case 'zoom-in':
      return 'animate-zoom-in';
    case 'glitch':
      return 'animate-glitch';
    case 'float':
      return 'animate-float';
    case 'fade-in':
    default:
      return 'animate-fade-in';
  }
};

const Particles: React.FC<{ color: string; variant: NonNullable<HeroData['variant']> }> = ({ color, variant }) => {
  const positions = Array.from({ length: 20 }).map((_, index) => index);
  const baseClass = variant === 'diagonal'
    ? 'particle-diag'
    : variant === 'minimal-corner'
      ? 'particle-corner'
      : variant === 'bottom-aligned'
        ? 'particle-bottom'
        : 'particle-rise';

  return (
    <div className="absolute inset-0 pointer-events-none">
      <style>{`
        @keyframes particle-rise { 0% { transform: translateY(10vh); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(-90vh); opacity: 0; } }
        @keyframes particle-diag { 0% { transform: translate(20vw, 10vh); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translate(-80vw, -90vh); opacity: 0; } }
        @keyframes particle-corner { 0% { transform: translate(0, 80vh); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translate(0, -40vh); opacity: 0; } }
        @keyframes particle-bottom { 0% { transform: translateY(0) scale(0.8); opacity: 0; } 20% { opacity: 1; transform: translateY(-20vh) scale(1); } 100% { transform: translateY(-80vh) scale(0.8); opacity: 0; } }
        .particle { position: absolute; width: 6px; height: 6px; border-radius: 9999px; box-shadow: 0 0 16px ${color}; background: ${color}; }
        .particle-rise { animation: particle-rise 12s infinite; }
        .particle-diag { animation: particle-diag 12s infinite; }
        .particle-corner { animation: particle-corner 14s infinite; }
        .particle-bottom { animation: particle-bottom 12s infinite; }
      `}</style>
      {positions.map((pos) => (
        <div
          key={pos}
          className={`particle ${baseClass}`}
          style={{
            left: `${(pos * 5) % 100}%`,
            animationDelay: `${pos * 0.35}s`
          }}
        />
      ))}
    </div>
  );
};

const AnimationStyles = () => (
  <style>{`
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes zoom-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    @keyframes glitch { 0%,100% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(2px, -2px); } 60% { transform: translate(-2px, -2px); } 80% { transform: translate(2px, 2px); } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
    .animate-fade-in { animation: fade-in 0.9s ease-out; }
    .animate-slide-up { animation: slide-up 0.9s ease-out; }
    .animate-zoom-in { animation: zoom-in 0.9s ease-out; }
    .animate-glitch { animation: glitch 0.3s infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
  `}</style>
);

const Overlay: React.FC<{ gradientOverlay?: boolean; gradientColors?: string; overlayColor?: string; overlayOpacity?: number }> = ({ gradientOverlay, gradientColors, overlayColor, overlayOpacity }) => {
  if (gradientOverlay) {
    return <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors || 'from-purple-900/70 to-pink-900/70'}`} />;
  }
  return (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
    />
  );
};

const HeroCentered: React.FC<{ data?: HeroData }> = ({ data }) => {
  const merged = useMergedData(data);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    if (!merged.enableParallax) return;
    const onScroll = () => setOffsetY(window.scrollY * (merged.parallaxSpeed || 0.4));
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [merged.enableParallax, merged.parallaxSpeed]);

  const anim = getAnimationClass(merged.enableAnimation, merged.animationType);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <AnimationStyles />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${merged.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: merged.enableParallax ? `translateY(${offsetY * -1}px)` : undefined
        }}
      />
      <Overlay
        gradientOverlay={merged.gradientOverlay}
        gradientColors={merged.gradientColors}
        overlayColor={merged.overlayColor}
        overlayOpacity={merged.overlayOpacity}
      />
      {merged.enableParticles && <Particles color={merged.particleColor || '#FFFFFF'} variant="centered" />}
      <div className={`relative z-10 text-center px-6 max-w-4xl space-y-6 ${anim}`}>
        <h1 className="text-5xl md:text-7xl font-black leading-tight" style={{ color: merged.textColor }}>
          {merged.heading}
        </h1>
        {merged.showSubheading && merged.subheading && (
          <p className="text-xl md:text-2xl text-white/80" style={{ color: merged.textColor }}>
            {merged.subheading}
          </p>
        )}
        {merged.showButton && merged.buttonText && (
          <a
            href={merged.buttonLink}
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: merged.buttonBackgroundColor, color: merged.buttonTextColor }}
          >
            {merged.buttonText}
          </a>
        )}
      </div>
    </section>
  );
};

const HeroSplitLeft: React.FC<{ data?: HeroData }> = ({ data }) => {
  const merged = useMergedData({ variant: 'split-left', ...data });
  const anim = getAnimationClass(merged.enableAnimation, merged.animationType);

  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden bg-white">
      <AnimationStyles />
      <div className="w-full md:w-1/2 flex items-center justify-center px-10 py-12" style={{ backgroundColor: merged.overlayColor, opacity: merged.overlayOpacity }}>
        <div className={`max-w-xl space-y-6 ${anim}`}>
          <h1 className="text-5xl font-black leading-tight" style={{ color: merged.textColor }}>
            {merged.heading}
          </h1>
          {merged.showSubheading && merged.subheading && (
            <p className="text-lg text-black/80" style={{ color: merged.textColor }}>
              {merged.subheading}
            </p>
          )}
          {merged.showButton && merged.buttonText && (
            <a
              href={merged.buttonLink}
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-105"
              style={{ backgroundColor: merged.buttonBackgroundColor, color: merged.buttonTextColor }}
            >
              {merged.buttonText}
            </a>
          )}
        </div>
      </div>
      <div className="w-full md:w-1/2 relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${merged.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <Overlay
          gradientOverlay={merged.gradientOverlay}
          gradientColors={merged.gradientColors}
          overlayColor={merged.overlayColor}
          overlayOpacity={merged.overlayOpacity}
        />
        {merged.enableParticles && <Particles color={merged.particleColor || '#FFFFFF'} variant="split-left" />}
      </div>
    </section>
  );
};

const HeroDiagonal: React.FC<{ data?: HeroData }> = ({ data }) => {
  const merged = useMergedData({ variant: 'diagonal', ...data });
  const anim = getAnimationClass(merged.enableAnimation, merged.animationType);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black flex items-center">
      <AnimationStyles />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${merged.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-transparent" />
      <Overlay
        gradientOverlay={merged.gradientOverlay}
        gradientColors={merged.gradientColors}
        overlayColor={merged.overlayColor}
        overlayOpacity={merged.overlayOpacity}
      />
      {merged.enableParticles && <Particles color={merged.particleColor || '#FFFFFF'} variant="diagonal" />}
      <div className="relative z-10 max-w-5xl px-10 py-16 skew-y-2">
        <div className={`max-w-3xl space-y-6 skew-y-[-2deg] ${anim}`}>
          <h1 className="text-6xl font-black leading-tight" style={{ color: merged.textColor }}>
            {merged.heading}
          </h1>
          {merged.showSubheading && merged.subheading && (
            <p className="text-xl text-white/80" style={{ color: merged.textColor }}>
              {merged.subheading}
            </p>
          )}
          {merged.showButton && merged.buttonText && (
            <a
              href={merged.buttonLink}
              className="inline-flex items-center justify-center px-9 py-4 rounded-full font-semibold transition-transform duration-300 hover:-translate-y-1"
              style={{ backgroundColor: merged.buttonBackgroundColor, color: merged.buttonTextColor }}
            >
              {merged.buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

const HeroMinimalCorner: React.FC<{ data?: HeroData }> = ({ data }) => {
  const merged = useMergedData({ variant: 'minimal-corner', ...data });
  const anim = getAnimationClass(merged.enableAnimation, merged.animationType);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-black">
      <AnimationStyles />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${merged.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <Overlay
        gradientOverlay={merged.gradientOverlay}
        gradientColors={merged.gradientColors}
        overlayColor={merged.overlayColor}
        overlayOpacity={merged.overlayOpacity}
      />
      {merged.enableParticles && <Particles color={merged.particleColor || '#FFFFFF'} variant="minimal-corner" />}
      <div className="relative z-10 p-10 md:p-16">
        <div className={`max-w-lg space-y-6 ${anim}`}>
          <h1 className="text-5xl md:text-6xl font-black" style={{ color: merged.textColor }}>
            {merged.heading}
          </h1>
          {merged.showSubheading && merged.subheading && (
            <p className="text-lg text-white/80" style={{ color: merged.textColor }}>
              {merged.subheading}
            </p>
          )}
          {merged.showButton && merged.buttonText && (
            <a
              href={merged.buttonLink}
              className="inline-flex items-center justify-center px-7 py-3 rounded-full border-2 font-semibold transition-all duration-300 hover:bg-white/10"
              style={{ borderColor: merged.buttonBackgroundColor, color: merged.buttonTextColor, backgroundColor: merged.buttonBackgroundColor }}
            >
              {merged.buttonText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

const HeroBottomAligned: React.FC<{ data?: HeroData }> = ({ data }) => {
  const merged = useMergedData({ variant: 'bottom-aligned', ...data });
  const anim = getAnimationClass(merged.enableAnimation, merged.animationType);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-end bg-black">
      <AnimationStyles />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url(${merged.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <Overlay
        gradientOverlay={merged.gradientOverlay}
        gradientColors={merged.gradientColors}
        overlayColor={merged.overlayColor}
        overlayOpacity={merged.overlayOpacity}
      />
      {merged.enableParticles && <Particles color={merged.particleColor || '#FFFFFF'} variant="bottom-aligned" />}
      <div className="relative z-10 w-full px-8 md:px-16 pb-16">
        <div className={`max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 ${anim}`}>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-black" style={{ color: merged.textColor }}>
              {merged.heading}
            </h1>
            {merged.showSubheading && merged.subheading && (
              <p className="text-lg text-white/80" style={{ color: merged.textColor }}>
                {merged.subheading}
              </p>
            )}
          </div>
          {merged.showButton && merged.buttonText && (
            <div className="flex items-center gap-4">
              <a
                href={merged.buttonLink}
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-transform duration-300 hover:-translate-y-1"
                style={{ backgroundColor: merged.buttonBackgroundColor, color: merged.buttonTextColor }}
              >
                {merged.buttonText}
              </a>
              <div className="h-12 w-px bg-white/30" />
              <span className="text-white/70 text-sm">Scroll to explore</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const AI_HERO_COMPONENTS: Record<NonNullable<HeroData['variant']>, React.FC<{ data?: HeroData }>> = {
  centered: HeroCentered,
  'split-left': HeroSplitLeft,
  diagonal: HeroDiagonal,
  'minimal-corner': HeroMinimalCorner,
  'bottom-aligned': HeroBottomAligned
};

export const AI_HERO_OPTIONS = [
  { id: 'centered', name: 'Centered', description: 'Full-screen background with centered content' },
  { id: 'split-left', name: 'Split Left', description: 'Text on left with bright image on right' },
  { id: 'diagonal', name: 'Diagonal', description: 'Angled split with gradient overlay' },
  { id: 'minimal-corner', name: 'Minimal Corner', description: 'Top-left editorial layout' },
  { id: 'bottom-aligned', name: 'Bottom Aligned', description: 'Content anchored to bottom' }
];

export const AI_HERO_FIELDS: Record<string, string[]> = {
  centered: ['heading', 'subheading', 'buttonText', 'buttonLink', 'backgroundImage', 'textColor', 'buttonBackgroundColor', 'buttonTextColor', 'buttonHoverColor', 'overlayColor', 'overlayOpacity', 'showSubheading', 'showButton', 'enableParticles', 'particleColor', 'enableAnimation', 'animationType', 'enableParallax', 'parallaxSpeed', 'gradientOverlay', 'gradientColors'],
  'split-left': ['heading', 'subheading', 'buttonText', 'buttonLink', 'backgroundImage', 'textColor', 'buttonBackgroundColor', 'buttonTextColor', 'buttonHoverColor', 'overlayColor', 'overlayOpacity', 'showSubheading', 'showButton', 'enableParticles', 'particleColor', 'enableAnimation', 'animationType', 'gradientOverlay', 'gradientColors'],
  diagonal: ['heading', 'subheading', 'buttonText', 'buttonLink', 'backgroundImage', 'textColor', 'buttonBackgroundColor', 'buttonTextColor', 'buttonHoverColor', 'overlayColor', 'overlayOpacity', 'showSubheading', 'showButton', 'enableParticles', 'particleColor', 'enableAnimation', 'animationType', 'gradientOverlay', 'gradientColors'],
  'minimal-corner': ['heading', 'subheading', 'buttonText', 'buttonLink', 'backgroundImage', 'textColor', 'buttonBackgroundColor', 'buttonTextColor', 'buttonHoverColor', 'overlayColor', 'overlayOpacity', 'showSubheading', 'showButton', 'enableParticles', 'particleColor', 'enableAnimation', 'animationType', 'gradientOverlay', 'gradientColors'],
  'bottom-aligned': ['heading', 'subheading', 'buttonText', 'buttonLink', 'backgroundImage', 'textColor', 'buttonBackgroundColor', 'buttonTextColor', 'buttonHoverColor', 'overlayColor', 'overlayOpacity', 'showSubheading', 'showButton', 'enableParticles', 'particleColor', 'enableAnimation', 'animationType', 'gradientOverlay', 'gradientColors']
};
