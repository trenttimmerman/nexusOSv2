import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Type, Upload, Loader2, Wand2 } from 'lucide-react';
import { PageBlock } from '../types';
import { HERO_FIELDS } from './HeroLibrary';

interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  block: PageBlock | null;
  onUpdate: (blockId: string, data: any) => void;
}

export const SectionEditorModal: React.FC<SectionEditorModalProps> = ({ isOpen, onClose, block, onUpdate }) => {
  const [data, setData] = useState<any>({});
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    if (block && block.data) {
      setData(block.data);
    } else {
      setData({});
    }
  }, [block]);

  if (!isOpen || !block) return null;

  // Determine fields based on block type and variant
  let fields: string[] = [];
  if (block.type === 'system-hero') {
    fields = HERO_FIELDS[block.variant || 'impact'] || [];
  } else if (block.type === 'system-grid') {
    fields = ['heading', 'subheading']; // Default fields for grid
  }

  const handleFieldChange = (field: string, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onUpdate(block.id, newData);
  };

  const handleImageUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateText = async (field: string) => {
    setIsGeneratingText(true);
    // Simulate AI generation
    setTimeout(() => {
      const suggestions = [
        "Elevate Your Digital Presence",
        "Crafted for the Modern Creator",
        "Unleash Your Potential",
        "Future-Ready Design"
      ];
      const random = suggestions[Math.floor(Math.random() * suggestions.length)];
      handleFieldChange(field, random);
      setIsGeneratingText(false);
    }, 1500);
  };

  const generateImage = async (field: string) => {
    setIsGeneratingImage(true);
    // Simulate AI generation
    setTimeout(() => {
      // Placeholder image from Unsplash
      const randomId = Math.floor(Math.random() * 1000);
      handleFieldChange(field, `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`);
      setIsGeneratingImage(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 text-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Section Editor</h3>
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold">
                {block.type.replace('system-', '')} / {block.variant}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {fields.length === 0 && (
            <div className="text-center py-12 text-neutral-500">
              <p>No editable fields configured for this section type.</p>
            </div>
          )}

          {fields.map(field => {
            const isImage = field.includes('image') || field.includes('Image');
            const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

            return (
              <div key={field} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{label}</label>
                  {!isImage && (
                    <button 
                      onClick={() => generateText(field)}
                      disabled={isGeneratingText}
                      className="text-[10px] font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-full transition-colors"
                    >
                      {isGeneratingText ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
                      AI Generate
                    </button>
                  )}
                  {isImage && (
                    <button 
                      onClick={() => generateImage(field)}
                      disabled={isGeneratingImage}
                      className="text-[10px] font-bold text-purple-500 hover:text-purple-400 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-full transition-colors"
                    >
                      {isGeneratingImage ? <Loader2 size={10} className="animate-spin" /> : <ImageIcon size={10} />}
                      AI Generate
                    </button>
                  )}
                </div>

                {isImage ? (
                  <div className="space-y-3">
                    {data[field] && (
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-neutral-800 group">
                        <img src={data[field]} alt={label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-bold text-sm">Current Image</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 p-3 border border-dashed border-neutral-700 rounded-xl bg-black/50 cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all">
                        <Upload size={16} className="text-neutral-400" />
                        <span className="text-sm text-neutral-400 font-medium">Upload Image</span>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(field, e)} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {field.includes('content') || field.includes('description') ? (
                      <textarea
                        value={data[field] || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-600 min-h-[100px]"
                        placeholder={`Enter ${label.toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={data[field] || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="w-full bg-black border border-neutral-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-600"
                        placeholder={`Enter ${label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
