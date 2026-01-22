/**
 * Shopify Asset Migrator
 * Downloads Shopify CDN assets and uploads to Supabase Storage
 * Rewrites URLs in products, pages, and blocks
 */

import { supabase } from '../supabaseClient';

export interface AssetMigrationProgress {
  total: number;
  downloaded: number;
  uploaded: number;
  current: string;
  errors: Array<{ url: string; error: string }>;
}

export interface AssetMigrationResult {
  urlMap: Map<string, string>; // Shopify URL → Supabase URL
  totalAssets: number;
  successCount: number;
  failureCount: number;
}

/**
 * Download and upload all product images from Shopify to Supabase
 */
export async function migrateProductImages(
  storeId: string,
  migrationId: string,
  onProgress?: (progress: AssetMigrationProgress) => void
): Promise<AssetMigrationResult> {
  const urlMap = new Map<string, string>();
  const errors: Array<{ url: string; error: string }> = [];

  // Get all products with Shopify images
  const { data: products, error: fetchError } = await supabase
    .from('products')
    .select('id, image, images, shopify_id')
    .eq('store_id', storeId)
    .not('shopify_id', 'is', null);

  if (fetchError || !products) {
    throw new Error(`Failed to fetch products: ${fetchError?.message}`);
  }

  // Collect all unique image URLs
  const allImageUrls = new Set<string>();
  products.forEach(product => {
    if (product.image) allImageUrls.add(product.image);
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: any) => {
        if (img.url) allImageUrls.add(img.url);
      });
    }
  });

  const totalAssets = allImageUrls.size;
  let processed = 0;

  // Download and upload each image
  for (const shopifyUrl of allImageUrls) {
    onProgress?.({
      total: totalAssets,
      downloaded: processed,
      uploaded: urlMap.size,
      current: `Migrating: ${shopifyUrl.split('/').pop()}`,
      errors,
    });

    try {
      // Download from Shopify CDN
      const response = await fetch(shopifyUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const blob = await response.blob();

      // Generate storage path
      const filename = shopifyUrl.split('/').pop() || `image_${Date.now()}.jpg`;
      const path = `${storeId}/${migrationId}/product-images/${filename}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('theme-assets')
        .upload(path, blob, {
          cacheControl: '31536000', // 1 year
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('theme-assets')
        .getPublicUrl(path);

      if (urlData.publicUrl) {
        urlMap.set(shopifyUrl, urlData.publicUrl);
      }
    } catch (error: any) {
      errors.push({
        url: shopifyUrl,
        error: error.message || String(error),
      });
    }

    processed++;
  }

  // Update product records with new URLs
  for (const product of products) {
    try {
      let updated = false;
      const updates: any = {};

      // Update main image
      if (product.image && urlMap.has(product.image)) {
        updates.image = urlMap.get(product.image);
        updated = true;
      }

      // Update images array
      if (product.images && Array.isArray(product.images)) {
        const updatedImages = product.images.map((img: any) => {
          if (img.url && urlMap.has(img.url)) {
            return { ...img, url: urlMap.get(img.url) };
          }
          return img;
        });
        updates.images = updatedImages;
        updated = true;
      }

      // Apply updates
      if (updated) {
        await supabase
          .from('products')
          .update(updates)
          .eq('id', product.id);
      }
    } catch (error) {
      console.error(`Failed to update product ${product.id}:`, error);
    }
  }

  onProgress?.({
    total: totalAssets,
    downloaded: totalAssets,
    uploaded: urlMap.size,
    current: 'Migration complete',
    errors,
  });

  return {
    urlMap,
    totalAssets,
    successCount: urlMap.size,
    failureCount: errors.length,
  };
}

/**
 * Rewrite asset URLs in all page blocks
 */
export async function rewritePageAssetUrls(
  storeId: string,
  urlMap: Map<string, string>,
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  // Get all pages for this store
  const { data: pages, error: fetchError } = await supabase
    .from('pages')
    .select('id, blocks')
    .eq('store_id', storeId);

  if (fetchError || !pages) {
    throw new Error(`Failed to fetch pages: ${fetchError?.message}`);
  }

  let updated = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    onProgress?.(i + 1, pages.length);

    try {
      // Convert blocks to JSON string
      let blocksJson = JSON.stringify(page.blocks);
      let modified = false;

      // Replace each Shopify URL with Supabase URL
      urlMap.forEach((newUrl, oldUrl) => {
        if (blocksJson.includes(oldUrl)) {
          blocksJson = blocksJson.replaceAll(oldUrl, newUrl);
          modified = true;
        }
      });

      // Update if modified
      if (modified) {
        await supabase
          .from('pages')
          .update({ blocks: JSON.parse(blocksJson) })
          .eq('id', page.id);
        updated++;
      }
    } catch (error) {
      console.error(`Failed to rewrite URLs for page ${page.id}:`, error);
    }
  }

  return updated;
}

/**
 * Complete asset migration workflow
 */
export async function runAssetMigration(
  storeId: string,
  migrationId: string,
  onProgress?: (progress: {
    phase: 'products' | 'pages' | 'complete';
    current: number;
    total: number;
    message: string;
  }) => void
): Promise<{
  productsUpdated: number;
  pagesUpdated: number;
  assetsTotal: number;
  assetsSuccess: number;
  assetsFailed: number;
}> {
  // Phase 1: Migrate product images
  onProgress?.({
    phase: 'products',
    current: 0,
    total: 100,
    message: 'Migrating product images from Shopify CDN...',
  });

  const productResult = await migrateProductImages(
    storeId,
    migrationId,
    (assetProgress) => {
      onProgress?.({
        phase: 'products',
        current: assetProgress.uploaded,
        total: assetProgress.total,
        message: assetProgress.current,
      });
    }
  );

  // Phase 2: Rewrite URLs in pages
  onProgress?.({
    phase: 'pages',
    current: 0,
    total: 100,
    message: 'Rewriting asset URLs in pages...',
  });

  const pagesUpdated = await rewritePageAssetUrls(
    storeId,
    productResult.urlMap,
    (current, total) => {
      onProgress?.({
        phase: 'pages',
        current,
        total,
        message: `Updating page ${current}/${total}`,
      });
    }
  );

  // Complete
  onProgress?.({
    phase: 'complete',
    current: 100,
    total: 100,
    message: 'Asset migration complete',
  });

  return {
    productsUpdated: productResult.successCount,
    pagesUpdated,
    assetsTotal: productResult.totalAssets,
    assetsSuccess: productResult.successCount,
    assetsFailed: productResult.failureCount,
  };
}

/**
 * Download and migrate a single asset (for selective migration)
 */
export async function migrateSingleAsset(
  shopifyUrl: string,
  storeId: string,
  migrationId: string,
  folder: string = 'assets'
): Promise<string | null> {
  try {
    // Download from Shopify
    const response = await fetch(shopifyUrl);
    if (!response.ok) return null;

    const blob = await response.blob();

    // Upload to Supabase
    const filename = shopifyUrl.split('/').pop() || `asset_${Date.now()}`;
    const path = `${storeId}/${migrationId}/${folder}/${filename}`;

    const { error } = await supabase.storage
      .from('theme-assets')
      .upload(path, blob, { upsert: true });

    if (error) return null;

    // Get public URL
    const { data } = supabase.storage
      .from('theme-assets')
      .getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error('Asset migration failed:', error);
    return null;
  }
}
