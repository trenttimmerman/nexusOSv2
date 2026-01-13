/**
 * API for calling the website crawler backend service
 * Uses Vercel serverless function to bypass CORS
 */

export interface CrawlOptions {
  maxDepth?: number;
  maxPages?: number;
  includeProducts?: boolean;
  includeCollections?: boolean;
  onProgress?: (progress: { current: number; total: number; currentUrl: string }) => void;
}

export interface CrawlResult {
  pages: Array<{
    url: string;
    title: string;
    description: string;
    headings: string[];
    paragraphs: string[];
    images: string[];
    links: string[];
    type: 'home' | 'product' | 'collection' | 'page';
  }>;
  products: Array<{
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    url: string;
  }>;
  collections: Array<{
    name: string;
    url: string;
    productCount: number;
  }>;
  design: {
    colors: {
      primary: string[];
      secondary: string[];
      accent: string[];
      background: string[];
      text: string[];
    };
    fonts: {
      headings: string[];
      body: string[];
    };
    logo: string | null;
    navigation: {
      header: Array<{ title: string; url: string }>;
      footer: Array<{ title: string; url: string }>;
    };
  };
  platform: string;
  errors: string[];
}

/**
 * Crawl a website using the backend proxy service
 * This prevents CORS issues by making the request server-side
 */
export async function crawlWebsite(url: string, options: CrawlOptions = {}): Promise<CrawlResult> {
  const { onProgress, ...apiOptions } = options;

  try {
    console.log('[CrawlerAPI] Starting crawl via backend:', url);

    const response = await fetch('/api/crawl-website', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        options: apiOptions
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result: CrawlResult = await response.json();

    console.log('[CrawlerAPI] Crawl complete:', {
      pages: result.pages.length,
      products: result.products.length,
      collections: result.collections.length,
      errors: result.errors.length
    });

    // Simulate progress callback if provided
    if (onProgress && result.pages.length > 0) {
      onProgress({
        current: result.pages.length,
        total: result.pages.length,
        currentUrl: result.pages[result.pages.length - 1].url
      });
    }

    return result;

  } catch (error: any) {
    console.error('[CrawlerAPI] Error:', error);
    throw new Error(error.message || 'Failed to crawl website');
  }
}
