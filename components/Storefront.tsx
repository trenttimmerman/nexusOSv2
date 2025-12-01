
import React, { useState } from 'react';
import { StorefrontProps, Product, PageBlock, HeroStyleId, ProductCardStyleId } from '../types';
import { HEADER_COMPONENTS } from './HeaderLibrary';
import { HERO_COMPONENTS } from './HeroLibrary';
import { PRODUCT_CARD_COMPONENTS } from './ProductCardLibrary';
import { FOOTER_COMPONENTS } from './FooterLibrary';
import { Plus } from 'lucide-react';

export const Storefront: React.FC<StorefrontProps> = ({ config, products, pages, activePageId, onNavigate, previewBlock, activeBlockId, onUpdateBlock }) => {
  const [cart, setCart] = useState<Product[]>([]);
  
  const HeaderComponent = HEADER_COMPONENTS[config.headerStyle];
  // Hero, Card, Footer components are now determined dynamically in renderBlock to allow for variants
  const FooterComponent = FOOTER_COMPONENTS[config.footerStyle];

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const isSidebar = config.headerStyle === 'studio';

  // Map Pages to NavLinks
  const navLinks = pages.map(p => ({
    label: p.title,
    href: '#', 
    active: p.id === activePageId,
  }));

  // Render System Product Grid
  const renderProductGrid = (variant?: string, data?: any) => {
    const styleId = (variant as ProductCardStyleId) || config.productCardStyle;
    const CardComponent = PRODUCT_CARD_COMPONENTS[styleId] || PRODUCT_CARD_COMPONENTS[config.productCardStyle];
    const heading = data?.heading || "Latest Drops.";
    const subheading = data?.subheading || "Curated essentials for the modern digital nomad.";

    return (
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">{heading}</h2>
            <p className="text-neutral-500">{subheading}</p>
          </div>
          <a href="#" className="text-sm font-bold underline underline-offset-4">View All</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <CardComponent 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart} 
              primaryColor={config.primaryColor}
            />
          ))}
        </div>
      </section>
    );
  };

  // Dynamic Block Renderer
  const renderBlock = (block: PageBlock) => {
    const isEditable = activeBlockId === block.id;

    switch (block.type) {
      case 'system-hero':
        const heroStyle = (block.variant as HeroStyleId) || config.heroStyle;
        const HeroComponent = HERO_COMPONENTS[heroStyle] || HERO_COMPONENTS[config.heroStyle];
        return HeroComponent ? (
            <HeroComponent 
                key={block.id} 
                storeName={config.name} 
                primaryColor={config.primaryColor} 
                data={block.data} 
                isEditable={isEditable}
                onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
            />
        ) : null;
      case 'system-grid':
        return <div key={block.id}>{renderProductGrid(block.variant, block.data)}</div>;
      case 'section':
      default:
        return (
          <div 
            key={block.id} 
            dangerouslySetInnerHTML={{ __html: block.content }} 
            className="w-full prose prose-xl prose-neutral max-w-none text-neutral-600 font-serif leading-relaxed prose-img:rounded-2xl prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight" 
          />
        );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white selection:bg-black selection:text-white ${isSidebar ? 'md:pl-64' : ''}`}>
      <HeaderComponent 
        storeName={config.name} 
        logoUrl={config.logoUrl}
        logoHeight={config.logoHeight}
        links={navLinks} 
        cartCount={cart.length}
      />
      
      <main className="flex-1">
        {activePage.blocks && activePage.blocks.length > 0 ? (
          // Render All Blocks (Including System Components)
          <div className={`${activePage.type === 'custom' ? 'max-w-7xl mx-auto' : 'w-full'}`}>
             {activePage.type === 'custom' && (
                <div className="max-w-4xl mx-auto pt-24 px-6 mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-4">Page / {activePage.slug}</span>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900">{activePage.title}</h1>
                </div>
             )}
             
             {activePage.type === 'custom' ? (
                 <div className="max-w-4xl mx-auto px-6 pb-24">
                    {activePage.blocks.map(renderBlock)}
                    {previewBlock && (
                      <div className="border-2 border-blue-500 rounded-xl relative overflow-hidden animate-pulse">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 z-50">PREVIEW</div>
                        {renderBlock(previewBlock)}
                      </div>
                    )}
                 </div>
             ) : (
                 <div className="w-full">
                    {activePage.blocks.map(renderBlock)}
                    {previewBlock && (
                      <div className="border-2 border-blue-500 relative overflow-hidden animate-pulse">
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 z-50">PREVIEW</div>
                        {renderBlock(previewBlock)}
                      </div>
                    )}
                 </div>
             )}
          </div>
        ) : (
          // Empty State Placeholder
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-12 text-center bg-neutral-50/50 m-6 rounded-2xl border-2 border-dashed border-neutral-200">
             <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-6 shadow-sm">
                <Plus size={32} />
             </div>
             <h3 className="text-xl font-bold text-neutral-900 mb-2">Start Building</h3>
             <p className="text-neutral-500 max-w-xs mx-auto mb-6">This page is currently empty. Add your first section from the sidebar to bring it to life.</p>
             {previewBlock && (
                <div className="w-full max-w-4xl mx-auto border-2 border-blue-500 relative overflow-hidden animate-pulse bg-white rounded-lg shadow-xl">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 z-50">PREVIEW</div>
                  {renderBlock(previewBlock)}
                </div>
             )}
          </div>
        )}
      </main>

      <FooterComponent storeName={config.name} primaryColor={config.primaryColor} />
    </div>
  );
};
