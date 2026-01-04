import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, Hexagon, Command } from 'lucide-react';
import { NavLink } from '../types';

// Header customization data structure
export interface HeaderData {
  // Visibility toggles
  showSearch?: boolean;
  showAccount?: boolean;
  showCart?: boolean;
  showCTA?: boolean;
  showMenu?: boolean;
  showTagline?: boolean;
  showLogoBadge?: boolean;
  showIndicatorDot?: boolean;
  // Colors
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textHoverColor?: string;
  accentColor?: string;
  cartBadgeColor?: string;
  cartBadgeTextColor?: string;
  taglineColor?: string;
  // CTA/Button
  ctaBackgroundColor?: string;
  ctaHoverColor?: string;
  ctaTextColor?: string;
  ctaText?: string;
  // Ticker (for Bunker header)
  tickerBackgroundColor?: string;
  tickerTextColor?: string;
  tickerBorderColor?: string;
  tickerText?: string;
  // Tagline (for Luxe header)
  taglineText?: string;
  // Search features (for Venture header)
  showKeyboardShortcut?: boolean;
  searchPlaceholder?: string;
  searchBackgroundColor?: string;
  searchFocusBackgroundColor?: string;
  searchFocusBorderColor?: string;
  searchInputTextColor?: string;
  searchPlaceholderColor?: string;
  // Glass effect (for Nebula header)
  blurIntensity?: string;
  // Expandable menu (for Orbit header)
  checkoutButtonText?: string;
  expandedMenuEnabled?: boolean;
  // Utility bar (for Horizon header)
  utilityBarBackgroundColor?: string;
  utilityBarTextColor?: string;
  // Hover and effect controls
  buttonHoverBackgroundColor?: string;
  glowIntensity?: number; // 0-100 for opacity percentages
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
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#3b82f6',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
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
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  
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
            <>
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: settings.textColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
                >
                  <Search size={20} />
                </button>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder={settings.searchPlaceholder || "Search products..."}
                    autoFocus
                    onBlur={(e) => {
                      // Small delay to allow clicks to register
                      setTimeout(() => {
                        setSearchOpen(false);
                        setSearchFocused(false);
                      }, 150);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    className="w-64 px-4 py-2 pr-10 text-sm rounded-full border transition-all"
                    style={{
                      backgroundColor: searchFocused ? settings.searchFocusBackgroundColor : settings.searchBackgroundColor,
                      borderColor: searchFocused ? settings.searchFocusBorderColor : 'transparent',
                      color: settings.searchInputTextColor,
                    }}
                  />
                  <Search 
                    size={16} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: settings.searchPlaceholderColor }}
                  />
                </div>
              )}
            </>
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
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#3b82f6',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
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
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  
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
            <>
              {!searchOpen ? (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="cursor-pointer transition-colors"
                  style={{ color: settings.textColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
                >
                  <Search size={18} />
                </button>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder={settings.searchPlaceholder || "Search products..."}
                    autoFocus
                    onBlur={() => {
                      setTimeout(() => {
                        setSearchOpen(false);
                        setSearchFocused(false);
                      }, 150);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    className="w-56 px-4 py-1.5 pr-10 text-sm rounded-full border transition-all"
                    style={{
                      backgroundColor: searchFocused ? settings.searchFocusBackgroundColor : settings.searchBackgroundColor,
                      borderColor: searchFocused ? settings.searchFocusBorderColor : 'transparent',
                      color: settings.searchInputTextColor,
                    }}
                  />
                  <Search 
                    size={14} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: settings.searchPlaceholderColor }}
                  />
                </div>
              )}
            </>
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
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#d4af37',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
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
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  
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
              <>
                {!searchOpen ? (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="transition-colors cursor-pointer"
                    style={{ color: settings.textColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
                  >
                    <Search size={20} />
                  </button>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={settings.searchPlaceholder || "Search products..."}
                      autoFocus
                      onBlur={() => {
                        setTimeout(() => {
                          setSearchOpen(false);
                          setSearchFocused(false);
                        }, 150);
                      }}
                      onFocus={() => setSearchFocused(true)}
                      className="w-56 px-4 py-1.5 pr-10 text-sm rounded-md border transition-all"
                      style={{
                        backgroundColor: searchFocused ? settings.searchFocusBackgroundColor : settings.searchBackgroundColor,
                        borderColor: searchFocused ? settings.searchFocusBorderColor : settings.borderColor,
                        color: settings.searchInputTextColor,
                      }}
                    />
                    <Search 
                      size={14} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: settings.searchPlaceholderColor }}
                    />
                  </div>
                )}
              </>
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
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#4f46e5',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
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
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
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
              <>
                {!searchOpen ? (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="cursor-pointer transition-colors"
                    style={{ color: settings.textColor }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
                  >
                    <Search size={20} />
                  </button>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={settings.searchPlaceholder || "Search products..."}
                      autoFocus
                      onBlur={() => {
                        setTimeout(() => {
                          setSearchOpen(false);
                          setSearchFocused(false);
                        }, 150);
                      }}
                      onFocus={() => setSearchFocused(true)}
                      className="w-64 px-4 py-2 pr-10 text-sm rounded-md border transition-all"
                      style={{
                        backgroundColor: searchFocused ? settings.searchFocusBackgroundColor : settings.searchBackgroundColor,
                        borderColor: searchFocused ? settings.searchFocusBorderColor : 'transparent',
                        color: settings.searchInputTextColor,
                      }}
                    />
                    <Search 
                      size={16} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: settings.searchPlaceholderColor }}
                    />
                  </div>
                )}
              </>
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
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#000000',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
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
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  
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
          {merged.showSearch && (
            <>
              {!searchOpen ? (
                <button onClick={() => setSearchOpen(true)} className="cursor-pointer">
                  <Search size={24} className="stroke-[3]" style={{ color: merged.textColor }} />
                </button>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder={merged.searchPlaceholder || "Search products..."}
                    autoFocus
                    onBlur={() => {
                      setTimeout(() => {
                        setSearchOpen(false);
                        setSearchFocused(false);
                      }, 150);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    className="w-56 px-4 py-1.5 pr-10 text-sm border-2 font-mono font-bold uppercase"
                    style={{
                      backgroundColor: searchFocused ? merged.searchFocusBackgroundColor : merged.searchBackgroundColor,
                      borderColor: searchFocused ? merged.searchFocusBorderColor : merged.borderColor,
                      color: merged.searchInputTextColor,
                    }}
                  />
                  <Search 
                    size={16} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none stroke-[3]"
                    style={{ color: merged.searchPlaceholderColor }}
                  />
                </div>
              )}
            </>
          )}
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
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#23A094',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
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
  searchBackgroundColor: '#f9fafb', // neutral-50
  searchFocusBackgroundColor: '#ffffff', // white
  searchFocusBorderColor: '#3b82f6', // blue-500
  searchInputTextColor: '#111827', // gray-900
  searchPlaceholderColor: '#9ca3af', // gray-400
  backgroundColor: '#f5f5f5', // Light neutral background
  borderColor: '#e5e7eb',
  textColor: '#6b7280',
  textHoverColor: '#000000',
  cartBadgeColor: '#ef4444', // Red dot indicator
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

// Default values for HeaderGullwing
const GULLWING_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#3b82f6',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
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
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
  
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
            <>
              {!searchOpen ? (
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:bg-neutral-100 transition-colors" 
                  style={{ borderColor: merged.borderColor, color: merged.textColor }}
                >
                  <Search size={18} />
                </button>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder={merged.searchPlaceholder || "Search products..."}
                    autoFocus
                    onBlur={() => {
                      setTimeout(() => {
                        setSearchOpen(false);
                        setSearchFocused(false);
                      }, 150);
                    }}
                    onFocus={() => setSearchFocused(true)}
                    className="w-64 px-4 py-2 pr-10 text-sm rounded-full border-2 font-bold transition-all"
                    style={{
                      backgroundColor: searchFocused ? merged.searchFocusBackgroundColor : merged.searchBackgroundColor,
                      borderColor: searchFocused ? merged.searchFocusBorderColor : merged.borderColor,
                      color: merged.searchInputTextColor,
                    }}
                  />
                  <Search 
                    size={16} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: merged.searchPlaceholderColor }}
                  />
                </div>
              )}
            </>
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
            <div 
              className="flex-1 max-w-2xl rounded-xl flex items-center px-4 py-2.5 gap-3 border transition-all"
              style={{
                backgroundColor: merged.searchBackgroundColor,
                borderColor: 'transparent'
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = merged.searchFocusBackgroundColor!;
                e.currentTarget.style.borderColor = merged.searchFocusBorderColor!;
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = merged.searchBackgroundColor!;
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <Search size={18} style={{ color: merged.searchPlaceholderColor }} />
              <input 
                type="text" 
                placeholder={merged.searchPlaceholder || "Search..."} 
                className="bg-transparent w-full focus:outline-none text-sm"
                style={{ 
                  color: merged.searchInputTextColor,
                  caretColor: merged.searchInputTextColor
                }}
              />
              {merged.showKeyboardShortcut && (
                <div className="hidden md:flex items-center gap-1 text-xs border border-neutral-200 rounded px-1.5 py-0.5" style={{ color: merged.searchPlaceholderColor }}>
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

// 8. HeaderGullwing - "Centered Logo" (Symmetrical split navigation with centered logo)
export const HeaderGullwing: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const merged = { ...GULLWING_DEFAULTS, ...data };
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchFocused, setSearchFocused] = React.useState(false);
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

        {/* Right Navigation (remaining links) + Icons */}
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
          
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            {merged.showSearch && (
              <>
                {!searchOpen ? (
                  <button 
                    onClick={() => setSearchOpen(true)}
                    className="cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ color: merged.textColor }}
                  >
                    <Search size={20} />
                  </button>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={merged.searchPlaceholder || "Search products..."}
                      autoFocus
                      onBlur={() => {
                        setTimeout(() => {
                          setSearchOpen(false);
                          setSearchFocused(false);
                        }, 150);
                      }}
                      onFocus={() => setSearchFocused(true)}
                      className="w-56 px-4 py-1.5 pr-10 text-sm rounded-md border transition-all"
                      style={{
                        backgroundColor: searchFocused ? merged.searchFocusBackgroundColor : merged.searchBackgroundColor,
                        borderColor: searchFocused ? merged.searchFocusBorderColor : merged.borderColor,
                        color: merged.searchInputTextColor,
                      }}
                    />
                    <Search 
                      size={14} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: merged.searchPlaceholderColor }}
                    />
                  </div>
                )}
              </>
            )}
            
            {/* Account Icon */}
            {merged.showAccount && (
              <button 
                className="cursor-pointer hover:opacity-70 transition-opacity"
                style={{ color: merged.textColor }}
              >
                <User size={20} />
              </button>
            )}
            
            {/* Cart with Counter */}
            {merged.showCart && (
              <div 
                onClick={onOpenCart} 
                className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                style={{ color: merged.textColor }}
              >
                <ShoppingBag size={20} />
                <span className="font-mono text-sm">[{cartCount}]</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Default values for HeaderProtocol
const PROTOCOL_DEFAULTS: HeaderData = {
  showSearch: false,
  showAccount: false,
  showCart: true,
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#000000',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
  backgroundColor: '#facc15', // Yellow-400
  borderColor: '#000000',
  textColor: '#000000',
  textHoverColor: '#000000',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: '7xl',
};

// 9. HeaderProtocol - "Cyberpunk/Tech" (Yellow/black, status badge, bold)
export const HeaderProtocol: React.FC<HeaderProps> = ({
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
  const settings = { ...PROTOCOL_DEFAULTS, ...data };
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;

  return (
    <header 
      className={`${settings.sticky ? 'sticky top-0' : ''} z-50 font-mono`}
      style={{ 
        backgroundColor: settings.backgroundColor,
        borderBottom: `4px solid ${settings.borderColor}`,
      }}
    >
      <div className={`${maxWidthClass} mx-auto px-4 h-16 flex items-center justify-between`}>
        <div className="flex items-center gap-8">
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="text-2xl font-black uppercase tracking-tighter" 
            onClick={onLogoClick}
          />
          <nav className="hidden md:flex gap-6">
            {(links || []).map(l => (
              <NavItem
                key={l.href}
                link={l}
                onClick={onLinkClick}
                className="text-sm font-bold uppercase hover:underline decoration-2 underline-offset-4 transition-all"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
              />
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div 
            className="hidden md:block px-2 py-1 text-xs font-bold"
            style={{ backgroundColor: settings.borderColor, color: settings.backgroundColor }}
          >
            SYS.ONLINE
          </div>
          {settings.showCart && (
            <button 
              onClick={onOpenCart} 
              className="relative cursor-pointer border-2 p-1 hover:bg-black hover:text-yellow-400 transition-colors"
              style={{ borderColor: settings.borderColor, color: settings.textColor }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 text-[10px] font-bold w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}
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

// Default values for HeaderHorizon
const HORIZON_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#3b82f6',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#000000',
  textHoverColor: '#6b7280',
  accentColor: '#000000',
  utilityBarBackgroundColor: '#000000',
  utilityBarTextColor: '#ffffff',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

// 10. HeaderHorizon - "Double Row Editorial" (Utility bar + main nav)
export const HeaderHorizon: React.FC<HeaderProps> = ({
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
  const settings = { ...HORIZON_DEFAULTS, ...data };
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50`}>
      {/* Utility Bar */}
      <div 
        className="py-2 px-6 flex justify-between items-center text-xs font-medium tracking-wide"
        style={{ 
          backgroundColor: settings.utilityBarBackgroundColor || '#000000',
          color: settings.utilityBarTextColor || '#ffffff',
        }}
      >
        <div className="flex gap-4">
          <span>Free Shipping Over $100</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Help</a>
          {settings.showAccount && <a href="#" className="hover:underline">Sign In</a>}
        </div>
      </div>
      
      {/* Main Navigation */}
      <div 
        className="py-4 px-6"
        style={{ 
          backgroundColor: settings.backgroundColor,
          borderBottom: `1px solid ${settings.borderColor}`,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Logo - Left Side */}
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight || 32} 
            className="text-2xl font-bold tracking-tight shrink-0" 
            onClick={onLogoClick}
          />
          
          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {(links || []).map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick?.(l.href);
                }}
                className="text-sm font-medium uppercase tracking-wide hover:underline underline-offset-4 transition-all"
                style={{ color: l.active ? settings.accentColor : settings.textColor }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          
          {/* Icons - Right Side */}
          <div className="flex items-center gap-3 shrink-0">
            {settings.showSearch && (
              <>
                {searchOpen ? (
                  <div className="relative hidden md:block">
                    <input 
                      type="text" 
                      placeholder={settings.searchPlaceholder}
                      className="w-48 px-3 py-1.5 pr-8 text-sm rounded-md focus:outline-none transition-colors"
                      style={{ 
                        backgroundColor: settings.searchFocusBackgroundColor || '#ffffff',
                        border: `1px solid ${settings.searchFocusBorderColor || settings.borderColor}`,
                        color: settings.searchInputTextColor,
                      }}
                      onBlur={() => {
                        setTimeout(() => setSearchOpen(false), 150);
                      }}
                      autoFocus
                    />
                    <Search 
                      size={14} 
                      className="absolute right-2.5 top-2 pointer-events-none"
                      style={{ color: settings.searchPlaceholderColor }}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-1.5 hover:opacity-70 transition-opacity"
                    style={{ color: settings.textColor }}
                  >
                    <Search size={20} />
                  </button>
                )}
              </>
            )}
            
            {settings.showAccount && (
              <button 
                className="p-1.5 hover:opacity-70 transition-opacity"
                style={{ color: settings.textColor }}
              >
                <User size={20} />
              </button>
            )}
            
            {settings.showCart && (
              <button 
                onClick={onOpenCart} 
                className="relative p-1.5 hover:opacity-70 transition-opacity"
                style={{ color: settings.textColor }}
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
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
      </div>
    </header>
  );
};

// Default values for HeaderTerminal
const TERMINAL_DEFAULTS: HeaderData = {
  showSearch: false,
  showAccount: false,
  showCart: true,
  searchPlaceholder: "Search products...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#3b82f6',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
  backgroundColor: '#1e1e1e',
  borderColor: '#3c3c3c',
  textColor: '#d4d4d4',
  textHoverColor: '#ffffff',
  cartBadgeColor: '#569cd6',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

// 12. HeaderTerminal - "Developer Theme" (VS Code command-line style)
export const HeaderTerminal: React.FC<HeaderProps> = ({
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
  const settings = { ...TERMINAL_DEFAULTS, ...data };

  return (
    <header 
      className={`w-full font-mono ${settings.sticky ? 'sticky top-0' : ''} z-50`}
      style={{ 
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
        borderBottom: `1px solid ${settings.borderColor}`,
      }}
    >
      {/* Terminal Window Controls */}
      <div 
        className="flex items-center h-10 px-4 text-xs"
        style={{ 
          backgroundColor: '#252526',
          borderBottom: `1px solid ${settings.backgroundColor}`,
        }}
      >
        <div className="flex gap-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <span className="opacity-50">root@nexus:~/storefront</span>
      </div>
      
      {/* Main Header Content */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#569cd6]">const</span>
          <span className="text-[#4fc1ff]">store</span>
          <span style={{ color: settings.textColor }}>=</span>
          {logoUrl ? (
            <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} onClick={onLogoClick} />
          ) : (
            <span className="text-[#ce9178]">"{storeName}"</span>
          )}
          <span style={{ color: settings.textColor }}>;</span>
        </div>

        <nav className="flex gap-6 text-sm">
          {(links || []).map(l => (
            <NavItem
              key={l.href}
              link={l}
              onClick={onLinkClick}
              className="transition-colors flex gap-1"
              style={{ color: settings.textColor }}
              hoverColor={settings.textHoverColor}
            >
              <span className="text-[#c586c0]">import</span>
              <span>{l.label}</span>
            </NavItem>
          ))}
        </nav>

        {settings.showCart && (
          <button 
            onClick={onOpenCart} 
            className="flex items-center gap-3 text-sm cursor-pointer transition-colors"
            style={{ color: settings.textColor }}
            onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
            onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
          >
            <span className="text-[#6a9955]">// Cart: {cartCount} items</span>
            <div 
              className="w-2 h-4 animate-pulse"
              style={{ backgroundColor: settings.textColor }}
            ></div>
          </button>
        )}
      </div>
    </header>
  );
};


// Other headers still use placeholder - restore from HeaderLibrary.archive.tsx as needed
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
  { id: 'protocol', name: 'Tech/Gaming', description: 'Cyberpunk style', date: '2025-01-04', popularity: 65 },
  { id: 'horizon', name: 'Double Row', description: 'Two-level nav', date: '2025-01-04', popularity: 70 },
  { id: 'terminal', name: 'Developer', description: 'Command-line theme', date: '2025-01-04', popularity: 64 },
  { id: 'aura', name: 'Premium Glow', description: 'Gradient accents', date: '2025-01-04', popularity: 92 },
  { id: 'quantum', name: 'Futuristic Grid', description: 'Geometric patterns', date: '2025-01-04', popularity: 90 },
];

export const HEADER_FIELDS: Record<string, string[]> = {
  canvas: [
    'showSearch', 'showAccount', 'showCart',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'paddingX', 'paddingY'
  ],
  nebula: [
    'showSearch', 'showCart', 'showIndicatorDot',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor',
    'sticky', 'maxWidth', 'blurIntensity'
  ],
  luxe: [
    'showMenu', 'showSearch', 'showAccount', 'showCart', 'showTagline',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'taglineColor', 'taglineText', 'cartBadgeColor',
    'sticky', 'maxWidth'
  ],
  pilot: [
    'showCart', 'showCTA', 'showLogoBadge',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'textColor', 'textHoverColor', 'accentColor',
    'ctaBackgroundColor', 'ctaHoverColor', 'ctaTextColor', 'ctaText',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  bunker: [
    'showSearch', 'showAccount', 'showCart',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'tickerBackgroundColor', 'tickerTextColor', 'tickerBorderColor', 'tickerText',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  pop: [
    'showSearch', 'showAccount', 'showCart',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  venture: [
    'showSearch', 'showAccount', 'showCart', 'showKeyboardShortcut',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor', 'searchFocusBorderColor',
    'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  gullwing: [
    'showSearch', 'showAccount', 'showCart',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  protocol: [
    'showSearch', 'showAccount', 'showCart',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  horizon: [
    'showSearch', 'showAccount', 'showCart',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'utilityBarBackgroundColor', 'utilityBarTextColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  terminal: [
    'showSearch', 'showAccount', 'showCart',
    'searchPlaceholder', 'searchBackgroundColor', 'searchFocusBackgroundColor',
    'searchFocusBorderColor', 'searchInputTextColor', 'searchPlaceholderColor',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth'
  ],
  // Placeholders for remaining headers
  portfolio: [], metro: [], modul: [], stark: [], 
  offset: [], ticker: [], noir: [], ghost: [],
};
