import React from 'react';
import { ShoppingBag, Search, User, Menu, Hexagon, X } from 'lucide-react';
import { NavLink } from '../types';

// Header customization data structure
export interface HeaderData {
  // === CORE VISIBILITY TOGGLES ===
  showSearch?: boolean;
  showAccount?: boolean;
  showCart?: boolean;
  showCTA?: boolean;
  showMenu?: boolean;
  showTagline?: boolean;
  showLogoBadge?: boolean;
  showIndicatorDot?: boolean;
  
  // === 2026 FEATURE TOGGLES ===
  showMobileMenu?: boolean;
  showAnnouncementBar?: boolean;
  showUtilityBar?: boolean;
  showCommandPalette?: boolean; // Cmd+K search
  enableSmartScroll?: boolean; // Hide on scroll down, show on scroll up
  enableMegaMenu?: boolean;
  megaMenuStyle?: 'traditional' | 'bento'; // List-based vs Card-based
  enableSpotlightBorders?: boolean;
  enableGlassmorphism?: boolean;
  
  // === NAVIGATION STYLES ===
  navActiveStyle?: 'none' | 'dot' | 'underline' | 'capsule' | 'glow' | 'brutalist' | 'minimal' | 'overline' | 'double' | 'bracket' | 'highlight' | 'skewed';
  
  // === CORE COLORS ===
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textHoverColor?: string;
  accentColor?: string;
  cartBadgeColor?: string;
  cartBadgeTextColor?: string;
  taglineColor?: string;
  
  // === SIZING ===
  iconSize?: number;
  iconHoverBackgroundColor?: string;
  borderWidth?: string;
  iconBorderWidth?: string;
  tickerBorderWidth?: string;
  gridDividerWidth?: string;
  
  // === CTA/BUTTON ===
  ctaBackgroundColor?: string;
  ctaHoverColor?: string;
  ctaTextColor?: string;
  ctaText?: string;
  
  // === ANNOUNCEMENT BAR (2026) ===
  announcementText?: string;
  announcementBackgroundColor?: string;
  announcementTextColor?: string;
  announcementDismissible?: boolean;
  announcementMarquee?: boolean;
  
  // === UTILITY BAR (2026) ===
  utilityBarBackgroundColor?: string;
  utilityBarTextColor?: string;
  utilityBarLinks?: Array<{ label: string; href: string }>;
  showCurrencySelector?: boolean;
  showLanguageSelector?: boolean;
  
  // === TICKER ===
  tickerBackgroundColor?: string;
  tickerTextColor?: string;
  tickerBorderColor?: string;
  tickerText?: string;
  
  // === TAGLINE ===
  taglineText?: string;
  
  // === SEARCH FEATURES ===
  showKeyboardShortcut?: boolean;
  searchPlaceholder?: string;
  searchBackgroundColor?: string;
  searchFocusBackgroundColor?: string;
  searchFocusBorderColor?: string;
  searchInputTextColor?: string;
  searchPlaceholderColor?: string;
  searchBorderColor?: string;
  
  // === MOBILE MENU (2026) ===
  mobileMenuBackgroundColor?: string;
  mobileMenuTextColor?: string;
  mobileMenuOverlayOpacity?: number; // 0-100
  mobileMenuPosition?: 'left' | 'right' | 'top' | 'bottom';
  mobileMenuWidth?: string; // e.g., '300px', '80%'
  
  // === MEGA MENU (2026) ===
  megaMenuBackgroundColor?: string;
  megaMenuBorderColor?: string;
  megaMenuColumns?: number; // 2-6 columns
  megaMenuMaxHeight?: string;
  
  // === GLASSMORPHISM (2026) ===
  blurIntensity?: string;
  glassBackgroundOpacity?: number; // 0-100
  glassBorderOpacity?: number; // 0-100
  
  // === SPOTLIGHT BORDERS (2026) ===
  spotlightColor?: string;
  spotlightIntensity?: number; // 0-100
  
  // === SMART SCROLL (2026) ===
  smartScrollThreshold?: number; // Pixels to scroll before hiding
  smartScrollDuration?: number; // Animation duration in ms
  
