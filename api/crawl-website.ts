/**
 * Vercel Serverless Function - Website Crawler Proxy
 * Bypasses CORS by crawling websites server-side
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CrawlOptions {
  maxDepth?: number;
  maxPages?: number;
  includeProducts?: boolean;
  includeCollections?: boolean;
}

interface CrawlResult {
  pages: any[];
  products: any[];
  collections: any[];
  design: any;
  platform: string;
  errors: string[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, options = {} } = req.body as {
      url: string;
      options?: CrawlOptions;
    };

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`[Crawler] Starting crawl for: ${targetUrl.href}`);

    // Initialize crawl result
    const result: CrawlResult = {
      pages: [],
      products: [],
      collections: [],
      design: {
        colors: { primary: [], secondary: [], accent: [], background: [], text: [] },
        fonts: { headings: [], body: [] },
        logo: null,
        navigation: { header: [], footer: [] }
      },
      platform: 'unknown',
      errors: []
    };

    const maxDepth = options.maxDepth || 3;
    const maxPages = options.maxPages || 50;
    const visitedUrls = new Set<string>();
    const urlsToVisit: Array<{ url: string; depth: number }> = [
      { url: targetUrl.href, depth: 0 }
    ];

    // Crawl pages
    while (urlsToVisit.length > 0 && result.pages.length < maxPages) {
      const { url: currentUrl, depth } = urlsToVisit.shift()!;

      if (visitedUrls.has(currentUrl) || depth > maxDepth) {
        continue;
      }

      visitedUrls.add(currentUrl);

      try {
        console.log(`[Crawler] Fetching: ${currentUrl} (depth: ${depth})`);

        const response = await fetch(currentUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NexusOSBot/1.0; +https://nexusos.io/bot)',
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const pageData = await parseHTML(html, currentUrl, targetUrl.origin);

        result.pages.push(pageData);

        // Detect platform from first page
        if (result.platform === 'unknown') {
          result.platform = detectPlatform(html);
        }

        // Extract products if enabled
        if (options.includeProducts) {
          const products = extractProducts(html, currentUrl);
          result.products.push(...products);
        }

        // Extract collections if enabled
        if (options.includeCollections) {
          const collections = extractCollections(html, currentUrl);
          result.collections.push(...collections);
        }

        // Extract design elements from homepage
        if (depth === 0) {
          result.design = extractDesign(html, currentUrl);
        }

        // Add internal links to queue
        if (depth < maxDepth) {
          for (const link of pageData.links) {
            if (link.startsWith(targetUrl.origin) && !visitedUrls.has(link)) {
              urlsToVisit.push({ url: link, depth: depth + 1 });
            }
          }
        }

      } catch (error: any) {
        console.error(`[Crawler] Error fetching ${currentUrl}:`, error.message);
        result.errors.push(`Failed to load ${currentUrl}: ${error.message}`);
      }
    }

    console.log(`[Crawler] Complete. Pages: ${result.pages.length}, Products: ${result.products.length}, Collections: ${result.collections.length}`);

    return res.status(200).json(result);

  } catch (error: any) {
    console.error('[Crawler] Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Parse HTML using regex (lightweight, no dependencies)
 */
async function parseHTML(html: string, url: string, baseOrigin: string) {
  const pageData: any = {
    url,
    title: '',
    description: '',
    headings: [],
    paragraphs: [],
    images: [],
    links: [],
    type: 'page'
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    pageData.title = titleMatch[1].trim();
  }

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch) {
    pageData.description = descMatch[1].trim();
  }

  // Extract headings
  const h1Matches = html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
  for (const match of h1Matches) {
    pageData.headings.push(match[1].trim());
  }

  // Extract images
  const imgMatches = html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
  for (const match of imgMatches) {
    const src = match[1];
    const absoluteUrl = resolveUrl(src, baseOrigin);
    if (absoluteUrl) {
      pageData.images.push(absoluteUrl);
    }
  }

  // Extract links
  const linkMatches = html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi);
  for (const match of linkMatches) {
    const href = match[1];
    const absoluteUrl = resolveUrl(href, baseOrigin);
    if (absoluteUrl && !href.startsWith('#')) {
      pageData.links.push(absoluteUrl);
    }
  }

  // Detect page type
  const urlPath = new URL(url).pathname.toLowerCase();
  if (urlPath.includes('/products/') || urlPath.includes('/product/')) {
    pageData.type = 'product';
  } else if (urlPath.includes('/collections/') || urlPath.includes('/collection/') || urlPath.includes('/category/')) {
    pageData.type = 'collection';
  } else if (urlPath === '/' || urlPath === '') {
    pageData.type = 'home';
  }

  return pageData;
}

