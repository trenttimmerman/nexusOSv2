# Editor Component Audit Guide

## Purpose
This guide ensures **complete feature parity** between UI components and their editor controls. Every visual element, color, toggle, and text field in a component MUST be editable through the admin panel.

---

## The 6-Step Audit Process

### Step 1: Audit the Component
**Goal:** Identify every customizable aspect of the component.

**⚠️ MANDATORY ICON CHECKLIST (For Headers):**
Every header MUST have these 3 icons with show/hide toggles:
- [ ] **Search** icon (🔍 magnifying glass)
- [ ] **Account** icon (👤 user/person) 
- [ ] **Cart** icon (🛒 shopping bag) with count badge

**If ANY of these 3 icons are missing from your header implementation, STOP and add them immediately!**

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
- **⚠️ CRITICAL:** Interface MUST be complete BEFORE implementation begins
- Every property used in ANY variant MUST be in the shared interface

**⚠️ COMMON ERROR - Incomplete Interface:**
When adding features incrementally to different variants, it's easy to forget to update the shared interface. This causes TypeScript errors when properties are used but not defined.

**Prevention:** After implementing ANY new feature in a variant, IMMEDIATELY add the property to the interface.

**Example:**
```typescript
export interface HeaderData {
  // Visibility toggles - MUST include all variants' toggles
  showSearch?: boolean;
  showAccount?: boolean;
  showCart?: boolean;
  showCTA?: boolean;           // Pilot variant
  showMenu?: boolean;          // Luxe variant
  showTagline?: boolean;       // Luxe variant
  showLogoBadge?: boolean;     // Pilot variant
  showIndicatorDot?: boolean;  // Nebula variant
  
  // Colors - MUST include all color properties used by any variant
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  textHoverColor?: string;
  accentColor?: string;        // Used by Nebula, Pilot, Luxe
  cartBadgeColor?: string;
  cartBadgeTextColor?: string;
  taglineColor?: string;       // Luxe variant
  
  // CTA/Button (Pilot-specific)
  ctaBackgroundColor?: string;
  ctaHoverColor?: string;
  ctaTextColor?: string;
  ctaText?: string;
  
  // Ticker (Bunker-specific)
  tickerBackgroundColor?: string;
  tickerTextColor?: string;
  tickerBorderColor?: string;
  tickerText?: string;
  
  // Tagline (Luxe-specific)
  taglineText?: string;
  
  // Search customization
  showKeyboardShortcut?: boolean;
  searchPlaceholder?: string;
  searchBackgroundColor?: string;
  searchFocusBackgroundColor?: string;
  searchFocusBorderColor?: string;
  searchInputTextColor?: string;
  searchPlaceholderColor?: string;
  
  // Glass effect (Nebula-specific)
  blurIntensity?: string;
  
  // Layout
  sticky?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  paddingX?: string;
  paddingY?: string;
}
```

**How to verify interface completeness:**
1. Search for all DEFAULTS objects in the file (e.g., `CANVAS_DEFAULTS`, `PILOT_DEFAULTS`)
2. Check every property used in EVERY DEFAULTS object
3. Ensure ALL properties exist in the shared interface
4. Run TypeScript check: `npm run build` - should have ZERO errors

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

## Critical: Icon Imports in AdminPanel

**⚠️ BREAKING ERROR - Missing Icon Imports:**
When components use lucide-react icons, those icons MUST be imported in `AdminPanel.tsx` if the admin panel renders or previews those components.

**Why this happens:**
- Component library imports icons for component use
- AdminPanel imports component library to show previews
- If AdminPanel tries to render a component that uses an icon not in AdminPanel's imports, it crashes
- Error: `ReferenceError: [IconName] is not defined`

**Prevention Checklist:**
When adding OR modifying a component that uses icons:

1. **Identify all icons used** in the component
   ```tsx
   // Example: HeaderPilot uses Hexagon icon
   <Hexagon size={20} />
   ```

2. **Check AdminPanel.tsx imports** (around line 62-160)
   ```typescript
   import {
     LayoutDashboard,
     Search,
     User,
     ShoppingBag,
     Menu,
     Hexagon,  // ← Must be here if used in any component!
     // ... other icons
   } from 'lucide-react';
   ```

