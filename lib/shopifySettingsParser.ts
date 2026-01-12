/**
 * Parse Shopify settings_data.json to extract configured theme values
 */

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
    }
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
