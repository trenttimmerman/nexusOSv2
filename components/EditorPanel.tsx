import React, { useState } from 'react';
import { X, Type, Image as ImageIcon, Palette, Upload, Sparkles, ChevronRight, Layout, Settings, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Minus, Plus } from 'lucide-react';

interface EditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  blockId: string;
  blockType: string;
  data: any;
  onUpdate: (data: any) => void;
  fields: string[];
}

import React, { useState, useEffect } from 'react';
import { X, Type, Image as ImageIcon, Upload, Sparkles, Bold, Minus, Plus } from 'lucide-react';
import { EditorPanelProps } from '../types';

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
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const randomId = Math.floor(Math.random() * 1000);
    // In a real app, this would call our Supabase Edge Function with the prompt
    onUpdate({ [field]: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop&random=${randomId}` });
    
    setIsGenerating(false);
    setShowAiPrompt(false);
    setAiPrompt('');
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
              onClick={(e) => { e.stopPropagation(); setShowAiPrompt(!showAiPrompt); }}
              className={`flex items-center justify-center gap-2 border py-2 rounded-lg text-xs font-bold transition-colors ${showAiPrompt ? 'bg-purple-600 text-white border-purple-500' : 'bg-purple-900/30 text-purple-400 border-purple-900/50 hover:bg-purple-900/50'}`}
            >
              <Sparkles size={12} /> {showAiPrompt ? 'Cancel' : 'AI Gen'}
            </button>
          </div>

          {showAiPrompt && (
            <div className="p-3 bg-neutral-900 rounded-lg border border-purple-500/30 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the image you want..."
                className="w-full bg-black border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-purple-500 min-h-[60px] resize-none"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={(e) => { e.stopPropagation(); handleAiGenerate(); }}
                disabled={!aiPrompt || isGenerating}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  <>Generate Image</>
                )}
              </button>
            </div>
          )}
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

export const EditorPanel: React.FC<EditorPanelProps> = ({ isOpen, onClose, blockId, blockType, data, onUpdate, fields }) => {
  const [activeField, setActiveField] = useState<string | null>(null);

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
    <div className="w-80 bg-neutral-900 border-l border-r border-neutral-800 flex flex-col overflow-hidden h-full animate-in slide-in-from-left-4 duration-300 z-20">
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
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
      </div>
    </div>
  );
};
