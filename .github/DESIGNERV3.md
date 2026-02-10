Designer V3 - Architecture & Implementation Plan (FINALIZED)
Branch: designerv3 Date: February 7, 2026 Status: Approved for Phase 1 Execution

Executive Summary
Designer V3 is a complete redesign of the WebPilot design studio, focusing on AI-powered header generation and a differentiated UX through Gemini integration. The system transitions users from administrative setup through an interactive full-screen designer wizard that generates unique, fully customizable headers on demand.

Core Objectives
Preserve Welcome Wizard - Maintain existing administrative setup flow

AI-Powered Design - Gemini agent generates 3 unique header designs on request (using "Research & Discovery" logic)

Full Customization - All generated headers are fully editable modules

Shared Library - Community-driven header library for all users

Cutting-Edge Design - Gemini trained on latest design trends and patterns

System Architecture
High-Level Flow
┌─────────────────────────────────────────────────────────────┐
│                   NEW USER ONBOARDING                       │
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
│  │  STEP 1: Header Design Selection                      │  │
│  │  ┌──────────────┐        ┌──────────────┐             │  │
│  │  │ Choose from  │   OR   │ AI Generate  │             │  │
│  │  │  Library     │        │  3 Designs   │             │  │
│  │  └──────────────┘        └──────────────┘             │  │
│  │         ↓                      ↓                      │  │
│  │    [Existing Headers]    [Gemini Agent]               │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  STEP 2: Full-Screen Header Editor                    │  │
│  │  - Background effects (gradients, animations)         │  │
│  │  - Scroll behavior (sticky, fade, etc.)               │  │
│  │  - Typography controls                                │  │
│  │  - Color customization                                │  │
│  │  - Logo placement & sizing                            │  │
│  │  - Icons (cart, account, search)                      │  │
│  │  - Live preview                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  STEP 3: Save to Shared Library                       │  │
│  │  - User's custom design added to library              │  │
│  │  - Available for all customers                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  COMPLETE: Launch to Admin Panel / Designer                 │
└─────────────────────────────────────────────────────────────┘
Component Architecture
1. Welcome Wizard (Existing - Preserve)
File: components/WelcomeFlow.tsx Status: ✅ Already implemented Action: Preserve as-is, add transition to Designer Wizard

TypeScript
// Add final step transition
const handleAdminComplete = async () => {
  // Existing admin setup completion logic
  // ...
  
  // NEW: Transition to Designer Wizard
  setShowDesignerWizard(true);
};
2. Designer Wizard (New - Full Implementation)
Component Structure:

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
3. Gemini AI Integration Points
Integration Point 1: Header Generation Request
Endpoint: /api/ai/generate-headers

Request:

TypeScript
interface HeaderGenerationRequest {
  storeId: string;
  brandName: string;
  brandDescription?: string;
  industry?: string;
  colorPreferences?: string[];
  stylePreferences?: ('minimal' | 'bold' | 'elegant' | 'modern')[];
  logoUrl?: string;
}
Gemini Prompt Structure (UPDATED)
TypeScript
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
Response:

TypeScript
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
Data Models
Header Configuration Schema
TypeScript
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
Shared Library Schema
TypeScript
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
Implementation Phases
Phase 1: Foundation (Week 1)
Goal: Setup core structure and data models

Tasks:

[ ] Create DesignerWizard.tsx component shell

[ ] Define TypeScript interfaces (HeaderConfig, SharedHeaderLibrary)

[ ] Setup Supabase table: shared_header_library

[ ] Create database migrations for new tables

[ ] Setup RLS policies for shared library access

Files to Create:

components/DesignerWizard.tsx

types/designer.ts

supabase/migrations/XXX_create_shared_header_library.sql

Phase 2: Header Selection Step (Week 1-2)
Goal: Build header library browsing and selection

Tasks:

[ ] Create HeaderSelectionStep.tsx

[ ] Fetch shared library headers from Supabase

[ ] Display grid of header previews

[ ] Implement header preview hover states

[ ] Add "Choose This Header" button

[ ] Add "Generate New Headers" button (triggers Gemini)

Files to Create:

components/designer/HeaderSelectionStep.tsx

components/designer/HeaderPreviewCard.tsx

Phase 3: Gemini Integration (Week 2)
Goal: AI-powered header generation

Tasks:

[ ] Create Vercel API endpoint: /api/ai/generate-headers

[ ] Setup Gemini SDK and API keys

[ ] Implement prompt engineering for header generation

[ ] Parse Gemini response into HeaderConfig + React component

[ ] Generate preview screenshots (puppeteer/playwright)

[ ] Cache generated headers in Supabase

Files to Create:

api/ai/generate-headers.ts

ai/headerGenerator.ts (refactor existing)

lib/gemini/headerPrompts.ts

lib/screenshot/generatePreview.ts

Phase 4: Full-Screen Header Editor (Week 3)
Goal: Advanced customization interface

Tasks:

[ ] Create HeaderEditorStep.tsx full-screen modal

[ ] Create HeaderEditorPanel.tsx controls sidebar

[ ] Create HeaderEditorCanvas.tsx live preview

[ ] Implement background controls (gradients, animations)

[ ] Implement scroll behavior controls

[ ] Implement typography controls

[ ] Implement color picker with presets

[ ] Implement logo upload and positioning

[ ] Implement icon customization

[ ] Real-time preview updates

Files to Create:

components/designer/HeaderEditorStep.tsx

components/designer/HeaderEditorPanel.tsx

components/designer/controls/BackgroundControls.tsx

components/designer/controls/ScrollControls.tsx

components/editor/HeaderEditorCanvas.tsx

Phase 5: Library Integration (Week 4)
Goal: Save and share customized headers

Tasks:

[ ] Create LibrarySaveStep.tsx

[ ] Implement header save to Supabase

[ ] Generate preview screenshot before saving

[ ] Add metadata (tags, description)

[ ] Make header public/private toggle

[ ] Update shared library with new header

Files to Create:

components/designer/LibrarySaveStep.tsx

api/headers/save-to-library.ts

Database Schema
SQL
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

-- Users can create headers
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
Next Steps

✅ Complete cleanup - Empty all component libraries (DONE)

📋 Review this architecture - Get approval on approach

🏗️ Start Phase 1 - Create foundation and data models

🤖 Setup Gemini - Configure AI integration

🎨 Build UI - Implement designer wizard components