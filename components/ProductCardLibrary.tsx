
import React from 'react';
import { ShoppingBag, Plus, Star, ArrowRight, Zap, Eye } from 'lucide-react';
import { Product } from '../types';

// Helper function to get product image URL (handles both legacy and new image structure)
const getProductImage = (product: Product): string => {
  // Try images array first (new structure)
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.isPrimary);
    return primaryImage?.url || product.images[0]?.url || product.image || '';
  }
  // Fall back to legacy image field
  return product.image || '';
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onNavigate?: () => void;
  primaryColor?: string;
  data?: {
    // Universal colors
    cardBgColor?: string;
    productNameColor?: string;
    priceColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    borderColor?: string;
    categoryColor?: string;
    
    // Classic specific
    showCategory?: boolean;
    showQuickAdd?: boolean;
    hoverAnimation?: 'zoom' | 'lift' | 'slide';
    productNameSize?: string;
    priceSize?: string;
    cardPadding?: string;
    imageBorderRadius?: string;
    
    // Industrial specific
    showProductId?: boolean;
    showStock?: boolean;
    showGrain?: boolean;
    imageFilter?: 'grayscale' | 'sepia' | 'none';
    badgeBgColor?: string;
    badgeTextColor?: string;
    fontFamily?: 'mono' | 'sans' | 'serif';
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    borderWidth?: string;
    gridLineColor?: string;
    
    // Focus specific
    overlayOpacity?: number;
    showCategoryOnHover?: boolean;
    hoverRevealSpeed?: 'slow' | 'medium' | 'fast';
    overlayColor?: string;
    productNameFont?: 'serif' | 'sans' | 'mono';
    productNameStyle?: 'normal' | 'italic';
    imageZoom?: number;
    contentTransition?: string;
    
    // Hype specific
    showNewBadge?: boolean;
    showLowStockBadge?: boolean;
    badgeStyle?: 'skewed' | 'straight' | 'rounded';
    newBadgeBgColor?: string;
    newBadgeTextColor?: string;
    lowStockBadgeColor?: string;
    shadowStyle?: 'bold' | 'subtle' | 'none';
    buttonIcon?: 'bag' | 'zap' | 'plus' | 'arrow';
    skewAngle?: number;
    hoverEffect?: 'lift' | 'scale' | 'shadow';
    
    // Magazine specific
    alignment?: 'left' | 'center' | 'right';
    showDescription?: boolean;
    categoryLetterSpacing?: string;
    textAlignment?: 'left' | 'center' | 'right';
    imageAspectRatio?: string;
    buttonBorderColor?: string;
    
    // Glass specific
    showWishlist?: boolean;
    glassOpacity?: number;
    blurIntensity?: string;
    wishlistColor?: string;
    backdropBlur?: string;
    borderOpacity?: number;
    revealDirection?: 'up' | 'down' | 'left' | 'right';
    hoverScale?: number;
  };
}

