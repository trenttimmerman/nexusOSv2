# Designer V3 - Architecture & Implementation Plan

**Branch:** `designerv3`  
**Date:** February 7, 2026  
**Status:** Planning Phase

---

## Executive Summary

Designer V3 is a complete redesign of the WebPilot design studio, focusing on AI-powered header generation and a differentiated UX through Gemini integration. The system transitions users from administrative setup through an interactive full-screen designer wizard that generates unique, fully customizable headers on demand.

---

## Core Objectives

1. **Preserve Welcome Wizard** - Maintain existing administrative setup flow
2. **AI-Powered Design** - Gemini agent generates 3 unique header designs on request
3. **Full Customization** - All generated headers are fully editable modules
4. **Shared Library** - Community-driven header library for all users
5. **Cutting-Edge Design** - Gemini trained on latest design trends and patterns

---

## System Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    NEW USER ONBOARDING                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: Welcome Wizard (Administrative Setup)             │
│  - Store details                                            │
│  - Business information                                     │
│  - Basic preferences                                        │
│  Status: ✅ PRESERVE EXISTING CODE                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: Designer Wizard (Gemini-Powered)                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  STEP 1: Header Design Selection                     │  │
│  │  ┌──────────────┐        ┌──────────────┐           │  │
│  │  │ Choose from  │   OR   │ AI Generate  │           │  │
│  │  │  Library     │        │  3 Designs   │           │  │
│  │  └──────────────┘        └──────────────┘           │  │
│  │         ↓                        ↓                   │  │
│  │    [Existing Headers]    [Gemini Agent]             │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  STEP 2: Full-Screen Header Editor                   │  │
│  │  - Background effects (gradients, animations)        │  │
│  │  - Scroll behavior (sticky, fade, etc.)              │  │
│  │  - Typography controls                               │  │
│  │  - Color customization                               │  │
│  │  - Logo placement & sizing                           │  │
│  │  - Icons (cart, account, search)                     │  │
│  │  - Live preview                                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  STEP 3: Save to Shared Library                      │  │
│  │  - User's custom design added to library             │  │
│  │  - Available for all customers                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  COMPLETE: Launch to Admin Panel / Designer                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

### 1. Welcome Wizard (Existing - Preserve)

**File:** `components/WelcomeFlow.tsx`  
**Status:** ✅ Already implemented  
**Action:** Preserve as-is, add transition to Designer Wizard

```typescript
// Add final step transition
const handleAdminComplete = async () => {
  // Existing admin setup completion logic
  // ...
  
  // NEW: Transition to Designer Wizard
  setShowDesignerWizard(true);
};
```

---

### 2. Designer Wizard (New - Full Implementation)

**Component Structure:**

```
components/
├── DesignerWizard.tsx              # Main wizard container
├── designer/
│   ├── HeaderSelectionStep.tsx     # Step 1: Choose/Generate
│   ├── HeaderEditorStep.tsx        # Step 2: Full-screen editor
│   ├── LibrarySaveStep.tsx         # Step 3: Save to library
│   ├── GeminiHeaderGenerator.tsx   # AI generation component
│   └── HeaderEditorPanel.tsx       # Advanced editing controls
└── editor/
    └── HeaderEditorCanvas.tsx      # Live preview canvas
```

---

### 3. Gemini AI Integration Points

#### Integration Point 1: Header Generation Request

**Endpoint:** `/api/ai/generate-headers`

**Request:**
```typescript
interface HeaderGenerationRequest {
  storeId: string;
  brandName: string;
  brandDescription?: string;
  industry?: string;
  colorPreferences?: string[];
  stylePreferences?: ('minimal' | 'bold' | 'elegant' | 'modern')[];
  logoUrl?: string;
}
```

**Response:**
```typescript
interface HeaderGenerationResponse {
  headers: [
    {
      id: string;
      name: string;
      code: string;              // React component code
      preview: string;           // Base64 screenshot
      config: HeaderConfig;      // Customization config
      metadata: {
        generatedAt: string;
        model: string;
        designTrends: string[];
      }
    },
    // ... 2 more headers (total 3)
  ]
}
```

