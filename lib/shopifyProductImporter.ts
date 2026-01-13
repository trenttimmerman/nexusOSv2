/**
 * Import products and collections from Shopify theme data
 * 
 * Note: Theme files don't contain actual product data, so we create
 * placeholder products based on detected patterns and configured sections.
 */

import { ShopifyThemeStructure } from './shopifyThemeParser';
import { ParsedTemplate } from './shopifyTemplateParser';
import { SupabaseClient } from '@supabase/supabase-js';

export interface ProductToImport {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  images: string[];
  category?: string;
  tags: string[];
  sku?: string;
  stock: number;
  trackInventory: boolean;
  hasVariants: boolean;
  variantOptions: any[];
  variants: any[];
  status: 'active' | 'draft';
  template?: string;
}

export interface CollectionToImport {
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  type: 'manual' | 'auto-category' | 'auto-tag';
  isFeatured: boolean;
  isVisible: boolean;
  conditions?: any;
  productIds?: string[];
}

export interface ImportResult {
  productsCreated: number;
  collectionsCreated: number;
  errors: string[];
}

/**
 * Extract product data from theme templates and sections
 */
export function extractProductsFromTheme(
  theme: ShopifyThemeStructure
): ProductToImport[] {
  const products: ProductToImport[] = [];
  
  // Check if theme has product templates
  const productTemplate = theme.parsedTemplates?.product;
  const hasProductFeatures = productTemplate || 
    Object.keys(theme.files.sections).some(s => 
      s.includes('product') || s.includes('featured-product')
    );
  
  if (!hasProductFeatures) {
    console.log('[Product Import] No product features detected in theme');
    return products;
  }
  
  // Extract featured products from sections
  const featuredProducts = extractFeaturedProducts(theme);
  products.push(...featuredProducts);
  
  // If no featured products found, create default sample products
  if (products.length === 0) {
    products.push(...createDefaultProducts());
  }
  
  return products;
}

/**
 * Extract featured products configured in theme sections
 */
function extractFeaturedProducts(theme: ShopifyThemeStructure): ProductToImport[] {
  const products: ProductToImport[] = [];
  const productNames = new Set<string>();
  
  // Check parsed templates for configured product sections
  if (theme.parsedTemplates?.index) {
    const indexSections = theme.parsedTemplates.index.sections;
    
    for (const section of indexSections) {
      // Look for featured product sections
      if (section.type?.includes('featured-product') || 
          section.type?.includes('product-grid')) {
        
        // Check blocks for product data
        if (section.blocks) {
          section.blocks.forEach(block => {
            const productName = block.settings?.product_title || 
                              block.settings?.title || 
                              block.settings?.heading;
            
            if (productName && !productNames.has(productName)) {
              products.push({
                name: productName,
                description: block.settings?.product_description || 
                           block.settings?.description || 
                           `${productName} from your Shopify store`,
                price: parseFloat(block.settings?.price) || 29.99,
                compareAtPrice: parseFloat(block.settings?.compare_at_price),
                image: block.settings?.product_image || 
                      block.settings?.image || 
                      block.settings?.featured_image,
                images: [],
                tags: extractTags(block.settings?.tags),
                stock: 100,
                trackInventory: true,
                hasVariants: false,
                variantOptions: [],
                variants: [],
                status: 'active',
                template: 'default'
              });
              
              productNames.add(productName);
            }
          });
        }
        
        // Check section-level settings
        if (section.settings) {
          const productName = section.settings.product_title || 
                            section.settings.heading;
          
          if (productName && !productNames.has(productName)) {
            products.push({
              name: productName,
              description: section.settings.product_description || 
                         section.settings.description || 
                         `${productName} from your Shopify store`,
              price: parseFloat(section.settings.price) || 29.99,
              compareAtPrice: parseFloat(section.settings.compare_at_price),
              image: section.settings.product_image || section.settings.image,
              images: [],
              tags: extractTags(section.settings.tags),
              stock: 100,
              trackInventory: true,
              hasVariants: false,
              variantOptions: [],
              variants: [],
              status: 'active',
              template: 'default'
            });
            
            productNames.add(productName);
          }
        }
      }
    }
  }
  
  return products;
}

/**
 * Extract collections from theme
 */
export function extractCollectionsFromTheme(
  theme: ShopifyThemeStructure
): CollectionToImport[] {
  const collections: CollectionToImport[] = [];
  const collectionNames = new Set<string>();
  
  // Check if theme has collection features
  const collectionTemplate = theme.parsedTemplates?.collection;
  const hasCollectionFeatures = collectionTemplate || 
    Object.keys(theme.files.sections).some(s => 
      s.includes('collection') || s.includes('featured-collection')
    );
  
  if (!hasCollectionFeatures) {
    console.log('[Collection Import] No collection features detected in theme');
    return createDefaultCollections();
  }
  
  // Extract featured collections from index template
  if (theme.parsedTemplates?.index) {
    const indexSections = theme.parsedTemplates.index.sections;
    
    for (const section of indexSections) {
      if (section.type?.includes('featured-collection') || 
          section.type?.includes('collection-list')) {
        
        // Extract from blocks
        if (section.blocks) {
          section.blocks.forEach(block => {
            const collectionName = block.settings?.collection_name || 
                                  block.settings?.title || 
                                  block.settings?.heading;
            
            if (collectionName && !collectionNames.has(collectionName)) {
              collections.push({
                name: collectionName,
                slug: slugify(collectionName),
                description: block.settings?.description || 
                           `Shop our ${collectionName} collection`,
                imageUrl: block.settings?.image,
                type: 'manual',
                isFeatured: true,
                isVisible: true
              });
              
              collectionNames.add(collectionName);
            }
          });
        }
        
        // Extract from section settings
        if (section.settings) {
          const collectionName = section.settings.collection_name || 
                                section.settings.heading;
          
          if (collectionName && !collectionNames.has(collectionName)) {
            collections.push({
              name: collectionName,
              slug: slugify(collectionName),
              description: section.settings.description || 
                         `Shop our ${collectionName} collection`,
              imageUrl: section.settings.image,
              type: 'manual',
              isFeatured: true,
              isVisible: true
            });
            
            collectionNames.add(collectionName);
          }
        }
      }
    }
  }
  
  // If no collections found, create defaults
  if (collections.length === 0) {
    return createDefaultCollections();
  }
  
  return collections;
}

