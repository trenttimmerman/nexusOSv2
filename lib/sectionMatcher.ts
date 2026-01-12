/**
 * Maps Shopify theme sections to nexusOS block types
 */

import { ParsedSection } from './shopifyThemeParser';

export interface SectionMapping {
  shopifySection: string;
  nexusOSBlock: string;
  confidence: 'high' | 'medium' | 'low';
  dataMapping?: Record<string, string>;
  notes?: string;
}

export interface MappedBlock {
  type: string;
  variant: string;
  data: Record<string, any>;
  order: number;
  warnings: string[];
}

/**
 * Detect section type from filename and content
 */
export function detectSectionType(filename: string, section: ParsedSection): string {
  const name = filename.toLowerCase().replace('.liquid', '');
  const schema = section.schema;
  
  // Header detection
  if (name.includes('header') || schema?.tag === 'header') {
    return 'header';
  }
  
  // Footer detection
  if (name.includes('footer') || schema?.tag === 'footer') {
    return 'footer';
  }
  
  // Hero/Banner detection
  if (
    name.includes('hero') ||
    name.includes('banner') ||
    name.includes('slideshow') ||
    name.includes('image-banner') ||
    name.includes('image_banner')
  ) {
    return 'hero';
  }
  
  // Product collection/grid
  if (
    name.includes('featured-collection') ||
    name.includes('featured_collection') ||
    name.includes('collection-list') ||
    name.includes('product-grid') ||
    name.includes('product_grid')
  ) {
    return 'collection';
  }
  
  // Featured product
  if (name.includes('featured-product') || name.includes('featured_product')) {
    return 'featured-product';
  }
  
  // Multi-column / features
  if (
    name.includes('multicolumn') ||
    name.includes('multi-column') ||
    name.includes('features') ||
    name.includes('rich-text')
  ) {
    return 'layout';
  }
  
  // Contact form
  if (name.includes('contact') || name.includes('newsletter')) {
    return 'contact';
  }
  
  // Video
  if (name.includes('video')) {
    return 'video';
  }
  
  // Gallery/images
  if (name.includes('gallery') || name.includes('collage')) {
    return 'gallery';
  }
  
  return 'custom';
}

/**
 * Map Shopify section to nexusOS block
 */
export function mapSectionToBlock(
  filename: string,
  section: ParsedSection,
  order: number
): MappedBlock {
  const sectionType = detectSectionType(filename, section);
  const schema = section.schema;
  const warnings: string[] = [];
  
  // Map based on section type
  switch (sectionType) {
    case 'header':
      return mapHeaderSection(schema, order, warnings);
    
    case 'footer':
      return mapFooterSection(schema, order, warnings);
    
    case 'hero':
      return mapHeroSection(schema, order, warnings);
    
    case 'collection':
      return mapCollectionSection(schema, order, warnings);
    
    case 'featured-product':
      return mapFeaturedProductSection(schema, order, warnings);
    
    case 'layout':
      return mapLayoutSection(schema, order, warnings);
    
    case 'contact':
      return mapContactSection(schema, order, warnings);
    
    case 'gallery':
      return mapGallerySection(schema, order, warnings);
    
    default:
      warnings.push(`Unknown section type: ${filename}. Creating generic block.`);
      return {
        type: 'system-layout',
        variant: 'blank',
        data: {
          sectionName: schema?.name || filename,
          originalLiquid: section.liquidContent.substring(0, 500)
        },
        order,
        warnings
      };
  }
}

function mapHeaderSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  return {
    type: 'system-header',
    variant: 'minimal', // Default, can be enhanced
    data: {
      logoText: settings.logo_text || settings.shop_name || '',
      showLogo: settings.logo !== undefined,
      menuItems: extractMenuItems(settings),
      showSearch: settings.enable_search !== false,
      showCart: settings.enable_cart !== false,
      sticky: settings.enable_sticky_header !== false,
      backgroundColor: settings.background_color || '#ffffff',
      textColor: settings.text_color || '#000000'
    },
    order,
    warnings
  };
}

function mapFooterSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  return {
    type: 'system-footer',
    variant: 'columns',
    data: {
      showNewsletter: settings.newsletter_enable !== false,
      newsletterHeading: settings.newsletter_heading || 'Subscribe to our emails',
      showSocial: settings.show_social !== false,
      copyrightText: settings.copyright_text || `© ${new Date().getFullYear()}`,
      backgroundColor: settings.background_color || '#000000',
      textColor: settings.text_color || '#ffffff',
      columns: extractFooterColumns(settings)
    },
    order,
    warnings
  };
}

function mapHeroSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  // Detect variant based on schema
  let variant = 'split';
  if (settings.layout === 'full_bleed') variant = 'fullscreen';
  if (settings.desktop_content_position?.includes('center')) variant = 'centered';
  
  return {
    type: 'system-hero',
    variant,
    data: {
      heading: settings.heading || settings.title || 'Welcome',
      subheading: settings.text || settings.description || '',
      buttonText: settings.button_label || settings.cta_text || 'Shop Now',
      buttonLink: settings.button_link || '/',
      backgroundImage: settings.image || settings.background_image || '',
      overlayOpacity: parseFloat(settings.image_overlay_opacity || '0.3'),
      textAlign: settings.desktop_content_alignment || 'left',
      textColor: settings.text_color || '#ffffff',
      showButton: settings.button_label !== undefined
    },
    order,
    warnings
  };
}

function mapCollectionSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  return {
    type: 'system-collection',
    variant: 'featured-collection',
    data: {
      heading: settings.title || settings.heading || 'Featured Products',
      subheading: settings.description || '',
      collectionId: settings.collection || '',
      productsToShow: parseInt(settings.products_to_show || '4'),
      columns: parseInt(settings.columns_desktop || '4'),
      showViewAll: settings.show_view_all !== false,
      buttonText: settings.view_all_text || 'View all',
      backgroundColor: settings.background_color || '#ffffff'
    },
    order,
    warnings
  };
}

function mapFeaturedProductSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  return {
    type: 'system-collection',
    variant: 'featured-product',
    data: {
      heading: settings.title || 'Featured Product',
      productId: settings.product || '',
      showGallery: settings.enable_image_zoom !== false,
      showDescription: settings.enable_description !== false,
      backgroundColor: settings.background_color || '#f9fafb'
    },
    order,
    warnings
  };
}

function mapLayoutSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  const blocks = schema?.blocks || [];
  
  return {
    type: 'system-layout',
    variant: 'multicolumn',
    data: {
      heading: settings.title || settings.heading || '',
      subheading: settings.description || '',
      columns: blocks.length || parseInt(settings.columns || '3'),
      blocks: blocks.map((block: any) => ({
        heading: block.settings?.title || '',
        text: block.settings?.text || '',
        icon: block.settings?.image || '',
        link: block.settings?.link || ''
      })),
      backgroundColor: settings.background_color || '#ffffff'
    },
    order,
    warnings
  };
}

function mapContactSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  if (settings.newsletter_enable || schema?.name?.toLowerCase().includes('newsletter')) {
    return {
      type: 'system-footer',
      variant: 'newsletter',
      data: {
        heading: settings.heading || 'Stay in the loop',
        subheading: settings.text || 'Subscribe to our newsletter',
        buttonText: settings.button_label || 'Subscribe',
        backgroundColor: settings.background_color || '#f3f4f6'
      },
      order,
      warnings
    };
  }
  
  return {
    type: 'system-contact',
    variant: 'form',
    data: {
      heading: settings.title || 'Get in touch',
      showEmail: true,
      showPhone: settings.show_phone !== false,
      backgroundColor: settings.background_color || '#ffffff'
    },
    order,
    warnings
  };
}

function mapGallerySection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  const blocks = schema?.blocks || [];
  
  return {
    type: 'system-gallery',
    variant: 'grid',
    data: {
      heading: settings.title || '',
      images: blocks.map((block: any) => ({
        url: block.settings?.image || '',
        caption: block.settings?.caption || ''
      })),
      columns: parseInt(settings.columns_desktop || '3'),
      backgroundColor: settings.background_color || '#ffffff'
    },
    order,
    warnings
  };
}

/**
 * Extract settings from schema
 */
