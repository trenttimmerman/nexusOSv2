# Handoff Document - Website Crawler & Migration System
**Date:** January 13, 2026  
**Session Focus:** Backend website crawler service for importing content from any website  
**Status:** ✅ Working - Basic crawler functional, advanced features reverted

---

## 🎯 What Was Built

### 1. Backend Crawler Service (Vercel Serverless Function)
**File:** `/api/crawl-website.ts` (357 lines)

A server-side website crawler that bypasses browser CORS restrictions by making requests from the backend. This enables users to import content from any website URL without CORS errors.

**Key Features:**
- ✅ Server-side HTML fetching (no browser CORS restrictions)
- ✅ BFS (Breadth-First Search) crawling algorithm
- ✅ Configurable depth and page limits
- ✅ Platform detection (Shopify, WooCommerce, BigCommerce, Squarespace)
- ✅ Product extraction via JSON-LD schema
- ✅ Collection/category detection
- ✅ Design element extraction (colors, fonts, logo, navigation)
- ✅ Regex-based HTML parsing (no external dependencies)
- ✅ Timeout protection for serverless environment

**API Endpoint:**
```
POST /api/crawl-website
Body: {
  url: string,
  options?: {
    maxDepth?: number,
    maxPages?: number,
    includeProducts?: boolean,
    includeCollections?: boolean
  }
}
```

**Response:**
```typescript
{
  pages: Array<{
    url: string,
    title: string,
    description: string,
    headings: string[],
    images: string[],
    links: string[],
    type: 'home' | 'product' | 'collection' | 'page'
  }>,
  products: Array<{
    name: string,
    description: string,
    price: number,
    images: string[],
    url: string
  }>,
  collections: Array<{
    name: string,
    url: string,
    productCount: number
  }>,
  design: {
    colors: { primary[], secondary[], accent[], background[], text[] },
    fonts: { headings[], body[] },
    logo: string | null,
    navigation: { header[], footer[] }
  },
  platform: string,
  errors: string[]
}
```

### 2. Client API Wrapper
**File:** `/lib/crawlerAPI.ts` (106 lines)

Clean TypeScript wrapper for calling the backend crawler service.

**Functions:**
- `crawlWebsite(url, options)` - Main API call to backend
- Progress callback support
- Proper error handling with console logging

### 3. Website Migration UI Component
**File:** `/components/WebsiteMigration.tsx` (639 lines)

Complete multi-step wizard for importing websites via URL.

**Features:**
- URL input with validation
- Real-time crawl progress
- CORS error detection with helpful warnings
- Product and collection import to database
- Preview of crawled content
- Success statistics (pages, products, collections created)

### 4. Integration Points

**AdminPanel.tsx:**
- Added `WEBSITE_MIGRATION` tab to admin navigation
- Globe icon button in sidebar
- Renders WebsiteMigration component when active

**Database Schema:**
- Uses existing `products` and `collections` tables
- Stores crawled data with `store_id` for multi-tenancy

---

## 🏗️ Architecture

### Flow Diagram
```
User enters URL in WebsiteMigration.tsx
         ↓
crawlWebsite() in crawlerAPI.ts
         ↓
POST to /api/crawl-website (Vercel serverless function)
         ↓
Server-side fetch() - NO CORS ISSUES
         ↓
BFS crawl algorithm with depth/page limits
         ↓
Regex-based HTML parsing (title, meta, links, images)
         ↓
Platform detection + product/collection extraction
         ↓
Return structured JSON to client
         ↓
WebsiteMigration.tsx imports to Supabase database
```

### Why Serverless Function?
Browser fetch() to external domains triggers CORS errors because websites don't set `Access-Control-Allow-Origin` headers for our domain. Server-side requests don't have CORS restrictions, so the Vercel function acts as a proxy.

---

## 📊 Current Capabilities

### Platform Detection
- **Shopify**: Detects `Shopify.theme` or `cdn.shopify.com` in HTML
- **WooCommerce**: Detects `woocommerce` or `wp-content`
- **BigCommerce**: Detects `bigcommerce` keyword
- **Squarespace**: Detects `squarespace` keyword
- **Custom**: Default for unrecognized platforms

