import React, { useState, useEffect } from 'react';
import { X, Type, Image as ImageIcon, Palette, Upload, Sparkles, ChevronRight, Layout, Settings, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Minus, Plus } from 'lucide-react';

interface EditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  blockId: string;
  blockType: string;
  data: any;
  onUpdate: (data: any) => void;
  fields: string[];
  variants?: { id: string; name: string; description?: string }[];
  currentVariant?: string;
  onVariantChange?: (variantId: string) => void;
  showDesignTabs?: boolean;
}

interface EditorFieldProps {
  field: string;
  data: any;
  blockId: string;
  isActive: boolean;
  onFocus: (field: string) => void;
  onUpdate: (updates: any) => void;
}

const EditorField: React.FC<EditorFieldProps> = ({ field, data, blockId, isActive, onFocus, onUpdate }) => {
  const isImage = field.toLowerCase().includes('image');
  const value = data[field];
  const style = data[`${field}_style`] || {};
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const updateStyle = (styleKey: string, val: string) => {
    const currentStyle = data[`${field}_style`] || {};
    onUpdate({
      [`${field}_style`]: {
        ...currentStyle,
        [styleKey]: val
      }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGenerate = () => {
    const randomId = Math.floor(Math.random() * 1000);
    onUpdate({ [field]: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop&random=${randomId}` });
  };

  return (
    <div 
      className={`space-y-2 transition-all duration-300 rounded-xl p-2 -m-2 ${isActive ? 'bg-neutral-800/50 shadow-[0_0_0_2px_rgba(59,130,246,0.5),0_0_20px_rgba(59,130,246,0.3)]' : 'hover:bg-neutral-800/30'}`}
      onClick={() => onFocus(field)}
    >
      <div className="flex items-center justify-between group cursor-pointer">
        <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer ${isActive ? 'text-blue-400' : 'text-neutral-500 group-hover:text-neutral-300'}`}>
          {isImage ? <ImageIcon size={12} /> : <Type size={12} />}
          {field.replace(/([A-Z])/g, ' $1').trim()}
        </label>
      </div>

      {isImage ? (
        <div className={`bg-neutral-800 p-3 rounded-xl border space-y-3 ${isActive ? 'border-blue-500/50' : 'border-neutral-700'}`}>
          <div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden relative group/img">
            {value ? (
              <img src={value} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-neutral-600">
                <ImageIcon size={24} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-700 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-neutral-800 transition-colors text-neutral-300 hover:text-white">
              <Upload size={12} /> Upload
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button 
              onClick={(e) => { e.stopPropagation(); handleAiGenerate(); }}
              className="flex items-center justify-center gap-2 bg-purple-900/30 text-purple-400 border border-purple-900/50 py-2 rounded-lg text-xs font-bold hover:bg-purple-900/50 transition-colors"
            >
              <Sparkles size={12} /> AI Gen
            </button>
          </div>
          {field === 'image' && (
             <div className="pt-2 border-t border-neutral-700">
                <div className="flex justify-between text-[10px] font-bold text-neutral-500 mb-1">
                   <span>Overlay</span>
                   <span>{Math.round((data.overlayOpacity || 0) * 100)}%</span>
                </div>
                <input 
                   type="range" 
                   min="0" 
                   max="0.9" 
                   step="0.1" 
                   value={data.overlayOpacity || 0}
                   onChange={(e) => onUpdate({ overlayOpacity: parseFloat(e.target.value) })}
                   className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white"
                />
             </div>
          )}
        </div>
      ) : (
        <div className={`bg-neutral-800 p-3 rounded-xl border space-y-3 ${isActive ? 'border-blue-500/50' : 'border-neutral-700'}`}>
           <textarea
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={() => {
                  if (localValue !== value) {
                      onUpdate({ [field]: localValue });
                  }
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none placeholder-neutral-600"
              rows={3}
              placeholder={`Edit ${field}...`}
           />

           <div className="flex flex-wrap gap-2">
              <div className="flex bg-neutral-900 rounded-lg border border-neutral-700 overflow-hidden">
                 <button onClick={(e) => { e.stopPropagation(); updateStyle('fontFamily', 'ui-sans-serif, system-ui'); }} className={`p-1.5 hover:bg-neutral-800 ${style.fontFamily?.includes('sans') ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`} title="Sans"><Type size={12} /></button>
                 <button onClick={(e) => { e.stopPropagation(); updateStyle('fontFamily', 'ui-serif, Georgia'); }} className={`p-1.5 hover:bg-neutral-800 ${style.fontFamily?.includes('serif') ? 'bg-neutral-800 text-white' : 'text-neutral-500'}`} title="Serif"><Type size={12} className="font-serif" /></button>
              </div>

              <button onClick={(e) => { e.stopPropagation(); updateStyle('fontWeight', style.fontWeight === 'bold' ? 'normal' : 'bold'); }} className={`p-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 ${style.fontWeight === 'bold' ? 'text-white ring-1 ring-white' : 'text-neutral-500'}`}>
                 <Bold size={12} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); updateStyle('textTransform', style.textTransform === 'uppercase' ? 'none' : 'uppercase'); }} className={`p-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 ${style.textTransform === 'uppercase' ? 'text-white ring-1 ring-white' : 'text-neutral-500'}`}>
                 <span className="text-[10px] font-bold">AA</span>
              </button>

              <div className="flex gap-1 items-center ml-auto">
                 {['#000000', '#ffffff', '#ef4444', '#3b82f6'].map(c => (
                    <button 
                      key={c}
                      onClick={(e) => { e.stopPropagation(); updateStyle('color', c); }}
                      className={`w-4 h-4 rounded-full border border-neutral-600 ${style.color === c ? 'ring-2 ring-offset-1 ring-offset-neutral-900 ring-white' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                 ))}
              </div>
           </div>
           
           <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-lg border border-neutral-700">
              <button onClick={(e) => { e.stopPropagation(); updateStyle('fontSize', '0.875rem'); }} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"><Minus size={10} /></button>
              <span className="text-[10px] font-mono flex-1 text-center text-neutral-500">Size</span>
              <button onClick={(e) => { e.stopPropagation(); updateStyle('fontSize', '4rem'); }} className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"><Plus size={10} /></button>
           </div>
        </div>
      )}
    </div>
  );
};

export const EditorPanel: React.FC<EditorPanelProps> = ({ isOpen, onClose, blockId, blockType, data, onUpdate, fields, variants, currentVariant, onVariantChange, showDesignTabs = true }) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'animation'>('content');

  if (!isOpen) return null;

  const handleFocusElement = (fieldName: string) => {
    setActiveField(fieldName);
    const elementId = `editable-${blockId}-${fieldName}`;
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.click();
    }
  };

  return (
    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col overflow-hidden h-full animate-in slide-in-from-right-4 duration-300 z-20">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-white">Edit Section</h3>
          <p className="text-xs text-neutral-500 capitalize">{blockType}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      {showDesignTabs && (
        <div className="flex border-b border-neutral-800 bg-neutral-900/50">
          <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'content' ? 'text-white border-b-2 border-blue-500 bg-white/5' : 'text-neutral-500 hover:text-neutral-300'}`}>Content</button>
          <button onClick={() => setActiveTab('design')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'design' ? 'text-white border-b-2 border-blue-500 bg-white/5' : 'text-neutral-500 hover:text-neutral-300'}`}>Design</button>
          <button onClick={() => setActiveTab('animation')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'animation' ? 'text-white border-b-2 border-blue-500 bg-white/5' : 'text-neutral-500 hover:text-neutral-300'}`}>Animate</button>
        </div>
      )}

      {/* Variant Selector (Only in Content Tab) */}
      {(activeTab === 'content' || !showDesignTabs) && variants && variants.length > 0 && (
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Style Variant</label>
          <select 
            value={currentVariant} 
            onChange={(e) => onVariantChange?.(e.target.value)}
            className="w-full bg-black border border-neutral-700 rounded p-2 text-xs text-white focus:border-blue-500 outline-none"
          >
            {variants.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {(activeTab === 'content' || !showDesignTabs) && (
          <>
            {fields.length === 0 && (
               <div className="text-center py-8 text-neutral-500 text-xs">
                  No content fields available for this component.
               </div>
            )}
            {fields.map((field) => (
              <EditorField 
                key={field}
                field={field}
                data={data}
                blockId={blockId}
                isActive={activeField === field}
                onFocus={handleFocusElement}
                onUpdate={onUpdate}
              />
            ))}
          </>
        )}

        {activeTab === 'design' && (
          <div className="space-y-8 animate-in fade-in duration-300">
             {/* Spacing Controls */}
             <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Layout size={12} /> Spacing (Padding)</label>
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-xs text-neutral-400 mb-1">
                        <span>Top</span>
                        <span className="font-mono text-white">{data._paddingTop || 0}px</span>
                      </div>
                      <input type="range" min="0" max="128" step="4" value={data._paddingTop || 0} onChange={(e) => onUpdate({ _paddingTop: parseInt(e.target.value) })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                   </div>
                   <div>
                      <div className="flex justify-between text-xs text-neutral-400 mb-1">
                        <span>Bottom</span>
                        <span className="font-mono text-white">{data._paddingBottom || 0}px</span>
                      </div>
                      <input type="range" min="0" max="128" step="4" value={data._paddingBottom || 0} onChange={(e) => onUpdate({ _paddingBottom: parseInt(e.target.value) })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                   </div>
                </div>
             </div>
             
             {/* Theme/Colors */}
             <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Palette size={12} /> Background Override</label>
                <div className="grid grid-cols-5 gap-2">
                   {['transparent', '#000000', '#ffffff', '#171717', '#1e3a8a', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#2563eb'].map(c => (
                      <button 
                        key={c}
                        onClick={() => onUpdate({ _backgroundColor: c })}
                        className={`w-8 h-8 rounded-lg border border-neutral-700 transition-all ${data._backgroundColor === c ? 'ring-2 ring-white scale-110 z-10' : 'hover:scale-105'}`}
                        style={{ backgroundColor: c === 'transparent' ? undefined : c, backgroundImage: c === 'transparent' ? 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)' : undefined, backgroundSize: '4px 4px' }}
                        title={c}
                      />
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'animation' && (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div>
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Sparkles size={12} /> Entrance Animation</label>
                <div className="space-y-2">
                  {[
                    { id: 'none', name: 'None' },
                    { id: 'fade-in', name: 'Fade In' },
                    { id: 'slide-up', name: 'Slide Up' },
                    { id: 'slide-in-right', name: 'Slide In Right' },
                    { id: 'zoom-in', name: 'Zoom In' }
                  ].map(anim => (
                    <button
                      key={anim.id}
                      onClick={() => onUpdate({ _animation: anim.id })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${data._animation === anim.id ? 'bg-blue-900/20 border-blue-500 text-blue-400' : 'bg-neutral-800 border-transparent text-neutral-400 hover:bg-neutral-700 hover:text-white'}`}
                    >
                      {anim.name}
                    </button>
                  ))}
                </div>
             </div>
             
             {data._animation && data._animation !== 'none' && (
               <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Settings size={12} /> Duration</label>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Speed</span>
                    <span className="font-mono text-white">{data._animationDuration || 1}s</span>
                  </div>
                  <input type="range" min="0.2" max="3" step="0.1" value={data._animationDuration || 1} onChange={(e) => onUpdate({ _animationDuration: parseFloat(e.target.value) })} className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
