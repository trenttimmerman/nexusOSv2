/**
 * Loveable Preview Crawler API
 * Server-side endpoint to fetch and parse Loveable.dev preview websites
 * Bypasses CORS by making requests from the backend
 */

// Types for Vercel serverless functions
type VercelRequest = any;
type VercelResponse = any;

interface LoveableResult {
  success: boolean;
  html?: string;
  title?: string;
  description?: string;
  sections?: any[];
  design?: {
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
  images?: string[];
  scripts?: string[];
  styles?: string[];
  metadata?: Record<string, any>;
  error?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    res.status(400).json({ success: false, error: 'URL is required' });
    return;
  }

  // Validate it's a Loveable URL
  if (!url.includes('lovable.app') && !url.includes('lovable.dev') && !url.includes('loveable.dev')) {
    res.status(400).json({ 
      success: false, 
      error: 'Only Loveable preview URLs are supported (*.lovable.app, lovable.dev, or loveable.dev)' 
    });
    return;
  }

  try {
    console.log('[Loveable Crawler] Fetching:', url);

    // Fetch the Loveable preview
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    console.log('[Loveable Crawler] HTML fetched, length:', html.length);

    // Parse HTML for key information
    const result: LoveableResult = {
      success: true,
      html,
      ...parseHTML(html, url),
    };

    res.status(200).json(result);
  } catch (error: any) {
    console.error('[Loveable Crawler] Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch Loveable preview',
    });
  }
}

/**
 * Parse HTML to extract useful information
 */
function parseHTML(html: string, baseUrl: string): Partial<LoveableResult> {
  const result: Partial<LoveableResult> = {
    images: [],
    scripts: [],
    styles: [],
    metadata: {},
    design: {
      colors: {
        primary: [],
        secondary: [],
        background: [],
        text: [],
      },
      fonts: {
        headings: [],
        body: [],
      },
    },
  };

  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  // Extract meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (descMatch) {
    result.description = descMatch[1].trim();
  }

  // Extract Open Graph metadata
  const ogMatches = html.matchAll(/<meta\s+property=["']og:([^"']+)["']\s+content=["']([^"']+)["']/gi);
  for (const match of ogMatches) {
    result.metadata![`og:${match[1]}`] = match[2];
  }

  // Extract all images
  const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi);
  for (const match of imgMatches) {
    let imgUrl = match[1];
    // Make absolute URLs
    if (imgUrl.startsWith('/')) {
      const urlObj = new URL(baseUrl);
      imgUrl = `${urlObj.origin}${imgUrl}`;
    } else if (!imgUrl.startsWith('http')) {
      imgUrl = new URL(imgUrl, baseUrl).href;
    }
    result.images!.push(imgUrl);
  }

  // Extract stylesheets
  const linkMatches = html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi);
  for (const match of linkMatches) {
    result.styles!.push(match[1]);
  }

  // Extract inline styles for color detection
  const styleMatches = html.matchAll(/style=["']([^"']+)["']/gi);
  for (const match of styleMatches) {
    const styleContent = match[1];
    
    // Extract colors
    const colorMatches = styleContent.matchAll(/(?:color|background|background-color|border-color):\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/gi);
    for (const colorMatch of colorMatches) {
      const color = colorMatch[1];
      if (!result.design!.colors.primary.includes(color) && result.design!.colors.primary.length < 5) {
        result.design!.colors.primary.push(color);
      }
    }
  }

  // Extract CSS color variables
  const cssVarMatches = html.matchAll(/--[a-zA-Z-]+:\s*(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\))/gi);
  for (const match of cssVarMatches) {
    const color = match[1];
    if (!result.design!.colors.secondary.includes(color) && result.design!.colors.secondary.length < 5) {
      result.design!.colors.secondary.push(color);
    }
  }

  // Extract font families
  const fontMatches = html.matchAll(/font-family:\s*([^;}"']+)/gi);
  for (const match of fontMatches) {
    const font = match[1].trim().replace(/["']/g, '').split(',')[0];
    if (!result.design!.fonts.body.includes(font) && result.design!.fonts.body.length < 3) {
      result.design!.fonts.body.push(font);
    }
  }

  // Extract script sources
  const scriptMatches = html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi);
  for (const match of scriptMatches) {
    result.scripts!.push(match[1]);
  }

  // Deduplicate and clean up
  result.images = [...new Set(result.images)];
  result.design!.colors.primary = [...new Set(result.design!.colors.primary)];
  result.design!.colors.secondary = [...new Set(result.design!.colors.secondary)];
  result.design!.fonts.body = [...new Set(result.design!.fonts.body)];

  return result;
}