### Product Extraction
Currently uses JSON-LD Schema.org Product markup:
```html
<script type="application/ld+json">
{
  "@type": "Product",
  "name": "Product Name",
  "offers": { "price": "29.99" },
  "image": ["..."]
}
</script>
```

### Collection Extraction
Detects collection pages by URL patterns:
- `/collections/*`
- `/collection/*`
- `/category/*`

### Design Extraction
- **Colors**: Hex codes from CSS `<style>` tags
- **Logo**: Searches for `<img>` with class/alt containing "logo"
- **Navigation**: Extracts links from `<nav>` elements

---

## ⚙️ Configuration

### Current Limits (Serverless-Friendly)
```typescript
maxDepth: 3        // How deep to follow links
maxPages: 50       // Maximum pages to crawl
timeout: 10s       // Per-request timeout
```

### Vercel Configuration
**File:** `vercel.json`
```json
{
  "functions": {
    "api/crawl-website.ts": {
      "maxDuration": 10  // 10 second function timeout
    }
  }
}
```

**Note:** Hobby plan has 10s limit, Pro plan allows 60s.

---

## 🐛 Known Issues & Limitations

### 1. Advanced Extraction Code Causes 500 Errors
**Problem:** Commits 36347db and 558da88 introduced enhanced product/collection extraction but caused the serverless function to fail with 500 errors.

**What Was Attempted:**
- Multiple product extraction methods (JSON-LD, Shopify meta, OpenGraph tags)
- Enhanced collection detection
- Better design extraction (more color/font patterns)
- Link prioritization (products > collections > other)

**Status:** Reverted in commit ac5e283 to restore working state.

**Root Cause:** Not yet debugged. Likely issues:
- Regex patterns causing crashes
- Infinite loops in parsing logic
- Memory issues with complex HTML parsing
- TypeScript type errors not caught in build

### 2. Serverless Timeout Constraints
- Vercel Hobby plan: 10 second limit
- Large websites may not fully crawl in time
- Need to implement batch/resume functionality for big sites

### 3. Limited Product Detection
Current version only detects products with proper JSON-LD schema markup. Many e-commerce sites don't use structured data.

### 4. No JavaScript Rendering
The crawler only sees server-rendered HTML. Single-page apps (React/Vue) that load content via JavaScript won't be crawled properly.

### 5. Rate Limiting
No rate limiting or delay between requests. Some websites may block rapid crawling.

---

## 🧪 Testing Instructions

### Test Crawling a Website

1. **Navigate to Admin Panel:**
   - Click Admin in main navigation
   - Click Globe icon (Website Migration tab)

2. **Enter Website URL:**
   ```
   https://www.example.com
   ```

3. **Click "Start Crawl"**

4. **Expected Behavior:**
   - Progress bar appears
   - Console shows: `[CrawlerAPI] Starting crawl via backend: https://...`
   - Backend logs visible in Vercel dashboard
   - Results display: pages found, products, collections

5. **Import Products/Collections:**
   - Click "Import Products" or "Import Collections"
   - Check Supabase database for new entries

### Test Error Handling

**Test CORS (should NOT error):**
```
https://www.shopify.com
```
Should work - backend bypasses CORS.

**Test Invalid URL:**
```
not-a-url
```
Should show validation error.

**Test Large Site (may timeout):**
```
https://www.amazon.com
```
May hit serverless timeout, should fail gracefully.

### Verify in Vercel Dashboard

1. Go to https://vercel.com/your-project/functions
2. Find `/api/crawl-website`
3. Check logs for:
   - `[Crawler] Starting crawl for: ...`
   - `[Crawler] Fetching: ... (depth: X)`
   - `[Crawler] Complete. Pages: X, Products: Y, Collections: Z`

---

## 📁 File Changes Summary

### Created Files
- `/api/crawl-website.ts` - Vercel serverless function (357 lines)
- `/lib/crawlerAPI.ts` - Client API wrapper (106 lines)
- `/components/WebsiteMigration.tsx` - UI component (639 lines)

