
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, Search, X, User, Globe, Command, ChevronDown, ArrowRight, Hexagon, Grid, Disc, Activity } from 'lucide-react';
import { NavLink } from '../types';

// ============================================================================
// HEADER PROPS INTERFACE
// ============================================================================
export interface HeaderProps {
  storeName: string;
  logoUrl?: string;
  logoHeight?: number;
  links: NavLink[];
  cartCount: number;
  onOpenCart?: () => void;
  onLogoClick?: () => void;
  onLinkClick?: (href: string) => void;
  // Color customization
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

// Reusable NavItem component that handles click-based navigation
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

// Reusable Logo Component
const Logo: React.FC<{
  storeName: string;
  logoUrl?: string;
  logoHeight?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ storeName, logoUrl, logoHeight = 32, className, style, onClick }) => {
  const content = logoUrl 
    ? <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px`, width: 'auto' }} className="object-contain" />
    : <span className={className} style={style}>{storeName}</span>;
    
  if (onClick) {
    return <button onClick={onClick} className="cursor-pointer">{content}</button>;
  }
  return <>{content}</>;
};

// Cart Badge Component
const CartBadge: React.FC<{
  count: number;
  onClick?: () => void;
  iconColor?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  className?: string;
}> = ({ count, onClick, iconColor, badgeColor = '#000000', badgeTextColor = '#ffffff', className }) => (
  <div onClick={onClick} className={`relative cursor-pointer ${className || ''}`}>
    <ShoppingBag size={20} style={{ color: iconColor }} />
    {count > 0 && (
      <span 
        className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full font-bold"
        style={{ backgroundColor: badgeColor, color: badgeTextColor }}
      >
        {count}
      </span>
    )}
  </div>
);

// ============================================================================
// 1. CANVAS - Minimalist, Clean, Airy (DEFAULT)
// ============================================================================
export const HeaderCanvas: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#ffffff';
  const txtColor = textColor || '#171717';
  const accent = accentColor || '#000000';
  
  return (
    <header 
      className="w-full border-b sticky top-0 z-[100] transition-colors"
      style={{ backgroundColor: bgColor, borderColor: `${txtColor}15` }}
    >
      <div className="max-w-7xl mx-auto px-6 min-h-[5rem] py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="text-2xl font-bold tracking-tight"
            style={{ color: txtColor }}
            onClick={onLogoClick}
          />
          <nav className="hidden md:flex gap-6">
            {(links || []).map(l => (
              <NavItem 
                key={l.label} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: `${txtColor}99` }}
              />
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full transition-colors hover:opacity-70" style={{ color: txtColor }}>
            <Search size={20} />
          </button>
          <button className="p-2 rounded-full transition-colors hover:opacity-70" style={{ color: txtColor }}>
            <User size={20} />
          </button>
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor={bgColor}
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 2. NEBULA - Glassmorphic, Floating, Blur
// ============================================================================
export const HeaderNebula: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || 'rgba(255,255,255,0.6)';
  const txtColor = textColor || '#374151';
  const accent = accentColor || '#3B82F6';
  
  return (
    <header className="sticky top-0 z-[100] flex justify-center px-4 pt-4">
      <div 
        className="backdrop-blur-xl border shadow-lg rounded-full px-8 py-3 flex items-center gap-12 max-w-4xl w-full justify-between transition-colors"
        style={{ 
          backgroundColor: bgColor,
          borderColor: `${txtColor}20`
        }}
      >
        <div className="flex items-center gap-2">
          {!logoUrl && <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: accent }}></div>}
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="font-bold tracking-wider text-sm uppercase"
            style={{ color: txtColor }}
            onClick={onLogoClick}
          />
        </div>
        <nav className="hidden md:flex gap-8">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-xs font-semibold tracking-widest uppercase transition-colors hover:opacity-70"
              style={{ color: `${txtColor}99` }}
            />
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Search size={18} className="cursor-pointer hover:opacity-70 transition-opacity" style={{ color: txtColor }} />
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor="#ffffff"
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 3. BUNKER - Brutalist, High Contrast, Bold
// ============================================================================
export const HeaderBunker: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#FACC15';
  const txtColor = textColor || '#000000';
  const accent = accentColor || '#000000';
  
  return (
    <header className="w-full border-b-4 sticky top-0 z-50 font-mono" style={{ backgroundColor: bgColor, borderColor: txtColor }}>
      {/* Ticker Bar */}
      <div className="w-full text-xs py-1 px-2 overflow-hidden whitespace-nowrap" style={{ backgroundColor: txtColor, color: bgColor }}>
        <div className="animate-marquee inline-block">
          ★ FREE SHIPPING ON ALL ORDERS OVER $100 ★ NEW ARRIVALS WEEKLY ★ MEMBERS GET 20% OFF ★ FREE SHIPPING ON ALL ORDERS OVER $100 ★
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-2xl font-black uppercase tracking-tighter"
          style={{ color: txtColor }}
          onClick={onLogoClick}
        />
        <nav className="hidden md:flex gap-1">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="px-3 py-2 text-xs font-black uppercase border-2 transition-all hover:opacity-80"
              style={{ borderColor: txtColor, color: txtColor }}
            />
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="p-2 border-2 transition-colors hover:opacity-80" style={{ borderColor: txtColor, color: txtColor }}>
            <Search size={18} />
          </button>
          <div 
            onClick={onOpenCart} 
            className="relative p-2 border-2 cursor-pointer hover:opacity-80 transition-colors"
            style={{ borderColor: txtColor, color: txtColor }}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span 
                className="absolute -top-2 -right-2 w-5 h-5 text-[10px] font-black flex items-center justify-center"
                style={{ backgroundColor: txtColor, color: bgColor }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 4. ORBIT - Interactive Animated Effects
// ============================================================================
export const HeaderOrbit: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const bgColor = backgroundColor || '#0F172A';
  const txtColor = textColor || '#ffffff';
  const accent = accentColor || '#6366F1';

  return (
    <header className="w-full sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent }}>
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight || 24}px` }} className="object-contain" />
            ) : (
              <Hexagon size={20} style={{ color: txtColor }} />
            )}
          </div>
          <button onClick={onLogoClick} className="text-xl font-bold tracking-tight cursor-pointer" style={{ color: txtColor }}>
            {storeName}
          </button>
        </div>
        
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full" style={{ backgroundColor: `${txtColor}10` }}>
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                hoveredLink === l.label ? '' : ''
              }`}
              style={{ 
                backgroundColor: hoveredLink === l.label ? accent : 'transparent',
                color: hoveredLink === l.label ? '#ffffff' : `${txtColor}99`
              }}
            >
              <span 
                onMouseEnter={() => setHoveredLink(l.label)} 
                onMouseLeave={() => setHoveredLink(null)}
              >
                {l.label}
              </span>
            </NavItem>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenCart}
            className="px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors hover:opacity-90"
            style={{ backgroundColor: accent, color: '#ffffff' }}
          >
            <ShoppingBag size={16} />
            Checkout {cartCount > 0 && `(${cartCount})`}
          </button>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 5. PROTOCOL - Tech/Gaming Cyberpunk Style
// ============================================================================
export const HeaderProtocol: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const bgColor = backgroundColor || '#000000';
  const txtColor = textColor || '#00FF00';
  const accent = accentColor || '#00FF00';
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full border-b sticky top-0 z-[100] font-mono" style={{ backgroundColor: bgColor, borderColor: `${accent}50` }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity size={20} className="animate-pulse" style={{ color: accent }} />
            <button onClick={onLogoClick} className="text-lg font-bold tracking-widest cursor-pointer" style={{ color: txtColor }}>
              {storeName.toUpperCase()}
            </button>
          </div>
          <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: `${accent}20`, color: accent }}>ONLINE</span>
        </div>
        <nav className="hidden md:flex gap-6">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-xs tracking-widest uppercase transition-colors hover:opacity-70"
              style={{ color: `${txtColor}99` }}
            />
          ))}
        </nav>
        <div className="flex items-center gap-4 text-xs" style={{ color: `${txtColor}80` }}>
          <span className="hidden md:block">{time}</span>
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor={bgColor}
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 6. HORIZON - Double Row Navigation
// ============================================================================
export const HeaderHorizon: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#ffffff';
  const txtColor = textColor || '#171717';
  const accent = accentColor || '#3B82F6';
  
  return (
    <header className="w-full sticky top-0 z-[100]" style={{ backgroundColor: bgColor }}>
      {/* Top Bar */}
      <div className="border-b text-xs py-2 px-6" style={{ borderColor: `${txtColor}10`, color: `${txtColor}70` }}>
        <div className="max-w-7xl mx-auto flex justify-between">
          <div className="flex gap-6">
            <span className="flex items-center gap-1"><Globe size={12} /> USD ($)</span>
            <span>EN</span>
          </div>
          <div className="flex gap-6">
            <span>Free shipping on orders $50+</span>
            <span className="cursor-pointer hover:opacity-70" style={{ color: accent }}>Support</span>
            <span className="cursor-pointer hover:opacity-70" style={{ color: accent }}>Sign In</span>
          </div>
        </div>
      </div>
      {/* Main Header */}
      <div className="border-b py-4 px-6" style={{ borderColor: `${txtColor}10` }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="text-2xl font-bold"
            style={{ color: txtColor }}
            onClick={onLogoClick}
          />
          <nav className="hidden md:flex gap-8">
            {(links || []).map(l => (
              <NavItem 
                key={l.label} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: txtColor }}
              />
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Search size={20} className="cursor-pointer hover:opacity-70" style={{ color: txtColor }} />
            <User size={20} className="cursor-pointer hover:opacity-70" style={{ color: txtColor }} />
            <CartBadge 
              count={cartCount} 
              onClick={onOpenCart} 
              iconColor={txtColor}
              badgeColor={accent}
              badgeTextColor="#ffffff"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 7. STUDIO - Sidebar Navigation
// ============================================================================
export const HeaderStudio: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#0F172A';
  const txtColor = textColor || '#ffffff';
  const accent = accentColor || '#6366F1';
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r z-[100] flex flex-col transition-colors" style={{ backgroundColor: bgColor, borderColor: `${txtColor}10` }}>
      <div className="p-6">
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-xl font-bold"
          style={{ color: txtColor }}
          onClick={onLogoClick}
        />
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {(links || []).map(l => (
          <NavItem 
            key={l.label} 
            link={l} 
            onClick={onLinkClick} 
            className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: `${txtColor}90`, backgroundColor: 'transparent' }}
          />
        ))}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: `${txtColor}10` }}>
        <div 
          onClick={onOpenCart}
          className="w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: accent, color: '#ffffff' }}
        >
          <ShoppingBag size={18} />
          Cart ({cartCount})
        </div>
      </div>
    </aside>
  );
};

// ============================================================================
// 8. TERMINAL - Developer/Code Aesthetic
// ============================================================================
export const HeaderTerminal: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#1E1E1E';
  const txtColor = textColor || '#D4D4D4';
  const accent = accentColor || '#569CD6';
  
  return (
    <header className="w-full border-b sticky top-0 z-[100] font-mono text-sm" style={{ backgroundColor: bgColor, borderColor: `${txtColor}20` }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <button onClick={onLogoClick} className="cursor-pointer" style={{ color: accent }}>
            <span style={{ color: `${txtColor}60` }}>$</span> {storeName.toLowerCase().replace(/\s+/g, '-')}
          </button>
        </div>
        <nav className="hidden md:flex gap-4">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="transition-colors hover:opacity-70"
              style={{ color: txtColor }}
            >
              <span style={{ color: `${txtColor}60` }}>./</span>{l.label.toLowerCase()}
            </NavItem>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span style={{ color: `${txtColor}60` }}>cart:</span>
          <span onClick={onOpenCart} className="cursor-pointer" style={{ color: accent }}>[{cartCount}]</span>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 9. PORTFOLIO - Split Screen Bold
// ============================================================================
export const HeaderPortfolio: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#000000';
  const txtColor = textColor || '#ffffff';
  const accent = accentColor || '#ffffff';
  
  return (
    <header className="w-full sticky top-0 z-[100]" style={{ backgroundColor: bgColor }}>
      {/* Announcement */}
      <div className="text-center py-2 text-xs font-medium" style={{ backgroundColor: accent, color: bgColor }}>
        Free worldwide shipping on all orders
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-3xl font-black tracking-tighter"
          style={{ color: txtColor }}
          onClick={onLogoClick}
        />
        <nav className="hidden md:flex gap-8">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: `${txtColor}90` }}
            />
          ))}
        </nav>
        <CartBadge 
          count={cartCount} 
          onClick={onOpenCart} 
          iconColor={txtColor}
          badgeColor={accent}
          badgeTextColor={bgColor}
        />
      </div>
    </header>
  );
};

// ============================================================================
// 10. VENTURE - Search-First Design
// ============================================================================
export const HeaderVenture: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#ffffff';
  const txtColor = textColor || '#171717';
  const accent = accentColor || '#3B82F6';
  
  return (
    <header className="w-full border-b sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor, borderColor: `${txtColor}10` }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-xl font-bold shrink-0"
          style={{ color: txtColor }}
          onClick={onLogoClick}
        />
        
        {/* Large Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full px-5 py-3 rounded-full text-sm border focus:outline-none transition-colors"
            style={{ 
              backgroundColor: `${txtColor}05`,
              borderColor: `${txtColor}20`,
              color: txtColor
            }}
          />
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: `${txtColor}50` }} />
        </div>
        
        <nav className="hidden lg:flex gap-6 shrink-0">
          {(links || []).slice(0, 4).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: `${txtColor}80` }}
            />
          ))}
        </nav>
        
        <div className="flex items-center gap-4 shrink-0">
          <User size={20} className="cursor-pointer hover:opacity-70" style={{ color: txtColor }} />
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor="#ffffff"
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 11. METRO - Tile Style Grid
// ============================================================================
export const HeaderMetro: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#0078D4';
  const txtColor = textColor || '#ffffff';
  const accent = accentColor || '#ffffff';
  
  return (
    <header className="w-full sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="text-xl font-bold"
            style={{ color: txtColor }}
            onClick={onLogoClick}
          />
          <nav className="hidden md:flex gap-1">
            {(links || []).map(l => (
              <NavItem 
                key={l.label} 
                link={l} 
                onClick={onLinkClick} 
                className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ backgroundColor: `${txtColor}15`, color: txtColor }}
              />
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 transition-colors hover:opacity-80" style={{ color: txtColor }}>
            <Search size={20} />
          </button>
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor={bgColor}
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 12. MODUL - Swiss-Style Grid Layout
// ============================================================================
export const HeaderModul: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#ffffff';
  const txtColor = textColor || '#000000';
  const accent = accentColor || '#FF0000';
  
  return (
    <header className="w-full border-b sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor, borderColor: txtColor }}>
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center py-6 px-6">
        <nav className="hidden md:flex gap-6">
          {(links || []).slice(0, 3).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-xs font-bold uppercase tracking-widest transition-colors hover:opacity-70"
              style={{ color: txtColor }}
            />
          ))}
        </nav>
        <div className="text-center">
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="text-2xl font-black tracking-tight"
            style={{ color: txtColor }}
            onClick={onLogoClick}
          />
        </div>
        <div className="flex items-center justify-end gap-4">
          <Search size={18} className="cursor-pointer hover:opacity-70" style={{ color: txtColor }} />
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor="#ffffff"
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 13. LUXE - Luxury Elegant Serif
// ============================================================================
export const HeaderLuxe: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#FAF9F6';
  const txtColor = textColor || '#1A1A1A';
  const accent = accentColor || '#B8860B';
  
  return (
    <header className="w-full border-b sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor, borderColor: `${txtColor}15` }}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 text-xs tracking-widest" style={{ color: `${txtColor}70` }}>
          <span>LUXURY ESSENTIALS</span>
          <span className="cursor-pointer hover:opacity-70">ACCOUNT</span>
        </div>
        {/* Main Row */}
        <div className="flex items-center justify-between">
          <nav className="hidden md:flex gap-8">
            {(links || []).slice(0, 3).map(l => (
              <NavItem 
                key={l.label} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-medium tracking-wide transition-colors hover:opacity-70"
                style={{ color: txtColor }}
              />
            ))}
          </nav>
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="text-3xl font-serif tracking-widest"
            style={{ color: txtColor }}
            onClick={onLogoClick}
          />
          <div className="flex items-center gap-6">
            <Search size={18} className="cursor-pointer hover:opacity-70" style={{ color: txtColor }} />
            <CartBadge 
              count={cartCount} 
              onClick={onOpenCart} 
              iconColor={txtColor}
              badgeColor={accent}
              badgeTextColor="#ffffff"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 14. GULLWING - Centered Logo
// ============================================================================
export const HeaderGullwing: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#ffffff';
  const txtColor = textColor || '#171717';
  const accent = accentColor || '#000000';
  const halfLinks = Math.ceil((links || []).length / 2);
  
  return (
    <header className="w-full border-b sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor, borderColor: `${txtColor}10` }}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <nav className="hidden md:flex gap-6 flex-1">
          {(links || []).slice(0, halfLinks).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: `${txtColor}80` }}
            />
          ))}
        </nav>
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-2xl font-bold tracking-tight px-8"
          style={{ color: txtColor }}
          onClick={onLogoClick}
        />
        <div className="hidden md:flex gap-6 flex-1 justify-end items-center">
          {(links || []).slice(halfLinks).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: `${txtColor}80` }}
            />
          ))}
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor={bgColor}
          />
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 15. POP - Playful Modern
// ============================================================================
export const HeaderPop: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#FEF3C7';
  const txtColor = textColor || '#78350F';
  const accent = accentColor || '#F59E0B';
  
  return (
    <header className="w-full sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!logoUrl && <span className="text-2xl">✨</span>}
          <Logo 
            storeName={storeName} 
            logoUrl={logoUrl} 
            logoHeight={logoHeight} 
            className="text-xl font-black"
            style={{ color: txtColor }}
            onClick={onLogoClick}
          />
        </div>
        <nav className="hidden md:flex gap-2">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="px-4 py-2 rounded-full text-sm font-bold transition-colors hover:opacity-80"
              style={{ backgroundColor: `${txtColor}15`, color: txtColor }}
            />
          ))}
        </nav>
        <button 
          onClick={onOpenCart}
          className="px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-colors hover:opacity-90"
          style={{ backgroundColor: accent, color: '#ffffff' }}
        >
          🛒 Cart ({cartCount})
        </button>
      </div>
    </header>
  );
};

// ============================================================================
// 16. STARK - Ultra Minimalist
// ============================================================================
export const HeaderStark: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#ffffff';
  const txtColor = textColor || '#000000';
  const accent = accentColor || '#000000';
  
  return (
    <header className="w-full sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-sm font-bold uppercase tracking-[0.3em]"
          style={{ color: txtColor }}
          onClick={onLogoClick}
        />
        <nav className="hidden md:flex gap-8">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-xs uppercase tracking-[0.2em] transition-colors hover:opacity-70"
              style={{ color: `${txtColor}80` }}
            />
          ))}
        </nav>
        <div className="flex items-center gap-8 text-xs uppercase tracking-[0.2em]" style={{ color: `${txtColor}80` }}>
          <span className="cursor-pointer hover:opacity-70">Search</span>
          <span className="cursor-pointer hover:opacity-70">Login</span>
          <span onClick={onOpenCart} className="cursor-pointer hover:opacity-70" style={{ color: accent }}>
            Cart ({cartCount})
          </span>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 17. OFFSET - Asymmetric Design
// ============================================================================
export const HeaderOffset: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#E5E7EB';
  const txtColor = textColor || '#1F2937';
  const accent = accentColor || '#3B82F6';
  
  return (
    <header className="w-full sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-end justify-between">
          <div>
            <Logo 
              storeName={storeName} 
              logoUrl={logoUrl} 
              logoHeight={logoHeight} 
              className="text-4xl font-black tracking-tight"
              style={{ color: txtColor }}
              onClick={onLogoClick}
            />
            <div className="h-1 w-12 mt-2" style={{ backgroundColor: accent }}></div>
          </div>
          <nav className="hidden md:flex gap-6 pb-1">
            {(links || []).map(l => (
              <NavItem 
                key={l.label} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: `${txtColor}80` }}
              />
            ))}
            <span onClick={onOpenCart} className="cursor-pointer font-medium transition-colors hover:opacity-70" style={{ color: accent }}>
              Cart ({cartCount})
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 18. TICKER - News Ticker Style
// ============================================================================
export const HeaderTicker: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#000000';
  const txtColor = textColor || '#ffffff';
  const accent = accentColor || '#EF4444';
  
  return (
    <header className="w-full sticky top-0 z-[100]" style={{ backgroundColor: bgColor }}>
      {/* Ticker */}
      <div className="overflow-hidden py-2" style={{ backgroundColor: accent }}>
        <div className="animate-marquee whitespace-nowrap text-xs font-bold tracking-widest" style={{ color: '#ffffff' }}>
          ★ NEW ARRIVALS ★ LIMITED EDITION ★ FREE SHIPPING OVER $99 ★ NEW ARRIVALS ★ LIMITED EDITION ★ FREE SHIPPING OVER $99 ★
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-xl font-black uppercase tracking-wider"
          style={{ color: txtColor }}
          onClick={onLogoClick}
        />
        <nav className="hidden md:flex gap-6">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: `${txtColor}90` }}
            />
          ))}
        </nav>
        <CartBadge 
          count={cartCount} 
          onClick={onOpenCart} 
          iconColor={txtColor}
          badgeColor={accent}
          badgeTextColor="#ffffff"
        />
      </div>
    </header>
  );
};

// ============================================================================
// 19. NOIR - Dark Mode with Glow
// ============================================================================
export const HeaderNoir: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const bgColor = backgroundColor || '#0A0A0A';
  const txtColor = textColor || '#ffffff';
  const accent = accentColor || '#A855F7';
  
  return (
    <header className="w-full border-b sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor, borderColor: `${txtColor}10` }}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-xl font-bold"
          style={{ color: txtColor, textShadow: `0 0 20px ${accent}50` }}
          onClick={onLogoClick}
        />
        <nav className="hidden md:flex gap-8">
          {(links || []).map(l => (
            <NavItem 
              key={l.label} 
              link={l} 
              onClick={onLinkClick} 
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: `${txtColor}80` }}
            />
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Search size={18} className="cursor-pointer hover:opacity-70" style={{ color: txtColor }} />
          <div className="relative" onClick={onOpenCart}>
            <ShoppingBag size={18} className="cursor-pointer hover:opacity-70" style={{ color: txtColor }} />
            {cartCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full font-bold"
                style={{ backgroundColor: accent, color: '#ffffff', boxShadow: `0 0 10px ${accent}` }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 20. GHOST - Hidden Menu (appears on hover)
// ============================================================================
export const HeaderGhost: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const bgColor = backgroundColor || '#ffffff';
  const txtColor = textColor || '#171717';
  const accent = accentColor || '#000000';
  
  return (
    <header 
      className="w-full sticky top-0 z-[100] transition-colors"
      style={{ backgroundColor: bgColor }}
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo 
          storeName={storeName} 
          logoUrl={logoUrl} 
          logoHeight={logoHeight} 
          className="text-xl font-bold"
          style={{ color: txtColor }}
          onClick={onLogoClick}
        />
        <div className="flex items-center gap-6">
          <button 
            className="text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: txtColor }}
          >
            Menu
          </button>
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor={bgColor}
          />
        </div>
      </div>
      {/* Dropdown Menu */}
      <div 
        className={`absolute left-0 right-0 border-t transition-all duration-300 ${showMenu ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ backgroundColor: bgColor, borderColor: `${txtColor}10` }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex gap-8">
            {(links || []).map(l => (
              <NavItem 
                key={l.label} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: txtColor }}
              />
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

// ============================================================================
// 21. PILOT - Professional SaaS Style
// ============================================================================
export const HeaderPilot: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart, onLogoClick, onLinkClick,
  backgroundColor, textColor, accentColor 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const bgColor = backgroundColor || '#ffffff';
  const txtColor = textColor || '#111827';
  const accent = accentColor || '#4F46E5';
  
  return (
    <header className="w-full border-b sticky top-0 z-[100] transition-colors" style={{ backgroundColor: bgColor, borderColor: `${txtColor}10` }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {!logoUrl && <Command size={24} style={{ color: accent }} />}
            <Logo 
              storeName={storeName} 
              logoUrl={logoUrl} 
              logoHeight={logoHeight} 
              className="text-xl font-bold"
              style={{ color: txtColor }}
              onClick={onLogoClick}
            />
          </div>
          <nav className="hidden md:flex gap-6">
            {(links || []).map(l => (
              <NavItem 
                key={l.label} 
                link={l} 
                onClick={onLinkClick} 
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: `${txtColor}70` }}
              />
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <CartBadge 
            count={cartCount} 
            onClick={onOpenCart} 
            iconColor={txtColor}
            badgeColor={accent}
            badgeTextColor="#ffffff"
            className="hidden md:block"
          />
          <button 
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: accent, color: '#ffffff' }}
          >
            Get Started
          </button>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: txtColor }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: bgColor, borderColor: `${txtColor}10` }}>
          <nav className="px-6 py-4 space-y-3">
            {(links || []).map(l => (
              <NavItem 
                key={l.label} 
                link={l} 
                onClick={(href) => { onLinkClick?.(href); setMobileMenuOpen(false); }} 
                className="block text-sm font-medium py-2"
                style={{ color: txtColor }}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

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
  { id: 'canvas', name: 'Classic Clean', description: 'Simple and elegant - perfect for any store', date: '2024-01-01', popularity: 95, recommended: true },
  { id: 'nebula', name: 'Modern Glass', description: 'Trendy frosted glass effect', date: '2024-03-15', popularity: 92, recommended: true },
  { id: 'luxe', name: 'Luxury Elegant', description: 'High-end feel with serif fonts', date: '2024-07-01', popularity: 90, recommended: true },
  { id: 'pilot', name: 'Professional', description: 'Great for SaaS and tech products', date: '2024-11-24', popularity: 88 },
  { id: 'bunker', name: 'Bold Contrast', description: 'Strong black and yellow design', date: '2024-06-20', popularity: 85 },
  { id: 'pop', name: 'Playful Modern', description: 'Fun and friendly vibe', date: '2024-09-01', popularity: 82 },
  { id: 'venture', name: 'Search-First', description: 'Prominent search bar for large catalogs', date: '2024-02-01', popularity: 80 },
  { id: 'orbit', name: 'Interactive', description: 'Animated hover effects', date: '2024-08-01', popularity: 78 },
  { id: 'gullwing', name: 'Centered Logo', description: 'Logo in the middle, menu on sides', date: '2024-07-15', popularity: 77 },
  { id: 'noir', name: 'Dark Mode', description: 'Sleek dark theme with glow effects', date: '2024-10-15', popularity: 76 },
  { id: 'modul', name: 'Grid Layout', description: 'Swiss-style organized design', date: '2024-10-05', popularity: 74 },
  { id: 'portfolio', name: 'Split Screen', description: 'Bold two-column layout', date: '2024-05-05', popularity: 72 },
  { id: 'horizon', name: 'Double Row', description: 'Two-level navigation', date: '2024-02-14', popularity: 70 },
  { id: 'metro', name: 'Tile Style', description: 'Windows-inspired grid', date: '2024-10-01', popularity: 68 },
  { id: 'stark', name: 'Minimalist', description: 'Ultra-clean with high contrast', date: '2024-08-20', popularity: 66 },
  { id: 'protocol', name: 'Tech/Gaming', description: 'Futuristic cyberpunk style', date: '2024-09-10', popularity: 65 },
  { id: 'ghost', name: 'Hidden Menu', description: 'Menu appears on hover', date: '2024-11-01', popularity: 62 },
  { id: 'studio', name: 'Sidebar Nav', description: 'Navigation on the left side', date: '2024-01-20', popularity: 60 },
  { id: 'offset', name: 'Asymmetric', description: 'Unique off-center design', date: '2024-03-01', popularity: 58 },
  { id: 'terminal', name: 'Developer', description: 'Code-inspired aesthetic', date: '2024-04-01', popularity: 55 },
  { id: 'ticker', name: 'News Ticker', description: 'Scrolling announcements bar', date: '2024-06-01', popularity: 50 },
];

export const HEADER_FIELDS: Record<string, string[]> = {
  canvas: [],
  nebula: [],
  bunker: ['announcementText'],
  orbit: ['checkoutButtonText'],
  protocol: ['statusText'],
  horizon: ['currencyText', 'languageText', 'announcementText', 'supportLabel', 'signInLabel'],
  studio: ['searchPlaceholder'],
  terminal: [],
  portfolio: ['announcementText'],
  venture: ['searchPlaceholder'],
  metro: [],
  modul: [],
  luxe: ['tagline', 'accountLabel'],
  gullwing: [],
  pop: ['cartButtonText'],
  stark: ['searchLabel', 'loginLabel', 'cartLabel'],
  offset: [],
  ticker: ['tickerText'],
  noir: [],
  ghost: ['menuLabel'],
  pilot: ['ctaButtonText', 'ctaButtonLink'],
};
