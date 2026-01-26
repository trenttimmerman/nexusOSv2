import React, { useState, useCallback } from 'react';
import { Heart, Sparkles, CheckCircle, AlertTriangle, Eye, Download, Loader, ExternalLink, Upload, Code } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoveableImportProps {
  storeId: string;
  onComplete?: () => void;
  onNavigateToPage?: (pageId: string) => void;
}

type ImportStep = 'input' | 'fetching' | 'preview' | 'converting' | 'importing' | 'complete';

interface LoveablePreview {
  html: string;
  title?: string;
  description?: string;
  images: string[];
  design: {
    colors: {
      primary: string[];
      secondary: string[];
      background: string[];
      text: string[];
    };
    fonts: {
      headings: string[];
      body: string[];
    };
  };
  metadata: Record<string, any>;
}

// Client-side HTML parser (fallback for dev mode)
function parseHTMLClient(html: string, baseUrl: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Extract title
  const title = doc.querySelector('title')?.textContent || '';
  
  // Extract meta description
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  // Extract images
  const images: string[] = [];
  doc.querySelectorAll('img').forEach(img => {
    let src = img.getAttribute('src') || '';
    if (src) {
      // Make absolute URLs
      if (src.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        src = `${urlObj.origin}${src}`;
      } else if (!src.startsWith('http')) {
        src = new URL(src, baseUrl).href;
      }
      images.push(src);
    }
  });
  
  // Extract colors from inline styles
  const colors = {
    primary: [] as string[],
    secondary: [] as string[],
    background: [] as string[],
    text: [] as string[],
  };
  
  doc.querySelectorAll('[style]').forEach(el => {
    const style = el.getAttribute('style') || '';
    const colorMatch = style.match(/(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/g);
    if (colorMatch) {
      colorMatch.forEach(color => {
        if (colors.primary.length < 5 && !colors.primary.includes(color)) {
          colors.primary.push(color);
        }
      });
    }
  });
  
  // Extract fonts
  const fonts = {
    headings: [] as string[],
    body: [] as string[],
  };
  
  const styleSheets = doc.querySelectorAll('style');
  styleSheets.forEach(style => {
    const content = style.textContent || '';
    const fontMatches = content.match(/font-family:\s*([^;}"']+)/gi);
    if (fontMatches) {
      fontMatches.forEach(match => {
        const font = match.replace('font-family:', '').trim().replace(/["']/g, '').split(',')[0];
        if (fonts.body.length < 3 && !fonts.body.includes(font)) {
          fonts.body.push(font);
        }
      });
    }
  });
  
  return {
    title,
    description: metaDesc,
    images: [...new Set(images)],
    design: {
      colors,
      fonts,
    },
    metadata: {},
  };
}

export default function LoveableImport({ storeId, onComplete, onNavigateToPage }: LoveableImportProps) {
  const [step, setStep] = useState<ImportStep>('input');
  const [previewUrl, setPreviewUrl] = useState('');
  const [preview, setPreview] = useState<LoveablePreview | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [createdPageId, setCreatedPageId] = useState<string | null>(null);

  const handleStartImport = useCallback(async () => {
    if (!previewUrl) {
      setError('Please enter a Loveable preview URL');
      return;
    }

    // Validate URL
    if (!previewUrl.includes('lovable.app') && !previewUrl.includes('lovable.dev') && !previewUrl.includes('loveable.dev')) {
      setError('Please enter a valid Loveable preview URL (*.lovable.app, lovable.dev, or loveable.dev)');
      return;
    }

    try {
      setError(null);
      setStep('fetching');
      setCurrentTask('Fetching Loveable preview...');
      setProgress(10);

      // Try API endpoint first (works in production/Vercel)
      let result: any = null;
      
      try {
        const response = await fetch('/api/loveable-crawler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: previewUrl }),
        });

        if (response.ok) {
          result = await response.json();
        } else if (response.status === 404) {
          // API not available (dev mode), fetch directly
          console.log('[LoveableImport] API not available, fetching directly...');
          throw new Error('API_NOT_AVAILABLE');
        } else {
          const error = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(error.error || `HTTP ${response.status}`);
        }
      } catch (apiError: any) {
        // If API not available, try direct fetch (dev mode)
        if (apiError.message === 'API_NOT_AVAILABLE' || apiError.message.includes('404')) {
          console.log('[LoveableImport] Fetching directly from Loveable...');
          
          setProgress(20);
          setCurrentTask('Fetching HTML content...');
          
          const htmlResponse = await fetch(previewUrl, {
            mode: 'cors',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
          });

          if (!htmlResponse.ok) {
            throw new Error(`Failed to fetch: ${htmlResponse.status} ${htmlResponse.statusText}`);
          }

          const html = await htmlResponse.text();
          
          setProgress(30);
          setCurrentTask('Parsing content...');

          // Parse HTML client-side
          result = {
            success: true,
            html,
            ...parseHTMLClient(html, previewUrl),
          };
        } else {
          throw apiError;
        }
      }

      if (!result || !result.success) {
        throw new Error(result?.error || 'Failed to fetch Loveable preview');
      }

      setProgress(40);
      setCurrentTask('Analyzing preview...');

      // Store preview data
      setPreview({
        html: result.html,
        title: result.title || 'Loveable Import',
        description: result.description || '',
        images: result.images || [],
        design: result.design || {
          colors: { primary: [], secondary: [], background: [], text: [] },
          fonts: { headings: [], body: [] },
        },
        metadata: result.metadata || {},
      });

      setProgress(60);
      setStep('preview');

    } catch (error: any) {
      console.error('[LoveableImport] Error:', error);
      setError(error.message || 'Failed to import from Loveable');
      setStep('input');
      setProgress(0);
    }
  }, [previewUrl]);

  const handleImport = useCallback(async () => {
    if (!preview || !storeId) return;

    try {
      setStep('importing');
      setCurrentTask('Creating design from Loveable preview...');
      setProgress(60);

      // Create a new design for the imported Loveable site
      const designName = `${preview.title || 'Loveable Import'} - Design`;
      const { data: designData, error: designError } = await supabase
        .from('store_designs')
        .insert({
          store_id: storeId,
          name: designName,
          is_active: false, // Don't activate automatically
          primary_color: preview.design.colors.primary[0] || '#3b82f6',
          secondary_color: preview.design.colors.secondary[0] || '#8B5CF6',
          background_color: preview.design.colors.background[0] || '#FFFFFF',
          store_vibe: 'modern',
          typography: {
            headingFont: preview.design.fonts.headings[0] || 'Inter',
            bodyFont: preview.design.fonts.body[0] || 'Inter',
            headingColor: '#000000',
            bodyColor: '#737373',
            linkColor: preview.design.colors.primary[0] || '#3b82f6',
            baseFontSize: '16px',
            headingScale: 'default',
            headingWeight: '700',
            bodyWeight: '400'
          }
        })
        .select()
        .single();

      if (designError) throw designError;

      setProgress(75);
      setCurrentTask('Creating page...');

      // Create a unique slug with timestamp to avoid conflicts
      const timestamp = Date.now();
      const baseSlug = generateSlug(preview.title || 'loveable-import');
      const uniqueSlug = `${baseSlug}-${timestamp}`;

      // Create a new page with the HTML content
      const pageId = `loveable_${timestamp}`;
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .insert({
          id: pageId,
          store_id: storeId,
          title: preview.title || 'Loveable Import',
          slug: uniqueSlug,
          type: 'custom',
          blocks: [],
        })
        .select()
        .single();

      if (pageError) throw pageError;

      setProgress(95);
      setCurrentTask('Finalizing...');

      // Store the HTML content as a custom section (if needed)
      // For now, we'll just create the page and let the user add sections manually
      
      setCreatedPageId(pageData.id);
      setProgress(100);
      setStep('complete');

    } catch (error: any) {
      console.error('[LoveableImport] Import error:', error);
      setError(error.message || 'Failed to import content');
      setStep('preview');
    }
  }, [preview, storeId]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Render different steps
  if (step === 'input') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Import from Loveable</h2>
                <p className="text-pink-100 mt-1">Bring your Loveable.dev preview into WebPilot</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loveable Preview URL
              </label>
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://your-project.lovable.app"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                style={{ color: '#000000' }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Paste the preview link from your Loveable project
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleStartImport}
              disabled={!previewUrl}
              className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Import from Loveable
            </button>

            {/* Instructions */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-pink-600" />
                How to get your Loveable preview URL:
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                <li>Open your project in Loveable.dev</li>
                <li>Click the "Preview" button to generate a preview</li>
                <li>Copy the preview URL from your browser</li>
                <li>Paste it above and click "Import from Loveable"</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'fetching') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <Loader className="w-16 h-16 mx-auto mb-4 text-pink-600 animate-spin" />
            <h3 className="text-xl font-bold mb-2">{currentTask}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'preview' && preview) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Preview Ready!</h2>
                  <p className="text-pink-100 mt-1">Review your Loveable content before importing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Preview Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Title & Description */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5 text-pink-600" />
                  Page Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Title</label>
                    <p className="text-gray-900">{preview.title || 'Untitled'}</p>
                  </div>
                  {preview.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="text-sm text-gray-700">{preview.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Design Colors */}
              {preview.design.colors.primary.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Detected Colors
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {preview.design.colors.primary.slice(0, 5).map((color, idx) => (
                      <div key={idx} className="text-center">
                        <div
                          className="w-12 h-12 rounded-lg shadow-md border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-xs text-gray-600 mt-1 font-mono">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            {preview.images.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-pink-600" />
                  Images Found ({preview.images.length})
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {preview.images.slice(0, 12).map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
                {preview.images.length > 12 && (
                  <p className="text-sm text-gray-500 mt-2">
                    + {preview.images.length - 12} more images
                  </p>
                )}
              </div>
            )}

            {/* HTML Preview (truncated) */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-600" />
                HTML Content
              </h3>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
                <pre>{preview.html.slice(0, 2000)}...</pre>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Total HTML size: {(preview.html.length / 1024).toFixed(2)} KB
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep('input');
                  setPreview(null);
                  setProgress(0);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 font-semibold flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Import to WebPilot
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'importing' || step === 'converting') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <Loader className="w-16 h-16 mx-auto mb-4 text-purple-600 animate-spin" />
            <h3 className="text-xl font-bold mb-2">{currentTask}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{progress}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Import Complete! 🎉</h2>
                <p className="text-green-100 mt-1">Your Loveable content is now in WebPilot</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>A new page has been created with your Loveable content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>A new design has been created in your Design Library with the extracted colors and fonts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Visit the Design Library to activate the new design or customize it further</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>You can now add sections and build out your page content</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep('input');
                  setPreview(null);
                  setPreviewUrl('');
                  setProgress(0);
                  setCreatedPageId(null);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Import Another
              </button>
              {createdPageId && onNavigateToPage && (
                <button
                  onClick={() => onNavigateToPage(createdPageId)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Edit Page
                </button>
              )}
              {onComplete && (
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
