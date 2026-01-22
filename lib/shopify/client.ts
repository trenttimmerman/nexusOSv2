/**
 * Shopify Admin API Client
 * Handles authentication and data fetching from Shopify stores
 */

export interface ShopifyCredentials {
  shopDomain: string; // mystore.myshopify.com
  accessToken: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  status: string;
  tags: string;
  variants: ShopifyVariant[];
  options: ShopifyOption[];
  images: ShopifyImage[];
}

export interface ShopifyVariant {
  id: string;
  product_id: string;
  title: string;
  price: string;
  sku: string;
  barcode: string;
  inventory_quantity: number;
  inventory_management: string;
  image_id: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  compare_at_price: string | null;
}

export interface ShopifyOption {
  name: string;
  values: string[];
  position: number;
}

export interface ShopifyImage {
  id: string;
  src: string;
  alt: string | null;
  position: number;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  body_html: string;
  handle: string;
  sort_order: string;
  rules: ShopifyCollectionRule[] | null;
  published_at: string;
}

export interface ShopifyCollectionRule {
  column: string;
  relation: string;
  condition: string;
}

export interface ShopifyCustomer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  note: string | null;
  tags: string;
  accepts_marketing: boolean;
  tax_exempt: boolean;
  addresses: ShopifyAddress[];
  orders_count: number;
  total_spent: string;
}

export interface ShopifyAddress {
  id: string;
  first_name: string;
  last_name: string;
  address1: string;
  address2: string | null;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string | null;
  default: boolean;
}

export interface ShopifyOrder {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  order_number: number;
  note: string | null;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  total_discounts: string;
  financial_status: string;
  fulfillment_status: string | null;
  customer: { id: string } | null;
  shipping_address: ShopifyAddress | null;
  line_items: ShopifyLineItem[];
  discount_codes: { code: string; amount: string }[];
  refunds: ShopifyRefund[];
}

export interface ShopifyLineItem {
  id: string;
  product_id: string | null;
  variant_id: string | null;
  title: string;
  variant_title: string | null;
  quantity: number;
  price: string;
  sku: string | null;
}

export interface ShopifyRefund {
  id: string;
  order_id: string;
  created_at: string;
  note: string | null;
  refund_line_items: { line_item_id: string; quantity: number; subtotal: string }[];
  transactions: { amount: string }[];
}

export interface ShopifyPage {
  id: string;
  title: string;
  handle: string;
  body_html: string;
  created_at: string;
  updated_at: string;
}

export interface ShopifyBlog {
  id: string;
  handle: string;
  title: string;
}

export interface ShopifyArticle {
  id: string;
  title: string;
  author: string;
  body_html: string;
  blog_id: string;
  handle: string;
  image: { src: string } | null;
  published_at: string;
  tags: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

/**
 * Rate limiter for Shopify API (2 requests per second)
 */
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private readonly delayMs = 500; // 2 requests/second = 500ms between

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const fn = this.queue.shift();
      if (fn) {
        await fn();
        await this.sleep(this.delayMs);
      }
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Shopify Admin API Client
 */
export class ShopifyClient {
  private credentials: ShopifyCredentials;
  private rateLimiter: RateLimiter;
  private apiVersion = '2024-01';

  constructor(credentials: ShopifyCredentials) {
    this.credentials = credentials;
    this.rateLimiter = new RateLimiter();
  }

