// Shopify Section Mapper
// Converts Shopify Liquid sections to WebPilot page sections

interface ShopifySection {
  type: string;
  blocks?: { [key: string]: any };
  block_order?: string[];
  settings: any;
  disabled?: boolean;
}

interface WebPilotSection {
  id: string;
  type: string;
  order: number;
  data: any;
}

/**
 * Map Shopify image-banner to WebPilot Hero
 */
function mapImageBanner(section: ShopifySection, order: number): WebPilotSection {
  const blocks = section.blocks || {};
  const heading = Object.values(blocks).find((b: any) => b.type === 'heading');
  const buttons = Object.values(blocks).find((b: any) => b.type === 'buttons');
  
  return {
    id: `hero-${order}`,
    type: 'hero',
    order,
    data: {
      style: 'impact',
      heading: heading?.settings?.heading || '',
      subheading: '',
      backgroundImage: section.settings.image || '',
      ctaText: buttons?.settings?.button_label_1 || '',
      ctaLink: buttons?.settings?.button_link_1 || '',
      alignment: section.settings.desktop_content_alignment || 'center',
      height: section.settings.image_height === 'large' ? 'full' : 'medium',
    },
  };
}

/**
 * Map Shopify featured-product to WebPilot ProductShowcase
 */
function mapFeaturedProduct(section: ShopifySection, order: number): WebPilotSection {
  return {
    id: `product-showcase-${order}`,
    type: 'product-showcase',
    order,
    data: {
      productId: section.settings.product || '',
      showVariants: !section.settings.hide_variants,
      mediaPosition: section.settings.media_position || 'left',
      enableZoom: section.settings.image_zoom === 'lightbox',
    },
  };
}

/**
 * Map Shopify featured-collection to WebPilot ProductGrid
 */
function mapFeaturedCollection(section: ShopifySection, order: number): WebPilotSection {
  return {
    id: `product-grid-${order}`,
    type: 'product-grid',
    order,
    data: {
      title: section.settings.title || section.settings.heading || '',
      collectionId: section.settings.collection || '',
      productsToShow: section.settings.products_to_show || 8,
      columns: section.settings.columns_desktop || 4,
      showViewAll: section.settings.show_view_all || false,
      cardStyle: section.settings.image_shape === 'circle' ? 'modern' : 'classic',
    },
  };
}

/**
 * Map Shopify image-with-text to WebPilot ImageText
 */
function mapImageWithText(section: ShopifySection, order: number): WebPilotSection {
  const blocks = section.blocks || {};
  const heading = Object.values(blocks).find((b: any) => b.type === 'heading');
  const text = Object.values(blocks).find((b: any) => b.type === 'text');
  const button = Object.values(blocks).find((b: any) => b.type === 'button');
  
  return {
    id: `image-text-${order}`,
    type: 'image-text',
    order,
    data: {
      image: section.settings.image || '',
      heading: heading?.settings?.heading || '',
      text: text?.settings?.text || '',
      buttonText: button?.settings?.button_label || '',
      buttonLink: button?.settings?.button_link || '',
      imagePosition: section.settings.layout === 'image_first' ? 'left' : 'right',
      contentAlignment: section.settings.desktop_content_alignment || 'left',
    },
  };
}

/**
 * Map Shopify rich-text to WebPilot RichText
 */
function mapRichText(section: ShopifySection, order: number): WebPilotSection {
  const blocks = section.blocks || {};
  const heading = Object.values(blocks).find((b: any) => b.type === 'heading');
  const text = Object.values(blocks).find((b: any) => b.type === 'text');
  
  return {
    id: `rich-text-${order}`,
    type: 'rich-text',
    order,
    data: {
      heading: heading?.settings?.heading || '',
      content: text?.settings?.text || '',
      alignment: section.settings.content_alignment || 'center',
    },
  };
}

/**
 * Map Shopify multirow to WebPilot ImageTextGrid
 */
function mapMultirow(section: ShopifySection, order: number): WebPilotSection {
  const blocks = section.blocks || {};
  const blockOrder = section.block_order || [];
  
  const rows = blockOrder
    .filter(id => blocks[id]?.type === 'row' && !blocks[id]?.disabled)
    .map(id => {
      const row = blocks[id].settings;
      return {
        image: row.image || '',
        heading: row.heading || '',
        text: row.text || '',
        buttonText: row.button_label || '',
        buttonLink: row.button_link || '',
      };
    });
  
  return {
    id: `image-text-grid-${order}`,
    type: 'image-text-grid',
    order,
    data: {
      rows,
      layout: section.settings.image_layout || 'alternate-left',
    },
  };
}

/**
 * Map Shopify collection-list to WebPilot CollectionGrid
 */
function mapCollectionList(section: ShopifySection, order: number): WebPilotSection {
  const blocks = section.blocks || {};
  const blockOrder = section.block_order || [];
  
  const collections = blockOrder
    .filter(id => blocks[id]?.type === 'featured_collection')
    .map(id => blocks[id].settings.collection);
  
  return {
    id: `collection-grid-${order}`,
    type: 'collection-grid',
    order,
    data: {
      title: section.settings.title || '',
      collectionIds: collections,
      columns: section.settings.columns_desktop || 3,
    },
  };
}

/**
 * Map Shopify multicolumn to WebPilot Features
 */