  // === LEGACY FEATURES ===
  expandedMenuEnabled?: boolean;
  checkoutButtonText?: string;
  
  // === INTERACTIVE EFFECTS ===
  particleCount?: number;
  particleColor?: string;
  accentColorSecondary?: string;
  terminalPromptColor?: string;
  scanlineColor?: string;
  buttonHoverBackgroundColor?: string;
  glowIntensity?: number; // 0-100 for opacity percentages
  
  // === LAYOUT ===
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

// Default values for HeaderCanvas (2026 Edition)
const CANVAS_DEFAULTS: HeaderData = {
  // Core features
  showSearch: true,
  showAccount: true,
  showCart: true,
  
  // 2026 features enabled by default
  showMobileMenu: true,
  showAnnouncementBar: false,
  showUtilityBar: false,
  showCommandPalette: false,
  enableSmartScroll: false,
  enableMegaMenu: false,
  megaMenuStyle: 'traditional',
  enableSpotlightBorders: false,
  enableGlassmorphism: false,
  
  // Colors
  backgroundColor: '#ffffff',
  borderColor: '#f3f4f6',
  textColor: '#6b7280',
  textHoverColor: '#000000',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#ffffff',
  accentColor: '#3b82f6',
  
  // Sizing
  iconSize: 20,
  iconHoverBackgroundColor: 'transparent',
  borderWidth: '1px',
  
  // Layout
  sticky: true,
  maxWidth: '7xl',
  paddingX: '24px',
  paddingY: '16px',
  
  // Navigation
  navActiveStyle: 'dot',
  
  // Announcement bar
  announcementText: 'Free shipping on orders over $100',
  announcementBackgroundColor: '#000000',
  announcementTextColor: '#ffffff',
  announcementDismissible: true,
  announcementMarquee: false,
  
  // Utility bar
  utilityBarBackgroundColor: '#f9fafb',
  utilityBarTextColor: '#6b7280',
  showCurrencySelector: true,
  showLanguageSelector: true,
  
  // Mobile menu
  mobileMenuBackgroundColor: '#ffffff',
  mobileMenuTextColor: '#000000',
  mobileMenuOverlayOpacity: 50,
  mobileMenuPosition: 'left',
  mobileMenuWidth: '320px',
  
  // Mega menu
  megaMenuBackgroundColor: '#ffffff',
  megaMenuBorderColor: '#e5e7eb',
  megaMenuColumns: 4,
  megaMenuMaxHeight: '500px',
  
  // Glassmorphism
  blurIntensity: 'xl',
  glassBackgroundOpacity: 60,
  glassBorderOpacity: 20,
  
  // Spotlight borders
  spotlightColor: '#3b82f6',
  spotlightIntensity: 50,
  
  // Smart scroll
  smartScrollThreshold: 100,
  smartScrollDuration: 300,
  
  // Search
  searchPlaceholder: 'Search products...',
  searchBackgroundColor: '#f9fafb',
  searchBorderColor: '#e5e7eb',
  searchInputTextColor: '#000000',
};

// NEXUS ELITE DEFAULTS - 2026 Professional Header
const NEXUS_ELITE_DEFAULTS: HeaderData = {
  // Core features
  showSearch: true,
  showAccount: true,
  showCart: true,
  showCTA: true,
  
  // ALL 2026 features enabled
  showMobileMenu: true,
  showAnnouncementBar: true,
  showUtilityBar: true,
  showCommandPalette: true,
  enableSmartScroll: true,
  enableMegaMenu: true,
  megaMenuStyle: 'bento', // Bento grid by default
  enableSpotlightBorders: true,
  enableGlassmorphism: true,
  
  // Premium color scheme - Dark mode with accents
  backgroundColor: '#09090b', // zinc-950
  borderColor: '#27272a', // zinc-800
  textColor: '#a1a1aa', // zinc-400
  textHoverColor: '#ffffff',
  cartBadgeColor: '#3b82f6', // blue-500
  cartBadgeTextColor: '#ffffff',
  accentColor: '#3b82f6',
  
  // CTA button
  ctaText: 'Get Started',
  ctaBackgroundColor: '#3b82f6',
  ctaHoverColor: '#2563eb',
  ctaTextColor: '#ffffff',
  
  // Sizing - Larger for premium feel
  iconSize: 22,
  iconHoverBackgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderWidth: '1px',
  
  // Layout
  sticky: true,
  maxWidth: '7xl',
  paddingX: '32px',
  paddingY: '20px',
  
  // Navigation - Spotlight effect
  navActiveStyle: 'glow',
  
  // Announcement bar - Premium messaging
  announcementText: '🎉 New Collection Launching Soon - Join the Waitlist',
  announcementBackgroundColor: '#3b82f6',
  announcementTextColor: '#ffffff',
  announcementDismissible: true,
  announcementMarquee: false,
  
  // Utility bar - Dark theme
  utilityBarBackgroundColor: '#18181b', // zinc-900
  utilityBarTextColor: '#71717a', // zinc-500
  showCurrencySelector: true,
  showLanguageSelector: true,
  
  // Mobile menu - Full screen dark
  mobileMenuBackgroundColor: '#09090b',
  mobileMenuTextColor: '#ffffff',
  mobileMenuOverlayOpacity: 80,
  mobileMenuPosition: 'right',
  mobileMenuWidth: '400px',
  
  // Mega menu - Bento grid style
  megaMenuBackgroundColor: '#18181b',
  megaMenuBorderColor: '#27272a',
  megaMenuColumns: 4,
  megaMenuMaxHeight: '600px',
  
  // Glassmorphism - Strong blur effect
  blurIntensity: 'xl', // 20px
  glassBackgroundOpacity: 70,
  glassBorderOpacity: 30,
  
  // Spotlight borders - Blue glow
  spotlightColor: '#3b82f6',
  spotlightIntensity: 70,
  
  // Smart scroll - Quick hide/show
  smartScrollThreshold: 80,
  smartScrollDuration: 250,
  
  // Search - Dark theme with keyboard shortcut
  showKeyboardShortcut: true,
  searchPlaceholder: 'Search or press ⌘K...',
  searchBackgroundColor: '#18181b',
  searchFocusBackgroundColor: '#27272a',
  searchFocusBorderColor: '#3b82f6',
  searchInputTextColor: '#ffffff',
  searchPlaceholderColor: '#71717a',
  searchBorderColor: '#27272a',
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
  iconSize: 18,
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
          className={`${maxWidthClass} mx-auto flex items-center justify-between`}
          style={{
            paddingLeft: settings.paddingX,
            paddingRight: settings.paddingX,
            paddingTop: settings.paddingY,
            paddingBottom: settings.paddingY,
            minHeight: '5rem',
          }}
        >
          {/* Left: Logo + Desktop Navigation */}
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
            
            {/* Mobile Menu Button */}
            {settings.showMobileMenu && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full transition-colors"
                style={{ 
                  color: settings.textColor,
                  backgroundColor: 'transparent'
                }}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={settings.iconSize} /> : <Menu size={settings.iconSize} />}
              </button>
            )}
          </div>
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

