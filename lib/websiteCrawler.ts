/**
 * Website Crawler and Analyzer
 * Crawls a live website to extract pages, products, collections, and design
 */

export interface CrawledPage {
  url: string;
  title: string;
  type: 'home' | 'product' | 'collection' | 'blog' | 'page' | 'unknown';
  content: string;
  meta: {
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  images: string[];
  links: string[];
  structuredData?: any;
}

export interface CrawledProduct {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  url: string;
  sku?: string;
  vendor?: string;
  type?: string;
  tags: string[];
  variants?: any[];
  availability: 'in-stock' | 'out-of-stock' | 'preorder';
}

export interface CrawledCollection {
  name: string;
  description: string;
  url: string;
  image?: string;
  products: string[]; // URLs
  productCount?: number;
}

export interface CrawledDesign {
  colors: {
    primary: string[];
    background: string[];
    text: string[];
  };
  fonts: {
    headings: string[];
    body: string[];
  };
  logo?: string;
  favicon?: string;
  navigation: {
    header: Array<{ label: string; url: string; children?: any[] }>;
    footer: Array<{ label: string; url: string }>;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    pinterest?: string;
  };
}

export interface CrawlResult {
  baseUrl: string;
  pages: CrawledPage[];
  products: CrawledProduct[];
  collections: CrawledCollection[];
  design: CrawledDesign;
  platform?: 'shopify' | 'woocommerce' | 'bigcommerce' | 'custom';
  errors: string[];
}

/**
 * Crawl a website and extract all data
 */
export async function crawlWebsite(
  url: string,
  options: {
    maxPages?: number;
    maxDepth?: number;
    includeProducts?: boolean;
    includeCollections?: boolean;
    onProgress?: (progress: { current: number; total: number; url: string }) => void;
  } = {}
): Promise<CrawlResult> {
  const {
    maxPages = 50,
    maxDepth = 3,
    includeProducts = true,
    includeCollections = true,
    onProgress
  } = options;

  const baseUrl = new URL(url).origin;
  const visited = new Set<string>();
  const toVisit: Array<{ url: string; depth: number }> = [{ url, depth: 0 }];
  
  const result: CrawlResult = {
    baseUrl,
    pages: [],
    products: [],
    collections: [],
    design: {
      colors: { primary: [], background: [], text: [] },
      fonts: { headings: [], body: [] },
      navigation: { header: [], footer: [] },
      socialLinks: {}
    },
    errors: []
  };

  let pagesProcessed = 0;

  while (toVisit.length > 0 && pagesProcessed < maxPages) {
    const { url: currentUrl, depth } = toVisit.shift()!;
    
    if (visited.has(currentUrl) || depth > maxDepth) continue;
    visited.add(currentUrl);

    try {
      onProgress?.({
        current: pagesProcessed + 1,
        total: Math.min(toVisit.length + pagesProcessed + 1, maxPages),
        url: currentUrl
      });

      const pageData = await fetchAndParsePage(currentUrl);
      
      // Detect page type and extract data
      const pageType = detectPageType(currentUrl, pageData);
      
      const crawledPage: CrawledPage = {
        url: currentUrl,
        title: pageData.title,
        type: pageType,
        content: pageData.content,
        meta: pageData.meta,
        images: pageData.images,
        links: pageData.links,
        structuredData: pageData.structuredData
      };

      result.pages.push(crawledPage);

      // Extract products
      if (includeProducts && (pageType === 'product' || pageType === 'collection')) {
        const products = extractProducts(pageData, currentUrl);
        products.forEach(product => {
          if (!result.products.find(p => p.url === product.url)) {
            result.products.push(product);
          }
        });
      }

      // Extract collections
      if (includeCollections && pageType === 'collection') {
        const collection = extractCollection(pageData, currentUrl);
        if (collection) {
          result.collections.push(collection);
        }
      }

      // Extract design on first page (homepage)
      if (pagesProcessed === 0) {
        result.design = extractDesign(pageData, currentUrl);
        result.platform = detectPlatform(pageData);
      }

      // Add new links to visit
      if (depth < maxDepth) {
        pageData.links
          .filter(link => link.startsWith(baseUrl) && !visited.has(link))
          .slice(0, 10) // Limit links per page
          .forEach(link => toVisit.push({ url: link, depth: depth + 1 }));
      }

      pagesProcessed++;

    } catch (error: any) {
      result.errors.push(`Failed to crawl ${currentUrl}: ${error.message}`);
    }
  }

  return result;
}

/**
 * Fetch and parse a page
 */
async function fetchAndParsePage(url: string): Promise<any> {
  const response = await fetch(url);
  const html = await response.text();
  
  // Parse HTML using DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  return {
    title: doc.querySelector('title')?.textContent || '',
    content: extractTextContent(doc),
    meta: {
      description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      keywords: doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
      ogImage: doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || ''
    },
    images: Array.from(doc.querySelectorAll('img')).map(img => img.src),
    links: Array.from(doc.querySelectorAll('a')).map(a => a.href).filter(Boolean),
    structuredData: extractStructuredData(doc),
    html,
    document: doc
  };
}

