/**
 * Upload theme assets to Supabase Storage
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface AssetUploadProgress {
  total: number;
  uploaded: number;
  current: string;
  errors: Array<{ file: string; error: string }>;
}

export interface UploadedAsset {
  originalName: string;
  storagePath: string;
  publicUrl: string;
  type: 'image' | 'font' | 'css' | 'js' | 'other';
}

/**
 * Upload all theme assets to Supabase Storage
 */
export async function uploadThemeAssets(
  storeId: string,
  migrationId: string,
  assets: {
    images: Record<string, Blob>;
    fonts: Record<string, Blob>;
    styles: Record<string, string>;
    scripts: Record<string, string>;
  },
  supabase: SupabaseClient,
  onProgress?: (progress: AssetUploadProgress) => void
): Promise<UploadedAsset[]> {
  const uploadedAssets: UploadedAsset[] = [];
  const errors: Array<{ file: string; error: string }> = [];
  
  const totalAssets = 
    Object.keys(assets.images).length +
    Object.keys(assets.fonts).length +
    Object.keys(assets.styles).length +
    Object.keys(assets.scripts).length;
  
  let uploaded = 0;
  
  // Upload images
  for (const [filename, blob] of Object.entries(assets.images)) {
    onProgress?.({
      total: totalAssets,
      uploaded,
      current: `Uploading image: ${filename}`,
      errors
    });
    
    try {
      const path = `${storeId}/${migrationId}/images/${filename}`;
      const result = await uploadFile(supabase, path, blob, 'image');
      if (result) {
        uploadedAssets.push({
          originalName: filename,
          storagePath: path,
          publicUrl: result,
          type: 'image'
        });
      }
    } catch (error: any) {
      errors.push({ file: filename, error: error.message });
    }
    
    uploaded++;
  }
  
  // Upload fonts
  for (const [filename, blob] of Object.entries(assets.fonts)) {
    onProgress?.({
      total: totalAssets,
      uploaded,
      current: `Uploading font: ${filename}`,
      errors
    });
    
    try {
      const path = `${storeId}/${migrationId}/fonts/${filename}`;
      const result = await uploadFile(supabase, path, blob, 'font');
      if (result) {
        uploadedAssets.push({
          originalName: filename,
          storagePath: path,
          publicUrl: result,
          type: 'font'
        });
      }
    } catch (error: any) {
      errors.push({ file: filename, error: error.message });
    }
    
    uploaded++;
  }
  
  // Upload CSS files
  for (const [filename, content] of Object.entries(assets.styles)) {
    onProgress?.({
      total: totalAssets,
      uploaded,
      current: `Uploading stylesheet: ${filename}`,
      errors
    });
    
    try {
      const path = `${storeId}/${migrationId}/styles/${filename}`;
      const blob = new Blob([content], { type: 'text/css' });
      const result = await uploadFile(supabase, path, blob, 'css');
      if (result) {
        uploadedAssets.push({
          originalName: filename,
          storagePath: path,
          publicUrl: result,
          type: 'css'
        });
      }
    } catch (error: any) {
      errors.push({ file: filename, error: error.message });
    }
    
    uploaded++;
  }
  
  // Upload JavaScript files (optional - may want to exclude for security)
  for (const [filename, content] of Object.entries(assets.scripts)) {
    onProgress?.({
      total: totalAssets,
      uploaded,
      current: `Processing script: ${filename}`,
      errors
    });
    
    // Skip uploading JS for security - just log it
    console.log(`Skipped JS file: ${filename}`);
    uploaded++;
  }
  
  onProgress?.({
    total: totalAssets,
    uploaded: totalAssets,
    current: 'Upload complete',
    errors
  });
  
  return uploadedAssets;
}

/**
 * Upload a single file to Supabase Storage
 */
async function uploadFile(
  supabase: SupabaseClient,
  path: string,
  blob: Blob,
  type: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('theme-assets')
    .upload(path, blob, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('theme-assets')
    .getPublicUrl(path);
  
  return urlData.publicUrl;
}

/**
 * Rewrite asset URLs in content to point to uploaded assets
 */
export function rewriteAssetUrls(
  content: string,
  assetMap: Map<string, string>
): string {
  let rewritten = content;
  
  // Replace asset_url filters
  assetMap.forEach((newUrl, originalFilename) => {
    // Shopify Liquid: {{ 'filename.png' | asset_url }}
    const liquidPattern = new RegExp(`['"]${escapeRegex(originalFilename)}['"]\\s*\\|\\s*asset_url`, 'g');
    rewritten = rewritten.replace(liquidPattern, `"${newUrl}"`);
    
    // Direct references
    const directPattern = new RegExp(`['"]${escapeRegex(originalFilename)}['"]`, 'g');
    rewritten = rewritten.replace(directPattern, `"${newUrl}"`);
  });
  
  return rewritten;
}

/**
 * Optimize image by converting to WebP (if needed)
 */
export async function optimizeImage(blob: Blob): Promise<Blob> {
  // For now, return original blob
  // In production, you might want to:
  // 1. Convert to WebP format
  // 2. Resize to reasonable dimensions
  // 3. Compress quality
  
  return blob;
}

/**
 * Extract CSS custom properties (CSS variables)
 */
export function extractCSSVariables(cssContent: string): Record<string, string> {
  const variables: Record<string, string> = {};
  
  // Match :root { --var-name: value; }
  const rootMatch = cssContent.match(/:root\s*\{([^}]+)\}/);
  if (rootMatch) {
    const declarations = rootMatch[1];
    const varMatches = declarations.matchAll(/--([^:]+):\s*([^;]+);/g);
    
    for (const match of varMatches) {
      const name = match[1].trim();
      const value = match[2].trim();
      variables[name] = value;
    }
  }
  
  return variables;
}

/**
 * Generate optimized CSS from Shopify theme CSS
 */
export function generateOptimizedCSS(
  originalCSS: Record<string, string>,
  colorMapping: Record<string, string>
): string {
  let combinedCSS = '';
  
  // Combine all CSS files
  Object.values(originalCSS).forEach(content => {
    combinedCSS += content + '\n';
  });
  
  // Extract CSS variables
  const variables = extractCSSVariables(combinedCSS);
  
  // Map Shopify color variables to nexusOS
  const optimized = `:root {
  /* Colors from Shopify theme */
  --primary-color: ${colorMapping.primary || '#000000'};
  --secondary-color: ${colorMapping.secondary || '#6b7280'};
  --background-color: ${colorMapping.background || '#ffffff'};
  --text-color: ${colorMapping.text || '#000000'};
  
  /* Extracted CSS variables */
${Object.entries(variables).map(([name, value]) => `  --${name}: ${value};`).join('\n')}
}

/* Additional Shopify theme styles */
${combinedCSS.substring(0, 5000)} /* Truncated for initial migration */
`;
  
  return optimized;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Create asset URL mapping for quick lookups
 */
export function createAssetUrlMap(uploadedAssets: UploadedAsset[]): Map<string, string> {
  const map = new Map<string, string>();
  
  uploadedAssets.forEach(asset => {
    map.set(asset.originalName, asset.publicUrl);
  });
  
  return map;
}
