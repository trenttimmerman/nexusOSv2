// designer.ts - Designer V3 TypeScript Interfaces
// Phase 1: Foundation types for AI-powered header generation

/**
 * Navigation item structure for header menus
 */
export interface NavigationItem {
  label: string;
  url: string;
  type?: 'link' | 'dropdown' | 'megamenu';
  children?: NavigationItem[];
}

/**
 * Comprehensive header configuration interface
 * Used for AI generation, customization, and rendering
 */
export interface HeaderConfig {
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
  
  // High-Voltage Design Controls (Anti-Boring Protocol)
  scrollBehavior?: 'static' | 'sticky' | 'hide-on-scroll' | 'glass-on-scroll';
  animationSpeed?: 'slow' | 'medium' | 'fast';
  
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

/**
 * Shared header library entry
 * Stores community headers in Supabase for all users
 */
export interface SharedHeaderLibrary {
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

/**
 * Designer wizard step enumeration
 */
export enum DesignerStep {
  HEADER_SELECTION = 'header_selection',
  HEADER_CUSTOMIZATION = 'header_customization',
  SAVE_TO_LIBRARY = 'save_to_library',
  COMPLETE = 'complete',
}

/**
 * Designer wizard state
 */
export interface DesignerWizardState {
  currentStep: DesignerStep;
  selectedHeaderId?: string;
  selectedHeaderConfig?: HeaderConfig;
  customizedHeaderConfig?: HeaderConfig;
  isGenerating?: boolean;
  generatedHeaders?: SharedHeaderLibrary[];
}
