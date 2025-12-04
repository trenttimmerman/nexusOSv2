
import React, { useState, useEffect } from 'react';
import { StorefrontProps, Product, PageBlock, HeroStyleId, ProductCardStyleId } from '../types';
import { HEADER_COMPONENTS } from './HeaderLibrary';
import { HERO_COMPONENTS, HERO_OPTIONS, EditableText, EditableImage, HERO_FIELDS } from './HeroLibrary';
import { PRODUCT_CARD_COMPONENTS, PRODUCT_CARD_OPTIONS } from './ProductCardLibrary';
import { PRODUCT_PAGE_COMPONENTS } from './ProductPageLibrary';
import { FOOTER_COMPONENTS } from './FooterLibrary';
import { SCROLL_COMPONENTS, SCROLL_OPTIONS } from './ScrollLibrary';
import { Plus, ArrowUp, ArrowDown, Trash2, Copy, Layout, Settings, AlignLeft, AlignCenter, AlignRight, Palette, Maximize2, Minimize2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';

export const Storefront: React.FC<StorefrontProps> = ({ config, products, pages, activePageId, activeProductSlug, onNavigate, previewBlock, activeBlockId, onUpdateBlock, onEditBlock, onMoveBlock, onDeleteBlock, onDuplicateBlock, showCartDrawer = true }) => {
  const { addToCart, cartCount, setIsCartOpen } = useCart();

  // Scroll to active block when selected
  useEffect(() => {
    if (activeBlockId) {
      const element = document.getElementById(`block-${activeBlockId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeBlockId]);

  const HeaderComponent = HEADER_COMPONENTS[config.headerStyle] || HEADER_COMPONENTS['canvas'];
  // Hero, Card, Footer components are now determined dynamically in renderBlock to allow for variants
  const FooterComponent = FOOTER_COMPONENTS[config.footerStyle] || FOOTER_COMPONENTS['columns'];

  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const isSidebar = config.headerStyle === 'studio';

  const getBlockStyles = (data: any) => {
    const style: React.CSSProperties = {};
    if (data?._paddingTop !== undefined) style.paddingTop = `${data._paddingTop}px`;
    if (data?._paddingBottom !== undefined) style.paddingBottom = `${data._paddingBottom}px`;
    if (data?._backgroundColor) style.backgroundColor = data._backgroundColor;
    if (data?._animationDuration) style.animationDuration = `${data._animationDuration}s`;
    return style;
  };

  const getAnimationClass = (anim: string) => {
    switch (anim) {
      case 'fade-in': return 'animate-in fade-in fill-mode-forwards';
      case 'slide-up': return 'animate-in slide-in-from-bottom-8 fade-in fill-mode-forwards';
      case 'slide-in-right': return 'animate-in slide-in-from-right-8 fade-in fill-mode-forwards';
      case 'zoom-in': return 'animate-in zoom-in fade-in fill-mode-forwards';
      default: return '';
    }
  };

  // Map Pages to NavLinks
  const navLinks = pages.map(p => {
    let href = '/';
    if (p.type !== 'home') {
      const cleanSlug = p.slug.startsWith('/') ? p.slug.substring(1) : p.slug;
      href = `/pages/${cleanSlug}`;
    }
    
    return {
      label: p.title,
      href,
      active: p.id === activePageId,
    };
  });

  // If activeProductSlug is present, render Product Page
  if (activeProductSlug) {
      const product = products.find(p => p.seo.slug === activeProductSlug || p.id === activeProductSlug);
      if (product) {
          const ProductComponent = PRODUCT_PAGE_COMPONENTS[product.template || 'standard'] || PRODUCT_PAGE_COMPONENTS['standard'];
          return (
              <div className={`min-h-screen flex flex-col bg-white selection:bg-black selection:text-white ${isSidebar ? 'md:pl-64' : ''}`}>
                  <HeaderComponent
                      storeName={config.name}
                      logoUrl={config.logoUrl}
                      logoHeight={config.logoHeight}
                      links={navLinks}
                      cartCount={cartCount}
                      onOpenCart={() => setIsCartOpen(true)}
                  />
                  <main className="flex-1">
                      <ProductComponent product={product} onAddToCart={addToCart} />
                  </main>
                  <FooterComponent storeName={config.name} primaryColor={config.primaryColor} />
                  {showCartDrawer && <CartDrawer />}
              </div>
          );
      }
  }

  // Render System Product Grid
  const renderProductGrid = (variant?: string, data?: any, blockId?: string, isEditable?: boolean) => {
    const styleId = (variant as ProductCardStyleId) || config.productCardStyle || 'classic';
    const CardComponent = PRODUCT_CARD_COMPONENTS[styleId] || PRODUCT_CARD_COMPONENTS['classic'];
    const heading = data?.heading || "Latest Drops.";
    const subheading = data?.subheading || "Curated essentials for the modern digital nomad.";

    return (
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">
               <EditableText 
                 tagName="span" 
                 value={heading} 
                 onChange={(val) => onUpdateBlock && blockId && onUpdateBlock(blockId, { heading: val })} 
                 onStyleChange={(style) => onUpdateBlock && blockId && onUpdateBlock(blockId, { heading_style: style })}
                 style={data?.heading_style}
                 isEditable={isEditable} 
               />
            </h2>
            <p className="text-neutral-500">
               <EditableText 
                 tagName="span" 
                 value={subheading} 
                 onChange={(val) => onUpdateBlock && blockId && onUpdateBlock(blockId, { subheading: val })} 
                 onStyleChange={(style) => onUpdateBlock && blockId && onUpdateBlock(blockId, { subheading_style: style })}
                 style={data?.subheading_style}
                 isEditable={isEditable} 
               />
            </p>
          </div>
          <a href="#" className="text-sm font-bold underline underline-offset-4">View All</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => (
            <CardComponent
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onNavigate={() => onNavigate && onNavigate(`/store/products/${product.seo.slug || product.id}`)}
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

    const handleCycleVariant = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!onUpdateBlock) return;

      let options: { id: string }[] = [];
      if (block.type === 'system-hero') options = HERO_OPTIONS;
      else if (block.type === 'system-grid') options = PRODUCT_CARD_OPTIONS;
      else if (block.type === 'system-scroll') options = SCROLL_OPTIONS;

      if (options.length > 0) {
        const currentIndex = options.findIndex(o => o.id === block.variant);
        const nextIndex = (currentIndex + 1) % options.length;
        onUpdateBlock(block.id, { variant: options[nextIndex].id });
      }
    };

    const BlockToolbar = () => (
      <div className="absolute -top-12 right-0 flex flex-col items-end z-[100]">
        <div className="flex items-center gap-1 bg-black text-white rounded-lg shadow-xl p-1 animate-in fade-in slide-in-from-bottom-2">
        {(block.type === 'system-hero' || block.type === 'system-grid' || block.type === 'system-scroll') && (
          <>
            <button 
              onClick={handleCycleVariant}
              className="p-2 hover:bg-white/20 rounded transition-colors flex items-center gap-2 px-3"
              title="Switch Layout"
            >
              <Layout size={14} />
              <span className="text-xs font-bold">Switch Layout</span>
            </button>
            <div className="w-px h-4 bg-white/20 mx-1" />
          </>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onMoveBlock && onMoveBlock(block.id, 'up'); }}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Move Up"
        >
          <ArrowUp size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onMoveBlock && onMoveBlock(block.id, 'down'); }}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Move Down"
        >
          <ArrowDown size={14} />
        </button>
        <div className="w-px h-4 bg-white/20 mx-1" />
        <button 
          onClick={(e) => { e.stopPropagation(); onDuplicateBlock && onDuplicateBlock(block.id); }}
          className="p-2 hover:bg-white/20 rounded transition-colors"
          title="Duplicate Section"
        >
          <Copy size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDeleteBlock && onDeleteBlock(block.id); }}
          className="p-2 hover:bg-red-500/50 rounded transition-colors text-red-200 hover:text-white"
          title="Delete Section"
        >
          <Trash2 size={14} />
        </button>
        </div>
      </div>
    );

    switch (block.type) {
      case 'system-hero':
        const heroStyle = (block.variant as HeroStyleId) || config.heroStyle || 'impact';
        const HeroComponent = HERO_COMPONENTS[heroStyle] || HERO_COMPONENTS['impact'];
        return HeroComponent ? (
          <div 
            id={`block-${block.id}`}
            className={`relative group ${isEditable ? 'ring-2 ring-blue-500 ring-offset-2 z-10' : ''} ${getAnimationClass(block.data?._animation)}`}
            style={getBlockStyles(block.data)}
            onClick={(e) => {
              if (onEditBlock) {
                e.stopPropagation();
                onEditBlock(block.id);
              }
            }}
          >
            {isEditable && <BlockToolbar />}
            <HeroComponent
              key={block.id}
              storeName={config.name}
              primaryColor={config.primaryColor}
              data={block.data}
              isEditable={isEditable}
              onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
              blockId={block.id}
            />
          </div>
        ) : null;
      case 'system-grid':
        return (
          <div 
            key={block.id}
            id={`block-${block.id}`}
            className={`relative group ${isEditable ? 'ring-2 ring-blue-500 ring-offset-2 z-10' : ''} ${getAnimationClass(block.data?._animation)}`}
            style={getBlockStyles(block.data)}
            onClick={(e) => {
              if (onEditBlock) {
                e.stopPropagation();
                onEditBlock(block.id);
              }
            }}
          >
            {isEditable && <BlockToolbar />}
            {renderProductGrid(block.variant, block.data, block.id, isEditable)}
          </div>
        );
      case 'system-scroll':
        const ScrollComponent = SCROLL_COMPONENTS[block.variant || 'logo-marquee'];
        return ScrollComponent ? (
          <div 
            key={block.id}
            id={`block-${block.id}`}
            className={`relative group ${isEditable ? 'ring-2 ring-blue-500 ring-offset-2 z-10' : ''} ${getAnimationClass(block.data?._animation)}`}
            style={getBlockStyles(block.data)}
            onClick={(e) => {
              if (onEditBlock) {
                e.stopPropagation();
                onEditBlock(block.id);
              }
            }}
          >
            {isEditable && <BlockToolbar />}
            <ScrollComponent 
              data={block.data} 
              isEditable={isEditable}
              onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
            />
          </div>
        ) : null;
      case 'section':
      default:
        return (
          <div
            key={block.id}
            id={`block-${block.id}`}
            className={`relative group ${isEditable ? 'ring-2 ring-blue-500 ring-offset-2 z-10' : ''} ${getAnimationClass(block.data?._animation)}`}
            style={getBlockStyles(block.data)}
            onClick={(e) => {
              if (onEditBlock) {
                e.stopPropagation();
                onEditBlock(block.id);
              }
            }}
          >
            {isEditable && <BlockToolbar />}
            <div
              dangerouslySetInnerHTML={{ __html: block.content }}
              className="w-full prose prose-xl prose-neutral max-w-none text-neutral-600 font-serif leading-relaxed prose-img:rounded-2xl prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight"
            />
          </div>
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
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
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
      {showCartDrawer && <CartDrawer />}
    </div>
  );
};
