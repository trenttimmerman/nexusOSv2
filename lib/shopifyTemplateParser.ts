/**
 * Parse Shopify template JSON files to extract page structure
 */

export interface TemplateSection {
  id: string;
  type: string;
  disabled?: boolean;
  settings: Record<string, any>;
  blocks?: TemplateSectionBlock[];
  blockOrder?: string[];
}

export interface TemplateSectionBlock {
  id: string;
  type: string;
  disabled?: boolean;
  settings: Record<string, any>;
}

export interface ParsedTemplate {
  sections: TemplateSection[];
  sectionOrder: string[];
}

/**
 * Parse a Shopify template JSON file
 */
export function parseTemplate(templateJson: any): ParsedTemplate {
  const sections: TemplateSection[] = [];
  const sectionOrder: string[] = templateJson.order || [];
  
  if (!templateJson.sections) {
    return { sections, sectionOrder };
  }
  
  // Process each section in order
  sectionOrder.forEach(sectionId => {
    const sectionData = templateJson.sections[sectionId];
    if (!sectionData) return;
    
    // Skip disabled sections
    if (sectionData.disabled === true) return;
    
    const section: TemplateSection = {
      id: sectionId,
      type: sectionData.type,
      disabled: sectionData.disabled,
      settings: sectionData.settings || {},
      blocks: [],
      blockOrder: sectionData.block_order || []
    };
    
    // Parse blocks within the section
    if (sectionData.blocks) {
      section.blockOrder?.forEach(blockId => {
        const blockData = sectionData.blocks[blockId];
        if (!blockData || blockData.disabled === true) return;
        
        section.blocks?.push({
          id: blockId,
          type: blockData.type,
          disabled: blockData.disabled,
          settings: blockData.settings || {}
        });
      });
    }
    
    sections.push(section);
  });
  
  return { sections, sectionOrder };
}

/**
 * Extract all templates from theme
 */
export function parseAllTemplates(templates: Record<string, string>): Record<string, ParsedTemplate> {
  const result: Record<string, ParsedTemplate> = {};
  
  Object.entries(templates).forEach(([filename, content]) => {
    // Only parse JSON templates
    if (!filename.endsWith('.json')) return;
    
    try {
      const templateJson = JSON.parse(content);
      const templateName = filename.replace('.json', '').replace('templates/', '');
      result[templateName] = parseTemplate(templateJson);
    } catch (error) {
      console.error(`Failed to parse template ${filename}:`, error);
    }
  });
  
  return result;
}

/**
 * Get section settings with actual configured values
 */
export function getSectionSettings(section: TemplateSection): Record<string, any> {
  return section.settings;
}

/**
 * Get block settings with actual configured values
 */
export function getBlockSettings(block: TemplateSectionBlock): Record<string, any> {
  return block.settings;
}
