
import React, { useState } from 'react';
import { EditableText, EditableImage } from './HeroLibrary';
import { ArrowRight, Image as ImageIcon, Layout, Columns, Grid, Check, Plus, Minus, ChevronDown, Star, Shield, Truck, RefreshCw, MessageSquare } from 'lucide-react';

export const LAYOUT_OPTIONS = [
  { id: 'layout-image-text', name: 'Image with Text', description: 'Side-by-side image and text block' },
  { id: 'layout-multirow', name: 'Multi-row', description: 'Alternating rows of content' },
  { id: 'layout-multicolumn', name: 'Multi-column', description: 'Grid of content columns' },
  { id: 'layout-collage', name: 'Collage', description: 'Creative image grid layout' },
  { id: 'layout-banner', name: 'Image Banner', description: 'Full width banner with overlay' },
  { id: 'layout-stats', name: 'Statistics', description: 'Key numbers and metrics' },
  { id: 'layout-timeline', name: 'Timeline', description: 'Vertical timeline of events' },
  { id: 'layout-features', name: 'Feature Grid', description: 'Grid of features with icons' },
  { id: 'layout-accordion', name: 'Accordion', description: 'Expandable content sections' },
  { id: 'layout-tabs', name: 'Content Tabs', description: 'Tabbed content switcher' },
];

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';

