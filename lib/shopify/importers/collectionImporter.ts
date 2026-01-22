/**
 * Shopify Collection Importer
 * Transforms Shopify collections (smart + manual) to WebPilot format
 */

import { ShopifyClient, ShopifyCollection, ShopifyCollectionRule } from '../client';
import { supabase } from '../../supabaseClient';

export interface CollectionImportOptions {
  storeId: string;
  onProgress?: (imported: number, total?: number) => void;
  onError?: (collectionId: string, error: Error) => void;
}

export interface CollectionImportResult {
  imported: number;
  failed: number;
  errors: Array<{ collectionId: string; error: string }>;
}

/**
 * Transform Shopify collection rules to WebPilot format
 */
function transformCollectionRules(shopifyRules: ShopifyCollectionRule[]): any {
  if (!shopifyRules || shopifyRules.length === 0) return null;

  // WebPilot collection rules format
  const rules: any = {
    type: 'auto',
    conditions: [],
  };

  shopifyRules.forEach(rule => {
    // Map Shopify rule columns to WebPilot fields
    const fieldMap: Record<string, string> = {
      'title': 'name',
      'type': 'product_type',
      'vendor': 'vendor',
      'tag': 'tags',
      'variant_price': 'price',
      'variant_compare_at_price': 'compare_at_price',
      'variant_inventory': 'stock',
    };

    const field = fieldMap[rule.column] || rule.column;

    // Map Shopify relations to WebPilot operators
    const operatorMap: Record<string, string> = {
      'equals': 'equals',
      'not_equals': 'not_equals',
      'contains': 'contains',
      'not_contains': 'not_contains',
      'starts_with': 'starts_with',
      'ends_with': 'ends_with',
      'greater_than': 'greater_than',
      'less_than': 'less_than',
    };

    const operator = operatorMap[rule.relation] || rule.relation;

    rules.conditions.push({
      field,
      operator,
      value: rule.condition,
    });
  });

  return rules;
}

/**
 * Transform Shopify collection to WebPilot format
 */
async function transformCollection(
  shopifyCollection: ShopifyCollection,
  storeId: string,
  client: ShopifyClient
): Promise<any> {
  const isManual = !shopifyCollection.rules || shopifyCollection.rules.length === 0;

  let productIds: string[] | null = null;
  let rules: any = null;

  if (isManual) {
    // Get manual product assignments
    const shopifyProductIds = await client.getCollectionProducts(shopifyCollection.id);
    productIds = shopifyProductIds.map(id => `shopify_${id}`);
  } else {
    // Transform smart collection rules
    rules = transformCollectionRules(shopifyCollection.rules);
  }

  return {
    id: `shopify_${shopifyCollection.id}`,
    store_id: storeId,
    name: shopifyCollection.title,
    description: shopifyCollection.body_html || null,

    // Collection type
    type: isManual ? 'manual' : 'auto',

    // Manual collection product assignments
    product_ids: productIds,

    // Smart collection rules
    rules: rules,

    // Sort order
    sort_order: shopifyCollection.sort_order || 'manual',

    // SEO
    seo: {
      title: shopifyCollection.title,
      description: shopifyCollection.body_html?.substring(0, 160) || '',
      slug: shopifyCollection.handle,
    },

    // Shopify reference
    shopify_id: shopifyCollection.id,
    shopify_data: shopifyCollection,
  };
}

/**
 * Import all collections from Shopify
 */
export async function importCollections(
  client: ShopifyClient,
  options: CollectionImportOptions
): Promise<CollectionImportResult> {
  const { storeId, onProgress, onError } = options;
  let imported = 0;
  let failed = 0;
  const errors: Array<{ collectionId: string; error: string }> = [];

  try {
    // Iterate through paginated collections (both custom and smart)
    for await (const collectionBatch of client.getCollections()) {
      // Process batch in parallel
      await Promise.allSettled(
        collectionBatch.map(async (shopifyCollection) => {
          try {
            const webpilotCollection = await transformCollection(
              shopifyCollection,
              storeId,
              client
            );

            // Upsert collection
            const { error } = await supabase
              .from('collections')
              .upsert(webpilotCollection, {
                onConflict: 'id',
              });

            if (error) throw error;

            // If manual collection, also update collection_products junction table
            if (webpilotCollection.type === 'manual' && webpilotCollection.product_ids) {
              // First, delete existing relationships
              await supabase
                .from('collection_products')
                .delete()
                .eq('collection_id', webpilotCollection.id);

              // Then insert new relationships
              const relationships = webpilotCollection.product_ids.map(
                (productId: string, index: number) => ({
                  collection_id: webpilotCollection.id,
                  product_id: productId,
                  display_order: index,
                })
              );

              if (relationships.length > 0) {
                await supabase.from('collection_products').insert(relationships);
              }
            }

            imported++;
            if (onProgress) {
              onProgress(imported);
            }
          } catch (error) {
            failed++;
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push({
              collectionId: shopifyCollection.id,
              error: errorMessage,
            });
            if (onError) {
              onError(
                shopifyCollection.id,
                error instanceof Error ? error : new Error(String(error))
              );
            }
          }
        })
      );
    }

    return { imported, failed, errors };
  } catch (error) {
    throw new Error(
      `Collection import failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get collection count (for progress tracking)
 */
export async function getCollectionCount(client: ShopifyClient): Promise<number> {
  let count = 0;

  for await (const batch of client.getCollections()) {
    count += batch.length;
  }

  return count;
}
