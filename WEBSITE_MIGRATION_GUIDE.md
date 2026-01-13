# Website Migration Guide

## Overview

The Website Migration feature allows users to import their existing websites into nexusOS by simply providing a URL. The system will crawl the website, extract content, products, collections, and design elements, and recreate them in nexusOS.

## Features

### 1. Website Crawling
- **URL-based Import**: Users provide a website URL instead of uploading files
- **Smart Crawling**: Automatically discovers pages, products, and collections
- **Platform Detection**: Identifies Shopify, WooCommerce, BigCommerce, or custom platforms
- **Depth Control**: Configurable crawl depth and page limits
- **Progress Tracking**: Real-time feedback during the crawling process

### 2. Data Extraction

#### Products
- Product names and descriptions
- Pricing (including compare-at prices)
- Images and variants
- SKUs and availability status
- Product metadata

#### Collections
- Collection names and descriptions
- Featured images
- Product associations
- Collection metadata

#### Pages
- Page content and structure
- Meta information (title, description, keywords)
- Images and links
- Structured data (JSON-LD)

#### Design Elements
- Color palette (primary, background, text colors)
- Typography (heading and body fonts)
- Logo and favicon
- Navigation menus (header and footer)
- Social media links

### 3. Import Process

1. **URL Input**: User enters website URL
2. **Crawling**: System crawls the website (respects robots.txt)
3. **Analysis**: Extracted data is analyzed and organized
4. **Preview**: User reviews what will be imported
5. **Import**: Data is imported into nexusOS
   - Products created in database
   - Collections created
   - Pages recreated with nexusOS blocks
   - Design elements applied
6. **Complete**: User can view the imported site

## How to Use

### Access the Feature

1. Log into nexusOS Admin Panel
2. Click on **"Website Import"** in the sidebar (Globe icon)

### Import Steps

1. **Enter URL**
   - Paste the URL of the website you want to import
   - Click "Analyze" to start the crawl

2. **Wait for Crawling**
   - The system will crawl up to 50 pages (configurable)
   - Progress is shown in real-time
   - This may take 1-5 minutes depending on site size

3. **Review Results**
   - See statistics:
     - Pages found
     - Products detected
     - Collections found
     - Images discovered
     - Platform detected
   - Review detected design elements (colors, fonts, navigation)
   - Check warnings if any

4. **Start Import**
   - Click "Start Import" to proceed
   - Products, collections, and pages will be created
   - Progress shown for each step

5. **View Imported Site**
   - Once complete, click "View Imported Site"
   - Your homepage will be recreated in nexusOS
   - Edit using Design Studio as needed

## Technical Details

### Files Created

1. **`lib/websiteCrawler.ts`** (494 lines)
   - Core crawling engine
   - Page type detection
   - Product/collection extraction
   - Design analysis
   - Platform detection

2. **`lib/crawlerAPI.ts`** (100+ lines)
   - API wrapper for server-side crawling
   - Handles CORS issues via proxy
   - Simple fetch-based fallback

3. **`components/WebsiteMigration.tsx`** (600+ lines)
   - Complete UI for website migration
   - Step-by-step wizard
   - Progress tracking
   - Results preview
   - Import orchestration

### Integration Points

- **AdminPanel.tsx**: Added "Website Import" navigation item
- **types.ts**: Added `WEBSITE_MIGRATION` to `AdminTab` enum
- Uses existing Supabase tables:
  - `products`
  - `collections`
  - `pages`
  - `shopify_migrations` (for migration tracking)

### Crawl Configuration

Default settings (configurable):
```typescript
{
  maxPages: 50,        // Maximum pages to crawl
  maxDepth: 3,         // Maximum link depth
  includeProducts: true,
  includeCollections: true
}
```

### Platform Detection

The crawler can detect:
- **Shopify**: Checks for `cdn.shopify.com`, Shopify-specific meta tags
- **WooCommerce**: Checks for `.woocommerce` classes, WordPress patterns
- **BigCommerce**: Checks for BigCommerce domains/patterns
- **Custom**: Fallback for other platforms

### Data Structures

#### CrawledProduct
```typescript
{
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  url: string;
  sku?: string;
  variants?: any[];
  availability: 'in-stock' | 'out-of-stock' | 'preorder';
}
```

#### CrawledCollection
```typescript
{
  name: string;
  description: string;
  url: string;
  image?: string;
  products: string[];  // URLs
  productCount?: number;
}
```

