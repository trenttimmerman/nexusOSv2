
import React, { useState } from 'react';
import { EditableText } from './HeroLibrary';
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
            <img 
              src={data?.image || DEFAULT_IMG} 
              alt="Feature" 
              className="w-full h-full object-cover"
            />
            {isEditable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <ImageIcon size={16} /> Change Image
                </button>
              </div>
            )}
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
          <button 
            onClick={() => {
              if (isEditable) return;
              const link = data?.buttonLink === 'external' ? data?.buttonExternalUrl : data?.buttonLink;
              if (link) window.location.href = link;
            }}
            className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            {data?.buttonText || 'Learn More'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  ),

  'layout-multirow': ({ data, isEditable, onUpdate }) => (
    <div className="py-16 px-6 max-w-7xl mx-auto space-y-24">
      {[0, 1].map((idx) => {
        const handleButtonClick = () => {
          if (isEditable) return;
          const link = data?.[`row${idx}ButtonLink`] === 'external' 
            ? data?.[`row${idx}ButtonExternalUrl`] 
            : data?.[`row${idx}ButtonLink`];
          if (link) window.location.href = link;
        };

        return (
          <div key={idx} className={`flex flex-col md:flex-row gap-12 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1 w-full">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <img 
                  src={data?.[`row${idx}Image`] || `https://images.unsplash.com/photo-${idx === 0 ? '1523381210434-271e8be1f52b' : '1515886657613-9f3515b0c78f'}?w=800&q=80`} 
                  alt="Feature" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <EditableText
                value={data?.[`row${idx}Title`] || `Feature Row ${idx + 1}`}
                onChange={(val) => onUpdate?.({ ...data, [`row${idx}Title`]: val })}
                isEditable={isEditable}
                className="text-2xl font-bold mb-4"
                tagName="h3"
              />
              <EditableText
                value={data?.[`row${idx}Description`] || 'Share information about your brand with your customers. Describe a product, make announcements, or welcome customers to your store.'}
                onChange={(val) => onUpdate?.({ ...data, [`row${idx}Description`]: val })}
                isEditable={isEditable}
                className="text-gray-600 mb-6"
                tagName="p"
              />
              <button 
                onClick={handleButtonClick}
                className="text-black font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
              >
                {data?.[`row${idx}ButtonText`] || 'View Details'}
              </button>
            </div>
          </div>
        );
      })}
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
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="text-center">
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl mb-6 overflow-hidden">
              <img 
                src={data?.[`col${idx}Image`] || `https://images.unsplash.com/photo-${idx === 0 ? '1441984904996-e0b6ba687e04' : idx === 1 ? '1516762689617-e1cffcef479d' : '1472851294608-462821292c78'}?w=600&q=80`}
                className="w-full h-full object-cover"
                alt="Column"
              />
            </div>
            <EditableText
              value={data?.[`col${idx}Title`] || `Column Title ${idx + 1}`}
              onChange={(val) => onUpdate?.({ ...data, [`col${idx}Title`]: val })}
              isEditable={isEditable}
              className="text-xl font-bold mb-3"
              tagName="h3"
            />
            <EditableText
              value={data?.[`col${idx}Description`] || 'Share details about your shipping policies, return policies, or customer service.'}
              onChange={(val) => onUpdate?.({ ...data, [`col${idx}Description`]: val })}
              isEditable={isEditable}
              className="text-gray-600"
              tagName="p"
            />
          </div>
        ))}
      </div>
    </div>
  ),

  'layout-collage': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
        <div className="col-span-2 row-span-2 bg-gray-100 rounded-2xl overflow-hidden relative group">
          <img 
            src={data?.collageImage0 || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80'} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Collage 1" 
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
          <div className="absolute bottom-6 left-6 text-white font-bold text-2xl">
            <EditableText
              value={data?.collageLabel0 || 'New Arrivals'}
              onChange={(val) => onUpdate?.({ ...data, collageLabel0: val })}
              isEditable={isEditable}
              className="text-white"
            />
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl overflow-hidden relative group">
          <img 
            src={data?.collageImage1 || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Collage 2" 
          />
        </div>
        <div className="bg-gray-100 rounded-2xl overflow-hidden relative group">
          <img 
            src={data?.collageImage2 || 'https://images.unsplash.com/photo-1529139574466-a302358e3381?w=600&q=80'} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Collage 3" 
          />
        </div>
        <div className="col-span-2 bg-gray-100 rounded-2xl overflow-hidden relative group">
          <img 
            src={data?.collageImage3 || 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            alt="Collage 4" 
          />
          <div className="absolute bottom-6 left-6 text-white font-bold text-xl">
            <EditableText
              value={data?.collageLabel3 || 'Limited Edition'}
              onChange={(val) => onUpdate?.({ ...data, collageLabel3: val })}
              isEditable={isEditable}
              className="text-white"
            />
          </div>
        </div>
      </div>
    </div>
  ),

  'layout-banner': ({ data, isEditable, onUpdate }) => (
    <div className="relative h-[400px] w-full overflow-hidden">
      <img 
        src={data?.image || DEFAULT_IMG} 
        className="absolute inset-0 w-full h-full object-cover"
        alt="Banner"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
        <EditableText
          value={data?.heading || 'Mid-Season Sale'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-5xl font-bold mb-4"
        />
        <EditableText
          value={data?.subheading || 'Up to 50% off selected items'}
          onChange={(val) => onUpdate?.({ ...data, subheading: val })}
          isEditable={isEditable}
          className="text-xl mb-8"
          tagName="p"
        />
        <button 
          onClick={() => {
            if (isEditable) return;
            const link = data?.buttonLink === 'external' ? data?.buttonExternalUrl : data?.buttonLink;
            if (link) window.location.href = link;
          }}
          className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
        >
          {data?.buttonText || 'Shop Sale'}
        </button>
      </div>
    </div>
  ),

  'layout-stats': ({ data, isEditable, onUpdate }) => (
    <div className="py-24 px-6 bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx}>
            <EditableText
              value={data?.[`stat${idx}Value`] || (idx === 0 ? '50k+' : idx === 1 ? '98%' : idx === 2 ? '24/7' : '100+')}
              onChange={(val) => onUpdate?.({ ...data, [`stat${idx}Value`]: val })}
              isEditable={isEditable}
              className="text-4xl md:text-5xl font-bold mb-2"
              tagName="div"
            />
            <EditableText
              value={data?.[`stat${idx}Label`] || (idx === 0 ? 'Happy Customers' : idx === 1 ? 'Satisfaction Rate' : idx === 2 ? 'Support' : 'Products')}
              onChange={(val) => onUpdate?.({ ...data, [`stat${idx}Label`]: val })}
              isEditable={isEditable}
              className="text-gray-400 text-sm uppercase tracking-wider"
              tagName="p"
            />
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
        {[0, 1, 2, 3].map((idx, i) => {
          const defaultData = [
            { year: '2015', title: 'The Beginning', desc: 'Started in a small garage with a big dream.' },
            { year: '2018', title: 'First Store', desc: 'Opened our flagship store in New York City.' },
            { year: '2020', title: 'Global Expansion', desc: 'Launched international shipping to 20+ countries.' },
            { year: '2023', title: 'Sustainability', desc: 'Committed to 100% eco-friendly materials.' }
          ];
          
          return (
            <div key={idx} className={`flex flex-col md:flex-row gap-8 items-start md:items-center relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="flex-1 md:text-right pl-12 md:pl-0">
                <EditableText
                  value={data?.[`timeline${idx}Year`] || defaultData[idx].year}
                  onChange={(val) => onUpdate?.({ ...data, [`timeline${idx}Year`]: val })}
                  isEditable={isEditable}
                  className={`font-bold text-2xl mb-1 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                  tagName="div"
                />
                <EditableText
                  value={data?.[`timeline${idx}Title`] || defaultData[idx].title}
                  onChange={(val) => onUpdate?.({ ...data, [`timeline${idx}Title`]: val })}
                  isEditable={isEditable}
                  className={`font-bold text-lg mb-2 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                  tagName="h4"
                />
                <EditableText
                  value={data?.[`timeline${idx}Description`] || defaultData[idx].desc}
                  onChange={(val) => onUpdate?.({ ...data, [`timeline${idx}Description`]: val })}
                  isEditable={isEditable}
                  className={`text-gray-600 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}
                  tagName="p"
                />
              </div>
              <div className="absolute left-4 md:left-1/2 -translate-x-[5px] w-3 h-3 bg-black rounded-full border-4 border-white shadow-sm z-10" />
              <div className="flex-1 hidden md:block" />
            </div>
          );
        })}
      </div>
    </div>
  ),

  'layout-features': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const icons = [Truck, Shield, RefreshCw, Star, MessageSquare, Layout];
          const defaultData = [
            { title: 'Free Shipping', desc: 'On all orders over $100' },
            { title: 'Secure Payment', desc: '100% secure payment processing' },
            { title: 'Easy Returns', desc: '30-day money back guarantee' },
            { title: 'Top Quality', desc: 'Finest materials used' },
            { title: '24/7 Support', desc: 'Dedicated support team' },
            { title: 'Modern Design', desc: 'Award winning aesthetics' }
          ];
          const Icon = icons[idx];
          
          return (
            <div key={idx} className="flex gap-4 p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center shrink-0">
                <Icon size={24} />
              </div>
              <div>
                <EditableText
                  value={data?.[`feature${idx}Title`] || defaultData[idx].title}
                  onChange={(val) => onUpdate?.({ ...data, [`feature${idx}Title`]: val })}
                  isEditable={isEditable}
                  className="font-bold text-lg mb-1"
                  tagName="h4"
                />
                <EditableText
                  value={data?.[`feature${idx}Description`] || defaultData[idx].desc}
                  onChange={(val) => onUpdate?.({ ...data, [`feature${idx}Description`]: val })}
                  isEditable={isEditable}
                  className="text-gray-600"
                  tagName="p"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ),

  'layout-accordion': ({ data, isEditable, onUpdate }) => {
    const [openIndex, setOpenIndex] = useState(0);
    
    return (
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
          {[0, 1, 2, 3].map((idx) => {
            const defaultTitles = ['Materials & Care', 'Shipping Information', 'Size Guide', 'Sustainability'];
            const defaultContent = [
              'Made from 100% organic cotton. Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.',
              'Free shipping on orders over $100. Standard delivery 3-5 business days. Express shipping available.',
              'Our sizes run true to standard sizing. Check our size chart for detailed measurements.',
              'Committed to eco-friendly materials and ethical manufacturing practices.'
            ];
            
            return (
              <div key={idx} className="border rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left font-bold"
                >
                  <EditableText
                    value={data?.[`accordion${idx}Title`] || defaultTitles[idx]}
                    onChange={(val) => onUpdate?.({ ...data, [`accordion${idx}Title`]: val })}
                    isEditable={isEditable}
                    className="font-bold"
                  />
                  <ChevronDown size={20} className={`transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                {openIndex === idx && (
                  <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t bg-gray-50">
                    <EditableText
                      value={data?.[`accordion${idx}Content`] || defaultContent[idx]}
                      onChange={(val) => onUpdate?.({ ...data, [`accordion${idx}Content`]: val })}
                      isEditable={isEditable}
                      className="text-gray-600"
                      tagName="p"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },

  'layout-tabs': ({ data, isEditable, onUpdate }) => {
    const [activeTab, setActiveTab] = useState(0);
    const defaultSpecs = ['100% Cotton', '240 GSM', 'Relaxed', 'Portugal'];
    
    return (
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-center gap-8 mb-12 border-b">
          {[0, 1, 2].map((idx) => {
            const defaultLabels = ['Description', 'Specifications', 'Reviews'];
            return (
              <button 
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`pb-4 font-bold text-lg transition-colors ${activeTab === idx ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
              >
                <EditableText
                  value={data?.[`tab${idx}Label`] || defaultLabels[idx]}
                  onChange={(val) => onUpdate?.({ ...data, [`tab${idx}Label`]: val })}
                  isEditable={isEditable}
                  className={activeTab === idx ? 'text-black' : 'text-gray-400'}
                />
              </button>
            );
          })}
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <EditableText
            value={data?.tabContentHeading || 'Premium Quality'}
            onChange={(val) => onUpdate?.({ ...data, tabContentHeading: val })}
            isEditable={isEditable}
            className="text-2xl font-bold mb-4"
            tagName="h3"
          />
          <EditableText
            value={data?.tabContentDescription || 'Crafted with precision and care, our products are designed to last. We use only the finest materials sourced from sustainable suppliers around the globe. Every stitch is a testament to our commitment to quality.'}
            onChange={(val) => onUpdate?.({ ...data, tabContentDescription: val })}
            isEditable={isEditable}
            className="text-gray-600 leading-relaxed mb-8"
            tagName="p"
          />
          <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-8 rounded-2xl">
            {[
              { label: 'Material', key: 0 },
              { label: 'Weight', key: 1 },
              { label: 'Fit', key: 2 },
              { label: 'Origin', key: 3 }
            ].map((spec) => (
              <div key={spec.key}>
                <span className="text-gray-500 text-sm">{spec.label}</span>
                <EditableText
                  value={data?.[`tabSpec${spec.key}`] || defaultSpecs[spec.key]}
                  onChange={(val) => onUpdate?.({ ...data, [`tabSpec${spec.key}`]: val })}
                  isEditable={isEditable}
                  className="font-bold"
                  tagName="div"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};
