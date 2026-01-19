/**
 * Notification Service
 * Handles sending transactional emails for order updates, shipping, and admin alerts
 */

import { supabase } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export interface NotificationSettings {
  orderConfirmation?: boolean;
  shippingUpdate?: boolean;
  orderDelivered?: boolean;
  adminOrderAlert?: boolean;
  adminLowStockAlert?: boolean;
  emailBranding?: boolean;
}

export interface OrderConfirmationData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderTotal: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
    image?: string;
  }>;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  storeName: string;
  storeUrl?: string;
}

export interface ShippingUpdateData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  storeName: string;
}

export interface AdminAlertData {
  type: 'new_order' | 'low_stock';
  adminEmail: string;
  storeName: string;
  data: {
    orderNumber?: string;
    orderTotal?: string;
    customerName?: string;
    productName?: string;
    currentStock?: number;
    threshold?: number;
  };
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmation(
  storeId: string,
  data: OrderConfirmationData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if order confirmations are enabled
    const { data: config } = await supabase
      .from('store_config')
      .select('notification_settings')
      .eq('store_id', storeId)
      .single();

    const settings = config?.notification_settings as NotificationSettings;
    if (!settings?.orderConfirmation) {
      return { success: false, error: 'Order confirmations are disabled' };
    }

    // Send email via API
    const response = await fetch(`${API_BASE}/api/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order_confirmation',
        storeId,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send order confirmation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send shipping update email to customer
 */
export async function sendShippingUpdate(
  storeId: string,
  data: ShippingUpdateData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: config } = await supabase
      .from('store_config')
      .select('notification_settings')
      .eq('store_id', storeId)
      .single();

    const settings = config?.notification_settings as NotificationSettings;
    if (!settings?.shippingUpdate) {
      return { success: false, error: 'Shipping updates are disabled' };
    }

    const response = await fetch(`${API_BASE}/api/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'shipping_update',
        storeId,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send shipping update:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send admin alert (new order or low stock)
 */
export async function sendAdminAlert(
  storeId: string,
  data: AdminAlertData
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: config } = await supabase
      .from('store_config')
      .select('notification_settings, support_email')
      .eq('store_id', storeId)
      .single();

    const settings = config?.notification_settings as NotificationSettings;
    
    // Check if the specific alert type is enabled
    if (data.type === 'new_order' && !settings?.adminOrderAlert) {
      return { success: false, error: 'Admin order alerts are disabled' };
    }
    if (data.type === 'low_stock' && !settings?.adminLowStockAlert) {
      return { success: false, error: 'Admin low stock alerts are disabled' };
    }

    // Use support email as admin email if not provided
    const adminEmail = data.adminEmail || config?.support_email;
    if (!adminEmail) {
      return { success: false, error: 'No admin email configured' };
    }

    const response = await fetch(`${API_BASE}/api/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `admin_${data.type}`,
        storeId,
        data: { ...data, adminEmail },
      }),
    });

    if (!response.ok) {
      throw new Error(`Email API error: ${response.statusText}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send admin alert:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send a test email to verify email configuration
 */
export async function sendTestEmail(
  storeId: string,
  type: 'order_confirmation' | 'shipping_update' | 'admin_order' | 'admin_low_stock',
  testEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/api/send-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: `test_${type}`,
        storeId,
        data: {
          testEmail,
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send test email');
    }

    return { success: true };
  } catch (error: any) {
    console.error('Failed to send test email:', error);
    return { success: false, error: error.message };
  }
}
