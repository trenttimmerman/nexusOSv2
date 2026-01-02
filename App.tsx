
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { MarketingLanding } from './components/MarketingLanding';
import { AdminPanel } from './components/AdminPanel';
import { Storefront } from './components/Storefront';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { OnboardingWizard } from './components/OnboardingWizard';
import { SimpleWizard } from './components/SimpleWizard';
import { AccountPage } from './components/AccountPage';
import { Checkout } from './components/Checkout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DataProvider, useData } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { supabase } from './lib/supabaseClient';
import { Loader2 } from 'lucide-react';
import { ViewMode, AdminTab } from './types';

// Wrapper to inject data into Storefront
const StorefrontWrapper = () => {
  const { storeConfig, products, pages, loading } = useData(); 
  const { slug, productSlug } = useParams();
  const navigate = useNavigate();
  
  if (loading) return <LoadingScreen />;

  // Resolve Active Page ID from URL Slug
  let activePageId = 'home';
  if (slug) {
    // Try to find page by slug (handling both with and without leading slash)
    const foundPage = pages.find(p => 
      p.slug === slug || 
      p.slug === `/${slug}` || 
      p.slug === slug.replace(/^\//, '')
    );
    if (foundPage) {
      activePageId = foundPage.id;
    }
  }

  return (
    <Storefront
      config={storeConfig || {}}
      products={products || []}
      pages={pages || []}
      activePageId={activePageId}
      activeProductSlug={productSlug}
      onNavigate={(path) => {
        // Handle relative paths - prepend /store for this wrapper
        if (path === '/') {
          navigate('/store');
        } else if (path.startsWith('/products/')) {
          navigate(`/store${path}`);
        } else if (path.startsWith('/pages/')) {
          navigate(`/store${path}`);
        } else {
          navigate(path);
        }
      }}
    />
  );
};


// Public Store Wrapper - loads store by slug for public viewing
const PublicStoreWrapper = () => {
  const { storeSlug, slug, productSlug } = useParams();
  const navigate = useNavigate();
  const [storeData, setStoreData] = React.useState<any>(null);
  const [products, setProducts] = React.useState<any[]>([]);
  const [pages, setPages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadStore = async () => {
      try {
        // Look up store by slug
        const { data: store, error: storeError } = await supabase
          .from('stores').select('*').eq('slug', storeSlug).single();
        
        if (storeError || !store) {
          setError('Store not found');
          setLoading(false);
          return;
        }

        // Load store_config (this has the wizard design settings)
        const { data: storeConfig } = await supabase
          .from('store_config').select('*').eq('store_id', store.id).single();

        // Load products
        const { data: productsData } = await supabase
          .from('products').select('*').eq('store_id', store.id);
        
        // Load pages - order by display_order for navigation
        const { data: pagesData } = await supabase
          .from('pages').select('*').eq('store_id', store.id).order('display_order');

        console.log('[PublicStore] Loaded store:', { storeSlug, storeId: store.id, pagesCount: pagesData?.length });
        
        // Default home page blocks for new/empty stores
        const defaultHomeBlocks = [
          {
            id: 'default-hero',
            type: 'system-hero',
            name: 'Hero',
            variant: storeConfig?.hero_style || 'impact',
            content: '',
            data: {
              heading: `Welcome to ${storeConfig?.name || store.name || 'Our Store'}`,
              subheading: 'Discover our collection of amazing products.',
              buttonText: 'Shop Now',
              buttonLink: '/shop',
              image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop'
            }
          },
          {
            id: 'default-products',
            type: 'system-grid',
            name: 'Featured Products',
            variant: storeConfig?.product_card_style || 'classic',
            content: '',
            data: {
              heading: 'Featured Products',
              subheading: 'Check out our latest arrivals',
              productSource: 'all',
              limit: 8,
              columns: '4'
            }
          }
        ];
        
        // Ensure blocks is always an array (handle null/undefined from DB)
        // If a page has no blocks, provide defaults for home page
        const normalizedPages = (pagesData || []).map(p => {
          const blocks = Array.isArray(p.blocks) ? p.blocks : [];
          // If home page has no blocks, use defaults
          if ((p.type === 'home' || p.slug === '/') && blocks.length === 0) {
            return { ...p, blocks: defaultHomeBlocks };
          }
          return { ...p, blocks };
        });

        // Build store config - prioritize store_config table, fallback to stores.settings
        const config = {
          name: storeConfig?.name || store.name || 'Store',
          currency: storeConfig?.currency || store.settings?.currency || 'USD',
          headerStyle: storeConfig?.header_style || store.settings?.headerStyle || 'canvas',
          headerData: storeConfig?.header_data || store.settings?.headerData || {},
          heroStyle: storeConfig?.hero_style || store.settings?.heroStyle || 'impact',
          productCardStyle: storeConfig?.product_card_style || store.settings?.productCardStyle || 'classic',
          footerStyle: storeConfig?.footer_style || store.settings?.footerStyle || 'columns',
          scrollbarStyle: storeConfig?.scrollbar_style || store.settings?.scrollbarStyle || 'native',
          primaryColor: storeConfig?.primary_color || store.settings?.primary_color || '#6366F1',
          secondaryColor: storeConfig?.secondary_color || store.settings?.secondary_color || '#8B5CF6',
          backgroundColor: storeConfig?.background_color || store.settings?.background_color || '#FFFFFF',
          storeType: storeConfig?.store_type || store.settings?.store_type,
          storeVibe: storeConfig?.store_vibe || store.settings?.store_vibe || 'minimal',
          colorPalette: storeConfig?.color_palette || store.settings?.color_palette,
          logoUrl: storeConfig?.logo_url || store.settings?.logoUrl || '',
          logoHeight: storeConfig?.logo_height || store.settings?.logoHeight || 32,
        };

        setStoreData(config);
        setProducts(productsData || []);
        
        // If no pages at all, create a default home page with blocks
        const finalPages = normalizedPages.length ? normalizedPages : [
          { id: 'default-home', title: 'Home', slug: '/', type: 'home', blocks: defaultHomeBlocks }
        ];
        setPages(finalPages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading store:', err);
        setError('Failed to load store');
        setLoading(false);
      }
    };

    if (storeSlug) loadStore();
  }, [storeSlug]);

  if (loading) return <LoadingScreen />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Store Not Found</h1>
          <p className="text-gray-400 mb-4">The store "{storeSlug}" doesn't exist or is not available.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Resolve Active Page ID from URL Slug
  // Default to the home page's actual ID (not the literal 'home')
  const homePage = pages.find(p => p.type === 'home' || p.slug === '/');
  let activePageId = homePage?.id || 'home';
  
  if (slug) {
    const foundPage = pages.find(p => 
      p.slug === slug || 
      p.slug === `/${slug}` || 
      p.slug === slug.replace(/^\//, '')
    );
    if (foundPage) activePageId = foundPage.id;
  }
  
  console.log('[PublicStore] Active page resolved:', { activePageId, slug, homePageId: homePage?.id });

  return (
    <Storefront
      config={storeData || {}}
      products={products || []}
      pages={pages || []}
      activePageId={activePageId}
      activeProductSlug={productSlug}
      onNavigate={(path) => {
        // Handle relative paths - prepend /s/:storeSlug for public stores
        if (path === '/') {
          navigate(`/s/${storeSlug}`);
        } else if (path.startsWith('/products/')) {
          navigate(`/s/${storeSlug}${path}`);
        } else if (path.startsWith('/pages/')) {
          navigate(`/s/${storeSlug}${path}`);
        } else {
          navigate(`/s/${storeSlug}${path}`);
        }
      }}
    />
  );
};


// Wrapper for Admin
const AdminWrapper = () => {
  const { 
    storeConfig, products, pages, mediaAssets, campaigns, categories, collections, loading,
    updateConfig, addProduct, deleteProduct, addPage, updatePage, deletePage, 
    addAsset, deleteAsset, addCampaign, updateCampaign, deleteCampaign,
    signOut, userRole, switchStore, storeId
  } = useData();

  const [activeTab, setActiveTab] = React.useState<AdminTab>(AdminTab.DASHBOARD);
  const [activePageId, setActivePageId] = React.useState('home');

  // Sync activePageId with actual home page ID if it's still 'home'
  React.useEffect(() => {
    console.log('[AdminWrapper] Syncing activePageId:', { activePageId, pagesCount: pages?.length, pageIds: pages?.map(p => p.id) });
    if (activePageId === 'home' && pages && pages.length > 0) {
      const homePage = pages.find(p => p.type === 'home');
      if (homePage && homePage.id !== 'home') {
        console.log('[AdminWrapper] Updating activePageId from "home" to:', homePage.id);
        setActivePageId(homePage.id);
      }
    }
  }, [pages, activePageId]);

  if (loading) return <LoadingScreen />;

  return (
    <AdminPanel
      activeTab={activeTab}
      onTabChange={setActiveTab}
      config={storeConfig}
      onConfigChange={updateConfig}
      products={products}
      onAddProduct={addProduct}
      onDeleteProduct={deleteProduct}
      pages={pages}
      activePageId={activePageId}
      onAddPage={addPage}
      onUpdatePage={updatePage}
      onSetActivePage={setActivePageId}
      onDeletePage={deletePage}
      mediaAssets={mediaAssets}
      onAddAsset={addAsset}
      onDeleteAsset={deleteAsset}
      campaigns={campaigns}
      onAddCampaign={addCampaign}
      onUpdateCampaign={updateCampaign}
      onDeleteCampaign={deleteCampaign}
      onLogout={signOut}
      userRole={userRole}
      storeId={storeId}
      onSwitchStore={switchStore}
      categories={categories}
      collections={collections}
    />
  );
};

const LoadingScreen = () => (
  <div className="w-full h-screen flex items-center justify-center bg-neutral-900 text-white">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="animate-spin" size={48} />
      <p className="text-neutral-400 font-mono text-sm">INITIALIZING NEXUS OS...</p>
    </div>
  </div>
);

export default function App() {
  // Use the base URL defined in vite.config.ts (handles both local and GH Pages)
  const basename = import.meta.env.BASE_URL;

  return (
    <DataProvider>
      <CartProvider>
        <BrowserRouter basename={basename}>
          <Routes>
            {/* Public Marketing Site */}
            <Route path="/" element={<MarketingLanding />} />

            {/* Core Application (Admin Panel) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminWrapper />} />
            </Route>

            {/* Public Storefront (Preview) - User's own store */}
            <Route path="/store" element={<StorefrontWrapper />} />
            <Route path="/store/pages/:slug" element={<StorefrontWrapper />} />
            <Route path="/store/products/:productSlug" element={<StorefrontWrapper />} />
            
            {/* Public Store by Slug - for sharing/preview */}
            <Route path="/s/:storeSlug" element={<PublicStoreWrapper />} />
            <Route path="/s/:storeSlug/pages/:slug" element={<PublicStoreWrapper />} />
            <Route path="/s/:storeSlug/products/:productSlug" element={<PublicStoreWrapper />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<AccountPage />} />
            
            {/* Admin Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/onboarding" element={<OnboardingWizard />} />
            <Route path="/start" element={<SimpleWizard />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </DataProvider>
  );
}