/**
 * Extract text content from document
 */
function extractTextContent(doc: Document): string {
  // Remove script, style, and nav elements
  const clone = doc.cloneNode(true) as Document;
  clone.querySelectorAll('script, style, nav, header, footer').forEach(el => el.remove());
  
  return clone.body?.textContent?.trim() || '';
}

/**
 * Extract structured data (JSON-LD, microdata, etc.)
 */
function extractStructuredData(doc: Document): any {
  const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  const structuredData: any[] = [];

  scripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent || '');
      structuredData.push(data);
    } catch (e) {
      // Invalid JSON, skip
    }
  });

  return structuredData;
}

/**
 * Detect page type
 */
function detectPageType(url: string, pageData: any): CrawledPage['type'] {
  const path = new URL(url).pathname.toLowerCase();
  
  // Check structured data
  const productSchema = pageData.structuredData?.find((d: any) => 
    d['@type'] === 'Product' || d.type === 'Product'
  );
  if (productSchema) return 'product';

  const collectionSchema = pageData.structuredData?.find((d: any) =>
    d['@type'] === 'CollectionPage' || d['@type'] === 'ItemList'
  );
  if (collectionSchema) return 'collection';

  // Check URL patterns
  if (path === '/' || path === '') return 'home';
  if (path.includes('/product')) return 'product';
  if (path.includes('/collection')) return 'collection';
  if (path.includes('/blog')) return 'blog';
  if (path.includes('/pages/')) return 'page';
  
  // Check content
  if (pageData.document?.querySelector('.product-form, [data-product-id]')) {
    return 'product';
  }
  if (pageData.document?.querySelector('.collection-grid, .product-grid')) {
    return 'collection';
  }

  return 'unknown';
}

/**
 * Extract products from page
 */
function extractProducts(pageData: any, url: string): CrawledProduct[] {
  const products: CrawledProduct[] = [];

  // Try structured data first
  const productSchemas = pageData.structuredData?.filter((d: any) =>
    d['@type'] === 'Product' || d.type === 'Product'
  ) || [];

  productSchemas.forEach((schema: any) => {
    products.push({
      name: schema.name,
      description: schema.description || '',
      price: parseFloat(schema.offers?.price || schema.price || '0'),
      compareAtPrice: parseFloat(schema.offers?.priceSpecification?.price),
      images: Array.isArray(schema.image) ? schema.image : [schema.image].filter(Boolean),
      url,
      sku: schema.sku,
      vendor: schema.brand?.name,
      tags: [],
      availability: schema.offers?.availability?.includes('InStock') ? 'in-stock' : 'out-of-stock'
    });
  });

  // Fallback: parse HTML for products
  if (products.length === 0) {
    const doc = pageData.document;
    
    // Look for product cards/items
    const productElements = doc.querySelectorAll(
      '.product-item, .product-card, [data-product], .grid__item'
    );

    productElements.forEach((el: Element) => {
      const name = el.querySelector('.product-title, .product__title, h3, h2')?.textContent?.trim();
      const priceText = el.querySelector('.price, .product-price, [data-price]')?.textContent?.trim();
      const image = el.querySelector('img')?.src;
      const link = el.querySelector('a')?.href;

      if (name && priceText) {
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        
        products.push({
          name,
          description: '',
          price: isNaN(price) ? 0 : price,
          images: image ? [image] : [],
          url: link || url,
          tags: [],
          availability: 'in-stock'
        });
      }
    });
  }

  return products;
}

/**
 * Extract collection from page
 */
