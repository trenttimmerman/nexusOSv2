// Shopify Section → WebPilot Upgrade Mapper
// Maps unsupported Shopify sections to better WebPilot alternatives

interface UpgradeOption {
  id: string;
  variant: string;
  name: string;
  description: string;
  recommended?: boolean;
  upgrades: string[];
  contentMapping: (shopifyData: any) => any;
}

interface UpgradeMapping {
  shopifyType: string;
  message: string;
  emoji: string;
  options: UpgradeOption[];
}

/**
 * Extract collapsible/FAQ content from Shopify blocks
 */
function extractCollapsibleBlocks(blocks: any): Array<{ question: string; answer: string }> {
  if (!blocks) return [];
  
  return Object.values(blocks)
    .filter((block: any) => block.type === 'collapsible_row')
    .map((block: any) => ({
      question: block.settings?.heading || 'Question',
      answer: block.settings?.row_content || 'Answer'
    }));
}

/**
 * Extract text content from rich text blocks
 */
function extractRichTextContent(blocks: any, settings: any): string {
  if (settings?.text) return settings.text;
  if (settings?.content) return settings.content;
  
  // Try to extract from blocks
  const textBlocks = Object.values(blocks || {})
    .filter((block: any) => block.type === 'text' || block.type === 'caption')
    .map((block: any) => block.settings?.text || block.settings?.caption || '');
  
  return textBlocks.join('\n\n');
}

/**
 * Extract heading from blocks or settings
 */
function extractHeading(blocks: any, settings: any): string {
  if (settings?.heading) return settings.heading;
  if (settings?.title) return settings.title;
  if (settings?.caption) return settings.caption;
  
  const headingBlock = Object.values(blocks || {}).find((block: any) => 
    block.type === 'heading' || block.type === 'title'
  ) as any;
  
  return headingBlock?.settings?.heading || headingBlock?.settings?.title || '';
}

/**
 * Master upgrade mappings for all Shopify section types
 */