  /**
   * Make authenticated request to Shopify Admin API
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.rateLimiter.add(async () => {
      const url = `https://${this.credentials.shopDomain}/admin/api/${this.apiVersion}/${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'X-Shopify-Access-Token': this.credentials.accessToken,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Shopify API Error: ${response.status} - ${error}`);
      }

      return response.json();
    });
  }

  /**
   * Paginate through Shopify REST API results
   */
  private async *paginate<T>(
    endpoint: string,
    resourceKey: string,
    limit: number = 250
  ): AsyncGenerator<T[], void, unknown> {
    let pageInfo: string | null = null;

    while (true) {
      const url = pageInfo
        ? `${endpoint}?limit=${limit}&page_info=${pageInfo}`
        : `${endpoint}?limit=${limit}`;

      const response = await fetch(
        `https://${this.credentials.shopDomain}/admin/api/${this.apiVersion}/${url}`,
        {
          headers: {
            'X-Shopify-Access-Token': this.credentials.accessToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Shopify API Error: ${response.status}`);
      }

      const data = await response.json();
      const items = data[resourceKey] || [];
      
      yield items;

      // Check for next page
      const linkHeader = response.headers.get('Link');
      if (!linkHeader || !linkHeader.includes('rel="next"')) {
        break;
      }

      // Extract page_info from Link header
      const nextMatch = linkHeader.match(/page_info=([^&>]+)/);
      pageInfo = nextMatch ? nextMatch[1] : null;

      if (!pageInfo) break;
    }
  }

  /**
   * Get all products with pagination
   */
  async *getProducts(): AsyncGenerator<ShopifyProduct[], void, unknown> {
    yield* this.paginate<ShopifyProduct>('products.json', 'products');
  }

  /**
   * Get all collections with pagination
   */
  async *getCollections(): AsyncGenerator<ShopifyCollection[], void, unknown> {
    // Get both custom and smart collections
    const customCollections = this.paginate<any>('custom_collections.json', 'custom_collections');
    const smartCollections = this.paginate<any>('smart_collections.json', 'smart_collections');

    for await (const batch of customCollections) {
      yield batch.map(c => ({ ...c, rules: null })); // Custom collections have no rules
    }

    for await (const batch of smartCollections) {
      yield batch; // Smart collections have rules
    }
  }

  /**
   * Get collection products
   */
  async getCollectionProducts(collectionId: string): Promise<string[]> {
    const data = await this.request<{ collects: { product_id: string }[] }>(
      `collects.json?collection_id=${collectionId}&limit=250`
    );
    return data.collects.map(c => c.product_id);
  }

  /**
   * Get all customers with pagination
   */
  async *getCustomers(): AsyncGenerator<ShopifyCustomer[], void, unknown> {
    yield* this.paginate<ShopifyCustomer>('customers.json', 'customers');
  }

  /**
   * Get all orders with pagination
   */
  async *getOrders(status: 'any' | 'open' | 'closed' = 'any'): AsyncGenerator<ShopifyOrder[], void, unknown> {
    yield* this.paginate<ShopifyOrder>(`orders.json?status=${status}`, 'orders');
  }

  /**
   * Get all pages with pagination
   */
  async *getPages(): AsyncGenerator<ShopifyPage[], void, unknown> {
    yield* this.paginate<ShopifyPage>('pages.json', 'pages');
  }

  /**
   * Get all blogs
   */
  async getBlogs(): Promise<ShopifyBlog[]> {
    const data = await this.request<{ blogs: ShopifyBlog[] }>('blogs.json');
    return data.blogs;
  }

  /**
   * Get all articles for a blog
   */
  async *getArticles(blogId: string): AsyncGenerator<ShopifyArticle[], void, unknown> {
    yield* this.paginate<ShopifyArticle>(`blogs/${blogId}/articles.json`, 'articles');
  }

  /**
   * Get shop information (settings, logo, etc.)
   */
  async getShop(): Promise<any> {
    const data = await this.request<{ shop: any }>('shop.json');
    return data.shop;
  }

  /**
   * Test connection and get available scopes
   */
  async testConnection(): Promise<{ connected: boolean; scopes: string[]; shop: any }> {
    try {
      const shop = await this.getShop();
      return {
        connected: true,
        scopes: [], // Shopify doesn't expose scopes via API, would need OAuth flow data
        shop,
      };
    } catch (error) {
      return {
        connected: false,
        scopes: [],
        shop: null,
      };
    }
  }
}

/**
 * Create Shopify OAuth URL for app installation
 */
export function createShopifyOAuthUrl(params: {
  shopDomain: string;
  apiKey: string;
  redirectUri: string;
  scopes: string[];
}): string {
  const { shopDomain, apiKey, redirectUri, scopes } = params;
  
  return `https://${shopDomain}/admin/oauth/authorize?` +
    `client_id=${apiKey}&` +
    `scope=${scopes.join(',')}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;
}

/**
 * Exchange OAuth code for access token
 */
export async function exchangeOAuthCode(params: {
  shopDomain: string;
  apiKey: string;
  apiSecret: string;
  code: string;
}): Promise<{ access_token: string; scope: string }> {
  const { shopDomain, apiKey, apiSecret, code } = params;

  const response = await fetch(
    `https://${shopDomain}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`OAuth exchange failed: ${response.status}`);
  }

  return response.json();
}
