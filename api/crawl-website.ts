/**
 * Vercel Serverless Function - Website Crawler Proxy
 * Bypasses CORS by crawling websites server-side
 * 
 * Features:
 * - robots.txt compliance
 * - Rate limiting (configurable delay between requests)
 * - Retry logic for failed requests
 * - Sitemap.xml parsing for better discovery
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CrawlOptions {
  maxDepth?: number;
  maxPages?: number;
  includeProducts?: boolean;
  includeCollections?: boolean;
  rateLimitMs?: number; // Delay between requests (default: 100ms)
  respectRobotsTxt?: boolean; // Check robots.txt (default: true)
  maxRetries?: number; // Retry failed requests (default: 2)
}

interface CrawlResult {
  pages: any[];
  products: any[];
  collections: any[];
  design: any;
  platform: string;
  errors: string[];
  robotsTxtAllowed?: boolean;
  sitemapUrls?: string[];
}

interface RobotsTxtRules {
  allowed: boolean;
  disallowedPaths: string[];
  crawlDelay?: number;
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

    // Configuration
    const maxDepth = options.maxDepth || 3;
    const maxPages = options.maxPages || 50;
    const rateLimitMs = options.rateLimitMs || 100; // 100ms between requests
    const respectRobotsTxt = options.respectRobotsTxt !== false; // Default true
    const maxRetries = options.maxRetries || 2;

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
      errors: [],
      robotsTxtAllowed: true,
      sitemapUrls: []
    };

    // Check robots.txt
    let robotsRules: RobotsTxtRules = { allowed: true, disallowedPaths: [] };
    if (respectRobotsTxt) {
      robotsRules = await checkRobotsTxt(targetUrl.origin);
      result.robotsTxtAllowed = robotsRules.allowed;
      
      if (!robotsRules.allowed) {
        console.log(`[Crawler] Blocked by robots.txt`);
        return res.status(403).json({ 
          error: 'Crawling not allowed by robots.txt',
          result 
        });
      }
      
      // Use crawl-delay from robots.txt if specified
      if (robotsRules.crawlDelay) {
        console.log(`[Crawler] Using crawl-delay from robots.txt: ${robotsRules.crawlDelay}ms`);
      }
    }

    // Try to fetch sitemap for better URL discovery
    const sitemapUrls = await fetchSitemap(targetUrl.origin);
    result.sitemapUrls = sitemapUrls.slice(0, 20); // Limit for response size
    console.log(`[Crawler] Found ${sitemapUrls.length} URLs in sitemap`);

    const visitedUrls = new Set<string>();
    const urlsToVisit: Array<{ url: string; depth: number }> = [
      { url: targetUrl.href, depth: 0 }
    ];

    // Add sitemap URLs to queue (low priority)
    for (const sitemapUrl of sitemapUrls.slice(0, maxPages)) {
      if (!visitedUrls.has(sitemapUrl)) {
        urlsToVisit.push({ url: sitemapUrl, depth: 1 });
      }
    }

    // Crawl pages
    while (urlsToVisit.length > 0 && result.pages.length < maxPages) {
      const { url: currentUrl, depth } = urlsToVisit.shift()!;

      if (visitedUrls.has(currentUrl) || depth > maxDepth) {
        continue;
      }

      visitedUrls.add(currentUrl);

      // Check if URL is disallowed by robots.txt
      if (respectRobotsTxt && isDisallowed(currentUrl, robotsRules.disallowedPaths)) {
        console.log(`[Crawler] Skipping ${currentUrl} - disallowed by robots.txt`);
        continue;
      }

      // Rate limiting - wait between requests
      if (visitedUrls.size > 1) { // Skip delay for first request
        const delay = robotsRules.crawlDelay || rateLimitMs;
        await sleep(delay);
      }

      try {
        console.log(`[Crawler] Fetching: ${currentUrl} (depth: ${depth})`);

        // Retry logic
        let html: string | null = null;
        let lastError: Error | null = null;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            if (attempt > 0) {
              console.log(`[Crawler] Retry ${attempt}/${maxRetries} for ${currentUrl}`);
              await sleep(1000 * attempt); // Exponential backoff
            }

            const response = await fetch(currentUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; WebPilotBot/1.0; +https://webpilot.io/bot)',
              },
              signal: AbortSignal.timeout(10000) // 10 second timeout
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }

            html = await response.text();
            break; // Success, exit retry loop
          } catch (error: any) {
            lastError = error;
            if (attempt === maxRetries) {
              throw error; // Final attempt failed
            }
          }
        }

        if (!html) {
          throw lastError || new Error('Failed to fetch HTML');
        }
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
          // Prioritize product and collection pages
          const productLinks: Array<{ url: string; depth: number }> = [];
          const collectionLinks: Array<{ url: string; depth: number }> = [];
          const otherLinks: Array<{ url: string; depth: number }> = [];

          for (const link of pageData.links) {
            if (link.startsWith(targetUrl.origin) && !visitedUrls.has(link)) {
              const linkLower = link.toLowerCase();
              
              // Prioritize product pages
              if (linkLower.includes('/product') || linkLower.includes('/item') || linkLower.includes('/p/')) {
                productLinks.push({ url: link, depth: depth + 1 });
              }
              // Then collection/category pages
              else if (linkLower.includes('/collection') || linkLower.includes('/category') || linkLower.includes('/shop')) {
                collectionLinks.push({ url: link, depth: depth + 1 });
              }
              // Other pages (limited to avoid crawling too much)
              else if (otherLinks.length < 5) {
                otherLinks.push({ url: link, depth: depth + 1 });
              }
            }
          }

          // Add in priority order: products first, then collections, then limited other pages
          urlsToVisit.push(...productLinks, ...collectionLinks, ...otherLinks);
        }

      } catch (error: any) {
        console.error(`[Crawler] Error fetching ${currentUrl}:`, error.message);
        result.errors.push(`Failed to load ${currentUrl}: ${error.message}`);
      }
    }

    console.log(`[Crawler] Complete. Pages: ${result.pages.length}, Products: ${result.products.length}, Collections: ${result.collections.length}`);

    // Deduplicate products by name and URL
    const uniqueProducts = new Map();
    for (const product of result.products) {
      const key = `${product.name}|${product.url}`;
      if (!uniqueProducts.has(key)) {
        uniqueProducts.set(key, product);
      }
    }
    result.products = Array.from(uniqueProducts.values());

    // Deduplicate collections by URL
    const uniqueCollections = new Map();
    for (const collection of result.collections) {
      // Prioritize actual collection pages over discovered links
      const existing = uniqueCollections.get(collection.url);
      if (!existing || (!collection.isDiscovered && existing.isDiscovered)) {
        uniqueCollections.set(collection.url, collection);
      }
    }
    result.collections = Array.from(uniqueCollections.values());

    console.log(`[Crawler] After deduplication - Products: ${result.products.length}, Collections: ${result.collections.length}`);

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
  
  // Check OpenGraph type first (most reliable)
  const ogTypeMatch = html.match(/<meta[^>]*property=["']og:type["'][^>]*content=["']([^"']+)["']/i);
  if (ogTypeMatch) {
    const ogType = ogTypeMatch[1].toLowerCase();
    if (ogType === 'product') {
      pageData.type = 'product';
    } else if (ogType === 'website' && (urlPath === '/' || urlPath === '')) {
      pageData.type = 'home';
    }
  }
  
  // Fallback to URL pattern matching
  if (pageData.type === 'page') {
    if (urlPath.includes('/product') || urlPath.includes('/item') || urlPath.includes('/p/')) {
      pageData.type = 'product';
    } else if (urlPath.includes('/collection') || urlPath.includes('/category') || urlPath.includes('/shop')) {
      pageData.type = 'collection';
    } else if (urlPath === '/' || urlPath === '') {
      pageData.type = 'home';
    }
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

  try {
    // Method 1: JSON-LD Schema.org Product markup (most reliable)
    const productSchemaMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi);
    
    for (const match of productSchemaMatches) {
      try {
        const jsonText = match[1].trim();
        if (!jsonText) continue;
        
        const data = JSON.parse(jsonText);
        
        // Handle both single objects and arrays
        const items = Array.isArray(data) ? data : [data];
        
        for (const item of items) {
          try {
            // Check if it's a Product type (supports @type as string or array)
            const itemType = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
            const isProduct = itemType.some((t: string) => t === 'Product' || t?.includes('Product'));
            
            if (isProduct && item.name) {
              const product: any = {
                name: item.name || 'Untitled Product',
                description: item.description || '',
                url: item.url || url,
                images: [],
                price: 0,
                sku: item.sku || undefined,
                brand: item.brand?.name || undefined,
                variants: []
              };

              // Extract images
              if (item.image) {
                product.images = Array.isArray(item.image) ? item.image : [item.image];
              }

              // Extract price from offers
              if (item.offers) {
                const offers = Array.isArray(item.offers) ? item.offers : [item.offers];
                const mainOffer = offers[0];
                
                if (mainOffer) {
                  product.price = parseFloat(mainOffer.price || mainOffer.lowPrice || '0');
                  product.currency = mainOffer.priceCurrency || 'USD';
                  product.availability = mainOffer.availability?.split('/').pop() || 'unknown';
                  
                  // Check for compare at price
                  if (mainOffer.priceSpecification?.price) {
                    product.compareAtPrice = parseFloat(mainOffer.priceSpecification.price);
                  }
                }
              }

              // Extract variants if available
              if (item.hasVariant || item.model) {
                const variants = Array.isArray(item.hasVariant) ? item.hasVariant : item.hasVariant ? [item.hasVariant] : [];
                variants.forEach((variant: any) => {
                  if (variant.name || variant.sku) {
                    product.variants.push({
                      name: variant.name,
                      sku: variant.sku,
                      price: parseFloat(variant.offers?.price || product.price)
                    });
                  }
                });
              }

              products.push(product);
            }
          } catch (itemError) {
            // Skip individual item errors
            console.error('[extractProducts] Error parsing item:', itemError);
          }
        }
      } catch (jsonError) {
        // Skip JSON parsing errors for this script tag
        console.error('[extractProducts] JSON parse error:', jsonError);
      }
    }

    // Method 2: Shopify product JSON (if detected)
    if (html.includes('Shopify')) {
      try {
        const shopifyProductMatch = html.match(/var\s+meta\s*=\s*({[^}]+})/);
        if (shopifyProductMatch) {
          const meta = JSON.parse(shopifyProductMatch[1]);
          if (meta.product) {
            products.push({
              name: meta.product.title,
              description: meta.product.description,
              price: parseFloat(meta.product.price) / 100,
              images: meta.product.images || [],
              url: url,
              sku: meta.product.variants?.[0]?.sku,
              variants: meta.product.variants || []
            });
          }
        }
      } catch (shopifyError) {
        // Shopify extraction failed, continue
      }
    }

    // Method 3: OpenGraph product meta tags (fallback)
    if (products.length === 0) {
      try {
        const ogType = html.match(/<meta[^>]*property=["']og:type["'][^>]*content=["']product["']/i);
        if (ogType) {
          const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
          const ogDescription = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
          const ogImage = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
          const ogPrice = html.match(/<meta[^>]*property=["']product:price:amount["'][^>]*content=["']([^"']+)["']/i);
          const ogCurrency = html.match(/<meta[^>]*property=["']product:price:currency["'][^>]*content=["']([^"']+)["']/i);

          if (ogTitle) {
            products.push({
              name: ogTitle[1],
              description: ogDescription?.[1] || '',
              price: parseFloat(ogPrice?.[1] || '0'),
              currency: ogCurrency?.[1] || 'USD',
              images: ogImage ? [ogImage[1]] : [],
              url: url,
              variants: []
            });
          }
        }
      } catch (ogError) {
        // OpenGraph extraction failed
      }
    }

  } catch (error) {
    console.error('[extractProducts] Unexpected error:', error);
  }

  return products;
}

/**
 * Extract collections from HTML
 */