export const UPGRADE_MAPPINGS: Record<string, UpgradeMapping> = {
  
  // ============ COLLAPSIBLE CONTENT ============
  'collapsible-content': {
    shopifyType: 'collapsible-content',
    message: "We can build a better FAQ section!",
    emoji: "🎨",
    options: [
      {
        id: 'system-collapsible',
        variant: 'modern-cards',
        name: 'Modern FAQ Cards',
        description: 'Beautiful card-based accordion with smooth animations',
        recommended: true,
        upgrades: [
          'Smooth expand/collapse animations',
          'Search functionality',
          'Icon customization',
          'Mobile optimized',
          'Better visual hierarchy'
        ],
        contentMapping: (shopifyData) => ({
          heading: shopifyData.settings?.caption || shopifyData.settings?.heading || 'Frequently Asked Questions',
          items: extractCollapsibleBlocks(shopifyData.blocks),
          backgroundColor: '#ffffff',
          cardBgColor: '#fafafa'
        })
      },
      {
        id: 'system-collapsible',
        variant: 'minimal',
        name: 'Minimal Accordion',
        description: 'Clean, simple accordion similar to your original',
        upgrades: [
          'Clean minimal design',
          'Fast loading',
          'Familiar layout',
          'Easy to customize'
        ],
        contentMapping: (shopifyData) => ({
          heading: shopifyData.settings?.caption || 'FAQs',
          items: extractCollapsibleBlocks(shopifyData.blocks),
          backgroundColor: '#ffffff'
        })
      }
    ]
  },

  // ============ CONTACT FORM ============
  'contact-form': {
    shopifyType: 'contact-form',
    message: "Upgrade to our smart contact form!",
    emoji: "✨",
    options: [
      {
        id: 'system-contact',
        variant: 'modern',
        name: 'Enhanced Contact Form',
        description: 'Feature-rich contact form with smart routing',
        recommended: true,
        upgrades: [
          'Built-in spam protection',
          'Auto-responder emails',
          'Department routing',
          'File upload support',
          'Better mobile UX',
          'Form validation'
        ],
        contentMapping: (shopifyData) => ({
          heading: shopifyData.settings?.heading || 'Contact Us',
          subheading: shopifyData.settings?.subheading || 'We\'d love to hear from you',
          showPhone: true,
          showEmail: true,
          showMessage: true
        })
      }
    ]
  },

  // ============ APPS (Generic) ============
  'apps': {
    shopifyType: 'apps',
    message: "Let's rebuild this with native features!",
    emoji: "🚀",
    options: [
      {
        id: 'system-rich-text',
        variant: 'rt-centered',
        name: 'Rich Content Section',
        description: 'Flexible content block with rich formatting',
        recommended: true,
        upgrades: [
          'No external app needed',
          'Built-in functionality',
          'Save app subscription fees',
          'Faster page loading',
          'Full control over design'
        ],
        contentMapping: (shopifyData) => ({
          heading: 'App Features',
          content: 'This section contained a Shopify app. You can rebuild it with our native components or add custom HTML.',
          textAlign: 'center'
        })
      }
    ]
  },

  // ============ CUSTOM LIQUID ============
  'custom-liquid': {
    shopifyType: 'custom-liquid',
    message: "We can recreate this with drag-and-drop!",
    emoji: "🎯",
    options: [
      {
        id: 'system-rich-text',
        variant: 'rt-wide',
        name: 'Rich Text Section',
        description: 'Powerful text editor with formatting options',
        recommended: true,
        upgrades: [
          'No code needed',
          'Easy to edit',
          'Mobile responsive',
          'Better performance',
          'Visual editor'
        ],
        contentMapping: (shopifyData) => ({
          heading: extractHeading(shopifyData.blocks, shopifyData.settings),
          content: extractRichTextContent(shopifyData.blocks, shopifyData.settings) || 
                   'Custom content from your Shopify theme',
          textAlign: 'left',
          maxWidth: 'max-w-6xl'
        })
      }
    ]
  },

  // ============ ANNOUNCEMENT BAR ============
  'announcement-bar': {
    shopifyType: 'announcement-bar',
    message: "Upgrade to our modern promo banner!",
    emoji: "📢",
    options: [
      {
        id: 'system-promo',
        variant: 'promo-minimal',
        name: 'Modern Promo Banner',
        description: 'Eye-catching promotional banner',
        recommended: true,
        upgrades: [
          'Customizable colors',
          'Icon support',
          'Link integration',
          'Dismissible option',
          'Better animations'
        ],
        contentMapping: (shopifyData) => ({
          text: shopifyData.settings?.text || shopifyData.settings?.announcement || 'Special Offer',
          link: shopifyData.settings?.link || '/',
          backgroundColor: shopifyData.settings?.color_scheme?.background || '#000000',
          textColor: shopifyData.settings?.color_scheme?.text || '#ffffff'
        })
      }
    ]
  },

  // ============ EMAIL SIGNUP BANNER ============
  'email-signup-banner': {
    shopifyType: 'email-signup-banner',
    message: "Build a beautiful email signup!",
    emoji: "💌",
    options: [
      {
        id: 'system-email',
        variant: 'email-modern',
        name: 'Modern Email Signup',
        description: 'Conversion-optimized email capture',
        recommended: true,
        upgrades: [
          'Spam protection',
          'Auto-welcome emails',
          'Success animations',
          'GDPR compliant',
          'A/B testing ready',
          'Better conversion rates'
        ],
        contentMapping: (shopifyData) => ({
          heading: shopifyData.settings?.heading || 'Join our newsletter',
          subheading: shopifyData.settings?.subheading || 'Get exclusive offers and updates',
          placeholder: shopifyData.settings?.placeholder || 'Enter your email',
          buttonText: shopifyData.settings?.button_text || 'Subscribe'
        })
      }
    ]
  },

  // ============ FEATURED BLOG ============
  'featured-blog': {
    shopifyType: 'featured-blog',
    message: "Let's make your blog stand out!",
    emoji: "📝",
    options: [
      {
        id: 'system-blog',
        variant: 'blog-magazine',
        name: 'Magazine-Style Blog',
        description: 'Beautiful blog layout with featured images',
        recommended: true,
        upgrades: [
          'Featured images',
          'Category filtering',
          'Read time estimates',
          'Social sharing buttons',
          'Author bios',
          'Related posts'
        ],
        contentMapping: (shopifyData) => ({
          heading: shopifyData.settings?.heading || 'From the Blog',
          blogHandle: shopifyData.settings?.blog || 'news',
          postCount: shopifyData.settings?.post_limit || 3,
          showExcerpt: true,
          showDate: true,
          showAuthor: true
        })
      },
      {
        id: 'system-blog',
        variant: 'blog-grid',
        name: 'Blog Grid',
        description: 'Pinterest-style blog grid layout',
        upgrades: [
          'Masonry grid layout',
          'Infinite scroll',
          'Quick preview on hover',
          'Tag filtering'
        ],
        contentMapping: (shopifyData) => ({
          heading: shopifyData.settings?.heading || 'Latest Posts',
          blogHandle: shopifyData.settings?.blog || 'news',
          postCount: shopifyData.settings?.post_limit || 6,
          layout: 'grid'
        })
      }
    ]
  },

  // ============ COLLAGE ============
  'collage': {
    shopifyType: 'collage',
    message: "Create a stunning image gallery!",
    emoji: "🖼️",
    options: [
      {
        id: 'system-gallery',
        variant: 'gallery-masonry',
        name: 'Masonry Gallery',
        description: 'Pinterest-style image gallery',
        recommended: true,
        upgrades: [
          'Responsive masonry layout',
          'Lightbox viewer',
          'Lazy loading',
          'Touch gestures',
          'Caption overlays'
        ],
        contentMapping: (shopifyData) => {
          const blocks = shopifyData.blocks || {};
          const images = Object.values(blocks)
            .filter((b: any) => b.type === 'image')
            .map((b: any) => ({
              url: b.settings?.image || '',
              caption: b.settings?.caption || ''
            }));
          
          return {
            heading: shopifyData.settings?.heading || 'Gallery',
            images,
            columns: 3
          };
        }
      }
    ]
  },

  // ============ BULK QUICK ORDER ============
  'bulk-quick-order-list': {
    shopifyType: 'bulk-quick-order-list',
    message: "We have built-in quick order features!",
    emoji: "⚡",
    options: [
      {
        id: 'system-grid',
        variant: 'modern',
        name: 'Quick Order Grid',
        description: 'Product grid with quick add to cart',
        recommended: true,
        upgrades: [
          'Quick add to cart',
          'Quantity selectors',
          'Variant selection',
          'No app required',
          'Faster checkout'
        ],
        contentMapping: (shopifyData) => ({
          heading: 'Quick Order',
          productSource: 'collection',
          columns: 4,
          showQuickAdd: true,
          showPrices: true
        })
      }
    ]
  },

  // ============ CART DRAWER ============
  'cart-drawer': {
    shopifyType: 'cart-drawer',
    message: "We have a built-in cart system!",
    emoji: "🛒",
    options: [
      {
        id: 'skip',
        variant: 'skip',
        name: 'Use Built-in Cart',
        description: 'WebPilot has a native cart drawer',
        recommended: true,
        upgrades: [
          'Built-in cart functionality',
          'No setup needed',
          'Upsell suggestions',
          'Discount codes',
          'Free shipping meter'
        ],
        contentMapping: () => ({
          message: 'Cart functionality is built into WebPilot'
        })
      }
    ]
  },

  // ============ MULTICOLUMN ============
  'multicolumn': {
    shopifyType: 'multicolumn',
    message: "Build a better features section!",
    emoji: "🎯",
    options: [
      {
        id: 'system-grid',
        variant: 'features-modern',
        name: 'Modern Features Grid',
        description: 'Card-based features with icons',
        recommended: true,
        upgrades: [
          'Icon library included',
          'Hover animations',
          'Better spacing',
          'Mobile responsive',
          'Link to pages'
        ],
        contentMapping: (shopifyData) => {
          const blocks = shopifyData.blocks || {};
          const items = Object.values(blocks)
            .filter((b: any) => b.type === 'column')
            .map((b: any) => ({
              title: b.settings?.title || '',
              text: b.settings?.text || '',
              image: b.settings?.image || ''
            }));
          
          return {
            heading: shopifyData.settings?.title || 'Features',
            items,
            columns: 3
          };
        }
      }
    ]
  },

  // ============ SLIDESHOW ============
  'slideshow': {
    shopifyType: 'slideshow',
    message: "Upgrade to our modern hero carousel!",
    emoji: "🎬",
    options: [
      {
        id: 'system-hero',
        variant: 'impact',
        name: 'Impact Hero',
        description: 'Full-screen hero with parallax',
        recommended: true,
        upgrades: [
          'Parallax scrolling',
          'Video backgrounds',
          'Better animations',
          'Mobile optimized',
          'Faster loading'
        ],
        contentMapping: (shopifyData) => {
          const firstSlide = Object.values(shopifyData.blocks || {})[0] as any;
          return {
            heading: firstSlide?.settings?.heading || 'Welcome',
            subheading: firstSlide?.settings?.subheading || '',
            backgroundImage: firstSlide?.settings?.image || '',
            ctaText: firstSlide?.settings?.button_label || 'Shop Now',
            ctaLink: firstSlide?.settings?.button_link || '/'
          };
        }
      }
    ]
  },

  // ============ VIDEO ============
  'video': {
    shopifyType: 'video',
    message: "Make your video section pop!",
    emoji: "🎥",
    options: [
      {
        id: 'system-video',
        variant: 'video-hero',
        name: 'Video Hero Section',
        description: 'Full-width video with controls',
        recommended: true,
        upgrades: [
          'Auto-play options',
          'Custom controls',
          'Thumbnail preview',
          'Mobile fallback',
          'Better performance'
        ],
        contentMapping: (shopifyData) => ({
          heading: shopifyData.settings?.heading || '',
          videoUrl: shopifyData.settings?.video_url || '',
          coverImage: shopifyData.settings?.cover_image || '',
          autoplay: false
        })
      }
    ]
  }
};

/**
 * Get upgrade options for a Shopify section type
 */
export function getUpgradeOptions(shopifyType: string): UpgradeMapping | null {
  return UPGRADE_MAPPINGS[shopifyType] || null;
}

/**
 * Get recommended option for a section type
 */
export function getRecommendedOption(shopifyType: string): UpgradeOption | null {
  const mapping = UPGRADE_MAPPINGS[shopifyType];
  if (!mapping) return null;
  
  return mapping.options.find(opt => opt.recommended) || mapping.options[0] || null;
}

/**
 * Map Shopify section data to WebPilot component data
 */
export function mapShopifyToWebPilot(
  shopifyType: string,
  shopifyData: any,
  selectedOption?: UpgradeOption
): any {
  const mapping = UPGRADE_MAPPINGS[shopifyType];
  if (!mapping) return null;
  
  const option = selectedOption || getRecommendedOption(shopifyType);
  if (!option) return null;
  
  return option.contentMapping(shopifyData);
}

/**
 * Check if a Shopify section has upgrade options
 */
export function hasUpgradeOptions(shopifyType: string): boolean {
  return !!UPGRADE_MAPPINGS[shopifyType];
}
