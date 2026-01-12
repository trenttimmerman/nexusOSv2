/**
 * Extract product and collection data from Shopify theme files
 */

import { ShopifyThemeStructure } from './shopifyThemeParser';
import { parseLiquidTemplate, extractDataReferences } from './liquidParser';

export interface ExtractedProduct {
  name: string;
  description?: string;
  price?: number;
  images?: string[];
  vendor?: string;
  type?: string;
  tags?: string[];
  sku?: string;
  variants?: any[];
}

export interface ExtractedCollection {
  name: string;
  description?: string;
  image?: string;
  type: 'manual' | 'auto';
  products?: string[];
}

export interface ExtractedContent {
  products: ExtractedProduct[];
  collections: ExtractedCollection[];
  pages: Array<{ title: string; content: string; slug: string }>;
  navigation: {
    main: Array<{ label: string; link: string }>;
    footer: Array<{ label: string; link: string }>;
  };
  settings: {
    storeName?: string;
    colors?: Record<string, string>;
    fonts?: Record<string, string>;
  };
}

/**
 * Extract all content from theme
 */
export function extractContentFromTheme(theme: ShopifyThemeStructure): ExtractedContent {
  const content: ExtractedContent = {
    products: [],
    collections: [],
    pages: [],
    navigation: {
      main: [],
      footer: []
    },
    settings: {}
  };
  
  // Extract from settings_data
  if (theme.files.config.settings_data) {
    content.settings = extractSettingsData(theme.files.config.settings_data);
  }
  
  // Extract product references from sections
  content.products = extractProductReferences(theme);
  
  // Extract collection references
  content.collections = extractCollectionReferences(theme);
  
  // Extract pages from templates
  content.pages = extractPages(theme);
  
  // Extract navigation from layout/theme.liquid
  content.navigation = extractNavigation(theme);
  
  return content;
}

/**
 * Extract settings data (store name, colors, fonts)
 */
function extractSettingsData(settingsData: any): Record<string, any> {
  const settings: Record<string, any> = {};
  const current = settingsData.current || {};
  
  // Store name
  settings.storeName = current.shop_name || current.store_name;
  
  // Extract colors
  settings.colors = {};
  Object.keys(current).forEach(key => {
    if (key.includes('color') && typeof current[key] === 'string' && current[key].startsWith('#')) {
      settings.colors[key] = current[key];
    }
  });
  
  // Extract fonts
  settings.fonts = {};
  Object.keys(current).forEach(key => {
    if (key.includes('font') && typeof current[key] === 'string') {
      settings.fonts[key] = current[key];
    }
  });
  
  return settings;
}

/**
 * Extract product references from sections
 */
function extractProductReferences(theme: ShopifyThemeStructure): ExtractedProduct[] {
  const products: ExtractedProduct[] = [];
  const productIds = new Set<string>();
  
  // Search sections for product references
  Object.entries(theme.files.sections).forEach(([filename, content]) => {
    const refs = extractDataReferences(content);
    
    if (refs.products) {
      // Look for product settings in schema
      const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (schemaMatch) {
        try {
          const schema = JSON.parse(schemaMatch[1]);
          
          // Check for product settings
          schema.settings?.forEach((setting: any) => {
            if (setting.type === 'product' && setting.id) {
              // Found a product reference
              const productId = setting.id;
              if (!productIds.has(productId)) {
                products.push({
                  name: setting.label || 'Product',
                  description: `Product from ${filename}`
                });
                productIds.add(productId);
              }
            }
          });
          
          // Check blocks for product settings
          schema.blocks?.forEach((block: any) => {
            block.settings?.forEach((setting: any) => {
              if (setting.type === 'product' && setting.id) {
                const productId = setting.id;
                if (!productIds.has(productId)) {
                  products.push({
                    name: setting.label || 'Product',
                    description: `Product from ${filename}`
                  });
                  productIds.add(productId);
                }
              }
            });
          });
        } catch (e) {
          // Schema parsing failed, continue
        }
      }
    }
  });
  
  return products;
}

/**
 * Extract collection references
 */
function extractCollectionReferences(theme: ShopifyThemeStructure): ExtractedCollection[] {
  const collections: ExtractedCollection[] = [];
  const collectionIds = new Set<string>();
  
  // Search sections for collection references
  Object.entries(theme.files.sections).forEach(([filename, content]) => {
    const refs = extractDataReferences(content);
    
    if (refs.collections) {
      const schemaMatch = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (schemaMatch) {
        try {
          const schema = JSON.parse(schemaMatch[1]);
          
          schema.settings?.forEach((setting: any) => {
            if (setting.type === 'collection' && setting.id) {
              const collectionId = setting.id;
              if (!collectionIds.has(collectionId)) {
                collections.push({
                  name: setting.label || 'Collection',
                  description: `Collection from ${filename}`,
                  type: 'manual'
                });
                collectionIds.add(collectionId);
              }
            }
          });
        } catch (e) {
          // Continue
        }
      }
    }
  });
  
  // Add default collections if none found
  if (collections.length === 0) {
    collections.push({
      name: 'All Products',
      type: 'auto',
      description: 'All products in your store'
    });
  }
  
  return collections;
}

