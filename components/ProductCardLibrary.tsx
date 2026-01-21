
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
    cardBgColor?: string;
    productNameColor?: string;
    priceColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    borderColor?: string;
  };
}

// 1. Classic (Clean, Standard, Minimal)
export const ProductCardClassic: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => (
  <div className="group">
    <div 
      className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl mb-4 cursor-pointer"
      onClick={onNavigate}
    >
      {product.image && (
        <img 
          src={getProductImage(product)} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
      )}
      <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          style={{
            backgroundColor: data?.buttonBgColor || '#ffffff',
            color: data?.buttonTextColor || '#000000'
          }}
          className="w-full py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Add to Cart
        </button>
      </div>
    </div>
    <div>
      <div className="flex justify-between items-start">
        <h3 
          style={{ color: data?.productNameColor || '#171717' }}
          className="font-bold text-lg leading-tight cursor-pointer hover:underline" 
          onClick={onNavigate}
        >
          {product.name}
        </h3>
        <span 
          style={{ color: data?.priceColor || '#171717' }}
          className="font-medium"
        >
          ${product.price.toFixed(2)}
        </span>
      </div>
      <p className="text-sm text-neutral-500 mt-1">{product.category}</p>
    </div>
  </div>
);

// 2. Industrial (Tech, Borders, Mono)
export const ProductCardIndustrial: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => (
  <div 
    style={{ 
      borderColor: data?.borderColor || '#e5e7eb',
      backgroundColor: data?.cardBgColor || '#ffffff'
    }}
    className="group border hover:border-opacity-80 transition-colors duration-300 p-2 relative"
  >
    <div className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] font-mono px-2 py-1 uppercase tracking-wider">
      ID: {product.id}
    </div>
    <div 
      className="aspect-square bg-neutral-100 overflow-hidden mb-3 border border-neutral-100 relative cursor-pointer"
      onClick={onNavigate}
    >
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
        />
      )}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
    </div>
    <div className="font-mono">
      <div className="flex justify-between items-center text-xs text-neutral-500 border-b border-neutral-100 pb-2 mb-2 uppercase tracking-tight">
        <span>{product.category}</span>
        <span>In Stock: {product.stock}</span>
      </div>
      <h3 
        style={{ color: data?.productNameColor || '#000000' }}
        className="font-bold text-sm uppercase mb-1 truncate cursor-pointer hover:opacity-70" 
        onClick={onNavigate}
      >
        {product.name}
      </h3>
      <div className="flex justify-between items-center mt-3">
        <span 
          style={{ color: data?.priceColor || '#000000' }}
          className="font-bold text-lg"
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

// 3. Focus (Image First, Reveal on Hover)
export const ProductCardFocus: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => (
  <div 
    className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
    onClick={onNavigate}
  >
    {product.image && (
      <img 
        src={getProductImage(product)} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
    )}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>
    
    <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
      <span className="text-xs font-medium uppercase tracking-widest mb-2 opacity-80">{product.category}</span>
      <h3 
        style={{ color: data?.productNameColor || '#ffffff' }}
        className="text-2xl font-serif italic mb-2"
      >
        {product.name}
      </h3>
      <p 
        style={{ color: data?.priceColor || '#ffffff' }}
        className="text-lg font-light mb-6"
      >
        ${product.price.toFixed(2)}
      </p>
      <button 
        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
        style={{
          backgroundColor: data?.buttonBgColor || '#ffffff',
          color: data?.buttonTextColor || '#000000'
        }}
        className="w-full py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
      >
        Quick Add
      </button>
    </div>
  </div>
);

// 4. Hype (Streetwear, Bold, Badges)
export const ProductCardHype: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => (
  <div className="group relative">
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
      <span className="bg-[#ccff00] text-black text-xs font-black uppercase italic px-3 py-1 transform -skew-x-12 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        New Drop
      </span>
      {product.stock < 10 && (
         <span className="bg-red-500 text-white text-xs font-black uppercase italic px-3 py-1 transform -skew-x-12 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
           Low Stock
         </span>
      )}
    </div>
    
    <div 
      style={{
        borderColor: data?.borderColor || '#000000',
        backgroundColor: data?.cardBgColor || '#f5f5f5'
      }}
      className="aspect-[4/5] border-2 rounded-xl overflow-hidden mb-3 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
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
         <Zap size={20} fill="currentColor" />
       </button>
    </div>

    <div className="px-1">
       <h3 
         style={{ color: data?.productNameColor || '#000000' }}
         className="font-black text-xl uppercase italic leading-none mb-1 cursor-pointer hover:underline" 
         onClick={onNavigate}
       >
         {product.name}
       </h3>
       <span 
         style={{ color: data?.priceColor || '#737373' }}
         className="font-bold"
       >
         ${product.price.toFixed(2)}
       </span>
    </div>
  </div>
);

// 5. Magazine (Editorial, Serif, Descriptions)
export const ProductCardMagazine: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => (
  <div className="group cursor-pointer" onClick={onNavigate}>
    <div className="mb-4 overflow-hidden">
       {product.image && (
         <img 
           src={product.image} 
           className="w-full aspect-[3/4] object-cover hover:opacity-90 transition-opacity" 
         />
       )}
    </div>
    <div className="text-center">
       <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2 block">
         {product.category}
       </span>
       <h3 
         style={{ color: data?.productNameColor || '#000000' }}
         className="font-serif text-2xl mb-1 group-hover:underline underline-offset-4 decoration-1"
       >
         {product.name}
       </h3>
       <div className="flex items-center justify-center gap-2 mb-4">
          <span 
            style={{ color: data?.priceColor || '#000000' }}
            className="text-sm font-medium"
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

// 6. Glass (Modern, Blur, Overlay)
export const ProductCardGlass: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate, data }) => (
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
        backgroundColor: data?.cardBgColor ? `${data.cardBgColor}b3` : 'rgba(255,255,255,0.7)',
        borderColor: data?.borderColor ? `${data.borderColor}80` : 'rgba(255,255,255,0.5)'
      }}
      className="absolute inset-x-2 bottom-2 p-3 backdrop-blur-md border rounded-xl flex items-center justify-between transition-transform duration-300 translate-y-[calc(100%+8px)] group-hover:translate-y-0 shadow-lg"
    >
       <div className="flex flex-col">
          <span 
            style={{ color: data?.productNameColor || '#000000' }}
            className="text-xs font-bold truncate max-w-[120px]"
          >
            {product.name}
          </span>
          <span 
            style={{ color: data?.priceColor || '#525252' }}
            className="text-[10px] font-medium"
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

    <div className="absolute top-3 right-3">
       <button className="bg-white/30 backdrop-blur-sm p-1.5 rounded-full text-white hover:bg-white hover:text-black transition-colors opacity-0 group-hover:opacity-100">
         <Star size={14} />
       </button>
    </div>
  </div>
);

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
