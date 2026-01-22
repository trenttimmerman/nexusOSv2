/**
 * Shopify Customer Importer
 * Transforms Shopify customers to WebPilot format with addresses
 */

import { ShopifyClient, ShopifyCustomer } from '../client';
import { supabase } from '../../supabaseClient';

export interface CustomerImportOptions {
  storeId: string;
  onProgress?: (imported: number, total?: number) => void;
  onError?: (customerId: string, error: Error) => void;
}

export interface CustomerImportResult {
  imported: number;
  failed: number;
  errors: Array<{ customerId: string; error: string }>;
}

/**
 * Transform Shopify customer to WebPilot format
 */
function transformCustomer(shopifyCustomer: ShopifyCustomer, storeId: string): any {
  return {
    id: `shopify_${shopifyCustomer.id}`,
    store_id: storeId,
    email: shopifyCustomer.email,
    first_name: shopifyCustomer.first_name || null,
    last_name: shopifyCustomer.last_name || null,
    phone: shopifyCustomer.phone || null,

    // Organization fields
    client_type: 'individual', // Shopify doesn't distinguish B2B by default

    // Tax settings
    tax_exempt: shopifyCustomer.tax_exempt || false,

    // Notes and tags
    notes: shopifyCustomer.note || null,
    tags: shopifyCustomer.tags ? shopifyCustomer.tags.split(',').map(t => t.trim()) : [],

    // Marketing
    email_marketing: shopifyCustomer.accepts_marketing || false,

    // Shopify reference
    shopify_id: shopifyCustomer.id,
    shopify_data: shopifyCustomer,
  };
}

/**
 * Transform Shopify address to WebPilot format
 */
function transformAddress(shopifyAddress: any, customerId: string): any {
  return {
    customer_id: customerId,
    first_name: shopifyAddress.first_name || null,
    last_name: shopifyAddress.last_name || null,
    address_line1: shopifyAddress.address1 || null,
    address_line2: shopifyAddress.address2 || null,
    city: shopifyAddress.city || null,
    province: shopifyAddress.province || null,
    postal_code: shopifyAddress.zip || null,
    country: shopifyAddress.country || null,
    phone: shopifyAddress.phone || null,
    is_default: shopifyAddress.default || false,
    shopify_id: shopifyAddress.id,
  };
}

/**
 * Import all customers from Shopify
 */
export async function importCustomers(
  client: ShopifyClient,
  options: CustomerImportOptions
): Promise<CustomerImportResult> {
  const { storeId, onProgress, onError } = options;
  let imported = 0;
  let failed = 0;
  const errors: Array<{ customerId: string; error: string }> = [];

  try {
    // Iterate through paginated customers
    for await (const customerBatch of client.getCustomers()) {
      // Process batch sequentially to maintain data integrity
      for (const shopifyCustomer of customerBatch) {
        try {
          const webpilotCustomer = transformCustomer(shopifyCustomer, storeId);

          // Upsert customer
          const { error: customerError } = await supabase
            .from('customers')
            .upsert(webpilotCustomer, {
              onConflict: 'id',
            });

          if (customerError) throw customerError;

          // Import addresses
          if (shopifyCustomer.addresses && shopifyCustomer.addresses.length > 0) {
            // Delete existing addresses for this customer
            await supabase
              .from('customer_addresses')
              .delete()
              .eq('customer_id', webpilotCustomer.id);

            // Insert new addresses
            const addresses = shopifyCustomer.addresses.map(addr =>
              transformAddress(addr, webpilotCustomer.id)
            );

            const { error: addressError } = await supabase
              .from('customer_addresses')
              .insert(addresses);

            if (addressError) {
              console.error(
                `Failed to import addresses for customer ${shopifyCustomer.id}:`,
                addressError
              );
              // Don't fail the whole import for address errors
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
            customerId: shopifyCustomer.id,
            error: errorMessage,
          });
          if (onError) {
            onError(
              shopifyCustomer.id,
              error instanceof Error ? error : new Error(String(error))
            );
          }
        }
      }
    }

    return { imported, failed, errors };
  } catch (error) {
    throw new Error(
      `Customer import failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get customer count (for progress tracking)
 */
export async function getCustomerCount(client: ShopifyClient): Promise<number> {
  let count = 0;

  for await (const batch of client.getCustomers()) {
    count += batch.length;
  }

  return count;
}