function extractSettings(schema: any): Record<string, any> {
  if (!schema?.settings) return {};
  
  const settings: Record<string, any> = {};
  
  schema.settings.forEach((setting: any) => {
    if (setting.id && setting.default !== undefined) {
      settings[setting.id] = setting.default;
    }
  });
  
  return settings;
}

/**
 * Extract menu items from header settings
 */
function extractMenuItems(settings: Record<string, any>): any[] {
  const menu = settings.menu || settings.main_linklist;
  
  // This would need to reference actual menu data from Shopify
  // For now, return default structure
  return [
    { label: 'Shop', link: '/collections/all' },
    { label: 'About', link: '/pages/about' },
    { label: 'Contact', link: '/pages/contact' }
  ];
}

/**
 * Extract footer columns from settings
 */
function extractFooterColumns(settings: Record<string, any>): any[] {
  const columns: any[] = [];
  
  // Check for column settings (common in Shopify themes)
  for (let i = 1; i <= 4; i++) {
    const heading = settings[`footer_column_${i}_heading`];
    const menu = settings[`footer_column_${i}_menu`];
    
    if (heading || menu) {
      columns.push({
        heading: heading || `Column ${i}`,
        links: [] // Would need to extract from menu data
      });
    }
  }
  
  // Default columns if none found
  if (columns.length === 0) {
    columns.push(
      { heading: 'Shop', links: [] },
      { heading: 'About', links: [] },
      { heading: 'Support', links: [] }
    );
  }
  
  return columns;
}

/**
 * Generate complete block mapping from all sections
 */
export function generateBlockMapping(sections: Record<string, ParsedSection>): MappedBlock[] {
  const blocks: MappedBlock[] = [];
  let order = 0;
  
  // Priority order for common sections
  const prioritySections = ['header', 'announcement', 'hero', 'banner', 'slideshow'];
  const footerSections = ['footer'];
  const processedFiles = new Set<string>();
  
  // 1. Process priority sections first (header, hero)
  prioritySections.forEach(priority => {
    Object.entries(sections).forEach(([filename, section]) => {
      if (filename.toLowerCase().includes(priority) && !processedFiles.has(filename)) {
        blocks.push(mapSectionToBlock(filename, section, order++));
        processedFiles.add(filename);
      }
    });
  });
  
  // 2. Process middle sections (content)
  Object.entries(sections).forEach(([filename, section]) => {
    const isFooter = footerSections.some(f => filename.toLowerCase().includes(f));
    if (!processedFiles.has(filename) && !isFooter) {
      blocks.push(mapSectionToBlock(filename, section, order++));
      processedFiles.add(filename);
    }
  });
  
  // 3. Process footer sections last
  Object.entries(sections).forEach(([filename, section]) => {
    if (!processedFiles.has(filename)) {
      blocks.push(mapSectionToBlock(filename, section, order++));
      processedFiles.add(filename);
    }
  });
  
  return blocks;
}

/**
 * Get mapping suggestions for review
 */
export function getSectionMappingSuggestions(sections: Record<string, ParsedSection>): SectionMapping[] {
  const suggestions: SectionMapping[] = [];
  
  Object.entries(sections).forEach(([filename, section]) => {
    const sectionType = detectSectionType(filename, section);
    let nexusOSBlock = 'system-layout';
    let confidence: 'high' | 'medium' | 'low' = 'low';
    
    switch (sectionType) {
      case 'header':
        nexusOSBlock = 'system-header';
        confidence = 'high';
        break;
      case 'footer':
        nexusOSBlock = 'system-footer';
        confidence = 'high';
        break;
      case 'hero':
        nexusOSBlock = 'system-hero';
        confidence = 'high';
        break;
      case 'collection':
        nexusOSBlock = 'system-collection';
        confidence = 'high';
        break;
      case 'layout':
        nexusOSBlock = 'system-layout';
        confidence = 'medium';
        break;
      default:
        confidence = 'low';
    }
    
    suggestions.push({
      shopifySection: filename,
      nexusOSBlock,
      confidence,
      notes: sectionType === 'custom' ? 'May require manual adjustment' : undefined
    });
  });
  
  return suggestions;
}
