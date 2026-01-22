import React from 'react';
import { Check, AlertTriangle, FileText, Palette, Layout, Sparkles } from 'lucide-react';

interface ThemePreviewProps {
  preview: {
    design: {
      colors: {
        primary: string;
        secondary: string;
        background: string;
      };
      typography: {
        heading: string;
        body: string;
      };
      vibe: string;
    };
    pages: {
      title: string;
      type: string;
      sectionCount: number;
      convertedSections: number;
      unsupportedSections: string[];
    }[];
    assets: {
      logo?: string;
      favicon?: string;
    };
    conversionScore: number;
  };
  onProceed: () => void;
  onCancel: () => void;
}

const ShopifyThemePreview: React.FC<ThemePreviewProps> = ({
  preview,
  onProceed,
  onCancel,
}) => {
  const { design, pages, assets, conversionScore } = preview;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Theme Analysis Complete!</h2>
        <p className="text-gray-600">
          Your Shopify theme is ready to import. Here's what we found:
        </p>
      </div>

      {/* Conversion Score */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Conversion Compatibility</h3>
            <p className="text-gray-600 text-sm">
              Percentage of your theme that transfers automatically
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">
              {conversionScore}%
            </div>
            <p className="text-sm text-gray-500">Compatible</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${conversionScore}%` }}
          />
        </div>
      </div>

      {/* Design Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Colors */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="font-semibold">Brand Colors</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg border border-gray-300 mr-3"
                style={{ backgroundColor: design.colors.primary }}
              />
              <div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-gray-500">{design.colors.primary}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg border border-gray-300 mr-3"
                style={{ backgroundColor: design.colors.secondary }}
              />
              <div>
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs text-gray-500">{design.colors.secondary}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-lg border border-gray-300 mr-3"
                style={{ backgroundColor: design.colors.background }}
              />
              <div>
                <p className="text-sm font-medium">Background</p>
                <p className="text-xs text-gray-500">{design.colors.background}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Style */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold">Typography & Style</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Heading Font</p>
              <p
                className="text-2xl"
                style={{ fontFamily: design.typography.heading }}
              >
                {design.typography.heading}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Body Font</p>
              <p
                className="text-base"
                style={{ fontFamily: design.typography.body }}
              >
                {design.typography.body}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Design Vibe</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                {design.vibe}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Breakdown */}
      <div className="border rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <Layout className="w-5 h-5 text-indigo-600 mr-2" />
          <h3 className="font-semibold">Pages to Import ({pages.length})</h3>
        </div>
        <div className="space-y-3">
          {pages.map((page, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                {page.unsupportedSections.length === 0 ? (
                  <Check className="w-5 h-5 text-green-600 mr-3" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                )}
                <div>
                  <p className="font-medium">{page.title}</p>
                  <p className="text-sm text-gray-500">
                    {page.sectionCount} sections
                    {page.unsupportedSections.length > 0 &&
                      ` (${page.unsupportedSections.length} need manual setup)`}
                  </p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-white rounded border text-gray-600 capitalize">
                {page.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Assets Info */}
      {(assets.logo || assets.favicon) && (
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            ✓ {assets.logo && 'Logo'}{assets.logo && assets.favicon && ' and '}
            {assets.favicon && 'Favicon'} will be imported automatically
          </p>
        </div>
      )}

      {/* What Happens Next */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-3">What happens when you import:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>All design settings (colors, fonts, spacing) will be applied</span>
          </li>
          <li className="flex items-start">
            <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>{pages.length} pages will be created with all sections</span>
          </li>
          <li className="flex items-start">
            <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Logo and branding assets will be transferred</span>
          </li>
          <li className="flex items-start">
            <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>You can customize everything in Studio after import</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onProceed}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Import Theme →
        </button>
      </div>
    </div>
  );
};

export default ShopifyThemePreview;
