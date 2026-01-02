
export enum ViewMode {
  ADMIN = 'ADMIN',
  STORE = 'STORE'
}

export enum AdminTab {
  DASHBOARD = 'DASHBOARD',
  ORDERS = 'ORDERS',
  PRODUCTS = 'PRODUCTS',
  CATEGORIES = 'CATEGORIES',
  COLLECTIONS = 'COLLECTIONS',
  PAGES = 'PAGES',
  MEDIA = 'MEDIA',
  DESIGN = 'DESIGN',
  CAMPAIGNS = 'CAMPAIGNS',
  DISCOUNTS = 'DISCOUNTS',
  SHIPPING = 'SHIPPING',
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

export type SocialStyleId =
  | 'grid-classic'
  | 'masonry-wall'
  | 'carousel-reel'
  | 'polaroid-scatter'
  | 'minimal-feed'
  | 'dark-mode-glitch'
  | 'story-circles'
  | 'featured-hero'
  | 'ticker-tape'
  | 'glass-cards';

export type RichTextStyleId = 'rt-centered' | 'rt-left' | 'rt-bordered' | 'rt-wide';
export type EmailSignupStyleId = 'email-minimal' | 'email-split' | 'email-card';
export type CollapsibleStyleId = 'col-simple' | 'col-faq';
export type LogoListStyleId = 'logo-grid' | 'logo-ticker';
export type PromoBannerStyleId = 'promo-top' | 'promo-hero';
export type GalleryStyleId = 'gal-grid' | 'gal-masonry' | 'gal-slider' | 'gal-featured';

export type BlogStyleId = 'blog-grid' | 'blog-list' | 'blog-featured' | 'blog-minimal' | 'blog-magazine' | 'blog-slider' | 'blog-cards' | 'blog-sidebar' | 'blog-alternating' | 'blog-overlay';
export type VideoStyleId = 'vid-full' | 'vid-window' | 'vid-bg' | 'vid-split' | 'vid-popup' | 'vid-slider' | 'vid-grid' | 'vid-hero' | 'vid-interactive' | 'vid-story';
export type ContactStyleId = 'contact-simple' | 'contact-split' | 'contact-map' | 'contact-minimal' | 'contact-floating' | 'contact-grid' | 'contact-newsletter' | 'contact-faq' | 'contact-social' | 'contact-office';
export type LayoutStyleId = 'layout-image-text' | 'layout-multirow' | 'layout-multicolumn' | 'layout-collage' | 'layout-banner' | 'layout-stats' | 'layout-timeline' | 'layout-features' | 'layout-accordion' | 'layout-tabs';
export type CollectionStyleId = 'collection-list' | 'featured-collection' | 'featured-product' | 'slideshow' | 'collection-grid-tight' | 'collection-masonry' | 'collection-carousel' | 'collection-tabs' | 'collection-lookbook' | 'collection-split';

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
  slug?: string; // Store URL slug for public access
  name: string;
  tagline?: string; // Store tagline/description
  currency: string;
  headerStyle: HeaderStyleId;
  heroStyle: HeroStyleId;
  productCardStyle: ProductCardStyleId;
  footerStyle: FooterStyleId;
  scrollbarStyle: ScrollbarStyleId;
  
  // Footer Colors
  footerBackgroundColor?: string;
  footerTextColor?: string;
  footerAccentColor?: string;
  
  primaryColor: string;
  accentColor?: string; // Secondary accent color
  secondaryColor?: string;
  backgroundColor?: string;
  storeType?: string;
  storeVibe?: 'playful' | 'minimal' | 'bold' | 'cozy' | 'luxury' | 'retro';
  colorPalette?: string;
  logoUrl?: string;
  logoHeight?: number;
  
