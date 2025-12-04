import React, { useState, useEffect } from 'react';
import { ProductEditor } from './ProductEditor';
import { StoreConfig, AdminTab, HeaderStyleId, HeroStyleId, ProductCardStyleId, FooterStyleId, ScrollbarStyleId, Product, Page, AdminPanelProps, PageBlock } from '../types';
import { HEADER_OPTIONS, HEADER_COMPONENTS } from './HeaderLibrary';
import { HERO_OPTIONS, HERO_COMPONENTS, HERO_FIELDS } from './HeroLibrary';
import { PRODUCT_CARD_OPTIONS, PRODUCT_CARD_COMPONENTS } from './ProductCardLibrary';
import { FOOTER_OPTIONS } from './FooterLibrary';
import { SCROLL_OPTIONS } from './ScrollLibrary';
import { Storefront } from './Storefront';
import { EditorPanel } from './EditorPanel';
import { CartDrawer } from './CartDrawer';
import { MediaLibrary } from './MediaLibrary';
import { CampaignManager } from './CampaignManager';
import { OrderManager } from './OrderManager';
import { DomainManager } from './DomainManager';
import { DiscountManager } from './DiscountManager';
import { ShippingManager } from './ShippingManager';
import { supabase } from '../lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
import {
  LayoutDashboard,
  Package,
  Palette,
  Megaphone,
  Settings,
  TrendingUp,
  Users,
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
  Truck,
  ChevronRight,
  Tag,
  Save
} from 'lucide-react';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  activeTab,
  onTabChange,
  config,
  onConfigChange,
  products,
  onAddProduct,
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
  onSwitchStore
}) => {

  // Platform Admin State
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoadingTenants, setIsLoadingTenants] = useState(false);
  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);

  // Local State for Draft Mode
  const [localPages, setLocalPages] = useState<Page[]>(pages);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
      if (!hasUnsavedChanges) {
          setLocalPages(pages);
      }
  }, [pages, hasUnsavedChanges]);
  
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

  // Dashboard State
  const [dashboardStats, setDashboardStats] = useState({
    revenue: 0,
    orders: 0,
    activeUsers: 0,
    salesData: [] as { date: string; sales: number }[]
  });

  useEffect(() => {
    if (activeTab === AdminTab.DASHBOARD) {
      fetchDashboardStats();
    }
  }, [activeTab, storeId]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch Orders for Revenue & Count (Last 30 Days for Chart)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let ordersQuery = supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      if (storeId) {
        ordersQuery = ordersQuery.eq('store_id', storeId);
      }

      const { data: orders, error: ordersError } = await ordersQuery;
      
      if (ordersError) {
        console.warn('Could not fetch orders:', ordersError.message);
        return;
      }

      // Calculate Totals (Note: This is only for last 30 days now, ideally we'd have a separate query for all-time totals)
      // For now, let's fetch ALL-TIME totals separately to be accurate
      let allTimeOrdersQuery = supabase
        .from('orders')
        .select('total_amount');
      
      if (storeId) {
        allTimeOrdersQuery = allTimeOrdersQuery.eq('store_id', storeId);
      }
      
      const { data: allOrders } = await allTimeOrdersQuery;
      const totalRevenue = allOrders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
      const totalOrders = allOrders?.length || 0;

      // Process Sales Data for Chart
      const salesMap = new Map<string, number>();
      const today = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        salesMap.set(dateStr, 0);
      }

      orders?.forEach(order => {
        const dateStr = new Date(order.created_at).toISOString().split('T')[0];
        if (salesMap.has(dateStr)) {
          salesMap.set(dateStr, (salesMap.get(dateStr) || 0) + (Number(order.total_amount) || 0));
        }
      });

      const salesData = Array.from(salesMap.entries()).map(([date, sales]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales
      }));

      // Fetch Customers (Active Users)
      let customersQuery = supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      if (storeId) {
        customersQuery = customersQuery.eq('store_id', storeId);
      }

      const { count: userCount, error: usersError } = await customersQuery;

      setDashboardStats({
        revenue: totalRevenue,
        orders: totalOrders,
        activeUsers: userCount || 0,
        salesData
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  useEffect(() => {
    if (activeTab === AdminTab.PLATFORM && userRole === 'superuser') {
      fetchTenants();
    }
  }, [activeTab, userRole]);

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
  const [showPageProperties, setShowPageProperties] = useState(false);

  // MODAL STATES
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [systemModalType, setSystemModalType] = useState<'hero' | 'grid' | 'footer' | null>(null);
  const [isInterfaceModalOpen, setIsInterfaceModalOpen] = useState(false);

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

  // Live Preview State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Sorting State (Local to modals now)
  const [modalSort, setModalSort] = useState<'az' | 'new' | 'hot'>('az');

  // Editor Resize State
  const [editorWidth, setEditorWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // Resize relative to the left sidebar (256px / 16rem)
      const newWidth = Math.max(260, Math.min(800, e.clientX - 256));
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

  // Current Active Page Data
  const activePage = localPages.find(p => p.id === activePageId) || localPages[0];
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



  const handleAddNewPage = () => {
    const newPage: Page = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Page',
      slug: '/new-page',
      type: 'custom',
      content: '',
      blocks: [{
        id: Math.random().toString(36).substr(2, 9),
        type: 'section',
        name: 'Intro Text',
        content: '<p>Start writing your story here...</p>'
      }]
    };
    onAddPage(newPage);
  };

  // --- BLOCK MANAGEMENT FUNCTIONS ---

  const addBlock = (html: string, name: string, type: PageBlock['type'] = 'section', variant?: string) => {
    const newBlock: PageBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      name: name,
      content: html,
      variant: variant,
      data: {}
    };
    const updatedBlocks = [...(activePage.blocks || []), newBlock];
    onUpdatePage(activePageId, { blocks: updatedBlocks });
    setSelectedBlockId(newBlock.id);
    setIsAddSectionOpen(false);
    setPreviewBlock(null);
    setAddSectionStep('categories');
    setSelectedCategory(null);
  };

  const updateActiveBlock = (content: string) => {
    if (!selectedBlockId) return;
    setLocalPages(prev => prev.map(p => {
        if (p.id !== activePageId) return p;
        return {
            ...p,
            blocks: p.blocks.map(b => b.id === selectedBlockId ? { ...b, content } : b)
        };
    }));
    setHasUnsavedChanges(true);
  };

  const updateActiveBlockData = (blockId: string, data: any) => {
    if (!blockId) return;
    setLocalPages(prev => prev.map(p => {
      if (p.id !== activePageId) return p;
      
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
    const blocks = [...activePage.blocks];
    if (index + direction < 0 || index + direction >= blocks.length) return;

    const temp = blocks[index];
    blocks[index] = blocks[index + direction];
    blocks[index + direction] = temp;
    
    setLocalPages(prev => prev.map(p => p.id === activePageId ? { ...p, blocks } : p));
    setHasUnsavedChanges(true);
  };

  const deleteBlock = (id: string) => {
    const updatedBlocks = activePage.blocks.filter(b => b.id !== id);
    setLocalPages(prev => prev.map(p => p.id === activePageId ? { ...p, blocks: updatedBlocks } : p));
    setHasUnsavedChanges(true);
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const handleSaveChanges = async () => {
      const pageToSave = localPages.find(p => p.id === activePageId);
      if (pageToSave) {
          await onUpdatePage(activePageId, { blocks: pageToSave.blocks });
          setHasUnsavedChanges(false);
      }
  };

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
    <div className="w-64 bg-nexus-black border-r border-nexus-gray flex flex-col h-full text-neutral-400 shrink-0 z-20">
      <div className="p-6 border-b border-nexus-gray">
        <div className="flex items-center gap-2 text-white">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">E</div>
          <span className="font-display font-bold text-xl tracking-tight">Evolv</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {[
          { id: AdminTab.DASHBOARD, icon: LayoutDashboard, label: 'Command Center' },
          { id: AdminTab.ORDERS, icon: ShoppingBag, label: 'Orders' },
          { id: AdminTab.PRODUCTS, icon: Package, label: 'Products' },
          { id: AdminTab.DISCOUNTS, icon: Tag, label: 'Discounts' },
          { id: AdminTab.SHIPPING, icon: Truck, label: 'Shipping' },
          { id: AdminTab.PAGES, icon: FileText, label: 'Pages' },
          { id: AdminTab.MEDIA, icon: FolderOpen, label: 'Media Library' },
          { id: AdminTab.DESIGN, icon: Palette, label: 'Design Studio' },
          { id: AdminTab.CAMPAIGNS, icon: Megaphone, label: 'Agent Campaigns' },
          { id: AdminTab.SETTINGS, icon: Settings, label: 'Settings' },
          ...(userRole === 'superuser' ? [{ id: AdminTab.PLATFORM, icon: Users, label: 'Platform Admin' }] : [])
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              setIsHeaderModalOpen(false);
              setIsSystemModalOpen(false);
              setIsInterfaceModalOpen(false);
              setIsAddSectionOpen(false);
              setIsArchitectOpen(false);
              setIsProductEditorOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
              ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20'
              : 'hover:bg-white/5 hover:text-white'
              }`}
          >
            <item.icon size={18} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-nexus-gray">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-all"
        >
          <div className="w-4 h-4"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></div>
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );

  // --- HEADER CONFIG MODAL ---
  const renderHeaderModal = () => {
    if (!isHeaderModalOpen) return null;
    const style = { left: editorWidth + 256 }; // 256 is sidebar width
    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <PanelTop size={20} className="text-blue-500" />
            <div><h3 className="text-white font-bold">Header Studio</h3><p className="text-xs text-neutral-500">Global Navigation</p></div>
          </div>
          <button onClick={() => setIsHeaderModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {/* Branding Section */}
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={14} /> Identity</h4>
            <div className="space-y-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800">
              <div className="flex bg-black p-1 rounded-lg border border-neutral-800">
                <button onClick={() => { setLogoMode('text'); onConfigChange({ ...config, logoUrl: '' }); }} className={`flex-1 py-2 rounded text-xs font-bold ${logoMode === 'text' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}>Text</button>
                <button onClick={() => setLogoMode('image')} className={`flex-1 py-2 rounded text-xs font-bold ${logoMode === 'image' ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`}>Logo</button>
              </div>
              {logoMode === 'image' && (
                <div className="space-y-2">
                  <label className={`flex items-center justify-center gap-2 w-full p-3 border border-dashed border-neutral-700 rounded bg-black cursor-pointer hover:border-blue-500 ${isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploadingLogo ? <Loader2 size={14} className="animate-spin text-neutral-400" /> : <Upload size={14} className="text-neutral-400" />}
                    <span className="text-xs text-neutral-400">{isUploadingLogo ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={isUploadingLogo} />
                  </label>
                  <input type="range" min="20" max="120" value={config.logoHeight || 32} onChange={(e) => onConfigChange({ ...config, logoHeight: parseInt(e.target.value) })} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              )}
            </div>
          </div>
          {/* Style Grid */}
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><LayoutTemplate size={14} /> Architecture</h4>
            {renderSortControls(modalSort, setModalSort)}
            <div className="grid grid-cols-2 gap-2">
              {sortItems(HEADER_OPTIONS, modalSort).map((header) => (
                <button key={header.id} onClick={() => onConfigChange({ ...config, headerStyle: header.id as HeaderStyleId })} className={`text-left p-3 rounded-lg border transition-all ${config.headerStyle === header.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                  <div className="font-bold text-xs mb-1 truncate">{header.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- SYSTEM BLOCK MODAL (Hero, Grid, Footer) ---
  const [warningFields, setWarningFields] = useState<string[]>([]);
  const [pendingVariant, setPendingVariant] = useState<string | null>(null);

  const renderSystemBlockModal = () => {
    if (!isSystemModalOpen || !systemModalType) return null;

    let options: any[] = [];
    let currentSelection = '';
    let title = '';
    let setSelection: (id: string) => void = () => { };
    let color = 'blue';

    const handleHeroVariantChange = (id: string) => {
      if (!selectedBlockId || !activeBlock || !activeBlock.data) {
        const updatedBlocks = activePage.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: id } : b);
        onUpdatePage(activePageId, { blocks: updatedBlocks });
        return;
      }

      const currentFields = Object.keys(activeBlock.data).filter(k => activeBlock.data![k]);
      const targetFields = HERO_FIELDS[id] || [];

      const lostFields = currentFields.filter(field => !targetFields.includes(field));

      if (lostFields.length > 0) {
        setWarningFields(lostFields);
        setPendingVariant(id);
      } else {
        const updatedBlocks = activePage.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: id } : b);
        onUpdatePage(activePageId, { blocks: updatedBlocks });
      }
    };

    const confirmVariantChange = () => {
      if (pendingVariant && selectedBlockId) {
        const updatedBlocks = activePage.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: pendingVariant } : b);
        onUpdatePage(activePageId, { blocks: updatedBlocks });
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
          const updatedBlocks = activePage.blocks.map(b => b.id === selectedBlockId ? { ...b, variant: id } : b);
          onUpdatePage(activePageId, { blocks: updatedBlocks });
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

    const style = { left: editorWidth + 256 }; // 256 is sidebar width

    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <BoxSelect size={20} className={`text-${color}-500`} />
            <div><h3 className="text-white font-bold">{title}</h3><p className="text-xs text-neutral-500">System Component</p></div>
          </div>
          <button onClick={() => { setIsSystemModalOpen(false); setWarningFields([]); setPendingVariant(null); }} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 relative">
          {/* WARNING OVERLAY */}
          {warningFields.length > 0 && (
            <div className="absolute inset-0 z-50 bg-neutral-950/95 p-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-4"><AlertTriangle size={24} /></div>
              <h4 className="text-white font-bold text-lg mb-2">Content Loss Warning</h4>
              <p className="text-neutral-400 text-sm mb-6">Switching to <span className="text-white font-bold">{HERO_OPTIONS.find(o => o.id === pendingVariant)?.name}</span> will hide the following text fields because they are not supported by this style:</p>
              <div className="bg-neutral-900 rounded-lg p-3 w-full mb-6 border border-neutral-800">
                {warningFields.map(field => (
                  <div key={field} className="text-xs text-red-400 font-mono py-1 border-b border-neutral-800 last:border-0">{field}</div>
                ))}
              </div>
              <div className="flex gap-2 w-full">
                <button onClick={() => { setWarningFields([]); setPendingVariant(null); }} className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold text-sm transition-colors">Cancel</button>
                <button onClick={confirmVariantChange} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors">Confirm</button>
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><LayoutTemplate size={14} /> Style Matrix</h4>
            {renderSortControls(modalSort, setModalSort)}
            <div className="grid grid-cols-2 gap-2">
              {sortItems(options, modalSort).map((opt) => (
                <button key={opt.id} onClick={() => setSelection(opt.id)} className={`text-left p-3 rounded-lg border transition-all ${currentSelection === opt.id ? `bg-${color}-600/20 border-${color}-500 text-white` : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                  <div className="font-bold text-xs mb-1 truncate">{opt.name}</div>
                  <div className="text-[10px] opacity-60 truncate">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  // ... rest of the file
  const renderInterfaceModal = () => {
    if (!isInterfaceModalOpen) return null;
    const style = { left: editorWidth + 256 };
    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-blue-500" />
            <div><h3 className="text-white font-bold">Interface Studio</h3><p className="text-xs text-neutral-500">Global UI Settings</p></div>
          </div>
          <button onClick={() => setIsInterfaceModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ArrowDownAZ size={14} /> Scrollbar Style</h4>
            <div className="grid grid-cols-1 gap-2">
              {SCROLLBAR_OPTIONS.map((opt) => (
                <button key={opt.id} onClick={() => onConfigChange({ ...config, scrollbarStyle: opt.id as ScrollbarStyleId })} className={`text-left p-3 rounded-lg border transition-all ${config.scrollbarStyle === opt.id ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                  <div className="font-bold text-sm mb-1">{opt.name}</div>
                  <div className="text-[10px] opacity-60">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBlockArchitect = () => {
    if (!isArchitectOpen) return null;

    const style = { left: editorWidth + 256 }; // 256 is sidebar width

    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <Wand2 size={20} className="text-blue-500" />
            <div><h3 className="text-white font-bold">Block Architect</h3><p className="text-xs text-neutral-500">Visual Design Engine</p></div>
          </div>
          <button onClick={() => setIsArchitectOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><LayoutTemplate size={14} /> Layout Matrix</h4>
            <div className="grid grid-cols-2 gap-2">
              {['hero', 'split', 'card', 'cover'].map(l => (
                <button key={l} onClick={() => setArchitectConfig({ ...architectConfig, layout: l })} className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${architectConfig.layout === l ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}>
                  <BoxSelect size={20} /><span className="text-xs font-bold uppercase">{l}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Type size={14} /> Content Control</h4>
            <div className="space-y-3">
              <input value={architectConfig.heading} onChange={(e) => setArchitectConfig({ ...architectConfig, heading: e.target.value })} className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white text-sm font-bold focus:border-blue-500 outline-none" placeholder="Heading..." />
              <textarea value={architectConfig.body} onChange={(e) => setArchitectConfig({ ...architectConfig, body: e.target.value })} className="w-full h-24 bg-neutral-900 border border-neutral-800 rounded p-3 text-neutral-400 text-xs focus:border-blue-500 outline-none resize-none" placeholder="Body text..." />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ImageIcon size={14} /> Visual Assets</h4>
            <div className="space-y-3">
              <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
                <img src={architectConfig.image} className="w-full h-full object-cover opacity-50" />
                <button onClick={simulateImageGen} className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 hover:bg-black/40 transition-colors">
                  {isGeneratingImage ? <Loader2 className="animate-spin text-white" /> : <><Sparkles size={16} className="text-blue-400" /><span className="text-xs font-bold text-white">Generate with Evolv AI</span></>}
                </button>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Sliders size={14} /> Atmosphere</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                <span className="text-xs text-neutral-400">Glassmorphism</span>
                <button onClick={() => setArchitectConfig(prev => ({ ...prev, glass: !prev.glass }))} className={`w-8 h-4 rounded-full transition-colors relative ${architectConfig.glass ? 'bg-blue-600' : 'bg-neutral-700'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${architectConfig.glass ? 'translate-x-4' : ''}`}></div>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['clean', 'dark', 'noise'].map(m => (
                  <button key={m} onClick={() => setArchitectConfig(prev => ({ ...prev, bgMode: m }))} className={`py-2 text-[10px] uppercase font-bold rounded border ${architectConfig.bgMode === m ? 'bg-neutral-800 border-neutral-600 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-500'}`}>{m}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddSectionLibrary = () => {
    if (!isAddSectionOpen) return null;

    const style = { left: editorWidth + 256 }; // 256 is sidebar width

    return (
      <div style={style} className="fixed top-0 bottom-0 w-96 z-[90] bg-neutral-950 flex flex-col border-r border-neutral-800 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 sticky top-0 backdrop-blur z-20">
          <div className="flex items-center gap-3">
            <Plus size={20} className="text-white" />
            <div>
              <h3 className="text-white font-bold">Add Section</h3>
              <p className="text-xs text-neutral-500">{addSectionStep === 'categories' ? 'Choose Type' : 'Select Style'}</p>
            </div>
          </div>
          <button onClick={() => { setIsAddSectionOpen(false); setPreviewBlock(null); setAddSectionStep('categories'); }} className="text-neutral-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {addSectionStep === 'categories' ? (
            <div className="space-y-2">
              <button onClick={() => { setSelectedCategory('hero'); setAddSectionStep('options'); }} className="w-full p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-purple-500 rounded-xl flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-900/20 text-purple-500 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors"><LayoutTemplate size={24} /></div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white">Hero Engine</span>
                    <span className="text-xs text-neutral-500">High impact entry sections</span>
                  </div>
                </div>
                <ChevronDown className="-rotate-90 text-neutral-600" />
              </button>

              <button onClick={() => { setSelectedCategory('grid'); setAddSectionStep('options'); }} className="w-full p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-green-500 rounded-xl flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-900/20 text-green-500 rounded-lg group-hover:bg-green-500 group-hover:text-white transition-colors"><Grid size={24} /></div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white">Product Grid</span>
                    <span className="text-xs text-neutral-500">Inventory display systems</span>
                  </div>
                </div>
                <ChevronDown className="-rotate-90 text-neutral-600" />
              </button>

              <button onClick={() => { setSelectedCategory('scroll'); setAddSectionStep('options'); }} className="w-full p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-500 rounded-xl flex items-center justify-between group transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-900/20 text-orange-500 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors"><Repeat size={24} /></div>
                  <div className="text-left">
                    <span className="block text-sm font-bold text-white">Scroll Sections</span>
                    <span className="text-xs text-neutral-500">Marquees and tickers</span>
                  </div>
                </div>
                <ChevronDown className="-rotate-90 text-neutral-600" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button onClick={() => { setAddSectionStep('categories'); setPreviewBlock(null); }} className="text-xs font-bold text-neutral-500 hover:text-white flex items-center gap-1"><ChevronDown className="rotate-90" size={14} /> Back to Categories</button>

              {selectedCategory === 'hero' && (
                <div className="grid grid-cols-1 gap-2">
                  {HERO_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('', opt.name, 'system-hero', opt.id)} className={`text-left p-3 rounded-xl border transition-all ${previewBlock?.variant === opt.id ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <div className="font-bold text-sm">{opt.name}</div>
                      <div className="text-[10px] opacity-60">{opt.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedCategory === 'grid' && (
                <div className="grid grid-cols-1 gap-2">
                  {PRODUCT_CARD_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('', `Grid: ${opt.name}`, 'system-grid', opt.id)} className={`text-left p-3 rounded-xl border transition-all ${previewBlock?.variant === opt.id ? 'bg-green-600/20 border-green-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <div className="font-bold text-sm">{opt.name}</div>
                      <div className="text-[10px] opacity-60">{opt.description}</div>
                    </button>
                  ))}
                </div>
              )}

              {selectedCategory === 'scroll' && (
                <div className="grid grid-cols-1 gap-2">
                  {SCROLL_OPTIONS.map(opt => (
                    <button key={opt.id} onClick={() => addBlock('', opt.name, 'system-scroll', opt.id)} className={`text-left p-3 rounded-xl border transition-all ${previewBlock?.variant === opt.id ? 'bg-orange-600/20 border-orange-500 text-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}>
                      <div className="font-bold text-sm">{opt.name}</div>
                      <div className="text-[10px] opacity-60">{opt.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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

      case AdminTab.DESIGN:
        const isAnyModalOpen = isHeaderModalOpen || isSystemModalOpen || isArchitectOpen || isAddSectionOpen || isInterfaceModalOpen;
        return (
          <div className="flex h-full w-full bg-neutral-950 overflow-hidden">
            {/* LEFT COLUMN: EDITOR */}
            <div style={{ width: editorWidth }} className="relative flex flex-col border-r border-neutral-800 bg-black/50 shrink-0">
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-600 transition-colors z-50"
                onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }}
              />
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 space-y-3">

                  {/* Pages & Navigation (Kept as requested) */}
                  <div className="bg-neutral-900 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] rounded-xl overflow-hidden">
                    <button onClick={() => setDesignSections(prev => ({ ...prev, pages: !prev.pages }))} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-800 rounded text-neutral-400"><FileText size={16} /></div><span className="font-bold text-sm text-white">Pages</span></div><ChevronDown size={16} className={`text-neutral-500 transition-transform ${designSections.pages ? 'rotate-180' : ''}`} />
                    </button>
                    {designSections.pages && (
                      <div className="p-2 border-t border-neutral-800 bg-black/20 space-y-1">
                        {pages.map(page => {
                          const isActive = activePageId === page.id;
                          return (
                            <div key={page.id} className={`rounded-lg transition-colors ${isActive ? 'bg-neutral-900 border border-neutral-800' : ''}`}>
                              <button onClick={() => { onSetActivePage(page.id); setSelectedBlockId(null); setShowPageProperties(false); }} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${isActive ? 'text-blue-400' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
                                <div className="flex items-center gap-3">{page.type === 'home' ? <Home size={14} /> : <FileText size={14} />}<span className="font-medium">{page.title}</span></div>
                                <div className="flex items-center gap-2">{isActive && (<button onClick={(e) => { e.stopPropagation(); setShowPageProperties(!showPageProperties); }} className={`p-1 rounded hover:bg-neutral-800 transition-colors ${showPageProperties ? 'text-white bg-neutral-800' : 'text-neutral-500'}`} title="Page Properties"><Settings size={12} /></button>)}{isActive && <span className="text-[10px] bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold">EDIT</span>}</div>
                              </button>
                              {isActive && showPageProperties && (
                                <div className="px-4 pb-4 pt-0 space-y-3 animate-in slide-in-from-top-2">
                                  <div className="h-px bg-neutral-800 w-full mb-3"></div>
                                  <div><label className="text-[10px] text-neutral-500 uppercase font-bold">Page Title</label><input value={page.title} onChange={(e) => onUpdatePage(page.id, { title: e.target.value })} className="w-full bg-black border border-neutral-700 rounded p-1.5 text-white text-xs mt-1 focus:border-blue-500 outline-none" /></div>
                                  {page.type === 'custom' && (<div><label className="text-[10px] text-neutral-500 uppercase font-bold">URL Slug</label><input value={page.slug} onChange={(e) => onUpdatePage(page.id, { slug: e.target.value })} className="w-full bg-black border border-neutral-700 rounded p-1.5 text-neutral-400 font-mono text-xs mt-1 focus:border-blue-500 outline-none" /></div>)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <button onClick={handleAddNewPage} className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-neutral-500 hover:text-white hover:bg-white/5 border border-dashed border-neutral-800 hover:border-neutral-600 transition-all mt-2"><Plus size={14} /> Add New Page</button>
                      </div>
                    )}
                  </div>

                  {/* GLOBAL INTERFACE */}
                  <div className="bg-neutral-900 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] rounded-xl overflow-hidden mb-3">
                    <button onClick={() => setIsInterfaceModalOpen(true)} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-800 rounded text-neutral-400"><Monitor size={16} /></div><span className="font-bold text-sm text-white">Interface</span></div>
                      <div className="text-[10px] text-neutral-500 uppercase font-bold">{config.scrollbarStyle}</div>
                    </button>
                  </div>

                  {/* UNIFIED PAGE LAYOUT (The Hub) */}
                  <div className="bg-neutral-900 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)] rounded-xl overflow-hidden">
                    <button onClick={() => setDesignSections(prev => ({ ...prev, pageSections: !prev.pageSections }))} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center gap-3"><div className="p-1.5 bg-neutral-800 rounded text-neutral-400"><Layers size={16} /></div><span className="font-bold text-sm text-white">Layout</span></div><ChevronDown size={16} className={`text-neutral-500 transition-transform ${designSections.pageSections ? 'rotate-180' : ''}`} />
                    </button>
                    {designSections.pageSections && (
                      <div className="p-4 pt-0 border-t border-neutral-800 bg-black/20">
                        <div className="space-y-2 mb-4 mt-2">
                          {/* 1. FIXED HEADER */}
                          <div className="group flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-blue-900/30 text-blue-400 rounded"><PanelTop size={14} /></div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Header</span>
                                <span className="text-[10px] text-neutral-500">{HEADER_OPTIONS.find(h => h.id === config.headerStyle)?.name}</span>
                              </div>
                            </div>
                            <button onClick={() => setSelectedBlockId('header')} className="px-3 py-1.5 bg-neutral-800 hover:bg-blue-600 text-neutral-400 hover:text-white rounded text-xs font-bold transition-all">Edit</button>
                          </div>

                          {/* 2. DYNAMIC BLOCKS */}
                          {activePage.blocks?.map((block, idx) => (
                            <div key={block.id} className={`group flex items-center justify-between p-3 rounded-lg border transition-all ${selectedBlockId === block.id ? 'bg-neutral-800 border-neutral-700' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="text-[10px] font-bold text-neutral-600 w-4">{idx + 1}</div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium text-white truncate max-w-[100px]">{block.name}</span>
                                  <span className="text-[10px] text-neutral-500 uppercase">{block.type.replace('system-', '')}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    if (block.type === 'system-hero') { setSelectedBlockId(block.id); }
                                    else if (block.type === 'system-grid') { setSelectedBlockId(block.id); }
                                    else if (block.type === 'system-footer') { setSelectedBlockId('footer'); }
                                    else { handleOpenArchitect(block.id); }
                                  }}
                                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors" title="Edit Section"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <div className="flex flex-col gap-0.5">
                                  <button onClick={() => moveBlock(idx, -1)} className="text-neutral-600 hover:text-white disabled:opacity-30" disabled={idx === 0}><MoveUp size={10} /></button>
                                  <button onClick={() => moveBlock(idx, 1)} className="text-neutral-600 hover:text-white disabled:opacity-30" disabled={idx === (activePage.blocks?.length || 0) - 1}><MoveDown size={10} /></button>
                                </div>
                                <button onClick={() => deleteBlock(block.id)} className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors ml-1"><Trash2 size={14} /></button>
                              </div>
                            </div>
                          ))}

                          {/* 3. FIXED FOOTER */}
                          <div className="group flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-orange-900/30 text-orange-400 rounded"><PanelBottom size={14} /></div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">Footer</span>
                                <span className="text-[10px] text-neutral-500">{FOOTER_OPTIONS.find(f => f.id === config.footerStyle)?.name}</span>
                              </div>
                            </div>
                            <button onClick={() => { setSelectedBlockId('footer'); }} className="px-3 py-1.5 bg-neutral-800 hover:bg-orange-600 text-neutral-400 hover:text-white rounded text-xs font-bold transition-all">Edit</button>
                          </div>

                          {/* ADD SECTION BUTTON */}
                          <div className="pt-4">
                            <button onClick={() => setIsAddSectionOpen(true)} className="w-full py-3 border border-dashed border-neutral-700 rounded-xl flex items-center justify-center gap-2 text-neutral-500 hover:text-white hover:border-neutral-500 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest">
                              <Plus size={14} /> Add Section
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* INLINE BLOCK EDITOR (Restored) */}
                  {selectedBlockId && activeBlock && activeBlock.type === 'section' && (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden animate-in slide-in-from-top-2">
                      <div className="p-2 border-b border-neutral-800 flex items-center gap-2 bg-black/20">
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><Bold size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><Italic size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><Link size={14} /></button>
                        <div className="w-px h-4 bg-neutral-800 mx-1"></div>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><AlignLeft size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><AlignCenter size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"><AlignRight size={14} /></button>
                      </div>
                      <textarea
                        value={activeBlock.content}
                        onChange={(e) => updateActiveBlock(e.target.value)}
                        className="w-full h-64 bg-transparent p-4 text-xs font-mono text-neutral-300 focus:outline-none resize-none"
                        placeholder="Edit HTML content..."
                      />
                    </div>
                  )}

                </div>
              </div>
            </div>



            {/* RIGHT COLUMN: LIVE CANVAS */}
            <div className={`flex-1 bg-[#111] flex flex-col relative transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${isAnyModalOpen ? 'pl-96' : ''}`}>
              <div className="h-12 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><div className="w-2 h-2 rounded-full bg-yellow-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>
                <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-neutral-800">
                  <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}><Monitor size={14} /></button>
                  <button onClick={() => setPreviewDevice('mobile')} className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'}`}><Smartphone size={14} /></button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-neutral-500 font-mono">Live Preview: 12ms</div>
                  <button 
                      onClick={handleSaveChanges}
                      disabled={!hasUnsavedChanges}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${hasUnsavedChanges ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
                  >
                      <Save size={14} />
                      {hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]">
                <div className={`bg-white transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-2xl overflow-hidden relative ${previewDevice === 'mobile' ? 'w-[375px] h-[812px] rounded-[40px] border-[8px] border-neutral-900' : 'w-full h-full max-w-[1400px] rounded-lg border border-neutral-800'}`}>
                  <div className={`w-full h-full overflow-y-auto bg-white scrollbar-${config.scrollbarStyle}`}>
                    <Storefront
                      config={config}
                      products={products}
                      pages={localPages}
                      activePageId={activePageId}
                      previewBlock={previewBlock}
                      activeBlockId={selectedBlockId}
                      onUpdateBlock={updateActiveBlockData}
                      onEditBlock={(blockId) => {
                        setSelectedBlockId(blockId);
                      }}
                      onMoveBlock={(blockId, direction) => {
                        const index = activePage.blocks.findIndex(b => b.id === blockId);
                        if (index !== -1) moveBlock(index, direction === 'up' ? -1 : 1);
                      }}
                      onDeleteBlock={(blockId) => deleteBlock(blockId)}
                      onDuplicateBlock={(blockId) => {
                        const block = activePage.blocks.find(b => b.id === blockId);
                        if (block) {
                          const newBlock = { ...block, id: crypto.randomUUID() };
                          const index = activePage.blocks.findIndex(b => b.id === blockId);
                          const newBlocks = [...activePage.blocks];
                          newBlocks.splice(index + 1, 0, newBlock);
                          onUpdatePage(activePageId, { blocks: newBlocks });
                        }
                      }}
                      showCartDrawer={false}
                    />
                  </div>
                  <CartDrawer variant="absolute" />
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: PROPERTIES (Framer-style) */}
            {selectedBlockId && (
              (() => {
                // 1. HERO SECTION
                if (activeBlock && activeBlock.type === 'system-hero') {
                  return (
                    <EditorPanel 
                        isOpen={true}
                        onClose={() => setSelectedBlockId(null)}
                        blockId={activeBlock.id}
                        blockType="Hero Section"
                        data={activeBlock.data || {}}
                        onUpdate={(newData) => updateActiveBlockData(activeBlock.id, newData)}
                        fields={HERO_FIELDS[activeBlock.variant as HeroStyleId || 'impact'] || []}
                        variants={HERO_OPTIONS}
                        currentVariant={activeBlock.variant || 'impact'}
                        onVariantChange={(newVariant) => {
                            const updatedBlocks = activePage.blocks.map(b => b.id === activeBlock.id ? { ...b, variant: newVariant } : b);
                            onUpdatePage(activePageId, { blocks: updatedBlocks });
                        }}
                    />
                  );
                }
                // 2. PRODUCT GRID
                if (activeBlock && activeBlock.type === 'system-grid') {
                   return (
                    <EditorPanel 
                        isOpen={true}
                        onClose={() => setSelectedBlockId(null)}
                        blockId={activeBlock.id}
                        blockType="Product Grid"
                        data={activeBlock.data || {}}
                        onUpdate={(newData) => updateActiveBlockData(activeBlock.id, newData)}
                        fields={[]}
                        variants={PRODUCT_CARD_OPTIONS}
                        currentVariant={activeBlock.variant || 'simple'}
                        onVariantChange={(newVariant) => {
                            const updatedBlocks = activePage.blocks.map(b => b.id === activeBlock.id ? { ...b, variant: newVariant } : b);
                            onUpdatePage(activePageId, { blocks: updatedBlocks });
                        }}
                    />
                   );
                }
                // 3. FOOTER
                if (selectedBlockId === 'footer') {
                   return (
                    <EditorPanel 
                        isOpen={true}
                        onClose={() => setSelectedBlockId(null)}
                        blockId="footer"
                        blockType="Global Footer"
                        data={{}}
                        onUpdate={() => {}}
                        fields={[]}
                        variants={FOOTER_OPTIONS}
                        currentVariant={config.footerStyle}
                        onVariantChange={(newVariant) => onConfigChange({ ...config, footerStyle: newVariant as FooterStyleId })}
                        showDesignTabs={false}
                    />
                   );
                }
                // 4. HEADER
                if (selectedBlockId === 'header') {
                   return (
                    <EditorPanel 
                        isOpen={true}
                        onClose={() => setSelectedBlockId(null)}
                        blockId="header"
                        blockType="Global Header"
                        data={{}}
                        onUpdate={() => {}}
                        fields={[]}
                        variants={HEADER_OPTIONS}
                        currentVariant={config.headerStyle}
                        onVariantChange={(newVariant) => onConfigChange({ ...config, headerStyle: newVariant as HeaderStyleId })}
                        showDesignTabs={false}
                    />
                   );
                }
                return null;
              })()
            )}
          </div>
        );
      case AdminTab.DASHBOARD:
        return (
          <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-900/20 text-blue-500 rounded-xl"><DollarSign size={24} /></div>
                  <div><div className="text-neutral-500 text-sm font-bold uppercase">Total Revenue</div><div className="text-2xl font-bold text-white">${dashboardStats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div></div>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full w-[70%] bg-blue-600"></div></div>
              </div>
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-900/20 text-purple-500 rounded-xl"><ShoppingBag size={24} /></div>
                  <div><div className="text-neutral-500 text-sm font-bold uppercase">Orders</div><div className="text-2xl font-bold text-white">{dashboardStats.orders}</div></div>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full w-[45%] bg-purple-600"></div></div>
              </div>
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-900/20 text-green-500 rounded-xl"><Users size={24} /></div>
                  <div><div className="text-neutral-500 text-sm font-bold uppercase">Customers</div><div className="text-2xl font-bold text-white">{dashboardStats.activeUsers}</div></div>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full w-[80%] bg-green-600"></div></div>
              </div>
            </div>

            {/* ANALYTICS CHART */}
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Sales Overview</h3>
                  <p className="text-sm text-neutral-500">Revenue over the last 30 days</p>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-neutral-800 rounded-lg text-xs font-bold text-neutral-400">30 Days</div>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardStats.salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#666" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ fill: '#333', opacity: 0.4 }}
                    />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case AdminTab.ORDERS:
        return <OrderManager storeId={storeId || null} />;

      case AdminTab.PRODUCTS:
        return (
          <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div><h2 className="text-3xl font-black text-white tracking-tight">Inventory</h2><p className="text-neutral-500">Manage your products and stock</p></div>
              <button onClick={handleCreateProduct} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"><Plus size={18} /> Add Product</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all cursor-pointer" onClick={() => handleEditProduct(product)}>
                  <div className="aspect-square relative overflow-hidden">
                    <img src={product.images?.[0]?.url || product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-2 bg-white text-black rounded-lg hover:bg-neutral-200"><Edit3 size={16} /></button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white truncate pr-2">{product.name}</h3>
                      <span className="text-green-500 font-mono text-xs">${product.price}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-neutral-500">
                      <span>{product.category}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {isProductEditorOpen && (
              <ProductEditor
                product={editingProduct}
                onSave={(p) => {
                  onAddProduct(p);
                  setIsProductEditorOpen(false);
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
          <div className="p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Platform Administration</h2>
                <p className="text-neutral-500">Manage tenants, subscriptions, and global settings</p>
              </div>
              <button onClick={() => setIsCreateTenantOpen(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
                <Plus size={18} /> Create Tenant
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="text-neutral-500 text-sm font-bold uppercase mb-2">Total Tenants</div>
                <div className="text-4xl font-bold text-white">{tenants.length}</div>
              </div>
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="text-neutral-500 text-sm font-bold uppercase mb-2">Active Subscriptions</div>
                <div className="text-4xl font-bold text-white">{tenants.filter(t => t.subscription_status === 'active').length}</div>
              </div>
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="text-neutral-500 text-sm font-bold uppercase mb-2">Monthly Revenue</div>
                <div className="text-4xl font-bold text-white">$0.00</div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <h3 className="font-bold text-white">Tenants</h3>
              </div>
              <div className="p-6">
                {isLoadingTenants ? (
                  <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-neutral-500 text-xs uppercase">
                        <th className="pb-4">Store Name</th>
                        <th className="pb-4">ID</th>
                        <th className="pb-4">Role</th>
                        <th className="pb-4">Plan</th>
                        <th className="pb-4">Created</th>
                        <th className="pb-4"></th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {tenants.map((tenant) => (
                        <tr key={tenant.id} className="border-b border-neutral-800 last:border-0 hover:bg-white/5 transition-colors">
                          <td className="py-4 font-bold text-white">{tenant.store_name || 'Untitled Store'}</td>
                          <td className="py-4 text-neutral-400 font-mono text-xs">{tenant.id}</td>
                          <td className="py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${tenant.role === 'superuser' ? 'bg-purple-900/30 text-purple-500' : 'bg-green-900/30 text-green-500'}`}>{tenant.role || 'user'}</span></td>
                          <td className="py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${tenant.subscription_tier === 'pro' ? 'bg-blue-900/30 text-blue-400' : tenant.subscription_tier === 'enterprise' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-neutral-800 text-neutral-400'}`}>{tenant.subscription_tier}</span></td>
                          <td className="py-4 text-neutral-500">{new Date(tenant.created_at).toLocaleDateString()}</td>
                          <td className="py-4 text-right flex justify-end gap-2">
                            <button className="text-neutral-400 hover:text-white text-xs font-bold px-2 py-1 border border-neutral-700 rounded hover:bg-neutral-800 transition-all">Upgrade</button>
                            <button 
                              onClick={() => {
                                if (onSwitchStore) {
                                  onSwitchStore(tenant.id);
                                  // Switch to dashboard to see the effect
                                  onTabChange(AdminTab.DASHBOARD);
                                }
                              }}
                              className="text-blue-500 hover:text-white font-bold px-3 py-1 rounded hover:bg-blue-600 transition-all"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {isCreateTenantOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                    <h3 className="font-bold text-white text-lg">Create New Tenant</h3>
                    <button onClick={() => setIsCreateTenantOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase block mb-2">Store Name</label>
                      <input 
                        value={newTenantName} 
                        onChange={(e) => {
                          setNewTenantName(e.target.value);
                          // Auto-generate slug
                          setNewTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                        }}
                        className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none transition-colors" 
                        placeholder="e.g. Acme Corp"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase block mb-2">Store Slug (URL)</label>
                      <input 
                        value={newTenantSlug} 
                        onChange={(e) => setNewTenantSlug(e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-neutral-400 font-mono text-sm focus:border-blue-500 outline-none transition-colors" 
                        placeholder="e.g. acme-corp"
                      />
                    </div>
                  </div>
                  <div className="p-6 border-t border-neutral-800 bg-black/20 flex justify-end gap-3">
                    <button onClick={() => setIsCreateTenantOpen(false)} className="px-4 py-2 text-neutral-400 hover:text-white font-bold text-sm">Cancel</button>
                    <button 
                      onClick={handleCreateTenant} 
                      disabled={!newTenantName || !newTenantSlug || isCreatingTenant}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold text-sm flex items-center gap-2"
                    >
                      {isCreatingTenant ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                      Create Tenant
                    </button>
                  </div>
                </div>
              </div>
            )}
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
      {renderHeaderModal()}
      {renderSystemBlockModal()}
      {renderAddSectionLibrary()}
      
      <main className="flex-1 overflow-y-auto relative flex flex-col">{renderContent()}</main>
    </div>
  );
};