### Modified Files
- `/components/AdminPanel.tsx` - Added WEBSITE_MIGRATION tab
- `/types.ts` - Added WEBSITE_MIGRATION enum value
- `/vercel.json` - Added function timeout config

### Database Changes
None required - uses existing `products` and `collections` tables.

---

## 🚀 Next Steps & Recommendations

### Immediate Priorities

1. **Debug Enhanced Extraction Code**
   - Review commits 36347db and 558da88
   - Add unit tests for regex patterns
   - Test locally with `vercel dev` before deployment
   - Add try-catch around each extraction method
   - Log specific errors to identify crash point

2. **Improve Error Visibility**
   - Show backend error messages in UI
   - Add "View Logs" link to Vercel dashboard
   - Better error messages for common failures

3. **Add Loading States**
   - Show which URL is currently being crawled
   - Display partial results as they come in
   - "Cancel crawl" button

### Medium-Term Enhancements

4. **Batch Crawling for Large Sites**
   - Queue system for crawling 100+ pages
   - Resume capability if timeout occurs
   - Background job processing

5. **JavaScript Rendering**
   - Integrate Puppeteer/Playwright for SPA crawling
   - Requires different Vercel plan or external service
   - Consider using Browserless.io or similar

6. **Enhanced Product Detection**
   - Microdata parsing (schema.org)
   - OpenGraph meta tags (`og:product:price`)
   - Common CSS class patterns (`.product-price`, `.add-to-cart`)
   - Platform-specific selectors (Shopify, WooCommerce, BigCommerce)

7. **Collection Hierarchy**
   - Detect parent/child category relationships
   - Build collection tree structure
   - Import to nested categories

8. **Image Processing**
   - Download and re-upload images to Supabase storage
   - Generate thumbnails
   - Optimize image sizes

9. **Content Deduplication**
   - Detect duplicate products across pages
   - Merge collection variations
   - Smart title matching

10. **Rate Limiting & Politeness**
    - Add delay between requests (1-2 seconds)
    - Respect `robots.txt`
    - Random user-agent rotation
    - Retry logic for failed requests

### Long-Term Features

11. **Scheduled Crawls**
    - Periodic re-crawling to sync updates
    - Change detection (new products, price changes)
    - Automated inventory sync

12. **Multi-Source Import**
    - Combine multiple websites into one store
    - Cross-site product matching
    - Unified catalog management

13. **AI Content Enhancement**
    - Generate better product descriptions with GPT
    - Auto-categorization
    - SEO optimization
    - Image alt text generation

14. **Migration Templates**
    - Pre-built configs for popular platforms
    - Field mapping (Shopify → NexusOS)
    - Bulk transformations

---

## 🔧 Debugging Tips

### If Crawler Returns 500 Error

1. **Check Vercel Function Logs:**
   ```bash
   vercel logs --follow
   ```

2. **Test Locally:**
   ```bash
   npm install -g vercel
   vercel dev
   ```
   Then visit: `http://localhost:3000/admin` and test crawler

3. **Add Debug Logging:**
   In `/api/crawl-website.ts`, add more `console.log()` statements:
   ```typescript
   console.log('[Crawler] Parsing HTML:', currentUrl);
   console.log('[Crawler] Page data:', pageData);
   ```

4. **Check for TypeScript Errors:**
   ```bash
   npm run build
   ```

5. **Test Individual Functions:**
   Create test file to isolate parsing logic:
   ```typescript
   const html = '<html>...</html>';
   const result = extractProducts(html, 'https://example.com');
   console.log(result);
   ```

### If Products Not Detected

1. **Inspect Target Website:**
   - View source of product page
   - Search for `application/ld+json`
   - Check if JSON-LD exists and is valid

2. **Test JSON-LD Parser:**
   Copy JSON-LD from website, test parsing locally

3. **Add More Detection Methods:**
   See "Enhanced Product Detection" in next steps

---

## 📈 Success Metrics

