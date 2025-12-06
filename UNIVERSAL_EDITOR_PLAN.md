# Universal Editing Flow: Implementation Plan

## 1. Executive Summary
**Goal:** Create a unified, beginner-friendly editing experience for all 50+ section variations in NexusOS v2.
**Philosophy:** "Power by Default, Safety by Design." Users should be able to switch layouts instantly without losing content, edit intuitively via click-to-focus, and rely on global themes to keep their design consistent.

---

## 2. Core Architecture

### A. `SectionWrapper` (The Container)
A higher-order component that wraps every section component in the Storefront.
*   **Responsibilities:**
    *   **Selection State:** Handles the "Active" blue outline and click events.
    *   **Floating Toolbar:** Renders the quick-action bar (Move, Duplicate, Delete, Switch Layout) attached to the active section.
    *   **Click-to-Focus:** Intercepts clicks on child elements (like text or images) to focus the corresponding field in the Sidebar.

### B. `UniversalEditor` (The Sidebar)
A smart, schema-driven sidebar that adapts to the currently selected block.
*   **Responsibilities:**
    *   **Auto-Generation:** Reads the block's data schema to generate the correct inputs (Text, Image, Color Picker).
    *   **Drill-Down Navigation:** Manages the "Zoom" effect for editing complex lists (e.g., clicking a slide in a slider opens a focused "Edit Slide" panel).
    *   **Visual Layout Picker:** Renders a grid of thumbnails for switching between the 10 variations of the current section type.

### C. `SmartMapper` (The Data Preserver)
A utility function that runs whenever a user switches layouts.
*   **Logic:**
    *   **Preserve Core Data:** Always keeps `heading`, `subheading`, `buttonText`.
    *   **Intelligent Remapping:**
        *   *Single -> Multi:* Maps the single image to the first item of a grid.
        *   *Multi -> Single:* Takes the first item of a grid and applies it to the single hero image.
    *   **Safety:** Prevents data loss during creative exploration.

---

## 3. User Experience (UX) Features

### 1. Visual Layout Switcher [IMPLEMENTED]
*   **Problem:** Dropdown names like `blog-alternating` are abstract.
*   **Solution:** A modal or drawer showing **SVG Wireframes** or **Thumbnails** of the 10 variations.
*   **Interaction:** One-click switch that instantly updates the canvas using `SmartMapper`.

### 2. Click-to-Focus (Hybrid Editing) [IMPLEMENTED]
*   **Problem:** Inline typing breaks layouts; Sidebar hunting is tedious.
*   **Solution:** Clicking "Heading" on the Canvas automatically scrolls the Sidebar to the "Heading" input and focuses it.
*   **Benefit:** Connects the visual to the control without technical fragility.

### 3. Drill-Down Editing [IMPLEMENTED]
*   **Problem:** Editing a grid of 6 features creates a wall of 18 inputs.
*   **Solution:** The Sidebar shows a list of items. Clicking an item slides the view to a dedicated "Edit Item" panel.
*   **Benefit:** Reduces cognitive load; keeps the interface clean.

### 4. Theme Inheritance (Global Defaults)
*   **Problem:** Inconsistent padding/colors across sections.
*   **Solution:** All style controls default to **"Auto"** (inheriting from Global Theme). Users must explicitly override to change them.
*   **Benefit:** Ensures professional consistency by default.

---

## 4. Standardized Data Schema
To make the `UniversalEditor` work, all 50+ components must adhere to this loose schema:

```typescript
interface UniversalSectionData {
  // Core Content (Preserved across layouts)
  heading?: string;
  subheading?: string;
  text?: string;
  image?: string; // Main image
  videoUrl?: string;
  
  // Actions
  buttons?: Array<{ label: string; link: string; style: 'primary' | 'secondary' }>;
  
  // Collections (For Grids/Sliders)
  items?: Array<{
    id: string;
    title?: string;
    description?: string;
    image?: string;
    icon?: string;
    link?: string;
  }>;

  // Design Overrides (Optional - defaults to Theme)
  style?: {
    padding?: 's' | 'm' | 'l' | 'auto';
    background?: 'white' | 'black' | 'accent' | 'auto';
    alignment?: 'left' | 'center' | 'right' | 'auto';
  };
}
```

---

## 5. Implementation Checklist

- [ ] **Step 1: Create `SectionWrapper`**
    - Implement selection logic and blue outline.
    - Build the Floating Toolbar (Move, Delete, Duplicate).

- [ ] **Step 2: Build `SmartMapper` Utility**
    - Write functions to transform data between Single and List formats.

- [ ] **Step 3: Develop `UniversalEditor` Sidebar**
    - Create the "Visual Layout Picker" UI.
    - Implement the "Drill-Down" navigation for `items` arrays.
    - Build the "Auto/Override" toggle for style controls.

- [ ] **Step 4: Refactor Components**
    - Update all 50+ variations to use the `UniversalSectionData` schema.
    - Ensure they all accept `onFocus` props to support Click-to-Focus.

- [ ] **Step 5: Integration**
    - Replace the current hardcoded editor logic in `AdminPanel` with `UniversalEditor`.
