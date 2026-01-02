import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { NavLink } from '../types';

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
}

// Placeholder header - all headers archived to HeaderLibrary.archive.tsx
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

// All exports point to placeholder - restore from HeaderLibrary.archive.tsx as needed
export const HeaderCanvas = PlaceholderHeader;
export const HeaderNebula = PlaceholderHeader;
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
export const HeaderLuxe = PlaceholderHeader;
export const HeaderGullwing = PlaceholderHeader;
export const HeaderPop = PlaceholderHeader;
export const HeaderStark = PlaceholderHeader;
export const HeaderOffset = PlaceholderHeader;
export const HeaderTicker = PlaceholderHeader;
export const HeaderNoir = PlaceholderHeader;
export const HeaderGhost = PlaceholderHeader;
export const HeaderPilot = PlaceholderHeader;

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
  canvas: [], nebula: [], bunker: [], orbit: [], protocol: [], horizon: [],
  studio: [], terminal: [], portfolio: [], venture: [], metro: [], modul: [],
  luxe: [], gullwing: [], pop: [], stark: [], offset: [], ticker: [],
  noir: [], ghost: [], pilot: [],
};