export const LAYOUT_COMPONENTS: Record<string, React.FC<any>> = {
  'layout-image-text': ({ data, isEditable, onUpdate }) => (
    <div className="py-16 px-6 max-w-7xl mx-auto">
      <div className={`flex flex-col md:flex-row gap-12 items-center ${data?.reverse ? 'md:flex-row-reverse' : ''}`}>
        <div className="flex-1 w-full">
          <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden relative group">
            <EditableImage 
              src={data?.image || DEFAULT_IMG} 
              onChange={(val) => onUpdate?.({ ...data, image: val })}
              isEditable={isEditable}
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <EditableText
            value={data?.heading || 'Tell Your Story'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-3xl md:text-4xl font-bold mb-6"
          />
          <EditableText
            value={data?.text || 'Pair text with an image to focus on your chosen product, collection, or blog post. Add details on availability, style, or even provide a review.'}
            onChange={(val) => onUpdate?.({ ...data, text: val })}
            isEditable={isEditable}
            className="text-lg text-gray-600 mb-8 leading-relaxed"
          />
          <button className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            Learn More <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  ),

  'layout-multirow': ({ data, isEditable, onUpdate }) => (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-24">
      {[1, 2].map((row, i) => (
        <div key={i} className={`flex flex-col md:flex-row gap-12 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
          <div className="flex-1 w-full">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-${i === 0 ? '1523381210434-271e8be1f52b' : '1515886657613-9f3515b0c78f'}?w=800&q=80`} 
                alt="Feature" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4">Feature Row {row}</h3>
            <p className="text-gray-600 mb-6">
              Share information about your brand with your customers. Describe a product, make announcements, or welcome customers to your store.
            </p>
            <button className="text-black font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  ),

  'layout-multicolumn': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <EditableText
          value={data?.heading || 'Why Choose Us'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold mb-4"
        />
      </div>
      <div className="grid md:grid-cols-3 gap-12">
        {[1, 2, 3].map((col) => (
          <div key={col} className="text-center">
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl mb-6 overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-${col === 1 ? '1441984904996-e0b6ba687e04' : col === 2 ? '1516762689617-e1cffcef479d' : '1472851294608-462821292c78'}?w=600&q=80`}
                className="w-full h-full object-cover"
                alt="Column"
              />
            </div>
            <h3 className="text-xl font-bold mb-3">Column Title {col}</h3>
            <p className="text-gray-600">
              Share details about your shipping policies, return policies, or customer service.
            </p>
          </div>
        ))}
      </div>
    </div>
  ),

  'layout-collage': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
        <div className="col-span-2 row-span-2 bg-gray-100 rounded-2xl overflow-hidden relative group">
          <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Collage 1" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
          <div className="absolute bottom-6 left-6 text-white font-bold text-2xl">New Arrivals</div>
        </div>
        <div className="bg-gray-100 rounded-2xl overflow-hidden relative group">
          <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Collage 2" />
        </div>
        <div className="bg-gray-100 rounded-2xl overflow-hidden relative group">
          <img src="https://images.unsplash.com/photo-1529139574466-a302358e3381?w=600&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Collage 3" />
        </div>
        <div className="col-span-2 bg-gray-100 rounded-2xl overflow-hidden relative group">
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Collage 4" />
          <div className="absolute bottom-6 left-6 text-white font-bold text-xl">Limited Edition</div>
        </div>
      </div>
    </div>
  ),

  'layout-banner': ({ data, isEditable, onUpdate }) => (
    <div className="relative h-[400px] w-full overflow-hidden">
      <EditableImage 
        src={data?.image || DEFAULT_IMG} 
        onChange={(val) => onUpdate?.({ ...data, image: val })}
        isEditable={isEditable}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <EditableText
          value={data?.heading || 'Mid-Season Sale'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-5xl font-bold mb-4"
        />
        <p className="text-xl mb-8">Up to 50% off selected items</p>
        <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
          Shop Sale
        </button>
      </div>
    </div>
  ),

  'layout-stats': ({ data, isEditable, onUpdate }) => (
    <div className="py-24 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {[
          { label: 'Happy Customers', value: '50k+' },
          { label: 'Products Sold', value: '120k+' },
          { label: 'Countries Served', value: '25+' },
          { label: 'Years Active', value: '10' }
        ].map((stat, i) => (
          <div key={i}>
            <div className="text-4xl md:text-6xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">{stat.value}</div>
            <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  'layout-timeline': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <EditableText
          value={data?.heading || 'Our Journey'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold"
        />
      </div>
      <div className="space-y-12 relative before:absolute before:left-4 md:before:left-1/2 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
        {[
          { year: '2015', title: 'The Beginning', desc: 'Started in a small garage with a big dream.' },
          { year: '2018', title: 'First Store', desc: 'Opened our flagship store in New York City.' },
          { year: '2020', title: 'Global Expansion', desc: 'Launched international shipping to 20+ countries.' },
          { year: '2023', title: 'Sustainability', desc: 'Committed to 100% eco-friendly materials.' }
        ].map((item, i) => (
          <div key={i} className={`flex flex-col md:flex-row gap-8 items-start md:items-center relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 md:text-right pl-12 md:pl-0">
              <div className={`font-bold text-2xl mb-1 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>{item.year}</div>
              <h4 className={`font-bold text-lg mb-2 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>{item.title}</h4>
              <p className={`text-gray-600 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>{item.desc}</p>
            </div>
            <div className="absolute left-4 md:left-1/2 -translate-x-[5px] w-3 h-3 bg-black rounded-full border-4 border-white shadow-sm z-10" />
            <div className="flex-1 hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  ),

  'layout-features': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $100' },
          { icon: Shield, title: 'Secure Payment', desc: '100% secure payment processing' },
          { icon: RefreshCw, title: 'Easy Returns', desc: '30-day money back guarantee' },
          { icon: Star, title: 'Top Quality', desc: 'Finest materials used' },
          { icon: MessageSquare, title: '24/7 Support', desc: 'Dedicated support team' },
          { icon: Layout, title: 'Modern Design', desc: 'Award winning aesthetics' }
        ].map((item, i) => (
          <div key={i} className="flex gap-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center shrink-0">
              <item.icon size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'layout-accordion': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <EditableText
          value={data?.heading || 'Product Details'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold"
        />
      </div>
      <div className="space-y-4">
        {['Materials & Care', 'Shipping Information', 'Size Guide', 'Sustainability'].map((title, i) => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left font-bold">
              {title}
              <ChevronDown size={20} />
            </button>
            {i === 0 && (
              <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t bg-gray-50">
                Made from 100% organic cotton. Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ),

  'layout-tabs': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-center gap-8 mb-12 border-b">
        {['Description', 'Specifications', 'Reviews'].map((tab, i) => (
          <button 
            key={i} 
            className={`pb-4 font-bold text-lg transition-colors ${i === 0 ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="max-w-3xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">Premium Quality</h3>
        <p className="text-gray-600 leading-relaxed mb-8">
          Crafted with precision and care, our products are designed to last. We use only the finest materials sourced from sustainable suppliers around the globe. Every stitch is a testament to our commitment to quality.
        </p>
        <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-8 rounded-2xl">
          <div>
            <span className="text-gray-500 text-sm">Material</span>
            <div className="font-bold">100% Cotton</div>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Weight</span>
            <div className="font-bold">240 GSM</div>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Fit</span>
            <div className="font-bold">Relaxed</div>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Origin</span>
            <div className="font-bold">Portugal</div>
          </div>
        </div>
      </div>
    </div>
  ),
};
