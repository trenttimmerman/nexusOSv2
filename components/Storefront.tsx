
import React, { useState, useEffect } from 'react';
import { StorefrontProps, Product, PageBlock, HeroStyleId, ProductCardStyleId } from '../types';
import { HEADER_COMPONENTS } from './HeaderLibrary';
import { HERO_COMPONENTS, HERO_OPTIONS, HERO_FIELDS } from './HeroLibrary';
import { AI_HERO_COMPONENTS, HeroData as AIHeroData } from './AiHeroLibrary';
import { PRODUCT_CARD_COMPONENTS, PRODUCT_CARD_OPTIONS } from './ProductCardLibrary';
import { PRODUCT_PAGE_COMPONENTS } from './ProductPageLibrary';
import { FOOTER_COMPONENTS } from './FooterLibrary';
import { SCROLL_COMPONENTS, SCROLL_OPTIONS } from './ScrollLibrary';
import { SOCIAL_COMPONENTS, SOCIAL_OPTIONS } from './SocialLibrary';
import { RICH_TEXT_COMPONENTS, EMAIL_SIGNUP_COMPONENTS, COLLAPSIBLE_COMPONENTS, LOGO_LIST_COMPONENTS, PROMO_BANNER_COMPONENTS, SPACER_COMPONENTS } from './SectionLibrary';
import { GALLERY_COMPONENTS } from './GalleryLibrary';
import { BLOG_COMPONENTS } from './BlogLibrary';
import { VIDEO_COMPONENTS } from './VideoLibrary';
import { CONTACT_COMPONENTS } from './ContactLibrary';
import { LAYOUT_COMPONENTS } from './LayoutLibrary';
import { COLLECTION_COMPONENTS } from './CollectionLibrary';
import { CATEGORY_COMPONENTS } from './CategoryLibrary';
import { SectionWrapper } from './SectionWrapper';
import { Plus, ArrowUp, ArrowDown, Trash2, Copy, Layout, Settings, AlignLeft, AlignCenter, AlignRight, Palette, Maximize2, Minimize2 } from 'lucide-react';
import { getFilteredProducts as getFilteredProductsUtil } from '../lib/productUtils';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { CartDrawer } from './CartDrawer';

// Lightweight editable helpers (avoids dependency on HeroLibrary exports)
type EditableTextProps = {
  value: string;
  onChange: (val: string) => void;
  onStyleChange?: (style: any) => void;
  style?: any;
  isEditable?: boolean;
  className?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  placeholder?: string;
  elementId?: string;
  onSelect?: () => void;
};

const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  onStyleChange,
  style,
  isEditable,
  className,
  tagName = 'span',
  placeholder,
  onSelect
}) => {
  const Tag: any = tagName;

  if (!isEditable) {
    return (
      <Tag className={className} style={style}>
        {value || placeholder || ''}
      </Tag>
    );
  }

  return (
    <Tag
      className={`${className || ''} outline-none border-b border-dashed border-gray-300`}
      contentEditable
      suppressContentEditableWarning
      style={style}
      onFocus={() => onSelect && onSelect()}
      onInput={(e: React.FormEvent<HTMLElement>) => {
        const next = (e.currentTarget as HTMLElement).innerText;
        onChange(next);
        if (onStyleChange) onStyleChange(style);
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const next = (e.currentTarget as HTMLElement).innerText;
        onChange(next);
      }}
      data-element-id={placeholder}
    >
      {value || placeholder || ''}
    </Tag>
  );
};

// Placeholder for API parity; not used in this file but kept for completeness
const EditableImage: React.FC<{ src?: string; alt?: string; className?: string }> = ({ src, alt = '', className }) => (
  <img src={src} alt={alt} className={className} />
);

