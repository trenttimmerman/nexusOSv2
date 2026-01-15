import React from 'react';

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  htmlContent: (vars: Record<string, string>) => string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Email',
    category: 'onboarding',
    description: 'Warm welcome for new subscribers',
    thumbnail: '👋',
    htmlContent: (vars) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${vars.store_name || 'Our Store'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Welcome to ${vars.store_name || 'Our Store'}! 👋</h1>
              <p style="margin: 20px 0 0 0; color: #ffffff; font-size: 18px; opacity: 0.9;">We're thrilled to have you here</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">Hi ${vars.customer_name || 'there'},</p>
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">Thanks for joining ${vars.store_name || 'our community'}! You're now part of something special.</p>
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">Here's a special welcome gift: <strong style="color: #667eea;">${vars.discount_code || '15% OFF'}</strong> your first order.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${vars.shop_url || '#'}" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 6px; font-weight: bold; font-size: 16px;">Start Shopping</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Questions? Reply to this email anytime.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  },
  {
    id: 'promotional-sale',
    name: 'Promotional Sale',
    category: 'marketing',
    description: 'Announce sales and special offers',
    thumbnail: '🔥',
    htmlContent: (vars) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${vars.sale_name || 'Big Sale'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
          <tr>
            <td style="background-color: #ef4444; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #ffffff; font-size: 14px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Limited Time Offer</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 60px 40px; text-align: center; background: linear-gradient(180deg, #ffffff 0%, #fef2f2 100%);">
              <h1 style="margin: 0 0 20px 0; color: #ef4444; font-size: 48px; font-weight: 900; line-height: 1.2;">${vars.sale_percentage || '50%'} OFF</h1>
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 28px; font-weight: bold;">${vars.sale_name || 'Everything Must Go'}</h2>
              <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 18px;">Use code: <strong style="color: #ef4444; font-size: 24px;">${vars.promo_code || 'SAVE50'}</strong></p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${vars.shop_url || '#'}" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 8px; font-weight: bold; font-size: 18px; text-transform: uppercase;">Shop Now</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 30px 0 0 0; color: #9ca3af; font-size: 14px;">Offer ends ${vars.sale_end_date || 'soon'}. Don't miss out!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; background-color: #1f2937;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} ${vars.store_name || 'Store'}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart',
    category: 'automation',
    description: 'Recover lost sales',
    thumbnail: '🛒',
    htmlContent: (vars) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You left something behind...</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 20px;">🛒</div>
              <h1 style="margin: 0 0 10px 0; color: #1f2937; font-size: 28px; font-weight: bold;">Still Thinking It Over?</h1>
              <p style="margin: 0; color: #6b7280; font-size: 16px;">Your items are waiting for you</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <p style="margin: 0 0 15px 0; color: #1f2937; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Cart</p>
                <div style="border-top: 1px solid #e5e7eb; padding-top: 15px;">
                  <p style="margin: 0; color: #4b5563; font-size: 16px;">${vars.cart_items || 'Your selected items'}</p>
                  <p style="margin: 15px 0 0 0; color: #1f2937; font-size: 20px; font-weight: bold;">Total: ${vars.cart_total || '$99.99'}</p>
                </div>
              </div>
              <p style="margin: 0 0 10px 0; color: #10b981; font-weight: bold; font-size: 16px; text-align: center;">🎁 Complete your order and get ${vars.incentive || '10% off'}!</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${vars.cart_url || '#'}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">Complete My Order</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Need help? <a href="${vars.support_url || '#'}" style="color: #3b82f6; text-decoration: none;">Contact us</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    category: 'content',
    description: 'Regular updates and content',
    thumbnail: '📰',
    htmlContent: (vars) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${vars.newsletter_title || 'Newsletter'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #fafafa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff;">
          <tr>
            <td style="padding: 40px; border-bottom: 3px solid #1f2937;">
              <h1 style="margin: 0; color: #1f2937; font-size: 36px; font-weight: normal; font-style: italic;">${vars.store_name || 'The Newsletter'}</h1>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">${vars.newsletter_date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: bold;">${vars.headline || 'What\'s New This Week'}</h2>
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px; line-height: 1.8;">${vars.intro_text || 'We have some exciting updates to share with you this week. From new product launches to exclusive offers, here\'s everything you need to know.'}</p>
              <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0;">
                <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px; font-weight: bold;">${vars.feature_title || 'Featured Story'}</h3>
                <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.7;">${vars.feature_content || 'Discover our latest collection designed to elevate your everyday style.'}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${vars.read_more_url || '#'}" style="display: inline-block; background-color: #1f2937; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 4px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Read More</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1f2937; padding: 30px 40px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 13px;">You're receiving this because you subscribed to ${vars.store_name || 'our newsletter'}</p>
              <a href="${vars.unsubscribe_url || '#'}" style="color: #9ca3af; font-size: 12px; text-decoration: underline;">Unsubscribe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    category: 'marketing',
    description: 'Introduce new products',
    thumbnail: '🚀',
    htmlContent: (vars) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${vars.product_name || 'New Product'} Launch</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <tr>
            <td style="padding: 50px 40px; text-align: center; background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; opacity: 0.9;">Introducing</p>
              <h1 style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 900; line-height: 1.2;">${vars.product_name || 'The Next Big Thing'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0;">
              <img src="${vars.product_image || 'https://via.placeholder.com/600x400/1e293b/0ea5e9?text=Product+Image'}" alt="${vars.product_name || 'Product'}" style="width: 100%; height: auto; display: block;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 25px 0; color: #cbd5e1; font-size: 18px; line-height: 1.7; text-align: center;">${vars.product_description || 'Experience innovation like never before. Crafted with precision and designed for perfection.'}</p>
              <div style="background-color: #0f172a; border-radius: 8px; padding: 25px; margin-bottom: 30px; text-align: center;">
                <p style="margin: 0 0 5px 0; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Starting at</p>
                <p style="margin: 0; color: #0ea5e9; font-size: 36px; font-weight: bold;">${vars.product_price || '$299'}</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${vars.product_url || '#'}" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 8px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Pre-Order Now</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 25px 40px; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 13px;">Limited quantities available. ${vars.launch_date || 'Ships soon'}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  },
  {
    id: 'vip-exclusive',
    name: 'VIP Exclusive',
    category: 'loyalty',
    description: 'Special offers for top customers',
    thumbnail: '⭐',
    htmlContent: (vars) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP Exclusive Access</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%); border: 1px solid #fbbf24; border-radius: 12px;">
          <tr>
            <td style="padding: 40px; text-align: center; border-bottom: 1px solid #fbbf24;">
              <div style="display: inline-block; background-color: #fbbf24; color: #000000; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;">VIP Member</div>
              <h1 style="margin: 10px 0 0 0; color: #fbbf24; font-size: 32px; font-weight: 900; letter-spacing: -1px;">Exclusive Access</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #e5e7eb; font-size: 16px; line-height: 1.6;">Dear ${vars.customer_name || 'Valued Member'},</p>
              <p style="margin: 0 0 20px 0; color: #e5e7eb; font-size: 16px; line-height: 1.6;">As one of our most valued customers, you're getting first access to ${vars.exclusive_offer || 'our exclusive collection'} before anyone else.</p>
              <div style="background-color: #2d2d2d; border: 2px dashed #fbbf24; border-radius: 8px; padding: 30px; margin: 30px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Your VIP Code</p>
                <p style="margin: 0; color: #fbbf24; font-size: 32px; font-weight: bold; letter-spacing: 3px; font-family: 'Courier New', monospace;">${vars.vip_code || 'VIP2026'}</p>
                <p style="margin: 15px 0 0 0; color: #e5e7eb; font-size: 14px;">${vars.discount_amount || '25%'} off + Free Shipping</p>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${vars.vip_shop_url || '#'}" style="display: inline-block; background-color: #fbbf24; color: #000000; text-decoration: none; padding: 16px 45px; border-radius: 6px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Shop VIP Collection</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 30px 0 0 0; color: #9ca3af; font-size: 13px; text-align: center;">Access expires ${vars.expiry_date || 'in 48 hours'}. VIP members only.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #1a1a1a; padding: 25px 40px; text-align: center; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">Thank you for being a VIP member of ${vars.store_name || 'our store'}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
  }
];

export const renderEmailTemplate = (template: EmailTemplate, variables: Record<string, string>): string => {
  return template.htmlContent(variables);
};
