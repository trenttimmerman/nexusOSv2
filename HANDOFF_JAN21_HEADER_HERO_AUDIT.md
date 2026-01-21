# Hero Section Architecture & Product Grid Studio - Current State
**Date:** January 21, 2026  
**Session Focus:** Document hero section restructuring and prepare for Product Grid Studio work

---

## 🎯 Hero Section - Current State

### Architecture Overview

**Component Structure:**
- **Location:** `components/HeroLibrary.tsx` (2,120 lines)
- **Admin Studio:** `components/AdminPanel.tsx` - renderHeroModal function (lines 9084-9700+)
- **Modal Pattern:** 30/70 split (controls left, live preview right)

### Hero Variants (8 Total)

| ID | Name | Description | Status | Recommended |
|----|------|-------------|--------|-------------|
| `videoMask` | Video Mask Text | Cinematic video through transparent headline | ✅ | ★ Top |
| `particleField` | Particle Field | Animated particle network with 3D | ✅ | ★ Top |
| `bento` | Bento Grid 2026 | Modern card layout with video/stats | ✅ | ★ Top |
| `impact` | Full Screen | Large image fills screen | ✅ | Standard |
| `split` | Side by Side | Image one side, text other | ✅ | Standard |
| `kinetik` | Animated Banner | Scrolling text effect | ✅ | Standard |
| `grid` | Image Collage | Multiple images grid | ✅ | Standard |
| `typographic` | Luxury Typographic | Bold text with image teasers | ✅ | Standard |

### Field Registry System

**Export Structure:**
```typescript
// HeroLibrary.tsx exports:
export const HERO_COMPONENTS = { /* 8 components */ };
export const HERO_OPTIONS = [ /* 8 metadata objects */ ];
export const HERO_FIELDS = {
  videoMask: ['heading', 'subheading', 'buttonText', ...],
  particleField: ['heading', 'subheading', 'badge', ...],
  // ... all variants
};
```

**UniversalEditor Integration:**
```typescript
// UniversalEditor.tsx - Line ~43
const HERO_VARIANT_FIELDS: Record<string, string[]> = {
  videoMask: ['heading', 'subheading', 'videoUrl', ...],
  particleField: ['heading', 'badge', 'floatingImage', ...],
  // Maps which fields show for each variant
};
```

### Hero Studio Modal Features

**Left Panel (30% - Controls):**
1. **Hero Styles Section**
   - 8 variant cards in scrollable list
   - Active variant: purple border + ring
   - Recommended badge (★ TOP) on top 3
   - Shows name + description

2. **Customize Content Section**
   - Dynamic fields based on `HERO_VARIANT_FIELDS`
   - Text inputs with AI generation buttons (Wand2 icon)
   - Image upload fields
   - Color pickers
   - Toggle switches
   - Number sliders

3. **Common Fields Across Variants:**
   - `heading` - Main headline
   - `subheading` - Supporting text
   - `buttonText` - Primary CTA
   - `secondaryButtonText` - Secondary CTA
   - `buttonLink` - Link destination
   - `image` - Background/feature image
   - `overlayOpacity` - Image darkening

4. **Variant-Specific Fields:**
   - VideoMask: `videoUrl`, `textStroke`
   - ParticleField: `floatingImage`, `splineUrl`, `particleCount`, `particleColor`
   - Bento: `videoUrl`, `statLabel1/2`, `statText1/2`, `featureTitle/Desc`

**Right Panel (70% - Preview):**
- Live preview header with pulse indicator
- Scrollable preview area
- Hero component rendered with:
  - `data={heroData}`
  - `isEditable={false}`
  - `onUpdate={() => {}}`
- Updates instantly on data changes

**Warning System:**
- Detects field loss when switching variants
- Red warning overlay with:
  - List of fields that will be hidden
  - Cancel/Confirm buttons
- Preserves data even when fields hidden

### AI Generation Integration

