import React, { useState } from 'react';
import { ChevronLeft, Layout, Image as ImageIcon, Type, AlignLeft, AlignCenter, AlignRight, Palette, Plus, Trash2, ChevronRight, ArrowLeft, Check } from 'lucide-react';
import { UniversalSectionData } from '../lib/smartMapper';

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

  // --- RENDERERS ---

  if (showLayoutPicker) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b flex items-center gap-2">
          <button onClick={() => setShowLayoutPicker(false)} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold">Choose Layout</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                onSwitchLayout(opt.id);
                setShowLayoutPicker(false);
              }}
              className={`text-left border rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all ${variant === opt.id ? 'ring-2 ring-blue-600 bg-blue-50' : 'bg-gray-50'}`}
            >
              <div className="aspect-video bg-gray-200 flex items-center justify-center text-gray-400">
                <Layout size={24} />
              </div>
              <div className="p-3">
                <div className="font-bold text-sm mb-1">{opt.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{opt.description}</div>
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
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b flex items-center gap-2">
          <button onClick={() => setActiveItemIndex(null)} className="p-1 hover:bg-gray-100 rounded">
            <ArrowLeft size={20} />
          </button>
          <h3 className="font-bold">Edit Item {activeItemIndex + 1}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Title</label>
            <input
              type="text"
              value={item.title || ''}
              onChange={(e) => updateItem(activeItemIndex, 'title', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <textarea
              value={item.description || ''}
              onChange={(e) => updateItem(activeItemIndex, 'description', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm h-24"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={item.image || ''}
                onChange={(e) => updateItem(activeItemIndex, 'image', e.target.value)}
                className="flex-1 p-2 border rounded-lg text-sm"
                placeholder="Image URL"
              />
            </div>
            {item.image && (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mt-2">
                <img src={item.image} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Link</label>
            <input
              type="text"
              value={item.link || ''}
              onChange={(e) => updateItem(activeItemIndex, 'link', e.target.value)}
              className="w-full p-2 border rounded-lg text-sm"
              placeholder="/pages/..."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase text-gray-500">{blockType.replace('system-', '')}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{variant}</span>
        </div>
        <button 
          onClick={() => setShowLayoutPicker(true)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border transition-colors"
        >
          <div className="flex items-center gap-3">
            <Layout size={18} />
            <span className="font-bold text-sm">{currentOption?.name || 'Select Layout'}</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        
        {/* Core Fields */}
        <div className="space-y-4">
          <h4 className="font-bold text-sm flex items-center gap-2"><Type size={14} /> Content</h4>
          
          {data.heading !== undefined && (
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Heading</label>
              <input
                type="text"
                value={data.heading || ''}
                onChange={(e) => updateField('heading', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
          )}
          
          {data.subheading !== undefined && (
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Subheading</label>
              <textarea
                value={data.subheading || ''}
                onChange={(e) => updateField('subheading', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm h-20"
              />
            </div>
          )}

          {data.image !== undefined && (
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Main Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data.image || ''}
                  onChange={(e) => updateField('image', e.target.value)}
                  className="flex-1 p-2 border rounded-lg text-sm"
                />
              </div>
              {data.image && (
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mt-2">
                  <img src={data.image} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Items List (Drill Down) */}
        {data.items && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm flex items-center gap-2"><Layout size={14} /> Items ({data.items.length})</h4>
              <button onClick={addItem} className="p-1 hover:bg-gray-100 rounded text-blue-600">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {data.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <button 
                    onClick={() => setActiveItemIndex(i)}
                    className="flex-1 flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden shrink-0">
                      {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                    </div>
                    <span className="text-sm font-medium truncate">{item.title || 'Untitled'}</span>
                    <ChevronRight size={14} className="ml-auto text-gray-400" />
                  </button>
                  <button onClick={() => removeItem(i)} className="p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Style Overrides */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-bold text-sm flex items-center gap-2"><Palette size={14} /> Design</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Background</label>
              <select 
                value={data.style?.background || 'auto'}
                onChange={(e) => updateStyle('background', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm bg-white"
              >
                <option value="auto">Auto</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="accent">Accent</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Padding</label>
              <select 
                value={data.style?.padding || 'auto'}
                onChange={(e) => updateStyle('padding', e.target.value)}
                className="w-full p-2 border rounded-lg text-sm bg-white"
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
