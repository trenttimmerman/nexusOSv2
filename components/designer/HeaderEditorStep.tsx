/**
 * HeaderEditorStep - Step 2 of Designer V3 Wizard
 * Full-screen header customization editor
 * 
 * Designer V3 - Phase 4: Header Editor
 */

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { HeaderConfig } from '../../types/designer';
import { HEADER_FIELDS } from '../HeaderLibrary';
import { HeaderCanvas } from '../HeaderCanvas2026';

interface HeaderEditorStepProps {
  storeName: string;
  headerConfig: HeaderConfig;
  headerVariant: string;
  onUpdateConfig: (config: HeaderConfig) => void;
  onNext: () => void;
  onBack: () => void;
  onSkipToComplete: () => void;
}

export const HeaderEditorStep: React.FC<HeaderEditorStepProps> = ({
  storeName,
  headerConfig,
  headerVariant,
  onUpdateConfig,
  onNext,
  onBack,
  onSkipToComplete
}) => {
  const [config, setConfig] = useState<HeaderConfig>(headerConfig);
  const [showPreview, setShowPreview] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('general');

  // Get field registry for current variant
  const fields = HEADER_FIELDS[headerVariant] || HEADER_FIELDS['canvas'];

  // Categorize fields
  const categories = {
    general: fields.filter(f => ['announcementText', 'utilityLinks'].includes(f.name)),
    background: fields.filter(f => f.name.includes('background') || f.name.includes('Background')),
    colors: fields.filter(f => f.name.includes('Color') || f.name.includes('color')),
    typography: fields.filter(f => f.name.includes('font') || f.name.includes('Font') || f.name.includes('size')),
    layout: fields.filter(f => ['showAnnouncementBar', 'showUtilityBar', 'enableGlassmorphism', 'enableSpotlightBorders'].includes(f.name)),
    effects: fields.filter(f => f.name.includes('shadow') || f.name.includes('blur') || f.name.includes('opacity'))
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    const newConfig = { ...config, [fieldName]: value };
    setConfig(newConfig);
    onUpdateConfig(newConfig);
  };

  const handleSaveAndContinue = () => {
    onUpdateConfig(config);
    onNext();
  };

  return (
    <div className="fixed inset-0 z-[400] bg-neutral-950 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white">Customize Your Header</h2>
            <p className="text-sm text-neutral-400">Make it uniquely yours</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            title={showPreview ? "Hide preview" : "Show preview"}
          >
            {showPreview ? (
              <Eye className="w-5 h-5 text-neutral-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-neutral-400" />
            )}
          </button>
          
          <button
            onClick={onSkipToComplete}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            Skip to Complete
          </button>

          <button
            onClick={handleSaveAndContinue}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Next: Save to Library
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Controls Panel - Left Side (30%) */}
        <div className="w-[400px] border-r border-neutral-800 bg-neutral-900/50 overflow-y-auto">
          <div className="p-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveSection(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Field Controls */}
            <div className="space-y-4">
              {categories[activeSection as keyof typeof categories]?.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-300">
                    {field.label}
                  </label>
                  
                  {renderFieldControl(field, config, handleFieldChange)}
                </div>
              ))}

              {categories[activeSection as keyof typeof categories]?.length === 0 && (
                <p className="text-neutral-500 text-sm">
                  No {activeSection} options available for this header variant.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel - Right Side (70%) */}
        {showPreview && (
          <div className="flex-1 bg-neutral-950 overflow-auto">
            <div className="min-h-full p-8">
              <div className="max-w-6xl mx-auto">
                <div className="mb-4 text-center">
                  <p className="text-neutral-400 text-sm">Live Preview</p>
                </div>
                
                {/* Header Preview Container */}
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                  <HeaderPreviewRenderer config={config} variant={headerVariant} storeName={storeName} />
                </div>

                {/* Preview Info */}
                <div className="mt-6 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                  <p className="text-neutral-400 text-sm">
                    💡 This is a live preview. Changes update in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Preview State */}
        {!showPreview && (
          <div className="flex-1 flex items-center justify-center bg-neutral-950">
            <div className="text-center">
              <EyeOff className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">Preview hidden</p>
              <button
                onClick={() => setShowPreview(true)}
                className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
              >
                Show Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Render appropriate control for each field type
 */
function renderFieldControl(field: any, config: any, onChange: (name: string, value: any) => void) {
  const value = config[field.name];

  switch (field.type) {
    case 'toggle':
      return (
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(field.name, e.target.checked)}
              className="sr-only"
            />
            <div className={`w-10 h-6 rounded-full transition-colors ${
              value ? 'bg-blue-600' : 'bg-neutral-700'
            }`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                value ? 'translate-x-4' : ''
              }`} />
            </div>
          </div>
          <span className="ml-3 text-sm text-neutral-400">{field.label}</span>
        </label>
      );

    case 'color':
      return (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || '#ffffff'}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="w-12 h-10 rounded border border-neutral-700 cursor-pointer"
          />
          <input
            type="text"
            value={value || '#ffffff'}
            onChange={(e) => onChange(field.name, e.target.value)}
            className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
            placeholder="#ffffff"
          />
        </div>
      );

    case 'number':
      return (
        <input
          type="number"
          value={value || field.defaultValue || 0}
          onChange={(e) => onChange(field.name, parseFloat(e.target.value))}
          min={field.min}
          max={field.max}
          step={field.step || 1}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
        />
      );

    case 'select':
      return (
        <select
          value={value || field.defaultValue || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
        >
          {field.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case 'text':
    case 'textarea':
      const Component = field.type === 'textarea' ? 'textarea' : 'input';
      return (
        <Component
          value={value || field.defaultValue || ''}
          onChange={(e: any) => onChange(field.name, e.target.value)}
          placeholder={field.placeholder}
          rows={field.type === 'textarea' ? 3 : undefined}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
        />
      );

    default:
      return (
        <input
          type="text"
          value={value || field.defaultValue || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
        />
      );
  }
}

/**
 * HeaderPreviewRenderer - Renders the actual header component with current config
 */
interface HeaderPreviewRendererProps {
  config: HeaderConfig;
  variant: string;
  storeName: string;
}

const HeaderPreviewRenderer: React.FC<HeaderPreviewRendererProps> = ({ config, variant, storeName }) => {
  // Use the actual header component implementation for 1:1 preview accuracy
  // We provide dummy navigation data for visualization purposes
  const dummyLinks = [
    { label: 'New Arrivals', href: '#' },
    { label: 'Best Sellers', href: '#' },
    { label: 'Accessories', href: '#' },
    { label: 'SALE', href: '#' },
  ];

  // Helper to ensure CSS units are present
  const formatUnit = (val: any) => (typeof val === 'number' ? `${val}px` : val);

  const processedConfig = {
    ...config,
    paddingX: formatUnit(config.paddingX),
    paddingY: formatUnit(config.paddingY),
    borderWidth: formatUnit(config.borderWidth),
  };
  
  // Extract logo configuration from potential nested structure or flat properties
  // This ensures logo renders regardless of where it's stored in config
  const logoUrl = config.logo?.imageUrl || (config as any).logoUrl;
  const logoHeight = config.logo?.imageHeight || (config as any).logoHeight;

  return (
    <div className="preview-container isolate relative">
      <HeaderCanvas 
        storeName={storeName || "My Store"}
        logoUrl={logoUrl}
        logoHeight={logoHeight}
        links={dummyLinks}
        cartCount={3}
        primaryColor="#3b82f6"
        data={processedConfig}
      />
    </div>
  );
};
