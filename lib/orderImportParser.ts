import Papa from 'papaparse';

export interface ParsedCSV {
  headers: string[];
  data: Record<string, any>[];
  rowCount: number;
}

export interface ShopifyOrderRow {
  'Name'?: string; // Order number
  'Email'?: string;
  'Financial Status'?: string;
  'Paid at'?: string;
  'Fulfillment Status'?: string;
  'Fulfilled at'?: string;
  'Accepts Marketing'?: string;
  'Currency'?: string;
  'Subtotal'?: string;
  'Shipping'?: string;
  'Taxes'?: string;
  'Total'?: string;
  'Discount Code'?: string;
  'Discount Amount'?: string;
  'Shipping Method'?: string;
  'Created at'?: string;
  'Lineitem quantity'?: string;
  'Lineitem name'?: string;
  'Lineitem price'?: string;
  'Lineitem sku'?: string;
  'Billing Name'?: string;
  'Billing Street'?: string;
  'Billing Address1'?: string;
  'Billing Address2'?: string;
  'Billing Company'?: string;
  'Billing City'?: string;
  'Billing Zip'?: string;
  'Billing Province'?: string;
  'Billing Country'?: string;
  'Billing Phone'?: string;
  'Shipping Name'?: string;
  'Shipping Street'?: string;
  'Shipping Address1'?: string;
  'Shipping Address2'?: string;
  'Shipping Company'?: string;
  'Shipping City'?: string;
  'Shipping Zip'?: string;
  'Shipping Province'?: string;
  'Shipping Country'?: string;
  'Shipping Phone'?: string;
  'Notes'?: string;
  'Note Attributes'?: string;
  'Cancelled at'?: string;
  'Payment Method'?: string;
  'Payment Reference'?: string;
  'Refunded Amount'?: string;
  'Vendor'?: string;
  'Tags'?: string;
  [key: string]: any;
}

export function parseOrderCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
          return;
        }

        resolve({
          headers: results.meta.fields || [],
          data: results.data as Record<string, any>[],
          rowCount: results.data.length,
        });
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function detectPlatform(headers: string[]): 'shopify' | 'woocommerce' | 'square' | 'unknown' {
  const headerSet = new Set(headers.map(h => h.toLowerCase().trim()));
  
  // Shopify detection
  if (
    headerSet.has('name') &&
    headerSet.has('financial status') &&
    headerSet.has('lineitem quantity')
  ) {
    return 'shopify';
  }
  
  // WooCommerce detection
  if (
    headerSet.has('order_id') ||
    headerSet.has('order_number')
  ) {
    return 'woocommerce';
  }
  
  // Square detection
  if (headerSet.has('payment id')) {
    return 'square';
  }
  
  return 'unknown';
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: (value: any) => any;
}

export const SHOPIFY_ORDER_MAPPING: FieldMapping[] = [
  { sourceField: 'Name', targetField: 'order_number' },
  { sourceField: 'Email', targetField: 'customer_email' },
  { sourceField: 'Financial Status', targetField: 'payment_status' },
  { sourceField: 'Paid at', targetField: 'paid_at' },
  { sourceField: 'Fulfillment Status', targetField: 'fulfillment_status' },
  { sourceField: 'Fulfilled at', targetField: 'fulfilled_at' },
  { sourceField: 'Currency', targetField: 'currency' },
  { sourceField: 'Total', targetField: 'total_amount' },
  { sourceField: 'Subtotal', targetField: 'subtotal' },
  { sourceField: 'Shipping', targetField: 'shipping_cost' },
  { sourceField: 'Taxes', targetField: 'tax_amount' },
  { sourceField: 'Created at', targetField: 'created_at' },
  { sourceField: 'Cancelled at', targetField: 'cancelled_at' },
  { sourceField: 'Notes', targetField: 'notes' },
  { sourceField: 'Tags', targetField: 'tags' },
  
  // Line items
  { sourceField: 'Lineitem quantity', targetField: 'item_quantity' },
  { sourceField: 'Lineitem name', targetField: 'item_name' },
  { sourceField: 'Lineitem price', targetField: 'item_price' },
  { sourceField: 'Lineitem sku', targetField: 'item_sku' },
  
  // Billing
  { sourceField: 'Billing Name', targetField: 'billing_name' },
  { sourceField: 'Billing Address1', targetField: 'billing_address1' },
  { sourceField: 'Billing Address2', targetField: 'billing_address2' },
  { sourceField: 'Billing City', targetField: 'billing_city' },
  { sourceField: 'Billing Province', targetField: 'billing_province' },
  { sourceField: 'Billing Zip', targetField: 'billing_zip' },
  { sourceField: 'Billing Country', targetField: 'billing_country' },
  { sourceField: 'Billing Phone', targetField: 'billing_phone' },
  
  // Shipping
  { sourceField: 'Shipping Name', targetField: 'shipping_name' },
  { sourceField: 'Shipping Address1', targetField: 'shipping_address1' },
  { sourceField: 'Shipping Address2', targetField: 'shipping_address2' },
  { sourceField: 'Shipping City', targetField: 'shipping_city' },
  { sourceField: 'Shipping Province', targetField: 'shipping_province' },
  { sourceField: 'Shipping Zip', targetField: 'shipping_zip' },
  { sourceField: 'Shipping Country', targetField: 'shipping_country' },
  { sourceField: 'Shipping Phone', targetField: 'shipping_phone' },
];