3. **Add missing icons immediately**
   - If icon is used in component but NOT in AdminPanel imports → ADD IT
   - Keep icons in alphabetical order for maintainability

**Common icons that MUST be in AdminPanel:**
- `Search` - Used in all headers with search
- `User` - Used in all headers with account
- `ShoppingBag` - Used in all headers with cart
- `Menu` - Used in headers with mobile menu (Luxe, Pilot)
- `Hexagon` - Used in Pilot header logo badge
- `Command` - Used in Venture header keyboard shortcut

**Quick fix when you get icon errors:**
1. Note the icon name from error: `ReferenceError: Hexagon is not defined`
2. Open `AdminPanel.tsx`
3. Find the lucide-react import block
4. Add the icon name to the import list
5. Commit: `git commit -m "Add missing [IconName] icon import to AdminPanel"`

---

## Event Handling Patterns

**⚠️ COMMON BUG - Expandable Search Input:**

**Problem:** Click on search icon doesn't open input, or input closes immediately when clicked.

**Root Cause:** The `onBlur` event fires before the `onClick` event can complete when clicking the search icon to toggle.

**❌ WRONG APPROACH:**
```tsx
// This does NOT work - preventDefault on container doesn't help
<div onMouseDown={(e) => e.preventDefault()}>
  <input
    onBlur={() => { setSearchOpen(false); }}
    autoFocus
  />
</div>
```

**✅ CORRECT APPROACH:**
```tsx
// Use setTimeout to delay blur action
<div>
  <input
    onBlur={() => {
      // Small delay allows clicks to register first
      setTimeout(() => {
        setSearchOpen(false);
        setSearchFocused(false);
      }, 150);
    }}
    onFocus={() => setSearchFocused(true)}
    autoFocus
  />
</div>
```

**Why this works:**
- `setTimeout` delays the blur action by 150ms
- Click events process immediately
- By the time blur executes, click has already toggled the state
- User experience is smooth and natural

**When to use this pattern:**
- Expandable search inputs
- Dropdown menus that toggle on click
- Popovers/modals that close on outside click
- Any toggle interaction where blur might conflict with click

**Alternative pattern (for more complex cases):**
```tsx
const searchRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setSearchOpen(false);
    }
  };
  
  if (searchOpen) {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
}, [searchOpen]);

return (
  <div ref={searchRef}>
    <input autoFocus />
  </div>
);
```

---

## Component Deletion Checklist

**When removing a component variant (e.g., removing HeaderOrbit):**

**⚠️ CRITICAL STEPS - Missing any causes runtime errors:**

1. **Delete the component implementation**
   ```tsx
   // Remove the entire HeaderOrbit component function
   export const HeaderOrbit: React.FC<HeaderProps> = ... ❌ DELETE THIS
   ```

2. **Delete the DEFAULTS object**
   ```tsx
   const ORBIT_DEFAULTS: HeaderData = { ... }; ❌ DELETE THIS
   ```

3. **Remove from HEADER_COMPONENTS registry**
   ```tsx
   export const HEADER_COMPONENTS: Record<string, React.FC<HeaderProps>> = {
     canvas: HeaderCanvas,
     orbit: HeaderOrbit,  // ❌ DELETE THIS LINE
     nebula: HeaderNebula,
   };
   ```

4. **Remove from HEADER_OPTIONS**
   ```tsx
   export const HEADER_OPTIONS = [
     { id: 'orbit', name: 'Interactive', ... }, // ❌ DELETE THIS
   ];
   ```

5. **Search for ALL references**
   ```bash
   # In terminal, search for the component name
   grep -r "ORBIT" components/
   grep -r "HeaderOrbit" components/
   ```

6. **Update AdminPanel.tsx imports** (if component was individually imported)
   ```tsx
   import { HeaderCanvas, HeaderOrbit, ... } from './HeaderLibrary';
                         // ❌ REMOVE THIS
   ```

7. **Remove variant-specific controls from AdminPanel**
   - Search for: `{(config.headerStyle === 'orbit') && ...}`
   - Delete the entire conditional block

