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

export const EditorPanel: React.FC<EditorPanelProps> = ({ isOpen, onClose, blockId, blockType, data, onUpdate, fields }) => {
  if (!isOpen) return null;

  const handleFocusElement = (fieldName: string) => {
    const elementId = `editable-${blockId}-${fieldName}`;
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Trigger a click to ensure any internal state switches to edit mode
      element.click();
    }
  };

  const updateStyle = (fieldName: string, styleKey: string, value: string) => {
    const currentStyle = data[`${fieldName}_style`] || {};
    onUpdate({
      [`${fieldName}_style`]: {
        ...currentStyle,
        [styleKey]: value
      }
    });
  };

  const handleImageUpload = (fieldName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ [fieldName]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGenerate = (fieldName: string) => {
    // Simulate AI
    const randomId = Math.floor(Math.random() * 1000);
    onUpdate({ [fieldName]: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop&random=${randomId}` });
  };

  return (
    <div className="fixed right-4 top-24 bottom-4 w-80 bg-white rounded-2xl shadow-2xl border border-neutral-200 z-[200] flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider">Edit Section</h3>
          <p className="text-xs text-neutral-500 capitalize">{blockType}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {fields.map((field) => {
          const isImage = field.toLowerCase().includes('image');
          const value = data[field];
          const style = data[`${field}_style`] || {};

          return (
            <div key={field} className="space-y-2">
              <div className="flex items-center justify-between group">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  {isImage ? <ImageIcon size={12} /> : <Type size={12} />}
                  {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {!isImage && (
                  <button 
                    onClick={() => handleFocusElement(field)}
                    className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-100"
                  >
                    Edit on Canvas
                  </button>
                )}
              </div>

              {isImage ? (
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-3">
                  <div className="aspect-video bg-neutral-200 rounded-lg overflow-hidden relative group/img">
                    {value ? (
                      <img src={value} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-neutral-400">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center justify-center gap-2 bg-white border border-neutral-200 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-neutral-50 transition-colors">
                      <Upload size={12} /> Upload
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(field, e)} />
                    </label>
                    <button 
                      onClick={() => handleAiGenerate(field)}
                      className="flex items-center justify-center gap-2 bg-purple-50 text-purple-600 border border-purple-100 py-2 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors"
                    >
                      <Sparkles size={12} /> AI Gen
                    </button>
                  </div>
                  {/* Overlay Opacity Slider if applicable */}
                  {field === 'image' && (
                     <div className="pt-2 border-t border-neutral-200">
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
                           className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                        />
                     </div>
                  )}
                </div>
              ) : (
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-3">
                   {/* Style Controls */}
                   <div className="flex flex-wrap gap-2">
                      {/* Font Family */}
                      <div className="flex bg-white rounded-lg border border-neutral-200 overflow-hidden">
                         <button onClick={() => updateStyle(field, 'fontFamily', 'ui-sans-serif, system-ui')} className={`p-1.5 hover:bg-neutral-50 ${style.fontFamily?.includes('sans') ? 'bg-neutral-100 text-black' : 'text-neutral-400'}`} title="Sans"><Type size={12} /></button>
                         <button onClick={() => updateStyle(field, 'fontFamily', 'ui-serif, Georgia')} className={`p-1.5 hover:bg-neutral-50 ${style.fontFamily?.includes('serif') ? 'bg-neutral-100 text-black' : 'text-neutral-400'}`} title="Serif"><Type size={12} className="font-serif" /></button>
                      </div>

                      {/* Weight & Transform */}
                      <button onClick={() => updateStyle(field, 'fontWeight', style.fontWeight === 'bold' ? 'normal' : 'bold')} className={`p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 ${style.fontWeight === 'bold' ? 'text-black ring-1 ring-black' : 'text-neutral-400'}`}>
                         <Bold size={12} />
                      </button>
                      <button onClick={() => updateStyle(field, 'textTransform', style.textTransform === 'uppercase' ? 'none' : 'uppercase')} className={`p-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 ${style.textTransform === 'uppercase' ? 'text-black ring-1 ring-black' : 'text-neutral-400'}`}>
                         <span className="text-[10px] font-bold">AA</span>
                      </button>

                      {/* Colors */}
                      <div className="flex gap-1 items-center ml-auto">
                         {['#000000', '#ffffff', '#ef4444', '#3b82f6'].map(c => (
                            <button 
                              key={c}
                              onClick={() => updateStyle(field, 'color', c)}
                              className={`w-4 h-4 rounded-full border border-neutral-200 ${style.color === c ? 'ring-2 ring-offset-1 ring-black' : ''}`}
                              style={{ backgroundColor: c }}
                            />
                         ))}
                      </div>
                   </div>
                   
                   {/* Size */}
                   <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-neutral-200">
                      <button onClick={() => updateStyle(field, 'fontSize', '0.875rem')} className="p-1 hover:bg-neutral-100 rounded"><Minus size={10} /></button>
                      <span className="text-[10px] font-mono flex-1 text-center text-neutral-500">Size</span>
                      <button onClick={() => updateStyle(field, 'fontSize', '4rem')} className="p-1 hover:bg-neutral-100 rounded"><Plus size={10} /></button>
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
