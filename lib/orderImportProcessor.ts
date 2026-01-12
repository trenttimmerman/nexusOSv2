export interface ImportRow {
  // Order fields
  order_number?: string;
  customer_email?: string;
  total_amount: string | number;
  currency?: string;
  payment_status?: string;
  fulfillment_status?: string;
  created_at?: string;
  paid_at?: string;
  fulfilled_at?: string;
  cancelled_at?: string;
  notes?: string;
  tags?: string;
  
  // Line item fields (for single item per row)
  item_quantity?: string | number;
  item_name?: string;
  item_price?: string | number;
  item_sku?: string;
  
  // Billing address
  billing_name?: string;
  billing_address1?: string;
  billing_address2?: string;
  billing_city?: string;
  billing_province?: string;
  billing_zip?: string;
  billing_country?: string;
  billing_phone?: string;
  
  // Shipping address
  shipping_name?: string;
  shipping_address1?: string;
  shipping_address2?: string;
  shipping_city?: string;
  shipping_province?: string;
  shipping_zip?: string;
  shipping_country?: string;
  shipping_phone?: string;
}

export interface ImportResult {
  success: boolean;
  orderId?: string;
  action: 'created' | 'updated' | 'skipped' | 'error';
  itemsCreated?: number;
  error?: string;
}

export interface ImportProgress {
  current: number;
  total: number;
  ordersCreated: number;
  ordersUpdated: number;
  ordersSkipped: number;
  itemsCreated: number;
  errors: Array<{ row: number; error: string; data?: any }>;
}

export async function processImportRow(
  row: ImportRow,
  storeId: string,
  options: {
    duplicateStrategy: 'skip' | 'update' | 'merge';
    createCustomers: boolean;
    matchProducts: boolean;
  },
  supabase: any
): Promise<ImportResult> {
  try {
    const totalAmount = parseFloat(row.total_amount.toString());
    const currency = row.currency || 'USD';
    
    // Normalize payment and fulfillment status
    const paymentStatus = normalizePaymentStatus(row.payment_status);
    const orderStatus = normalizeOrderStatus(row.fulfillment_status, paymentStatus);
    
    // Check for existing order by order number
    let existingOrder = null;
    if (row.order_number) {
      const { data } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('store_id', storeId)
        .eq('order_number', row.order_number)
        .maybeSingle();
      
      existingOrder = data;
    }
    
    // Handle duplicates
    if (existingOrder) {
      if (options.duplicateStrategy === 'skip') {
        return {
          success: true,
          orderId: existingOrder.id,
          action: 'skipped',
        };
      }
      // For update/merge, we would update the order
      // For now, skip to avoid data conflicts
      return {
        success: true,
        orderId: existingOrder.id,
        action: 'skipped',
      };
    }
    
    // Find or create customer
    let customerId = null;
    if (row.customer_email && options.createCustomers) {
      customerId = await findOrCreateCustomer(row, storeId, supabase);
    }
    
    // Create order
    const orderData: any = {
      store_id: storeId,
      customer_id: customerId,
      total_amount: totalAmount,
      currency: currency,
      status: orderStatus,
      payment_status: paymentStatus,
      order_number: row.order_number || undefined,
      notes: row.notes || undefined,
      tags: row.tags || undefined,
    };
    
    if (row.created_at) {
      orderData.created_at = parseDate(row.created_at);
    }
    
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (orderError) {
      throw new Error(`Order creation error: ${orderError.message}`);
    }
    
    let itemsCreated = 0;
    
    // Create order items
    if (row.item_name || row.item_sku) {
      const quantity = parseInt(row.item_quantity?.toString() || '1');
      const price = parseFloat(row.item_price?.toString() || '0');
      
      // Try to match product by SKU
      let productId = null;
      if (row.item_sku && options.matchProducts) {
        const { data: product } = await supabase
          .from('products')
          .select('id')
          .eq('store_id', storeId)
          .eq('sku', row.item_sku)
          .maybeSingle();
        
        productId = product?.id || null;
      }
      
      const itemData: any = {
        order_id: newOrder.id,
        product_id: productId,
        quantity: quantity,
        price_at_purchase: price,
        product_name: row.item_name || undefined,
        sku: row.item_sku || undefined,
      };
      
      const { error: itemError } = await supabase
        .from('order_items')
        .insert(itemData);
      
      if (!itemError) {
        itemsCreated = 1;
      }
    }
    
    // Store addresses if provided
    if (row.billing_address1 || row.shipping_address1) {
      await storeOrderAddresses(newOrder.id, row, supabase);
    }
    
    return {
      success: true,
      orderId: newOrder.id,
      action: 'created',
      itemsCreated,
    };
  } catch (error: any) {
    return {
      success: false,
      action: 'error',
      error: error.message || 'Unknown error',
    };
  }
}

