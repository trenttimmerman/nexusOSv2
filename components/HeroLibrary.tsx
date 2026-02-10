// SINGLE HERO VARIANT - Full Image with Text Overlay
// Building one perfect component before expanding

import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HeroData {
  // Layout Variant
  variant?: 'centered' | 'split-left' | 'split-right' | 'minimal-corner' | 'bottom-aligned';
  
  // Content
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  
  // Colors
  textColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  
  // Visibility toggles
  showSubheading?: boolean;
  showButton?: boolean;
  
  // Advanced Effects (2026 cutting-edge features)
  enableParticles?: boolean;
  particleColor?: string;
  enableAnimation?: boolean;
  animationType?: 'fade-in' | 'slide-up' | 'zoom-in' | 'glitch' | 'float';
  enableParallax?: boolean;
  parallaxSpeed?: number;
  gradientOverlay?: boolean;
  gradientColors?: string; // e.g., "from-purple-600 to-pink-600"
}

interface HeroProps {
  data: HeroData;
  onUpdate?: (data: HeroData) => void;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const FULLIMAGE_DEFAULTS: HeroData = {
  heading: 'Welcome to Our Store',
  subheading: 'Discover amazing products at incredible prices',
  buttonText: 'Shop Now',
  buttonLink: '/products',
  backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
  textColor: '#FFFFFF',
  buttonBackgroundColor: '#000000',
  buttonTextColor: '#FFFFFF',
  buttonHoverColor: '#333333',
  overlayColor: '#000000',
  overlayOpacity: 0.4,
  showSubheading: true,
  showButton: true,
};

// ============================================================================
// FULL IMAGE HERO COMPONENT
// ============================================================================

const HeroFullImage: React.FC<HeroProps> = ({ data, onUpdate }) => {
  const merged = { ...FULLIMAGE_DEFAULTS, ...data };
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Parallax effect
  React.useEffect(() => {
    if (!merged.enableParallax) return;
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [merged.enableParallax]);

  const parallaxOffset = merged.enableParallax 
    ? scrollY * (merged.parallaxSpeed || 0.5)
    : 0;

  // Animation classes
  const getAnimationClass = () => {
    if (!merged.enableAnimation) return '';
    switch (merged.animationType) {
      case 'fade-in': return 'animate-fadeIn';
      case 'slide-up': return 'animate-slideUp';
      case 'zoom-in': return 'animate-zoomIn';
      case 'glitch': return 'animate-glitch';
      case 'float': return 'animate-float';
      default: return 'animate-fadeIn';
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${merged.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${parallaxOffset}px)`,
          transition: merged.enableParallax ? 'none' : 'transform 0.3s ease-out',
        }}
      />

      {/* Overlay - Solid or Gradient */}
      {merged.gradientOverlay ? (
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${merged.gradientColors || 'from-purple-900/70 to-pink-900/70'}`}
        />
      ) : (
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: merged.overlayColor,
            opacity: merged.overlayOpacity,
          }}
        />
      )}

      {/* Particle Effects */}
      {merged.enableParticles && (
        <>
          <style>{`
            @keyframes particle-float {
              0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
            }
            @keyframes particle-float-reverse {
              0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
              10% { opacity: 0.6; }
              90% { opacity: 0.6; }
              100% { transform: translateY(-100vh) translateX(-30px); opacity: 0; }
            }
            .particle {
              position: absolute;
              bottom: -10px;
              width: 4px;
              height: 4px;
              background: ${merged.particleColor || '#ffffff'};
              border-radius: 50%;
              pointer-events: none;
              box-shadow: 0 0 10px ${merged.particleColor || '#ffffff'};
            }
            .particle:nth-child(1) { left: 10%; animation: particle-float 8s infinite; animation-delay: 0s; }
            .particle:nth-child(2) { left: 20%; animation: particle-float-reverse 10s infinite; animation-delay: 2s; }
            .particle:nth-child(3) { left: 30%; animation: particle-float 12s infinite; animation-delay: 4s; }
            .particle:nth-child(4) { left: 40%; animation: particle-float-reverse 9s infinite; animation-delay: 1s; }
            .particle:nth-child(5) { left: 50%; animation: particle-float 11s infinite; animation-delay: 3s; }
            .particle:nth-child(6) { left: 60%; animation: particle-float-reverse 10s infinite; animation-delay: 5s; }
            .particle:nth-child(7) { left: 70%; animation: particle-float 13s infinite; animation-delay: 2.5s; }
            .particle:nth-child(8) { left: 80%; animation: particle-float-reverse 9.5s infinite; animation-delay: 4.5s; }
            .particle:nth-child(9) { left: 90%; animation: particle-float 10.5s infinite; animation-delay: 1.5s; }
            .particle:nth-child(10) { left: 15%; animation: particle-float-reverse 11.5s infinite; animation-delay: 3.5s; }
            .particle:nth-child(11) { left: 25%; animation: particle-float 8.5s infinite; animation-delay: 0.5s; }
            .particle:nth-child(12) { left: 35%; animation: particle-float-reverse 12.5s infinite; animation-delay: 2.8s; }
            .particle:nth-child(13) { left: 45%; animation: particle-float 9.8s infinite; animation-delay: 4.2s; }
            .particle:nth-child(14) { left: 55%; animation: particle-float-reverse 10.8s infinite; animation-delay: 1.2s; }
            .particle:nth-child(15) { left: 65%; animation: particle-float 11.2s infinite; animation-delay: 3.2s; }
            .particle:nth-child(16) { left: 75%; animation: particle-float-reverse 13.2s infinite; animation-delay: 5.2s; }
            .particle:nth-child(17) { left: 85%; animation: particle-float 9.2s infinite; animation-delay: 2.2s; }
            .particle:nth-child(18) { left: 95%; animation: particle-float-reverse 8.8s infinite; animation-delay: 4.8s; }
            .particle:nth-child(19) { left: 5%; animation: particle-float 12.8s infinite; animation-delay: 0.8s; }
            .particle:nth-child(20) { left: 50%; animation: particle-float-reverse 10.2s infinite; animation-delay: 3.8s; }
          `}</style>
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="particle" />
            ))}
          </div>
        </>
      )}

      {/* Content with Animations */}
      <div className={`relative z-10 text-center px-4 max-w-4xl mx-auto ${getAnimationClass()}`}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes glitch {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-fadeIn { animation: fadeIn 1s ease-out; }
          .animate-slideUp { animation: slideUp 1s ease-out; }
          .animate-zoomIn { animation: zoomIn 1s ease-out; }
          .animate-glitch { animation: glitch 0.3s infinite; }
          .animate-float { animation: float 3s ease-in-out infinite; }
        `}</style>

        {/* Heading */}
        <h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{ color: merged.textColor }}
        >
          {merged.heading}
        </h1>

        {/* Subheading */}
        {merged.showSubheading && merged.subheading && (
          <p 
            className="text-xl md:text-2xl mb-10"
            style={{ color: merged.textColor }}
          >
            {merged.subheading}
          </p>
        )}

        {/* CTA Button */}
        {merged.showButton && merged.buttonText && (
          <a
            href={merged.buttonLink}
            className="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              backgroundColor: isHovered ? merged.buttonHoverColor : merged.buttonBackgroundColor,
              color: merged.buttonTextColor,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {merged.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SPLIT LAYOUT HERO - Text Left, Image Right
// ============================================================================

const HeroSplitLayout: React.FC<HeroProps> = ({ data, onUpdate }) => {
  const merged = { ...FULLIMAGE_DEFAULTS, ...data };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-screen flex items-center overflow-hidden">
      {/* Left Side - Content */}
      <div className="w-1/2 h-full flex items-center justify-center px-16 relative z-10" style={{ backgroundColor: merged.overlayColor }}>
        <div className="max-w-xl">
          <h1 className="text-6xl font-black mb-6 leading-tight" style={{ color: merged.textColor }}>
            {merged.heading}
          </h1>
          
          {merged.showSubheading && merged.subheading && (
            <p className="text-xl mb-8 leading-relaxed" style={{ color: merged.textColor, opacity: 0.9 }}>
              {merged.subheading}
            </p>
          )}

          {merged.showButton && merged.buttonText && (
            <a
              href={merged.buttonLink}
              className="inline-block px-10 py-5 text-lg font-bold rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              style={{
                backgroundColor: isHovered ? merged.buttonHoverColor : merged.buttonBackgroundColor,
                color: merged.buttonTextColor,
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {merged.buttonText}
            </a>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div 
        className="w-1/2 h-full"
        style={{
          backgroundImage: `url(${merged.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Particles */}
      {merged.enableParticles && (
        <>
          <style>{`
            @keyframes particle-float { 0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-100vh) translateX(50px); opacity: 0; } }
            .particle { position: absolute; bottom: -10px; width: 4px; height: 4px; background: ${merged.particleColor || '#ffffff'}; border-radius: 50%; pointer-events: none; box-shadow: 0 0 10px ${merged.particleColor || '#ffffff'}; }
            .particle:nth-child(1) { left: 10%; animation: particle-float 8s infinite; }
            .particle:nth-child(2) { left: 20%; animation: particle-float 10s infinite; animation-delay: 2s; }
            .particle:nth-child(3) { left: 30%; animation: particle-float 12s infinite; animation-delay: 4s; }
          `}</style>
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (<div key={i} className="particle" />))}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// DIAGONAL HERO - Dramatic Angled Split
// ============================================================================

const HeroDiagonal: React.FC<HeroProps> = ({ data, onUpdate }) => {
  const merged = { ...FULLIMAGE_DEFAULTS, ...data };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${merged.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Diagonal Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: merged.gradientOverlay 
            ? `linear-gradient(135deg, ${merged.overlayColor || '#000000'} 0%, transparent 100%)`
            : merged.overlayColor,
          opacity: merged.gradientOverlay ? 1 : merged.overlayOpacity,
        }}
      />

      {/* Diagonal Content Container */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-3/5 px-20">
          <div className="transform -skew-y-2">
            <h1 className="text-7xl font-black mb-6 leading-none" style={{ color: merged.textColor }}>
              {merged.heading}
            </h1>
          </div>
          
          {merged.showSubheading && merged.subheading && (
            <p className="text-2xl mb-10 max-w-2xl" style={{ color: merged.textColor }}>
              {merged.subheading}
            </p>
          )}

          {merged.showButton && merged.buttonText && (
            <a
              href={merged.buttonLink}
              className="inline-block px-12 py-6 text-xl font-black uppercase tracking-wider transform hover:-skew-x-12 transition-all duration-300"
              style={{
                backgroundColor: isHovered ? merged.buttonHoverColor : merged.buttonBackgroundColor,
                color: merged.buttonTextColor,
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {merged.buttonText}
            </a>
          )}
        </div>
      </div>

      {/* Particles */}
      {merged.enableParticles && (
        <>
          <style>{`
            @keyframes particle-diagonal { 0% { transform: translate(0, 0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translate(-100vw, -100vh); opacity: 0; } }
            .particle-diag { position: absolute; top: 100%; right: 0; width: 6px; height: 6px; background: ${merged.particleColor || '#ffffff'}; border-radius: 50%; box-shadow: 0 0 15px ${merged.particleColor || '#ffffff'}; }
            .particle-diag:nth-child(1) { animation: particle-diagonal 10s infinite; }
            .particle-diag:nth-child(2) { animation: particle-diagonal 12s infinite; animation-delay: 3s; }
            .particle-diag:nth-child(3) { animation: particle-diagonal 15s infinite; animation-delay: 6s; }
          `}</style>
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (<div key={i} className="particle-diag" />))}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// MINIMAL CORNER HERO - Top-Left Positioned
// ============================================================================

const HeroMinimalCorner: React.FC<HeroProps> = ({ data, onUpdate }) => {
  const merged = { ...FULLIMAGE_DEFAULTS, ...data };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${merged.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient Overlay */}
      {merged.gradientOverlay ? (
        <div className={`absolute inset-0 bg-gradient-to-br ${merged.gradientColors || 'from-black/60 to-transparent'}`} />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: merged.overlayColor, opacity: merged.overlayOpacity }} />
      )}

      {/* Top-Left Content */}
      <div className="relative z-10 pt-32 pl-20 max-w-3xl">
        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight" style={{ color: merged.textColor }}>
          {merged.heading}
        </h1>
        
        {merged.showSubheading && merged.subheading && (
          <p className="text-lg md:text-xl mb-8 max-w-xl" style={{ color: merged.textColor, opacity: 0.95 }}>
            {merged.subheading}
          </p>
        )}

        {merged.showButton && merged.buttonText && (
          <a
            href={merged.buttonLink}
            className="inline-block px-8 py-4 text-sm font-bold uppercase tracking-widest border-2 transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: isHovered ? merged.buttonBackgroundColor : 'transparent',
              borderColor: merged.buttonBackgroundColor,
              color: isHovered ? merged.buttonTextColor : merged.buttonBackgroundColor,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {merged.buttonText}
          </a>
        )}
      </div>

      {/* Particles */}
      {merged.enableParticles && (
        <>
          <style>{`
            @keyframes particle-rise { 0% { transform: translateY(100vh); opacity: 0; } 10% { opacity: 0.8; } 90% { opacity: 0.8; } 100% { transform: translateY(-20vh); opacity: 0; } }
            .particle-corner { position: absolute; left: 0; width: 3px; height: 3px; background: ${merged.particleColor || '#ffffff'}; border-radius: 50%; }
            .particle-corner:nth-child(odd) { animation: particle-rise 15s infinite; }
            .particle-corner:nth-child(even) { animation: particle-rise 18s infinite; animation-delay: 5s; }
          `}</style>
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (<div key={i} className="particle-corner" style={{ left: `${i * 15}%` }} />))}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// BOTTOM-ALIGNED HERO - Content at Bottom
// ============================================================================

const HeroBottomAligned: React.FC<HeroProps> = ({ data, onUpdate }) => {
  const merged = { ...FULLIMAGE_DEFAULTS, ...data };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full h-screen flex items-end overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${merged.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient from bottom */}
      {merged.gradientOverlay ? (
        <div className={`absolute inset-0 bg-gradient-to-t ${merged.gradientColors || 'from-black via-black/50 to-transparent'}`} />
      ) : (
        <>
          <div className="absolute inset-0" style={{ backgroundColor: merged.overlayColor, opacity: merged.overlayOpacity }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </>
      )}

      {/* Bottom Content */}
      <div className="relative z-10 w-full pb-20 px-20">
        <div className="max-w-5xl">
          <h1 className="text-7xl md:text-9xl font-black mb-4 leading-none" style={{ color: merged.textColor }}>
            {merged.heading}
          </h1>
          
          <div className="flex items-center gap-8 mt-8">
            {merged.showSubheading && merged.subheading && (
              <p className="text-xl md:text-2xl max-w-2xl flex-1" style={{ color: merged.textColor }}>
                {merged.subheading}
              </p>
            )}

            {merged.showButton && merged.buttonText && (
              <a
                href={merged.buttonLink}
                className="px-10 py-5 text-lg font-black rounded-none transition-all duration-300 hover:scale-110 hover:shadow-2xl whitespace-nowrap"
                style={{
                  backgroundColor: isHovered ? merged.buttonHoverColor : merged.buttonBackgroundColor,
                  color: merged.buttonTextColor,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {merged.buttonText}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Particles */}
      {merged.enableParticles && (
        <>
          <style>{`
            @keyframes particle-bottom { 0% { transform: translateY(0) scale(0); opacity: 0; } 20% { opacity: 1; transform: translateY(-30vh) scale(1); } 100% { transform: translateY(-100vh) scale(0); opacity: 0; } }
            .particle-bottom { position: absolute; bottom: 0; width: 5px; height: 5px; background: ${merged.particleColor || '#ffffff'}; border-radius: 50%; box-shadow: 0 0 20px ${merged.particleColor || '#ffffff'}; }
          `}</style>
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="particle-bottom" style={{ left: `${i * 12}%`, animationDelay: `${i * 1.5}s`, animation: 'particle-bottom 12s infinite' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export const HERO_COMPONENTS: Record<string, React.FC<HeroProps>> = {
  centered: HeroFullImage,
  'split-left': HeroSplitLayout,
  diagonal: HeroDiagonal,
  'minimal-corner': HeroMinimalCorner,
  'bottom-aligned': HeroBottomAligned,
};

export const HERO_OPTIONS = [
  { 
    id: 'fullimage', 
    name: 'Full Image', 
    description: 'Full-screen background image with centered text overlay',
    popularity: 100,
    recommended: true
  },
  { 
    id: 'split', 
    name: 'Split Layout', 
    description: 'Text on left, image on right split design',
    popularity: 90,
    recommended: false
  },
  { 
    id: 'diagonal', 
    name: 'Diagonal', 
    description: 'Dramatic angled split with skewed elements',
    popularity: 85,
    recommended: false
  },
];

export const HERO_FIELDS: Record<string, string[]> = {
  fullimage: [
    'heading',
    'subheading',
    'buttonText',
    'buttonLink',
    'backgroundImage',
    'textColor',
    'buttonBackgroundColor',
    'buttonTextColor',
    'buttonHoverColor',
    'overlayColor',
    'overlayOpacity',
    'showSubheading',
    'showButton',
  ],
};
