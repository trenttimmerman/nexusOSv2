# Design Studio Editor Flows - Complete Reference

> Generated: December 28, 2025

This document maps every section type, action, modal, and editor flow in the Design Studio (AdminPanel.tsx).

---

## Table of Contents

1. [Section Types](#section-types)
2. [Editor Actions](#editor-actions)
3. [Modal Flows](#modal-flows)
4. [State Management](#state-management)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [Component Architecture](#component-architecture)

---

## Section Types

The Design Studio supports **15 section types** organized into **12 categories**.

### Overview Table

| Type | Name | Purpose | Variants |
|------|------|---------|----------|
| `system-hero` | Hero Engine | High-impact landing sections | 5 |
| `system-grid` | Product Grid | Product display grids | 6 |
| `system-collection` | Collections | Featured products & lists | 10 |
| `system-layout` | Content Layouts | Multi-column & image-text | 10 |
| `system-scroll` | Scroll Sections | Marquees & tickers | 2 |
| `system-social` | Social Feed | Instagram/TikTok feeds | 10 |
| `system-blog` | Blog Posts | Article displays | 10 |
| `system-video` | Video Section | YouTube/Vimeo embeds | 10 |
| `system-gallery` | Media Gallery | Image collections | 4 |
| `system-contact` | Contact Forms | Forms & contact info | 10 |
| `system-rich-text` | Rich Text | Text content blocks | 4 |
| `system-email` | Email Signup | Newsletter signups | 3 |
| `system-collapsible` | FAQ/Accordion | Expandable content | 2 |
| `system-logo-list` | Logo List | Partner/trust logos | 2 |
| `system-promo` | Promo Banner | Announcements | 2 |

---

### 1. system-hero - Hero Engine

**Purpose:** High-impact entry sections for landing pages

**Variants:**
| ID | Name | Description |
|----|------|-------------|
| `impact` | Full Screen | Large image fills screen ★ Recommended |
| `split` | Side by Side | Image on one side, text on other ★ Recommended |
| `animated-ticker` | Animated Banner | Eye-catching scrolling text |
| `collage` | Image Collage | Multiple images in grid |
| `text-only` | Text Only | Bold text, no images |

**Editable Fields:**
| Field | Type | AI | Description |
|-------|------|:--:|-------------|
| `heading` | text | ✓ | Main headline (max 60 chars) |
| `subheading` | richtext | ✓ | Supporting text (max 160 chars) |
| `image` | image | | Background image |
| `buttonText` | text | ✓ | Primary button |
| `buttonLink` | linkSelector | | Button URL |
| `secondaryButtonText` | text | | Secondary button |
| `badge` | text | ✓ | Badge/label (e.g., "✨ New") |
| `marqueeText` | text | | Scrolling text |

---

### 2. system-grid - Product Grid

**Purpose:** Display products in customizable grid layouts

**Variants:**
| ID | Name | Description |
|----|------|-------------|
| `classic` | Classic | Clean, minimal cards |
| `industrial` | Industrial | Tech-inspired, mono |
| `focus` | Focus | Image-first, hover reveal |
| `hype` | Hype | Streetwear, bold badges |
| `magazine` | Magazine | Editorial, serif |
| `glass` | Glass | Modern blur/overlay |

**Editable Fields:**
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `heading` | text | | Section heading |
| `subheading` | richtext | | Description |
| `columns` | select | 4 | Grid columns (2-5) |
| `limit` | number | 8 | Products to show |
| `showPrices` | toggle | true | Show prices |
| `showQuickAdd` | toggle | true | Quick add button |
| `buttonText` | text | | View All button |
| `buttonLink` | linkSelector | | View All URL |

---

### 3. system-collection - Collections

**Purpose:** Featured products and collection lists

**Variants:**
| ID | Name |
|----|------|
| `collection-list` | Collection List |
| `collection-featured` | Featured Collection |
| `collection-product` | Featured Product |
| `slideshow` | Slideshow |
| `collection-grid-tight` | Tight Grid |
| `collection-masonry` | Masonry Grid |
| `collection-carousel` | Product Carousel |
| `collection-tabs` | Category Tabs |
| `collection-lookbook` | Lookbook |
| `collection-split` | Split Focus |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `productDisplay` | select | Mode: all/featured/category/manual |
| `productCategory` | select | Category filter |
| `productCount` | number | Products to show (4-24) |
| `productSort` | select | Sort order |
| `gridColumns` | select | Columns (2-5) |
| `showPrices` | toggle | Show prices |
| `showAddToCart` | toggle | Show add to cart |
| `buttonText` | text | View All button |
| `buttonLink` | linkSelector | View All URL |

---

### 4. system-layout - Content Layouts

**Purpose:** Multi-column, image-text, and banner layouts

**Variants:**
| ID | Name |
|----|------|
| `layout-image-text` | Image with Text |
| `layout-multi-row` | Multi-row |
| `layout-multi-column` | Multi-column |
| `layout-collage` | Collage |
| `layout-banner` | Image Banner |
| `layout-stats` | Statistics |
| `layout-timeline` | Timeline |
| `layout-features` | Feature Grid |
| `layout-accordion` | Accordion |
| `layout-tabs` | Content Tabs |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `image` | image | Main image |
| `buttonText` | text | Button text |
| `buttonLink` | linkSelector | Button URL |

---

### 5. system-scroll - Scroll Sections

**Purpose:** Animated scrolling content like marquees and tickers

**Variants:**
| ID | Name | Description |
|----|------|-------------|
| `logo-marquee` | Logo Marquee | Infinite scrolling logos |
| `text-ticker` | Text Ticker | Scrolling announcement text |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `text` | text | Ticker text (use • to separate) |
| `logos` | text | Comma-separated logo URLs |
| `speed` | select | slow/normal/fast |
| `pauseOnHover` | toggle | Pause on hover |

---

### 6. system-social - Social Feed

**Purpose:** Display social media content (Instagram, TikTok)

**Variants:**
| ID | Name |
|----|------|
| `social-classic` | Classic Grid |
| `masonry-wall` | Masonry Wall |
| `carousel-reel` | Carousel Reel |
| `polaroid-scatter` | Polaroid Scatter |
| `minimal-feed` | Minimal Feed |
| `dark-mode-glitch` | Cyber Glitch |
| `story-circles` | Story Highlights |
| `social-hero` | Featured Hero |
| `ticker-tape` | Ticker Tape |
| `social-glass` | Glass Cards |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `instagramHandle` | text | @handle |
| `postsToShow` | number | Posts to display |

---

### 7. system-blog - Blog Posts

**Purpose:** Display articles and blog posts

**Variants:**
| ID | Name |
|----|------|
| `blog-grid` | Standard Grid |
| `blog-classic` | Classic List |
| `blog-featured` | Featured Highlight |
| `blog-minimal` | Minimal Text |
| `blog-magazine` | Magazine |
| `blog-slider` | Post Slider |
| `blog-cards` | Elevated Cards |
| `blog-sidebar` | With Sidebar |
| `blog-zigzag` | Zig-Zag |
| `blog-overlay` | Image Overlay |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `postsToShow` | number | Number of posts |
| `postCategory` | select | Category filter |
| `showDate` | toggle | Show date |
| `showAuthor` | toggle | Show author |
| `showExcerpt` | toggle | Show excerpt |
| `gridColumns` | select | Columns (2-4) |

---

### 8. system-video - Video Section

**Purpose:** Embed videos from YouTube, Vimeo, or upload custom

**Variants:**
| ID | Name |
|----|------|
| `video-full` | Full Width |
| `video-windowed` | Windowed |
| `video-background` | Background |
| `video-split` | Split Screen |
| `video-popup` | Popup Modal |
| `video-carousel` | Video Carousel |
| `video-grid` | Video Grid |
| `video-hero` | Video Hero |
| `video-shoppable` | Shoppable Video |
| `video-stories` | Vertical Stories |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `videoUrl` | url | YouTube/Vimeo URL |
| `autoplay` | toggle | Autoplay (muted) |
| `loop` | toggle | Loop video |
| `showControls` | toggle | Show controls |
| `thumbnail` | image | Custom thumbnail |

---

### 9. system-gallery - Media Gallery

**Purpose:** Display a collection of images

**Variants:**
| ID | Name |
|----|------|
| `gal-grid` | Classic Grid |
| `gal-masonry` | Masonry |
| `gal-slider` | Slider |
| `gal-featured` | Featured |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `gridColumns` | select | Columns (2-5) |
| `enableLightbox` | toggle | Click to view full size |
| `aspectRatio` | select | square/landscape/portrait/auto |

---

### 10. system-contact - Contact Forms

**Purpose:** Let visitors reach out with forms and contact info

**Variants:**
| ID | Name |
|----|------|
| `contact-simple` | Simple Form |
| `contact-split` | Split with Info |
| `contact-map` | Map & Form |
| `contact-minimal` | Minimal Text |
| `contact-floating` | Floating Card |
| `contact-support` | Support Grid |
| `contact-newsletter` | Newsletter Focus |
| `contact-faq` | FAQ & Contact |
| `contact-social` | Social Connect |
| `contact-offices` | Office Locations |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `formFields` | formBuilder | Form fields |
| `submitButtonText` | text | Submit button |
| `successMessage` | text | Success message |
| `recipientEmail` | text | Send submissions to |
| `contactEmail` | text | Display email |
| `contactPhone` | text | Display phone |
| `contactAddress` | richtext | Display address |

---

### 11. system-rich-text - Rich Text

**Purpose:** Simple text content sections

**Variants:**
| ID | Name |
|----|------|
| `rt-centered` | Centered Minimal |
| `rt-left` | Left Aligned |
| `rt-bordered` | Bordered Box |
| `rt-wide` | Wide Display |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `content` | richtext | Main content |

---

### 12. system-email - Email Signup

**Purpose:** Collect email addresses from visitors

**Variants:**
| ID | Name |
|----|------|
| `email-minimal` | Minimal |
| `email-split` | Split Image |
| `email-card` | Floating Card |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `buttonText` | text | Button text |
| `successMessage` | text | Success message |
| `incentiveText` | text | Incentive (e.g., "Get 10% off") |

---

### 13. system-collapsible - FAQ/Accordion

**Purpose:** Expandable content sections

**Variants:**
| ID | Name |
|----|------|
| `collapsible-simple` | Simple Accordion |
| `collapsible-faq` | FAQ Style |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `items` | array | Q&A items (drill-down) |

---

### 14. system-logo-list - Logo List

**Purpose:** Display partner, client, or brand logos

**Variants:**
| ID | Name |
|----|------|
| `logo-grid` | Simple Grid |
| `logo-scroll` | Scrolling Ticker |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `heading` | text | Section heading |
| `subheading` | richtext | Description |
| `grayscale` | toggle | Grayscale logos |

---

### 15. system-promo - Promo Banner

**Purpose:** Announcement or promotional banners

**Variants:**
| ID | Name |
|----|------|
| `promo-top` | Top Bar |
| `promo-hero` | Hero Banner |

**Editable Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `text` | text | Banner text |
| `link` | linkSelector | Banner link |
| `linkText` | text | Link text |
| `dismissible` | toggle | Can dismiss |

---

## Editor Actions

### 1. Add Section
- **Trigger:** "+ Add Section" button
- **Handler:** `addBlock(type, name, html, variant)`
- **Flow:**
  1. Opens Add Section Library modal
  2. User selects category → shows variants
  3. User clicks variant → `addBlock()` called
  4. Block inserted after `insertAfterBlockId` or at end
  5. Sets `hasUnsavedChanges = true`

### 2. Edit Section
- **Trigger:** Click block in list, or edit icon
- **Handler:** `setSelectedBlockId(blockId)`
- **Flow:**
  - For `system-hero` → Opens System Modal (hero variant picker)
  - For `system-grid` → Opens System Modal (grid variant picker)
  - For `system-footer` → Opens System Modal (footer variant picker)
  - For other `system-*` blocks → Opens UniversalEditor panel (via `setSelectedBlockId`)
  - For raw `section` type → Opens Block Architect (HTML editor)

### 3. Delete Section
- **Trigger:** Trash icon on block row
- **Handler:** `handleDeleteSection(blockId)`
- **Flow:**
  1. Filters out block from `localPages`
  2. Clears selection if deleted block was selected
  3. Persists to database via `onUpdatePage`
  4. Shows toast notification

### 4. Move Section Up/Down
- **Trigger:** Arrow buttons on block row
- **Handler:** `handleMoveBlock(blockId, direction)`
- **Flow:** Swaps block positions in array

### 5. Duplicate Section
- **Trigger:** Copy icon on block row
- **Handler:** `handleDuplicateBlock(blockId)`
- **Flow:**
  1. Clones block with new UUID
  2. Inserts after original
  3. Selects new block

### 6. Toggle Visibility
- **Trigger:** Eye icon on block row
- **Handler:** `handleToggleVisibility(blockId)`
- **Flow:** Toggles `block.hidden` property

### 7. Toggle Lock
- **Trigger:** Lock icon on block row
- **Handler:** `handleToggleLock(blockId)`
- **Flow:** Toggles `block.locked` property

### 8. Switch Layout
- **Trigger:** Layout picker in UniversalEditor
- **Handler:** `handleSwitchLayout(blockId, newVariant)`
- **Flow:** Updates block's `variant` property

### 9. Save Changes
- **Trigger:** 
  - "Save Changes" button
  - `Ctrl+S` shortcut
  - Auto-save after 1.5s of inactivity
- **Handler:** `handleSaveChanges()`
- **Flow:**
  1. Iterates through `localPages`
  2. Compares with original `pages`
  3. Calls `onUpdatePage` for changed pages
  4. Clears `hasUnsavedChanges`

### 10. Undo/Redo
- **Trigger:**
  - Undo: `Ctrl+Z` or Undo button
  - Redo: `Ctrl+Y` or `Ctrl+Shift+Z` or Redo button
- **State:**
  - `history` - array of previous states (max 50)
  - `historyIndex` - current position
- **Handlers:**
  - `handleUndo()` - Restores previous state
  - `handleRedo()` - Restores next state

### 11. Publish
- **Trigger:** "Publish" button
- **Handler:** `handlePublish()`
- **Flow:**
  1. Opens pre-publish checklist modal
  2. User reviews/fixes issues
  3. Calls `handleSaveChanges()`
  4. Shows success toast

---

## Modal Flows

### Modal Summary Table

| Modal | State Variable | Trigger |
|-------|---------------|---------|
| Add Section Library | `showAddSectionLibrary` | "+ Add Section" button |
| Block Architect | `showBlockArchitect` | Edit raw HTML section |
| System Block | `isSystemModalOpen` | Edit hero/grid/footer |
| Header Editor | `isHeaderModalOpen` | "Header" button |
| Interface | `isInterfaceModalOpen` | "Interface" button |
| Welcome Wizard | `showWelcomeWizard` | First visit |
| Tutorial | `showTutorial` | Help button |
| Pre-Publish | `showPrePublishChecklist` | "Publish" button |
| Brand Settings | `showBrandSettings` | "Brand" button |
| Version History | `showVersionHistory` | "History" button |
| Nav Builder | `showNavBuilder` | List icon button |
| Add New Page | `showAddPageModal` | "Add Page" button |
| Section Recommendations | `showSectionRecommendations` | After adding sections |
| Product Editor | `showProductEditor` | Product selection |

### Modal Details

#### Add Section Library Modal
```
Trigger: "+ Add Section" button
State: showAddSectionLibrary, activeSectionCategory
Two-step flow:
  1. activeSectionCategory = null → Shows category grid
  2. activeSectionCategory = 'hero' → Shows hero variants
Close: X button or select variant
```

#### Block Architect Modal
```
Trigger: handleOpenArchitect(blockId) for non-system blocks
State: showBlockArchitect, architectBlockId
Purpose: Visual HTML editor with tabs:
  - Layout (alignment, padding, etc.)
  - Content (headings, text)
  - Image (upload, position)
  - Effects (animations, hover)
```

#### System Block Modal (Hero/Grid/Footer)
```
Trigger: Click edit on system-hero, system-grid, or footer
State: isSystemModalOpen, systemModalType, selectedBlockId
Types: 'hero' | 'grid' | 'footer'
Features:
  - Live preview on right panel
  - Variant selection with thumbnails
  - Warning when switching might lose data
```

#### Header Editor Modal
```
Trigger: "Header" button in sidebar
State: isHeaderModalOpen
Features:
  - Logo mode toggle (text/image)
  - Logo upload with size slider (16-120px)
  - Header style selection (9 styles)
  - Live preview with browser chrome
```

#### Interface Modal
```
Trigger: "Interface" button in sidebar
State: isInterfaceModalOpen
Settings:
  - Store name
  - Tagline
  - Primary/secondary colors
  - AI color palette generator
  - Scrollbar style
```

#### Welcome Wizard Modal
```
Trigger: Auto-opens if !hasVisitedDesignStudio
State: showWelcomeWizard, wizardMode
Modes:
  - null → Choose path (Customize/AI/Templates)
  - 'ai-questions' → 5-step AI questionnaire
  - 'ai-generating' → Loading state
  - 'templates' → Browse templates
```

#### Pre-Publish Checklist Modal
```
Trigger: "Publish" button
State: showPrePublishChecklist
Checks:
  - Hero section present
  - Contact info set
  - Products/content added
  - Store name customized
  - Email capture enabled
Actions: "Fix" button for each, "Publish Now"
```

---

## State Management

### Core Editor State

| Variable | Type | Purpose |
|----------|------|---------|
| `selectedBlockId` | `string \| null` | Currently selected block |
| `activePageId` | `string` | Current page being edited |
| `previewBlock` | `PageBlock \| null` | Preview in Add Section flow |
| `hasUnsavedChanges` | `boolean` | Pending changes flag |
| `isSaving` | `boolean` | Save in progress |
| `localPages` | `Page[]` | Draft copy of pages |

### History State (Undo/Redo)

| Variable | Type | Purpose |
|----------|------|---------|
| `history` | `HistoryState[]` | State stack (max 50) |
| `historyIndex` | `number` | Current position |
| `isTimeTravel` | `boolean` | Prevents re-recording |

### UI State

| Variable | Type | Purpose |
|----------|------|---------|
| `expandedSections` | `Record<string, boolean>` | Collapsible sections |
| `previewViewport` | `'desktop' \| 'mobile' \| 'tablet'` | Preview size |
| `editorPanelWidth` | `number` | Resizable panel width |
| `isNavCollapsed` | `boolean` | Sidebar collapsed |
| `draggedBlockIndex` | `number \| null` | Drag reorder |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save changes |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+Shift+Z` | Redo (alternative) |

---

## Component Architecture

```
App.tsx
└── AdminPanel.tsx (Design Studio)
    ├── Sidebar
    │   ├── Page/Block List
    │   ├── Header Button → HeaderEditorModal
    │   ├── Interface Button → InterfaceModal
    │   └── Add Section Button → AddSectionLibraryModal
    │
    ├── Preview Area
    │   └── Storefront.tsx (live preview)
    │       ├── HeaderComponent
    │       ├── renderBlock() → SectionWrapper
    │       │   ├── HeroComponents
    │       │   ├── GridComponents
    │       │   ├── ScrollComponents
    │       │   └── ... (all section components)
    │       └── FooterComponent
    │
    └── Editor Panel (right side)
        └── UniversalEditor.tsx
            ├── Layout Picker
            ├── Field Groups (tabs)
            │   ├── Content fields
            │   ├── Media fields
            │   ├── Button fields
            │   └── Style fields
            └── Items List (drill-down for arrays)

Library Files (Component Definitions):
├── HeroLibrary.tsx      → HERO_OPTIONS, HERO_COMPONENTS
├── ProductCardLibrary.tsx → PRODUCT_CARD_OPTIONS, PRODUCT_CARD_COMPONENTS
├── CollectionLibrary.tsx → COLLECTION_OPTIONS, COLLECTION_COMPONENTS
├── LayoutLibrary.tsx    → LAYOUT_OPTIONS, LAYOUT_COMPONENTS
├── ScrollLibrary.tsx    → SCROLL_OPTIONS, SCROLL_COMPONENTS
├── SocialLibrary.tsx    → SOCIAL_OPTIONS, SOCIAL_COMPONENTS
├── BlogLibrary.tsx      → BLOG_OPTIONS, BLOG_COMPONENTS
├── VideoLibrary.tsx     → VIDEO_OPTIONS, VIDEO_COMPONENTS
├── GalleryLibrary.tsx   → GALLERY_OPTIONS, GALLERY_COMPONENTS
├── ContactLibrary.tsx   → CONTACT_OPTIONS, CONTACT_COMPONENTS
├── FooterLibrary.tsx    → FOOTER_OPTIONS, FOOTER_COMPONENTS
├── HeaderLibrary.tsx    → HEADER_OPTIONS, HEADER_COMPONENTS
└── SectionLibrary.tsx   → RICH_TEXT_OPTIONS, EMAIL_SIGNUP_OPTIONS, etc.
```

---

## Data Flow

```
User Action
    │
    ▼
AdminPanel Handler (e.g., handleMoveBlock)
    │
    ▼
setLocalPages() → localPages updated
    │
    ▼
setHasUnsavedChanges(true)
    │
    ▼
Auto-save (1.5s) or Manual Save
    │
    ▼
handleSaveChanges()
    │
    ▼
onUpdatePage() → DataContext.updatePage()
    │
    ▼
Supabase DB Update
    │
    ▼
setHasUnsavedChanges(false)
```

---

## Design Overrides (All Sections)

Every section type has access to these style overrides in UniversalEditor:

| Setting | Options |
|---------|---------|
| Background | auto, white, black, accent, gradient |
| Padding | auto, small, medium, large, xl |
| Text Alignment | auto, left, center, right |
| Max Width | auto, narrow (800px), medium (1200px), wide (1400px), full |
