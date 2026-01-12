/**
 * Basic Liquid template parser for Shopify themes
 * Extracts variables, loops, conditionals, and filters
 */

export interface LiquidVariable {
  type: 'variable';
  path: string; // e.g., "product.title", "collection.products"
  filters: LiquidFilter[];
  raw: string;
}

export interface LiquidFilter {
  name: string;
  args: string[];
}

export interface LiquidTag {
  type: 'if' | 'unless' | 'for' | 'assign' | 'include' | 'section' | 'comment' | 'raw' | 'other';
  condition?: string;
  variable?: string;
  iterable?: string;
  content?: string;
  args?: Record<string, any>;
  raw: string;
}

export interface LiquidNode {
  type: 'text' | 'variable' | 'tag';
  content: string;
  data?: LiquidVariable | LiquidTag;
}

export function parseLiquidTemplate(template: string): LiquidNode[] {
  const nodes: LiquidNode[] = [];
  let position = 0;
  
  while (position < template.length) {
    // Find next Liquid marker
    const nextVariable = template.indexOf('{{', position);
    const nextTag = template.indexOf('{%', position);
    
    let nextMarker = -1;
    let markerType: 'variable' | 'tag' | null = null;
    
    if (nextVariable !== -1 && (nextTag === -1 || nextVariable < nextTag)) {
      nextMarker = nextVariable;
      markerType = 'variable';
    } else if (nextTag !== -1) {
      nextMarker = nextTag;
      markerType = 'tag';
    }
    
    // Add text content before marker
    if (nextMarker === -1) {
      // No more Liquid syntax, add remaining text
      if (position < template.length) {
        nodes.push({
          type: 'text',
          content: template.substring(position)
        });
      }
      break;
    } else if (nextMarker > position) {
      nodes.push({
        type: 'text',
        content: template.substring(position, nextMarker)
      });
    }
    
    // Parse Liquid syntax
    if (markerType === 'variable') {
      const endMarker = template.indexOf('}}', nextMarker);
      if (endMarker === -1) break;
      
      const raw = template.substring(nextMarker, endMarker + 2);
      const content = template.substring(nextMarker + 2, endMarker).trim();
      
      nodes.push({
        type: 'variable',
        content: raw,
        data: parseVariable(content, raw)
      });
      
      position = endMarker + 2;
    } else if (markerType === 'tag') {
      const endMarker = template.indexOf('%}', nextMarker);
      if (endMarker === -1) break;
      
      const raw = template.substring(nextMarker, endMarker + 2);
      const content = template.substring(nextMarker + 2, endMarker).trim();
      
      nodes.push({
        type: 'tag',
        content: raw,
        data: parseTag(content, raw)
      });
      
      position = endMarker + 2;
    }
  }
  
  return nodes;
}

