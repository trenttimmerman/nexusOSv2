/**
 * Master Shopify Importer
 * Coordinates all import operations with progress tracking
 */

import { ShopifyClient } from './client';
import { importProducts } from './importers/productImporter';
import { importCollections } from './importers/collectionImporter';
import { importCustomers } from './importers/customerImporter';
import { importOrders } from './importers/orderImporter';
import { supabase } from '../supabaseClient';

export type ImportType = 'products' | 'collections' | 'customers' | 'orders' | 'all';

export interface MasterImportOptions {
  storeId: string;
  types: ImportType[];
  onProgress?: (progress: ImportProgress) => void;
  onComplete?: (result: ImportResult) => void;
  onError?: (error: Error) => void;
}

export interface ImportProgress {
  currentType: ImportType;
  currentCount: number;
  totalCount?: number;
  overallProgress: number; // 0-100
  message: string;
}

export interface ImportResult {
  products: { imported: number; failed: number };
  collections: { imported: number; failed: number };
  customers: { imported: number; failed: number };
  orders: { imported: number; failed: number };
  totalImported: number;
  totalFailed: number;
  duration: number; // milliseconds
}

/**
 * Create import job record
 */
async function createImportJob(
  storeId: string,
  importType: string
): Promise<string> {
  const { data, error } = await supabase
    .from('shopify_import_jobs')
    .insert({
      store_id: storeId,
      import_type: importType,
      status: 'pending',
      started_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create import job: ${error?.message}`);
  }

  return data.id;
}

/**
 * Update import job progress
 */
async function updateImportJob(
  jobId: string,
  updates: {
    status?: string;
    total_count?: number;
    imported_count?: number;
    failed_count?: number;
    errors?: any[];
    completed_at?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('shopify_import_jobs')
    .update(updates)
    .eq('id', jobId);

  if (error) {
    console.error('Failed to update import job:', error);
  }
}

/**
 * Run complete Shopify data import
 */
export async function runShopifyImport(
  client: ShopifyClient,
  options: MasterImportOptions
): Promise<ImportResult> {
  const { storeId, types, onProgress, onComplete, onError } = options;
  const startTime = Date.now();

  const result: ImportResult = {
    products: { imported: 0, failed: 0 },
    collections: { imported: 0, failed: 0 },
    customers: { imported: 0, failed: 0 },
    orders: { imported: 0, failed: 0 },
    totalImported: 0,
    totalFailed: 0,
    duration: 0,
  };

  try {
    // Determine what to import
    const importAll = types.includes('all');
    const importProducts = importAll || types.includes('products');
    const importCollections = importAll || types.includes('collections');
    const importCustomers = importAll || types.includes('customers');
    const importOrders = importAll || types.includes('orders');

    let currentProgress = 0;
    const totalSteps = [
      importProducts,
      importCollections,
      importCustomers,
      importOrders,
    ].filter(Boolean).length;

    // Import Products
    if (importProducts) {
      const jobId = await createImportJob(storeId, 'products');
      
      if (onProgress) {
        onProgress({
          currentType: 'products',
          currentCount: 0,
          overallProgress: (currentProgress / totalSteps) * 100,
          message: 'Importing products...',
        });
      }

      await updateImportJob(jobId, { status: 'in_progress' });

      const productResult = await importProducts(client, {
        storeId,
        onProgress: (count) => {
          if (onProgress) {
            onProgress({
              currentType: 'products',
              currentCount: count,
              overallProgress: ((currentProgress + 0.5) / totalSteps) * 100,
              message: `Importing products... (${count} imported)`,
            });
          }
        },
      });

      result.products = productResult;
      result.totalImported += productResult.imported;
      result.totalFailed += productResult.failed;

      await updateImportJob(jobId, {
        status: 'completed',
        imported_count: productResult.imported,
        failed_count: productResult.failed,
        errors: productResult.errors,
        completed_at: new Date().toISOString(),
      });

      currentProgress++;
    }

    // Import Collections
    if (importCollections) {
      const jobId = await createImportJob(storeId, 'collections');
      
      if (onProgress) {
        onProgress({
          currentType: 'collections',
          currentCount: 0,
          overallProgress: (currentProgress / totalSteps) * 100,
          message: 'Importing collections...',
        });
      }

      await updateImportJob(jobId, { status: 'in_progress' });

      const collectionResult = await importCollections(client, {
        storeId,
        onProgress: (count) => {
          if (onProgress) {
            onProgress({
              currentType: 'collections',
              currentCount: count,
              overallProgress: ((currentProgress + 0.5) / totalSteps) * 100,
              message: `Importing collections... (${count} imported)`,
            });
          }
        },
      });

      result.collections = collectionResult;
      result.totalImported += collectionResult.imported;
      result.totalFailed += collectionResult.failed;

      await updateImportJob(jobId, {
        status: 'completed',
        imported_count: collectionResult.imported,
        failed_count: collectionResult.failed,
        errors: collectionResult.errors,
        completed_at: new Date().toISOString(),
      });

      currentProgress++;
    }

    // Import Customers
    if (importCustomers) {
      const jobId = await createImportJob(storeId, 'customers');
      
      if (onProgress) {
        onProgress({
          currentType: 'customers',
          currentCount: 0,
          overallProgress: (currentProgress / totalSteps) * 100,
          message: 'Importing customers...',
        });
      }

      await updateImportJob(jobId, { status: 'in_progress' });

      const customerResult = await importCustomers(client, {
        storeId,
        onProgress: (count) => {
          if (onProgress) {
            onProgress({
              currentType: 'customers',
              currentCount: count,
              overallProgress: ((currentProgress + 0.5) / totalSteps) * 100,
              message: `Importing customers... (${count} imported)`,
            });
          }
        },
      });

      result.customers = customerResult;
      result.totalImported += customerResult.imported;
      result.totalFailed += customerResult.failed;

      await updateImportJob(jobId, {
        status: 'completed',
        imported_count: customerResult.imported,
        failed_count: customerResult.failed,
        errors: customerResult.errors,
        completed_at: new Date().toISOString(),
      });

      currentProgress++;
    }

    // Import Orders
    if (importOrders) {
      const jobId = await createImportJob(storeId, 'orders');
      
      if (onProgress) {
        onProgress({
          currentType: 'orders',
          currentCount: 0,
          overallProgress: (currentProgress / totalSteps) * 100,
          message: 'Importing orders...',
        });
      }

      await updateImportJob(jobId, { status: 'in_progress' });

      const orderResult = await importOrders(client, {
        storeId,
        onProgress: (count) => {
          if (onProgress) {
            onProgress({
              currentType: 'orders',
              currentCount: count,
              overallProgress: ((currentProgress + 0.5) / totalSteps) * 100,
              message: `Importing orders... (${count} imported)`,
            });
          }
        },
      });

      result.orders = orderResult;
      result.totalImported += orderResult.imported;
      result.totalFailed += orderResult.failed;

      await updateImportJob(jobId, {
        status: 'completed',
        imported_count: orderResult.imported,
        failed_count: orderResult.failed,
        errors: orderResult.errors,
        completed_at: new Date().toISOString(),
      });

      currentProgress++;
    }

    // Calculate duration
    result.duration = Date.now() - startTime;

    // Final progress
    if (onProgress) {
      onProgress({
        currentType: 'all',
        currentCount: result.totalImported,
        overallProgress: 100,
        message: 'Import complete!',
      });
    }

    if (onComplete) {
      onComplete(result);
    }

    return result;
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    throw error;
  }
}

/**
 * Verify import results against Shopify
 */
export async function verifyImport(
  client: ShopifyClient,
  storeId: string
): Promise<{
  products: { expected: number; actual: number; match: boolean };
  collections: { expected: number; actual: number; match: boolean };
  customers: { expected: number; actual: number; match: boolean };
  orders: { expected: number; actual: number; match: boolean };
}> {
  // Count products in WebPilot
  const { count: productCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', storeId);

  // Count collections in WebPilot
  const { count: collectionCount } = await supabase
    .from('collections')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', storeId);

  // Count customers in WebPilot
  const { count: customerCount } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', storeId);

  // Count orders in WebPilot
  const { count: orderCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', storeId);

  // Count from Shopify (rough estimate - iterates once)
  let shopifyProductCount = 0;
  let shopifyCollectionCount = 0;
  let shopifyCustomerCount = 0;
  let shopifyOrderCount = 0;

  for await (const batch of client.getProducts()) {
    shopifyProductCount += batch.length;
  }

  for await (const batch of client.getCollections()) {
    shopifyCollectionCount += batch.length;
  }

  for await (const batch of client.getCustomers()) {
    shopifyCustomerCount += batch.length;
  }

  for await (const batch of client.getOrders('any')) {
    shopifyOrderCount += batch.length;
  }

  return {
    products: {
      expected: shopifyProductCount,
      actual: productCount || 0,
      match: shopifyProductCount === (productCount || 0),
    },
    collections: {
      expected: shopifyCollectionCount,
      actual: collectionCount || 0,
      match: shopifyCollectionCount === (collectionCount || 0),
    },
    customers: {
      expected: shopifyCustomerCount,
      actual: customerCount || 0,
      match: shopifyCustomerCount === (customerCount || 0),
    },
    orders: {
      expected: shopifyOrderCount,
      actual: orderCount || 0,
      match: shopifyOrderCount === (orderCount || 0),
    },
  };
}