  // Global Typography Settings
  typography?: {
    // Font Families
    headingFont?: string;
    bodyFont?: string;
    accentFont?: string;
    
    // Global Text Colors
    headingColor?: string;
    bodyColor?: string;
    linkColor?: string;
    linkHoverColor?: string;
    mutedColor?: string;
    
    // Font Sizes (base scale)
    baseFontSize?: string;
    headingScale?: 'compact' | 'default' | 'large' | 'dramatic';
    
    // Font Weights
    headingWeight?: '400' | '500' | '600' | '700' | '800' | '900';
    bodyWeight?: '300' | '400' | '500';
    
    // Line Heights
    headingLineHeight?: string;
    bodyLineHeight?: string;
    
    // Letter Spacing
    headingLetterSpacing?: string;
    bodyLetterSpacing?: string;
    
    // Text Transform
    headingTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  };
  
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
    country_code: string;
    region_code: string;
    rate: number;
    name: string;
    shippingTaxed?: boolean;
  }[];
  notificationSettings?: {
    orderConfirmation?: boolean;
    shippingUpdate?: boolean;
    orderDelivered?: boolean;
    emailBranding?: boolean;
  };
}

export interface Category {
  id: string;
  store_id?: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  store_id?: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  type: 'manual' | 'auto-category' | 'auto-tag' | 'auto-newest' | 'auto-bestsellers';
  is_featured: boolean;
  is_visible: boolean;
  display_order: number;
  conditions?: {
    category_id?: string;
    tags?: string[];
    min_price?: number;
    max_price?: number;
    limit?: number;
  };
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  product_ids?: string[]; // For manual collections
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

  category: string; // Legacy text field (deprecated)
  category_id?: string; // New foreign key to categories table
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
  type: 'section' | 'system-hero' | 'system-grid' | 'system-footer' | 'system-scroll' | 'system-social' | 'system-rich-text' | 'system-email' | 'system-collapsible' | 'system-logo-list' | 'system-promo' | 'system-gallery' | 'system-blog' | 'system-video' | 'system-contact' | 'system-layout' | 'system-collection';
  name: string;
  content: string; // HTML content for 'section', ignored/metadata for system blocks
  variant?: string; // Optional override for system styles (e.g. 'impact', 'minimal')
  hidden?: boolean;
  locked?: boolean;
  data?: {
    heading?: string;
    subheading?: string;
    image?: string;
    buttonText?: string;
    style?: {
      backgroundColor?: string;
      textColor?: string;
      padding?: 's' | 'm' | 'l' | 'xl' | 'none';
      alignment?: 'left' | 'center' | 'right';
      fullWidth?: boolean;
    };
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
  display_order?: number;
  link_type?: 'page' | 'products' | 'collections' | 'contact' | 'external';
  external_url?: string;
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
  onDeleteProduct?: (productId: string) => void;
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
  categories?: Category[];
  collections?: Collection[];
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
  tracking_number?: string;
  carrier?: string;
  shipped_at?: string;
}

export interface Subscription {
  id: string;
  store_id: string;
  plan_id: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  current_period_end?: string;
}

export interface Domain {
  id: string;
  store_id: string;
  domain: string;
  status: 'pending' | 'active' | 'error';
  verified_at?: string;
  created_at: string;
}

export interface Discount {
  id: string;
  store_id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount: number;
  starts_at: string;
  ends_at?: string;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  specific_customer_ids?: string[] | null;
  created_at: string;
}

export interface ShippingZone {
  id: string;
  store_id: string;
  name: string;
  countries: string[];
  created_at: string;
}

export interface ShippingRate {
  id: string;
  zone_id: string;
  name: string;
  type: 'flat' | 'weight' | 'price';
  amount: number;
  min_value?: number;
  max_value?: number;
  created_at: string;
}

export interface StorefrontProps {
  config: StoreConfig;
  products: Product[];
  pages: Page[];
  activePageId: string;
  activeProductSlug?: string; // Add this
  onNavigate?: (pageId: string) => void;
  previewBlock?: PageBlock | null;
  activeBlockId?: string | null;
  onUpdateBlock?: (blockId: string, data: any) => void;
  onEditBlock?: (blockId: string) => void;
  onMoveBlock?: (blockId: string, direction: 'up' | 'down') => void;
  onDeleteBlock?: (blockId: string) => void;
  onDuplicateBlock?: (blockId: string) => void;
  onToggleVisibility?: (blockId: string) => void;
  onToggleLock?: (blockId: string) => void;
  onSwitchLayout?: (blockId: string) => void;
  showCartDrawer?: boolean;
  collections?: Collection[];
}
