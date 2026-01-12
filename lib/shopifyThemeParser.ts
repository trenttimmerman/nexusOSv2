import JSZip from 'jszip';

export interface ShopifyThemeStructure {
  themeName: string;
  themeVersion?: string;
  files: {
    config: {
      settings_schema?: any;
      settings_data?: any;
    };
    sections: Record<string, string>; // filename -> liquid content
    snippets: Record<string, string>;
    templates: Record<string, string>;
    layout: Record<string, string>;
    assets: {
      styles: Record<string, string>; // CSS files
      scripts: Record<string, string>; // JS files
      images: Record<string, Blob>; // Image blobs
      fonts: Record<string, Blob>;
      other: Record<string, Blob>;
    };
    locales: Record<string, any>;
  };
  detectedTheme: 'dawn' | 'debut' | 'brooklyn' | 'narrative' | 'supply' | 'venture' | 'boundless' | 'unknown';
}

export async function extractShopifyTheme(file: File): Promise<ShopifyThemeStructure> {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(file);
  
  const structure: ShopifyThemeStructure = {
    themeName: file.name.replace('.zip', ''),
    files: {
      config: {},
      sections: {},
      snippets: {},
      templates: {},
      layout: {},
      assets: {
        styles: {},
        scripts: {},
        images: {},
        fonts: {},
        other: {}
      },
      locales: {}
    },
    detectedTheme: 'unknown'
  };

  // Process all files in the ZIP
  const filePromises: Promise<void>[] = [];

  const allPaths: string[] = [];
  const rawPaths: string[] = [];
  zipContent.forEach((relativePath, zipEntry) => {
    if (zipEntry.dir) return;

    rawPaths.push(relativePath);

    // Normalize path (remove leading theme folder if present)
    const pathParts = relativePath.split('/');
    const normalizedPath = pathParts.length > 1 && !pathParts[0].includes('.') 
      ? pathParts.slice(1).join('/')
      : relativePath;

    allPaths.push(normalizedPath);
    filePromises.push(processFile(normalizedPath, zipEntry, structure));
  });

  console.log('[ThemeParser] Total files in ZIP:', allPaths.length);
  console.log('[ThemeParser] RAW paths (before normalization):', rawPaths.slice(0, 10));
  console.log('[ThemeParser] NORMALIZED paths:', allPaths.slice(0, 10));
  console.log('[ThemeParser] Section files:', allPaths.filter(p => p.startsWith('sections/')));

  await Promise.all(filePromises);

  console.log('[ThemeParser] Extracted sections:', Object.keys(structure.files.sections).length);
  console.log('[ThemeParser] Section names:', Object.keys(structure.files.sections));

  // Detect theme type
  structure.detectedTheme = detectThemeType(structure);
  
  // Extract theme version from settings if available
  if (structure.files.config.settings_data?.current) {
    structure.themeVersion = structure.files.config.settings_data.current;
  }

  return structure;
}

async function processFile(
  path: string, 
  zipEntry: JSZip.JSZipObject, 
  structure: ShopifyThemeStructure
): Promise<void> {
  const fileName = path.split('/').pop() || '';
  
  // Config files
  if (path.startsWith('config/')) {
    if (fileName === 'settings_schema.json') {
      const content = await zipEntry.async('string');
      try {
        structure.files.config.settings_schema = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse settings_schema.json', e);
      }
    } else if (fileName === 'settings_data.json') {
      const content = await zipEntry.async('string');
      try {
        structure.files.config.settings_data = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse settings_data.json', e);
      }
    }
  }
  
  // Sections
  else if (path.startsWith('sections/') && fileName.endsWith('.liquid')) {
    const content = await zipEntry.async('string');
    structure.files.sections[fileName] = content;
    console.log('[ThemeParser] Found section:', fileName);
  }
  
  // Snippets
  else if (path.startsWith('snippets/') && fileName.endsWith('.liquid')) {
    const content = await zipEntry.async('string');
    structure.files.snippets[fileName] = content;
  }
  
  // Templates
  else if (path.startsWith('templates/')) {
    const content = await zipEntry.async('string');
    structure.files.templates[fileName] = content;
  }
  
  // Layout
  else if (path.startsWith('layout/') && fileName.endsWith('.liquid')) {
    const content = await zipEntry.async('string');
    structure.files.layout[fileName] = content;
  }
  
  // Assets
  else if (path.startsWith('assets/')) {
    await processAsset(fileName, zipEntry, structure);
  }
  
  // Locales
  else if (path.startsWith('locales/') && fileName.endsWith('.json')) {
    const content = await zipEntry.async('string');
    try {
      structure.files.locales[fileName] = JSON.parse(content);
    } catch (e) {
      console.error(`Failed to parse locale file ${fileName}`, e);
    }
  }
}

