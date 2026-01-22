// Shopify Theme Parser
// Converts Shopify Liquid themes to WebPilot design system
// Handles settings_data.json → store_designs table mapping

interface ShopifyColorScheme {
  background: string;
  background_gradient?: string;
  text: string;
  button: string;
  button_label: string;
  secondary_button_label: string;
  shadow: string;
}

interface ShopifySettings {
  logo?: string;
  logo_width?: number;
  favicon?: string;
  type_header_font?: string;
  type_body_font?: string;
  heading_scale?: number;
  body_scale?: number;
  page_width?: number;
  spacing_sections?: number;
  spacing_grid_horizontal?: number;
  spacing_grid_vertical?: number;
  buttons_radius?: number;
  card_corner_radius?: number;
  primary_color?: string;
  secondary_color?: string;
  background_color?: string;
  color_schemes?: {
    [key: string]: {
      settings: ShopifyColorScheme;
    };
  };
  sections?: any;
  [key: string]: any;
}

interface ShopifyThemeData {
  current: ShopifySettings;
  presets?: any;
}

export interface WebPilotStoreDesign {
  name: string;
  is_active: boolean;
  header_style: string;
  header_data: any;
  hero_style: string;
  product_card_style: string;
  footer_style: string;
  scrollbar_style: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  store_type?: string;
  store_vibe: string;
  color_palette?: string;
  typography: {
    headingFont: string;
    bodyFont: string;
    headingColor: string;
    bodyColor: string;
    linkColor: string;
    baseFontSize: string;
    headingScale: string;
    headingWeight: string;
    bodyWeight: string;
  };
}

// Font mapping from Shopify to web-safe fonts
const FONT_MAP: { [key: string]: string } = {
  'assistant_n4': 'Inter',
  'sans-serif': 'Inter',
  'helvetica_n4': 'Helvetica',
  'arial': 'Arial',
  'georgia': 'Georgia',
  'times_new_roman': 'Times New Roman',
  'courier': 'Courier New',
  'verdana': 'Verdana',
  'roboto': 'Roboto',
  'open_sans': 'Open Sans',
  'lato': 'Lato',
  'montserrat': 'Montserrat',
  'poppins': 'Poppins',
  'playfair_display': 'Playfair Display',
};

/**
 * Map Shopify font to web-safe font
 */
function mapFont(shopifyFont: string): string {
  const normalized = shopifyFont.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  return FONT_MAP[normalized] || FONT_MAP[shopifyFont] || 'Inter';
}

/**
 * Extract primary color from Shopify color schemes
 */
function extractPrimaryColor(settings: ShopifySettings): string {
  if (settings.primary_color) return settings.primary_color;
  
  // Try to get from scheme-1 (main scheme)
  const scheme1 = settings.color_schemes?.['scheme-1']?.settings;
  if (scheme1?.button) return scheme1.button;
  
  return '#3b82f6'; // Default blue
}

/**
 * Extract secondary color from Shopify color schemes
 */
function extractSecondaryColor(settings: ShopifySettings): string {
  if (settings.secondary_color) return settings.secondary_color;
  
  // Try to get from scheme-5 (accent scheme)
  const scheme5 = settings.color_schemes?.['scheme-5']?.settings;
  if (scheme5?.background) return scheme5.background;
  
  return '#8B5CF6'; // Default purple
}

/**
 * Extract background color from Shopify color schemes
 */
function extractBackgroundColor(settings: ShopifySettings): string {
  if (settings.background_color) return settings.background_color;
  
  const scheme1 = settings.color_schemes?.['scheme-1']?.settings;
  if (scheme1?.background) return scheme1.background;
  
  return '#FFFFFF';
}

/**
 * Extract text colors from Shopify color schemes
 */
function extractTextColors(settings: ShopifySettings) {
  const scheme1 = settings.color_schemes?.['scheme-1']?.settings;
  
  return {
    headingColor: scheme1?.text || '#000000',
    bodyColor: scheme1?.text || '#737373',
    linkColor: extractPrimaryColor(settings),
  };
}

/**
 * Determine store vibe from Shopify theme settings
 */
function detectStoreVibe(settings: ShopifySettings): string {
  const buttonRadius = settings.buttons_radius || 0;
  const cardRadius = settings.card_corner_radius || 0;
  const animations = settings.animations_reveal_on_scroll;
  
  // Modern: rounded corners + animations
  if (buttonRadius >= 10 && cardRadius >= 10 && animations) {
    return 'modern';
  }
  
  // Minimal: small/no radius, clean
  if (buttonRadius <= 5 && cardRadius <= 5) {
    return 'minimal';
  }
  
  // Playful: large radius
  if (buttonRadius >= 20 || cardRadius >= 20) {
    return 'playful';
  }
  
  return 'minimal';
}

