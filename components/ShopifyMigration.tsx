import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, Download, Package, Zap, Eye, Settings, Sparkles } from 'lucide-react';
import { extractShopifyTheme, getThemeInfo, ShopifyThemeStructure, extractThemeSettings, parseLiquidSection } from '../lib/shopifyThemeParser';
import { extractDataReferences } from '../lib/liquidParser';
import { generateBlockMapping, generateBlockMappingFromTemplate, getSectionMappingSuggestions, MappedBlock } from '../lib/sectionMatcher';
import { extractContentFromTheme, extractColorPalette, extractTypography } from '../lib/shopifyDataExtractor';
import { uploadThemeAssets, AssetUploadProgress, createAssetUrlMap } from '../lib/assetUploader';
import { ParsedTemplate } from '../lib/shopifyTemplateParser';
import { supabase } from '../lib/supabaseClient';

interface ShopifyMigrationProps {
  storeId: string;
  onComplete?: () => void;
  onNavigateToPage?: (pageId: string) => void;
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

export default function ShopifyMigration({ storeId, onComplete, onNavigateToPage }: ShopifyMigrationProps) {
  const [step, setStep] = useState<MigrationStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [migrationId, setMigrationId] = useState<string | null>(null);
  const [migratedPageId, setMigratedPageId] = useState<string | null>(null);
  const [mappedBlocks, setMappedBlocks] = useState<MappedBlock[]>([]);
  const [uploadProgress, setUploadProgress] = useState<AssetUploadProgress | null>(null);
  const [pagesCreated, setPagesCreated] = useState<number>(0);

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

  const handleStartMigration = async () => {
    if (!analysis) return;
    
    try {
      setStep('mapping');
      setProgress(0);
      setCurrentTask('Mapping sections to nexusOS blocks...');
      
      console.log('[Migration] Sections available:', Object.keys(analysis.theme.files.sections).length);
      console.log('[Migration] Section files:', Object.keys(analysis.theme.files.sections));
      
      // Parse sections from strings to ParsedSection objects
      const parsedSections: Record<string, any> = {};
      Object.entries(analysis.theme.files.sections).forEach(([filename, liquidContent]) => {
        parsedSections[filename] = parseLiquidSection(liquidContent as string);
      });
      
      let blocks: MappedBlock[] = [];
      
      // Use template data if available (REAL CONFIGURED VALUES)
      if (analysis.theme.parsedTemplates?.index) {
        console.log('[Migration] Using template data for accurate mapping');
        const indexTemplate = analysis.theme.parsedTemplates.index;
        
        // generateBlockMappingFromTemplate expects array of sections and Record of liquid sections
        blocks = generateBlockMappingFromTemplate(
          indexTemplate.sections, 
          parsedSections
        );
        console.log('[Migration] Generated blocks from template data:', blocks.length, blocks);
      } else {
        // Fallback to legacy schema-only mapping
        console.log('[Migration] No template data found, using schema-only mapping (less accurate)');
        blocks = generateBlockMapping(parsedSections);
        console.log('[Migration] Generated blocks from schema:', blocks.length, blocks);
      }
      
      // If no blocks generated, create default blocks
      if (blocks.length === 0) {
        console.warn('[Migration] No blocks generated, creating defaults');
        blocks = [{
          type: 'system-hero',
          variant: 'split',
          data: {
            heading: 'Welcome to Your Store',
            subheading: 'Start customizing your migrated theme',
            buttonText: 'Shop Now',
            buttonLink: '/products',
            backgroundImage: '',
            overlayOpacity: 0.3,
            textAlign: 'left',
            textColor: '#ffffff',
            showButton: true
          },
          order: 0,
          warnings: ['Created default hero section - no sections found in theme']
        }];
      }
      
      console.log('[Migration] Final blocks to use:', blocks.length, blocks);
      setMappedBlocks(blocks);
      setProgress(100);
      
      // Auto-proceed to importing - pass blocks directly to avoid state timing issues
      setTimeout(() => {
        handleStartImport(blocks);
      }, 1500);
      
    } catch (error: any) {
      alert(`Mapping failed: ${error.message}`);
    }
  };
  
  const handleStartImport = async (blocksToImport?: MappedBlock[]) => {
    if (!analysis || !migrationId) return;
    
    // Use passed blocks or fall back to state
    const blocksToSave = blocksToImport || mappedBlocks;
    
    console.log('[Migration] Starting import with blocks:', blocksToSave.length);
    
    try {
      setStep('importing');
      setProgress(0);
      setCurrentTask('Starting import...');
      
      // 1. Upload assets
      setCurrentTask('Uploading theme assets...');
      const uploadedAssets = await uploadThemeAssets(
        storeId,
        migrationId,
        analysis.theme.files.assets,
        supabase,
        setUploadProgress
      );
      
      setProgress(30);
      
      // 2. Extract content
      setCurrentTask('Extracting content data...');
      const content = extractContentFromTheme(analysis.theme);
      const colors = extractColorPalette(analysis.theme);
      const typography = extractTypography(analysis.theme);
      
      setProgress(50);
      
      // 3. Save blocks to database - Create pages for all templates
      setCurrentTask('Creating pages from templates...');
      
      console.log('[Migration] Available templates:', analysis.theme.parsedTemplates ? Object.keys(analysis.theme.parsedTemplates) : 'none');
      
      // Parse sections for template mapping
      const parsedSections: Record<string, any> = {};
      Object.entries(analysis.theme.files.sections).forEach(([filename, liquidContent]) => {
        parsedSections[filename] = parseLiquidSection(liquidContent as string);
      });
      
      const createdPages: string[] = [];
      let homepageId: string | null = null;
      
      // Process all available templates
      if (analysis.theme.parsedTemplates) {
        for (const [templateName, templateData] of Object.entries(analysis.theme.parsedTemplates)) {
          const template = templateData as ParsedTemplate;
          
          // Generate blocks for this template
          const templateBlocks = generateBlockMappingFromTemplate(
            template.sections,
            parsedSections
          );
          
          if (templateBlocks.length === 0) {
            console.log(`[Migration] Skipping ${templateName} - no blocks generated`);
            continue;
          }
          
          // Determine page title and slug
          let pageTitle = 'Migrated Page';
          let pageSlug = `migrated-${templateName.replace('.json', '')}`;
          let pageType = 'custom';
          
          if (templateName === 'index') {
            pageTitle = 'Migrated Homepage';
            pageSlug = 'migrated-home';
          } else if (templateName === 'product') {
            pageTitle = 'Product Template';
            pageSlug = 'migrated-product';
          } else if (templateName === 'collection') {
            pageTitle = 'Collection Template';
            pageSlug = 'migrated-collection';
          } else if (templateName === 'blog') {
            pageTitle = 'Blog Template';
            pageSlug = 'migrated-blog';
          } else if (templateName === 'article') {
            pageTitle = 'Article Template';
            pageSlug = 'migrated-article';
          } else if (templateName.startsWith('page.')) {
            pageTitle = `Page: ${templateName.replace('page.', '').replace('.json', '')}`;
            pageSlug = `migrated-${templateName.replace('.json', '')}`;
          }
          
          const pageBlocks = templateBlocks.map(block => ({
            id: `block_${Math.random().toString(36).substr(2, 9)}`,
            type: block.type,
            variant: block.variant,
            data: block.data
          }));
          
          console.log(`[Migration] Creating page: ${pageTitle} (${templateBlocks.length} blocks)`);
          
          // Check if page exists
          const { data: existingPage } = await supabase
            .from('pages')
            .select('id')
            .eq('store_id', storeId)
            .eq('slug', pageSlug)
            .maybeSingle();
          
          if (existingPage) {
            // Update existing page
            const { error: pageError } = await supabase
              .from('pages')
              .update({
                title: pageTitle,
                blocks: pageBlocks
              })
              .eq('id', existingPage.id);
            
            if (!pageError) {
              createdPages.push(existingPage.id);
              if (templateName === 'index') homepageId = existingPage.id;
            }
          } else {
            // Create new page
            const pageId = `migrated_${templateName}_${Date.now()}`;
            const { error: pageError } = await supabase.from('pages').insert([{
              id: pageId,
              store_id: storeId,
              title: pageTitle,
              slug: pageSlug,
              type: pageType,
              blocks: pageBlocks
            }]);
            
            if (!pageError) {
              createdPages.push(pageId);
              if (templateName === 'index') homepageId = pageId;
            }
          }
        }
      }
      
      // If no templates were processed, create default homepage with the mapped blocks
      if (createdPages.length === 0 && blocksToSave.length > 0) {
        console.log('[Migration] No templates processed, creating default homepage');
        const pageBlocks = blocksToSave.map(block => ({
          id: `block_${Math.random().toString(36).substr(2, 9)}`,
          type: block.type,
          variant: block.variant,
          data: block.data
        }));
        
        const pageId = `migrated_${Date.now()}`;
        const { error: pageError } = await supabase.from('pages').insert([{
          id: pageId,
          store_id: storeId,
          title: 'Migrated Homepage',
          slug: 'migrated-home',
          type: 'custom',
          blocks: pageBlocks
        }]);
        
        if (!pageError) {
          createdPages.push(pageId);
          homepageId = pageId;
        }
      }
      
      console.log(`[Migration] Created ${createdPages.length} pages`);
      
      // Store the homepage ID for navigation and page count
      setMigratedPageId(homepageId || createdPages[0] || null);
      setPagesCreated(createdPages.length);
      
      setProgress(70);
      
      // 4. Update store config with theme settings
      setCurrentTask('Applying theme settings...');
      
      // Prepare config updates
      const configUpdates: any = {
        primary_color: colors.primary,
        secondary_color: colors.secondary,
        background_color: colors.background
      };
      
      // Add logo if available from settings
      if (analysis.theme.settings?.logo) {
        configUpdates.logo_url = analysis.theme.settings.logo;
      }
      
      // Add social media links if available
      if (analysis.theme.settings?.social) {
        const social = analysis.theme.settings.social;
        if (social.facebook) configUpdates.facebook_url = social.facebook;
        if (social.instagram) configUpdates.instagram_url = social.instagram;
        if (social.twitter) configUpdates.twitter_url = social.twitter;
        if (social.tiktok) configUpdates.tiktok_url = social.tiktok;
      }
      
      const { error: configError } = await supabase
        .from('store_config')
        .update(configUpdates)
        .eq('store_id', storeId);
      
      if (configError) {
        console.error('Failed to update config:', configError);
      }
      
      setProgress(90);
      
      // 5. Update migration status
      setCurrentTask('Finalizing migration...');
      await supabase
        .from('shopify_migrations')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          migration_data: {
            ...analysis.theme.detectedTheme,
            blocks: blocksToSave.length,
            assets: uploadedAssets.length,
            pages: createdPages.length
          }
        })
        .eq('id', migrationId);
      
      setProgress(100);
      setStep('complete');
      
    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
      console.error('Import error:', error);
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFile(null);
    setAnalysis(null);
    setProgress(0);
    setMigrationId(null);
    setPagesCreated(0);
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <Sparkles size={48} className="mx-auto mb-4 text-purple-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mapping Sections</h2>
            <p className="text-gray-600">Converting Shopify sections to nexusOS blocks...</p>
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

          {mappedBlocks.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Mapped Blocks ({mappedBlocks.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {mappedBlocks.map((block, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{block.type}</div>
                      <div className="text-sm text-gray-600">Variant: {block.variant}</div>
                    </div>
                    {block.warnings.length > 0 && (
                      <AlertTriangle size={18} className="text-yellow-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {step === 'importing' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <Zap size={48} className="mx-auto mb-4 text-purple-600 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Importing to nexusOS</h2>
            <p className="text-gray-600">{currentTask}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {uploadProgress && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Asset Upload</h3>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{uploadProgress.current}</span>
                  <span>{uploadProgress.uploaded} / {uploadProgress.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.uploaded / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
              {uploadProgress.errors.length > 0 && (
                <div className="mt-4 text-sm text-red-600">
                  {uploadProgress.errors.length} upload error(s)
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{mappedBlocks.length}</div>
              <div className="text-sm text-gray-600">Blocks Created</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {uploadProgress?.uploaded || 0}
              </div>
              <div className="text-sm text-gray-600">Assets Uploaded</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{progress}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <CheckCircle size={64} className="mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Migration Complete!</h2>
            <p className="text-gray-600">Your Shopify theme has been successfully migrated to nexusOS</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-900 mb-1">{mappedBlocks.length}</div>
              <div className="text-sm text-green-700">Blocks Created</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-900 mb-1">
                {uploadProgress?.uploaded || 0}
              </div>
              <div className="text-sm text-blue-700">Assets Migrated</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-900 mb-1">{pagesCreated || 1}</div>
              <div className="text-sm text-purple-700">{pagesCreated === 1 ? 'Page' : 'Pages'} Created</div>
            </div>
          </div>

          {mappedBlocks.some(b => b.warnings.length > 0) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-yellow-600" />
                <h3 className="font-semibold text-yellow-900">Post-Migration Notes</h3>
              </div>
              <ul className="text-sm text-yellow-800 space-y-1">
                {Array.from(new Set(mappedBlocks.flatMap(b => b.warnings))).map((warning, idx) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Next Steps:</h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Review the migrated page: "Migrated Homepage"</li>
              <li>Customize colors and fonts in Design Studio</li>
              <li>Add your products and collections</li>
              <li>Adjust block layouts and content as needed</li>
              <li>Preview and publish your site</li>
            </ol>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Migrate Another Theme
            </button>
            <button
              onClick={() => {
                if (migratedPageId && onNavigateToPage) {
                  onNavigateToPage(migratedPageId);
                } else if (onComplete) {
                  onComplete();
                }
              }}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
            >
              <Eye size={18} />
              View Migrated Site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
