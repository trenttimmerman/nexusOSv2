
import React, { useState } from 'react';
import { EditableText } from './HeroLibrary';
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Star, Filter, Grid, List } from 'lucide-react';

export const COLLECTION_OPTIONS = [
  { id: 'collection-list', name: 'Collection List', description: 'Grid of collections' },
  { id: 'featured-collection', name: 'Featured Collection', description: 'Grid of products from a collection' },
  { id: 'featured-product', name: 'Featured Product', description: 'Highlight a single product' },
  { id: 'slideshow', name: 'Slideshow', description: 'Rotating carousel of images' },
  { id: 'collection-grid-tight', name: 'Tight Grid', description: 'Dense product grid with no gaps' },
  { id: 'collection-masonry', name: 'Masonry Grid', description: 'Pinterest-style layout' },
  { id: 'collection-carousel', name: 'Product Carousel', description: 'Horizontal scrolling products' },
  { id: 'collection-tabs', name: 'Category Tabs', description: 'Switchable product categories' },
  { id: 'collection-lookbook', name: 'Lookbook', description: 'Editorial style product showcase' },
  { id: 'collection-split', name: 'Split Focus', description: 'Half image, half product grid' },
];

const MOCK_PRODUCTS = [
  { id: 1, name: 'Classic White Tee', price: '$29.00', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
  { id: 2, name: 'Denim Jacket', price: '$89.00', image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600&q=80' },
  { id: 3, name: 'Leather Boots', price: '$149.00', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80' },
  { id: 4, name: 'Summer Hat', price: '$34.00', image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&q=80' },
  { id: 5, name: 'Sunglasses', price: '$120.00', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80' },
  { id: 6, name: 'Watch', price: '$199.00', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80' },
];

export const COLLECTION_COMPONENTS: Record<string, React.FC<any>> = {
  'collection-list': ({ data, isEditable, onUpdate, products }) => (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <EditableText
          value={data?.heading || 'Shop by Category'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['New Arrivals', 'Best Sellers', 'Sale'].map((title, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
              <img 
                src={`https://images.unsplash.com/photo-${i === 0 ? '1483985988355-763728e1935b' : i === 1 ? '1485968579580-b6d095142e6e' : '1496747611176-843222e1e57c'}?w=600&q=80`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={title}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              {title} <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </h3>
          </div>
        ))}
      </div>
    </div>
  ),

  'featured-collection': ({ data, isEditable, onUpdate, products }) => {
    const displayProducts = (products && products.length > 0) ? products : MOCK_PRODUCTS;
    const isDark = data?.darkMode;
    const isFullWidth = data?.fullWidth;
    const sectionStyle = data?.sectionStyle || 'clean';

    return (
      <div className={`py-20 px-6 ${isFullWidth ? 'max-w-full' : 'max-w-7xl'} mx-auto ${isDark ? 'bg-neutral-950 text-white' : ''}`}>
        <div className={`flex justify-between items-end mb-12 ${sectionStyle === 'bordered' ? 'border-b border-neutral-200 pb-8' : ''}`}>
          <div>
            <EditableText
              value={data?.heading || 'Featured Collection'}
              onChange={(val) => onUpdate?.({ ...data, heading: val })}
              isEditable={isEditable}
              className="text-3xl font-bold mb-2"
            />
            <p className={`${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>{data?.subheading || 'Curated picks for the season'}</p>
          </div>
          <button className={`hidden md:flex items-center gap-2 font-bold ${isDark ? 'hover:text-neutral-300' : 'hover:text-gray-600'} transition-colors`}>
            View All <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className={`aspect-[3/4] ${isDark ? 'bg-neutral-900' : 'bg-gray-100'} rounded-xl overflow-hidden mb-4 relative ${sectionStyle === 'glass' ? 'backdrop-blur-md bg-white/5 border border-white/10' : ''}`}>
                <img 
                  src={product.image || (product as any).image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={product.name}
                />
                <button className={`absolute bottom-4 right-4 w-10 h-10 ${isDark ? 'bg-neutral-800 text-white' : 'bg-white text-black'} rounded-full flex items-center justify-center shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-600 hover:text-white`}>
                  <ShoppingBag size={18} />
                </button>
              </div>
              <h3 className="font-medium mb-1">{product.name}</h3>
              <p className={isDark ? 'text-neutral-400' : 'text-gray-600'}>{typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center md:hidden">
          <button className={`px-8 py-3 border rounded-full font-bold ${isDark ? 'border-white' : 'border-black'}`}>
            View All Products
          </button>
        </div>
      </div>
    );
  },

  'featured-product': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto bg-gray-50 rounded-3xl my-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square bg-white rounded-2xl overflow-hidden p-8 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" 
            className="max-w-full max-h-full object-contain hover:scale-110 transition-transform duration-500"
            alt="Featured Product"
          />
        </div>
        <div>
          <div className="text-blue-600 font-bold mb-2">New Release</div>
          <EditableText
            value={data?.heading || 'Nike Air Max 270'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl md:text-5xl font-black mb-6"
          />
          <div className="text-3xl font-bold mb-6">$150.00</div>
          <p className="text-gray-600 mb-8 leading-relaxed">
            The Nike Air Max 270 delivers visible air under every step. Updated for modern comfort, it nods to the original 1991 Air Max 180 with its exaggerated tongue top and heritage tongue logo.
          </p>
          <div className="flex gap-4 mb-8">
            {['US 7', 'US 8', 'US 9', 'US 10', 'US 11'].map(size => (
              <button key={size} className="w-12 h-12 border rounded-lg hover:border-black hover:bg-black hover:text-white transition-colors text-sm font-bold">
                {size}
              </button>
            ))}
          </div>
          <button className="w-full md:w-auto px-12 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
            Add to Cart <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  ),

  'slideshow': ({ data, isEditable, onUpdate }) => (
    <div className="relative h-[600px] overflow-hidden group">
      <div className="absolute inset-0 flex transition-transform duration-500">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80" 
          className="w-full h-full object-cover"
          alt="Slide 1"
        />
      </div>
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <EditableText
          value={data?.heading || 'Summer Collection'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-5xl md:text-7xl font-bold mb-6"
        />
        <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
          Explore Now
        </button>
      </div>
      <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors opacity-0 group-hover:opacity-100">
        <ChevronLeft size={24} />
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors opacity-0 group-hover:opacity-100">
        <ChevronRight size={24} />
      </button>
    </div>
  ),

  'collection-grid-tight': ({ data, isEditable, onUpdate, products }) => {
    const displayProducts = (products && products.length > 0) ? products : MOCK_PRODUCTS;
    const isDark = data?.darkMode;
    const isFullWidth = data?.fullWidth;
    const sectionStyle = data?.sectionStyle || 'clean';

    return (
      <div className={`py-20 ${isDark ? 'bg-neutral-950 text-white' : ''} ${sectionStyle === 'bordered' ? 'border-y border-neutral-200' : ''}`}>
        <div className={`text-center mb-12 ${isFullWidth ? 'px-6' : 'max-w-7xl mx-auto px-6'}`}>
          <EditableText
            value={data?.heading || 'Insta Shop'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-3xl font-bold"
          />
          {data?.subheading && <p className="mt-2 text-neutral-500">{data.subheading}</p>}
        </div>
        <div className={`grid grid-cols-2 md:grid-cols-4 ${isFullWidth ? '' : 'max-w-7xl mx-auto'}`}>
          {displayProducts.map((product, i) => (
            <div key={i} className="aspect-square relative group cursor-pointer overflow-hidden">
              <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
                <h4 className="font-bold text-lg mb-1">{product.name}</h4>
                <p className="mb-4 text-white/80">{typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}</p>
                <div className="flex gap-2">
                   <button className="px-6 py-2 bg-white text-black font-bold rounded-full text-xs hover:bg-gray-200 transition-colors">Quick Add</button>
                   <button className="w-8 h-8 flex items-center justify-center bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors">
                     <ShoppingBag size={14} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },

  'collection-masonry': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="columns-2 md:columns-3 gap-6 space-y-6">
        {MOCK_PRODUCTS.concat(MOCK_PRODUCTS).map((product, i) => (
          <div key={i} className="break-inside-avoid group cursor-pointer">
            <div className="bg-gray-100 rounded-2xl overflow-hidden mb-3">
              <img 
                src={product.image} 
                className="w-full object-cover hover:scale-105 transition-transform duration-500" 
                style={{ height: i % 2 === 0 ? '400px' : '300px' }}
                alt={product.name} 
              />
            </div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  'collection-carousel': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 overflow-hidden">
      <div className="px-6 max-w-7xl mx-auto mb-8 flex justify-between items-end">
        <EditableText
          value={data?.heading || 'New Arrivals'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold"
        />
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors"><ChevronLeft size={20} /></button>
          <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>
      <div className="flex gap-6 px-6 max-w-7xl mx-auto overflow-x-auto pb-8 scrollbar-hide snap-x">
        {MOCK_PRODUCTS.concat(MOCK_PRODUCTS).map((product, i) => (
          <div key={i} className="min-w-[280px] snap-start group cursor-pointer">
            <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
              <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
              <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded">NEW</div>
            </div>
            <h3 className="font-bold mb-1">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  'collection-tabs': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <EditableText
          value={data?.heading || 'Our Favorites'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold mb-8"
        />
        <div className="flex justify-center gap-4 flex-wrap">
          {['All', 'Clothing', 'Accessories', 'Shoes', 'Sale'].map((tab, i) => (
            <button 
              key={i} 
              className={`px-6 py-2 rounded-full font-bold transition-colors ${i === 0 ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {MOCK_PRODUCTS.slice(0, 8).map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
              <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
            </div>
            <h3 className="font-bold mb-1">{product.name}</h3>
            <p className="text-gray-600">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  ),

  'collection-lookbook': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" className="w-full h-full object-cover" alt="Lookbook" />
          {/* Hotspots */}
          <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-white rounded-full cursor-pointer shadow-lg animate-pulse hover:scale-125 transition-transform" />
          <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-white rounded-full cursor-pointer shadow-lg animate-pulse hover:scale-125 transition-transform" />
        </div>
        <div>
          <div className="text-sm font-bold tracking-widest text-gray-500 mb-4 uppercase">Look 01</div>
          <EditableText
            value={data?.heading || 'Urban Explorer'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl font-bold mb-8"
          />
          <div className="space-y-6">
            {MOCK_PRODUCTS.slice(0, 2).map((product) => (
              <div key={product.id} className="flex gap-4 items-center group cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold mb-1">{product.name}</h4>
                  <p className="text-gray-600 mb-2">{product.price}</p>
                  <button className="text-sm font-bold underline">View Product</button>
                </div>
                <button className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                  <ShoppingBag size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),

  'collection-split': ({ data, isEditable, onUpdate }) => (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex-1 relative bg-gray-100">
        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80" className="absolute inset-0 w-full h-full object-cover" alt="Collection" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-12">
          <h2 className="text-5xl font-bold mb-6">Summer 2024</h2>
          <p className="text-xl mb-8 max-w-md">Discover the new collection inspired by the coast.</p>
          <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">Shop Now</button>
        </div>
      </div>
      <div className="flex-1 bg-white p-12 overflow-y-auto">
        <div className="grid grid-cols-2 gap-6">
          {MOCK_PRODUCTS.concat(MOCK_PRODUCTS).map((product, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3">
                <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
              </div>
              <h3 className="font-bold text-sm mb-1">{product.name}</h3>
              <p className="text-gray-500 text-sm">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