### What's Working
✅ Backend crawler bypasses CORS  
✅ BFS algorithm crawls multiple pages  
✅ Platform detection identifies e-commerce systems  
✅ JSON-LD product extraction works for schema.org sites  
✅ Collection URL pattern detection  
✅ Design element extraction (colors, logo, nav)  
✅ Import to Supabase database  
✅ Multi-tenant isolation (store_id)  
✅ Error handling and timeouts  

### What Needs Work
⚠️ Advanced extraction code causes crashes (reverted)  
⚠️ Limited to sites with JSON-LD markup  
⚠️ No JavaScript rendering for SPAs  
⚠️ Serverless timeout limits large sites  
⚠️ No image downloading/rehosting  

---

## 💡 Code Examples

### Using the Crawler Programmatically

```typescript
import { crawlWebsite } from './lib/crawlerAPI';

const result = await crawlWebsite('https://example.com', {
  maxDepth: 2,
  maxPages: 20,
  includeProducts: true,
  includeCollections: true,
  onProgress: ({ current, total, currentUrl }) => {
    console.log(`Crawling ${current}/${total}: ${currentUrl}`);
  }
});

console.log('Found:', {
  pages: result.pages.length,
  products: result.products.length,
  collections: result.collections.length,
  platform: result.platform
});
```

### Importing Products to Database

```typescript
import { supabase } from './lib/supabaseClient';

for (const product of result.products) {
  const { error } = await supabase
    .from('products')
    .insert({
      store_id: storeId,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      status: 'active'
    });
  
  if (error) console.error('Import failed:', error);
}
```

---

## 🔗 Related Documentation

- [HANDOFF_JAN12_SHOPIFY_MIGRATION.md](./HANDOFF_JAN12_SHOPIFY_MIGRATION.md) - Shopify ZIP upload migration
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Schema.org Product](https://schema.org/Product) - JSON-LD markup standard

---

## 📝 Git Commits (This Session)

```
1f2004f - feat: add backend website crawler service to bypass CORS
f510ddc - fix: use backend crawler API instead of client-side fetch
36347db - feat: enhance website crawler to find more products and collections (REVERTED)
558da88 - fix: optimize crawler for Vercel serverless timeout limits (REVERTED)
ac5e283 - Revert "feat: enhance website crawler to find more products and collections"
```

**Current State:** Commit ac5e283 (basic crawler working)

---

## ✅ Handoff Checklist

- [x] Backend crawler service created and deployed
- [x] Client API wrapper implemented
- [x] UI component with multi-step wizard
- [x] CORS bypass working
- [x] Platform detection functional
- [x] Basic product/collection extraction
- [x] Database import working
- [x] Error handling and timeouts
- [x] Code committed and pushed
- [x] Build successful
- [x] Production deployment verified
- [ ] Advanced extraction debugged (future work)
- [ ] Image downloading (future work)
- [ ] JavaScript rendering (future work)

---

## 🎓 Key Learnings

1. **CORS Can't Be Fixed Client-Side** - Browser security prevents direct fetching of external websites. Server-side proxy is the only solution.

2. **Serverless Has Strict Time Limits** - Vercel Hobby plan = 10s max. Must design for fast execution or use background jobs.

3. **Regex Parsing Is Fragile** - Complex HTML parsing with regex is error-prone. Need extensive testing and fallbacks.

4. **Incremental Development** - The enhanced extraction code broke things. Should have:
   - Added one feature at a time
   - Tested each commit in production
   - Used feature flags for risky changes

5. **Logging Is Critical** - Console logs in serverless functions are essential for debugging since we can't attach a debugger.

---

## 🤝 Support & Questions

**If something breaks:**
1. Check Vercel function logs
2. Test locally with `vercel dev`
3. Review this handoff document
4. Check git history for recent changes
5. Revert to last known good commit (ac5e283)

**For new features:**
1. Reference "Next Steps" section
2. Test thoroughly with `vercel dev` before deploying
3. Add comprehensive error handling
4. Update this handoff doc

---

**Document Version:** 1.0  
**Last Updated:** January 13, 2026  
**Status:** Production Ready (Basic Features)
