/**
 * Shopify Theme Import Component
 * Theme migration wizard with upload, preview, and conversion
 */

import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader, FileArchive, Folder } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { processThemeUpload, getThemeMetadata } from '../lib/shopify/themeUploadHandler';
import { parseShopifyTheme, calculateCompatibilityScore } from '../lib/shopify/themeParser';
import { convertAllTemplates, generateThemePreview, importPagesToSupabase } from '../lib/shopify/templateConverter';
import ShopifyThemePreview from './ShopifyThemePreview';

interface ShopifyDataImportProps {
  storeId: string;
  onComplete?: () => void;
}

type Step = 'upload' | 'preview' | 'importing' | 'complete';

export default function ShopifyDataImport({ storeId, onComplete }: ShopifyDataImportProps) {
  const [step, setStep] = useState<Step>('upload');
  const [themeFiles, setThemeFiles] = useState<any>(null);
  const [themePreview, setThemePreview] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      await processFiles(files);
    }
  }, []);

  async function processFiles(files: File[]) {
    setError(null);
    setImporting(true);

    try {
      // Handle ZIP file or folder upload
      const source = files.length === 1 && files[0].name.endsWith('.zip') ? files[0] : files;
      
      const { files: extractedFiles, validation } = await processThemeUpload(source);

      if (!validation.valid) {
        setError(`Invalid theme structure: ${validation.errors.join(', ')}`);
        setImporting(false);
        return;
      }

      // Show warnings if any
      if (validation.warnings.length > 0) {
        console.warn('Theme warnings:', validation.warnings);
      }

      // Parse theme
      const parsed = await parseShopifyTheme(extractedFiles);
      const compatibility = calculateCompatibilityScore(parsed.sections);
      const preview = generateThemePreview(
        parsed.design,
        parsed.assets,
        parsed.templates,
        compatibility.score
      );

      setThemeFiles({ extractedFiles, parsed });
      setThemePreview(preview);
      setStep('preview');
      setImporting(false);
    } catch (err: any) {
      setError(err.message || 'Failed to process theme files');
      setImporting(false);
    }
  }

  async function handleImport() {
    if (!themeFiles || !themePreview) return;

    setImporting(true);
    setImportProgress(0);
    setStep('importing');

    try {
      const { parsed } = themeFiles;

      // Step 1: Create store_design (20%)
      setImportProgress(20);
      const { data: designData, error: designError } = await supabase
        .from('store_designs')
        .insert({
          store_id: storeId,
          ...parsed.design,
        })
        .select()
        .single();

      if (designError) throw designError;

      // Step 2: Import pages (60%)
      setImportProgress(40);
      const pages = convertAllTemplates(parsed.templates);
      const pageResults = await importPagesToSupabase(storeId, pages, supabase);

      setImportProgress(80);

      // Step 3: Save assets metadata (if any)
      if (parsed.assets.logoUrl || parsed.assets.faviconUrl) {
        await supabase.from('store_config').upsert({
          store_id: storeId,
          logo_url: parsed.assets.logoUrl,
          favicon_url: parsed.assets.faviconUrl,
        });
      }

      setImportProgress(100);

      setImportResult({
        success: true,
        designCreated: !!designData,
        pagesImported: pageResults.success,
        pagesFailed: pageResults.failed,
        errors: pageResults.errors,
      });

      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Import failed');
      setImporting(false);
    }
  }

  if (step === 'upload') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Import Shopify Theme</h1>
          <p className="text-gray-600">
            Upload your Shopify theme to automatically convert it to WebPilot
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {importing ? (
            <div className="py-8">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Processing theme...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <FileArchive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Theme Files</h3>
                <p className="text-gray-600 mb-4">
                  Drag & drop your theme ZIP file or folder here
                </p>
              </div>

              <label className="inline-block">
                <input
                  type="file"
                  accept=".zip,application/zip"
                  onChange={handleFileInput}
                  className="hidden"
                  style={{ color: '#000000' }}
                />
                <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
                  Choose ZIP File
                </span>
              </label>

              <p className="text-sm text-gray-500 mt-4">or</p>

              <label className="inline-block mt-2">
                <input
                  type="file"
                  multiple
                  webkitdirectory=""
                  directory=""
                  onChange={handleFileInput}
                  className="hidden"
                  style={{ color: '#000000' }}
                />
                <span className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer inline-block">
                  <Folder className="w-4 h-4 inline mr-2" />
                  Select Theme Folder
                </span>
              </label>
            </>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Upload Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3">How to get your Shopify theme:</h3>
          <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
            <li>Log into your Shopify admin panel</li>
            <li>Go to Online Store → Themes</li>
            <li>Click Actions → Download theme files</li>
            <li>Upload the ZIP file here</li>
          </ol>
        </div>
      </div>
    );
  }

  if (step === 'preview' && themePreview) {
    return (
      <ShopifyThemePreview
        preview={themePreview}
        onProceed={handleImport}
        onCancel={() => {
          setStep('upload');
          setThemeFiles(null);
          setThemePreview(null);
        }}
      />
    );
  }

  if (step === 'importing') {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Importing Your Theme...</h2>
          <p className="text-gray-600">This may take a moment</p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{importProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${importProgress}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className={importProgress >= 20 ? 'text-green-600' : 'text-gray-500'}>
              ✓ Creating design settings
            </div>
            <div className={importProgress >= 40 ? 'text-green-600' : 'text-gray-500'}>
              {importProgress >= 40 ? '✓' : '○'} Importing pages
            </div>
            <div className={importProgress >= 80 ? 'text-green-600' : 'text-gray-500'}>
              {importProgress >= 80 ? '✓' : '○'} Saving assets
            </div>
            <div className={importProgress >= 100 ? 'text-green-600' : 'text-gray-500'}>
              {importProgress >= 100 ? '✓' : '○'} Finalizing import
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete' && importResult) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Import Complete!</h2>
          <p className="text-gray-600">
            Your Shopify theme has been successfully imported to WebPilot
          </p>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
          <h3 className="font-semibold mb-4">Import Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm">Design Settings</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm">Pages Imported</span>
              <span className="font-semibold text-green-600">{importResult.pagesImported}</span>
            </div>
            {importResult.pagesFailed > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm">Pages Failed</span>
                <span className="font-semibold text-yellow-600">{importResult.pagesFailed}</span>
              </div>
            )}
          </div>

          {importResult.errors && importResult.errors.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">Warnings:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                {importResult.errors.map((err: string, i: number) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setStep('upload');
              setThemeFiles(null);
              setThemePreview(null);
              setImportResult(null);
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Import Another Theme
          </button>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            View My Site →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
