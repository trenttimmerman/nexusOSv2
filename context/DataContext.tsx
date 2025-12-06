import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Page, MediaAsset, Campaign, StoreConfig } from '../types';
import { MOCK_PRODUCTS } from '../constants';

// Defaults
const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    name: 'Welcome Series',
    type: 'email',
    status: 'sent',
    audience: 'New Signups',
    subject: 'Welcome to the Future of Commerce',
    content: 'Welcome to Evolv. We are glad you are here.',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    stats: { sent: 450, opened: 320, clicked: 110 }
  }
];

const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'm1',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
    name: 'Abstract Waves',
    type: 'image',
    createdAt: new Date().toISOString()
  },
  {
    id: 'm2',
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000',
    name: 'Meeting Room',
    type: 'image',
    createdAt: new Date().toISOString()
  },
  {
    id: 'm3',
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    name: 'Damaged Helmet (GLB)',
    type: 'model',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_PAGES: Page[] = [
  {
    id: 'home',
    title: 'Home',
    slug: '/',
    type: 'home',
    content: '',
    blocks: [
      {
        id: 'scroll-demo',
        type: 'system-scroll',
        name: 'Partner Logos',
        variant: 'logo-marquee',
        content: '',
        data: {}
      }
    ]
  },
  {
    id: 'about',
    title: 'About',
    slug: '/about',
    type: 'custom',
    content: '',
    blocks: [
      {
        id: 'b1',
        type: 'section',
        name: 'Hero Header',
        content: '<div class="my-12 p-8 bg-neutral-50 rounded-2xl"><h2 class="text-3xl font-bold mb-4">We are Evolv.</h2><p class="text-lg text-neutral-600">Born from the belief that commerce should be fluid, we build tools for the next generation of creators.</p></div>'
      }
    ]
  }
];

const DEFAULT_STORE_CONFIG: StoreConfig = {
  name: 'EVOLV',
  currency: 'CAD',
  headerStyle: 'canvas',
  heroStyle: 'impact',
  productCardStyle: 'classic',
  footerStyle: 'columns',
  scrollbarStyle: 'native',
  primaryColor: '#3b82f6',
  logoUrl: '',
  logoHeight: 32,
  supportEmail: '',
  shippingRates: [],
  taxRate: 0,
  policyRefund: '',
  policyPrivacy: '',
  policyTerms: '',
  storeAddress: {},
  storeFormats: { timezone: 'UTC', weightUnit: 'kg', dimensionUnit: 'cm' },
  shippingZones: [],
  taxRegions: [
      { id: 'ca-gst', country_code: 'CA', region_code: '*', rate: 5, name: 'GST' },
      { id: 'ca-on-hst', country_code: 'CA', region_code: 'ON', rate: 8, name: 'HST (Provincial)' }
  ],
  notificationSettings: {}
};

  interface DataContextType {
  products: Product[];
  pages: Page[];
  mediaAssets: MediaAsset[];
  campaigns: Campaign[];
  storeConfig: StoreConfig;
  loading: boolean;
  refreshData: (overrideStoreId?: string, silent?: boolean) => Promise<void>;
  
  // Actions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addPage: (page: Page) => Promise<void>;
  updatePage: (pageId: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  addAsset: (asset: MediaAsset) => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;
  addCampaign: (campaign: Campaign) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  updateConfig: (config: StoreConfig) => Promise<void>;
  signOut: () => Promise<void>;
  userRole: string | null;
  storeId: string | null;
  switchStore: (storeId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchAllData = async (overrideStoreId?: string, silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let targetStoreId = overrideStoreId;

      // 0. Check Custom Domain
      if (!targetStoreId) {
        const hostname = window.location.hostname;
        // Exclude localhost and codespaces from domain lookup for dev convenience
        // In production, you might want to allow localhost testing via /etc/hosts
        const isDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.github.dev') || hostname.endsWith('.app.github.dev');
        
        if (!isDev) {
            const { data: domainData } = await supabase
                .from('domains')
                .select('store_id')
                .eq('domain', hostname)
                .eq('status', 'active')
                .maybeSingle();
            
            if (domainData) {
                targetStoreId = domainData.store_id;
            }
        }
      }
      
      // 1. If authenticated and no domain override, load tenant data from profile
      if (session) {
        // Get Profile & Store ID
        const { data: profile } = await supabase.from('profiles').select('store_id, role').eq('id', session.user.id).single();
        
        if (profile && profile.store_id) {
          setUserRole(profile.role);
          // If we found a profile with a store, use this store_id unless explicitly overridden
          if (!targetStoreId) {
             targetStoreId = profile.store_id;
          }
        } else if (profile && !profile.store_id) {
          // User has a profile but no store - they need to complete setup
          // Don't set a store ID, let the UI handle the redirect
          setUserRole(profile.role);
          if (!silent) setLoading(false);
          return; // Exit early - user needs to set up their store
        }
      }

      // If no store ID yet (Public Visitor or Guest), try to fetch the 'demo-store'
      if (!targetStoreId && !session) {
        const { data: demoStore } = await supabase.from('stores').select('id').eq('slug', 'demo-store').maybeSingle();
        if (demoStore) {
            targetStoreId = demoStore.id;
        } else {
            // Fallback to first store if demo-store not found
            const { data: stores } = await supabase.from('stores').select('id').limit(1);
            if (stores && stores.length > 0) {
              targetStoreId = stores[0].id;
            }
        }
      }

      if (targetStoreId) {
          setStoreId(targetStoreId);
          const currentStoreId = targetStoreId;

          // 2. Products
          const { data: productsData } = await supabase.from('products').select('*').eq('store_id', currentStoreId);
          if (productsData && productsData.length > 0) {
            setProducts(productsData.map(p => ({
              ...p,
              compareAtPrice: p.compare_at_price,
              trackInventory: p.track_inventory,
              hasVariants: p.has_variants,
              variantOptions: p.variant_options,
              allowCustomization: p.allow_customization,
              createdAt: p.created_at,
              updatedAt: p.updated_at
            })));
          } else {
            setProducts([]); // No products for this tenant yet
          }

          // 3. Pages
          const { data: pagesData } = await supabase.from('pages').select('*').eq('store_id', currentStoreId);
          if (pagesData && pagesData.length > 0) {
            setPages(pagesData.map(p => ({ ...p, createdAt: p.created_at })));
          } else {
            setPages(DEFAULT_PAGES); // Default pages for new tenants
          }

          // 4. Media
          const { data: mediaData } = await supabase.from('media_assets').select('*').eq('store_id', currentStoreId);
          if (mediaData && mediaData.length > 0) {
            setMediaAssets(mediaData.map(m => ({ ...m, createdAt: m.created_at })));
          } else {
            setMediaAssets([]);
          }

          // 5. Campaigns
          const { data: campaignsData } = await supabase.from('campaigns').select('*').eq('store_id', currentStoreId);
          if (campaignsData && campaignsData.length > 0) {
            setCampaigns(campaignsData.map(c => ({
              ...c,
              scheduledFor: c.scheduled_for,
              sentAt: c.sent_at,
              createdAt: c.created_at
            })));
          } else {
            setCampaigns([]);
          }

          // 6. Config
          const { data: configData } = await supabase.from('store_config').select('*').eq('store_id', currentStoreId).single();
          if (configData) {
            setStoreConfig({
              store_id: configData.store_id,
              name: configData.name,
              currency: configData.currency,
              headerStyle: configData.header_style as any,
              heroStyle: configData.hero_style as any,
              productCardStyle: configData.product_card_style as any,
              footerStyle: configData.footer_style as any,
              scrollbarStyle: configData.scrollbar_style as any,
              primaryColor: configData.primary_color,
              logoUrl: configData.logo_url,
              logoHeight: configData.logo_height,
              paymentProvider: configData.payment_provider as any,
              stripePublishableKey: configData.stripe_publishable_key,
              paypalClientId: configData.paypal_client_id,
              squareApplicationId: configData.square_application_id,
              squareLocationId: configData.square_location_id,
              enableApplePay: configData.enable_apple_pay,
              enableGooglePay: configData.enable_google_pay,
              supportEmail: configData.support_email,
              shippingProvider: configData.shipping_provider as any,
              shippingRates: configData.shipping_rates,
              taxRate: configData.tax_rate,
              policyRefund: configData.policy_refund,
              policyPrivacy: configData.policy_privacy,
              policyTerms: configData.policy_terms,
              storeAddress: configData.store_address,
              storeFormats: configData.store_formats,
              shippingZones: configData.shipping_zones,
              taxRegions: configData.tax_regions,
              notificationSettings: configData.notification_settings
            });
          } else {
             // Reset config if not found for this store
             setStoreConfig(DEFAULT_STORE_CONFIG);
          }
      } else {
        // Fallback to Mock Data if absolutely no store found
        setProducts(MOCK_PRODUCTS);
        setPages(DEFAULT_PAGES);
        setMediaAssets(DEFAULT_MEDIA_ASSETS);
        setCampaigns(DEFAULT_CAMPAIGNS);
        setStoreConfig(DEFAULT_STORE_CONFIG);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mocks on error
      setProducts(MOCK_PRODUCTS);
      setPages(DEFAULT_PAGES);
      setStoreConfig(DEFAULT_STORE_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  // Track initialization to prevent reload loops
  const isInitialized = React.useRef(false);

  useEffect(() => {
    fetchAllData().then(() => { isInitialized.current = true; });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
        // Reset state on sign out
        if (event === 'SIGNED_OUT') {
          isInitialized.current = false;
          setStoreId(null);
          setUserRole(null);
          setProducts([]);
          setPages([]);
          setStoreConfig(DEFAULT_STORE_CONFIG);
          fetchAllData(undefined, false);
        } else if (event === 'TOKEN_REFRESHED') {
           // Silent refresh to avoid UI flickering/reset
           fetchAllData(undefined, true);
        } else if (event === 'SIGNED_IN') {
           // If already initialized, treat SIGNED_IN as a silent refresh (e.g. tab focus)
           if (isInitialized.current) {
              fetchAllData(undefined, true);
           } else {
              fetchAllData(undefined, false);
           }
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const switchStore = async (newStoreId: string) => {
    await fetchAllData(newStoreId);
  };

  // --- Actions ---

  const addProduct = async (product: Product) => {
    setProducts(prev => [product, ...prev]);
    if (!storeId) return; // Don't save if no tenant
    const dbProduct = {
      id: product.id,
      store_id: storeId,
      name: product.name,
      description: product.description,
      price: product.price,
      compare_at_price: product.compareAtPrice,
      image: product.image,
      images: product.images,
      category: product.category,
      tags: product.tags,
      sku: product.sku,
      stock: product.stock,
      track_inventory: product.trackInventory,
      has_variants: product.hasVariants,
      variant_options: product.variantOptions,
      variants: product.variants,
      seo: product.seo,
      status: product.status,
      template: product.template,
      allow_customization: product.allowCustomization,
      updated_at: new Date().toISOString()
    };
    await supabase.from('products').upsert(dbProduct);
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    if (!storeId) return;
    
    const dbUpdates: any = {
      updated_at: new Date().toISOString()
    };
    
    // Map camelCase to snake_case for DB
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.compareAtPrice !== undefined) dbUpdates.compare_at_price = updates.compareAtPrice;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.images !== undefined) dbUpdates.images = updates.images;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.sku !== undefined) dbUpdates.sku = updates.sku;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.trackInventory !== undefined) dbUpdates.track_inventory = updates.trackInventory;
    if (updates.hasVariants !== undefined) dbUpdates.has_variants = updates.hasVariants;
    if (updates.variantOptions !== undefined) dbUpdates.variant_options = updates.variantOptions;
    if (updates.variants !== undefined) dbUpdates.variants = updates.variants;
    if (updates.seo !== undefined) dbUpdates.seo = updates.seo;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.template !== undefined) dbUpdates.template = updates.template;
    if (updates.allowCustomization !== undefined) dbUpdates.allow_customization = updates.allowCustomization;
    
    await supabase.from('products').update(dbUpdates).eq('id', productId);
  };

  const deleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    await supabase.from('products').delete().eq('id', productId);
  };

  const addPage = async (page: Page) => {
    setPages(prev => [...prev, page]);
    if (!storeId) return;
    await supabase.from('pages').insert({
      id: page.id,
      store_id: storeId,
      title: page.title,
      slug: page.slug,
      type: page.type,
      content: page.content,
      blocks: page.blocks
    });
  };

  const updatePage = async (pageId: string, updates: Partial<Page>) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ...updates } : p));
    await supabase.from('pages').update(updates).eq('id', pageId);
  };

  const deletePage = async (pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
    await supabase.from('pages').delete().eq('id', pageId);
  };

  const addAsset = async (asset: MediaAsset) => {
    setMediaAssets(prev => [asset, ...prev]);
    if (!storeId) return;
    await supabase.from('media_assets').insert({ ...asset, store_id: storeId });
  };

  const deleteAsset = async (assetId: string) => {
    setMediaAssets(prev => prev.filter(a => a.id !== assetId));
    await supabase.from('media_assets').delete().eq('id', assetId);
  };

  const addCampaign = async (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
    if (!storeId) return;
    const dbCampaign = {
      id: campaign.id,
      store_id: storeId,
      name: campaign.name,
      type: campaign.type,
      status: campaign.status,
      subject: campaign.subject,
      content: campaign.content,
      audience: campaign.audience,
      scheduled_for: campaign.scheduledFor,
      sent_at: campaign.sentAt,
      stats: campaign.stats
    };
    await supabase.from('campaigns').insert(dbCampaign);
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    const dbUpdates: any = { ...updates };
    if (updates.scheduledFor) dbUpdates.scheduled_for = updates.scheduledFor;
    if (updates.sentAt) dbUpdates.sent_at = updates.sentAt;
    delete dbUpdates.scheduledFor;
    delete dbUpdates.sentAt;
    await supabase.from('campaigns').update(dbUpdates).eq('id', id);
  };

  const deleteCampaign = async (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    await supabase.from('campaigns').delete().eq('id', id);
  };

  const updateConfig = async (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    if (!storeId) return;
    const dbConfig = {
      store_id: storeId,
      name: newConfig.name,
      currency: newConfig.currency,
      header_style: newConfig.headerStyle,
      hero_style: newConfig.heroStyle,
      product_card_style: newConfig.productCardStyle,
      footer_style: newConfig.footerStyle,
      scrollbar_style: newConfig.scrollbarStyle,
      primary_color: newConfig.primaryColor,
      logo_url: newConfig.logoUrl,
      logo_height: newConfig.logoHeight,
      payment_provider: newConfig.paymentProvider,
      stripe_publishable_key: newConfig.stripePublishableKey,
      paypal_client_id: newConfig.paypalClientId,
      square_application_id: newConfig.squareApplicationId,
      square_location_id: newConfig.squareLocationId,
      enable_apple_pay: newConfig.enableApplePay,
      enable_google_pay: newConfig.enableGooglePay,
      support_email: newConfig.supportEmail,
      shipping_provider: newConfig.shippingProvider,
      shipping_rates: newConfig.shippingRates,
      tax_rate: newConfig.taxRate,
      policy_refund: newConfig.policyRefund,
      policy_privacy: newConfig.policyPrivacy,
      policy_terms: newConfig.policyTerms,
      store_address: newConfig.storeAddress,
      store_formats: newConfig.storeFormats,
      shipping_zones: newConfig.shippingZones,
      tax_regions: newConfig.taxRegions,
      notification_settings: newConfig.notificationSettings,
      updated_at: new Date().toISOString()
    };
    // Upsert config for this store
    await supabase.from('store_config').upsert(dbConfig, { onConflict: 'store_id' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <DataContext.Provider value={{
      products, pages, mediaAssets, campaigns, storeConfig, loading, refreshData: fetchAllData,
      addProduct, updateProduct, deleteProduct, addPage, updatePage, deletePage, addAsset, deleteAsset, addCampaign, updateCampaign, deleteCampaign, updateConfig, signOut, userRole, storeId, switchStore
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
