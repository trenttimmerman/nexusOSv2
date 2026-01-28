# AI Website Generator - Technical Specification

**Date:** January 28, 2026  
**Status:** ✅ Production Ready  
**Version:** 2.0 (Two-Agent System)

---

## 🎯 Overview

The AI Website Generator uses a sophisticated two-agent system powered by Google Gemini to transform natural language business descriptions into complete, production-ready e-commerce websites with custom designs, compelling content, and realistic products.

---

## 🏗️ Architecture

### Two-Agent Pipeline

```
User Prompt
    ↓
┌─────────────────────┐
│  AGENT 1: ARCHITECT │
│  (gemini-2.5-flash) │
│                     │
│  Text → Blueprint   │
└─────────────────────┘
    ↓
SiteBlueprint JSON
    ↓
┌─────────────────────┐
│ AGENT 2: PAGE       │
│ BUILDER             │
│ (gemini-2.5-flash)  │
│                     │
│ Blueprint → Blocks  │
└─────────────────────┘
    ↓
PageBlock Arrays
    ↓
Database & Design Library
```

---

## 📁 File Structure

```
ai/
├── prompts/
│   ├── architect.md       # Agent 1: Blueprint generator
│   └── page-builder.md    # Agent 2: PageBlock generator
└── agents.ts              # Orchestration logic

components/
└── AISiteGenerator.tsx    # UI component

vite-env.d.ts              # TypeScript declarations
vite.config.ts             # Build config (imports .md files)
```

---

## 🤖 Agent 1: Architect

**Purpose:** Convert natural language → Structured data blueprint

**Input:** User's business description (text)

**Output:** `SiteBlueprint` JSON object

### Blueprint Schema

```typescript
interface SiteBlueprint {
  brand: {
    name: string;           // Business name
    tagline: string;        // Catchy tagline
    vibe: string;           // minimal|luxury|modern|organic|bold...
    industry: string;       // coffee-shop|fashion|tech|home-goods...
  };
  
  design: {
    primaryColor: string;    // Hex color
    secondaryColor: string;  // Hex color
    backgroundColor: string; // Hex color
    fontStyle: 'sans' | 'serif' | 'mono';
    headingFont: string;     // e.g., "Playfair Display"
    bodyFont: string;        // e.g., "Inter"
  };
  
  content: {
    heroHeadline: string;        // 4-8 words, punchy
    heroSubheadline: string;     // 15-30 words, value prop
    ctaText: string;             // Call-to-action button
    heroImagePrompt: string;     // Detailed image description
    aboutHeadline: string;       // Section title
    aboutText: string;           // 3-4 compelling paragraphs
  };
  
  products: Array<{
    name: string;           // Specific, enticing name
    price: number;          // In cents (e.g., 4500 = $45)
    description: string;    // 2-3 sentences
    category: string;       // Product category
    imagePrompt: string;    // Detailed image prompt
  }>;
  
  features: Array<{
    title: string;          // Feature title
    description: string;    // Feature description
    icon: string;           // Lucide icon name
  }>;
  
  testimonialsEnabled: boolean;
  testimonials?: Array<{
    name: string;
    role: string;           // Location or title
    text: string;           // Review text
    rating: number;         // 1-5
  }>;
}
```

### Quality Standards

#### ❌ What to AVOID:
- Generic headlines ("Welcome to our store")
- Lorem ipsum placeholder text
- Vague product names ("Product 1")
- Basic image descriptions ("A coffee cup")

#### ✅ What to CREATE:
- **Specific headlines** that reflect the actual business
- **Compelling copy** written as if by the business owner
- **Creative product names** that sound real and enticing
- **Detailed image prompts** with artistic direction:
  - Subject + Style + Lighting + Composition + Background + Mood + Quality

### Example Image Prompt (Good):
```
"Luxury candle in amber glass vessel on rustic wooden surface, 
soft natural window light from left, wisps of smoke rising, 
dried flowers in background, cozy moody atmosphere, 
professional product photography, warm color grading, 
shallow depth of field"
```

### Color Psychology by Vibe

| Vibe | Colors |
|------|--------|
| **Minimal** | Grays, black, white, one subtle accent |
| **Luxury** | Deep purples, golds, black, cream |
| **Modern** | Blues, teals, bright accent colors |
| **Organic** | Greens, earth tones, warm neutrals |
| **Bold** | High contrast, vibrant primaries |
| **Industrial** | Grays, dark blues, orange/rust accents |

---

## 🎨 Agent 2: Page Builder

**Purpose:** Convert blueprint → PageBlock arrays for each page

