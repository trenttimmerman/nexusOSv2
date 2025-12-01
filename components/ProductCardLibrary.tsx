
import React from 'react';
import { ShoppingBag, Plus, Star, ArrowRight, Zap, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  primaryColor?: string;
}

// 1. Classic (Clean, Standard, Minimal)
export const ProductCardClassic: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="group">
    <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden rounded-xl mb-4">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-white text-black py-3 rounded-lg font-bold shadow-lg hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} /> Add to Cart
        </button>
      </div>
    </div>
    <div>
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-neutral-900 leading-tight">{product.name}</h3>
        <span className="font-medium text-neutral-900">${(product.price / 100).toFixed(2)}</span>
      </div>
      <p className="text-sm text-neutral-500 mt-1">{product.category}</p>
    </div>
  </div>
);

// 2. Industrial (Tech, Borders, Mono)
export const ProductCardIndustrial: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="group border border-neutral-200 bg-white hover:border-black transition-colors duration-300 p-2 relative">
    <div className="absolute top-2 left-2 z-10 bg-black text-white text-[10px] font-mono px-2 py-1 uppercase tracking-wider">
      ID: {product.id}
    </div>
    <div className="aspect-square bg-neutral-100 overflow-hidden mb-3 border border-neutral-100 relative">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
    </div>
    <div className="font-mono">
      <div className="flex justify-between items-center text-xs text-neutral-500 border-b border-neutral-100 pb-2 mb-2 uppercase tracking-tight">
        <span>{product.category}</span>
        <span>In Stock: {product.stock}</span>
      </div>
      <h3 className="font-bold text-sm uppercase mb-1 truncate">{product.name}</h3>
      <div className="flex justify-between items-center mt-3">
        <span className="font-bold text-lg">${(product.price / 100).toFixed(2)}</span>
        <button 
          onClick={() => onAddToCart(product)}
          className="bg-black text-white p-2 hover:bg-neutral-800 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  </div>
);

// 3. Focus (Image First, Reveal on Hover)
export const ProductCardFocus: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="group relative aspect-[3/4] overflow-hidden cursor-pointer">
    <img 
      src={product.image} 
      alt={product.name} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>
    
    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
      <span className="text-xs font-medium uppercase tracking-widest mb-2 opacity-80">{product.category}</span>
      <h3 className="text-2xl font-serif italic mb-2">{product.name}</h3>
      <p className="text-lg font-light mb-6">${(product.price / 100).toFixed(2)}</p>
      <button 
        onClick={() => onAddToCart(product)}
        className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-neutral-200 transition-colors"
      >
        Quick Add
      </button>
    </div>
  </div>
);

// 4. Hype (Streetwear, Bold, Badges)
export const ProductCardHype: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
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
    
    <div className="aspect-[4/5] bg-neutral-100 border-2 border-black rounded-xl overflow-hidden mb-3 relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
       <img src={product.image} className="w-full h-full object-cover" />
       <button 
         onClick={() => onAddToCart(product)}
         className="absolute bottom-4 right-4 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
       >
         <Zap size={20} fill="currentColor" />
       </button>
    </div>

    <div className="px-1">
       <h3 className="font-black text-xl uppercase italic leading-none mb-1">{product.name}</h3>
       <span className="font-bold text-neutral-500">${(product.price / 100).toFixed(2)}</span>
    </div>
  </div>
);

// 5. Magazine (Editorial, Serif, Descriptions)
export const ProductCardMagazine: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="group cursor-pointer">
    <div className="mb-4 overflow-hidden">
       <img 
         src={product.image} 
         className="w-full aspect-[3/4] object-cover hover:opacity-90 transition-opacity" 
       />
    </div>
    <div className="text-center">
       <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2 block">
         {product.category}
       </span>
       <h3 className="font-serif text-2xl mb-1 group-hover:underline underline-offset-4 decoration-1">
         {product.name}
       </h3>
       <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm font-medium">${(product.price / 100).toFixed(2)}</span>
       </div>
       <button 
         onClick={() => onAddToCart(product)}
         className="text-xs font-bold border-b border-black pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors uppercase tracking-wide"
       >
         Add to Bag
       </button>
    </div>
  </div>
);

// 6. Glass (Modern, Blur, Overlay)
export const ProductCardGlass: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
    <img 
      src={product.image} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    
    <div className="absolute inset-x-2 bottom-2 p-3 bg-white/70 backdrop-blur-md border border-white/50 rounded-xl flex items-center justify-between transition-transform duration-300 translate-y-[calc(100%+8px)] group-hover:translate-y-0 shadow-lg">
       <div className="flex flex-col">
          <span className="text-xs font-bold text-black truncate max-w-[120px]">{product.name}</span>
          <span className="text-[10px] font-medium text-neutral-600">${(product.price / 100).toFixed(2)}</span>
       </div>
       <button 
         onClick={() => onAddToCart(product)}
         className="bg-black text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
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
