
export enum ViewMode {
  ADMIN = 'ADMIN',
  STORE = 'STORE'
}

export enum AdminTab {
  DASHBOARD = 'DASHBOARD',
  PRODUCTS = 'PRODUCTS',
  DESIGN = 'DESIGN',
  CAMPAIGNS = 'CAMPAIGNS',
  SETTINGS = 'SETTINGS'
}

export type HeaderStyleId = 
  | 'canvas' 
  | 'nebula' 
  | 'bunker' 
  | 'orbit' 
  | 'protocol' 
  | 'horizon' 
  | 'studio' 
  | 'terminal' 
  | 'portfolio' 
  | 'venture'
  | 'metro'
  | 'modul'
  | 'luxe'
  | 'gullwing'
  | 'pop'
  | 'stark'
  | 'offset'
  | 'ticker'
  | 'noir'
  | 'ghost'
  | 'pilot';

export type HeroStyleId =
  | 'impact'
  | 'split'
  | 'kinetik'
  | 'grid'
  | 'typographic';

export type ProductCardStyleId = 
  | 'classic'
  | 'industrial'
  | 'focus'
  | 'hype'
  | 'magazine'
  | 'glass';

export type FooterStyleId =
  | 'minimal'
  | 'columns'
  | 'newsletter'
  | 'brand'
  | 'sitemap';

export interface StoreConfig {
  name: string;
  currency: string;
  headerStyle: HeaderStyleId;
  heroStyle: HeroStyleId;
  productCardStyle: ProductCardStyleId;
  footerStyle: FooterStyleId;
  primaryColor: string;
  logoUrl?: string;
  logoHeight?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface PageBlock {
  id: string;
  type: 'section' | 'system-hero' | 'system-grid' | 'system-footer';
  name: string;
  content: string; // HTML content for 'section', ignored/metadata for system blocks
  variant?: string; // Optional override for system styles (e.g. 'impact', 'minimal')
  data?: {
    heading?: string;
    subheading?: string;
    image?: string;
    buttonText?: string;
    [key: string]: any;
  };
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string; // Deprecated
  blocks: PageBlock[];
  type: 'home' | 'custom';
}

export interface AdminPanelProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  config: StoreConfig;
  onConfigChange: (newConfig: StoreConfig) => void;
  products: Product[];
  onAddProduct: (product: Product) => void;
  pages: Page[];
  activePageId: string;
  onAddPage: (page: Page) => void;
  onUpdatePage: (pageId: string, updates: Partial<Page>) => void;
  onSetActivePage: (pageId: string) => void;
}

export interface StorefrontProps {
  config: StoreConfig;
  products: Product[];
  pages: Page[];
  activePageId: string;
  onNavigate?: (pageId: string) => void;
  previewBlock?: PageBlock | null;
  activeBlockId?: string | null;
  onUpdateBlock?: (blockId: string, data: any) => void;
}
