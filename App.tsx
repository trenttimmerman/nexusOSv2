
import React, { useState } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { Storefront } from './components/Storefront';
import { StoreConfig, ViewMode, AdminTab, Product, Page } from './types';
import { Monitor, LayoutGrid } from 'lucide-react';
import { MOCK_PRODUCTS } from './constants';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.ADMIN);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>(AdminTab.DASHBOARD);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  // Page Management State
  const [pages, setPages] = useState<Page[]>([
    { 
      id: 'home', 
      title: 'Home', 
      slug: '/', 
      type: 'home', 
      content: '', 
      blocks: [] // Start with empty blocks for a blank canvas
    },
    { 
      id: 'about', 
      title: 'About', 
      slug: '/about', 
      type: 'custom', 
      content: '', // Legacy
      blocks: [
        {
          id: 'b1',
          type: 'section',
          name: 'Hero Header',
          content: '<div class="my-12 p-8 bg-neutral-50 rounded-2xl"><h2 class="text-3xl font-bold mb-4">We are Nexus.</h2><p class="text-lg text-neutral-600">Born from the belief that commerce should be fluid, we build tools for the next generation of creators.</p></div>'
        },
        {
          id: 'b2',
          type: 'section',
          name: 'Mission Split',
          content: '<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12"><div class="aspect-video bg-neutral-100 rounded-xl overflow-hidden"><img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000" class="w-full h-full object-cover" /></div><div class="flex flex-col justify-center"><h3 class="text-2xl font-bold mb-2">Our Mission</h3><p class="text-neutral-600">To empower brands to tell their stories without technical limitations. We believe in a future where design is composable and intelligence is accessible.</p></div></div>'
        },
        {
          id: 'b3',
          type: 'section',
          name: 'Brand Quote',
          content: '<blockquote class="border-l-4 border-black pl-6 italic text-2xl my-12 font-serif text-neutral-800">"The future of commerce isn\'t about more features. It\'s about less friction."</blockquote>'
        }
      ]
    },
    { 
      id: 'journal', 
      title: 'Journal', 
      slug: '/journal', 
      type: 'custom', 
      content: '',
      blocks: [
        {
          id: 'j1',
          type: 'section',
          name: 'Article Intro',
          content: "<h3>Latest Drop: The Cyber Shell</h3><p>Exploring the intersection of technical utility and digital aesthetics. Our latest collection challenges the boundaries of what streetwear can be.</p>"
        }
      ]
    }
  ]);
  const [activePageId, setActivePageId] = useState<string>('home');

  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    name: 'EVOLV',
    currency: 'USD',
    headerStyle: 'canvas',
    heroStyle: 'impact',
    productCardStyle: 'classic',
    footerStyle: 'columns',
    primaryColor: '#3b82f6',
    logoUrl: '',
    logoHeight: 32
  });

  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const handleAddPage = (page: Page) => {
    setPages(prev => [...prev, page]);
    setActivePageId(page.id);
  };

  const handleUpdatePage = (pageId: string, updates: Partial<Page>) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ...updates } : p));
  };

  return (
    <div className="relative w-full h-full">
      {viewMode === ViewMode.ADMIN ? (
        <AdminPanel 
          activeTab={activeAdminTab} 
          onTabChange={setActiveAdminTab}
          config={storeConfig}
          onConfigChange={setStoreConfig}
          products={products}
          onAddProduct={handleAddProduct}
          pages={pages}
          activePageId={activePageId}
          onAddPage={handleAddPage}
          onUpdatePage={handleUpdatePage}
          onSetActivePage={setActivePageId}
        />
      ) : (
        <Storefront 
          config={storeConfig} 
          products={products}
          pages={pages}
          activePageId={activePageId}
          onNavigate={setActivePageId}
        />
      )}

      {/* Universal Switcher for Demo Purposes */}
      <div className="fixed bottom-6 left-6 z-[100] flex gap-2 bg-neutral-900 p-1.5 rounded-full border border-neutral-800 shadow-2xl">
        <button
          onClick={() => setViewMode(ViewMode.ADMIN)}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
            viewMode === ViewMode.ADMIN 
              ? 'bg-white text-black shadow-lg' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <LayoutGrid size={14} /> Admin
        </button>
        <button
          onClick={() => setViewMode(ViewMode.STORE)}
          className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
            viewMode === ViewMode.STORE 
              ? 'bg-white text-black shadow-lg' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Monitor size={14} /> Store
        </button>
      </div>
    </div>
  );
}
