import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Package, Zap, Eye, Settings } from 'lucide-react';
import { extractShopifyTheme, getThemeInfo, ShopifyThemeStructure, extractThemeSettings, parseLiquidSection } from '../lib/shopifyThemeParser';
import { extractDataReferences } from '../lib/liquidParser';
import { supabase } from '../lib/supabaseClient';

interface ShopifyMigrationProps {
  storeId: string;
  onComplete?: () => void;
}


type MigrationStep = 'upload' | 'analyzing' | 'preview' | 'mapping' | 'importing' | 'complete';

interface AnalysisResult {
  theme: ShopifyThemeStructure;
  stats: {
    sections: number;
    snippets: number;
    templates: number;
    images: number;
    cssFiles: number;
    jsFiles: number;
  };
  warnings: string[];
  detected: {
    products: boolean;
    collections: boolean;
    blog: boolean;
    customCode: boolean;
  };
}

export default function ShopifyMigration({ storeId, onComplete }: ShopifyMigrationProps) {
  const [step, setStep] = useState<MigrationStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [migrationId, setMigrationId] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.zip')) {
      alert('Please upload a .zip file containing your Shopify theme');
      return;
    }

    try {
      setFile(uploadedFile);
      setStep('analyzing');
      setCurrentTask('Extracting theme files...');
      setProgress(10);

      // Extract theme
      const theme = await extractShopifyTheme(uploadedFile);
      setProgress(30);
      setCurrentTask('Analyzing theme structure...');

      // Analyze sections
      const warnings: string[] = [];
      let hasProducts = false;
      let hasCollections = false;
      let hasBlog = false;
      let hasCustomCode = false;

      // Analyze each section for data dependencies
      Object.entries(theme.files.sections).forEach(([filename, content]) => {
        const refs = extractDataReferences(content);
        if (refs.products) hasProducts = true;
        if (refs.collections) hasCollections = true;
        if (refs.blog) hasBlog = true;

        // Check for custom Liquid code
        if (content.includes('{% raw %}') || content.includes('{% javascript %}')) {
          hasCustomCode = true;
          warnings.push(`Custom code detected in ${filename}`);
        }
      });

      setProgress(50);
      setCurrentTask('Detecting theme type...');

      const themeInfo = getThemeInfo(theme.detectedTheme);
      
      if (!themeInfo.os2Compatible) {
        warnings.push('This theme uses an older Shopify format. Some features may need manual adjustment.');
      }

      setProgress(70);
      setCurrentTask('Analyzing assets...');

      // Count assets
      const stats = {
        sections: Object.keys(theme.files.sections).length,
        snippets: Object.keys(theme.files.snippets).length,
        templates: Object.keys(theme.files.templates).length,
        images: Object.keys(theme.files.assets.images).length,
        cssFiles: Object.keys(theme.files.assets.styles).length,
        jsFiles: Object.keys(theme.files.assets.scripts).length
      };

      if (stats.jsFiles > 5) {
        warnings.push(`${stats.jsFiles} JavaScript files detected. Custom JS may require manual integration.`);
      }

      setProgress(90);
      setCurrentTask('Creating migration record...');

      // Create migration record
      const migration = {
        id: `mig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        store_id: storeId,
        theme_name: theme.themeName,
        theme_version: theme.themeVersion,
        status: 'analyzing',
        migration_data: {
          detectedTheme: theme.detectedTheme,
          stats,
          warnings
        },
        warnings: warnings
      };

      const { error } = await supabase.from('shopify_migrations').insert([migration]);
      if (error) {
        console.error('Failed to create migration record:', error);
      } else {
        setMigrationId(migration.id);
      }

      setAnalysis({
        theme,
        stats,
        warnings,
        detected: {
          products: hasProducts,
          collections: hasCollections,
          blog: hasBlog,
          customCode: hasCustomCode
        }
      });

      setProgress(100);
      setStep('preview');

    } catch (error: any) {
      alert(`Failed to analyze theme: ${error.message}`);
      setStep('upload');
    }
  }, [storeId]);

  const handleStartMigration = () => {
    setStep('mapping');
    // Next phase will handle section mapping
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setAnalysis(null);
    setProgress(0);
    setMigrationId(null);
  };

  return (
    <div className="p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['upload', 'analyzing', 'preview', 'mapping', 'importing'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === s ? 'bg-purple-600 text-white' : 
                ['upload', 'analyzing', 'preview'].indexOf(step) > idx ? 'bg-green-600 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>
                {['upload', 'analyzing', 'preview'].indexOf(step) > idx ? '✓' : idx + 1}
              </div>
              {idx < 4 && (
                <div className={`h-1 w-16 ${
                  ['upload', 'analyzing', 'preview'].indexOf(step) > idx ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm font-medium text-gray-600">
          <span>Upload</span>
          <span>Analyze</span>
          <span>Preview</span>
          <span>Map</span>
          <span>Import</span>
        </div>
      </div>

      {/* Step Content */}
      {step === 'upload' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Package size={48} className="mx-auto mb-4 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Shopify Theme</h2>
            <p className="text-gray-600">Upload your Shopify theme ZIP file to migrate to nexusOS</p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 transition-colors">
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <label className="cursor-pointer">
              <span className="text-purple-600 hover:text-purple-700 font-medium">Choose a theme ZIP file</span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">Shopify theme package (.zip)</p>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to export your Shopify theme:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Go to Online Store → Themes in your Shopify admin</li>
              <li>Find the theme you want to migrate</li>
              <li>Click Actions → Download theme file</li>
              <li>Upload the downloaded .zip file here</li>
            </ol>
          </div>

          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-purple-900 mb-2">Supported Themes:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-purple-800">
              <div>• Dawn (OS 2.0)</div>
              <div>• Debut</div>
              <div>• Brooklyn</div>
              <div>• Narrative</div>
              <div>• Supply</div>
              <div>• Venture</div>
              <div>• Boundless</div>
              <div>• Custom themes</div>
            </div>
          </div>
        </div>
      )}

      {step === 'analyzing' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Zap size={48} className="mx-auto mb-4 text-purple-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Theme</h2>
            <p className="text-gray-600">{currentTask}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>This may take a moment depending on theme size...</p>
          </div>
        </div>
      )}

      {step === 'preview' && analysis && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Theme Analysis Complete</h2>
            <p className="text-gray-600">Review the analysis before proceeding with migration</p>
          </div>

          {/* Theme Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Package size={32} className="text-purple-600" />
              <div>
                <h3 className="text-xl font-bold text-purple-900">{analysis.theme.themeName}</h3>
                <p className="text-purple-700">
                  {getThemeInfo(analysis.theme.detectedTheme).name} 
                  {analysis.theme.themeVersion && ` (v${analysis.theme.themeVersion})`}
                </p>
              </div>
            </div>
            <p className="text-sm text-purple-800">{getThemeInfo(analysis.theme.detectedTheme).description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Sections</div>
              <div className="text-2xl font-bold text-gray-900">{analysis.stats.sections}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Snippets</div>
              <div className="text-2xl font-bold text-gray-900">{analysis.stats.snippets}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Templates</div>
              <div className="text-2xl font-bold text-gray-900">{analysis.stats.templates}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Images</div>
              <div className="text-2xl font-bold text-gray-900">{analysis.stats.images}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">CSS Files</div>
              <div className="text-2xl font-bold text-gray-900">{analysis.stats.cssFiles}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">JS Files</div>
              <div className="text-2xl font-bold text-gray-900">{analysis.stats.jsFiles}</div>
            </div>
          </div>

          {/* Detected Features */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Detected Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex items-center gap-2 ${analysis.detected.products ? 'text-green-700' : 'text-gray-400'}`}>
                <CheckCircle size={20} />
                <span>Product Pages</span>
              </div>
              <div className={`flex items-center gap-2 ${analysis.detected.collections ? 'text-green-700' : 'text-gray-400'}`}>
                <CheckCircle size={20} />
                <span>Collections</span>
              </div>
              <div className={`flex items-center gap-2 ${analysis.detected.blog ? 'text-green-700' : 'text-gray-400'}`}>
                <CheckCircle size={20} />
                <span>Blog Posts</span>
              </div>
              <div className={`flex items-center gap-2 ${analysis.detected.customCode ? 'text-yellow-600' : 'text-gray-400'}`}>
                <AlertTriangle size={20} />
                <span>Custom Code</span>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {analysis.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">Migration Warnings</h3>
              </div>
              <ul className="space-y-2 text-sm text-yellow-800">
                {analysis.warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleStartMigration}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <Zap size={18} />
              Start Migration
            </button>
          </div>
        </div>
      )}

      {step === 'mapping' && (
        <div className="max-w-4xl mx-auto text-center">
          <Settings size={64} className="mx-auto mb-4 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Section Mapping</h2>
          <p className="text-gray-600 mb-8">Phase 2: Section conversion coming next...</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">Next Steps (Phase 2):</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>✓ Theme structure analyzed</li>
              <li>→ Map Shopify sections to nexusOS blocks</li>
              <li>→ Convert Liquid templates to React components</li>
              <li>→ Extract and migrate content data</li>
              <li>→ Upload assets to storage</li>
              <li>→ Generate preview site</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