async function findOrCreateCustomer(row: ImportRow, storeId: string, supabase: any): Promise<string | null> {
  if (!row.customer_email) return null;
  
  // Try to find existing customer
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('store_id', storeId)
    .eq('email', row.customer_email.toLowerCase().trim())
    .maybeSingle();
  
  if (existing) {
    return existing.id;
  }
  
  // Create new customer
  const names = (row.billing_name || row.shipping_name || '').split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';
  
  const { data: newCustomer, error } = await supabase
    .from('customers')
    .insert({
      store_id: storeId,
      email: row.customer_email.toLowerCase().trim(),
      first_name: firstName,
      last_name: lastName,
      phone: row.billing_phone || row.shipping_phone || null,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating customer:', error);
    return null;
  }
  
  return newCustomer.id;
}

async function storeOrderAddresses(orderId: string, row: ImportRow, supabase: any): Promise<void> {
  const addressData: any = {
    order_id: orderId,
    billing_name: row.billing_name || null,
    billing_address1: row.billing_address1 || null,
    billing_address2: row.billing_address2 || null,
    billing_city: row.billing_city || null,
    billing_province: row.billing_province || null,
    billing_zip: row.billing_zip || null,
    billing_country: row.billing_country || null,
    billing_phone: row.billing_phone || null,
    shipping_name: row.shipping_name || null,
    shipping_address1: row.shipping_address1 || null,
    shipping_address2: row.shipping_address2 || null,
    shipping_city: row.shipping_city || null,
    shipping_province: row.shipping_province || null,
    shipping_zip: row.shipping_zip || null,
    shipping_country: row.shipping_country || null,
    shipping_phone: row.shipping_phone || null,
  };
  
  // This would go into an order_addresses table if you have one
  // For now, we'll skip this since the schema doesn't have it
}

function normalizePaymentStatus(status?: string): 'unpaid' | 'paid' | 'failed' {
  if (!status) return 'unpaid';
  
  const normalized = status.toLowerCase();
  if (normalized.includes('paid') || normalized === 'authorized' || normalized === 'success') {
    return 'paid';
  }
  if (normalized.includes('fail') || normalized === 'declined' || normalized === 'refunded') {
    return 'failed';
  }
  return 'unpaid';
}

function normalizeOrderStatus(fulfillmentStatus?: string, paymentStatus?: string): 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded' {
  if (fulfillmentStatus) {
    const normalized = fulfillmentStatus.toLowerCase();
    if (normalized.includes('cancel')) return 'cancelled';
    if (normalized.includes('refund')) return 'refunded';
    if (normalized.includes('fulfill') || normalized.includes('ship') || normalized === 'complete') return 'fulfilled';
  }
  
  if (paymentStatus === 'paid') return 'paid';
  if (paymentStatus === 'failed') return 'cancelled';
  
  return 'pending';
}

function parseDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

export async function processBatchImport(
  rows: ImportRow[],
  storeId: string,
  options: {
    duplicateStrategy: 'skip' | 'update' | 'merge';
    createCustomers: boolean;
    matchProducts: boolean;
    batchSize?: number;
  },
  supabase: any,
  onProgress?: (progress: ImportProgress) => void
): Promise<ImportProgress> {
  const progress: ImportProgress = {
    current: 0,
    total: rows.length,
    ordersCreated: 0,
    ordersUpdated: 0,
    ordersSkipped: 0,
    itemsCreated: 0,
    errors: [],
  };

  const batchSize = options.batchSize || 10;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    const results = await Promise.all(
      batch.map((row, batchIndex) =>
        processImportRow(row, storeId, options, supabase).then(result => ({
          result,
          rowIndex: i + batchIndex,
          row,
        }))
      )
    );

    for (const { result, rowIndex, row } of results) {
      progress.current = rowIndex + 1;

      if (result.success) {
        if (result.action === 'created') {
          progress.ordersCreated++;
        } else if (result.action === 'updated') {
          progress.ordersUpdated++;
        } else if (result.action === 'skipped') {
          progress.ordersSkipped++;
        }
        progress.itemsCreated += result.itemsCreated || 0;
      } else {
        progress.errors.push({
          row: rowIndex + 1,
          error: result.error || 'Unknown error',
          data: row,
        });
      }

      if (onProgress) {
        onProgress({ ...progress });
      }
    }
  }

  return progress;
}
