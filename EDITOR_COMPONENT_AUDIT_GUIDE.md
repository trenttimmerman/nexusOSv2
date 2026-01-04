# Editor Component Audit Guide

## Purpose
This guide ensures **complete feature parity** between UI components and their editor controls. Every visual element, color, toggle, and text field in a component MUST be editable through the admin panel.

---

## The 6-Step Audit Process

### Step 1: Audit the Component
**Goal:** Identify every customizable aspect of the component.

**What to look for:**
- Visual elements (icons, badges, banners, animations)
- Colors (backgrounds, text, borders, accents, hovers, badges)
- Text content (labels, taglines, CTAs, ticker messages)
- Layout options (sticky/static, alignment, spacing, max-width)
- Visibility toggles (show/hide for each element)
- Interactive states (hover colors, active states)
- Variant-specific features (e.g., Bunker's ticker, Luxe's tagline, Pilot's CTA button)

**Example from HeaderBunker:**
```
✓ Ticker banner (background, text color, border, content)
✓ Search icon (show/hide)
✓ Account icon (show/hide)
✓ Cart icon with badge (show/hide, badge colors)
✓ Navigation links (text color, hover color)
✓ Heavy borders (border color)
✓ Background color
✓ Sticky positioning
```

---

### Step 2: Check the Data Structure
**Goal:** Ensure the TypeScript interface has properties for ALL identified elements.

**File to check:** Component library file (e.g., `HeaderLibrary.tsx`, `FooterLibrary.tsx`)

**What to verify:**
- Interface includes ALL color properties
- Interface includes ALL toggle properties
- Interface includes ALL text content properties
- Interface includes ALL layout properties
- Properties are properly typed and documented with comments

**Example:**
```typescript
export interface HeaderData {
  // Visibility toggles
  showSearch?: boolean;
  showAccount?: boolean;
  showCart?: boolean;
  
  // Colors
  backgroundColor?: string;
  textColor?: string;
  textHoverColor?: string;
  cartBadgeColor?: string;
  cartBadgeTextColor?: string;
  
  // Ticker (Bunker-specific)
  tickerBackgroundColor?: string;
  tickerTextColor?: string;
  tickerBorderColor?: string;
  tickerText?: string;
  
  // Layout
  sticky?: boolean;
  maxWidth?: string;
}
```

---

### Step 3: Check the Defaults Object
**Goal:** Ensure each component variant has complete default values.

**What to verify:**
- DEFAULTS object exists for each component variant (e.g., `CANVAS_DEFAULTS`, `BUNKER_DEFAULTS`)
- Every property in the interface has a default value (or is intentionally optional)
- Default values match the component's design aesthetic
- Defaults are sensible and production-ready

**Example:**
```typescript
const BUNKER_DEFAULTS: HeaderData = {
  showSearch: true,
  showAccount: true,
  showCart: true,
  backgroundColor: '#facc15',
  borderColor: '#000000',
  textColor: '#000000',
  textHoverColor: '#facc15',
  cartBadgeColor: '#000000',
  cartBadgeTextColor: '#facc15',
  tickerBackgroundColor: '#000000',
  tickerTextColor: '#facc15',
  tickerBorderColor: '#000000',
  tickerText: 'FREE SHIPPING WORLDWIDE — 0% TRANSACTION FEES',
  sticky: true,
  maxWidth: 'full',
};
```

---

### Step 4: Check the Implementation
**Goal:** Ensure the component actually uses the data props (no hardcoded values).

**What to verify:**
- Component merges defaults with incoming data: `const settings = { ...DEFAULTS, ...data }`
- All styles use `settings.propertyName` or `merged.propertyName`
- No hardcoded colors in style attributes or className strings
- Conditional rendering uses data toggles: `{settings.showElement && <Element />}`
- Hover states use data props via `hoverColor` prop or inline event handlers

**Anti-patterns to avoid:**
```typescript
// ❌ BAD - Hardcoded
<div className="bg-black text-yellow-400">

// ✅ GOOD - Data-driven
<div style={{ backgroundColor: merged.tickerBackgroundColor, color: merged.tickerTextColor }}>
```

```typescript
// ❌ BAD - Always visible
<Search size={24} />

// ✅ GOOD - Conditional
{merged.showSearch && <Search size={24} />}
```

---

### Step 5: Check the Admin Controls
**Goal:** Ensure the admin panel has UI controls for every data property.

**File to check:** `AdminPanel.tsx` (or equivalent editor file)

**5A. Universal Controls**
Controls that appear for ALL variants of a component type.

**What to include:**
- Show/Hide toggles (grid of icon buttons)
- Common colors (background, border, text, text hover, cart badge)
- Layout options (sticky toggle, max-width selector)

**Example:**
```tsx
{/* Show/Hide Controls */}
<div className="grid grid-cols-3 gap-3">
  {[
    { key: 'showSearch', label: 'Search', icon: Search },
    { key: 'showAccount', label: 'Account', icon: User },
    { key: 'showCart', label: 'Cart', icon: ShoppingBag },
  ].map(({ key, label, icon: Icon }) => (
    <button
      key={key}
      onClick={() => onConfigChange({
        ...config,
        headerData: { ...config.headerData, [key]: !(config.headerData?.[key] ?? true) }
      })}
      className={`... ${
        (config.headerData?.[key] ?? true)
          ? 'bg-blue-500/20 border-blue-500/50'
          : 'bg-neutral-900 border-neutral-700'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  ))}
