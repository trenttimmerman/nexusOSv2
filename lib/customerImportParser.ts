import Papa from 'papaparse';

export interface ParsedCSV {
  headers: string[];
  data: Record<string, any>[];
  rowCount: number;
}

export interface ShopifyCustomerRow {
  'First Name'?: string;
  'Last Name'?: string;
  'Email'?: string;
  'Phone'?: string;
  'Company'?: string;
  'Address1'?: string;
  'Address2'?: string;
  'City'?: string;
  'Province'?: string;
  'Province Code'?: string;
  'Country'?: string;
  'Country Code'?: string;
  'Zip'?: string;
  'Accepts Email Marketing'?: string;
  'Accepts SMS Marketing'?: string;
  'Tags'?: string;
  'Note'?: string;
  'Tax Exempt'?: string;
  [key: string]: any;
}

export function parseCustomerCSV(file: File): Promise<ParsedCSV> {
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

export function detectPlatform(headers: string[]): 'shopify' | 'woocommerce' | 'bigcommerce' | 'unknown' {
  const headerSet = new Set(headers.map(h => h.toLowerCase().trim()));
  
  // Shopify detection
  if (
    headerSet.has('first name') &&
    headerSet.has('last name') &&
    headerSet.has('accepts email marketing') &&
    headerSet.has('province code')
  ) {
    return 'shopify';
  }
  
  // WooCommerce detection
  if (
    headerSet.has('billing_first_name') ||
    headerSet.has('billing_email')
  ) {
    return 'woocommerce';
  }
  
  // BigCommerce detection
  if (headerSet.has('customer_group_name')) {
    return 'bigcommerce';
  }
  
  return 'unknown';
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: (value: any) => any;
}

export const SHOPIFY_DEFAULT_MAPPING: FieldMapping[] = [
  { sourceField: 'First Name', targetField: 'first_name' },
  { sourceField: 'Last Name', targetField: 'last_name' },
  { sourceField: 'Email', targetField: 'email' },
  { sourceField: 'Phone', targetField: 'phone' },
  { sourceField: 'Company', targetField: 'company_name' },
  { 
    sourceField: 'Accepts Email Marketing', 
    targetField: 'email_marketing',
    transform: (val: string) => val?.toLowerCase() === 'yes'
  },
  { sourceField: 'Tags', targetField: 'tags', transform: (val: string) => val ? val.split(',').map(t => t.trim()) : [] },
  { sourceField: 'Note', targetField: 'notes' },
  { sourceField: 'Address1', targetField: 'address_line1' },
  { sourceField: 'Address2', targetField: 'address_line2' },
  { sourceField: 'City', targetField: 'city' },
  { sourceField: 'Province', targetField: 'state_province' },
  { sourceField: 'Zip', targetField: 'postal_code' },
  { sourceField: 'Country', targetField: 'country' },
  { 
    sourceField: 'Tax Exempt', 
    targetField: 'tax_exempt',
    transform: (val: string) => val?.toLowerCase() === 'yes'
  },
];

export function suggestMapping(headers: string[]): Map<string, string> {
  const suggestions = new Map<string, string>();
  
  const fieldSuggestions: Record<string, string[]> = {
    'email': ['email', 'e-mail', 'email address', 'customer email', 'mail', 'contact_email'],
    'first_name': ['first name', 'firstname', 'fname', 'given name', 'first', 'contact_first_name'],
    'last_name': ['last name', 'lastname', 'lname', 'surname', 'family name', 'last', 'contact_last_name'],
    'phone': ['phone', 'telephone', 'mobile', 'phone number', 'cell', 'tel', 'contact_phone'],
    'company_name': ['company', 'organization', 'business name', 'org', 'company name'],
    'client_type': ['account type', 'customer type', 'client type', 'type', 'account_type', 'customer_type'],
    'website': ['website', 'url', 'web', 'site'],
    'notes': ['note', 'notes', 'comments', 'description', 'internal_notes', 'internal notes'],
    'tax_number': ['tax id', 'tax_id', 'tax number', 'resale number', 'resale_number', 'vat', 'gst'],
    
    // Shipping address
    'shipping_address_1': ['shipping address', 'shipping_address', 'shipping address 1', 'shipping_address_1', 'ship address', 'ship_address_1'],
    'shipping_address_2': ['shipping address 2', 'shipping_address_2', 'ship address 2', 'ship_address_2'],
    'shipping_city': ['shipping city', 'shipping_city', 'ship city', 'ship_city'],
    'shipping_state': ['shipping state', 'shipping_state', 'shipping province', 'shipping_province', 'shipping_state_code', 'ship state'],
    'shipping_postal_code': ['shipping zip', 'shipping_zip', 'shipping postal', 'shipping_postal_code', 'shipping postal code', 'ship zip'],
    'shipping_country': ['shipping country', 'shipping_country', 'shipping_country_code', 'ship country'],
    'shipping_label': ['shipping label', 'shipping_label'],
    
    // Billing address
    'billing_address_1': ['billing address', 'billing_address', 'billing address 1', 'billing_address_1', 'bill address', 'bill_address_1'],
    'billing_address_2': ['billing address 2', 'billing_address_2', 'bill address 2', 'bill_address_2'],
    'billing_city': ['billing city', 'billing_city', 'bill city', 'bill_city'],
    'billing_state': ['billing state', 'billing_state', 'billing province', 'billing_province', 'billing_state_code', 'bill state'],
    'billing_postal_code': ['billing zip', 'billing_zip', 'billing postal', 'billing_postal_code', 'billing postal code', 'bill zip'],
    'billing_country': ['billing country', 'billing_country', 'billing_country_code', 'bill country'],
    'billing_label': ['billing label', 'billing_label'],
    
    // Legacy address fields (fallback)
    'address_line1': ['address', 'address1', 'street', 'address line 1', 'address 1'],
    'address_line2': ['address2', 'address line 2', 'address 2', 'apt', 'suite'],
    'city': ['city', 'town', 'locality'],
    'state_province': ['state', 'province', 'region', 'province code'],
    'postal_code': ['zip', 'postal code', 'postcode', 'zip code', 'postal'],
    'country': ['country', 'country name', 'country code'],
    
    'tags': ['tags', 'segments', 'labels', 'categories'],
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