**Input:** 
- `SiteBlueprint` object
- Page type (`home`, `about`, `shop`, `contact`)
- Page name

**Output:** Array of `PageBlock` objects

### PageBlock Types

#### 1. `system-hero`
```typescript
{
  "type": "system-hero",
  "variant": "impact|minimal|centered|split|fullscreen",
  "data": {
    "heading": string,
    "subheading": string,
    "buttonText": string,
    "buttonLink": string,
    "image": "https://images.unsplash.com/...",
    "style": {
      "backgroundColor": "#hex",
      "textColor": "#hex",
      "padding": "xl|l|m",
      "alignment": "center|left|right",
      "overlayOpacity": number
    }
  }
}
```

#### 2. `system-rich-text`
```typescript
{
  "type": "system-rich-text",
  "variant": "default|centered|two-column",
  "content": "<h2>...</h2><p>...</p>",  // HTML content
  "data": {
    "style": {
      "backgroundColor": "#FFFFFF",
      "textColor": "#000000",
      "padding": "l",
      "maxWidth": "prose"
    }
  }
}
```

#### 3. `system-product-grid`
```typescript
{
  "type": "system-product-grid",
  "variant": "classic|modern|minimal|cards",
  "data": {
    "title": string,
    "subtitle": string,
    "layout": "grid-3|grid-4",
    "showPrices": boolean,
    "showAddToCart": boolean,
    "productIds": string[],
    "style": { ... }
  }
}
```

#### 4. `system-features`
```typescript
{
  "type": "system-features",
  "variant": "grid|list|cards|icons",
  "data": {
    "title": string,
    "features": Array<{
      "icon": "Zap|Shield|Heart|Star|Truck...",  // Lucide icon
      "title": string,
      "description": string
    }>,
    "columns": 3,
    "style": { ... }
  }
}
```

#### 5. `system-testimonials`
```typescript
{
  "type": "system-testimonials",
  "variant": "carousel|grid|single",
  "data": {
    "title": string,
    "testimonials": Array<{
      "text": string,
      "author": string,
      "role": string,
      "rating": number
    }>,
    "style": { ... }
  }
}
```

#### 6. `system-cta`
```typescript
{
  "type": "system-cta",
  "variant": "centered|split|banner",
  "data": {
    "heading": string,
    "subheading": string,
    "buttonText": string,
    "buttonLink": string,
    "style": { ... }
  }
}
```

#### 7. `system-contact`
```typescript
{
  "type": "system-contact",
  "variant": "form|info|map",
  "data": {
    "title": string,
    "showForm": boolean,
    "contactInfo": {
      "email": string,
      "phone": string,
      "address": string
    },
    "style": { ... }
  }
}
```

#### 8. `system-gallery`
```typescript
{
  "type": "system-gallery",
  "variant": "grid|masonry|carousel",
  "data": {
    "title": string,
    "images": Array<{
      "url": string,
      "alt": string,
      "caption": string
    }>,
    "columns": 3,
    "style": { ... }
  }
}
```

### Page Type Structures

#### Home Page (4-6 blocks):
1. Hero (variant: "impact" or "split")
2. Features or About (variant: "grid" or "centered")
3. Product Grid (featured products)
4. Testimonials (if enabled)
5. CTA (variant: "centered")

#### About Page:
1. Hero (variant: "minimal")
2. Rich Text (brand story)
3. Features (brand values)
4. Gallery or Team
5. CTA

#### Shop Page:
1. Hero (variant: "minimal", short)
2. Product Grid (all products)
3. Features (why buy)
4. CTA

#### Contact Page:
1. Hero (variant: "minimal")
2. Contact (variant: "form")
3. Rich Text (hours, directions)

---

## 🖼️ Image System

### Unsplash Integration

We use deterministic Unsplash URLs based on industry:

```typescript
const categoryMap = {
  'coffee': '1447933601403-0c61db6f49a7',
  'candles': '1602874801006-95e39d3b50d9',
  'fashion': '1483985988355-763728e1935b',
  'jewelry': '1515562141207-7a88fb7ce338',
  'tech': '1451187580459-43490279c0fa',
  'food': '1504674900247-0877df9cc836',
  'beauty': '1596462502278-27a10e11f9d8',
  'fitness': '1534438327276-14e5300c3a48',
  'home': '1513694203232-719657d8cb1f',
  // ... more categories
};
```

**URL Pattern:**
```
https://images.unsplash.com/photo-{PHOTO_ID}?w=800&h=800&q=80&auto=format&fit=crop&seed={index}
```