/**
 * Detect e-commerce platform
 */
function detectPlatform(html: string): string {
  if (html.includes('Shopify.theme') || html.includes('cdn.shopify.com')) {
    return 'shopify';
  }
  if (html.includes('woocommerce') || html.includes('wp-content')) {
    return 'woocommerce';
  }
  if (html.includes('bigcommerce')) {
    return 'bigcommerce';
  }
  if (html.includes('squarespace')) {
    return 'squarespace';
  }
  return 'custom';
}

/**
 * Extract products from HTML
 */
function extractProducts(html: string, url: string): any[] {
  const products: any[] = [];

  // Simple heuristic: look for product schema or common product patterns
  const productSchemaMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi);
  
  if (productSchemaMatch) {
    for (const match of productSchemaMatch) {
      try {
        const jsonMatch = match.match(/>([^<]+)</);
        if (jsonMatch) {
          const data = JSON.parse(jsonMatch[1]);
          if (data['@type'] === 'Product') {
            products.push({
              name: data.name,
              description: data.description,
              price: parseFloat(data.offers?.price) || 0,
              images: Array.isArray(data.image) ? data.image : [data.image],
              url
            });
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }

  return products;
}

/**
 * Extract collections from HTML
 */
function extractCollections(html: string, url: string): any[] {
  const collections: any[] = [];

  // Look for collection patterns
  const urlPath = new URL(url).pathname.toLowerCase();
  if (urlPath.includes('/collections/') || urlPath.includes('/collection/') || urlPath.includes('/category/')) {
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if (titleMatch) {
      collections.push({
        name: titleMatch[1].trim(),
        url,
        productCount: 0
      });
    }
  }

  return collections;
}

/**
 * Extract design elements
 */
function extractDesign(html: string, url: string): any {
  const design = {
    colors: { primary: [], secondary: [], accent: [], background: [], text: [] },
    fonts: { headings: [], body: [] },
    logo: null,
    navigation: { header: [], footer: [] }
  };

  // Extract CSS color variables
  const styleMatch = html.match(/<style[^>]*>([^<]+)<\/style>/gi);
  if (styleMatch) {
    for (const style of styleMatch) {
      const colors = style.match(/#[0-9a-f]{6}/gi);
      if (colors) {
        design.colors.primary = [...new Set(colors)].slice(0, 5);
      }
    }
  }

  // Extract logo
  const logoMatch = html.match(/<img[^>]*class=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/i);
  if (logoMatch) {
    design.logo = resolveUrl(logoMatch[1], new URL(url).origin);
  }

  // Extract navigation
  const navMatch = html.match(/<nav[^>]*>([^<]*(?:<(?!\/nav>)[^<]*)*)<\/nav>/gi);
  if (navMatch) {
    for (const nav of navMatch) {
      const links = nav.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi);
      for (const link of links) {
        design.navigation.header.push({
          title: link[2].trim(),
          url: resolveUrl(link[1], new URL(url).origin)
        });
      }
    }
  }

  return design;
}

/**
 * Resolve relative URLs to absolute
 */
function resolveUrl(url: string, baseOrigin: string): string | null {
  if (!url) return null;
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (url.startsWith('//')) {
    return 'https:' + url;
  }
  
  if (url.startsWith('/')) {
    return baseOrigin + url;
  }
  
  return null;
}