/**
 * Import products and collections to database
 */
export async function importProductsAndCollections(
  storeId: string,
  products: ProductToImport[],
  collections: CollectionToImport[],
  supabase: SupabaseClient
): Promise<ImportResult> {
  const result: ImportResult = {
    productsCreated: 0,
    collectionsCreated: 0,
    errors: []
  };
  
  console.log(`[Import] Starting import: ${products.length} products, ${collections.length} collections`);
  
  // Import products first
  for (const product of products) {
    try {
      const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase.from('products').insert({
        id: productId,
        store_id: storeId,
        name: product.name,
        description: product.description,
        price: product.price,
        compare_at_price: product.compareAtPrice,
        image: product.image,
        images: product.images,
        category: product.category,
        tags: product.tags,
        sku: product.sku || `SKU-${productId.substr(-8)}`,
        stock: product.stock,
        track_inventory: product.trackInventory,
        has_variants: product.hasVariants,
        variant_options: product.variantOptions,
        variants: product.variants,
        status: product.status,
        template: product.template
      });
      
      if (error) {
        result.errors.push(`Failed to import product "${product.name}": ${error.message}`);
      } else {
        result.productsCreated++;
      }
    } catch (error: any) {
      result.errors.push(`Error importing product "${product.name}": ${error.message}`);
    }
  }
  
  // Import collections
  for (const collection of collections) {
    try {
      const collectionId = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase.from('collections').insert({
        id: collectionId,
        store_id: storeId,
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        image_url: collection.imageUrl,
        type: collection.type,
        is_featured: collection.isFeatured,
        is_visible: collection.isVisible,
        conditions: collection.conditions || {}
      });
      
      if (error) {
        result.errors.push(`Failed to import collection "${collection.name}": ${error.message}`);
      } else {
        result.collectionsCreated++;
      }
    } catch (error: any) {
      result.errors.push(`Error importing collection "${collection.name}": ${error.message}`);
    }
  }
  
  console.log(`[Import] Complete: ${result.productsCreated} products, ${result.collectionsCreated} collections`);
  if (result.errors.length > 0) {
    console.warn(`[Import] ${result.errors.length} errors occurred`);
  }
  
  return result;
}

/**
 * Helper: Create default sample products
 */
function createDefaultProducts(): ProductToImport[] {
  return [
    {
      name: 'Sample Product 1',
      description: 'This is a sample product migrated from your Shopify theme. Replace with your actual products.',
      price: 29.99,
      compareAtPrice: 39.99,
      images: [],
      tags: ['sample', 'new'],
      stock: 100,
      trackInventory: true,
      hasVariants: false,
      variantOptions: [],
      variants: [],
      status: 'draft',
      template: 'default'
    },
    {
      name: 'Sample Product 2',
      description: 'Another sample product. You can edit or delete these placeholder products.',
      price: 49.99,
      images: [],
      tags: ['sample'],
      stock: 50,
      trackInventory: true,
      hasVariants: false,
      variantOptions: [],
      variants: [],
      status: 'draft',
      template: 'default'
    }
  ];
}

/**
 * Helper: Create default collections
 */
function createDefaultCollections(): CollectionToImport[] {
  return [
    {
      name: 'All Products',
      slug: 'all-products',
      description: 'Browse all products in our store',
      type: 'auto-category',
      isFeatured: false,
      isVisible: true
    },
    {
      name: 'New Arrivals',
      slug: 'new-arrivals',
      description: 'Check out our latest products',
      type: 'auto-tag',
      isFeatured: true,
      isVisible: true,
      conditions: { tags: ['new'] }
    },
    {
      name: 'Featured',
      slug: 'featured',
      description: 'Our most popular products',
      type: 'manual',
      isFeatured: true,
      isVisible: true
    }
  ];
}

/**
 * Helper: Extract tags from various formats
 */
function extractTags(tagsInput: any): string[] {
  if (!tagsInput) return [];
  
  if (Array.isArray(tagsInput)) {
    return tagsInput.map(t => String(t).trim()).filter(Boolean);
  }
  
  if (typeof tagsInput === 'string') {
    // Handle comma-separated tags
    return tagsInput.split(',').map(t => t.trim()).filter(Boolean);
  }
  
  return [];
}

/**
 * Helper: Convert string to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}
