// TEMPORARY COMPATIBILITY LAYER
// This file bridges legacy imports to new component system
// TODO: Remove once all files are migrated to new imports

import React from 'react';

// Simple header stub
const HeaderStub = ({ storeName, navLinks, primaryColor, logo, ...props }: any) => (
  <header className="bg-white border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="font-bold text-xl">{storeName || 'Store'}</div>
        <nav className="flex gap-6">
          {(navLinks || []).map((link: any, i: number) => (
            <a key={i} href={link.href || '#'} className="text-gray-600 hover:text-gray-900">
              {link.label || link.text}
            </a>
          ))}
        </nav>
      </div>
    </div>
  </header>
);

// Legacy component constants (empty for now - will be populated as needed)
export const HEADER_COMPONENTS: Record<string, any> = {
  'standard': HeaderStub,
  'centered': HeaderStub,
  'canvas': HeaderStub,
  'orbit': HeaderStub,
  'studio': HeaderStub,
};

export const HEADER_OPTIONS: any[] = [
  { id: 'standard', name: 'Standard Header' },
  { id: 'centered', name: 'Centered Header' },
  { id: 'canvas', name: 'Canvas 2026', description: 'Modern header with full customization', category: 'professional', popularity: 95, recommended: true },
];

// Field registry for Header Studio (Admin Panel dynamic controls)
// Based on HeaderCanvas2026.tsx CANVAS_DEFAULTS (70+ fields)
export const HEADER_FIELDS: Record<string, Array<{name: string; label: string; type: string; defaultValue?: any; options?: any[]; min?: number; max?: number; step?: number; placeholder?: string}>> = {
  canvas: [
    // Visibility Toggles
    { name: 'showSearch', label: 'Show Search', type: 'toggle', defaultValue: true },
    { name: 'showAccount', label: 'Show Account', type: 'toggle', defaultValue: true },
    { name: 'showCart', label: 'Show Cart', type: 'toggle', defaultValue: true },
    { name: 'showMobileMenu', label: 'Show Mobile Menu', type: 'toggle', defaultValue: true },
    { name: 'showAnnouncementBar', label: 'Show Announcement Bar', type: 'toggle', defaultValue: false },
    { name: 'showUtilityBar', label: 'Show Utility Bar', type: 'toggle', defaultValue: false },
    { name: 'showCommandPalette', label: 'Show Command Palette', type: 'toggle', defaultValue: false },
    { name: 'showCurrencySelector', label: 'Show Currency Selector', type: 'toggle', defaultValue: false },
    { name: 'showLanguageSelector', label: 'Show Language Selector', type: 'toggle', defaultValue: false },
    
    // Feature Toggles
    { name: 'enableSmartScroll', label: 'Enable Smart Scroll', type: 'toggle', defaultValue: false },
    { name: 'enableMegaMenu', label: 'Enable Mega Menu', type: 'toggle', defaultValue: false },
    { name: 'enableSpotlightBorders', label: 'Enable Spotlight Borders', type: 'toggle', defaultValue: false },
    { name: 'enableGlassmorphism', label: 'Enable Glassmorphism', type: 'toggle', defaultValue: false },
    { name: 'sticky', label: 'Sticky Header', type: 'toggle', defaultValue: false },
    { name: 'announcementDismissible', label: 'Dismissible Announcement', type: 'toggle', defaultValue: false },
    { name: 'announcementMarquee', label: 'Announcement Marquee', type: 'toggle', defaultValue: false },
    
    // Colors
    { name: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#ffffff' },
    { name: 'borderColor', label: 'Border Color', type: 'color', defaultValue: '#e5e7eb' },
    { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#000000' },
    { name: 'textHoverColor', label: 'Text Hover Color', type: 'color', defaultValue: '#3b82f6' },
    { name: 'accentColor', label: 'Accent Color', type: 'color', defaultValue: '#3b82f6' },
    { name: 'cartBadgeColor', label: 'Cart Badge Color', type: 'color', defaultValue: '#ef4444' },
    { name: 'cartBadgeTextColor', label: 'Cart Badge Text', type: 'color', defaultValue: '#ffffff' },
    { name: 'iconHoverBackgroundColor', label: 'Icon Hover Background', type: 'color', defaultValue: '#f3f4f6' },
    { name: 'announcementBackgroundColor', label: 'Announcement Background', type: 'color', defaultValue: '#3b82f6' },
    { name: 'announcementTextColor', label: 'Announcement Text', type: 'color', defaultValue: '#ffffff' },
    { name: 'utilityBarBackgroundColor', label: 'Utility Bar Background', type: 'color', defaultValue: '#f9fafb' },
    { name: 'utilityBarTextColor', label: 'Utility Bar Text', type: 'color', defaultValue: '#6b7280' },
    { name: 'mobileMenuBackgroundColor', label: 'Mobile Menu Background', type: 'color', defaultValue: '#ffffff' },
    { name: 'mobileMenuTextColor', label: 'Mobile Menu Text', type: 'color', defaultValue: '#000000' },
    { name: 'searchBackgroundColor', label: 'Search Background', type: 'color', defaultValue: '#f9fafb' },
    { name: 'searchBorderColor', label: 'Search Border', type: 'color', defaultValue: '#e5e7eb' },
    { name: 'searchInputTextColor', label: 'Search Input Text', type: 'color', defaultValue: '#000000' },
    { name: 'ctaBackgroundColor', label: 'CTA Background', type: 'color', defaultValue: '#3b82f6' },
    { name: 'ctaHoverColor', label: 'CTA Hover Color', type: 'color', defaultValue: '#2563eb' },
    
    // Numbers
    { name: 'iconSize', label: 'Icon Size', type: 'number', defaultValue: 20, min: 16, max: 32, step: 2 },
    { name: 'logoHeight', label: 'Logo Height', type: 'number', defaultValue: 40, min: 20, max: 100, step: 5 },
    { name: 'mobileMenuOverlayOpacity', label: 'Mobile Menu Overlay', type: 'number', defaultValue: 0.5, min: 0, max: 1, step: 0.1 },
    { name: 'glassBackgroundOpacity', label: 'Glass Background Opacity', type: 'number', defaultValue: 0.3, min: 0, max: 1, step: 0.1 },
    { name: 'smartScrollThreshold', label: 'Smart Scroll Threshold', type: 'number', defaultValue: 50, min: 10, max: 200, step: 10 },
    { name: 'smartScrollDuration', label: 'Smart Scroll Duration', type: 'number', defaultValue: 300, min: 100, max: 1000, step: 100 },
    { name: 'paddingX', label: 'Horizontal Padding', type: 'number', defaultValue: 24, min: 0, max: 100, step: 4 },
    { name: 'paddingY', label: 'Vertical Padding', type: 'number', defaultValue: 16, min: 0, max: 50, step: 2 },
    { name: 'borderWidth', label: 'Border Width', type: 'number', defaultValue: 1, min: 0, max: 5, step: 1 },
    { name: 'mobileMenuWidth', label: 'Mobile Menu Width', type: 'number', defaultValue: 320, min: 200, max: 500, step: 10 },
    
    // Text
    { name: 'announcementText', label: 'Announcement Text', type: 'text', defaultValue: '', placeholder: 'Free shipping on orders over $50!' },
    { name: 'searchPlaceholder', label: 'Search Placeholder', type: 'text', defaultValue: 'Search products...', placeholder: 'Search...' },
    { name: 'ctaText', label: 'CTA Text', type: 'text', defaultValue: 'Shop Now', placeholder: 'Button text' },
  ],
  standard: [
    { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#000000' },
    { name: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#ffffff' },
    { name: 'sticky', label: 'Sticky Header', type: 'toggle', defaultValue: false },
  ],
  centered: [
    { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#000000' },
    { name: 'backgroundColor', label: 'Background Color', type: 'color', defaultValue: '#ffffff' },
    { name: 'sticky', label: 'Sticky Header', type: 'toggle', defaultValue: false },
  ],
};

export const HeaderCanvas = HeaderStub;
