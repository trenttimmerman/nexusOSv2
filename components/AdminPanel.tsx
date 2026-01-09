import React, { useState, useEffect } from 'react';
import { getFilteredProducts as getFilteredProductsUtil } from '../lib/productUtils';
import { ProductEditor } from './ProductEditor';
import { StoreConfig, AdminTab, HeaderStyleId, HeroStyleId, ProductCardStyleId, FooterStyleId, ScrollbarStyleId, Product, Page, AdminPanelProps, PageBlock } from '../types';
import { HEADER_OPTIONS, HEADER_COMPONENTS, HEADER_FIELDS, HeaderCanvas, HeaderNebula, HeaderLuxe, HeaderPilot } from './HeaderLibrary';
import { HERO_OPTIONS, HERO_COMPONENTS, HERO_FIELDS } from './HeroLibrary';
import { PRODUCT_CARD_OPTIONS, PRODUCT_CARD_COMPONENTS, PRODUCT_GRID_FIELDS } from './ProductCardLibrary';
import { FOOTER_OPTIONS, FOOTER_FIELDS, FOOTER_COMPONENTS } from './FooterLibrary';
import { SOCIAL_OPTIONS, SOCIAL_COMPONENTS } from './SocialLibrary';
import { SCROLL_OPTIONS, SCROLL_FIELDS, SCROLL_COMPONENTS } from './ScrollLibrary';
import { RICH_TEXT_OPTIONS, RICH_TEXT_COMPONENTS, EMAIL_SIGNUP_OPTIONS, EMAIL_SIGNUP_COMPONENTS, COLLAPSIBLE_OPTIONS, COLLAPSIBLE_COMPONENTS, LOGO_LIST_OPTIONS, LOGO_LIST_COMPONENTS, PROMO_BANNER_OPTIONS, PROMO_BANNER_COMPONENTS } from './SectionLibrary';
import { GALLERY_OPTIONS, GALLERY_COMPONENTS } from './GalleryLibrary';
import { BLOG_OPTIONS, BLOG_COMPONENTS } from './BlogLibrary';
import { VIDEO_OPTIONS, VIDEO_COMPONENTS } from './VideoLibrary';
import { CONTACT_OPTIONS, CONTACT_COMPONENTS } from './ContactLibrary';
import { LAYOUT_OPTIONS, LAYOUT_COMPONENTS } from './LayoutLibrary';
import { COLLECTION_OPTIONS, COLLECTION_COMPONENTS } from './CollectionLibrary';
import { Storefront } from './Storefront';
import { CartDrawer } from './CartDrawer';
import { MediaLibrary } from './MediaLibrary';
import { CampaignManager } from './CampaignManager';
import { OrderManager } from './OrderManager';
import { DomainManager } from './DomainManager';
import { DiscountManager } from './DiscountManager';
import { ShippingManager } from './ShippingManager';
import { CollectionManager } from './CollectionManager';
import { ClientManagement } from './ClientManagement';
import { supabase } from '../lib/supabaseClient';
import { DashboardHome } from './Dashboard';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI
const genAI = import.meta.env.VITE_GEMINI_API_KEY ? new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY) : null;

const SCROLLBAR_OPTIONS = [
  { id: 'native', name: 'Native', description: 'Default browser scrollbar' },
  { id: 'minimal', name: 'Minimal', description: 'Thin, subtle gray track' },
  { id: 'hidden', name: 'Invisible', description: 'Scrollable but hidden' },
  { id: 'nexus', name: 'Evolv Dark', description: 'Brand-aligned dark theme' },
  { id: 'glow', name: 'Neon Glow', description: 'Cyberpunk accent glow' },
  { id: 'gradient-sunset', name: 'Sunset Drive', description: 'Warm gradient fade' },
  { id: 'gradient-ocean', name: 'Ocean Depths', description: 'Deep blue gradient' },
  { id: 'glass', name: 'Frosted Glass', description: 'Translucent modern look' },
  { id: 'brutalist', name: 'Brutalist', description: 'Stark, blocky contrast' },
  { id: 'neon-pink', name: 'Hot Pink', description: 'Vibrant energetic pop' },
  { id: 'cyber-blue', name: 'Cyber Blue', description: 'Electric future tech' },
  { id: 'luxury', name: 'Luxury Gold', description: 'Premium metallic finish' },
  { id: 'retro', name: 'Retro Terminal', description: 'Old school green phosphor' },
  { id: 'soft', name: 'Soft Pill', description: 'Rounded, floating comfort' },
  { id: 'outline', name: 'Outline', description: 'Minimalist border only' },
  { id: 'glass-crystal', name: 'Crystal Clear', description: 'Ultra-sharp transparent glass' },
  { id: 'glass-blur', name: 'Deep Blur', description: 'Heavy frosted backdrop' },
  { id: 'glass-obsidian', name: 'Obsidian Glass', description: 'Dark smoked transparency' },
  { id: 'glass-milk', name: 'Milky Glass', description: 'Soft white translucent' },
  { id: 'glass-holographic', name: 'Holographic', description: 'Subtle prism color shift' },
  { id: 'glass-borderless', name: 'Floating Shard', description: 'Borderless floating glass' },
  { id: 'glass-fiber', name: 'Fiber Glass', description: 'Textured industrial glass' },
  { id: 'glass-acrylic', name: 'Acrylic Block', description: 'Thick plastic-like finish' },
  { id: 'glass-mirror', name: 'Liquid Mirror', description: 'High gloss reflective feel' },
  { id: 'glass-glacier', name: 'Glacier Ice', description: 'Cool blue frozen tint' },
];

const HEADER_FIELD_METADATA: Record<string, { label: string; icon?: any; type: 'toggle' | 'color' | 'text' }> = {
  showSearch: { label: 'Search', type: 'toggle' },
  showAccount: { label: 'Account', type: 'toggle' },
  showCart: { label: 'Cart', type: 'toggle' },
  showCTA: { label: 'CTA Button', type: 'toggle' },
  showTagline: { label: 'Tagline', type: 'toggle' },
  showSocial: { label: 'Social Icons', type: 'toggle' },
  showLogoBadge: { label: 'Logo Badge', type: 'toggle' },
  showMenu: { label: 'Menu List', type: 'toggle' },
  showIndicatorDot: { label: 'Active Dot', type: 'toggle' },
  navActiveStyle: { label: 'Active Style', type: 'select' as any },
  sticky: { label: 'Sticky Header', type: 'toggle' },
  backgroundColor: { label: 'Background', type: 'color' },
  borderColor: { label: 'Border', type: 'color' },
  textColor: { label: 'Text', type: 'color' },
  textHoverColor: { label: 'Text Hover', type: 'color' },
  accentColor: { label: 'Accent Color', type: 'color' },
  cartBadgeColor: { label: 'Badge BG', type: 'color' },
  cartBadgeTextColor: { label: 'Badge Text', type: 'color' },
  ctaBackgroundColor: { label: 'Button BG', type: 'color' },
  ctaHoverColor: { label: 'Button Hover', type: 'color' },
  ctaTextColor: { label: 'Button Text', type: 'color' },
  taglineColor: { label: 'Tagline Text', type: 'color' },
  utilityBarBackgroundColor: { label: 'Utility Bar BG', type: 'color' },
  utilityBarTextColor: { label: 'Utility Bar Text', type: 'color' },
  tickerBackgroundColor: { label: 'Ticker BG', type: 'color' },
  tickerTextColor: { label: 'Ticker Text', type: 'color' },
  tickerBorderColor: { label: 'Ticker Border', type: 'color' },
  terminalPromptColor: { label: 'Prompt Color', type: 'color' },
  scanlineColor: { label: 'Scanline Color', type: 'color' },
  showKeyboardShortcut: { label: 'Search Shortcut', type: 'toggle' },
  ctaText: { label: 'CTA Text', type: 'text' },
  taglineText: { label: 'Tagline Text', type: 'text' },
  tickerText: { label: 'Ticker Text', type: 'text' },
  searchPlaceholder: { label: 'Search Prompt', type: 'text' },
  maxWidth: { label: 'Max Width', type: 'text' },
  paddingX: { label: 'Horiz. Padding', type: 'text' },
  paddingY: { label: 'Vert. Padding', type: 'text' },
  blurIntensity: { label: 'Blur Strength', type: 'text' },
  particleCount: { label: 'Particle Count', type: 'text' },
  particleColor: { label: 'Particle Color', type: 'color' },
  accentColorSecondary: { label: 'Secondary Accent', type: 'color' },
};
import {
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  Palette,
  Megaphone,
  Settings,
  TrendingUp,
  Users,
  User,
  DollarSign,
  Zap,
  ShoppingBag,
  Truck,
  Plus,
  Loader2,
  Sparkles,
  CheckCircle2,
  Mail,
  Send,
  MoreHorizontal,
  Eye,
  EyeOff,
  X,
  LayoutTemplate,
  ChevronDown,
  ArrowDownAZ,
  Calendar,
  Flame,
  Smartphone,
  Monitor,
  Type,
  Image as ImageIcon,
  Upload,
  Link,
  Grid,
  FileText,
  Home,
  Trash2,
  Copy,
  Columns,
  Quote,
  Heading,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Wand2,
  Layers,
  MoveUp,
  MoveDown,
  Edit3,
  Maximize2,
  Sliders,
  Aperture,
  Film,
  RefreshCw,
  BoxSelect,
  PanelBottom,
  PanelTop,
  MousePointerClick,
  Check,
  Pencil,
  AlertTriangle,
  Repeat,
  FolderOpen,
  CreditCard,
  MapPin,
  Globe,
  Scale,
  Clock,
  ChevronRight,
  ChevronLeft,
  Tag,
  Share2,
  List,
  Save,
  Video,
  Layout,
  ExternalLink,
  Search,
  Undo2,
  Redo2,
  Rocket,
  HelpCircle,
  BookOpen,
  Info,
  Phone,
  MessageSquare,
  Star,
  GripVertical,
  Lightbulb,
  Database,
  Filter,
  Columns as ColumnsIcon,
  Circle,
  Lock,
  Unlock,
  Instagram,
  Twitter,
  Play
} from 'lucide-react';

// Page type options for creating new pages
const PAGE_TYPE_OPTIONS = [
  { id: 'shop', name: 'Shop', description: 'Display your products', icon: ShoppingBag, slug: '/shop' },
  { id: 'about', name: 'About Us', description: 'Tell your story', icon: Users, slug: '/about' },
  { id: 'contact', name: 'Contact', description: 'Let customers reach you', icon: Phone, slug: '/contact' },
  { id: 'faq', name: 'FAQ', description: 'Answer common questions', icon: HelpCircle, slug: '/faq' },
  { id: 'blog', name: 'Blog', description: 'Share news and updates', icon: BookOpen, slug: '/blog' },
  { id: 'custom', name: 'Custom Page', description: 'Start with a blank canvas', icon: FileText, slug: '/new-page' },
];

// Section Preview Thumbnail Component
const SectionPreview: React.FC<{ category: string; variantId: string }> = ({ category, variantId }) => {
  const renderPreview = () => {
    // Hero previews
    if (category === 'hero') {
      switch (variantId) {
        case 'impact':
          return (
            <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
              <rect fill="#1a1a1a" width="120" height="80"/>
              <rect fill="#3b82f6" x="10" y="25" width="100" height="4" rx="2"/>
              <rect fill="#6b7280" x="25" y="35" width="70" height="2" rx="1"/>
              <rect fill="#8b5cf6" x="40" y="50" width="40" height="8" rx="4"/>
            </svg>
          );
        case 'split':
          return (
            <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
              <rect fill="#1a1a1a" width="120" height="80"/>
              <rect fill="#374151" x="5" y="10" width="50" height="60" rx="4"/>
              <rect fill="#3b82f6" x="65" y="20" width="45" height="3" rx="1.5"/>
              <rect fill="#6b7280" x="65" y="28" width="40" height="2" rx="1"/>
              <rect fill="#8b5cf6" x="65" y="45" width="25" height="6" rx="3"/>
            </svg>
          );
        case 'kinetik':
          return (
            <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
              <rect fill="#1a1a1a" width="120" height="80"/>
              <rect fill="#374151" x="5" y="10" width="110" height="35" rx="4"/>
              <rect fill="#f59e0b" x="10" y="55" width="100" height="5" rx="2.5"/>
              <rect fill="#f59e0b" x="10" y="65" width="100" height="5" rx="2.5" opacity="0.5"/>
            </svg>
          );
        case 'grid':
          return (
            <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
              <rect fill="#1a1a1a" width="120" height="80"/>
              <rect fill="#374151" x="5" y="5" width="35" height="30" rx="3"/>
              <rect fill="#374151" x="43" y="5" width="35" height="30" rx="3"/>
              <rect fill="#374151" x="81" y="5" width="35" height="30" rx="3"/>
              <rect fill="#3b82f6" x="20" y="45" width="80" height="3" rx="1.5"/>
              <rect fill="#6b7280" x="30" y="53" width="60" height="2" rx="1"/>
            </svg>
          );
        case 'typographic':
          return (
            <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
              <rect fill="#1a1a1a" width="120" height="80"/>
              <rect fill="#3b82f6" x="15" y="20" width="90" height="6" rx="3"/>
              <rect fill="#3b82f6" x="15" y="32" width="90" height="6" rx="3"/>
              <rect fill="#6b7280" x="30" y="50" width="60" height="2" rx="1"/>
              <rect fill="#6b7280" x="35" y="58" width="50" height="2" rx="1"/>
            </svg>
          );
      }
    }
    
    // Product Grid previews
    if (category === 'grid') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#374151" x="8" y="10" width="24" height="30" rx="2"/>
          <rect fill="#374151" x="36" y="10" width="24" height="30" rx="2"/>
          <rect fill="#374151" x="64" y="10" width="24" height="30" rx="2"/>
          <rect fill="#374151" x="92" y="10" width="24" height="30" rx="2"/>
          <rect fill="#6b7280" x="10" y="45" width="20" height="2" rx="1"/>
          <rect fill="#6b7280" x="38" y="45" width="20" height="2" rx="1"/>
          <rect fill="#6b7280" x="66" y="45" width="20" height="2" rx="1"/>
          <rect fill="#6b7280" x="94" y="45" width="20" height="2" rx="1"/>
        </svg>
      );
    }

    // Collection previews
    if (category === 'collection') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#10b981" x="20" y="10" width="80" height="3" rx="1.5"/>
          <rect fill="#374151" x="10" y="20" width="30" height="35" rx="3"/>
          <rect fill="#374151" x="45" y="20" width="30" height="35" rx="3"/>
          <rect fill="#374151" x="80" y="20" width="30" height="35" rx="3"/>
          <rect fill="#6b7280" x="12" y="60" width="26" height="2" rx="1"/>
          <rect fill="#6b7280" x="47" y="60" width="26" height="2" rx="1"/>
          <rect fill="#6b7280" x="82" y="60" width="26" height="2" rx="1"/>
        </svg>
      );
    }

    // Layout previews
    if (category === 'layout') {
      if (variantId.includes('column')) {
        return (
          <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
            <rect fill="#1a1a1a" width="120" height="80"/>
            <rect fill="#374151" x="10" y="15" width="45" height="50" rx="3"/>
            <rect fill="#374151" x="65" y="15" width="45" height="50" rx="3"/>
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#06b6d4" x="10" y="10" width="100" height="15" rx="2"/>
          <rect fill="#374151" x="10" y="30" width="100" height="40" rx="2"/>
        </svg>
      );
    }

    // Scroll previews
    if (category === 'scroll') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#f97316" x="0" y="30" width="120" height="20" rx="0"/>
          <text x="15" y="43" fill="#ffffff" fontSize="8" fontWeight="bold">SCROLLING TEXT →</text>
          <rect fill="#f97316" x="0" y="30" width="120" height="2" opacity="0.5"/>
          <rect fill="#f97316" x="0" y="48" width="120" height="2" opacity="0.5"/>
        </svg>
      );
    }

    // Social previews
    if (category === 'social') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#ec4899" x="10" y="15" width="22" height="22" rx="2"/>
          <rect fill="#ec4899" x="36" y="15" width="22" height="22" rx="2"/>
          <rect fill="#ec4899" x="62" y="15" width="22" height="22" rx="2"/>
          <rect fill="#ec4899" x="88" y="15" width="22" height="22" rx="2"/>
          <rect fill="#ec4899" x="10" y="43" width="22" height="22" rx="2"/>
          <rect fill="#ec4899" x="36" y="43" width="22" height="22" rx="2"/>
          <rect fill="#ec4899" x="62" y="43" width="22" height="22" rx="2"/>
          <rect fill="#ec4899" x="88" y="43" width="22" height="22" rx="2"/>
        </svg>
      );
    }

    // Blog previews
    if (category === 'blog') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#374151" x="10" y="10" width="30" height="20" rx="2"/>
          <rect fill="#f43f5e" x="45" y="12" width="60" height="3" rx="1.5"/>
          <rect fill="#6b7280" x="45" y="18" width="55" height="2" rx="1"/>
          <rect fill="#6b7280" x="45" y="23" width="50" height="2" rx="1"/>
          <rect fill="#374151" x="10" y="40" width="30" height="20" rx="2"/>
          <rect fill="#f43f5e" x="45" y="42" width="60" height="3" rx="1.5"/>
          <rect fill="#6b7280" x="45" y="48" width="55" height="2" rx="1"/>
        </svg>
      );
    }

    // Video previews
    if (category === 'video') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#374151" x="15" y="15" width="90" height="50" rx="4"/>
          <circle fill="#ef4444" cx="60" cy="40" r="12"/>
          <polygon fill="#1a1a1a" points="56,33 56,47 68,40" />
        </svg>
      );
    }

    // Media gallery previews
    if (category === 'media') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#6366f1" x="10" y="10" width="22" height="22" rx="2"/>
          <rect fill="#6366f1" x="36" y="10" width="22" height="22" rx="2"/>
          <rect fill="#6366f1" x="62" y="10" width="22" height="22" rx="2"/>
          <rect fill="#6366f1" x="88" y="10" width="22" height="22" rx="2"/>
          <rect fill="#6366f1" x="10" y="36" width="22" height="22" rx="2"/>
          <rect fill="#6366f1" x="36" y="36" width="22" height="22" rx="2"/>
          <rect fill="#6366f1" x="62" y="36" width="22" height="22" rx="2"/>
          <rect fill="#6366f1" x="88" y="36" width="22" height="22" rx="2"/>
        </svg>
      );
    }

    // Contact previews
    if (category === 'contact') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#14b8a6" x="30" y="15" width="60" height="3" rx="1.5"/>
          <rect fill="#374151" x="30" y="25" width="60" height="6" rx="3"/>
          <rect fill="#374151" x="30" y="35" width="60" height="6" rx="3"/>
          <rect fill="#374151" x="30" y="45" width="60" height="15" rx="3"/>
          <rect fill="#14b8a6" x="45" y="65" width="30" height="7" rx="3.5"/>
        </svg>
      );
    }

    // Rich content previews
    if (category === 'content') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#3b82f6" x="20" y="15" width="80" height="4" rx="2"/>
          <rect fill="#6b7280" x="25" y="25" width="70" height="2" rx="1"/>
          <rect fill="#6b7280" x="25" y="30" width="70" height="2" rx="1"/>
          <rect fill="#6b7280" x="25" y="35" width="60" height="2" rx="1"/>
          <rect fill="#6b7280" x="25" y="45" width="70" height="2" rx="1"/>
          <rect fill="#6b7280" x="25" y="50" width="70" height="2" rx="1"/>
          <rect fill="#6b7280" x="25" y="55" width="50" height="2" rx="1"/>
        </svg>
      );
    }

    // Marketing previews
    if (category === 'marketing') {
      return (
        <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
          <rect fill="#1a1a1a" width="120" height="80"/>
          <rect fill="#eab308" x="20" y="20" width="80" height="4" rx="2"/>
          <rect fill="#6b7280" x="30" y="30" width="60" height="2" rx="1"/>
          <rect fill="#374151" x="25" y="42" width="50" height="8" rx="4"/>
          <rect fill="#eab308" x="80" y="42" width="15" height="8" rx="4"/>
        </svg>
      );
    }

    // Default preview
    return (
      <svg viewBox="0 0 120 80" className="w-full h-20 rounded-t-lg">
        <rect fill="#1a1a1a" width="120" height="80"/>
        <rect fill="#6b7280" x="30" y="25" width="60" height="3" rx="1.5"/>
        <rect fill="#6b7280" x="35" y="35" width="50" height="2" rx="1"/>
        <rect fill="#6b7280" x="35" y="42" width="50" height="2" rx="1"/>
      </svg>
    );
  };

  return (
    <div className="mb-2 bg-neutral-950 rounded-t-lg overflow-hidden border border-neutral-800/50">
      {renderPreview()}
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({
  activeTab,
  onTabChange,
  config,
  onConfigChange,
  products,
  onAddProduct,
  onDeleteProduct,
  pages,
  activePageId,
  onAddPage,
  onUpdatePage,
  onSetActivePage,
  onDeletePage,
  mediaAssets,
  onAddAsset,
  onDeleteAsset,
  campaigns,
  onAddCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onLogout,
  userRole,
  storeId,
  onSwitchStore,
  categories = [],
  collections = []
}) => {

  // Helper to update config partially
  const onUpdateConfig = (updates: Partial<StoreConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  // Platform Admin State
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mockActiveNav, setMockActiveNav] = useState('/shop');
  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);

  // Product Search/Filter State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Local State for Draft Mode
  const [localPages, setLocalPages] = useState<Page[]>(pages);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Current Active Page Data
  const activePage = localPages.find(p => p.id === activePageId) || localPages[0];

  // Sync from props only when not editing
  useEffect(() => {
      if (!hasUnsavedChanges && !isSaving) {
          setLocalPages(pages);
      }
  }, [pages, hasUnsavedChanges, isSaving]);
  
  // Settings State
  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'payments' | 'shipping' | 'taxes' | 'policies' | 'notifications' | 'domains'>('general');
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editingTaxRegionId, setEditingTaxRegionId] = useState<string | null>(null);

  const handleCreateTenant = async () => {
    if (!newTenantName || !newTenantSlug) return;
    setIsCreatingTenant(true);
    try {
      // 1. Create Store
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .insert({ name: newTenantName, slug: newTenantSlug })
        .select()
        .single();

      if (storeError) throw storeError;

      // 2. Create Store Config
      const { error: configError } = await supabase
        .from('store_config')
        .insert({ 
            store_id: store.id, 
            name: newTenantName,
            currency: 'CAD',
            header_style: 'minimal',
            footer_style: 'minimal',
            hero_style: 'split',
            product_card_style: 'minimal',
            tax_regions: [
              { id: 'ca-gst', country_code: 'CA', region_code: '*', rate: 5, name: 'GST' },
              { id: 'ca-on-hst', country_code: 'CA', region_code: 'ON', rate: 8, name: 'HST (Provincial)' }
            ]
        });

      if (configError) throw configError;

      // 3. Create Subscription
      const { error: subError } = await supabase
        .from('subscriptions')
        .insert({ 
            store_id: store.id, 
            plan_id: 'free',
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        });
      
      if (subError) throw subError;

      // 4. Refresh List
      await fetchTenants();
      setIsCreateTenantOpen(false);
      setNewTenantName('');
      setNewTenantSlug('');

    } catch (error: any) {
      console.error('Error creating tenant:', error);
      alert('Failed to create tenant: ' + error.message);
    } finally {
      setIsCreatingTenant(false);
    }
  };



  useEffect(() => {
    if (activeTab === AdminTab.PLATFORM && userRole === 'superuser') {
      fetchTenants();
    }
  }, [activeTab, userRole]);

  // Collapse sidebar when entering Design tab, expand when leaving
  useEffect(() => {
    if (activeTab === AdminTab.DESIGN) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [activeTab]);

  const fetchTenants = async () => {
    setIsLoadingTenants(true);
    try {
      // Fetch Profiles (Tenants)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;

      // Fetch Subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from('subscriptions')
        .select('*');

      // Merge Data
      const mergedTenants = profiles?.map(profile => {
        const sub = subscriptions?.find(s => s.store_id === profile.store_id);
        return {
          ...profile,
          subscription_tier: sub?.plan_id || 'Free',
          subscription_status: sub?.status || 'Active' // Default to active if no sub record found (legacy)
        };
      }) || [];
      
      setTenants(mergedTenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setIsLoadingTenants(false);
    }
  };

  // Product Editor State
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; x?: number; y?: number } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' = 'success', position?: { x: number; y: number }) => {
    setToast({ message, type, ...position });
    setTimeout(() => setToast(null), 3000);
  };
  
  // Undo/Redo History for Design Studio
  const [history, setHistory] = useState<{ blocks: PageBlock[], config: StoreConfig }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isUndoRedo, setIsUndoRedo] = useState(false);
  
  // Save state to history when blocks or config change (but not during undo/redo)
  useEffect(() => {
    if (isUndoRedo) {
      setIsUndoRedo(false);
      return;
    }
    const activePageToTrack = localPages.find(p => p.id === activePageId) || localPages[0];
    if (activePageToTrack && activeTab === AdminTab.DESIGN) {
      const currentState = { blocks: activePageToTrack.blocks || [], config };
      // Only add to history if something actually changed
      if (history.length === 0 || JSON.stringify(currentState) !== JSON.stringify(history[historyIndex])) {
        // Remove any future states if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentState);
        // Keep history limited to 50 states
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
  }, [localPages, config, activeTab, activePageId]);
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
  const handleUndo = () => {
    if (!canUndo) return;
    setIsUndoRedo(true);
    const previousState = history[historyIndex - 1];
    setHistoryIndex(historyIndex - 1);
    // Restore blocks in local state
    setLocalPages(prev => prev.map(p => p.id === activePage.id ? { ...p, blocks: previousState.blocks } : p));
    // Restore config
    onConfigChange(previousState.config);
    setHasUnsavedChanges(true);
    showToast('Undo successful', 'success');
  };
  
  const handleRedo = () => {
    if (!canRedo) return;
    setIsUndoRedo(true);
    const nextState = history[historyIndex + 1];
    setHistoryIndex(historyIndex + 1);
    // Restore blocks in local state
    setLocalPages(prev => prev.map(p => p.id === activePage.id ? { ...p, blocks: nextState.blocks } : p));
    // Restore config
    onConfigChange(nextState.config);
    setHasUnsavedChanges(true);
    showToast('Redo successful', 'success');
  };
  
  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== AdminTab.DESIGN) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveChanges();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, canUndo, canRedo, historyIndex, history]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductEditorOpen(true);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsProductEditorOpen(true);
  };

  // Payment Settings State
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [paypalSecretKey, setPaypalSecretKey] = useState('');
  const [squareAccessToken, setSquareAccessToken] = useState('');
  const [isSavingSecrets, setIsSavingSecrets] = useState(false);

  // Shipping Settings State
  const [shippoApiKey, setShippoApiKey] = useState('');
  const [easypostApiKey, setEasypostApiKey] = useState('');
  const [isSavingShippingSecrets, setIsSavingShippingSecrets] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);

  const handleTestConnection = async (provider: string) => {
    setIsTestingConnection(provider);
    // Simulate API check - in production this would call a backend function
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTestingConnection(null);
    alert(`Successfully connected to ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`);
  };

  const handleSaveSecrets = async () => {
    if (!storeId) return;
    setIsSavingSecrets(true);
    try {
      const { error } = await supabase
        .from('store_secrets')
        .upsert({ 
          store_id: storeId,
          stripe_secret_key: stripeSecretKey || null,
          paypal_client_secret: paypalSecretKey || null,
          square_access_token: squareAccessToken || null
        });

      if (error) throw error;
      alert('Payment secrets saved successfully');
      setStripeSecretKey(''); // Clear for security
      setPaypalSecretKey('');
      setSquareAccessToken('');
    } catch (error: any) {
      console.error('Error saving secrets:', error);
      alert('Failed to save secrets: ' + error.message);
    } finally {
      setIsSavingSecrets(false);
    }
  };

  const handleSaveShippingSecrets = async () => {
    if (!storeId) return;
    setIsSavingShippingSecrets(true);
    try {
      const { error } = await supabase
        .from('store_secrets')
        .upsert({ 
          store_id: storeId,
          shippo_api_key: shippoApiKey || null,
          easypost_api_key: easypostApiKey || null
        });

      if (error) throw error;
      alert('Shipping secrets saved successfully');
      setShippoApiKey(''); // Clear for security
      setEasypostApiKey('');
    } catch (error: any) {
      console.error('Error saving shipping secrets:', error);
      alert('Failed to save shipping secrets: ' + error.message);
    } finally {
      setIsSavingShippingSecrets(false);
    }
  };

  const generatePolicy = (type: 'refund' | 'privacy' | 'terms') => {
    const storeName = config.name || 'Our Store';
    const email = config.supportEmail || 'support@example.com';
    let content = '';

    if (type === 'refund') {
      content = `Refund Policy for ${storeName}\n\nWe have a 30-day return policy, which means you have 30 days after receiving your item to request a return.\n\nTo be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.\n\nTo start a return, you can contact us at ${email}.`;
      onConfigChange({ ...config, policyRefund: content });
    } else if (type === 'privacy') {
      content = `Privacy Policy for ${storeName}\n\nAt ${storeName}, we value your privacy. This policy describes how we collect, use, and share your personal information.\n\nWe collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.\n\nContact us at ${email} for any privacy-related questions.`;
      onConfigChange({ ...config, policyPrivacy: content });
    } else if (type === 'terms') {
      content = `Terms of Service for ${storeName}\n\nOverview\nThis website is operated by ${storeName}. Throughout the site, the terms "we", "us" and "our" refer to ${storeName}.\n\nBy visiting our site and/ or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.`;
      onConfigChange({ ...config, policyTerms: content });
    }
  };

  const handleQuickAddTax = (type: 'US' | 'EU' | 'CA') => {
    if (type === 'CA') {
        const newRegions = [
            { id: Math.random().toString(36).substr(2, 9), country_code: 'CA', region_code: '*', rate: 5, name: 'GST' },
            { id: Math.random().toString(36).substr(2, 9), country_code: 'CA', region_code: 'ON', rate: 8, name: 'HST (Provincial)' },
            { id: Math.random().toString(36).substr(2, 9), country_code: 'CA', region_code: 'BC', rate: 7, name: 'PST' },
            { id: Math.random().toString(36).substr(2, 9), country_code: 'CA', region_code: 'QC', rate: 9.975, name: 'QST' }
        ];
        onConfigChange({ ...config, taxRegions: [...(config.taxRegions || []), ...newRegions] });
        setEditingTaxRegionId(newRegions[0].id);
        return;
    }

    const newRegion = type === 'US' 
      ? { id: Math.random().toString(36).substr(2, 9), country_code: 'US', region_code: '*', rate: 0, name: 'Sales Tax' }
      : { id: Math.random().toString(36).substr(2, 9), country_code: 'EU', region_code: '*', rate: 20, name: 'VAT' };
    
    onConfigChange({ ...config, taxRegions: [...(config.taxRegions || []), newRegion] });
    setEditingTaxRegionId(newRegion.id);
  };

  // Campaign State
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  // Design Studio State
  const [designSections, setDesignSections] = useState({
    pages: true,
    pageSections: true,
    intelligence: false
  });

  const [isRewriting, setIsRewriting] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showPageProperties, setShowPageProperties] = useState(false);

  // MODAL STATES
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [systemModalType, setSystemModalType] = useState<'hero' | 'grid' | 'footer' | null>(null);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  
  // Additional Section Modals
  const [isScrollModalOpen, setIsScrollModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [isRichTextModalOpen, setIsRichTextModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCollapsibleModalOpen, setIsCollapsibleModalOpen] = useState(false);
  const [isLogoListModalOpen, setIsLogoListModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
  
  // Auto-focus field in Hero Studio when activeField changes
  useEffect(() => {
    if (isHeroModalOpen && activeField) {
      setTimeout(() => {
        const element = document.getElementById(`editor-field-${activeField}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
          // Add highlight
          element.classList.add('ring-2', 'ring-purple-500', 'ring-offset-2', 'ring-offset-neutral-950');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-purple-500', 'ring-offset-2', 'ring-offset-neutral-950');
          }, 2000);
        }
      }, 150);
    }
  }, [isHeroModalOpen, activeField]);
  const [isInterfaceModalOpen, setIsInterfaceModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'identity' | 'typography' | 'colors' | 'seo' | 'header' | 'scrollbar'>('identity');
  const [previewingScrollbar, setPreviewingScrollbar] = useState<string | null>(null);

  // ADD SECTION STATES
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [addSectionStep, setAddSectionStep] = useState<'categories' | 'options'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<'hero' | 'grid' | 'content' | 'scroll' | null>(null);
  const [previewBlock, setPreviewBlock] = useState<PageBlock | null>(null);

  // BLOCK ARCHITECT STATE (Visual Editor for Content)
  const [isArchitectOpen, setIsArchitectOpen] = useState(false);
  const [architectConfig, setArchitectConfig] = useState({
    layout: 'hero', // hero, split, card, cover
    heading: 'New Section',
    body: 'Write something amazing here. The layout will adapt automatically.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    bgMode: 'clean', // clean, dark, gradient, noise
    alignment: 'center', // left, center, right
    glass: false,
    height: 'medium', // small, medium, large, full
    animation: 'none', // none, fade, zoom, slide
    padding: 'medium'
  });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Logo Upload State
  const [logoMode, setLogoMode] = useState<'text' | 'image'>(config.logoUrl ? 'image' : 'text');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // SEO Generation State
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);

  // Live Preview State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [previewOrientation, setPreviewOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [previewDevicePreset, setPreviewDevicePreset] = useState<string>('default');

  // Sorting State (Local to modals now)
  const [modalSort, setModalSort] = useState<'az' | 'new' | 'hot'>('az');

  // Editor Resize State
  const [editorWidth, setEditorWidth] = useState(320);
  
  // Design Studio Welcome Wizard State
  const [showWelcomeWizard, setShowWelcomeWizard] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => localStorage.getItem('evolv_seen_welcome') === 'true');
  const [wizardMode, setWizardMode] = useState<'select' | 'ai-questions' | 'ai-generating' | 'templates'>('select');
  const [aiWizardStep, setAiWizardStep] = useState(0);
  const [aiWizardAnswers, setAiWizardAnswers] = useState<Record<string, string>>({});
  
  // AI Section Recommendations State
  const [showSectionRecommendations, setShowSectionRecommendations] = useState(false);
  const [recommendedSections, setRecommendedSections] = useState<string[]>([]);
  
  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(() => localStorage.getItem('evolv_seen_tutorial') === 'true');
  
  // First-Edit Hint State - Shows helpful tip on first section click
  const [hasSeenFirstEditHint, setHasSeenFirstEditHint] = useState(() => localStorage.getItem('evolv_seen_first_edit') === 'true');
  const [showFirstEditHint, setShowFirstEditHint] = useState(false);
  
  // Pre-Publish Checklist State
  const [showPublishChecklist, setShowPublishChecklist] = useState(false);
  
  // Brand Settings State  
  const [showBrandSettings, setShowBrandSettings] = useState(false);
  
  // Version History State
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [pageVersions, setPageVersions] = useState<Array<{id: string, created_at: string, blocks: PageBlock[], version_name?: string}>>([]);
  const [isSavingVersion, setIsSavingVersion] = useState(false);

  // Fetch versions for active page
  const fetchPageVersions = async () => {
    if (!activePageId) return;
    try {
      const { data, error } = await supabase
        .from('page_versions')
        .select('*')
        .eq('page_id', activePageId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPageVersions(data || []);
    } catch (err) {
      console.error('Error fetching page versions:', err);
    }
  };

  // Save current state as a new version
  const savePageVersion = async (name?: string) => {
    const activePage = localPages.find(p => p.id === activePageId);
    if (!activePage || !storeId) return;

    setIsSavingVersion(true);
    try {
      const { error } = await supabase
        .from('page_versions')
        .insert({
          page_id: activePageId,
          store_id: storeId,
          blocks: activePage.blocks,
          version_name: name || `Version ${new Date().toLocaleString()}`
        });

      if (error) throw error;
      showToast('Version saved successfully', 'success');
      fetchPageVersions();
    } catch (err) {
      console.error('Error saving version:', err);
      showToast('Failed to save version', 'error');
    } finally {
      setIsSavingVersion(false);
    }
  };

  // Restore a version
  const restoreVersion = (version: any) => {
    onUpdatePage(activePageId, { blocks: version.blocks });
    setLocalPages(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: version.blocks } : p));
    setHasUnsavedChanges(true);
    showToast('Version restored (unsaved)', 'success');
    setShowVersionHistory(false);
  };

  useEffect(() => {
    if (showVersionHistory) {
      fetchPageVersions();
    }
  }, [showVersionHistory, activePageId]);
  
  // Navigation Builder State (used in Pages & Navigation panel)
  const [showNavBuilder, setShowNavBuilder] = useState(false);
  const [pageDraggedItem, setPageDraggedItem] = useState<string | null>(null);
  const [pageDragOverItem, setPageDragOverItem] = useState<string | null>(null);
  const [editingPageItem, setEditingPageItem] = useState<string | null>(null);
  const [editPageTitle, setEditPageTitle] = useState('');
  const [editPageSlug, setEditPageSlug] = useState('');
  const [pageLinkDropdownOpen, setPageLinkDropdownOpen] = useState<string | null>(null);
  
  // Add New Page Modal State
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [newPageType, setNewPageType] = useState<string>('custom');
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  
  // Show welcome wizard when entering Design Studio for first time
  useEffect(() => {
    if (activeTab === AdminTab.DESIGN && !hasSeenWelcome) {
      setShowWelcomeWizard(true);
    }
  }, [activeTab, hasSeenWelcome]);;
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Resize relative to the left sidebar (256px / 16rem)
      const sidebarWidth = isSidebarCollapsed ? 80 : 256;
      const newWidth = Math.max(260, Math.min(800, e.clientX - sidebarWidth));
      setEditorWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const activeBlock = activePage.blocks?.find(b => b.id === selectedBlockId);

  // --- ARCHITECT GENERATOR ---
  const constructBlockHTML = (cfg: typeof architectConfig) => {
    // ... existing code ...
    const heightClasses: any = { small: 'py-12', medium: 'py-24', large: 'min-h-[600px]', full: 'min-h-screen' };
    const alignClasses: any = { left: 'text-left items-start', center: 'text-center items-center', right: 'text-right items-end' };

    let bgClass = 'bg-white text-neutral-900';
    if (cfg.bgMode === 'dark') bgClass = 'bg-neutral-950 text-white';
    if (cfg.bgMode === 'gradient') bgClass = 'bg-gradient-to-br from-blue-900 via-neutral-900 to-black text-white';
    if (cfg.bgMode === 'noise') bgClass = 'bg-neutral-100 text-neutral-900 bg-[url("https://grainy-gradients.vercel.app/noise.svg")]';

    const glassClass = cfg.glass ? 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl' : '';
    const animClass = cfg.animation === 'fade' ? 'animate-in fade-in duration-1000' :
      cfg.animation === 'zoom' ? 'animate-in zoom-in-95 duration-1000' :
        cfg.animation === 'slide' ? 'animate-in slide-in-from-bottom-8 duration-1000' : '';

    if (cfg.layout === 'hero') {
      return `
          <div class="relative w-full ${heightClasses[cfg.height]} flex flex-col justify-center overflow-hidden">
             <div class="absolute inset-0">
                <img src="${cfg.image}" class="w-full h-full object-cover ${cfg.bgMode === 'dark' ? 'opacity-40' : 'opacity-90'}" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             </div>
             <div class="relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col ${alignClasses[cfg.alignment]} ${animClass}">
                <div class="${cfg.glass ? 'p-8 rounded-3xl ' + glassClass : ''}">
                   <h2 class="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">${cfg.heading}</h2>
                   <p class="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed">${cfg.body}</p>
                </div>
             </div>
          </div>
        `;
    }
    if (cfg.layout === 'split') {
      const order = cfg.alignment === 'right' ? 'order-first' : 'order-last';
      return `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-0 w-full ${bgClass} overflow-hidden">
             <div class="relative h-[400px] md:h-auto ${order}">
                <img src="${cfg.image}" class="absolute inset-0 w-full h-full object-cover" />
             </div>
             <div class="p-12 md:p-24 flex flex-col justify-center ${animClass}">
                <h2 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight">${cfg.heading}</h2>
                <p class="text-lg opacity-70 leading-relaxed">${cfg.body}</p>
             </div>
          </div>
        `;
    }
    if (cfg.layout === 'card') {
      return `
          <div class="w-full ${bgClass} ${heightClasses[cfg.height]} flex items-center justify-center px-6">
             <div class="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div class="rounded-3xl overflow-hidden shadow-2xl ${animClass}">
                   <img src="${cfg.image}" class="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <div class="flex flex-col ${alignClasses[cfg.alignment]}">
                   <h2 class="text-3xl md:text-5xl font-bold mb-6 tracking-tight">${cfg.heading}</h2>
                   <p class="text-lg opacity-70 leading-relaxed mb-8">${cfg.body}</p>
                   <button class="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">Explore</button>
                </div>
             </div>
          </div>
        `;
    }
    return `
        <div class="w-full ${heightClasses[cfg.height]} ${bgClass} flex flex-col ${alignClasses[cfg.alignment]} justify-center px-6 md:px-24 ${animClass}">
           <h2 class="text-5xl md:text-8xl font-black tracking-tighter mb-4">${cfg.heading}</h2>
           <p class="text-xl md:text-2xl opacity-60 max-w-3xl">${cfg.body}</p>
        </div>
     `;
  };

  const handleOpenArchitect = (blockId: string) => {
    setSelectedBlockId(blockId);
    setIsArchitectOpen(true);
  };

  // Live Update Effect for Architect
  useEffect(() => {
    if (isArchitectOpen && selectedBlockId) {
      const html = constructBlockHTML(architectConfig);
      updateActiveBlock(html);
    }
  }, [architectConfig, isArchitectOpen, selectedBlockId]);

  const simulateImageGen = () => {
    setIsGeneratingImage(true);
    setTimeout(() => {
      const images = [
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=1000&auto=format&fit=crop'
      ];
      setArchitectConfig(prev => ({ ...prev, image: images[Math.floor(Math.random() * images.length)] }));
      setIsGeneratingImage(false);
    }, 2000);
  };

  // -------------------------

  // Open the Add Page modal
  const handleAddNewPage = () => {
    setNewPageType('custom');
    setNewPageName('');
    setNewPageSlug('');
    setIsAddPageModalOpen(true);
  };
  
  // Create the page with user input
  const handleCreatePage = () => {
    const pageTypeOption = PAGE_TYPE_OPTIONS.find(p => p.id === newPageType);
    const pageName = newPageName.trim() || pageTypeOption?.name || 'New Page';
    const pageSlug = newPageSlug.trim() || pageTypeOption?.slug || '/new-page';
    
    // Generate appropriate default blocks based on page type
    let defaultBlocks: PageBlock[] = [];
    
    if (newPageType === 'shop') {
      defaultBlocks = [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'system-grid',
        name: 'Product Grid',
        content: '',
        variant: 'grid',
        data: { columns: 4, showFilters: true }
      }];
    } else if (newPageType === 'contact') {
      defaultBlocks = [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'section',
        name: 'Contact Form',
        content: '<h2>Get in Touch</h2><p>We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.</p>'
      }];
    } else if (newPageType === 'about') {
      defaultBlocks = [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'section',
        name: 'About Us',
        content: '<h2>Our Story</h2><p>Tell your customers about your brand, mission, and what makes you unique.</p>'
      }];
    } else if (newPageType === 'faq') {
      defaultBlocks = [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'section',
        name: 'FAQ',
        content: '<h2>Frequently Asked Questions</h2><p>Add common questions and answers here to help your customers.</p>'
      }];
    } else {
      defaultBlocks = [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'section',
        name: 'Content',
        content: '<p>Start building your page here...</p>'
      }];
    }
    
    const newPage: Page = {
      id: Math.random().toString(36).substr(2, 9),
      title: pageName,
      slug: pageSlug.startsWith('/') ? pageSlug : `/${pageSlug}`,
      type: 'custom',
      content: '',
      blocks: defaultBlocks
    };
    
    onAddPage(newPage);
    setIsAddPageModalOpen(false);
    showToast(`${pageName} page created!`, 'success');
  };

  // --- BLOCK MANAGEMENT FUNCTIONS ---

  const addBlock = (blockType: PageBlock['type'], name: string, content: string = '', variant?: string) => {
    const newBlock: PageBlock = {
      id: crypto.randomUUID(),
      type: blockType,
      name: name,
      content: content,
      variant: variant,
      data: {}
    };
    
    // Update Local State (Draft Mode)
    setLocalPages(prev => prev.map(p => {
        if (p.id !== activePage.id) return p;
        
        const blocks = p.blocks || [];
        const selectedIndex = blocks.findIndex(b => b.id === selectedBlockId);
        
        let newBlocks;
        if (selectedIndex !== -1) {
          // Insert after selected block
          newBlocks = [...blocks];
          newBlocks.splice(selectedIndex + 1, 0, newBlock);
        } else {
          // Add to end
          newBlocks = [...blocks, newBlock];
        }
        
        return {
            ...p,
            blocks: newBlocks
        };
    }));
    setHasUnsavedChanges(true);
    showToast(`Added ${name} section`, 'success');

    setSelectedBlockId(newBlock.id);
    setIsAddSectionOpen(false);
    
    // Auto-open specialized editor modals
    if (blockType === 'system-hero') setIsHeroModalOpen(true);
    if (blockType === 'system-grid') setIsGridModalOpen(true);
    if (blockType === 'system-collection') setIsCollectionModalOpen(true);

    setPreviewBlock(null);
    setAddSectionStep('categories');
    setSelectedCategory(null);
  };

  const updateActiveBlock = (content: string) => {
    if (!selectedBlockId) return;
    setLocalPages(prev => prev.map(p => {
        if (p.id !== activePage.id) return p;
        return {
            ...p,
            blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, content } : b)
        };
    }));
    setHasUnsavedChanges(true);
  };

  const updateActiveBlockData = (blockId: string, data: any) => {
    if (!blockId) return;
    
    // Basic validation
    if (data.heading && data.heading.length > 200) {
      showToast('Heading is too long', 'error');
      return;
    }

    setLocalPages(prev => prev.map(p => {
      if (p.id !== activePage.id) return p;
      
      const updatedBlocks = p.blocks.map(b => {
        if (b.id !== blockId) return b;
        
        // Handle top-level properties vs data properties
        const { variant, ...restData } = data;
        const newBlock = { ...b };
        
        if (variant) newBlock.variant = variant;
        if (Object.keys(restData).length > 0) {
            // Deep merge for style object to prevent overwriting
            if (restData.style && b.data?.style) {
               newBlock.data = { 
                 ...b.data, 
                 ...restData, 
                 style: { ...b.data.style, ...restData.style } 
               };
            } else {
               newBlock.data = { ...b.data, ...restData };
            }
        }
        return newBlock;
      });
      return { ...p, blocks: updatedBlocks };
    }));
    setHasUnsavedChanges(true);
  }

  const moveBlock = (index: number, direction: -1 | 1) => {
    setLocalPages(prev => prev.map(p => {
      if (p.id !== activePage.id) return p;
      const blocks = [...p.blocks];
      if (index + direction < 0 || index + direction >= blocks.length) return p;
      const temp = blocks[index];
      blocks[index] = blocks[index + direction];
      blocks[index + direction] = temp;
      return { ...p, blocks };
    }));
    setHasUnsavedChanges(true);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      return;
    }

    setLocalPages(prev => prev.map(p => {
      if (p.id !== activePage.id) return p;
      const blocks = [...p.blocks];
      const draggedBlock = blocks[draggedIndex];
      blocks.splice(draggedIndex, 1);
      blocks.splice(index, 0, draggedBlock);
      return { ...p, blocks };
    }));
    
    setHasUnsavedChanges(true);
    setDraggedIndex(null);
    showToast('Section reordered', 'success');
  };

  const toggleBlockVisibility = (blockId: string) => {
    setLocalPages(prev => prev.map(p => {
      if (p.id !== activePage.id) return p;
      return {
        ...p,
        blocks: p.blocks.map(b => b.id === blockId ? { ...b, hidden: !b.hidden } : b)
      };
    }));
    setHasUnsavedChanges(true);
  };

  const toggleBlockLock = (blockId: string) => {
    setLocalPages(prev => prev.map(p => {
      if (p.id !== activePage.id) return p;
      return {
        ...p,
        blocks: p.blocks.map(b => b.id === blockId ? { ...b, locked: !b.locked } : b)
      };
    }));
    setHasUnsavedChanges(true);
  };

  const duplicateBlock = (blockId: string) => {
    setLocalPages(prev => prev.map(p => {
      if (p.id !== activePage.id) return p;
      const block = p.blocks.find(b => b.id === blockId);
      if (!block) return p;
      
      const newBlock = { ...block, id: crypto.randomUUID() };
      const index = p.blocks.findIndex(b => b.id === blockId);
      const newBlocks = [...p.blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      
      setSelectedBlockId(newBlock.id);
      return { ...p, blocks: newBlocks };
    }));
    setHasUnsavedChanges(true);
    showToast('Section duplicated', 'success');
  };

  const deleteBlock = async (id: string, event?: React.MouseEvent) => {
    // Capture position BEFORE confirm dialog
    let toastPosition: { x: number; y: number } | undefined;
    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      toastPosition = {
        x: rect.left + rect.width / 2,
        y: Math.max(80, rect.top) // Ensure at least 80px from top
      };
      console.log('[deleteBlock] Toast position:', toastPosition, 'Button rect:', rect);
    }
    
    if (!window.confirm('Are you sure you want to delete this section? This action can be undone with Ctrl+Z.')) return;
    
    // Find the block to ensure it exists
    const blockToDelete = activePage.blocks.find(b => b.id === id);
    if (!blockToDelete) {
      console.warn('[deleteBlock] Block not found:', id);
      return;
    }
    
    const updatedBlocks = activePage.blocks.filter(b => b.id !== id);
    console.log('[deleteBlock] Deleting block:', { id, blockName: blockToDelete.name, remainingBlocks: updatedBlocks.length });
    
    // Update local state immediately for responsiveness
    setLocalPages(prev => prev.map(p => {
      if (p.id !== activePage.id) return p;
      return { ...p, blocks: updatedBlocks };
    }));
    
    if (selectedBlockId === id) setSelectedBlockId(null);
    
    // Persist to database immediately
    try {
      await onUpdatePage(activePageId, { blocks: updatedBlocks });
      console.log('[deleteBlock] Successfully saved to database');
      showToast('Section deleted', 'success', toastPosition);
    } catch (error) {
      console.error('Failed to delete section:', error);
      showToast('Failed to delete section', 'error', toastPosition);
      // Revert local state on error
      setLocalPages(pages);
    }
  };

  const handleSaveChanges = async () => {
      if (!storeId || !hasUnsavedChanges) return;
      
      setIsSaving(true);
      try {
        // Save all pages that might have changed using the context update function
        for (const page of localPages) {
          const originalPage = pages.find(p => p.id === page.id);
          // Only update if there are actual changes
          if (JSON.stringify(originalPage) !== JSON.stringify(page)) {
            await onUpdatePage(page.id, {
              title: page.title,
              slug: page.slug,
              blocks: page.blocks,
              metadata: page.metadata
            });
          }
        }

        setHasUnsavedChanges(false);
        showToast('All changes saved successfully', 'success');
      } catch (err) {
        console.error('Error saving changes:', err);
        showToast('Failed to save changes', 'error');
      } finally {
        setIsSaving(false);
      }
  };

  // Auto-save functionality - saves 1.5s after changes stop
  useEffect(() => {
    if (!hasUnsavedChanges || isSaving) return;

    const timer = setTimeout(() => {
      handleSaveChanges();
    }, 1500); // Auto-save after 1.5 seconds of inactivity

    return () => clearTimeout(timer);
  }, [localPages, hasUnsavedChanges, isSaving]);

  const handlePublish = async () => {
    await handleSaveChanges();
    showToast('Website published successfully! 🚀', 'success');
  };

  // Track section additions for AI recommendations
  const lastSectionCount = React.useRef(activePage?.blocks?.length || 0);
  React.useEffect(() => {
    const currentCount = activePage?.blocks?.length || 0;
    if (currentCount > lastSectionCount.current && currentCount <= 3 && !localStorage.getItem('evolv_hide_suggestions')) {
      // Show recommendations after adding a section
      setTimeout(() => setShowSectionRecommendations(true), 500);
    }
    lastSectionCount.current = currentCount;
  }, [activePage?.blocks?.length]);

  const handlePreviewBlock = (type: PageBlock['type'], name: string, html: string = '', variant?: string) => {
    setPreviewBlock({
      id: 'preview-temp',
      type: type,
      name: name,
      content: html,
      variant: variant,
      data: {}
    });
  };

  // ----------------------------------

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      onConfigChange({ ...config, logoUrl: publicUrl });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo: ' + error.message);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleBlockImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // not used directly, passed down
  }

  const generateCampaign = () => {
    setIsGeneratingEmail(true);
    setGeneratedEmail('');
    const fullText = `Subject: Flash Sale: The Cyber Shell Jacket is waiting for you.\n\nHey [Customer Name],\n\nWe noticed you've been eyeing the Cyber Shell Jacket. Good news—it's currently one of our most sought-after pieces this season.\n\nFor the next 24 hours, we're unlocking an exclusive 20% off just for our VIP members. \n\nUse Code: EVOLV20\n\nDon't let this slip into the void.\n\n- The Evolv Team`;

    let i = 0;
    const interval = setInterval(() => {
      setGeneratedEmail((prev) => prev + fullText.charAt(i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setIsGeneratingEmail(false);
      }
    }, 30);
  };

  const sortItems = (items: any[], type: 'az' | 'new' | 'hot') => {
    return [...items].sort((a, b) => {
      if (type === 'az') return a.name.localeCompare(b.name);
      if (type === 'new') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (type === 'hot') return b.popularity - a.popularity;
      return 0;
    });
  };

  const renderSortControls = (currentSort: 'az' | 'new' | 'hot', setSort: (s: 'az' | 'new' | 'hot') => void) => (
    <div className="flex justify-end mb-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-1 flex gap-1">
        <button onClick={(e) => { e.stopPropagation(); setSort('az'); }} className={`px-2 py-1 rounded text-[10px] font-bold ${currentSort === 'az' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}><ArrowDownAZ size={12} /></button>
        <button onClick={(e) => { e.stopPropagation(); setSort('new'); }} className={`px-2 py-1 rounded text-[10px] font-bold ${currentSort === 'new' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}><Calendar size={12} /></button>
        <button onClick={(e) => { e.stopPropagation(); setSort('hot'); }} className={`px-2 py-1 rounded text-[10px] font-bold ${currentSort === 'hot' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}><Flame size={12} /></button>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-nexus-black border-r border-nexus-gray flex flex-col h-full text-neutral-400 shrink-0 z-20 transition-all duration-300 ease-in-out`}>
      <div className={`p-6 border-b border-nexus-gray flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
        <div className={`flex items-center gap-2 text-white ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">E</div>
          {!isSidebarCollapsed && <span className="font-display font-bold text-xl tracking-tight">Evolv</span>}
        </div>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="text-neutral-500 hover:text-white transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: AdminTab.DASHBOARD, icon: LayoutDashboard, label: 'Command Center' },
          { id: AdminTab.ORDERS, icon: ShoppingBag, label: 'Orders' },
          { id: AdminTab.PRODUCTS, icon: Package, label: 'Products' },
          { id: AdminTab.COLLECTIONS, icon: Layers, label: 'Collections' },
          { id: AdminTab.DISCOUNTS, icon: Tag, label: 'Discounts' },
          { id: AdminTab.SHIPPING, icon: Truck, label: 'Shipping' },
          { id: AdminTab.PAGES, icon: FileText, label: 'Pages' },
          { id: AdminTab.MEDIA, icon: FolderOpen, label: 'Media Library' },
          { id: AdminTab.DESIGN, icon: Palette, label: 'Design Studio' },
          { id: AdminTab.CAMPAIGNS, icon: Megaphone, label: 'Marketing' },
          { id: AdminTab.SETTINGS, icon: Settings, label: 'Settings' },
          ...(userRole === 'superuser' ? [{ id: AdminTab.PLATFORM, icon: Users, label: 'Platform Admin' }] : [])
        ].map((item) => (
          <button
            key={item.id}
            title={isSidebarCollapsed ? item.label : ''}
            onClick={() => {
              onTabChange(item.id);
              setIsHeaderModalOpen(false);
              setIsSystemModalOpen(false);
              setIsInterfaceModalOpen(false);
              setIsAddSectionOpen(false);
              setIsArchitectOpen(false);
              setIsProductEditorOpen(false);
              setIsHeroModalOpen(false);
              setIsGridModalOpen(false);
              setIsCollectionModalOpen(false);
            }}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg transition-all ${activeTab === item.id
              ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20'
              : 'hover:bg-white/5 hover:text-white'
              }`}
          >
            <item.icon size={18} />
            {!isSidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-nexus-gray space-y-2">
        {/* View Store Button */}
        {config.slug && (
          <a
            href={`/s/${config.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            title={isSidebarCollapsed ? 'View Store' : ''}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-all`}
          >
            <ExternalLink size={18} />
            {!isSidebarCollapsed && <span className="font-medium text-sm">View Store</span>}
          </a>
        )}
        <button
          onClick={onLogout}
          title={isSidebarCollapsed ? 'Sign Out' : ''}
          className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all`}
        >
          <div className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></div>
          {!isSidebarCollapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  // --- HEADER CONFIG MODAL (Disabled - Coming Soon) ---


  // --- FOOTER MODAL (Header-style layout) ---
  const renderFooterModal = () => {
    if (!isFooterModalOpen) return null;

    const FooterComponent = FOOTER_COMPONENTS[config.footerStyle] || FOOTER_COMPONENTS['columns'];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Modal Header */}
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <PanelBottom size={20} className="text-orange-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Footer Studio</h3>
                <p className="text-xs text-neutral-500">Customize your store's footer</p>
              </div>
            </div>
            <button 
              onClick={() => setIsFooterModalOpen(false)} 
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-3xl mx-auto">
              {/* Live Preview - Sticky */}
              <div className="sticky top-0 z-10 bg-neutral-900 pb-4 -mx-6 px-6 pt-2 -mt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide">Live Preview</p>
                  <span className="text-xs text-neutral-500">Changes update instantly</span>
                </div>
                <div className="rounded-xl overflow-hidden border border-neutral-700 bg-neutral-100 shadow-lg">
                  <FooterComponent
                    storeName={config.name || 'Your Store'}
                    primaryColor={config.primaryColor}
                    backgroundColor={config.footerBackgroundColor}
                    textColor={config.footerTextColor}
                    accentColor={config.footerAccentColor}
                    data={config.footerData}
                  />
                </div>
              </div>

              {/* Footer Design Selection */}
              <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-700/50 mb-6">
                <label className="text-sm font-bold text-white mb-3 block">Footer Design</label>
                <div className="grid grid-cols-4 gap-2">
                  {FOOTER_OPTIONS.map((footer) => (
                    <button
                      key={footer.id}
                      onClick={() => onConfigChange({ ...config, footerStyle: footer.id as FooterStyleId })}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${config.footerStyle === footer.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-neutral-700 hover:border-neutral-600'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${config.footerStyle === footer.id ? 'text-orange-400' : 'text-white'}`}>
                        {footer.name}
                      </span>
                      <span className="text-[10px] text-neutral-500 block mt-0.5">{footer.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Customization */}
              <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-white">Customize Footer</label>
                  <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg">
                    {FOOTER_OPTIONS.find(f => f.id === config.footerStyle)?.name || 'Columns'}
                  </span>
                </div>

                {/* Color Controls */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs text-neutral-400 uppercase tracking-wide">Colors</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: 'footerBackgroundColor', label: 'Background', defaultValue: '#171717' },
                      { key: 'footerTextColor', label: 'Text', defaultValue: '#ffffff' },
                      { key: 'footerAccentColor', label: 'Accent / Links', defaultValue: config.primaryColor || '#3B82F6' },
                    ].map(({ key, label, defaultValue }) => (
                      <div key={key} className="flex items-center gap-3 bg-neutral-900 p-3 rounded-lg border border-neutral-700">
                        <input
                          type="color"
                          value={(config as any)[key] ?? defaultValue}
                          onChange={(e) => onConfigChange({ ...config, [key]: e.target.value })}
                          className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-sm text-neutral-300">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Minimal Footer Controls */}
                {config.footerStyle === 'minimal' && (
                  <>
                    {/* Show/Hide Icons */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Show/Hide Icons</p>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { key: 'showSearch', label: 'Search', icon: Search },
                          { key: 'showAccount', label: 'Account', icon: User },
                          { key: 'showCart', label: 'Cart', icon: ShoppingBag },
                          { key: 'showInstagram', label: 'Instagram', icon: Instagram },
                          { key: 'showTwitter', label: 'Twitter', icon: Twitter },
                        ].map(({ key, label, icon: Icon }) => (
                          <button
                            key={key}
                            onClick={() => onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, [key]: !(config.footerData?.[key] ?? (key === 'showInstagram' || key === 'showTwitter')) }
                            })}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                              (config.footerData?.[key] ?? (key === 'showInstagram' || key === 'showTwitter'))
                                ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                                : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                            }`}
                          >
                            <Icon size={16} />
                            <span className="text-[10px]">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Footer Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Footer Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.footerLinks || [
                          { label: 'Terms', link: '' },
                          { label: 'Privacy', link: '' },
                          { label: 'Contact', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.footerLinks || [
                                    { label: 'Terms', link: '' },
                                    { label: 'Privacy', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, footerLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.footerLinks || [
                                    { label: 'Terms', link: '' },
                                    { label: 'Privacy', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, footerLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <select
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.footerLinks || [
                                    { label: 'Terms', link: '' },
                                    { label: 'Privacy', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, footerLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                              >
                                <option value="">No link</option>
                                {localPages.map(page => (
                                  <option key={page.id} value={page.slug || '/'}>
                                    {page.title || page.slug}
                                  </option>
                                ))}
                                <option value="external">Custom URL...</option>
                              </select>
                            </div>
                            {item.link === 'external' && (
                              <div className="flex items-center gap-2 mt-1">
                                <ExternalLink size={10} className="text-neutral-600" />
                                <input
                                  type="text"
                                  value={item.externalUrl || ''}
                                  onChange={(e) => {
                                    const links = config.footerData?.footerLinks || [
                                      { label: 'Terms', link: '' },
                                      { label: 'Privacy', link: '' },
                                      { label: 'Contact', link: '' }
                                    ];
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, footerLinks: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.footerLinks || [
                              { label: 'Terms', link: '' },
                              { label: 'Privacy', link: '' },
                              { label: 'Contact', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Link', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, footerLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Columns Footer Controls */}
                {config.footerStyle === 'columns' && (
                  <>
                    {/* Tagline */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Tagline / Description</p>
                      <textarea
                        value={config.footerData?.tagline || 'Designed for the future of commerce. We build tools that empower creators to sell without limits.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, tagline: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none resize-none"
                        rows={3}
                        placeholder="Your store tagline..."
                      />
                    </div>

                    {/* Show/Hide Elements */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Show/Hide Elements</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, showPaymentBadges: !(config.footerData?.showPaymentBadges ?? true) }
                          })}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                            (config.footerData?.showPaymentBadges ?? true)
                              ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                              : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                          }`}
                        >
                          <CreditCard size={14} />
                          <span className="text-xs">Payment Badges</span>
                        </button>
                      </div>
                    </div>

                    {/* Link Columns */}
                    {['shop', 'company', 'support'].map((columnKey) => {
                      const titleKey = `${columnKey}Title`;
                      const linksKey = `${columnKey}Links`;
                      const defaultTitle = columnKey.charAt(0).toUpperCase() + columnKey.slice(1);
                      const defaultLinks = columnKey === 'shop' 
                        ? [{ label: 'New Arrivals', link: '' }, { label: 'Best Sellers', link: '' }, { label: 'Accessories', link: '' }, { label: 'Sale', link: '' }]
                        : columnKey === 'company'
                        ? [{ label: 'About Us', link: '' }, { label: 'Careers', link: '' }, { label: 'Press', link: '' }, { label: 'Sustainability', link: '' }]
                        : [{ label: 'Help Center', link: '' }, { label: 'Returns', link: '' }, { label: 'Shipping', link: '' }, { label: 'Contact', link: '' }];
                      
                      const links = config.footerData?.[linksKey] || defaultLinks;

                      return (
                        <div key={columnKey} className="space-y-3 mb-6">
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-neutral-400 uppercase tracking-wide">{defaultTitle} Column</p>
                          </div>
                          
                          {/* Column Title */}
                          <input
                            type="text"
                            value={config.footerData?.[titleKey] || defaultTitle}
                            onChange={(e) => onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, [titleKey]: e.target.value }
                            })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                            placeholder="Column title..."
                          />
                          
                          {/* Links */}
                          <div className="space-y-2">
                            {links.map((item: any, idx: number) => (
                              <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => {
                                      const newLinks = [...links];
                                      newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                    placeholder="Link label..."
                                  />
                                  <button
                                    onClick={() => {
                                      const newLinks = links.filter((_: any, i: number) => i !== idx);
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Link size={10} className="text-neutral-600" />
                                  <select
                                    value={item.link || ''}
                                    onChange={(e) => {
                                      const newLinks = [...links];
                                      newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  >
                                    <option value="">No link</option>
                                    {localPages.map(page => (
                                      <option key={page.id} value={page.slug || '/'}>
                                        {page.title || page.slug}
                                      </option>
                                    ))}
                                    <option value="external">Custom URL...</option>
                                  </select>
                                </div>
                                {item.link === 'external' && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <ExternalLink size={10} className="text-neutral-600" />
                                    <input
                                      type="text"
                                      value={item.externalUrl || ''}
                                      onChange={(e) => {
                                        const newLinks = [...links];
                                        newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                        onConfigChange({
                                          ...config,
                                          footerData: { ...config.footerData, [linksKey]: newLinks }
                                        });
                                      }}
                                      className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                      placeholder="https://..."
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newLinks = [...links, { label: 'New Link', link: '' }];
                                onConfigChange({
                                  ...config,
                                  footerData: { ...config.footerData, [linksKey]: newLinks }
                                });
                              }}
                              className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                            >
                              + Add Link
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Copyright Text */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Copyright Text</p>
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || `© 2024 ${config.name} Inc. All rights reserved.`}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="© 2024 Your Company..."
                      />
                    </div>

                    {/* Bottom Links (Privacy Policy, Terms) */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Bottom Links</p>
                      <div className="space-y-2">
                        {[
                          { key: 'showPrivacyPolicy', labelKey: 'privacyPolicyLabel', linkKey: 'privacyPolicyLink', defaultLabel: 'Privacy Policy' },
                          { key: 'showTermsOfService', labelKey: 'termsOfServiceLabel', linkKey: 'termsOfServiceLink', defaultLabel: 'Terms of Service' },
                        ].map(({ key, labelKey, linkKey, defaultLabel }) => (
                          <div key={key} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <button
                                onClick={() => onConfigChange({
                                  ...config,
                                  footerData: { ...config.footerData, [key]: !(config.footerData?.[key] ?? true) }
                                })}
                                className={`w-8 h-5 rounded-full transition-colors relative shrink-0 ${
                                  (config.footerData?.[key] ?? true) ? 'bg-orange-500' : 'bg-neutral-700'
                                }`}
                              >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                                  (config.footerData?.[key] ?? true) ? 'left-3.5' : 'left-0.5'
                                }`} />
                              </button>
                              <input
                                type="text"
                                value={config.footerData?.[labelKey] ?? defaultLabel}
                                onChange={(e) => onConfigChange({
                                  ...config,
                                  footerData: { ...config.footerData, [labelKey]: e.target.value }
                                })}
                                disabled={!(config.footerData?.[key] ?? true)}
                                className={`flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs focus:border-orange-500 outline-none ${
                                  (config.footerData?.[key] ?? true) ? 'text-white' : 'text-neutral-600'
                                }`}
                              />
                            </div>
                            {(config.footerData?.[key] ?? true) && (
                              <div className="flex items-center gap-2 ml-10">
                                <Link size={10} className="text-neutral-600" />
                                <select
                                  value={config.footerData?.[linkKey] ?? ''}
                                  onChange={(e) => onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, [linkKey]: e.target.value }
                                  })}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                >
                                  <option value="">No link</option>
                                  {localPages.map(page => (
                                    <option key={page.id} value={page.slug || '/'}>
                                      {page.title || page.slug}
                                    </option>
                                  ))}
                                  <option value="external">Custom URL...</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Newsletter Footer Controls */}
                {config.footerStyle === 'newsletter' && (
                  <>
                    {/* Heading & Subheading */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Newsletter Content</p>
                      <input
                        type="text"
                        value={config.footerData?.heading || "Don't miss the drop."}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, heading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                        placeholder="Newsletter heading..."
                      />
                      <textarea
                        value={config.footerData?.subheading || 'Join 50,000+ subscribers getting exclusive access to new releases, secret sales, and design insights.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, subheading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none resize-none"
                        rows={2}
                        placeholder="Newsletter description..."
                      />
                    </div>

                    {/* Form Controls */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Form</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.footerData?.placeholderText || 'Enter your email'}
                          onChange={(e) => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, placeholderText: e.target.value }
                          })}
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                          placeholder="Placeholder..."
                        />
                        <input
                          type="text"
                          value={config.footerData?.buttonText || 'Subscribe'}
                          onChange={(e) => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, buttonText: e.target.value }
                          })}
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                          placeholder="Button text..."
                        />
                      </div>
                    </div>

                    {/* Dynamic Social Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Social Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.socialLinks || [
                          { label: 'Instagram', link: '' },
                          { label: 'Twitter', link: '' },
                          { label: 'TikTok', link: '' },
                          { label: 'YouTube', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.socialLinks || [
                                    { label: 'Instagram', link: '' },
                                    { label: 'Twitter', link: '' },
                                    { label: 'TikTok', link: '' },
                                    { label: 'YouTube', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, socialLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.socialLinks || [
                                    { label: 'Instagram', link: '' },
                                    { label: 'Twitter', link: '' },
                                    { label: 'TikTok', link: '' },
                                    { label: 'YouTube', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, socialLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <input
                                type="text"
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.socialLinks || [
                                    { label: 'Instagram', link: '' },
                                    { label: 'Twitter', link: '' },
                                    { label: 'TikTok', link: '' },
                                    { label: 'YouTube', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, socialLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                placeholder="https://instagram.com/yourhandle"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.socialLinks || [
                              { label: 'Instagram', link: '' },
                              { label: 'Twitter', link: '' },
                              { label: 'TikTok', link: '' },
                              { label: 'YouTube', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Social', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, socialLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Social Link
                        </button>
                      </div>
                    </div>

                    {/* Copyright Text */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Copyright Text</p>
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || `© 2024 ${config.name}.`}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="© 2024 Your Company..."
                      />
                    </div>
                  </>
                )}

                {/* Sitemap Footer Controls */}
                {config.footerStyle === 'sitemap' && (
                  <>
                    {/* Region & Security Badge */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Header Section</p>
                      <input
                        type="text"
                        value={config.footerData?.regionText || 'Region: United States (USD $)'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, regionText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="Region text..."
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, showSecurityBadge: !(config.footerData?.showSecurityBadge ?? true) }
                          })}
                          className={`w-8 h-5 rounded-full transition-colors relative shrink-0 ${
                            (config.footerData?.showSecurityBadge ?? true) ? 'bg-orange-500' : 'bg-neutral-700'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            (config.footerData?.showSecurityBadge ?? true) ? 'left-3.5' : 'left-0.5'
                          }`} />
                        </button>
                        <input
                          type="text"
                          value={config.footerData?.securityBadgeText || 'Secure Checkout via Evolv Pass'}
                          onChange={(e) => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, securityBadgeText: e.target.value }
                          })}
                          disabled={!(config.footerData?.showSecurityBadge ?? true)}
                          className={`flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none ${
                            (config.footerData?.showSecurityBadge ?? true) ? 'text-white' : 'text-neutral-600'
                          }`}
                          placeholder="Security badge text..."
                        />
                      </div>
                    </div>

                    {/* Link Columns */}
                    {[
                      { key: 'col1', defaultTitle: 'Products', defaultLinks: [{ label: 'New Arrivals', link: '' }, { label: 'Best Sellers', link: '' }, { label: 'Trends', link: '' }, { label: 'Gift Cards', link: '' }, { label: 'Sale', link: '' }] },
                      { key: 'col2', defaultTitle: 'Collections', defaultLinks: [{ label: 'Summer 2024', link: '' }, { label: 'Cyber Tech', link: '' }, { label: 'Minimalist', link: '' }, { label: 'Accessories', link: '' }, { label: 'Home', link: '' }] },
                      { key: 'col3', defaultTitle: 'Support', defaultLinks: [{ label: 'Help Center', link: '' }, { label: 'Track Order', link: '' }, { label: 'Returns', link: '' }, { label: 'Shipping Info', link: '' }, { label: 'Contact Us', link: '' }] },
                      { key: 'col4', defaultTitle: 'Legal', defaultLinks: [{ label: 'Terms', link: '' }, { label: 'Privacy', link: '' }, { label: 'Cookies', link: '' }, { label: 'Licenses', link: '' }] },
                    ].map(({ key, defaultTitle, defaultLinks }) => {
                      const titleKey = `${key}Title`;
                      const linksKey = `${key}Links`;
                      const links = config.footerData?.[linksKey] || defaultLinks;

                      return (
                        <div key={key} className="space-y-3 mb-6">
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-neutral-400 uppercase tracking-wide">{defaultTitle} Column</p>
                          </div>
                          
                          {/* Column Title */}
                          <input
                            type="text"
                            value={config.footerData?.[titleKey] || defaultTitle}
                            onChange={(e) => onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, [titleKey]: e.target.value }
                            })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                            placeholder="Column title..."
                          />
                          
                          {/* Links */}
                          <div className="space-y-2">
                            {links.map((item: any, idx: number) => (
                              <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => {
                                      const newLinks = [...links];
                                      newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                    placeholder="Link label..."
                                  />
                                  <button
                                    onClick={() => {
                                      const newLinks = links.filter((_: any, i: number) => i !== idx);
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Link size={10} className="text-neutral-600" />
                                  <select
                                    value={item.link || ''}
                                    onChange={(e) => {
                                      const newLinks = [...links];
                                      newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  >
                                    <option value="">No link</option>
                                    {localPages.map(page => (
                                      <option key={page.id} value={page.slug || '/'}>
                                        {page.title || page.slug}
                                      </option>
                                    ))}
                                    <option value="external">Custom URL...</option>
                                  </select>
                                </div>
                                {item.link === 'external' && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <ExternalLink size={10} className="text-neutral-600" />
                                    <input
                                      type="text"
                                      value={item.externalUrl || ''}
                                      onChange={(e) => {
                                        const newLinks = [...links];
                                        newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                        onConfigChange({
                                          ...config,
                                          footerData: { ...config.footerData, [linksKey]: newLinks }
                                        });
                                      }}
                                      className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                      placeholder="https://..."
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newLinks = [...links, { label: 'New Link', link: '' }];
                                onConfigChange({
                                  ...config,
                                  footerData: { ...config.footerData, [linksKey]: newLinks }
                                });
                              }}
                              className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                            >
                              + Add Link
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Copyright Text */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Copyright Text</p>
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || '© 2024 Evolv Commerce Operating System. Powered by React.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="© 2024 Your Company..."
                      />
                    </div>
                  </>
                )}

                {/* Origami Footer Controls */}
                {config.footerStyle === 'origami' && (
                  <>
                    {/* Header Content */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Header Panel</p>
                      <input
                        type="text"
                        value={config.footerData?.heading || "Let's Connect"}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, heading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                        placeholder="Heading..."
                      />
                      <input
                        type="text"
                        value={config.footerData?.subheading || "We're always open to new ideas and collaborations."}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, subheading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="Subheading..."
                      />
                    </div>

                    {/* Link Columns */}
                    {[
                      { key: 'col1', defaultTitle: 'Product', defaultLinks: [{ label: 'Features', link: '' }, { label: 'Pricing', link: '' }] },
                      { key: 'col2', defaultTitle: 'Company', defaultLinks: [{ label: 'About Us', link: '' }, { label: 'Blog', link: '' }] },
                      { key: 'col3', defaultTitle: 'Social', defaultLinks: [{ label: 'Twitter', link: '' }, { label: 'LinkedIn', link: '' }] },
                      { key: 'col4', defaultTitle: 'Legal', defaultLinks: [{ label: 'Privacy', link: '' }, { label: 'Terms', link: '' }] },
                    ].map(({ key, defaultTitle, defaultLinks }) => {
                      const titleKey = `${key}Title`;
                      const linksKey = `${key}Links`;
                      const links = config.footerData?.[linksKey] || defaultLinks;

                      return (
                        <div key={key} className="space-y-3 mb-6">
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-neutral-400 uppercase tracking-wide">{defaultTitle} Column</p>
                          </div>
                          
                          {/* Column Title */}
                          <input
                            type="text"
                            value={config.footerData?.[titleKey] || defaultTitle}
                            onChange={(e) => onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, [titleKey]: e.target.value }
                            })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                            placeholder="Column title..."
                          />
                          
                          {/* Links */}
                          <div className="space-y-2">
                            {links.map((item: any, idx: number) => (
                              <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => {
                                      const newLinks = [...links];
                                      newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                    placeholder="Link label..."
                                  />
                                  <button
                                    onClick={() => {
                                      const newLinks = links.filter((_: any, i: number) => i !== idx);
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Link size={10} className="text-neutral-600" />
                                  <select
                                    value={item.link || ''}
                                    onChange={(e) => {
                                      const newLinks = [...links];
                                      newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                      onConfigChange({
                                        ...config,
                                        footerData: { ...config.footerData, [linksKey]: newLinks }
                                      });
                                    }}
                                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  >
                                    <option value="">No link</option>
                                    {localPages.map(page => (
                                      <option key={page.id} value={page.slug || '/'}>
                                        {page.title || page.slug}
                                      </option>
                                    ))}
                                    <option value="external">Custom URL...</option>
                                  </select>
                                </div>
                                {item.link === 'external' && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <ExternalLink size={10} className="text-neutral-600" />
                                    <input
                                      type="text"
                                      value={item.externalUrl || ''}
                                      onChange={(e) => {
                                        const newLinks = [...links];
                                        newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                        onConfigChange({
                                          ...config,
                                          footerData: { ...config.footerData, [linksKey]: newLinks }
                                        });
                                      }}
                                      className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                      placeholder="https://..."
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newLinks = [...links, { label: 'New Link', link: '' }];
                                onConfigChange({
                                  ...config,
                                  footerData: { ...config.footerData, [linksKey]: newLinks }
                                });
                              }}
                              className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                            >
                              + Add Link
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Copyright Text */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Copyright Text</p>
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || `© ${new Date().getFullYear()} ${config.name}. All rights reserved.`}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="© 2024 Your Company..."
                      />
                    </div>
                  </>
                )}

                {/* DataScape Footer Controls */}
                {config.footerStyle === 'datascape' && (
                  <>
                    {/* Info */}
                    <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-lg p-3 mb-6">
                      <p className="text-xs text-cyan-400">
                        🌐 Interactive 3D terrain visualization. The terrain colors adapt to your Background and Accent colors.
                      </p>
                    </div>

                    {/* Copyright Text */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Copyright Text</p>
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || `© ${new Date().getFullYear()} All rights reserved.`}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="© 2024 Your Company..."
                      />
                    </div>

                    {/* Dynamic Navigation Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Navigation Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.navLinks || [
                          { label: 'API', link: '' },
                          { label: 'Status', link: '' },
                          { label: 'Docs', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'API', link: '' },
                                    { label: 'Status', link: '' },
                                    { label: 'Docs', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'API', link: '' },
                                    { label: 'Status', link: '' },
                                    { label: 'Docs', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <select
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'API', link: '' },
                                    { label: 'Status', link: '' },
                                    { label: 'Docs', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                              >
                                <option value="">No link</option>
                                {localPages.map(page => (
                                  <option key={page.id} value={page.slug || '/'}>
                                    {page.title || page.slug}
                                  </option>
                                ))}
                                <option value="external">Custom URL...</option>
                              </select>
                            </div>
                            {item.link === 'external' && (
                              <div className="flex items-center gap-2 mt-1">
                                <ExternalLink size={10} className="text-neutral-600" />
                                <input
                                  type="text"
                                  value={item.externalUrl || ''}
                                  onChange={(e) => {
                                    const links = config.footerData?.navLinks || [
                                      { label: 'API', link: '' },
                                      { label: 'Status', link: '' },
                                      { label: 'Docs', link: '' }
                                    ];
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, navLinks: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.navLinks || [
                              { label: 'API', link: '' },
                              { label: 'Status', link: '' },
                              { label: 'Docs', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Link', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, navLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Kinetic Footer Controls */}
                {config.footerStyle === 'kinetic' && (
                  <>
                    {/* Dynamic Animated Navigation Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Animated Navigation Links</p>
                      <p className="text-[10px] text-neutral-500 mb-2">Large animated text that reveals on hover with character stagger effect</p>
                      <div className="space-y-2">
                        {(config.footerData?.animatedLinks || [
                          { label: 'Our Work', link: '' },
                          { label: 'About Us', link: '' },
                          { label: 'Get In Touch', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.animatedLinks || [
                                    { label: 'Our Work', link: '' },
                                    { label: 'About Us', link: '' },
                                    { label: 'Get In Touch', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, animatedLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white font-bold focus:border-orange-500 outline-none"
                                placeholder="Link text..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.animatedLinks || [
                                    { label: 'Our Work', link: '' },
                                    { label: 'About Us', link: '' },
                                    { label: 'Get In Touch', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, animatedLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <select
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.animatedLinks || [
                                    { label: 'Our Work', link: '' },
                                    { label: 'About Us', link: '' },
                                    { label: 'Get In Touch', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, animatedLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                              >
                                <option value="">No link</option>
                                {localPages.map(page => (
                                  <option key={page.id} value={page.slug || '/'}>
                                    {page.title || page.slug}
                                  </option>
                                ))}
                                <option value="external">Custom URL...</option>
                              </select>
                            </div>
                            {item.link === 'external' && (
                              <div className="flex items-center gap-2 mt-1">
                                <ExternalLink size={10} className="text-neutral-600" />
                                <input
                                  type="text"
                                  value={item.externalUrl || ''}
                                  onChange={(e) => {
                                    const links = config.footerData?.animatedLinks || [
                                      { label: 'Our Work', link: '' },
                                      { label: 'About Us', link: '' },
                                      { label: 'Get In Touch', link: '' }
                                    ];
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, animatedLinks: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.animatedLinks || [
                              { label: 'Our Work', link: '' },
                              { label: 'About Us', link: '' },
                              { label: 'Get In Touch', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Link', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, animatedLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Animated Link
                        </button>
                      </div>
                    </div>

                    {/* Dynamic Social Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Social Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.socialLinks || [
                          { label: 'Twitter', link: '' },
                          { label: 'LinkedIn', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.socialLinks || [
                                    { label: 'Twitter', link: '' },
                                    { label: 'LinkedIn', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, socialLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.socialLinks || [
                                    { label: 'Twitter', link: '' },
                                    { label: 'LinkedIn', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, socialLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <input
                                type="text"
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.socialLinks || [
                                    { label: 'Twitter', link: '' },
                                    { label: 'LinkedIn', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, socialLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                placeholder="https://twitter.com/yourhandle"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.socialLinks || [
                              { label: 'Twitter', link: '' },
                              { label: 'LinkedIn', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Social', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, socialLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Social Link
                        </button>
                      </div>
                    </div>

                    {/* Copyright Text */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Copyright Text</p>
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || `© ${new Date().getFullYear()} ${config.name}.`}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="© 2024 Your Company..."
                      />
                    </div>
                  </>
                )}

                {/* Parallax Footer Controls */}
                {config.footerStyle === 'parallax' && (
                  <>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Content</p>
                      <input
                        type="text"
                        value={config.footerData?.heading || 'Explore the Horizon'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, heading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                        placeholder="Heading..."
                      />
                      <input
                        type="text"
                        value={config.footerData?.subheading || 'Our journey continues beyond the peaks.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, subheading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="Subheading..."
                      />
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, showButton: !(config.footerData?.showButton ?? true) }
                          })}
                          className={`w-8 h-5 rounded-full transition-colors relative shrink-0 ${
                            (config.footerData?.showButton ?? true) ? 'bg-orange-500' : 'bg-neutral-700'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            (config.footerData?.showButton ?? true) ? 'left-3.5' : 'left-0.5'
                          }`} />
                        </button>
                        <span className="text-xs text-neutral-400">Show Button</span>
                      </div>
                      {(config.footerData?.showButton ?? true) && (
                        <input
                          type="text"
                          value={config.footerData?.buttonText || 'Start Exploring'}
                          onChange={(e) => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, buttonText: e.target.value }
                          })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                          placeholder="Button text..."
                        />
                      )}
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Background Images (URLs)</p>
                      <input
                        type="text"
                        value={config.footerData?.bgImage1 || ''}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, bgImage1: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                        placeholder="Layer 1 image URL..."
                      />
                      <input
                        type="text"
                        value={config.footerData?.bgImage2 || ''}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, bgImage2: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                        placeholder="Layer 2 image URL..."
                      />
                    </div>

                    {/* Dynamic Navigation Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Navigation Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.navLinks || [
                          { label: 'Home', link: '' },
                          { label: 'About', link: '' },
                          { label: 'Contact', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <select
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                              >
                                <option value="">No link</option>
                                {localPages.map(page => (
                                  <option key={page.id} value={page.slug || '/'}>
                                    {page.title || page.slug}
                                  </option>
                                ))}
                                <option value="external">Custom URL...</option>
                              </select>
                            </div>
                            {item.link === 'external' && (
                              <div className="flex items-center gap-2 mt-1">
                                <ExternalLink size={10} className="text-neutral-600" />
                                <input
                                  type="text"
                                  value={item.externalUrl || ''}
                                  onChange={(e) => {
                                    const links = config.footerData?.navLinks || [
                                      { label: 'Home', link: '' },
                                      { label: 'About', link: '' },
                                      { label: 'Contact', link: '' }
                                    ];
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, navLinks: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.navLinks || [
                              { label: 'Home', link: '' },
                              { label: 'About', link: '' },
                              { label: 'Contact', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Link', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, navLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Gooey Footer Controls */}
                {config.footerStyle === 'gooey' && (
                  <>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Content</p>
                      <input
                        type="text"
                        value={config.footerData?.heading || "Let's Create Something Fluid."}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, heading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                        placeholder="Heading..."
                      />
                      <textarea
                        value={config.footerData?.subheading || 'We believe in adaptable, dynamic solutions that flow with your needs.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, subheading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none resize-none"
                        rows={2}
                        placeholder="Subheading..."
                      />
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, showButton: !(config.footerData?.showButton ?? true) }
                          })}
                          className={`w-8 h-5 rounded-full transition-colors relative shrink-0 ${
                            (config.footerData?.showButton ?? true) ? 'bg-orange-500' : 'bg-neutral-700'
                          }`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            (config.footerData?.showButton ?? true) ? 'left-3.5' : 'left-0.5'
                          }`} />
                        </button>
                        <span className="text-xs text-neutral-400">Show Button</span>
                      </div>
                      {(config.footerData?.showButton ?? true) && (
                        <input
                          type="text"
                          value={config.footerData?.buttonText || 'Get in Touch'}
                          onChange={(e) => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, buttonText: e.target.value }
                          })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                          placeholder="Button text..."
                        />
                      )}
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Blob Colors</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'blob1Color', default: '#6366F1' },
                          { key: 'blob2Color', default: '#A855F7' },
                          { key: 'blob3Color', default: '#F43F5E' },
                        ].map(({ key, default: defaultColor }) => (
                          <div key={key} className="flex items-center gap-2">
                            <input
                              type="color"
                              value={config.footerData?.[key] || defaultColor}
                              onChange={(e) => onConfigChange({
                                ...config,
                                footerData: { ...config.footerData, [key]: e.target.value }
                              })}
                              className="w-8 h-8 rounded cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Navigation Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Navigation Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.navLinks || [
                          { label: 'Home', link: '' },
                          { label: 'About', link: '' },
                          { label: 'Contact', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <select
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                              >
                                <option value="">No link</option>
                                {localPages.map(page => (
                                  <option key={page.id} value={page.slug || '/'}>
                                    {page.title || page.slug}
                                  </option>
                                ))}
                                <option value="external">Custom URL...</option>
                              </select>
                            </div>
                            {item.link === 'external' && (
                              <div className="flex items-center gap-2 mt-1">
                                <ExternalLink size={10} className="text-neutral-600" />
                                <input
                                  type="text"
                                  value={item.externalUrl || ''}
                                  onChange={(e) => {
                                    const links = config.footerData?.navLinks || [
                                      { label: 'Home', link: '' },
                                      { label: 'About', link: '' },
                                      { label: 'Contact', link: '' }
                                    ];
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, navLinks: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.navLinks || [
                              { label: 'Home', link: '' },
                              { label: 'About', link: '' },
                              { label: 'Contact', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Link', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, navLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Constellation Footer Controls */}
                {config.footerStyle === 'constellation' && (
                  <>
                    <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-3 mb-6">
                      <p className="text-xs text-indigo-400">
                        ✨ Interactive star field. Stars connect when your mouse hovers nearby.
                      </p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Content</p>
                      <input
                        type="text"
                        value={config.footerData?.heading || 'Connect the Dots'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, heading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                        placeholder="Heading..."
                      />
                      <input
                        type="text"
                        value={config.footerData?.subheading || 'Interactive constellation map. Move your mouse.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, subheading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="Subheading..."
                      />
                    </div>

                    {/* Dynamic Navigation Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Navigation Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.navLinks || [
                          { label: 'Home', link: '' },
                          { label: 'About', link: '' },
                          { label: 'Contact', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <select
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Home', link: '' },
                                    { label: 'About', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                              >
                                <option value="">No link</option>
                                {localPages.map(page => (
                                  <option key={page.id} value={page.slug || '/'}>
                                    {page.title || page.slug}
                                  </option>
                                ))}
                                <option value="external">Custom URL...</option>
                              </select>
                            </div>
                            {item.link === 'external' && (
                              <div className="flex items-center gap-2 mt-1">
                                <ExternalLink size={10} className="text-neutral-600" />
                                <input
                                  type="text"
                                  value={item.externalUrl || ''}
                                  onChange={(e) => {
                                    const links = config.footerData?.navLinks || [
                                      { label: 'Home', link: '' },
                                      { label: 'About', link: '' },
                                      { label: 'Contact', link: '' }
                                    ];
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, navLinks: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.navLinks || [
                              { label: 'Home', link: '' },
                              { label: 'About', link: '' },
                              { label: 'Contact', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Link', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, navLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Terminal Footer Controls */}
                {config.footerStyle === 'terminal' && (
                  <>
                    <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-3 mb-6">
                      <p className="text-xs text-green-400 font-mono">
                        &gt; CRT-style terminal footer with scanline effects
                      </p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">System Display</p>
                      <input
                        type="text"
                        value={config.footerData?.systemMessage || 'SYSTEM READY.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, systemMessage: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-mono"
                        placeholder="System message..."
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={config.footerData?.ipAddress || '127.0.0.1'}
                          onChange={(e) => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, ipAddress: e.target.value }
                          })}
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none font-mono"
                          placeholder="IP Address..."
                        />
                        <input
                          type="text"
                          value={config.footerData?.userName || 'GUEST'}
                          onChange={(e) => onConfigChange({
                            ...config,
                            footerData: { ...config.footerData, userName: e.target.value }
                          })}
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none font-mono"
                          placeholder="User name..."
                        />
                      </div>
                    </div>
                    {/* Terminal columns */}
                    {[
                      { key: 'col1', defaultTitle: '[NAV]', defaultLinks: [{ label: '/home', link: '' }, { label: '/about', link: '' }, { label: '/contact', link: '' }] },
                      { key: 'col2', defaultTitle: '[DATA]', defaultLinks: [{ label: 'API_DOCS', link: '' }, { label: 'STATUS', link: '' }, { label: 'RESOURCES', link: '' }] },
                      { key: 'col3', defaultTitle: '[SOCIAL]', defaultLinks: [{ label: 'TWITTER', link: '' }, { label: 'GITHUB', link: '' }] },
                    ].map(({ key, defaultTitle, defaultLinks }) => {
                      const titleKey = `${key}Title`;
                      const linksKey = `${key}Links`;
                      const links = config.footerData?.[linksKey] || defaultLinks;

                      return (
                        <div key={key} className="space-y-3 mb-4">
                          <input
                            type="text"
                            value={config.footerData?.[titleKey] || defaultTitle}
                            onChange={(e) => onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, [titleKey]: e.target.value }
                            })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none font-mono font-bold"
                          />
                          <div className="space-y-1">
                            {links.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) => {
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, [linksKey]: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-white focus:border-orange-500 outline-none font-mono"
                                />
                                <button
                                  onClick={() => {
                                    const newLinks = links.filter((_: any, i: number) => i !== idx);
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, [linksKey]: newLinks }
                                    });
                                  }}
                                  className="p-1 text-neutral-500 hover:text-red-400"
                                >
                                  <X size={10} />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => {
                                const newLinks = [...links, { label: 'NEW_LINK', link: '' }];
                                onConfigChange({
                                  ...config,
                                  footerData: { ...config.footerData, [linksKey]: newLinks }
                                });
                              }}
                              className="w-full py-1 text-[10px] text-neutral-500 hover:text-green-400 border border-dashed border-neutral-700 hover:border-green-500 rounded font-mono"
                            >
                              + ADD_LINK
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Copyright</p>
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || `© ${new Date().getFullYear()} ${config.name}. All operations normal.`}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none font-mono"
                      />
                    </div>
                  </>
                )}

                {/* Aurora Footer Controls */}
                {config.footerStyle === 'aurora' && (
                  <>
                    <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3 mb-6">
                      <p className="text-xs text-purple-400">
                        ✨ Animated northern lights with floating color gradients.
                      </p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Content</p>
                      <input
                        type="text"
                        value={config.footerData?.heading || config.name || 'Northern Lights Inc.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, heading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                        placeholder="Heading..."
                      />
                      <textarea
                        value={config.footerData?.subheading || 'Navigating the digital cosmos with grace and style.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, subheading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none resize-none"
                        rows={2}
                        placeholder="Subheading..."
                      />
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || `© ${new Date().getFullYear()} All rights reserved.`}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                        placeholder="Copyright..."
                      />
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Aurora Colors</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'color1', default: '#9333ea', label: 'Purple' },
                          { key: 'color2', default: '#14b8a6', label: 'Teal' },
                          { key: 'color3', default: '#f43f5e', label: 'Rose' },
                        ].map(({ key, default: defaultColor, label }) => (
                          <div key={key} className="flex flex-col items-center gap-1">
                            <input
                              type="color"
                              value={config.footerData?.[key] || defaultColor}
                              onChange={(e) => onConfigChange({
                                ...config,
                                footerData: { ...config.footerData, [key]: e.target.value }
                              })}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <span className="text-[10px] text-neutral-500">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Navigation Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Navigation Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.navLinks || [
                          { label: 'Products', link: '' },
                          { label: 'Showcase', link: '' },
                          { label: 'About Us', link: '' },
                          { label: 'Contact', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Products', link: '' },
                                    { label: 'Showcase', link: '' },
                                    { label: 'About Us', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Products', link: '' },
                                    { label: 'Showcase', link: '' },
                                    { label: 'About Us', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <select
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Products', link: '' },
                                    { label: 'Showcase', link: '' },
                                    { label: 'About Us', link: '' },
                                    { label: 'Contact', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                              >
                                <option value="">No link</option>
                                {localPages.map(page => (
                                  <option key={page.id} value={page.slug || '/'}>
                                    {page.title || page.slug}
                                  </option>
                                ))}
                                <option value="external">Custom URL...</option>
                              </select>
                            </div>
                            {item.link === 'external' && (
                              <div className="flex items-center gap-2 mt-1">
                                <ExternalLink size={10} className="text-neutral-600" />
                                <input
                                  type="text"
                                  value={item.externalUrl || ''}
                                  onChange={(e) => {
                                    const links = config.footerData?.navLinks || [
                                      { label: 'Products', link: '' },
                                      { label: 'Showcase', link: '' },
                                      { label: 'About Us', link: '' },
                                      { label: 'Contact', link: '' }
                                    ];
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, navLinks: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.navLinks || [
                              { label: 'Products', link: '' },
                              { label: 'Showcase', link: '' },
                              { label: 'About Us', link: '' },
                              { label: 'Contact', link: '' }
                            ];
                            const newLinks = [...links, { label: 'New Link', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, navLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Ripple Footer Controls */}
                {config.footerStyle === 'ripple' && (
                  <>
                    <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-lg p-3 mb-6">
                      <p className="text-xs text-cyan-400">
                        💧 Interactive water ripple effect. Move your mouse over the footer.
                      </p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Content</p>
                      <input
                        type="text"
                        value={config.footerData?.heading || config.name || 'Ripple Effect'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, heading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold"
                        placeholder="Heading..."
                      />
                      <input
                        type="text"
                        value={config.footerData?.subheading || 'Move your mouse to interact.'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, subheading: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none"
                        placeholder="Subheading..."
                      />
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Background Image URL</p>
                      <input
                        type="text"
                        value={config.footerData?.bgImage || 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, bgImage: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </>
                )}

                {/* Glitch Footer Controls */}
                {config.footerStyle === 'glitch' && (
                  <>
                    <div className="bg-fuchsia-900/20 border border-fuchsia-800/30 rounded-lg p-3 mb-6">
                      <p className="text-xs text-fuchsia-400">
                        ⚡ Cyberpunk glitch effect on hover. Links distort with RGB split.
                      </p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Brand</p>
                      <input
                        type="text"
                        value={config.footerData?.brandName || config.name || 'CYBERCORP'}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, brandName: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-orange-500 outline-none font-bold uppercase"
                        placeholder="Brand name..."
                      />
                      <input
                        type="text"
                        value={config.footerData?.copyrightText || `© ${new Date().getFullYear()} All rights reserved.`}
                        onChange={(e) => onConfigChange({
                          ...config,
                          footerData: { ...config.footerData, copyrightText: e.target.value }
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white focus:border-orange-500 outline-none"
                        placeholder="Copyright..."
                      />
                    </div>
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Glitch Colors</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'glitchColor1', default: '#ff00c1', label: 'Color 1' },
                          { key: 'glitchColor2', default: '#00fff9', label: 'Color 2' },
                          { key: 'borderColor', default: '#d946ef', label: 'Border' },
                        ].map(({ key, default: defaultColor, label }) => (
                          <div key={key} className="flex flex-col items-center gap-1">
                            <input
                              type="color"
                              value={config.footerData?.[key] || defaultColor}
                              onChange={(e) => onConfigChange({
                                ...config,
                                footerData: { ...config.footerData, [key]: e.target.value }
                              })}
                              className="w-10 h-10 rounded cursor-pointer"
                            />
                            <span className="text-[10px] text-neutral-500">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Navigation Links */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide">Navigation Links</p>
                      <div className="space-y-2">
                        {(config.footerData?.navLinks || [
                          { label: 'Network', link: '' },
                          { label: 'Security', link: '' },
                          { label: 'Data', link: '' },
                          { label: 'Careers', link: '' }
                        ]).map((item: any, idx: number) => (
                          <div key={idx} className="bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <div className="flex items-center gap-2 mb-1">
                              <input
                                type="text"
                                value={item.label}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Network', link: '' },
                                    { label: 'Security', link: '' },
                                    { label: 'Data', link: '' },
                                    { label: 'Careers', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-white focus:border-orange-500 outline-none uppercase"
                                placeholder="Link label..."
                              />
                              <button
                                onClick={() => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Network', link: '' },
                                    { label: 'Security', link: '' },
                                    { label: 'Data', link: '' },
                                    { label: 'Careers', link: '' }
                                  ];
                                  const newLinks = links.filter((_: any, i: number) => i !== idx);
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="p-1 text-neutral-500 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Link size={10} className="text-neutral-600" />
                              <select
                                value={item.link || ''}
                                onChange={(e) => {
                                  const links = config.footerData?.navLinks || [
                                    { label: 'Network', link: '' },
                                    { label: 'Security', link: '' },
                                    { label: 'Data', link: '' },
                                    { label: 'Careers', link: '' }
                                  ];
                                  const newLinks = [...links];
                                  newLinks[idx] = { ...newLinks[idx], link: e.target.value };
                                  onConfigChange({
                                    ...config,
                                    footerData: { ...config.footerData, navLinks: newLinks }
                                  });
                                }}
                                className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                              >
                                <option value="">No link</option>
                                {localPages.map(page => (
                                  <option key={page.id} value={page.slug || '/'}>
                                    {page.title || page.slug}
                                  </option>
                                ))}
                                <option value="external">Custom URL...</option>
                              </select>
                            </div>
                            {item.link === 'external' && (
                              <div className="flex items-center gap-2 mt-1">
                                <ExternalLink size={10} className="text-neutral-600" />
                                <input
                                  type="text"
                                  value={item.externalUrl || ''}
                                  onChange={(e) => {
                                    const links = config.footerData?.navLinks || [
                                      { label: 'Network', link: '' },
                                      { label: 'Security', link: '' },
                                      { label: 'Data', link: '' },
                                      { label: 'Careers', link: '' }
                                    ];
                                    const newLinks = [...links];
                                    newLinks[idx] = { ...newLinks[idx], externalUrl: e.target.value };
                                    onConfigChange({
                                      ...config,
                                      footerData: { ...config.footerData, navLinks: newLinks }
                                    });
                                  }}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-[10px] text-neutral-400 focus:border-orange-500 outline-none"
                                  placeholder="https://..."
                                />
                              </div>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const links = config.footerData?.navLinks || [
                              { label: 'Network', link: '' },
                              { label: 'Security', link: '' },
                              { label: 'Data', link: '' },
                              { label: 'Careers', link: '' }
                            ];
                            const newLinks = [...links, { label: 'NEW', link: '' }];
                            onConfigChange({
                              ...config,
                              footerData: { ...config.footerData, navLinks: newLinks }
                            });
                          }}
                          className="w-full py-1.5 text-[10px] text-neutral-500 hover:text-orange-400 border border-dashed border-neutral-700 hover:border-orange-500 rounded transition-colors"
                        >
                          + Add Link
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Reset to Defaults */}
                <button
                  onClick={() => onConfigChange({ 
                    ...config, 
                    footerBackgroundColor: undefined, 
                    footerTextColor: undefined, 
                    footerAccentColor: undefined 
                  })}
                  className="w-full py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
                >
                  Reset to Default Colors
                </button>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-between items-center shrink-0">
            <p className="text-xs text-neutral-500">
              Current: <span className="text-white font-medium">{FOOTER_OPTIONS.find(f => f.id === config.footerStyle)?.name || 'Columns'}</span>
            </p>
            <button 
              onClick={() => setIsFooterModalOpen(false)}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold text-sm transition-colors text-white"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- HERO MODAL (Footer-style layout with sticky preview) ---
  const [warningFields, setWarningFields] = useState<string[]>([]);
  const [pendingVariant, setPendingVariant] = useState<string | null>(null);

  // --- GRID MODAL ---
  const [gridWarningFields, setGridWarningFields] = useState<string[]>([]);
  const [gridPendingVariant, setGridPendingVariant] = useState<string | null>(null);

  const renderGridModal = () => {
    if (!isGridModalOpen) return null;

    // Get current grid block
    const activeBlock = activePage?.blocks?.find(b => b.id === selectedBlockId);
    if (!activeBlock || activeBlock.type !== 'system-grid') return null;

    const currentVariant = activeBlock.variant || config.productCardStyle || 'classic';
    const gridData = activeBlock.data || {};
    const CardComponent = PRODUCT_CARD_COMPONENTS[currentVariant as ProductCardStyleId] || PRODUCT_CARD_COMPONENTS['classic'];

    // Handle variant change
    const handleGridStyleChange = (newVariant: string) => {
      // For grid cards, we usually don't lose data since it's common (heading/subheading)
      setLocalPages(prev => prev.map(p => {
        if (p.id !== activePage.id) return p;
        return {
          ...p,
          blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: newVariant } : b)
        };
      }));
      setHasUnsavedChanges(true);
    };

    // Update grid data
    const updateGridData = (updates: any) => {
      setLocalPages(prev => prev.map(p => {
        if (p.id !== activePage.id) return p;
        return {
          ...p,
          blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, data: { ...b.data, ...updates } } : b)
        };
      }));
      setHasUnsavedChanges(true);
    };

    const generateGridCopy = async (field: string) => {
      if (!genAI) return;
      try {
        const model = (genAI as any).getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const variant = PRODUCT_CARD_OPTIONS.find(o => o.id === currentVariant)?.name || "product grid";
        const industry = config.theme_primary || "modern retail";
        
        const prompt = `Generate a high-converting ${field} for a ${variant} on a ${industry} store.
          Keep it short (under ${field === 'heading' ? '8' : '20'} words).
          Return ONLY the text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().replace(/\"/g, '');
        updateGridData({ [field]: text });
      } catch (error) {
        console.error("Grid AI generation failed:", error);
      }
    };

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Modal Header */}
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Grid size={20} className="text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Product Grid Studio</h3>
                <p className="text-xs text-neutral-500">Configure your product display engine</p>
              </div>
            </div>
            <button 
              onClick={() => { setIsGridModalOpen(false); setGridWarningFields([]); setGridPendingVariant(null); }} 
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content - Side by Side */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PANEL - Editing Tools (30%) */}
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 relative">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {/* 1. Card Style Selection */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Palette size={14} /> Card Styles
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {PRODUCT_CARD_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleGridStyleChange(opt.id)}
                        className={`text-left p-3 rounded-lg border transition-all relative ${currentVariant === opt.id
                          ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/50'
                          : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900'
                        }`}
                      >
                        <span className={`text-sm font-bold block ${currentVariant === opt.id ? 'text-green-400' : 'text-white'}`}>
                          {opt.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-800 my-4"></div>

                {/* 2. Content & Copy */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Type size={14} /> Header Branding
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Section Title</label>
                        <button 
                          onClick={() => generateGridCopy('heading')}
                          className="p-1 text-green-400 hover:text-green-300 transition-colors"
                          title="Generate with AI"
                        >
                          <Wand2 size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={gridData.heading || ''}
                        onChange={(e) => updateGridData({ heading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                        placeholder="e.g., Best Sellers"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Subtitle</label>
                        <button 
                          onClick={() => generateGridCopy('subheading')}
                          className="p-1 text-green-400 hover:text-green-300 transition-colors"
                          title="Generate with AI"
                        >
                          <Wand2 size={12} />
                        </button>
                      </div>
                      <textarea
                        value={gridData.subheading || ''}
                        onChange={(e) => updateGridData({ subheading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none resize-none"
                        rows={2}
                        placeholder="Describe this collection..."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-800 my-4"></div>

                {/* 3. Product Sourcing */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Layers size={14} /> Product Source
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400">Source Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'all', label: 'All Products', icon: Package },
                          { id: 'category', label: 'By Category', icon: Tag },
                          { id: 'collection', label: 'Collection', icon: Layers },
                          { id: 'manual', label: 'Manual Pick', icon: Plus }
                        ].map(s => (
                          <button
                            key={s.id}
                            onClick={() => updateGridData({ productSource: s.id })}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-colors ${
                              (gridData.productSource || 'all') === s.id
                                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-600'
                            }`}
                          >
                            <s.icon size={14} />
                            <span>{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {gridData.productSource === 'category' && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Select Category</label>
                        <select
                          value={gridData.productCategory || ''}
                          onChange={(e) => updateGridData({ productCategory: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                        >
                          <option value="">Choose Category...</option>
                          {[...new Set(products.map(p => p.category))].filter(Boolean).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {gridData.productSource === 'collection' && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Select Collection</label>
                        <select
                          value={gridData.productCollection || ''}
                          onChange={(e) => updateGridData({ productCollection: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                        >
                          <option value="">Choose Collection...</option>
                          {collections.map(col => (
                            <option key={col.id} value={col.id}>{col.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-neutral-800 my-4"></div>

                {/* Color Controls */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Palette size={14} /> Colors
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.backgroundColor || '#ffffff'}
                        onChange={(e) => updateGridData({ backgroundColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Background</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.headingColor || '#000000'}
                        onChange={(e) => updateGridData({ headingColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Heading</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.subheadingColor || '#6b7280'}
                        onChange={(e) => updateGridData({ subheadingColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Subheading</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.cardBgColor || '#ffffff'}
                        onChange={(e) => updateGridData({ cardBgColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Card BG</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.productNameColor || '#000000'}
                        onChange={(e) => updateGridData({ productNameColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Product Name</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.priceColor || '#000000'}
                        onChange={(e) => updateGridData({ priceColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Price</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.buttonBgColor || '#000000'}
                        onChange={(e) => updateGridData({ buttonBgColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Button BG</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.buttonTextColor || '#ffffff'}
                        onChange={(e) => updateGridData({ buttonTextColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Button Text</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={gridData.borderColor || '#e5e7eb'}
                        onChange={(e) => updateGridData({ borderColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Borders</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-800 my-4"></div>

                {/* 4. Display Settings */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Settings size={14} /> Layout Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-neutral-400">Columns (Desktop)</label>
                        <span className="text-xs text-green-500 font-bold">{gridData.columns || 4}</span>
                      </div>
                      <div className="flex gap-2">
                        {[2, 3, 4, 5, 6].map(num => (
                          <button
                            key={num}
                            onClick={() => updateGridData({ columns: num })}
                            className={`flex-1 py-1.5 rounded-md border text-xs transition-colors ${
                              (gridData.columns || 4) === num
                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-600'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded-lg border border-neutral-700">
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">Show Filters</span>
                        <span className="text-[10px] text-neutral-500">Allow customers to filter by category</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={gridData.showFilters || false}
                        onChange={(e) => updateGridData({ showFilters: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-green-500 focus:ring-green-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded-lg border border-neutral-700">
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">Show Sorting</span>
                        <span className="text-[10px] text-neutral-500">Price, Featured, Newest</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={gridData.showSort !== false}
                        onChange={(e) => updateGridData({ showSort: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-green-500 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Done button */}
              <div className="p-4 border-t border-neutral-800 bg-neutral-950 shrink-0">
                <button 
                  onClick={() => setIsGridModalOpen(false)}
                  className="w-full px-6 py-2.5 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-sm transition-colors text-white"
                >
                  Done
                </button>
              </div>
            </div>

            {/* RIGHT PANEL - Live Preview (70%) */}
            <div className="flex-1 bg-neutral-800 flex flex-col">
              <div className="p-3 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Product Grid Preview</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] text-neutral-500">Updates instantly</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] p-8">
                <div className="bg-white min-h-full rounded-xl shadow-2xl p-8 overflow-hidden">
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-neutral-900 mb-2">{gridData.heading || 'Latest Collection.'}</h2>
                    <p className="text-neutral-500 max-w-lg">{gridData.subheading || 'Browse our newest arrivals and curated essentials.'}</p>
                  </div>
                  
                  {/* Grid Preview Logic */}
                  {(() => {
                    let previewProducts = [...products];
                    if (gridData.productSource === 'category' && gridData.productCategory) {
                      previewProducts = previewProducts.filter(p => p.category === gridData.productCategory);
                    } else if (gridData.productSource === 'collection' && gridData.productCollection) {
                      const col = collections.find(c => c.id === gridData.productCollection);
                      if (col) {
                        if (col.type === 'manual' && col.product_ids) {
                          previewProducts = col.product_ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
                        } else if (col.conditions?.category_id) {
                          previewProducts = previewProducts.filter(p => p.category_id === col.conditions?.category_id);
                        }
                      }
                    }

                    const cols = gridData.columns || 4;
                    
                    return (
                      <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols}`}>
                        {previewProducts.length > 0 ? (
                          previewProducts.slice(0, cols * 2).map((product, idx) => (
                            <CardComponent
                              key={product.id || idx}
                              product={product}
                              onAddToCart={() => {}}
                              primaryColor={config.primaryColor}
                            />
                          ))
                        ) : (
                          <div className="col-span-full py-20 text-center bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
                            <Package className="mx-auto text-neutral-300 mb-4" size={48} />
                            <p className="text-neutral-500 font-medium">No products found in this selection</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- COLLECTION MODAL ---
  const renderCollectionModal = () => {
    if (!isCollectionModalOpen) return null;

    // Get current collection block
    const activeBlock = activePage?.blocks?.find(b => b.id === selectedBlockId);
    if (!activeBlock || activeBlock.type !== 'system-collection') return null;

    const currentVariant = activeBlock.variant || 'collection-list';
    const collectionData = activeBlock.data || {};
    const CollectionComponent = COLLECTION_COMPONENTS[currentVariant] || COLLECTION_COMPONENTS['collection-list'];

    // Handle variant change
    const handleCollectionStyleChange = (newVariant: string) => {
      setLocalPages(prev => prev.map(p => {
        if (p.id !== activePage.id) return p;
        return {
          ...p,
          blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: newVariant } : b)
        };
      }));
      setHasUnsavedChanges(true);
    };

    // Update collection data
    const updateCollectionData = (updates: any) => {
      setLocalPages(prev => prev.map(p => {
        if (p.id !== activePage.id) return p;
        return {
          ...p,
          blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, data: { ...b.data, ...updates } } : b)
        };
      }));
      setHasUnsavedChanges(true);
    };

    const generateCollectionCopy = async (field: 'heading' | 'subheading') => {
      if (!genAI) return;
      try {
        const model = (genAI as any).getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const industry = config.theme_primary || "modern retail";
        const variant = COLLECTION_OPTIONS.find(o => o.id === currentVariant)?.name || "product collection";
        
        const prompt = `Generate a catchy, high-conversion ${field} for a ${variant} on a ${industry} e-commerce site. 
          Keep it short (under ${field === 'heading' ? '8' : '20'} words). 
          Return ONLY the text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().replace(/\"/g, '');
        updateCollectionData({ [field]: text });
      } catch (error) {
        console.error("AI Generation failed:", error);
      }
    };

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Modal Header */}
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Layers size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Collection Studio</h3>
                <p className="text-xs text-neutral-500">Design your collections and lookbooks</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCollectionModalOpen(false)} 
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content - Side by Side */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PANEL - Editing Tools (30%) */}
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 relative">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {/* 1. Layout Selection */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <LayoutTemplate size={14} /> Collection Layouts
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {COLLECTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleCollectionStyleChange(opt.id)}
                        className={`text-left p-3 rounded-lg border transition-all relative ${currentVariant === opt.id
                          ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/50'
                          : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900'
                        }`}
                      >
                        <span className={`text-sm font-bold block ${currentVariant === opt.id ? 'text-blue-400' : 'text-white'}`}>
                          {opt.name}
                        </span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-800 my-4"></div>

                {/* 2. Content Branding */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Type size={14} /> Copy & Messaging
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Heading</label>
                        <button 
                          onClick={() => generateCollectionCopy('heading')}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Generate with AI"
                        >
                          <Wand2 size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={collectionData.heading || ''}
                        onChange={(e) => updateCollectionData({ heading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                        placeholder="e.g., Summer Lookbook"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Subheading</label>
                        <button 
                          onClick={() => generateCollectionCopy('subheading')}
                          className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                          title="Generate with AI"
                        >
                          <Wand2 size={12} />
                        </button>
                      </div>
                      <textarea
                        value={collectionData.subheading || ''}
                        onChange={(e) => updateCollectionData({ subheading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none resize-none"
                        rows={2}
                        placeholder="Optional subtitle..."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-neutral-800 my-4"></div>

                {/* 3. Product Sourcing (For valid catalog variants) */}
                {['featured-collection', 'featured-product', 'collection-grid-tight', 'collection-masonry', 'collection-carousel', 'collection-tabs', 'collection-lookbook', 'collection-split'].includes(currentVariant) && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Database size={14} /> Product Catalog Setup
                    </h4>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Source Selection</label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'all', label: 'All Store', icon: Package },
                            { id: 'category', label: 'By Category', icon: Tag },
                            { id: 'collection', label: 'Collection', icon: Layers },
                            { id: 'manual', label: 'Manual Pick', icon: MousePointerClick }
                          ].map(s => (
                            <button
                              key={s.id}
                              onClick={() => updateCollectionData({ productSource: s.id })}
                              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-colors ${
                                (collectionData.productSource || 'all') === s.id
                                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                  : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-600'
                              }`}
                            >
                              <s.icon size={14} />
                              <span>{s.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {collectionData.productSource === 'category' && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-neutral-400">Select Category</label>
                          <select
                            value={collectionData.productCategory || ''}
                            onChange={(e) => updateCollectionData({ productCategory: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                          >
                            <option value="">Choose Category...</option>
                            {[...new Set(products.map(p => p.category))].filter(Boolean).map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {collectionData.productSource === 'collection' && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-neutral-400">Select Collection</label>
                          <select
                            value={collectionData.productCollection || ''}
                            onChange={(e) => updateCollectionData({ productCollection: e.target.value })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                          >
                            <option value="">Choose Collection...</option>
                            {collections.map(col => (
                              <option key={col.id} value={col.id}>{col.name}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {collectionData.productSource === 'manual' && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-neutral-400">Select Products ({ (collectionData.manualProductIds || []).length })</label>
                          <div className="max-h-48 overflow-y-auto custom-scrollbar border border-neutral-800 rounded-lg p-2 space-y-1 bg-black/20">
                            {products.map(p => {
                              const isSelected = (collectionData.manualProductIds || []).includes(p.id);
                              return (
                                <button
                                  key={p.id}
                                  onClick={() => {
                                    const currentIds = collectionData.manualProductIds || [];
                                    const nextIds = isSelected 
                                      ? currentIds.filter(id => id !== p.id)
                                      : [...currentIds, p.id];
                                    updateCollectionData({ manualProductIds: nextIds });
                                  }}
                                  className={`w-full flex items-center justify-between p-2 rounded transition-colors ${isSelected ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-neutral-800 text-neutral-400'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <img src={p.image} className="w-6 h-6 rounded object-cover" alt="" />
                                    <span className="text-[10px] truncate max-w-[120px]">{p.name}</span>
                                  </div>
                                  {isSelected && <Check size={10} />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-neutral-800 my-4"></div>
                  </div>
                )}

                {/* Color Controls */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Palette size={14} /> Colors
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.backgroundColor || '#ffffff'}
                        onChange={(e) => updateCollectionData({ backgroundColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Background</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.headingColor || '#000000'}
                        onChange={(e) => updateCollectionData({ headingColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Heading</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.subheadingColor || '#6b7280'}
                        onChange={(e) => updateCollectionData({ subheadingColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Subheading</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.cardBgColor || '#ffffff'}
                        onChange={(e) => updateCollectionData({ cardBgColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Card BG</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.productNameColor || '#000000'}
                        onChange={(e) => updateCollectionData({ productNameColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Product Name</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.priceColor || '#000000'}
                        onChange={(e) => updateCollectionData({ priceColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Price</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.buttonBgColor || '#000000'}
                        onChange={(e) => updateCollectionData({ buttonBgColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Button BG</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.buttonTextColor || '#ffffff'}
                        onChange={(e) => updateCollectionData({ buttonTextColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Button Text</span>
                    </div>
                    <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={collectionData.accentColor || '#3b82f6'}
                        onChange={(e) => updateCollectionData({ accentColor: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">Accent</span>
                    </div>
                  </div>
                </div>

                {/* 4. Appearance Settings */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Sliders size={14} /> Display Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded-lg border border-neutral-700">
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">Full Width</span>
                        <span className="text-[10px] text-neutral-500">Span across the entire screen</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={collectionData.fullWidth || false}
                        onChange={(e) => updateCollectionData({ fullWidth: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-neutral-900/50 rounded-lg border border-neutral-700">
                      <div className="flex flex-col">
                        <span className="text-sm text-white font-medium">Dark Mode</span>
                        <span className="text-[10px] text-neutral-500">Use dark background theme</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={collectionData.darkMode || false}
                        onChange={(e) => updateCollectionData({ darkMode: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Product Limit</label>
                        <span className="text-xs text-blue-400 font-bold">{collectionData.productCount || 8}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="24"
                        value={collectionData.productCount || 8}
                        onChange={(e) => updateCollectionData({ productCount: parseInt(e.target.value) })}
                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">Default Sorting</span>
                        <select
                          value={collectionData.sortBy || 'newest'}
                          onChange={(e) => updateCollectionData({ sortBy: e.target.value })}
                          className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-[10px] text-white focus:border-blue-500 outline-none"
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                          <option value="name-asc">Name: A-Z</option>
                          <option value="name-desc">Name: Z-A</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">Section Style</span>
                        <div className="flex gap-1">
                          {['clean', 'glass', 'bordered'].map(s => (
                            <button
                              key={s}
                              onClick={() => updateCollectionData({ sectionStyle: s })}
                              className={`px-2 py-1 rounded text-[10px] capitalize transition-colors ${
                                (collectionData.sectionStyle || 'clean') === s
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 border-t border-neutral-800 bg-neutral-950 shrink-0">
                <button 
                  onClick={() => setIsCollectionModalOpen(false)}
                  className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-sm transition-colors text-white"
                >
                  Done
                </button>
              </div>
            </div>

            {/* RIGHT PANEL - Preview (70%) */}
            <div className="flex-1 bg-neutral-800 flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px]"></div>
              
              <div className="relative p-3 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Live Preview</span>
                  <div className="h-4 w-px bg-neutral-700"></div>
                  <div className="flex items-center gap-2">
                    <Monitor size={14} className="text-blue-500" />
                    <span className="text-[10px] text-neutral-500">Desktop View</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-[10px] text-neutral-500">Live Editor Active</span>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-12 custom-scrollbar relative z-10 flex items-center justify-center">
                {/* Floating Layout Selector */}
                <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                  <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-700 p-1.5 rounded-xl shadow-2xl flex flex-col gap-1 ring-1 ring-white/10">
                    <div className="px-2 py-1 mb-1 border-b border-neutral-800">
                      <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Quick Layouts</span>
                    </div>
                    {COLLECTION_OPTIONS.slice(0, 4).map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => handleCollectionStyleChange(opt.id)}
                        className={`p-2 rounded-lg transition-all flex items-center gap-3 group ${currentVariant === opt.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'hover:bg-white/5 text-neutral-400'}`}
                      >
                        <LayoutTemplate size={14} className={currentVariant === opt.id ? 'text-white' : 'text-neutral-500 group-hover:text-blue-400'} />
                        <span className="text-[10px] font-bold whitespace-nowrap">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${collectionData.darkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'}`}>
                  <div className="relative">
                    {(() => {
                        const previewProducts = getFilteredProductsUtil(collectionData, products, collections);
                        return (
                          <CollectionComponent 
                            data={collectionData} 
                            products={previewProducts}
                            isEditable={false} 
                            onUpdate={() => {}} 
                          />
                        );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ========== ADDITIONAL SECTION MODALS (30/70 Split Pattern) ==========

  const renderScrollModal = () => {
    if (!isScrollModalOpen || !selectedBlockId || !activeBlock) return null;
    const scrollData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'logo-marquee';
    const ScrollComponent = SCROLL_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-600/20 rounded-lg"><Repeat size={20} className="text-cyan-400" /></div>
              <div>
                <h3 className="text-white font-bold">Scroll Section Studio</h3>
                <p className="text-xs text-neutral-500">Animated scrolling content</p>
              </div>
            </div>
            <button onClick={() => setIsScrollModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Scroll Styles</h4>
              <div className="grid grid-cols-1 gap-2">
                {SCROLL_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...scrollData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-cyan-600/20 border-cyan-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {ScrollComponent && <ScrollComponent data={scrollData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSocialModal = () => {
    if (!isSocialModalOpen || !selectedBlockId || !activeBlock) return null;
    const socialData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'grid-classic';
    const SocialComponent = SOCIAL_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-600/20 rounded-lg"><Share2 size={20} className="text-pink-400" /></div>
              <div>
                <h3 className="text-white font-bold">Social Media Studio</h3>
                <p className="text-xs text-neutral-500">Instagram & social feeds</p>
              </div>
            </div>
            <button onClick={() => setIsSocialModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Social Layouts</h4>
              <div className="grid grid-cols-1 gap-2">
                {SOCIAL_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...socialData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-pink-600/20 border-pink-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {SocialComponent && <SocialComponent storeName={config.name} primaryColor={config.primaryColor} data={socialData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRichTextModal = () => {
    if (!isRichTextModalOpen || !selectedBlockId || !activeBlock) return null;
    const richTextData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'rt-centered';
    const RichTextComponent = RICH_TEXT_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg"><Type size={20} className="text-blue-400" /></div>
              <div>
                <h3 className="text-white font-bold">Rich Text Studio</h3>
                <p className="text-xs text-neutral-500">Formatted text content</p>
              </div>
            </div>
            <button onClick={() => setIsRichTextModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Text Styles</h4>
              <div className="grid grid-cols-1 gap-2">
                {RICH_TEXT_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...richTextData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {RichTextComponent && <RichTextComponent data={richTextData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmailModal = () => {
    if (!isEmailModalOpen || !selectedBlockId || !activeBlock) return null;
    const emailData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'email-minimal';
    const EmailComponent = EMAIL_SIGNUP_COMPONENTS[currentVariant];

    // Field mapping for email variants
    const EMAIL_FIELDS: Record<string, string[]> = {
      'email-minimal': ['heading', 'subheading', 'buttonText', 'placeholderText'],
      'email-split': ['heading', 'subheading', 'buttonText', 'placeholderText', 'image'],
      'email-card': ['heading', 'subheading', 'buttonText', 'placeholderText', 'disclaimer'],
    };

    const availableFields = EMAIL_FIELDS[currentVariant] || [];

    // Comprehensive color fields for all text and UI elements
    const colorFields = [
      { key: 'backgroundColor', label: 'Background', defaultValue: currentVariant === 'email-minimal' ? '#171717' : '#ffffff' },
      { key: 'headingColor', label: 'Heading', defaultValue: currentVariant === 'email-minimal' ? '#ffffff' : '#000000' },
      { key: 'subheadingColor', label: 'Subheading', defaultValue: '#737373' },
      { key: 'buttonBgColor', label: 'Button BG', defaultValue: currentVariant === 'email-minimal' ? '#ffffff' : '#000000' },
      { key: 'buttonTextColor', label: 'Button Text', defaultValue: currentVariant === 'email-minimal' ? '#000000' : '#ffffff' },
      { key: 'inputBgColor', label: 'Input BG', defaultValue: currentVariant === 'email-minimal' ? '#ffffff10' : '#fafafa' },
      { key: 'inputBorderColor', label: 'Input Border', defaultValue: currentVariant === 'email-minimal' ? '#ffffff33' : '#e5e5e5' },
      { key: 'inputTextColor', label: 'Input Text', defaultValue: currentVariant === 'email-minimal' ? '#ffffff' : '#000000' },
      { key: 'disclaimerColor', label: 'Disclaimer', defaultValue: '#a3a3a3' },
    ];

    const updateEmailData = (updates: Partial<typeof emailData>) => {
      updateActiveBlockData(selectedBlockId, { ...emailData, ...updates });
    };

    const generateEmailCopy = async (field: string) => {
      try {
        const genAI = new GoogleGenerativeAI(apiKeys.gemini || '');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        
        const prompts: Record<string, string> = {
          heading: `Generate a catchy, short email signup heading for an ecommerce newsletter (5-8 words max). Return ONLY the text, no quotes or extra formatting.`,
          subheading: `Generate a compelling email signup subheading that explains the benefits of joining (15-25 words). Return ONLY the text, no quotes or extra formatting.`,
          buttonText: `Generate short CTA button text for newsletter signup (1-3 words). Return ONLY the text, no quotes or extra formatting.`,
          disclaimer: `Generate a short privacy/spam disclaimer for email signup form (8-12 words). Return ONLY the text, no quotes or extra formatting.`,
        };

        const result = await model.generateContent(prompts[field]);
        const text = result.response.text().trim();
        updateEmailData({ [field]: text });
      } catch (error) {
        console.error('AI generation failed:', error);
      }
    };

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600/20 rounded-lg"><Mail size={20} className="text-emerald-400" /></div>
              <div>
                <h3 className="text-white font-bold">Email Signup Studio</h3>
                <p className="text-xs text-neutral-500">Newsletter & lead capture</p>
              </div>
            </div>
            <button onClick={() => setIsEmailModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Email Styles</h4>
              <div className="grid grid-cols-1 gap-2">
                {EMAIL_SIGNUP_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...emailData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-800 my-4"></div>

              {/* Email Customization Fields */}
              <div>
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Settings size={14} /> Customize Content
                </h4>

                <div className="space-y-4">
                  {availableFields.includes('heading') && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Heading</label>
                        <button 
                          onClick={() => generateEmailCopy('heading')}
                          className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                          title="Generate with AI"
                        >
                          <Wand2 size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={emailData.heading || ''}
                        onChange={(e) => updateEmailData({ heading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                        placeholder="Join the Newsletter"
                      />
                    </div>
                  )}

                  {availableFields.includes('subheading') && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Subheading</label>
                        <button 
                          onClick={() => generateEmailCopy('subheading')}
                          className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                          title="Generate with AI"
                        >
                          <Wand2 size={12} />
                        </button>
                      </div>
                      <textarea
                        value={emailData.subheading || ''}
                        onChange={(e) => updateEmailData({ subheading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none resize-none"
                        rows={3}
                        placeholder="Subscribe to get special offers..."
                      />
                    </div>
                  )}

                  {availableFields.includes('buttonText') && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Button Text</label>
                        <button 
                          onClick={() => generateEmailCopy('buttonText')}
                          className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                          title="Generate with AI"
                        >
                          <Wand2 size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={emailData.buttonText || ''}
                        onChange={(e) => updateEmailData({ buttonText: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                        placeholder="Subscribe"
                      />
                    </div>
                  )}

                  {availableFields.includes('placeholderText') && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400">Email Placeholder</label>
                      <input
                        type="text"
                        value={emailData.placeholderText || ''}
                        onChange={(e) => updateEmailData({ placeholderText: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                        placeholder="Enter your email"
                      />
                    </div>
                  )}

                  {availableFields.includes('disclaimer') && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-neutral-400">Disclaimer Text</label>
                        <button 
                          onClick={() => generateEmailCopy('disclaimer')}
                          className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                          title="Generate with AI"
                        >
                          <Wand2 size={12} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={emailData.disclaimer || ''}
                        onChange={(e) => updateEmailData({ disclaimer: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                        placeholder="No spam, unsubscribe anytime."
                      />
                    </div>
                  )}

                  {availableFields.includes('image') && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400">Background Image</label>
                      <input
                        type="text"
                        value={emailData.image || ''}
                        onChange={(e) => updateEmailData({ image: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                        placeholder="https://..."
                      />
                      <button
                        onClick={() => {
                          // Open media library in future
                          console.log('Media library integration coming soon');
                        }}
                        className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <ImageIcon size={14} />
                        Choose from Library
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-800 my-4"></div>

              {/* Color Controls */}
              <div>
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Palette size={14} /> Colors
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {colorFields.map(({ key, label, defaultValue }) => (
                    <div key={key} className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                      <input
                        type="color"
                        value={emailData[key] || defaultValue}
                        onChange={(e) => updateEmailData({ [key]: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-[10px] text-neutral-300 leading-tight">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {EmailComponent && <EmailComponent data={emailData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCollapsibleModal = () => {
    if (!isCollapsibleModalOpen || !selectedBlockId || !activeBlock) return null;
    const collapsibleData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'col-simple';
    const CollapsibleComponent = COLLAPSIBLE_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600/20 rounded-lg"><List size={20} className="text-indigo-400" /></div>
              <div>
                <h3 className="text-white font-bold">FAQ / Accordion Studio</h3>
                <p className="text-xs text-neutral-500">Collapsible content sections</p>
              </div>
            </div>
            <button onClick={() => setIsCollapsibleModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Accordion Styles</h4>
              <div className="grid grid-cols-1 gap-2">
                {COLLAPSIBLE_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...collapsibleData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {CollapsibleComponent && <CollapsibleComponent data={collapsibleData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLogoListModal = () => {
    if (!isLogoListModalOpen || !selectedBlockId || !activeBlock) return null;
    const logoData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'logo-grid';
    const LogoComponent = LOGO_LIST_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-600/20 rounded-lg"><Grid size={20} className="text-violet-400" /></div>
              <div>
                <h3 className="text-white font-bold">Logo List Studio</h3>
                <p className="text-xs text-neutral-500">Partner & client logos</p>
              </div>
            </div>
            <button onClick={() => setIsLogoListModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Logo Layouts</h4>
              <div className="grid grid-cols-1 gap-2">
                {LOGO_LIST_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...logoData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-violet-600/20 border-violet-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {LogoComponent && <LogoComponent data={logoData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPromoModal = () => {
    if (!isPromoModalOpen || !selectedBlockId || !activeBlock) return null;
    const promoData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'promo-top';
    const PromoComponent = PROMO_BANNER_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-600/20 rounded-lg"><Zap size={20} className="text-amber-400" /></div>
              <div>
                <h3 className="text-white font-bold">Promo Banner Studio</h3>
                <p className="text-xs text-neutral-500">Promotional announcements</p>
              </div>
            </div>
            <button onClick={() => setIsPromoModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3 flex items-center gap-2">
                <Palette size={14} /> Banner Styles
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {PROMO_BANNER_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...promoData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-amber-600/20 border-amber-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>

              <div className="border-t border-neutral-800 my-4"></div>

              {/* Content Fields */}
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3 flex items-center gap-2">
                <Type size={14} /> Content
              </h4>
              <div className="space-y-4">
                {currentVariant === 'promo-top' && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400">Banner Text</label>
                    <input
                      type="text"
                      value={promoData.text || ''}
                      onChange={(e) => updateActiveBlockData(selectedBlockId, { ...promoData, text: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                      placeholder="e.g., Free shipping on orders over $100"
                    />
                  </div>
                )}

                {currentVariant === 'promo-hero' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400">Heading</label>
                      <input
                        type="text"
                        value={promoData.heading || ''}
                        onChange={(e) => updateActiveBlockData(selectedBlockId, { ...promoData, heading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                        placeholder="e.g., End of Season Sale"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400">Subheading</label>
                      <textarea
                        value={promoData.subheading || ''}
                        onChange={(e) => updateActiveBlockData(selectedBlockId, { ...promoData, subheading: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 outline-none resize-none"
                        rows={2}
                        placeholder="Describe the promotion..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-400">Button Text</label>
                      <input
                        type="text"
                        value={promoData.buttonText || ''}
                        onChange={(e) => updateActiveBlockData(selectedBlockId, { ...promoData, buttonText: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 outline-none"
                        placeholder="e.g., Shop Sale"
                      />
                      <div className="flex items-center gap-2 mt-1">
                        <Link size={12} className="text-neutral-600" />
                        <select
                          value={promoData.buttonLink || ''}
                          onChange={(e) => updateActiveBlockData(selectedBlockId, { ...promoData, buttonLink: e.target.value })}
                          className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 focus:border-amber-500 outline-none"
                        >
                          <option value="">No link</option>
                          {localPages.map(page => (
                            <option key={page.id} value={page.slug || '/'}>
                              {page.title || page.slug}
                            </option>
                          ))}
                          <option value="external">Custom URL...</option>
                        </select>
                      </div>
                      {promoData.buttonLink === 'external' && (
                        <div className="flex items-center gap-2 mt-1">
                          <ExternalLink size={12} className="text-neutral-600" />
                          <input
                            type="text"
                            value={promoData.buttonExternalUrl || ''}
                            onChange={(e) => updateActiveBlockData(selectedBlockId, { ...promoData, buttonExternalUrl: e.target.value })}
                            className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 focus:border-amber-500 outline-none"
                            placeholder="https://..."
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {PromoComponent && <PromoComponent data={promoData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGalleryModal = () => {
    if (!isGalleryModalOpen || !selectedBlockId || !activeBlock) return null;
    const galleryData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'gal-grid';
    const GalleryComponent = GALLERY_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-600/20 rounded-lg"><ImageIcon size={20} className="text-rose-400" /></div>
              <div>
                <h3 className="text-white font-bold">Gallery Studio</h3>
                <p className="text-xs text-neutral-500">Image galleries & portfolios</p>
              </div>
            </div>
            <button onClick={() => setIsGalleryModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Gallery Layouts</h4>
              <div className="grid grid-cols-1 gap-2">
                {GALLERY_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...galleryData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-rose-600/20 border-rose-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {GalleryComponent && <GalleryComponent data={galleryData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBlogModal = () => {
    if (!isBlogModalOpen || !selectedBlockId || !activeBlock) return null;
    const blogData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'blog-grid';
    const BlogComponent = BLOG_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600/20 rounded-lg"><BookOpen size={20} className="text-teal-400" /></div>
              <div>
                <h3 className="text-white font-bold">Blog Studio</h3>
                <p className="text-xs text-neutral-500">Blog posts & articles</p>
              </div>
            </div>
            <button onClick={() => setIsBlogModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Blog Layouts</h4>
              <div className="grid grid-cols-1 gap-2">
                {BLOG_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...blogData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-teal-600/20 border-teal-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {BlogComponent && <BlogComponent data={blogData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVideoModal = () => {
    if (!isVideoModalOpen || !selectedBlockId || !activeBlock) return null;
    const videoData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'vid-full';
    const VideoComponent = VIDEO_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-lg"><Play size={20} className="text-red-400" /></div>
              <div>
                <h3 className="text-white font-bold">Video Studio</h3>
                <p className="text-xs text-neutral-500">Video embeds & players</p>
              </div>
            </div>
            <button onClick={() => setIsVideoModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Video Layouts</h4>
              <div className="grid grid-cols-1 gap-2">
                {VIDEO_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...videoData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-red-600/20 border-red-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {VideoComponent && <VideoComponent data={videoData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContactModal = () => {
    if (!isContactModalOpen || !selectedBlockId || !activeBlock) return null;
    const contactData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'contact-simple';
    const ContactComponent = CONTACT_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-600/20 rounded-lg"><Phone size={20} className="text-sky-400" /></div>
              <div>
                <h3 className="text-white font-bold">Contact Form Studio</h3>
                <p className="text-xs text-neutral-500">Contact & inquiry forms</p>
              </div>
            </div>
            <button onClick={() => setIsContactModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Form Styles</h4>
              <div className="grid grid-cols-1 gap-2">
                {CONTACT_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...contactData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-sky-600/20 border-sky-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {ContactComponent && <ContactComponent data={contactData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLayoutModal = () => {
    if (!isLayoutModalOpen || !selectedBlockId || !activeBlock) return null;
    const layoutData = activeBlock?.data || {};
    const currentVariant = activeBlock?.variant || 'layout-split';
    const LayoutComponent = LAYOUT_COMPONENTS[currentVariant];

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fuchsia-600/20 rounded-lg"><LayoutTemplate size={20} className="text-fuchsia-400" /></div>
              <div>
                <h3 className="text-white font-bold">Layout Studio</h3>
                <p className="text-xs text-neutral-500">Content layout structures</p>
              </div>
            </div>
            <button onClick={() => setIsLayoutModalOpen(false)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"><X size={20} /></button>
          </div>
          <div className="flex-1 flex overflow-hidden">
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 overflow-y-auto custom-scrollbar p-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3">Layout Templates</h4>
              <div className="grid grid-cols-1 gap-2">
                {LAYOUT_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => updateActiveBlockData(selectedBlockId, { ...layoutData, variant: opt.id })} className={`p-3 rounded-lg border text-left ${currentVariant === opt.id ? 'bg-fuchsia-600/20 border-fuchsia-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                    <div className="font-bold text-sm">{opt.name}</div>
                    <div className="text-xs opacity-60">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 p-6 overflow-auto">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                {LayoutComponent && <LayoutComponent data={layoutData} isEditable={false} onUpdate={() => {}} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHeroModal = () => {
    if (!isHeroModalOpen) return null;

    // Get the current hero variant - from selected block or global config
    const currentHeroVariant = selectedBlockId && activeBlock?.type === 'system-hero' 
      ? activeBlock?.variant || config.heroStyle 
      : config.heroStyle;
    
    // Get the hero data from the active block or use defaults
    const heroData = selectedBlockId && activeBlock?.type === 'system-hero'
      ? activeBlock?.data || {}
      : { heading: 'Hero Headline', subheading: 'Your amazing subheading goes here' };

    const HeroComponent = HERO_COMPONENTS[currentHeroVariant as HeroStyleId] || HERO_COMPONENTS['impact'];

    // Get available fields for the current hero variant
    const availableFields = HERO_FIELDS[currentHeroVariant] || [];

    // Handle hero variant change with field warning
    const handleHeroChange = (newVariant: string) => {
      const currentFields = Object.keys(heroData).filter(k => heroData[k] && !k.includes('_style'));
      const targetFields = HERO_FIELDS[newVariant] || [];
      const lostFields = currentFields.filter(field => !targetFields.includes(field));

      if (lostFields.length > 0 && selectedBlockId) {
        setWarningFields(lostFields);
        setPendingVariant(newVariant);
      } else {
        applyHeroVariant(newVariant);
      }
    };

    const applyHeroVariant = (newVariant: string) => {
      if (selectedBlockId) {
        setLocalPages(prev => prev.map(p => {
          if (p.id !== activePage.id) return p;
          return {
            ...p,
            blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: newVariant } : b)
          };
        }));
      } else {
        onConfigChange({ ...config, heroStyle: newVariant as HeroStyleId });
      }
      setHasUnsavedChanges(true);
      setWarningFields([]);
      setPendingVariant(null);
    };

    const confirmVariantChange = () => {
      if (pendingVariant) {
        applyHeroVariant(pendingVariant);
      }
    };

    // Update hero data field
    const updateHeroData = (updates: any) => {
      if (selectedBlockId) {
        setLocalPages(prev => prev.map(p => {
          if (p.id !== activePage.id) return p;
          return {
            ...p,
            blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, data: { ...b.data, ...updates } } : b)
          };
        }));
        setHasUnsavedChanges(true);
      }
    };

    const generateHeroCopy = async (field: string) => {
      if (!genAI) return;
      try {
        const model = (genAI as any).getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const variant = HERO_OPTIONS.find(o => o.id === currentHeroVariant)?.name || "hero section";
        const industry = config.theme_primary || "modern e-commerce";
        
        const prompt = `Generate a high-converting ${field} for a ${variant} on a ${industry} website.
          Keep it short (under ${field === 'heading' ? '8' : '20'} words).
          Return ONLY the text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().replace(/\"/g, '');
        updateHeroData({ [field]: text });
      } catch (error) {
        console.error("Hero AI generation failed:", error);
      }
    };

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Modal Header */}
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Sparkles size={20} className="text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Hero Studio</h3>
                <p className="text-xs text-neutral-500">Design your hero section</p>
              </div>
            </div>
            <button 
              onClick={() => { setIsHeroModalOpen(false); setWarningFields([]); setPendingVariant(null); }} 
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content - Side by Side */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT PANEL - Editing Tools (30%) */}
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 relative">
              {/* Warning Overlay for Field Loss */}
              {warningFields.length > 0 && (
                <div className="absolute inset-0 z-50 bg-neutral-950/98 p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                  <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <AlertTriangle size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Content Warning</h4>
                  <p className="text-neutral-400 text-sm mb-4">
                    Switching to <span className="text-white font-bold">{HERO_OPTIONS.find(o => o.id === pendingVariant)?.name}</span> will hide these fields:
                  </p>
                  <div className="bg-neutral-800 rounded-lg p-3 w-full max-w-xs mb-4 border border-neutral-700 max-h-32 overflow-y-auto">
                    {warningFields.map(field => (
                      <div key={field} className="text-xs text-red-400 font-mono py-1 border-b border-neutral-700 last:border-0">{field}</div>
                    ))}
                  </div>
                  <div className="flex gap-2 w-full max-w-xs">
                    <button onClick={() => { setWarningFields([]); setPendingVariant(null); }} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold text-sm transition-colors">Cancel</button>
                    <button onClick={confirmVariantChange} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors">Confirm</button>
                  </div>
                </div>
              )}

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {/* Hero Design Selection */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <LayoutTemplate size={14} /> Hero Styles
                  </h4>
                  <div className="space-y-2">
                    {HERO_OPTIONS.map((hero) => (
                      <button
                        key={hero.id}
                        onClick={() => handleHeroChange(hero.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all relative ${currentHeroVariant === hero.id
                          ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50'
                          : 'border-neutral-800 hover:border-neutral-600 bg-neutral-900'
                        }`}
                      >
                        {hero.recommended && (
                          <span className="absolute -top-2 -right-2 text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">★ TOP</span>
                        )}
                        <span className={`text-sm font-bold block ${currentHeroVariant === hero.id ? 'text-purple-400' : 'text-white'}`}>
                          {hero.name}
                        </span>
                        <span className="text-[11px] text-neutral-500 block mt-0.5">{hero.description?.split(' - ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-800 my-4"></div>

                {/* Hero Customization Fields */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Settings size={14} /> Customize Content
                  </h4>

                  <div className="space-y-4">
                    {availableFields.includes('heading') && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs text-neutral-400">Heading</label>
                          <button 
                            onClick={() => generateHeroCopy('heading')}
                            className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                            title="Generate with AI"
                          >
                            <Wand2 size={12} />
                          </button>
                        </div>
                        <input
                          id="editor-field-heading"
                          type="text"
                          value={heroData.heading || ''}
                          onChange={(e) => updateHeroData({ heading: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="Enter headline..."
                        />
                      </div>
                    )}

                    {availableFields.includes('subheading') && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs text-neutral-400">Subheading</label>
                          <button 
                            onClick={() => generateHeroCopy('subheading')}
                            className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                            title="Generate with AI"
                          >
                            <Wand2 size={12} />
                          </button>
                        </div>
                        <textarea
                          id="editor-field-subheading"
                          value={heroData.subheading || ''}
                          onChange={(e) => updateHeroData({ subheading: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none resize-none"
                          rows={2}
                          placeholder="Enter subheading..."
                        />
                      </div>
                    )}

                    {availableFields.includes('badge') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Badge Text</label>
                        <input
                          id="editor-field-badge"
                          type="text"
                          value={heroData.badge || ''}
                          onChange={(e) => updateHeroData({ badge: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="e.g., NEW COLLECTION"
                        />
                      </div>
                    )}

                    {availableFields.includes('topBadge') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Top Badge</label>
                        <input
                          id="editor-field-topBadge"
                          type="text"
                          value={heroData.topBadge || ''}
                          onChange={(e) => updateHeroData({ topBadge: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="e.g., FEATURED"
                        />
                      </div>
                    )}

                    {availableFields.includes('buttonText') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Primary Button</label>
                        <input
                          id="editor-field-buttonText"
                          type="text"
                          value={heroData.buttonText || ''}
                          onChange={(e) => updateHeroData({ buttonText: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="e.g., Shop Now"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <Link size={12} className="text-neutral-600" />
                          <select
                            value={heroData.buttonLink || ''}
                            onChange={(e) => updateHeroData({ buttonLink: e.target.value })}
                            className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 focus:border-purple-500 outline-none"
                          >
                            <option value="">No link</option>
                            {localPages.map(page => (
                              <option key={page.id} value={page.slug || '/'}>
                                {page.title || page.slug}
                              </option>
                            ))}
                            <option value="external">Custom URL...</option>
                          </select>
                        </div>
                        {heroData.buttonLink === 'external' && (
                          <div className="flex items-center gap-2 mt-1">
                            <ExternalLink size={12} className="text-neutral-600" />
                            <input
                              type="text"
                              value={heroData.buttonExternalUrl || ''}
                              onChange={(e) => updateHeroData({ buttonExternalUrl: e.target.value })}
                              className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 focus:border-purple-500 outline-none"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {availableFields.includes('secondaryButtonText') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Secondary Button</label>
                        <input
                          id="editor-field-secondaryButtonText"
                          type="text"
                          value={heroData.secondaryButtonText || ''}
                          onChange={(e) => updateHeroData({ secondaryButtonText: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="e.g., Learn More"
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <Link size={12} className="text-neutral-600" />
                          <select
                            value={heroData.secondaryButtonLink || ''}
                            onChange={(e) => updateHeroData({ secondaryButtonLink: e.target.value })}
                            className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 focus:border-purple-500 outline-none"
                          >
                            <option value="">No link</option>
                            {localPages.map(page => (
                              <option key={page.id} value={page.slug || '/'}>
                                {page.title || page.slug}
                              </option>
                            ))}
                            <option value="external">Custom URL...</option>
                          </select>
                        </div>
                        {heroData.secondaryButtonLink === 'external' && (
                          <div className="flex items-center gap-2 mt-1">
                            <ExternalLink size={12} className="text-neutral-600" />
                            <input
                              type="text"
                              value={heroData.secondaryButtonExternalUrl || ''}
                              onChange={(e) => updateHeroData({ secondaryButtonExternalUrl: e.target.value })}
                              className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 focus:border-purple-500 outline-none"
                              placeholder="https://..."
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {availableFields.includes('marqueeText') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Marquee Text</label>
                        <input
                          id="editor-field-marqueeText"
                          type="text"
                          value={heroData.marqueeText || ''}
                          onChange={(e) => updateHeroData({ marqueeText: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="Scrolling text..."
                        />
                      </div>
                    )}

                    {/* Link Labels for Typographic Hero */}
                    {availableFields.includes('link1Label') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Navigation Links</label>
                        <div className="space-y-3">
                          {[
                            { labelKey: 'link1Label', linkKey: 'link1Href', externalKey: 'link1ExternalUrl' },
                            { labelKey: 'link2Label', linkKey: 'link2Href', externalKey: 'link2ExternalUrl' },
                            { labelKey: 'link3Label', linkKey: 'link3Href', externalKey: 'link3ExternalUrl' }
                          ].map(({ labelKey, linkKey, externalKey }, idx) => (
                            <div key={labelKey} className="space-y-1 p-2 bg-neutral-900/50 rounded-lg border border-neutral-700">
                              <input
                                id={`editor-field-${labelKey}`}
                                type="text"
                                value={heroData[labelKey] || ''}
                                onChange={(e) => updateHeroData({ [labelKey]: e.target.value })}
                                className="w-full bg-neutral-800 border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:border-purple-500 outline-none"
                                placeholder={`Link ${idx + 1} label`}
                              />
                              <div className="flex items-center gap-2">
                                <Link size={12} className="text-neutral-600" />
                                <select
                                  value={heroData[linkKey] || ''}
                                  onChange={(e) => updateHeroData({ [linkKey]: e.target.value })}
                                  className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 focus:border-purple-500 outline-none"
                                >
                                  <option value="">No link</option>
                                  {localPages.map(page => (
                                    <option key={page.id} value={page.slug || '/'}>
                                      {page.title || page.slug}
                                    </option>
                                  ))}
                                  <option value="external">Custom URL...</option>
                                </select>
                              </div>
                              {heroData[linkKey] === 'external' && (
                                <div className="flex items-center gap-2">
                                  <ExternalLink size={12} className="text-neutral-600" />
                                  <input
                                    type="text"
                                    value={heroData[externalKey] || ''}
                                    onChange={(e) => updateHeroData({ [externalKey]: e.target.value })}
                                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 focus:border-purple-500 outline-none"
                                    placeholder="https://..."
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feature Card for Grid Hero */}
                    {availableFields.includes('featureCardTitle') && (
                      <div className="space-y-1.5 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700">
                        <label className="text-xs text-neutral-400">Feature Card</label>
                        <input
                          id="editor-field-featureCardTitle"
                          type="text"
                          value={heroData.featureCardTitle || ''}
                          onChange={(e) => updateHeroData({ featureCardTitle: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="Title..."
                        />
                        <input
                          id="editor-field-featureCardSubtitle"
                          type="text"
                          value={heroData.featureCardSubtitle || ''}
                          onChange={(e) => updateHeroData({ featureCardSubtitle: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="Subtitle..."
                        />
                      </div>
                    )}

                    {availableFields.includes('imageBadge') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Image Badge</label>
                        <input
                          id="editor-field-imageBadge"
                          type="text"
                          value={heroData.imageBadge || ''}
                          onChange={(e) => updateHeroData({ imageBadge: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          placeholder="e.g., BESTSELLER"
                        />
                      </div>
                    )}

                    {/* Image Upload */}
                    {availableFields.includes('image') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Hero Image</label>
                        <div className="flex gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-neutral-700 transition-colors text-neutral-300">
                            <Upload size={14} /> Upload
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => updateHeroData({ image: reader.result as string });
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {heroData.image && (
                            <button
                              onClick={() => updateHeroData({ image: undefined })}
                              className="px-3 py-2 bg-red-900/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-900/50 transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <input
                          id="editor-field-image"
                          type="text"
                          value={heroData.image || ''}
                          onChange={(e) => updateHeroData({ image: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:border-purple-500 outline-none"
                          placeholder="Or paste image URL..."
                        />
                      </div>
                    )}

                    {/* Side Image for Grid Hero */}
                    {availableFields.includes('sideImage') && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-400">Side Image</label>
                        <div className="flex gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-neutral-700 transition-colors text-neutral-300">
                            <Upload size={14} /> Upload
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => updateHeroData({ sideImage: reader.result as string });
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                        <input
                          id="editor-field-sideImage"
                          type="text"
                          value={heroData.sideImage || ''}
                          onChange={(e) => updateHeroData({ sideImage: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-neutral-300 focus:border-purple-500 outline-none"
                          placeholder="Or paste image URL..."
                        />
                      </div>
                    )}

                    {/* Overlay Opacity */}
                    {availableFields.includes('overlayOpacity') && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-neutral-400">Image Overlay</label>
                          <span className="text-xs text-neutral-500">{Math.round((heroData.overlayOpacity || 0) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="0.9"
                          step="0.1"
                          value={heroData.overlayOpacity || 0}
                          onChange={(e) => updateHeroData({ overlayOpacity: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-800 my-4"></div>

                {/* Style & Layout Section */}
                {(availableFields.includes('backgroundColor') || 
                  availableFields.includes('accentColor') || 
                  availableFields.includes('featureCardColor') || 
                  availableFields.includes('alignment') || 
                  availableFields.includes('padding') || 
                  availableFields.includes('contentPosition') ||
                  availableFields.includes('animation')) && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Palette size={14} /> Style & Layout
                  </h4>

                  <div className="space-y-4">
                    {/* Comprehensive Color Controls */}
                    <div className="space-y-3">
                      <p className="text-xs text-neutral-400 font-bold">All Colors</p>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Background */}
                        {availableFields.includes('backgroundColor') && (
                          <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <input
                              type="color"
                              value={heroData.style?.backgroundColor || '#000000'}
                              onChange={(e) => updateHeroData({ style: { ...heroData.style, backgroundColor: e.target.value } })}
                              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <span className="text-[10px] text-neutral-300 leading-tight">Background</span>
                          </div>
                        )}
                        
                        {/* Heading Color */}
                        {availableFields.includes('heading') && (
                          <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <input
                              type="color"
                              value={heroData.style?.headingColor || heroData.style?.textColor || '#ffffff'}
                              onChange={(e) => updateHeroData({ style: { ...heroData.style, headingColor: e.target.value } })}
                              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <span className="text-[10px] text-neutral-300 leading-tight">Heading</span>
                          </div>
                        )}
                        
                        {/* Subheading Color */}
                        {availableFields.includes('subheading') && (
                          <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <input
                              type="color"
                              value={heroData.style?.subheadingColor || '#9ca3af'}
                              onChange={(e) => updateHeroData({ style: { ...heroData.style, subheadingColor: e.target.value } })}
                              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <span className="text-[10px] text-neutral-300 leading-tight">Subheading</span>
                          </div>
                        )}
                        
                        {/* Badge Color */}
                        {availableFields.includes('badge') && (
                          <>
                            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                              <input
                                type="color"
                                value={heroData.style?.badgeColor || '#ffffff'}
                                onChange={(e) => updateHeroData({ style: { ...heroData.style, badgeColor: e.target.value } })}
                                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-[10px] text-neutral-300 leading-tight">Badge Text</span>
                            </div>
                            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                              <input
                                type="color"
                                value={heroData.style?.badgeBorderColor || '#ffffff'}
                                onChange={(e) => updateHeroData({ style: { ...heroData.style, badgeBorderColor: e.target.value } })}
                                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-[10px] text-neutral-300 leading-tight">Badge Border</span>
                            </div>
                          </>
                        )}
                        
                        {/* Top Badge Color */}
                        {availableFields.includes('topBadge') && (
                          <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <input
                              type="color"
                              value={heroData.style?.topBadgeColor || '#ffffff'}
                              onChange={(e) => updateHeroData({ style: { ...heroData.style, topBadgeColor: e.target.value } })}
                              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <span className="text-[10px] text-neutral-300 leading-tight">Top Badge</span>
                          </div>
                        )}
                        
                        {/* Primary Button */}
                        {availableFields.includes('buttonText') && (
                          <>
                            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                              <input
                                type="color"
                                value={heroData.style?.buttonBgColor || '#ffffff'}
                                onChange={(e) => updateHeroData({ style: { ...heroData.style, buttonBgColor: e.target.value } })}
                                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-[10px] text-neutral-300 leading-tight">Button BG</span>
                            </div>
                            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                              <input
                                type="color"
                                value={heroData.style?.buttonTextColor || '#000000'}
                                onChange={(e) => updateHeroData({ style: { ...heroData.style, buttonTextColor: e.target.value } })}
                                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-[10px] text-neutral-300 leading-tight">Button Text</span>
                            </div>
                          </>
                        )}
                        
                        {/* Secondary Button */}
                        {availableFields.includes('secondaryButtonText') && (
                          <>
                            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                              <input
                                type="color"
                                value={heroData.style?.secondaryButtonBgColor || 'transparent'}
                                onChange={(e) => updateHeroData({ style: { ...heroData.style, secondaryButtonBgColor: e.target.value } })}
                                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-[10px] text-neutral-300 leading-tight">2nd Btn BG</span>
                            </div>
                            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                              <input
                                type="color"
                                value={heroData.style?.secondaryButtonTextColor || '#ffffff'}
                                onChange={(e) => updateHeroData({ style: { ...heroData.style, secondaryButtonTextColor: e.target.value } })}
                                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-[10px] text-neutral-300 leading-tight">2nd Btn Text</span>
                            </div>
                            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                              <input
                                type="color"
                                value={heroData.style?.secondaryButtonBorderColor || '#ffffff'}
                                onChange={(e) => updateHeroData({ style: { ...heroData.style, secondaryButtonBorderColor: e.target.value } })}
                                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                              />
                              <span className="text-[10px] text-neutral-300 leading-tight">2nd Btn Border</span>
                            </div>
                          </>
                        )}
                        
                        {/* Marquee Text */}
                        {availableFields.includes('marqueeText') && (
                          <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <input
                              type="color"
                              value={heroData.style?.marqueeColor || '#ccff00'}
                              onChange={(e) => updateHeroData({ style: { ...heroData.style, marqueeColor: e.target.value } })}
                              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <span className="text-[10px] text-neutral-300 leading-tight">Marquee</span>
                          </div>
                        )}
                        
                        {/* Link Colors (Typographic) */}
                        {availableFields.includes('link1Label') && (
                          <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                            <input
                              type="color"
                              value={heroData.style?.linkColor || '#ffffff'}
                              onChange={(e) => updateHeroData({ style: { ...heroData.style, linkColor: e.target.value } })}
                              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <span className="text-[10px] text-neutral-300 leading-tight">Nav Links</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Accent Color (Kinetik) with presets */}
                    {availableFields.includes('accentColor') && (
                      <div className="space-y-2">
                        <p className="text-xs text-neutral-400">Accent Color</p>
                        <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                          <input
                            type="color"
                            value={heroData.accentColor || '#ccff00'}
                            onChange={(e) => updateHeroData({ accentColor: e.target.value })}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                          />
                          <span className="text-xs text-neutral-400">Primary Accent</span>
                        </div>
                        <div className="grid grid-cols-6 gap-1">
                          {['#ccff00', '#ff5f56', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'].map(color => (
                            <button
                              key={color}
                              onClick={() => updateHeroData({ accentColor: color })}
                              className={`w-full aspect-square rounded-lg border-2 transition-all ${heroData.accentColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feature Card Color (Grid) with presets */}
                    {availableFields.includes('featureCardColor') && (
                      <div className="space-y-2">
                        <p className="text-xs text-neutral-400">Feature Card Color</p>
                        <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-700">
                          <input
                            type="color"
                            value={heroData.featureCardColor || '#FF5F56'}
                            onChange={(e) => updateHeroData({ featureCardColor: e.target.value })}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                          />
                          <span className="text-xs text-neutral-400">Card Background</span>
                        </div>
                        <div className="grid grid-cols-6 gap-1">
                          {['#FF5F56', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#000000'].map(color => (
                            <button
                              key={color}
                              onClick={() => updateHeroData({ featureCardColor: color })}
                              className={`w-full aspect-square rounded-lg border-2 transition-all ${heroData.featureCardColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Text Alignment (Impact) */}
                    {availableFields.includes('alignment') && (
                      <div className="space-y-2" id="editor-field-alignment">
                        <p className="text-xs text-neutral-400">Content Alignment</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'left', icon: AlignLeft, label: 'Left' },
                            { value: 'center', icon: AlignCenter, label: 'Center' },
                            { value: 'right', icon: AlignRight, label: 'Right' }
                          ].map(({ value, icon: Icon, label }) => (
                            <button
                              key={value}
                              onClick={() => updateHeroData({ style: { ...heroData.style, alignment: value } })}
                              className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                                (heroData.style?.alignment || 'center') === value
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                  : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-600'
                              }`}
                            >
                              <Icon size={16} />
                              <span className="text-[10px]">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content Position (Split) */}
                    {availableFields.includes('contentPosition') && (
                      <div className="space-y-2" id="editor-field-contentPosition">
                        <p className="text-xs text-neutral-400">Content Position</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'left', label: 'Text Left / Image Right' },
                            { value: 'right', label: 'Image Left / Text Right' }
                          ].map(({ value, label }) => (
                            <button
                              key={value}
                              onClick={() => updateHeroData({ contentPosition: value })}
                              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                                (heroData.contentPosition || 'left') === value
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                  : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-600'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Padding (Impact) */}
                    {availableFields.includes('padding') && (
                      <div className="space-y-2" id="editor-field-padding">
                        <p className="text-xs text-neutral-400">Vertical Padding</p>
                        <div className="grid grid-cols-5 gap-1">
                          {[
                            { value: 'none', label: 'None' },
                            { value: 's', label: 'S' },
                            { value: 'm', label: 'M' },
                            { value: 'l', label: 'L' },
                            { value: 'xl', label: 'XL' }
                          ].map(({ value, label }) => (
                            <button
                              key={value}
                              onClick={() => updateHeroData({ style: { ...heroData.style, padding: value } })}
                              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                                (heroData.style?.padding || 'm') === value
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                  : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-600'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Animation */}
                    {availableFields.includes('animation') && (
                      <div className="space-y-2" id="editor-field-animation">
                        <p className="text-xs text-neutral-400">Entry Animation</p>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: 'none', label: 'None', icon: '—' },
                            { value: 'fade', label: 'Fade In', icon: '✨' },
                            { value: 'slide', label: 'Slide Up', icon: '↑' },
                            { value: 'zoom', label: 'Zoom In', icon: '⊕' }
                          ].map(({ value, label, icon }) => (
                            <button
                              key={value}
                              onClick={() => updateHeroData({ animation: value })}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-colors ${
                                (heroData.animation || 'none') === value
                                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                  : 'bg-neutral-900 border-neutral-700 text-neutral-500 hover:border-neutral-600'
                              }`}
                            >
                              <span>{icon}</span>
                              <span>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Divider */}
                <div className="border-t border-neutral-800 my-4"></div>

                {/* Product Link Section */}
                {availableFields.includes('showFeaturedProduct') && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ShoppingBag size={14} /> Featured Product
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showFeaturedProduct"
                        checked={heroData.showFeaturedProduct || false}
                        onChange={(e) => updateHeroData({ showFeaturedProduct: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-purple-500 focus:ring-purple-500"
                      />
                      <label htmlFor="showFeaturedProduct" className="text-xs text-neutral-400">Display featured product overlay</label>
                    </div>

                    {heroData.showFeaturedProduct && (
                      <div className="space-y-3 p-3 bg-neutral-900/50 rounded-lg border border-neutral-700">
                        <div className="space-y-1.5">
                          <label className="text-xs text-neutral-400">Select Product</label>
                          <select
                            value={heroData.featuredProductId || ''}
                            onChange={(e) => updateHeroData({ featuredProductId: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                          >
                            <option value="">Choose a product...</option>
                            {products.map(product => (
                              <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs text-neutral-400">Product Position</label>
                          <div className="grid grid-cols-3 gap-2">
                            {['left', 'center', 'right'].map(pos => (
                              <button
                                key={pos}
                                onClick={() => updateHeroData({ featuredProductPosition: pos })}
                                className={`p-2 rounded-lg border text-xs font-medium capitalize transition-colors ${
                                  (heroData.featuredProductPosition || 'right') === pos
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                    : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                                }`}
                              >
                                {pos}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="showProductPrice"
                            checked={heroData.showProductPrice !== false}
                            onChange={(e) => updateHeroData({ showProductPrice: e.target.checked })}
                            className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-purple-500 focus:ring-purple-500"
                          />
                          <label htmlFor="showProductPrice" className="text-xs text-neutral-400">Show price tag</label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Divider */}
                <div className="border-t border-neutral-800 my-4"></div>

                {/* Typographic Link Images */}
                {availableFields.includes('link1Image') && (
                  <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <ImageIcon size={14} /> Navigation Images
                    </h4>

                    <div className="space-y-3">
                      {[
                        { key: 'link1Image', label: 'Link 1 Image' },
                        { key: 'link2Image', label: 'Link 2 Image' },
                        { key: 'link3Image', label: 'Link 3 Image' }
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-1.5">
                          <label className="text-xs text-neutral-400">{label}</label>
                          <div className="flex gap-2">
                            <label className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-neutral-700 transition-colors text-neutral-300">
                              <Upload size={14} /> Upload
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => updateHeroData({ [key]: reader.result as string });
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            {heroData[key] && (
                              <button
                                onClick={() => updateHeroData({ [key]: undefined })}
                                className="px-3 py-2 bg-red-900/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-900/50 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                          {heroData[key] && (
                            <div className="w-full h-16 rounded-lg overflow-hidden bg-neutral-800">
                              <img src={heroData[key]} alt={label} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Done button */}
              <div className="p-4 border-t border-neutral-800 bg-neutral-950 shrink-0">
                <button 
                  onClick={() => { setIsHeroModalOpen(false); setWarningFields([]); setPendingVariant(null); }}
                  className="w-full px-6 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-sm transition-colors text-white"
                >
                  Done
                </button>
              </div>
            </div>

            {/* RIGHT PANEL - Live Preview (70%) */}
            <div className="flex-1 bg-neutral-800 flex flex-col">
              <div className="p-3 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Live Preview</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] text-neutral-500">Updates instantly</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px]">
                <div className="bg-white min-h-full">
                  <HeroComponent
                    storeName={config.name || 'Your Store'}
                    primaryColor={config.primaryColor}
                    data={heroData}
                    products={products}
                    isEditable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- SYSTEM BLOCK MODAL (Grid only now) ---

  const renderSystemBlockModal = () => {
    if (!isSystemModalOpen || !systemModalType) return null;

    let options: any[] = [];
    let currentSelection = '';
    let title = '';
    let setSelection: (id: string) => void = () => { };
    let color = 'blue';

    const handleHeroVariantChange = (id: string) => {
      if (!selectedBlockId) return;

      const currentFields = Object.keys(activeBlock?.data || {}).filter(k => activeBlock?.data?.[k]);
      const targetFields = HERO_FIELDS[id] || [];

      const lostFields = currentFields.filter(field => !targetFields.includes(field));

      if (lostFields.length > 0) {
        setWarningFields(lostFields);
        setPendingVariant(id);
      } else {
        setLocalPages(prev => prev.map(p => {
          if (p.id !== activePage.id) return p;
          return {
            ...p,
            blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: id } : b)
          };
        }));
        setHasUnsavedChanges(true);
      }
    };

    const confirmVariantChange = () => {
      if (pendingVariant && selectedBlockId) {
        setLocalPages(prev => prev.map(p => {
          if (p.id !== activePage.id) return p;
          return {
            ...p,
            blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: pendingVariant } : b)
          };
        }));
        setHasUnsavedChanges(true);
        setPendingVariant(null);
        setWarningFields([]);
      }
    };

    if (systemModalType === 'hero') {
      options = HERO_OPTIONS;
      // If a block is selected, use its variant, otherwise global
      currentSelection = selectedBlockId ? activeBlock?.variant || config.heroStyle : config.heroStyle;
      title = 'Hero Engine';
      setSelection = (id) => {
        if (selectedBlockId) {
          handleHeroVariantChange(id);
        } else {
          onConfigChange({ ...config, heroStyle: id as HeroStyleId });
        }
      };
      color = 'purple';
    } else if (systemModalType === 'grid') {
      options = PRODUCT_CARD_OPTIONS;
      currentSelection = selectedBlockId ? activeBlock?.variant || config.productCardStyle : config.productCardStyle;
      title = 'Product Grid Engine';
      setSelection = (id) => {
        if (selectedBlockId) {
          setLocalPages(prev => prev.map(p => {
            if (p.id !== activePage.id) return p;
            return {
              ...p,
              blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: id } : b)
            };
          }));
          setHasUnsavedChanges(true);
        } else {
          onConfigChange({ ...config, productCardStyle: id as ProductCardStyleId });
        }
      };
      color = 'green';
    } else if (systemModalType === 'footer') {
      options = FOOTER_OPTIONS;
      currentSelection = config.footerStyle;
      title = 'Footer Architecture';
      setSelection = (id) => onConfigChange({ ...config, footerStyle: id as FooterStyleId });
      color = 'orange';
    }

    // Get the preview component based on modal type
    const getPreviewComponent = () => {
      if (systemModalType === 'hero') {
        const HeroComponent = HERO_COMPONENTS[currentSelection as HeroStyleId] || HERO_COMPONENTS['impact'];
        return HeroComponent ? (
          <HeroComponent
            storeName={config.name || 'Your Store'}
            primaryColor={config.primaryColor}
            data={activeBlock?.data || { heading: 'Hero Headline', subheading: 'Your amazing subheading goes here' }}
            isEditable={false}
          />
        ) : null;
      }
      if (systemModalType === 'grid') {
        const CardComponent = PRODUCT_CARD_COMPONENTS[currentSelection as ProductCardStyleId] || PRODUCT_CARD_COMPONENTS['classic'];
        return (
          <div className="py-12 px-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-neutral-900">Featured Products</h2>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <CardComponent
                  key={i}
                  product={{
                    id: `preview-${i}`,
                    name: `Product ${i}`,
                    price: 99.99,
                    image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400`,
                    seo: { slug: 'preview' }
                  } as any}
                  primaryColor={config.primaryColor}
                />
              ))}
            </div>
          </div>
        );
      }
      if (systemModalType === 'footer') {
        const FooterComponent = FOOTER_COMPONENTS[currentSelection as FooterStyleId] || FOOTER_COMPONENTS['columns'];
        return FooterComponent ? (
          <FooterComponent
            storeName={config.name || 'Your Store'}
            primaryColor={config.primaryColor}
            backgroundColor={config.footerBackgroundColor}
            textColor={config.footerTextColor}
            accentColor={config.footerAccentColor}
          />
        ) : null;
      }
      return null;
    };

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Modal Header */}
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                color === 'purple' ? 'bg-purple-600/20' : 
                color === 'green' ? 'bg-green-600/20' : 
                'bg-orange-600/20'
              }`}>
                <BoxSelect size={20} className={`${
                  color === 'purple' ? 'text-purple-400' : 
                  color === 'green' ? 'text-green-400' : 
                  'text-orange-400'
                }`} />
              </div>
              <div>
                <h3 className="text-white font-bold">{title}</h3>
                <p className="text-xs text-neutral-500">Choose a layout style</p>
              </div>
            </div>
            <button 
              onClick={() => { setIsSystemModalOpen(false); setWarningFields([]); setPendingVariant(null); }} 
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Modal Content - Split View */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Style Selection (30%) */}
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 relative min-h-0">
              {/* WARNING OVERLAY */}
              {warningFields.length > 0 && (
                <div className="absolute inset-0 z-50 bg-neutral-950/98 p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                  <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-4">
                    <AlertTriangle size={24} />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Content Warning</h4>
                  <p className="text-neutral-400 text-sm mb-4">
                    Switching to <span className="text-white font-bold">{HERO_OPTIONS.find(o => o.id === pendingVariant)?.name}</span> will hide these fields:
                  </p>
                  <div className="bg-neutral-900 rounded-lg p-3 w-full mb-4 border border-neutral-800 max-h-32 overflow-y-auto">
                    {warningFields.map(field => (
                      <div key={field} className="text-xs text-red-400 font-mono py-1 border-b border-neutral-800 last:border-0">{field}</div>
                    ))}
                  </div>
                  <div className="flex gap-2 w-full">
                    <button onClick={() => { setWarningFields([]); setPendingVariant(null); }} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold text-sm transition-colors">Cancel</button>
                    <button onClick={confirmVariantChange} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors">Confirm</button>
                  </div>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <LayoutTemplate size={14} /> Available Styles
                </h4>
                {renderSortControls(modalSort, setModalSort)}
                <div className="grid grid-cols-1 gap-2 mt-3">
                  {sortItems(options, modalSort).map((opt) => (
                    <button 
                      key={opt.id} 
                      onClick={() => setSelection(opt.id)} 
                      className={`text-left p-3 rounded-lg border transition-all relative ${
                        currentSelection === opt.id 
                          ? `${color === 'purple' ? 'bg-purple-600/20 border-purple-500 ring-2 ring-purple-500/50' : 
                              color === 'green' ? 'bg-green-600/20 border-green-500 ring-2 ring-green-500/50' : 
                              'bg-orange-600/20 border-orange-500 ring-2 ring-orange-500/50'} text-white` 
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:bg-neutral-800/50'
                      }`}
                    >
                      {opt.recommended && (
                        <span className="absolute -top-2 -right-2 text-[9px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">★ TOP</span>
                      )}
                      <div className="font-bold text-sm mb-0.5">{opt.name}</div>
                      <div className="text-[11px] opacity-60">{opt.description}</div>
                    </button>
                  ))}
                </div>
                
                {/* Footer Color Controls */}
                {systemModalType === 'footer' && (
                  <div className="mt-6 pt-6 border-t border-neutral-800">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Palette size={14} /> Footer Colors
                    </h4>
                    <div className="space-y-4">
                      {/* Background Color */}
                      <div>
                        <label className="text-xs text-neutral-400 mb-2 block">Background</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.footerBackgroundColor || '#171717'}
                            onChange={(e) => onConfigChange({ ...config, footerBackgroundColor: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-neutral-700 bg-transparent"
                          />
                          <input
                            type="text"
                            value={config.footerBackgroundColor || '#171717'}
                            onChange={(e) => onConfigChange({ ...config, footerBackgroundColor: e.target.value })}
                            className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-300 font-mono"
                            placeholder="#171717"
                          />
                        </div>
                      </div>
                      
                      {/* Text Color */}
                      <div>
                        <label className="text-xs text-neutral-400 mb-2 block">Text</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.footerTextColor || '#ffffff'}
                            onChange={(e) => onConfigChange({ ...config, footerTextColor: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-neutral-700 bg-transparent"
                          />
                          <input
                            type="text"
                            value={config.footerTextColor || '#ffffff'}
                            onChange={(e) => onConfigChange({ ...config, footerTextColor: e.target.value })}
                            className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-300 font-mono"
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                      
                      {/* Accent/Link Color */}
                      <div>
                        <label className="text-xs text-neutral-400 mb-2 block">Accent / Links</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={config.footerAccentColor || config.primaryColor || '#3B82F6'}
                            onChange={(e) => onConfigChange({ ...config, footerAccentColor: e.target.value })}
                            className="w-8 h-8 rounded cursor-pointer border border-neutral-700 bg-transparent"
                          />
                          <input
                            type="text"
                            value={config.footerAccentColor || config.primaryColor || '#3B82F6'}
                            onChange={(e) => onConfigChange({ ...config, footerAccentColor: e.target.value })}
                            className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-2 py-1.5 text-xs text-neutral-300 font-mono"
                            placeholder="#3B82F6"
                          />
                        </div>
                      </div>
                      
                      {/* Reset to Defaults */}
                      <button
                        onClick={() => onConfigChange({ 
                          ...config, 
                          footerBackgroundColor: undefined, 
                          footerTextColor: undefined, 
                          footerAccentColor: undefined 
                        })}
                        className="w-full py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
                      >
                        Reset to Default Colors
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Panel - Live Preview */}
            <div className="flex-1 bg-neutral-800 flex flex-col">
              <div className="p-3 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Live Preview</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] text-neutral-500">Updates instantly</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px]">
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-neutral-600 min-h-full">
                  {getPreviewComponent()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-between items-center shrink-0">
            <p className="text-xs text-neutral-500">
              Current: <span className="text-white font-medium">{options.find(o => o.id === currentSelection)?.name || 'Default'}</span>
            </p>
            <button 
              onClick={() => { setIsSystemModalOpen(false); setWarningFields([]); setPendingVariant(null); }}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-colors text-white ${
                color === 'purple' ? 'bg-purple-600 hover:bg-purple-500' : 
                color === 'green' ? 'bg-green-600 hover:bg-green-500' : 
                'bg-orange-600 hover:bg-orange-500'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };
  // --- INTERFACE MODAL (Full-screen with Tabs) ---
  const renderInterfaceModal = () => {
    if (!isInterfaceModalOpen) return null;
    
    const tabs = [
      { id: 'identity', label: 'Identity', icon: Star, color: 'yellow' },
      { id: 'typography', label: 'Typography', icon: Type, color: 'cyan' },
      { id: 'colors', label: 'Colors', icon: Palette, color: 'pink' },
      { id: 'seo', label: 'SEO', icon: Search, color: 'green' },
      { id: 'header', label: 'Header', icon: PanelTop, color: 'blue' },
      { id: 'scrollbar', label: 'Scrollbar', icon: ArrowDownAZ, color: 'indigo' },
    ] as const;
    
    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Modal Header */}
          <div className="p-4 border-b border-neutral-800 bg-neutral-950 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Monitor size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Site Settings</h3>
                  <p className="text-xs text-neutral-500">Brand & Global Styles</p>
                </div>
              </div>
              <button 
                onClick={() => setIsInterfaceModalOpen(false)} 
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-neutral-800/50 p-1 rounded-xl">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = settingsTab === tab.id;
                const colorClasses: Record<string, string> = {
                  yellow: 'text-yellow-400',
                  cyan: 'text-cyan-400',
                  pink: 'text-pink-400',
                  green: 'text-green-400',
                  blue: 'text-blue-400',
                  indigo: 'text-indigo-400',
                };
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSettingsTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-neutral-700 text-white shadow-lg' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
                    }`}
                  >
                    <Icon size={16} className={isActive ? colorClasses[tab.color] : ''} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {/* Header Tab */}
            {settingsTab === 'header' && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-600/20 rounded-xl">
                    <PanelTop size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Header Style</h3>
                    <p className="text-sm text-neutral-400">Customize your store's header</p>
                  </div>
                </div>

                {/* Live Preview - Sticky */}
                <div className="sticky top-0 z-10 bg-neutral-900 pb-4 -mx-6 px-6 pt-2 -mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-neutral-400 uppercase tracking-wide">Live Preview</p>
                    <span className="text-xs text-neutral-500">Changes update instantly</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-neutral-700 bg-neutral-100 shadow-lg">
                    {(() => {
                      const HeaderComponent = HEADER_COMPONENTS[config.headerStyle || 'canvas'] || HEADER_COMPONENTS.canvas;
                      return (
                        <HeaderComponent
                          storeName={config.name || 'Your Store'}
                          logoUrl={config.logoUrl}
                          logoHeight={config.logoHeight || 32}
                          links={[
                            { label: 'Shop', href: '/shop', active: mockActiveNav === '/shop' },
                            { label: 'About', href: '/about', active: mockActiveNav === '/about' },
                            { label: 'Contact', href: '/contact', active: mockActiveNav === '/contact' },
                          ]}
                          cartCount={2}
                          onOpenCart={() => {}}
                          onLinkClick={(href) => setMockActiveNav(href)}
                          data={config.headerData}
                        />
                      );
                    })()}
                  </div>
                </div>
                
                {/* Current Header Selection */}
                <div className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-700/50 mb-6">
                  <label className="text-sm font-bold text-white mb-3 block">Header Design</label>
                  <div className="grid grid-cols-4 gap-2">
                    {/* Available headers */}
                    {HEADER_OPTIONS.map((header) => (
                      <button
                        key={header.id}
                        onClick={() => {
                          onConfigChange({ ...config, headerStyle: header.id as any, headerData: {} });
                        }}
                        className={`p-2 rounded-lg border-2 text-center transition-all ${
                          config.headerStyle === header.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-neutral-700 hover:border-neutral-600'
                        }`}
                      >
                        <span className={`text-xs font-bold ${config.headerStyle === header.id ? 'text-blue-400' : 'text-white'}`}>
                          {header.name}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">More styles coming soon...</p>
                </div>

                {/* Header Customization */}
                <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-white">Customize Header</label>
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-lg">
                      {HEADER_OPTIONS.find(h => h.id === config.headerStyle)?.name || 'Canvas'}
                    </span>
                  </div>
                  
                  {/* Dynamic Field Controls - based on HEADER_FIELDS registry */}
                  {(() => {
                    const fields = HEADER_FIELDS[config.headerStyle || 'canvas'] || [];
                    const toggleFields = fields.filter(f => f.startsWith('show') || f === 'sticky');
                    const colorFields = fields.filter(f => f.toLowerCase().includes('color') || f.toLowerCase().includes('bg'));
                    const textFields = fields.filter(f => !toggleFields.includes(f) && !colorFields.includes(f) && f !== 'navActiveStyle');

                    return (
                      <div className="space-y-6">
                        {/* Navigation Style Selector */}
                        {fields.includes('navActiveStyle') && (
                          <div className="space-y-3">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Active Indicator Mode</p>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { id: 'none', label: 'None' },
                                { id: 'dot', label: 'Pulsing Dot' },
                                { id: 'underline', label: 'Smooth Underline' },
                                { id: 'capsule', label: 'Cloud Capsule' },
                                { id: 'glow', label: 'Neon Glow' },
                                { id: 'brutalist', label: 'The Brutalist' },
                                { id: 'minimal', label: 'The Minimalist' },
                                { id: 'overline', label: 'Top Line' },
                                { id: 'double', label: 'Double Line' },
                                { id: 'bracket', label: 'Box Brackets' },
                                { id: 'highlight', label: 'Marker' },
                                { id: 'skewed', label: 'Parallelogram' },
                              ].map(opt => (
                                <button
                                  key={opt.id}
                                  onClick={() => onConfigChange({
                                    ...config,
                                    headerData: { ...config.headerData, navActiveStyle: opt.id as any }
                                  })}
                                  className={`px-3 py-2 rounded-lg text-left transition-all border ${
                                    (config.headerData?.navActiveStyle || 'dot') === opt.id
                                      ? 'bg-blue-500 border-blue-400 text-white font-bold shadow-lg shadow-blue-500/20'
                                      : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500'
                                  }`}
                                >
                                  <div className="text-[10px] opacity-70 mb-0.5">{opt.id === (config.headerData?.navActiveStyle || 'dot') ? 'Active' : 'Style'}</div>
                                  <div className="text-xs truncate">{opt.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Toggles */}
                        {toggleFields.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Visibility</p>
                            <div className="grid grid-cols-2 gap-3">
                              {toggleFields.map(key => {
                                const Meta = (HEADER_FIELD_METADATA as any)[key] || { label: key };
                                return (
                                  <button
                                    key={key}
                                    onClick={() => onConfigChange({
                                      ...config,
                                      headerData: { ...config.headerData, [key]: !(config.headerData?.[key] ?? true) }
                                    })}
                                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                                      (config.headerData?.[key] ?? true)
                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                        : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                                    }`}
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                    <span className="text-xs font-bold">{Meta.label}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Text Inputs */}
                        {textFields.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Content</p>
                            <div className="space-y-3">
                              {textFields.map(key => {
                                const Meta = (HEADER_FIELD_METADATA as any)[key] || { label: key };
                                return (
                                  <div key={key} className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-700">
                                    <label className="text-[10px] uppercase font-bold text-neutral-500 mb-2 block">{Meta.label}</label>
                                    <input
                                      type="text"
                                      value={config.headerData?.[key] ?? ''}
                                      onChange={(e) => onConfigChange({
                                        ...config,
                                        headerData: { ...config.headerData, [key]: e.target.value }
                                      })}
                                      className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500 outline-none"
                                      placeholder={`Enter ${Meta.label.toLowerCase()}...`}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Colors */}
                        {colorFields.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Colors & Style</p>
                            <div className="grid grid-cols-2 gap-3">
                              {colorFields.map(key => {
                                const Meta = (HEADER_FIELD_METADATA as any)[key] || { label: key };
                                return (
                                  <div key={key} className="flex flex-col gap-1.5 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-700">
                                    <span className="text-[10px] text-neutral-500 font-bold uppercase truncate">{Meta.label}</span>
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="color"
                                        value={config.headerData?.[key] ?? '#000000'}
                                        onChange={(e) => onConfigChange({
                                          ...config,
                                          headerData: { ...config.headerData, [key]: e.target.value }
                                        })}
                                        className="w-6 h-6 rounded-full cursor-pointer border-0 bg-transparent shrink-0"
                                      />
                                      <input 
                                        type="text"
                                        value={config.headerData?.[key] ?? ''}
                                        onChange={(e) => onConfigChange({
                                          ...config,
                                          headerData: { ...config.headerData, [key]: e.target.value }
                                        })}
                                        className="bg-transparent text-[10px] text-white font-mono w-full outline-none"
                                        placeholder="#000000"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Layout Controls (Always present if not in registry) */}
                        <div className="space-y-3 pt-4 border-t border-neutral-700/50">
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Layout</p>
                          <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-700">
                            <label className="text-[10px] uppercase font-bold text-neutral-500 mb-2 block">Content Width</label>
                            <select
                              value={config.headerData?.maxWidth ?? '7xl'}
                              onChange={(e) => onConfigChange({
                                ...config,
                                headerData: { ...config.headerData, maxWidth: e.target.value }
                              })}
                              className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-white text-xs focus:border-blue-500 outline-none"
                            >
                              <option value="5xl">Narrow</option>
                              <option value="6xl">Medium</option>
                              <option value="7xl">Wide</option>
                              <option value="full">Full Width</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Identity Tab */}
            {settingsTab === 'identity' && (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-yellow-600/20 rounded-xl">
                    <Star size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Site Identity</h3>
                    <p className="text-sm text-neutral-400">Your store's brand and basic info</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Logo Upload */}
                  <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                    <label className="text-sm font-bold text-white mb-4 block">Logo</label>
                    <div className="flex items-start gap-4">
                      {config.logoUrl ? (
                        <div className="relative group">
                          <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-700">
                            <img 
                              src={config.logoUrl} 
                              alt="Logo" 
                              style={{ height: `${config.logoHeight || 40}px` }}
                              className="w-auto object-contain"
                            />
                          </div>
                          <button
                            onClick={() => onConfigChange({ ...config, logoUrl: '' })}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 bg-neutral-900 rounded-xl border border-neutral-700 flex items-center justify-center">
                          <ImageIcon size={32} className="text-neutral-600" />
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <label className={`flex items-center justify-center gap-2 py-3 px-6 border border-dashed border-neutral-600 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-neutral-800/50 transition-colors ${isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {isUploadingLogo ? (
                            <Loader2 size={18} className="animate-spin text-neutral-400" />
                          ) : (
                            <Upload size={18} className="text-neutral-400" />
                          )}
                          <span className="text-sm text-neutral-400">{isUploadingLogo ? 'Uploading...' : config.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={isUploadingLogo} />
                        </label>
                        <p className="text-xs text-neutral-500">Recommended: PNG or SVG with transparent background</p>
                      </div>
                    </div>
                    {/* Logo Size Slider */}
                    {config.logoUrl && (
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-neutral-700/50">
                        <span className="text-sm text-neutral-400 w-24">Logo Size</span>
                        <input 
                          type="range" 
                          min="20" 
                          max="100" 
                          value={config.logoHeight || 40} 
                          onChange={(e) => onConfigChange({ ...config, logoHeight: parseInt(e.target.value) })} 
                          className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
                        />
                        <span className="text-sm text-neutral-300 w-16 text-right font-mono">{config.logoHeight || 40}px</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Store Name */}
                  <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                    <label className="text-sm font-bold text-white mb-3 block">Store Name</label>
                    <input
                      type="text"
                      value={config.name || ''}
                      onChange={(e) => onConfigChange({ ...config, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-base focus:border-yellow-500 outline-none"
                      placeholder="Your Store Name"
                    />
                    <p className="text-xs text-neutral-500 mt-2">This appears in your browser tab and meta tags</p>
                  </div>
                  
                  {/* Currency */}
                  <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                    <label className="text-sm font-bold text-white mb-3 block">Currency</label>
                    <select
                      value={config.currency || 'USD'}
                      onChange={(e) => onConfigChange({ ...config, currency: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-base focus:border-yellow-500 outline-none cursor-pointer"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="CAD">CAD ($) - Canadian Dollar</option>
                      <option value="AUD">AUD ($) - Australian Dollar</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                      <option value="CNY">CNY (¥) - Chinese Yuan</option>
                      <option value="INR">INR (₹) - Indian Rupee</option>
                      <option value="MXN">MXN ($) - Mexican Peso</option>
                      <option value="BRL">BRL (R$) - Brazilian Real</option>
                    </select>
                    <p className="text-xs text-neutral-500 mt-2">Used for displaying product prices</p>
                  </div>
                </div>
              </div>
            )}
              
            {/* Colors Tab */}
            {settingsTab === 'colors' && (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-pink-600/20 rounded-xl">
                    <Palette size={24} className="text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Brand Colors</h3>
                    <p className="text-sm text-neutral-400">Define your store's color palette</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Primary Color */}
                  <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="text-sm font-bold text-white block">Primary Color</label>
                        <p className="text-xs text-neutral-500 mt-1">Used for buttons, links, and accents</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={config.primaryColor || '#3B82F6'}
                          onChange={(e) => onConfigChange({ ...config, primaryColor: e.target.value })}
                          className="w-14 h-14 rounded-xl cursor-pointer border-2 border-neutral-600 bg-transparent"
                        />
                        <input
                          type="text"
                          value={config.primaryColor || '#3B82F6'}
                          onChange={(e) => onConfigChange({ ...config, primaryColor: e.target.value })}
                          className="w-28 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-300 font-mono"
                        />
                      </div>
                    </div>
                    {/* Primary color preview */}
                    <div className="flex gap-2 mt-4">
                      <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: config.primaryColor || '#3B82F6' }}></div>
                      <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: config.primaryColor || '#3B82F6', opacity: 0.7 }}></div>
                      <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: config.primaryColor || '#3B82F6', opacity: 0.4 }}></div>
                      <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: config.primaryColor || '#3B82F6', opacity: 0.2 }}></div>
                    </div>
                  </div>
                  
                  {/* Accent Color */}
                  <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <label className="text-sm font-bold text-white block">Accent Color</label>
                        <p className="text-xs text-neutral-500 mt-1">Secondary color for highlights and gradients</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={config.accentColor || '#8B5CF6'}
                          onChange={(e) => onConfigChange({ ...config, accentColor: e.target.value })}
                          className="w-14 h-14 rounded-xl cursor-pointer border-2 border-neutral-600 bg-transparent"
                        />
                        <input
                          type="text"
                          value={config.accentColor || '#8B5CF6'}
                          onChange={(e) => onConfigChange({ ...config, accentColor: e.target.value })}
                          className="w-28 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-300 font-mono"
                        />
                      </div>
                    </div>
                    {/* Accent color preview */}
                    <div className="flex gap-2 mt-4">
                      <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: config.accentColor || '#8B5CF6' }}></div>
                      <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: config.accentColor || '#8B5CF6', opacity: 0.7 }}></div>
                      <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: config.accentColor || '#8B5CF6', opacity: 0.4 }}></div>
                      <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: config.accentColor || '#8B5CF6', opacity: 0.2 }}></div>
                    </div>
                  </div>

                  {/* Gradient Preview */}
                  <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                    <label className="text-sm font-bold text-white mb-4 block">Gradient Preview</label>
                    <div 
                      className="h-24 rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${config.primaryColor || '#3B82F6'}, ${config.accentColor || '#8B5CF6'})` }}
                    ></div>
                  </div>

                  {/* AI Color Suggestions */}
                  <button 
                    onClick={() => {
                      const palettes = [
                        { primary: '#3B82F6', accent: '#8B5CF6' },
                        { primary: '#10B981', accent: '#14B8A6' },
                        { primary: '#F59E0B', accent: '#EF4444' },
                        { primary: '#EC4899', accent: '#8B5CF6' },
                        { primary: '#000000', accent: '#EAB308' },
                        { primary: '#0EA5E9', accent: '#6366F1' },
                        { primary: '#D946EF', accent: '#F97316' },
                        { primary: '#84CC16', accent: '#22D3EE' },
                      ];
                      const random = palettes[Math.floor(Math.random() * palettes.length)];
                      onConfigChange({ ...config, primaryColor: random.primary, accentColor: random.accent });
                      showToast('New color palette applied!', 'success');
                    }}
                    className="w-full py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 rounded-xl text-purple-300 font-bold transition-colors"
                  >
                    <Sparkles size={20} />
                    Generate AI Color Palette
                  </button>
                </div>
              </div>
            )}
            {/* Typography Tab */}
            {settingsTab === 'typography' && (
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-cyan-600/20 rounded-xl">
                    <Type size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Typography</h3>
                    <p className="text-sm text-neutral-400">Fonts, sizes, and text styling</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Font Families & Scale */}
                  <div className="space-y-5">
                    {/* Heading Font */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-3 block">Heading Font</label>
                      <select
                        value={config.typography?.headingFont || 'Inter, system-ui, sans-serif'}
                        onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, headingFont: e.target.value } })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-base focus:border-cyan-500 outline-none cursor-pointer"
                      >
                        <optgroup label="Sans Serif">
                          <option value="Inter, system-ui, sans-serif">Inter</option>
                          <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                          <option value="'DM Sans', sans-serif">DM Sans</option>
                          <option value="Manrope, sans-serif">Manrope</option>
                          <option value="Outfit, sans-serif">Outfit</option>
                          <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                          <option value="Sora, sans-serif">Sora</option>
                          <option value="Poppins, sans-serif">Poppins</option>
                          <option value="'Nunito Sans', sans-serif">Nunito Sans</option>
                          <option value="'Source Sans 3', sans-serif">Source Sans 3</option>
                          <option value="'Open Sans', sans-serif">Open Sans</option>
                          <option value="Lato, sans-serif">Lato</option>
                          <option value="Roboto, sans-serif">Roboto</option>
                        </optgroup>
                        <optgroup label="Serif">
                          <option value="'Playfair Display', serif">Playfair Display</option>
                          <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                          <option value="'Libre Baskerville', serif">Libre Baskerville</option>
                          <option value="Merriweather, serif">Merriweather</option>
                        </optgroup>
                        <optgroup label="Monospace">
                          <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Body Font */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-3 block">Body Font</label>
                      <select
                        value={config.typography?.bodyFont || 'Inter, system-ui, sans-serif'}
                        onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, bodyFont: e.target.value } })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white text-base focus:border-cyan-500 outline-none cursor-pointer"
                      >
                        <optgroup label="Sans Serif">
                          <option value="Inter, system-ui, sans-serif">Inter</option>
                          <option value="'Plus Jakarta Sans', sans-serif">Plus Jakarta Sans</option>
                          <option value="'DM Sans', sans-serif">DM Sans</option>
                          <option value="Manrope, sans-serif">Manrope</option>
                          <option value="Outfit, sans-serif">Outfit</option>
                          <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                          <option value="Sora, sans-serif">Sora</option>
                          <option value="Poppins, sans-serif">Poppins</option>
                          <option value="'Nunito Sans', sans-serif">Nunito Sans</option>
                          <option value="'Source Sans 3', sans-serif">Source Sans 3</option>
                          <option value="'Open Sans', sans-serif">Open Sans</option>
                          <option value="Lato, sans-serif">Lato</option>
                          <option value="Roboto, sans-serif">Roboto</option>
                        </optgroup>
                        <optgroup label="Serif">
                          <option value="'Playfair Display', serif">Playfair Display</option>
                          <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
                          <option value="'Libre Baskerville', serif">Libre Baskerville</option>
                          <option value="Merriweather, serif">Merriweather</option>
                        </optgroup>
                        <optgroup label="Monospace">
                          <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Heading Scale */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-3 block">Heading Scale</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['compact', 'default', 'large', 'dramatic'] as const).map((scale) => (
                          <button
                            key={scale}
                            onClick={() => onConfigChange({ ...config, typography: { ...config.typography, headingScale: scale } })}
                            className={`px-4 py-3 rounded-xl text-sm font-bold capitalize transition-all ${
                              (config.typography?.headingScale || 'default') === scale
                                ? 'bg-cyan-600/20 border-2 border-cyan-500 text-cyan-300'
                                : 'bg-neutral-900 border-2 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                            }`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Base Font Size */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-3 block">Base Font Size</label>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-neutral-500">14px</span>
                        <input
                          type="range"
                          min="14"
                          max="20"
                          value={parseInt(config.typography?.baseFontSize || '16')}
                          onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, baseFontSize: `${e.target.value}px` } })}
                          className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                        <span className="text-xs text-neutral-500">20px</span>
                        <span className="text-sm text-white font-mono bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700">{config.typography?.baseFontSize || '16px'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Weights, Colors, Transform */}
                  <div className="space-y-5">
                    {/* Font Weights */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-3 block">Font Weights</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-neutral-400 mb-2 block">Heading Weight</label>
                          <select
                            value={config.typography?.headingWeight || '700'}
                            onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, headingWeight: e.target.value as any } })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 outline-none cursor-pointer"
                          >
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                            <option value="600">Semibold (600)</option>
                            <option value="700">Bold (700)</option>
                            <option value="800">Extra Bold (800)</option>
                            <option value="900">Black (900)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-neutral-400 mb-2 block">Body Weight</label>
                          <select
                            value={config.typography?.bodyWeight || '400'}
                            onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, bodyWeight: e.target.value as any } })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-cyan-500 outline-none cursor-pointer"
                          >
                            <option value="300">Light (300)</option>
                            <option value="400">Regular (400)</option>
                            <option value="500">Medium (500)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Heading Transform */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-3 block">Heading Style</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['none', 'uppercase', 'lowercase', 'capitalize'] as const).map((transform) => (
                          <button
                            key={transform}
                            onClick={() => onConfigChange({ ...config, typography: { ...config.typography, headingTransform: transform } })}
                            className={`px-3 py-2.5 rounded-lg text-xs font-bold capitalize transition-all ${
                              (config.typography?.headingTransform || 'none') === transform
                                ? 'bg-cyan-600/20 border-2 border-cyan-500 text-cyan-300'
                                : 'bg-neutral-900 border-2 border-neutral-700 text-neutral-400 hover:border-neutral-600'
                            }`}
                          >
                            {transform === 'none' ? 'Normal' : transform}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Colors */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-4 block">Text Colors</label>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-400">Heading Color</span>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={config.typography?.headingColor || '#ffffff'}
                              onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, headingColor: e.target.value } })}
                              className="w-10 h-10 rounded-lg border border-neutral-600 bg-neutral-800 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={config.typography?.headingColor || '#ffffff'}
                              onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, headingColor: e.target.value } })}
                              className="w-24 px-2 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-400">Body Color</span>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={config.typography?.bodyColor || '#a3a3a3'}
                              onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, bodyColor: e.target.value } })}
                              className="w-10 h-10 rounded-lg border border-neutral-600 bg-neutral-800 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={config.typography?.bodyColor || '#a3a3a3'}
                              onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, bodyColor: e.target.value } })}
                              className="w-24 px-2 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-400">Link Color</span>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={config.typography?.linkColor || config.primaryColor || '#3B82F6'}
                              onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, linkColor: e.target.value } })}
                              className="w-10 h-10 rounded-lg border border-neutral-600 bg-neutral-800 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={config.typography?.linkColor || config.primaryColor || '#3B82F6'}
                              onChange={(e) => onConfigChange({ ...config, typography: { ...config.typography, linkColor: e.target.value } })}
                              className="w-24 px-2 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white font-mono"
                            />
                            <button
                              onClick={() => onConfigChange({ ...config, typography: { ...config.typography, linkColor: config.primaryColor } })}
                              className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-400 hover:text-white hover:border-neutral-600"
                              title="Use primary color"
                            >
                              Auto
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography Preview - Full Width */}
                <div className="mt-6 bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                  <h5 className="text-sm font-bold text-white mb-4">Live Preview</h5>
                  <div 
                    className="bg-white rounded-xl p-8"
                    style={{
                      fontFamily: config.typography?.bodyFont || 'Inter, system-ui, sans-serif',
                      fontSize: config.typography?.baseFontSize || '16px',
                    }}
                  >
                    <h1 
                      style={{ 
                        fontFamily: config.typography?.headingFont || 'Inter, system-ui, sans-serif',
                        fontWeight: config.typography?.headingWeight || '700',
                        color: config.typography?.headingColor || '#000000',
                        textTransform: config.typography?.headingTransform || 'none',
                        fontSize: config.typography?.headingScale === 'compact' ? '1.75rem' : 
                                  config.typography?.headingScale === 'large' ? '2.75rem' : 
                                  config.typography?.headingScale === 'dramatic' ? '3.5rem' : '2.25rem',
                        marginBottom: '0.75rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {config.name || 'Your Store'}
                    </h1>
                    <p style={{ 
                      color: config.typography?.bodyColor || '#666666',
                      fontWeight: config.typography?.bodyWeight || '400',
                      marginBottom: '1rem',
                      lineHeight: 1.6,
                    }}>
                      This is how your body text will appear across your store. Good typography creates a professional look and enhances readability for your customers.
                    </p>
                    <a 
                      href="#" 
                      onClick={(e) => e.preventDefault()}
                      style={{ 
                        color: config.typography?.linkColor || config.primaryColor || '#3B82F6',
                        fontWeight: '500',
                      }}
                    >
                      This is a link →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {settingsTab === 'seo' && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-600/20 rounded-xl">
                      <Search size={24} className="text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">SEO & Meta Tags</h3>
                      <p className="text-sm text-neutral-400">Optimize your store for search engines</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!genAI) {
                        showToast('AI not available - check API key', 'error');
                        return;
                      }
                      setIsGeneratingSEO(true);
                      try {
                        const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });
                        const prompt = `You are an expert SEO specialist. Generate comprehensive SEO metadata for an online store.

Store Name: ${config.name || 'Online Store'}
Store Type: ${config.storeType || 'ecommerce'}
Primary Color: ${config.primaryColor}

Generate a JSON object with this exact structure:
{
  "metaTitle": "string (50-60 chars, include brand name, primary keyword)",
  "metaDescription": "string (150-160 chars, compelling, include call-to-action)",
  "metaKeywords": ["array", "of", "5-10", "relevant", "keywords"],
  "ogTitle": "string (same as metaTitle or slightly different for social)",
  "ogDescription": "string (can be longer, more engaging for social sharing)",
  "twitterTitle": "string (optimized for Twitter)",
  "twitterDescription": "string (optimized for Twitter, under 200 chars)",
  "structuredData": {
    "type": "Store",
    "priceRange": "$$"
  }
}

Make it professional, SEO-optimized, and specific to the store name.
Return ONLY the JSON object, no markdown.`;

                        const result = await model.generateContent(prompt);
                        const response = await result.response;
                        const text = response.text().trim();
                        
                        const jsonStr = text.replace(/```json\n?|\n?```/g, '');
                        const seoData = JSON.parse(jsonStr);
                        
                        onConfigChange({ 
                          ...config, 
                          seo: {
                            ...config.seo,
                            ...seoData,
                            robotsIndex: true,
                            robotsFollow: true,
                            twitterCard: 'summary_large_image'
                          }
                        });
                        showToast('SEO generated successfully!', 'success');
                      } catch (error) {
                        console.error('SEO generation error:', error);
                        showToast('Failed to generate SEO', 'error');
                      } finally {
                        setIsGeneratingSEO(false);
                      }
                    }}
                    disabled={isGeneratingSEO}
                    className="px-4 py-2.5 flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/30 rounded-xl text-green-300 font-bold transition-colors disabled:opacity-50"
                  >
                    {isGeneratingSEO ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Sparkles size={18} />
                    )}
                    {isGeneratingSEO ? 'Generating...' : 'AI Generate SEO'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Basic SEO */}
                  <div className="space-y-5">
                    {/* Meta Title */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-white">Meta Title</label>
                        <span className={`text-xs font-mono px-2 py-1 rounded ${(config.seo?.metaTitle?.length || 0) > 60 ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-400'}`}>
                          {config.seo?.metaTitle?.length || 0}/60
                        </span>
                      </div>
                      <input
                        type="text"
                        value={config.seo?.metaTitle || ''}
                        onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, metaTitle: e.target.value } })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none"
                        placeholder="Your Store - Premium Products & Fast Shipping"
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-bold text-white">Meta Description</label>
                        <span className={`text-xs font-mono px-2 py-1 rounded ${(config.seo?.metaDescription?.length || 0) > 160 ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-400'}`}>
                          {config.seo?.metaDescription?.length || 0}/160
                        </span>
                      </div>
                      <textarea
                        value={config.seo?.metaDescription || ''}
                        onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, metaDescription: e.target.value } })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none resize-none h-28"
                        placeholder="Discover our curated collection of premium products. Free shipping on orders over $50. Shop now!"
                      />
                    </div>

                    {/* Keywords */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-3 block">Meta Keywords</label>
                      <input
                        type="text"
                        value={config.seo?.metaKeywords?.join(', ') || ''}
                        onChange={(e) => onConfigChange({ 
                          ...config, 
                          seo: { ...config.seo, metaKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) } 
                        })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none"
                        placeholder="ecommerce, online store, premium products"
                      />
                      <p className="text-xs text-neutral-500 mt-2">Separate keywords with commas</p>
                    </div>
                  </div>

                  {/* Right Column - Social & Preview */}
                  <div className="space-y-5">
                    {/* Google Preview */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Globe size={16} /> Google Search Preview
                      </label>
                      <div className="bg-white rounded-xl p-5">
                        <p className="text-[15px] text-blue-600 hover:underline cursor-pointer truncate font-medium">
                          {config.seo?.metaTitle || config.name || 'Your Store Name'}
                        </p>
                        <p className="text-sm text-green-700 truncate mt-0.5">https://yourstore.com</p>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {config.seo?.metaDescription || 'Add a meta description to improve your search engine visibility...'}
                        </p>
                      </div>
                    </div>

                    {/* OG Settings */}
                    <div className="bg-neutral-800/30 p-5 rounded-xl border border-neutral-700/50">
                      <label className="text-sm font-bold text-white mb-4 block">Social Sharing</label>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-neutral-400 mb-2 block">OG Title (Social)</label>
                          <input
                            type="text"
                            value={config.seo?.ogTitle || ''}
                            onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, ogTitle: e.target.value } })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-green-500 outline-none"
                            placeholder={config.seo?.metaTitle || 'Social title'}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-400 mb-2 block">OG Image URL</label>
                          <input
                            type="text"
                            value={config.seo?.ogImage || ''}
                            onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, ogImage: e.target.value } })}
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-green-500 outline-none"
                            placeholder="https://... (1200x630 recommended)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advanced SEO - Full Width */}
                <div className="mt-6 bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
                  <h5 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Settings size={16} /> Advanced Settings
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer bg-neutral-900/50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={config.seo?.robotsIndex !== false}
                        onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, robotsIndex: e.target.checked } })}
                        className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-neutral-300">Allow Search Indexing</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer bg-neutral-900/50 p-3 rounded-lg">
                      <input
                        type="checkbox"
                        checked={config.seo?.robotsFollow !== false}
                        onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, robotsFollow: e.target.checked } })}
                        className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-neutral-300">Allow Link Following</span>
                    </label>
                    <div>
                      <label className="text-xs text-neutral-400 mb-2 block">Google Verification</label>
                      <input
                        type="text"
                        value={config.seo?.googleSiteVerification || ''}
                        onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, googleSiteVerification: e.target.value } })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 outline-none"
                        placeholder="Verification code"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-neutral-400 mb-2 block">Bing Verification</label>
                      <input
                        type="text"
                        value={config.seo?.bingSiteVerification || ''}
                        onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, bingSiteVerification: e.target.value } })}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 outline-none"
                        placeholder="Verification code"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-xs text-neutral-400 mb-2 block">Canonical URL (optional)</label>
                    <input
                      type="text"
                      value={config.seo?.canonicalUrl || ''}
                      onChange={(e) => onConfigChange({ ...config, seo: { ...config.seo, canonicalUrl: e.target.value } })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm focus:border-green-500 outline-none"
                      placeholder="https://yourstore.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Scrollbar Tab */}
            {settingsTab === 'scrollbar' && (
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-600/20 rounded-xl">
                    <ArrowDownAZ size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Scrollbar Style</h3>
                    <p className="text-sm text-neutral-400">Choose a scrollbar style for your store</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Scrollbar Options Grid */}
                  <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SCROLLBAR_OPTIONS.slice(0, 12).map((opt) => (
                      <button 
                        key={opt.id} 
                        onClick={() => onConfigChange({ ...config, scrollbarStyle: opt.id as ScrollbarStyleId })}
                        onMouseEnter={() => setPreviewingScrollbar(opt.id)}
                        onMouseLeave={() => setPreviewingScrollbar(null)}
                        className={`text-left rounded-xl border-2 transition-all overflow-hidden ${
                          config.scrollbarStyle === opt.id 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30' 
                            : 'bg-neutral-800/30 border-neutral-700/50 text-neutral-400 hover:border-neutral-500'
                        }`}
                      >
                        <div className="p-3">
                          <div className="font-bold text-sm mb-0.5">{opt.name}</div>
                          <div className="text-[10px] opacity-60">{opt.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Live Preview Panel */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-0">
                      <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden">
                        <div className="p-3 border-b border-neutral-700 bg-neutral-900/50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-400">Live Preview</span>
                            <span className="text-[10px] px-2 py-0.5 bg-indigo-600/20 text-indigo-400 rounded-full">
                              {previewingScrollbar 
                                ? SCROLLBAR_OPTIONS.find(o => o.id === previewingScrollbar)?.name 
                                : SCROLLBAR_OPTIONS.find(o => o.id === config.scrollbarStyle)?.name || 'Native'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Scrollable Preview Area */}
                        <div 
                          className={`h-80 overflow-y-auto p-4 bg-neutral-950 scrollbar-${previewingScrollbar || config.scrollbarStyle || 'native'}`}
                        >
                          <div className="space-y-4">
                            <div className="bg-neutral-800/50 rounded-lg p-4">
                              <h4 className="text-white font-bold mb-2">Featured Products</h4>
                              <p className="text-neutral-400 text-sm">Scroll to see the scrollbar in action</p>
                            </div>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                              <div key={i} className="bg-neutral-800/30 rounded-lg p-3 flex items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-700 rounded-lg flex items-center justify-center">
                                  <Package size={20} className="text-neutral-500" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm text-white font-medium">Product Item {i}</div>
                                  <div className="text-xs text-neutral-500">$99.00</div>
                                </div>
                              </div>
                            ))}
                            <div className="bg-neutral-800/50 rounded-lg p-4 text-center">
                              <p className="text-neutral-500 text-xs">End of content</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Preview Info */}
                        <div className="p-3 border-t border-neutral-700 bg-neutral-900/50">
                          <p className="text-[10px] text-neutral-500 text-center">
                            Hover over options to preview • Click to apply
                          </p>
                        </div>
                      </div>

                      {/* Current Selection */}
                      <div className="mt-4 p-4 bg-neutral-800/30 rounded-xl border border-neutral-700/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-neutral-500">Currently Applied</div>
                            <div className="text-white font-bold">
                              {SCROLLBAR_OPTIONS.find(o => o.id === config.scrollbarStyle)?.name || 'Native'}
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                            <CheckCircle2 size={20} className="text-indigo-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end shrink-0">
            <button 
              onClick={() => setIsInterfaceModalOpen(false)}
              className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Header Preview Popup (renders actual header component)

  const renderBlockArchitect = () => {
    if (!isArchitectOpen) return null;

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Modal Header */}
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-600/20 rounded-lg">
                <Wand2 size={20} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Block Architect</h3>
                <p className="text-xs text-neutral-500">Visual Design Engine</p>
              </div>
            </div>
            <button 
              onClick={() => setIsArchitectOpen(false)} 
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Modal Content - Split View */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Controls (30%) */}
            <div className="w-[30%] border-r border-neutral-800 bg-neutral-950 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-4 space-y-6">
              {/* Layout Matrix */}
              <div>
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <LayoutTemplate size={14} /> Layout
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {['hero', 'split', 'card', 'cover'].map(l => (
                    <button 
                      key={l} 
                      onClick={() => setArchitectConfig({ ...architectConfig, layout: l })} 
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        architectConfig.layout === l 
                          ? 'bg-cyan-600 border-cyan-500 text-white' 
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <BoxSelect size={18} />
                      <span className="text-[10px] font-bold uppercase">{l}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Content Control */}
              <div>
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Type size={14} /> Content
                </h4>
                <div className="space-y-3">
                  <input 
                    value={architectConfig.heading} 
                    onChange={(e) => setArchitectConfig({ ...architectConfig, heading: e.target.value })} 
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white text-sm font-bold focus:border-cyan-500 outline-none" 
                    placeholder="Heading..." 
                  />
                  <textarea 
                    value={architectConfig.body} 
                    onChange={(e) => setArchitectConfig({ ...architectConfig, body: e.target.value })} 
                    className="w-full h-20 bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-neutral-400 text-xs focus:border-cyan-500 outline-none resize-none" 
                    placeholder="Body text..." 
                  />
                </div>
              </div>
              
              {/* Visual Assets */}
              <div>
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ImageIcon size={14} /> Image
                </h4>
                <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                  <img src={architectConfig.image} className="w-full h-full object-cover opacity-50" />
                  <button 
                    onClick={simulateImageGen} 
                    className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 hover:bg-black/40 transition-colors"
                  >
                    {isGeneratingImage ? (
                      <Loader2 className="animate-spin text-white" />
                    ) : (
                      <>
                        <Sparkles size={16} className="text-cyan-400" />
                        <span className="text-xs font-bold text-white">Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Atmosphere */}
              <div>
                <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sliders size={14} /> Effects
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                    <span className="text-xs text-neutral-400">Glass Effect</span>
                    <button 
                      onClick={() => setArchitectConfig(prev => ({ ...prev, glass: !prev.glass }))} 
                      className={`w-10 h-5 rounded-full transition-colors relative ${architectConfig.glass ? 'bg-cyan-600' : 'bg-neutral-700'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${architectConfig.glass ? 'translate-x-5' : ''}`}></div>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['clean', 'dark', 'noise'].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setArchitectConfig(prev => ({ ...prev, bgMode: m }))} 
                        className={`py-2 text-[10px] uppercase font-bold rounded-lg border ${
                          architectConfig.bgMode === m 
                            ? 'bg-neutral-800 border-cyan-500 text-white' 
                            : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Panel - Live Preview */}
            <div className="flex-1 bg-neutral-800 flex flex-col">
              <div className="p-3 border-b border-neutral-700 bg-neutral-900 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Live Preview</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                  <span className="text-[10px] text-neutral-500">Real-time</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-6 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center">
                <div className={`w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden border border-neutral-600 min-h-[300px] ${architectConfig.glass ? 'backdrop-blur-xl bg-white/80' : ''}`}>
                  {/* Preview based on layout */}
                  <div className={`p-12 ${architectConfig.bgMode === 'dark' ? 'bg-neutral-900 text-white' : architectConfig.bgMode === 'noise' ? 'bg-neutral-100' : 'bg-white'}`}>
                    {architectConfig.layout === 'hero' && (
                      <div className="text-center space-y-4">
                        <h2 className="text-4xl font-bold">{architectConfig.heading || 'Your Headline'}</h2>
                        <p className={`text-lg ${architectConfig.bgMode === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          {architectConfig.body || 'Your supporting text goes here'}
                        </p>
                      </div>
                    )}
                    {architectConfig.layout === 'split' && (
                      <div className="flex gap-8 items-center">
                        <div className="flex-1 space-y-4">
                          <h2 className="text-3xl font-bold">{architectConfig.heading || 'Your Headline'}</h2>
                          <p className={architectConfig.bgMode === 'dark' ? 'text-neutral-300' : 'text-neutral-600'}>
                            {architectConfig.body || 'Your supporting text goes here'}
                          </p>
                        </div>
                        <div className="w-48 h-48 bg-neutral-200 rounded-lg overflow-hidden">
                          <img src={architectConfig.image} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    {architectConfig.layout === 'card' && (
                      <div className="max-w-md mx-auto bg-neutral-50 rounded-xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-2">{architectConfig.heading || 'Your Headline'}</h2>
                        <p className="text-neutral-600">{architectConfig.body || 'Your supporting text goes here'}</p>
                      </div>
                    )}
                    {architectConfig.layout === 'cover' && (
                      <div className="relative h-64 rounded-xl overflow-hidden">
                        <img src={architectConfig.image} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center p-6">
                          <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{architectConfig.heading || 'Your Headline'}</h2>
                            <p className="text-neutral-200">{architectConfig.body || 'Your supporting text'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-between items-center shrink-0">
            <p className="text-xs text-neutral-500">
              Layout: <span className="text-white font-medium capitalize">{architectConfig.layout}</span>
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsArchitectOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsArchitectOpen(false)}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // AI Website Builder Questions
  const AI_WIZARD_QUESTIONS = [
    {
      id: 'business_type',
      question: "What type of business is this website for?",
      options: [
        { value: 'ecommerce', label: '🛍️ Online Store', description: 'Sell products online' },
        { value: 'portfolio', label: '🎨 Portfolio', description: 'Showcase your work' },
        { value: 'service', label: '💼 Service Business', description: 'Offer services' },
        { value: 'restaurant', label: '🍽️ Restaurant/Food', description: 'Food & dining' },
        { value: 'blog', label: '📝 Blog/Content', description: 'Share articles & content' },
        { value: 'agency', label: '🏢 Agency', description: 'Marketing/Creative agency' },
      ]
    },
    {
      id: 'style_preference',
      question: "What style best matches your brand?",
      options: [
        { value: 'minimal', label: '✨ Minimal', description: 'Clean and simple' },
        { value: 'bold', label: '💪 Bold', description: 'Strong and impactful' },
        { value: 'playful', label: '🎉 Playful', description: 'Fun and energetic' },
        { value: 'luxury', label: '💎 Luxury', description: 'Premium and elegant' },
        { value: 'modern', label: '🚀 Modern', description: 'Contemporary and sleek' },
        { value: 'cozy', label: '🏡 Cozy', description: 'Warm and inviting' },
      ]
    },
    {
      id: 'primary_goal',
      question: "What's the main goal of your website?",
      options: [
        { value: 'sell', label: '💰 Sell Products', description: 'Drive purchases' },
        { value: 'leads', label: '📧 Get Leads', description: 'Collect contact info' },
        { value: 'showcase', label: '🖼️ Showcase Work', description: 'Display portfolio' },
        { value: 'inform', label: '📚 Inform Visitors', description: 'Share information' },
        { value: 'bookings', label: '📅 Get Bookings', description: 'Schedule appointments' },
        { value: 'brand', label: '🏷️ Build Brand', description: 'Establish presence' },
      ]
    },
    {
      id: 'color_preference',
      question: "Choose your primary brand color:",
      options: [
        { value: '#3B82F6', label: '💙 Blue', description: 'Trust & professionalism' },
        { value: '#10B981', label: '💚 Green', description: 'Growth & nature' },
        { value: '#8B5CF6', label: '💜 Purple', description: 'Creativity & luxury' },
        { value: '#EF4444', label: '❤️ Red', description: 'Energy & passion' },
        { value: '#F59E0B', label: '🧡 Orange', description: 'Friendly & optimistic' },
        { value: '#000000', label: '🖤 Black', description: 'Sophisticated & bold' },
      ]
    },
    {
      id: 'business_name',
      question: "What's your business name?",
      type: 'text',
      placeholder: 'Enter your business name...'
    }
  ];

  // Generate AI Website based on answers
  const generateAIWebsite = async () => {
    setWizardMode('ai-generating');
    
    const { business_type, style_preference, primary_goal, color_preference, business_name } = aiWizardAnswers;
    let sectionsToAdd: PageBlock[] = [];

    try {
      if (genAI) {
        const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an expert website builder. Generate a JSON array of section configurations for a new website.
        Business Name: ${business_name}
        Business Type: ${business_type}
        Style Preference: ${style_preference}
        Primary Goal: ${primary_goal}
        
        Return a JSON array of objects with this structure:
        {
          "type": "system-hero" | "system-collection" | "system-gallery" | "system-social" | "system-contact" | "system-email",
          "variant": "string",
          "data": { ...relevant fields for that section... }
        }
        
        Include at least 5 sections: Hero, Features/Collection, Social Proof, Contact, and Email Signup.
        Make the content specific to the business name and type.
        Just return the JSON array, no markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        try {
          // Clean up potential markdown formatting if AI included it
          const jsonStr = text.replace(/```json\n?|\n?```/g, '');
          const generatedSections = JSON.parse(jsonStr);
          sectionsToAdd = generatedSections.map((s: any, i: number) => ({
            ...s,
            id: `${s.type}-${Date.now()}-${i}`
          }));
        } catch (e) {
          console.error('Failed to parse AI generated sections, falling back to template', e);
        }
      }

      // Fallback or default logic if AI failed or not available
      if (sectionsToAdd.length === 0) {
    const heroTexts: Record<string, { heading: string, subheading: string }> = {
      ecommerce: { heading: `Welcome to ${business_name || 'Our Store'}`, subheading: 'Discover our curated collection of premium products.' },
      portfolio: { heading: `${business_name || 'Creative Studio'}`, subheading: 'Crafting beautiful digital experiences since day one.' },
      service: { heading: `${business_name || 'Expert Services'}`, subheading: 'Professional solutions tailored to your needs.' },
      restaurant: { heading: `${business_name || 'Delicious Eats'}`, subheading: 'Fresh ingredients, unforgettable flavors.' },
      blog: { heading: `${business_name || 'The Blog'}`, subheading: 'Stories, insights, and ideas worth sharing.' },
      agency: { heading: `${business_name || 'Creative Agency'}`, subheading: 'We turn bold ideas into remarkable results.' },
    };
    
    const heroContent = heroTexts[business_type] || heroTexts.ecommerce;
    
    sectionsToAdd.push({
      id: `hero-${Date.now()}`,
      type: 'system-hero',
      name: 'Hero',
      content: '',
      variant: style_preference === 'minimal' ? 'centered-gradient' : style_preference === 'bold' ? 'impact' : 'editorial',
      data: {
        heading: heroContent.heading,
        subheading: heroContent.subheading,
        buttonText: primary_goal === 'sell' ? 'Shop Now' : primary_goal === 'leads' ? 'Get Started' : 'Learn More',
        buttonLink: primary_goal === 'sell' ? '/shop' : '#contact',
      }
    });
    
    // Add sections based on business type
    if (business_type === 'ecommerce' || primary_goal === 'sell') {
      sectionsToAdd.push({
        id: `products-${Date.now()}`,
        type: 'system-collection',
        name: 'Featured Products',
        content: '',
        variant: 'minimal-grid',
        data: {
          heading: 'Featured Products',
          subheading: 'Our most popular items',
          productCount: 8,
          gridColumns: '4',
        }
      });
    }
    
    if (business_type === 'portfolio' || primary_goal === 'showcase') {
      sectionsToAdd.push({
        id: `gallery-${Date.now()}`,
        type: 'system-gallery',
        name: 'Gallery',
        content: '',
        variant: 'masonry',
        data: {
          heading: 'Our Work',
          subheading: 'A selection of our best projects',
        }
      });
    }
    
    // Add social proof section
    sectionsToAdd.push({
      id: `social-${Date.now()}`,
      type: 'system-social',
      name: 'Testimonials',
      content: '',
      variant: 'testimonial-cards',
      data: {
        heading: 'What People Say',
        subheading: 'Trusted by customers worldwide',
      }
    });
    
    // Add contact section for lead generation
    if (primary_goal === 'leads' || primary_goal === 'bookings') {
      sectionsToAdd.push({
        id: `contact-${Date.now()}`,
        type: 'system-contact',
        name: 'Contact',
        content: '',
        variant: 'split',
        data: {
          heading: 'Get in Touch',
          subheading: 'We\'d love to hear from you',
          submitButtonText: 'Send Message',
          successMessage: 'Thanks! We\'ll be in touch soon.',
        }
      });
    }
    
    // Add email signup
    sectionsToAdd.push({
      id: `email-${Date.now()}`,
      type: 'system-email',
      name: 'Newsletter',
      content: '',
      variant: 'centered',
      data: {
        heading: 'Stay Updated',
        subheading: 'Subscribe to our newsletter for the latest news and offers.',
        buttonText: 'Subscribe',
      }
    });
    
    // Update the page with generated sections
    onUpdatePage(activePageId, { blocks: sectionsToAdd });
    
    // Update store config with color preference
    if (color_preference) {
      onConfigChange({ ...config, primaryColor: color_preference });
    }
    if (business_name) {
      onConfigChange({ ...config, name: business_name });
    }
    
    // Close wizard
    setShowWelcomeWizard(false);
    setHasSeenWelcome(true);
    localStorage.setItem('evolv_seen_welcome', 'true');
    setWizardMode('select');
    setAiWizardStep(0);
    setAiWizardAnswers({});
    
    showToast('🎉 Your website has been generated! Customize each section as needed.', 'success');
    
    // Show tutorial after generation
    if (!hasSeenTutorial) {
      setTimeout(() => setShowTutorial(true), 500);
    }
    }
    } catch (err) {
      console.error('Error generating AI website:', err);
      showToast('Failed to generate website. Please try again.', 'error');
    } finally {
      setWizardMode('select');
    }
  };

  // Page Templates
  const PAGE_TEMPLATES = [
    {
      id: 'modern-store',
      name: 'Modern E-commerce',
      description: 'Clean product-focused design',
      preview: '🛍️',
      sections: ['hero', 'collection', 'social', 'email']
    },
    {
      id: 'minimal-portfolio',
      name: 'Minimal Portfolio',
      description: 'Showcase your work elegantly',
      preview: '🎨',
      sections: ['hero', 'gallery', 'contact']
    },
    {
      id: 'agency-landing',
      name: 'Agency Landing',
      description: 'Bold and professional',
      preview: '🏢',
      sections: ['hero', 'layout', 'social', 'contact']
    },
    {
      id: 'blog-home',
      name: 'Blog Homepage',
      description: 'Content-first design',
      preview: '📝',
      sections: ['hero', 'blog', 'email']
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      description: 'Showcase your menu',
      preview: '🍽️',
      sections: ['hero', 'gallery', 'contact']
    },
    {
      id: 'service-business',
      name: 'Service Business',
      description: 'Generate leads and bookings',
      preview: '💼',
      sections: ['hero', 'layout', 'collapsible', 'contact']
    }
  ];

  const applyTemplate = (templateId: string) => {
    const template = PAGE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    const sectionsToAdd: PageBlock[] = [];
    
    template.sections.forEach((sectionType, index) => {
      const sectionId = `${sectionType}-${Date.now()}-${index}`;
      
      switch (sectionType) {
        case 'hero':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-hero',
            name: 'Hero',
            content: '',
            variant: 'impact',
            data: { heading: 'Your Headline Here', subheading: 'Your supporting text goes here.', buttonText: 'Get Started' }
          });
          break;
        case 'collection':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-collection',
            name: 'Collection',
            content: '',
            variant: 'minimal-grid',
            data: { heading: 'Featured Products', productCount: 8 }
          });
          break;
        case 'gallery':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-gallery',
            name: 'Gallery',
            content: '',
            variant: 'masonry',
            data: { heading: 'Our Gallery' }
          });
          break;
        case 'contact':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-contact',
            name: 'Contact',
            content: '',
            variant: 'split',
            data: { heading: 'Contact Us', submitButtonText: 'Send Message' }
          });
          break;
        case 'social':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-social',
            name: 'Social proof',
            content: '',
            variant: 'testimonial-cards',
            data: { heading: 'What People Say' }
          });
          break;
        case 'email':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-email',
            name: 'Email capture',
            content: '',
            variant: 'centered',
            data: { heading: 'Stay Updated', buttonText: 'Subscribe' }
          });
          break;
        case 'blog':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-blog',
            name: 'Blog',
            content: '',
            variant: 'grid',
            data: { heading: 'Latest Articles', postsToShow: 6 }
          });
          break;
        case 'layout':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-layout',
            name: 'Layout',
            content: '',
            variant: 'two-column',
            data: { heading: 'Why Choose Us', subheading: 'We deliver excellence in everything we do.' }
          });
          break;
        case 'collapsible':
          sectionsToAdd.push({
            id: sectionId,
            type: 'system-collapsible',
            name: 'FAQ',
            content: '',
            variant: 'faq',
            data: { heading: 'Frequently Asked Questions' }
          });
          break;
      }
    });
    
    onUpdatePage(activePageId, { blocks: sectionsToAdd });
    setShowWelcomeWizard(false);
    setHasSeenWelcome(true);
    localStorage.setItem('evolv_seen_welcome', 'true');
    setWizardMode('select');
    showToast(`Applied "${template.name}" template!`, 'success');
  };

  // Welcome Wizard for Design Studio (first-time users)
  const renderWelcomeWizard = () => {
    if (!showWelcomeWizard) return null;
    
    const dismissWizard = () => {
      setShowWelcomeWizard(false);
      setHasSeenWelcome(true);
      localStorage.setItem('evolv_seen_welcome', 'true');
      setWizardMode('select');
      setAiWizardStep(0);
    };
    
    const currentQuestion = AI_WIZARD_QUESTIONS[aiWizardStep];
    
    // AI Questions Mode
    if (wizardMode === 'ai-questions' && currentQuestion) {
      return (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-300">
            {/* Progress Bar */}
            <div className="p-4 border-b border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => aiWizardStep > 0 ? setAiWizardStep(aiWizardStep - 1) : setWizardMode('select')} className="text-neutral-400 hover:text-white transition-colors">
                  ← Back
                </button>
                <span className="text-xs text-neutral-500">Step {aiWizardStep + 1} of {AI_WIZARD_QUESTIONS.length}</span>
              </div>
              <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${((aiWizardStep + 1) / AI_WIZARD_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">{currentQuestion.question}</h2>
              
              {currentQuestion.type === 'text' ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={aiWizardAnswers[currentQuestion.id] || ''}
                    onChange={(e) => setAiWizardAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                    placeholder={currentQuestion.placeholder}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-4 text-white text-lg focus:border-blue-500 outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (aiWizardStep < AI_WIZARD_QUESTIONS.length - 1) {
                        setAiWizardStep(aiWizardStep + 1);
                      } else {
                        generateAIWebsite();
                      }
                    }}
                    disabled={!aiWizardAnswers[currentQuestion.id]}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-lg transition-all"
                  >
                    {aiWizardStep < AI_WIZARD_QUESTIONS.length - 1 ? 'Continue' : '✨ Generate My Website'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setAiWizardAnswers(prev => ({ ...prev, [currentQuestion.id]: option.value }));
                        if (aiWizardStep < AI_WIZARD_QUESTIONS.length - 1) {
                          setAiWizardStep(aiWizardStep + 1);
                        } else {
                          generateAIWebsite();
                        }
                      }}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        aiWizardAnswers[currentQuestion.id] === option.value
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-neutral-800/50 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="text-lg mb-1">{option.label}</div>
                      <div className="text-xs text-neutral-500">{option.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-neutral-800 flex justify-center">
              <button onClick={dismissWizard} className="text-sm text-neutral-500 hover:text-white transition-colors">
                Skip and start from scratch
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // AI Generating Mode
    if (wizardMode === 'ai-generating') {
      return (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-md p-12 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Building Your Website...</h2>
            <p className="text-neutral-400 mb-6">AI is creating the perfect design for your business.</p>
            <div className="flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin text-blue-500" />
              <span className="text-sm text-neutral-500">This usually takes about 5 seconds</span>
            </div>
          </div>
        </div>
      );
    }
    
    // Templates Mode
    if (wizardMode === 'templates') {
      return (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-3xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Choose a Template</h2>
                <p className="text-neutral-500 text-sm">Start with a pre-built design</p>
              </div>
              <button onClick={() => setWizardMode('select')} className="text-neutral-400 hover:text-white">
                ← Back
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {PAGE_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template.id)}
                  className="group p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl text-left hover:border-blue-500 hover:bg-blue-500/10 transition-all"
                >
                  <div className="text-4xl mb-3">{template.preview}</div>
                  <h3 className="font-bold text-white mb-1">{template.name}</h3>
                  <p className="text-xs text-neutral-500">{template.description}</p>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-neutral-800 flex justify-center">
              <button onClick={dismissWizard} className="text-sm text-neutral-500 hover:text-white transition-colors">
                Skip for now
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Default Selection Mode - Now shows that user has a starter template
    return (
      <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-300">
          <div className="p-8 text-center border-b border-neutral-800">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Design Studio!</h2>
            <p className="text-neutral-400">We've created a starter template for you. Choose how you'd like to proceed:</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 gap-4">
            {/* Start Editing - Primary CTA */}
            <button 
              onClick={() => {
                dismissWizard();
                showToast('Click any section to start editing!', 'success');
              }}
              className="group p-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500/50 rounded-xl text-left hover:border-green-400 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <Edit3 size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">Start Customizing</h3>
                    <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">RECOMMENDED</span>
                  </div>
                  <p className="text-neutral-400 text-sm">Your starter template is ready! Click any section in the preview to edit its content.</p>
                </div>
                <ChevronRight size={20} className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
            
            {/* AI Build Option */}
            <button 
              onClick={() => {
                setWizardMode('ai-questions');
                setAiWizardStep(0);
              }}
              className="group p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-neutral-700 rounded-xl text-left hover:border-blue-400 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Generate with AI</h3>
                  <p className="text-neutral-400 text-sm">Answer 5 quick questions and AI will create a personalized website for your business.</p>
                </div>
                <ChevronRight size={20} className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
            
            {/* Template Option */}
            <button 
              onClick={() => setWizardMode('templates')}
              className="group p-6 bg-neutral-800/50 border border-neutral-700 rounded-xl text-left hover:border-neutral-500 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-700 rounded-lg">
                  <Layout size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Browse Templates</h3>
                  <p className="text-neutral-400 text-sm">Choose from pre-designed templates for different business types.</p>
                </div>
                <ChevronRight size={20} className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </div>
          
          {/* Quick Tips */}
          <div className="px-6 pb-6">
            <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-500" />
                Quick Tips
              </h4>
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• Click any section in the preview to edit it</li>
                <li>• Use the + button to add new sections</li>
                <li>• Drag sections to reorder them</li>
                <li>• Look for ✨ AI buttons to generate content</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 border-t border-neutral-800 flex justify-center">
            <button onClick={dismissWizard} className="text-sm text-neutral-500 hover:text-white transition-colors">
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Tutorial System for first-time users
  const TUTORIAL_STEPS = [
    {
      title: 'Welcome to Design Studio!',
      description: 'This is where you build and customize your website. Let me show you around.',
      target: null,
      position: 'center'
    },
    {
      title: 'Page Structure',
      description: 'Your page is made up of sections. Each section is a building block of your website.',
      target: 'section-list',
      position: 'right'
    },
    {
      title: 'Add Sections',
      description: 'Click the + button to add new sections like Hero, Products, Contact Forms, and more.',
      target: 'add-section-btn',
      position: 'right'
    },
    {
      title: 'Edit Content',
      description: 'Click any section to edit its content, images, and styling in the panel on the left.',
      target: 'editor-panel',
      position: 'right'
    },
    {
      title: 'Live Preview',
      description: 'See your changes in real-time! Toggle between desktop, tablet, and mobile views.',
      target: 'preview-device',
      position: 'bottom'
    },
    {
      title: 'AI Assistance',
      description: 'Look for the ✨ AI Write buttons to generate content instantly.',
      target: null,
      position: 'center'
    },
    {
      title: 'You\'re Ready!',
      description: 'Start building your website. You can access this tutorial anytime from the Help menu.',
      target: null,
      position: 'center'
    }
  ];

  const renderTutorial = () => {
    if (!showTutorial) return null;
    
    const currentStep = TUTORIAL_STEPS[tutorialStep];
    const isLastStep = tutorialStep === TUTORIAL_STEPS.length - 1;
    
    const dismissTutorial = () => {
      setShowTutorial(false);
      setHasSeenTutorial(true);
      localStorage.setItem('evolv_seen_tutorial', 'true');
      setTutorialStep(0);
    };
    
    return (
      <div className="fixed inset-0 z-[400] pointer-events-none">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={dismissTutorial} />
        
        {/* Tutorial Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-[400px] animate-in zoom-in-95 duration-300">
            {/* Progress */}
            <div className="p-4 border-b border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-500">Tutorial</span>
                <span className="text-xs text-neutral-500">{tutorialStep + 1} / {TUTORIAL_STEPS.length}</span>
              </div>
              <div className="flex gap-1">
                {TUTORIAL_STEPS.map((_, i) => (
                  <div key={i} className={`flex-1 h-1 rounded-full ${i <= tutorialStep ? 'bg-blue-500' : 'bg-neutral-800'}`} />
                ))}
              </div>
            </div>
            
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{currentStep.title}</h3>
              <p className="text-neutral-400 text-sm">{currentStep.description}</p>
            </div>
            
            <div className="p-4 border-t border-neutral-800 flex items-center justify-between">
              <button onClick={dismissTutorial} className="text-sm text-neutral-500 hover:text-white transition-colors">
                Skip tutorial
              </button>
              <div className="flex gap-2">
                {tutorialStep > 0 && (
                  <button 
                    onClick={() => setTutorialStep(tutorialStep - 1)}
                    className="px-4 py-2 text-neutral-400 hover:text-white"
                  >
                    Back
                  </button>
                )}
                <button 
                  onClick={() => isLastStep ? dismissTutorial() : setTutorialStep(tutorialStep + 1)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // AI Section Recommendations
  const getSectionRecommendations = () => {
    const existingSections = activePage.blocks?.map(b => b.type) || [];
    const recommendations: Array<{ type: string, label: string, reason: string }> = [];
    
    // Always recommend these if missing
    if (!existingSections.includes('system-hero')) {
      recommendations.push({ type: 'system-hero', label: 'Hero Section', reason: 'First impression for visitors' });
    }
    
    // If has products/hero but no social proof
    if ((existingSections.includes('system-collection') || existingSections.includes('system-hero')) && !existingSections.includes('system-social')) {
      recommendations.push({ type: 'system-social', label: 'Customer Reviews', reason: 'Builds trust (+35% conversion)' });
    }
    
    // If has hero but no contact
    if (existingSections.includes('system-hero') && !existingSections.includes('system-contact')) {
      recommendations.push({ type: 'system-contact', label: 'Contact Form', reason: 'Let customers reach you' });
    }
    
    // If has multiple sections but no FAQ
    if (existingSections.length >= 2 && !existingSections.includes('system-collapsible')) {
      recommendations.push({ type: 'system-collapsible', label: 'FAQ Section', reason: 'Answer common questions' });
    }
    
    // If no email signup
    if (!existingSections.includes('system-email')) {
      recommendations.push({ type: 'system-email', label: 'Email Signup', reason: 'Grow your subscriber list' });
    }
    
    return recommendations.slice(0, 3);
  };

  const renderSectionRecommendations = () => {
    if (!showSectionRecommendations) return null;
    
    const recommendations = getSectionRecommendations();
    if (recommendations.length === 0) {
      setShowSectionRecommendations(false);
      return null;
    }
    
    return (
      <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl w-[320px]">
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-400" />
              <span className="font-bold text-white text-sm">AI Suggestions</span>
            </div>
            <button onClick={() => setShowSectionRecommendations(false)} className="text-neutral-500 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="p-3 space-y-2">
            <p className="text-xs text-neutral-500 mb-3">Based on your page, consider adding:</p>
            {recommendations.map((rec) => (
              <button
                key={rec.type}
                onClick={() => {
                  // Add the recommended section
                  const newBlock: PageBlock = {
                    id: `${rec.type}-${Date.now()}`,
                    type: rec.type as any,
                    name: rec.label,
                    content: '', // Default content
                    variant: 'default',
                    data: {}
                  };
                  const currentBlocks = activePage.blocks || [];
                  onUpdatePage(activePageId, { blocks: [...currentBlocks, newBlock] });
                  showToast(`Added ${rec.label}!`, 'success');
                }}
                className="w-full flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 rounded-lg text-left transition-colors group"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{rec.label}</div>
                  <div className="text-[10px] text-neutral-500">{rec.reason}</div>
                </div>
                <Plus size={16} className="text-neutral-500 group-hover:text-blue-400 transition-colors" />
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-neutral-800">
            <button 
              onClick={() => {
                localStorage.setItem('evolv_hide_suggestions', 'true');
                setShowSectionRecommendations(false);
              }}
              className="text-[10px] text-neutral-600 hover:text-neutral-400"
            >
              Don't show suggestions
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Pre-Publish Checklist
  const getPublishChecklist = () => {
    const blocks = activePage.blocks || [];
    const hasHero = blocks.some(b => b.type === 'system-hero');
    const hasContact = blocks.some(b => b.type === 'system-contact');
    const hasProducts = blocks.some(b => b.type === 'system-collection');
    const hasEmailSignup = blocks.some(b => b.type === 'system-email');
    
    return [
      { 
        id: 'hero', 
        label: 'Hero section added', 
        passed: hasHero, 
        fix: () => {
          const newBlock: PageBlock = { id: `hero-${Date.now()}`, type: 'system-hero', name: 'Hero', content: '', variant: 'impact', data: { heading: 'Your Headline Here' } };
          onUpdatePage(activePageId, { blocks: [newBlock, ...blocks] });
        }
      },
      { 
        id: 'contact', 
        label: 'Contact information available', 
        passed: hasContact || !!config.supportEmail,
        fix: () => {
          if (!hasContact) {
            const newBlock: PageBlock = { id: `contact-${Date.now()}`, type: 'system-contact', name: 'Contact', content: '', variant: 'split', data: {} };
            onUpdatePage(activePageId, { blocks: [...blocks, newBlock] });
          }
        }
      },
      { 
        id: 'products', 
        label: 'Products or content displayed', 
        passed: hasProducts || blocks.length >= 3,
        fix: () => {
          if (!hasProducts) {
            const newBlock: PageBlock = { id: `collection-${Date.now()}`, type: 'system-collection', name: 'Collection', content: '', variant: 'featured-collection', data: {} };
            onUpdatePage(activePageId, { blocks: [...blocks, newBlock] });
          }
        }
      },
      { 
        id: 'seo', 
        label: 'Store name configured', 
        passed: !!config.name && config.name !== 'My Store',
        fix: () => onTabChange(AdminTab.SETTINGS)
      },
      { 
        id: 'email', 
        label: 'Email capture enabled', 
        passed: hasEmailSignup,
        fix: () => {
          const newBlock: PageBlock = { id: `email-${Date.now()}`, type: 'system-email', name: 'Email', content: '', variant: 'centered', data: {} };
          onUpdatePage(activePageId, { blocks: [...blocks, newBlock] });
        }
      },
    ];
  };

  const renderPublishChecklist = () => {
    if (!showPublishChecklist) return null;
    
    const checklist = getPublishChecklist();
    const passedCount = checklist.filter(c => c.passed).length;
    const allPassed = passedCount === checklist.length;
    
    return (
      <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {allPassed ? (
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-white" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                    <AlertTriangle size={20} className="text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-white">Pre-Publish Check</h2>
                  <p className="text-sm text-neutral-500">{passedCount}/{checklist.length} items passed</p>
                </div>
              </div>
              <button onClick={() => setShowPublishChecklist(false)} className="text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-2">
            {checklist.map((item) => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg ${item.passed ? 'bg-emerald-900/20 border border-emerald-900/30' : 'bg-amber-900/20 border border-amber-900/30'}`}
              >
                <div className="flex items-center gap-3">
                  {item.passed ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <Circle size={18} className="text-amber-400" />
                  )}
                  <span className={`text-sm ${item.passed ? 'text-emerald-100' : 'text-amber-100'}`}>{item.label}</span>
                </div>
                {!item.passed && (
                  <button 
                    onClick={() => { item.fix(); setShowPublishChecklist(false); }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                  >
                    Fix
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-neutral-800 flex gap-3">
            <button 
              onClick={() => setShowPublishChecklist(false)}
              className="flex-1 py-3 text-neutral-400 hover:text-white font-bold"
            >
              Review Later
            </button>
            <button 
              onClick={() => {
                setShowPublishChecklist(false);
                handlePublish();
              }}
              className={`flex-1 py-3 rounded-xl font-bold ${allPassed ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
            >
              {allPassed ? 'Publish Now' : 'Publish Anyway'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Brand Settings Modal
  const renderBrandSettings = () => {
    if (!showBrandSettings) return null;
    
    const colorPalettes = [
      { name: 'Ocean', colors: ['#0EA5E9', '#0284C7', '#0369A1', '#075985'] },
      { name: 'Forest', colors: ['#22C55E', '#16A34A', '#15803D', '#166534'] },
      { name: 'Sunset', colors: ['#F97316', '#EA580C', '#DC2626', '#B91C1C'] },
      { name: 'Lavender', colors: ['#A855F7', '#9333EA', '#7E22CE', '#6B21A8'] },
      { name: 'Mono', colors: ['#FFFFFF', '#A3A3A3', '#525252', '#171717'] },
      { name: 'Warm', colors: ['#FBBF24', '#F59E0B', '#D97706', '#B45309'] },
    ];
    
    return (
      <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Brand Settings</h2>
              <p className="text-neutral-500 text-sm">Customize your site's look and feel</p>
            </div>
            <button onClick={() => setShowBrandSettings(false)} className="text-neutral-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Primary Color */}
            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-3">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.primaryColor || '#6366F1'}
                  onChange={(e) => onUpdateConfig({ primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-neutral-700"
                />
                <input
                  type="text"
                  value={config.primaryColor || '#6366F1'}
                  onChange={(e) => onUpdateConfig({ primaryColor: e.target.value })}
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-sm"
                />
                <button 
                  onClick={() => {
                    // Generate AI palette
                    const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
                    onUpdateConfig({ primaryColor: randomPalette.colors[0] });
                    showToast(`Applied ${randomPalette.name} palette`, 'success');
                  }}
                  className="px-3 py-2 bg-purple-600/20 border border-purple-600/50 rounded-lg text-purple-400 text-sm font-bold flex items-center gap-2"
                >
                  <Sparkles size={14} /> AI Suggest
                </button>
              </div>
            </div>
            
            {/* Color Palettes */}
            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-3">Quick Palettes</label>
              <div className="grid grid-cols-3 gap-3">
                {colorPalettes.map((palette) => (
                  <button
                    key={palette.name}
                    onClick={() => onUpdateConfig({ primaryColor: palette.colors[0] })}
                    className="p-3 bg-neutral-800 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
                  >
                    <div className="flex gap-1 mb-2">
                      {palette.colors.map((color, i) => (
                        <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-400">{palette.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Store Name */}
            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Store Name</label>
              <input
                type="text"
                value={config.name || ''}
                onChange={(e) => onUpdateConfig({ name: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white"
                placeholder="Your Store Name"
              />
            </div>
            
            {/* Logo */}
            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Logo</label>
              {config.logoUrl ? (
                <div className="flex items-center gap-3">
                  <img src={config.logoUrl} alt="Logo" className="h-12 object-contain bg-neutral-800 rounded-lg p-2" />
                  <button 
                    onClick={() => onUpdateConfig({ logoUrl: '' })}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center h-20 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-neutral-500">
                  <div className="text-center">
                    <Upload size={20} className="mx-auto text-neutral-500 mb-1" />
                    <span className="text-xs text-neutral-500">Upload Logo</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              )}
            </div>
          </div>
          
          <div className="p-4 border-t border-neutral-800 flex justify-end">
            <button 
              onClick={() => setShowBrandSettings(false)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Navigation Builder Modal
  const renderNavBuilder = () => {
    if (!showNavBuilder) return null;
    
    // Get pages sorted by display_order if available, otherwise by current array order
    const sortedPages = [...localPages]
      .filter(p => p.type !== 'hidden')
      .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));
    
    const handleDragStart = (e: React.DragEvent, pageId: string) => {
      setPageDraggedItem(pageId);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', pageId);
      // Add a slight delay to show the dragging state
      setTimeout(() => {
        const element = document.getElementById(`nav-item-${pageId}`);
        if (element) element.style.opacity = '0.5';
      }, 0);
    };
    
    const handleDragEnd = (e: React.DragEvent) => {
      const element = document.getElementById(`nav-item-${pageDraggedItem}`);
      if (element) element.style.opacity = '1';
      setPageDraggedItem(null);
      setPageDragOverItem(null);
    };
    
    const handleDragOver = (e: React.DragEvent, pageId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (pageId !== pageDraggedItem) {
        setPageDragOverItem(pageId);
      }
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
      setPageDragOverItem(null);
    };
    
    const handleDrop = (e: React.DragEvent, targetPageId: string) => {
      e.preventDefault();
      if (!pageDraggedItem || pageDraggedItem === targetPageId) return;
      
      // Reorder pages
      const draggedIndex = sortedPages.findIndex(p => p.id === pageDraggedItem);
      const targetIndex = sortedPages.findIndex(p => p.id === targetPageId);
      
      if (draggedIndex === -1 || targetIndex === -1) return;
      
      // Create new order
      const newOrder = [...sortedPages];
      const [removed] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, removed);
      
      // Update display_order for all pages
      const updatedPages = newOrder.map((page, index) => ({
        ...page,
        display_order: index
      }));
      
      // Update local state
      setLocalPages(prev => {
        const hiddenPages = prev.filter(p => p.type === 'hidden');
        return [...updatedPages, ...hiddenPages];
      });
      
      // Save to database
      updatedPages.forEach((page, index) => {
        onUpdatePage(page.id, { display_order: index });
      });
      
      setPageDraggedItem(null);
      setPageDragOverItem(null);
    };
    
    const startEditing = (page: any) => {
      setEditingPageItem(page.id);
      setEditPageTitle(page.title);
      setEditPageSlug(page.slug?.replace(/^\//, '') || '');
    };
    
    const saveEditing = () => {
      if (!editingPageItem) return;
      
      const page = localPages.find(p => p.id === editingPageItem);
      if (!page) return;
      
      const newSlug = page.type === 'home' ? '/' : `/${editPageSlug.replace(/^\//, '')}`;
      
      // Update local state
      setLocalPages(prev => prev.map(p => 
        p.id === editingPageItem 
          ? { ...p, title: editPageTitle, slug: newSlug }
          : p
      ));
      
      // Save to database
      onUpdatePage(editingPageItem, { 
        title: editPageTitle, 
        slug: newSlug 
      });
      
      setEditingPageItem(null);
      setEditPageTitle('');
      setEditPageSlug('');
    };
    
    const cancelEditing = () => {
      setEditingPageItem(null);
      setEditPageTitle('');
      setEditPageSlug('');
    };
    
    return (
      <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Navigation Menu</h2>
              <p className="text-neutral-500 text-sm">Configure your site navigation</p>
            </div>
            <button onClick={() => { setShowNavBuilder(false); cancelEditing(); }} className="text-neutral-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
            <p className="text-xs text-neutral-500 mb-3">Drag to reorder. Click Edit to rename pages.</p>
            {sortedPages.map((page, index) => (
              <div 
                key={page.id}
                id={`nav-item-${page.id}`}
                draggable={editingPageItem !== page.id}
                onDragStart={(e) => handleDragStart(e, page.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, page.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, page.id)}
                className={`flex items-center gap-3 p-3 bg-neutral-800 border rounded-lg group transition-all ${
                  pageDragOverItem === page.id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-neutral-700'
                } ${pageDraggedItem === page.id ? 'opacity-50' : ''}`}
              >
                <div className="cursor-grab active:cursor-grabbing">
                  <GripVertical size={14} className="text-neutral-500 hover:text-neutral-300" />
                </div>
                
                {editingPageItem === page.id ? (
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={editPageTitle}
                      onChange={(e) => setEditPageTitle(e.target.value)}
                      className="w-full bg-black border border-neutral-600 rounded px-2 py-1 text-sm text-white focus:border-blue-500 outline-none"
                      placeholder="Page title"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditing();
                        if (e.key === 'Escape') cancelEditing();
                      }}
                    />
                    {page.type !== 'home' && (
                      <div className="flex items-center gap-1">
                        <span className="text-neutral-500 text-xs">/</span>
                        <input
                          type="text"
                          value={editPageSlug}
                          onChange={(e) => setEditPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="flex-1 bg-black border border-neutral-600 rounded px-2 py-1 text-xs text-neutral-400 font-mono focus:border-blue-500 outline-none"
                          placeholder="page-slug"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditing();
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                      </div>
                    )}
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={cancelEditing}
                        className="px-2 py-1 text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={saveEditing}
                        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{page.title}</div>
                      <div className="text-[10px] text-neutral-500 font-mono truncate">
                        {page.type === 'home' ? '/' : `/${page.slug?.replace(/^\//, '') || ''}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditing(page)}
                        className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded"
                        title="Edit page"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button 
                        onClick={() => {
                          onSetActivePage(page.id);
                          setShowNavBuilder(false);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded"
                        title="Open in editor"
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-neutral-800">
            <button 
              onClick={() => {
                setShowNavBuilder(false);
                setIsAddPageModalOpen(true);
              }}
              className="w-full py-3 border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-lg text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add New Page
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add New Page Modal
  const renderAddPageModal = () => {
    if (!isAddPageModalOpen) return null;
    
    return (
      <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Create New Page</h2>
              <p className="text-neutral-500 text-sm">Choose a page type to get started</p>
            </div>
            <button onClick={() => setIsAddPageModalOpen(false)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            {/* Page Type Selection */}
            <div className="grid grid-cols-3 gap-3">
              {PAGE_TYPE_OPTIONS.map((pageType) => (
                <button
                  key={pageType.id}
                  onClick={() => {
                    setNewPageType(pageType.id);
                    setNewPageName(pageType.id === 'custom' ? '' : pageType.name);
                    setNewPageSlug(pageType.slug);
                  }}
                  className={`p-4 rounded-xl border transition-all text-center ${
                    newPageType === pageType.id 
                      ? 'bg-blue-600/20 border-blue-500 text-white' 
                      : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-500'
                  }`}
                >
                  <pageType.icon size={24} className="mx-auto mb-2" />
                  <div className="font-bold text-sm">{pageType.name}</div>
                </button>
              ))}
            </div>
            
            {/* Page Name Input */}
            <div>
              <label className="block text-sm font-bold text-neutral-300 mb-2">Page Name</label>
              <input
                type="text"
                value={newPageName}
                onChange={(e) => {
                  setNewPageName(e.target.value);
                  // Auto-generate slug from name
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  setNewPageSlug(slug ? `/${slug}` : '');
                }}
                placeholder="e.g., About Our Team"
                className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
              />
            </div>
            
            {/* URL Slug Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-neutral-300 mb-2">
                URL Path
                <span className="group relative cursor-help">
                  <HelpCircle size={12} className="text-neutral-500 hover:text-neutral-300" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-neutral-300 text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-neutral-700 shadow-lg">
                    The URL where this page will be accessible (e.g., /about-us)
                  </span>
                </span>
              </label>
              <div className="flex items-center bg-black border border-neutral-700 rounded-lg overflow-hidden focus-within:border-blue-500">
                <span className="px-4 py-3 text-neutral-500 bg-neutral-800 border-r border-neutral-700">yourstore.com</span>
                <input
                  type="text"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  placeholder="/about-us"
                  className="flex-1 bg-transparent px-4 py-3 text-white outline-none font-mono"
                />
              </div>
              <p className="text-[10px] text-neutral-600 mt-1">Use lowercase letters, numbers, and hyphens only</p>
            </div>
          </div>
          
          <div className="p-6 border-t border-neutral-800 flex justify-end gap-3">
            <button 
              onClick={() => setIsAddPageModalOpen(false)}
              className="px-6 py-3 text-neutral-400 hover:text-white font-bold"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreatePage}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2"
            >
              <Plus size={18} />
              Create Page
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderVersionHistory = () => {
    if (!showVersionHistory) return null;

    return (
      <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Version History</h2>
              <p className="text-neutral-500 text-sm">Restore previous versions of this page</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => savePageVersion()}
                disabled={isSavingVersion}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingVersion ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Current
              </button>
              <button onClick={() => setShowVersionHistory(false)} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {pageVersions.length === 0 ? (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-neutral-700 mb-4" />
                <p className="text-neutral-500">No versions found for this page.</p>
                <p className="text-xs text-neutral-600 mt-1">Save your first version to see it here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pageVersions.map((version) => (
                  <div 
                    key={version.id}
                    className="p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl flex items-center justify-between group hover:border-neutral-500 transition-all"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{version.version_name}</div>
                      <div className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                        <Calendar size={12} />
                        {new Date(version.created_at).toLocaleString()}
                        <span className="px-1.5 py-0.5 bg-neutral-700 rounded text-[10px]">{version.blocks.length} sections</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => restoreVersion(version)}
                      className="px-4 py-2 bg-neutral-700 hover:bg-white hover:text-black text-white rounded-lg text-xs font-bold transition-all"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 rounded-b-2xl">
            <p className="text-[10px] text-neutral-500 text-center">
              Restoring a version will replace your current draft. You must click "Save Changes" to make it live.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAddSectionLibrary = () => {
    if (!isAddSectionOpen) return null;

    const categoryColors: Record<string, string> = {
      hero: 'purple',
      grid: 'green',
      collection: 'emerald',
      layout: 'cyan',
      scroll: 'orange',
      social: 'pink',
      blog: 'rose',
      video: 'red',
      content: 'blue',
      marketing: 'yellow',
      media: 'indigo',
      contact: 'teal'
    };

    const currentColor = categoryColors[selectedCategory || 'purple'] || 'purple';

    return (
      <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Modal Header */}
          <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-600/20 rounded-lg">
                <Plus size={20} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Add Section</h3>
                <p className="text-xs text-neutral-500">{addSectionStep === 'categories' ? 'Choose Type' : 'Select Style'}</p>
              </div>
            </div>
            <button 
              onClick={() => { setIsAddSectionOpen(false); setPreviewBlock(null); setAddSectionStep('categories'); }} 
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {addSectionStep === 'categories' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button onClick={() => { setSelectedCategory('hero'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-purple-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-purple-900/20 text-purple-500 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors"><LayoutTemplate size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Hero Engine</span>
                    <span className="text-xs text-neutral-500">High impact entry sections</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('grid'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-green-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-green-900/20 text-green-500 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors"><Grid size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Product Grid</span>
                    <span className="text-xs text-neutral-500">Inventory display systems</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('collection'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-emerald-900/20 text-emerald-500 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors"><ShoppingBag size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Collections</span>
                    <span className="text-xs text-neutral-500">Featured products & lists</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('layout'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-cyan-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-cyan-900/20 text-cyan-500 rounded-lg group-hover:bg-cyan-500 group-hover:text-white transition-colors"><Layout size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Layouts</span>
                    <span className="text-xs text-neutral-500">Multi-column & banners</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('scroll'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-orange-900/20 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors"><Repeat size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Scroll Sections</span>
                    <span className="text-xs text-neutral-500">Marquees and tickers</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('social'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-pink-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-pink-900/20 text-pink-500 rounded-lg group-hover:bg-pink-500 group-hover:text-white transition-colors"><Share2 size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Social Feed</span>
                    <span className="text-xs text-neutral-500">Instagram & TikTok</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('blog'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-rose-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-rose-900/20 text-rose-500 rounded-lg group-hover:bg-rose-500 group-hover:text-white transition-colors"><FileText size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Blog Posts</span>
                    <span className="text-xs text-neutral-500">News and articles</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('video'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-red-900/20 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors"><Video size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Video</span>
                    <span className="text-xs text-neutral-500">Players and backgrounds</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('content'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-blue-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-blue-900/20 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors"><Type size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Rich Content</span>
                    <span className="text-xs text-neutral-500">Text, Collapsibles, HTML</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('marketing'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-yellow-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-yellow-900/20 text-yellow-500 rounded-lg group-hover:bg-yellow-500 group-hover:text-white transition-colors"><Megaphone size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Marketing</span>
                    <span className="text-xs text-neutral-500">Email, Promos, Logos</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('media'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-indigo-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-indigo-900/20 text-indigo-500 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors"><ImageIcon size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Media Gallery</span>
                    <span className="text-xs text-neutral-500">Grids, Sliders, Showcases</span>
                  </div>
                </button>

                <button onClick={() => { setSelectedCategory('contact'); setAddSectionStep('options'); }} className="p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-teal-500 rounded-xl flex flex-col items-center gap-3 group transition-all">
                  <div className="p-3 bg-teal-900/20 text-teal-500 rounded-lg group-hover:bg-teal-500 group-hover:text-white transition-colors"><Mail size={24} /></div>
                  <div className="text-center">
                    <span className="block text-sm font-bold text-white">Contact</span>
                    <span className="text-xs text-neutral-500">Forms and maps</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <button onClick={() => { setAddSectionStep('categories'); setPreviewBlock(null); }} className="text-xs font-bold text-neutral-500 hover:text-white flex items-center gap-1 mb-4"><ChevronDown className="rotate-90" size={14} /> Back to Categories</button>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedCategory === 'hero' && HERO_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-hero', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="hero" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'grid' && PRODUCT_CARD_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-grid', `Grid: ${opt.name}`, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-green-600/20 border-green-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="grid" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'collection' && COLLECTION_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-collection', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="collection" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'layout' && LAYOUT_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-layout', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-cyan-600/20 border-cyan-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="layout" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'scroll' && SCROLL_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-scroll', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-orange-600/20 border-orange-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="scroll" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'social' && SOCIAL_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-social', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-pink-600/20 border-pink-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="social" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'blog' && BLOG_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-blog', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-rose-600/20 border-rose-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="blog" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'video' && VIDEO_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-video', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-red-600/20 border-red-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="video" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'media' && GALLERY_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-gallery', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="media" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}

                  {selectedCategory === 'contact' && CONTACT_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('system-contact', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-teal-600/20 border-teal-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <SectionPreview category="contact" variantId={opt.id} />
                      <div className="p-4">
                        <div className="font-bold text-sm">{opt.name}</div>
                        <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Content category has special subcategories */}
                {selectedCategory === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs font-bold text-neutral-500 uppercase mb-3">Rich Text</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {RICH_TEXT_OPTIONS.map(opt => (
                          <button key={opt.id} onClick={() => addBlock('system-rich-text', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                            <SectionPreview category="content" variantId={opt.id} />
                            <div className="p-4">
                              <div className="font-bold text-sm">{opt.name}</div>
                              <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-neutral-500 uppercase mb-3">Collapsible</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {COLLAPSIBLE_OPTIONS.map(opt => (
                          <button key={opt.id} onClick={() => addBlock('system-collapsible', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                            <SectionPreview category="content" variantId={opt.id} />
                            <div className="p-4">
                              <div className="font-bold text-sm">{opt.name}</div>
                              <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Marketing category has special subcategories */}
                {selectedCategory === 'marketing' && (
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-xs font-bold text-neutral-500 uppercase mb-3">Email Signup</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {EMAIL_SIGNUP_OPTIONS.map(opt => (
                          <button key={opt.id} onClick={() => addBlock('system-email', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-yellow-600/20 border-yellow-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                            <SectionPreview category="marketing" variantId={opt.id} />
                            <div className="p-4">
                              <div className="font-bold text-sm">{opt.name}</div>
                              <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-neutral-500 uppercase mb-3">Promotions</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {PROMO_BANNER_OPTIONS.map(opt => (
                          <button key={opt.id} onClick={() => addBlock('system-promo', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-yellow-600/20 border-yellow-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                            <SectionPreview category="marketing" variantId={opt.id} />
                            <div className="p-4">
                              <div className="font-bold text-sm">{opt.name}</div>
                              <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-neutral-500 uppercase mb-3">Trust Indicators</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {LOGO_LIST_OPTIONS.map(opt => (
                          <button key={opt.id} onClick={() => addBlock('system-logo-list', opt.name, '', opt.id)} className={`text-left rounded-xl border transition-all overflow-hidden ${previewBlock?.variant === opt.id ? 'bg-yellow-600/20 border-yellow-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                            <SectionPreview category="marketing" variantId={opt.id} />
                            <div className="p-4">
                              <div className="font-bold text-sm">{opt.name}</div>
                              <div className="text-[10px] opacity-60 mt-1">{opt.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end shrink-0">
            <button 
              onClick={() => { setIsAddSectionOpen(false); setPreviewBlock(null); setAddSectionStep('categories'); }}
              className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case AdminTab.DISCOUNTS:
        return <DiscountManager storeId={storeId || null} />;

      case AdminTab.SHIPPING:
        return <ShippingManager storeId={storeId || null} />;

      case AdminTab.COLLECTIONS:
        return <CollectionManager />;

      case AdminTab.DESIGN:
        const isAnyModalOpen = isHeaderModalOpen || isHeroModalOpen || isGridModalOpen || isCollectionModalOpen || isSystemModalOpen || isFooterModalOpen || isArchitectOpen || isAddSectionOpen || isInterfaceModalOpen;
        return (
          <div className="flex h-full w-full bg-neutral-950 overflow-hidden">
            {/* LEFT COLUMN: EDITOR */}
            <div style={{ width: editorWidth }} className="relative flex flex-col border-r border-neutral-800 bg-black/50 shrink-0">
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-600 transition-colors z-50"
                onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
              />
              
              {/* Undo/Redo Toolbar */}
              <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-900/50">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Design Studio</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleUndo}
                    disabled={!canUndo}
                    title="Undo (Ctrl+Z)"
                    className={`p-2 rounded-lg transition-colors ${canUndo ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'text-neutral-700 cursor-not-allowed'}`}
                  >
                    <Undo2 size={16} />
                  </button>
                  <button 
                    onClick={handleRedo}
                    disabled={!canRedo}
                    title="Redo (Ctrl+Y)"
                    className={`p-2 rounded-lg transition-colors ${canRedo ? 'hover:bg-neutral-800 text-neutral-400 hover:text-white' : 'text-neutral-700 cursor-not-allowed'}`}
                  >
                    <Redo2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 space-y-3">

                  {/* 1. GLOBAL SETTINGS - Global site settings */}
                  <div className="bg-neutral-900 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-xl overflow-hidden">
                    <button onClick={() => setIsInterfaceModalOpen(true)} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-purple-900/30 text-purple-400 rounded"><Monitor size={16} /></div><span className="font-bold text-sm text-white">Global Settings</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-500">{config.scrollbarStyle}</span>
                        <ChevronRight size={14} className="text-neutral-600" />
                      </div>
                    </button>
                  </div>

                  {/* Pages & Navigation */}
                  <div className="bg-neutral-900 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-xl overflow-hidden">
                    <button onClick={() => setDesignSections(prev => ({ ...prev, pages: !prev.pages }))} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-800 rounded text-neutral-400"><FileText size={16} /></div><span className="font-bold text-sm text-white">Pages & Navigation</span></div><ChevronDown size={16} className={`text-neutral-500 transition-transform ${designSections.pages ? 'rotate-180' : ''}`} />
                    </button>
                    {designSections.pages && (
                      <div className="p-2 border-t border-neutral-800 bg-black/20 space-y-1">
                        <p className="text-[10px] text-neutral-500 px-2 mb-2">Drag to reorder navigation. Click edit to rename.</p>
                        {[...localPages]
                          .filter(p => p.type !== 'hidden')
                          .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
                          .map((page, index) => {
                          const isActive = activePageId === page.id;
                          const isEditing = editingPageItem === page.id;
                          const isDragging = pageDraggedItem === page.id;
                          const isDragOver = pageDragOverItem === page.id;
                          
                          return (
                            <div 
                              key={page.id}
                              draggable={!isEditing}
                              onDragStart={(e) => {
                                setPageDraggedItem(page.id);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragEnd={() => {
                                setPageDraggedItem(null);
                                setPageDragOverItem(null);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                if (page.id !== pageDraggedItem) setPageDragOverItem(page.id);
                              }}
                              onDragLeave={() => setPageDragOverItem(null)}
                              onDrop={(e) => {
                                e.preventDefault();
                                if (!pageDraggedItem || pageDraggedItem === page.id) return;
                                
                                const sortedPages = [...localPages]
                                  .filter(p => p.type !== 'hidden')
                                  .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));
                                
                                const draggedIndex = sortedPages.findIndex(p => p.id === pageDraggedItem);
                                const targetIndex = sortedPages.findIndex(p => p.id === page.id);
                                
                                if (draggedIndex === -1 || targetIndex === -1) return;
                                
                                const newOrder = [...sortedPages];
                                const [removed] = newOrder.splice(draggedIndex, 1);
                                newOrder.splice(targetIndex, 0, removed);
                                
                                const updatedPages = newOrder.map((p, idx) => ({ ...p, display_order: idx }));
                                
                                setLocalPages(prev => {
                                  const hiddenPages = prev.filter(p => p.type === 'hidden');
                                  return [...updatedPages, ...hiddenPages];
                                });
                                
                                updatedPages.forEach((p, idx) => onUpdatePage(p.id, { display_order: idx }));
                                setPageDraggedItem(null);
                                setPageDragOverItem(null);
                              }}
                              className={`rounded-lg transition-all ${isActive ? 'bg-neutral-900 border border-neutral-700' : 'border border-transparent'} ${isDragOver ? 'border-blue-500 bg-blue-500/10' : ''} ${isDragging ? 'opacity-50' : ''}`}
                            >
                              {isEditing ? (
                                <div className="p-3 space-y-2">
                                  <div>
                                    <label className="text-[10px] text-neutral-500 uppercase font-bold">Title</label>
                                    <input
                                      type="text"
                                      value={editPageTitle}
                                      onChange={(e) => setEditPageTitle(e.target.value)}
                                      className="w-full bg-black border border-neutral-600 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 outline-none mt-1"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          const newSlug = page.type === 'home' ? '/' : `/${editPageSlug.replace(/^\//, '')}`;
                                          setLocalPages(prev => prev.map(p => p.id === page.id ? { ...p, title: editPageTitle, slug: newSlug } : p));
                                          onUpdatePage(page.id, { title: editPageTitle, slug: newSlug });
                                          setEditingPageItem(null);
                                        }
                                        if (e.key === 'Escape') setEditingPageItem(null);
                                      }}
                                    />
                                  </div>
                                  {page.type !== 'home' && (
                                    <div>
                                      <label className="text-[10px] text-neutral-500 uppercase font-bold">URL Slug</label>
                                      <div className="flex items-center gap-1 mt-1">
                                        <span className="text-neutral-500 text-xs">/</span>
                                        <input
                                          type="text"
                                          value={editPageSlug}
                                          onChange={(e) => setEditPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                          className="flex-1 bg-black border border-neutral-600 rounded px-2 py-1.5 text-xs text-neutral-400 font-mono focus:border-blue-500 outline-none"
                                        />
                                      </div>
                                    </div>
                                  )}
                                  {/* Link Selector Dropdown */}
                                  <div>
                                    <label className="text-[10px] text-neutral-500 uppercase font-bold">Link To</label>
                                    <select
                                      value={page.link_type || 'page'}
                                      onChange={(e) => {
                                        const linkType = e.target.value;
                                        setLocalPages(prev => prev.map(p => p.id === page.id ? { ...p, link_type: linkType } : p));
                                        onUpdatePage(page.id, { link_type: linkType });
                                      }}
                                      className="w-full bg-black border border-neutral-600 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none mt-1"
                                    >
                                      <option value="page">This Page</option>
                                      <option value="products">All Products</option>
                                      <option value="collections">Collections</option>
                                      <option value="contact">Contact</option>
                                      <option value="external">External URL</option>
                                    </select>
                                  </div>
                                  {page.link_type === 'external' && (
                                    <div>
                                      <label className="text-[10px] text-neutral-500 uppercase font-bold">External URL</label>
                                      <input
                                        type="url"
                                        value={page.external_url || ''}
                                        onChange={(e) => {
                                          setLocalPages(prev => prev.map(p => p.id === page.id ? { ...p, external_url: e.target.value } : p));
                                          onUpdatePage(page.id, { external_url: e.target.value });
                                        }}
                                        className="w-full bg-black border border-neutral-600 rounded px-2 py-1.5 text-xs text-neutral-400 focus:border-blue-500 outline-none mt-1"
                                        placeholder="https://..."
                                      />
                                    </div>
                                  )}
                                  <div className="flex gap-2 justify-end pt-2">
                                    <button onClick={() => setEditingPageItem(null)} className="px-2 py-1 text-xs text-neutral-400 hover:text-white">Cancel</button>
                                    <button 
                                      onClick={() => {
                                        const newSlug = page.type === 'home' ? '/' : `/${editPageSlug.replace(/^\//, '')}`;
                                        setLocalPages(prev => prev.map(p => p.id === page.id ? { ...p, title: editPageTitle, slug: newSlug } : p));
                                        onUpdatePage(page.id, { title: editPageTitle, slug: newSlug });
                                        setEditingPageItem(null);
                                      }}
                                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-500"
                                    >Save</button>
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${isActive ? 'text-blue-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                  <div className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-neutral-800 rounded">
                                    <GripVertical size={12} className="text-neutral-600" />
                                  </div>
                                  <div 
                                    className="flex-1 flex items-center gap-2 min-w-0"
                                    onClick={() => { onSetActivePage(page.id); setSelectedBlockId(null); }}
                                  >
                                    {page.type === 'home' ? <Home size={14} /> : <FileText size={14} />}
                                    <span className="font-medium truncate">{page.title || 'Untitled'}</span>
                                    {page.type === 'home' && <span className="text-[9px] bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded">Landing</span>}
                                    {page.link_type && page.link_type !== 'page' && (
                                      <span className="text-[9px] bg-purple-900/30 text-purple-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <Link size={8} />{page.link_type}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setEditingPageItem(page.id);
                                        setEditPageTitle(page.title);
                                        setEditPageSlug(page.slug?.replace(/^\//, '') || '');
                                      }} 
                                      className="p-1 text-neutral-500 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors" 
                                      title="Edit page"
                                    >
                                      <Edit3 size={12} />
                                    </button>
                                    {page.type !== 'home' && (
                                      <button 
                                        onClick={(e) => { 
                                          e.stopPropagation(); 
                                          if (confirm(`Delete "${page.title}"? This cannot be undone.`)) {
                                            onDeletePage(page.id);
                                            if (activePageId === page.id) {
                                              const homePage = localPages.find(p => p.type === 'home');
                                              if (homePage) onSetActivePage(homePage.id);
                                            }
                                          }
                                        }} 
                                        className="p-1 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" 
                                        title="Delete page"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                    {isActive && <span className="text-[9px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold">EDIT</span>}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <button onClick={handleAddNewPage} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-white/5 border border-dashed border-neutral-800 hover:border-neutral-600 transition-all mt-2"><Plus size={14} /> Add New Page</button>
                      </div>
                    )}
                  </div>

                  {/* 2. BODY - Page content blocks */}
                  <div className="bg-neutral-900 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)] rounded-xl overflow-hidden">
                    <button onClick={() => setDesignSections(prev => ({ ...prev, pageSections: !prev.pageSections }))} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-orange-900/30 text-orange-400 rounded"><Layers size={16} /></div><span className="font-bold text-sm text-white">Body</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-500">{activePage.blocks?.length || 0} sections</span>
                        <ChevronDown size={16} className={`text-neutral-500 transition-transform ${designSections.pageSections ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {designSections.pageSections && (
                      <div className="p-4 pt-0 border-t border-neutral-800 bg-black/20">
                        <div className="space-y-2 mb-4 mt-2">
                          {/* DYNAMIC BLOCKS */}
                          {activePage.blocks?.map((block, idx) => (
                            <div 
                              key={block.id} 
                              draggable
                              onDragStart={() => handleDragStart(idx)}
                              onDragOver={(e) => handleDragOver(e, idx)}
                              onDrop={() => handleDrop(idx)}
                              className={`group flex flex-col p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${selectedBlockId === block.id ? 'bg-neutral-800 border-neutral-700' : 'bg-transparent border-transparent hover:bg-white/5'} ${block.hidden ? 'opacity-50' : ''} ${draggedIndex === idx ? 'opacity-20' : ''}`}
                              onClick={() => {
                                if (block.locked) return;
                                setSelectedBlockId(block.id);
                                if (block.type === 'system-hero') setIsHeroModalOpen(true);
                                else if (block.type === 'system-grid') setIsGridModalOpen(true);
                                else if (block.type === 'system-collection') setIsCollectionModalOpen(true);
                                else if (block.type === 'system-scroll') setIsScrollModalOpen(true);
                                else if (block.type === 'system-social') setIsSocialModalOpen(true);
                                else if (block.type === 'system-rich-text') setIsRichTextModalOpen(true);
                                else if (block.type === 'system-email') setIsEmailModalOpen(true);
                                else if (block.type === 'system-collapsible') setIsCollapsibleModalOpen(true);
                                else if (block.type === 'system-logo-list') setIsLogoListModalOpen(true);
                                else if (block.type === 'system-promo') setIsPromoModalOpen(true);
                                else if (block.type === 'system-gallery') setIsGalleryModalOpen(true);
                                else if (block.type === 'system-blog') setIsBlogModalOpen(true);
                                else if (block.type === 'system-video') setIsVideoModalOpen(true);
                                else if (block.type === 'system-contact') setIsContactModalOpen(true);
                                else if (block.type === 'system-layout') setIsLayoutModalOpen(true);
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="text-[10px] font-bold text-neutral-600 w-4">{idx + 1}</div>
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-medium text-white truncate max-w-[100px]">{block.name}</span>
                                      {block.locked && <Lock size={10} className="text-amber-500" />}
                                      {block.hidden && <EyeOff size={10} className="text-orange-500" />}
                                    </div>
                                    <span className="text-[10px] text-neutral-500 uppercase">{block.type.replace('system-', '')}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBlockVisibility(block.id);
                                    }}
                                    className={`p-1 rounded transition-colors ${block.hidden ? 'text-orange-500 bg-orange-500/10' : 'text-neutral-400 hover:text-white hover:bg-neutral-700'}`}
                                    title={block.hidden ? "Show Section" : "Hide Section"}
                                  >
                                    {block.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleBlockLock(block.id);
                                    }}
                                    className={`p-1 rounded transition-colors ${block.locked ? 'text-amber-500 bg-amber-500/10' : 'text-neutral-400 hover:text-white hover:bg-neutral-700'}`}
                                    title={block.locked ? "Unlock Section" : "Lock Section"}
                                  >
                                    {block.locked ? <Lock size={12} /> : <Unlock size={12} />}
                                  </button>
                                </div>
                              </div>
                              
                                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/50">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (block.type === 'system-hero') { setSelectedBlockId(block.id); setIsHeroModalOpen(true); }
                                      else if (block.type === 'system-grid') { setSelectedBlockId(block.id); setIsGridModalOpen(true); }
                                      else if (block.type === 'system-collection') { setSelectedBlockId(block.id); setIsCollectionModalOpen(true); }
                                      else if (block.type === 'system-footer') { setIsFooterModalOpen(true); }
                                      else if (block.type === 'system-scroll') { setSelectedBlockId(block.id); setIsScrollModalOpen(true); }
                                      else if (block.type === 'system-social') { setSelectedBlockId(block.id); setIsSocialModalOpen(true); }
                                      else if (block.type === 'system-rich-text') { setSelectedBlockId(block.id); setIsRichTextModalOpen(true); }
                                      else if (block.type === 'system-email') { setSelectedBlockId(block.id); setIsEmailModalOpen(true); }
                                      else if (block.type === 'system-collapsible') { setSelectedBlockId(block.id); setIsCollapsibleModalOpen(true); }
                                      else if (block.type === 'system-logo-list') { setSelectedBlockId(block.id); setIsLogoListModalOpen(true); }
                                      else if (block.type === 'system-promo') { setSelectedBlockId(block.id); setIsPromoModalOpen(true); }
                                      else if (block.type === 'system-gallery') { setSelectedBlockId(block.id); setIsGalleryModalOpen(true); }
                                      else if (block.type === 'system-blog') { setSelectedBlockId(block.id); setIsBlogModalOpen(true); }
                                      else if (block.type === 'system-video') { setSelectedBlockId(block.id); setIsVideoModalOpen(true); }
                                      else if (block.type === 'system-contact') { setSelectedBlockId(block.id); setIsContactModalOpen(true); }
                                      else if (block.type === 'system-layout') { setSelectedBlockId(block.id); setIsLayoutModalOpen(true); }
                                      else if (block.type.startsWith('system-')) { 
                                        // All other system blocks: select them
                                        setSelectedBlockId(block.id);
                                      }
                                      else { handleOpenArchitect(block.id); }
                                    }}
                                    disabled={block.locked}
                                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors disabled:opacity-30" title="Edit Section"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}
                                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                                    title="Duplicate"
                                  >
                                    <Copy size={14} />
                                  </button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex flex-col gap-0.5">
                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, -1); }} className="text-neutral-600 hover:text-white disabled:opacity-30" disabled={idx === 0}><MoveUp size={10} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(idx, 1); }} className="text-neutral-600 hover:text-white disabled:opacity-30" disabled={idx === (activePage.blocks?.length || 0) - 1}><MoveDown size={10} /></button>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id, e); }} className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors ml-1"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* ADD SECTION BUTTON */}
                          <div className="pt-2">
                            <button onClick={() => setIsAddSectionOpen(true)} className="w-full py-3 border border-dashed border-neutral-700 rounded-xl flex items-center justify-center gap-2 text-neutral-500 hover:text-white hover:border-neutral-500 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                              <Plus size={14} /> Add Section
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. FOOTER - Fixed site footer */}
                  <div className="bg-neutral-900 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-xl overflow-hidden">
                    <button onClick={() => setIsFooterModalOpen(true)} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-emerald-900/30 text-emerald-400 rounded"><PanelBottom size={16} /></div><span className="font-bold text-sm text-white">Footer</span></div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-500">{FOOTER_OPTIONS.find(f => f.id === config.footerStyle)?.name}</span>
                        <ChevronRight size={14} className="text-neutral-600" />
                      </div>
                    </button>
                  </div>

                  {/* Inline editor removed - all blocks now use modals */}

                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: LIVE CANVAS */}
            <div className="flex-1 bg-[#111] flex flex-col relative overflow-hidden">
              <div className="h-12 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  
                  {/* Current Page Label */}
                  <div className="flex items-center gap-2 px-3 py-1 bg-neutral-800/50 rounded-lg border border-neutral-700/50">
                    {(activePage?.type === 'home' || activePage?.slug === '/' || activePage?.slug === '') ? (
                      <Home size={12} className="text-blue-400" />
                    ) : (
                      <FileText size={12} className="text-blue-400" />
                    )}
                    <span className="text-xs font-medium text-white">
                      {(activePage?.type === 'home' || activePage?.slug === '/' || activePage?.slug === '') ? 'Home' : (activePage?.title || 'Page')}
                    </span>
                    <span className="text-[10px] text-neutral-500">• editing</span>
                  </div>
                  
                  {/* Device Preview Toggle */}
                  <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-1 pr-2 border-r border-neutral-800 mr-1">
                      <button 
                        onClick={handleUndo}
                        disabled={!canUndo}
                        className={`p-1.5 rounded transition-colors ${canUndo ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-700 cursor-not-allowed'}`}
                        title="Undo (Ctrl+Z)"
                      >
                        <Undo2 size={14} />
                      </button>
                      <button 
                        onClick={handleRedo}
                        disabled={!canRedo}
                        className={`p-1.5 rounded transition-colors ${canRedo ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-700 cursor-not-allowed'}`}
                        title="Redo (Ctrl+Y)"
                      >
                        <Redo2 size={14} />
                      </button>
                    </div>

                    <button 
                      onClick={() => setPreviewDevice('desktop')} 
                      title="Desktop Preview"
                      className={`p-1.5 rounded flex items-center gap-1.5 ${previewDevice === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                      <Monitor size={14} />
                      <span className="text-[10px] font-bold">Desktop</span>
                    </button>
                    <button 
                      onClick={() => setPreviewDevice('tablet')} 
                      title="Tablet Preview"
                      className={`p-1.5 rounded ${previewDevice === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                        <line x1="12" y1="18" x2="12" y2="18"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => setPreviewDevice('mobile')} 
                      title="Mobile Preview"
                      className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                      <Smartphone size={14} />
                    </button>
                    
                    {/* Orientation Toggle */}
                    {previewDevice !== 'desktop' && (
                      <button 
                        onClick={() => setPreviewOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
                        title="Toggle Orientation"
                        className="p-1.5 rounded text-neutral-500 hover:text-white transition-colors border-l border-neutral-800 ml-1 pl-2"
                      >
                        <RefreshCw size={14} className={previewOrientation === 'landscape' ? 'rotate-90' : ''} />
                      </button>
                    )}

                    {/* Device Presets */}
                    {previewDevice !== 'desktop' && (
                      <select 
                        value={previewDevicePreset}
                        onChange={(e) => setPreviewDevicePreset(e.target.value)}
                        className="bg-transparent text-[10px] text-neutral-400 outline-none border-l border-neutral-800 ml-1 pl-2 cursor-pointer hover:text-white"
                      >
                        <option value="default">Default</option>
                        {previewDevice === 'mobile' ? (
                          <>
                            <option value="iphone14">iPhone 14</option>
                            <option value="pixel7">Pixel 7</option>
                            <option value="se">iPhone SE</option>
                          </>
                        ) : (
                          <>
                            <option value="ipadpro">iPad Pro</option>
                            <option value="ipadmini">iPad Mini</option>
                            <option value="surface">Surface Pro</option>
                          </>
                        )}
                      </select>
                    )}

                    {/* Mobile Optimization Button - shows when mobile preview is active */}
                    {previewDevice === 'mobile' && (
                      <button
                        onClick={() => {
                          // Show mobile optimization tips
                          showToast('📱 Mobile optimization tips: Ensure text is 16px+, buttons have 44px touch targets, and images are compressed.', 'success');
                        }}
                        className="p-1.5 rounded bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors"
                        title="Mobile Optimization Tips"
                      >
                        <Sparkles size={14} />
                      </button>
                    )}
                  </div>
                  {/* Help & Tutorial Button */}
                  <button 
                    onClick={() => setShowTutorial(true)}
                    title="Show Tutorial"
                    className="p-1.5 text-neutral-500 hover:text-white transition-colors"
                  >
                    <HelpCircle size={14} />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                      onClick={handleSaveChanges}
                      disabled={!hasUnsavedChanges}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${hasUnsavedChanges ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
                  >
                      <Save size={14} />
                      {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                  </button>
                  {/* View Live Site Button */}
                  {config.slug && (
                    <a 
                      href={`/s/${config.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
                    >
                      <Eye size={14} />
                      View Live
                    </a>
                  )}
                  {/* Version History Button */}
                  <button 
                    onClick={() => {
                      fetchPageVersions();
                      setShowVersionHistory(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    <Clock size={14} />
                    History
                  </button>
                  {/* Publish Button - triggers checklist first */}
                  <button 
                    onClick={() => setShowPublishChecklist(true)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg"
                  >
                    <Rocket size={14} />
                    Publish
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]">
                <div className={`bg-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl overflow-hidden relative ${
                  previewDevice === 'mobile' ? (
                    previewOrientation === 'landscape' ? 'w-[812px] h-[375px] rounded-[40px] border-[8px] border-neutral-900' : 'w-[375px] h-[812px] rounded-[40px] border-[8px] border-neutral-900'
                  ) : 
                  previewDevice === 'tablet' ? (
                    previewOrientation === 'landscape' ? 'w-[1024px] h-[768px] rounded-[20px] border-[6px] border-neutral-900' : 'w-[768px] h-[1024px] rounded-[20px] border-[6px] border-neutral-900'
                  ) :
                  'w-full h-full max-w-[1400px] rounded-lg border border-neutral-800'
                }`}>
                  <div className={`w-full h-full overflow-y-auto bg-white scrollbar-${config.scrollbarStyle}`}>
                    <Storefront
                      config={config}
                      products={products}
                      pages={localPages}
                      activePageId={activePageId}
                      onNavigate={(idOrPath) => {
                        console.log('[DesignerPreview] Navigating to:', idOrPath);
                        if (typeof idOrPath === 'string') {
                          // Handle explicit page paths
                          if (idOrPath.startsWith('/pages/')) {
                            const slug = idOrPath.replace('/pages/', '');
                            const page = localPages.find(p => p.slug.replace(/^\//, '') === slug.replace(/^\//, ''));
                            if (page) { onSetActivePage(page.id); return; }
                          }
                          
                          // Handle home path
                          if (idOrPath === '/' || idOrPath === '/store' || idOrPath === '') {
                            const home = localPages.find(p => p.type === 'home');
                            if (home) { onSetActivePage(home.id); return; }
                          }

                          // Handle product paths (even if not fully supported in preview, let's try to match)
                          if (idOrPath.startsWith('/products/')) {
                             // Stay on current page but log it, or we could add product view state later
                             console.log('[DesignerPreview] Product links not yet fully supported in preview');
                             return;
                          }

                          // Fallback: try to match any slug in the path
                          if (idOrPath.includes('/')) {
                            const slug = idOrPath.split('/').pop() || '';
                            const page = localPages.find(p => p.slug.replace(/^\//, '') === slug.replace(/^\//, ''));
                            if (page) { onSetActivePage(page.id); return; }
                          }
                        }
                        
                        // Otherwise it's likely already a page ID
                        onSetActivePage(idOrPath);
                      }}
                      previewBlock={previewBlock}
                      activeBlockId={selectedBlockId}
                      onUpdateBlock={updateActiveBlockData}
                      onEditBlock={(blockId) => {
                        setSelectedBlockId(blockId);
                        const block = activePage.blocks.find(b => b.id === blockId);
                        if (block?.type === 'system-hero') setIsHeroModalOpen(true);
                        else if (block?.type === 'system-grid') setIsGridModalOpen(true);
                        else if (block?.type === 'system-collection') setIsCollectionModalOpen(true);
                        else if (block?.type === 'system-scroll') setIsScrollModalOpen(true);
                        else if (block?.type === 'system-social') setIsSocialModalOpen(true);
                        else if (block?.type === 'system-rich-text') setIsRichTextModalOpen(true);
                        else if (block?.type === 'system-email') setIsEmailModalOpen(true);
                        else if (block?.type === 'system-collapsible') setIsCollapsibleModalOpen(true);
                        else if (block?.type === 'system-logo-list') setIsLogoListModalOpen(true);
                        else if (block?.type === 'system-promo') setIsPromoModalOpen(true);
                        else if (block?.type === 'system-gallery') setIsGalleryModalOpen(true);
                        else if (block?.type === 'system-blog') setIsBlogModalOpen(true);
                        else if (block?.type === 'system-video') setIsVideoModalOpen(true);
                        else if (block?.type === 'system-contact') setIsContactModalOpen(true);
                        else if (block?.type === 'system-layout') setIsLayoutModalOpen(true);
                        
                        // Show first-edit hint if this is user's first time clicking a section
                        if (!hasSeenFirstEditHint) {
                          setShowFirstEditHint(true);
                          setHasSeenFirstEditHint(true);
                          localStorage.setItem('evolv_seen_first_edit', 'true');
                          setTimeout(() => setShowFirstEditHint(false), 5000);
                        }
                      }}
                      onSelectField={(field) => setActiveField(field)}
                      onMoveBlock={(blockId, direction) => {
                        const index = activePage.blocks.findIndex(b => b.id === blockId);
                        if (index !== -1) moveBlock(index, direction === 'up' ? -1 : 1);
                      }}
                      onDeleteBlock={(blockId) => deleteBlock(blockId)}
                      onDuplicateBlock={(blockId) => duplicateBlock(blockId)}
                      onToggleVisibility={(blockId) => toggleBlockVisibility(blockId)}
                      onToggleLock={(blockId) => toggleBlockLock(blockId)}
                      onSwitchLayout={(blockId) => {
                        const block = activePage.blocks.find(b => b.id === blockId);
                        if (!block) return;
                        setSelectedBlockId(blockId);
                        if (block.type === 'system-hero') { setIsHeroModalOpen(true); }
                        else if (block.type === 'system-grid') { setIsGridModalOpen(true); }
                        else if (block.type === 'system-collection') { setIsCollectionModalOpen(true); }
                        else if (block.type === 'system-footer') { setIsFooterModalOpen(true); }
                        else if (block.type === 'system-scroll') { setIsScrollModalOpen(true); }
                        else if (block.type === 'system-social') { setIsSocialModalOpen(true); }
                        else if (block.type === 'system-rich-text') { setIsRichTextModalOpen(true); }
                        else if (block.type === 'system-email') { setIsEmailModalOpen(true); }
                        else if (block.type === 'system-collapsible') { setIsCollapsibleModalOpen(true); }
                        else if (block.type === 'system-logo-list') { setIsLogoListModalOpen(true); }
                        else if (block.type === 'system-promo') { setIsPromoModalOpen(true); }
                        else if (block.type === 'system-gallery') { setIsGalleryModalOpen(true); }
                        else if (block.type === 'system-blog') { setIsBlogModalOpen(true); }
                        else if (block.type === 'system-video') { setIsVideoModalOpen(true); }
                        else if (block.type === 'system-contact') { setIsContactModalOpen(true); }
                        else if (block.type === 'system-layout') { setIsLayoutModalOpen(true); }
                        else if (block.type.startsWith('system-')) {
                          // Other system blocks
                          setSelectedBlockId(blockId);
                        }
                        else { handleOpenArchitect(blockId); }
                      }}
                      showCartDrawer={false}
                    />
                  </div>
                  <CartDrawer variant="absolute" />
                </div>
              </div>
            </div>
          </div>
        );
      case AdminTab.DASHBOARD:
        return <DashboardHome />;

      case AdminTab.ORDERS:
        return <OrderManager storeId={storeId || null} />;

      case AdminTab.PRODUCTS:
        // Get unique categories for filter dropdown
        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        
        // Filter products based on search and category
        const filteredProducts = products.filter(product => {
          const matchesSearch = !productSearch || 
            product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            product.sku?.toLowerCase().includes(productSearch.toLowerCase()) ||
            product.category?.toLowerCase().includes(productSearch.toLowerCase());
          const matchesCategory = productCategoryFilter === 'all' || product.category === productCategoryFilter;
          return matchesSearch && matchesCategory;
        });

        return (
          <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-3xl font-black text-white tracking-tight">Inventory</h2><p className="text-neutral-500">Manage your products and stock</p></div>
              <button onClick={handleCreateProduct} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"><Plus size={18} /> Add Product</button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[200px] relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none min-w-[150px]"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <p className="text-neutral-500 text-sm mb-4">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {productSearch || productCategoryFilter !== 'all' ? ' found' : ''}
            </p>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                <Package size={48} className="mx-auto mb-4 text-neutral-600" />
                <h3 className="text-xl font-bold text-white mb-2">
                  {products.length === 0 ? 'No products yet' : 'No matching products'}
                </h3>
                <p className="text-neutral-500 mb-6">
                  {products.length === 0 
                    ? 'Add your first product to get started!' 
                    : 'Try adjusting your search or filter'}
                </p>
                {products.length === 0 && (
                  <button onClick={handleCreateProduct} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                    Add Your First Product
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                <div key={product.id} className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all">
                  <div className="aspect-square relative overflow-hidden cursor-pointer" onClick={() => handleEditProduct(product)}>
                    <img src={product.images?.[0]?.url || product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white text-black rounded-lg hover:bg-neutral-200" title="Edit"><Edit3 size={16} /></button>
                      <button 
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Are you sure you want to delete "${product.name}"? This cannot be undone.`)) {
                            onDeleteProduct?.(product.id);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white truncate pr-2">{product.name}</h3>
                      <span className="text-green-500 font-mono text-xs">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-neutral-500">
                      <span>{product.category}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}

            {isProductEditorOpen && (
              <ProductEditor
                product={editingProduct}
                onSave={(p) => {
                  onAddProduct(p);
                  setIsProductEditorOpen(false);
                  showToast(editingProduct ? 'Product updated successfully ✓' : 'Product created successfully ✓', 'success');
                }}
                onCancel={() => setIsProductEditorOpen(false)}
              />
            )}
          </div>
        );

      case AdminTab.PAGES:
        return (
          <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div><h2 className="text-3xl font-black text-white tracking-tight">Page Management</h2><p className="text-neutral-500">Create and manage your store's content</p></div>
              <button onClick={handleAddNewPage} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"><Plus size={18} /> Add Page</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pages.map(page => (
                <div key={page.id} className="group bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-600 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${page.type === 'home' ? 'bg-blue-900/20 text-blue-500' : 'bg-neutral-800 text-neutral-400'}`}>
                      {page.type === 'home' ? <Home size={24} /> : <FileText size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{page.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                        <span className="uppercase">{page.type}</span>
                        <span>•</span>
                        <span>{page.slug}</span>
                        <span>•</span>
                        <span>{page.blocks?.length || 0} Sections</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => { onSetActivePage(page.id); onTabChange(AdminTab.DESIGN); }} className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors text-sm">Open in Editor</button>
                    {page.type !== 'home' && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
                            onDeletePage(page.id);
                          }
                        }}
                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case AdminTab.MEDIA:
        return (
          <MediaLibrary
            assets={mediaAssets}
            onAddAsset={onAddAsset}
            onDeleteAsset={onDeleteAsset}
          />
        );

      case AdminTab.CAMPAIGNS:
        return (
          <CampaignManager storeId={storeId || null} />
        );

      case AdminTab.SETTINGS:
        return (
          <div className="flex h-full bg-neutral-950">
            {/* Settings Sidebar */}
            <div className="w-64 border-r border-neutral-800 bg-neutral-900/50 p-4 flex flex-col gap-1">
              <div className="px-4 py-4 mb-2">
                <h2 className="text-xl font-black text-white tracking-tight">Settings</h2>
                <p className="text-xs text-neutral-500">Store Configuration</p>
              </div>
              {[
                { id: 'general', label: 'General', icon: Settings },
                { id: 'domains', label: 'Domains', icon: Globe },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'shipping', label: 'Shipping & Delivery', icon: Package },
                { id: 'taxes', label: 'Taxes and Duties', icon: DollarSign },
                { id: 'policies', label: 'Legal Policies', icon: FileText },
                { id: 'notifications', label: 'Notifications', icon: Mail },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSettingsTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSettingsTab === item.id
                      ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20'
                      : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-8 max-w-4xl">
              {activeSettingsTab === 'general' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">General Settings</h3>
                    <p className="text-neutral-500">Manage your store's core information.</p>
                  </div>
                  
                  {/* Store Details */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4">Store Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-neutral-500 uppercase">Store Name</label><input value={config.name} onChange={e => onConfigChange({ ...config, name: e.target.value })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" /></div>
                      <div><label className="text-xs font-bold text-neutral-500 uppercase">Currency</label><input value={config.currency} onChange={e => onConfigChange({ ...config, currency: e.target.value })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" /></div>
                    </div>
                  </div>

                  {/* Logo Management */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4 flex items-center gap-2">
                      <ImageIcon size={18} className="text-blue-500"/>
                      Logo Management
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setLogoMode('text')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            logoMode === 'text'
                              ? 'bg-blue-600 text-white'
                              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                          }`}
                        >
                          <Type size={16} className="inline mr-2" />
                          Text Logo
                        </button>
                        <button
                          onClick={() => setLogoMode('image')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            logoMode === 'image'
                              ? 'bg-blue-600 text-white'
                              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                          }`}
                        >
                          <ImageIcon size={16} className="inline mr-2" />
                          Image Logo
                        </button>
                      </div>

                      {logoMode === 'image' && (
                        <div>
                          {config.logoUrl ? (
                            <div className="space-y-3">
                              <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4 flex items-center justify-center">
                                <img 
                                  src={config.logoUrl} 
                                  alt="Logo" 
                                  style={{ height: `${config.logoHeight || 32}px` }}
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-bold text-neutral-500 uppercase block mb-2">Logo Height (px)</label>
                                <input
                                  type="range"
                                  min="20"
                                  max="80"
                                  value={config.logoHeight || 32}
                                  onChange={e => onConfigChange({ ...config, logoHeight: parseInt(e.target.value) })}
                                  className="w-full"
                                />
                                <div className="flex justify-between text-xs text-neutral-500 mt-1">
                                  <span>20px</span>
                                  <span className="text-white font-bold">{config.logoHeight || 32}px</span>
                                  <span>80px</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer">
                                  <div className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold text-center transition-colors">
                                    {isUploadingLogo ? <Loader2 size={16} className="animate-spin mx-auto" /> : <>Change Logo</>}
                                  </div>
                                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                                </label>
                                <button
                                  onClick={() => onConfigChange({ ...config, logoUrl: '' })}
                                  className="px-4 py-2 bg-red-600/20 border border-red-600/50 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-bold transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="block cursor-pointer">
                              <div className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 rounded-lg p-8 text-center transition-colors">
                                {isUploadingLogo ? (
                                  <Loader2 size={32} className="mx-auto text-blue-500 animate-spin mb-2" />
                                ) : (
                                  <Upload size={32} className="mx-auto text-neutral-500 mb-2" />
                                )}
                                <p className="text-sm font-bold text-white mb-1">
                                  {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  PNG, JPG, or SVG (recommended: transparent background)
                                </p>
                              </div>
                              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                            </label>
                          )}
                        </div>
                      )}

                      {logoMode === 'text' && (
                        <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-4">
                          <p className="text-sm text-neutral-400">
                            Using text mode. Your store name "<span className="text-white font-bold">{config.name}</span>" will be displayed as the logo.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4">Contact Information</h4>
                    <div><label className="text-xs font-bold text-neutral-500 uppercase">Support Email</label><input value={config.supportEmail || ''} onChange={e => onConfigChange({ ...config, supportEmail: e.target.value })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" placeholder="support@example.com" /></div>
                  </div>

                  {/* Store Address */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4 flex items-center gap-2"><MapPin size={18} className="text-blue-500"/> Store Address</h4>
                    <div className="space-y-4">
                      <div><label className="text-xs font-bold text-neutral-500 uppercase">Street Address</label><input value={config.storeAddress?.street || ''} onChange={e => onConfigChange({ ...config, storeAddress: { ...config.storeAddress, street: e.target.value } })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" placeholder="123 Commerce St" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-neutral-500 uppercase">City</label><input value={config.storeAddress?.city || ''} onChange={e => onConfigChange({ ...config, storeAddress: { ...config.storeAddress, city: e.target.value } })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" placeholder="New York" /></div>
                        <div><label className="text-xs font-bold text-neutral-500 uppercase">State / Province</label><input value={config.storeAddress?.state || ''} onChange={e => onConfigChange({ ...config, storeAddress: { ...config.storeAddress, state: e.target.value } })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" placeholder="NY" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-neutral-500 uppercase">Postal / Zip Code</label><input value={config.storeAddress?.zip || ''} onChange={e => onConfigChange({ ...config, storeAddress: { ...config.storeAddress, zip: e.target.value } })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" placeholder="10001" /></div>
                        <div><label className="text-xs font-bold text-neutral-500 uppercase">Country</label><input value={config.storeAddress?.country || ''} onChange={e => onConfigChange({ ...config, storeAddress: { ...config.storeAddress, country: e.target.value } })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" placeholder="United States" /></div>
                      </div>
                    </div>
                  </div>

                  {/* Formats & Standards */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4 flex items-center gap-2"><Globe size={18} className="text-purple-500"/> Formats & Standards</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1"><Clock size={12}/> Timezone</label>
                        <select value={config.storeFormats?.timezone || 'UTC'} onChange={e => onConfigChange({ ...config, storeFormats: { ...config.storeFormats, timezone: e.target.value } })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none appearance-none">
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time (US & Canada)</option>
                          <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                          <option value="Europe/London">London</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1"><Scale size={12}/> Weight Unit</label>
                        <select value={config.storeFormats?.weightUnit || 'kg'} onChange={e => onConfigChange({ ...config, storeFormats: { ...config.storeFormats, weightUnit: e.target.value as any } })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none appearance-none">
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lb">Pounds (lb)</option>
                          <option value="oz">Ounces (oz)</option>
                          <option value="g">Grams (g)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1"><Scale size={12}/> Dimension Unit</label>
                        <select value={config.storeFormats?.dimensionUnit || 'cm'} onChange={e => onConfigChange({ ...config, storeFormats: { ...config.storeFormats, dimensionUnit: e.target.value as any } })} className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none appearance-none">
                          <option value="cm">Centimeters (cm)</option>
                          <option value="in">Inches (in)</option>
                          <option value="m">Meters (m)</option>
                          <option value="mm">Millimeters (mm)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'domains' && (
                <DomainManager storeId={storeId || ''} />
              )}

              {activeSettingsTab === 'payments' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Payments</h3>
                    <p className="text-neutral-500">Manage how your customers pay.</p>
                  </div>
                  
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-blue-500" />
                      Payment Provider
                    </h4>
                    
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase">Select Provider</label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {['stripe', 'paypal', 'square', 'manual'].map(provider => (
                          <button
                            key={provider}
                            onClick={() => onConfigChange({ ...config, paymentProvider: provider as any })}
                            className={`py-3 px-4 rounded-xl text-sm font-bold capitalize border transition-all ${
                              config.paymentProvider === provider 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                                : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                            }`}
                          >
                            {provider}
                          </button>
                        ))}
                      </div>
                    </div>

                    {config.paymentProvider === 'stripe' && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">Stripe Publishable Key</label>
                          <input 
                            value={config.stripePublishableKey || ''} 
                            onChange={e => onConfigChange({ ...config, stripePublishableKey: e.target.value })} 
                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                            placeholder="pk_test_..."
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">Stripe Secret Key</label>
                          <div className="flex gap-2">
                            <input 
                              type="password"
                              value={stripeSecretKey} 
                              onChange={e => setStripeSecretKey(e.target.value)} 
                              className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                              placeholder="sk_test_... (Enter to update)"
                            />
                            <button 
                              onClick={handleSaveSecrets}
                              disabled={!stripeSecretKey || isSavingSecrets}
                              className="mt-1 px-4 bg-neutral-800 hover:bg-white text-white hover:text-black rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
                            >
                              {isSavingSecrets ? <Loader2 className="animate-spin" /> : 'Save'}
                            </button>
                          </div>
                          
                          <div className="mt-4 bg-neutral-800/50 p-4 rounded-lg border border-neutral-800">
                            <h5 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Setup Instructions</h5>
                            <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-1 mb-4">
                              <li>Log in to your Stripe Dashboard.</li>
                              <li>Go to <span className="text-white">Developers &gt; API Keys</span>.</li>
                              <li>Copy the "Publishable key" and "Secret key".</li>
                              <li>Paste them into the fields above and click Save.</li>
                            </ol>
                            <button 
                              onClick={() => handleTestConnection('stripe')}
                              disabled={isTestingConnection === 'stripe'}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors"
                            >
                              {isTestingConnection === 'stripe' ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                              Test Connection
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {config.paymentProvider === 'square' && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">Square Application ID</label>
                          <input 
                            value={config.squareApplicationId || ''} 
                            onChange={e => onConfigChange({ ...config, squareApplicationId: e.target.value })} 
                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                            placeholder="sq0idp-..."
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">Square Location ID</label>
                          <input 
                            value={config.squareLocationId || ''} 
                            onChange={e => onConfigChange({ ...config, squareLocationId: e.target.value })} 
                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                            placeholder="L..."
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">Square Access Token</label>
                          <div className="flex gap-2">
                            <input 
                              type="password"
                              value={squareAccessToken} 
                              onChange={e => setSquareAccessToken(e.target.value)} 
                              className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                              placeholder="EAAA... (Enter to update)"
                            />
                            <button 
                              onClick={handleSaveSecrets}
                              disabled={!squareAccessToken || isSavingSecrets}
                              className="mt-1 px-4 bg-neutral-800 hover:bg-white text-white hover:text-black rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
                            >
                              {isSavingSecrets ? <Loader2 className="animate-spin" /> : 'Save'}
                            </button>
                          </div>

                          <div className="mt-4 bg-neutral-800/50 p-4 rounded-lg border border-neutral-800">
                            <h5 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Setup Instructions</h5>
                            <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-1 mb-4">
                              <li>Log in to your Square Developer Dashboard.</li>
                              <li>Create or select an application.</li>
                              <li>Go to <span className="text-white">Credentials</span> to find your Application ID and Access Token.</li>
                              <li>Go to <span className="text-white">Locations</span> to find your Location ID.</li>
                            </ol>
                            <button 
                              onClick={() => handleTestConnection('square')}
                              disabled={isTestingConnection === 'square'}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors"
                            >
                              {isTestingConnection === 'square' ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                              Test Connection
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {config.paymentProvider === 'paypal' && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">PayPal Client ID</label>
                          <input 
                            value={config.paypalClientId || ''} 
                            onChange={e => onConfigChange({ ...config, paypalClientId: e.target.value })} 
                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                            placeholder="Client ID"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">PayPal Client Secret</label>
                          <div className="flex gap-2">
                            <input 
                              type="password"
                              value={paypalSecretKey} 
                              onChange={e => setPaypalSecretKey(e.target.value)} 
                              className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                              placeholder="Client Secret (Enter to update)"
                            />
                            <button 
                              onClick={handleSaveSecrets}
                              disabled={!paypalSecretKey || isSavingSecrets}
                              className="mt-1 px-4 bg-neutral-800 hover:bg-white text-white hover:text-black rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
                            >
                              {isSavingSecrets ? <Loader2 className="animate-spin" /> : 'Save'}
                            </button>
                          </div>

                          <div className="mt-4 bg-neutral-800/50 p-4 rounded-lg border border-neutral-800">
                            <h5 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Setup Instructions</h5>
                            <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-1 mb-4">
                              <li>Log in to the PayPal Developer Dashboard.</li>
                              <li>Create a new App in <span className="text-white">My Apps & Credentials</span>.</li>
                              <li>Copy the "Client ID" and "Secret".</li>
                              <li>Paste them into the fields above and click Save.</li>
                            </ol>
                            <button 
                              onClick={() => handleTestConnection('paypal')}
                              disabled={isTestingConnection === 'paypal'}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors"
                            >
                              {isTestingConnection === 'paypal' ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                              Test Connection
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {(config.paymentProvider === 'stripe' || config.paymentProvider === 'square') && (
                      <div className="pt-4 border-t border-neutral-800 mt-4">
                          <h4 className="text-xs font-bold text-white mb-4">Digital Wallets</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-5 bg-white rounded flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2560px-Apple_Pay_logo.svg.png" className="h-3" /></div>
                                <span className="text-sm font-bold text-white">Apple Pay</span>
                              </div>
                              <button 
                                onClick={() => onConfigChange({ ...config, enableApplePay: !config.enableApplePay })}
                                className={`w-10 h-5 rounded-full transition-colors relative ${config.enableApplePay ? 'bg-blue-600' : 'bg-neutral-800'}`}
                              >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${config.enableApplePay ? 'translate-x-5' : ''}`}></div>
                              </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black border border-neutral-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-5 bg-white rounded flex items-center justify-center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/2560px-Google_Pay_Logo.svg.png" className="h-3" /></div>
                                <span className="text-sm font-bold text-white">Google Pay</span>
                              </div>
                              <button 
                                onClick={() => onConfigChange({ ...config, enableGooglePay: !config.enableGooglePay })}
                                className={`w-10 h-5 rounded-full transition-colors relative ${config.enableGooglePay ? 'bg-blue-600' : 'bg-neutral-800'}`}
                              >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${config.enableGooglePay ? 'translate-x-5' : ''}`}></div>
                              </button>
                            </div>
                          </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSettingsTab === 'shipping' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Shipping & Delivery</h3>
                    <p className="text-neutral-500">Manage shipping zones and rates.</p>
                  </div>

                  {/* Shipping Integrations */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <h4 className="font-bold text-white border-b border-neutral-800 pb-4 mb-4 flex items-center gap-2">
                      <Package size={20} className="text-blue-500" />
                      Shipping Provider
                    </h4>
                    
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase">Select Provider</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['manual', 'shippo', 'easypost'].map(provider => (
                          <button
                            key={provider}
                            onClick={() => onConfigChange({ ...config, shippingProvider: provider as any })}
                            className={`py-3 px-4 rounded-xl text-sm font-bold capitalize border transition-all ${
                              config.shippingProvider === provider 
                                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                                : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                            }`}
                          >
                            {provider}
                          </button>
                        ))}
                      </div>
                    </div>

                    {config.shippingProvider === 'shippo' && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">Shippo API Key</label>
                          <div className="flex gap-2">
                            <input 
                              type="password"
                              value={shippoApiKey} 
                              onChange={e => setShippoApiKey(e.target.value)} 
                              className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                              placeholder="shippo_live_... (Enter to update)"
                            />
                            <button 
                              onClick={handleSaveShippingSecrets}
                              disabled={!shippoApiKey || isSavingShippingSecrets}
                              className="mt-1 px-4 bg-neutral-800 hover:bg-white text-white hover:text-black rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
                            >
                              {isSavingShippingSecrets ? <Loader2 className="animate-spin" /> : 'Save'}
                            </button>
                          </div>
                          <p className="text-[10px] text-neutral-500 mt-2">Connect your Shippo account to automatically calculate rates and buy labels.</p>

                          <div className="mt-4 bg-neutral-800/50 p-4 rounded-lg border border-neutral-800">
                            <h5 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Setup Instructions</h5>
                            <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-1 mb-4">
                              <li>Log in to your Shippo Dashboard.</li>
                              <li>Go to <span className="text-white">Settings &gt; API</span>.</li>
                              <li>Generate a new "Live Token".</li>
                              <li>Paste it above and click Save.</li>
                            </ol>
                            <button 
                              onClick={() => handleTestConnection('shippo')}
                              disabled={isTestingConnection === 'shippo'}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors"
                            >
                              {isTestingConnection === 'shippo' ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                              Test Connection
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {config.shippingProvider === 'easypost' && (
                      <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2">
                        <div>
                          <label className="text-xs font-bold text-neutral-500 uppercase">EasyPost API Key</label>
                          <div className="flex gap-2">
                            <input 
                              type="password"
                              value={easypostApiKey} 
                              onChange={e => setEasypostApiKey(e.target.value)} 
                              className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 font-mono text-xs focus:border-blue-500 outline-none" 
                              placeholder="EZTK... (Enter to update)"
                            />
                            <button 
                              onClick={handleSaveShippingSecrets}
                              disabled={!easypostApiKey || isSavingShippingSecrets}
                              className="mt-1 px-4 bg-neutral-800 hover:bg-white text-white hover:text-black rounded-lg font-bold text-xs transition-colors disabled:opacity-50"
                            >
                              {isSavingShippingSecrets ? <Loader2 className="animate-spin" /> : 'Save'}
                            </button>
                          </div>
                          <p className="text-[10px] text-neutral-500 mt-2">Connect your EasyPost account to access 100+ carriers.</p>

                          <div className="mt-4 bg-neutral-800/50 p-4 rounded-lg border border-neutral-800">
                            <h5 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Setup Instructions</h5>
                            <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-1 mb-4">
                              <li>Log in to your EasyPost Dashboard.</li>
                              <li>Navigate to <span className="text-white">Account Settings &gt; API Keys</span>.</li>
                              <li>Copy your "Production API Key".</li>
                              <li>Paste it above and click Save.</li>
                            </ol>
                            <button 
                              onClick={() => handleTestConnection('easypost')}
                              disabled={isTestingConnection === 'easypost'}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-neutral-200 transition-colors"
                            >
                              {isTestingConnection === 'easypost' ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                              Test Connection
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Zone List */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                      <h4 className="font-bold text-white flex items-center gap-2"><Globe size={18} className="text-blue-500"/> Shipping Zones</h4>
                      <button 
                        onClick={() => {
                          const newZone = { id: Math.random().toString(36).substr(2, 9), name: 'New Zone', countries: [], rates: [] };
                          onConfigChange({ ...config, shippingZones: [...(config.shippingZones || []), newZone] });
                          setEditingZoneId(newZone.id);
                        }}
                        className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus size={14}/> Add Zone
                      </button>
                    </div>
                    
                    <div className="divide-y divide-neutral-800">
                      {config.shippingZones?.map((zone) => (
                        <div key={zone.id} className="bg-black/20">
                          <div 
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setEditingZoneId(editingZoneId === zone.id ? null : zone.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${editingZoneId === zone.id ? 'bg-blue-900/20 text-blue-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                <Truck size={18} />
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm">{zone.name}</div>
                                <div className="text-xs text-neutral-500">{zone.countries.length} Countries • {zone.rates.length} Rates</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <ChevronRight size={16} className={`text-neutral-500 transition-transform ${editingZoneId === zone.id ? 'rotate-90' : ''}`} />
                            </div>
                          </div>

                          {/* Zone Editor (Expanded) */}
                          {editingZoneId === zone.id && (
                            <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 space-y-6 animate-in slide-in-from-top-2">
                                {/* Zone Name & Countries */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-neutral-500 uppercase">Zone Name</label>
                                        <input 
                                            value={zone.name} 
                                            onChange={(e) => {
                                                const newZones = config.shippingZones!.map(z => z.id === zone.id ? { ...z, name: e.target.value } : z);
                                                onConfigChange({ ...config, shippingZones: newZones });
                                            }}
                                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-neutral-500 uppercase">Countries (Comma separated codes)</label>
                                        <textarea 
                                            value={zone.countries.join(', ')} 
                                            onChange={(e) => {
                                                const countries = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                                                const newZones = config.shippingZones!.map(z => z.id === zone.id ? { ...z, countries } : z);
                                                onConfigChange({ ...config, shippingZones: newZones });
                                            }}
                                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none h-20 resize-none font-mono text-xs" 
                                            placeholder="US, CA, GB, AU..."
                                        />
                                    </div>
                                </div>

                                {/* Rates Manager */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-xs font-bold text-neutral-500 uppercase">Shipping Rates</label>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const newRate = { id: Math.random().toString(36).substr(2, 9), name: 'Standard', price: 0, min_order: 0 };
                                                const newZones = config.shippingZones!.map(z => z.id === zone.id ? { ...z, rates: [...z.rates, newRate] } : z);
                                                onConfigChange({ ...config, shippingZones: newZones });
                                            }}
                                            className="text-[10px] font-bold bg-neutral-800 hover:bg-white hover:text-black text-white px-2 py-1 rounded transition-colors"
                                        >
                                            + Add Rate
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {zone.rates.map((rate, rIdx) => (
                                            <div key={rate.id} className="flex items-center gap-2 p-2 bg-black border border-neutral-800 rounded-lg">
                                                <input 
                                                    value={rate.name}
                                                    onChange={(e) => {
                                                        const newRates = [...zone.rates];
                                                        newRates[rIdx].name = e.target.value;
                                                        const newZones = config.shippingZones!.map(z => z.id === zone.id ? { ...z, rates: newRates } : z);
                                                        onConfigChange({ ...config, shippingZones: newZones });
                                                    }}
                                                    className="flex-1 bg-transparent text-white text-xs font-bold focus:outline-none"
                                                    placeholder="Rate Name"
                                                />
                                                <div className="flex items-center gap-1 bg-neutral-900 rounded px-2 py-1">
                                                    <span className="text-neutral-500 text-[10px]">$</span>
                                                    <input 
                                                        type="number"
                                                        value={rate.price}
                                                        onChange={(e) => {
                                                            const newRates = [...zone.rates];
                                                            newRates[rIdx].price = parseFloat(e.target.value);
                                                            const newZones = config.shippingZones!.map(z => z.id === zone.id ? { ...z, rates: newRates } : z);
                                                            onConfigChange({ ...config, shippingZones: newZones });
                                                        }}
                                                        className="w-12 bg-transparent text-white text-xs font-mono focus:outline-none text-right"
                                                    />
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const newRates = zone.rates.filter((_, i) => i !== rIdx);
                                                        const newZones = config.shippingZones!.map(z => z.id === zone.id ? { ...z, rates: newRates } : z);
                                                        onConfigChange({ ...config, shippingZones: newZones });
                                                    }}
                                                    className="p-1 text-neutral-600 hover:text-red-500"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                        {zone.rates.length === 0 && <div className="text-center py-2 text-neutral-600 text-xs italic">No rates defined</div>}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-neutral-800">
                                    <button 
                                        onClick={() => {
                                            if(confirm('Delete this zone?')) {
                                                const newZones = config.shippingZones!.filter(z => z.id !== zone.id);
                                                onConfigChange({ ...config, shippingZones: newZones });
                                                setEditingZoneId(null);
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-400 text-xs font-bold flex items-center gap-1"
                                    >
                                        <Trash2 size={14} /> Delete Zone
                                    </button>
                                </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!config.shippingZones || config.shippingZones.length === 0) && (
                        <div className="p-8 text-center text-neutral-500 text-sm">
                            <Globe size={32} className="mx-auto mb-3 opacity-20" />
                            No shipping zones configured.<br/>Create a zone to start selling.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'taxes' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Taxes and Duties</h3>
                    <p className="text-neutral-500">Configure how taxes are calculated.</p>
                  </div>

                  {/* Tax Regions List */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                      <h4 className="font-bold text-white flex items-center gap-2"><DollarSign size={18} className="text-green-500"/> Tax Regions</h4>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleQuickAddTax('US')}
                          className="text-xs font-bold bg-neutral-800 hover:bg-white hover:text-black text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          + US Tax
                        </button>
                        <button 
                          onClick={() => handleQuickAddTax('CA')}
                          className="text-xs font-bold bg-neutral-800 hover:bg-white hover:text-black text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          + Canada Tax
                        </button>
                        <button 
                          onClick={() => handleQuickAddTax('EU')}
                          className="text-xs font-bold bg-neutral-800 hover:bg-white hover:text-black text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          + EU VAT
                        </button>
                        <button 
                          onClick={() => {
                            const newRegion = { id: Math.random().toString(36).substr(2, 9), country_code: 'US', region_code: '*', rate: 0, name: 'Sales Tax' };
                            onConfigChange({ ...config, taxRegions: [...(config.taxRegions || []), newRegion] });
                            setEditingTaxRegionId(newRegion.id);
                          }}
                          className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Plus size={14}/> Custom
                        </button>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-neutral-800">
                      {config.taxRegions?.map((region) => (
                        <div key={region.id} className="bg-black/20">
                          <div 
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setEditingTaxRegionId(editingTaxRegionId === region.id ? null : region.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${editingTaxRegionId === region.id ? 'bg-green-900/20 text-green-500' : 'bg-neutral-800 text-neutral-400'}`}>
                                <Globe size={18} />
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm">{region.name} ({region.rate}%)</div>
                                <div className="text-xs text-neutral-500">{region.country_code} {region.region_code !== '*' ? `• ${region.region_code}` : ''}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <ChevronRight size={16} className={`text-neutral-500 transition-transform ${editingTaxRegionId === region.id ? 'rotate-90' : ''}`} />
                            </div>
                          </div>

                          {/* Region Editor (Expanded) */}
                          {editingTaxRegionId === region.id && (
                            <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 space-y-6 animate-in slide-in-from-top-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-neutral-500 uppercase">Tax Name</label>
                                        <input 
                                            value={region.name} 
                                            onChange={(e) => {
                                                const newRegions = config.taxRegions!.map(r => r.id === region.id ? { ...r, name: e.target.value } : r);
                                                onConfigChange({ ...config, taxRegions: newRegions });
                                            }}
                                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none" 
                                            placeholder="VAT, GST, Sales Tax"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-neutral-500 uppercase">Rate (%)</label>
                                        <input 
                                            type="number"
                                            value={region.rate} 
                                            onChange={(e) => {
                                                const newRegions = config.taxRegions!.map(r => r.id === region.id ? { ...r, rate: parseFloat(e.target.value) } : r);
                                                onConfigChange({ ...config, taxRegions: newRegions });
                                            }}
                                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none font-mono" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-neutral-500 uppercase">Country Code</label>
                                        <input 
                                            value={region.country_code} 
                                            onChange={(e) => {
                                                const newRegions = config.taxRegions!.map(r => r.id === region.id ? { ...r, country_code: e.target.value.toUpperCase() } : r);
                                                onConfigChange({ ...config, taxRegions: newRegions });
                                            }}
                                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none font-mono" 
                                            placeholder="US, GB, CA"
                                            maxLength={2}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-neutral-500 uppercase">Region Code (Optional)</label>
                                        <input 
                                            value={region.region_code} 
                                            onChange={(e) => {
                                                const newRegions = config.taxRegions!.map(r => r.id === region.id ? { ...r, region_code: e.target.value.toUpperCase() } : r);
                                                onConfigChange({ ...config, taxRegions: newRegions });
                                            }}
                                            className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white mt-1 focus:border-blue-500 outline-none font-mono" 
                                            placeholder="NY, CA, or *"
                                        />
                                        <p className="text-[10px] text-neutral-500 mt-1">Use * for all regions in country</p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-neutral-800">
                                    <button 
                                        onClick={() => {
                                            if(confirm('Delete this tax region?')) {
                                                const newRegions = config.taxRegions!.filter(r => r.id !== region.id);
                                                onConfigChange({ ...config, taxRegions: newRegions });
                                                setEditingTaxRegionId(null);
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-400 text-xs font-bold flex items-center gap-1"
                                    >
                                        <Trash2 size={14} /> Delete Region
                                    </button>
                                </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!config.taxRegions || config.taxRegions.length === 0) && (
                        <div className="p-8 text-center text-neutral-500 text-sm">
                            <DollarSign size={32} className="mx-auto mb-3 opacity-20" />
                            No tax regions configured.<br/>Taxes will not be collected.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'policies' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Legal Policies</h3>
                    <p className="text-neutral-500">Define your store's legal documents.</p>
                  </div>
                  
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-white">Refund Policy</h4>
                        <button onClick={() => generatePolicy('refund')} className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1"><Sparkles size={12}/> Generate Template</button>
                      </div>
                      <textarea 
                        value={config.policyRefund || ''} 
                        onChange={e => onConfigChange({ ...config, policyRefund: e.target.value })} 
                        className="w-full h-32 bg-black border border-neutral-800 rounded-lg p-3 text-neutral-300 text-sm focus:border-blue-500 outline-none resize-none"
                        placeholder="Enter your refund policy..."
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-white">Privacy Policy</h4>
                        <button onClick={() => generatePolicy('privacy')} className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1"><Sparkles size={12}/> Generate Template</button>
                      </div>
                      <textarea 
                        value={config.policyPrivacy || ''} 
                        onChange={e => onConfigChange({ ...config, policyPrivacy: e.target.value })} 
                        className="w-full h-32 bg-black border border-neutral-800 rounded-lg p-3 text-neutral-300 text-sm focus:border-blue-500 outline-none resize-none"
                        placeholder="Enter your privacy policy..."
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-white">Terms of Service</h4>
                        <button onClick={() => generatePolicy('terms')} className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1"><Sparkles size={12}/> Generate Template</button>
                      </div>
                      <textarea 
                        value={config.policyTerms || ''} 
                        onChange={e => onConfigChange({ ...config, policyTerms: e.target.value })} 
                        className="w-full h-32 bg-black border border-neutral-800 rounded-lg p-3 text-neutral-300 text-sm focus:border-blue-500 outline-none resize-none"
                        placeholder="Enter your terms of service..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Notifications</h3>
                    <p className="text-neutral-500">Manage customer emails and alerts.</p>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-800">
                        <h4 className="font-bold text-white flex items-center gap-2"><Mail size={18} className="text-blue-500"/> Customer Notifications</h4>
                    </div>
                    <div className="divide-y divide-neutral-800">
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div>
                                <div className="font-bold text-white text-sm">Order Confirmation</div>
                                <div className="text-xs text-neutral-500">Sent automatically when a customer places an order.</div>
                                <button onClick={() => alert('Test email sent!')} className="text-[10px] font-bold text-blue-500 hover:text-white mt-1 flex items-center gap-1"><Send size={10}/> Send Test</button>
                            </div>
                            <button 
                                onClick={() => onConfigChange({ ...config, notificationSettings: { ...config.notificationSettings, orderConfirmation: !config.notificationSettings?.orderConfirmation } })}
                                className={`w-10 h-5 rounded-full transition-colors relative ${config.notificationSettings?.orderConfirmation ? 'bg-blue-600' : 'bg-neutral-800'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${config.notificationSettings?.orderConfirmation ? 'translate-x-5' : ''}`}></div>
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div>
                                <div className="font-bold text-white text-sm">Shipping Updates</div>
                                <div className="text-xs text-neutral-500">Sent when an order is marked as shipped.</div>
                                <button onClick={() => alert('Test email sent!')} className="text-[10px] font-bold text-blue-500 hover:text-white mt-1 flex items-center gap-1"><Send size={10}/> Send Test</button>
                            </div>
                            <button 
                                onClick={() => onConfigChange({ ...config, notificationSettings: { ...config.notificationSettings, shippingUpdate: !config.notificationSettings?.shippingUpdate } })}
                                className={`w-10 h-5 rounded-full transition-colors relative ${config.notificationSettings?.shippingUpdate ? 'bg-blue-600' : 'bg-neutral-800'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${config.notificationSettings?.shippingUpdate ? 'translate-x-5' : ''}`}></div>
                            </button>
                        </div>
                    </div>
                  </div>

                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-800">
                        <h4 className="font-bold text-white flex items-center gap-2"><Settings size={18} className="text-purple-500"/> Admin Notifications</h4>
                    </div>
                    <div className="divide-y divide-neutral-800">
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div>
                                <div className="font-bold text-white text-sm">New Order Alert</div>
                                <div className="text-xs text-neutral-500">Receive an email when a new order is placed.</div>
                                <button onClick={() => alert('Test email sent!')} className="text-[10px] font-bold text-blue-500 hover:text-white mt-1 flex items-center gap-1"><Send size={10}/> Send Test</button>
                            </div>
                            <button 
                                onClick={() => onConfigChange({ ...config, notificationSettings: { ...config.notificationSettings, adminOrderAlert: !config.notificationSettings?.adminOrderAlert } })}
                                className={`w-10 h-5 rounded-full transition-colors relative ${config.notificationSettings?.adminOrderAlert ? 'bg-blue-600' : 'bg-neutral-800'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${config.notificationSettings?.adminOrderAlert ? 'translate-x-5' : ''}`}></div>
                            </button>
                        </div>
                        <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                            <div>
                                <div className="font-bold text-white text-sm">Low Stock Alert</div>
                                <div className="text-xs text-neutral-500">Receive an email when inventory drops below threshold.</div>
                                <button onClick={() => alert('Test email sent!')} className="text-[10px] font-bold text-blue-500 hover:text-white mt-1 flex items-center gap-1"><Send size={10}/> Send Test</button>
                            </div>
                            <button 
                                onClick={() => onConfigChange({ ...config, notificationSettings: { ...config.notificationSettings, adminLowStockAlert: !config.notificationSettings?.adminLowStockAlert } })}
                                className={`w-10 h-5 rounded-full transition-colors relative ${config.notificationSettings?.adminLowStockAlert ? 'bg-blue-600' : 'bg-neutral-800'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${config.notificationSettings?.adminLowStockAlert ? 'translate-x-5' : ''}`}></div>
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case AdminTab.PLATFORM:
        return (
          <div className="bg-white min-h-full">
            <ClientManagement />
          </div>
        );

      default:
        return <div className="p-8"><h2 className="text-white text-2xl">Dashboard</h2></div>;
    }
  };

  return (
    <div className="flex h-screen bg-nexus-black text-white font-sans overflow-hidden">
      {renderSidebar()}
      {renderInterfaceModal()}
      {renderBlockArchitect()}
      {renderHeroModal()}
      {renderGridModal()}
      {renderCollectionModal()}
      {renderSystemBlockModal()}
      {renderFooterModal()}
      {renderScrollModal()}
      {renderSocialModal()}
      {renderRichTextModal()}
      {renderEmailModal()}
      {renderCollapsibleModal()}
      {renderLogoListModal()}
      {renderPromoModal()}
      {renderGalleryModal()}
      {renderBlogModal()}
      {renderVideoModal()}
      {renderContactModal()}
      {renderLayoutModal()}
      {renderAddSectionLibrary()}
      {renderWelcomeWizard()}
      {renderAddPageModal()}
      {renderTutorial()}
      {renderSectionRecommendations()}
      {renderPublishChecklist()}
      {renderBrandSettings()}
      {renderNavBuilder()}
      {renderVersionHistory()}
      
      {/* First Edit Hint - Shows when user clicks a section for the first time */}
      {showFirstEditHint && selectedBlockId && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[250] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-md">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Edit3 size={20} />
            </div>
            <div>
              <p className="font-bold mb-0.5">Section Selected!</p>
              <p className="text-sm text-blue-100">Edit this section's content in the panel on the left. Look for ✨ to use AI assistance.</p>
            </div>
            <button 
              onClick={() => setShowFirstEditHint(false)}
              className="text-blue-200 hover:text-white transition-colors flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto relative flex flex-col">{renderContent()}</main>
      
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed z-[300] px-4 py-3 rounded-lg shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200 flex items-center gap-2.5 border ${
            toast.type === 'success' 
              ? 'bg-neutral-900/95 border-emerald-500/50 text-emerald-100 shadow-emerald-500/20' 
              : 'bg-neutral-900/95 border-red-500/50 text-red-100 shadow-red-500/20'
          }`}
          style={
            toast.x !== undefined && toast.y !== undefined
              ? {
                  left: `${toast.x}px`,
                  top: `${toast.y - 50}px`,
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none'
                }
              : {
                  bottom: '24px',
                  right: '24px',
                }
          }
        >
          {toast.type === 'success' ? (
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <span className="text-sm font-medium whitespace-nowrap">{toast.message}</span>
        </div>
      )}
    </div>
  );
};
