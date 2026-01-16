import React from 'react';
import { ShoppingBag, Search, User, Menu, Hexagon, X } from 'lucide-react';
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
  navActiveStyle?: 'none' | 'dot' | 'underline' | 'capsule' | 'glow' | 'brutalist' | 'minimal' | 'overline' | 'double' | 'bracket' | 'highlight' | 'skewed';
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
  // Interactive effects
  particleCount?: number;
  particleColor?: string;
  accentColorSecondary?: string;
  terminalPromptColor?: string;
  scanlineColor?: string;
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
  placeholder?: string;
}> = ({ isOpen, onClose, onSubmit, className = '', inputClassName = '', iconColor, placeholder = 'Search...' }) => {
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
          placeholder={placeholder}
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
  iconSize: 20,
  iconHoverBackgroundColor: 'transparent',
  borderWidth: '1px',
  sticky: true,
  maxWidth: '7xl',
  paddingX: '24px',
  paddingY: '16px',
  navActiveStyle: 'dot',
};

// Global base defaults for all headers
export const DEFAULTS: HeaderData = {
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
  navActiveStyle: 'dot',
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

const NavItem: React.FC<{
  link: NavLink;
  className?: string;
  style?: React.CSSProperties;
  hoverColor?: string;
  activeColor?: string;
  activeStyle?: 'none' | 'dot' | 'underline' | 'capsule' | 'glow' | 'brutalist' | 'minimal' | 'overline' | 'double' | 'bracket' | 'highlight' | 'skewed';
  children?: React.ReactNode;
  onClick?: (href: string) => void;
  [key: string]: any;
}> = ({ link, className, style, hoverColor, activeColor, activeStyle = 'dot', children, onClick, ...rest }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(link.href);
    }
  };

  const isActive = link.active;
  const currentColor = isActive && activeColor ? activeColor : (isHovered && hoverColor ? hoverColor : style?.color);

  // Helper to render Different Styles
  const renderIndicator = () => {
    if (!isActive) return null;

    switch (activeStyle) {
      case 'dot':
        return (
          <span 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: activeColor || hoverColor || style?.color }}
          />
        );
      case 'underline':
        return (
          <span 
            className="absolute -bottom-1 left-0 right-0 h-0.5 transform scale-x-100 transition-transform duration-300 origin-left"
            style={{ backgroundColor: activeColor || hoverColor || style?.color }}
          />
        );
      case 'overline':
        return (
          <span 
            className="absolute -top-1 left-0 right-0 h-0.5 transform scale-x-100 transition-transform duration-300 origin-left"
            style={{ backgroundColor: activeColor || hoverColor || style?.color }}
          />
        );
      case 'double':
        return (
          <>
            <span 
              className="absolute -top-1 left-0 right-0 h-0.5 transform scale-x-100 transition-transform duration-300"
              style={{ backgroundColor: activeColor || hoverColor || style?.color }}
            />
            <span 
              className="absolute -bottom-1 left-0 right-0 h-0.5 transform scale-x-100 transition-transform duration-300"
              style={{ backgroundColor: activeColor || hoverColor || style?.color }}
            />
          </>
        );
      case 'bracket':
        return (
          <>
            <span 
              className="absolute top-0 -left-3 bottom-0 w-1.5 border-l-2 border-t-2 border-b-2"
              style={{ borderColor: activeColor || hoverColor || style?.color }}
            />
            <span 
              className="absolute top-0 -right-3 bottom-0 w-1.5 border-r-2 border-t-2 border-b-2"
              style={{ borderColor: activeColor || hoverColor || style?.color }}
            />
          </>
        );
      case 'brutalist':
        return (
          <span 
            className="absolute -inset-x-2 -inset-y-1 border-2 z-[-1]"
            style={{ borderColor: activeColor || hoverColor || style?.color, backgroundColor: `${activeColor || hoverColor || style?.color}10` }}
          />
        );
      default:
        return null;
    }
  };

  const getActiveClasses = () => {
    if (!isActive) return '';
    
    switch (activeStyle) {
      case 'capsule':
        return 'px-4 py-1.5 rounded-full bg-opacity-10';
      case 'highlight':
        return 'px-1 py-0.5 rounded-sm';
      case 'skewed':
        return 'px-5 py-1.5 -skew-x-12';
      case 'glow':
        return '';
      case 'minimal':
        return 'font-bold scale-105';
      default:
        return '';
    }
  };

  const activeStyles: React.CSSProperties = {};
  if (isActive) {
    if (activeStyle === 'capsule') {
      activeStyles.backgroundColor = `${activeColor || hoverColor || style?.color}15`;
    }
    if (activeStyle === 'highlight') {
      activeStyles.backgroundColor = `${activeColor || hoverColor || style?.color}40`;
      activeStyles.transform = 'rotate(-1deg)';
      activeStyles.borderRadius = '2px';
    }
    if (activeStyle === 'skewed') {
      activeStyles.backgroundColor = `${activeColor || hoverColor || style?.color}20`;
      activeStyles.borderRight = `2px solid ${activeColor || hoverColor || style?.color}`;
    }
    if (activeStyle === 'glow') {
      activeStyles.textShadow = `0 0 15px ${activeColor || hoverColor || style?.color}80`;
      activeStyles.filter = `drop-shadow(0 0 8px ${activeColor || hoverColor || style?.color}40)`;
    }
  }

  return (
    <a
      href={link.href}
      onClick={handleClick}
      className={`relative group flex items-center justify-center transition-all duration-300 ${className || ''} ${getActiveClasses()}`}
      {...rest}
      style={{
        ...style,
        ...activeStyles,
        color: currentColor,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative">
        {children || link.label}
        {renderIndicator()}
      </span>
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
        borderBottom: `${settings.borderWidth} solid ${settings.borderColor}`,
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
                activeColor={settings.textHoverColor}
                activeStyle={settings.navActiveStyle}
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
                  style={{ 
                    color: settings.textColor,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = settings.textHoverColor!;
                    e.currentTarget.style.backgroundColor = settings.iconHoverBackgroundColor!;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = settings.textColor!;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Search size={settings.iconSize} />
                </button>
              )}
            </div>
          )}
          {settings.showAccount && (
            <button
              className="p-2 rounded-full transition-colors"
              style={{ 
                color: settings.textColor,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = settings.textHoverColor!;
                e.currentTarget.style.backgroundColor = settings.iconHoverBackgroundColor!;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = settings.textColor!;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <User size={settings.iconSize} />
            </button>
          )}
          {settings.showCart && (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full transition-colors"
              style={{ 
                color: settings.textColor,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = settings.textHoverColor!;
                e.currentTarget.style.backgroundColor = settings.iconHoverBackgroundColor!;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = settings.textColor!;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ShoppingBag size={settings.iconSize} />
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
  borderWidth: '1px',
  textColor: '#4b5563', // gray-600
  textHoverColor: '#2563eb', // blue-600
  accentColor: '#3b82f6', // blue-500 for dot indicator
  iconSize: 18,
  iconHoverBackgroundColor: 'transparent',
  cartBadgeColor: '#3b82f6',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: '4xl',
  blurIntensity: 'xl', // backdrop-blur intensity
  showIndicatorDot: true, // animated dot next to logo
  navActiveStyle: 'glow',
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
          border: `${settings.borderWidth} solid ${settings.borderColor}`,
        }}
      >
        {/* Left: Logo with optional indicator dot */}
        <button onClick={onLogoClick} className="flex items-center gap-2 cursor-pointer">
          {settings.showIndicatorDot && (
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
              activeColor={settings.accentColor}
              activeStyle={settings.navActiveStyle}
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
                  className="cursor-pointer transition-colors rounded-full p-1.5"
                  style={{ 
                    color: settings.textColor,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = settings.textHoverColor!;
                    e.currentTarget.style.backgroundColor = settings.iconHoverBackgroundColor!;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = settings.textColor!;
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Search size={settings.iconSize} />
                </button>
              )}
            </div>
          )}
          {settings.showCart && (
            <button 
              onClick={onOpenCart} 
              className="relative cursor-pointer transition-colors rounded-full p-1.5"
              style={{ 
                color: settings.textColor,
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = settings.textHoverColor!;
                e.currentTarget.style.backgroundColor = settings.iconHoverBackgroundColor!;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = settings.textColor!;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ShoppingBag size={settings.iconSize} />
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
  navActiveStyle: 'underline',
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
              activeColor={settings.accentColor}
              activeStyle={settings.navActiveStyle}
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
  navActiveStyle: 'capsule',
};

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

const PORTFOLIO_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#000000',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#111827',
  textHoverColor: '#000000',
  accentColor: '#000000',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

const METRO_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#3b82f6',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#6b7280',
  textHoverColor: '#111827',
  accentColor: '#3b82f6',
  cartBadgeColor: '#3b82f6',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

const MODUL_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search...",
  searchBackgroundColor: '#f3f4f6',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#10b981',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#374151',
  textHoverColor: '#10b981',
  accentColor: '#10b981',
  cartBadgeColor: '#10b981',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

const STARK_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search...",
  searchBackgroundColor: '#ffffff',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#000000',
  searchInputTextColor: '#000000',
  searchPlaceholderColor: '#666666',
  backgroundColor: '#ffffff',
  borderColor: '#000000',
  textColor: '#000000',
  textHoverColor: '#666666',
  accentColor: '#000000',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

const OFFSET_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#f97316',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
  backgroundColor: '#fafafa',
  borderColor: '#e5e7eb',
  textColor: '#1f2937',
  textHoverColor: '#f97316',
  accentColor: '#f97316',
  cartBadgeColor: '#f97316',
  cartBadgeTextColor: '#ffffff',
  sticky: true,
  maxWidth: 'full',
};

const TICKER_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search...",
  searchBackgroundColor: '#f9fafb',
  searchFocusBackgroundColor: '#ffffff',
  searchFocusBorderColor: '#dc2626',
  searchInputTextColor: '#111827',
  searchPlaceholderColor: '#9ca3af',
  backgroundColor: '#ffffff',
  borderColor: '#e5e7eb',
  textColor: '#111827',
  textHoverColor: '#dc2626',
  accentColor: '#dc2626',
  cartBadgeColor: '#dc2626',
  cartBadgeTextColor: '#ffffff',
  tickerBackgroundColor: '#dc2626',
  tickerTextColor: '#ffffff',
  tickerText: 'BREAKING NEWS • LATEST UPDATES • TRENDING NOW',
  sticky: true,
  maxWidth: 'full',
};

const NOIR_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search...",
  searchBackgroundColor: '#1a1a1a',
  searchFocusBackgroundColor: '#0a0a0a',
  searchFocusBorderColor: '#f5f5f5',
  searchInputTextColor: '#f5f5f5',
  searchPlaceholderColor: '#737373',
  backgroundColor: '#0a0a0a',
  borderColor: '#262626',
  textColor: '#f5f5f5',
  textHoverColor: '#ffffff',
  accentColor: '#f5f5f5',
  cartBadgeColor: '#f5f5f5',
  cartBadgeTextColor: '#0a0a0a',
  sticky: true,
  maxWidth: 'full',
};

const GHOST_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  searchPlaceholder: "Search...",
  searchBackgroundColor: 'rgba(255, 255, 255, 0.1)',
  searchFocusBackgroundColor: 'rgba(255, 255, 255, 0.2)',
  searchFocusBorderColor: '#ffffff',
  searchInputTextColor: '#ffffff',
  searchPlaceholderColor: 'rgba(255, 255, 255, 0.6)',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  textColor: '#ffffff',
  textHoverColor: '#ffffff',
  accentColor: '#ffffff',
  cartBadgeColor: '#ffffff',
  cartBadgeTextColor: '#000000',
  sticky: true,
  maxWidth: 'full',
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
                activeColor={settings.accentColor}
                activeStyle={settings.navActiveStyle}
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
export const HeaderBunker: React.FC<HeaderProps> = ({
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
  const settings = { ...BUNKER_DEFAULTS, ...data };
  
  return (
    <header 
      className={`w-full border-b-4 ${settings.sticky ? 'sticky top-0' : ''} z-50 font-mono`}
      style={{ backgroundColor: settings.backgroundColor, borderColor: settings.borderColor }}
    >
      <div 
        className="w-full text-xs py-4 px-2 overflow-hidden whitespace-nowrap border-b-4"
        style={{ 
          backgroundColor: settings.tickerBackgroundColor, 
          color: settings.tickerTextColor,
          borderColor: settings.tickerBorderColor
        }}
      >
        <div className="animate-marquee inline-block">
          {settings.tickerText} — {settings.tickerText} —
        </div>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] min-h-[5.5rem] divide-x-4 divide-black" style={{ borderColor: settings.borderColor }}>
        <div className="px-6 py-2 flex items-center bg-white">
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="text-2xl font-black uppercase italic transform -skew-x-12" 
            onClick={onLogoClick}
          />
        </div>
        <nav className="hidden md:flex items-stretch justify-center" style={{ backgroundColor: settings.backgroundColor }}>
          <div className="flex w-full h-full divide-x-4 border-l-0" style={{ borderColor: settings.borderColor }}>
            {(links || []).map(l => (
              <NavItem 
                key={l.href} 
                link={l} 
                onClick={onLinkClick} 
                className="flex-1 flex items-center justify-center text-sm font-bold uppercase transition-colors px-4 py-2"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
                activeColor={settings.textHoverColor}
                activeStyle={settings.navActiveStyle}
              />
            ))}
          </div>
        </nav>
        <div className="px-6 py-2 flex items-center justify-center gap-6 bg-white">
          {settings.showSearch && (
            <div className="flex items-center">
              <InlineSearch 
                isOpen={isSearchOpen || false} 
                onClose={onSearchClose || (() => {})} 
                onSubmit={onSearchSubmit} 
                placeholder={settings.searchPlaceholder}
                inputClassName="border-b border-black px-2 py-1" 
                iconColor="#000" 
              />
              {!isSearchOpen && (
                <button onClick={onSearchClick} className="hover:opacity-70 transition-opacity">
                  <Search size={24} className="stroke-[3]" style={{ color: settings.textColor }} />
                </button>
              )}
            </div>
          )}
          {settings.showAccount && (
            <button className="hover:opacity-70 transition-opacity">
              <User size={24} className="stroke-[3]" style={{ color: settings.textColor }} />
            </button>
          )}
          {settings.showCart && (
            <div onClick={onOpenCart} className="relative cursor-pointer hover:opacity-70 transition-opacity">
               <ShoppingBag size={24} className="stroke-[3]" style={{ color: settings.textColor }} />
               <span 
                 className="absolute -top-2 -right-2 text-xs font-bold px-1 border-2"
                 style={{ 
                   backgroundColor: settings.cartBadgeColor, 
                   color: settings.cartBadgeTextColor,
                   borderColor: settings.borderColor
                 }}
               >
                 {cartCount}
               </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// 7. HeaderProtocol - "Tech/Gaming" (Cyberpunk/Brutalist)
export const HeaderProtocol: React.FC<HeaderProps> = ({
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
  const settings = { ...PROTOCOL_DEFAULTS, ...data };
  
  return (
    <header 
      className={`${settings.sticky ? 'sticky top-0' : ''} z-50 border-b-4 font-mono`}
      style={{ backgroundColor: settings.backgroundColor, borderColor: settings.borderColor }}
    >
      <div className="max-w-7xl mx-auto px-4 min-h-[5.5rem] py-2 flex items-center justify-between">
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
                className="text-sm font-bold uppercase hover:underline decoration-2 underline-offset-4 transition-colors"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
                activeColor={settings.accentColor}
                activeStyle={settings.navActiveStyle}
              />
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {settings.showSearch && (
            <div className="flex items-center">
              <InlineSearch 
                isOpen={isSearchOpen || false} 
                onClose={onSearchClose || (() => {})} 
                onSubmit={onSearchSubmit} 
                placeholder={settings.searchPlaceholder}
                inputClassName="border-b-2 border-black px-2 py-1" 
                iconColor="#000" 
              />
              {!isSearchOpen && (
                <button 
                  onClick={onSearchClick} 
                  className="p-1 hover:bg-black transition-colors border-2 border-black"
                  style={{ color: settings.textColor, borderColor: settings.borderColor }}
                >
                  <Search size={20} />
                </button>
              )}
            </div>
          )}
          {settings.showAccount && (
            <button 
              className="p-1 hover:bg-black transition-colors border-2 border-black"
              style={{ color: settings.textColor, borderColor: settings.borderColor }}
            >
              <User size={20} />
            </button>
          )}
          {settings.showCart && (
            <div 
              onClick={onOpenCart} 
              className="relative cursor-pointer border-2 p-1 hover:bg-black transition-colors"
              style={{ color: settings.textColor, borderColor: settings.borderColor }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 text-[10px] font-bold w-5 h-5 flex items-center justify-center border-2"
                  style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor, borderColor: settings.borderColor }}
                >
                  {cartCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// 8. HeaderHorizon - "Double Row" (Double Decker, Editorial)
export const HeaderHorizon: React.FC<HeaderProps> = ({
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
  const settings = { ...HORIZON_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50`}>
      <div 
        className="py-2 px-6 flex justify-between items-center text-xs font-medium tracking-wide"
        style={{ backgroundColor: settings.utilityBarBackgroundColor, color: settings.utilityBarTextColor }}
      >
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
      <div 
        className="border-b py-6 px-8 flex items-center justify-between relative"
        style={{ backgroundColor: settings.backgroundColor, borderColor: settings.borderColor }}
      >
         <Menu size={24} className="md:hidden" style={{ color: settings.textColor }} />
         <nav className="hidden md:flex gap-8">
            {(links || []).slice(0, 2).map(l => (
              <NavItem 
                key={l.href} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-bold uppercase tracking-wider hover:underline underline-offset-4 transition-colors"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
                activeColor={settings.accentColor || settings.textHoverColor}
                activeStyle={settings.navActiveStyle}
              />
            ))}
         </nav>
         
         <div className="absolute left-1/2 transform -translate-x-1/2">
           <Logo 
             storeName={storeName} 
             logoUrl={logoUrl} 
             logoHeight={logoHeight} 
             className="text-3xl font-serif italic" 
             onClick={onLogoClick}
           />
         </div>

         <nav className="hidden md:flex gap-8">
            {(links || []).slice(2).map(l => (
              <NavItem 
                key={l.href} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-bold uppercase tracking-wider hover:underline underline-offset-4 transition-colors"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
                activeColor={settings.accentColor || settings.textHoverColor}
                activeStyle={settings.navActiveStyle}
              />
            ))}
         </nav>
         
         <div className="flex items-center gap-4">
           {settings.showSearch && (
             <div className="flex items-center">
               <InlineSearch 
                isOpen={isSearchOpen || false} 
                onClose={onSearchClose || (() => {})} 
                onSubmit={onSearchSubmit} 
                placeholder={settings.searchPlaceholder}
                inputClassName="border-b px-2 py-1" 
                style={{ borderColor: settings.borderColor }}
                iconColor={settings.textColor} 
               />
               {!isSearchOpen && (
                 <Search 
                  size={20} 
                  onClick={onSearchClick} 
                  className="cursor-pointer transition-colors" 
                  style={{ color: settings.textColor }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
                 />
               )}
             </div>
           )}
           {settings.showAccount && (
             <User 
              size={20} 
              className="cursor-pointer transition-colors" 
              style={{ color: settings.textColor }}
              onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
              onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
             />
           )}
           {settings.showCart && (
             <div 
               onClick={onOpenCart} 
               className="flex items-center gap-1 font-bold text-sm cursor-pointer transition-colors"
               style={{ color: settings.textColor }}
               onMouseEnter={(e) => (e.currentTarget.style.color = settings.textHoverColor!)}
               onMouseLeave={(e) => (e.currentTarget.style.color = settings.textColor!)}
             >
               <ShoppingBag size={20} />
               <span>({cartCount})</span>
             </div>
           )}
         </div>
      </div>
    </header>
  );
};

// 10. HeaderTerminal - "Developer" (Code editor style)
export const HeaderTerminal: React.FC<HeaderProps> = ({
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
  const settings = { ...TERMINAL_DEFAULTS, ...data };
  
  return (
    <header 
      className={`w-full font-mono ${settings.sticky ? 'sticky top-0' : ''} z-50 border-b`}
      style={{ backgroundColor: settings.backgroundColor, color: settings.textColor, borderColor: settings.borderColor }}
    >
      <div className="flex items-center h-10 px-4 text-xs border-b" style={{ backgroundColor: '#252526', borderColor: settings.borderColor }}>
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
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} onClick={onLogoClick} className="text-[#ce9178] px-2" />
           <span className="text-[#d4d4d4]">;</span>
         </div>

         <nav className="flex gap-6 text-sm">
            {(links || []).map(l => (
               <NavItem 
                key={l.href} 
                link={l} 
                onClick={onLinkClick} 
                className="hover:text-white transition-colors flex gap-1"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
                activeColor={settings.accentColor}
                activeStyle={settings.navActiveStyle}
               >
                 {/* Custom label with import syntax would be nice but NavItem is standard */}
                 <span className="text-[#c586c0]">import</span>
                 <span>{l.label}</span>
               </NavItem>
            ))}
         </nav>

         <div className="flex items-center gap-4 text-sm">
            {settings.showSearch && (
              <div className="flex items-center">
                <InlineSearch 
                  isOpen={isSearchOpen || false} 
                  onClose={onSearchClose || (() => {})} 
                  onSubmit={onSearchSubmit} 
                  placeholder={settings.searchPlaceholder}
                  inputClassName="bg-[#3c3c3c] border-b border-[#569cd6] px-2 py-1 text-white" 
                  iconColor={settings.textColor} 
                />
                {!isSearchOpen && (
                  <button onClick={onSearchClick} className="hover:text-white transition-colors flex items-center gap-1">
                    <span className="text-[#569cd6]">fn</span>
                    <Search size={16} />
                  </button>
                )}
              </div>
            )}
            {settings.showAccount && (
              <button className="hover:text-white transition-colors flex items-center gap-1">
                <span className="text-[#569cd6]">fn</span>
                <User size={16} />
              </button>
            )}
            {settings.showCart && (
              <div onClick={onOpenCart} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <span className="text-[#6a9955]">// Cart: {cartCount}</span>
                <ShoppingBag size={16} />
              </div>
            )}
         </div>
      </div>
    </header>
  );
};

// 11. HeaderPortfolio - "Split Screen" (Big Typography)
export const HeaderPortfolio: React.FC<HeaderProps> = ({
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
  const settings = { ...PORTFOLIO_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50`} style={{ backgroundColor: settings.backgroundColor }}>
       <div className="grid grid-cols-3 md:grid-cols-5 min-h-[5.5rem] border-b" style={{ borderColor: settings.borderColor }}>
          <div className="flex items-center px-6 py-2 border-r" style={{ borderColor: settings.borderColor }}>
             <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-xl font-bold tracking-tight uppercase" onClick={onLogoClick} />
          </div>
          <div className="hidden md:flex items-center border-r" style={{ borderColor: settings.borderColor }}>
             {(links || []).slice(0, 3).map(l => (
                <NavItem 
                  key={l.href} 
                  link={l} 
                  onClick={onLinkClick} 
                  className="flex-1 h-full flex items-center justify-center transition-colors text-xs uppercase font-bold border-r last:border-none"
                  style={{ color: settings.textColor, borderColor: settings.borderColor }}
                  hoverColor={settings.textHoverColor}
                  activeColor={settings.textHoverColor}
                  activeStyle={settings.navActiveStyle}
                />
             ))}
          </div>
          <div className="hidden md:flex items-center px-6 border-r justify-center gap-4" style={{ borderColor: settings.borderColor }}>
             {settings.showSearch && (
               <div className="flex items-center">
                 <InlineSearch 
                  isOpen={isSearchOpen || false} 
                  onClose={onSearchClose || (() => {})} 
                  onSubmit={onSearchSubmit} 
                  placeholder={settings.searchPlaceholder}
                  inputClassName="border-b px-2 py-1" 
                  iconColor={settings.textColor} 
                 />
                 {!isSearchOpen && <button onClick={onSearchClick} className="hover:opacity-70 p-2 transition-colors"><Search size={18} style={{ color: settings.textColor }} /></button>}
               </div>
             )}
             {settings.showAccount && (
               <button className="hover:opacity-70 p-2 transition-colors"><User size={18} style={{ color: settings.textColor }} /></button>
             )}
          </div>
          <div onClick={onOpenCart} className="col-span-2 md:col-span-1 flex items-center justify-between px-6 py-2 cursor-pointer transition-colors" style={{ backgroundColor: settings.accentColor, color: settings.cartBadgeTextColor }}>
             <span className="text-xs font-bold uppercase">Cart</span>
             <span className="text-4xl font-display">{cartCount.toString().padStart(2, '0')}</span>
          </div>
       </div>
    </header>
  );
};

// 12. HeaderVenture - "Search-First" (Utility First, Search Dominant)
export const HeaderVenture: React.FC<HeaderProps> = ({
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
  const settings = { ...VENTURE_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50 border-b`} style={{ backgroundColor: settings.backgroundColor, borderColor: settings.borderColor }}>
      <div className="max-w-[1600px] mx-auto p-2">
         <div className="bg-white rounded-2xl border shadow-sm p-2 flex items-center justify-between gap-4 min-h-[5.5rem]" style={{ borderColor: settings.borderColor }}>
            <div className="px-4 flex items-center gap-2">
               {!logoUrl && (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: settings.accentColor }}>
                      {storeName.charAt(0)}
                  </div>
               )}
               <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold text-lg tracking-tight hidden sm:block" onClick={onLogoClick} />
            </div>
            
            <div 
              className="flex-1 max-w-2xl bg-neutral-50 rounded-xl flex items-center px-4 py-2.5 gap-3 border border-transparent focus-within:bg-white transition-all"
              style={{ borderColor: 'transparent' }} // Logic for focus-within border color would need state
            >
               <Search size={18} className="text-neutral-400" />
               <input 
                type="text" 
                placeholder={settings.searchPlaceholder} 
                className="bg-transparent w-full focus:outline-none text-sm" 
               />
               {settings.showKeyboardShortcut && (
                 <span className="hidden lg:block text-[10px] font-bold text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded-md">/</span>
               )}
            </div>

            <div className="flex items-center gap-1 pr-2">
               <nav className="hidden md:flex items-center mr-4">
                  {(links || []).map(l => (
                    <NavItem 
                      key={l.href} 
                      link={l} 
                      onClick={onLinkClick} 
                      className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                      style={{ color: settings.textColor }}
                      hoverColor={settings.textHoverColor}
                      activeColor={settings.accentColor || settings.textHoverColor}
                      activeStyle={settings.navActiveStyle}
                    />
                  ))}
               </nav>
               {settings.showCart && (
                 <button onClick={onOpenCart} className="relative p-2.5 hover:bg-neutral-100 rounded-xl transition-colors">
                    <ShoppingBag size={20} style={{ color: settings.textColor }} />
                    {cartCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full border border-white" style={{ backgroundColor: settings.cartBadgeColor }}></span>}
                 </button>
               )}
               {settings.showAccount && (
                 <button className="p-2.5 hover:bg-neutral-100 rounded-xl transition-colors">
                    <User size={20} style={{ color: settings.textColor }} />
                 </button>
               )}
            </div>
         </div>
      </div>
    </header>
  );
};

// 13. HeaderMetro - "Tile Style" (Windows Phone Vibe)
export const HeaderMetro: React.FC<HeaderProps> = ({
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
  const settings = { ...METRO_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50 bg-white shadow-sm font-sans`}>
      <div className="grid grid-cols-8 md:grid-cols-12 min-h-[5.5rem] divide-x border-b" style={{ borderColor: settings.borderColor }}>
        <div 
          className="col-span-2 md:col-span-3 flex items-center justify-center font-bold text-xl tracking-tighter overflow-hidden py-2 px-4"
          style={{ backgroundColor: settings.accentColor, color: '#ffffff' }}
        >
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} onClick={onLogoClick} />
        </div>
        {(links || []).map(l => (
          <NavItem 
            key={l.href} 
            link={l} 
            onClick={onLinkClick} 
            className="hidden md:flex col-span-2 items-center justify-center text-sm font-bold uppercase transition-colors py-2" 
            style={{ color: settings.textColor }}
            hoverColor={settings.textHoverColor}
            activeStyle={settings.navActiveStyle}
            activeColor={settings.accentColor}
          />
        ))}
        <div className="col-span-2 md:col-span-1 flex items-center justify-center hover:bg-neutral-50 cursor-pointer py-2">
           {settings.showSearch && (
             <div className="flex items-center">
               <InlineSearch 
                isOpen={isSearchOpen || false} 
                onClose={onSearchClose || (() => {})} 
                onSubmit={onSearchSubmit} 
                placeholder={settings.searchPlaceholder}
                inputClassName="border-b px-2 py-1" 
                iconColor={settings.textColor} 
               />
               {!isSearchOpen && <Search size={20} onClick={onSearchClick} style={{ color: settings.textColor }} className="cursor-pointer" />}
             </div>
           )}
        </div>
        <div className="col-span-2 md:col-span-1 flex items-center justify-center hover:bg-neutral-50 cursor-pointer py-2">
           {settings.showAccount && <User size={20} style={{ color: settings.textColor }} />}
        </div>
        <div onClick={onOpenCart} className="col-span-2 flex items-center justify-center cursor-pointer transition-colors gap-2 py-2" style={{ backgroundColor: settings.textColor, color: settings.backgroundColor }}>
           <ShoppingBag size={20} />
           <span className="font-bold">{cartCount}</span>
        </div>
      </div>
    </header>
  );
};

// 14. HeaderModul - "Grid Layout" (Swiss Style, Grid)
export const HeaderModul: React.FC<HeaderProps> = ({
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
  const settings = { ...MODUL_DEFAULTS, ...data };
  
  return (
    <header className={`w-full border-b ${settings.sticky ? 'sticky top-0' : ''} z-50 bg-white font-sans`} style={{ borderColor: settings.borderColor }}>
      <div className="flex min-h-[5.5rem]">
        <div className="w-48 border-r flex items-center px-4 py-2 font-bold text-lg shrink-0" style={{ borderColor: settings.borderColor }}>
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} onClick={onLogoClick} />
        </div>
        <nav className="flex-1 flex overflow-hidden">
           {(links || []).map(l => (
             <NavItem 
              key={l.href} 
              link={l} 
              onClick={onLinkClick} 
              className="flex-1 border-r flex items-center justify-center text-xs font-bold uppercase tracking-widest transition-colors px-2 py-2" 
              style={{ color: settings.textColor, borderColor: settings.borderColor }}
              hoverColor={settings.textHoverColor}
              activeStyle={settings.navActiveStyle}
              activeColor={settings.accentColor}
             />
           ))}
        </nav>
        <div className="w-14 border-r flex items-center justify-center hover:bg-neutral-100 cursor-pointer py-2" style={{ borderColor: settings.borderColor }}>
           {settings.showSearch && (
             <div className="flex items-center">
               <InlineSearch 
                isOpen={isSearchOpen || false} 
                onClose={onSearchClose || (() => {})} 
                onSubmit={onSearchSubmit} 
                placeholder={settings.searchPlaceholder}
                inputClassName="border-b px-2 py-1" 
                iconColor={settings.textColor} 
               />
               {!isSearchOpen && <Search size={18} onClick={onSearchClick} className="cursor-pointer" style={{ color: settings.textColor }} />}
             </div>
           )}
        </div>
        <div className="w-14 border-r flex items-center justify-center hover:bg-neutral-100 cursor-pointer py-2" style={{ borderColor: settings.borderColor }}>
           {settings.showAccount && <User size={18} style={{ color: settings.textColor }} />}
        </div>
        <div onClick={onOpenCart} className="w-20 flex items-center justify-center hover:bg-neutral-100 cursor-pointer gap-1 py-2">
           <ShoppingBag size={18} style={{ color: settings.textColor }} />
           <span className="text-xs font-bold" style={{ color: settings.textColor }}>({cartCount})</span>
        </div>
      </div>
    </header>
  );
};

// 15. HeaderGullwing - "Centered Logo" (Symmetrical Split)
export const HeaderGullwing: React.FC<HeaderProps> = ({
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
  const settings = { ...GULLWING_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50 shadow-sm`} style={{ backgroundColor: settings.backgroundColor }}>
      <div className="max-w-7xl mx-auto min-h-[5rem] py-4 px-8 flex items-center justify-between">
         <nav className="flex-1 flex justify-end gap-8 pr-12">
            {(links || []).slice(0, 2).map(l => (
               <NavItem 
                key={l.href} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-bold transition-colors"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
                activeStyle={settings.navActiveStyle}
                activeColor={settings.accentColor}
               />
            ))}
         </nav>
         
         <div 
           className="shrink-0 flex items-center justify-center px-4 py-2 transform -skew-x-12"
           style={{ backgroundColor: settings.textColor, color: settings.backgroundColor }}
         >
            <Logo 
              storeName={storeName} 
              logoUrl={logoUrl} 
              logoHeight={logoHeight} 
              className="font-display font-bold text-2xl tracking-tighter"
              onClick={onLogoClick}
            />
         </div>

         <div className="flex-1 flex justify-between items-center pl-12">
            <nav className="flex gap-8">
               {(links || []).slice(2).map(l => (
                  <NavItem 
                    key={l.href} 
                    link={l} 
                    onClick={onLinkClick} 
                    className="text-sm font-bold transition-colors"
                    style={{ color: settings.textColor }}
                    hoverColor={settings.textHoverColor}
                    activeStyle={settings.navActiveStyle}
                    activeColor={settings.accentColor}
                  />
               ))}
            </nav>
            <div className="flex items-center gap-4">
               {settings.showSearch && (
                 <div className="flex items-center">
                   <InlineSearch 
                    isOpen={isSearchOpen || false} 
                    onClose={onSearchClose || (() => {})} 
                    onSubmit={onSearchSubmit} 
                    placeholder={settings.searchPlaceholder}
                    inputClassName="border-b px-2 py-1" 
                    iconColor={settings.textColor} 
                   />
                   {!isSearchOpen && <button onClick={onSearchClick} className="hover:opacity-70 transition-opacity"><Search size={20} style={{ color: settings.textColor }} /></button>}
                 </div>
               )}
               {settings.showAccount && <button className="hover:opacity-70 transition-opacity"><User size={20} style={{ color: settings.textColor }} /></button>}
               {settings.showCart && (
                 <div onClick={onOpenCart} className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
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

// 16. HeaderPop - "Playful Modern" (Neo-Brutalist, Soft)
export const HeaderPop: React.FC<HeaderProps> = ({
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
  const settings = { ...POP_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50 p-4`} style={{ backgroundColor: settings.backgroundColor }}>
       <div 
        className="bg-white border-2 border-black rounded-xl min-h-[5.5rem] py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center px-4 justify-between"
        style={{ borderColor: settings.borderColor }}
       >
          <div 
            className="bg-[#FF90E8] border-2 border-black px-4 py-1 rounded-full font-black text-sm uppercase transform -rotate-2"
            style={{ borderColor: settings.borderColor }}
          >
             <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} onClick={onLogoClick} />
          </div>

          <nav className="hidden md:flex gap-2">
             {(links || []).map(l => (
                <NavItem 
                  key={l.href} 
                  link={l} 
                  onClick={onLinkClick} 
                  className="px-4 py-1.5 rounded-lg border-2 border-transparent hover:bg-black font-bold text-sm transition-all"
                  style={{ color: settings.textColor }}
                  hoverColor={settings.textHoverColor}
                  activeStyle={settings.navActiveStyle}
                  activeColor={settings.accentColor}
                />
             ))}
          </nav>

          <div className="flex items-center gap-2">
             {settings.showSearch && (
               <div className="flex items-center">
                 <InlineSearch 
                  isOpen={isSearchOpen || false} 
                  onClose={onSearchClose || (() => {})} 
                  onSubmit={onSearchSubmit} 
                  placeholder={settings.searchPlaceholder}
                  inputClassName="border-b-2 px-2 py-1" 
                  style={{ borderColor: settings.borderColor }}
                  iconColor={settings.textColor} 
                 />
                 {!isSearchOpen && <button onClick={onSearchClick} className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-neutral-100" style={{ borderColor: settings.borderColor }}><Search size={18} style={{ color: settings.textColor }} /></button>}
               </div>
             )}
             {settings.showAccount && (
               <button className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-neutral-100" style={{ borderColor: settings.borderColor }}>
                  <User size={18} style={{ color: settings.textColor }} />
               </button>
             )}
             {settings.showCart && (
               <button onClick={onOpenCart} className="bg-[#FFC900] px-4 py-1.5 rounded-full border-2 border-black font-bold text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all" style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor, borderColor: settings.borderColor }}>
                  <ShoppingBag size={16} /> Cart ({cartCount})
               </button>
             )}
          </div>
       </div>
    </header>
  );
};

// 17. HeaderStark - "Minimalist" (High Contrast, Black & White)
export const HeaderStark: React.FC<HeaderProps> = ({
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
  const settings = { ...STARK_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50`} style={{ backgroundColor: settings.backgroundColor, color: settings.textColor }}>
       <div className="flex flex-col md:flex-row items-center justify-between p-6">
          <div className="mb-4 md:mb-0">
              <Logo 
                storeName={storeName} 
                logoUrl={logoUrl} 
                logoHeight={logoHeight ? logoHeight * 1.5 : 48} 
                className="text-4xl md:text-5xl font-black tracking-tighter leading-none"
                onClick={onLogoClick}
              />
          </div>
          <div className="flex flex-col md:items-end gap-2">
             <nav className="flex gap-6">
                {(links || []).map(l => (
                   <NavItem 
                    key={l.href} 
                    link={l} 
                    onClick={onLinkClick} 
                    className="text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-colors"
                    style={{ color: settings.textColor }}
                    hoverColor={settings.textHoverColor || settings.accentColor}
                    activeStyle={settings.navActiveStyle}
                    activeColor={settings.accentColor}
                   />
                ))}
             </nav>
             <div className="flex items-center gap-2 text-xs opacity-70">
                {settings.showSearch && (
                  <>
                    <div className="flex items-center">
                      <InlineSearch 
                        isOpen={isSearchOpen || false} 
                        onClose={onSearchClose || (() => {})} 
                        onSubmit={onSearchSubmit} 
                        placeholder={settings.searchPlaceholder}
                        inputClassName="bg-black border-b border-white px-2 py-1 text-white" 
                        iconColor={settings.textColor} 
                      />
                      {!isSearchOpen && <span onClick={onSearchClick} className="cursor-pointer hover:text-white transition-colors">SEARCH</span>}
                    </div>
                    <span>/</span>
                  </>
                )}
                {settings.showAccount && (
                  <>
                    <span className="cursor-pointer hover:text-white transition-colors uppercase">Account</span>
                    <span>/</span>
                  </>
                )}
                {settings.showCart && (
                  <span onClick={onOpenCart} className="cursor-pointer hover:text-white transition-colors">CART ({cartCount})</span>
                )}
             </div>
          </div>
       </div>
    </header>
  );
};

// 18. HeaderOffset - "Asymmetric" (Asymmetrical)
export const HeaderOffset: React.FC<HeaderProps> = ({
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
  const settings = { ...OFFSET_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50 pt-4 px-4 pb-0`} style={{ backgroundColor: settings.backgroundColor }}>
       <div className="flex justify-between items-start mb-4">
          <Logo storeName={`${storeName}.`} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-bold" onClick={onLogoClick} />
          <div className="flex gap-4">
             {settings.showSearch && (
               <div className="flex items-center">
                 <InlineSearch 
                  isOpen={isSearchOpen || false} 
                  onClose={onSearchClose || (() => {})} 
                  onSubmit={onSearchSubmit} 
                  placeholder={settings.searchPlaceholder}
                  inputClassName="border-b px-2 py-1" 
                  style={{ borderColor: settings.borderColor }}
                  iconColor={settings.textColor} 
                 />
                 {!isSearchOpen && <button onClick={onSearchClick} className="hover:opacity-70 transition-opacity"><Search size={20} style={{ color: settings.textColor }} /></button>}
               </div>
             )}
             {settings.showAccount && <button className="hover:opacity-70 transition-opacity"><User size={20} style={{ color: settings.textColor }} /></button>}
             {settings.showCart && (
               <div onClick={onOpenCart} className="relative cursor-pointer hover:opacity-70 transition-opacity">
                  <ShoppingBag size={20} style={{ color: settings.textColor }} />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: settings.accentColor }}></span>}
               </div>
             )}
          </div>
       </div>
       <div className="flex justify-end">
          <nav 
            className="rounded-t-xl px-8 py-3 flex gap-8"
            style={{ backgroundColor: settings.borderColor || '#f5f5f5' }}
          >
             {(links || []).map(l => (
                <NavItem 
                  key={l.href} 
                  link={l} 
                  onClick={onLinkClick} 
                  className="text-sm font-medium transition-colors"
                  style={{ color: settings.textColor }}
                  hoverColor={settings.textHoverColor || settings.accentColor}
                  activeStyle={settings.navActiveStyle}
                  activeColor={settings.accentColor}
                />
             ))}
          </nav>
       </div>
       <div className="h-px w-full" style={{ backgroundColor: settings.borderColor }}></div>
    </header>
  );
};

// 19. HeaderTicker - "News Ticker" (Stock Market Vibe)
export const HeaderTicker: React.FC<HeaderProps> = ({
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
  const settings = { ...TICKER_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50`} style={{ backgroundColor: settings.backgroundColor }}>
       <div 
        className="text-white text-xs font-mono py-1 overflow-hidden whitespace-nowrap"
        style={{ backgroundColor: settings.tickerBackgroundColor, color: settings.tickerTextColor }}
       >
          <div className="animate-marquee inline-block">
             {settings.tickerText} • {settings.tickerText} •
          </div>
       </div>
       <div className="border-b min-h-[5.5rem] py-2 flex items-center justify-between px-4" style={{ borderColor: settings.tickerBackgroundColor }}>
          <div className="flex items-center gap-2">
             <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold text-lg tracking-tight" onClick={onLogoClick} />
          </div>
          <nav className="hidden md:flex gap-6 h-full">
             {(links || []).map(l => (
                <NavItem 
                  key={l.href} 
                  link={l} 
                  onClick={onLinkClick} 
                  className="h-full flex items-center border-b-2 border-transparent text-sm font-medium transition-colors px-2"
                  style={{ color: settings.textColor }}
                  hoverColor={settings.accentColor}
                  activeStyle={settings.navActiveStyle}
                  activeColor={settings.accentColor}
                />
             ))}
          </nav>
          <div className="flex items-center gap-2">
             {settings.showSearch && (
               <div className="flex items-center">
                 <InlineSearch 
                  isOpen={isSearchOpen || false} 
                  onClose={onSearchClose || (() => {})} 
                  onSubmit={onSearchSubmit} 
                  placeholder={settings.searchPlaceholder}
                  inputClassName="border-b px-2 py-1" 
                  style={{ borderColor: settings.accentColor }}
                  iconColor={settings.accentColor} 
                 />
                 {!isSearchOpen && <button onClick={onSearchClick} className="p-2 rounded transition-colors" style={{ backgroundColor: `${settings.accentColor}20`, color: settings.accentColor }}><Search size={18} /></button>}
               </div>
             )}
             {settings.showAccount && <button className="p-2 rounded transition-colors" style={{ backgroundColor: `${settings.accentColor}20`, color: settings.accentColor }}><User size={18} /></button>}
             {settings.showCart && (
               <button onClick={onOpenCart} className="px-3 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors" style={{ backgroundColor: `${settings.accentColor}20`, color: settings.accentColor }}>
                  <ShoppingBag size={16} /> CART: {cartCount}
               </button>
             )}
          </div>
       </div>
    </header>
  );
};

// 20. HeaderNoir - "Cinematic Noir" (Dark Sophisticated)
export const HeaderNoir: React.FC<HeaderProps> = ({
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
  const settings = { ...NOIR_DEFAULTS, ...data };
  
  return (
    <header className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-50`} style={{ backgroundColor: settings.backgroundColor }}>
       <div className="max-w-screen-2xl mx-auto px-12 py-10 flex items-end justify-between border-b" style={{ borderColor: `${settings.textColor}20` }}>
          <div className="flex-1">
             <nav className="flex flex-col gap-1">
                {(links || []).map(l => (
                   <NavItem 
                    key={l.href} 
                    link={l} 
                    onClick={onLinkClick} 
                    className="text-xs uppercase tracking-[0.3em] transition-colors"
                    style={{ color: settings.textColor }}
                    hoverColor={settings.accentColor}
                    activeStyle={settings.navActiveStyle}
                    activeColor={settings.accentColor}
                   />
                ))}
             </nav>
          </div>
          <div className="flex-1 flex justify-center">
             <Logo 
              storeName={storeName} 
              logoUrl={logoUrl} 
              logoHeight={logoHeight ? logoHeight * 1.8 : 56} 
              className="text-5xl font-serif italic tracking-tighter"
              onClick={onLogoClick}
             />
          </div>
          <div className="flex-1 flex justify-end gap-12 font-serif italic">
             {settings.showSearch && (
               <div className="flex items-center">
                 <InlineSearch 
                  isOpen={isSearchOpen || false} 
                  onClose={onSearchClose || (() => {})} 
                  onSubmit={onSearchSubmit} 
                  placeholder={settings.searchPlaceholder}
                  inputClassName="border-b px-2 py-1 italic" 
                  iconColor={settings.textColor} 
                 />
                 {!isSearchOpen && <button onClick={onSearchClick} className="hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>Search</button>}
               </div>
             )}
             {settings.showAccount && <button className="hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>Profile</button>}
             {settings.showCart && <button onClick={onOpenCart} className="hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>Cart ({cartCount})</button>}
          </div>
       </div>
    </header>
  );
};

// 21. HeaderGhost - "Glassmorphic Ghost" (Floating Blur)
export const HeaderGhost: React.FC<HeaderProps> = ({
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
  const settings = { ...GHOST_DEFAULTS, ...data };
  
  return (
    <div className={`w-full ${settings.sticky ? 'sticky top-4' : 'pt-8'} z-50 px-8 flex justify-center`}>
       <header 
         className="backdrop-blur-xl border rounded-2xl flex items-center justify-between px-8 py-3 w-full max-w-5xl shadow-2xl"
         style={{ 
           backgroundColor: `${settings.backgroundColor}80`, 
           borderColor: settings.borderColor,
           boxShadow: `0 25px 50px -12px ${settings.accentColor}20`
         }}
       >
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-xl font-bold tracking-tight" onClick={onLogoClick} />
          
          <nav className="flex items-center gap-8">
             {(links || []).map(l => (
                <NavItem 
                  key={l.href} 
                  link={l} 
                  onClick={onLinkClick} 
                  className="text-sm font-medium transition-all hover:scale-105"
                  style={{ color: settings.textColor }}
                  hoverColor={settings.accentColor}
                />
             ))}
          </nav>

          <div className="flex items-center gap-6">
             {settings.showSearch && (
               <div className="flex items-center">
                 <InlineSearch 
                  isOpen={isSearchOpen || false} 
                  onClose={onSearchClose || (() => {})} 
                  onSubmit={onSearchSubmit} 
                  placeholder={settings.searchPlaceholder}
                  inputClassName="bg-transparent border-b px-2 py-1" 
                  iconColor={settings.textColor} 
                 />
                 {!isSearchOpen && <button onClick={onSearchClick} className="hover:opacity-70 transition-opacity"><Search size={18} style={{ color: settings.textColor }} /></button>}
               </div>
             )}
             {settings.showAccount && <button className="hover:opacity-70 transition-opacity"><User size={18} style={{ color: settings.textColor }} /></button>}
             {settings.showCart && (
               <button 
                onClick={onOpenCart} 
                className="relative px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: settings.accentColor, color: settings.cartBadgeTextColor }}
               >
                  Cart {cartCount > 0 && `(${cartCount})`}
               </button>
             )}
          </div>
       </header>
    </div>
  );
};

// Header: Pathfinder - SVG path draw animation on scroll
export const HeaderPathfinder: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
  const settings = { ...DEFAULTS, ...data };
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
    <header ref={headerRef} className={`${settings.sticky ? 'sticky' : 'relative'} top-0 z-[100] min-h-20 py-2`}>
      <div className="absolute inset-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            ref={svgPathRef}
            d="M 0 79.5 L 1440 79.5 L 1440 0.5 L 0 0.5 Z"
            stroke={settings.borderColor}
            strokeWidth="1"
            fill={settings.backgroundColor}
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'}}
          />
        </svg>
      </div>
      <div className={`relative max-w-${settings.maxWidth} mx-auto px-4 sm:px-6 lg:px-8 h-full`}>
        <div className="flex justify-between items-center h-full">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
          ) : (
            <span className="text-xl font-bold" style={{ color: settings.textColor }}>{storeName}</span>
          )}
          <nav className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <NavItem
                key={link.href}
                link={link}
                onClick={onLinkClick}
                className="transition-colors"
                style={{ color: settings.textColor }}
                hoverColor={settings.textHoverColor}
              />
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {settings.showSearch && (
              <>
                <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b px-2 py-1" style={{ borderColor: settings.textColor, color: settings.textColor }} iconColor={settings.textColor} />
                {!isSearchOpen && <button onClick={onSearchClick} className="p-2 transition-colors hover:opacity-70" style={{ color: settings.textColor }}>
                  <Search size={20} />
                </button>}
              </>
            )}
            {settings.showAccount && (
              <button className="p-2 transition-colors hover:opacity-70" style={{ color: settings.textColor }}>
                <User size={20} />
              </button>
            )}
            {settings.showCart && (
              <button onClick={onOpenCart} className="relative p-2" style={{ color: settings.textColor }}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                    style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}>
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

// Header: Cypher - Glitch text effect on hover
export const HeaderCypher: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
  const settings = { ...DEFAULTS, ...data };
  const [isScrolled, setIsScrolled] = React.useState(false);
  const glitchId = React.useId().replace(/:/g, '');

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const bgColor = settings.backgroundColor;

  return (
    <>
      {isScrolled && settings.sticky && <div className="h-24" />}
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
          text-shadow: -1px 0 ${settings.accentColor || 'red'};
          animation: glitch-anim-1-${glitchId} 0.5s infinite linear alternate-reverse;
        }
        .glitch-text-${glitchId}:hover::after {
          left: -2px;
          text-shadow: -1px 0 ${settings.accentColorSecondary || 'blue'};
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
      <header className={`transition-all duration-300 ease-in-out ${
        isScrolled && settings.sticky
          ? 'fixed top-0 left-0 right-0 z-[100] h-20 backdrop-blur-sm shadow-lg' 
          : 'relative h-24 border-b border-transparent'
      }`} style={{ 
        backgroundColor: isScrolled && settings.sticky ? `${bgColor}cc` : bgColor,
        borderColor: settings.borderColor,
        color: settings.textColor
      }}>
        <div className={`max-w-${settings.maxWidth} mx-auto px-4 sm:px-6 lg:px-8 h-full`}>
          <div className="flex justify-between items-center h-full">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <div className={`text-3xl font-black tracking-tighter glitch-text-${glitchId}`} data-text={storeName}
                style={{ color: settings.textColor }}>{storeName}</div>
            )}
            <nav className="hidden md:flex items-center space-x-10">
              {links.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  onClick={onLinkClick}
                  className={`text-lg font-semibold uppercase tracking-widest glitch-text-${glitchId}`}
                  data-text={link.label}
                  style={{ color: settings.textColor }}
                  hoverColor={settings.textHoverColor}
                />
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {settings.showSearch && (
                <>
                  <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-fuchsia-500/50 text-white placeholder-gray-400 px-2 py-1" iconColor={settings.textColor} />
                  {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
                    <Search size={20} />
                  </button>}
                </>
              )}
              {settings.showAccount && (
                <button className="p-2 hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
                  <User size={20} />
                </button>
              )}
              {settings.showCart && (
                <button onClick={onOpenCart} className="relative p-2" style={{ color: settings.textColor }}>
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                      style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// Header: Particle - Interactive particle canvas background
export const HeaderParticle: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
  const settings = { ...DEFAULTS, ...data };
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
    const particleCount = settings.particleCount || 70;

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
        ctx.fillStyle = settings.particleColor || settings.textColor || 'rgba(255, 255, 255, 0.7)';
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
  }, [isScrolled, settings.particleColor, settings.particleCount, settings.textColor]);

  const bgColor = settings.backgroundColor;

  return (
    <>
      {isScrolled && settings.sticky && <div className="h-28" />}
      <header className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isScrolled && settings.sticky
          ? 'fixed top-0 left-0 right-0 z-[100] h-20 shadow-lg' 
          : 'relative h-28'
      }`} style={{ backgroundColor: bgColor }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className={`relative z-10 max-w-${settings.maxWidth} mx-auto px-4 sm:px-6 lg:px-8 h-full`}>
          <div className="flex justify-between items-center h-full">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <span className="text-3xl font-bold" style={{ color: settings.textColor }}>{storeName}</span>
            )}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
              {links.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  onClick={onLinkClick}
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: settings.textColor }}
                  hoverColor={settings.textHoverColor}
                />
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {settings.showSearch && (
                <>
                  <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-white/30 text-white placeholder-gray-400 px-2 py-1" iconColor={settings.textColor} />
                  {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
                    <Search size={20} />
                  </button>}
                </>
              )}
              {settings.showAccount && (
                <button className="p-2 hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
                  <User size={20} />
                </button>
              )}
              {settings.showCart && (
                <button onClick={onOpenCart} className="relative p-2" style={{ color: settings.textColor }}>
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                      style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// Header: Lumina - Mouse-following spotlight effect
export const HeaderLumina: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
  const settings = { ...DEFAULTS, ...data };
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

  const bgColor = settings.backgroundColor;

  return (
    <>
      {isScrolled && settings.sticky && <div className="h-24" />}
      <header
        ref={headerRef}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isScrolled && settings.sticky
            ? 'fixed top-0 left-0 right-0 z-[100] h-20 backdrop-blur-sm border-b shadow-lg' 
            : 'relative h-24 border-b'
        }`}
        style={{
          backgroundColor: isScrolled && settings.sticky ? `${bgColor}cc` : bgColor,
          borderColor: settings.borderColor,
          color: settings.textColor,
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
              ${settings.accentColor || 'rgba(100, 116, 139, 0.2)'}, 
              transparent 80%
            )`
          }}
        />
        <div className={`max-w-${settings.maxWidth} mx-auto px-4 sm:px-6 lg:px-8 h-full`}>
          <div className="flex justify-between items-center h-full relative z-20">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <span className="text-2xl font-bold tracking-widest" style={{ color: settings.textColor }}>{storeName}</span>
            )}
            <nav className="hidden md:flex items-center space-x-10 text-sm uppercase tracking-wider">
              {links.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  onClick={onLinkClick}
                  className="hover:text-white transition-colors"
                  style={{ color: settings.textColor }}
                  hoverColor={settings.textHoverColor}
                />
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {settings.showSearch && (
                <>
                  <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-gray-600 text-white placeholder-gray-500 px-2 py-1" iconColor={settings.textColor} />
                  {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:text-white transition-colors" style={{ color: settings.textColor }}>
                    <Search size={20} />
                  </button>}
                </>
              )}
              {settings.showAccount && (
                <button className="p-2 hover:text-white transition-colors" style={{ color: settings.textColor }}>
                  <User size={20} />
                </button>
              )}
              {settings.showCart && (
                <button onClick={onOpenCart} className="relative p-2" style={{ color: settings.textColor }}>
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                      style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// Header: Aqua - Liquid glass effect with blur
export const HeaderAqua: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
  const settings = { ...DEFAULTS, ...data };
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isScrolled && settings.sticky && <div className="h-24" />}
      <header 
        className={`w-full transition-all duration-300 ease-in-out ${
          isScrolled && settings.sticky
            ? 'fixed top-0 left-0 right-0 z-[100] h-20 backdrop-blur-xl border-b shadow-lg' 
            : 'relative h-24 border-b'
        }`}
        style={{
          backgroundColor: isScrolled && settings.sticky ? `${settings.backgroundColor}cc` : settings.backgroundColor,
          borderColor: settings.borderColor,
          color: settings.textColor,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className={`max-w-${settings.maxWidth} mx-auto px-4 sm:px-6 lg:px-8 h-full`}>
          <div className="flex justify-between items-center h-full">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <span className="text-2xl font-bold tracking-tight" style={{ color: settings.textColor, textShadow: '1px 1px 4px rgba(0,0,0,0.1)' }}>{storeName}</span>
            )}
            <nav className="hidden md:flex items-center space-x-10 text-sm font-medium">
              {links.map((link) => (
                <NavItem
                  key={link.href}
                  link={link}
                  onClick={onLinkClick}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: settings.textColor }}
                  hoverColor={settings.textHoverColor}
                />
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {settings.showSearch && (
                <>
                  <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-white/30 text-white placeholder-gray-400 px-2 py-1" iconColor={settings.textColor} />
                  {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
                    <Search size={20} />
                  </button>}
                </>
              )}
              {settings.showAccount && (
                <button className="p-2 hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
                  <User size={20} />
                </button>
              )}
              {settings.showCart && (
                <button onClick={onOpenCart} className="relative p-2" style={{ color: settings.textColor }}>
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center"
                      style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// Header: Refined - Clean with animated dropdown menu
export const HeaderRefined: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, onSearchClick, isSearchOpen, onSearchClose, onSearchSubmit, data }) => {
  const settings = { ...DEFAULTS, ...data };
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {isScrolled && settings.sticky && <div className="h-24" />}
      <header className={`transition-all duration-300 ease-in-out w-full border-b ${
        isScrolled && settings.sticky
          ? 'fixed top-0 left-0 right-0 z-[100] h-20 backdrop-blur-md shadow-lg' 
          : 'relative h-24'
      }`} style={{ 
        backgroundColor: isScrolled && settings.sticky ? `${settings.backgroundColor}e6` : settings.backgroundColor,
        borderColor: settings.borderColor
      }}>
        <div className={`max-w-${settings.maxWidth} mx-auto px-4 sm:px-6 lg:px-8 h-full`}>
          <div className="flex justify-between items-center h-full">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px` }} className="object-contain" />
            ) : (
              <span className="text-xl font-bold" style={{ color: settings.textColor }}>{storeName}</span>
            )}
            <nav className="hidden md:flex items-center space-x-8">
              {links.map((link) => (
                <div key={link.href} className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <NavItem
                    link={link}
                    onClick={onLinkClick}
                    className="transition-colors flex items-center h-full"
                    style={{ color: settings.textColor }}
                    hoverColor={settings.textHoverColor}
                    activeStyle={settings.navActiveStyle}
                    activeColor={settings.accentColor}
                  />
                </div>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              {settings.showSearch && (
                <>
                  <InlineSearch isOpen={isSearchOpen || false} onClose={onSearchClose || (() => {})} onSubmit={onSearchSubmit} inputClassName="bg-transparent border-b border-gray-300 text-gray-800 placeholder-gray-400 px-2 py-1" iconColor={settings.textColor} />
                  {!isSearchOpen && <button onClick={onSearchClick} className="p-2 hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
                    <Search size={20} />
                  </button>}
                </>
              )}
              {settings.showAccount && (
                <button className="p-2 hover:opacity-70 transition-opacity" style={{ color: settings.textColor }}>
                  <User size={20} />
                </button>
              )}
              {settings.showCart && (
                <button onClick={onOpenCart} className="relative p-2" style={{ color: settings.textColor }}>
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold"
                      style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}>
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

// 26. The Orbit (Dynamic Island style)
export const HeaderOrbit: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const [expanded, setExpanded] = React.useState(false);
  const settings = { ...DEFAULTS, ...data };
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;

  return (
    <header className={`${settings.sticky ? 'sticky' : 'relative'} top-0 z-[100] flex justify-center pointer-events-none pt-6`}>
      <div 
        className={`pointer-events-auto shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${maxWidthClass} ${expanded ? 'h-auto rounded-3xl' : 'min-h-[3.5rem] py-2 rounded-full'}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{ backgroundColor: settings.backgroundColor, border: `1px solid ${settings.borderColor}`, width: expanded ? '600px' : '400px' }}
      >
        <div className="w-full flex items-center justify-between px-6">
           <div className="flex items-center gap-2 py-1">
             <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold" style={{ color: settings.textColor }} />
           </div>
           
           {!expanded && (
             <div className="flex items-center gap-4 text-sm" style={{ color: settings.textColor }}>
                <span className="opacity-50">Menu</span>
                <div className="w-px h-4 bg-gray-700 opacity-20"></div>
                <button onClick={onOpenCart} className="flex items-center gap-1 cursor-pointer">
                  <ShoppingBag size={14}/> {cartCount}
                </button>
             </div>
           )}
        </div>

        {expanded && (
          <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
             <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider opacity-50" style={{ color: settings.textColor }}>Navigation</span>
                {(links || []).map(l => (
                  <NavItem 
                    key={l.label} 
                    link={l} 
                    onClick={onLinkClick} 
                    className="text-lg font-medium transition-colors" 
                    style={{ color: settings.textColor }} 
                    hoverColor={settings.textHoverColor}
                    activeStyle={settings.navActiveStyle}
                    activeColor={settings.accentColor}
                  />
                ))}
             </div>
             <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider opacity-50" style={{ color: settings.textColor }}>Store</span>
                <button onClick={onOpenCart} className="text-sm hover:underline text-left" style={{ color: settings.textColor }}>View Cart ({cartCount})</button>
                <div className="mt-auto pt-4 border-t flex justify-between items-center" style={{ borderColor: settings.borderColor }}>
                  <span className="text-sm opacity-70" style={{ color: settings.textColor }}>Ready to checkout?</span>
                  <button onClick={onOpenCart} className="px-4 py-1.5 rounded-full text-xs font-bold" 
                    style={{ backgroundColor: settings.textColor, color: settings.backgroundColor }}>
                    Checkout
                  </button>
                </div>
             </div>
          </div>
        )}
      </div>
    </header>
  );
};

// 27. The Studio (Sidebar Navigation)
export const HeaderStudio: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 48, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const settings = { ...DEFAULTS, ...data };
  
  return (
    <header className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 border-r flex-col p-8 z-50"
      style={{ backgroundColor: settings.backgroundColor, borderColor: settings.borderColor }}>
      <div className="mb-12">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-black tracking-tighter uppercase leading-none" style={{ color: settings.textColor }} />
      </div>
      
      <nav className="flex flex-col gap-6 flex-1">
         {(links || []).map(l => (
           <NavItem 
            key={l.label} 
            link={l} 
            onClick={onLinkClick} 
            className="text-lg font-medium hover:pl-2 transition-all duration-300" 
            style={{ color: settings.textColor }} 
            hoverColor={settings.textHoverColor}
            activeColor={settings.accentColor || settings.textHoverColor}
            activeStyle={settings.navActiveStyle}
           />
         ))}
      </nav>

      <div className="mt-auto space-y-6">
         {settings.showSearch && (
           <div className="relative w-full">
             <input type="text" placeholder="Search..." className="w-full bg-white/5 border border-gray-200 px-3 py-2 text-sm rounded-md focus:outline-none" style={{ color: settings.textColor }} />
             <Search size={14} className="absolute right-3 top-3 opacity-40" style={{ color: settings.textColor }} />
           </div>
         )}
         
         <div className="flex justify-between items-center border-t pt-6" style={{ borderColor: settings.borderColor }}>
            <div className="flex flex-col">
               <span className="text-xs opacity-50" style={{ color: settings.textColor }}>Your Bag</span>
               <span className="font-bold text-lg" style={{ color: settings.textColor }}>{cartCount} Items</span>
            </div>
            {settings.showCart && (
              <button onClick={onOpenCart} className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors"
                style={{ backgroundColor: settings.textColor, color: settings.backgroundColor }}>
                 {cartCount}
              </button>
            )}
         </div>
      </div>
    </header>
  );
};

// 28. HeaderFlow (Scroll-reactive)
export const HeaderFlow: React.FC<HeaderProps> = ({ storeName, logoUrl, logoHeight = 32, links, cartCount, onOpenCart, onLinkClick, data }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const settings = { ...DEFAULTS, ...data };
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`w-full transition-all duration-500 z-50 ${settings.sticky ? 'sticky top-0' : 'relative'} ${scrolled ? 'py-2 shadow-lg' : 'py-6'}`}
      style={{ 
        backgroundColor: scrolled ? settings.backgroundColor : 'transparent',
        borderBottom: scrolled ? `1px solid ${settings.borderColor}` : '1px solid transparent'
      }}>
      <div className={`${maxWidthClass} mx-auto px-6 flex items-center justify-between transition-all duration-500 ${scrolled ? 'scale-95' : 'scale-100'}`}>
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-bold tracking-tighter" style={{ color: settings.textColor }} />
        
        <nav className="hidden md:flex gap-8">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-sm font-medium transition-colors" 
              style={{ color: settings.textColor }} 
              hoverColor={settings.textHoverColor}
              activeColor={settings.accentColor || settings.textHoverColor}
              activeStyle={settings.navActiveStyle}
            />
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {settings.showCart && (
            <button onClick={onOpenCart} className="relative p-2 rounded-full border transition-all"
              style={{ color: settings.textColor, borderColor: settings.borderColor }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: settings.cartBadgeColor, color: settings.cartBadgeTextColor }}>
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
  orbit: HeaderOrbit,
  studio: HeaderStudio,
  flow: HeaderFlow,
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
  { id: 'orbit', name: 'Interactive Island', description: 'Capsule style UI', date: '2024-08-01', popularity: 78 },
  { id: 'studio', name: 'Sidebar Navigation', description: 'Left sidebar design', date: '2024-01-20', popularity: 60 },
  { id: 'pathfinder', name: 'Pathfinder', description: 'SVG path animation', date: '2025-01-05', popularity: 73 },
  { id: 'cypher', name: 'Cypher', description: 'Glitch text effect', date: '2025-01-05', popularity: 71 },
  { id: 'particle', name: 'Particle', description: 'Interactive particles', date: '2025-01-05', popularity: 75 },
  { id: 'lumina', name: 'Lumina', description: 'Mouse spotlight', date: '2025-01-05', popularity: 69 },
  { id: 'aqua', name: 'Aqua', description: 'Liquid glass blur', date: '2025-01-05', popularity: 79 },
  { id: 'refined', name: 'Refined', description: 'Clean professional', date: '2025-01-05', popularity: 81 },
  { id: 'flow', name: 'Flow', description: 'Reactive scroll design', date: '2025-01-06', popularity: 72 },
];

export const HEADER_FIELDS: Record<string, string[]> = {
  canvas: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'iconSize', 'iconHoverBackgroundColor', 'borderWidth',
    'sticky', 'maxWidth', 'paddingX', 'paddingY', 'navActiveStyle'
  ],
  nebula: [
    'showSearch', 'showCart', 'showIndicatorDot',
    'backgroundColor', 'borderColor', 'borderWidth', 'textColor', 'textHoverColor',
    'accentColor', 'iconSize', 'iconHoverBackgroundColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'blurIntensity', 'navActiveStyle'
  ],
  luxe: [
    'showMenu', 'showSearch', 'showAccount', 'showCart', 'showTagline',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'taglineColor', 'taglineText', 'cartBadgeColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  pilot: [
    'showCart', 'showCTA', 'showLogoBadge',
    'backgroundColor', 'textColor', 'textHoverColor', 'accentColor',
    'ctaBackgroundColor', 'ctaHoverColor', 'ctaTextColor', 'ctaText',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  bunker: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'tickerText', 'tickerBackgroundColor', 'tickerTextColor', 'tickerBorderColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  protocol: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'scanlineColor', 'navActiveStyle'
  ],
  horizon: [
    'showSearch', 'showAccount', 'showCart', 'showSocial',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'utilityBarBackgroundColor', 'utilityBarTextColor', 'navActiveStyle'
  ],
  terminal: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'terminalPromptColor', 'navActiveStyle'
  ],
  portfolio: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  venture: [
    'showSearch', 'showAccount', 'showCart', 'showKeyboardShortcut',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'searchPlaceholder', 'navActiveStyle'
  ],
  metro: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  modul: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  gullwing: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  pop: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'searchPlaceholder', 'navActiveStyle'
  ],
  stark: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'searchPlaceholder', 'navActiveStyle'
  ],
  offset: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  ticker: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'tickerText', 'tickerBackgroundColor', 'tickerTextColor', 'navActiveStyle'
  ],
  noir: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'searchPlaceholder', 'navActiveStyle'
  ],
  ghost: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'searchPlaceholder', 'navActiveStyle'
  ],
  pathfinder: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  cypher: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor', 'accentColor', 'accentColorSecondary',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  particle: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'particleCount', 'particleColor',
    'cartBadgeColor', 'cartBadgeTextColor', 'navActiveStyle',
    'sticky', 'maxWidth'
  ],
  lumina: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor', 'accentColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  aqua: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  refined: [
    'showSearch', 'showAccount', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  orbit: [
    'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  studio: [
    'showSearch', 'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
  flow: [
    'showCart',
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'cartBadgeColor', 'cartBadgeTextColor',
    'sticky', 'maxWidth', 'navActiveStyle'
  ],
};

