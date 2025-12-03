
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { MarketingLanding } from './components/MarketingLanding';
import { AdminPanel } from './components/AdminPanel';
import { Storefront } from './components/Storefront';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { AccountPage } from './components/AccountPage';
import { Checkout } from './components/Checkout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import { DataProvider, useData } from './context/DataContext';
import { CartProvider } from './context/CartContext';
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

const DashboardWrapper = () => {
  const [route, setRoute] = React.useState(window.location.hash || '#/dashboard');

  React.useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/dashboard');
    };
    
    if (!window.location.hash) {
        window.location.hash = '#/dashboard';
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return <Dashboard route={route} />;
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
              <Route path="/admin" element={<DashboardWrapper />} />
            </Route>

            {/* Public Storefront (Preview) */}
            <Route path="/store" element={<StorefrontWrapper />} />
            <Route path="/store/pages/:slug" element={<StorefrontWrapper />} />
            <Route path="/store/products/:productSlug" element={<StorefrontWrapper />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<AccountPage />} />
            
            {/* Admin Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </DataProvider>
  );
}