/**
 * Parse settings_data.json and convert to WebPilot store_designs format
 */
export function parseShopifyThemeSettings(
  settingsData: ShopifyThemeData,
  themeName: string = 'Imported from Shopify'
): WebPilotStoreDesign {
  const settings = settingsData.current;
  const textColors = extractTextColors(settings);
  
  return {
    name: themeName,
    is_active: false, // Don't auto-activate, let user review first
    header_style: 'canvas', // Default, will be enhanced in phase 2
    header_data: {},
    hero_style: 'impact',
    product_card_style: settings.card_style === 'card' ? 'modern' : 'classic',
    footer_style: 'columns',
    scrollbar_style: 'native',
    primary_color: extractPrimaryColor(settings),
    secondary_color: extractSecondaryColor(settings),
    background_color: extractBackgroundColor(settings),
    store_vibe: detectStoreVibe(settings),
    typography: {
      headingFont: mapFont(settings.type_header_font || 'Inter'),
      bodyFont: mapFont(settings.type_body_font || 'Inter'),
      headingColor: textColors.headingColor,
      bodyColor: textColors.bodyColor,
      linkColor: textColors.linkColor,
      baseFontSize: '16px',
      headingScale: settings.heading_scale ? `${settings.heading_scale}%` : 'default',
      headingWeight: '700',
      bodyWeight: '400',
    },
  };
}

/**
 * Extract logo and favicon URLs from Shopify settings
 */
export function extractAssets(settings: ShopifySettings): {
  logoUrl?: string;
  faviconUrl?: string;
  logoWidth?: number;
} {
  return {
    logoUrl: settings.logo?.replace('shopify://', ''),
    faviconUrl: settings.favicon?.replace('shopify://', ''),
    logoWidth: settings.logo_width,
  };
}

/**
 * Parse entire theme folder structure
 */
export async function parseShopifyTheme(themeFiles: {
  'config/settings_data.json'?: string;
  'templates/index.json'?: string;
  'templates/product.json'?: string;
  'templates/collection.json'?: string;
  [key: string]: string | undefined;
}): Promise<{
  design: WebPilotStoreDesign;
  assets: { logoUrl?: string; faviconUrl?: string; logoWidth?: number };
  templates: { [key: string]: any };
  sections: string[];
}> {
  // Parse settings_data.json
  const settingsDataRaw = themeFiles['config/settings_data.json'];
  if (!settingsDataRaw) {
    throw new Error('settings_data.json not found in theme');
  }
  
  const settingsData: ShopifyThemeData = JSON.parse(settingsDataRaw);
  const design = parseShopifyThemeSettings(settingsData);
  const assets = extractAssets(settingsData.current);
  
  // Parse templates
  const templates: { [key: string]: any } = {};
  for (const [path, content] of Object.entries(themeFiles)) {
    if (path.startsWith('templates/') && path.endsWith('.json') && content) {
      const templateName = path.replace('templates/', '').replace('.json', '');
      try {
        templates[templateName] = JSON.parse(content);
      } catch (e) {
        console.warn(`Failed to parse template: ${path}`, e);
      }
    }
  }
  
  // List all sections used
  const sections = new Set<string>();
  Object.values(templates).forEach((template: any) => {
    if (template.sections) {
      Object.values(template.sections).forEach((section: any) => {
        if (section.type) {
          sections.add(section.type);
        }
      });
    }
  });
  
  return {
    design,
    assets,
    templates,
    sections: Array.from(sections),
  };
}

/**
 * Calculate conversion compatibility score
 * Returns percentage of theme that can be auto-converted
 */
export function calculateCompatibilityScore(sections: string[]): {
  score: number;
  supported: string[];
  unsupported: string[];
} {
  const SUPPORTED_SECTIONS = [
    'image-banner',
    'featured-product',
    'featured-collection',
    'multirow',
    'image-with-text',
    'rich-text',
    'collection-list',
    'multicolumn',
    'slideshow',
    'video',
    'newsletter',
    'featured-blog',
    'main-product',
    'main-collection-product-grid',
    'header',
    'footer',
  ];
  
  const supported = sections.filter(s => SUPPORTED_SECTIONS.includes(s));
  const unsupported = sections.filter(s => !SUPPORTED_SECTIONS.includes(s));
  
  const score = sections.length > 0 
    ? Math.round((supported.length / sections.length) * 100)
    : 100;
  
  return { score, supported, unsupported };
}