// Style classes generator for block.data.style
const getBlockStyleClasses = (style?: { padding?: string; paddingX?: string; maxWidth?: string; height?: string; background?: string; alignment?: string; imageFit?: string }) => {
  if (!style) return '';
  
  const classes: string[] = [];
  
  // Vertical Padding classes - NO DEFAULT, must be explicitly set
  switch (style.padding) {
    case 'none': classes.push('py-0'); break;
    case 's': classes.push('py-4'); break;
    case 'm': classes.push('py-12'); break;
    case 'l': classes.push('py-20'); break;
    case 'xl': classes.push('py-32'); break;
    // No default - sections are edge-to-edge unless explicitly set
  }
  
  // Horizontal Padding classes - NO DEFAULT, must be explicitly set
  switch (style.paddingX) {
    case 'none': classes.push('px-0'); break;
    case 's': classes.push('px-4'); break;
    case 'm': classes.push('px-8'); break;
    case 'l': classes.push('px-16'); break;
    case 'xl': classes.push('px-24'); break;
    // No default - sections are full-width unless explicitly set
  }
  
  // Height classes - use relative container with proper overflow
  switch (style.height) {
    case 'sm': classes.push('h-[300px] overflow-hidden'); break;
    case 'md': classes.push('h-[500px] overflow-hidden'); break;
    case 'lg': classes.push('h-[700px] overflow-hidden'); break;
    case 'screen': classes.push('h-screen overflow-hidden'); break;
    // 'auto' - use component defaults
  }
  
  // Image fit behavior - explicit control over how images scale
  switch (style.imageFit) {
    case 'cover': 
      classes.push('[&_img]:object-cover [&_img]:w-full [&_img]:h-full'); 
      break;
    case 'contain': 
      classes.push('[&_img]:object-contain [&_img]:max-w-full [&_img]:max-h-full [&_img]:mx-auto'); 
      break;
    case 'scale': 
      classes.push('[&_img]:object-scale-down [&_img]:max-w-full [&_img]:max-h-full [&_img]:mx-auto'); 
      break;
    default:
      // 'auto' - apply sensible defaults when height is constrained
      if (style.height && style.height !== 'auto') {
        classes.push('[&_img]:max-h-full [&_img]:w-auto [&_img]:object-contain [&_img]:mx-auto');
      }
  }
  
  // Ensure inner content fills and centers when height is set
  if (style.height && style.height !== 'auto') {
    classes.push('[&>*]:h-full [&>*]:flex [&>*]:flex-col [&>*]:justify-center');
  }
  
  // Max Width classes  
  switch (style.maxWidth) {
    case 'narrow': classes.push('[&>*]:max-w-[800px] [&>*]:mx-auto'); break;
    case 'medium': classes.push('[&>*]:max-w-[1200px] [&>*]:mx-auto'); break;
    case 'wide': classes.push('[&>*]:max-w-[1400px] [&>*]:mx-auto'); break;
    case 'full': classes.push('[&>*]:max-w-full'); break;
    // 'auto' - use component defaults
  }
  
  // Background classes
  switch (style.background) {
    case 'white': classes.push('bg-white'); break;
    case 'black': classes.push('bg-black text-white'); break;
    case 'accent': classes.push('bg-[var(--color-primary)] text-white'); break;
    case 'gradient': classes.push('bg-gradient-to-br from-neutral-50 to-neutral-100'); break;
    // 'auto' - use component defaults
  }
  
  // Text alignment
  switch (style.alignment) {
    case 'left': classes.push('text-left'); break;
    case 'center': classes.push('text-center'); break;
    case 'right': classes.push('text-right'); break;
    // 'auto' - use component defaults
  }
  
  return classes.join(' ');
};

