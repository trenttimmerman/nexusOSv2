import React, { useState, useCallback } from 'react';
import { Globe, Search, CheckCircle, AlertTriangle, Eye, Sparkles, ExternalLink } from 'lucide-react';
import { crawlWebsite, CrawlResult } from '../lib/crawlerAPI';
import { supabase } from '../lib/supabaseClient';

interface WebsiteMigrationProps {
  storeId: string;
  onComplete?: () => void;
  onNavigateToPage?: (pageId: string) => void;
}

type MigrationStep = 'input' | 'crawling' | 'analyzing' | 'preview' | 'importing' | 'complete';

interface CrawlAnalysis {
  crawlResult: CrawlResult;
  stats: {
    pages: number;
    products: number;
    collections: number;
    images: number;
    internalLinks: number;
    externalLinks: number;
  };
  warnings: string[];
}

export default function WebsiteMigration({ storeId, onComplete, onNavigateToPage }: WebsiteMigrationProps) {
  const [step, setStep] = useState<MigrationStep>('input');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analysis, setAnalysis] = useState<CrawlAnalysis | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [migrationId, setMigrationId] = useState<string | null>(null);
  const [migratedPageId, setMigratedPageId] = useState<string | null>(null);
  const [pagesCreated, setPagesCreated] = useState<number>(0);
  const [productsCreated, setProductsCreated] = useState<number>(0);
  const [collectionsCreated, setCollectionsCreated] = useState<number>(0);

  const handleStartCrawl = useCallback(async () => {
    if (!websiteUrl) {
      alert('Please enter a website URL');
      return;
    }

    try {
      // Validate URL
      const url = new URL(websiteUrl);
      
      setStep('crawling');
      setCurrentTask('Starting website crawl...');
      setProgress(5);

      // Crawl the website
      const crawlResult = await crawlWebsite(url.href, {
        maxDepth: 3,
        maxPages: 50,
        includeProducts: true,
        includeCollections: true,
        onProgress: (progress) => {
          setProgress(Math.round((progress.current / progress.total) * 60));
          setCurrentTask(`Crawling page ${progress.current} of ${progress.total}...`);
        }
      }).catch((error) => {
        // Handle CORS and network errors
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          throw new Error('CORS_ERROR');
        }
        throw error;
      });

      setProgress(70);
      setStep('analyzing');
      setCurrentTask('Analyzing crawled data...');

      // Analyze results
      const warnings: string[] = [];
      
      if (crawlResult.pages.length === 0) {
        warnings.push('No pages were crawled. The website may be blocking requests.');
      }

      if (crawlResult.products.length === 0) {
        warnings.push('No products detected. This may not be an e-commerce site.');
      }

      if (crawlResult.errors.length > 0) {
        warnings.push(`${crawlResult.errors.length} pages failed to load.`);
      }

      // Count links
      let internalLinks = 0;
      let externalLinks = 0;
      crawlResult.pages.forEach(page => {
        // All links in the links array are considered (we don't separate internal/external here)
        internalLinks += page.links.length;
      });

      const stats = {
        pages: crawlResult.pages.length,
        products: crawlResult.products.length,
        collections: crawlResult.collections.length,
        images: crawlResult.pages.reduce((sum, page) => sum + page.images.length, 0),
        internalLinks,
        externalLinks: 0 // Not tracked in current implementation
      };

      setProgress(90);
      setCurrentTask('Creating migration record...');

      // Create migration record
      const migration = {
        id: `mig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        store_id: storeId,
        theme_name: `${new URL(url.href).hostname} Import`,
        theme_version: '1.0.0',
        status: 'analyzing',
        migration_data: {
          platform: crawlResult.platform,
          stats,
          warnings,
          crawlUrl: url.href
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
        crawlResult,
        stats,
        warnings
      });

      setProgress(100);
      setStep('preview');

    } catch (error: any) {
      console.error('Website crawl error:', error);
      
      if (error.message === 'CORS_ERROR') {
        alert(
          '⚠️ Browser Security Limitation\n\n' +
          'Direct website crawling is blocked by browser CORS policy.\n\n' +
          'Alternative options:\n' +
          '1. Use "Shopify Import" with a theme ZIP file instead\n' +
          '2. Contact support about backend crawler service\n\n' +
          'Note: Website crawling requires a server-side proxy to bypass CORS restrictions.'
        );
      } else {
        alert(`Failed to crawl website: ${error.message}`);
      }
      
      setStep('input');
      setProgress(0);
    }
  }, [websiteUrl, storeId]);

  const handleStartImport = async () => {
    if (!analysis || !migrationId) return;

    try {
      setStep('importing');
      setProgress(0);
      setCurrentTask('Starting import...');

      const { crawlResult } = analysis;

      // Step 1: Import products
      if (crawlResult.products.length > 0) {
        setCurrentTask(`Importing ${crawlResult.products.length} products...`);
        setProgress(10);

        const productsToImport = crawlResult.products.map(product => {
          // Generate UUID for product ID
          const productId = crypto.randomUUID();
          
          return {
            id: productId,
            name: product.name || 'Untitled Product',
            description: product.description || '',
            price: product.price || 0,
            compare_at_price: product.compareAtPrice || null,
            image: product.images?.[0] || null,
            images: product.images || [],
            status: 'active',
            sku: product.sku || null,
            stock: product.availability === 'InStock' ? 10 : 0,
            track_inventory: true,
            has_variants: (product.variants?.length || 0) > 0,
            variants: product.variants || [],
            tags: product.brand ? [product.brand] : [],
            category: null,
            seo: {
              title: product.name,
              description: product.description?.substring(0, 160) || '',
              slug: product.url?.split('/').pop() || productId
            }
          };
        });

        const { data: importedProducts, error: productsError } = await supabase
          .from('products')
          .insert(productsToImport)
          .select('id');

        if (productsError) {
          console.error('Failed to import products:', productsError);
          console.error('Products data:', productsToImport[0]); // Log first product for debugging
          alert(`Error importing products: ${productsError.message}\n\nCheck console for details.`);
        } else {
          setProductsCreated(importedProducts?.length || 0);
        }
      }

      setProgress(30);

      // Step 2: Import collections
      if (crawlResult.collections.length > 0) {
        setCurrentTask(`Importing ${crawlResult.collections.length} collections...`);
        setProgress(40);

        const collectionsToImport = crawlResult.collections.map(collection => {
          const collectionId = crypto.randomUUID();
          const slug = collection.slug || collection.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          
          return {
            id: collectionId,
            name: collection.name,
            slug: slug,
            description: collection.description || '',
            image_url: null, // Collections don't always have images in crawl data
            type: 'manual',
            is_featured: false,
            is_visible: true,
            display_order: 0,
            conditions: {
              originalUrl: collection.url,
              productCount: collection.productCount || 0
            }
          };
        });

        const { data: importedCollections, error: collectionsError } = await supabase
          .from('collections')
          .insert(collectionsToImport)
          .select('id');

        if (collectionsError) {
          console.error('Failed to import collections:', collectionsError);
          console.error('Collections data:', collectionsToImport[0]); // Log first collection for debugging
          alert(`Error importing collections: ${collectionsError.message}\n\nCheck console for details.`);
        } else {
          setCollectionsCreated(importedCollections?.length || 0);
        }
      }

      setProgress(50);

      // Step 3: Create pages from crawled pages
      setCurrentTask('Creating pages...');
      const createdPageIds: string[] = [];
      let homepageId: string | null = null;

      for (const page of crawlResult.pages) {
        if (page.type === 'product' || page.type === 'collection') {
          // Skip product/collection pages as they're handled separately
          continue;
        }

        const pageSlug = new URL(page.url).pathname.replace(/^\//, '').replace(/\/$/, '') || 'home';
        const isHomepage = page.type === 'home';

        // Build blocks from page content
        const blocks: any[] = [];

        // Add hero/header section if available
        if (crawlResult.design.logo || crawlResult.design.navigation.header.length > 0) {
          blocks.push({
            id: `header_${Date.now()}`,
            type: 'header',
            props: {
              logo: crawlResult.design.logo,
              navigation: crawlResult.design.navigation.header,
              style: {
                backgroundColor: crawlResult.design.colors.primary[0] || '#ffffff',
                textColor: crawlResult.design.colors.text[0] || '#000000'
              }
            },
            order: 0
          });
        }

        // Add main content
        blocks.push({
          id: `content_${Date.now()}`,
          type: 'richtext',
          props: {
            content: `<h1>${page.title}</h1>${page.content || ''}`,
            style: {
              padding: '2rem'
            }
          },
          order: 1
        });

        // Add footer
        if (crawlResult.design.navigation.footer.length > 0 || Object.keys(crawlResult.design.socialLinks).length > 0) {
          blocks.push({
            id: `footer_${Date.now()}`,
            type: 'footer',
            props: {
              links: crawlResult.design.navigation.footer,
              socialLinks: crawlResult.design.socialLinks,
              style: {
                backgroundColor: crawlResult.design.colors.background[0] || '#f3f4f6',
                textColor: crawlResult.design.colors.text[0] || '#000000'
              }
            },
            order: 2
          });
        }

        // Create page
        const { data: newPage, error: pageError } = await supabase
          .from('pages')
          .insert([{
            store_id: storeId,
            title: page.title,
            slug: pageSlug,
            blocks: blocks,
            is_published: true,
            metadata: {
              imported_from: 'website_crawl',
              original_url: page.url,
              page_type: page.type,
              migration_id: migrationId
            }
          }])
          .select('id')
          .single();

        if (pageError) {
          console.error('Failed to create page:', pageError);
        } else if (newPage) {
          createdPageIds.push(newPage.id);
          if (isHomepage) {
            homepageId = newPage.id;
          }
        }

        setProgress(50 + (createdPageIds.length / crawlResult.pages.length) * 30);
      }

      setMigratedPageId(homepageId || createdPageIds[0] || null);
      setPagesCreated(createdPageIds.length);

      setProgress(90);
      setCurrentTask('Finalizing migration...');

      // Update migration status
      if (migrationId) {
        await supabase
          .from('shopify_migrations')
          .update({
            status: 'completed',
            migration_data: {
              ...analysis,
              imported: {
                pages: createdPageIds.length,
                products: productsCreated,
                collections: collectionsCreated
              }
            }
          })
          .eq('id', migrationId);
      }

      setProgress(100);
      setStep('complete');

    } catch (error: any) {
      alert(`Import failed: ${error.message}`);
      setStep('preview');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <Globe className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Website Migration</h2>
              <p className="text-blue-100 mt-1">Import your existing website into nexusOS</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {step !== 'input' && (
          <div className="bg-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{currentTask}</span>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6">
          {/* Input Step */}
          {step === 'input' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Enter Website URL</h3>
                <p className="text-gray-600 mb-4">
                  Provide the URL of the website you want to migrate. We'll crawl the site to extract products, collections, and content.
                </p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <button
                    onClick={handleStartCrawl}
                    disabled={!websiteUrl}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Analyze
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">What we'll extract:</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Products with images, descriptions, and pricing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Collections and categories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Page structure and content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Design elements (colors, fonts, navigation)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Images and assets</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  🚧 Feature Currently Limited
                </h4>
                <p className="text-sm text-red-800 mb-2">
                  <strong>Browser CORS restrictions prevent direct website crawling.</strong>
                </p>
                <p className="text-sm text-red-700 mb-2">
                  This feature requires a backend server to bypass CORS. For now, please use:
                </p>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• <strong>Shopify Import:</strong> Upload your theme ZIP file instead</li>
                  <li>• <strong>Manual Setup:</strong> Create pages and products directly in the editor</li>
                </ul>
                <p className="text-xs text-red-600 mt-2 italic">
                  Backend crawler service coming soon!
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Important Notes:
                </h4>
                <ul className="space-y-1 text-sm text-yellow-800">
                  <li>• The website must be publicly accessible</li>
                  <li>• Some websites may block automated crawling</li>
                  <li>• Large sites may take several minutes to analyze</li>
                  <li>• We'll respect robots.txt and crawl responsibly</li>
                </ul>
              </div>
            </div>
          )}

          {/* Crawling/Analyzing Steps */}
          {(step === 'crawling' || step === 'analyzing') && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-700">{currentTask}</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few minutes...</p>
            </div>
          )}

          {/* Preview Step */}
          {step === 'preview' && analysis && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Crawl Results</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{analysis.stats.pages}</div>
                    <div className="text-sm text-gray-600">Pages Found</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{analysis.stats.products}</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{analysis.stats.collections}</div>
                    <div className="text-sm text-gray-600">Collections</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{analysis.stats.images}</div>
                    <div className="text-sm text-gray-600">Images</div>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">{analysis.stats.internalLinks}</div>
                    <div className="text-sm text-gray-600">Internal Links</div>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{analysis.crawlResult.platform}</div>
                    <div className="text-sm text-gray-600">Platform</div>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {analysis.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Warnings:
                  </h4>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    {analysis.warnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Design Preview */}
              <div>
                <h4 className="font-semibold mb-3">Detected Design Elements</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  {analysis.crawlResult.design.colors.primary.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: analysis.crawlResult.design.colors.primary[0] }}
                      />
                      <div>
                        <div className="text-sm font-medium">Primary Color</div>
                        <div className="text-xs text-gray-600">{analysis.crawlResult.design.colors.primary[0]}</div>
                      </div>
                    </div>
                  )}
                  {analysis.crawlResult.design.fonts.headings.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Heading Font:</span> {analysis.crawlResult.design.fonts.headings[0]}
                    </div>
                  )}
                  {analysis.crawlResult.design.navigation.header.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Navigation Items:</span> {analysis.crawlResult.design.navigation.header.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('input')}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleStartImport}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Import
                </button>
              </div>
            </div>
          )}

          {/* Importing Step */}
          {step === 'importing' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-700">{currentTask}</p>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                {productsCreated > 0 && <p>✓ Imported {productsCreated} products</p>}
                {collectionsCreated > 0 && <p>✓ Imported {collectionsCreated} collections</p>}
                {pagesCreated > 0 && <p>✓ Created {pagesCreated} pages</p>}
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Migration Complete!</h3>
              <p className="text-gray-600 mb-6">
                Your website has been successfully imported into nexusOS.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{pagesCreated}</div>
                    <div className="text-sm text-gray-600">Pages Created</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{productsCreated}</div>
                    <div className="text-sm text-gray-600">Products Imported</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{collectionsCreated}</div>
                    <div className="text-sm text-gray-600">Collections Imported</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                {migratedPageId && onNavigateToPage && (
                  <button
                    onClick={() => onNavigateToPage(migratedPageId)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    View Imported Site
                  </button>
                )}
                {onComplete && (
                  <button
                    onClick={onComplete}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