#### Gemini Prompt Structure

```typescript
const generateHeaderPrompt = (request: HeaderGenerationRequest) => `
ROLE: You are the "Built North" Design Architect.
CONTEXT: We are building a high-end e-commerce platform.

PHASE 1: RESEARCH & DISCOVERY
Before generating code, you must simulate a retrieval of the latest 2026 UI/UX benchmarks.
Look for:
- "Liquid Glass 2.0" (Refraction/Blur)
- "Kinetic Typography" (Scroll-reactive fonts)
- "Bento Grid" layouts
- "Tactile Maximalism" (Depth/Shadows)

PHASE 2: GENERATION
Generate 3 distinct header concepts for:
- Brand: ${request.brandName}
- Industry: ${request.industry}

OPTION 1: MINIMALIST (Focus on Typography & Whitespace)
OPTION 2: INTERACTIVE (Focus on Micro-animations & Hover states)
OPTION 3: CONVERSION (Focus on Mobile Thumb-Zones & CTA)

REQUIREMENTS:
1. Output valid React code using Tailwind CSS.
2. WIRE THE COMPONENT: You must use CSS Variables for dynamic control (e.g., var(--header-bg), var(--nav-gap)).
3. Return ONLY valid JSON matching the HeaderGenerationResponse schema.
`;
```

---

## Data Models

### Header Configuration Schema

```typescript
interface HeaderConfig {
  // Structure
  layout: 'left-logo' | 'centered-logo' | 'logo-right' | 'split';
  height: 'compact' | 'standard' | 'tall'; // 60px, 80px, 100px
  
  // Background
  background: {
    type: 'solid' | 'gradient' | 'animated';
    color?: string;
    gradient?: {
      from: string;
      to: string;
      direction: 'horizontal' | 'vertical' | 'diagonal';
    };
    animation?: {
      type: 'wave' | 'particles' | 'gradient-shift';
      speed: 'slow' | 'medium' | 'fast';
    };
    blur?: number; // Glassmorphism effect
    opacity?: number;
  };
  
  // Scroll Behavior
  scroll: {
    behavior: 'static' | 'sticky' | 'fade' | 'shrink';
    stickyOffset?: number;
    shrinkHeight?: number;
    fadeThreshold?: number;
  };
  
  // Logo
  logo: {
    type: 'text' | 'image' | 'both';
    position: 'left' | 'center' | 'right';
    size: 'small' | 'medium' | 'large';
    textSize?: string;
    textColor?: string;
    font?: string;
    imageUrl?: string;
    imageHeight?: number;
  };
  
  // Navigation
  navigation: {
    style: 'horizontal' | 'dropdown' | 'megamenu';
    items: NavigationItem[];
    textColor?: string;
    hoverColor?: string;
    font?: string;
    fontSize?: string;
    spacing?: number;
  };
  
  // Search
  search: {
    visibility: 'always' | 'expandable' | 'hidden';
    position: 'left' | 'center' | 'right';
    placeholder?: string;
    style?: 'rounded' | 'square' | 'pill';
  };
  
  // Icons
  icons: {
    cart: {
      show: boolean;
      position: 'left' | 'right';
      showBadge: boolean;
      color?: string;
      size?: number;
    };
    account: {
      show: boolean;
      position: 'left' | 'right';
      color?: string;
      size?: number;
    };
    menu: {
      style: 'hamburger' | 'dots' | 'drawer';
      color?: string;
    };
  };
  
  // Typography
  typography: {
    primaryFont: string;
    secondaryFont?: string;
    baseSize: string;
    weights: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
  
  // Colors
  colors: {
    primary: string;
    secondary?: string;
    text: string;
    textHover: string;
    border?: string;
    background: string;
  };
  
  // Effects
  effects: {
    shadow: boolean;
    shadowSize?: 'sm' | 'md' | 'lg';
    border: boolean;
    borderPosition?: 'top' | 'bottom' | 'both';
    borderColor?: string;
  };
}
```

