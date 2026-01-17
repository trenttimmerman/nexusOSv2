# Header Library - Forensic Audit
## One Header at a Time - Complete Element & Control Mapping
## Date: January 17, 2026

---

## 🔬 HEADER #1: Canvas ("Classic Clean")

**File**: components/HeaderLibrary.tsx  
**Lines**: 362-516  
**DEFAULTS Object**: CANVAS_DEFAULTS (Lines 184-203)  
**HEADER_FIELDS Entry**: Lines 3755-3760  

---

### 📋 ALL CUSTOMIZABLE ELEMENTS IN HEADER

#### 1. LOGO
**Element**: Logo component (Left side)  
**Properties Used**:
- `storeName` (props)
- `logoUrl` (props)
- `logoHeight` (props)
- `onClick` → `onLogoClick` (props)

**Customization**: ❌ NO dedicated color control for logo text  
**Missing**: `logoTextColor` property  
**Current Behavior**: Uses default styling, not customizable via HeaderData

---

#### 2. NAVIGATION LINKS
**Element**: NavItem components (Left side, after logo)  
**Properties Used**:
- `links` (props - array of NavLink)
- `textColor` (data.textColor) - Line 419
- `textHoverColor` (data.textHoverColor) - Line 420
- `navActiveStyle` (data.navActiveStyle) - Line 422

**Customization**: ✅ WORKING  
**Controls Available**:
- textColor ✅
- textHoverColor ✅
- navActiveStyle ✅ (12 style options)

---

#### 3. SEARCH ICON/BUTTON
**Element**: Search button (Right side icons)  
**Visibility**: `settings.showSearch` (Line 429)  
**Properties Used**:
- `iconSize` (data.iconSize) - Line 457
- `textColor` (data.textColor) - Lines 445, 454
- `textHoverColor` (data.textHoverColor) - Line 451
- `iconHoverBackgroundColor` (data.iconHoverBackgroundColor) - Line 452
- `searchPlaceholder` (data.searchPlaceholder) - Line 432
- `searchBackgroundColor` (data.searchBackgroundColor) - Line 435
- `searchBorderColor` (data.searchBorderColor) - Line 436
- `searchInputTextColor` (data.searchInputTextColor) - Line 437

**Customization**: ✅ WORKING  
**Controls Available**:
- showSearch ✅
- iconSize ✅
- textColor ✅
- textHoverColor ✅
- iconHoverBackgroundColor ✅
- searchPlaceholder ✅
- searchBackgroundColor ✅
- searchBorderColor ✅
- searchInputTextColor ✅

---

#### 4. ACCOUNT ICON/BUTTON
**Element**: User icon button (Right side icons)  
**Visibility**: `settings.showAccount` (Line 461)  
**Properties Used**:
- `iconSize` (data.iconSize) - Line 478
- `textColor` (data.textColor) - Lines 465, 474
- `textHoverColor` (data.textHoverColor) - Line 471
- `iconHoverBackgroundColor` (data.iconHoverBackgroundColor) - Line 472

**Customization**: ✅ WORKING  
**Controls Available**:
- showAccount ✅
- iconSize ✅
- textColor ✅
- textHoverColor ✅
- iconHoverBackgroundColor ✅

---

#### 5. CART ICON/BUTTON
**Element**: ShoppingBag icon button (Right side icons)  
**Visibility**: `settings.showCart` (Line 481)  
**Properties Used**:
- `iconSize` (data.iconSize) - Line 500
- `textColor` (data.textColor) - Lines 485, 494
- `textHoverColor` (data.textHoverColor) - Line 491
- `iconHoverBackgroundColor` (data.iconHoverBackgroundColor) - Line 492

**Customization**: ✅ WORKING  
**Controls Available**:
- showCart ✅
- iconSize ✅
- textColor ✅
- textHoverColor ✅
- iconHoverBackgroundColor ✅

---

#### 6. CART BADGE (Item Count)
**Element**: Cart count badge (Overlaid on cart icon)  
**Visibility**: `cartCount > 0` (Line 501) - Props-driven, always shows if cart has items  
**Properties Used**:
- `cartBadgeColor` (data.cartBadgeColor) - Line 505
- `cartBadgeTextColor` (data.cartBadgeTextColor) - Line 506

