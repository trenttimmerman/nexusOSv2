
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { MarketingLanding } from './components/MarketingLanding';
import { AdminPanel } from './components/AdminPanel';
import { Storefront } from './components/Storefront';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { OnboardingWizard } from './components/OnboardingWizard';
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
      onNavigate={(path) => navigate(path)}
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

        // Load products
        const { data: productsData } = await supabase
          .from('products').select('*').eq('store_id', store.id);
        
        // Load pages
        const { data: pagesData } = await supabase
          .from('pages').select('*').eq('store_id', store.id);

        // Build store config from store data
        const config = {
          name: store.name || 'Store',
          currency: store.settings?.currency || 'USD',
          headerStyle: store.settings?.headerStyle || 'canvas',
          heroStyle: store.settings?.heroStyle || 'impact',
          productCardStyle: store.settings?.productCardStyle || 'classic',
          footerStyle: store.settings?.footerStyle || 'columns',
          scrollbarStyle: store.settings?.scrollbarStyle || 'native',
          primaryColor: store.settings?.primaryColor || '#3b82f6',
          logoUrl: store.settings?.logoUrl || '',
          logoHeight: store.settings?.logoHeight || 32,
        };

        setStoreData(config);
        setProducts(productsData || []);
        setPages(pagesData?.length ? pagesData : [
          { id: 'home', title: 'Home', slug: '/', type: 'home', blocks: [] }
        ]);
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
  let activePageId = 'home';
  if (slug) {
    const foundPage = pages.find(p => 
      p.slug === slug || 
      p.slug === `/${slug}` || 
      p.slug === slug.replace(/^\//, '')
    );
    if (foundPage) activePageId = foundPage.id;
  }

  return (
    <Storefront
      config={storeData || {}}
      products={products || []}
      pages={pages || []}
      activePageId={activePageId}
      activeProductSlug={productSlug}
      onNavigate={(path) => navigate(`/s/${storeSlug}${path}`)}
    />
  );
};


// Wrapper for Admin
const AdminWrapper = () => {
  const { 
    storeConfig, products, pages, mediaAssets, campaigns, loading,
    updateConfig, addProduct, addPage, updatePage, deletePage, 
    addAsset, deleteAsset, addCampaign, updateCampaign, deleteCampaign,
    signOut, userRole, switchStore, storeId
  } = useData();

  const [activeTab, setActiveTab] = React.useState<AdminTab>(AdminTab.DASHBOARD);
  const [activePageId, setActivePageId] = React.useState('home');

  if (loading) return <LoadingScreen />;

  return (
    <AdminPanel
      activeTab={activeTab}
      onTabChange={setActiveTab}
      config={storeConfig}
      onConfigChange={updateConfig}
      products={products}
      onAddProduct={addProduct}
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
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </DataProvider>
  );
}

