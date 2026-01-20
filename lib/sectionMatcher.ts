/**
 * Maps Shopify theme sections to WebPilot block types
 */

import { ParsedSection } from './shopifyThemeParser';
import { TemplateSection } from './shopifyTemplateParser';

export interface SectionMapping {
  shopifySection: string;
  webpilotBlock: string;
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
 * Generate block mapping using actual template data
 */
export function generateBlockMappingFromTemplate(
  templateSections: TemplateSection[],
  liquidSections: Record<string, ParsedSection>
): MappedBlock[] {
  const blocks: MappedBlock[] = [];
  
  templateSections.forEach((templateSection, index) => {
    const liquidSection = liquidSections[`${templateSection.type}.liquid`];
    
    // Map section using both template data (real values) and liquid (schema)
    const block = mapSectionWithTemplateData(
      templateSection.type,
      templateSection,
      liquidSection,
      index
    );
    
    if (block.type !== 'skip') {
      blocks.push(block);
    }
  });
  
  return blocks;
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
  
  // Announcement bar
  if (name.includes('announcement')) {
    return 'announcement';
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
    name.includes('collection_list') ||
    name.includes('product-grid') ||
    name.includes('product_grid') ||
    name.includes('main-collection')
  ) {
    return 'collection';
  }
  
  // Featured product or main product
  if (name.includes('featured-product') || name.includes('featured_product') || name.includes('main-product')) {
    return 'featured-product';
  }
  
  // Blog
  if (name.includes('blog') || name.includes('article')) {
    return 'blog';
  }
  
  // Multi-column / features / image-with-text
  if (
    name.includes('multicolumn') ||
    name.includes('multi-column') ||
    name.includes('multirow') ||
    name.includes('features') ||
    name.includes('rich-text') ||
    name.includes('image-with-text') ||
    name.includes('collapsible')
  ) {
    return 'layout';
  }
  
  // Contact form / newsletter
  if (name.includes('contact') || name.includes('newsletter') || name.includes('email-signup')) {
    return 'contact';
  }
  
  // Video
  if (name.includes('video')) {
    return 'video';
  }
  
  // Gallery/images/collage
  if (name.includes('gallery') || name.includes('collage')) {
    return 'gallery';
  }
  
  // Cart sections - skip these as they're functional, not content
  if (name.includes('cart') || name.includes('quick-order')) {
    return 'skip';
  }
  
  // Main template sections - skip these as they're page templates
  if (name.startsWith('main-') && !name.includes('product') && !name.includes('collection') && !name.includes('blog')) {
    return 'skip';
  }
  
  // Apps, pickup, predictive search - skip functional sections
  if (name.includes('apps') || name.includes('pickup') || name.includes('predictive') || name.includes('quick-order')) {
    return 'skip';
  }
  
  return 'custom';
}

/**
 * Map section using template data (real configured values)
 */
export function mapSectionWithTemplateData(
  sectionType: string,
  templateSection: TemplateSection,
  liquidSection: ParsedSection | undefined,
  order: number
): MappedBlock {
  const warnings: string[] = [];
  const settings = templateSection.settings;
  const blocks = templateSection.blocks || [];
  
  const detectedType = detectSectionType(sectionType, liquidSection || { liquidContent: '' });
  
  // Skip functional sections
  if (detectedType === 'skip') {
    return {
      type: 'skip',
      variant: 'skip',
      data: {},
      order: -1,
      warnings: [`Skipped functional section: ${sectionType}`]
    };
  }
  
  // Map based on detected type
  switch (detectedType) {
    case 'header':
      return {
        type: 'system-header',
        variant: 'minimal',
        data: {
          logoText: settings.logo_text || '',
          showSearch: true,
          showCart: true,
          sticky: true
        },
        order,
        warnings
      };
    
    case 'footer':
      return {
        type: 'system-footer',
        variant: 'standard',
        data: {
          backgroundColor: settings.background_color || '#000000',
          textColor: settings.text_color || '#ffffff'
        },
        order,
        warnings
      };
    
    case 'announcement':
      const announcementBlock = blocks.find(b => b.type === 'heading' || b.type === 'text');
      return {
        type: 'system-promo-banner',
        variant: 'slide',
        data: {
          text: announcementBlock?.settings.heading || announcementBlock?.settings.text || 'Special Offer!',
          backgroundColor: settings.color_scheme || '#000000',
          textColor: '#ffffff',
          linkUrl: announcementBlock?.settings.link || '',
          linkText: announcementBlock?.settings.link_text || ''
        },
        order,
        warnings
      };
    
    case 'hero':
      const heroHeading = blocks.find(b => b.type === 'heading');
      const heroText = blocks.find(b => b.type === 'text');
      const heroButton = blocks.find(b => b.type === 'buttons' || b.type === 'button');
      
      return {
        type: 'system-hero',
        variant: settings.desktop_content_position?.includes('center') ? 'centered' : 'split',
        data: {
          heading: heroHeading?.settings.heading || 'Welcome',
          subheading: heroText?.settings.text?.replace(/<[^>]*>/g, '') || '',
          buttonText: heroButton?.settings.button_label || heroButton?.settings.button_label_1 || 'Shop Now',
          buttonLink: heroButton?.settings.button_link || heroButton?.settings.button_link_1 || '/',
          backgroundImage: settings.image || '',
          overlayOpacity: (settings.image_overlay_opacity || 40) / 100,
          textAlign: settings.desktop_content_alignment || 'left',
          textColor: '#ffffff',
          showButton: !!heroButton && !heroButton.disabled
        },
        order,
        warnings
      };
    
    case 'collection':
      return {
        type: 'system-collection',
        variant: 'featured-collection',
        data: {
          heading: settings.title || settings.heading || 'Featured Products',
          subheading: settings.description || '',
          collectionId: settings.collection || '',
          productsToShow: parseInt(settings.products_to_show || '4'),
          columns: parseInt(settings.columns_desktop || '4'),
          showViewAll: settings.show_view_all !== false
        },
        order,
        warnings
      };
    
    case 'layout':
      // Handle multirow/multicolumn sections with actual content
      const layoutBlocks = blocks.map(block => ({
        heading: block.settings.heading || block.settings.title || '',
        text: block.settings.text?.replace(/<[^>]*>/g, '') || '',
        image: block.settings.image || '',
        buttonLabel: block.settings.button_label || '',
        buttonLink: block.settings.button_link || ''
      }));
      
      return {
        type: 'system-layout',
        variant: sectionType.includes('multicolumn') ? 'columns' : 'rows',
        data: {
          heading: settings.title || '',
          columns: parseInt(settings.columns_desktop || '3'),
          items: layoutBlocks
        },
        order,
        warnings
      };
    
    case 'contact':
      return {
        type: 'system-contact',
        variant: 'form',
        data: {
          heading: settings.heading || 'Get in Touch',
          subheading: settings.subheading || ''
        },
        order,
        warnings
      };
    
    case 'blog':
      return {
        type: 'system-blog',
        variant: 'grid',
        data: {
          heading: settings.heading || settings.title || 'Latest Posts',
          blogHandle: settings.blog || '',
          postsToShow: parseInt(settings.post_limit || '3'),
          showImage: settings.show_image !== false,
          showDate: settings.show_date !== false
        },
        order,
        warnings
      };
    
    case 'video':
      return {
        type: 'system-video',
        variant: 'embed',
        data: {
          heading: settings.heading || '',
          videoUrl: settings.video_url || '',
          coverImage: settings.cover_image || ''
        },
        order,
        warnings
      };
    
    default:
      warnings.push(`Unknown section type: ${sectionType}. Creating generic block.`);
      return {
        type: 'system-layout',
        variant: 'blank',
        data: {
          sectionName: sectionType,
          rawSettings: settings
        },
        order,
        warnings
      };
  }
}

/**
 * Map Shopify section to WebPilot block (legacy - uses schema only)
 */
export function mapSectionToBlock(
  filename: string,
  section: ParsedSection,
  order: number
): MappedBlock {
  const sectionType = detectSectionType(filename, section);
  const schema = section.schema;
  const warnings: string[] = [];
  
  // Skip functional sections
  if (sectionType === 'skip') {
    return {
      type: 'skip',
      variant: 'skip',
      data: {},
      order: -1,
      warnings: [`Skipped functional section: ${filename}`]
    };
  }
  
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
    
    case 'announcement':
      return mapAnnouncementSection(schema, order, warnings);
    
    case 'blog':
      return mapBlogSection(schema, order, warnings);
    
    case 'video':
      return mapVideoSection(schema, order, warnings);
    
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

function mapAnnouncementSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  return {
    type: 'system-promo-banner',
    variant: 'slide',
    data: {
      text: settings.text || settings.announcement_text || 'Special Offer!',
      backgroundColor: settings.background_color || '#000000',
      textColor: settings.text_color || '#ffffff',
      linkUrl: settings.link || '',
      linkText: settings.link_text || ''
    },
    order,
    warnings
  };
}

function mapBlogSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  return {
    type: 'system-blog',
    variant: 'grid',
    data: {
      heading: settings.heading || settings.title || 'Latest Posts',
      subheading: settings.subheading || '',
      blogHandle: settings.blog || '',
      postsToShow: parseInt(settings.post_limit || '3'),
      showImage: settings.show_image !== false,
      showDate: settings.show_date !== false,
      showAuthor: settings.show_author !== false
    },
    order,
    warnings
  };
}

