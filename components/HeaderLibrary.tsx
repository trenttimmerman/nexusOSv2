/**
 * Header Library - Customizable Header Components
 * 
 * ALL HEADERS MUST SUPPORT COLOR CUSTOMIZATION:
 * - All headers accept: headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
 * - All headers must call: const colors = useHeaderColors({ ...colorProps });
 * - Apply colors using inline styles:
 *   - Main background: style={{ backgroundColor: colors.bgColor }}
 *   - Text color: style={{ color: colors.textColor }}
 *   - Borders: style={{ borderColor: colors.outlineColor }}
 *   - Glow effect: style={colors.glowStyle}
 *   - Buttons/badges: style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}
 * 
 * See HeaderCanvas, HeaderNebula, HeaderBunker, HeaderOrbit, HeaderProtocol, and HeaderHorizon for reference implementations.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, Search, X, User, Globe, Command, ChevronDown, ArrowRight, Hexagon, Grid, Disc, Activity } from 'lucide-react';
import { NavLink } from '../types';

interface HeaderProps {
  storeName: string;
  logoUrl?: string;
  logoHeight?: number;
  links: NavLink[];
  cartCount: number;
  onOpenCart?: () => void;
  onLogoClick?: () => void;
  primaryColor?: string;
  secondaryColor?: string;
  headerBgColor?: string;
  headerTextColor?: string;
  headerOutlineColor?: string;
  headerGlowEffect?: boolean;
  headerButtonBgColor?: string;
  headerButtonTextColor?: string;
}

// Reusable Logo Helper Component
const Logo: React.FC<{storeName: string, logoUrl?: string, logoHeight?: number, className?: string, onClick?: () => void, style?: React.CSSProperties}> = ({ storeName, logoUrl, logoHeight = 32, className, onClick, style }) => {
  const content = logoUrl 
    ? <img src={logoUrl} alt={storeName} style={{ height: `${logoHeight}px`, width: 'auto' }} className="object-contain" />
    : <span className={className} style={style}>{storeName}</span>;
    
  if (onClick) {
    return <button onClick={onClick} className="cursor-pointer" style={style}>{content}</button>;
  }
  return content;
};

// Helper to get color values with defaults
const useHeaderColors = (props: Partial<HeaderProps>) => {
  const bgColor = props.headerBgColor || '#ffffff';
  const textColor = props.headerTextColor || '#000000';
  const outlineColor = props.headerOutlineColor || '#e5e5e5';
  const glowEffect = props.headerGlowEffect || false;
  const buttonBg = props.headerButtonBgColor || textColor;
  const buttonText = props.headerButtonTextColor || '#ffffff';
  
  const glowStyle = glowEffect ? { boxShadow: `0 4px 24px ${bgColor}40` } : {};
  
  return { bgColor, textColor, outlineColor, glowEffect, buttonBg, buttonText, glowStyle };
};

// 1. The Canvas (Minimalist, Clean, Airy)
export const HeaderCanvas: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor = '#ffffff',
  headerTextColor = '#000000',
  headerOutlineColor = '#f3f4f6',
  headerGlowEffect = false,
  headerButtonBgColor,
  headerButtonTextColor = '#ffffff'
}) => {
  const bgColor = headerBgColor;
  const textColor = headerTextColor;
  const borderColor = headerOutlineColor;
  const glowStyle = headerGlowEffect ? { boxShadow: `0 4px 24px ${headerBgColor}40` } : {};
  const buttonBg = headerButtonBgColor || textColor;
  const buttonText = headerButtonTextColor;

  return (
    <header 
      className="w-full border-b sticky top-0 z-[100]" 
      style={{ backgroundColor: bgColor, borderColor, ...glowStyle }}
    >
      <div className="max-w-7xl mx-auto px-6 min-h-[5rem] py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-bold tracking-tight" style={{ color: textColor }} />
          <nav className="hidden md:flex gap-6">
            {(links || []).map(l => (
              <Link 
                key={l.label} 
                to={l.href} 
                className="text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: textColor }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4" style={{ color: textColor }}>
          <button className="p-2 hover:opacity-70 rounded-full transition-opacity"><Search size={20} /></button>
          <Link to="/account" className="p-2 hover:opacity-70 rounded-full transition-opacity"><User size={20} /></Link>
          <div onClick={onOpenCart} className="relative p-2 hover:opacity-70 rounded-full transition-opacity cursor-pointer">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span 
                className="absolute top-0 right-0 w-4 h-4 text-[10px] flex items-center justify-center rounded-full"
                style={{ backgroundColor: buttonBg, color: buttonText }}
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

// 2. The Nebula (Glassmorphic, Floating, Blur)
export const HeaderNebula: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor = '#ffffff',
  headerTextColor = '#000000',
  headerOutlineColor = '#e5e5e5',
  headerGlowEffect = false,
  headerButtonBgColor,
  headerButtonTextColor = '#ffffff'
}) => {
  const bgColor = `${headerBgColor}99`; // 60% opacity
  const textColor = headerTextColor;
  const borderColor = `${headerOutlineColor}33`; // 20% opacity
  const glowStyle = headerGlowEffect ? { boxShadow: `0 8px 32px ${headerBgColor}40` } : {};
  const buttonBg = headerButtonBgColor || textColor;
  const buttonText = headerButtonTextColor;

  return (
    <header className="sticky top-0 z-[100] flex justify-center px-4 pt-4">
      <div 
        className="backdrop-blur-xl border shadow-lg rounded-full px-8 py-3 flex items-center gap-12 max-w-4xl w-full justify-between"
        style={{ backgroundColor: bgColor, borderColor, ...glowStyle }}
      >
         <div className="flex items-center gap-2">
           {!logoUrl && <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: buttonBg }}></div>}
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold tracking-wider text-sm uppercase" />
         </div>
         <nav className="hidden md:flex gap-8">
            {(links || []).map(l => (
              <a key={l.label} href={l.href} className="text-xs font-semibold tracking-widest uppercase hover:opacity-70 transition-opacity" style={{ color: textColor }}>
                {l.label}
              </a>
            ))}
         </nav>
         <div className="flex items-center gap-4" style={{ color: textColor }}>
           <Search size={18} className="cursor-pointer hover:opacity-70" />
           <div onClick={onOpenCart} className="relative cursor-pointer hover:opacity-70">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: buttonBg }}></span>}
           </div>
         </div>
      </div>
    </header>
  );
};

// 3. The Bunker (Brutalist, High Contrast, Bold)
export const HeaderBunker: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor = '#facc15',
  headerTextColor = '#000000',
  headerOutlineColor = '#000000',
  headerGlowEffect = false,
  headerButtonBgColor,
  headerButtonTextColor = '#facc15'
}) => {
  const bgColor = headerBgColor;
  const textColor = headerTextColor;
  const borderColor = headerOutlineColor;
  const glowStyle = headerGlowEffect ? { boxShadow: `0 4px 24px ${headerBgColor}60` } : {};
  const buttonBg = headerButtonBgColor || textColor;
  const buttonText = headerButtonTextColor;

  return (
    <header className="w-full border-b-4 sticky top-0 z-50 font-mono" style={{ backgroundColor: bgColor, borderColor, ...glowStyle }}>
      <div className="w-full text-xs py-1 px-2 overflow-hidden whitespace-nowrap" style={{ backgroundColor: borderColor, color: bgColor }}>
         <div className="animate-marquee inline-block">
           FREE SHIPPING WORLDWIDE — 0% TRANSACTION FEES — NEXUS COMMERCE OS — BUILD THE FUTURE — 
           FREE SHIPPING WORLDWIDE — 0% TRANSACTION FEES — NEXUS COMMERCE OS — BUILD THE FUTURE —
         </div>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto] min-h-[4rem]" style={{ borderColor }}>
        <div className="px-6 py-2 flex items-center border-r-4" style={{ backgroundColor: headerButtonTextColor || '#ffffff', borderColor }}>
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-black uppercase italic transform -skew-x-12" style={{ color: textColor }} />
        </div>
        <nav className="hidden md:flex items-stretch justify-center">
          <div className="flex w-full h-full">
            {(links || []).map((l, i) => (
              <a key={l.label} href={l.href} className="flex-1 flex items-center justify-center text-sm font-bold uppercase hover:opacity-80 transition-opacity px-4 py-2" style={{ color: textColor, borderLeft: i > 0 ? `4px solid ${borderColor}` : 'none' }}>
                {l.label}
              </a>
            ))}
          </div>
        </nav>
        <div className="px-6 py-2 flex items-center justify-center gap-6 border-l-4" style={{ backgroundColor: headerButtonTextColor || '#ffffff', borderColor, color: textColor }}>
          <User size={24} className="stroke-[3]" />
          <div onClick={onOpenCart} className="relative cursor-pointer">
             <ShoppingBag size={24} className="stroke-[3]" />
             <span className="absolute -top-2 -right-2 text-xs font-bold px-1 border-2" style={{ backgroundColor: buttonBg, color: buttonText, borderColor }}>{cartCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// 4. The Orbit (Dynamic Island style, Dark)
export const HeaderOrbit: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor = '#171717',
  headerTextColor = '#ffffff',
  headerOutlineColor = '#404040',
  headerGlowEffect = false,
  headerButtonBgColor,
  headerButtonTextColor = '#000000'
}) => {
  const [expanded, setExpanded] = useState(false);
  const bgColor = headerBgColor;
  const textColor = headerTextColor;
  const borderColor = headerOutlineColor;
  const glowStyle = headerGlowEffect ? { boxShadow: `0 8px 32px ${headerBgColor}80` } : { boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' };
  const buttonBg = headerButtonBgColor || headerButtonTextColor;
  const buttonText = headerButtonTextColor;

  return (
    <header className="sticky top-0 z-[100] flex justify-center pointer-events-none pt-6">
      <div 
        className={`pointer-events-auto shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${expanded ? 'w-[600px] h-auto rounded-3xl' : 'w-[400px] min-h-[3.5rem] py-2 rounded-full'}`}
        style={{ backgroundColor: bgColor, color: textColor, ...glowStyle }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div className="w-full flex items-center justify-between px-6">
           <div className="flex items-center gap-2 py-1">
             {!logoUrl && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: buttonBg }}></div>}
             <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold" />
           </div>
           
           {!expanded && (
             <div className="flex items-center gap-4 text-sm" style={{ color: `${textColor}99` }}>
                <span>Menu</span>
                <div className="w-px h-4" style={{ backgroundColor: borderColor }}></div>
                <span onClick={onOpenCart} className="flex items-center gap-1 cursor-pointer" style={{ color: textColor }}><ShoppingBag size={14}/> {cartCount}</span>
             </div>
           )}
        </div>

        {expanded && (
          <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
             <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: `${textColor}66` }}>Navigation</span>
                {(links || []).map(l => (
                  <a key={l.label} href={l.href} className="text-lg font-medium hover:opacity-70 transition-opacity" style={{ color: textColor }}>{l.label}</a>
                ))}
             </div>
             <div className="flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: `${textColor}66` }}>Account</span>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity" style={{ color: `${textColor}cc` }}>Orders</a>
                <a href="#" className="text-sm hover:opacity-100 transition-opacity" style={{ color: `${textColor}cc` }}>Wishlist</a>
                <div className="mt-auto pt-4 border-t flex justify-between items-center" style={{ borderColor }}>
                  <span className="text-sm" style={{ color: `${textColor}99` }}>Cart ({cartCount})</span>
                  <button onClick={onOpenCart} className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: buttonBg, color: buttonText }}>Checkout</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </header>
  );
}

// 5. The Protocol (Cyberpunk/Brutalist)
export const HeaderProtocol: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => {
  const colors = useHeaderColors({ headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor });
  return (
    <header className="sticky top-0 z-50 border-b-4 font-mono" style={{ backgroundColor: colors.bgColor, borderColor: colors.outlineColor, ...colors.glowStyle }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-black uppercase tracking-tighter" style={{ color: colors.textColor }} />
          <nav className="hidden md:flex gap-6">
            {(links || []).map(l => (
              <a key={l.label} href={l.href} className="text-sm font-bold uppercase hover:underline decoration-2 underline-offset-4" style={{ color: colors.textColor }}>{l.label}</a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4" style={{ color: colors.textColor }}>
          <div className="hidden md:block px-2 py-1 text-xs font-bold" style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}>
            SYS.ONLINE
          </div>
          <div onClick={onOpenCart} className="relative cursor-pointer border-2 p-1 hover:opacity-70 transition-opacity" style={{ borderColor: colors.outlineColor }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] font-bold w-5 h-5 flex items-center justify-center" style={{ backgroundColor: colors.buttonBg, color: colors.buttonText }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}// 6. The Horizon (Double Decker, Editorial)
export const HeaderHorizon: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
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
            <a key={l.label} href={l.href} className="text-sm font-bold uppercase tracking-wider hover:underline underline-offset-4">{l.label}</a>
          ))}
       </nav>
       
       <div className="absolute left-1/2 transform -translate-x-1/2">
         <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-3xl font-serif italic" />
       </div>

       <nav className="hidden md:flex gap-8">
          {(links || []).slice(2).map(l => (
            <a key={l.label} href={l.href} className="text-sm font-bold uppercase tracking-wider hover:underline underline-offset-4">{l.label}</a>
          ))}
       </nav>
       
       <div className="flex items-center gap-4">
         <Search size={20} />
         <div onClick={onOpenCart} className="flex items-center gap-1 font-bold text-sm cursor-pointer hover:text-neutral-600 transition-colors">
           <ShoppingBag size={20} />
           <span>({cartCount})</span>
         </div>
       </div>
    </div>
  </header>
);

// 7. The Studio (Sidebar Navigation)
export const HeaderStudio: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-neutral-50 border-r border-neutral-200 flex-col p-8 z-50">
    <div className="mb-12">
      <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight || 48} className="text-2xl font-black tracking-tighter uppercase leading-none" />
    </div>
    
    <nav className="flex flex-col gap-6 flex-1">
       {(links || []).map(l => (
         <Link key={l.label} to={l.href} className="text-lg font-medium text-neutral-500 hover:text-black hover:pl-2 transition-all duration-300">
           {l.label}
         </Link>
       ))}
    </nav>

    <div className="mt-auto space-y-6">
       <div className="relative w-full">
         <input type="text" placeholder="Search..." className="w-full bg-white border border-neutral-200 px-3 py-2 text-sm rounded-md focus:outline-none focus:border-black" />
         <Search size={14} className="absolute right-3 top-3 text-neutral-400" />
       </div>
       
       <div className="flex justify-between items-center border-t border-neutral-200 pt-6">
          <div className="flex flex-col">
             <span className="text-xs text-neutral-500">Your Bag</span>
             <span className="font-bold text-lg">${(cartCount * 45).toFixed(2)}</span>
          </div>
          <div onClick={onOpenCart} className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full cursor-pointer hover:bg-neutral-800 transition-colors">
             {cartCount}
          </div>
       </div>
    </div>
  </header>
);

// 8. The Terminal (Developer focused, command line)
export const HeaderTerminal: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
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
             <a key={l.label} href={l.href} className="hover:text-white transition-colors flex gap-1">
               <span className="text-[#c586c0]">import</span>
               <span>{l.label}</span>
             </a>
          ))}
       </nav>

       <div onClick={onOpenCart} className="flex items-center gap-3 text-sm cursor-pointer hover:text-white transition-colors">
          <span className="text-[#6a9955]">// Cart: {cartCount} items</span>
          <div className="w-2 h-4 bg-[#d4d4d4] animate-pulse"></div>
       </div>
    </div>
  </header>
);

// 9. The Portfolio (Split Screen, Big Typography)
export const HeaderPortfolio: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full bg-white sticky top-0 z-50 mix-blend-difference text-white">
     <div className="grid grid-cols-2 md:grid-cols-4 min-h-[5rem] border-b border-white/20">
        <div className="flex items-center px-6 py-2 border-r border-white/20">
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-xl font-bold tracking-tight uppercase" />
        </div>
        <div className="hidden md:flex items-center px-6 border-r border-white/20 justify-center">
           <span className="text-xs uppercase tracking-widest animate-pulse">New Collection Live</span>
        </div>
        <div className="hidden md:flex items-center border-r border-white/20">
           {(links || []).slice(0, 3).map(l => (
              <a key={l.label} href={l.href} className="flex-1 h-full flex items-center justify-center hover:bg-white hover:text-black transition-colors text-xs uppercase font-bold border-r border-white/20 last:border-none">
                 {l.label}
              </a>
           ))}
        </div>
        <div onClick={onOpenCart} className="flex items-center justify-between px-6 py-2 cursor-pointer hover:bg-white hover:text-black transition-colors">
           <span className="text-xs font-bold uppercase">Cart</span>
           <span className="text-4xl font-display">{cartCount.toString().padStart(2, '0')}</span>
        </div>
     </div>
  </header>
);

// 10. The Venture (Utility First, Search Dominant)
export const HeaderVenture: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full bg-neutral-100 border-b border-neutral-200 sticky top-0 z-50">
    <div className="max-w-[1600px] mx-auto p-2">
       <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-2 flex items-center justify-between gap-4 min-h-[4rem]">
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
             <div className="hidden md:flex items-center gap-1 text-xs text-neutral-400 border border-neutral-200 rounded px-1.5 py-0.5">
                <Command size={10} />
                <span>K</span>
             </div>
          </div>

          <div className="flex items-center gap-1 pr-2">
             <nav className="hidden md:flex items-center mr-4">
                {(links || []).map(l => (
                  <a key={l.label} href={l.href} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black rounded-lg hover:bg-neutral-50 transition-colors">{l.label}</a>
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

// 11. Metro (Tiles, Windows Phone Vibe)
export const HeaderMetro: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
    <div className="grid grid-cols-6 md:grid-cols-12 min-h-[4rem] divide-x divide-neutral-100 border-b border-neutral-100">
      <div className="col-span-2 md:col-span-3 flex items-center justify-center bg-blue-600 text-white font-bold text-xl tracking-tighter overflow-hidden py-2 px-4">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} />
      </div>
      {(links || []).map(l => (
        <a key={l.label} href={l.href} className="hidden md:flex col-span-2 items-center justify-center text-sm font-bold uppercase text-neutral-500 hover:bg-neutral-50 hover:text-black transition-colors py-2">
          {l.label}
        </a>
      ))}
      <div className="col-span-2 md:col-span-1 flex items-center justify-center hover:bg-neutral-50 cursor-pointer py-2">
         <Search size={20} className="text-neutral-600" />
      </div>
      <div onClick={onOpenCart} className="col-span-2 flex items-center justify-center bg-black text-white cursor-pointer hover:bg-neutral-800 transition-colors gap-2 py-2">
         <ShoppingBag size={20} />
         <span className="font-bold">{cartCount}</span>
      </div>
    </div>
  </header>
);

// 12. Modul (Swiss Style, Grid)
export const HeaderModul: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full border-b border-black sticky top-0 z-50 bg-white font-sans">
    <div className="flex min-h-[3.5rem]">
      <div className="w-48 border-r border-black flex items-center px-4 py-2 font-bold text-lg shrink-0">
         <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} />
      </div>
      <nav className="flex-1 flex overflow-hidden">
         {(links || []).map(l => (
           <a key={l.label} href={l.href} className="flex-1 border-r border-black flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-neutral-100 transition-colors px-2 py-2">
              {l.label}
           </a>
         ))}
      </nav>
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

// 13. Luxe (Serif, Elegant, Centered)
export const HeaderLuxe: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full bg-[#faf9f6] sticky top-0 z-50 border-b border-[#e5e5e5]">
    <div className="max-w-7xl mx-auto px-8">
       <div className="min-h-[6rem] py-4 flex flex-col items-center justify-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-6">
             <Menu size={20} className="text-neutral-400 hover:text-black transition-colors cursor-pointer"/>
             <Search size={20} className="text-neutral-400 hover:text-black transition-colors cursor-pointer"/>
          </div>
          
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-serif text-3xl italic tracking-wide" />
          {!logoUrl && <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-1">Est. 2024 • Paris</span>}

          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-6">
             <span className="text-xs font-serif italic text-neutral-500 hover:text-black cursor-pointer hidden md:block">Account</span>
             <div onClick={onOpenCart} className="relative cursor-pointer">
                <ShoppingBag size={20} className="text-neutral-800" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#d4af37] rounded-full"></span>}
             </div>
          </div>
       </div>
       <nav className="h-10 border-t border-[#e5e5e5] flex items-center justify-center gap-12">
          {(links || []).map(l => (
            <a key={l.label} href={l.href} className="text-xs font-medium uppercase tracking-widest text-neutral-500 hover:text-[#d4af37] transition-colors">
               {l.label}
            </a>
          ))}
       </nav>
    </div>
  </header>
);

// 14. Gullwing (Symmetrical Split)
export const HeaderGullwing: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto min-h-[5rem] py-4 px-8 flex items-center justify-between">
       <nav className="flex-1 flex justify-end gap-8 pr-12">
          {(links || []).slice(0, 2).map(l => (
             <a key={l.label} href={l.href} className="text-sm font-bold text-neutral-600 hover:text-black transition-colors">{l.label}</a>
          ))}
       </nav>
       
       <div className="shrink-0 flex items-center justify-center px-4 py-2 bg-black text-white transform -skew-x-12">
          <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-display font-bold text-2xl tracking-tighter" />
       </div>

       <div className="flex-1 flex justify-between items-center pl-12">
          <nav className="flex gap-8">
             {(links || []).slice(2).map(l => (
                <a key={l.label} href={l.href} className="text-sm font-bold text-neutral-600 hover:text-black transition-colors">{l.label}</a>
             ))}
          </nav>
          <div onClick={onOpenCart} className="flex items-center gap-4 cursor-pointer hover:text-neutral-600 transition-colors">
             <ShoppingBag size={20} />
             <span className="font-mono text-sm">[{cartCount}]</span>
          </div>
       </div>
    </div>
  </header>
);

// 15. Pop (Neo-Brutalist, Soft)
export const HeaderPop: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full bg-[#F3F4F6] sticky top-0 z-50 p-4">
     <div className="bg-white border-2 border-black rounded-xl min-h-[4rem] py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center px-4 justify-between">
        <div className="bg-[#FF90E8] border-2 border-black px-4 py-1 rounded-full font-black text-sm uppercase transform -rotate-2">
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} />
        </div>

        <nav className="hidden md:flex gap-2">
           {(links || []).map(l => (
              <a key={l.label} href={l.href} className="px-4 py-1.5 rounded-lg border-2 border-transparent hover:border-black hover:bg-[#23A094] hover:text-white font-bold text-sm transition-all">
                 {l.label}
              </a>
           ))}
        </nav>

        <div className="flex items-center gap-2">
           <button className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center hover:bg-neutral-100">
              <Search size={18} />
           </button>
           <button onClick={onOpenCart} className="bg-[#FFC900] px-4 py-1.5 rounded-full border-2 border-black font-bold text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all">
              <ShoppingBag size={16} /> Cart ({cartCount})
           </button>
        </div>
     </div>
  </header>
);

// 16. Stark (High Contrast, Black & White)
export const HeaderStark: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full bg-black text-white sticky top-0 z-50">
     <div className="flex flex-col md:flex-row items-center justify-between p-6">
        <div className="mb-4 md:mb-0">
            <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight ? logoHeight * 1.5 : 48} className="text-4xl md:text-5xl font-black tracking-tighter leading-none" />
        </div>
        <div className="flex flex-col md:items-end gap-2">
           <nav className="flex gap-6">
              {(links || []).map(l => (
                 <a key={l.label} href={l.href} className="text-sm font-medium hover:underline decoration-2 underline-offset-4">{l.label}</a>
              ))}
           </nav>
           <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>SEARCH</span>
              <span>/</span>
              <span>LOGIN</span>
              <span>/</span>
              <span onClick={onOpenCart} className="cursor-pointer hover:text-white transition-colors">CART ({cartCount})</span>
           </div>
        </div>
     </div>
  </header>
);

// 17. Offset (Asymmetrical)
export const HeaderOffset: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full bg-white sticky top-0 z-50 pt-4 px-4 pb-0">
     <div className="flex justify-between items-start mb-4">
        <Logo storeName={`${storeName}.`} logoUrl={logoUrl} logoHeight={logoHeight} className="text-2xl font-bold" />
        <div className="flex gap-4">
           <Search size={20} />
           <div onClick={onOpenCart} className="relative cursor-pointer hover:text-neutral-600 transition-colors">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
           </div>
        </div>
     </div>
     <div className="flex justify-end">
        <nav className="bg-neutral-100 rounded-t-xl px-8 py-3 flex gap-8">
           {(links || []).map(l => (
              <a key={l.label} href={l.href} className="text-sm font-medium text-neutral-600 hover:text-black">{l.label}</a>
           ))}
        </nav>
     </div>
     <div className="h-px w-full bg-neutral-200"></div>
  </header>
);

// 18. Ticker (Stock Market Vibe)
export const HeaderTicker: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full sticky top-0 z-50 bg-white">
     <div className="bg-blue-600 text-white text-xs font-mono py-1 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
           BTC +2.4% • ETH -1.2% • NEXUS +150% • NEW DROPS LIVE • WORLDWIDE SHIPPING • BTC +2.4% • ETH -1.2% • NEXUS +150% •
        </div>
     </div>
     <div className="border-b border-blue-600 min-h-[3.5rem] py-2 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           {!logoUrl && <Activity size={18} className="text-blue-600" />}
           <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="font-bold text-lg tracking-tight" />
        </div>
        <nav className="hidden md:flex gap-6 h-full">
           {(links || []).map(l => (
              <a key={l.label} href={l.href} className="h-full flex items-center border-b-2 border-transparent hover:border-blue-600 text-sm font-medium transition-colors px-2">
                 {l.label}
              </a>
           ))}
        </nav>
        <button onClick={onOpenCart} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 hover:bg-blue-200 transition-colors">
           CART: {cartCount}
        </button>
     </div>
  </header>
);

// 19. Noir (Dark Mode, Glow)
export const HeaderNoir: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="w-full bg-[#050505] text-neutral-400 sticky top-0 z-50 border-b border-white/5 shadow-[0_0_15px_rgba(0,0,0,1)]">
     <div className="max-w-7xl mx-auto min-h-[5rem] py-4 px-6 flex items-center justify-between">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-white text-2xl font-light tracking-[0.2em] shadow-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
        <nav className="hidden md:flex gap-8">
           {(links || []).map(l => (
              <a key={l.label} href={l.href} className="text-sm font-light hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                 {l.label}
              </a>
           ))}
        </nav>
        <div className="flex items-center gap-6">
           <Search size={18} className="hover:text-white transition-colors" />
           <div onClick={onOpenCart} className="relative cursor-pointer">
              <ShoppingBag size={18} className="hover:text-white transition-colors" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>}
           </div>
        </div>
     </div>
  </header>
);

// 20. Ghost (Interaction based)
export const HeaderGhost: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => (
  <header className="sticky top-0 left-0 right-0 z-[100] group hover:bg-white/90 hover:backdrop-blur-md transition-all duration-500 py-6 hover:py-4 px-8 flex justify-between items-center">
     <div className="mix-blend-difference text-white group-hover:text-black transition-colors duration-500">
        <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-xl font-bold" />
     </div>

     <nav className="opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-500 flex gap-8">
        {(links || []).map(l => (
           <a key={l.label} href={l.href} className="text-sm font-bold text-black hover:text-blue-600 transition-colors">
              {l.label}
           </a>
        ))}
     </nav>

     <div className="flex items-center gap-4 mix-blend-difference text-white group-hover:text-black transition-colors duration-500">
        <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">Menu</span>
        <div onClick={onOpenCart} className="relative cursor-pointer">
           <Menu size={24} className="group-hover:hidden" />
           <ShoppingBag size={24} className="hidden group-hover:block" />
           {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
        </div>
     </div>
  </header>
);

// 21. Pilot (SaaS, Clean, Corporate)
export const HeaderPilot: React.FC<HeaderProps> = ({ 
  storeName, logoUrl, logoHeight, links, cartCount, onOpenCart,
  headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor
}) => {
  const colors = useHeaderColors({ headerBgColor, headerTextColor, headerOutlineColor, headerGlowEffect, headerButtonBgColor, headerButtonTextColor });
    return (
        <header className="bg-white shadow-md sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center min-h-[4rem] py-3">
                    {/* Left section: Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                         {!logoUrl && (
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                                <Hexagon size={20} />
                            </div>
                         )}
                         <Logo storeName={storeName} logoUrl={logoUrl} logoHeight={logoHeight} className="text-xl font-bold text-gray-800" />
                    </div>

                    {/* Middle section: Navigation Links */}
                    <nav className="hidden md:flex space-x-8">
                        {(links || []).map(l => (
                             <Link key={l.label} to={l.href} className="text-gray-600 hover:text-indigo-600 transition-colors font-medium text-sm">
                                {l.label}
                             </Link>
                        ))}
                    </nav>

                    {/* Right section: CTA Button */}
                    <div className="hidden md:flex items-center gap-4">
                         <div onClick={onOpenCart} className="relative cursor-pointer text-gray-600 hover:text-indigo-600">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                        </div>
                        <a href="#" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium">
                            Get Started
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <div onClick={onOpenCart} className="relative cursor-pointer text-gray-600">
                             <ShoppingBag size={20} />
                             {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cartCount}</span>}
                        </div>
                        <button className="text-gray-600 hover:text-gray-800">
                             <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export const HEADER_COMPONENTS = {
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

// Added metadata for sorting - User-friendly names with recommendations
export const HEADER_OPTIONS = [
  { id: 'canvas', name: 'Classic Clean', description: 'Simple and elegant - perfect for any store', date: '2024-01-01', popularity: 95, recommended: true },
  { id: 'nebula', name: 'Modern Glass', description: 'Trendy frosted glass effect', date: '2024-03-15', popularity: 92, recommended: true },
  { id: 'luxe', name: 'Luxury Elegant', description: 'High-end feel with serif fonts', date: '2024-07-01', popularity: 90, recommended: true },
  { id: 'pilot', name: 'Professional', description: 'Great for SaaS and tech products', date: '2024-11-24', popularity: 88 },
  { id: 'bunker', name: 'Bold Contrast', description: 'Strong black and white design', date: '2024-06-20', popularity: 85 },
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
  pilot: ['ctaButtonText', 'ctaButtonLink'],
  canvas: [],
  nebula: [],
  bunker: ['announcementText'],
  orbit: ['menuLabel', 'checkoutButtonText'],
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
};
