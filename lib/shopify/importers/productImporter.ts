/**
 * Shopify Product Importer
 * Transforms Shopify products to WebPilot format and imports to database
 */

import { ShopifyClient, ShopifyProduct } from '../client';
import { supabase } from '../../supabaseClient';

export interface ProductImportOptions {
  storeId: string;
  onProgress?: (imported: number, total?: number) => void;
  onError?: (productId: string, error: Error) => void;
}

export interface ProductImportResult {
  imported: number;
  failed: number;
  errors: Array<{ productId: string; error: string }>;
}

/**
 * Strip Shopify Liquid template tags from HTML
 */
function stripLiquidTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/\{\{.*?\}\}/g, '') // Remove {{ }} tags
    .replace(/\{%.*?%\}/g, '') // Remove {% %} tags
    .trim();
}

/**
 * Extract variant options from Shopify variant
 */
function extractVariantOptions(
  variant: any,
  productOptions: any[]
): Record<string, string> {
  const options: Record<string, string> = {};

  productOptions.forEach((option, index) => {
    const optionValue = variant[`option${index + 1}`];
    if (optionValue) {
      options[option.name] = optionValue;
    }
  });

  return options;
}

/**
 * Transform Shopify product to WebPilot format
 */
function transformProduct(shopifyProduct: ShopifyProduct, storeId: string): any {
  // Calculate total stock across all variants
  const totalStock = shopifyProduct.variants.reduce(
    (sum, v) => sum + (v.inventory_quantity || 0),
    0
  );

  // Transform variants
  const variants = shopifyProduct.variants.map(v => ({
    id: `shopify_variant_${v.id}`,
    options: extractVariantOptions(v, shopifyProduct.options),
    price: parseFloat(v.price) || 0,
    compareAtPrice: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
    sku: v.sku || null,
    barcode: v.barcode || null,
    stock: v.inventory_quantity || 0,
    imageId: v.image_id || null,
  }));

  // Transform variant options
  const variantOptions = shopifyProduct.options.map(opt => ({
    name: opt.name,
    values: opt.values,
  }));

  // Transform images
  const images = shopifyProduct.images.map(img => ({
    url: img.src,
    alt: img.alt || '',
    position: img.position,
    id: img.id,
  }));

  // Get first variant for pricing (if single variant) or lowest price
  const firstVariant = shopifyProduct.variants[0];
  const lowestPrice = Math.min(...shopifyProduct.variants.map(v => parseFloat(v.price) || 0));

  return {
    id: `shopify_${shopifyProduct.id}`,
    store_id: storeId,
    name: shopifyProduct.title,
    description: stripLiquidTags(shopifyProduct.body_html),
    price: shopifyProduct.variants.length === 1 ? parseFloat(firstVariant.price) : lowestPrice,
    compare_at_price: firstVariant.compare_at_price
      ? parseFloat(firstVariant.compare_at_price)
      : null,

    // Images
    image: images[0]?.url || null,
    images: images,

    // Inventory
    sku: firstVariant.sku || null,
    barcode: firstVariant.barcode || null,
    stock: totalStock,
    track_inventory: firstVariant.inventory_management === 'shopify',

    // Variants
    has_variants: shopifyProduct.variants.length > 1,
    variants: variants,
    variant_options: variantOptions,

    // Organization
    tags: shopifyProduct.tags ? shopifyProduct.tags.split(',').map(t => t.trim()) : [],
    vendor: shopifyProduct.vendor || null,
    product_type: shopifyProduct.product_type || null,

    // SEO
    seo: {
      title: shopifyProduct.title,
      description: stripLiquidTags(shopifyProduct.body_html).substring(0, 160),
      slug: shopifyProduct.handle,
    },

    // Status
    status: shopifyProduct.status === 'active' ? 'active' : 'draft',

    // Shopify reference
    shopify_id: shopifyProduct.id,
    shopify_data: shopifyProduct, // Store full Shopify data for debugging
  };
}

/**
 * Import all products from Shopify
 */
export async function importProducts(
  client: ShopifyClient,
  options: ProductImportOptions
): Promise<ProductImportResult> {
  const { storeId, onProgress, onError } = options;
  let imported = 0;
  let failed = 0;
  const errors: Array<{ productId: string; error: string }> = [];

  try {
    // Iterate through paginated products
    for await (const productBatch of client.getProducts()) {
      // Process batch in parallel
      const results = await Promise.allSettled(
        productBatch.map(async (shopifyProduct) => {
          try {
            const webpilotProduct = transformProduct(shopifyProduct, storeId);

            // Upsert product (handles re-imports)
            const { error } = await supabase
              .from('products')
              .upsert(webpilotProduct, {
                onConflict: 'id',
              });

            if (error) throw error;

            imported++;
            if (onProgress) {
              onProgress(imported);
            }
          } catch (error) {
            failed++;
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push({
              productId: shopifyProduct.id,
              error: errorMessage,
            });
            if (onError) {
              onError(shopifyProduct.id, error instanceof Error ? error : new Error(String(error)));
            }
          }
        })
      );
    }

    return { imported, failed, errors };
  } catch (error) {
    throw new Error(
      `Product import failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Import single product (for testing or selective import)
 */
export async function importSingleProduct(
  shopifyProduct: ShopifyProduct,
  storeId: string
): Promise<void> {
  const webpilotProduct = transformProduct(shopifyProduct, storeId);

  const { error } = await supabase
    .from('products')
    .upsert(webpilotProduct, {
      onConflict: 'id',
    });

  if (error) {
    throw new Error(`Failed to import product ${shopifyProduct.id}: ${error.message}`);
  }
}

/**
 * Get product import count (for progress tracking)
 */
export async function getProductCount(client: ShopifyClient): Promise<number> {
  let count = 0;
  
  for await (const batch of client.getProducts()) {
    count += batch.length;
  }
  
  return count;
}
