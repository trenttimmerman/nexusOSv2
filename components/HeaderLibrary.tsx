import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, Hexagon, Command } from 'lucide-react';
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
  // Ticker (for Bunker header)
  tickerBackgroundColor?: string;
  tickerTextColor?: string;
  tickerBorderColor?: string;
  tickerText?: string;
  // Search features (for Venture header)
  showKeyboardShortcut?: boolean;
  searchPlaceholder?: string;
  // Expandable menu (for Orbit header)
  checkoutButtonText?: string;
  expandedMenuEnabled?: boolean;
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
  showAccount: true,
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
          {settings.showAccount && (
            <button
              className="cursor-pointer transition-colors"
              style={{ color: settings.textColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
              onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
            >
              <User size={18} />
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
  showSearch: true,
  showAccount: true,
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

          {/* Right: Search + Account + Cart + CTA */}
          <div className="hidden md:flex items-center gap-4">
            {settings.showSearch && (
              <button
                className="cursor-pointer transition-colors"
                style={{ color: settings.textColor }}
                onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
              >
                <Search size={20} />
              </button>
            )}
            {settings.showAccount && (
              <button
                className="cursor-pointer transition-colors"
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

// Default values for HeaderBunker
const BUNKER_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  backgroundColor: '#facc15', // yellow-400
  borderColor: '#000000',
  textColor: '#000000',
  textHoverColor: '#facc15',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#facc15',
  tickerBackgroundColor: '#000000',
  tickerTextColor: '#facc15',
  tickerBorderColor: '#000000',
  tickerText: 'FREE SHIPPING WORLDWIDE — 0% TRANSACTION FEES — NEXUS COMMERCE OS — BUILD THE FUTURE',
  sticky: true,
  maxWidth: 'full',
  paddingX: '24px',
  paddingY: '8px',
};

// 5. Bunker (Bold Contrast, Black & White Brutalist)
export const HeaderBunker: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const merged = { ...BUNKER_DEFAULTS, ...data };
  
  return (
    <header className={`w-full border-b-4 ${merged.sticky ? 'sticky top-0' : ''} z-50 font-mono`} style={{ backgroundColor: merged.backgroundColor, borderColor: merged.borderColor }}>
      <div className="w-full text-xs py-1 px-2 overflow-hidden whitespace-nowrap border-b-2" style={{ backgroundColor: merged.tickerBackgroundColor, color: merged.tickerTextColor, borderColor: merged.tickerBorderColor }}>
        <div className="animate-marquee inline-block">
          {merged.tickerText} — {merged.tickerText} —
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] min-h-[4rem] divide-x-4 divide-black">
        <div className="px-6 py-2 flex items-center bg-white">
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-black uppercase italic transform -skew-x-12" />
        </div>
        <nav className="hidden md:flex items-stretch justify-center" style={{ backgroundColor: merged.backgroundColor }}>
          <div className="flex w-full h-full divide-x-4 divide-black border-l-0">
            {(links || []).map(l => (
              <NavItem key={l.label} link={l} onClick={onLinkClick} className="flex-1 flex items-center justify-center text-sm font-bold uppercase hover:bg-black transition-colors px-4 py-2" style={{ color: merged.textColor }} hoverColor={merged.textHoverColor} />
            ))}
          </div>
        </nav>
        <div className="px-6 py-2 flex items-center justify-center gap-6 bg-white">
          {merged.showSearch && <Search size={24} className="stroke-[3]" style={{ color: merged.textColor }} />}
          {merged.showAccount && <User size={24} className="stroke-[3]" style={{ color: merged.textColor }} />}
          {merged.showCart && (
            <div onClick={onOpenCart} className="relative cursor-pointer">
              <ShoppingBag size={24} className="stroke-[3]" style={{ color: merged.textColor }} />
              <span className="absolute -top-2 -right-2 text-xs font-bold px-1 border-2" style={{ 
                backgroundColor: merged.cartBadgeColor, 
                color: merged.cartBadgeTextColor,
                borderColor: merged.cartBadgeColor 
              }}>{cartCount}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Default values for HeaderPop
const POP_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  backgroundColor: '#F3F4F6', // Light gray background
  borderColor: '#000000',
  textColor: '#000000',
  textHoverColor: '#ffffff',
  accentColor: '#23A094', // Teal hover
  cartBadgeColor: '#FFC900', // Yellow cart button
  cartBadgeTextColor: '#000000',
  sticky: true,
  maxWidth: 'full',
};

// Default values for HeaderVenture
const VENTURE_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  showKeyboardShortcut: true,
  searchPlaceholder: "Search for 'Wireless Headphones' or 'Summer Collection'",
  backgroundColor: '#f5f5f5', // Light neutral background
  borderColor: '#e5e7eb',
  textColor: '#6b7280',
  textHoverColor: '#000000',
  cartBadgeColor: '#ef4444', // Red dot indicator
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

// Default values for HeaderOrbit
const ORBIT_DEFAULTS: HeaderData = {
  showSearch: false,
  showAccount: true,
  showCart: true,
  showIndicatorDot: true,
  expandedMenuEnabled: true,
  checkoutButtonText: 'Checkout',
  backgroundColor: '#171717', // Dark neutral-900
  borderColor: '#262626',
  textColor: '#ffffff',
  textHoverColor: '#22c55e', // Green-400 hover
  accentColor: '#22c55e', // Green-500 indicator dot
  cartBadgeColor: '#ffffff',
  cartBadgeTextColor: '#000000',
  sticky: true,
  maxWidth: '7xl',
};

// Default values for HeaderGullwing
const GULLWING_DEFAULTS: HeaderData = {
  showSearch: false,
  showAccount: false,
  showCart: true,
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#6b7280',
  textHoverColor: '#000000',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: '7xl',
};

// 6. HeaderPop - "Playful Modern" (Fun, friendly, colorful with shadows)
export const HeaderPop: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const merged = { ...POP_DEFAULTS, ...data };
  
  return (
    <header className={`w-full p-4 ${merged.sticky ? 'sticky top-0' : ''} z-50`} style={{ backgroundColor: merged.backgroundColor }}>
      <div className="bg-white border-2 rounded-xl min-h-[4rem] py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center px-4 justify-between" style={{ borderColor: merged.borderColor }}>
        <div className="bg-[#FF90E8] border-2 px-4 py-1 rounded-full font-black text-sm uppercase transform -rotate-2" style={{ borderColor: merged.borderColor }}>
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} />
        </div>

        <nav className="hidden md:flex gap-2">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="px-4 py-1.5 rounded-lg border-2 border-transparent hover:border-black font-bold text-sm transition-all" 
              style={{ color: merged.textColor }}
              hoverColor={merged.textHoverColor}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {merged.showSearch && (
            <button className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-neutral-100 transition-colors" style={{ borderColor: merged.borderColor, color: merged.textColor }}>
              <Search size={18} />
            </button>
          )}
          {merged.showAccount && (
            <button className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-neutral-100 transition-colors" style={{ borderColor: merged.borderColor, color: merged.textColor }}>
              <User size={18} />
            </button>
          )}
          {merged.showCart && (
            <button 
              onClick={onOpenCart} 
              className="px-4 py-1.5 rounded-full border-2 font-bold text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all" 
              style={{ 
                backgroundColor: merged.cartBadgeColor, 
                borderColor: merged.borderColor,
                color: merged.cartBadgeTextColor 
              }}
            >
              <ShoppingBag size={16} /> Cart ({cartCount})
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// 7. HeaderVenture - "Search-First" (Large search bar for large catalogs)
export const HeaderVenture: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const merged = { ...VENTURE_DEFAULTS, ...data };
  
  return (
    <header className={`w-full border-b ${merged.sticky ? 'sticky top-0' : ''} z-50`} style={{ backgroundColor: merged.backgroundColor, borderColor: merged.borderColor }}>
      <div className={`max-w-[1600px] mx-auto p-2`}>
        <div className="bg-white rounded-2xl border shadow-sm p-2 flex items-center justify-between gap-4 min-h-[4rem]" style={{ borderColor: merged.borderColor }}>
          <div className="px-4 flex items-center gap-2">
            {!logoUrl && (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                {storeName.charAt(0)}
              </div>
            )}
            <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold text-lg tracking-tight hidden sm:block" onClick={onLinkClick} />
          </div>
          
          {/* Large Search Bar */}
          {merged.showSearch && (
            <div className="flex-1 max-w-2xl bg-neutral-50 rounded-xl flex items-center px-4 py-2.5 gap-3 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Search size={18} className="text-neutral-400" />
              <input 
                type="text" 
                placeholder={merged.searchPlaceholder || "Search..."} 
                className="bg-transparent w-full focus:outline-none text-sm" 
              />
              {merged.showKeyboardShortcut && (
                <div className="hidden md:flex items-center gap-1 text-xs text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">
                  <Command size={10} />
                  <span>K</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 pr-2">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center mr-4">
              {(links || []).map(l => (
                <NavItem 
                  key={l.href} 
                  link={l} 
                  onClick={onLinkClick} 
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                  style={{ color: merged.textColor }}
                  hoverColor={merged.textHoverColor}
                />
              ))}
            </nav>
            
            {/* Cart Icon */}
            {merged.showCart && (
              <button onClick={onOpenCart} className="relative p-2.5 hover:bg-neutral-100 rounded-xl transition-colors" style={{ color: merged.textColor }}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: merged.cartBadgeColor }}></span>
                )}
              </button>
            )}
            
            {/* Account Icon */}
            {merged.showAccount && (
              <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors" style={{ color: merged.textColor }}>
                <User size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// 8. HeaderOrbit - "Interactive" (Hover expandable menu with animations)
export const HeaderOrbit: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const merged = { ...ORBIT_DEFAULTS, ...data };
  const [expanded, setExpanded] = useState(false);

  return (
    <header className={`${merged.sticky ? 'sticky top-0' : ''} z-[100] flex justify-center pointer-events-none pt-6`}>
      <div 
        className={`pointer-events-auto shadow-2xl transition-all duration-300 ease-out overflow-hidden ${expanded ? 'w-[600px] rounded-3xl' : 'w-[400px] min-h-[3.5rem] py-2 rounded-full'}`}
        style={{ 
          backgroundColor: merged.backgroundColor,
          borderColor: merged.borderColor,
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
        onMouseEnter={() => merged.expandedMenuEnabled && setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Collapsed Header */}
        <div className="w-full flex items-center justify-between px-6" style={{ 
          transition: 'opacity 0.2s ease-out',
          opacity: expanded ? 0.3 : 1 
        }}>
          <div className="flex items-center gap-2 py-1">
            {merged.showIndicatorDot && !logoUrl && (
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: merged.accentColor }}></div>
            )}
            <Logo 
              storeName={storeName} 
              logoUrl={logoUrl} 
              logoHeight={logoHeight} 
              className="font-bold" 
              onClick={onLinkClick}
            />
          </div>
          
          {!expanded && (
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <span>Menu</span>
              <div className="w-px h-4 bg-neutral-700"></div>
              {merged.showCart && (
                <span 
                  onClick={onOpenCart} 
                  className="flex items-center gap-1 cursor-pointer" 
                  style={{ color: merged.textColor }}
                >
                  <ShoppingBag size={14}/> {cartCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Expanded Content */}
        <div 
          className="px-6 pb-6 pt-2 grid grid-cols-2 gap-8"
          style={{
            transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
            opacity: expanded ? 1 : 0,
            transform: expanded ? 'translateY(0)' : 'translateY(-10px)',
            pointerEvents: expanded ? 'auto' : 'none'
          }}
        >
          {merged.expandedMenuEnabled && (
            <>
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Navigation</span>
                {(links || []).map(l => (
                  <NavItem 
                    key={l.href} 
                    link={l} 
                    onClick={onLinkClick} 
                    className="text-lg font-medium transition-colors"
                    style={{ color: merged.textColor }}
                    hoverColor={merged.textHoverColor}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Account</span>
                {merged.showAccount && (
                  <>
                    <a href="#" className="text-sm text-neutral-300 hover:text-white">Orders</a>
                    <a href="#" className="text-sm text-neutral-300 hover:text-white">Wishlist</a>
                  </>
                )}
                {merged.showCart && (
                  <div className="mt-auto pt-4 border-t border-neutral-800 flex justify-between items-center">
                    <span className="text-sm text-neutral-400">Cart ({cartCount})</span>
                    <button 
                      onClick={onOpenCart} 
                      className="px-4 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: merged.cartBadgeColor, 
                        color: merged.cartBadgeTextColor 
                      }}
                    >
                      {merged.checkoutButtonText || 'Checkout'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// 9. HeaderGullwing - "Centered Logo" (Symmetrical split navigation with centered logo)
export const HeaderGullwing: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const merged = { ...GULLWING_DEFAULTS, ...data };
  const maxWidthClass = `max-w-${merged.maxWidth}`;
  
  return (
    <header className={`w-full ${merged.sticky ? 'sticky top-0' : ''} z-50 shadow-sm`} style={{ backgroundColor: merged.backgroundColor }}>
      <div className={`${maxWidthClass} mx-auto min-h-[5rem] py-4 px-8 flex items-center justify-between`}>
        {/* Left Navigation (first 2 links) */}
        <nav className="flex-1 flex justify-end gap-8 pr-12">
          {(links || []).slice(0, 2).map(l => (
            <NavItem 
              key={l.href} 
              link={l} 
              onClick={onLinkClick} 
              className="text-sm font-bold transition-colors"
              style={{ color: merged.textColor }}
              hoverColor={merged.textHoverColor}
            />
          ))}
        </nav>
        
        {/* Centered Logo with Skewed Container */}
        <div className="shrink-0 flex items-center justify-center px-4 py-2 text-white transform -skew-x-12" style={{ backgroundColor: merged.cartBadgeColor }}>
          <div className="skew-x-12">
            <Logo 
              storeName={storeName} 
              logoUrl={logoUrl} 
              logoHeight={logoHeight} 
              className="font-display font-bold text-2xl tracking-tighter" 
              onClick={onLinkClick}
            />
          </div>
        </div>

        {/* Right Navigation (remaining links) + Cart */}
        <div className="flex-1 flex justify-between items-center pl-12">
          <nav className="flex gap-8">
            {(links || []).slice(2).map(l => (
              <NavItem 
                key={l.href} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-bold transition-colors"
                style={{ color: merged.textColor }}
                hoverColor={merged.textHoverColor}
              />
            ))}
          </nav>
          
          {merged.showCart && (
            <div 
              onClick={onOpenCart} 
              className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity"
              style={{ color: merged.textColor }}
            >
              <ShoppingBag size={20} />
              <span className="font-mono text-sm">[{cartCount}]</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Other headers still use placeholder - restore from HeaderLibrary.archive.tsx as needed
export const HeaderProtocol = PlaceholderHeader;
export const HeaderHorizon = PlaceholderHeader;
export const HeaderStudio = PlaceholderHeader;
export const HeaderTerminal = PlaceholderHeader;
export const HeaderPortfolio = PlaceholderHeader;
export const HeaderMetro = PlaceholderHeader;
export const HeaderModul = PlaceholderHeader;
export const HeaderStark = PlaceholderHeader;
export const HeaderOffset = PlaceholderHeader;
export const HeaderTicker = PlaceholderHeader;
export const HeaderNoir = PlaceholderHeader;
export const HeaderGhost = PlaceholderHeader;

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
  bunker: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'tickerBackgroundColor', 'tickerTextColor', 'tickerBorderColor', 'tickerText',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  pop: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  venture: [
    'showSearch', 'showAccount', 'showCart', 'showKeyboardShortcut',
    'searchPlaceholder', 'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  orbit: [
    'showAccount', 'showCart', 'showIndicatorDot', 'expandedMenuEnabled',
    'checkoutButtonText', 'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  gullwing: [
    'showCart', 'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  // Placeholders for remaining headers
  protocol: [], horizon: [], studio: [], terminal: [], 
  portfolio: [], metro: [], modul: [], stark: [], 
  offset: [], ticker: [], noir: [], ghost: [],
};