</div>
```

**5B. Variant-Specific Controls**
Controls that only appear when a specific variant is selected.

**What to include:**
- Conditional sections: `{(config.headerStyle === 'variantName') && <div>...</div>}`
- Variant-unique text inputs (tagline, CTA text, ticker content)
- Variant-unique colors (accent colors, special elements)
- Variant-unique toggles (indicator dot, logo badge, menu icon)

**Example:**
```tsx
{/* Bunker-specific Controls */}
{(config.headerStyle === 'bunker') && (
  <div className="space-y-3 mb-6">
    <p className="text-xs text-neutral-400 uppercase">Ticker Banner</p>
    
    {/* Ticker Text Input */}
    <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
      <label className="text-sm text-neutral-300 mb-2 block">Ticker Text</label>
      <input
        type="text"
        value={config.headerData?.tickerText ?? 'FREE SHIPPING'}
        onChange={(e) => onConfigChange({
          ...config,
          headerData: { ...config.headerData, tickerText: e.target.value }
        })}
        className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-white text-sm"
      />
    </div>
    
    {/* Ticker Colors */}
    <div className="grid grid-cols-2 gap-3">
      {[
        { key: 'tickerBackgroundColor', label: 'Ticker Background', defaultValue: '#000000' },
        { key: 'tickerTextColor', label: 'Ticker Text', defaultValue: '#facc15' },
        { key: 'tickerBorderColor', label: 'Ticker Border', defaultValue: '#000000' },
      ].map(({ key, label, defaultValue }) => (
        <div key={key} className="flex items-center gap-3 bg-neutral-900 p-3 rounded-lg border border-neutral-700">
          <input
            type="color"
            value={config.headerData?.[key] ?? defaultValue}
            onChange={(e) => onConfigChange({
              ...config,
              headerData: { ...config.headerData, [key]: e.target.value }
            })}
            className="w-8 h-8 rounded cursor-pointer"
          />
          <span className="text-sm text-neutral-300">{label}</span>
        </div>
      ))}
    </div>
  </div>
)}
```

---

### Step 6: Verify Completeness
**Goal:** Cross-reference to ensure nothing is missing.

**Checklist:**
- [ ] Every visual element has a corresponding toggle or color control
- [ ] Every text element has an input field
- [ ] Every color in the component has a color picker
- [ ] Every toggle in the data structure has a button in the admin
- [ ] Component preview reflects changes immediately
- [ ] No console errors when toggling or changing values
- [ ] Default values are sensible and match the design

**How to verify:**
1. Open the component in the admin panel
2. Try to customize EVERY visible element
3. If you can't change something, it's missing from the editor
4. Add the missing control and repeat

---

## Common Patterns & Best Practices

### Color Pickers
```tsx
{[
  { key: 'backgroundColor', label: 'Background', defaultValue: '#ffffff' },
  { key: 'textColor', label: 'Text', defaultValue: '#000000' },
].map(({ key, label, defaultValue }) => (
  <div key={key} className="flex items-center gap-3 bg-neutral-900 p-3 rounded-lg border border-neutral-700">
    <input
      type="color"
      value={config.componentData?.[key] ?? defaultValue}
      onChange={(e) => onConfigChange({
        ...config,
        componentData: { ...config.componentData, [key]: e.target.value }
      })}
      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
    />
    <span className="text-sm text-neutral-300">{label}</span>
  </div>
))}
```

### Text Inputs
```tsx
<div className="bg-neutral-900 p-3 rounded-lg border border-neutral-700">
  <label className="text-sm text-neutral-300 mb-2 block">Label Text</label>
  <input
    type="text"
    value={config.componentData?.textField ?? 'Default Value'}
    onChange={(e) => onConfigChange({
      ...config,
      componentData: { ...config.componentData, textField: e.target.value }
    })}
    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 outline-none"
    placeholder="Placeholder text"
  />
</div>
```

### Toggle Buttons (Individual)
```tsx
<button
  onClick={() => onConfigChange({
    ...config,
    componentData: { ...config.componentData, showElement: !(config.componentData?.showElement ?? true) }
  })}
  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
    (config.componentData?.showElement ?? true)
      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
      : 'bg-neutral-900 border-neutral-700 text-neutral-500'
  }`}
>
  <Icon size={16} />
  <span className="text-sm">Label</span>
</button>
```

