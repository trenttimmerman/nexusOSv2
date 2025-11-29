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
    content: 'Welcome to Nexus. We are glad you are here.',
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
        content: '<div class="my-12 p-8 bg-neutral-50 rounded-2xl"><h2 class="text-3xl font-bold mb-4">We are Nexus.</h2><p class="text-lg text-neutral-600">Born from the belief that commerce should be fluid, we build tools for the next generation of creators.</p></div>'
      }
    ]
  }
];

const DEFAULT_STORE_CONFIG: StoreConfig = {
  name: 'EVOLV',
  currency: 'USD',
  headerStyle: 'canvas',
  heroStyle: 'impact',
  productCardStyle: 'classic',
  footerStyle: 'columns',
  scrollbarStyle: 'native',
  primaryColor: '#3b82f6',
  logoUrl: '',
  logoHeight: 32
};

interface DataContextType {
  products: Product[];
  pages: Page[];
  mediaAssets: MediaAsset[];
  campaigns: Campaign[];
  storeConfig: StoreConfig;
  loading: boolean;
  refreshData: () => Promise<void>;
  
  // Actions
  addProduct: (product: Product) => Promise<void>;
  addPage: (page: Page) => Promise<void>;
  updatePage: (pageId: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (pageId: string) => Promise<void>;
  addAsset: (asset: MediaAsset) => Promise<void>;
  deleteAsset: (assetId: string) => Promise<void>;
  addCampaign: (campaign: Campaign) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  updateConfig: (config: StoreConfig) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(DEFAULT_STORE_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Products
      const { data: productsData } = await supabase.from('products').select('*');
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
        setProducts(MOCK_PRODUCTS);
      }

      // 2. Pages
      const { data: pagesData } = await supabase.from('pages').select('*');
      if (pagesData && pagesData.length > 0) {
        setPages(pagesData.map(p => ({ ...p, createdAt: p.created_at })));
      } else {
        setPages(DEFAULT_PAGES);
      }

      // 3. Media
      const { data: mediaData } = await supabase.from('media_assets').select('*');
      if (mediaData && mediaData.length > 0) {
        setMediaAssets(mediaData.map(m => ({ ...m, createdAt: m.created_at })));
      } else {
        setMediaAssets(DEFAULT_MEDIA_ASSETS);
      }

      // 4. Campaigns
      const { data: campaignsData } = await supabase.from('campaigns').select('*');
      if (campaignsData && campaignsData.length > 0) {
        setCampaigns(campaignsData.map(c => ({
          ...c,
          scheduledFor: c.scheduled_for,
          sentAt: c.sent_at,
          createdAt: c.created_at
        })));
      } else {
        setCampaigns(DEFAULT_CAMPAIGNS);
      }

      // 5. Config
      const { data: configData } = await supabase.from('store_config').select('*').single();
      if (configData) {
        setStoreConfig({
          name: configData.name,
          currency: configData.currency,
          headerStyle: configData.header_style as any,
          heroStyle: configData.hero_style as any,
          productCardStyle: configData.product_card_style as any,
          footerStyle: configData.footer_style as any,
          scrollbarStyle: configData.scrollbar_style as any,
          primaryColor: configData.primary_color,
          logoUrl: configData.logo_url,
          logoHeight: configData.logo_height
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Actions ---

  const addProduct = async (product: Product) => {
    setProducts(prev => [product, ...prev]);
    const dbProduct = {
      id: product.id,
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

  const addPage = async (page: Page) => {
    setPages(prev => [...prev, page]);
    await supabase.from('pages').insert({
      id: page.id,
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
    await supabase.from('media_assets').insert(asset);
  };

  const deleteAsset = async (assetId: string) => {
    setMediaAssets(prev => prev.filter(a => a.id !== assetId));
    await supabase.from('media_assets').delete().eq('id', assetId);
  };

  const addCampaign = async (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
    const dbCampaign = {
      id: campaign.id,
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
    const dbConfig = {
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
      updated_at: new Date().toISOString()
    };
    await supabase.from('store_config').update(dbConfig).eq('id', 1);
  };

  return (
    <DataContext.Provider value={{
      products, pages, mediaAssets, campaigns, storeConfig, loading, refreshData: fetchAllData,
      addProduct, addPage, updatePage, deletePage, addAsset, deleteAsset, addCampaign, updateCampaign, deleteCampaign, updateConfig
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