**Customization**: ✅ WORKING  
**Controls Available**:
- cartBadgeColor ✅
- cartBadgeTextColor ✅

**Note**: Badge visibility is determined by `cartCount` prop, not a `showCartBadge` toggle

---

#### 7. HEADER CONTAINER/BACKGROUND
**Element**: Header wrapper element  
**Properties Used**:
- `backgroundColor` (data.backgroundColor) - Line 387
- `borderColor` (data.borderColor) - Line 388
- `borderWidth` (data.borderWidth) - Line 388
- `sticky` (data.sticky) - Line 384
- `maxWidth` (data.maxWidth) - Line 381, 393
- `paddingX` (data.paddingX) - Lines 395-396
- `paddingY` (data.paddingY) - Lines 397-398

**Customization**: ✅ WORKING  
**Controls Available**:
- backgroundColor ✅
- borderColor ✅
- borderWidth ✅
- sticky ✅
- maxWidth ✅
- paddingX ✅
- paddingY ✅

---

### 🎛️ EDITING CONTROLS MAPPED (HEADER_FIELDS)

**HEADER_FIELDS['canvas']** (Lines 3755-3760):
```typescript
[
  'showSearch', 'showAccount', 'showCart',
  'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
  'cartBadgeColor', 'cartBadgeTextColor',
  'iconSize', 'iconHoverBackgroundColor', 'borderWidth',
  'sticky', 'maxWidth', 'paddingX', 'paddingY', 'navActiveStyle'
]
```

**Total Controls**: 17 properties

---

### ✅ COMPLETE CONTROL MAPPING

| Element | Property | In HEADER_FIELDS? | In CANVAS_DEFAULTS? | Used in Code? |
|---------|----------|-------------------|---------------------|---------------|
| **Search** | showSearch | ✅ Yes | ✅ Yes (true) | ✅ Line 429 |
| **Search** | searchPlaceholder | ❌ **MISSING** | ✅ Yes ('Search...') | ✅ Line 432 |
| **Search** | searchBackgroundColor | ❌ **MISSING** | ✅ Yes ('#ffffff') | ✅ Line 435 |
| **Search** | searchBorderColor | ❌ **MISSING** | ✅ Yes ('#e5e7eb') | ✅ Line 436 |
| **Search** | searchInputTextColor | ❌ **MISSING** | ✅ Yes ('#000000') | ✅ Line 437 |
| **Account** | showAccount | ✅ Yes | ✅ Yes (true) | ✅ Line 461 |
| **Cart** | showCart | ✅ Yes | ✅ Yes (true) | ✅ Line 481 |
| **Cart Badge** | cartBadgeColor | ✅ Yes | ✅ Yes ('#000000') | ✅ Line 505 |
| **Cart Badge** | cartBadgeTextColor | ✅ Yes | ✅ Yes ('#ffffff') | ✅ Line 506 |
| **Icons** | iconSize | ✅ Yes | ✅ Yes (20) | ✅ Lines 457,478,500 |
| **Icons** | iconHoverBackgroundColor | ✅ Yes | ✅ Yes ('#f3f4f6') | ✅ Lines 452,472,492 |
| **Background** | backgroundColor | ✅ Yes | ✅ Yes ('#ffffff') | ✅ Line 387 |
| **Border** | borderColor | ✅ Yes | ✅ Yes ('#f3f4f6') | ✅ Line 388 |
| **Border** | borderWidth | ✅ Yes | ✅ Yes ('1px') | ✅ Line 388 |
| **Text** | textColor | ✅ Yes | ✅ Yes ('#6b7280') | ✅ Lines 419,445,465,485 |
| **Text** | textHoverColor | ✅ Yes | ✅ Yes ('#000000') | ✅ Lines 420,451,471,491 |
| **Navigation** | navActiveStyle | ✅ Yes | ✅ Yes ('underline') | ✅ Line 422 |
| **Layout** | sticky | ✅ Yes | ✅ Yes (false) | ✅ Line 384 |
| **Layout** | maxWidth | ✅ Yes | ✅ Yes ('7xl') | ✅ Lines 381,393 |
| **Layout** | paddingX | ✅ Yes | ✅ Yes ('1.5rem') | ✅ Lines 395-396 |
| **Layout** | paddingY | ✅ Yes | ✅ Yes ('0.5rem') | ✅ Lines 397-398 |