function mapMulticolumn(section: ShopifySection, order: number): WebPilotSection {
  const blocks = section.blocks || {};
  const blockOrder = section.block_order || [];
  
  const columns = blockOrder
    .filter(id => blocks[id]?.type === 'column')
    .map(id => {
      const col = blocks[id].settings;
      return {
        icon: col.image || '',
        title: col.title || '',
        description: col.text || '',
        link: col.link || '',
      };
    });
  
  return {
    id: `features-${order}`,
    type: 'features',
    order,
    data: {
      title: section.settings.title || '',
      columns,
      columnsPerRow: section.settings.columns_desktop || 3,
    },
  };
}

/**
 * Map Shopify newsletter to WebPilot EmailSignup
 */
function mapNewsletter(section: ShopifySection, order: number): WebPilotSection {
  const blocks = section.blocks || {};
  const heading = Object.values(blocks).find((b: any) => b.type === 'heading');
  const paragraph = Object.values(blocks).find((b: any) => b.type === 'paragraph');
  
  return {
    id: `email-signup-${order}`,
    type: 'email-signup',
    order,
    data: {
      heading: heading?.settings?.heading || 'Stay Updated',
      description: paragraph?.settings?.text || 'Subscribe to our newsletter',
      buttonText: 'Subscribe',
    },
  };
}

/**
 * Map Shopify video to WebPilot VideoEmbed
 */
function mapVideo(section: ShopifySection, order: number): WebPilotSection {
  return {
    id: `video-${order}`,
    type: 'video',
    order,
    data: {
      videoUrl: section.settings.video_url || '',
      coverImage: section.settings.cover_image || '',
      heading: section.settings.heading || '',
    },
  };
}

/**
 * Map Shopify slideshow to WebPilot Hero (with multiple slides)
 */
function mapSlideshow(section: ShopifySection, order: number): WebPilotSection {
  const blocks = section.blocks || {};
  const blockOrder = section.block_order || [];
  
  const slides = blockOrder
    .filter(id => blocks[id]?.type === 'slide')
    .map(id => {
      const slide = blocks[id].settings;
      return {
        image: slide.image || '',
        heading: slide.heading || '',
        subheading: slide.subheading || '',
        buttonText: slide.button_label || '',
        buttonLink: slide.button_link || '',
      };
    });
  
  // For now, just use first slide (can enhance with carousel later)
  const firstSlide = slides[0] || {};
  
  return {
    id: `hero-${order}`,
    type: 'hero',
    order,
    data: {
      style: 'impact',
      heading: firstSlide.heading || '',
      subheading: firstSlide.subheading || '',
      backgroundImage: firstSlide.image || '',
      ctaText: firstSlide.buttonText || '',
      ctaLink: firstSlide.buttonLink || '',
      carousel: slides.length > 1 ? slides : undefined,
    },
  };
}

/**
 * Main section mapper - converts any Shopify section to WebPilot format
 */
export function mapShopifySection(
  sectionId: string,
  section: ShopifySection,
  order: number
): WebPilotSection | null {
  // Skip disabled sections
  if (section.disabled) return null;
  
  const mappers: { [key: string]: (s: ShopifySection, o: number) => WebPilotSection } = {
    'image-banner': mapImageBanner,
    'featured-product': mapFeaturedProduct,
    'featured-collection': mapFeaturedCollection,
    'image-with-text': mapImageWithText,
    'rich-text': mapRichText,
    'multirow': mapMultirow,
    'collection-list': mapCollectionList,
    'multicolumn': mapMulticolumn,
    'newsletter': mapNewsletter,
    'email-signup-banner': mapNewsletter,
    'video': mapVideo,
    'slideshow': mapSlideshow,
  };
  
  const mapper = mappers[section.type];
  if (!mapper) {
    console.warn(`No mapper for section type: ${section.type}`);
    return null;
  }
  
  return mapper(section, order);
}

/**
 * Convert entire Shopify template to WebPilot page sections
 */
export function convertShopifyTemplate(template: {
  sections: { [key: string]: ShopifySection };
  order?: string[];
}): WebPilotSection[] {
  const sectionOrder = template.order || Object.keys(template.sections);
  const webpilotSections: WebPilotSection[] = [];
  
  sectionOrder.forEach((sectionId, index) => {
    const section = template.sections[sectionId];
    if (!section) return;
    
    const mapped = mapShopifySection(sectionId, section, index);
    if (mapped) {
      webpilotSections.push(mapped);
    }
  });
  
  return webpilotSections;
}

/**
 * Generate conversion report
 */
export function generateConversionReport(template: {
  sections: { [key: string]: ShopifySection };
  order?: string[];
}): {
  totalSections: number;
  convertedSections: number;
  skippedSections: number;
  unsupportedTypes: string[];
} {
  const sectionOrder = template.order || Object.keys(template.sections);
  let converted = 0;
  let skipped = 0;
  const unsupportedTypes = new Set<string>();
  
  sectionOrder.forEach(sectionId => {
    const section = template.sections[sectionId];
    if (!section || section.disabled) {
      skipped++;
      return;
    }
    
    const mapped = mapShopifySection(sectionId, section, 0);
    if (mapped) {
      converted++;
    } else {
      unsupportedTypes.add(section.type);
      skipped++;
    }
  });
  
  return {
    totalSections: sectionOrder.length,
    convertedSections: converted,
    skippedSections: skipped,
    unsupportedTypes: Array.from(unsupportedTypes),
  };
}
