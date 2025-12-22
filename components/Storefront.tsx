
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
import { Plus, ArrowUp, ArrowDown, Trash2, Copy, Layout, Settings, AlignLeft, AlignCenter, AlignRight, Palette, Maximize2, Minimize2, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';

export const Storefront: React.FC<StorefrontProps & { onSelectField?: (field: string) => void }> = ({ 
  config, 
  products, 
  pages, 
  activePageId, 
  activeProductSlug, 
  onNavigate, 
  previewBlock, 
  activeBlockId, 
  onUpdateBlock, 
  onEditBlock, 
  onMoveBlock, 
  onDeleteBlock, 
  onDuplicateBlock, 
  onToggleVisibility,
  onToggleLock,
  onSwitchLayout,
  showCartDrawer = true, 
  onSelectField 
}) => {
  const { addToCart, cartCount, setIsCartOpen } = useCart();

  // Extract design settings from config
  const primaryColor = config.primaryColor || '#6366F1';
  const secondaryColor = config.secondaryColor || '#8B5CF6';
  const backgroundColor = config.backgroundColor || '#FFFFFF';
  const storeVibe = config.storeVibe || 'minimal';

  // Generate vibe-based classes
  const getVibeClasses = () => {
    switch (storeVibe) {
      case 'playful':
        return 'font-sans';
      case 'bold':
        return 'font-sans uppercase tracking-wide';
      case 'cozy':
        return 'font-serif';
      case 'luxury':
        return 'font-serif tracking-widest';
      case 'retro':
        return 'font-mono';
      case 'minimal':
      default:
        return 'font-sans';
    }
  };

  // CSS custom properties for design tokens
  const designTokenStyles = {
    '--store-primary': primaryColor,
    '--store-secondary': secondaryColor,
    '--store-background': backgroundColor,
  } as React.CSSProperties;

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
              <div 
                className={`min-h-screen flex flex-col selection:text-white ${isSidebar ? 'md:pl-64' : ''} ${getVibeClasses()}`}
                style={{ ...designTokenStyles, backgroundColor, color: primaryColor }}
              >
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
              onSelectField={onSelectField}
              onEditBlock={onEditBlock}
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
        isHidden={block.hidden}
        isLocked={block.locked}
        onSelect={() => onEditBlock && onEditBlock(block.id)}
        onMoveUp={() => onMoveBlock && onMoveBlock(block.id, 'up')}
        onMoveDown={() => onMoveBlock && onMoveBlock(block.id, 'down')}
        onDelete={() => onDeleteBlock && onDeleteBlock(block.id)}
        onDuplicate={() => onDuplicateBlock && onDuplicateBlock(block.id)}
        onToggleVisibility={() => onToggleVisibility && onToggleVisibility(block.id)}
        onToggleLock={() => onToggleLock && onToggleLock(block.id)}
        onSwitchLayout={() => onSwitchLayout && onSwitchLayout(block.id)}
      >
        {renderContent()}
      </SectionWrapper>
    );
  };

  return (
    <div 
      className={`min-h-screen flex flex-col selection:text-white ${isSidebar ? 'md:pl-64' : ''} ${getVibeClasses()}`}
      style={{ ...designTokenStyles, backgroundColor }}
    >
      <HeaderComponent
        storeName={config.name}
        logoUrl={config.logoUrl}
        logoHeight={config.logoHeight}
        links={navLinks}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
      />

      <main className="flex-1">
        {activePage.blocks && activePage.blocks.length > 0 ? (
          // Render All Blocks (Including System Components)
          // Treat page as home if type is 'home' OR slug is '/' or empty
          (() => {
            const isHomePage = activePage.type === 'home' || activePage.slug === '/' || activePage.slug === '' || activePage.slug === 'home';
            return (
              <div className={`${!isHomePage ? 'max-w-7xl mx-auto' : 'w-full'}`}>
                {/* Page header only for non-home custom pages - no breadcrumb */}
                {!isHomePage && (
                  <div className="max-w-4xl mx-auto pt-24 px-6 mb-8">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900">{activePage.title}</h1>
                  </div>
                )}

                {!isHomePage ? (
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
            );
          })()
        ) : (
          // Empty State - More helpful with quick actions
          <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] p-12 text-center bg-gradient-to-br from-neutral-50 to-neutral-100 m-6 rounded-2xl border-2 border-dashed border-neutral-300">
            <div className="max-w-md mx-auto">
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mx-auto mb-8">
                <Layout size={36} className="text-neutral-400" />
              </div>
              
              {/* Heading */}
              <h3 className="text-2xl font-bold mb-3 text-neutral-900">This Page is Empty</h3>
              <p className="text-neutral-500 mb-8">Add sections to start building your page. Use the sidebar to add a Hero, Products, Contact form, and more.</p>
              
              {/* Quick Add Buttons */}
              <div className="flex flex-wrap gap-3 justify-center mb-8">
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-neutral-200 text-sm font-medium text-neutral-600 flex items-center gap-2">
                  <Plus size={16} style={{ color: primaryColor }} />
                  <span>Click + in sidebar</span>
                </div>
              </div>
              
              {/* Suggested Sections */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-left">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Suggested Sections</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span>🎯</span> Hero Banner
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span>🛍️</span> Product Grid
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span>✨</span> Features
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <span>📧</span> Newsletter
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview block if hovering over a section type */}
            {previewBlock && (
              <div className="w-full max-w-4xl mx-auto mt-8 border-2 relative overflow-hidden animate-pulse rounded-lg shadow-xl" style={{ borderColor: primaryColor, backgroundColor }}>
                <div className="text-white text-[10px] font-bold px-2 py-1 z-50 absolute top-0 right-0" style={{ backgroundColor: primaryColor }}>PREVIEW</div>
                {renderBlock(previewBlock)}
              </div>
            )}
          </div>
        )}
      </main>

      <FooterComponent storeName={config.name} primaryColor={primaryColor} secondaryColor={secondaryColor} />
      {showCartDrawer && <CartDrawer />}
      
      {/* Dynamic design token styles */}
      <style>{`
        :root {
          --store-primary: ${primaryColor};
          --store-secondary: ${secondaryColor};
          --store-background: ${backgroundColor};
        }
        
        /* Apply accent color to buttons and links */
        .btn-primary, [data-accent="primary"] {
          background-color: var(--store-primary) !important;
        }
        
        .text-accent {
          color: var(--store-primary);
        }
        
        .border-accent {
          border-color: var(--store-primary);
        }
        
        .bg-accent {
          background-color: var(--store-primary);
        }
        
        /* Selection styling */
        ::selection {
          background-color: ${primaryColor};
          color: white;
        }
      `}</style>
    </div>
  );
};
