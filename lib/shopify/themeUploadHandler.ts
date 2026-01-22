// Shopify Theme Upload Handler
// Handles ZIP file upload, extraction, and validation

import JSZip from 'jszip';

interface ThemeFiles {
  [path: string]: string;
}

/**
 * Extract ZIP file contents to memory
 */
export async function extractThemeZip(zipFile: File): Promise<ThemeFiles> {
  const zip = new JSZip();
  const files: ThemeFiles = {};
  
  try {
    const zipData = await zip.loadAsync(zipFile);
    
    // Extract all files
    for (const [path, zipEntry] of Object.entries(zipData.files)) {
      if (zipEntry.dir) continue; // Skip directories
      
      // Only extract relevant files
      if (
        path.includes('config/') ||
        path.includes('templates/') ||
        path.includes('sections/') ||
        path.endsWith('.json') ||
        path.endsWith('.liquid')
      ) {
        const content = await zipEntry.async('text');
        files[path] = content;
      }
    }
    
    return files;
  } catch (error: any) {
    throw new Error(`Failed to extract ZIP: ${error.message}`);
  }
}

/**
 * Extract theme from folder structure (for drag & drop folder upload)
 */
export async function extractThemeFolder(fileList: FileList | File[]): Promise<ThemeFiles> {
  const files: ThemeFiles = {};
  
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    
    // Build relative path
    const webkitPath = (file as any).webkitRelativePath || file.name;
    const parts = webkitPath.split('/');
    
    // Remove root folder name (e.g., "shopify theme/" or "my-theme/")
    const relativePath = parts.length > 1 ? parts.slice(1).join('/') : parts[0];
    
    // Only process relevant files
    if (
      relativePath.includes('config/') ||
      relativePath.includes('templates/') ||
      relativePath.includes('sections/') ||
      relativePath.endsWith('.json') ||
      relativePath.endsWith('.liquid')
    ) {
      const content = await file.text();
      files[relativePath] = content;
    }
  }
  
  return files;
}

/**
 * Validate theme structure
 */
export function validateThemeStructure(files: ThemeFiles): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required files
  if (!files['config/settings_data.json']) {
    errors.push('Missing required file: config/settings_data.json');
  }
  
  // Check for at least one template
  const hasTemplates = Object.keys(files).some(path => path.startsWith('templates/'));
  if (!hasTemplates) {
    errors.push('No templates found. Expected at least one file in templates/ folder.');
  }
  
  // Warnings for optional but recommended files
  if (!files['templates/index.json']) {
    warnings.push('No homepage template found (templates/index.json)');
  }
  
  if (!files['templates/product.json']) {
    warnings.push('No product template found (templates/product.json)');
  }
  
  if (!files['templates/collection.json']) {
    warnings.push('No collection template found (templates/collection.json)');
  }
  
  // Check for sections
  const hasSections = Object.keys(files).some(path => path.startsWith('sections/'));
  if (!hasSections) {
    warnings.push('No sections found. Theme may not have custom sections.');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Normalize file paths (remove leading slashes, handle different folder structures)
 */
export function normalizeThemeFiles(files: ThemeFiles): ThemeFiles {
  const normalized: ThemeFiles = {};
  
  for (const [path, content] of Object.entries(files)) {
    // Remove leading slash if present
    let normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Handle nested theme folders (e.g., "my-theme/config/" → "config/")
    const configIndex = normalizedPath.indexOf('config/');
    const templatesIndex = normalizedPath.indexOf('templates/');
    const sectionsIndex = normalizedPath.indexOf('sections/');
    
    if (configIndex > 0) {
      normalizedPath = normalizedPath.slice(configIndex);
    } else if (templatesIndex > 0) {
      normalizedPath = normalizedPath.slice(templatesIndex);
    } else if (sectionsIndex > 0) {
      normalizedPath = normalizedPath.slice(sectionsIndex);
    }
    
    normalized[normalizedPath] = content;
  }
  
  return normalized;
}

/**
 * Parse theme files and prepare for import
 */
export async function processThemeUpload(
  source: File | FileList | File[]
): Promise<{
  files: ThemeFiles;
  validation: ReturnType<typeof validateThemeStructure>;
}> {
  let files: ThemeFiles;
  
  // Determine source type
  if (source instanceof File) {
    // ZIP file
    if (source.name.endsWith('.zip')) {
      files = await extractThemeZip(source);
    } else {
      throw new Error('Single file uploads must be ZIP files');
    }
  } else {
    // Folder upload (FileList or File[])
    files = await extractThemeFolder(source);
  }
  
  // Normalize paths
  files = normalizeThemeFiles(files);
  
  // Validate structure
  const validation = validateThemeStructure(files);
  
  return { files, validation };
}

/**
 * Get theme metadata from settings_data.json
 */
export function getThemeMetadata(files: ThemeFiles): {
  hasLogo: boolean;
  hasFavicon: boolean;
  templateCount: number;
  sectionCount: number;
  pageCount: number;
} {
  const templates = Object.keys(files).filter(p => p.startsWith('templates/') && p.endsWith('.json'));
  const sections = Object.keys(files).filter(p => p.startsWith('sections/'));
  const pages = templates.filter(p => p.includes('page.'));
  
  let hasLogo = false;
  let hasFavicon = false;
  
  const settingsFile = files['config/settings_data.json'];
  if (settingsFile) {
    try {
      const settings = JSON.parse(settingsFile);
      hasLogo = !!settings.current?.logo;
      hasFavicon = !!settings.current?.favicon;
    } catch (e) {
      // Ignore parse errors
    }
  }
  
  return {
    hasLogo,
    hasFavicon,
    templateCount: templates.length,
    sectionCount: sections.length,
    pageCount: pages.length,
  };
}