/**
 * Extract pages from templates
 */
function extractPages(theme: ShopifyThemeStructure): Array<{ title: string; content: string; slug: string }> {
  const pages: Array<{ title: string; content: string; slug: string }> = [];
  
  // Common page templates
  const pageTemplates = ['page.about', 'page.contact', 'page.faq', 'page'];
  
  Object.entries(theme.files.templates).forEach(([filename, content]) => {
    const slug = filename.replace('.liquid', '').replace('page.', '');
    
    if (filename.startsWith('page')) {
      // Extract title from content if possible
      const titleMatch = content.match(/\{\{\s*page\.title\s*\}\}/);
      const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      
      pages.push({
        title,
        slug,
        content: extractPageContent(content)
      });
    }
  });
  
  // Add default pages if none found
  if (pages.length === 0) {
    pages.push(
      { title: 'About', slug: 'about', content: '' },
      { title: 'Contact', slug: 'contact', content: '' }
    );
  }
  
  return pages;
}

/**
 * Extract readable content from page template
 */
function extractPageContent(template: string): string {
  // Remove Liquid tags and extract text content
  let content = template;
  
  // Remove schema
  content = content.replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/g, '');
  
  // Remove comments
  content = content.replace(/\{%\s*comment\s*%\}[\s\S]*?\{%\s*endcomment\s*%\}/g, '');
  
  // Remove Liquid tags
  content = content.replace(/\{%[\s\S]*?%\}/g, '');
  
  // Keep only text between {{ page.content }} tags
  const contentMatch = content.match(/\{\{\s*page\.content\s*\}\}/);
  if (contentMatch) {
    return '{{ page.content }}'; // Placeholder for actual page content
  }
  
  // Remove remaining Liquid variables
  content = content.replace(/\{\{[\s\S]*?\}\}/g, '');
  
  // Clean up whitespace
  content = content.replace(/\s+/g, ' ').trim();
  
  return content.substring(0, 500); // Limit length
}

/**
 * Extract navigation menus
 */
function extractNavigation(theme: ShopifyThemeStructure): {
  main: Array<{ label: string; link: string }>;
  footer: Array<{ label: string; link: string }>;
} {
  const navigation = {
    main: [] as Array<{ label: string; link: string }>,
    footer: [] as Array<{ label: string; link: string }>
  };
  
  // Look for menu in header section
  const headerSection = Object.entries(theme.files.sections).find(([filename]) => 
    filename.toLowerCase().includes('header')
  );
  
  if (headerSection) {
    const [, content] = headerSection;
    const menuMatches = content.matchAll(/\{\{\s*linklists\[['"]([^'"]+)['"]\]/g);
    
    for (const match of menuMatches) {
      // Found a menu reference, add default items
      navigation.main = [
        { label: 'Shop', link: '/collections/all' },
        { label: 'About', link: '/pages/about' },
        { label: 'Contact', link: '/pages/contact' }
      ];
      break;
    }
  }
  
  // Look for menu in footer section
  const footerSection = Object.entries(theme.files.sections).find(([filename]) =>
    filename.toLowerCase().includes('footer')
  );
  
  if (footerSection) {
    navigation.footer = [
      { label: 'Privacy Policy', link: '/pages/privacy' },
      { label: 'Terms of Service', link: '/pages/terms' },
      { label: 'Refund Policy', link: '/pages/refund' }
    ];
  }
  
  // Default navigation if none found
  if (navigation.main.length === 0) {
    navigation.main = [
      { label: 'Home', link: '/' },
      { label: 'Shop', link: '/collections/all' },
      { label: 'About', link: '/pages/about' }
    ];
  }
  
  return navigation;
}

/**
 * Extract color palette from theme settings
 */
export function extractColorPalette(theme: ShopifyThemeStructure): Record<string, string> {
  const colors: Record<string, string> = {};
  const settingsData = theme.files.config.settings_data?.current || {};
  
  // Common color keys
  const colorKeys = [
    'color_primary',
    'color_secondary', 
    'color_accent',
    'color_background',
    'color_text',
    'color_button',
    'color_button_text'
  ];
  
  colorKeys.forEach(key => {
    if (settingsData[key]) {
      colors[key] = settingsData[key];
    }
  });
  
  // Map to nexusOS color names
  return {
    primary: colors.color_primary || colors.color_accent || '#000000',
    secondary: colors.color_secondary || '#6b7280',
    background: colors.color_background || '#ffffff',
    text: colors.color_text || '#000000',
    button: colors.color_button || colors.color_primary || '#000000',
    buttonText: colors.color_button_text || '#ffffff'
  };
}

/**
 * Extract typography settings
 */
export function extractTypography(theme: ShopifyThemeStructure): Record<string, string> {
  const typography: Record<string, string> = {};
  const settingsData = theme.files.config.settings_data?.current || {};
  
  typography.headingFont = settingsData.type_header_font || settingsData.font_heading || 'Sans-serif';
  typography.bodyFont = settingsData.type_base_font || settingsData.font_body || 'Sans-serif';
  typography.baseFontSize = settingsData.font_size_base || '16px';
  
  return typography;
}