export function suggestMapping(headers: string[]): Map<string, string> {
  const suggestions = new Map<string, string>();
  
  const fieldSuggestions: Record<string, string[]> = {
    'order_number': ['name', 'order number', 'order #', 'order_number', 'order_id', 'number'],
    'customer_email': ['email', 'customer email', 'customer_email', 'billing email'],
    'total_amount': ['total', 'order total', 'total_amount', 'grand total', 'amount'],
    'currency': ['currency', 'curr'],
    'payment_status': ['financial status', 'payment status', 'payment_status', 'paid'],
    'fulfillment_status': ['fulfillment status', 'fulfillment_status', 'status', 'order status'],
    'created_at': ['created at', 'created_at', 'date', 'order date', 'purchase date'],
    'paid_at': ['paid at', 'paid_at', 'payment date'],
    'fulfilled_at': ['fulfilled at', 'fulfilled_at', 'ship date', 'shipped at'],
    'cancelled_at': ['cancelled at', 'cancelled_at', 'canceled at'],
    'notes': ['notes', 'note', 'customer note', 'order note'],
    'tags': ['tags', 'labels'],
    
    // Line items
    'item_quantity': ['lineitem quantity', 'quantity', 'qty', 'item quantity'],
    'item_name': ['lineitem name', 'product name', 'item name', 'product'],
    'item_price': ['lineitem price', 'price', 'item price', 'unit price'],
    'item_sku': ['lineitem sku', 'sku', 'item sku', 'product sku'],
    
    // Billing
    'billing_name': ['billing name', 'billing_name'],
    'billing_address1': ['billing address1', 'billing address', 'billing_address1', 'billing street'],
    'billing_address2': ['billing address2', 'billing_address2'],
    'billing_city': ['billing city', 'billing_city'],
    'billing_province': ['billing province', 'billing state', 'billing_province', 'billing_state'],
    'billing_zip': ['billing zip', 'billing postal', 'billing_zip', 'billing_postal_code'],
    'billing_country': ['billing country', 'billing_country'],
    'billing_phone': ['billing phone', 'billing_phone'],
    
    // Shipping
    'shipping_name': ['shipping name', 'shipping_name'],
    'shipping_address1': ['shipping address1', 'shipping address', 'shipping_address1', 'shipping street'],
    'shipping_address2': ['shipping address2', 'shipping_address2'],
    'shipping_city': ['shipping city', 'shipping_city'],
    'shipping_province': ['shipping province', 'shipping state', 'shipping_province', 'shipping_state'],
    'shipping_zip': ['shipping zip', 'shipping postal', 'shipping_zip', 'shipping_postal_code'],
    'shipping_country': ['shipping country', 'shipping_country'],
    'shipping_phone': ['shipping phone', 'shipping_phone'],
  };

  for (const header of headers) {
    const normalized = header.toLowerCase().trim();
    
    for (const [targetField, patterns] of Object.entries(fieldSuggestions)) {
      if (patterns.includes(normalized)) {
        suggestions.set(header, targetField);
        break;
      }
    }
  }

  return suggestions;
}
