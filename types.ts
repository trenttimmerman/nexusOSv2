
export enum ViewMode {
  ADMIN = 'ADMIN',
  STORE = 'STORE'
}

export enum AdminTab {
  DASHBOARD = 'DASHBOARD',
  ORDERS = 'ORDERS',
  PRODUCTS = 'PRODUCTS',
  PAGES = 'PAGES',
  MEDIA = 'MEDIA',
  DESIGN = 'DESIGN',
  CAMPAIGNS = 'CAMPAIGNS',
  SETTINGS = 'SETTINGS',
  PLATFORM = 'PLATFORM'
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

export type ScrollbarStyleId =
  | 'native'
  | 'minimal'
  | 'hidden'
  | 'nexus'
  | 'glow'
  | 'gradient-sunset'
  | 'gradient-ocean'
  | 'glass'
  | 'brutalist'
  | 'neon-pink'
  | 'cyber-blue'
  | 'luxury'
  | 'retro'
  | 'soft'
  | 'glass-crystal'
  | 'glass-blur'
  | 'glass-obsidian'
  | 'glass-milk'
  | 'glass-holographic'
  | 'glass-borderless'
  | 'glass-fiber'
  | 'glass-acrylic'
  | 'glass-mirror'
  | 'glass-glacier';

export interface StoreConfig {
  id?: number; // Legacy ID
  store_id?: string; // Tenant ID
  name: string;
  currency: string;
  headerStyle: HeaderStyleId;
  heroStyle: HeroStyleId;
  productCardStyle: ProductCardStyleId;
  footerStyle: FooterStyleId;
  scrollbarStyle: ScrollbarStyleId;
  primaryColor: string;
  logoUrl?: string;
  logoHeight?: number;
  
  // Payment Config
  paymentProvider?: 'stripe' | 'paypal' | 'square' | 'manual';
  stripePublishableKey?: string;
  paypalClientId?: string;
  squareApplicationId?: string;
  squareLocationId?: string;
  enableApplePay?: boolean;
  enableGooglePay?: boolean;

  // Extended Settings
  supportEmail?: string;
  shippingProvider?: 'manual' | 'shippo' | 'easypost';
  shippingRates?: { id: string; name: string; price: number; min_order: number }[];
  taxRate?: number;
  policyRefund?: string;
  policyPrivacy?: string;
  policyTerms?: string;

  // Advanced Settings
  storeAddress?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
  storeFormats?: {
    timezone: string;
    weightUnit: 'kg' | 'lb' | 'oz' | 'g';
    dimensionUnit: 'cm' | 'in' | 'm' | 'mm';
    orderIdPrefix?: string;
    orderIdSuffix?: string;
  };
  shippingZones?: {
    id: string;
    name: string;
    countries: string[];
    rates: {
      id: string;
      name: string;
      price: number;
      type: 'flat' | 'weight' | 'price';
      min?: number;
      max?: number;
    }[];
  }[];
  taxRegions?: {
    id: string;
    country: string;
    region: string;
    rate: number;
    taxName: string;
    shippingTaxed: boolean;
  }[];
  notificationSettings?: {
    orderConfirmation?: boolean;
    shippingUpdate?: boolean;
    orderDelivered?: boolean;
    emailBranding?: boolean;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  altText?: string;
}

export interface ProductVariantOption {
  id: string;
  name: string; // e.g. "Size", "Color"
  values: string[]; // e.g. ["S", "M", "L"]
}

export interface ProductVariant {
  id: string;
  title: string; // e.g. "Red / S"
  price: number;
  stock: number;
  sku?: string;
  options: { [key: string]: string }; // { "Size": "S", "Color": "Red" }
  imageId?: string;
}

export interface ProductSEO {
  title: string;
  description: string;
  slug: string;
  keywords?: string[];
}

export interface Product {
  id: string;
  store_id?: string;
  name: string;
  description: string; // HTML/Rich text
  price: number;
  compareAtPrice?: number;

  // Images
  image: string; // Legacy/Primary fallback
  images: ProductImage[];

  category: string;
  tags: string[];

  // Inventory & Variants
  sku?: string;
  stock: number;
  trackInventory: boolean;

  hasVariants: boolean;
  variantOptions: ProductVariantOption[];
  variants: ProductVariant[];

  // SEO
  seo: ProductSEO;

  // Status
  status: 'active' | 'draft' | 'archived';
  template?: ProductPageStyleId;
  
  // Customization
  allowCustomization?: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export type ProductPageStyleId =
  | 'standard'
  | 'split'
  | 'minimal'
  | 'gallery'
  | 'immersive'
  | 'liquid-reveal'
  | 'scroll-3d'
  | 'drawing'
  | 'builder';

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface PageBlock {
  id: string;
  type: 'section' | 'system-hero' | 'system-grid' | 'system-footer' | 'system-scroll';
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
  store_id?: string;
  title: string;
  slug: string;
  content: string; // Deprecated
  blocks: PageBlock[];
  type: 'home' | 'custom';
}

export interface MediaAsset {
  id: string;
  store_id?: string;
  url: string;
  name: string;
  type: 'image' | 'model' | 'video';
  size?: number;
  createdAt: string;
}

export interface Campaign {
  id: string;
  store_id?: string;
  name: string;
  type: 'email' | 'sms' | 'social';
  status: 'draft' | 'scheduled' | 'sent';
  subject?: string;
  content: string;
  audience: string; // e.g., "All Users", "VIPs", "Cart Abandoners"
  scheduledFor?: string;
  sentAt?: string;
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
  };
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
  onDeletePage: (pageId: string) => void;
  mediaAssets: MediaAsset[];
  onAddAsset: (asset: MediaAsset) => void;
  onDeleteAsset: (assetId: string) => void;
  campaigns: Campaign[];
  onAddCampaign: (campaign: Campaign) => void;
  onUpdateCampaign: (id: string, updates: Partial<Campaign>) => void;
  onDeleteCampaign: (id: string) => void;
  onLogout: () => void;
  userRole?: string | null;
  storeId?: string | null;
  onSwitchStore?: (storeId: string) => Promise<void>;
}

export interface Customer {
  id: string;
  store_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
}

export interface Order {
  id: string;
  store_id: string;
  customer_id?: string;
  total_amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded';
  payment_status: 'unpaid' | 'paid' | 'failed';
  created_at: string;
}

export interface Subscription {
  id: string;
  store_id: string;
  plan_id: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  current_period_end?: string;
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
  showCartDrawer?: boolean;
}