function extractCollection(pageData: any, url: string): CrawledCollection | null {
  const doc = pageData.document;
  
  const name = doc.querySelector('h1, .collection-title, .page-title')?.textContent?.trim();
  const description = doc.querySelector('.collection-description, .page-description')?.textContent?.trim();
  const image = doc.querySelector('.collection-image img, .page-image img')?.src;
  
  if (!name) return null;

  const productLinks = Array.from(doc.querySelectorAll('a[href*="/product"]')).map(
    (a: any) => a.href
  );

  return {
    name,
    description: description || '',
    url,
    image,
    products: [...new Set(productLinks)],
    productCount: productLinks.length
  };
}

/**
 * Extract design elements
 */
function extractDesign(pageData: any, url: string): CrawledDesign {
  const doc = pageData.document;
  const design: CrawledDesign = {
    colors: { primary: [], background: [], text: [] },
    fonts: { headings: [], body: [] },
    navigation: { header: [], footer: [] },
    socialLinks: {}
  };

  // Extract colors from computed styles
  const bodyStyle = window.getComputedStyle(doc.body);
  design.colors.background.push(bodyStyle.backgroundColor);
  design.colors.text.push(bodyStyle.color);

  // Extract primary color from buttons, links
  const primaryElements = doc.querySelectorAll('button, .btn, a.button, [class*="primary"]');
  primaryElements.forEach((el: Element) => {
    const style = window.getComputedStyle(el);
    const bgColor = style.backgroundColor;
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && !design.colors.primary.includes(bgColor)) {
      design.colors.primary.push(bgColor);
    }
  });

  // Extract fonts
  const h1 = doc.querySelector('h1');
  if (h1) {
    design.fonts.headings.push(window.getComputedStyle(h1).fontFamily);
  }
  design.fonts.body.push(bodyStyle.fontFamily);

  // Extract logo
  const logo = doc.querySelector('img[alt*="logo" i], .logo img, .site-logo img, header img');
  if (logo) {
    design.logo = (logo as HTMLImageElement).src;
  }

  // Extract favicon
  const favicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  if (favicon) {
    design.favicon = favicon.getAttribute('href') || undefined;
  }

  // Extract navigation
  const headerNav = doc.querySelector('nav, header nav, .header-nav, .main-nav');
  if (headerNav) {
    const links = headerNav.querySelectorAll('a');
    design.navigation.header = Array.from(links).map((a: any) => ({
      label: a.textContent?.trim() || '',
      url: a.href
    }));
  }

  const footerNav = doc.querySelector('footer nav, .footer-nav');
  if (footerNav) {
    const links = footerNav.querySelectorAll('a');
    design.navigation.footer = Array.from(links).map((a: any) => ({
      label: a.textContent?.trim() || '',
      url: a.href
    }));
  }

  // Extract social links
  const socialSelectors = {
    facebook: 'a[href*="facebook.com"]',
    instagram: 'a[href*="instagram.com"]',
    twitter: 'a[href*="twitter.com"], a[href*="x.com"]',
    tiktok: 'a[href*="tiktok.com"]',
    youtube: 'a[href*="youtube.com"]',
    pinterest: 'a[href*="pinterest.com"]'
  };

  Object.entries(socialSelectors).forEach(([platform, selector]) => {
    const link = doc.querySelector(selector);
    if (link) {
      design.socialLinks[platform as keyof typeof design.socialLinks] = link.getAttribute('href') || undefined;
    }
  });

  return design;
}

/**
 * Detect ecommerce platform
 */
function detectPlatform(pageData: any): CrawlResult['platform'] {
  const html = pageData.html.toLowerCase();
  const doc = pageData.document;

  // Shopify
  if (
    html.includes('shopify') ||
    html.includes('cdn.shopify.com') ||
    doc.querySelector('[data-shopify]') ||
    doc.querySelector('meta[name="shopify-checkout-api-token"]')
  ) {
    return 'shopify';
  }

  // WooCommerce
  if (
    html.includes('woocommerce') ||
    doc.querySelector('.woocommerce') ||
    html.includes('wp-content/plugins/woocommerce')
  ) {
    return 'woocommerce';
  }

  // BigCommerce
  if (
    html.includes('bigcommerce') ||
    html.includes('cdn11.bigcommerce.com')
  ) {
    return 'bigcommerce';
  }

  return 'custom';
}
