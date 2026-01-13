/**
 * Parse Shopify settings_data.json to extract configured theme values
 */

export interface ShopifyMenuItem {
  title: string;
  url: string;
  target?: string;
  type?: string; // 'page', 'collection', 'product', 'blog', 'custom', 'http'
  children?: ShopifyMenuItem[];
}

export interface ShopifyMenu {
  handle: string;
  items: ShopifyMenuItem[];
}

export interface ShopifySettings {
  logo?: string;
  logoWidth?: number;
  favicon?: string;
  colors: {
    schemes: Record<string, ColorScheme>;
  };
  typography: {
    headerFont: string;
    bodyFont: string;
    headingScale: number;
    bodyScale: number;
  };
  layout: {
    pageWidth: number;
    spacingSections: number;
    spacingGridHorizontal: number;
    spacingGridVertical: number;
  };
  buttons: {
    borderRadius: number;
    shadowOpacity: number;
  };
  cards: {
    style: string;
    cornerRadius: number;
    shadowOpacity: number;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
    pinterest?: string;
  };
  brandInfo: {
    headline: string;
    description: string;
    brandImage?: string;
  };
  menus?: ShopifyMenu[];
}

export interface ColorScheme {
  background: string;
  text: string;
  button: string;
  buttonLabel: string;
}

export function parseSettingsData(settingsJson: any): ShopifySettings {
  const current = settingsJson.current || {};
  
  return {
    logo: current.logo,
    logoWidth: current.logo_width,
    favicon: current.favicon,
    colors: {
      schemes: parseColorSchemes(current.color_schemes || settingsJson.color_schemes)
    },
    typography: {
      headerFont: current.type_header_font || 'sans-serif',
      bodyFont: current.type_body_font || 'sans-serif',
      headingScale: current.heading_scale || 100,
      bodyScale: current.body_scale || 100
    },
    layout: {
      pageWidth: current.page_width || 1200,
      spacingSections: current.spacing_sections || 0,
      spacingGridHorizontal: current.spacing_grid_horizontal || 8,
      spacingGridVertical: current.spacing_grid_vertical || 8
    },
    buttons: {
      borderRadius: current.buttons_radius || 0,
      shadowOpacity: current.buttons_shadow_opacity || 0
    },
    cards: {
      style: current.card_style || 'standard',
      cornerRadius: current.card_corner_radius || 0,
      shadowOpacity: current.card_shadow_opacity || 0
    },
    social: {
      facebook: current.social_facebook_link,
      instagram: current.social_instagram_link,
      twitter: current.social_twitter_link,
      tiktok: current.social_tiktok_link,
      youtube: current.social_youtube_link,
      pinterest: current.social_pinterest_link
    },
    brandInfo: {
      headline: current.brand_headline || '',
      description: current.brand_description || '',
      brandImage: current.brand_image
    },
    menus: parseMenus(current)
  };
}

function parseColorSchemes(schemes: any): Record<string, ColorScheme> {
  const result: Record<string, ColorScheme> = {};
  
  if (!schemes) return result;
  
  Object.entries(schemes).forEach(([key, scheme]: [string, any]) => {
    const settings = scheme.settings || {};
    result[key] = {
      background: settings.background || '#ffffff',
      text: settings.text || '#000000',
      button: settings.button || '#000000',
      buttonLabel: settings.button_label || '#ffffff'
    };
  });
  
  return result;
}

/**
 * Convert Shopify color schemes to nexusOS theme
 */
export function convertToNexusTheme(settings: ShopifySettings) {
  const primaryScheme = settings.colors.schemes['scheme-1'] || settings.colors.schemes[Object.keys(settings.colors.schemes)[0]];
  
  return {
    primaryColor: primaryScheme?.button || '#000000',
    secondaryColor: primaryScheme?.text || '#000000',
    backgroundColor: primaryScheme?.background || '#ffffff',
    textColor: primaryScheme?.text || '#000000',
    buttonRadius: settings.buttons.borderRadius,
    cardRadius: settings.cards.cornerRadius,
    pageWidth: settings.layout.pageWidth,
    spacing: settings.layout.spacingSections
  };
}

/**
 * Parse menu configuration from Shopify settings
 * Shopify stores menu links in settings like menu_main, menu_footer, etc.
 */
function parseMenus(settings: any): ShopifyMenu[] {
  const menus: ShopifyMenu[] = [];
  
  // Common menu keys in Shopify themes
  const menuKeys = [
    'menu', 'menu_main', 'menu_primary', 'menu_header',
    'menu_footer', 'menu_secondary'
  ];
  
  menuKeys.forEach(key => {
    if (settings[key]) {
      const menuHandle = key.replace('menu_', '');
      const menuItems = parseMenuItems(settings[key]);
      
      if (menuItems.length > 0) {
        menus.push({
          handle: menuHandle,
          items: menuItems
        });
      }
    }
  });
  
  return menus;
}

/**
 * Parse individual menu items, handling nested menus
 */
function parseMenuItems(menuData: any): ShopifyMenuItem[] {
  if (!menuData) return [];
  
  // Handle string references to menu handles (e.g., "main-menu")
  if (typeof menuData === 'string') {
    // This is a menu handle reference - we'd need the full menu data
    // For now, create a placeholder that can be enhanced later
    return [];
  }
  
  // Handle menu items array
  if (Array.isArray(menuData)) {
    return menuData.map(item => parseMenuItem(item)).filter(Boolean) as ShopifyMenuItem[];
  }
  
  // Handle menu object with links property
  if (menuData.links) {
    return parseMenuItems(menuData.links);
  }
  
  return [];
}

/**
 * Parse a single menu item
 */
function parseMenuItem(item: any): ShopifyMenuItem | null {
  if (!item) return null;
  
  const menuItem: ShopifyMenuItem = {
    title: item.title || item.name || item.label || 'Untitled',
    url: item.url || item.link || '#',
    target: item.target || item.new_tab ? '_blank' : undefined,
    type: detectLinkType(item.url || item.link || '#')
  };
  
  // Handle nested menu items (dropdown menus)
  if (item.links && Array.isArray(item.links)) {
    menuItem.children = item.links.map(parseMenuItem).filter(Boolean) as ShopifyMenuItem[];
  } else if (item.children && Array.isArray(item.children)) {
    menuItem.children = item.children.map(parseMenuItem).filter(Boolean) as ShopifyMenuItem[];
  }
  
  return menuItem;
}

/**
 * Detect the type of link based on URL patterns
 */
function detectLinkType(url: string): string {
  if (!url || url === '#') return 'custom';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return 'http';
  }
  
  if (url.includes('/collections/')) return 'collection';
  if (url.includes('/products/')) return 'product';
  if (url.includes('/pages/')) return 'page';
  if (url.includes('/blogs/')) return 'blog';
  
  return 'custom';
}
