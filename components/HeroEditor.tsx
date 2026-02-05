import React, { useState } from 'react';
import { X, Image as ImageIcon, Type, Palette, Eye, EyeOff, Upload, Sparkles } from 'lucide-react';
import { HeroData, HERO_COMPONENTS } from './HeroLibrary';
import { HeroDesignerModal, DesignRequirements } from './HeroDesignerModal';

interface HeroEditorProps {
  data: HeroData;
  onChange: (data: HeroData) => void;
  onClose: () => void;
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ data, onChange, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'colors' | 'settings'>('content');
  const [showDesigner, setShowDesigner] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateField = (field: keyof HeroData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleField = (field: keyof HeroData) => {
    onChange({ ...data, [field]: !data[field] });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('backgroundImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateHeroes = async (requirements: DesignRequirements) => {
    setIsGenerating(true);
    // TODO: Call Gemini API to generate 3 heroes
    console.log('Generating heroes with requirements:', requirements);
    
    // Placeholder - will implement API call next
    setTimeout(() => {
      setIsGenerating(false);
      setShowDesigner(false);
      // TODO: Show preview of 3 generated heroes
    }, 3000);
  };

  const HeroComponent = HERO_COMPONENTS['fullimage'];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex">
      {/* Left Panel - Editor */}
      <div className="w-[400px] bg-neutral-900 border-r border-neutral-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h3 className="text-white font-bold text-lg">Hero Editor</h3>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* AI Designer Button */}
        <div className="p-4 border-b border-neutral-800">
          <button
            onClick={() => setShowDesigner(true)}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <Sparkles size={18} />
            Design with AI
          </button>
          <p className="text-xs text-neutral-500 text-center mt-2">
            Generate 3 custom hero designs instantly
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800">
          {[
            { id: 'content', label: 'Content', icon: Type },
            { id: 'colors', label: 'Colors', icon: Palette },
            { id: 'settings', label: 'Settings', icon: ImageIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-white bg-neutral-800 border-b-2 border-blue-500'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* CONTENT TAB */}
          {activeTab === 'content' && (
            <>
              {/* Heading */}
              <div className="space-y-2">
                <label className="text-sm text-neutral-300 font-medium">Heading</label>
                <input
                  type="text"
                  value={data.heading || ''}
                  onChange={(e) => updateField('heading', e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                  placeholder="Enter headline..."
                />
              </div>

              {/* Subheading */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-neutral-300 font-medium">Subheading</label>
                  <button
                    onClick={() => toggleField('showSubheading')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      data.showSubheading 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                        : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                    }`}
                  >
                    {data.showSubheading ? <Eye size={12} /> : <EyeOff size={12} />}
                    {data.showSubheading ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <textarea
                  value={data.subheading || ''}
                  onChange={(e) => updateField('subheading', e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none resize-none"
                  rows={3}
                  placeholder="Enter subheading..."
                />
              </div>

              {/* Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-neutral-300 font-medium">Button Text</label>
                  <button
                    onClick={() => toggleField('showButton')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                      data.showButton 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' 
                        : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                    }`}
                  >
                    {data.showButton ? <Eye size={12} /> : <EyeOff size={12} />}
                    {data.showButton ? 'Visible' : 'Hidden'}
                  </button>
                </div>
                <input
                  type="text"
                  value={data.buttonText || ''}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                  placeholder="e.g., Shop Now"
                />
                <input
                  type="text"
                  value={data.buttonLink || ''}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 outline-none"
                  placeholder="Button link (e.g., /products)"
                />
              </div>
            </>
          )}

          {/* COLORS TAB */}
          {activeTab === 'colors' && (
            <>
              {/* Text Color */}
              <div className="space-y-2">
                <label className="text-sm text-neutral-300 font-medium">Text Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.textColor || '#FFFFFF'}
                    onChange={(e) => updateField('textColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-neutral-700"
                  />
                  <input
                    type="text"
                    value={data.textColor || '#FFFFFF'}
                    onChange={(e) => updateField('textColor', e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 text-white text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Button Colors */}
              <div className="space-y-2">
                <label className="text-sm text-neutral-300 font-medium">Button Background</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.buttonBackgroundColor || '#000000'}
                    onChange={(e) => updateField('buttonBackgroundColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-neutral-700"
                  />
                  <input
                    type="text"
                    value={data.buttonBackgroundColor || '#000000'}
                    onChange={(e) => updateField('buttonBackgroundColor', e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 text-white text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-300 font-medium">Button Text Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.buttonTextColor || '#FFFFFF'}
                    onChange={(e) => updateField('buttonTextColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-neutral-700"
                  />
                  <input
                    type="text"
                    value={data.buttonTextColor || '#FFFFFF'}
                    onChange={(e) => updateField('buttonTextColor', e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 text-white text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-300 font-medium">Button Hover Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.buttonHoverColor || '#333333'}
                    onChange={(e) => updateField('buttonHoverColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-neutral-700"
                  />
                  <input
                    type="text"
                    value={data.buttonHoverColor || '#333333'}
                    onChange={(e) => updateField('buttonHoverColor', e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 text-white text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Overlay Color */}
              <div className="space-y-2">
                <label className="text-sm text-neutral-300 font-medium">Overlay Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={data.overlayColor || '#000000'}
                    onChange={(e) => updateField('overlayColor', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-neutral-700"
                  />
                  <input
                    type="text"
                    value={data.overlayColor || '#000000'}
                    onChange={(e) => updateField('overlayColor', e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 text-white text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <>
              {/* Background Image */}
              <div className="space-y-2">
                <label className="text-sm text-neutral-300 font-medium">Background Image</label>
                <label className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
                  <Upload size={16} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={data.backgroundImage || ''}
                    onChange={(e) => updateField('backgroundImage', e.target.value)}
                    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2.5 text-white text-sm focus:border-blue-500 outline-none"
                    placeholder="Or paste image URL..."
                  />
                </div>
                {data.backgroundImage && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-neutral-700">
                    <img 
                      src={data.backgroundImage} 
                      alt="Preview" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Overlay Opacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-neutral-300 font-medium">Overlay Opacity</label>
                  <span className="text-sm text-neutral-500">
                    {Math.round((data.overlayOpacity || 0) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={data.overlayOpacity || 0.4}
                  onChange={(e) => updateField('overlayOpacity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Right Panel - Live Preview */}
      <div className="flex-1 bg-neutral-950 flex flex-col">
        {/* Preview Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-neutral-400" />
            <span className="text-sm text-neutral-400 font-medium">Live Preview</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto">
          <HeroComponent data={data} />
        </div>
      </div>

      {/* AI Designer Modal */}
      {showDesigner && (
        <HeroDesignerModal
          onClose={() => setShowDesigner(false)}
          onGenerate={handleGenerateHeroes}
          isGenerating={isGenerating}
        />
      )}
    </div>
  );
};
