# Handoff Doc: Design Studio Refactor & Column Elimination
**Date:** January 8, 2026
**Session Focus:** Transitioning from a 3-column legacy editor to a 2-column "Studio" layout.

## 🎯 Primary Goal
The user wants to eliminate the "third column" (the legacy `UniversalEditor` sidebar) and enforce a clean 2-column layout in the **Design** tab:
1.  **Left Column:** Navigation & Page Block List (Width: `editorWidth`).
2.  **Right Column:** Live Store Preview (Canvas).
3.  **Editing Interface:** All deep editing (Hero, Grid, Collections) now happens in **high-fidelity "Studio Modals"** rather than the sidebar.

## ✅ What's Been Done
- **Standardized Studios:** The Hero, Product Grid, and Collection sections now trigger full-screen (fixed-inset) modals.
- **AI Integration:** AI Copywriting (via Gemini) is integrated directly into the Hero and Grid studios.
- **Sidebar Cleanup:** `UniversalEditor` has been completely purged from the imports and the main JSX of `components/AdminPanel.tsx`.
- **Navigation State:** The main navigation sidebar (leftmost) is now forced to its collapsed state (`w-20`) when enterring `AdminTab.DESIGN` to maximize workspace.

## 🛠 Active Investigation / "The Ghost Column"
The user reports: **"The fucking column is still loading!!!"**
Despite removing the `UniversalEditor`, there are several potential "ghost" sidebars or layout containers still lingering:

### 1. The Left Editor Column
The `AdminPanel.tsx` still contains a resizable left column (lines ~9580) which holds:
- Global Settings toggle.
- Pages & Navigation list.
- **The "Body" (Block List).**
The user might be interpreting this *necessary* list as the "old column," OR they are seeing one of the following:

### 2. Rogue `w-80` Sidebar in Modals
- `renderSystemBlockModal` (Line 6095): Still contains a `div` with `w-80` and `border-r`.
- `renderBlockArchitect` (Line 7488): Still contains a `div` with `w-80` and `border-r`.
- Both of these sub-interfaces are using the *old* layout style (Sidebar/Content split) instead of the *new* 30/70 split used in Hero/Grid studios.

### 3. Restored Inline Block Editor
In `AdminPanel.tsx` (Line 9961), there is a block labeled `{/* INLINE BLOCK EDITOR (Restored) */}`.
- This renders a `textarea` for `section` types **inside the Left Column**.
- If a user clicks a custom section, this expands within the left column, potentially widening it or making it feel like the old editor.

## 🚀 Work for Next Agent
1.  **Standardize System Modals:** Update `renderSystemBlockModal` and `renderBlockArchitect` to use the standardized `w-[30%] / flex-1` split.
2.  **Verify Spacing:** Ensure the `flex-1` canvas in `AdminPanel.tsx` (Line 9983) is actually expanding to fill all available space.
3.  **Investigate "The Ghost":** If the user is on the `DESIGN` tab and sees a middle column between the Block List and the Canvas, look for a hidden `div` or a dynamic rendering of `EditorPanel.tsx` (which is imported but currently not used in the JSX).
4.  **UI Polish:** The user wants a "two column feel." Consider if they want the *Left* list hidden entirely when a modal isn't open, or if we just need to darken the borders to make it feel cohesive.

## 📂 Relevant Files
- `components/AdminPanel.tsx`: The primary battlefield. Focus on lines 9500–10200.
- `components/Storefront.tsx`: Handles `onEditBlock` callbacks that trigger the modals.
- `components/EditorPanel.tsx`: Discovered but seemingly orphaned. Check for dynamic/ghost usage.
