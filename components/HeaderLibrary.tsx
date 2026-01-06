import React from 'react';
import { ShoppingBag, Search, User, Menu, Hexagon, X } from 'lucide-react';
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
  onSearchClick?: () => void;
  isSearchOpen?: boolean;
  onSearchClose?: () => void;
  onSearchSubmit?: (query: string) => void;
  primaryColor?: string;
  secondaryColor?: string;
  data?: HeaderData; // Per-header customization
}

// Inline Search Input Component
const InlineSearch: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (query: string) => void;
  className?: string;
  inputClassName?: string;
  iconColor?: string;
}> = ({ isOpen, onClose, onSubmit, className = '', inputClassName = '', iconColor }) => {
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    if (!isOpen) setQuery('');
  }, [isOpen]);

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit?.(query.trim());
      onClose();
    }
  };

  return (
    <div className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${className}`}
      style={{ width: isOpen ? '200px' : '0px', opacity: isOpen ? 1 : 0 }}
    >
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className={`w-full text-sm outline-none bg-transparent ${inputClassName}`}
        />
        <button type="button" onClick={onClose} className="p-1 hover:opacity-70 transition-opacity flex-shrink-0">
          <X size={14} style={{ color: iconColor }} />
        </button>
      </form>
    </div>
  );
};

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
  onSearchClick,
  isSearchOpen,
  onSearchClose,
  onSearchSubmit,
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
            <div className="flex items-center">
              <InlineSearch
                isOpen={isSearchOpen || false}
                onClose={onSearchClose || (() => {})}
                onSubmit={onSearchSubmit}
                inputClassName="border-b border-neutral-300 px-2 py-1"
                iconColor={settings.textColor}
              />
              {!isSearchOpen && (
                <button
                  onClick={onSearchClick}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: settings.textColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
                >
                  <Search size={20} />
                </button>
              )}
            </div>
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
  onSearchClick,
  isSearchOpen,
  onSearchClose,
  onSearchSubmit,
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
            <div className="flex items-center">
              <InlineSearch
                isOpen={isSearchOpen || false}
                onClose={onSearchClose || (() => {})}
                onSubmit={onSearchSubmit}
                inputClassName="border-b border-neutral-300 px-2 py-1"
                iconColor={settings.textColor}
              />
              {!isSearchOpen && (
                <button
                  onClick={onSearchClick}
                  className="cursor-pointer transition-colors"
                  style={{ color: settings.textColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
                >
                  <Search size={18} />
                </button>
              )}
            </div>
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
  onSearchClick,
  isSearchOpen,
  onSearchClose,
  onSearchSubmit,
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
              <div className="flex items-center">
                <InlineSearch
                  isOpen={isSearchOpen || false}
                  onClose={onSearchClose || (() => {})}
                  onSubmit={onSearchSubmit}
                  inputClassName="border-b border-neutral-300 px-2 py-1"
                  iconColor={settings.textColor}
                />
                {!isSearchOpen && (
                  <button
                    onClick={onSearchClick}
                    className="transition-colors cursor-pointer"
                    style={{ color: settings.textColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
                  >
                    <Search size={20} />
                  </button>
                )}
              </div>
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
  onSearchClick,
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
        <div className="flex justify-between items-center min-h-[5.5rem] py-3">
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

// 5. HeaderBunker - "Bold Contrast" (Brutalist, High Contrast)
export const HeaderBunker: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full bg-yellow-400 border-b-4 border-black sticky top-0 z-50 font-mono">
    <div className="w-full bg-black text-yellow-400 text-xs py-1 px-2 overflow-hidden whitespace-nowrap">
       <div className="animate-marquee inline-block">
         FREE SHIPPING WORLDWIDE — 0% TRANSACTION FEES — NEXUS COMMERCE OS — BUILD THE FUTURE — 
         FREE SHIPPING WORLDWIDE — 0% TRANSACTION FEES — NEXUS COMMERCE OS — BUILD THE FUTURE —
       </div>
    </div>
    <div className="grid grid-cols-[auto_1fr_auto] min-h-[5.5rem] divide-x-4 divide-black">
      <div className="px-6 py-2 flex items-center bg-white">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-black uppercase italic transform -skew-x-12" />
      </div>
      <nav className="hidden md:flex items-stretch justify-center bg-yellow-400">
        <div className="flex w-full h-full divide-x-4 divide-black border-l-0">
          {(links || []).map(l => (
            <NavItem key={l.href} link={l} onClick={onLinkClick} className="flex-1 flex items-center justify-center text-sm font-bold uppercase hover:bg-black hover:text-yellow-400 transition-colors px-4 py-2" />
          ))}
        </div>
      </nav>
      <div className="px-6 py-2 flex items-center justify-center gap-6 bg-white">
        <div className="flex items-center">
          <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b border-black px-2 py-1" iconColor="#000" />
          {!isSearchOpen && <button onClick={onSearchClick} className="hover:text-yellow-600 transition-colors"><Search size={24} className="stroke-[3]" /></button>}
        </div>
        <button className="hover:text-yellow-600 transition-colors"><User size={24} className="stroke-[3]" /></button>
        <div onClick={onOpenCart} className="relative cursor-pointer hover:text-yellow-600 transition-colors">
           <ShoppingBag size={24} className="stroke-[3]" />
           <span className="absolute -top-2 -right-2 bg-black text-yellow-400 text-xs font-bold px-1 border-2 border-black">{cartCount}</span>
        </div>
      </div>
    </div>
  </header>
);

// 7. HeaderProtocol - "Tech/Gaming" (Cyberpunk/Brutalist)
export const HeaderProtocol: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="sticky top-0 z-50 bg-yellow-400 border-b-4 border-black font-mono">
    <div className="max-w-7xl mx-auto px-4 min-h-[5.5rem] py-2 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-black uppercase tracking-tighter" />
        <nav className="hidden md:flex gap-6">
          {(links || []).map(l => (
            <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-bold uppercase hover:underline decoration-2 underline-offset-4" />
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b-2 border-black px-2 py-1" iconColor="#000" />
          {!isSearchOpen && <button onClick={onSearchClick} className="p-1 hover:bg-black hover:text-yellow-400 transition-colors border-2 border-black"><Search size={20} /></button>}
        </div>
        <button className="p-1 hover:bg-black hover:text-yellow-400 transition-colors border-2 border-black">
          <User size={20} />
        </button>
        <div onClick={onOpenCart} className="relative cursor-pointer border-2 border-black p-1 hover:bg-black hover:text-yellow-400 transition-colors">
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </div>
  </header>
);

// 8. HeaderHorizon - "Double Row" (Double Decker, Editorial)
export const HeaderHorizon: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full sticky top-0 z-50">
    <div className="bg-neutral-900 text-white py-2 px-6 flex justify-between items-center text-xs font-medium tracking-wide">
      <div className="flex gap-4">
         <span>Currency: USD</span>
         <span>Language: EN</span>
      </div>
      <span>Free Express Shipping on Orders Over $100</span>
      <div className="flex gap-4">
         <a href="#" className="hover:underline">Support</a>
         <a href="#" className="hover:underline">Sign In</a>
      </div>
    </div>
    <div className="bg-white border-b border-neutral-200 py-6 px-8 flex items-center justify-between">
       <Menu size={24} className="md:hidden" />
       <nav className="hidden md:flex gap-8">
          {(links || []).slice(0, 2).map(l => (
            <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-bold uppercase tracking-wider hover:underline underline-offset-4" />
          ))}
       </nav>
       
       <div className="absolute left-1/2 transform -translate-x-1/2">
         <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-3xl font-serif italic" />
       </div>

       <nav className="hidden md:flex gap-8">
          {(links || []).slice(2).map(l => (
            <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-bold uppercase tracking-wider hover:underline underline-offset-4" />
          ))}
       </nav>
       
       <div className="flex items-center gap-4">
         <div className="flex items-center">
           <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b border-neutral-300 px-2 py-1" iconColor="#525252" />
           {!isSearchOpen && <Search size={20} onClick={onSearchClick} className="cursor-pointer hover:text-neutral-600 transition-colors" />}
         </div>
         <User size={20} className="cursor-pointer hover:text-neutral-600 transition-colors" />
         <div onClick={onOpenCart} className="flex items-center gap-1 font-bold text-sm cursor-pointer hover:text-neutral-600 transition-colors">
           <ShoppingBag size={20} />
           <span>({cartCount})</span>
         </div>
       </div>
    </div>
  </header>
);

// 10. HeaderTerminal - "Developer" (Code editor style)
export const HeaderTerminal: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono sticky top-0 z-50 border-b border-[#3c3c3c]">
    <div className="flex items-center h-10 px-4 bg-[#252526] text-xs border-b border-[#1e1e1e]">
       <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
       </div>
       <span className="opacity-50">root@nexus:~/storefront</span>
    </div>
    <div className="p-4 flex items-center justify-between">
       <div className="flex items-center gap-2 text-sm">
         <span className="text-[#569cd6]">const</span>
         <span className="text-[#4fc1ff]">store</span>
         <span className="text-[#d4d4d4]">=</span>
         {logoUrl ? <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} /> : <span className="text-[#ce9178]">"{storeName}"</span>}
         <span className="text-[#d4d4d4]">;</span>
       </div>

       <nav className="flex gap-6 text-sm">
          {(links || []).map(l => (
             <NavItem key={l.href} link={l} onClick={onLinkClick} className="hover:text-white transition-colors flex gap-1">
               <span className="text-[#c586c0]">import</span>
               <span>{l.label}</span>
             </NavItem>
          ))}
       </nav>

       <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center">
            <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-[#3c3c3c] border-b border-[#569cd6] px-2 py-1 text-white" iconColor="#d4d4d4" />
            {!isSearchOpen && <button onClick={onSearchClick} className="hover:text-white transition-colors flex items-center gap-1"><span className="text-[#569cd6]">fn</span><Search size={16} /></button>}
          </div>
          <button className="hover:text-white transition-colors flex items-center gap-1">
            <span className="text-[#569cd6]">fn</span>
            <User size={16} />
          </button>
          <div onClick={onOpenCart} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
            <span className="text-[#6a9955]">// Cart: {cartCount}</span>
            <ShoppingBag size={16} />
          </div>
       </div>
    </div>
  </header>
);

// 11. HeaderPortfolio - "Split Screen" (Big Typography)
export const HeaderPortfolio: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full bg-white sticky top-0 z-50 mix-blend-difference text-white">
     <div className="grid grid-cols-3 md:grid-cols-5 min-h-[5.5rem] border-b border-white/20">
        <div className="flex items-center px-6 py-2 border-r border-white/20">
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-xl font-bold tracking-tight uppercase" />
        </div>
        <div className="hidden md:flex items-center border-r border-white/20">
           {(links || []).slice(0, 3).map(l => (
              <NavItem key={l.href} link={l} onClick={onLinkClick} className="flex-1 h-full flex items-center justify-center hover:bg-white hover:text-black transition-colors text-xs uppercase font-bold border-r border-white/20 last:border-none" />
           ))}
        </div>
        <div className="hidden md:flex items-center px-6 border-r border-white/20 justify-center gap-4">
           <div className="flex items-center">
             <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b border-white/50 px-2 py-1" iconColor="#fff" />
             {!isSearchOpen && <button onClick={onSearchClick} className="hover:bg-white hover:text-black p-2 transition-colors"><Search size={18} /></button>}
           </div>
           <button className="hover:bg-white hover:text-black p-2 transition-colors"><User size={18} /></button>
        </div>
        <div onClick={onOpenCart} className="col-span-2 md:col-span-1 flex items-center justify-between px-6 py-2 cursor-pointer hover:bg-white hover:text-black transition-colors">
           <span className="text-xs font-bold uppercase">Cart</span>
           <span className="text-4xl font-display">{cartCount.toString().padStart(2, '0')}</span>
        </div>
     </div>
  </header>
);

// 12. HeaderVenture - "Search-First" (Utility First, Search Dominant)
export const HeaderVenture: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick }) => (
  <header className="w-full bg-neutral-100 border-b border-neutral-200 sticky top-0 z-50">
    <div className="max-w-[1600px] mx-auto p-2">
       <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-2 flex items-center justify-between gap-4 min-h-[5.5rem]">
          <div className="px-4 flex items-center gap-2">
             {!logoUrl && (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {storeName.charAt(0)}
                </div>
             )}
             <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold text-lg tracking-tight hidden sm:block" />
          </div>
          
          <div className="flex-1 max-w-2xl bg-neutral-50 rounded-xl flex items-center px-4 py-2.5 gap-3 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
             <Search size={18} className="text-neutral-400" />
             <input type="text" placeholder="Search for 'Wireless Headphones' or 'Summer Collection'" className="bg-transparent w-full focus:outline-none text-sm" />
          </div>

          <div className="flex items-center gap-1 pr-2">
             <nav className="hidden md:flex items-center mr-4">
                {(links || []).map(l => (
                  <NavItem key={l.href} link={l} onClick={onLinkClick} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black rounded-lg hover:bg-neutral-50 transition-colors" />
                ))}
             </nav>
             <button onClick={onOpenCart} className="relative p-2.5 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-700">
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
             </button>
             <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-700">
                <User size={20} />
             </button>
          </div>
       </div>
    </div>
  </header>
);

// 13. HeaderMetro - "Tile Style" (Windows Phone Vibe)
export const HeaderMetro: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
    <div className="grid grid-cols-8 md:grid-cols-12 min-h-[5.5rem] divide-x divide-neutral-100 border-b border-neutral-100">
      <div className="col-span-2 md:col-span-3 flex items-center justify-center bg-blue-600 text-white font-bold text-xl tracking-tighter overflow-hidden py-2 px-4">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} />
      </div>
      {(links || []).map(l => (
        <NavItem key={l.href} link={l} onClick={onLinkClick} className="hidden md:flex col-span-2 items-center justify-center text-sm font-bold uppercase text-neutral-500 hover:bg-neutral-50 hover:text-black transition-colors py-2" />
      ))}
      <div className="col-span-2 md:col-span-1 flex items-center justify-center hover:bg-neutral-50 cursor-pointer py-2">
         <div className="flex items-center">
           <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b border-neutral-300 px-2 py-1" iconColor="#525252" />
           {!isSearchOpen && <Search size={20} onClick={onSearchClick} className="text-neutral-600 cursor-pointer" />}
         </div>
      </div>
      <div className="col-span-2 md:col-span-1 flex items-center justify-center hover:bg-neutral-50 cursor-pointer py-2">
         <User size={20} className="text-neutral-600" />
      </div>
      <div onClick={onOpenCart} className="col-span-2 flex items-center justify-center bg-black text-white cursor-pointer hover:bg-neutral-800 transition-colors gap-2 py-2">
         <ShoppingBag size={20} />
         <span className="font-bold">{cartCount}</span>
      </div>
    </div>
  </header>
);

// 14. HeaderModul - "Grid Layout" (Swiss Style, Grid)
export const HeaderModul: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full border-b border-black sticky top-0 z-50 bg-white font-sans">
    <div className="flex min-h-[5.5rem]">
      <div className="w-48 border-r border-black flex items-center px-4 py-2 font-bold text-lg shrink-0">
         <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} />
      </div>
      <nav className="flex-1 flex overflow-hidden">
         {(links || []).map(l => (
           <NavItem key={l.href} link={l} onClick={onLinkClick} className="flex-1 border-r border-black flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors px-2 py-2" />
         ))}
      </nav>
      <div className="w-14 border-r border-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer py-2">
         <div className="flex items-center">
           <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b border-black px-2 py-1" iconColor="#000" />
           {!isSearchOpen && <Search size={18} onClick={onSearchClick} className="cursor-pointer" />}
         </div>
      </div>
      <div className="w-14 border-r border-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer py-2">
         <User size={18} />
      </div>
      <div onClick={onOpenCart} className="w-20 flex items-center justify-center hover:bg-neutral-100 cursor-pointer gap-1 py-2">
         <ShoppingBag size={18} />
         <span className="text-xs font-bold">({cartCount})</span>
      </div>
    </div>
  </header>
);

// 15. HeaderGullwing - "Centered Logo" (Symmetrical Split)
export const HeaderGullwing: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto min-h-[5rem] py-4 px-8 flex items-center justify-between">
       <nav className="flex-1 flex justify-end gap-8 pr-12">
          {(links || []).slice(0, 2).map(l => (
             <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-bold text-neutral-600 hover:text-black transition-colors" />
          ))}
       </nav>
       
       <div className="shrink-0 flex items-center justify-center px-4 py-2 bg-black text-white transform -skew-x-12">
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-display font-bold text-2xl tracking-tighter" />
       </div>

       <div className="flex-1 flex justify-between items-center pl-12">
          <nav className="flex gap-8">
             {(links || []).slice(2).map(l => (
                <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-bold text-neutral-600 hover:text-black transition-colors" />
             ))}
          </nav>
          <div className="flex items-center gap-4">
             <div className="flex items-center">
               <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b border-neutral-300 px-2 py-1" iconColor="#525252" />
               {!isSearchOpen && <button onClick={onSearchClick} className="hover:text-neutral-600 transition-colors"><Search size={20} /></button>}
             </div>
             <button className="hover:text-neutral-600 transition-colors"><User size={20} /></button>
             <div onClick={onOpenCart} className="flex items-center gap-2 cursor-pointer hover:text-neutral-600 transition-colors">
                <ShoppingBag size={20} />
                <span className="font-mono text-sm">[{cartCount}]</span>
             </div>
          </div>
       </div>
    </div>
  </header>
);

// 16. HeaderPop - "Playful Modern" (Neo-Brutalist, Soft)
export const HeaderPop: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full bg-[#F3F4F6] sticky top-0 z-50 p-4">
     <div className="bg-white border-2 border-black rounded-xl min-h-[5.5rem] py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center px-4 justify-between">
        <div className="bg-[#FF90E8] border-2 border-black px-4 py-1 rounded-full font-black text-sm uppercase transform -rotate-2">
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} />
        </div>

        <nav className="hidden md:flex gap-2">
           {(links || []).map(l => (
              <NavItem key={l.href} link={l} onClick={onLinkClick} className="px-4 py-1.5 rounded-lg border-2 border-transparent hover:border-black hover:bg-[#23A094] hover:text-white font-bold text-sm transition-all" />
           ))}
        </nav>

        <div className="flex items-center gap-2">
           <div className="flex items-center">
             <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b-2 border-black px-2 py-1" iconColor="#000" />
             {!isSearchOpen && <button onClick={onSearchClick} className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-neutral-100"><Search size={18} /></button>}
           </div>
           <button className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-neutral-100">
              <User size={18} />
           </button>
           <button onClick={onOpenCart} className="bg-[#FFC900] px-4 py-1.5 rounded-full border-2 border-black font-bold text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all">
              <ShoppingBag size={16} /> Cart ({cartCount})
           </button>
        </div>
     </div>
  </header>
);

// 17. HeaderStark - "Minimalist" (High Contrast, Black & White)
export const HeaderStark: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full bg-black text-white sticky top-0 z-50">
     <div className="flex flex-col md:flex-row items-center justify-between p-6">
        <div className="mb-4 md:mb-0">
            <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight ? logoHeight * 1.5 : 48} className="text-4xl md:text-5xl font-black tracking-tighter leading-none" />
        </div>
        <div className="flex flex-col md:items-end gap-2">
           <nav className="flex gap-6">
              {(links || []).map(l => (
                 <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-medium hover:underline decoration-2 underline-offset-4" />
              ))}
           </nav>
           <div className="flex items-center gap-2 text-xs text-neutral-400">
              <div className="flex items-center">
                <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-black border-b border-white px-2 py-1 text-white" iconColor="#a3a3a3" />
                {!isSearchOpen && <span onClick={onSearchClick} className="cursor-pointer hover:text-white transition-colors">SEARCH</span>}
              </div>
              <span>/</span>
              <span>LOGIN</span>
              <span>/</span>
              <span onClick={onOpenCart} className="cursor-pointer hover:text-white transition-colors">CART ({cartCount})</span>
           </div>
        </div>
     </div>
  </header>
);

// 18. HeaderOffset - "Asymmetric" (Asymmetrical)
export const HeaderOffset: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full bg-white sticky top-0 z-50 pt-4 px-4 pb-0">
     <div className="flex justify-between items-start mb-4">
        <Logo storeName={`${storeName}.`} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-bold" />
        <div className="flex gap-4">
           <div className="flex items-center">
             <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b border-neutral-300 px-2 py-1" iconColor="#525252" />
             {!isSearchOpen && <button onClick={onSearchClick} className="hover:text-neutral-600 transition-colors"><Search size={20} /></button>}
           </div>
           <button className="hover:text-neutral-600 transition-colors"><User size={20} /></button>
           <div onClick={onOpenCart} className="relative cursor-pointer hover:text-neutral-600 transition-colors">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
           </div>
        </div>
     </div>
     <div className="flex justify-end">
        <nav className="bg-neutral-100 rounded-t-xl px-8 py-3 flex gap-8">
           {(links || []).map(l => (
              <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-medium text-neutral-600 hover:text-black" />
           ))}
        </nav>
     </div>
     <div className="h-px w-full bg-neutral-200"></div>
  </header>
);

// 19. HeaderTicker - "News Ticker" (Stock Market Vibe)
export const HeaderTicker: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full sticky top-0 z-50 bg-white">
     <div className="bg-blue-600 text-white text-xs font-mono py-1 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
           BTC +2.4% • ETH -1.2% • NEXUS +150% • NEW DROPS LIVE • WORLDWIDE SHIPPING • BTC +2.4% • ETH -1.2% • NEXUS +150% •
        </div>
     </div>
     <div className="border-b border-blue-600 min-h-[5.5rem] py-2 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold text-lg tracking-tight" />
        </div>
        <nav className="hidden md:flex gap-6 h-full">
           {(links || []).map(l => (
              <NavItem key={l.href} link={l} onClick={onLinkClick} className="h-full flex items-center border-b-2 border-transparent hover:border-blue-600 text-sm font-medium transition-colors px-2" />
           ))}
        </nav>
        <div className="flex items-center gap-2">
           <div className="flex items-center">
             <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="border-b border-blue-600 px-2 py-1" iconColor="#1d4ed8" />
             {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:bg-blue-100 rounded transition-colors text-blue-700"><Search size={18} /></button>}
           </div>
           <button className="p-2 hover:bg-blue-100 rounded transition-colors text-blue-700"><User size={18} /></button>
           <button onClick={onOpenCart} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-blue-200 transition-colors">
              <ShoppingBag size={16} /> CART: {cartCount}
           </button>
        </div>
     </div>
  </header>
);

// 20. HeaderNoir - "Dark Mode" (Dark Mode, Glow)
export const HeaderNoir: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="w-full bg-[#050505] text-neutral-400 sticky top-0 z-50 border-b border-white/5 shadow-[0_0_15px_rgba(0,0,0,1)]">
     <div className="max-w-7xl mx-auto min-h-[5rem] py-4 px-6 flex items-center justify-between">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-white text-2xl font-light tracking-[0.2em] shadow-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        <nav className="hidden md:flex gap-8">
           {(links || []).map(l => (
              <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-light hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
           ))}
        </nav>
        <div className="flex items-center gap-6">
           <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-white/30 text-white placeholder-neutral-500 px-2 py-1" iconColor="white" />
           {!isSearchOpen && <button onClick={onSearchClick} className="hover:text-white transition-colors cursor-pointer"><Search size={18} /></button>}
           <button className="hover:text-white transition-colors cursor-pointer"><User size={18} /></button>
           <div onClick={onOpenCart} className="relative cursor-pointer">
              <ShoppingBag size={18} className="hover:text-white transition-colors" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>}
           </div>
        </div>
     </div>
  </header>
);

// 21. HeaderGhost - "Hidden Menu" (Interaction based)
export const HeaderGhost: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit }) => (
  <header className="sticky top-0 left-0 right-0 z-[100] group hover:bg-white/90 hover:backdrop-blur-md transition-all duration-500 py-6 hover:py-4 px-8 flex justify-between items-center">
     <div className="mix-blend-difference text-white group-hover:text-black transition-colors duration-500">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-xl font-bold" />
     </div>

     <nav className="opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-500 flex gap-8">
        {(links || []).map(l => (
           <NavItem key={l.href} link={l} onClick={onLinkClick} className="text-sm font-bold text-black hover:text-blue-600 transition-colors" />
        ))}
     </nav>

     <div className="flex items-center gap-4 mix-blend-difference text-white group-hover:text-black transition-colors duration-500">
        <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-black text-black placeholder-gray-500 px-2 py-1" iconColor="currentColor" />
        {!isSearchOpen && <button onClick={onSearchClick} className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"><Search size={20} /></button>}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"><User size={20} /></button>
        <div onClick={onOpenCart} className="relative cursor-pointer">
           <Menu size={24} className="group-hover:hidden" />
           <ShoppingBag size={24} className="hidden group-hover:block" />
           {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
        </div>
     </div>
  </header>
);

// Header: Pathfinder - SVG path draw animation on scroll
export const HeaderPathfinder: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
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
    <header ref={headerRef} className="sticky top-0 z-[100] min-h-20 py-2">
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
          <div className="flex items-center gap-2">
            <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b px-2 py-1" style={{ borderColor: data?.textColor || '#4b5563', color: data?.textColor || '#4b5563' }} iconColor={data?.textColor || '#4b5563'} />
            {!isSearchOpen && <button onClick={onSearchClick} className="p-2 transition-colors hover:opacity-70" style={{ color: data?.textColor || '#4b5563' }}>
              <Search size={20} />
            </button>}
            <button className="p-2 transition-colors hover:opacity-70" style={{ color: data?.textColor || '#4b5563' }}>
              <User size={20} />
            </button>
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
      </div>
    </header>
  );
};

// Header: Cypher - Glitch text effect on hover
export const HeaderCypher: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
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
            <div className="flex items-center gap-2">
              <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-fuchsia-500/50 text-white placeholder-gray-400 px-2 py-1" iconColor={data?.textColor || '#fff'} />
              {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:opacity-70 transition-opacity" style={{ color: data?.textColor || '#fff' }}>
                <Search size={20} />
              </button>}
              <button className="p-2 hover:opacity-70 transition-opacity" style={{ color: data?.textColor || '#fff' }}>
                <User size={20} />
              </button>
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
        </div>
      </header>
    </>
  );
};

// Header: Particle - Interactive particle canvas background
export const HeaderParticle: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
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
            <div className="flex items-center gap-2">
              <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-white/30 text-white placeholder-gray-400 px-2 py-1" iconColor={data?.textColor || '#fff'} />
              {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:opacity-70 transition-opacity" style={{ color: data?.textColor || '#fff' }}>
                <Search size={20} />
              </button>}
              <button className="p-2 hover:opacity-70 transition-opacity" style={{ color: data?.textColor || '#fff' }}>
                <User size={20} />
              </button>
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
        </div>
      </header>
    </>
  );
};

// Header: Lumina - Mouse-following spotlight effect
export const HeaderLumina: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
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
            <div className="flex items-center gap-2">
              <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-gray-600 text-white placeholder-gray-500 px-2 py-1" iconColor={data?.textColor || '#9ca3af'} />
              {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:text-white transition-colors" style={{ color: data?.textColor || '#9ca3af' }}>
                <Search size={20} />
              </button>}
              <button className="p-2 hover:text-white transition-colors" style={{ color: data?.textColor || '#9ca3af' }}>
                <User size={20} />
              </button>
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
        </div>
      </header>
    </>
  );
};

// Header: Aqua - Liquid glass effect with blur
export const HeaderAqua: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
  return (
    <header 
      className="sticky top-0 z-[100] min-h-20 py-2"
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
          <div className="flex items-center gap-2">
            <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-white/30 text-white placeholder-gray-400 px-2 py-1" iconColor={data?.textColor || '#fff'} />
            {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:opacity-70 transition-opacity" style={{ color: data?.textColor || '#fff' }}>
              <Search size={20} />
            </button>}
            <button className="p-2 hover:opacity-70 transition-opacity" style={{ color: data?.textColor || '#fff' }}>
              <User size={20} />
            </button>
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
      </div>
    </header>
  );
};

// Header: Refined - Clean with animated dropdown menu
export const HeaderRefined: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isScrolled && <div className="h-20" />}
      <header className={`transition-all duration-300 ease-in-out w-full ${
        isScrolled 
          ? 'fixed top-0 left-0 z-[100] backdrop-blur-md shadow-lg' 
          : 'relative border-b'
      }`} style={{ 
        backgroundColor: isScrolled ? `${data?.backgroundColor || '#ffffff'}e6` : (data?.backgroundColor || '#ffffff'),
        borderColor: data?.borderColor || '#e5e7eb'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center min-h-20 py-2">
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
            <div className="flex items-center gap-2">
              <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-gray-300 text-gray-800 placeholder-gray-400 px-2 py-1" iconColor={data?.textColor || '#4b5563'} />
              {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:opacity-70 transition-opacity" style={{ color: data?.textColor || '#4b5563' }}>
                <Search size={20} />
              </button>}
              <button className="p-2 hover:opacity-70 transition-opacity" style={{ color: data?.textColor || '#4b5563' }}>
                <User size={20} />
              </button>
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
        </div>
      </header>
    </>
  );
};

export const HEADER_COMPONENTS: Record<string, React.FC<HeaderProps>> = {
  canvas: HeaderCanvas,
  nebula: HeaderNebula,
  bunker: HeaderBunker,
  protocol: HeaderProtocol,
  horizon: HeaderHorizon,
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
  { id: 'gullwing', name: 'Centered Logo', description: 'Logo in middle', date: '2024-07-15', popularity: 77 },
  { id: 'noir', name: 'Dark Mode', description: 'Dark theme', date: '2024-10-15', popularity: 76 },
  { id: 'modul', name: 'Grid Layout', description: 'Swiss-style', date: '2024-10-05', popularity: 74 },
  { id: 'portfolio', name: 'Split Screen', description: 'Two-column', date: '2024-05-05', popularity: 72 },
  { id: 'horizon', name: 'Double Row', description: 'Two-level nav', date: '2024-02-14', popularity: 70 },
  { id: 'metro', name: 'Tile Style', description: 'Windows-inspired', date: '2024-10-01', popularity: 68 },
  { id: 'stark', name: 'Minimalist', description: 'Ultra-clean', date: '2024-08-20', popularity: 66 },
  { id: 'protocol', name: 'Tech/Gaming', description: 'Cyberpunk style', date: '2024-09-10', popularity: 65 },
  { id: 'ghost', name: 'Hidden Menu', description: 'Hover menu', date: '2024-11-01', popularity: 62 },
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
  bunker: [], protocol: [], horizon: [],
  terminal: [], portfolio: [], venture: [], metro: [], modul: [],
  gullwing: [], pop: [], stark: [], offset: [], ticker: [],
  noir: [], ghost: [],
  pathfinder: ['backgroundColor', 'borderColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  cypher: ['backgroundColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  particle: ['backgroundColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  lumina: ['backgroundColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  aqua: ['backgroundColor', 'borderColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
  refined: ['backgroundColor', 'borderColor', 'textColor', 'cartBadgeColor', 'cartBadgeTextColor'],
};
