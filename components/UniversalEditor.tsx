import React, { useState } from 'react';
import { ChevronLeft, Layout, Image as ImageIcon, Type, AlignLeft, AlignCenter, AlignRight, Palette, Plus, Trash2, ChevronRight, ArrowLeft, Check, Upload, X, Bold, Italic, Link as LinkIcon, List, Loader2 } from 'lucide-react';
import { UniversalSectionData } from '../lib/smartMapper';
import { supabase } from '../lib/supabaseClient';

// Import Options
import { BLOG_OPTIONS } from './BlogLibrary';
import { VIDEO_OPTIONS } from './VideoLibrary';
import { CONTACT_OPTIONS } from './ContactLibrary';
import { LAYOUT_OPTIONS } from './LayoutLibrary';
import { COLLECTION_OPTIONS } from './CollectionLibrary';
import { HERO_OPTIONS } from './HeroLibrary';
import { GALLERY_OPTIONS } from './GalleryLibrary';
import { SOCIAL_OPTIONS } from './SocialLibrary';
import { RICH_TEXT_OPTIONS, EMAIL_SIGNUP_OPTIONS, COLLAPSIBLE_OPTIONS, LOGO_LIST_OPTIONS, PROMO_BANNER_OPTIONS } from './SectionLibrary';

const ALL_OPTIONS: Record<string, any[]> = {
  'system-hero': HERO_OPTIONS,
  'system-blog': BLOG_OPTIONS,
  'system-video': VIDEO_OPTIONS,
  'system-contact': CONTACT_OPTIONS,
  'system-layout': LAYOUT_OPTIONS,
  'system-collection': COLLECTION_OPTIONS,
  'system-gallery': GALLERY_OPTIONS,
  'system-social': SOCIAL_OPTIONS,
  'system-rich-text': RICH_TEXT_OPTIONS,
  'system-email': EMAIL_SIGNUP_OPTIONS,
  'system-collapsible': COLLAPSIBLE_OPTIONS,
  'system-logo-list': LOGO_LIST_OPTIONS,
  'system-promo': PROMO_BANNER_OPTIONS,
};

interface UniversalEditorProps {
  blockId: string;
  blockType: string;
  variant: string;
  data: UniversalSectionData;
  onUpdate: (data: UniversalSectionData) => void;
  onSwitchLayout: (newVariant: string) => void;
}

