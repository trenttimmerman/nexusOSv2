// Shopify Template Converter
// Converts Shopify page templates (index.json, product.json, etc.) to WebPilot pages

import { convertShopifyTemplate } from './sectionMapper';
import { createClient } from '@supabase/supabase-js';

interface ShopifyTemplate {
  sections: { [key: string]: any };
  order?: string[];
}

interface WebPilotPage {
  title: string;
  slug: string;
  page_type: string;
  is_published: boolean;
  sections: any[];
}

/**
 * Convert Shopify index.json (homepage) to WebPilot page
 */
export function convertHomepage(template: ShopifyTemplate): WebPilotPage {
  const sections = convertShopifyTemplate(template);
  
  return {
    title: 'Home',
    slug: '',
    page_type: 'home',
    is_published: true,
    sections,
  };
}

/**
 * Convert Shopify product.json to WebPilot product page template
 * Note: This creates the product page layout, not individual products
 */
export function convertProductTemplate(template: ShopifyTemplate): WebPilotPage {
  const sections = convertShopifyTemplate(template);
  
  return {
    title: 'Product Template',
    slug: 'product',
    page_type: 'product',
    is_published: true,
    sections,
  };
}

/**
 * Convert Shopify collection.json to WebPilot collection page template
 */
export function convertCollectionTemplate(template: ShopifyTemplate): WebPilotPage {
  const sections = convertShopifyTemplate(template);
  
  return {
    title: 'Collection Template',
    slug: 'collection',
    page_type: 'collection',
    is_published: true,
    sections,
  };
}

/**
 * Convert Shopify page.json templates to WebPilot custom pages
 */
export function convertCustomPage(
  templateName: string,
  template: ShopifyTemplate
): WebPilotPage {
  const sections = convertShopifyTemplate(template);
  
  // Extract page name from template filename (e.g., "page.contact.json" → "contact")
  const pageName = templateName.replace('page.', '').replace('.json', '');
  const title = pageName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title,
    slug: pageName,
    page_type: 'custom',
    is_published: true,
    sections,
  };
}

/**
 * Import all pages to Supabase
 */
export async function importPagesToSupabase(
  storeId: string,
  pages: WebPilotPage[],
  supabase: ReturnType<typeof createClient>
): Promise<{ success: number; failed: number; errors: string[] }> {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  for (const page of pages) {
    try {
      const { error } = await supabase.from('pages').insert({
        store_id: storeId,
        title: page.title,
        slug: page.slug,
        page_type: page.page_type,
        is_published: page.is_published,
        sections: page.sections,
        created_at: new Date().toISOString(),
      });
      
      if (error) {
        results.failed++;
        results.errors.push(`Failed to import ${page.title}: ${error.message}`);
      } else {
        results.success++;
      }
    } catch (err: any) {
      results.failed++;
      results.errors.push(`Error importing ${page.title}: ${err.message}`);
    }
  }
  
  return results;
}

/**
 * Convert all Shopify templates to WebPilot pages
 */
export function convertAllTemplates(templates: {
  [key: string]: ShopifyTemplate;
}): WebPilotPage[] {
  const pages: WebPilotPage[] = [];
  
  for (const [templateName, template] of Object.entries(templates)) {
    if (templateName === 'index') {
      pages.push(convertHomepage(template));
    } else if (templateName === 'product') {
      pages.push(convertProductTemplate(template));
    } else if (templateName === 'collection') {
      pages.push(convertCollectionTemplate(template));
    } else if (templateName.startsWith('page.')) {
      pages.push(convertCustomPage(templateName, template));
    }
    // Skip cart, blog, article templates for now (not core to migration)
  }
  
  return pages;
}

/**
 * Generate preview data for comparison UI
 */
export interface ThemePreview {
  design: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
    };
    typography: {
      heading: string;
      body: string;
    };
    vibe: string;
  };
  pages: {
    title: string;
    type: string;
    sectionCount: number;
    convertedSections: number;
    unsupportedSections: string[];
  }[];
  assets: {
    logo?: string;
    favicon?: string;
  };
  conversionScore: number;
}

export function generateThemePreview(
  design: any,
  assets: any,
  templates: { [key: string]: ShopifyTemplate },
  compatibilityScore: number
): ThemePreview {
  const pages = convertAllTemplates(templates);
  
  return {
    design: {
      colors: {
        primary: design.primary_color,
        secondary: design.secondary_color,
        background: design.background_color,
      },
      typography: {
        heading: design.typography.headingFont,
        body: design.typography.bodyFont,
      },
      vibe: design.store_vibe,
    },
    pages: pages.map(page => ({
      title: page.title,
      type: page.page_type,
      sectionCount: page.sections.length,
      convertedSections: page.sections.length,
      unsupportedSections: [],
    })),
    assets,
    conversionScore: compatibilityScore,
  };
}
