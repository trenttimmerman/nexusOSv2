import React, { useState, useCallback } from 'react';
import { Heart, Sparkles, CheckCircle, AlertTriangle, Eye, Download, Loader, ExternalLink, Upload, Code, Layout, ShoppingBag, FileText, Image, ChevronRight, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoveableImportProps {
  storeId: string;
  onComplete?: () => void;
  onNavigateToPage?: (pageId: string) => void;
}

type ImportStep = 'input' | 'fetching' | 'analyzing' | 'review' | 'importing' | 'complete';

interface ParsedSection {
  id: string;
  type: 'hero' | 'features' | 'gallery' | 'content' | 'form' | 'footer' | 'product' | 'unknown';
  title: string;
  html: string;
  preview: string; // Short text preview
  images: string[];
  selected: boolean;
  confidence: number; // 0-100
}

interface ParsedProduct {
  id: string;
  name: string;
  description: string;
  price?: string;
  images: string[];
  html: string;
  selected: boolean;
}

interface LoveableAnalysis {
  url: string;
  title: string;
  description: string;
  sections: ParsedSection[];
  products: ParsedProduct[];
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
  fullHtml: string;
}

// Intelligent section analyzer
function analyzeSections(html: string): ParsedSection[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections: ParsedSection[] = [];
  let sectionId = 1;

  // Find all major sections (using semantic HTML and common patterns)
  const candidates = [
    ...Array.from(doc.querySelectorAll('section, header, main, article, aside, footer')),
    ...Array.from(doc.querySelectorAll('[class*="section"], [class*="container"], [class*="block"]'))
  ];

  // Remove duplicates and nested sections
  const topLevelSections = candidates.filter(el => {
    return !candidates.some(parent => parent !== el && parent.contains(el));
  });

  topLevelSections.forEach(section => {
    const text = section.textContent?.trim() || '';
    const html = section.outerHTML;
    
    // Skip tiny sections
    if (text.length < 20) return;

    // Identify section type
    let type: ParsedSection['type'] = 'unknown';
    let confidence = 50;
    const lowerText = text.toLowerCase();
    const classes = section.className.toLowerCase();
    const tagName = section.tagName.toLowerCase();

    // Hero detection
    if (
      tagName === 'header' ||
      classes.includes('hero') ||
      classes.includes('banner') ||
      classes.includes('jumbotron') ||
      (section.querySelector('h1') && section.querySelectorAll('button, a').length > 0)
    ) {
      type = 'hero';
      confidence = 80;
    }
    // Product detection
    else if (
      classes.includes('product') ||
      classes.includes('shop') ||
      classes.includes('item') ||
      (lowerText.includes('$') && (lowerText.includes('buy') || lowerText.includes('add to cart')))
    ) {
      type = 'product';
      confidence = 75;
    }
    // Gallery detection
    else if (
      section.querySelectorAll('img').length >= 3 ||
      classes.includes('gallery') ||
      classes.includes('portfolio') ||
      classes.includes('grid')
    ) {
      type = 'gallery';
      confidence = 70;
    }
    // Features detection
    else if (
      (section.querySelectorAll('[class*="feature"], [class*="benefit"], [class*="service"]').length >= 2) ||
      (section.querySelectorAll('h3, h4').length >= 2 && section.querySelectorAll('p').length >= 2)
    ) {
      type = 'features';
      confidence = 65;
    }
    // Form detection
    else if (section.querySelector('form') || section.querySelector('input, textarea')) {
      type = 'form';
      confidence = 90;
    }
    // Footer detection
    else if (tagName === 'footer' || classes.includes('footer')) {
      type = 'footer';
      confidence = 95;
    }
    // Content section
    else if (section.querySelectorAll('p').length >= 2) {
      type = 'content';
      confidence = 60;
    }

    // Extract images
    const images: string[] = [];
    section.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src) images.push(src);
    });

    // Extract title
    const heading = section.querySelector('h1, h2, h3');
    const title = heading?.textContent?.trim() || `Section ${sectionId}`;

    // Create preview
    const preview = text.substring(0, 150) + (text.length > 150 ? '...' : '');

    sections.push({
      id: `section_${sectionId++}`,
      type,
      title,
      html,
      preview,
      images,
      selected: true, // Select all by default
      confidence
    });
  });

  return sections;
}

