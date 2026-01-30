/**
 * Field Inference Engine
 * Auto-detects editable field types from field names and default values
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
  path: string;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
}

/**
 * Infer field type from field name using pattern matching
 */
export function inferFieldTypeFromName(fieldName: string, value?: any): FieldType {
  const lowerName = fieldName.toLowerCase();
  
  // Array detection (value-based)
  if (Array.isArray(value)) return 'array';
  
  // Color detection
  if (lowerName.includes('color') || lowerName.includes('colour')) return 'color';
  
  // Image detection
  if (lowerName.includes('image') || lowerName.includes('img') || 
      lowerName.includes('photo') || lowerName.includes('picture') ||
      lowerName.includes('icon') || lowerName.includes('logo') ||
      lowerName.includes('thumbnail') || lowerName.includes('banner')) {
    return 'image';
  }
  
  // Boolean/Toggle detection
  if (lowerName.startsWith('show') || lowerName.startsWith('is') || 
      lowerName.startsWith('has') || lowerName.startsWith('enable') ||
      lowerName.includes('visible') || typeof value === 'boolean') {
    return 'toggle';
  }
  
  // Number detection
  if (lowerName.includes('count') || lowerName.includes('size') || 
      lowerName.includes('width') || lowerName.includes('height') ||
      lowerName.includes('spacing') || lowerName.includes('duration') ||
      lowerName.includes('delay') || lowerName.includes('opacity') ||
      typeof value === 'number') {
    return 'number';
  }
  
  // Rich text detection (headings, titles)
  if (lowerName.includes('heading') || lowerName.includes('title') || 
      lowerName === 'headline') {
    return 'richtext';
  }
  
  // Textarea detection (descriptions, content)
  if (lowerName.includes('description') || lowerName.includes('content') || 
      lowerName.includes('bio') || lowerName.includes('about') ||
      lowerName.includes('message') || lowerName.includes('text') && lowerName.includes('long')) {
    return 'textarea';
  }
  
  // Select detection (enum-like names)
  if (lowerName.includes('style') || lowerName.includes('variant') || 
      lowerName.includes('type') || lowerName.includes('position') ||
      lowerName.includes('alignment') || lowerName.includes('align')) {
    return 'select';
  }
  
  // Default to text
  return 'text';
}

/**
 * Convert camelCase or snake_case to human-readable label
 */
export function humanizeFieldName(fieldName: string): string {
  // Handle snake_case
  if (fieldName.includes('_')) {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Handle camelCase
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract editable fields from a DEFAULTS object or component data structure
 */
export function extractFieldsFromDefaults(
  defaults: Record<string, any>,
  pathPrefix: string = 'data'
): EditableField[] {
  const fields: EditableField[] = [];
  
  function processObject(obj: any, currentPath: string) {
    if (!obj || typeof obj !== 'object') return;
    if (obj.$$typeof || typeof obj === 'function') return;
    
    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = `${currentPath}.${key}`;
      
      // Skip internal fields
      if (key.startsWith('_') || key === 'id' || key === 'type' || key === 'variant') continue;
      
      // Handle style objects separately
      if (key === 'style' || key.endsWith('_style') || key.endsWith('Style')) {
        if (typeof value === 'object' && value !== null) {
          processObject(value, fieldPath);
        }
        continue;
      }
      
      // Handle arrays
      if (Array.isArray(value)) {
        fields.push({
          type: 'array',
          label: humanizeFieldName(key),
          path: fieldPath,
          required: false
        });
        continue;
      }
      
      // Handle nested objects (max 2 levels deep)
      if (typeof value === 'object' && value !== null && currentPath.split('.').length < 3) {
        processObject(value, fieldPath);
        continue;
      }
      
      const fieldType = inferFieldTypeFromName(key, value);
      const field: EditableField = {
        type: fieldType,
        label: humanizeFieldName(key),
        path: fieldPath,
        required: false
      };
      
      // Type-specific properties
      if (fieldType === 'number' && typeof value === 'number') {
        field.min = 0;
        field.max = value * 10;
      }
      
      if (fieldType === 'select') {
        if (key.toLowerCase().includes('align')) {
          field.options = ['left', 'center', 'right'];
        } else if (key.toLowerCase().includes('position')) {
          field.options = ['top', 'center', 'bottom', 'left', 'right'];
        } else if (key.toLowerCase().includes('size')) {
          field.options = ['small', 'medium', 'large'];
        }
      }
      
      if (fieldType === 'text' || fieldType === 'textarea') {
        field.placeholder = typeof value === 'string' ? value : '';
      }
      
      fields.push(field);
    }
  }
  
  processObject(defaults, pathPrefix);
  return fields;
}

/**
 * Extract fields from a FIELDS array (for libraries with explicit FIELDS exports)
 */
export function extractFieldsFromFieldsArray(
  fieldsArray: string[],
  defaults?: Record<string, any>
): EditableField[] {
  return fieldsArray.map(fieldName => {
    const defaultValue = defaults?.[fieldName];
    const fieldType = inferFieldTypeFromName(fieldName, defaultValue);
    
    return {
      type: fieldType,
      label: humanizeFieldName(fieldName),
      path: `data.${fieldName}`,
      required: false,
      placeholder: typeof defaultValue === 'string' ? defaultValue : undefined
    };
  });
}
