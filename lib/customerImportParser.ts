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
    'email': ['email', 'e-mail', 'email address', 'customer email', 'mail'],
    'first_name': ['first name', 'firstname', 'fname', 'given name', 'first'],
    'last_name': ['last name', 'lastname', 'lname', 'surname', 'family name', 'last'],
    'phone': ['phone', 'telephone', 'mobile', 'phone number', 'cell', 'tel'],
    'company_name': ['company', 'organization', 'business name', 'org'],
    'address_line1': ['address', 'address1', 'street', 'address line 1', 'address 1'],
    'address_line2': ['address2', 'address line 2', 'address 2', 'apt', 'suite'],
    'city': ['city', 'town', 'locality'],
    'state_province': ['state', 'province', 'region', 'province code'],
    'postal_code': ['zip', 'postal code', 'postcode', 'zip code', 'postal'],
    'country': ['country', 'country name', 'country code'],
    'tags': ['tags', 'segments', 'labels', 'categories'],
    'notes': ['note', 'notes', 'comments', 'description'],
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