**Gemini API:**
- Model: `gemini-2.0-flash-exp`
- Triggers per field with Wand2 icon button
- Context-aware prompts:
  - Includes variant name
  - Industry/theme from config
  - Character limits per field type
- Auto-populates field on generation

### Hero Component Pattern

**Standard Props Interface:**
```typescript
interface HeroProps {
  storeName: string;
  primaryColor: string;
  products?: Product[];
  data?: {
    heading?: string;
    heading_style?: TextStyles;
    subheading?: string;
    buttonText?: string;
    showFeaturedProduct?: boolean;
    featuredProductId?: string;
    style?: {
      backgroundColor?: string;
      textColor?: string;
      padding?: 's' | 'm' | 'l' | 'xl';
    };
    [key: string]: any;
  };
  isEditable?: boolean;
  onUpdate?: (data: any) => void;
  onSelectField?: (field: string) => void;
  onEditBlock?: (blockId: string) => void;
  blockId?: string;
}
```

**EditableText Helper:**
- Click to focus field in modal
- Calls `onSelectField(field)`
- Calls `onEditBlock(blockId)`
- Visual hover indicator when editable

**FeaturedProductOverlay:**
- Shows product card on hero
- Position: left/center/right
- Optional price display
- Links to product page

---

## 🛒 Product Grid Studio - Current State

### Architecture Overview

**Component Structure:**
- **Location:** `components/ProductCardLibrary.tsx` (358 lines)
- **Admin Studio:** `components/AdminPanel.tsx` - renderGridModal function (lines 4680-5200)
- **Modal Pattern:** 30/70 split (identical to Hero Studio)

### Card Variants (6 Total)

| ID | Name | Description | Popularity |
|----|------|-------------|------------|
| `classic` | Classic | Standard Ecommerce | 95% |
| `industrial` | Industrial | Tech & Utility | 78% |
| `focus` | Focus | Minimalist Hover | 88% |
| `hype` | Hype | Streetwear Energy | 82% |
| `magazine` | Magazine | Editorial Serif | 70% |
| `glass` | Glass | Modern Blur UI | 92% |

### Field Registry (CURRENT - MINIMAL)

**ProductCardLibrary.tsx:**
```typescript
export const PRODUCT_GRID_FIELDS: Record<string, string[]> = {
  classic: ['heading', 'subheading'],
  industrial: ['heading', 'subheading'],
  focus: ['heading', 'subheading'],
  hype: ['heading', 'subheading'],
  magazine: ['heading', 'subheading'],
  glass: ['heading', 'subheading'],
};
```

**❌ LIMITATION:** All variants only support `heading` and `subheading` - no card-level customization fields

### Product Grid Studio Modal

**Left Panel (30%):**

1. **Card Styles (6 variants)**
   - 2-column grid layout
   - Active: green border + ring
   - Shows name + description

2. **Header Branding**
   - Section Title (heading) with AI button
   - Subtitle (subheading) with AI button

3. **Product Source** (4 options)
   - All Products
   - By Category (with category selector)
   - Collection (with collection selector)
   - Manual Pick

4. **Colors (9 pickers)**
   - Background
   - Heading
   - Subheading
   - Card BG
   - Product Name
   - Price
   - Button BG
   - Button Text
   - Borders

5. **Layout Settings**
   - Columns: 2/3/4/5/6 toggle buttons
   - Show Filters toggle
   - Show Sorting toggle

**Right Panel (70%):**
- Live grid preview
- Shows 2 rows of cards (columns × 2)
- Real product data
- Filters by source type
- Updates instantly

### Product Card Component Pattern

**Standard Props:**
```typescript
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onNavigate?: () => void;
  primaryColor?: string;
  data?: {
    cardBgColor?: string;
    productNameColor?: string;
    priceColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    borderColor?: string;
  };
}
```

**Card Features:**
- Hover effects (image zoom, button reveal)
- Add to Cart button
- Product name, price, category
- Click to navigate
- Style via data prop (6 color fields)