### Shared Library Schema

```typescript
interface SharedHeaderLibrary {
  id: string;
  name: string;
  description?: string;
  component: string;           // React component code
  config: HeaderConfig;
  preview: string;             // Screenshot URL
  metadata: {
    createdBy: string;         // store_id or 'ai-generated'
    createdAt: string;
    timesUsed: number;
    averageRating?: number;
    tags: string[];
    aiGenerated: boolean;
    designTrends?: string[];
  };
  status: 'public' | 'private' | 'community';
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Setup core structure and data models

**Tasks:**
- [ ] Create `DesignerWizard.tsx` component shell
- [ ] Define TypeScript interfaces (HeaderConfig, SharedHeaderLibrary)
- [ ] Setup Supabase table: `shared_header_library`
- [ ] Create database migrations for new tables
- [ ] Setup RLS policies for shared library access

**Files to Create:**
- `components/DesignerWizard.tsx`
- `types/designer.ts`
- `supabase/migrations/XXX_create_shared_header_library.sql`

---

### Phase 2: Header Selection Step (Week 1-2)

**Goal:** Build header library browsing and selection

**Tasks:**
- [ ] Create `HeaderSelectionStep.tsx`
- [ ] Fetch shared library headers from Supabase
- [ ] Display grid of header previews
- [ ] Implement header preview hover states
- [ ] Add "Choose This Header" button
- [ ] Add "Generate New Headers" button (triggers Gemini)

**Files to Create:**
- `components/designer/HeaderSelectionStep.tsx`
- `components/designer/HeaderPreviewCard.tsx`

---

### Phase 3: Gemini Integration (Week 2)

**Goal:** AI-powered header generation

**Tasks:**
- [ ] Create Vercel API endpoint: `/api/ai/generate-headers`
- [ ] Setup Gemini SDK and API keys
- [ ] Implement prompt engineering for header generation
- [ ] Parse Gemini response into HeaderConfig + React component
- [ ] Generate preview screenshots (puppeteer/playwright)
- [ ] Cache generated headers in Supabase

**Files to Create:**
- `api/ai/generate-headers.ts`
- `ai/headerGenerator.ts` (refactor existing)
- `lib/gemini/headerPrompts.ts`
- `lib/screenshot/generatePreview.ts`

**Gemini Model Configuration:**
```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.9,      // High creativity
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  }
});
```

---

### Phase 4: Full-Screen Header Editor (Week 3)

**Goal:** Advanced customization interface

**Tasks:**
- [ ] Create `HeaderEditorStep.tsx` full-screen modal
- [ ] Create `HeaderEditorPanel.tsx` controls sidebar
- [ ] Create `HeaderEditorCanvas.tsx` live preview
- [ ] Implement background controls (gradients, animations)
- [ ] Implement scroll behavior controls
- [ ] Implement typography controls
- [ ] Implement color picker with presets
- [ ] Implement logo upload and positioning
- [ ] Implement icon customization
- [ ] Real-time preview updates

**Files to Create:**
- `components/designer/HeaderEditorStep.tsx`
- `components/designer/HeaderEditorPanel.tsx`
- `components/designer/controls/BackgroundControls.tsx`
- `components/designer/controls/ScrollControls.tsx`
- `components/designer/controls/TypographyControls.tsx`
- `components/designer/controls/ColorControls.tsx`
- `components/designer/controls/LogoControls.tsx`
- `components/designer/controls/IconControls.tsx`
- `components/editor/HeaderEditorCanvas.tsx`

**Editor Panel Structure:**
```typescript
const EditorControls = [
  {
    section: 'Background',
    icon: PaletteIcon,
    controls: ['type', 'color', 'gradient', 'animation', 'blur']
  },
  {
    section: 'Scroll Behavior',
    icon: ArrowDownIcon,
    controls: ['behavior', 'stickyOffset', 'shrinkHeight']
  },
  {
    section: 'Logo',
    icon: ImageIcon,
    controls: ['type', 'position', 'size', 'upload']
  },
  {
    section: 'Typography',
    icon: TypeIcon,
    controls: ['font', 'size', 'weight', 'spacing']
  },
  {
    section: 'Colors',
    icon: DropletIcon,
    controls: ['primary', 'text', 'hover', 'border']
  },
  {
    section: 'Icons',
    icon: ShoppingCartIcon,
    controls: ['cart', 'account', 'search', 'menu']
  },
  {
    section: 'Effects',
    icon: SparklesIcon,
    controls: ['shadow', 'border', 'transitions']
  }
];
```

---

### Phase 5: Library Integration (Week 4)

**Goal:** Save and share customized headers

**Tasks:**
- [ ] Create `LibrarySaveStep.tsx`
- [ ] Implement header save to Supabase
- [ ] Generate preview screenshot before saving
- [ ] Add metadata (tags, description)
- [ ] Make header public/private toggle
- [ ] Update shared library with new header
- [ ] Implement header usage tracking
- [ ] Add rating system (future)

**Files to Create:**
- `components/designer/LibrarySaveStep.tsx`
- `api/headers/save-to-library.ts`

---

### Phase 6: Welcome Flow Integration (Week 4)

**Goal:** Seamless transition from admin setup to designer

**Tasks:**
- [ ] Update `WelcomeFlow.tsx` to launch Designer Wizard
- [ ] Handle state transition between wizards
- [ ] Persist wizard progress
- [ ] Allow "Skip to Dashboard" option
- [ ] Save selected/generated header to store

**Files to Modify:**
- `components/WelcomeFlow.tsx`
- `components/AdminPanel.tsx`

---

## Technical Specifications

### Gemini Training Strategy

**Continuous Learning:**
1. Scrape design inspiration sites (Dribbble, Awwwards, Behance)
2. Analyze trending header designs monthly
3. Update prompt templates with new patterns
4. Version prompts (v1, v2, v3) to track improvements

**Design Trends Database:**
```typescript
const designTrends2026 = {
  layout: ['asymmetric grids', 'overlap effects', 'floating elements'],
  colors: ['vibrant gradients', 'dark mode', 'glassmorphism'],
  typography: ['variable fonts', 'oversized headers', 'mixed weights'],
  interactions: ['micro-animations', 'cursor effects', 'scroll-triggered'],
  accessibility: ['WCAG AA', 'high contrast modes', 'reduced motion']
};
```

### Performance Optimization

1. **Header Generation:**
   - Cache generated headers for 24 hours
   - Use Vercel Edge Functions for low latency
   - Parallel screenshot generation

2. **Editor Performance:**
   - Debounce preview updates (300ms)
   - Lazy load editor controls
   - Virtual scrolling for large libraries

3. **Preview Screenshots:**
   - Use Vercel OG Image for quick previews
   - Store in Supabase Storage
   - CDN delivery

---

## Database Schema

```sql
-- Shared Header Library
CREATE TABLE shared_header_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  component TEXT NOT NULL,              -- React component code
  config JSONB NOT NULL,                -- HeaderConfig object
  preview_url TEXT,                     -- Screenshot URL
  created_by UUID REFERENCES stores(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  times_used INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  tags TEXT[],
  ai_generated BOOLEAN DEFAULT false,
  design_trends TEXT[],
  status VARCHAR(50) DEFAULT 'public'   -- public, private, community
);

