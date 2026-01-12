# Multi-Page Migration Update

## Issue
The Shopify migration was only creating 1 page, even though the theme ZIP contains multiple template files.

## Root Cause
The migration was only processing the `index.json` template and creating a single homepage. All other templates (product, collection, blog, custom pages) were being ignored.

## Solution
Enhanced the migration to process **all available templates** and create a separate page for each one.

## Changes Made

### 1. Updated `ShopifyMigration.tsx`

**Added State:**
```typescript
const [pagesCreated, setPagesCreated] = useState<number>(0);
```

**Enhanced Import Process:**
Instead of creating just one page, now loops through all parsed templates:

```typescript
// Process all available templates
if (analysis.theme.parsedTemplates) {
  for (const [templateName, templateData] of Object.entries(analysis.theme.parsedTemplates)) {
    const template = templateData as ParsedTemplate;
    
    // Generate blocks for this template
    const templateBlocks = generateBlockMappingFromTemplate(
      template.sections,
      parsedSections
    );
    
    // Create page with appropriate title and slug
    // ...
  }
}
```

**Page Naming Logic:**
- `index.json` → "Migrated Homepage" (slug: `migrated-home`)
- `product.json` → "Product Template" (slug: `migrated-product`)
- `collection.json` → "Collection Template" (slug: `migrated-collection`)
- `blog.json` → "Blog Template" (slug: `migrated-blog`)
- `article.json` → "Article Template" (slug: `migrated-article`)
- `page.contact.json` → "Page: contact" (slug: `migrated-page.contact`)
- Custom templates maintain their names

**Completion Screen:**
- Now displays actual page count: `{pagesCreated || 1}`
- Properly pluralizes: "Page" vs "Pages"
- Updates migration_data with page count

## Example Template Files Processed

From a typical Shopify theme:
- ✅ `index.json` - Homepage
- ✅ `product.json` - Product page template
- ✅ `collection.json` - Collection listing template
- ✅ `blog.json` - Blog index template
- ✅ `article.json` - Blog post template
- ✅ `cart.json` - Shopping cart page
- ✅ `page.contact.json` - Contact page
- ✅ `page.about.json` - About page
- ✅ `404.json` - Error page
- ✅ Multiple collection variants (collection.featured.json, etc.)
- ✅ Custom page templates (page.brands.json, page.services.json, etc.)

## Migration Flow Update

**Before:**
1. Parse index.json template
2. Generate blocks for homepage
3. Create 1 page
4. Complete ❌ Missing all other pages

**After:**
1. Parse ALL templates
2. For each template:
   - Generate blocks using real template data
   - Create page with appropriate title/slug
   - Track created pages
3. Display accurate page count
4. Complete ✅ All pages migrated

## Benefits

1. **Complete Migration**: All templates from Shopify theme are now migrated
2. **Multiple Pages**: Product pages, collection pages, custom pages all created
3. **Accurate Tracking**: Dashboard shows actual number of pages created
4. **Better UX**: Customers see all their content, not just homepage
5. **Preserves Structure**: Maintains the multi-page structure of original theme

## Testing

To verify the update works:

1. Upload a Shopify theme ZIP
2. Check console logs for: `[Migration] Available templates: [...]`
3. Watch progress: "Creating pages from templates..."
4. Completion screen should show: "X Pages Created" where X > 1
5. Navigate to Design tab to see all migrated pages

## Expected Results

For a typical Shopify theme with ~20 template files:
- **Before**: 1 Page Created
- **After**: 15-20 Pages Created (some templates may be skipped if no blocks generated)

## Next Steps

Future enhancements could include:
- Template categorization (group by type: products, collections, pages)
- Preview each template before migration
- Selective template migration (choose which to import)
- Template linking (connect product → collection pages)