function extractCollections(html: string, url: string): any[] {
  const collections: any[] = [];

  try {
    const urlPath = new URL(url).pathname.toLowerCase();
    
    // Check if this is a collection/category page
    const isCollectionPage = urlPath.includes('/collections/') || 
                             urlPath.includes('/collection/') || 
                             urlPath.includes('/category/') ||
                             urlPath.includes('/categories/') ||
                             urlPath.includes('/shop/');

    if (isCollectionPage) {
      // Extract collection name from h1 or page title
      const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      
      const collectionName = h1Match?.[1]?.trim() || titleMatch?.[1]?.trim()?.split('|')[0]?.trim() || 'Unknown Collection';

      // Try to count products on the page
      let productCount = 0;
      
      // Method 1: Count product cards (common class names)
      const productCardPatterns = [
        /<div[^>]*class=["'][^"']*product-card[^"']*["']/gi,
        /<div[^>]*class=["'][^"']*product-item[^"']*["']/gi,
        /<article[^>]*class=["'][^"']*product[^"']*["']/gi,
      ];
      
      for (const pattern of productCardPatterns) {
        const matches = html.match(pattern);
        if (matches && matches.length > productCount) {
          productCount = matches.length;
        }
      }

      // Method 2: Check for collection JSON-LD
      try {
        const collectionSchemaMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]+)<\/script>/gi);
        if (collectionSchemaMatch) {
          for (const match of collectionSchemaMatch) {
            const jsonText = match.match(/>([^<]+)</)?.[1];
            if (jsonText) {
              const data = JSON.parse(jsonText);
              if (data['@type'] === 'CollectionPage' || data['@type'] === 'ItemList') {
                if (data.numberOfItems) {
                  productCount = parseInt(data.numberOfItems);
                }
                if (data.name) {
                  // Use schema name if available
                }
              }
            }
          }
        }
      } catch (e) {
        // Schema parsing failed, use counted products
      }

      // Extract collection description if available
      const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const collectionDesc = descMatch?.[1] || '';

      collections.push({
        name: collectionName,
        description: collectionDesc,
        url,
        productCount: productCount || 0,
        slug: urlPath.split('/').filter(Boolean).pop() || ''
      });
    }

    // Also detect collection links from the page (for discovery)
    const collectionLinkPattern = /<a[^>]*href=["']([^"']*(?:\/collection|\/category)[^"']*)["'][^>]*>([^<]+)<\/a>/gi;
    const collectionLinks = html.matchAll(collectionLinkPattern);
    
    for (const match of collectionLinks) {
      const href = match[1];
      const name = match[2]?.trim();
      
      if (name && href && !collections.some(c => c.url === href)) {
        collections.push({
          name: name,
          url: href.startsWith('http') ? href : new URL(url).origin + href,
          productCount: 0,
          slug: href.split('/').filter(Boolean).pop() || '',
          isDiscovered: true // Mark as discovered link vs actual page
        });
      }
    }

  } catch (error) {
    console.error('[extractCollections] Error:', error);
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

/**
 * Sleep utility for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check robots.txt for crawling permissions
 */
async function checkRobotsTxt(origin: string): Promise<RobotsTxtRules> {
  const rules: RobotsTxtRules = {
    allowed: true,
    disallowedPaths: []
  };

  try {
    const robotsUrl = `${origin}/robots.txt`;
    const response = await fetch(robotsUrl, {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      // No robots.txt means crawling is allowed
      return rules;
    }

    const robotsTxt = await response.text();
    const lines = robotsTxt.split('\n');
    
    let isRelevantSection = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Check for our user-agent or wildcard
      if (trimmed.toLowerCase().startsWith('user-agent:')) {
        const agent = trimmed.substring(11).trim().toLowerCase();
        isRelevantSection = agent === '*' || agent.includes('webpilotbot');
      }
      
      // Parse rules for relevant section
      if (isRelevantSection) {
        if (trimmed.toLowerCase().startsWith('disallow:')) {
          const path = trimmed.substring(9).trim();
          if (path === '/') {
            // Disallow all
            rules.allowed = false;
            return rules;
          }
          if (path) {
            rules.disallowedPaths.push(path);
          }
        }
        
        if (trimmed.toLowerCase().startsWith('crawl-delay:')) {
          const delay = parseInt(trimmed.substring(12).trim(), 10);
          if (!isNaN(delay)) {
            rules.crawlDelay = delay * 1000; // Convert seconds to milliseconds
          }
        }
      }
    }
  } catch (error) {
    console.log('[checkRobotsTxt] Error (allowing crawl):', error);
    // On error, allow crawling
  }

  return rules;
}

/**
 * Check if URL is disallowed by robots.txt rules
 */
function isDisallowed(url: string, disallowedPaths: string[]): boolean {
  try {
    const urlPath = new URL(url).pathname;
    
    for (const disallowedPath of disallowedPaths) {
      if (disallowedPath === '/') {
        return true; // Everything is disallowed
      }
      
      // Check if URL starts with disallowed path
      if (urlPath.startsWith(disallowedPath)) {
        return true;
      }
      
      // Support wildcards (* at end)
      if (disallowedPath.endsWith('*')) {
        const prefix = disallowedPath.slice(0, -1);
        if (urlPath.startsWith(prefix)) {
          return true;
        }
      }
    }
    
    return false;
  } catch (error) {
    console.error('[isDisallowed] Error:', error);
    return false; // On error, allow
  }
}

/**
 * Fetch and parse sitemap.xml for URL discovery
 */
async function fetchSitemap(origin: string): Promise<string[]> {
  const urls: string[] = [];
  
  try {
    const sitemapUrl = `${origin}/sitemap.xml`;
    const response = await fetch(sitemapUrl, {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      return urls; // No sitemap found
    }

    const xml = await response.text();
    
    // Parse sitemap XML (simple regex approach)
    // Matches: <loc>https://example.com/page</loc>
    const locPattern = /<loc>([^<]+)<\/loc>/gi;
    const matches = xml.matchAll(locPattern);
    
    for (const match of matches) {
      const url = match[1].trim();
      if (url.startsWith(origin)) {
        urls.push(url);
      }
    }
    
    console.log(`[fetchSitemap] Found ${urls.length} URLs in sitemap`);
    
  } catch (error) {
    console.log('[fetchSitemap] No sitemap or error (continuing without):', error);
  }

  return urls;
}
