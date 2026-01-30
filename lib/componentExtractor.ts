/**
 * Component Extractor
 * Extracts unique components from AI-generated websites and adds them to the library
 */

import { supabase } from './supabaseClient';
import { 
  analyzeBlockStructure, 
  generateTemplate, 
  getComponentIdentifier,
  categorizeComponent,
  generateComponentName,
  type EditableField
} from './componentAnalyzer';

interface ComponentLibraryEntry {
  type: string;
  variant_id: string;
  name: string;
  category: string;
  template: any;
  editable_fields: EditableField[];
  thumbnail_url?: string;
  metadata: {
    usage_count: number;
    rating?: number;
    source: 'ai-generated' | 'user-created';
    original_store_id?: string;
  };
}

/**
 * Calculates similarity between two blocks (0-1 score)
 * Uses simple JSON structure comparison
 */
function calculateSimilarity(block1: any, block2: any): number {
  const keys1 = new Set(Object.keys(block1.data || {}));
  const keys2 = new Set(Object.keys(block2.data || {}));
  
  // Calculate Jaccard similarity of data keys
  const intersection = new Set([...keys1].filter(x => keys2.has(x)));
  const union = new Set([...keys1, ...keys2]);
  
  if (union.size === 0) return 0;
  
  const structuralSimilarity = intersection.size / union.size;
  
  // Check if same type and variant
  if (block1.type === block2.type && block1.variant === block2.variant) {
    return Math.max(structuralSimilarity, 0.9); // Same type+variant = high similarity
  }
  
  return structuralSimilarity;
}

/**
 * Checks if a component already exists in the library (with similarity threshold)
 */
async function componentExists(
  block: any, 
  similarityThreshold = 0.85
): Promise<boolean> {
  const { type, variant } = getComponentIdentifier(block);
  
  // Check exact type+variant match first (maybeSingle handles 0 results gracefully)
  const { data: exactMatch, error: exactError } = await supabase
    .from('component_library')
    .select('id')
    .eq('type', type)
    .eq('variant_id', variant)
    .maybeSingle();
  
  if (exactMatch) {
    return true; // Exact match exists
  }
  
  // Check similar components of same type
  const { data: sameTypeComponents } = await supabase
    .from('component_library')
    .select('template')
    .eq('type', type);
  
  if (!sameTypeComponents || sameTypeComponents.length === 0) {
    return false; // No similar components
  }
  
  // Calculate similarity with existing components
  for (const existing of sameTypeComponents) {
    const similarity = calculateSimilarity(block, existing.template);
    if (similarity >= similarityThreshold) {
      return true; // Similar component exists
    }
  }
  
  return false;
}

/**
 * Adds a component to the library
 */
async function addComponentToLibrary(
  block: any,
  storeId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { type, variant } = getComponentIdentifier(block);
    
    // Generate editable fields
    const editableFields = analyzeBlockStructure(block.data);
    
    // Generate template with placeholders
    const template = generateTemplate(block);
    
    // Generate name and category
    const name = generateComponentName(block);
    const category = categorizeComponent(type);
    
    // Create library entry
    const entry: ComponentLibraryEntry = {
      type,
      variant_id: variant,
      name,
      category,
      template,
      editable_fields: editableFields,
      metadata: {
        usage_count: 1,
        source: 'ai-generated',
        original_store_id: storeId
      }
    };
    
    // Insert into database
    const { error } = await supabase
      .from('component_library')
      .insert(entry);
    
    if (error) {
      console.error('Error adding component to library:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in addComponentToLibrary:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Extracts unique components from a set of generated pages
 */
export async function extractComponentsFromGeneration(
  pages: any[],
  storeId?: string,
  options: {
    similarityThreshold?: number;
    skipExisting?: boolean;
  } = {}
): Promise<{
  extracted: number;
  skipped: number;
  errors: string[];
}> {
  const { similarityThreshold = 0.85, skipExisting = true } = options;
  
  let extracted = 0;
  let skipped = 0;
  const errors: string[] = [];
  
  // Safety check: ensure pages is valid array
  if (!pages || !Array.isArray(pages)) {
    console.warn('[componentExtractor] Invalid pages array:', pages);
    return { extracted: 0, skipped: 0, errors: ['Invalid pages array'] };
  }
  
  // Collect all blocks from all pages
  const allBlocks: any[] = [];
  pages.forEach(page => {
    if (page.blocks && Array.isArray(page.blocks)) {
      allBlocks.push(...page.blocks);
    }
  });
  
  // Process each unique block
  for (const block of allBlocks) {
    try {
      // Skip if not a valid block
      if (!block.type || !block.data) {
        skipped++;
        continue;
      }
      
      // Check if component already exists
      if (skipExisting) {
        const exists = await componentExists(block, similarityThreshold);
        if (exists) {
          skipped++;
          continue;
        }
      }
      
      // Add to library
      const result = await addComponentToLibrary(block, storeId);
      
      if (result.success) {
        extracted++;
      } else {
        errors.push(result.error || 'Unknown error');
        skipped++;
      }
    } catch (error: any) {
      errors.push(error.message);
      skipped++;
    }
  }
  
  return { extracted, skipped, errors };
}

/**
 * Increments usage count for a component when it's used
 */
export async function incrementComponentUsage(
  componentId: string
): Promise<void> {
  try {
    // Call the database function
    await supabase.rpc('increment_component_usage', {
      component_id: componentId
    });
  } catch (error) {
    console.error('Error incrementing component usage:', error);
  }
}

/**
 * Fetches components from the library with filters
 */
export async function fetchComponentLibrary(filters: {
  type?: string;
  category?: string;
  limit?: number;
  sortBy?: 'created_at' | 'usage_count' | 'rating';
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<any[]> {
  const {
    type,
    category,
    limit = 50,
    sortBy = 'usage_count',
    sortOrder = 'desc'
  } = filters;
  
  let query = supabase
    .from('component_library')
    .select('*');
  
  // Apply filters
  if (type) {
    query = query.eq('type', type);
  }
  
  if (category) {
    query = query.eq('category', category);
  }
  
  // Apply sorting
  if (sortBy === 'usage_count' || sortBy === 'rating') {
    // Sort by metadata field
    query = query.order(`metadata->${sortBy}`, { 
      ascending: sortOrder === 'asc' 
    });
  } else {
    query = query.order(sortBy, { 
      ascending: sortOrder === 'asc' 
    });
  }
  
  // Apply limit
  query = query.limit(limit);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching component library:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Searches component library by name or description
 */
export async function searchComponentLibrary(
  searchTerm: string
): Promise<any[]> {
  const { data, error } = await supabase
    .from('component_library')
    .select('*')
    .ilike('name', `%${searchTerm}%`)
    .order('metadata->usage_count', { ascending: false })
    .limit(20);
  
  if (error) {
    console.error('Error searching component library:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Gets the most popular components
 */
export async function getPopularComponents(limit = 10): Promise<any[]> {
  return fetchComponentLibrary({
    limit,
    sortBy: 'usage_count',
    sortOrder: 'desc'
  });
}

/**
 * Gets the most recent components
 */
export async function getRecentComponents(limit = 10): Promise<any[]> {
  return fetchComponentLibrary({
    limit,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
}