### Future: AI Image Generation

The architecture supports integrating:
- DALL-E API
- Midjourney API
- Stable Diffusion

Simply replace `generateProductImages()` function in [ai/agents.ts](ai/agents.ts).

---

## 💾 Database Integration

### Flow

1. **Generate Blueprint** → SiteBlueprint object
2. **Generate Pages** → PageBlock arrays
3. **Generate Products** → Product objects with images
4. **Save to Database:**
   - Create entry in `store_designs` table
   - Create entries in `pages` table
   - Create entries in `products` table
   - Set design as active

### Design Library Entry

```typescript
await supabase.from('store_designs').insert({
  store_id: string,
  name: `AI Generated - ${blueprint.brand.name}`,
  is_active: true,
  
  // Layout
  header_style: 'canvas',
  hero_style: 'impact',
  product_card_style: 'modern',
  footer_style: 'columns',
  
  // Colors
  primary_color: blueprint.design.primaryColor,
  secondary_color: blueprint.design.secondaryColor,
  background_color: blueprint.design.backgroundColor,
  
  // Typography
  typography: {
    headingFont: blueprint.design.headingFont,
    bodyFont: blueprint.design.bodyFont,
    headingColor: '#000000',
    bodyColor: '#737373',
    linkColor: blueprint.design.primaryColor,
    baseFontSize: '16px',
    headingScale: 'default',
    headingWeight: '700',
    bodyWeight: '400'
  },
  
  // Metadata
  store_type: blueprint.brand.industry,
  store_vibe: blueprint.brand.vibe
});
```

---

## 🚀 Usage

### In Component

```typescript
import { generateCompleteSite } from '../ai/agents';

// Generate complete site
const result = await generateCompleteSite(userPrompt, numPages);

// Result structure:
{
  blueprint: SiteBlueprint,
  pages: Array<{
    name: string,
    type: 'home' | 'about' | 'shop' | 'contact',
    slug: string,
    blocks: PageBlock[]
  }>,
  products: Array<{
    name: string,
    price: number,
    description: string,
    category: string,
    image: string
  }>
}
```

### Progress Tracking

```typescript
setCurrentTask('🎨 Analyzing your business with AI Architect...');
setProgress(20);

setCurrentTask('🏗️ Creating site blueprint...');
setProgress(50);

setCurrentTask('✨ Generating page content...');
setProgress(90);

setCurrentTask('🎁 Preparing your preview...');
setProgress(100);
```

---

## ⚙️ Configuration

### Environment Variables

Required in `.env.local`:
```bash
VITE_GOOGLE_AI_API_KEY=your_gemini_api_key
```

### Vite Config

Must allow importing `.md` files:

```typescript
// vite.config.ts
export default defineConfig({
  assetsInclude: ['**/*.md'],
  // ...
});
```

### TypeScript Declarations

```typescript
// vite-env.d.ts
declare module '*.md?raw' {
  const content: string;
  export default content;
}
```

---

## 🎨 Prompt Engineering Best Practices

### Architect Prompt ([architect.md](ai/prompts/architect.md))

**Key Principles:**
1. **Strict Output Format** - "Return ONLY valid JSON, no markdown"
2. **Specific Examples** - Show exact desired output structure
3. **Quality Standards** - List what to avoid and what to create
4. **Context Awareness** - Color psychology, industry norms
5. **Detailed Requirements** - 15-30 word image prompts

### Page Builder Prompt ([page-builder.md](ai/prompts/page-builder.md))

**Key Principles:**
1. **Complete Schema Documentation** - Every PageBlock type defined
2. **Variants Listed** - All valid options enumerated
3. **Data Structure Examples** - JSON examples for each type
4. **Page Type Guidelines** - Recommended block sequences
5. **Content Quality Rules** - Specific, not generic copy

---

## 🔧 Extending the System

### Adding New Page Types

1. Update `generateCompleteSite()` in [ai/agents.ts](ai/agents.ts):
```typescript
const pages = [
  { name: 'Home', type: 'home', slug: 'home' },
  { name: 'About', type: 'about', slug: 'about' },
  { name: 'Shop', type: 'shop', slug: 'shop' },
  { name: 'Blog', type: 'blog', slug: 'blog' },  // NEW
];
```

2. Add page structure in [page-builder.md](ai/prompts/page-builder.md):
```markdown
### Blog Page:
**Required Blocks:**
1. Hero (variant: "minimal")
2. Blog Post Grid
3. CTA (subscribe)
```

### Adding New Block Types

