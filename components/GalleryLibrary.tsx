
import React, { useState } from 'react';
import { EditableText } from './editor';
import { ArrowRight, ArrowLeft, Maximize2, X } from 'lucide-react';

export const GALLERY_OPTIONS = [
  { id: 'gal-grid', name: 'Classic Grid', description: 'Uniform grid layout' },
  { id: 'gal-masonry', name: 'Masonry', description: 'Staggered dynamic layout' },
  { id: 'gal-slider', name: 'Slider', description: 'Horizontal scrollable gallery' },
  { id: 'gal-featured', name: 'Featured', description: 'One large image with thumbnails' },
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  'https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=800&q=80',
];

export const GALLERY_COMPONENTS: Record<string, React.FC<any>> = {
  'gal-grid': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <EditableText
          value={data?.heading || 'Lookbook'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold mb-4"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(data?.images || DEFAULT_IMAGES).map((img: string, i: number) => (
          <div key={i} className="aspect-square bg-neutral-100 overflow-hidden group relative cursor-pointer">
            <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
          </div>
        ))}
      </div>
    </div>
  ),
  'gal-masonry': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="columns-1 md:columns-3 gap-4 space-y-4">
        {(data?.images || DEFAULT_IMAGES).map((img: string, i: number) => (
          <div key={i} className="break-inside-avoid relative group overflow-hidden rounded-lg">
            <img src={img} className={`w-full object-cover ${i % 2 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
              <span className="text-white font-bold">View Project</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  'gal-slider': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 overflow-hidden">
      <div className="px-6 mb-8 flex justify-between items-end max-w-7xl mx-auto">
        <EditableText
          value={data?.heading || 'Featured Works'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold"
        />
        <div className="flex gap-2">
          <button className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-100"><ArrowLeft size={20} /></button>
          <button className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-100"><ArrowRight size={20} /></button>
        </div>
      </div>
      <div className="flex gap-6 overflow-x-auto px-6 pb-8 snap-x scrollbar-hide">
        {(data?.images || DEFAULT_IMAGES).map((img: string, i: number) => (
          <div key={i} className="snap-center shrink-0 w-[300px] md:w-[400px] aspect-[4/5] bg-neutral-100 rounded-xl overflow-hidden relative group">
            <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  ),
  'gal-featured': ({ data, isEditable, onUpdate }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = data?.images || DEFAULT_IMAGES;

    return (
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
          <div className="lg:col-span-2 h-full bg-neutral-100 rounded-2xl overflow-hidden relative">
            <img src={images[activeIndex]} className="w-full h-full object-cover transition-all duration-500" />
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-bold">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 content-start overflow-y-auto pr-2 custom-scrollbar">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setActiveIndex(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeIndex === i ? 'border-black opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
};
