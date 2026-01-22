/**
 * Shopify Order Importer
 * Transforms Shopify orders with line items and refunds to WebPilot format
 */

import { ShopifyClient, ShopifyOrder } from '../client';
import { supabase } from '../../supabaseClient';

export interface OrderImportOptions {
  storeId: string;
  onProgress?: (imported: number, total?: number) => void;
  onError?: (orderId: string, error: Error) => void;
}

export interface OrderImportResult {
  imported: number;
  failed: number;
  errors: Array<{ orderId: string; error: string }>;
}

/**
 * Transform Shopify order status to WebPilot status
 */
function transformOrderStatus(fulfillmentStatus: string | null): string {
  if (!fulfillmentStatus) return 'pending';
  
  const statusMap: Record<string, string> = {
    'fulfilled': 'fulfilled',
    'partial': 'pending',
    'unfulfilled': 'pending',
    'restocked': 'cancelled',
  };

  return statusMap[fulfillmentStatus] || 'pending';
}

/**
 * Transform Shopify financial status to WebPilot format
 */
function transformFinancialStatus(financialStatus: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'pending',
    'authorized': 'authorized',
    'paid': 'paid',
    'partially_paid': 'paid',
    'refunded': 'refunded',
    'voided': 'voided',
    'partially_refunded': 'partially_refunded',
  };

  return statusMap[financialStatus] || 'pending';
}

/**
 * Transform Shopify order to WebPilot format
 */
function transformOrder(shopifyOrder: ShopifyOrder, storeId: string): any {
  const shippingAddress = shopifyOrder.shipping_address;

  return {
    id: `shopify_${shopifyOrder.id}`,
    store_id: storeId,
    customer_id: shopifyOrder.customer ? `shopify_${shopifyOrder.customer.id}` : null,
    customer_email: shopifyOrder.email,
    customer_phone: shippingAddress?.phone || null,

    // Financial breakdown
    subtotal: parseFloat(shopifyOrder.subtotal_price) || 0,
    tax_amount: parseFloat(shopifyOrder.total_tax) || 0,
    shipping_amount: 0, // Shopify doesn't expose this directly in basic API
    discount_amount: parseFloat(shopifyOrder.total_discounts) || 0,
    total_amount: parseFloat(shopifyOrder.total_price) || 0,

    // Discount tracking
    discount_code: shopifyOrder.discount_codes[0]?.code || null,

    // Currency
    currency: 'USD', // Would need to get from shop settings

    // Status
    status: transformOrderStatus(shopifyOrder.fulfillment_status),
    financial_status: transformFinancialStatus(shopifyOrder.financial_status),
    payment_status: shopifyOrder.financial_status === 'paid' ? 'paid' : 'unpaid',

    // Shipping address
    shipping_address_line1: shippingAddress?.address1 || null,
    shipping_address_line2: shippingAddress?.address2 || null,
    shipping_city: shippingAddress?.city || null,
    shipping_state: shippingAddress?.province || null,
    shipping_postal_code: shippingAddress?.zip || null,
    shipping_country: shippingAddress?.country || null,

    // Notes
    customer_note: shopifyOrder.note || null,

    // Timestamps
    created_at: shopifyOrder.created_at,

    // Shopify reference
    shopify_id: shopifyOrder.id,
    shopify_order_number: shopifyOrder.order_number?.toString(),
    shopify_data: shopifyOrder,
  };
}

/**
 * Transform Shopify line item to WebPilot format
 */
function transformLineItem(lineItem: any, orderId: string): any {
  return {
    order_id: orderId,
    product_id: lineItem.product_id ? `shopify_${lineItem.product_id}` : null,
    variant_id: lineItem.variant_id ? `shopify_variant_${lineItem.variant_id}` : null,
    variant_title: lineItem.variant_title || null,
    quantity: lineItem.quantity,
    price_at_purchase: parseFloat(lineItem.price) || 0,
    shopify_id: lineItem.id,
  };
}

/**
 * Transform Shopify refund to WebPilot format
 */
function transformRefund(refund: any, orderId: string): any {
  // Calculate total refund amount from transactions
  const totalAmount = refund.transactions.reduce(
    (sum: number, transaction: any) => sum + parseFloat(transaction.amount || '0'),
    0
  );

  return {
    order_id: orderId,
    amount: totalAmount,
    reason: refund.note || null,
    restock: false, // Shopify doesn't clearly expose this
    shopify_id: refund.id,
    created_at: refund.created_at,
  };
}

/**
 * Import all orders from Shopify
 */
export async function importOrders(
  client: ShopifyClient,
  options: OrderImportOptions
): Promise<OrderImportResult> {
  const { storeId, onProgress, onError } = options;
  let imported = 0;
  let failed = 0;
  const errors: Array<{ orderId: string; error: string }> = [];

  try {
    // Iterate through paginated orders (all statuses)
    for await (const orderBatch of client.getOrders('any')) {
      // Process batch sequentially to maintain data integrity
      for (const shopifyOrder of orderBatch) {
        try {
          const webpilotOrder = transformOrder(shopifyOrder, storeId);

          // Upsert order
          const { error: orderError } = await supabase
            .from('orders')
            .upsert(webpilotOrder, {
              onConflict: 'id',
            });

          if (orderError) throw orderError;

          // Import line items
          if (shopifyOrder.line_items && shopifyOrder.line_items.length > 0) {
            // Delete existing line items
            await supabase
              .from('order_items')
              .delete()
              .eq('order_id', webpilotOrder.id);

            // Insert new line items
            const lineItems = shopifyOrder.line_items.map(item =>
              transformLineItem(item, webpilotOrder.id)
            );

            const { error: lineItemError } = await supabase
              .from('order_items')
              .insert(lineItems);

            if (lineItemError) throw lineItemError;
          }

          // Import refunds (if any)
          if (shopifyOrder.refunds && shopifyOrder.refunds.length > 0) {
            // Delete existing refunds
            await supabase
              .from('refunds')
              .delete()
              .eq('order_id', webpilotOrder.id);

            // Insert new refunds
            const refunds = shopifyOrder.refunds.map(refund =>
              transformRefund(refund, webpilotOrder.id)
            );

            const { error: refundError } = await supabase
              .from('refunds')
              .insert(refunds);

            if (refundError) {
              console.error(
                `Failed to import refunds for order ${shopifyOrder.id}:`,
                refundError
              );
              // Don't fail the whole import for refund errors
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
            orderId: shopifyOrder.id,
            error: errorMessage,
          });
          if (onError) {
            onError(
              shopifyOrder.id,
              error instanceof Error ? error : new Error(String(error))
            );
          }
        }
      }
    }

    return { imported, failed, errors };
  } catch (error) {
    throw new Error(
      `Order import failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get order count (for progress tracking)
 */
export async function getOrderCount(client: ShopifyClient): Promise<number> {
  let count = 0;

  for await (const batch of client.getOrders('any')) {
    count += batch.length;
  }

  return count;
}