// 2. HeaderNexusElite - Professional 2026 Header with ALL Features
export const HeaderNexusElite: React.FC<HeaderProps> = ({
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
  // Merge Nexus Elite defaults with custom data
  const settings = { ...NEXUS_ELITE_DEFAULTS, ...data };
  
  // State management for all features
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = React.useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  
  // Smart scroll logic - hide on down, show on up
  React.useEffect(() => {
    if (!settings.enableSmartScroll) return;
    
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY && currentScrollY > (settings.smartScrollThreshold || 80)) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY, settings.enableSmartScroll, settings.smartScrollThreshold]);
  
  // Spotlight border - track mouse position
  React.useEffect(() => {
    if (!settings.enableSpotlightBorders) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.enableSpotlightBorders]);
  
  // Command Palette - Cmd+K / Ctrl+K
  React.useEffect(() => {
    if (!settings.showCommandPalette) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.showCommandPalette]);
  
  // Prevent body scroll when modals open
  React.useEffect(() => {
    if (isMobileMenuOpen || isCommandPaletteOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen, isCommandPaletteOpen]);
  
  // Glassmorphism CSS
  const glassStyles = settings.enableGlassmorphism ? {
    backdropFilter: `blur(${
      settings.blurIntensity === 'sm' ? '4px' :
      settings.blurIntensity === 'md' ? '8px' :
      settings.blurIntensity === 'lg' ? '12px' : '20px'
    })`,
    backgroundColor: `rgba(${parseInt(settings.backgroundColor?.slice(1, 3) || '09', 16)}, ${parseInt(settings.backgroundColor?.slice(3, 5) || '09', 16)}, ${parseInt(settings.backgroundColor?.slice(5, 7) || '0b', 16)}, ${(settings.glassBackgroundOpacity || 70) / 100})`,
  } : {};
  
  // Nav link styles with spotlight
  const navLinkStyle = (href: string) => {
    const baseStyle: React.CSSProperties = {
      color: settings.textColor,
      transition: 'all 0.2s ease',
      position: 'relative',
    };
    
    if (settings.enableSpotlightBorders && hoveredLink === href) {
      const intensity = (settings.spotlightIntensity || 70) / 100;
      return {
        ...baseStyle,
        color: settings.textHoverColor,
        textShadow: `0 0 20px ${settings.spotlightColor}${Math.floor(intensity * 255).toString(16)}`,
      };
    }
    
    return baseStyle;
  };
  
  return (
    <>
      {/* Announcement Bar */}
      {settings.showAnnouncementBar && !isAnnouncementDismissed && (
        <div
          className="w-full text-center py-2 px-4 text-sm"
          style={{
            backgroundColor: settings.announcementBackgroundColor,
            color: settings.announcementTextColor,
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1" />
            <div className={settings.announcementMarquee ? 'animate-marquee whitespace-nowrap' : ''}>
              {settings.announcementText}
            </div>
            {settings.announcementDismissible && (
              <button
                onClick={() => setIsAnnouncementDismissed(true)}
                className="text-current opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Dismiss announcement"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Utility Bar */}
      {settings.showUtilityBar && (
        <div
          className="w-full border-b text-xs"
          style={{
            backgroundColor: settings.utilityBarBackgroundColor,
            color: settings.utilityBarTextColor,
            borderColor: settings.borderColor,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="opacity-70">Welcome to {storeName}</span>
            </div>
            <div className="flex items-center gap-4">
              {settings.showCurrencySelector && (
                <select
                  className="bg-transparent border-none text-current text-xs cursor-pointer"
                  style={{ color: settings.utilityBarTextColor }}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              )}
              {settings.showLanguageSelector && (
                <select
                  className="bg-transparent border-none text-current text-xs cursor-pointer"
                  style={{ color: settings.utilityBarTextColor }}
                >
                  <option>EN</option>
                  <option>FR</option>
                  <option>ES</option>
                </select>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Header */}
      <header
        ref={headerRef}
        className={`w-full transition-all duration-${settings.smartScrollDuration || 250} ${settings.sticky ? 'sticky top-0' : ''} z-50`}
        style={{
          ...glassStyles,
          borderBottom: `${settings.borderWidth} solid ${settings.borderColor}`,
          transform: settings.enableSmartScroll && !isVisible ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        <div
          className="mx-auto flex items-center justify-between gap-6"
          style={{
            maxWidth: settings.maxWidth === '7xl' ? '80rem' : settings.maxWidth === 'full' ? '100%' : '1280px',
            paddingLeft: settings.paddingX,
            paddingRight: settings.paddingX,
            paddingTop: settings.paddingY,
            paddingBottom: settings.paddingY,
          }}
        >
          {/* Mobile Menu Button */}
          {settings.showMobileMenu && (
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                color: settings.textColor,
                backgroundColor: settings.iconHoverBackgroundColor,
              }}
              aria-label="Toggle menu"
            >
              <Menu size={settings.iconSize} />
            </button>
          )}
          
          {/* Logo */}
          <Logo
            storeName={storeName}
            logoUrl={logoUrl}
            logoHeight={logoHeight}
            className="font-bold"
            onClick={onLogoClick}
          />
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {(links || []).map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (onLinkClick) {
                    e.preventDefault();
                    onLinkClick(link);
                  }
                }}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className="text-sm font-medium hover:opacity-100 transition-all"
                style={navLinkStyle(link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            {settings.showSearch && (
              <button
                className="p-2 rounded-lg transition-all"
                onClick={settings.showCommandPalette ? () => setIsCommandPaletteOpen(true) : onSearchClick}
                style={{
                  color: settings.textColor,
                  backgroundColor: settings.iconHoverBackgroundColor,
                }}
                aria-label="Search"
                title={settings.showKeyboardShortcut ? '⌘K' : undefined}
              >
                <Search size={settings.iconSize} />
              </button>
            )}
            
            {/* Account */}
            {settings.showAccount && (
              <button
                className="p-2 rounded-lg transition-colors"
                style={{
                  color: settings.textColor,
                  backgroundColor: settings.iconHoverBackgroundColor,
                }}
                aria-label="Account"
              >
                <User size={settings.iconSize} />
              </button>
            )}
            
            {/* Cart */}
            {settings.showCart && (
              <button
                className="p-2 rounded-lg transition-colors relative"
                onClick={onOpenCart}
                style={{
                  color: settings.textColor,
                  backgroundColor: settings.iconHoverBackgroundColor,
                }}
                aria-label="Shopping cart"
              >
                <ShoppingBag size={settings.iconSize} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
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
            
            {/* CTA Button */}
            {settings.showCTA && (
              <button
                className="hidden md:block px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: settings.ctaBackgroundColor,
                  color: settings.ctaTextColor,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = settings.ctaHoverColor || settings.ctaBackgroundColor || '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = settings.ctaBackgroundColor || '#3b82f6'}
              >
                {settings.ctaText || 'Get Started'}
              </button>
            )}
          </div>
        </div>
        
        {/* Search Overlay */}
        {isSearchOpen && (
          <SearchOverlay
            onClose={onSearchClose}
            onSubmit={onSearchSubmit}
            placeholder={settings.searchPlaceholder}
            backgroundColor={settings.searchBackgroundColor}
            textColor={settings.searchInputTextColor}
            borderColor={settings.searchBorderColor}
            iconColor={settings.textColor}
          />
        )}
      </header>
      
      {/* Mobile Menu Drawer */}
      {settings.showMobileMenu && isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[90] transition-opacity duration-300"
            style={{
              backgroundColor: `rgba(0, 0, 0, ${(settings.mobileMenuOverlayOpacity || 80) / 100})`,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
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
                  className="p-2 rounded-full transition-colors"
                  style={{ color: settings.mobileMenuTextColor }}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex flex-col gap-4">
                {(links || []).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (onLinkClick) {
                        e.preventDefault();
                        onLinkClick(link);
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
            </div>
          </div>
        </>
      )}
      
      {/* Command Palette (Cmd+K) */}
      {settings.showCommandPalette && isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-32 px-4">
          <div
            className="w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: settings.searchBackgroundColor,
              border: `1px solid ${settings.searchFocusBorderColor}`,
            }}
          >
            <div className="p-4">
              <input
                type="text"
                placeholder="Search products, pages, or actions..."
                autoFocus
                className="w-full bg-transparent text-lg outline-none"
                style={{ color: settings.searchInputTextColor }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setIsCommandPaletteOpen(false);
                }}
              />
            </div>
            <div className="border-t p-3 text-xs flex items-center justify-between" style={{ borderColor: settings.borderColor, color: settings.textColor }}>
              <span>Type to search...</span>
              <span className="opacity-50">ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const HEADER_COMPONENTS: Record<string, React.FC<HeaderProps>> = {
  canvas: HeaderCanvas,
  'nexus-elite': HeaderNexusElite,
};

export const HEADER_OPTIONS = [
  { id: 'canvas', name: 'Canvas', description: '2026 Modern Foundation', date: '2026-01-15', popularity: 95, recommended: false },
  { id: 'nexus-elite', name: 'Nexus Elite', description: 'Professional 2026 - ALL Features', date: '2026-01-18', popularity: 100, recommended: true },
];

export const HEADER_FIELDS: Record<string, string[]> = {
  canvas: [
    // Core toggles
    'showSearch', 'showAccount', 'showCart',
    
    // 2026 feature toggles
    'showMobileMenu', 'showAnnouncementBar', 'showUtilityBar', 'showCommandPalette',
    'enableSmartScroll', 'enableMegaMenu', 'megaMenuStyle', 'enableSpotlightBorders', 'enableGlassmorphism',
    
    // Core colors
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    
    // Sizing
    'iconSize', 'iconHoverBackgroundColor', 'borderWidth',
    
    // Layout
    'sticky', 'maxWidth', 'paddingX', 'paddingY', 'navActiveStyle',
    
    // Search
    'searchPlaceholder', 'searchBackgroundColor', 'searchBorderColor', 'searchInputTextColor',
    
    // Announcement bar
    'announcementText', 'announcementBackgroundColor', 'announcementTextColor', 
    'announcementDismissible', 'announcementMarquee',
    
    // Utility bar
    'utilityBarBackgroundColor', 'utilityBarTextColor', 'showCurrencySelector', 'showLanguageSelector',
    
    // Mobile menu
    'mobileMenuBackgroundColor', 'mobileMenuTextColor', 'mobileMenuOverlayOpacity',
    'mobileMenuPosition', 'mobileMenuWidth',
    
    // Mega menu
    'megaMenuBackgroundColor', 'megaMenuBorderColor', 'megaMenuColumns', 'megaMenuMaxHeight',
    
    // Glassmorphism
    'blurIntensity', 'glassBackgroundOpacity', 'glassBorderOpacity',
    
    // Spotlight
    'spotlightColor', 'spotlightIntensity',
    
    // Smart scroll
    'smartScrollThreshold', 'smartScrollDuration'
  ],
  
  // NEXUS ELITE - 2026 Professional Header with ALL Modern Features
  'nexus-elite': [
    // All core features
    'showLogo', 'showSearch', 'showAccount', 'showCart', 'showCTA', 'showMenu',
    
    // ALL 2026 feature toggles
    'showMobileMenu', 'showAnnouncementBar', 'showUtilityBar', 'showCommandPalette',
    'enableSmartScroll', 'enableMegaMenu', 'megaMenuStyle', 'enableSpotlightBorders', 'enableGlassmorphism',
    
    // Core colors
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor',
    
    // Sizing & layout
    'iconSize', 'iconHoverBackgroundColor', 'borderWidth',
    'sticky', 'maxWidth', 'paddingX', 'paddingY', 'navActiveStyle',
    
    // CTA
    'ctaText', 'ctaBackgroundColor', 'ctaHoverColor', 'ctaTextColor',
    
    // Search
    'showKeyboardShortcut', 'searchPlaceholder', 'searchBackgroundColor', 
    'searchFocusBackgroundColor', 'searchFocusBorderColor',
    'searchInputTextColor', 'searchPlaceholderColor', 'searchBorderColor',
    
    // Announcement bar
    'announcementText', 'announcementBackgroundColor', 'announcementTextColor', 
    'announcementDismissible', 'announcementMarquee',
    
    // Utility bar
    'utilityBarBackgroundColor', 'utilityBarTextColor', 'utilityBarLinks',
    'showCurrencySelector', 'showLanguageSelector',
    
    // Mobile menu
    'mobileMenuBackgroundColor', 'mobileMenuTextColor', 'mobileMenuOverlayOpacity',
    'mobileMenuPosition', 'mobileMenuWidth',
    
    // Mega menu
    'megaMenuBackgroundColor', 'megaMenuBorderColor', 'megaMenuColumns', 
    'megaMenuMaxHeight',
    
    // Glassmorphism
    'blurIntensity', 'glassBackgroundOpacity', 'glassBorderOpacity',
    
    // Spotlight borders
    'spotlightColor', 'spotlightIntensity',
    
    // Smart scroll
    'smartScrollThreshold', 'smartScrollDuration'
  ],
};
