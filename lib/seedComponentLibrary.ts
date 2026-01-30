/**
 * Component Library Seeding Script
 * Migrates hardcoded component libraries to database
 */

import { createClient } from '@supabase/supabase-js';
import { extractFieldsFromDefaults, extractFieldsFromFieldsArray, EditableField } from './fieldInference';

// Create Supabase client for Node.js environment
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Category mapping
const CATEGORY_MAP: Record<string, string> = {
  'hero': 'layout',
  'header': 'navigation',
  'footer': 'navigation',
  'product-card': 'commerce',
  'product-page': 'commerce',
  'blog': 'content',
  'category': 'content',
  'category-page': 'content',
  'collection': 'commerce',
  'contact': 'forms',
  'gallery': 'media',
  'social': 'media',
  'video': 'media',
  'layout': 'layout',
  'scroll': 'media',
  'section': 'content'
};

interface LibraryExports {
  OPTIONS: Array<{
    id: string;
    name: string;
    description?: string;
    date?: string;
    popularity?: number;
    recommended?: boolean;
  }>;
  COMPONENTS: Record<string, any>;
  FIELDS?: Record<string, string[]>;
  DEFAULTS?: Record<string, any>;
}

interface SeedResult {
  success: number;
  failed: number;
  skipped: number;
  errors: Array<{ variant: string; error: string }>;
}

/**
 * Seed a single library's components into the database
 */