#### CrawledDesign
```typescript
{
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
  navigation: {
    header: Array<{ label: string; url: string }>;
    footer: Array<{ label: string; url: string }>;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    // ... etc
  };
}
```

## Limitations & Considerations

### Browser-Based Crawling
- **CORS Restrictions**: Some websites may block cross-origin requests
- **Solution**: Use `crawlerAPI.ts` for server-side crawling
- Websites with aggressive bot protection may block requests

### Data Quality
- **Structured Data**: Sites with JSON-LD/microdata will have better extraction
- **HTML Parsing**: Fallback parsing may not be perfect for all layouts
- **Custom Platforms**: May require manual adjustment after import

### Performance
- Large sites (>50 pages) require multiple crawls or manual selection
- Images are referenced by URL initially (not downloaded)
- JavaScript-rendered content may not be captured

### Privacy & Ethics
- Respects `robots.txt` by default
- Rate limiting to avoid overloading target sites
- Only crawls publicly accessible content

## Advantages Over ZIP Upload

### Shopify Migration (ZIP)
- ✅ Gets theme structure and templates
- ❌ No real product data (just templates)
- ❌ No actual content or images
- ❌ Requires Shopify export process
- ❌ Limited to Shopify only

### Website Migration (URL)
- ✅ **Real product data** with actual prices and images
- ✅ **Actual content** from live site
- ✅ **Works with any platform** (Shopify, WooCommerce, custom, etc.)
- ✅ **Simpler for users** - just paste a URL
- ✅ **More comprehensive** - gets navigation, design, social links
- ❌ May not work with sites that block crawlers
- ❌ Doesn't capture theme templates (uses live data instead)

## Future Enhancements

### Planned Features
1. **Selective Crawling**: Let users choose which pages/products to import
2. **Image Download**: Download and host images instead of referencing
3. **JavaScript Rendering**: Use headless browser for JS-heavy sites
4. **Incremental Import**: Import in batches for large sites
5. **Diff/Sync**: Detect changes and update existing imports
6. **Custom Mapping**: Let users customize how elements map to blocks
7. **Multi-language Support**: Detect and import multiple language versions

### Server-Side Improvements
- Deploy `crawlerAPI.ts` as serverless function
- Queue-based crawling for large sites
- Screenshot generation for preview
- Better rate limiting and retry logic

## Troubleshooting

### "Failed to crawl website"
- Check if URL is correct and accessible
- Some sites block automated crawling
- Try using server-side crawler (crawlerAPI)

### "No products detected"
- Site may not be an e-commerce platform
- Products may be loaded via JavaScript (not captured)
- Try Shopify Migration for Shopify themes

### CORS Errors
- Browser blocks cross-origin requests
- Use server-side crawler or CORS proxy
- Some sites require authentication

### Missing Content
- Page may be JavaScript-rendered
- Check if page is publicly accessible
- May need to crawl deeper (increase maxDepth)

## Example Usage

```typescript
// Direct usage of crawler (advanced)
import { crawlWebsite } from './lib/websiteCrawler';

const result = await crawlWebsite('https://example.com', {
  maxPages: 100,
  maxDepth: 4,
  onProgress: (progress) => {
    console.log(`Crawled ${progress.current}/${progress.total}: ${progress.url}`);
  }
});

console.log(`Found ${result.products.length} products`);
console.log(`Platform: ${result.platform}`);
```

## Comparison Table

| Feature | ZIP Upload | URL Crawling |
|---------|-----------|--------------|
| Real Products | ❌ | ✅ |
| Real Content | ❌ | ✅ |
| Platform Support | Shopify only | Any platform |
| User Difficulty | Medium (export required) | Easy (paste URL) |
| Setup Time | 5-10 min | 1-2 min |
| Data Completeness | Templates only | Full live data |
| Design Extraction | ✅ Theme structure | ✅ Live design |
| CORS Issues | ❌ | ⚠️ Possible |

## Conclusion

Website Migration via URL crawling is the **recommended** approach for most users because:
1. It's simpler (just paste a URL)
2. It captures real data (actual products, prices, content)
3. It works with any platform
4. It extracts live design elements

Use Shopify ZIP upload only when:
- You need exact Shopify theme structure
- Website blocks crawlers
- You want to preserve custom Liquid code