### Toggle Grid (Multiple)
```tsx
<div className="grid grid-cols-2 gap-3">
  <button onClick={...} className={...}>
    <Icon size={16} />
    <span>Option 1</span>
  </button>
  <button onClick={...} className={...}>
    <Icon size={16} />
    <span>Option 2</span>
  </button>
</div>
```

---

## Application to Other Sections

This same process applies to:

### Footers
- Audit: Background colors, text colors, social icons, newsletter signup, legal links, layout columns
- Data Structure: `FooterData` interface
- Defaults: `FOOTER_VARIANT_DEFAULTS`
- Implementation: Footer component uses data props
- Admin Controls: Footer-specific section in settings

### Heroes
- Audit: Headline, subheadline, CTA buttons, background images/videos, overlays, animations
- Data Structure: `HeroData` interface
- Defaults: `HERO_VARIANT_DEFAULTS`
- Implementation: Hero component uses data props
- Admin Controls: Hero editor in page builder

### Product Cards
- Audit: Image layout, title, price, badges, buttons, hover effects
- Data Structure: `ProductCardData` interface
- Defaults: `CARD_VARIANT_DEFAULTS`
- Implementation: Card component uses data props
- Admin Controls: Product display settings

### Galleries
- Audit: Grid layout, hover overlays, captions, lightbox settings
- Data Structure: `GalleryData` interface
- Defaults: `GALLERY_VARIANT_DEFAULTS`
- Implementation: Gallery component uses data props
- Admin Controls: Gallery section editor

### Any New Component
1. Build the component with hardcoded values first (to establish design)
2. Identify ALL customizable aspects (Step 1)
3. Create data interface (Step 2)
4. Create defaults object (Step 3)
5. Refactor to use data props (Step 4)
6. Build admin controls (Step 5)
7. Verify completeness (Step 6)

---

## Red Flags & Warning Signs

🚨 **Missing Controls** - User can see an element but can't customize it
🚨 **Hardcoded Values** - Colors or text that don't respond to editor changes
🚨 **Incomplete Toggles** - Element exists but no show/hide option
🚨 **Orphaned Properties** - Data property exists but isn't used in component
🚨 **No Preview Updates** - Changes don't reflect in preview without page refresh
🚨 **Inconsistent Defaults** - Some variants have complete defaults, others don't

---

## Session Example: Header Audit (Jan 4, 2026)

**Components Audited:** HeaderCanvas, HeaderNebula, HeaderLuxe, HeaderPilot, HeaderBunker

**Issues Found:**
- ❌ Missing: Cart badge colors (universal)
- ❌ Missing: Luxe showMenu toggle
- ❌ Missing: Pilot showLogoBadge toggle
- ❌ Missing: Pilot accentColor control
- ❌ Missing: Bunker ticker customization (background, text, border, content)
- ❌ Missing: Nebula showAccount toggle

**Fixes Applied:**
1. Added cartBadgeColor and cartBadgeTextColor to universal controls
2. Added showMenu toggle to Luxe-specific section
3. Added showLogoBadge toggle and accentColor to Pilot-specific section
4. Created Bunker-specific section with ticker controls (text input + 3 color pickers)
5. Added showAccount toggle to Nebula implementation
6. Fixed hover color props on all NavItem components

**Commits:**
- `Add missing editor controls: cart badge colors, Luxe menu toggle, Pilot logo badge, Bunker section`
- `Add ticker customization controls for Bunker header (background, text color, and content)`
- `Add ticker border color control to Bunker header`

---

## Maintenance & Updates

**When adding a new component variant:**
1. Follow the 6-step process above
2. Add variant to admin selector UI
3. Add variant preview in admin panel
4. Add variant-specific controls section
5. Test all controls before committing

**When modifying an existing component:**
1. If adding a visual element, add corresponding editor control
2. If changing default colors, update DEFAULTS object
3. Run audit again to ensure nothing broke

**Before marking a component "complete":**
- [ ] All 6 steps verified
- [ ] No hardcoded values remain
- [ ] Admin controls tested for each variant
- [ ] Preview updates in real-time
- [ ] Build succeeds with no errors
- [ ] Deployed and tested on live site

---

## Quick Reference Checklist

**For every component variant, ensure:**
- [ ] Data interface includes all properties
- [ ] Defaults object is complete
- [ ] Component uses merged data props
- [ ] Universal controls exist
- [ ] Variant-specific controls exist
- [ ] All colors have pickers
- [ ] All text has inputs
- [ ] All elements have toggles
- [ ] Preview updates immediately
- [ ] No console errors
- [ ] Documented in handoff notes