function parseVariable(content: string, raw: string): LiquidVariable {
  const parts = content.split('|').map(p => p.trim());
  const path = parts[0];
  const filters: LiquidFilter[] = [];
  
  for (let i = 1; i < parts.length; i++) {
    const filterPart = parts[i];
    const colonIndex = filterPart.indexOf(':');
    
    if (colonIndex === -1) {
      filters.push({ name: filterPart.trim(), args: [] });
    } else {
      const name = filterPart.substring(0, colonIndex).trim();
      const argsStr = filterPart.substring(colonIndex + 1).trim();
      const args = argsStr.split(',').map(a => a.trim().replace(/^['"]|['"]$/g, ''));
      filters.push({ name, args });
    }
  }
  
  return { type: 'variable', path, filters, raw };
}

function parseTag(content: string, raw: string): LiquidTag {
  const parts = content.split(/\s+/);
  const tagName = parts[0];
  
  // IF tag
  if (tagName === 'if' || tagName === 'unless') {
    return {
      type: tagName,
      condition: parts.slice(1).join(' '),
      raw
    };
  }
  
  // FOR loop
  if (tagName === 'for') {
    const forMatch = content.match(/for\s+(\w+)\s+in\s+(.+)/);
    return {
      type: 'for',
      variable: forMatch?.[1],
      iterable: forMatch?.[2],
      raw
    };
  }
  
  // ASSIGN
  if (tagName === 'assign') {
    const assignMatch = content.match(/assign\s+(\w+)\s*=\s*(.+)/);
    return {
      type: 'assign',
      variable: assignMatch?.[1],
      content: assignMatch?.[2],
      raw
    };
  }
  
  // INCLUDE
  if (tagName === 'include' || tagName === 'render') {
    const includeMatch = content.match(/(?:include|render)\s+['"]?([^'"]+)['"]?(.*)/);
    const args: Record<string, any> = {};
    
    if (includeMatch?.[2]) {
      const argsStr = includeMatch[2].trim();
      const argPairs = argsStr.split(',').map(a => a.trim());
      argPairs.forEach(pair => {
        const [key, value] = pair.split(':').map(p => p.trim());
        if (key && value) {
          args[key] = value.replace(/^['"]|['"]$/g, '');
        }
      });
    }
    
    return {
      type: 'include',
      content: includeMatch?.[1],
      args,
      raw
    };
  }
  
  // SECTION
  if (tagName === 'section') {
    const sectionMatch = content.match(/section\s+['"]([^'"]+)['"]/);
    return {
      type: 'section',
      content: sectionMatch?.[1],
      raw
    };
  }
  
  // COMMENT
  if (tagName === 'comment') {
    return {
      type: 'comment',
      raw
    };
  }
  
  return {
    type: 'other',
    content: tagName,
    raw
  };
}

/**
 * Extract all variables from a Liquid template
 */
export function extractVariables(template: string): string[] {
  const nodes = parseLiquidTemplate(template);
  const variables = new Set<string>();
  
  nodes.forEach(node => {
    if (node.type === 'variable' && node.data) {
      const varData = node.data as LiquidVariable;
      variables.add(varData.path.split('.')[0]);
    }
    
    if (node.type === 'tag' && node.data) {
      const tagData = node.data as LiquidTag;
      if (tagData.type === 'for' && tagData.iterable) {
        const iterPath = tagData.iterable.split('.')[0];
        variables.add(iterPath);
      }
    }
  });
  
  return Array.from(variables);
}

/**
 * Extract product/collection references
 */
export function extractDataReferences(template: string): {
  products: boolean;
  collections: boolean;
  cart: boolean;
  customer: boolean;
  blog: boolean;
  pages: boolean;
} {
  const variables = extractVariables(template);
  
  return {
    products: variables.some(v => v === 'product' || v === 'all_products'),
    collections: variables.some(v => v === 'collection' || v === 'collections'),
    cart: variables.some(v => v === 'cart'),
    customer: variables.some(v => v === 'customer'),
    blog: variables.some(v => v === 'blog' || v === 'article'),
    pages: variables.some(v => v === 'page')
  };
}

/**
 * Common Liquid filters and their JavaScript equivalents
 */
export const LIQUID_FILTERS: Record<string, string> = {
  'money': 'formatCurrency',
  'money_with_currency': 'formatCurrencyWithCode',
  'date': 'formatDate',
  'default': '||',
  'upcase': 'toUpperCase',
  'downcase': 'toLowerCase',
  'capitalize': 'capitalize',
  'strip_html': 'stripHtml',
  'truncate': 'truncate',
  'truncatewords': 'truncateWords',
  'replace': 'replace',
  'remove': 'remove',
  'escape': 'escape',
  'newline_to_br': 'nl2br',
  'img_url': 'imageUrl',
  'asset_url': 'assetUrl',
  'link_to': 'linkTo',
  'url_for_vendor': 'vendorUrl',
  'within': 'within',
  'size': 'length',
  'join': 'join',
  'split': 'split',
  'plus': '+',
  'minus': '-',
  'times': '*',
  'divided_by': '/',
  'modulo': '%'
};

/**
 * Map Shopify objects to nexusOS data
 */
export const SHOPIFY_TO_NEXUSOS: Record<string, string> = {
  'product.title': 'product.name',
  'product.price': 'product.price',
  'product.compare_at_price': 'product.compare_at_price',
  'product.description': 'product.description',
  'product.vendor': 'product.brand',
  'product.type': 'product.category',
  'product.images': 'product.images',
  'product.featured_image': 'product.images[0]',
  'product.url': 'productUrl(product)',
  'product.available': 'product.in_stock',
  'product.variants': 'product.variants',
  
  'collection.title': 'collection.name',
  'collection.description': 'collection.description',
  'collection.products': 'collectionProducts(collection)',
  'collection.image': 'collection.image_url',
  'collection.url': 'collectionUrl(collection)',
  
  'shop.name': 'store.name',
  'shop.description': 'store.description',
  'shop.url': 'store.domain',
  
  'cart.item_count': 'cart.itemCount',
  'cart.total_price': 'cart.total',
  'cart.items': 'cart.items',
  
  'customer.name': 'customer.name',
  'customer.email': 'customer.email',
  'customer.first_name': 'customer.first_name',
  'customer.last_name': 'customer.last_name'
};