1. Define block in [page-builder.md](ai/prompts/page-builder.md)
2. Update `PageBlock` type in [types.ts](types.ts)
3. Create renderer component in [components/blocks/](components/blocks/)

### Customizing Quality Rules

Edit the prompt files directly:
- Brand tone: [architect.md](ai/prompts/architect.md) → "Write like a human"
- Visual style: [page-builder.md](ai/prompts/page-builder.md) → "Page Type Guidelines"
- Content rules: Both prompts → Quality Standards sections

---

## 📊 Performance

### Generation Times (Typical)

| Step | Duration | Tokens |
|------|----------|--------|
| Blueprint Generation | 3-5s | ~1,500 |
| Page Content (per page) | 2-4s | ~1,000 |
| Product Images | <1s | 0 (Unsplash) |
| **Total (3 pages, 4 products)** | **~12-20s** | **~4,500** |

### Cost Estimate (Gemini 2.5 Flash)

- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- **Per generation:** ~$0.002 (0.2 cents)

---

## 🐛 Error Handling

### Common Issues

#### 1. Invalid JSON Response
```typescript
const jsonMatch = text.match(/\{[\s\S]*\}/);
if (!jsonMatch) {
  throw new Error('Failed to extract JSON from architect response');
}
```

**Solution:** Prompts emphasize "NO markdown, ONLY JSON"

#### 2. Missing API Key
```typescript
const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
if (!apiKey) {
  throw new Error('VITE_GOOGLE_AI_API_KEY not configured');
}
```

**Solution:** Check `.env.local` file

#### 3. Malformed PageBlocks
```typescript
const jsonMatch = text.match(/\[[\s\S]*\]/);
if (!jsonMatch) {
  console.error('[Page Builder] Failed to extract JSON array');
  throw new Error('Failed to extract JSON array');
}
```

**Solution:** Validate against schema, provide fallback defaults

---

## ✅ Testing

### Manual Test Checklist

- [ ] Generate site with minimal prompt
- [ ] Generate site with detailed prompt
- [ ] Verify blueprint has all required fields
- [ ] Check pages have 4-6 blocks each
- [ ] Confirm products have images
- [ ] Verify colors match requested vibe
- [ ] Check copy is specific (not generic)
- [ ] Confirm design saves to library
- [ ] Verify design auto-activates
- [ ] Test page reload after generation

### Example Test Prompts

**Minimal:**
```
A modern coffee shop
```

**Detailed:**
```
Luxury artisan candle company based in Portland. 
Organic soy wax, essential oils, moody Pacific Northwest 
aesthetic. Target audience: mindful millennials who care 
about sustainability and ambiance.
```

**Edge Case:**
```
Gothic gardening tools shop - dark, moody aesthetic 
selling high-end pruning shears and hand-forged trowels
```

---

## 📈 Future Enhancements

### Planned Features

1. **AI Image Generation**
   - Integrate DALL-E 3 or Midjourney
   - Generate unique product images
   - Create custom hero images

2. **Multi-Language Support**
   - Blueprint in user's language
   - Content translation
   - Localized product descriptions

3. **Industry Templates**
   - Pre-optimized prompts per industry
   - Category-specific block types
   - Vertical-specific best practices

4. **A/B Testing**
   - Generate multiple variants
   - Compare blueprints
   - User selects preferred version

5. **Incremental Regeneration**
   - Regenerate single pages
   - Refresh products only
   - Update copy without changing structure

---

## 📚 Related Documentation

- [AI_QUICK_REFERENCE.md](AI_QUICK_REFERENCE.md) - Quick tips
- [AI_GENERATION_GUIDE.md](AI_GENERATION_GUIDE.md) - User guide
- [HANDOFF_JAN28_AI_ENHANCEMENT.md](HANDOFF_JAN28_AI_ENHANCEMENT.md) - Session notes

---

## 🎯 Success Metrics

**Quality Indicators:**
- ✅ No "Lorem ipsum" or placeholder text
- ✅ Specific headlines (not "Welcome to...")
- ✅ Realistic product names and prices
- ✅ Detailed image descriptions (15+ words)
- ✅ Color schemes match brand vibe
- ✅ Copy sounds human-written
- ✅ Pages render correctly in designer
- ✅ Design appears in library

**Technical Indicators:**
- ✅ Generation completes in <30s
- ✅ No JSON parsing errors
- ✅ All blocks have valid types
- ✅ Products have images
- ✅ Design auto-activates
- ✅ Page reload applies design

---

**Last Updated:** January 28, 2026  
**Maintained By:** Development Team  
**Version:** 2.0.0