-- RLS Policies
ALTER TABLE shared_header_library ENABLE ROW LEVEL SECURITY;

-- Anyone can read public headers
CREATE POLICY "Public headers are viewable by all"
  ON shared_header_library FOR SELECT
  USING (status = 'public');

-- Users can create their own headers
CREATE POLICY "Users can create headers"
  ON shared_header_library FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Users can update their own headers
CREATE POLICY "Users can update own headers"
  ON shared_header_library FOR UPDATE
  USING (created_by = auth.uid());

-- Index for performance
CREATE INDEX idx_shared_headers_status ON shared_header_library(status);
CREATE INDEX idx_shared_headers_tags ON shared_header_library USING GIN(tags);
CREATE INDEX idx_shared_headers_created_at ON shared_header_library(created_at DESC);
```

---

## API Endpoints

### 1. Generate Headers (Gemini)
**POST** `/api/ai/generate-headers`

### 2. Save to Library
**POST** `/api/headers/save-to-library`

### 3. Fetch Library Headers
**GET** `/api/headers/library?status=public&limit=20`

### 4. Update Header Config
**PATCH** `/api/headers/:id/config`

### 5. Track Usage
**POST** `/api/headers/:id/usage`

---

## UI/UX Specifications

### Full-Screen Editor Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back]  Header Designer            [Save to Library]     │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  CONTROLS    │           LIVE PREVIEW CANVAS               │
│  SIDEBAR     │                                              │
│              │   ┌────────────────────────────────────┐     │
│ Background   │   │  [Logo]  Home  Shop  About  [🛒]  │     │
│ ● Solid      │   └────────────────────────────────────┘     │
│ ○ Gradient   │                                              │
│ ○ Animated   │       ← Preview updates in real-time        │
│              │                                              │
│ Scroll       │                                              │
│ ● Static     │                                              │
│ ○ Sticky     │        [Desktop / Tablet / Mobile]          │
│ ○ Fade       │                                              │
│              │                                              │
│ Typography   │                                              │
│ Colors       │                                              │
│ Logo         │                                              │
│ Icons        │                                              │
│ Effects      │                                              │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

### Design Principles

1. **Minimal Clicks:** Essential controls visible, advanced in expandable sections
2. **Live Preview:** Every change reflects instantly in canvas
3. **Responsive Tabs:** Toggle between desktop/tablet/mobile views
4. **Visual Feedback:** Hover states, transitions, loading indicators
5. **Undo/Redo:** Command pattern for all changes
6. **Presets:** Quick-apply design presets (Minimal, Bold, Elegant, Modern)

---

## Security Considerations

1. **Code Validation:**
   - Sanitize Gemini-generated code before execution
   - Use sandboxed iframe for preview rendering
   - Validate React component syntax

2. **Rate Limiting:**
   - Max 3 header generation requests per hour per user
   - Prevent abuse of Gemini API

3. **Access Control:**
   - RLS policies for header library
   - Private headers only visible to creator
   - Community moderation for public headers

---

## Success Metrics

1. **Generation Quality:**
   - 90%+ of generated headers are usable without major edits
   - Average user rating ≥ 4/5 stars

2. **User Engagement:**
   - 70%+ of new users complete designer wizard
   - Average 5+ customization changes per header

3. **Library Growth:**
   - 100+ community headers in first month
   - 50%+ of users choose community headers over AI generation

4. **Performance:**
   - Header generation < 15 seconds
   - Editor updates < 100ms latency
   - Preview screenshots < 3 seconds

---

## Future Enhancements

### Phase 7+ (Post-Launch)

1. **Multi-Component Generation:**
   - Extend to Hero sections
   - Extend to Footer sections
   - Full page layouts

2. **Advanced AI Features:**
   - "Design a header like [brand.com]"
   - A/B testing suggestions
   - Auto-optimize for conversions

3. **Collaboration:**
   - Share designs with team
   - Comment on headers
   - Version history

4. **Marketplace:**
   - Premium header templates
   - Designer contributions
   - Revenue sharing

---

## Next Steps

1. ✅ **Complete cleanup** - Empty all component libraries (DONE)
2. 📋 **Review this architecture** - Get approval on approach
3. 🏗️ **Start Phase 1** - Create foundation and data models
4. 🤖 **Setup Gemini** - Configure AI integration
5. 🎨 **Build UI** - Implement designer wizard components

---

**Ready to proceed with Phase 1 implementation?**