// 1. Classic (Clean, Standard, Minimal)
export const ProductCardClassic: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => {
  const borderRadius = data?.imageBorderRadius || '0.75rem';
  const hoverAnim = data?.hoverAnimation || 'zoom';
  const showCat = data?.showCategory !== false;
  const showQuick = data?.showQuickAdd !== false;
  
  return (
    <div className="group" style={{ padding: data?.cardPadding || '0' }}>
      <div 
        className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4 cursor-pointer"
        style={{ borderRadius }}
        onClick={onNavigate}
      >
        {product.image && (
          <img 
            src={getProductImage(product)} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-700 ${
              hoverAnim === 'zoom' ? 'group-hover:scale-105' :
              hoverAnim === 'lift' ? 'group-hover:scale-[1.02]' :
              ''
            }`}
          />
        )}
        {showQuick && (
          <div className={`absolute inset-x-4 bottom-4 transition-transform duration-300 ease-out ${
            hoverAnim === 'slide' ? 'translate-y-full group-hover:translate-y-0' :
            'opacity-0 group-hover:opacity-100'
          }`}>
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              style={{
                backgroundColor: data?.buttonBgColor || '#ffffff',
                color: data?.buttonTextColor || '#000000',
                borderRadius: borderRadius
              }}
              className="w-full py-3 font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between items-start">
          <h3 
            style={{ 
              color: data?.productNameColor || '#171717',
              fontSize: data?.productNameSize || '1.125rem'
            }}
            className="font-bold leading-tight cursor-pointer hover:underline" 
            onClick={onNavigate}
          >
            {product.name}
          </h3>
          <span 
            style={{ 
              color: data?.priceColor || '#171717',
              fontSize: data?.priceSize || '1rem'
            }}
            className="font-medium"
          >
            ${product.price.toFixed(2)}
          </span>
        </div>
        {showCat && (
          <p 
            className="text-sm mt-1"
            style={{ color: data?.categoryColor || '#737373' }}
          >
            {product.category}
          </p>
        )}
      </div>
    </div>
  );
};

// 2. Industrial (Tech, Borders, Mono)
export const ProductCardIndustrial: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => {
  const showId = data?.showProductId !== false;
  const showStock = data?.showStock !== false;
  const imgFilter = data?.imageFilter || 'grayscale';
  const badgeBg = data?.badgeBackgroundColor || '#000000';
  const badgeText = data?.badgeTextColor || '#ffffff';
  const borderStyle = data?.borderStyle || 'solid';
  const typoStyle = data?.typographyStyle || 'mono';
  
  return (
    <div 
      style={{ 
        borderColor: data?.borderColor || '#e5e7eb',
        backgroundColor: data?.cardBgColor || '#ffffff',
        borderStyle: borderStyle
      }}
      className="group border hover:border-opacity-80 transition-colors duration-300 p-2 relative"
    >
      {showId && (
        <div 
          className="absolute top-2 left-2 z-10 text-[10px] px-2 py-1 uppercase tracking-wider"
          style={{ 
            backgroundColor: badgeBg,
            color: badgeText,
            fontFamily: typoStyle === 'mono' ? 'monospace' : 'inherit'
          }}
        >
          ID: {product.id}
        </div>
      )}
      <div 
        className="aspect-square bg-neutral-100 overflow-hidden mb-3 border border-neutral-100 relative cursor-pointer"
        onClick={onNavigate}
      >
        {product.image && (
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-all duration-500 ${
              imgFilter === 'grayscale' ? 'grayscale group-hover:grayscale-0' :
              imgFilter === 'sepia' ? 'sepia group-hover:sepia-0' :
              imgFilter === 'contrast' ? 'contrast-125 group-hover:contrast-100' :
              ''
            }`}
          />
        )}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      </div>
      <div style={{ fontFamily: typoStyle === 'mono' ? 'monospace' : 'inherit' }}>
        <div className="flex justify-between items-center text-xs text-neutral-500 border-b border-neutral-100 pb-2 mb-2 uppercase tracking-tight">
          <span>{product.category}</span>
          {showStock && <span>In Stock: {product.stock}</span>}
        </div>
        <h3 
          style={{ 
            color: data?.productNameColor || '#000000',
            fontSize: data?.productNameSize || '0.875rem'
          }}
          className="font-bold uppercase mb-1 truncate cursor-pointer hover:opacity-70" 
          onClick={onNavigate}
        >
          {product.name}
        </h3>
        <div className="flex justify-between items-center mt-3">
          <span 
            style={{ 
              color: data?.priceColor || '#000000',
              fontSize: data?.priceSize || '1.125rem'
            }}
            className="font-bold"
          >
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            style={{
              backgroundColor: data?.buttonBgColor || '#000000',
              color: data?.buttonTextColor || '#ffffff'
            }}
            className="p-2 hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Focus (Image First, Reveal on Hover)
export const ProductCardFocus: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => {
  const overlayOpacity = data?.overlayOpacity || 40;
  const revealSpeed = data?.hoverRevealSpeed || 300;
  const imageZoom = data?.imageZoomScale || 110;
  const showCat = data?.showCategory !== false;
  const typoStyle = data?.typographyStyle || 'serif';
  
  return (
    <div 
      className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
      onClick={onNavigate}
    >
      {product.image && (
        <img 
          src={getProductImage(product)} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700"
          style={{ transform: `scale(1)` }}
          onMouseEnter={(e) => e.currentTarget.style.transform = `scale(${imageZoom / 100})`}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      )}
      <div 
        className="absolute inset-0 transition-colors"
        style={{ 
          backgroundColor: `rgba(0, 0, 0, 0)`,
          transitionDuration: `${revealSpeed}ms`
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, ${overlayOpacity / 100})`}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'}
      ></div>
      
      <div 
        className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0"
        style={{ transitionDuration: `${revealSpeed}ms` }}
      >
        {showCat && (
          <span className="text-xs font-medium uppercase tracking-widest mb-2 opacity-80">{product.category}</span>
        )}
        <h3 
          style={{ 
            color: data?.productNameColor || '#ffffff',
            fontSize: data?.productNameSize || '1.5rem',
            fontFamily: typoStyle === 'serif' ? 'Georgia, serif' : 'inherit'
          }}
          className="italic mb-2"
        >
          {product.name}
        </h3>
        <p 
          style={{ 
            color: data?.priceColor || '#ffffff',
            fontSize: data?.priceSize || '1.125rem'
          }}
          className="font-light mb-6"
        >
          ${product.price.toFixed(2)}
        </p>
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          style={{
            backgroundColor: data?.buttonBgColor || '#ffffff',
            color: data?.buttonTextColor || '#000000',
            borderRadius: data?.buttonBorderRadius || '9999px'
          }}
          className="w-full py-3 font-medium hover:opacity-90 transition-opacity"
        >
          Quick Add
        </button>
      </div>
    </div>
  );
};

// 4. Hype (Streetwear, Bold, Badges)
export const ProductCardHype: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => {
  const showNewBadge = data?.showNewBadge !== false;
  const showStockBadge = data?.showStockBadge !== false;
  const badgePrimary = data?.badgePrimaryColor || '#ccff00';
  const badgeSecondary = data?.badgeSecondaryColor || '#ff0000';
  const shadowStyle = data?.shadowStyle || 'hard';
  const buttonIcon = data?.buttonIcon || 'zap';
  
  return (
    <div className="group relative">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {showNewBadge && (
          <span 
            className="text-xs font-black uppercase italic px-3 py-1 transform -skew-x-12 border-2 border-black"
            style={{
              backgroundColor: badgePrimary,
              color: '#000000',
              boxShadow: shadowStyle === 'hard' ? '2px 2px 0px 0px rgba(0,0,0,1)' : '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            New Drop
          </span>
        )}
        {showStockBadge && product.stock < 10 && (
           <span 
             className="text-xs font-black uppercase italic px-3 py-1 transform -skew-x-12 border-2 border-black"
             style={{
               backgroundColor: badgeSecondary,
               color: '#ffffff',
               boxShadow: shadowStyle === 'hard' ? '2px 2px 0px 0px rgba(0,0,0,1)' : '0 4px 6px rgba(0,0,0,0.1)'
             }}
           >
             Low Stock
           </span>
        )}
      </div>
      
      <div 
        style={{
          borderColor: data?.borderColor || '#000000',
          backgroundColor: data?.cardBgColor || '#f5f5f5',
          boxShadow: shadowStyle === 'hard' 
            ? '6px 6px 0px 0px rgba(0,0,0,1)' 
            : '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}
        className="aspect-[4/5] border-2 rounded-xl overflow-hidden mb-3 relative group-hover:translate-x-1 group-hover:translate-y-1 transition-all cursor-pointer"
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = shadowStyle === 'hard' 
            ? '2px 2px 0px 0px rgba(0,0,0,1)' 
            : '0 4px 6px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = shadowStyle === 'hard' 
            ? '6px 6px 0px 0px rgba(0,0,0,1)' 
            : '0 10px 15px -3px rgba(0,0,0,0.1)';
        }}
        onClick={onNavigate}
      >
         {product.image && <img src={product.image} className="w-full h-full object-cover" />}
         <button 
           onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
           style={{
             backgroundColor: data?.buttonBgColor || '#000000',
             color: data?.buttonTextColor || '#ffffff'
           }}
           className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
         >
           {buttonIcon === 'zap' && <Zap size={20} fill="currentColor" />}
           {buttonIcon === 'plus' && <Plus size={20} />}
           {buttonIcon === 'bag' && <ShoppingBag size={20} />}
         </button>
      </div>

      <div className="px-1">
         <h3 
           style={{ 
             color: data?.productNameColor || '#000000',
             fontSize: data?.productNameSize || '1.25rem'
           }}
           className="font-black uppercase italic leading-none mb-1 cursor-pointer hover:underline" 
           onClick={onNavigate}
         >
           {product.name}
         </h3>
         <span 
           style={{ 
             color: data?.priceColor || '#737373',
             fontSize: data?.priceSize || '1rem'
           }}
           className="font-bold"
         >
           ${product.price.toFixed(2)}
         </span>
      </div>
    </div>
  );
};

// 5. Magazine (Editorial, Serif, Descriptions)
export const ProductCardMagazine: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => {
  const align = data?.textAlignment || 'center';
  const typoStyle = data?.typographyStyle || 'serif';
  const letterSpace = data?.letterSpacing || 'wide';
  const aspectRatio = data?.imageAspectRatio || '3/4';
  
  return (
    <div className="group cursor-pointer" onClick={onNavigate}>
      <div className="mb-4 overflow-hidden">
         {product.image && (
           <img 
             src={product.image} 
             className="w-full object-cover hover:opacity-90 transition-opacity"
             style={{ aspectRatio }}
           />
         )}
      </div>
      <div style={{ textAlign: align as any }}>
         <span 
           className="text-[10px] font-bold uppercase text-neutral-400 mb-2 block"
           style={{ 
             letterSpacing: letterSpace === 'wide' ? '0.2em' : 
                           letterSpace === 'tight' ? '0.05em' : 
                           '0.1em'
           }}
         >
           {product.category}
         </span>
         <h3 
           style={{ 
             color: data?.productNameColor || '#000000',
             fontSize: data?.productNameSize || '1.5rem',
             fontFamily: typoStyle === 'serif' ? 'Georgia, serif' : 'inherit'
           }}
           className="mb-1 group-hover:underline underline-offset-4 decoration-1"
         >
           {product.name}
         </h3>
         <div className="flex items-center gap-2 mb-4" style={{ justifyContent: align as any }}>
            <span 
              style={{ 
                color: data?.priceColor || '#000000',
                fontSize: data?.priceSize || '0.875rem'
              }}
              className="font-medium"
            >
              ${product.price.toFixed(2)}
            </span>
         </div>
         <button 
           onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
           style={{
             color: data?.buttonTextColor || '#000000',
             borderBottomColor: data?.buttonTextColor || '#000000'
           }}
           className="text-xs font-bold border-b pb-0.5 hover:opacity-70 transition-opacity uppercase tracking-wide"
         >
           Add to Bag
         </button>
      </div>
    </div>
  );
};

// 6. Glass (Modern, Blur, Overlay)
export const ProductCardGlass: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => {
  const glassOpacity = data?.glassOpacity || 70;
  const blurIntensity = data?.blurIntensity || 'md';
  const showWishlist = data?.showWishlist !== false;
  const slideAnimation = data?.slideAnimation !== false;
  
  return (
    <div 
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
      onClick={onNavigate}
    >
      {product.image && (
        <img 
          src={product.image} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
      )}
      
      <div 
        style={{
          backgroundColor: data?.cardBgColor 
            ? `${data.cardBgColor}${Math.round(glassOpacity * 2.55).toString(16).padStart(2, '0')}` 
            : `rgba(255,255,255,${glassOpacity / 100})`,
          borderColor: data?.borderColor 
            ? `${data.borderColor}80` 
            : 'rgba(255,255,255,0.5)'
        }}
        className={`absolute inset-x-2 bottom-2 p-3 border rounded-xl flex items-center justify-between transition-transform duration-300 shadow-lg ${
          blurIntensity === 'sm' ? 'backdrop-blur-sm' :
          blurIntensity === 'lg' ? 'backdrop-blur-lg' :
          'backdrop-blur-md'
        } ${
          slideAnimation 
            ? 'translate-y-[calc(100%+8px)] group-hover:translate-y-0' 
            : 'opacity-0 group-hover:opacity-100'
        }`}
      >
         <div className="flex flex-col">
            <span 
              style={{ 
                color: data?.productNameColor || '#000000',
                fontSize: data?.productNameSize || '0.75rem'
              }}
              className="font-bold truncate max-w-[120px]"
            >
              {product.name}
            </span>
            <span 
              style={{ 
                color: data?.priceColor || '#525252',
                fontSize: data?.priceSize || '0.625rem'
              }}
              className="font-medium"
            >
              ${product.price.toFixed(2)}
            </span>
         </div>
         <button 
           onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
           style={{
             backgroundColor: data?.buttonBgColor || '#000000',
             color: data?.buttonTextColor || '#ffffff'
           }}
           className="p-2 rounded-lg hover:opacity-90 transition-opacity"
         >
           <ShoppingBag size={14} />
         </button>
      </div>

      {showWishlist && (
        <div className="absolute top-3 right-3">
           <button className="bg-white/30 backdrop-blur-sm p-1.5 rounded-full text-white hover:bg-white hover:text-black transition-colors opacity-0 group-hover:opacity-100">
             <Star size={14} />
           </button>
        </div>
      )}
    </div>
  );
};

export const PRODUCT_CARD_COMPONENTS = {
  classic: ProductCardClassic,
  industrial: ProductCardIndustrial,
  focus: ProductCardFocus,
  hype: ProductCardHype,
  magazine: ProductCardMagazine,
  glass: ProductCardGlass,
};

export const PRODUCT_CARD_OPTIONS = [
  { id: 'classic', name: 'Classic', description: 'Standard Ecommerce', date: '2024-01-01', popularity: 95 },
  { id: 'industrial', name: 'Industrial', description: 'Tech & Utility', date: '2024-06-15', popularity: 78 },
  { id: 'focus', name: 'Focus', description: 'Minimalist Hover', date: '2024-03-20', popularity: 88 },
  { id: 'hype', name: 'Hype', description: 'Streetwear Energy', date: '2024-09-01', popularity: 82 },
  { id: 'magazine', name: 'Magazine', description: 'Editorial Serif', date: '2024-04-10', popularity: 70 },
  { id: 'glass', name: 'Glass', description: 'Modern Blur UI', date: '2024-10-01', popularity: 92 },
];

export const PRODUCT_GRID_FIELDS: Record<string, string[]> = {
  classic: [
    // Content
    'heading', 'subheading',
    // Card Features
    'showCategory', 'showQuickAdd', 'hoverAnimation',
    // Colors
    'cardBgColor', 'productNameColor', 'priceColor',
    'buttonBgColor', 'buttonTextColor', 'borderColor',
    'categoryColor',
    // Typography
    'productNameSize', 'priceSize',
    // Spacing
    'cardPadding', 'imageBorderRadius'
  ],
  industrial: [
    // Content
    'heading', 'subheading',
    // Card Features
    'showProductId', 'showStock', 'showGrain', 'imageFilter',
    // Colors
    'cardBgColor', 'productNameColor', 'priceColor',
    'buttonBgColor', 'buttonTextColor', 'borderColor',
    'badgeBgColor', 'badgeTextColor',
    // Typography
    'fontFamily', 'textTransform',
    // Layout
    'borderWidth', 'gridLineColor'
  ],
  focus: [
    // Content
    'heading', 'subheading',
    // Card Features
    'overlayOpacity', 'showCategoryOnHover', 'hoverRevealSpeed',
    // Colors
    'overlayColor', 'productNameColor', 'priceColor',
    'buttonBgColor', 'buttonTextColor', 'categoryColor',
    // Typography
    'productNameFont', 'productNameStyle',
    // Animation
    'imageZoom', 'contentTransition'
  ],
  hype: [
    // Content
    'heading', 'subheading',
    // Card Features
    'showNewBadge', 'showLowStockBadge', 'badgeStyle',
    // Colors
    'cardBgColor', 'productNameColor', 'priceColor',
    'buttonBgColor', 'buttonTextColor', 'borderColor',
    'newBadgeBgColor', 'newBadgeTextColor',
    'lowStockBadgeColor',
    // Effects
    'shadowStyle', 'buttonIcon', 'skewAngle',
    // Animation
    'hoverEffect'
  ],
  magazine: [
    // Content
    'heading', 'subheading',
    // Card Features
    'showCategory', 'alignment', 'showDescription',
    // Colors
    'productNameColor', 'priceColor', 'categoryColor',
    'buttonTextColor', 'buttonBorderColor',
    // Typography
    'productNameFont', 'categoryLetterSpacing',
    'productNameSize',
    // Layout
    'textAlignment', 'imageAspectRatio'
  ],
  glass: [
    // Content
    'heading', 'subheading',
    // Card Features
    'showWishlist', 'glassOpacity', 'blurIntensity',
    // Colors
    'cardBgColor', 'productNameColor', 'priceColor',
    'buttonBgColor', 'buttonTextColor', 'borderColor',
    'wishlistColor',
    // Effects
    'backdropBlur', 'borderOpacity',
    // Animation
    'revealDirection', 'hoverScale'
  ],
};
