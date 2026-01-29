/**
 * Component Structure Analyzer
 * Auto-detects editable fields from PageBlock data structures
 * Generates editing controls dynamically without manual configuration
 */

export type FieldType = 
  | 'text' 
  | 'textarea' 
  | 'richtext'
  | 'color' 
  | 'image' 
  | 'number' 
  | 'toggle' 
  | 'select'
  | 'array';

export interface EditableField {
  type: FieldType;
  label: string;
  path: string;  // JSON path (e.g., "data.heading", "data.style.backgroundColor")
  placeholder?: string;
  options?: string[];  // For select fields
  min?: number;
  max?: number;
  arrayItemType?: FieldType;  // For array fields
}

/**
 * Analyzes a PageBlock's data structure and generates editable field definitions
 */
export function analyzeBlockStructure(blockData: any, pathPrefix = 'data'): EditableField[] {
  const fields: EditableField[] = [];
  
  if (!blockData || typeof blockData !== 'object') {
    return fields;
  }
  
  // Recursively analyze object structure
  Object.keys(blockData).forEach(key => {
    const value = blockData[key];
    const path = `${pathPrefix}.${key}`;
    
    // Detect field type based on key name and value
    const field = detectFieldType(key, value, path);
    
    if (field) {
      fields.push(field);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively analyze nested objects (except arrays)
      const nestedFields = analyzeBlockStructure(value, path);
      fields.push(...nestedFields);
    } else if (Array.isArray(value) && value.length > 0) {
      // Analyze array items
      const arrayField = detectArrayField(key, value, path);
      if (arrayField) {
        fields.push(arrayField);
      }
    }
  });
  
  return fields;
}

/**
 * Detects field type based on key name and value
 */
function detectFieldType(key: string, value: any, path: string): EditableField | null {
  const keyLower = key.toLowerCase();
  
  // Color fields
  if (keyLower.includes('color') || keyLower.includes('colour')) {
    return {
      type: 'color',
      label: formatLabel(key),
      path,
      placeholder: '#000000'
    };
  }
  
  // Image/URL fields
  if (keyLower.includes('image') || keyLower.includes('url') || keyLower === 'src') {
    return {
      type: 'image',
      label: formatLabel(key),
      path,
      placeholder: 'https://...'
    };
  }
  
  // Number fields
  if (typeof value === 'number') {
    return {
      type: 'number',
      label: formatLabel(key),
      path,
      min: 0
    };
  }
  
  // Toggle/Boolean fields
  if (typeof value === 'boolean') {
    return {
      type: 'toggle',
      label: formatLabel(key),
      path
    };
  }
  
  // Text fields (short strings)
  if (typeof value === 'string') {
    // Rich text indicators
    if (keyLower.includes('description') || keyLower.includes('content') || keyLower.includes('body')) {
      return {
        type: 'textarea',
        label: formatLabel(key),
        path,
        placeholder: `Enter ${formatLabel(key).toLowerCase()}...`
      };
    }
    
    // Heading/title (potentially rich text)
    if (keyLower.includes('heading') || keyLower.includes('title')) {
      return {
        type: 'richtext',
        label: formatLabel(key),
        path,
        placeholder: `Enter ${formatLabel(key).toLowerCase()}...`
      };
    }
    
    // Short text
    if (value.length < 100) {
      return {
        type: 'text',
        label: formatLabel(key),
        path,
        placeholder: `Enter ${formatLabel(key).toLowerCase()}...`
      };
    }
    
    // Long text
    return {
      type: 'textarea',
      label: formatLabel(key),
      path,
      placeholder: `Enter ${formatLabel(key).toLowerCase()}...`
    };
  }
  
  return null;
}

/**
 * Detects array field type
 */
function detectArrayField(key: string, value: any[], path: string): EditableField | null {
  if (value.length === 0) return null;
  
  const firstItem = value[0];
  
  // Array of objects (complex structure)
  if (typeof firstItem === 'object' && firstItem !== null) {
    return {
      type: 'array',
      label: formatLabel(key),
      path,
      arrayItemType: 'text'  // Default to text, can be enhanced
    };
  }
  
  // Array of strings
  if (typeof firstItem === 'string') {
    return {
      type: 'array',
      label: formatLabel(key),
      path,
      arrayItemType: 'text'
    };
  }
  
  return null;
}

/**
 * Formats a camelCase or snake_case key into a human-readable label
 */
function formatLabel(key: string): string {
  return key
    // Split camelCase
    .replace(/([A-Z])/g, ' $1')
    // Split snake_case
    .replace(/_/g, ' ')
    // Capitalize first letter
    .replace(/^./, str => str.toUpperCase())
    // Trim extra spaces
    .trim();
}

/**
 * Generates a template from a PageBlock by replacing actual values with placeholders
 */
export function generateTemplate(block: any): any {
  const template = JSON.parse(JSON.stringify(block)); // Deep clone
  
  // Replace actual values with placeholders
  function replacePlaceholders(obj: any, path = ''): void {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string' && value.length > 0) {
        // Check if it's a URL
        if (value.startsWith('http')) {
          obj[key] = `{{${currentPath}_url}}`;
        } else if (value.startsWith('#')) {
          // Color
          obj[key] = `{{${currentPath}_color}}`;
        } else {
          // Regular text
          obj[key] = `{{${currentPath}}}`;
        }
      } else if (typeof value === 'number') {
        obj[key] = `{{${currentPath}_number}}`;
      } else if (Array.isArray(value)) {
        // Keep arrays as-is for now (can be enhanced)
      } else if (typeof value === 'object' && value !== null) {
        replacePlaceholders(value, currentPath);
      }
    });
  }
  
  // Don't replace type and variant
  if (template.data) {
    replacePlaceholders(template.data);
  }
  
  return template;
}

/**
 * Hydrates a template by replacing placeholders with actual values
 */
export function hydrateTemplate(template: any, values: Record<string, any>): any {
  const hydrated = JSON.parse(JSON.stringify(template)); // Deep clone
  
  function replaceValues(obj: any): void {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
        const placeholder = value.slice(2, -2); // Remove {{ }}
        if (values[placeholder] !== undefined) {
          obj[key] = values[placeholder];
        }
      } else if (typeof value === 'object' && value !== null) {
        replaceValues(value);
      }
    });
  }
  
  replaceValues(hydrated);
  return hydrated;
}

/**
 * Extracts unique identifier for a component (type + variant)
 */
export function getComponentIdentifier(block: any): { type: string; variant: string } {
  const type = block.type?.replace('system-', '') || 'unknown';
  const variant = block.variant || 'default';
  
  return { type, variant };
}

/**
 * Categorizes a component based on its type
 */
export function categorizeComponent(type: string): string {
  const categories: Record<string, string> = {
    'hero': 'layout',
    'header': 'layout',
    'footer': 'layout',
    'rich-text': 'content',
    'features': 'content',
    'testimonials': 'content',
    'gallery': 'content',
    'product-grid': 'commerce',
    'product-card': 'commerce',
    'cta': 'forms',
    'contact': 'forms'
  };
  
  return categories[type] || 'other';
}

/**
 * Generates a human-readable name for a component
 */
export function generateComponentName(block: any): string {
  const { type, variant } = getComponentIdentifier(block);
  
  // Format: "Minimal Hero" or "Modern Product Grid"
  const formattedType = formatLabel(type);
  const formattedVariant = formatLabel(variant);
  
  return `${formattedVariant} ${formattedType}`;
}