8. **Update HEADER_FIELDS** (remove the variant's field list)
   ```tsx
   export const HEADER_FIELDS: Record<string, string[]> = {
     canvas: [...],
     orbit: [...], // ❌ DELETE THIS
   };
   ```

**⚠️ VERIFY DELETION:**
```bash
# Should return NO results
grep -r "orbit" components/HeaderLibrary.tsx
grep -r "ORBIT" components/HeaderLibrary.tsx

# Build should succeed with no errors
npm run build
```

**Common errors when deletion is incomplete:**
- `ReferenceError: ORBIT_DEFAULTS is not defined` → Forgot to delete DEFAULTS object
- `Cannot find name 'HeaderOrbit'` → Forgot to remove from HEADER_COMPONENTS
- Variant still appears in selector but crashes when selected → Forgot to remove from HEADER_OPTIONS

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
🚨 **Incomplete Interface** - Properties used in DEFAULTS but missing from interface (causes TypeScript errors)
🚨 **Missing Icon Imports** - Icons used in components but not imported in AdminPanel (causes runtime crash)
🚨 **Broken Interactions** - Click handlers don't work due to blur/focus conflicts
🚨 **Orphaned References** - Component deleted but still referenced in registry or DEFAULTS

---

## Session Example: Header Audit (Jan 4, 2026)

### Morning Session: Editor Controls Audit
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

### Afternoon Session: Search Customization & Critical Fixes

**Features Added:**
- ✅ Search box styling controls (5 color properties for all headers)
- ✅ Expandable search functionality (icon → input field)
- ✅ Removed non-functioning Orbit header

**Critical Bugs Fixed:**
1. **Incomplete HeaderData Interface**
   - **Error:** TypeScript compilation failed with 20+ errors
   - **Cause:** Properties used in DEFAULTS but missing from interface
   - **Missing Properties:** accentColor, showIndicatorDot, blurIntensity, showMenu, showTagline, taglineColor, taglineText, showCTA, showLogoBadge, ctaBackgroundColor, ctaTextColor, ctaHoverColor, ctaText
   - **Fix:** Added all missing properties to HeaderData interface
   - **Prevention:** Always update interface when adding properties to any variant

2. **Expandable Search Not Working**
   - **Error:** Clicking search icon didn't open input, or input closed immediately
   - **Cause:** `onBlur` event fired before `onClick` could complete
   - **Wrong Approach Tried:** `onMouseDown={(e) => e.preventDefault()}` on container - didn't work
   - **Correct Fix:** Added `setTimeout` delay to `onBlur` handler (150ms)
   - **Prevention:** Use setTimeout pattern for all expandable/toggle interactions

3. **Missing Icon Imports**
   - **Error:** `ReferenceError: Menu is not defined` then `ReferenceError: Hexagon is not defined`
   - **Cause:** Icons used in header components but not imported in AdminPanel
   - **Fix:** Added `Menu` and `Hexagon` to AdminPanel lucide-react imports
   - **Prevention:** When component uses ANY icon, ensure it's in AdminPanel imports

4. **Orphaned Component Reference**
   - **Error:** `Cannot find name 'HeaderOrbit'` in HEADER_COMPONENTS
   - **Cause:** Deleted HeaderOrbit component but forgot to remove from registry
   - **Fix:** Removed `orbit: HeaderOrbit` from HEADER_COMPONENTS object
   - **Prevention:** Follow complete deletion checklist when removing components

**Commits:**
- `Remove Orbit header completely`
- `Add universal search styling and expandable search to all headers`
- `Add search styling controls to all header variants in AdminPanel`
- `Fix expandable search and add missing Menu icon`
- `Add missing Hexagon icon import to AdminPanel`

**Lessons Learned:**
1. **Interface completeness is critical** - Build fails if properties are missing
2. **Event handling requires careful timing** - Use setTimeout for blur/click conflicts
3. **Icon imports must be comprehensive** - AdminPanel needs ALL icons used in components
4. **Component deletion requires thoroughness** - Check registry, options, DEFAULTS, and references

**Updated Documentation:**
- Added "Icon Imports in AdminPanel" section
- Added "Event Handling Patterns" section with expandable search fix
- Added "Component Deletion Checklist" with 8-step process
- Updated "Red Flags & Warning Signs" with new error types
- Enhanced Step 2 with interface completeness verification

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