async function processAsset(
  fileName: string,
  zipEntry: JSZip.JSZipObject,
  structure: ShopifyThemeStructure
): Promise<void> {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  
  // CSS files
  if (ext === 'css' || ext === 'scss' || ext === 'sass') {
    const content = await zipEntry.async('string');
    structure.files.assets.styles[fileName] = content;
  }
  
  // JavaScript files
  else if (ext === 'js') {
    const content = await zipEntry.async('string');
    structure.files.assets.scripts[fileName] = content;
  }
  
  // Image files
  else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
    const blob = await zipEntry.async('blob');
    structure.files.assets.images[fileName] = blob;
  }
  
  // Font files
  else if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) {
    const blob = await zipEntry.async('blob');
    structure.files.assets.fonts[fileName] = blob;
  }
  
  // Other files
  else {
    const blob = await zipEntry.async('blob');
    structure.files.assets.other[fileName] = blob;
  }
}

function detectThemeType(structure: ShopifyThemeStructure): ShopifyThemeStructure['detectedTheme'] {
  const sections = Object.keys(structure.files.sections);
  const settingsData = structure.files.config.settings_data;
  
  // Dawn theme detection (Shopify's reference theme, OS 2.0)
  if (
    sections.includes('main-product.liquid') ||
    sections.includes('featured-collection.liquid') ||
    settingsData?.theme_info?.name?.toLowerCase().includes('dawn')
  ) {
    return 'dawn';
  }
  
  // Debut theme detection (classic Shopify theme)
  if (
    sections.includes('hero.liquid') ||
    sections.includes('featured-product.liquid') ||
    settingsData?.theme_info?.name?.toLowerCase().includes('debut')
  ) {
    return 'debut';
  }
  
  // Brooklyn theme detection
  if (
    sections.includes('slideshow.liquid') ||
    settingsData?.theme_info?.name?.toLowerCase().includes('brooklyn')
  ) {
    return 'brooklyn';
  }
  
  // Narrative theme detection
  if (settingsData?.theme_info?.name?.toLowerCase().includes('narrative')) {
    return 'narrative';
  }
  
  // Supply theme detection
  if (settingsData?.theme_info?.name?.toLowerCase().includes('supply')) {
    return 'supply';
  }
  
  // Venture theme detection
  if (settingsData?.theme_info?.name?.toLowerCase().includes('venture')) {
    return 'venture';
  }
  
  // Boundless theme detection
  if (settingsData?.theme_info?.name?.toLowerCase().includes('boundless')) {
    return 'boundless';
  }
  
  return 'unknown';
}

export function getThemeInfo(detectedTheme: ShopifyThemeStructure['detectedTheme']) {
  const themeInfo: Record<string, { name: string; description: string; os2Compatible: boolean }> = {
    dawn: {
      name: 'Dawn',
      description: "Shopify's reference theme (Online Store 2.0)",
      os2Compatible: true
    },
    debut: {
      name: 'Debut',
      description: 'Classic Shopify theme',
      os2Compatible: false
    },
    brooklyn: {
      name: 'Brooklyn',
      description: 'Modern theme with bold typography',
      os2Compatible: false
    },
    narrative: {
      name: 'Narrative',
      description: 'Image-focused storytelling theme',
      os2Compatible: false
    },
    supply: {
      name: 'Supply',
      description: 'High-volume inventory theme',
      os2Compatible: false
    },
    venture: {
      name: 'Venture',
      description: 'Outdoor and athletic theme',
      os2Compatible: false
    },
    boundless: {
      name: 'Boundless',
      description: 'Video and image-focused theme',
      os2Compatible: false
    },
    unknown: {
      name: 'Custom Theme',
      description: 'Unrecognized or custom Shopify theme',
      os2Compatible: false
    }
  };
  
  return themeInfo[detectedTheme] || themeInfo.unknown;
}

export interface ParsedSection {
  schema?: {
    name?: string;
    tag?: string;
    class?: string;
    settings?: any[];
    blocks?: any[];
    presets?: any[];
  };
  liquidContent: string;
}

export function parseLiquidSection(liquidContent: string): ParsedSection {
  const result: ParsedSection = {
    liquidContent
  };
  
  // Extract schema from {% schema %} tag
  const schemaMatch = liquidContent.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (schemaMatch) {
    try {
      result.schema = JSON.parse(schemaMatch[1].trim());
    } catch (e) {
      console.error('Failed to parse section schema', e);
    }
  }
  
  return result;
}

export interface ThemeSettings {
  colors?: Record<string, string>;
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    baseFontSize?: string;
  };
  layout?: {
    maxWidth?: string;
    spacing?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  checkout?: any;
}

export function extractThemeSettings(settingsData: any): ThemeSettings {
  const settings: ThemeSettings = {};
  
  if (!settingsData || !settingsData.current) return settings;
  
  const current = settingsData.current;
  
  // Extract colors
  settings.colors = {};
  Object.keys(current).forEach(key => {
    if (key.includes('color') && typeof current[key] === 'string') {
      settings.colors![key] = current[key];
    }
  });
  
  // Extract typography
  settings.typography = {
    headingFont: current.type_header_font || current.heading_font,
    bodyFont: current.type_base_font || current.body_font,
    baseFontSize: current.type_base_size || current.font_size
  };
  
  // Extract layout
  settings.layout = {
    maxWidth: current.layout_max_width || current.container_width,
    spacing: current.section_spacing || current.vertical_spacing
  };
  
  // Extract social links
  settings.social = {
    facebook: current.social_facebook_link,
    instagram: current.social_instagram_link,
    twitter: current.social_twitter_link
  };
  
  return settings;
}
