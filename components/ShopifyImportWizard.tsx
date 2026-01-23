import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Eye, Edit2, Trash2, Sparkles, Zap, Star } from 'lucide-react';
import { extractThemeZip } from '../lib/shopify/themeUploadHandler';
import { parseShopifyTheme, calculateCompatibilityScore } from '../lib/shopify/themeParser';
import { convertShopifyTemplate } from '../lib/shopify/sectionMapper';
import { getUpgradeOptions, getRecommendedOption, mapShopifyToWebPilot } from '../lib/shopify/upgradeMapper';

interface ThemeAnalysis {
  compatibility: number;
  design: any;
  pages: Array<{
    shopifyFile: string;
    title: string;
    slug: string;
    sections: any[];
    isTemplate: boolean;
  }>;
  stats: {
    totalSections: number;
    supportedSections: number;
    unsupportedSections: number;
  };
}

interface ShopifyImportWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

interface PageSelection {
  shopifyFile: string;
  import: boolean;
  customTitle: string;
  sections: Array<{
    id: string;
    shopifyType: string;
    webpilotType: string;
    include: boolean;
    preview: any;
  }>;
}

export default function ShopifyImportWizard({ onClose, onComplete }: ShopifyImportWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [themeAnalysis, setThemeAnalysis] = useState<ThemeAnalysis | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Selection state
  const [importDesign, setImportDesign] = useState(true);
  const [designCustomizations, setDesignCustomizations] = useState<any>({});
  const [pageSelections, setPageSelections] = useState<PageSelection[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [upgradeSelections, setUpgradeSelections] = useState<Record<string, any>>({});

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setAnalyzing(true);
    setError(null);
    
    try {
      // Extract ZIP file
      const themeFiles = await extractThemeZip(file);
      
      console.log('Extracted files:', Object.keys(themeFiles));
      
      // Find settings_data.json (flexible path matching)
      const settingsPath = Object.keys(themeFiles).find(path => 
        path.endsWith('settings_data.json') && path.includes('config')
      );
      if (!settingsPath) {
        throw new Error(`settings_data.json not found in theme. Files found: ${Object.keys(themeFiles).slice(0, 10).join(', ')}`);
      }
      
      console.log('Found settings at:', settingsPath);
      
      // Normalize theme files to expected structure (parseShopifyTheme expects exact keys)
      const normalizedFiles: { [key: string]: string } = {};
      for (const [path, content] of Object.entries(themeFiles)) {
        // Normalize path (remove any leading folder names)
        let normalizedPath = path;
        if (path.includes('config/')) {
          normalizedPath = 'config/' + path.split('config/')[1];
        } else if (path.includes('templates/')) {
          normalizedPath = 'templates/' + path.split('templates/')[1];
        } else if (path.includes('sections/')) {
          normalizedPath = 'sections/' + path.split('sections/')[1];
        }
        normalizedFiles[normalizedPath] = content;
      }
      
      console.log('Normalized file keys:', Object.keys(normalizedFiles).slice(0, 10));
      
      // Parse entire theme
      const parsedTheme = await parseShopifyTheme(normalizedFiles);
      
      console.log('Parsed theme:', parsedTheme);
      
      // Find all template files (flexible path matching)
      const templatePaths = Object.keys(themeFiles).filter(path => 
        path.includes('templates') && path.endsWith('.json') && !path.includes('customers')
      );
      
      console.log(`Found ${templatePaths.length} template files:`, templatePaths.slice(0, 5));
      
      // Analyze each template
      const pages: Array<{
        shopifyFile: string;
        title: string;
        slug: string;
        sections: any[];
        isTemplate: boolean;
      }> = [];
      
      let totalSections = 0;
      let supportedSections = 0;
      
      for (const templatePath of templatePaths) {
        const templateData = JSON.parse(themeFiles[templatePath]);
        const fileName = templatePath.split('/').pop() || '';
        
        // Determine if this is a template (product.json, collection.json, etc.) or a page
        const isTemplate = !fileName.startsWith('page.') && 
                          (fileName === 'product.json' || 
                           fileName === 'collection.json' || 
                           fileName === 'article.json' ||
                           fileName === 'blog.json' ||
                           fileName === 'cart.json' ||
                           fileName === 'search.json' ||
                           fileName === 'list-collections.json');
        
        // Extract title from filename
        let title = fileName.replace('.json', '');
        if (title.startsWith('page.')) {
          title = title.replace('page.', '').split('-').map(w => 
            w.charAt(0).toUpperCase() + w.slice(1)
          ).join(' ');
        } else if (title === 'index') {
          title = 'Home';
        } else {
          title = title.split('-').map(w => 
            w.charAt(0).toUpperCase() + w.slice(1)
          ).join(' ') + (isTemplate ? ' Template' : '');
        }
        
        // Generate slug
        const slug = fileName === 'index.json' ? '/' : 
                     fileName.startsWith('page.') ? '/' + fileName.replace('page.', '').replace('.json', '') :
                     '';
        
        // Extract sections
        const sections = [];
        if (templateData.sections && typeof templateData.sections === 'object') {
          for (const [sectionId, sectionData] of Object.entries(templateData.sections)) {
            const section = sectionData as any;
            sections.push({
              id: sectionId,
              type: section.type || 'unknown',
              data: section.settings || {}
            });
            totalSections++;
            
            // Check if supported
            const supportedTypes = [
              'image-banner', 'featured-product', 'featured-collection',
              'multirow', 'image-with-text', 'rich-text', 'collection-list',
              'multicolumn', 'newsletter', 'slideshow', 'video',
              'header', 'footer', 'announcement-bar'
            ];
            if (supportedTypes.includes(section.type)) {
              supportedSections++;
            }
          }
        }
        
        pages.push({
          shopifyFile: fileName,
          title,
          slug,
          isTemplate,
          sections
        });
      }
      
      // Calculate compatibility score
      const compatibility = totalSections > 0 
        ? Math.round((supportedSections / totalSections) * 100)
        : 95;
      
      const analysis: ThemeAnalysis = {
        compatibility,
        design: {
          primaryColor: parsedTheme.design.primary_color || '#000000',
          secondaryColor: parsedTheme.design.secondary_color || '#666666',
          backgroundColor: parsedTheme.design.background_color || '#ffffff',
          headingFont: parsedTheme.design.typography?.headingFont || 'Arial',
          bodyFont: parsedTheme.design.typography?.bodyFont || 'Arial',
        },
        pages,
        stats: {
          totalSections,
          supportedSections,
          unsupportedSections: totalSections - supportedSections,
        }
      };
      
      console.log('Theme Analysis:', analysis);
      
      setThemeAnalysis(analysis);
      
      // Initialize page selections
      const selections = analysis.pages
        .filter(p => !p.isTemplate)
        .map(page => ({
          shopifyFile: page.shopifyFile,
          import: true,
          customTitle: page.title,
          sections: page.sections.map(s => ({
            id: s.id,
            shopifyType: s.type,
            webpilotType: mapSectionType(s.type),
            include: true,
            preview: s.data
          }))
        }));
      
      setPageSelections(selections);
      setAnalyzing(false);
      setStep(2);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      setError(error.message || 'Failed to analyze theme. Please check the file and try again.');
      setAnalyzing(false);
    }
  };

  const mapSectionType = (shopifyType: string): string => {
    const mapping: Record<string, string> = {
      'image-banner': 'Hero',
      'featured-product': 'ProductShowcase',
      'featured-collection': 'ProductGrid',
      'multicolumn': 'Features',
      'multirow': 'ImageTextGrid',
      'image-with-text': 'ImageText',
      'rich-text': 'RichText',
      'newsletter': 'EmailSignup',
      'slideshow': 'Hero',
      'video': 'VideoEmbed',
      'collection-list': 'CollectionGrid',
      'header': 'Header',
      'footer': 'Footer',
      'announcement-bar': 'PromoBanner',
    };
    return mapping[shopifyType] || 'Custom Section';
  };

  const handleImport = async () => {
    setStep(7);
    setImporting(true);
    
    // Simulate import progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setImportProgress(i);
    }
    
    setImporting(false);
    setStep(8);
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-between mb-8 px-8">
      {[1, 2, 3, 4, 5, 6].map((s, idx) => (
        <React.Fragment key={s}>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
              step >= s 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            <div className={`text-xs mt-2 ${step >= s ? 'text-blue-400' : 'text-gray-500'}`}>
              {s === 1 && 'Upload'}
              {s === 2 && 'Analysis'}
              {s === 3 && 'Design'}
              {s === 4 && 'Pages'}
              {s === 5 && 'Sections'}
              {s === 6 && 'Confirm'}
            </div>
          </div>
          {idx < 5 && (
            <div className={`flex-1 h-1 mx-2 ${
              step > s ? 'bg-blue-500' : 'bg-gray-700'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // STEP 1: Upload
  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-4">Upload Shopify Theme</h2>
        <p className="text-gray-400 text-center mb-8">
          Upload your downloaded Shopify theme file (.zip) to begin the migration
        </p>
        
        <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-blue-500 transition-all cursor-pointer bg-gray-800/50"
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFileUpload(file);
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('theme-upload')?.click()}
        >
          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl mb-2">Drag & drop your theme here</p>
          <p className="text-gray-500 mb-4">or click to browse</p>
          <input
            id="theme-upload"
            type="file"
            accept=".zip"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Choose File
          </button>
        </div>

        {analyzing && (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Analyzing your theme...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-900/20 border border-red-500/50 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div>
                <div className="font-semibold text-red-400 mb-2">Upload Failed</div>
                <div className="text-sm text-gray-300">{error}</div>
                <button
                  onClick={() => {
                    setError(null);
                    setUploadedFile(null);
                  }}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // STEP 2: Analysis Results
  const renderStep2 = () => (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-2">Theme Analysis Complete</h2>
      <p className="text-gray-400 text-center mb-8">
        Your theme is ready for migration
      </p>

      <div className="max-w-4xl mx-auto">
        {/* Compatibility Score */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Compatibility Score</h3>
              <p className="text-gray-400">
                {themeAnalysis?.compatibility}% of your theme can be automatically converted
              </p>
            </div>
            <div className="text-6xl font-bold text-green-400">
              {themeAnalysis?.compatibility}%
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {themeAnalysis?.pages.filter(p => !p.isTemplate).length}
            </div>
            <div className="text-gray-400">Pages Found</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {themeAnalysis?.stats.supportedSections}
            </div>
            <div className="text-gray-400">Sections Supported</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {themeAnalysis?.stats.unsupportedSections}
            </div>
            <div className="text-gray-400">Need Review</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setStep(3)}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-lg font-semibold"
          >
            Continue to Design Settings
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // STEP 3: Design Settings Review
  const renderStep3 = () => (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-2">Review Design Settings</h2>
      <p className="text-gray-400 text-center mb-8">
        Your theme colors and typography will be imported
      </p>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Shopify Side */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Shopify Theme
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">Brand Colors</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div 
                      className="w-full h-16 rounded-lg mb-1"
                      style={{ backgroundColor: themeAnalysis?.design.primaryColor }}
                    />
                    <div className="text-xs text-center">{themeAnalysis?.design.primaryColor}</div>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="w-full h-16 rounded-lg mb-1"
                      style={{ backgroundColor: themeAnalysis?.design.secondaryColor }}
                    />
                    <div className="text-xs text-center">{themeAnalysis?.design.secondaryColor}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Typography</div>
                <div className="space-y-2">
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-500">Heading Font</div>
                    <div className="font-bold">{themeAnalysis?.design.headingFont}</div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded">
                    <div className="text-xs text-gray-500">Body Font</div>
                    <div>{themeAnalysis?.design.bodyFont}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WebPilot Side */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-blue-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              WebPilot Design
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-2">Brand Colors</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div 
                      className="w-full h-16 rounded-lg mb-1"
                      style={{ backgroundColor: themeAnalysis?.design.primaryColor }}
                    />
                    <div className="text-xs text-center">{themeAnalysis?.design.primaryColor}</div>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="w-full h-16 rounded-lg mb-1"
                      style={{ backgroundColor: themeAnalysis?.design.secondaryColor }}
                    />
                    <div className="text-xs text-center">{themeAnalysis?.design.secondaryColor}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Typography</div>
                <div className="space-y-2">
                  <div className="bg-gray-900/50 p-3 rounded">
                    <div className="text-xs text-gray-500">Heading Font</div>
                    <div className="font-bold">{themeAnalysis?.design.headingFont}</div>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded">
                    <div className="text-xs text-gray-500">Body Font</div>
                    <div>{themeAnalysis?.design.bodyFont}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Perfect Match!</div>
              <div className="text-sm text-gray-400">
                Your design settings will be preserved exactly as they are in Shopify
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(2)}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => setStep(4)}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-lg font-semibold"
          >
            Continue to Pages
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // STEP 4: Page Selection
  const renderStep4 = () => (
    <div className="py-8">
      <h2 className="text-3xl font-bold text-center mb-2">Select Pages to Import</h2>
      <p className="text-gray-400 text-center mb-8">
        Choose which pages to migrate to WebPilot
      </p>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-3 mb-8">
          {pageSelections.map((page, idx) => (
            <div 
              key={idx}
              className={`bg-gray-800 rounded-lg p-4 border-2 transition-all ${
                page.import ? 'border-blue-500' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={page.import}
                  onChange={(e) => {
                    const updated = [...pageSelections];
                    updated[idx].import = e.target.checked;
                    setPageSelections(updated);
                  }}
                  className="w-5 h-5 text-blue-500"
                />
                
                <div className="flex-1">
                  <input
                    type="text"
                    value={page.customTitle}
                    onChange={(e) => {
                      const updated = [...pageSelections];
                      updated[idx].customTitle = e.target.value;
                      setPageSelections(updated);
                    }}
                    className="bg-gray-900 border border-gray-700 rounded px-3 py-2 w-full max-w-xs font-semibold"
                    style={{ color: '#000000' }}
                    placeholder="Page Title"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {page.sections.length} sections • {page.shopifyFile}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    page.import ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {page.sections.filter(s => s.include).length}/{page.sections.length} sections
                  </div>
                  
                  <button
                    onClick={() => {
                      setCurrentPageIndex(idx);
                      setCurrentSectionIndex(0); // Reset section index
                      setStep(5);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Review Sections
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Templates Notice */}
        {themeAnalysis?.pages.filter(p => p.isTemplate).length! > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <div className="font-semibold mb-1">Templates Excluded</div>
                <div className="text-sm text-gray-400">
                  {themeAnalysis?.pages.filter(p => p.isTemplate).length} template files were found but won't be imported as pages 
                  (product.json, collection.json, etc.)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep(3)}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={() => setStep(6)}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-lg font-semibold"
          >
            Continue to Review
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // STEP 5: Section-by-Section Review
  const renderStep5 = () => {
    const currentPage = pageSelections[currentPageIndex];
    const currentSection = currentPage.sections[currentSectionIndex];
    const sectionKey = `${currentPageIndex}-${currentSectionIndex}`;
    
    // Check if this section has upgrade options
    const upgradeMapping = getUpgradeOptions(currentSection.shopifyType);
    const hasUpgrades = !!upgradeMapping;
    
    // Get selected upgrade or recommended one
    const selectedUpgrade = upgradeSelections[sectionKey] || getRecommendedOption(currentSection.shopifyType);

    const handleSelectUpgrade = (option: any) => {
      setUpgradeSelections({
        ...upgradeSelections,
        [sectionKey]: option
      });
    };

    return (
      <div className="py-8">
        <h2 className="text-3xl font-bold text-center mb-2">
          Review Sections: {currentPage.customTitle}
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Section {currentSectionIndex + 1} of {currentPage.sections.length}
        </p>

        <div className="max-w-6xl mx-auto">
          {hasUpgrades ? (
            // UPGRADE OPPORTUNITY UI
            <div>
              {/* Header Message */}
              <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-8 text-center">
                <div className="text-4xl mb-3">{upgradeMapping.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{upgradeMapping.message}</h3>
                <p className="text-gray-400">Choose your preferred upgrade option</p>
              </div>

              {/* Side-by-side Comparison */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Left: Your Shopify Section */}
                <div className="bg-gray-800 rounded-xl p-6">
                  <h4 className="text-lg font-bold mb-4 text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Your Shopify Section
                  </h4>
                  
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-500 mb-1">Section Type</div>
                    <div className="font-mono text-purple-400">{currentSection.shopifyType}</div>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-500">
                    <div className="mb-2 font-semibold">Current Features:</div>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Basic functionality</li>
                      <li>Limited customization</li>
                      <li>Standard Shopify design</li>
                    </ul>
                  </div>
                </div>

                {/* Right: Upgrade Options */}
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-blue-500">
                  <h4 className="text-lg font-bold mb-4 text-blue-400 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    WebPilot Upgrade Options
                  </h4>
                  
                  <div className="space-y-3">
                    {upgradeMapping.options.map((option, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectUpgrade(option)}
                        className={`bg-gray-900/50 rounded-lg p-4 cursor-pointer transition-all hover:bg-gray-900/70 ${
                          selectedUpgrade?.id === option.id && selectedUpgrade?.variant === option.variant
                            ? 'border-2 border-blue-500 ring-2 ring-blue-500/30'
                            : 'border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedUpgrade?.id === option.id && selectedUpgrade?.variant === option.variant
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-600'
                            }`}>
                              {selectedUpgrade?.id === option.id && selectedUpgrade?.variant === option.variant && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <h5 className="font-bold text-white">{option.name}</h5>
                          </div>
                          {option.recommended && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Recommended
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-3">{option.description}</p>
                        
                        <div className="text-xs text-gray-500">
                          <div className="font-semibold text-green-400 mb-1">✨ Upgrades:</div>
                          <ul className="space-y-0.5">
                            {option.upgrades.slice(0, 3).map((upgrade, i) => (
                              <li key={i}>• {upgrade}</li>
                            ))}
                            {option.upgrades.length > 3 && (
                              <li className="text-blue-400">+ {option.upgrades.length - 3} more...</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-bold mb-4">Preview</h4>
                <div className="bg-white rounded-lg p-8 min-h-[200px] flex items-center justify-center">
                  <div className="text-gray-800 text-center">
                    <div className="text-2xl font-bold mb-2">{selectedUpgrade?.name}</div>
                    <div className="text-gray-600">Component preview will render here</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // STANDARD SECTION (No upgrades available)
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Shopify Section */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Shopify Section
                </h3>
                
                <div className="bg-gray-900 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-500 mb-1">Section Type</div>
                  <div className="font-mono text-purple-400 text-lg">{currentSection.shopifyType}</div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 text-center text-gray-500">
                  <div className="text-sm mb-2">Preview</div>
                  <div className="italic">Shopify section preview</div>
                </div>
              </div>

              {/* WebPilot Component */}
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border-2 border-blue-500">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  WebPilot Component
                </h3>
                
                <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-500 mb-1">Component Type</div>
                  <div className="font-mono text-blue-400 text-lg">{currentSection.webpilotType}</div>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-6 text-center">
                  <div className="text-sm mb-2 text-gray-400">Component Preview</div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-8 border border-blue-500/30">
                    <div className="text-blue-400 font-semibold mb-2">{currentSection.webpilotType}</div>
                    <div className="text-sm text-gray-400">Will be rendered here</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Navigation */}
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4 mb-6">
            <div className="text-gray-400">
              Section {currentSectionIndex + 1} of {currentPage.sections.length}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentSectionIndex(Math.max(0, currentSectionIndex - 1))}
                disabled={currentSectionIndex === 0}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentSectionIndex(Math.min(currentPage.sections.length - 1, currentSectionIndex + 1))}
                disabled={currentSectionIndex === currentPage.sections.length - 1}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Pages
            </button>
            <button
              onClick={() => setStep(6)}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-lg font-semibold"
            >
              Continue to Review
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // STEP 6: Final Review & Confirmation
  const renderStep6 = () => {
    const selectedPages = pageSelections.filter(p => p.import);
    const totalSections = selectedPages.reduce((acc, p) => acc + p.sections.filter(s => s.include).length, 0);

    return (
      <div className="py-8">
        <h2 className="text-3xl font-bold text-center mb-2">Final Review</h2>
        <p className="text-gray-400 text-center mb-8">
          Confirm your selections before importing
        </p>

        <div className="max-w-4xl mx-auto">
          {/* Summary */}
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Import Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-400">{selectedPages.length}</div>
                <div className="text-gray-400">Pages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">{totalSections}</div>
                <div className="text-gray-400">Sections</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">1</div>
                <div className="text-gray-400">Design</div>
              </div>
            </div>
          </div>

          {/* Page List */}
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Pages to Import</h3>
            <div className="space-y-2">
              {selectedPages.map((page, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-900 rounded p-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-semibold">{page.customTitle}</div>
                      <div className="text-sm text-gray-500">
                        {page.sections.filter(s => s.include).length} sections
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-semibold">Estimated Time: 30-60 seconds</div>
                <div className="text-sm text-gray-400">
                  Your store will be ready to customize after import
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={handleImport}
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 flex items-center gap-2 text-xl font-bold"
            >
              <Sparkles className="w-6 h-6" />
              Import Everything
            </button>
          </div>
        </div>
      </div>
    );
  };

  // STEP 7: Importing Progress
  const renderStep7 = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-4">Importing Your Store</h2>
        <p className="text-gray-400 text-center mb-8">
          Please wait while we migrate your Shopify theme...
        </p>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">
              {importProgress < 30 && 'Importing design settings...'}
              {importProgress >= 30 && importProgress < 80 && 'Creating pages & sections...'}
              {importProgress >= 80 && 'Finalizing import...'}
            </span>
            <span className="font-bold text-blue-400">{importProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${importProgress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className={`flex items-center gap-3 ${importProgress >= 30 ? 'text-green-400' : 'text-gray-500'}`}>
            {importProgress >= 30 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
            <span>Design Settings Imported</span>
          </div>
          <div className={`flex items-center gap-3 ${importProgress >= 80 ? 'text-green-400' : 'text-gray-500'}`}>
            {importProgress >= 80 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
            <span>Pages & Sections Created</span>
          </div>
          <div className={`flex items-center gap-3 ${importProgress === 100 ? 'text-green-400' : 'text-gray-500'}`}>
            {importProgress === 100 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
            <span>Store Activated</span>
          </div>
        </div>
      </div>
    </div>
  );

  // STEP 8: Complete
  const renderStep8 = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        
        <h2 className="text-4xl font-bold mb-4">Import Complete! 🎉</h2>
        <p className="text-xl text-gray-400 mb-8">
          Your Shopify theme has been successfully migrated to WebPilot
        </p>

        <div className="bg-gray-800 rounded-xl p-8 mb-8">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {pageSelections.filter(p => p.import).length}
              </div>
              <div className="text-gray-400">Pages Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {pageSelections.reduce((acc, p) => acc + p.sections.filter(s => s.include).length, 0)}
              </div>
              <div className="text-gray-400">Sections Converted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {themeAnalysis?.compatibility}%
              </div>
              <div className="text-gray-400">Compatibility</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onComplete}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg font-semibold"
          >
            View My Store
          </button>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Shopify Theme Import</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        {step <= 6 && (
          <div className="border-b border-gray-800 py-6">
            {renderProgressBar()}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
          {step === 7 && renderStep7()}
          {step === 8 && renderStep8()}
        </div>
      </div>
    </div>
  );
}
