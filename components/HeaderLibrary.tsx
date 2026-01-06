import React from 'react';
import { ShoppingBag, Search, User, Menu, Hexagon } from 'lucide-react';
import { NavLink } from '../types';

// Header customization data structure
export interface HeaderData {
  // Visibility toggles
  showSearch?: boolean;
  showAccount?: boolean;
  showCart?: boolean;
  // Colors
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textHoverColor?: string;
  cartBadgeColor?: string;
  cartBadgeTextColor?: string;
  // Layout
  sticky?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  paddingX?: string;
  paddingY?: string;
}

interface HeaderProps {
  storeName: string;
  logoUrl?: string;
  logoHeight?: number;
  links: NavLink[];
  cartCount: number;
  onOpenCart?: () => void;
  onLogoClick?: () => void;
  onLinkClick?: (href: string) => void;
  primaryColor?: string;
  secondaryColor?: string;
  data?: HeaderData; // Per-header customization
}

// Default values for HeaderCanvas
const CANVAS_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  backgroundColor: '#ffffff',
  borderColor: '#f3f4f6',
  textColor: '#6b7280',
  textHoverColor: '#000000',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: '7xl',
  paddingX: '24px',
  paddingY: '16px',
};

// Reusable Logo component
const Logo: React.FC<{
  storeName: string;
  logoUrl?: string;
  logoHeight?: number;
  className?: string;
  onClick?: () => void;
}> = ({ storeName, logoUrl, logoHeight = 32, className, onClick }) => {
  const content = logoUrl ? (
    <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px`, width: 'auto' }} className="object-contain" />
  ) : (
    <span className={className}>{storeName}</span>
  );

  if (onClick) {
    return <button onClick={onClick} className="cursor-pointer">{content}</button>;
  }
  return <>{content}</>;
};

// Reusable NavItem component
const NavItem: React.FC<{
  link: NavLink;
  className?: string;
  style?: React.CSSProperties;
  hoverColor?: string;
  onClick?: (href: string) => void;
}> = ({ link, className, style, hoverColor, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(link.href);
    }
  };

  return (
    <a
      href={link.href}
      onClick={handleClick}
      className={className}
      style={{
        ...style,
        color: isHovered && hoverColor ? hoverColor : style?.color,
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {link.label}
    </a>
  );
};

// 1. HeaderCanvas - "Classic Clean" (Minimalist, Clean, Airy)
export const HeaderCanvas: React.FC<HeaderProps> = ({
  storeName,
  logoUrl,
  logoHeight,
  links,
  cartCount,
  onOpenCart,
  onLogoClick,
  onLinkClick,
  data = {},
}) => {
  // Merge defaults with customization
  const settings = { ...CANVAS_DEFAULTS, ...data };
  
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;

  return (
    <header
      className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-[100]`}
      style={{
        backgroundColor: settings.backgroundColor,
        borderBottom: `1px solid ${settings.borderColor}`,
      }}
    >
      <div
        className={`${maxWidthClass} mx-auto flex items-center justify-between`}
        style={{
          paddingLeft: settings.paddingX,
          paddingRight: settings.paddingX,
          paddingTop: settings.paddingY,
          paddingBottom: settings.paddingY,
          minHeight: '5rem',
        }}
      >
        {/* Left: Logo + Navigation */}
        <div className="flex items-center gap-8">
          <Logo
            storeName={storeName}
            logoUrl={logoUrl}
            logoHeight={logoHeight}
            className="text-2xl font-bold tracking-tight"
            onClick={onLogoClick}
          />
          <nav className="hidden md:flex gap-6">
            {(links || []).map((link) => (
              <NavItem
                key={link.href}
                link={link}
                onClick={onLinkClick}
                className="text-sm font-medium"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
              />
            ))}
          </nav>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2">
          {settings.showSearch && (
            <button
              className="p-2 rounded-full transition-colors"
              style={{ color: settings.textColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
              onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
            >
              <Search size={20} />
            </button>
          )}
          {settings.showAccount && (
            <button
              className="p-2 rounded-full transition-colors"
              style={{ color: settings.textColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
              onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
            >
              <User size={20} />
            </button>
          )}
          {settings.showCart && (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full transition-colors"
              style={{ color: settings.textColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
              onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  className="absolute top-0 right-0 w-4 h-4 text-[10px] flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: settings.cartBadgeColor,
                    color: settings.cartBadgeTextColor,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// Default values for HeaderNebula
const NEBULA_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: false, // Nebula doesn't show account by default
  showCart: true,
  backgroundColor: 'rgba(255, 255, 255, 0.6)', // Glass effect
  borderColor: 'rgba(255, 255, 255, 0.2)',
  textColor: '#4b5563', // gray-600
  textHoverColor: '#2563eb', // blue-600
  accentColor: '#3b82f6', // blue-500 for dot indicator
  cartBadgeColor: '#3b82f6',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: '4xl',
  blurIntensity: 'xl', // backdrop-blur intensity
  showIndicatorDot: true, // animated dot next to logo
};

// 2. HeaderNebula - "Modern Glass" (Floating pill, frosted glass)
export const HeaderNebula: React.FC<HeaderProps> = ({
  storeName,
  logoUrl,
  logoHeight,
  links,
  cartCount,
  onOpenCart,
  onLogoClick,
  onLinkClick,
  data = {},
}) => {
  // Merge defaults with customization
  const settings = { ...NEBULA_DEFAULTS, ...data };
  
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;
  const blurClass = `backdrop-blur-${settings.blurIntensity || 'xl'}`;

  return (
    <header className={`${settings.sticky ? 'sticky top-0' : ''} z-[100] flex justify-center px-4 pt-4`}>
      <div 
        className={`${blurClass} shadow-lg rounded-full px-8 py-3 flex items-center gap-12 ${maxWidthClass} w-full justify-between`}
        style={{
          backgroundColor: settings.backgroundColor,
          border: `1px solid ${settings.borderColor}`,
        }}
      >
        {/* Left: Logo with optional indicator dot */}
        <button onClick={onLogoClick} className="flex items-center gap-2 cursor-pointer">
          {settings.showIndicatorDot && !logoUrl && (
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: settings.accentColor }}
            />
          )}
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="font-bold tracking-wider text-sm uppercase"
          />
        </button>

        {/* Center: Navigation */}
        <nav className="hidden md:flex gap-8">
          {(links || []).map((link) => (
            <NavItem
              key={link.href}
              link={link}
              onClick={onLinkClick}
              className="text-xs font-semibold tracking-widest uppercase transition-colors"
              style={{ color: settings.textColor }}
              hoverColor={settings.textHoverColor}
            />
          ))}
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-4" style={{ color: settings.textColor }}>
          {settings.showSearch && (
            <button
              className="cursor-pointer transition-colors"
              style={{ color: settings.textColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
              onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
            >
              <Search size={18} />
            </button>
          )}
          {settings.showCart && (
            <button 
              onClick={onOpenCart} 
              className="relative cursor-pointer transition-colors"
              style={{ color: settings.textColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
              onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ backgroundColor: settings.cartBadgeColor }}
                />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// Default values for HeaderLuxe
const LUXE_DEFAULTS: HeaderData = {
  showMenu: true,
  showSearch: true,
  showAccount: true,
  showCart: true,
  showTagline: true,
  backgroundColor: '#faf9f6', // Cream/off-white
  borderColor: '#e5e5e5',
  textColor: '#737373', // neutral-500
  textHoverColor: '#000000',
  accentColor: '#d4af37', // Gold
  taglineColor: '#a3a3a3', // neutral-400
  taglineText: 'Est. 2024 • Paris',
  cartBadgeColor: '#d4af37',
  sticky: true,
  maxWidth: '7xl',
};

// 3. HeaderLuxe - "Luxury Elegant" (High-end, centered logo, gold accents)
export const HeaderLuxe: React.FC<HeaderProps> = ({
  storeName,
  logoUrl,
  logoHeight,
  links,
  cartCount,
  onOpenCart,
  onLogoClick,
  onLinkClick,
  data = {},
}) => {
  // Merge defaults with customization
  const settings = { ...LUXE_DEFAULTS, ...data };
  
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;

  return (
    <header 
      className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-[100]`}
      style={{ 
        backgroundColor: settings.backgroundColor,
        borderBottom: `1px solid ${settings.borderColor}`,
      }}
    >
      <div className={`${maxWidthClass} mx-auto px-8`}>
        {/* Main Header Row */}
        <div className="min-h-[6rem] py-4 flex flex-col items-center justify-center relative">
          {/* Left Icons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-6">
            {settings.showMenu && (
              <button
                className="transition-colors cursor-pointer"
                style={{ color: settings.textColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
              >
                <Menu size={20} />
              </button>
            )}
            {settings.showSearch && (
              <button
                className="transition-colors cursor-pointer"
                style={{ color: settings.textColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
              >
                <Search size={20} />
              </button>
            )}
          </div>
          
          {/* Center: Logo + Tagline */}
          <button onClick={onLogoClick} className="cursor-pointer text-center">
            <Logo 
              storeName={storeName} 
              logoUrl={logoUrl} 
              logoHeight={logoHeight} 
              className="font-serif text-3xl italic tracking-wide"
            />
            {settings.showTagline && !logoUrl && (
              <span 
                className="text-[10px] uppercase tracking-[0.3em] mt-1 block"
                style={{ color: settings.taglineColor }}
              >
                {settings.taglineText}
              </span>
            )}
          </button>

          {/* Right: Account + Cart */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-6">
            {settings.showAccount && (
              <button
                className="text-xs font-serif italic cursor-pointer hidden md:block transition-colors"
                style={{ color: settings.textColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
              >
                Account
              </button>
            )}
            {settings.showCart && (
              <button 
                onClick={onOpenCart} 
                className="relative cursor-pointer"
                style={{ color: settings.textColor }}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: settings.cartBadgeColor }}
                  />
                )}
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation Row */}
        <nav 
          className="h-10 flex items-center justify-center gap-12"
          style={{ borderTop: `1px solid ${settings.borderColor}` }}
        >
          {(links || []).map((link) => (
            <NavItem
              key={link.href}
              link={link}
              onClick={onLinkClick}
              className="text-xs font-medium uppercase tracking-widest transition-colors"
              style={{ color: settings.textColor }}
              hoverColor={settings.accentColor}
            />
          ))}
        </nav>
      </div>
    </header>
  );
};

// Default values for HeaderPilot
const PILOT_DEFAULTS: HeaderData = {
  showCart: true,
  showCTA: true,
  showLogoBadge: true, // Hexagon icon next to logo
  backgroundColor: '#ffffff',
  textColor: '#4b5563', // gray-600
  textHoverColor: '#4f46e5', // indigo-600
  accentColor: '#4f46e5', // indigo-600
  ctaBackgroundColor: '#4f46e5',
  ctaHoverColor: '#4338ca', // indigo-700
  ctaTextColor: '#ffffff',
  ctaText: 'Sign In',
  cartBadgeColor: '#4f46e5',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: '7xl',
};

// 4. HeaderPilot - "Professional" (SaaS/Tech style with CTA button)
export const HeaderPilot: React.FC<HeaderProps> = ({
  storeName,
  logoUrl,
  logoHeight,
  links,
  cartCount,
  onOpenCart,
  onLogoClick,
  onLinkClick,
  data = {},
}) => {
  const settings = { ...PILOT_DEFAULTS, ...data };
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;

  return (
    <header 
      className={`shadow-md ${settings.sticky ? 'sticky top-0' : ''} z-[100] w-full`}
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex justify-between items-center min-h-[4rem] py-3">
          {/* Left: Logo with optional badge */}
          <button onClick={onLogoClick} className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            {settings.showLogoBadge && !logoUrl && (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: settings.accentColor, color: '#ffffff' }}
              >
                <Hexagon size={20} />
              </div>
            )}
            <Logo 
              storeName={storeName} 
              logoUrl={logoUrl} 
              logoHeight={logoHeight} 
              className="text-xl font-bold text-gray-800"
            />
          </button>

          {/* Center: Navigation */}
          <nav className="hidden md:flex space-x-8">
            {(links || []).map((link) => (
              <NavItem
                key={link.href}
                link={link}
                onClick={onLinkClick}
                className="font-medium text-sm transition-colors"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
              />
            ))}
          </nav>

          {/* Right: Cart + CTA */}
          <div className="hidden md:flex items-center gap-4">
            {settings.showCart && (
              <button 
                onClick={onOpenCart} 
                className="relative cursor-pointer transition-colors"
                style={{ color: settings.textColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            {settings.showCTA && (
              <a 
                href="#" 
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ backgroundColor: settings.ctaBackgroundColor, color: settings.ctaTextColor }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = settings.ctaHoverColor!)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = settings.ctaBackgroundColor!)}
              >
                {settings.ctaText}
              </a>
            )}
          </div>

          {/* Mobile: Cart + Menu */}
          <div className="md:hidden flex items-center gap-4">
            {settings.showCart && (
              <button onClick={onOpenCart} className="relative cursor-pointer" style={{ color: settings.textColor }}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            <button style={{ color: settings.textColor }}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Placeholder for other headers (to be rebuilt one by one)
const PlaceholderHeader: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick }) => (
  <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-[100]">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {logoUrl ? (
          <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
        ) : (
          <span className="text-xl font-bold text-gray-900">{storeName}</span>
        )}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); onLinkClick?.(link.href); }}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <button onClick={onOpenCart} className="relative p-2 text-gray-600 hover:text-gray-900">
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  </header>
);

// Other headers still use placeholder - restore from HeaderLibrary.archive.tsx as needed
export const HeaderBunker = PlaceholderHeader;
export const HeaderOrbit = PlaceholderHeader;
export const HeaderProtocol = PlaceholderHeader;
export const HeaderHorizon = PlaceholderHeader;
export const HeaderStudio = PlaceholderHeader;
export const HeaderTerminal = PlaceholderHeader;
export const HeaderPortfolio = PlaceholderHeader;
export const HeaderVenture = PlaceholderHeader;
export const HeaderMetro = PlaceholderHeader;
export const HeaderModul = PlaceholderHeader;
export const HeaderGullwing = PlaceholderHeader;
export const HeaderPop = PlaceholderHeader;
export const HeaderStark = PlaceholderHeader;
export const HeaderOffset = PlaceholderHeader;
export const HeaderTicker = PlaceholderHeader;
export const HeaderNoir = PlaceholderHeader;
export const HeaderGhost = PlaceholderHeader;

// Header: Pathfinder - SVG path draw animation on scroll
export const HeaderPathfinder: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const headerRef = React.useRef<HTMLElement>(null);
  const svgPathRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    // @ts-ignore
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !svgPathRef.current) return;

    // @ts-ignore
    gsap.registerPlugin(ScrollTrigger);
    const path = svgPathRef.current;
    const pathLength = path.getTotalLength();
    
    // @ts-ignore
    gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    
    // @ts-ignore
    const ctx = gsap.context(() => {
      // @ts-ignore
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=400',
          scrub: 1,
        }
      });
    }, headerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-[100] h-20">
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            ref={svgPathRef}
            d="M 0 79.5 L 1440 79.5 L 1440 0.5 L 0 0.5 Z"
            stroke={data?.borderColor || 'black'}
            strokeWidth="1"
            fill={data?.backgroundColor || 'rgba(255, 255, 255, 0.8)'}
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'}}
          />
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
          ) : (
            <span className="text-xl font-bold" style={{ color: data?.textColor || '#000' }}>{storeName}</span>
          )}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); onLinkClick?.(link.href); }}
                className="transition-colors"
                style={{ color: data?.textColor || '#4b5563' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button onClick={onOpenCart} className="relative p-2" style={{ color: data?.textColor || '#4b5563' }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                style={{ backgroundColor: data?.cartBadgeColor || '#000', color: data?.cartBadgeTextColor || '#fff' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// Header: Cypher - Glitch text effect on hover
export const HeaderCypher: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const glitchId = React.useId().replace(/:/g, '');

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgColor = data?.backgroundColor || '#000000';

  return (
    <>
      {isScrolled && <div className="h-24" />}
      <style>
        {`
        .glitch-text-${glitchId} { position: relative; }
        .glitch-text-${glitchId}::before, .glitch-text-${glitchId}::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: ${bgColor};
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          transition: all 0.2s ease-in-out;
        }
        .glitch-text-${glitchId}:hover::before {
          left: 2px;
          text-shadow: -1px 0 red;
          animation: glitch-anim-1-${glitchId} 0.5s infinite linear alternate-reverse;
        }
        .glitch-text-${glitchId}:hover::after {
          left: -2px;
          text-shadow: -1px 0 blue;
          animation: glitch-anim-2-${glitchId} 0.5s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1-${glitchId} {
          0% { clip: rect(42px, 9999px, 44px, 0); } 100% { clip: rect(2px, 9999px, 95px, 0); }
        }
        @keyframes glitch-anim-2-${glitchId} {
          0% { clip: rect(7px, 9999px, 98px, 0); } 100% { clip: rect(80px, 9999px, 45px, 0); }
        }
        `}
      </style>
      <header className={`text-white transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'fixed top-0 left-0 right-0 z-[100] h-20 backdrop-blur-sm border-b border-fuchsia-500/30 shadow-lg' 
          : 'relative h-24 border-b border-transparent'
      }`} style={{ backgroundColor: isScrolled ? `${bgColor}cc` : bgColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <div className={`text-3xl font-black tracking-tighter glitch-text-${glitchId}`} data-text={storeName}
                style={{ color: data?.textColor || '#fff' }}>{storeName}</div>
            )}
            <nav className="hidden md:flex items-center space-x-10">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); onLinkClick?.(link.href); }}
                  className={`text-lg font-semibold uppercase tracking-widest glitch-text-${glitchId}`}
                  data-text={link.label}
                  style={{ color: data?.textColor || '#fff' }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button onClick={onOpenCart} className="relative p-2" style={{ color: data?.textColor || '#fff' }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                  style={{ backgroundColor: data?.cartBadgeColor || '#d946ef', color: data?.cartBadgeTextColor || '#fff' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

// Header: Particle - Interactive particle canvas background
export const HeaderParticle: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const mousePos = React.useRef({ x: -9999, y: -9999 });
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: any[] = [];
    const particleCount = 70;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 1,
      });
    }
    
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        const dx = mousePos.current.x - p.x;
        const dy = mousePos.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 100) {
          p.vx -= dx / 500;
          p.vy -= dy / 500;
        }
        
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    };
    
    const handleMouseOut = () => {
      mousePos.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isScrolled]);

  const bgColor = data?.backgroundColor || '#111827';

  return (
    <>
      {isScrolled && <div className="h-28" />}
      <header className={`text-white overflow-hidden transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'fixed top-0 left-0 right-0 z-[100] h-20 shadow-lg' 
          : 'relative h-28'
      }`} style={{ backgroundColor: bgColor }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <span className="text-3xl font-bold" style={{ color: data?.textColor || '#fff' }}>{storeName}</span>
            )}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); onLinkClick?.(link.href); }}
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: data?.textColor || '#fff' }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button onClick={onOpenCart} className="relative p-2" style={{ color: data?.textColor || '#fff' }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                  style={{ backgroundColor: data?.cartBadgeColor || '#fff', color: data?.cartBadgeTextColor || '#111827' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

// Header: Lumina - Mouse-following spotlight effect
export const HeaderLumina: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const headerRef = React.useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = header.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      header.style.setProperty('--mouse-x', `${x}px`);
      header.style.setProperty('--mouse-y', `${y}px`);
    };

    header.addEventListener('mousemove', handleMouseMove);
    return () => header.removeEventListener('mousemove', handleMouseMove);
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgColor = data?.backgroundColor || '#000000';

  return (
    <>
      {isScrolled && <div className="h-24" />}
      <header
        ref={headerRef}
        className={`text-white overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'fixed top-0 left-0 right-0 z-[100] h-20 backdrop-blur-sm border-b border-gray-800 shadow-lg' 
            : 'relative h-24 border-b border-gray-900'
        }`}
        style={{
          backgroundColor: isScrolled ? `${bgColor}cc` : bgColor,
          // @ts-ignore
          '--mouse-x': '50%',
          '--mouse-y': '50%',
        }}
      >
        <div 
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(
              ellipse 400px 50px at var(--mouse-x) var(--mouse-y),
              rgba(100, 116, 139, 0.2), 
              transparent 80%
            )`
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full relative z-20">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <span className="text-2xl font-bold tracking-widest" style={{ color: data?.textColor || '#fff' }}>{storeName}</span>
            )}
            <nav className="hidden md:flex items-center space-x-10 text-sm uppercase tracking-wider">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); onLinkClick?.(link.href); }}
                  className="hover:text-white transition-colors"
                  style={{ color: data?.textColor || '#9ca3af' }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <button onClick={onOpenCart} className="relative p-2" style={{ color: data?.textColor || '#9ca3af' }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                  style={{ backgroundColor: data?.cartBadgeColor || '#fff', color: data?.cartBadgeTextColor || '#000' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

// Header: Aqua - Liquid glass effect with blur
export const HeaderAqua: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, data }) => {
  return (
    <header 
      className="sticky top-0 z-[100] h-20"
      style={{
        backgroundColor: data?.backgroundColor || 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${data?.borderColor || 'rgba(255, 255, 255, 0.2)'}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
          ) : (
            <span className="text-2xl font-bold" style={{ color: data?.textColor || '#fff', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>{storeName}</span>
          )}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); onLinkClick?.(link.href); }}
                style={{ color: data?.textColor || '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <button onClick={onOpenCart} className="relative p-2" style={{ color: data?.textColor || '#fff' }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                style={{ backgroundColor: data?.cartBadgeColor || '#fff', color: data?.cartBadgeTextColor || '#000' }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// Header: Refined - Clean with animated dropdown menu
export const HeaderRefined: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isScrolled && <div className="h-16" />}
      <header className={`transition-all duration-300 ease-in-out w-full ${
        isScrolled 
          ? 'fixed top-0 left-0 z-[100] backdrop-blur-md shadow-lg' 
          : 'relative border-b'
      }`} style={{ 
        backgroundColor: isScrolled ? `${data?.backgroundColor || '#ffffff'}e6` : (data?.backgroundColor || '#ffffff'),
        borderColor: data?.borderColor || '#e5e7eb'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <span className="text-xl font-bold" style={{ color: data?.textColor || '#000' }}>{storeName}</span>
            )}
            <nav className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <div key={link.href} className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); onLinkClick?.(link.href); }}
                    className="transition-colors flex items-center"
                    style={{ color: data?.textColor || '#4b5563' }}
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </nav>
            <button onClick={onOpenCart} className="relative p-2" style={{ color: data?.textColor || '#4b5563' }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                  style={{ backgroundColor: data?.cartBadgeColor || '#000', color: data?.cartBadgeTextColor || '#fff' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export const HEADER_COMPONENTS: Record<string, React.FC<HeaderProps>> = {
  canvas: HeaderCanvas,
  nebula: HeaderNebula,
  bunker: HeaderBunker,
  orbit: HeaderOrbit,
  protocol: HeaderProtocol,
  horizon: HeaderHorizon,
  studio: HeaderStudio,
  terminal: HeaderTerminal,
  portfolio: HeaderPortfolio,
  venture: HeaderVenture,
  metro: HeaderMetro,
  modul: HeaderModul,
  luxe: HeaderLuxe,
  gullwing: HeaderGullwing,
  pop: HeaderPop,
  stark: HeaderStark,
  offset: HeaderOffset,
  ticker: HeaderTicker,
  noir: HeaderNoir,
  ghost: HeaderGhost,
  pilot: HeaderPilot,
  pathfinder: HeaderPathfinder,
  cypher: HeaderCypher,
  particle: HeaderParticle,
  lumina: HeaderLumina,
  aqua: HeaderAqua,
  refined: HeaderRefined,
};

export const HEADER_OPTIONS = [
  { id: 'canvas', name: 'Classic Clean', description: 'Simple and elegant', date: '2024-01-01', popularity: 95, recommended: true },
  { id: 'nebula', name: 'Modern Glass', description: 'Frosted glass effect', date: '2024-03-15', popularity: 92 },
  { id: 'luxe', name: 'Luxury Elegant', description: 'High-end feel', date: '2024-07-01', popularity: 90 },
  { id: 'pilot', name: 'Professional', description: 'SaaS and tech', date: '2024-11-24', popularity: 88 },
  { id: 'bunker', name: 'Bold Contrast', description: 'Black and white', date: '2024-06-20', popularity: 85 },
  { id: 'pop', name: 'Playful Modern', description: 'Fun and friendly', date: '2024-09-01', popularity: 82 },
  { id: 'venture', name: 'Search-First', description: 'Large catalogs', date: '2024-02-01', popularity: 80 },
  { id: 'orbit', name: 'Interactive', description: 'Hover effects', date: '2024-08-01', popularity: 78 },
  { id: 'gullwing', name: 'Centered Logo', description: 'Logo in middle', date: '2024-07-15', popularity: 77 },
  { id: 'noir', name: 'Dark Mode', description: 'Dark theme', date: '2024-10-15', popularity: 76 },
  { id: 'modul', name: 'Grid Layout', description: 'Swiss-style', date: '2024-10-05', popularity: 74 },
  { id: 'portfolio', name: 'Split Screen', description: 'Two-column', date: '2024-05-05', popularity: 72 },
  { id: 'horizon', name: 'Double Row', description: 'Two-level nav', date: '2024-02-14', popularity: 70 },
  { id: 'metro', name: 'Tile Style', description: 'Windows-inspired', date: '2024-10-01', popularity: 68 },
  { id: 'stark', name: 'Minimalist', description: 'Ultra-clean', date: '2024-08-20', popularity: 66 },
  { id: 'protocol', name: 'Tech/Gaming', description: 'Cyberpunk style', date: '2024-09-10', popularity: 65 },
  { id: 'ghost', name: 'Hidden Menu', description: 'Hover menu', date: '2024-11-01', popularity: 62 },
  { id: 'studio', name: 'Sidebar Nav', description: 'Left navigation', date: '2024-01-20', popularity: 60 },
  { id: 'offset', name: 'Asymmetric', description: 'Off-center', date: '2024-03-01', popularity: 58 },
  { id: 'terminal', name: 'Developer', description: 'Code-inspired', date: '2024-04-01', popularity: 55 },
  { id: 'ticker', name: 'News Ticker', description: 'Scrolling bar', date: '2024-06-01', popularity: 50 },
  { id: 'pathfinder', name: 'Pathfinder', description: 'SVG path animation', date: '2025-01-05', popularity: 73 },
  { id: 'cypher', name: 'Cypher', description: 'Glitch text effect', date: '2025-01-05', popularity: 71 },
  { id: 'particle', name: 'Particle', description: 'Interactive particles', date: '2025-01-05', popularity: 75 },
  { id: 'lumina', name: 'Lumina', description: 'Mouse spotlight', date: '2025-01-05', popularity: 69 },
  { id: 'aqua', name: 'Aqua', description: 'Liquid glass blur', date: '2025-01-05', popularity: 79 },
  { id: 'refined', name: 'Refined', description: 'Clean professional', date: '2025-01-05', popularity: 81 },
];

export const HEADER_FIELDS: Record<string, string[]> = {
  canvas: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'paddingX', 'paddingY'
  ],
  nebula: [
    'showSearch', 'showCart', 'showIndicatorDot',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor',
    'sticky', 'maxWidth', 'blurIntensity'
  ],
  luxe: [
    'showMenu', 'showSearch', 'showAccount', 'showCart', 'showTagline',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'taglineColor', 'taglineText', 'cartBadgeColor',
    'sticky', 'maxWidth'
  ],
  pilot: [
    'showCart', 'showCTA', 'showLogoBadge',
    'backgroundColor', 'textColor', 'textHoverColor', 'accentColor',
    'ctaBackgroundColor', 'ctaHoverColor', 'ctaTextColor', 'ctaText',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  bunker: [], orbit: [], protocol: [], horizon: [],
  studio: [], terminal: [], portfolio: [], venture: [], metro: [], modul: [],
  luxe: [], gullwing: [], pop: [], stark: [], offset: [], ticker: [],
  noir: [], ghost: [], pilot: [],
  pathfinder: ['backgroundColor', 'borderColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  cypher: ['backgroundColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  particle: ['backgroundColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  lumina: ['backgroundColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  aqua: ['backgroundColor', 'borderColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  refined: ['backgroundColor', 'borderColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
};
