/**
 * Notification Email API - Vercel Serverless Function
 * Handles sending transactional emails (order confirmations, shipping updates, admin alerts)
 * Endpoint: POST /api/send-notification
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Email service configuration
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'orders@yourdomain.com';

interface NotificationRequest {
  type: 'order_confirmation' | 'shipping_update' | 'admin_new_order' | 'admin_low_stock' | 'test_order_confirmation' | 'test_shipping_update' | 'test_admin_order' | 'test_admin_low_stock';
  storeId: string;
  data: any;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, storeId, data } = req.body as NotificationRequest;

    if (!RESEND_API_KEY) {
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: 'Set RESEND_API_KEY environment variable'
      });
    }

    // Get store config for branding
    const { data: config } = await supabase
      .from('store_config')
      .select('name, primary_color, logo_url, support_email')
      .eq('store_id', storeId)
      .single();

    const storeName = config?.name || 'Your Store';
    const storeEmail = config?.support_email || FROM_EMAIL;
    const brandColor = config?.primary_color || '#3B82F6';

    let emailHtml = '';
    let emailSubject = '';
    let recipientEmail = '';

    // Generate email content based on type
    switch (type) {
      case 'order_confirmation':
      case 'test_order_confirmation':
        recipientEmail = type === 'test_order_confirmation' ? data.testEmail : data.customerEmail;
        emailSubject = `Order Confirmation - ${data.orderNumber || '#12345'}`;
        emailHtml = generateOrderConfirmationEmail(data, storeName, brandColor);
        break;

      case 'shipping_update':
      case 'test_shipping_update':
        recipientEmail = type === 'test_shipping_update' ? data.testEmail : data.customerEmail;
        emailSubject = `Your order has shipped - ${data.orderNumber || '#12345'}`;
        emailHtml = generateShippingUpdateEmail(data, storeName, brandColor);
        break;

      case 'admin_new_order':
      case 'test_admin_order':
        recipientEmail = type === 'test_admin_order' ? data.testEmail : data.adminEmail;
        emailSubject = `🛍️ New Order: ${data.data?.orderNumber || '#12345'}`;
        emailHtml = generateAdminOrderAlertEmail(data.data, storeName, brandColor);
        break;

      case 'admin_low_stock':
      case 'test_admin_low_stock':
        recipientEmail = type === 'test_admin_low_stock' ? data.testEmail : data.adminEmail;
        emailSubject = `⚠️ Low Stock Alert: ${data.data?.productName || 'Product'}`;
        emailHtml = generateAdminLowStockEmail(data.data, storeName, brandColor);
        break;

      default:
        return res.status(400).json({ error: 'Invalid notification type' });
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${storeName} <${storeEmail}>`,
        to: recipientEmail,
        subject: emailSubject,
        html: emailHtml,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.json();
      throw new Error(error.message || 'Failed to send email');
    }

    const result = await resendResponse.json();

    return res.status(200).json({
      success: true,
      emailId: result.id,
      message: 'Email sent successfully',
    });

  } catch (error: any) {
    console.error('Notification email error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send notification',
    });
  }
}

// Email Template Generators

function generateOrderConfirmationEmail(data: any, storeName: string, brandColor: string): string {
  const isTest = !data.customerName;
  const customerName = data.customerName || 'Valued Customer';
  const orderNumber = data.orderNumber || '#12345';
  const orderTotal = data.orderTotal || '$99.99';
  const orderDate = data.orderDate || new Date().toLocaleDateString();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    ${isTest ? `<div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <strong>⚠️ TEST EMAIL</strong> - This is a preview of how order confirmations will look.
    </div>` : ''}
    
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: ${brandColor}; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Hi ${customerName},
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for your order! We've received it and will start processing it right away.
        </p>
        
        <!-- Order Summary Box -->
        <div style="background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 18px;">Order Summary</h2>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Order Number:</span>
            <strong style="color: #111827;">${orderNumber}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #6b7280;">Order Date:</span>
            <strong style="color: #111827;">${orderDate}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #e5e7eb;">
            <span style="color: #111827; font-weight: 600;">Total:</span>
            <strong style="color: ${brandColor}; font-size: 20px;">${orderTotal}</strong>
          </div>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          We'll send you another email when your order ships with tracking information.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Questions? Contact us at <a href="mailto:${storeName.toLowerCase().replace(/\s/g, '')}@example.com" style="color: ${brandColor};">${storeName.toLowerCase().replace(/\s/g, '')}@example.com</a>
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0 0;">
          © ${new Date().getFullYear()} ${storeName}. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function generateShippingUpdateEmail(data: any, storeName: string, brandColor: string): string {
  const isTest = !data.customerName;
  const customerName = data.customerName || 'Valued Customer';
  const orderNumber = data.orderNumber || '#12345';
  const trackingNumber = data.trackingNumber || 'TRK123456789';
  const carrier = data.carrier || 'USPS';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipping Update</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    ${isTest ? `<div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <strong>⚠️ TEST EMAIL</strong> - This is a preview of shipping update emails.
    </div>` : ''}
    
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <!-- Header -->
      <div style="background: ${brandColor}; padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">📦 Your Order Has Shipped!</h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Hi ${customerName},
        </p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Great news! Your order <strong>${orderNumber}</strong> is on its way.
        </p>
        
        <!-- Tracking Info Box -->
        <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <h2 style="margin: 0 0 16px 0; color: #065f46; font-size: 18px;">Tracking Information</h2>
          <div style="margin-bottom: 12px;">
            <span style="color: #047857; font-weight: 600;">Carrier:</span> ${carrier}
          </div>
          <div style="margin-bottom: 12px;">
            <span style="color: #047857; font-weight: 600;">Tracking Number:</span>
            <br/>
            <code style="background: white; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 4px; font-size: 16px; color: #111827;">${trackingNumber}</code>
          </div>
        </div>
        
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://www.google.com/search?q=${carrier}+${trackingNumber}" style="display: inline-block; background: ${brandColor}; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Track Your Package
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          Your package should arrive within 3-5 business days. We'll notify you when it's delivered.
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} ${storeName}. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminOrderAlertEmail(data: any, storeName: string, brandColor: string): string {
  const isTest = !data.orderNumber;
  const orderNumber = data.orderNumber || '#12345';
  const orderTotal = data.orderTotal || '$99.99';
  const customerName = data.customerName || 'John Doe';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    ${isTest ? `<div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <strong>⚠️ TEST EMAIL</strong> - This is how admin order alerts will appear.
    </div>` : ''}
    
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background: #10b981; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🛍️ New Order Received</h1>
      </div>
      
      <div style="padding: 24px;">
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 14px; color: #065f46; margin-bottom: 8px;">Order ${orderNumber}</div>
          <div style="font-size: 24px; font-weight: bold; color: #047857;">${orderTotal}</div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Customer:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Time:</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${new Date().toLocaleString()}</td>
          </tr>
        </table>
        
        <div style="text-align: center; margin-top: 24px;">
          <a href="${storeName.toLowerCase().replace(/\s/g, '')}.com/admin/orders" style="display: inline-block; background: ${brandColor}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            View Order Details
          </a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

function generateAdminLowStockEmail(data: any, storeName: string, brandColor: string): string {
  const isTest = !data.productName;
  const productName = data.productName || 'Sample Product';
  const currentStock = data.currentStock || 3;
  const threshold = data.threshold || 5;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Low Stock Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    ${isTest ? `<div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
      <strong>⚠️ TEST EMAIL</strong> - This is how low stock alerts will appear.
    </div>` : ''}
    
    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background: #f59e0b; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Low Stock Alert</h1>
      </div>
      
      <div style="padding: 24px;">
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 18px; font-weight: bold; color: #92400e; margin-bottom: 8px;">${productName}</div>
          <div style="font-size: 14px; color: #78350f;">Only <strong>${currentStock} units</strong> remaining (threshold: ${threshold})</div>
        </div>
        
        <p style="color: #374151; font-size: 14px; line-height: 1.6;">
          This product is running low. Consider restocking soon to avoid going out of stock.
        </p>
        
        <div style="text-align: center; margin-top: 24px;">
          <a href="${storeName.toLowerCase().replace(/\s/g, '')}.com/admin/products" style="display: inline-block; background: ${brandColor}; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Manage Inventory
          </a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