async function seedLibrary(
  type: string,
  exports: LibraryExports,
  dryRun: boolean = false
): Promise<SeedResult> {
  const result: SeedResult = { success: 0, failed: 0, skipped: 0, errors: [] };
  
  for (const option of exports.OPTIONS) {
    try {
      const variantId = option.id;
      const component = exports.COMPONENTS[variantId];
      
      if (!component) {
        console.warn(`[Seed] No component found for ${type}:${variantId}`);
        result.skipped++;
        continue;
      }
      
      // Generate editable fields
      let editableFields: EditableField[] = [];
      
      if (exports.FIELDS && exports.FIELDS[variantId]) {
        // Use explicit FIELDS if available
        const defaults = exports.DEFAULTS?.[variantId] || {};
        editableFields = extractFieldsFromFieldsArray(exports.FIELDS[variantId], defaults);
      } else if (exports.DEFAULTS && exports.DEFAULTS[variantId]) {
        // Auto-detect from DEFAULTS
        editableFields = extractFieldsFromDefaults(exports.DEFAULTS[variantId]);
      } else {
        // Fallback to empty (will be populated by admin later)
        console.warn(`[Seed] No fields found for ${type}:${variantId}, using empty array`);
      }
      
      // Create minimal template
      const template = {
        type,
        variant: variantId,
        data: exports.DEFAULTS?.[variantId] || {}
      };
      
      // Prepare database entry
      const entry = {
        type,
        variant_id: variantId,
        name: option.name,
        category: CATEGORY_MAP[type] || 'other',
        template,
        editable_fields: editableFields,
        metadata: {
          usage_count: 0,
          popularity: option.popularity || 50,
          source: 'foundation',
          description: option.description || '',
          created_date: option.date || new Date().toISOString().split('T')[0],
          recommended: option.recommended || false
        }
      };
      
      if (dryRun) {
        console.log(`[DRY RUN] Would insert: ${type}:${variantId}`);
        result.success++;
      } else {
        // Insert into database (upsert to handle re-runs)
        const { error } = await supabase
          .from('component_library')
          .upsert(entry, { 
            onConflict: 'type,variant_id',
            ignoreDuplicates: false 
          });
        
        if (error) {
          console.error(`[Seed] Failed to insert ${type}:${variantId}:`, error);
          result.failed++;
          result.errors.push({ variant: `${type}:${variantId}`, error: error.message });
        } else {
          console.log(`✓ Seeded ${type}:${variantId} - ${option.name}`);
          result.success++;
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Seed] Error processing ${type}:${option.id}:`, errorMsg);
      result.failed++;
      result.errors.push({ variant: `${type}:${option.id}`, error: errorMsg });
    }
  }
  
  return result;
}

/**
 * Seed SectionLibrary with its multiple sub-types
 */
async function seedSectionLibrary(exports: any, dryRun: boolean = false): Promise<SeedResult> {
  const result: SeedResult = { success: 0, failed: 0, skipped: 0, errors: [] };
  
  const subTypes = [
    { type: 'section-richtext', OPTIONS: exports.RICH_TEXT_OPTIONS, COMPONENTS: exports.RICH_TEXT_COMPONENTS, DEFAULTS: exports.RICH_TEXT_DEFAULTS },
    { type: 'section-email', OPTIONS: exports.EMAIL_SIGNUP_OPTIONS, COMPONENTS: exports.EMAIL_SIGNUP_COMPONENTS, DEFAULTS: exports.EMAIL_SIGNUP_DEFAULTS },
    { type: 'section-collapsible', OPTIONS: exports.COLLAPSIBLE_OPTIONS, COMPONENTS: exports.COLLAPSIBLE_COMPONENTS, DEFAULTS: exports.COLLAPSIBLE_DEFAULTS },
    { type: 'section-logolist', OPTIONS: exports.LOGO_LIST_OPTIONS, COMPONENTS: exports.LOGO_LIST_COMPONENTS, DEFAULTS: exports.LOGO_LIST_DEFAULTS },
    { type: 'section-promo', OPTIONS: exports.PROMO_BANNER_OPTIONS, COMPONENTS: exports.PROMO_BANNER_COMPONENTS, DEFAULTS: exports.PROMO_BANNER_DEFAULTS },
    { type: 'section-spacer', OPTIONS: exports.SPACER_OPTIONS, COMPONENTS: exports.SPACER_COMPONENTS, DEFAULTS: exports.SPACER_DEFAULTS }
  ];
  
  for (const subType of subTypes) {
    if (!subType.OPTIONS) continue;
    
    const subResult = await seedLibrary(subType.type, subType as any, dryRun);
    result.success += subResult.success;
    result.failed += subResult.failed;
    result.skipped += subResult.skipped;
    result.errors.push(...subResult.errors);
  }
  
  return result;
}

/**
 * Main seeding function - seeds all libraries
 */
export async function seedAllLibraries(dryRun: boolean = false): Promise<SeedResult> {
  console.log(`\n🌱 Starting Component Library Seeding ${dryRun ? '(DRY RUN)' : ''}\n`);
  
  const totalResult: SeedResult = { success: 0, failed: 0, skipped: 0, errors: [] };
  
  // Define libraries to seed (in priority order)
  const libraries = [
    { type: 'hero', path: '../components/HeroLibrary' },
    { type: 'header', path: '../components/HeaderLibrary' },
    { type: 'footer', path: '../components/FooterLibrary' },
    { type: 'product-card', path: '../components/ProductCardLibrary' },
    { type: 'product-page', path: '../components/ProductPageLibrary' },
    { type: 'blog', path: '../components/BlogLibrary' },
    { type: 'category', path: '../components/CategoryLibrary' },
    { type: 'category-page', path: '../components/CategoryPageLibrary' },
    { type: 'collection', path: '../components/CollectionLibrary' },
    { type: 'contact', path: '../components/ContactLibrary' },
    { type: 'gallery', path: '../components/GalleryLibrary' },
    { type: 'social', path: '../components/SocialLibrary' },
    { type: 'video', path: '../components/VideoLibrary' },
    { type: 'layout', path: '../components/LayoutLibrary' },
    { type: 'scroll', path: '../components/ScrollLibrary' }
  ];
  
  // Seed standard libraries
  for (const lib of libraries) {
    try {
      console.log(`\n📦 Processing ${lib.type}...`);
      const exports = await import(lib.path);
      
      // Construct expected export names
      const typeUpper = lib.type.toUpperCase().replace(/-/g, '_');
      const OPTIONS = exports[`${typeUpper}_OPTIONS`];
      const COMPONENTS = exports[`${typeUpper}_COMPONENTS`];
      const FIELDS = exports[`${typeUpper}_FIELDS`];
      const DEFAULTS = exports[`${typeUpper}_DEFAULTS`];
      
      if (!OPTIONS || !COMPONENTS) {
        console.warn(`⚠️  ${lib.type}: Missing OPTIONS or COMPONENTS export`);
        continue;
      }
      
      const result = await seedLibrary(lib.type, { OPTIONS, COMPONENTS, FIELDS, DEFAULTS }, dryRun);
      
      totalResult.success += result.success;
      totalResult.failed += result.failed;
      totalResult.skipped += result.skipped;
      totalResult.errors.push(...result.errors);
      
      console.log(`  ✓ ${result.success} seeded, ${result.failed} failed, ${result.skipped} skipped`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`❌ Failed to process ${lib.type}:`, errorMsg);
      totalResult.errors.push({ variant: lib.type, error: errorMsg });
    }
  }
  
  // Seed SectionLibrary separately (special case)
  try {
    console.log(`\n📦 Processing section library...`);
    const sectionExports = await import('../components/SectionLibrary');
    const result = await seedSectionLibrary(sectionExports, dryRun);
    
    totalResult.success += result.success;
    totalResult.failed += result.failed;
    totalResult.skipped += result.skipped;
    totalResult.errors.push(...result.errors);
    
    console.log(`  ✓ ${result.success} seeded, ${result.failed} failed, ${result.skipped} skipped`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to process section library:`, errorMsg);
    totalResult.errors.push({ variant: 'section', error: errorMsg });
  }
  
  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 SEEDING SUMMARY`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Success: ${totalResult.success}`);
  console.log(`❌ Failed: ${totalResult.failed}`);
  console.log(`⏭️  Skipped: ${totalResult.skipped}`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (totalResult.errors.length > 0) {
    console.log(`\n❌ ERRORS:\n`);
    totalResult.errors.forEach(({ variant, error }) => {
      console.log(`  • ${variant}: ${error}`);
    });
  }
  
  return totalResult;
}