### Image Handling Helper

```typescript
const getProductImage = (product: Product): string => {
  // Handles both legacy (product.image) and new (product.images[])
  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => img.isPrimary);
    return primaryImage?.url || product.images[0]?.url || product.image || '';
  }
  return product.image || '';
};
```

---

## 📊 Comparison: Hero vs Product Grid

| Feature | Hero Studio | Product Grid Studio |
|---------|-------------|---------------------|
| **Variants** | 8 (3 modern, 5 classic) | 6 (all modern) |
| **Modal Layout** | 30/70 split | 30/70 split |
| **AI Generation** | ✅ Per field | ✅ Heading/Subheading only |
| **Field Registry** | ✅ Per-variant fields | ⚠️ Generic (heading/subheading) |
| **Warning System** | ✅ Field loss detection | ❌ Not implemented |
| **Live Preview** | ✅ Full hero render | ✅ Full grid render |
| **Color Controls** | ✅ Variant-specific | ✅ 9 universal colors |
| **Data Persistence** | ✅ Per-variant | ✅ Global grid data |
| **Click-to-Edit** | ✅ EditableText helper | ❌ Not implemented |

---

## 🔍 Key Differences

### Hero Studio Strengths:
1. **Rich field registry** - Each variant has unique fields
2. **Warning system** - Prevents accidental data loss
3. **Field-specific controls** - Shows only relevant fields
4. **EditableText integration** - Click in preview to focus field
5. **Complex variants** - ParticleField, VideoMask, Bento with advanced features

### Product Grid Studio Gaps:
1. **❌ Minimal field registry** - Only heading/subheading for all variants
2. **❌ No card customization fields** - Can't edit card-specific features
3. **❌ No warning system** - Switching variants loses no data (because minimal data)
4. **❌ No variant-specific controls** - All variants identical
5. **✅ Color controls work** - But apply uniformly to all cards

---

## 🚀 Product Grid Studio - Work Needed

### Phase 1: Field Registry Expansion

**Add per-variant field definitions:**
```typescript
export const PRODUCT_GRID_FIELDS: Record<string, string[]> = {
  classic: [
    'heading', 'subheading',
    'showCategory', 'showQuickAdd', 'hoverAnimation',
    'cardBgColor', 'productNameColor', 'priceColor',
    'buttonBgColor', 'buttonTextColor', 'borderColor'
  ],
  industrial: [
    'heading', 'subheading',
    'showBadges', 'badgeColor', 'badgeTextColor',
    'gridLineColor', 'gridLineWidth',
    // ... industrial-specific
  ],
  // ... etc for all 6 variants
};
```

### Phase 2: Card Component Enhancement

**Add variant-specific features:**
- Classic: Quick add animation style
- Industrial: Tech badge system
- Focus: Hover reveal effects
- Hype: Diagonal overlays, bold badges
- Magazine: Editorial typography controls
- Glass: Blur intensity, glassmorphism settings

### Phase 3: Modal Control Enhancement

**Add to left panel:**
- Card Feature Toggles section
- Variant-specific settings section
- Animation controls
- Typography options

### Phase 4: Warning System

**Implement field loss detection:**
- Same pattern as Hero Studio
- Detect when switching variants hides fields
- Show red overlay with field list
- Cancel/Confirm buttons

### Phase 5: UniversalEditor Integration

**Add to SECTION_FIELD_CONFIGS:**
```typescript
'system-grid': {
  title: 'Product Grid',
  groups: [
    { id: 'content', label: 'Content', icon: <Type /> },
    { id: 'styling', label: 'Card Style', icon: <Palette /> },
    { id: 'features', label: 'Features', icon: <Settings /> },
  ],
  fields: [
    // Variant-specific field definitions
    { key: 'showCategory', label: 'Show Category', type: 'toggle', group: 'features' },
    { key: 'hoverAnimation', label: 'Hover Style', type: 'select', group: 'styling',
      options: [
        { value: 'zoom', label: 'Image Zoom' },
        { value: 'lift', label: 'Card Lift' },
        { value: 'slide', label: 'Button Slide' }
      ]
    },
    // ... etc
  ]
}
```

