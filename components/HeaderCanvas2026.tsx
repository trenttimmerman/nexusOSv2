// THIS IS THE NEW 2026 CANVAS HEADER - TO BE MERGED INTO HeaderLibrary.tsx

import React from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { NavLink } from '../types';

// Header customization data structure
interface HeaderData {
  showSearch?: boolean;
  showAccount?: boolean;
  showCart?: boolean;
  showCTA?: boolean;
  showMobileMenu?: boolean;
  showAnnouncementBar?: boolean;
  showUtilityBar?: boolean;
  showCommandPalette?: boolean;
  enableSmartScroll?: boolean;
  enableMegaMenu?: boolean;
  megaMenuStyle?: 'traditional' | 'bento';
  enableSpotlightBorders?: boolean;
  enableGlassmorphism?: boolean;
  navActiveStyle?: 'none' | 'dot' | 'underline' | 'capsule' | 'glow' | 'brutalist' | 'minimal' | 'overline' | 'double' | 'bracket' | 'highlight' | 'skewed';
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textHoverColor?: string;
  accentColor?: string;
  cartBadgeColor?: string;
  cartBadgeTextColor?: string;
  iconSize?: number;
  iconHoverBackgroundColor?: string;
  borderWidth?: string;
  sticky?: boolean;
  maxWidth?: string;
  paddingX?: string;
  paddingY?: string;
  announcementText?: string;
  announcementBackgroundColor?: string;
  announcementTextColor?: string;
  announcementDismissible?: boolean;
  announcementMarquee?: boolean;
  utilityBarBackgroundColor?: string;
  utilityBarTextColor?: string;
  showCurrencySelector?: boolean;
  showLanguageSelector?: boolean;
  mobileMenuBackgroundColor?: string;
  mobileMenuTextColor?: string;
  mobileMenuOverlayOpacity?: number;
  mobileMenuPosition?: 'left' | 'right';
  mobileMenuWidth?: string;
  blurIntensity?: 'sm' | 'md' | 'lg' | 'xl';
  glassBackgroundOpacity?: number;
  smartScrollThreshold?: number;
  smartScrollDuration?: number;
  searchPlaceholder?: string;
  searchBackgroundColor?: string;
  searchBorderColor?: string;
  searchInputTextColor?: string;
  utilityBarLinks?: Array<{ label: string; href: string }>;
  ctaText?: string;
  ctaBackgroundColor?: string;
  ctaHoverColor?: string;
  layout?: 'default' | 'logo-left-nav-center' | 'logo-center-nav-left' | 'split-island' | 'minimal';
  [key: string]: any;
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
  data?: HeaderData;
}

const CANVAS_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  showMobileMenu: true,
  showAnnouncementBar: false,
  showUtilityBar: false,
  showCommandPalette: false,
  enableSmartScroll: false,
  enableMegaMenu: false,
  megaMenuStyle: 'traditional',
  enableSpotlightBorders: false,
  enableGlassmorphism: false,
  backgroundColor: '#ffffff',
  borderColor: '#f3f4f6',
  textColor: '#6b7280',
  textHoverColor: '#000000',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#ffffff',
  accentColor: '#3b82f6',
  iconSize: 20,
  iconHoverBackgroundColor: 'transparent',
  borderWidth: '1px',
  sticky: true,
  maxWidth: '7xl',
  paddingX: '24px',
  paddingY: '16px',
  navActiveStyle: 'dot',
  announcementText: 'Free shipping on orders over $100',
  announcementBackgroundColor: '#000000',
  announcementTextColor: '#ffffff',
  announcementDismissible: true,
  announcementMarquee: false,
  utilityBarBackgroundColor: '#f9fafb',
  utilityBarTextColor: '#6b7280',
  showCurrencySelector: true,
  showLanguageSelector: true,
  mobileMenuBackgroundColor: '#ffffff',
  mobileMenuTextColor: '#000000',
  mobileMenuOverlayOpacity: 50,
  mobileMenuPosition: 'left',
  mobileMenuWidth: '320px',
  blurIntensity: 'xl',
  glassBackgroundOpacity: 60,
  smartScrollThreshold: 100,
  searchPlaceholder: 'Search products...',
  layout: 'default',
};

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
  onClick?: (href: string) => void;
  children?: React.ReactNode;
}> = ({ link, className, style, onClick, children }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(link.href);
    }
  };

  return (
    <a href={link.href} onClick={handleClick} className={className} style={style}>
      {children || link.label}
    </a>
  );
};