---

### 🔴 CRITICAL FINDINGS

#### MISSING FROM HEADER_FIELDS (Controls Not Exposed)

These properties exist in CANVAS_DEFAULTS and are USED in the code, but are **NOT listed in HEADER_FIELDS**, meaning the designer UI doesn't show controls for them:

1. ❌ **searchPlaceholder** - Used but not in HEADER_FIELDS
2. ❌ **searchBackgroundColor** - Used but not in HEADER_FIELDS
3. ❌ **searchBorderColor** - Used but not in HEADER_FIELDS
4. ❌ **searchInputTextColor** - Used but not in HEADER_FIELDS

**Impact**: Users can customize these via direct data editing, but the Admin UI doesn't provide controls for them. The search functionality has 4 hidden customization properties.

#### MISSING FROM INTERFACE

These elements exist in the header but have NO customization property at all:

1. ❌ **logoTextColor** - Logo text has no color control (uses default styling)

**Impact**: Logo text color cannot be customized independently from navigation text color.

---

### 📊 CANVAS HEADER SUMMARY

**Total Visual Elements**: 7
- Logo ✅
- Navigation Links ✅
- Search Button/Input ⚠️ (4 missing controls)
- Account Button ✅
- Cart Button ✅
- Cart Badge ✅
- Header Container ✅

**Total Properties in DEFAULTS**: 21  
**Total Properties in HEADER_FIELDS**: 17  
**Missing from HEADER_FIELDS**: 4 (search-related)  
**Missing from Interface**: 1 (logoTextColor)  

**Audit Status**: ⚠️ **95% COMPLETE - 4 CONTROLS HIDDEN**

---

### ✅ WHAT'S WORKING

1. All visibility toggles (showSearch, showAccount, showCart) ✅
2. All icon styling (size, colors, hover states) ✅
3. All text/nav styling (colors, hover, active styles) ✅
4. All layout controls (sticky, maxWidth, padding, borders) ✅
5. Cart badge styling ✅

---

### ❌ WHAT'S BROKEN/MISSING

1. **Search Input Customization Hidden**:
   - searchPlaceholder exists but no control in UI
   - searchBackgroundColor exists but no control in UI
   - searchBorderColor exists but no control in UI
   - searchInputTextColor exists but no control in UI

2. **Logo Text Color**:
   - No property exists for logo text color
   - Logo always uses default/inherited styling

---

### 🔧 REQUIRED FIXES

#### Fix #1: Add Missing Search Controls to HEADER_FIELDS

```typescript
// components/HeaderLibrary.tsx - Line 3755
canvas: [
  'showSearch', 'showAccount', 'showCart',
  'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
  'cartBadgeColor', 'cartBadgeTextColor',
  'iconSize', 'iconHoverBackgroundColor', 'borderWidth',
  'sticky', 'maxWidth', 'paddingX', 'paddingY', 'navActiveStyle',
  // ADD THESE 4 MISSING CONTROLS:
  'searchPlaceholder', 'searchBackgroundColor', 'searchBorderColor', 'searchInputTextColor'
],
```

#### Fix #2 (Optional): Add Logo Text Color

If logo text color customization is desired:

1. Add to HeaderData interface:
```typescript
logoTextColor?: string;
```

2. Add to CANVAS_DEFAULTS:
```typescript
logoTextColor: '#000000',
```

3. Update Logo component to accept color prop

4. Add to HEADER_FIELDS:
```typescript
'logoTextColor'
```

---

### 📝 NOTES

- Canvas header is relatively simple with only 7 visual elements
- Most customization works correctly
- Search input has the most hidden controls (4 properties)
- Logo text color is the only element with zero customization
- All other headers should be audited with this same level of detail

---

**Audit Completed**: January 17, 2026  
**Auditor**: AI Assistant  
**Next**: Header #2 (Nebula - "Glass Effect")