function mapVideoSection(schema: any, order: number, warnings: string[]): MappedBlock {
  const settings = extractSettings(schema);
  
  return {
    type: 'system-video',
    variant: 'embed',
    data: {
      heading: settings.heading || settings.title || '',
      videoUrl: settings.video_url || settings.url || '',
      coverImage: settings.cover_image || '',
      autoplay: settings.enable_video_looping !== false,
      fullWidth: settings.full_width === true
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
        const block = mapSectionToBlock(filename, section, order++);
        if (block.type !== 'skip') {
          blocks.push(block);
        }
        processedFiles.add(filename);
      }
    });
  });
  
  // 2. Process middle sections (content)
  Object.entries(sections).forEach(([filename, section]) => {
    const isFooter = footerSections.some(f => filename.toLowerCase().includes(f));
    if (!processedFiles.has(filename) && !isFooter) {
      const block = mapSectionToBlock(filename, section, order++);
      if (block.type !== 'skip') {
        blocks.push(block);
      }
      processedFiles.add(filename);
    }
  });
  
  // 3. Process footer sections last
  Object.entries(sections).forEach(([filename, section]) => {
    if (!processedFiles.has(filename)) {
      const block = mapSectionToBlock(filename, section, order++);
      if (block.type !== 'skip') {
        blocks.push(block);
      }
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