const InlineSearch: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (query: string) => void;
  className?: string;
  inputClassName?: string;
  iconColor?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
}> = ({ isOpen, onClose, onSubmit, className = '', inputClassName = '', iconColor, placeholder = 'Search...', style = {}, inputStyle = {} }) => {
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
      style={{ width: isOpen ? '200px' : '0px', opacity: isOpen ? 1 : 0, ...style }}
    >
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full text-sm outline-none ${inputClassName}`}
          style={inputStyle}
        />
        <button type="button" onClick={onClose} className="p-1 hover:opacity-70 transition-opacity flex-shrink-0">
          <X size={14} style={{ color: iconColor }} />
        </button>
      </form>
    </div>
  );
};

// 1. HeaderCanvas - "2026 Edition" (Modern, Feature-Complete)
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
  
  // State management
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  // Smart scroll logic
  React.useEffect(() => {
    if (!settings.enableSmartScroll) return;
    
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      
      // Track if scrolled past threshold
      setIsScrolled(currentScrollY > 50);
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > (settings.smartScrollThreshold || 100)) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY, settings.enableSmartScroll, settings.smartScrollThreshold]);
  
  // Close mobile menu on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);
  
  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  
  const maxWidthClass = settings.maxWidth === 'full' ? 'max-w-full' : `max-w-${settings.maxWidth}`;
  
  // Glassmorphism styles
  const glassStyles = settings.enableGlassmorphism ? {
    backgroundColor: `rgba(255, 255, 255, ${(settings.glassBackgroundOpacity || 60) / 100})`,
    backdropFilter: `blur(${settings.blurIntensity === 'sm' ? '4px' : settings.blurIntensity === 'md' ? '8px' : settings.blurIntensity === 'lg' ? '12px' : '20px'})`,
    WebkitBackdropFilter: `blur(${settings.blurIntensity === 'sm' ? '4px' : settings.blurIntensity === 'md' ? '8px' : settings.blurIntensity === 'lg' ? '12px' : '20px'})`,
  } : {};

  // Render helpers
  const renderLogo = () => (
    <Logo
      storeName={storeName}
      logoUrl={logoUrl}
      logoHeight={logoHeight}
      className="text-2xl font-bold tracking-tight"
      onClick={onLogoClick}
    />
  );

  const renderNav = () => (
    <nav className="hidden md:flex gap-6 items-center">
      {(links || []).map((link) => (
        <NavItem
          key={link.href}
          link={link}
          onClick={onLinkClick}
          className="text-sm font-medium transition-colors"
          style={{ color: settings.textColor }}
        />
      ))}
    </nav>
  );

  const renderIcons = () => (
    <div className="flex items-center gap-2">
      {settings.showSearch && (
        <div className="flex items-center">
          <InlineSearch
            isOpen={isSearchOpen || false}
            onClose={onSearchClose || (() => {})}
            onSubmit={onSearchSubmit}
            placeholder={settings.searchPlaceholder}
            inputClassName="border-b px-2 py-1"
            inputStyle={{
              backgroundColor: settings.searchBackgroundColor,
              borderColor: settings.searchBorderColor,
              color: settings.searchInputTextColor,
            }}
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
          className="p-2 rounded-full transition-colors hidden md:block"
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
              className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none transform translate-x-1/4 -translate-y-1/4 rounded-full"
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
      {settings.showMobileMenu && (
        <button
          className="md:hidden p-2 rounded-full transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
          style={{ color: settings.textColor }}
        >
          <Menu size={settings.iconSize} />
        </button>
      )}
      {settings.showCTA && settings.ctaText && (
        <button
           className="hidden md:block ml-4 px-4 py-2 rounded-md font-medium text-sm transition-all"
           style={{
             backgroundColor: settings.ctaBackgroundColor || settings.accentColor,
             color: '#ffffff', // Assuming white text
           }}
        >
          {settings.ctaText}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Announcement Bar */}
      {settings.showAnnouncementBar && !isAnnouncementDismissed && (
        <div
          className="w-full py-2 px-4 text-center text-sm relative overflow-hidden"
          style={{
            backgroundColor: settings.announcementBackgroundColor,
            color: settings.announcementTextColor,
          }}
        >
          <div className={settings.announcementMarquee ? 'animate-marquee inline-block whitespace-nowrap' : ''}>
            {settings.announcementText}
          </div>
          {settings.announcementDismissible && (
            <button
              onClick={() => setIsAnnouncementDismissed(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss announcement"
            >
              <X size={16} style={{ color: settings.announcementTextColor }} />
            </button>
          )}
        </div>
      )}
      
      {/* Utility Bar */}
      {settings.showUtilityBar && (
        <div
          className="w-full py-2 px-6 text-xs border-b"
          style={{
            backgroundColor: settings.utilityBarBackgroundColor,
            color: settings.utilityBarTextColor,
            borderColor: settings.borderColor,
          }}
        >
          <div className={`${maxWidthClass} mx-auto flex items-center justify-between`}>
            <div className="flex items-center gap-4">
              {settings.showCurrencySelector && (
                <select 
                  className="bg-transparent border-none text-xs cursor-pointer focus:outline-none"
                  style={{ color: settings.utilityBarTextColor }}
                >
                  <option value="USD">USD $</option>
                  <option value="EUR">EUR €</option>
                  <option value="GBP">GBP £</option>
                </select>
              )}
              {settings.showLanguageSelector && (
                <select 
                  className="bg-transparent border-none text-xs cursor-pointer focus:outline-none"
                  style={{ color: settings.utilityBarTextColor }}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              )}
            </div>
            <div className="flex items-center gap-4">
              {settings.utilityBarLinks?.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href}
                  className="hover:opacity-70 transition-opacity"
                  style={{ color: settings.utilityBarTextColor }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Header */}
      <header
        className={`w-full ${settings.sticky ? 'sticky top-0' : ''} z-[100] transition-transform duration-${settings.smartScrollDuration || 300}`}
        style={{
          ...glassStyles,
          backgroundColor: settings.enableGlassmorphism ? glassStyles.backgroundColor : settings.backgroundColor,
          borderBottom: `${settings.borderWidth} solid ${settings.borderColor}`,
          transform: settings.enableSmartScroll ? (isVisible ? 'translateY(0)' : 'translateY(-100%)') : 'none',
        }}
      >
        <div
          className={`${maxWidthClass} mx-auto relative`}
          style={{
            paddingLeft: settings.paddingX,
            paddingRight: settings.paddingX,
            paddingTop: settings.paddingY,
            paddingBottom: settings.paddingY,
            minHeight: '5rem',
          }}
        >
          {/* Layout Variant: Default (Logo Left, Nav Left) */}
          {(!settings.layout || settings.layout === 'default' || settings.layout === 'minimal') && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {renderLogo()}
                {renderNav()}
              </div>
              {renderIcons()}
            </div>
          )}

          {/* Layout Variant: Logo Left, Nav Center */}
          {settings.layout === 'logo-left-nav-center' && (
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                {renderLogo()}
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
                {renderNav()}
              </div>
              <div className="flex-shrink-0">
                {renderIcons()}
              </div>
            </div>
          )}

          {/* Layout Variant: Logo Center, Nav Left */}
          {settings.layout === 'logo-center-nav-left' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                 <div className="hidden md:block">
                   {renderNav()}
                 </div>
                 <div className="md:hidden">
                    {/* Mobile Toggle would represent nav here on mobile */}
                 </div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                {renderLogo()}
              </div>
              <div className="flex items-center justify-end flex-1">
                {renderIcons()}
              </div>
            </div>
          )}

          {/* Layout Variant: Split Island */}
          {settings.layout === 'split-island' && (
            <div className="flex items-center justify-between">
              <div className="flex-shrink-0">
                {renderLogo()}
              </div>
              <div className="flex items-center gap-8">
                {renderNav()}
                {renderIcons()}
              </div>
            </div>
          )}
          
          {/* REMOVED LEGACY LAYOUT & ICONS - NOW HANDLED BY renderIcons() INSIDE LAYOUT BLOCKS */}
        </div>
      </header>
      
      {/* Mobile Menu Drawer */}
      {settings.showMobileMenu && (
        <>
          {/* Overlay */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 z-[90] transition-opacity duration-300"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${(settings.mobileMenuOverlayOpacity || 50) / 100})`,
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {/* Drawer */}
          <div
            className={`fixed top-0 ${settings.mobileMenuPosition === 'right' ? 'right-0' : 'left-0'} h-full z-[100] transform transition-transform duration-300 overflow-y-auto`}
            style={{
              width: settings.mobileMenuWidth,
              backgroundColor: settings.mobileMenuBackgroundColor,
              transform: isMobileMenuOpen 
                ? 'translateX(0)' 
                : settings.mobileMenuPosition === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
            }}
          >
            <div className="p-6">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <Logo
                  storeName={storeName}
                  logoUrl={logoUrl}
                  logoHeight={logoHeight ? logoHeight * 0.8 : 28}
                  className="text-xl font-bold"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogoClick?.();
                  }}
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} style={{ color: settings.mobileMenuTextColor }} />
                </button>
              </div>
              
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-4 mb-8">
                {(links || []).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (onLinkClick) {
                        e.preventDefault();
                        onLinkClick(link.href);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-lg font-medium py-2 border-b transition-colors"
                    style={{
                      color: settings.mobileMenuTextColor,
                      borderColor: settings.borderColor,
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              
              {/* Mobile Account Section */}
              {settings.showAccount && (
                <div className="pt-6 border-t" style={{ borderColor: settings.borderColor }}>
                  <a
                    href="/account"
                    className="flex items-center gap-3 py-3 text-base font-medium"
                    style={{ color: settings.mobileMenuTextColor }}
                  >
                    <User size={20} />
                    <span>My Account</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
