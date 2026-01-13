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
    const maxPages = options.maxPages || 100; // Increased from 50
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

        // Add internal links to queue (prioritize product/collection pages)
        if (depth < maxDepth) {
          const productLinks: Array<{url: string, depth: number}> = [];
          const collectionLinks: Array<{url: string, depth: number}> = [];
          const otherLinks: Array<{url: string, depth: number}> = [];
          
          for (const link of pageData.links) {
            if (link.startsWith(targetUrl.origin) && !visitedUrls.has(link)) {
              const linkLower = link.toLowerCase();
              
              // Prioritize product and collection pages
              if (linkLower.includes('/product') || linkLower.includes('/item')) {
                productLinks.push({ url: link, depth: depth + 1 });
              } else if (linkLower.includes('/collection') || linkLower.includes('/category') || linkLower.includes('/shop')) {
                collectionLinks.push({ url: link, depth: depth + 1 });
              } else {
                otherLinks.push({ url: link, depth: depth + 1 });
              }
            }
          }
          
          // Add in priority order: products first, then collections, then other pages
          urlsToVisit.push(...productLinks, ...collectionLinks, ...otherLinks.slice(0, 10));
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

  // Detect page type
  const urlPath = url.toLowerCase();
  const ogType = html.match(/<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']+)["']/i);
  
  if (ogType && ogType[1] === 'product') {
    pageData.type = 'product';
  } else if (urlPath.includes('/product') || urlPath.includes('/item')) {
    pageData.type = 'product';
  } else if (urlPath.includes('/collection') || urlPath.includes('/category') || urlPath.includes('/shop')) {
    pageData.type = 'collection';
  } else if (urlPath === baseOrigin || urlPath === baseOrigin + '/' || urlPath.endsWith('/')) {
    pageData.type = 'home';
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

  // Method 1: JSON-LD Schema.org Product markup
  const productSchemaMatch = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi);
  
  for (const match of productSchemaMatch) {
    try {
      const jsonMatch = match[1];
      const data = JSON.parse(jsonMatch);
      
      // Handle single product or array
      const items = Array.isArray(data) ? data : [data];
      
      for (const item of items) {
        if (item['@type'] === 'Product' || item['@type']?.includes?.('Product')) {
          products.push({
            name: item.name || 'Untitled Product',
            description: item.description || '',
            price: parseFloat(item.offers?.price || item.offers?.[0]?.price || '0'),
            compareAtPrice: parseFloat(item.offers?.priceSpecification?.price || '0') || undefined,
            images: Array.isArray(item.image) ? item.image : item.image ? [item.image] : [],
            url: item.url || url,
            sku: item.sku || undefined,
            brand: item.brand?.name || undefined
          });
        }
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

  // Method 2: Shopify-specific product data
  const shopifyProductMatch = html.match(/var\s+meta\s*=\s*\{[^}]*product[^}]*\}/gi);
  if (shopifyProductMatch) {
    for (const match of shopifyProductMatch) {
      try {
        const productData = match.match(/product:\s*({[^}]+})/);
        if (productData) {
          const product = JSON.parse(productData[1]);
          products.push({
            name: product.title || 'Product',
            description: '',
            price: parseFloat(product.price) / 100 || 0,
            compareAtPrice: product.compare_at_price ? parseFloat(product.compare_at_price) / 100 : undefined,
            images: product.featured_image ? [product.featured_image] : [],
            url
          });
        }
      } catch (e) {}
    }
  }

  // Method 3: OpenGraph product meta tags
  const ogType = html.match(/<meta[^>]*property=["']og:type["'][^>]*content=["']product["']/i);
  if (ogType) {
    const productData: any = { url };
    
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitle) productData.name = ogTitle[1];
    
    const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
    if (ogDesc) productData.description = ogDesc[1];
    
    const ogPrice = html.match(/<meta[^>]*property=["']product:price:amount["'][^>]*content=["']([^"']+)["']/i);
    if (ogPrice) productData.price = parseFloat(ogPrice[1]);
    
    const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogImage) productData.images = [ogImage[1]];
    
    if (productData.name) {
      products.push(productData);
    }
  }

  // Method 4: Common e-commerce class patterns
  const urlPath = url.toLowerCase();
  if (urlPath.includes('/product') || urlPath.includes('/item')) {
    const titleMatch = html.match(/<h1[^>]*class=["'][^"']*product[^"']*["'][^>]*>([^<]+)<\/h1>/i) ||
                       html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    
    const priceMatch = html.match(/<[^>]*class=["'][^"']*price[^"']*["'][^>]*>.*?(\d+\.?\d*)/i);
    
    if (titleMatch && !products.length) {
      products.push({
        name: titleMatch[1].trim(),
        description: '',
        price: priceMatch ? parseFloat(priceMatch[1]) : 0,
        images: [],
        url
      });
    }
  }

  return products;
}

/**
 * Extract collections from HTML
 */
function extractCollections(html: string, url: string): any[] {
  const collections: any[] = [];

  // Method 1: Check URL patterns for collection/category pages
  const urlPath = new URL(url).pathname.toLowerCase();
  const isCollectionPage = urlPath.includes('/collections/') || 
                          urlPath.includes('/collection/') || 
                          urlPath.includes('/category/') ||
                          urlPath.includes('/categories/') ||
                          urlPath.includes('/shop/');

  if (isCollectionPage) {
    const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    
    // Count product links on the page
    const productLinks = html.match(/<a[^>]*href=["'][^"']*\/product[^"']*["']/gi) || [];
    
    if (titleMatch) {
      collections.push({
        name: titleMatch[1].trim(),
        url,
        productCount: productLinks.length,
        description: extractMetaDescription(html)
      });
    }
  }

  // Method 2: Extract collection links from navigation
  const navMatch = html.matchAll(/<a[^>]*href=["']([^"']*(?:collection|category|shop)[^"']*)["'][^>]*>([^<]+)<\/a>/gi);
  
  for (const match of navMatch) {
    const collectionUrl = match[1];
    const collectionName = match[2].trim();
    
    if (!collections.find(c => c.url === collectionUrl)) {
      collections.push({
        name: collectionName,
        url: resolveUrl(collectionUrl, new URL(url).origin) || collectionUrl,
        productCount: 0
      });
    }
  }

  // Method 3: Shopify collections JSON
  const shopifyCollMatch = html.match(/collections:\s*(\[.*?\])/s);
  if (shopifyCollMatch) {
    try {
      const colls = JSON.parse(shopifyCollMatch[1]);
      for (const coll of colls) {
        collections.push({
          name: coll.title || coll.handle,
          url: `/collections/${coll.handle}`,
          productCount: coll.products_count || 0
        });
      }
    } catch (e) {}
  }

  return collections;
}

/**
 * Extract meta description helper
 */
function extractMetaDescription(html: string): string {
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return descMatch ? descMatch[1].trim() : '';
}

/**
 * Extract design elements
 */
function extractDesign(html: string, url: string): any {
  const design = {
    colors: { primary: [], secondary: [], accent: [], background: [], text: [] },
    fonts: { headings: [], body: [] },
    logo: null as string | null,
    navigation: { header: [], footer: [] }
  };

  // Extract CSS colors from style tags and inline styles
  const styleMatch = html.match(/<style[^>]*>([^<]+)<\/style>/gi);
  const allColors = new Set<string>();
  
  if (styleMatch) {
    for (const style of styleMatch) {
      // Hex colors
      const hexColors = style.match(/#[0-9a-f]{3,6}/gi);
      if (hexColors) hexColors.forEach(c => allColors.add(c.toLowerCase()));
      
      // RGB/RGBA colors
      const rgbColors = style.match(/rgba?\([^)]+\)/gi);
      if (rgbColors) rgbColors.forEach(c => allColors.add(c));
    }
  }

  // Extract inline style colors
  const inlineStyles = html.matchAll(/style=["'][^"']*(?:color|background)[^"']*["']/gi);
  for (const match of inlineStyles) {
    const hexMatch = match[0].match(/#[0-9a-f]{3,6}/gi);
    if (hexMatch) hexMatch.forEach(c => allColors.add(c.toLowerCase()));
  }

  // Categorize colors (simple heuristic based on common patterns)
  const colorArray = Array.from(allColors);
  design.colors.primary = colorArray.slice(0, 3);
  design.colors.background = colorArray.filter(c => c.includes('fff') || c.includes('f0f0f0'));
  design.colors.text = colorArray.filter(c => c.includes('000') || c.includes('333'));

  // Extract fonts
  const fontMatch = html.match(/font-family:\s*([^;}"]+)/gi);
  const allFonts = new Set<string>();
  
  if (fontMatch) {
    for (const match of fontMatch) {
      const font = match.replace(/font-family:\s*/i, '').replace(/['"]/g, '').split(',')[0].trim();
      if (font && !font.includes('!')) allFonts.add(font);
    }
  }
  
  const fontArray = Array.from(allFonts);
  design.fonts.headings = fontArray.slice(0, 2);
  design.fonts.body = fontArray.slice(0, 3);

  // Extract logo - multiple patterns
  const logoPatterns = [
    /<img[^>]*class=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/i,
    /<img[^>]*alt=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/i,
    /<img[^>]*id=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/i,
    /<a[^>]*class=["'][^"']*logo[^"']*["'][^>]*>\s*<img[^>]*src=["']([^"']+)["']/i
  ];

  for (const pattern of logoPatterns) {
    const logoMatch = html.match(pattern);
    if (logoMatch) {
      design.logo = resolveUrl(logoMatch[1], new URL(url).origin);
      break;
    }
  }

  // Extract navigation from header
  const headerNav = html.match(/<(?:header|nav)[^>]*>([^<]*(?:<(?!\/(?:header|nav)>)[^<]*)*)<\/(?:header|nav)>/gi);
  if (headerNav) {
    for (const nav of headerNav) {
      const links = nav.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi);
      for (const link of links) {
        const title = link[2].trim().replace(/\s+/g, ' ');
        const href = link[1];
        
        if (title && href && !href.startsWith('#') && design.navigation.header.length < 10) {
          design.navigation.header.push({
            title,
            url: resolveUrl(href, new URL(url).origin) || href
          });
        }
      }
    }
  }

  // Extract footer navigation
  const footerNav = html.match(/<footer[^>]*>([^<]*(?:<(?!\/footer>)[^<]*)*)<\/footer>/gi);
  if (footerNav) {
    for (const nav of footerNav) {
      const links = nav.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi);
      for (const link of links) {
        const title = link[2].trim().replace(/\s+/g, ' ');
        const href = link[1];
        
        if (title && href && !href.startsWith('#') && design.navigation.footer.length < 10) {
          design.navigation.footer.push({
            title,
            url: resolveUrl(href, new URL(url).origin) || href
          });
        }
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
