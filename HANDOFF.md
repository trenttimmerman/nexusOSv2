# Nexus Commerce OS - Developer Handoff

**Date:** November 24, 2024
**Status:** 🟢 STABLE MILESTONE (Unified Page Builder)
**Tech Stack:** React, Tailwind CSS, TypeScript

## 🚀 Milestone Overview
We have successfully consolidated the design workflow into a **Linear, Unified Page Builder**. The complex "Engine" accordions have been replaced by a single **Page Layout** list that treats Headers, Heroes, Product Grids, and Footers as manageable blocks.

## ✅ Current Architecture

### 1. The Layout Hub (Admin Panel)
*   **Left-Sidebar Navigation:** Fixed main menu (`w-64`) on the left.
*   **Resizable Tool Column:** The Design Studio column is resizable and sits immediately to the right of the nav.
*   **Unified Page Layout:**
    *   **Header:** Locked at the top. Editing opens the **Header Studio**.
    *   **Page Sections:** A reorderable list of blocks (Heroes, Grids, Text). Editing opens the context-aware modal (System or Architect).
    *   **Footer:** Locked at the bottom. Editing opens the **Footer Studio**.
*   **Add Section Workflow:** A slide-out library allows adding System Blocks (Hero/Grid) or Content Blocks with a **Live Preview** before confirming.

### 2. The Preview Engine
*   **Real-Time Resizing:** When a tool panel (Add Section, Architect, etc.) slides out, the Live Canvas automatically adds padding (`pl-96`) to keep the storefront visible and centered.
*   **Device Toggles:** Switch between Desktop and Mobile views instantly.
*   **Preview Mode:** New sections show a "Preview" badge on the storefront before they are committed to the state.

### 3. Component Engines (The "Brains")
*   **Header Engine:** 21 Styles (Canvas, Pilot, Nebula, etc.) with Sort/Filter.
*   **System Blocks:**
    *   **Hero Engine:** 5 Styles (Impact, Kinetik, Split, etc.).
    *   **Product Grid Engine:** 6 Styles (Classic, Hype, Glass, etc.).
    *   **Footer Engine:** 5 Styles (Minimal, Sitemap, Brand, etc.).
*   **Block Architect:** A visual builder for custom HTML content (Images, Text, Layouts) with AI simulation.

### 4. Data Structure
*   **Global Footer:** The footer is no longer a "Block" in the page array; it is rendered globally at the bottom of `Storefront.tsx`.
*   **System Blocks:** Heroes and Grids are stored as `PageBlock` items with `type: 'system-hero'` or `'system-grid'`, allowing them to be placed anywhere on a page.

---

## 📂 Key Files

*   **`components/AdminPanel.tsx`:** The core logic. Contains the state for `activePage`, `selectedBlock`, and the rendering logic for all slide-out modals.
*   **`components/Storefront.tsx`:** The renderer. Iterates through `activePage.blocks` and switches between `HERO_COMPONENTS`, `PRODUCT_CARD_COMPONENTS`, or raw HTML based on the block type.
*   **`App.tsx`:** Holds the "Database" (State). Contains the initial block configuration for Home, About, and Journal pages.

---

## 🚧 Known Issues / To-Do
1.  **Persistence:** State resets on refresh. Needs LocalStorage or Backend connection.
2.  **Image Upload:** The Logo Upload and Magic Product Upload are simulated (Base64/Timeout).
3.  **Undo/Redo:** Currently, deletions are permanent.
4.  **Drag & Drop:** We use Up/Down arrows for block reordering. True Drag & Drop (dnd-kit) is the next UX upgrade.

---

## 🗺️ Roadmap: Next Phase
1.  **Content Library Expansion:** Add "Testimonials", "FAQ", and "Logo Cloud" to the *Add Section* library.
2.  **Theme Presets:** Allow saving the entire configuration (Header + Hero + Colors + Fonts) as a "Theme".
3.  **Backend Connection:** Wire up Supabase for real data persistence.
