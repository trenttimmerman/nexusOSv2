
import React, { useState } from 'react';
import { StorefrontProps, Product, PageBlock, HeroStyleId, ProductCardStyleId } from '../types';
import { HEADER_COMPONENTS } from './HeaderLibrary';
import { HERO_COMPONENTS, HERO_OPTIONS, EditableText, EditableImage, HERO_FIELDS } from './HeroLibrary';
import { PRODUCT_CARD_COMPONENTS, PRODUCT_CARD_OPTIONS } from './ProductCardLibrary';
import { PRODUCT_PAGE_COMPONENTS } from './ProductPageLibrary';
import { FOOTER_COMPONENTS } from './FooterLibrary';
import { SCROLL_COMPONENTS, SCROLL_OPTIONS } from './ScrollLibrary';
import { SOCIAL_COMPONENTS, SOCIAL_OPTIONS } from './SocialLibrary';
import { RICH_TEXT_COMPONENTS, EMAIL_SIGNUP_COMPONENTS, COLLAPSIBLE_COMPONENTS, LOGO_LIST_COMPONENTS, PROMO_BANNER_COMPONENTS } from './SectionLibrary';
import { GALLERY_COMPONENTS } from './GalleryLibrary';
import { BLOG_COMPONENTS } from './BlogLibrary';
import { VIDEO_COMPONENTS } from './VideoLibrary';
import { CONTACT_COMPONENTS } from './ContactLibrary';
import { LAYOUT_COMPONENTS } from './LayoutLibrary';
import { COLLECTION_COMPONENTS } from './CollectionLibrary';
import { SectionWrapper } from './SectionWrapper';
import { Plus, ArrowUp, ArrowDown, Trash2, Copy, Layout, Settings, AlignLeft, AlignCenter, AlignRight, Palette, Maximize2, Minimize2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';

export const Storefront: React.FC<StorefrontProps> = ({ config, products, pages, activePageId, activeProductSlug, onNavigate, previewBlock, activeBlockId, onUpdateBlock, onEditBlock, onMoveBlock, onDeleteBlock, onDuplicateBlock, showCartDrawer = true }) => {
  const { addToCart, cartCount, setIsCartOpen } = useCart();

  const HeaderComponent = HEADER_COMPONENTS[config.headerStyle] || HEADER_COMPONENTS['canvas'];
  // Hero, Card, Footer components are now determined dynamically in renderBlock to allow for variants
  const FooterComponent = FOOTER_COMPONENTS[config.footerStyle] || FOOTER_COMPONENTS['columns'];

  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const isSidebar = config.headerStyle === 'studio';

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
    const isEditable = !!onUpdateBlock;

    const renderContent = () => {
      switch (block.type) {
        case 'system-hero':
          const heroStyle = (block.variant as HeroStyleId) || config.heroStyle || 'impact';
          const HeroComponent = HERO_COMPONENTS[heroStyle] || HERO_COMPONENTS['impact'];
          return HeroComponent ? (
            <HeroComponent
              key={block.id}
              storeName={config.name}
              primaryColor={config.primaryColor}
              data={block.data}
              isEditable={isEditable}
              onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
              blockId={block.id}
            />
          ) : null;
        case 'system-grid':
          return renderProductGrid(block.variant, block.data, block.id, isEditable);
        case 'system-scroll':
          const ScrollComponent = SCROLL_COMPONENTS[block.variant || 'logo-marquee'];
          return ScrollComponent ? (
            <ScrollComponent 
              data={block.data} 
              isEditable={isEditable}
              onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
            />
          ) : null;
        case 'system-social':
          const SocialComponent = SOCIAL_COMPONENTS[block.variant || 'grid-classic'];
          return SocialComponent ? (
            <SocialComponent 
              storeName={config.name}
              primaryColor={config.primaryColor}
              data={block.data} 
              isEditable={isEditable}
              onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
            />
          ) : null;
        case 'system-rich-text':
          const RichTextComponent = RICH_TEXT_COMPONENTS[block.variant || 'rt-centered'];
          return RichTextComponent ? (
            <RichTextComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-email':
          const EmailComponent = EMAIL_SIGNUP_COMPONENTS[block.variant || 'email-minimal'];
          return EmailComponent ? (
            <EmailComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-collapsible':
          const CollapsibleComponent = COLLAPSIBLE_COMPONENTS[block.variant || 'col-simple'];
          return CollapsibleComponent ? (
            <CollapsibleComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-logo-list':
          const LogoListComponent = LOGO_LIST_COMPONENTS[block.variant || 'logo-grid'];
          return LogoListComponent ? (
            <LogoListComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-promo':
          const PromoComponent = PROMO_BANNER_COMPONENTS[block.variant || 'promo-top'];
          return PromoComponent ? (
            <PromoComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-gallery':
          const GalleryComponent = GALLERY_COMPONENTS[block.variant || 'gal-grid'];
          return GalleryComponent ? (
            <GalleryComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-blog':
          const BlogComponent = BLOG_COMPONENTS[block.variant || 'blog-grid'];
          return BlogComponent ? (
            <BlogComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-video':
          const VideoComponent = VIDEO_COMPONENTS[block.variant || 'vid-full'];
          return VideoComponent ? (
            <VideoComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-contact':
          const ContactComponent = CONTACT_COMPONENTS[block.variant || 'contact-simple'];
          return ContactComponent ? (
            <ContactComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-layout':
          const LayoutComponent = LAYOUT_COMPONENTS[block.variant || 'layout-image-text'];
          return LayoutComponent ? (
            <LayoutComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'system-collection':
          const CollectionComponent = COLLECTION_COMPONENTS[block.variant || 'collection-list'];
          return CollectionComponent ? (
            <CollectionComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
          ) : null;
        case 'section':
        default:
          return (
            <div
              dangerouslySetInnerHTML={{ __html: block.content }}
              className="w-full prose prose-xl prose-neutral max-w-none text-neutral-600 font-serif leading-relaxed prose-img:rounded-2xl prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight"
            />
          );
      }
    };

    if (!isEditable) {
      return <div key={block.id}>{renderContent()}</div>;
    }

    return (
      <SectionWrapper
        key={block.id}
        blockId={block.id}
        isSelected={activeBlockId === block.id}
        onSelect={() => onEditBlock && onEditBlock(block.id)}
        onMoveUp={() => onMoveBlock && onMoveBlock(block.id, 'up')}
        onMoveDown={() => onMoveBlock && onMoveBlock(block.id, 'down')}
        onDelete={() => onDeleteBlock && onDeleteBlock(block.id)}
        onDuplicate={() => onDuplicateBlock && onDuplicateBlock(block.id)}
      >
        {renderContent()}
      </SectionWrapper>
    );
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