---

## 📝 Architecture Patterns Learned from Hero

### 1. Field Registry Pattern
```typescript
// Library file exports fields per variant
export const COMPONENT_FIELDS: Record<string, string[]> = {
  variant1: ['field1', 'field2', ...],
  variant2: ['field3', 'field4', ...],
};

// UniversalEditor maintains separate mapping for its needs
const VARIANT_FIELDS: Record<string, string[]> = {
  variant1: ['field1', 'field2', ...],
};
```

### 2. Modal 30/70 Split
```typescript
<div className="flex-1 flex overflow-hidden">
  {/* Left: 30% controls */}
  <div className="w-[30%] border-r bg-neutral-950 flex flex-col shrink-0">
    {/* Scrollable content */}
  </div>
  
  {/* Right: 70% preview */}
  <div className="flex-1 bg-neutral-800 flex flex-col">
    {/* Live preview */}
  </div>
</div>
```

### 3. Warning Overlay Pattern
```typescript
{warningFields.length > 0 && (
  <div className="absolute inset-0 z-50 bg-neutral-950/98 ...">
    <AlertTriangle />
    <h4>Content Warning</h4>
    <div>Fields that will be hidden: {warningFields.map(...)}</div>
    <button onClick={cancel}>Cancel</button>
    <button onClick={confirm}>Confirm</button>
  </div>
)}
```

### 4. AI Generation Pattern
```typescript
const generateCopy = async (field: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  const variant = OPTIONS.find(o => o.id === current)?.name;
  const prompt = `Generate ${field} for ${variant}...`;
  const result = await model.generateContent(prompt);
  updateData({ [field]: result.text().trim() });
};
```

### 5. Dynamic Field Rendering
```typescript
{availableFields.includes('fieldName') && (
  <div className="space-y-1.5">
    <label>Field Label</label>
    <input 
      value={data.fieldName || ''}
      onChange={(e) => updateData({ fieldName: e.target.value })}
    />
  </div>
)}
```

---

## ✅ Current Status Summary

**Hero Section:**
- ✅ 8 variants fully implemented
- ✅ Per-variant field registry complete
- ✅ Warning system operational
- ✅ AI generation working
- ✅ Click-to-edit pattern established
- ✅ Modal UX polished

**Product Grid:**
- ✅ 6 card variants visually complete
- ✅ Basic modal structure working
- ✅ Color controls functional
- ✅ Product sourcing system operational
- ⚠️ Field registry minimal (heading/subheading only)
- ❌ No variant-specific customization
- ❌ No warning system
- ❌ No advanced card features exposed

---

## 🎯 Next Session Goal

**Objective:** Modernize Product Grid Studio to match Hero Studio architecture

**Approach:**
1. Audit each of 6 card variants for customizable properties
2. Create comprehensive PRODUCT_GRID_FIELDS registry
3. Add variant-specific controls to modal
4. Implement warning system for variant switching
5. Enhance card components with new features
6. Add UniversalEditor field definitions
7. Test all 6 variants thoroughly

**Success Criteria:**
- Each variant has 10+ unique customization fields
- Warning system prevents data loss
- All card features accessible via modal
- No editing requires code changes
- Pattern matches Hero Studio quality

---

**Files to Reference:**
- [components/HeroLibrary.tsx](components/HeroLibrary.tsx) - Pattern to replicate
- [components/ProductCardLibrary.tsx](components/ProductCardLibrary.tsx) - Target for enhancement
- [components/AdminPanel.tsx](components/AdminPanel.tsx) - Modal implementations (Hero: 9084+, Grid: 4680+)
- [components/UniversalEditor.tsx](components/UniversalEditor.tsx) - Field config registry
