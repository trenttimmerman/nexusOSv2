import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Page, MediaAsset, Campaign, StoreConfig, Category, Collection } from '../types';
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
    blocks: []
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
  categories: Category[];
  collections: Collection[];
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
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  reorderCategories: (categories: Category[]) => Promise<void>;
  saveCollection: (collection: Collection) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  updateConfig: (config: StoreConfig) => Promise<void>;
  signOut: () => Promise<void>;
  userRole: string | null;
  storeId: string | null;
  switchStore: (storeId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
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
        // Get Profile & Store ID - with error handling
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('store_id, role')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) {
          console.warn('[DataContext] Profile fetch failed:', profileError);
          if (!silent) setLoading(false);
          return;
        }
        
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
        // First try to get demo-store directly
        const { data: demoStore } = await supabase.from('stores').select('id').eq('slug', 'demo-store').maybeSingle();
        if (demoStore) {
            targetStoreId = demoStore.id;
        } else {
            // Fallback: try to get store_id from pages table (which has public read access)
            const { data: anyPage } = await supabase.from('pages').select('store_id').limit(1).maybeSingle();
            if (anyPage?.store_id) {
              targetStoreId = anyPage.store_id;
              console.log('[DataContext] Found store via pages table:', targetStoreId);
            } else {
              // Last resort: try to get any store
              const { data: stores } = await supabase.from('stores').select('id').limit(1);
              if (stores && stores.length > 0) {
                targetStoreId = stores[0].id;
              }
            }
        }
      }

      if (targetStoreId) {
          setStoreId(targetStoreId);
          const currentStoreId = targetStoreId;

          // 2. Categories
          const { data: categoriesData } = await supabase.from('categories').select('*').eq('store_id', currentStoreId).order('display_order');
          if (categoriesData && categoriesData.length > 0) {
            setCategories(categoriesData.map(c => ({
              ...c,
              parent_id: c.parent_id,
              display_order: c.display_order,
              is_visible: c.is_visible,
              created_at: c.created_at,
              updated_at: c.updated_at
            })));
          } else {
            setCategories([]); // No categories yet
          }

          // 3. Collections
          const { data: collectionsData } = await supabase.from('collections').select('*').eq('store_id', currentStoreId).order('display_order');
          if (collectionsData && collectionsData.length > 0) {
            // Load products for each manual collection
            const collectionsWithProducts = await Promise.all(
              collectionsData.map(async (collection) => {
                if (collection.type === 'manual') {
                  const { data: collectionProducts } = await supabase
                    .from('collection_products')
                    .select('product_id')
                    .eq('collection_id', collection.id)
                    .order('display_order');
                  
                  return {
                    ...collection,
                    is_featured: collection.is_featured,
                    is_visible: collection.is_visible,
                    display_order: collection.display_order,
                    image_url: collection.image_url,
                    seo_title: collection.seo_title,
                    seo_description: collection.seo_description,
                    created_at: collection.created_at,
                    updated_at: collection.updated_at,
                    product_ids: collectionProducts?.map(cp => cp.product_id) || []
                  };
                }
                return {
                  ...collection,
                  is_featured: collection.is_featured,
                  is_visible: collection.is_visible,
                  display_order: collection.display_order,
                  image_url: collection.image_url,
                  seo_title: collection.seo_title,
                  seo_description: collection.seo_description,
                  created_at: collection.created_at,
                  updated_at: collection.updated_at
                };
              })
            );
            setCollections(collectionsWithProducts);
          } else {
            setCollections([]);
          }

          // 4. Products
          const { data: productsData } = await supabase.from('products').select('*').eq('store_id', currentStoreId);
          if (productsData && productsData.length > 0) {
            setProducts(productsData.map(p => ({
              ...p,
              category_id: p.category_id,
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

          // 5. Pages - fetch all, sort by display_order in JS (column may not exist in DB yet)
          const { data: pagesData, error: pagesError } = await supabase.from('pages').select('*').eq('store_id', currentStoreId);
          console.log('[DataContext] Pages fetch:', { pagesData, pagesError, currentStoreId });
          if (pagesData && pagesData.length > 0) {
            console.log('[DataContext] Loading', pagesData.length, 'pages from database');
            setPages(pagesData.map(p => ({ ...p, createdAt: p.created_at })));
          } else {
            // Initialize default pages in DB for new tenants
            // Generate unique IDs for each store to avoid primary key conflicts
            console.log('[DataContext] No pages found, initializing defaults for store:', currentStoreId);
            const defaultPagesWithStoreId = DEFAULT_PAGES.map(p => ({
              ...p,
              id: `${p.id}-${currentStoreId.slice(0, 8)}`, // Make ID unique per store
              store_id: currentStoreId
            }));
            const { error: insertError } = await supabase.from('pages').insert(defaultPagesWithStoreId);
            if (insertError) {
              console.error('[DataContext] Failed to insert default pages:', insertError);
              // If insert fails (e.g., conflict), just use in-memory defaults
              setPages(DEFAULT_PAGES.map(p => ({ ...p, id: `${p.id}-${currentStoreId.slice(0, 8)}` })));
            } else {
              setPages(defaultPagesWithStoreId);
            }
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

          // 6. Config - Load active design settings
          const { data: configData } = await supabase.from('store_config').select('*').eq('store_id', currentStoreId).single();
          // Also fetch store slug for public URL
          const { data: storeData } = await supabase.from('stores').select('slug').eq('id', currentStoreId).single();
          
          // Load active design
          const { data: activeDesign } = await supabase
            .from('store_designs')
            .select('*')
            .eq('store_id', currentStoreId)
            .eq('is_active', true)
            .maybeSingle();
          
          if (configData) {
            setStoreConfig({
              store_id: configData.store_id,
              slug: storeData?.slug || '',
              name: configData.name,
              currency: configData.currency,
              // Use active design settings if available, fall back to store_config
              headerStyle: (activeDesign?.header_style || configData.header_style) as any,
              headerData: activeDesign?.header_data || configData.header_data,
              heroStyle: (activeDesign?.hero_style || configData.hero_style) as any,
              productCardStyle: (activeDesign?.product_card_style || configData.product_card_style) as any,
              footerStyle: (activeDesign?.footer_style || configData.footer_style) as any,
              scrollbarStyle: (activeDesign?.scrollbar_style || configData.scrollbar_style) as any,
              primaryColor: activeDesign?.primary_color || configData.primary_color,
              secondaryColor: activeDesign?.secondary_color || configData.secondary_color,
              backgroundColor: activeDesign?.background_color || configData.background_color,
              storeType: activeDesign?.store_type || configData.store_type,
              storeVibe: (activeDesign?.store_vibe || configData.store_vibe) as any,
              colorPalette: activeDesign?.color_palette || configData.color_palette,
              typography: activeDesign?.typography || configData.typography,
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
    console.log('[DataContext] updatePage called:', { pageId, hasBlocks: !!updates.blocks, blocksCount: updates.blocks?.length });
    
    // Update local state immediately for responsiveness
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ...updates } : p));
    
    if (!storeId) {
      console.warn('[DataContext] No storeId - cannot save to database');
      return;
    }
    
    // Check if page exists in DB first - MUST filter by store_id for proper isolation
    const { data: existingPage, error: checkError } = await supabase
      .from('pages')
      .select('id')
      .eq('id', pageId)
      .eq('store_id', storeId)
      .maybeSingle();
    
    if (checkError) {
      console.error('[DataContext] Page check error:', checkError);
    }
    
    if (existingPage) {
      // Page exists, update it - filter by both id AND store_id for safety
      const { error, data } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', pageId)
        .eq('store_id', storeId)
        .select();
      if (error) {
        console.error('[DataContext] Failed to update page:', error);
      } else {
        console.log('[DataContext] Page updated successfully:', data);
      }
    } else {
      // Page doesn't exist in DB yet, insert it
      const currentPage = pages.find(p => p.id === pageId);
      console.log('[DataContext] Page not in DB, inserting:', currentPage);
      if (currentPage) {
        const pageToInsert = {
          ...currentPage,
          ...updates,
          store_id: storeId
        };
        const { error } = await supabase.from('pages').insert(pageToInsert);
        if (error) {
          console.error('[DataContext] Failed to insert page:', error);
        } else {
          console.log('[DataContext] Page inserted successfully');
        }
      }
    }
  };

  const deletePage = async (pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
    if (!storeId) {
      console.warn('[DataContext] No storeId - cannot delete from database');
      return;
    }
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)
      .eq('store_id', storeId);
    if (error) {
      console.error('[DataContext] Failed to delete page:', error);
    }
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

  // Category Management
  const saveCategory = async (category: Category) => {
    if (!storeId) return;
    
    const dbCategory = {
      id: category.id,
      store_id: storeId,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent_id: category.parent_id,
      display_order: category.display_order,
      is_visible: category.is_visible,
      created_at: category.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await supabase.from('categories').upsert(dbCategory);
    
    // Update local state
    setCategories(prev => {
      const existing = prev.find(c => c.id === category.id);
      if (existing) {
        return prev.map(c => c.id === category.id ? category : c);
      } else {
        return [...prev, category];
      }
    });
  };

  const deleteCategory = async (categoryId: string) => {
    if (!storeId) return;
    
    // First, find all child categories recursively
    const findChildIds = (parentId: string): string[] => {
      const children = categories.filter(c => c.parent_id === parentId);
      return children.flatMap(c => [c.id, ...findChildIds(c.id)]);
    };
    
    const idsToDelete = [categoryId, ...findChildIds(categoryId)];
    
    // Delete all categories and their children
    await supabase.from('categories').delete().in('id', idsToDelete);
    
    // Update local state
    setCategories(prev => prev.filter(c => !idsToDelete.includes(c.id)));
    
    // Optional: Clear category_id from products that used these categories
    const { data: affectedProducts } = await supabase
      .from('products')
      .select('id')
      .in('category_id', idsToDelete);
    
    if (affectedProducts && affectedProducts.length > 0) {
      await supabase
        .from('products')
        .update({ category_id: null })
        .in('category_id', idsToDelete);
      
      // Refresh products
      await fetchAllData(storeId, true);
    }
  };

  const reorderCategories = async (reorderedCategories: Category[]) => {
    if (!storeId) return;
    
    // Update display_order for each category
    const updates = reorderedCategories.map((cat, index) => ({
      id: cat.id,
      store_id: storeId,
      display_order: index,
      updated_at: new Date().toISOString()
    }));
    
    await supabase.from('categories').upsert(updates);
    setCategories(reorderedCategories);
  };

  // Collection Management
  const saveCollection = async (collection: Collection) => {
    if (!storeId) return;
    
    const dbCollection = {
      id: collection.id,
      store_id: storeId,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image_url: collection.image_url,
      type: collection.type,
      is_featured: collection.is_featured,
      is_visible: collection.is_visible,
      display_order: collection.display_order,
      conditions: collection.conditions || {},
      seo_title: collection.seo_title,
      seo_description: collection.seo_description,
      created_at: collection.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await supabase.from('collections').upsert(dbCollection);
    
    // For manual collections, update the junction table
    if (collection.type === 'manual' && collection.product_ids) {
      // Delete existing product associations
      await supabase.from('collection_products').delete().eq('collection_id', collection.id);
      
      // Insert new associations with display order
      const collectionProducts = collection.product_ids.map((productId, index) => ({
        id: Math.random().toString(36).substr(2, 9),
        collection_id: collection.id,
        product_id: productId,
        display_order: index
      }));
      
      if (collectionProducts.length > 0) {
        await supabase.from('collection_products').insert(collectionProducts);
      }
    }
    
    // Update local state
    setCollections(prev => {
      const existing = prev.find(c => c.id === collection.id);
      if (existing) {
        return prev.map(c => c.id === collection.id ? collection : c);
      } else {
        return [...prev, collection];
      }
    });
  };

  const deleteCollection = async (collectionId: string) => {
    if (!storeId) return;
    
    // Delete collection (cascade will handle collection_products)
    await supabase.from('collections').delete().eq('id', collectionId);
    
    // Update local state
    setCollections(prev => prev.filter(c => c.id !== collectionId));
  };

  const updateConfig = async (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    if (!storeId) return;
    
    const dbConfig = {
      store_id: storeId,
      name: newConfig.name,
      currency: newConfig.currency,
      header_style: newConfig.headerStyle,
      header_data: newConfig.headerData,
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
    
    // CRITICAL FIX: Also update the active design in store_designs table
    // The multi-design system prioritizes store_designs over store_config,
    // so we must update both to prevent header selection from reverting
    const { data: activeDesign } = await supabase
      .from('store_designs')
      .select('id')
      .eq('store_id', storeId)
      .eq('is_active', true)
      .single();
    
    if (activeDesign) {
      await supabase
        .from('store_designs')
        .update({
          header_style: newConfig.headerStyle,
          header_data: newConfig.headerData,
          hero_style: newConfig.heroStyle,
          product_card_style: newConfig.productCardStyle,
          footer_style: newConfig.footerStyle,
          scrollbar_style: newConfig.scrollbarStyle,
          primary_color: newConfig.primaryColor,
          secondary_color: newConfig.secondaryColor,
          background_color: newConfig.backgroundColor,
          store_type: newConfig.storeType,
          store_vibe: newConfig.storeVibe,
          color_palette: newConfig.colorPalette,
          typography: newConfig.typography,
          updated_at: new Date().toISOString()
        })
        .eq('id', activeDesign.id);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <DataContext.Provider value={{
      products, pages, mediaAssets, campaigns, categories, collections, storeConfig, loading, refreshData: fetchAllData,
      addProduct, updateProduct, deleteProduct, addPage, updatePage, deletePage, addAsset, deleteAsset, addCampaign, updateCampaign, deleteCampaign, saveCategory, deleteCategory, reorderCategories, saveCollection, deleteCollection, updateConfig, signOut, userRole, storeId, switchStore
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

// Alias for backward compatibility
export const useDataContext = useData;