export const Storefront: React.FC<StorefrontProps & { onSelectField?: (field: string) => void }> = (props) => {
  const { 
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
    showCartDrawer = true, 
    onSelectField 
  } = props;
  
  const { addToCart, cartCount, setIsCartOpen } = useCart();
  // Get collections and categories from context (avoids prop drilling TDZ issues)
  const { collections, categories } = useData();

  // Ensure pages is always an array - must be before activePage usage
  const safePages = pages || [];
  const activePage = safePages.find(p => p.id === activePageId) || safePages[0];

  // Set up global store context for email forms
  useEffect(() => {
    (window as any).__STORE_CONTEXT__ = {
      storeId: config.id,
      currentPage: activePage?.slug || 'home',
    };
  }, [config.id, activePage?.slug]);

  // Search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Extract design settings from config
  const primaryColor = config.primaryColor || '#6366F1';
  const secondaryColor = config.secondaryColor || '#8B5CF6';
  const backgroundColor = config.backgroundColor || '#FFFFFF';
  const storeVibe = config.storeVibe || 'minimal';
  const typography = config.typography || {};

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

  // Calculate heading scale multipliers
  const getHeadingScale = () => {
    switch (typography.headingScale) {
      case 'compact': return { h1: 2, h2: 1.5, h3: 1.25 };
      case 'large': return { h1: 3.5, h2: 2.5, h3: 1.75 };
      case 'dramatic': return { h1: 4.5, h2: 3, h3: 2 };
      default: return { h1: 2.5, h2: 2, h3: 1.5 };
    }
  };
  const headingScale = getHeadingScale();

  // CSS custom properties for design tokens
  const designTokenStyles = {
    '--store-primary': primaryColor,
    '--store-secondary': secondaryColor,
    '--store-background': backgroundColor,
    // Typography tokens
    '--font-heading': typography.headingFont || 'Inter, system-ui, sans-serif',
    '--font-body': typography.bodyFont || 'Inter, system-ui, sans-serif',
    '--color-heading': typography.headingColor || '#ffffff',
    '--color-body': typography.bodyColor || '#a3a3a3',
    '--color-link': typography.linkColor || primaryColor,
    '--color-muted': typography.mutedColor || '#737373',
    '--font-size-base': typography.baseFontSize || '16px',
    '--font-weight-heading': typography.headingWeight || '700',
    '--font-weight-body': typography.bodyWeight || '400',
    '--letter-spacing-heading': typography.headingLetterSpacing || '-0.025em',
    '--text-transform-heading': typography.headingTransform || 'none',
    '--heading-scale-h1': `${headingScale.h1}rem`,
    '--heading-scale-h2': `${headingScale.h2}rem`,
    '--heading-scale-h3': `${headingScale.h3}rem`,
  } as React.CSSProperties;

  const HeaderComponent = HEADER_COMPONENTS[config.headerStyle] || HEADER_COMPONENTS['canvas'];
  // Hero, Card, Footer components are now determined dynamically in renderBlock to allow for variants
  const FooterComponent = FOOTER_COMPONENTS[config.footerStyle] || FOOTER_COMPONENTS['columns'];

  const isSidebar = config.headerStyle === 'studio';

  // Sort pages by display_order for navigation, filter out hidden pages
  const sortedVisiblePages = [...safePages]
    .filter(p => p.type !== 'hidden')
    .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));

  // Map Pages to NavLinks
  const navLinks = sortedVisiblePages.map(p => {
    let href = '/';
    if (p.type !== 'home') {
      const cleanSlug = p.slug.startsWith('/') ? p.slug.substring(1) : p.slug;
      href = `/pages/${cleanSlug}`;
    }
    
    return {
      label: p.title,
      href,
      active: String(p.id) === String(activePageId) || (p.type === 'home' && activePageId === 'home'),
    };
  });

  // If activeProductSlug is present, render Product Page
  if (activeProductSlug) {
      const product = products.find(p => p.seo.slug === activeProductSlug || p.id === activeProductSlug);
      if (product) {
          const ProductComponent = PRODUCT_PAGE_COMPONENTS[product.template || 'standard'] || PRODUCT_PAGE_COMPONENTS['standard'];
          return (
              <div 
                className={`min-h-screen flex flex-col selection:text-white storefront-typography ${isSidebar ? 'md:pl-64' : ''} ${getVibeClasses()} scrollbar-${config.scrollbarStyle || 'native'}`}
                style={{ ...designTokenStyles, backgroundColor, color: primaryColor }}
              >
                  <HeaderComponent
                      storeName={config.name}
                      logoUrl={config.logoUrl}
                      logoHeight={config.logoHeight}
                      links={navLinks}
                      cartCount={cartCount}
                      onOpenCart={() => setIsCartOpen(true)}
                      onLogoClick={() => onNavigate?.('/')}
                      onLinkClick={(href) => onNavigate?.(href)}
                      onSearchClick={() => setIsSearchOpen(true)}
                      isSearchOpen={isSearchOpen}
                      onSearchClose={() => setIsSearchOpen(false)}
                      onSearchSubmit={(query) => {
                        onNavigate?.(`/?search=${encodeURIComponent(query)}`);
                        setIsSearchOpen(false);
                      }}
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      data={{
                        accentColor: config.primaryColor,
                        ...config.headerData
                      }}
                  />
                  <main className="flex-1 pt-20">
                      {/* Back to shop button */}
                      <div className="max-w-6xl mx-auto px-6 py-4">
                        <button 
                          onClick={() => onNavigate?.('/')}
                          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors group"
                        >
                          <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          Back to shop
                        </button>
                      </div>
                      <ProductComponent product={product} onAddToCart={addToCart} />
                  </main>
                  <FooterComponent 
                    storeName={config.name} 
                    primaryColor={config.primaryColor} 
                    backgroundColor={config.footerBackgroundColor}
                    textColor={config.footerTextColor}
                    accentColor={config.footerAccentColor}
                    data={config.footerData}
                  />
                  {showCartDrawer && <CartDrawer />}
              </div>
          );
      }
  }

  // Helper to filter and sort products
  // Helper to filter and sort products
  const getFilteredProducts = (data: any) => {
    return getFilteredProductsUtil(data, products, collections);
  };

  // Render System Product Grid
  const renderProductGrid = (variant?: string, data?: any, blockId?: string, isEditable?: boolean, onEditBlock?: (id: string) => void) => {
    const styleId = (variant as ProductCardStyleId) || config.productCardStyle || 'classic';
    const CardComponent = PRODUCT_CARD_COMPONENTS[styleId] || PRODUCT_CARD_COMPONENTS['classic'];
    const heading = data?.heading || "Latest Drops.";
    const subheading = data?.subheading || "Curated essentials for the modern digital nomad.";
    
    const filteredProducts = getFilteredProducts(data);
    
    // Determine grid columns
    const columns = data?.columns || '4';
    const gridCols = {
      '2': 'lg:grid-cols-2',
      '3': 'lg:grid-cols-3',
      '4': 'lg:grid-cols-4',
      '5': 'lg:grid-cols-5',
    }[columns] || 'lg:grid-cols-4';

    return (
      <section 
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
        className="py-24 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 
                style={{ color: data?.headingColor || '#000000' }}
                className="text-3xl font-bold mb-2"
              >
                <EditableText 
                  tagName="span" 
                  value={heading} 
                  onChange={(val) => onUpdateBlock && blockId && onUpdateBlock(blockId, { heading: val })} 
                  onStyleChange={(style) => onUpdateBlock && blockId && onUpdateBlock(blockId, { heading_style: style })}
                  style={data?.heading_style}
                  isEditable={isEditable} 
                  onSelect={() => onEditBlock && blockId && onEditBlock(blockId)}
                />
              </h2>
              <p 
                style={{ color: data?.subheadingColor || '#737373' }}
              >
                <EditableText 
                  tagName="span" 
                  value={subheading} 
                  onChange={(val) => onUpdateBlock && blockId && onUpdateBlock(blockId, { subheading: val })} 
                  onStyleChange={(style) => onUpdateBlock && blockId && onUpdateBlock(blockId, { subheading_style: style })}
                  style={data?.subheading_style}
                  isEditable={isEditable} 
                  onSelect={() => onEditBlock && blockId && onEditBlock(blockId)}
                />
              </p>
            </div>
            {data?.buttonText && (
              <a href={data?.buttonLink || '/shop'} className="text-sm font-bold underline underline-offset-4">
                {data.buttonText}
              </a>
            )}
            {!data?.buttonText && <a href="#" className="text-sm font-bold underline underline-offset-4">View All</a>}
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-x-8 gap-y-16`}>
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-neutral-500">
                No products found matching your criteria.
              </div>
            ) : (
              filteredProducts.map((product) => (
                <CardComponent
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onNavigate={() => onNavigate && onNavigate(`/products/${product.seo.slug || product.id}`)}
                  primaryColor={config.primaryColor}
                  data={data}
                />
              ))
            )}
          </div>
        </div>
      </section>
    );
  };

  // Dynamic Block Renderer
  const renderBlock = (block: PageBlock) => {
    const isEditable = !!onUpdateBlock;
    console.log('[Storefront] Rendering block:', { id: block.id, type: block.type, variant: block.variant });

    const AI_VARIANTS: Array<NonNullable<AIHeroData['variant']>> = ['centered', 'split-left', 'diagonal', 'minimal-corner', 'bottom-aligned'];
    const isAIHeroVariant = (variant?: string) => AI_VARIANTS.includes((variant as any));

    const renderContent = () => {
      switch (block.type) {
        case 'system-hero':
          const aiHeroData = (block.data as any)?.aiHero as AIHeroData | undefined;
          const variant = block.variant as string | undefined;
          if (aiHeroData || isAIHeroVariant(variant)) {
            const aiVariant = (aiHeroData?.variant as any) || (variant as any) || 'centered';
            const AIComponent = AI_HERO_COMPONENTS[aiVariant] || AI_HERO_COMPONENTS['centered'];
            return AIComponent ? (
              <AIComponent
                key={block.id}
                data={aiHeroData || ({ ...block.data, variant: aiVariant } as AIHeroData)}
              />
            ) : null;
          }

          const heroStyle = (variant as HeroStyleId) || config.heroStyle || 'impact';
          const HeroComponent = HERO_COMPONENTS[heroStyle] || HERO_COMPONENTS['impact'];
          console.log('[Storefront] Hero block:', { heroStyle, hasComponent: !!HeroComponent });
          return HeroComponent ? (
            <HeroComponent
              key={block.id}
              storeName={config.name}
              primaryColor={config.primaryColor}
              data={block.data}
              products={products}
              isEditable={isEditable}
              onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
              onSelectField={onSelectField}
              onEditBlock={onEditBlock}
              blockId={block.id}
            />
          ) : null;
        case 'system-grid':
          return renderProductGrid(block.variant, block.data, block.id, isEditable, onEditBlock);
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
        case 'system-spacer':
          const SpacerComponent = SPACER_COMPONENTS[block.variant || 'spacer-simple'];
          return SpacerComponent ? (
            <SpacerComponent data={block.data} isEditable={isEditable} onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)} />
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
            <CollectionComponent 
              data={block.data} 
              products={getFilteredProducts(block.data)} 
              isEditable={isEditable} 
              onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
              onEditBlock={onEditBlock}
              blockId={block.id}
            />
          ) : null;
        case 'system-category':
          const CategoryComponent = CATEGORY_COMPONENTS[block.variant || 'category-grid'];
          return CategoryComponent ? (
            <CategoryComponent 
              data={block.data} 
              categories={categories} 
              isEditable={isEditable} 
              onUpdate={(data) => onUpdateBlock && onUpdateBlock(block.id, data)}
              onEditBlock={onEditBlock}
              blockId={block.id}
            />
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

    const styleClasses = getBlockStyleClasses(block.data?.style);

    if (!isEditable) {
      return (
        <div key={block.id} className={styleClasses}>
          {renderContent()}
        </div>
      );
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
        <div className={styleClasses}>
          {renderContent()}
        </div>
      </SectionWrapper>
    );
  };

  return (
    <div 
      className={`min-h-screen flex flex-col selection:text-white storefront-typography ${isSidebar ? 'md:pl-64' : ''} ${getVibeClasses()} scrollbar-${config.scrollbarStyle || 'native'}`}
      style={{ ...designTokenStyles, backgroundColor }}
    >
      {/* Global Typography Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Sora:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Libre+Baskerville:wght@400;700&family=Merriweather:wght@300;400;700;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Nunito+Sans:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Lato:wght@300;400;700;900&family=Roboto:wght@300;400;500;700;900&display=swap');
        
        /* Global Typography Overrides - These apply site-wide */
        /* Section-level styles can override these with inline styles */
        
        .storefront-typography h1, .storefront-typography h2, .storefront-typography h3, 
        .storefront-typography h4, .storefront-typography h5, .storefront-typography h6 {
          font-family: var(--font-heading) !important;
          color: var(--color-heading);
          font-weight: var(--font-weight-heading) !important;
          letter-spacing: var(--letter-spacing-heading) !important;
          text-transform: var(--text-transform-heading) !important;
        }
        .storefront-typography h1 { font-size: var(--heading-scale-h1) !important; }
        .storefront-typography h2 { font-size: var(--heading-scale-h2) !important; }
        .storefront-typography h3 { font-size: var(--heading-scale-h3) !important; }
        
        .storefront-typography p, .storefront-typography span:not([style]), .storefront-typography div:not([style]) {
          font-family: var(--font-body) !important;
          font-weight: var(--font-weight-body);
        }
        .storefront-typography {
          font-size: var(--font-size-base) !important;
        }
        .storefront-typography p:not([style*="color"]) {
          color: var(--color-body);
        }
        .storefront-typography a:not([style*="color"]) {
          color: var(--color-link);
        }
        .storefront-typography a:hover {
          opacity: 0.8;
        }
        .storefront-typography .text-muted, .storefront-typography .text-neutral-500 {
          color: var(--color-muted) !important;
        }
        
        /* Section-level overrides for content blocks only - NOT headers/footers */
        /* These help normalize typography in rich text/content sections */
        .storefront-typography main [style*="font-family"] { font-family: inherit !important; }
        .storefront-typography main p[style*="color"], 
        .storefront-typography main span[style*="color"] { color: inherit !important; }
        .storefront-typography main [style*="font-size"] { font-size: inherit !important; }
        .storefront-typography main [style*="font-weight"] { font-weight: inherit !important; }
      `}</style>
      <HeaderComponent
        storeName={config.name}
        logoUrl={config.logoUrl}
        logoHeight={config.logoHeight}
        links={navLinks}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onLogoClick={() => onNavigate?.('/')}
        onLinkClick={(href) => onNavigate?.(href)}
        onSearchClick={() => setIsSearchOpen(true)}
        isSearchOpen={isSearchOpen}
        onSearchClose={() => setIsSearchOpen(false)}
        onSearchSubmit={(query) => {
          onNavigate?.(`/?search=${encodeURIComponent(query)}`);
          setIsSearchOpen(false);
        }}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        data={{
          accentColor: config.primaryColor,
          ...config.headerData
        }}
      />

      <main className="flex-1">
        {activePage.blocks && activePage.blocks.length > 0 ? (
          // Render All Blocks (Including System Components)
          <div className="w-full">
            {activePage.type === 'custom' ? (
              <div className="w-full">
                {activePage.blocks.map(renderBlock)}
                {previewBlock && (
                  <div className="border-2 border-blue-500 relative overflow-hidden animate-pulse">
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
            <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>Start Building</h3>
            <p className="text-neutral-500 max-w-xs mx-auto mb-6">This page is currently empty. Add your first section from the sidebar to bring it to life.</p>
            {previewBlock && (
              <div className="w-full max-w-4xl mx-auto border-2 relative overflow-hidden animate-pulse rounded-lg shadow-xl" style={{ borderColor: primaryColor, backgroundColor }}>
                <div className="text-white text-[10px] font-bold px-2 py-1 z-50 absolute top-0 right-0" style={{ backgroundColor: primaryColor }}>PREVIEW</div>
                {renderBlock(previewBlock)}
              </div>
            )}
          </div>
        )}
      </main>

      <FooterComponent 
        storeName={config.name} 
        primaryColor={primaryColor} 
        secondaryColor={secondaryColor} 
        backgroundColor={config.footerBackgroundColor}
        textColor={config.footerTextColor}
        accentColor={config.footerAccentColor}
        data={config.footerData}
      />
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