// Analyze potential products
function analyzeProducts(html: string): ParsedProduct[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const products: ParsedProduct[] = [];
  let productId = 1;

  // Find product containers
  const productSelectors = [
    '[class*="product-card"]',
    '[class*="product-item"]',
    '[class*="shop-item"]',
    '[class*="product"]',
    '[data-product]'
  ];

  productSelectors.forEach(selector => {
    doc.querySelectorAll(selector).forEach(el => {
      const name = el.querySelector('h2, h3, h4, [class*="title"], [class*="name"]')?.textContent?.trim();
      const description = el.querySelector('p, [class*="description"]')?.textContent?.trim();
      const priceEl = el.querySelector('[class*="price"], .price');
      const price = priceEl?.textContent?.trim();
      
      const images: string[] = [];
      el.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src) images.push(src);
      });

      if (name) {
        products.push({
          id: `product_${productId++}`,
          name,
          description: description || '',
          price,
          images,
          html: el.outerHTML,
          selected: true
        });
      }
    });
  });

  return products;
}

export default function LoveableImport({ storeId, onComplete, onNavigateToPage }: LoveableImportProps) {
  const [step, setStep] = useState<ImportStep>('input');
  const [previewUrl, setPreviewUrl] = useState('');
  const [analysis, setAnalysis] = useState<LoveableAnalysis | null>(null);
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

      setProgress(50);
      setStep('analyzing');
      setCurrentTask('Analyzing sections and content...');

      const html = result.html;

      // Parse design elements
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const title = doc.querySelector('title')?.textContent || result.title || 'Loveable Import';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || result.description || '';

      // Extract colors
      const colors = { primary: [], secondary: [], background: [], text: [] };
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
      const fonts = { headings: [], body: [] };
      doc.querySelectorAll('style').forEach(style => {
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

      setProgress(70);
      setCurrentTask('Identifying sections...');

      // Analyze sections and products
      const sections = analyzeSections(html);
      const products = analyzeProducts(html);

      setProgress(90);
      setCurrentTask('Preparing review...');

      // Store analysis
      setAnalysis({
        url: previewUrl,
        title,
        description,
        sections,
        products,
        design: {
          colors: colors.primary.length > 0 ? colors : result.design?.colors || { primary: [], secondary: [], background: [], text: [] },
          fonts: fonts.body.length > 0 ? fonts : result.design?.fonts || { headings: [], body: [] }
        },
        fullHtml: html
      });

      setProgress(100);
      setStep('review');

    } catch (error: any) {
      console.error('[LoveableImport] Error:', error);
      setError(error.message || 'Failed to import from Loveable');
      setStep('input');
      setProgress(0);
    }
  }, [previewUrl]);

  const toggleSection = (id: string) => {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      sections: analysis.sections.map(s => 
        s.id === id ? { ...s, selected: !s.selected } : s
      )
    });
  };

  const toggleProduct = (id: string) => {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      products: analysis.products.map(p => 
        p.id === id ? { ...p, selected: !p.selected } : p
      )
    });
  };

  const handleImport = useCallback(async () => {
    if (!analysis || !storeId) return;

    try {
      setStep('importing');
      setCurrentTask('Creating design...');
      setProgress(10);

      const selectedSections = analysis.sections.filter(s => s.selected);
      const selectedProducts = analysis.products.filter(p => p.selected);

      // Create a new design for the imported Loveable site
      const designName = `${analysis.title} - Design`;
      const { data: designData, error: designError } = await supabase
        .from('store_designs')
        .insert({
          store_id: storeId,
          name: designName,
          is_active: false,
          primary_color: analysis.design.colors.primary[0] || '#3b82f6',
          secondary_color: analysis.design.colors.secondary[0] || '#8B5CF6',
          background_color: analysis.design.colors.background[0] || '#FFFFFF',
          store_vibe: 'modern',
          typography: {
            headingFont: analysis.design.fonts.headings[0] || 'Inter',
            bodyFont: analysis.design.fonts.body[0] || 'Inter',
            headingColor: '#000000',
            bodyColor: '#737373',
            linkColor: analysis.design.colors.primary[0] || '#3b82f6',
            baseFontSize: '16px',
            headingScale: 'default',
            headingWeight: '700',
            bodyWeight: '400'
          }
        })
        .select()
        .single();

      if (designError) throw designError;

      setProgress(30);
      setCurrentTask('Creating page with selected sections...');

      // Create blocks from selected sections
      const blocks = selectedSections.map((section, index) => ({
        id: `block_${Date.now()}_${index}`,
        type: 'section' as const,
        name: section.title,
        content: section.html,
        data: {
          heading: section.title,
          sectionType: section.type
        }
      }));

      // Create a unique slug with timestamp
      const timestamp = Date.now();
      const baseSlug = generateSlug(analysis.title);
      const uniqueSlug = `${baseSlug}-${timestamp}`;

      // Create page
      const pageId = `loveable_${timestamp}`;
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .insert({
          id: pageId,
          store_id: storeId,
          title: analysis.title,
          slug: uniqueSlug,
          type: 'custom',
          blocks: blocks,
        })
        .select()
        .single();

      if (pageError) throw pageError;

      setProgress(60);
      setCurrentTask('Creating products...');

      // Create products
      let productsCreated = 0;
      for (const product of selectedProducts) {
        try {
          const productId = `loveable_product_${Date.now()}_${productsCreated}`;
          const { error: productError } = await supabase
            .from('products')
            .insert({
              id: productId,
              store_id: storeId,
              name: product.name,
              description: product.description,
              price: product.price ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : 0,
              images: product.images,
              stock: 100,
              category: 'imported'
            });

          if (!productError) productsCreated++;
        } catch (err) {
          console.error('Failed to create product:', product.name, err);
        }
      }

      setProgress(90);
      setCurrentTask('Finalizing...');
      
      setCreatedPageId(pageData.id);
      setProgress(100);
      setStep('complete');

    } catch (error: any) {
      console.error('[LoveableImport] Import error:', error);
      setError(error.message || 'Failed to import content');
      setStep('review');
    }
  }, [analysis, storeId]);

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

  if (step === 'fetching' || step === 'analyzing') {
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

  if (step === 'review' && analysis) {
    const selectedSections = analysis.sections.filter(s => s.selected);
    const selectedProducts = analysis.products.filter(p => p.selected);

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layout className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">Review & Select Content</h2>
                  <p className="text-pink-100 mt-1">Choose which sections and products to import</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-pink-100">Found</div>
                <div className="text-2xl font-bold">{analysis.sections.length} sections, {analysis.products.length} products</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">{analysis.title}</h3>
              {analysis.description && <p className="text-sm text-blue-700">{analysis.description}</p>}
              <div className="flex gap-4 mt-3 text-sm text-blue-600">
                <span>{selectedSections.length} of {analysis.sections.length} sections selected</span>
                {analysis.products.length > 0 && <span>{selectedProducts.length} of {analysis.products.length} products selected</span>}
              </div>
            </div>

            {/* Sections */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Layout className="w-5 h-5 text-gray-700" />
                Sections ({analysis.sections.length})
              </h3>
              <div className="space-y-3">
                {analysis.sections.map(section => (
                  <div
                    key={section.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      section.selected 
                        ? 'border-pink-500 bg-pink-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        section.selected ? 'bg-pink-500' : 'bg-gray-200'
                      }`}>
                        {section.selected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{section.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            section.type === 'hero' ? 'bg-purple-100 text-purple-700' :
                            section.type === 'features' ? 'bg-blue-100 text-blue-700' :
                            section.type === 'gallery' ? 'bg-green-100 text-green-700' :
                            section.type === 'product' ? 'bg-orange-100 text-orange-700' :
                            section.type === 'form' ? 'bg-yellow-100 text-yellow-700' :
                            section.type === 'footer' ? 'bg-gray-100 text-gray-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {section.type}
                          </span>
                          <span className="text-xs text-gray-500">{section.confidence}% confidence</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{section.preview}</p>
                        {section.images.length > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Image className="w-3 h-3" />
                            {section.images.length} image{section.images.length > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            {analysis.products.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                  Products ({analysis.products.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.products.map(product => (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        product.selected 
                          ? 'border-pink-500 bg-pink-50' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => toggleProduct(product.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                          product.selected ? 'bg-pink-500' : 'bg-gray-200'
                        }`}>
                          {product.selected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                          {product.price && (
                            <p className="text-sm font-medium text-green-600 mb-1">{product.price}</p>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                          {product.images.length > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                              <Image className="w-3 h-3" />
                              {product.images.length} image{product.images.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                onClick={() => {
                  setStep('input');
                  setAnalysis(null);
                  setPreviewUrl('');
                  setProgress(0);
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={selectedSections.length === 0 && selectedProducts.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Import {selectedSections.length} Section{selectedSections.length !== 1 ? 's' : ''}
                {selectedProducts.length > 0 && ` & ${selectedProducts.length} Product${selectedProducts.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'importing') {
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
              <h3 className="font-semibold mb-4">What Was Imported:</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span><strong>{analysis?.sections.filter(s => s.selected).length || 0} sections</strong> imported as individual blocks that can be edited or reordered</span>
                </li>
                {analysis && analysis.products.filter(p => p.selected).length > 0 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span><strong>{analysis.products.filter(p => p.selected).length} products</strong> created in your store inventory</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>New <strong>design theme</strong> created with extracted colors and fonts (visit Design Library to activate)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>All sections can be edited using Block Architect or replaced with system components</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setStep('input');
                  setAnalysis(null);
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