export const UniversalEditor: React.FC<UniversalEditorProps> = ({
  blockId,
  blockType,
  variant,
  data,
  onUpdate,
  onSwitchLayout
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const options = ALL_OPTIONS[blockType] || [];
  const currentOption = options.find(o => o.id === variant);

  const updateField = (key: string, value: any) => {
    onUpdate({ ...data, [key]: value });
  };

  const updateStyle = (key: string, value: any) => {
    onUpdate({ ...data, style: { ...data.style, [key]: value } });
  };

  const updateItem = (index: number, key: string, value: any) => {
    if (!data.items) return;
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [key]: value };
    onUpdate({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItems = [...(data.items || []), { id: Date.now().toString(), title: 'New Item', description: 'Description' }];
    onUpdate({ ...data, items: newItems });
    setActiveItemIndex(newItems.length - 1);
  };

  const removeItem = (index: number) => {
    if (!data.items) return;
    const newItems = data.items.filter((_, i) => i !== index);
    onUpdate({ ...data, items: newItems });
    if (activeItemIndex === index) setActiveItemIndex(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      if (index !== undefined) {
        updateItem(index, field, publicUrl);
      } else {
        updateField(field, publicUrl);
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // --- COMPONENTS ---

  const ImagePicker = ({ label, value, onChange, onUpload }: { label: string, value: string, onChange: (val: string) => void, onUpload: (e: any) => void }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-neutral-500 flex items-center justify-between">
        {label}
        {value && <button onClick={() => onChange('')} className="text-red-500 hover:text-red-400 text-[10px]">Remove</button>}
      </label>
      
      {!value ? (
        <div className="border-2 border-dashed border-neutral-800 rounded-lg p-4 hover:bg-neutral-900/50 transition-colors group relative">
          <input 
            type="file" 
            accept="image/*"
            onChange={onUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center text-neutral-500 group-hover:text-neutral-400">
            {isUploading ? <Loader2 size={20} className="animate-spin mb-2" /> : <Upload size={20} className="mb-2" />}
            <span className="text-xs font-medium">Upload Image</span>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
          <div className="aspect-video relative">
            <img src={value} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
               <label className="p-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer text-white backdrop-blur-sm transition-colors">
                  <Upload size={16} />
                  <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
               </label>
            </div>
          </div>
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 bg-neutral-950 text-xs text-neutral-500 border-t border-neutral-800 focus:outline-none"
            placeholder="https://..."
          />
        </div>
      )}
    </div>
  );

  const RichText = ({ label, value, onChange, rows = 3 }: { label: string, value: string, onChange: (val: string) => void, rows?: number }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase text-neutral-500">{label}</label>
        <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded p-0.5">
          <button className="p-1 hover:bg-neutral-800 rounded text-neutral-500 hover:text-white"><Bold size={10} /></button>
          <button className="p-1 hover:bg-neutral-800 rounded text-neutral-500 hover:text-white"><Italic size={10} /></button>
          <button className="p-1 hover:bg-neutral-800 rounded text-neutral-500 hover:text-white"><LinkIcon size={10} /></button>
        </div>
      </div>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none resize-none transition-all placeholder:text-neutral-700"
        rows={rows}
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  );

  const Input = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-neutral-500">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all placeholder:text-neutral-700"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    </div>
  );

  // --- RENDERERS ---

  if (showLayoutPicker) {
    return (
      <div className="h-full flex flex-col bg-neutral-900 border-l border-neutral-800">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <button onClick={() => setShowLayoutPicker(false)} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold text-white">Choose Layout</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 custom-scrollbar">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                onSwitchLayout(opt.id);
                setShowLayoutPicker(false);
              }}
              className={`text-left border rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all group ${variant === opt.id ? 'ring-2 ring-blue-600 bg-blue-900/20 border-blue-500' : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'}`}
            >
              <div className={`aspect-video flex items-center justify-center transition-colors ${variant === opt.id ? 'bg-blue-900/30 text-blue-400' : 'bg-neutral-900 text-neutral-600 group-hover:bg-neutral-800 group-hover:text-neutral-500'}`}>
                <Layout size={24} />
              </div>
              <div className="p-3">
                <div className={`font-bold text-sm mb-1 transition-colors ${variant === opt.id ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>{opt.name}</div>
                <div className="text-xs text-neutral-500 line-clamp-2">{opt.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (activeItemIndex !== null && data.items && data.items[activeItemIndex]) {
    const item = data.items[activeItemIndex];
    return (
      <div className="h-full flex flex-col bg-neutral-900 border-l border-neutral-800">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <button onClick={() => setActiveItemIndex(null)} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold text-white">Edit Item {activeItemIndex + 1}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <Input 
            label="Title" 
            value={item.title} 
            onChange={(val) => updateItem(activeItemIndex, 'title', val)} 
          />
          <RichText 
            label="Description" 
            value={item.description} 
            onChange={(val) => updateItem(activeItemIndex, 'description', val)} 
          />
          <ImagePicker 
            label="Image" 
            value={item.image} 
            onChange={(val) => updateItem(activeItemIndex, 'image', val)}
            onUpload={(e) => handleImageUpload(e, 'image', activeItemIndex)}
          />
          <Input 
            label="Link URL" 
            value={item.link} 
            onChange={(val) => updateItem(activeItemIndex, 'link', val)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-900 border-l border-neutral-800">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{blockType.replace('system-', '')}</span>
          <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 border border-neutral-700">{variant}</span>
        </div>
        <button 
          onClick={() => setShowLayoutPicker(true)}
          className="w-full flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-800 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-neutral-900 rounded-lg text-neutral-400 group-hover:text-white transition-colors">
              <Layout size={16} />
            </div>
            <span className="font-bold text-sm text-neutral-300 group-hover:text-white transition-colors">{currentOption?.name || 'Select Layout'}</span>
          </div>
          <ChevronRight size={16} className="text-neutral-600 group-hover:text-neutral-400 transition-colors" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        
        {/* Core Fields */}
        <div className="space-y-5">
          <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2 mb-4">
            <Type size={12} /> Content
          </h4>
          
          <Input 
            label="Heading" 
            value={data.heading || ''} 
            onChange={(val) => updateField('heading', val)} 
          />
          
          <RichText 
            label="Subheading" 
            value={data.subheading || ''} 
            onChange={(val) => updateField('subheading', val)} 
          />

          <ImagePicker 
            label="Main Image" 
            value={data.image || ''} 
            onChange={(val) => updateField('image', val)}
            onUpload={(e) => handleImageUpload(e, 'image')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Button Text" 
              value={data.buttonText || ''} 
              onChange={(val) => updateField('buttonText', val)} 
            />
            <Input 
              label="Button Link" 
              value={data.buttonLink || ''} 
              onChange={(val) => updateField('buttonLink', val)} 
            />
          </div>
        </div>

        {/* Items List (Drill Down) */}
        {data.items && (
          <div className="space-y-4 pt-6 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <List size={12} /> Items ({data.items.length})
              </h4>
              <button onClick={addItem} className="p-1.5 hover:bg-blue-500/10 rounded text-blue-500 hover:text-blue-400 transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {data.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <button 
                    onClick={() => setActiveItemIndex(i)}
                    className="flex-1 flex items-center gap-3 p-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg text-left transition-all group-hover:shadow-md"
                  >
                    <div className="w-10 h-10 bg-neutral-900 rounded-md overflow-hidden shrink-0 border border-neutral-800 flex items-center justify-center text-neutral-700">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon size={16} />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate text-neutral-300 group-hover:text-white transition-colors">{item.title || 'Untitled'}</div>
                      <div className="text-[10px] text-neutral-600 truncate">Item {i + 1}</div>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                  </button>
                  <button onClick={() => removeItem(i)} className="p-2 text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Style Overrides */}
        <div className="space-y-4 pt-6 border-t border-neutral-800">
          <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500 flex items-center gap-2 mb-4">
            <Palette size={12} /> Design
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-neutral-500">Background</label>
              <select 
                value={data.style?.background || 'auto'}
                onChange={(e) => updateStyle('background', e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:border-blue-500 outline-none appearance-none cursor-pointer hover:border-neutral-700 transition-colors"
              >
                <option value="auto">Auto</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="accent">Accent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-neutral-500">Padding</label>
              <select 
                value={data.style?.padding || 'auto'}
                onChange={(e) => updateStyle('padding', e.target.value)}
                className="w-full p-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:border-blue-500 outline-none appearance-none cursor-pointer hover:border-neutral-700 transition-colors"
              >
                <option value="auto">Auto</option>
                <option value="s">Small</option>
                <option value="m">Medium</option>
                <option value="l">Large</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
