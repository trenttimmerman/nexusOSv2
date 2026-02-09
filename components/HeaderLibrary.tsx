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
export const HEADER_FIELDS: Record<string, string[]> = {
  canvas: [
    // Visibility Toggles
    'showSearch', 'showAccount', 'showCart', 'showMobileMenu',
    'showAnnouncementBar', 'showUtilityBar', 'showCommandPalette',
    'showCurrencySelector', 'showLanguageSelector',
    // Feature Toggles
    'enableSmartScroll', 'enableMegaMenu', 'enableSpotlightBorders',
    'enableGlassmorphism', 'sticky', 'announcementDismissible', 'announcementMarquee',
    // Select Fields
    'navActiveStyle', 'megaMenuStyle', 'mobileMenuPosition', 'blurIntensity', 'maxWidth',
    // Colors
    'backgroundColor', 'borderColor', 'textColor', 'textHoverColor',
    'accentColor', 'cartBadgeColor', 'cartBadgeTextColor', 'iconHoverBackgroundColor',
    'announcementBackgroundColor', 'announcementTextColor',
    'utilityBarBackgroundColor', 'utilityBarTextColor',
    'mobileMenuBackgroundColor', 'mobileMenuTextColor',
    'searchBackgroundColor', 'searchBorderColor', 'searchInputTextColor',
    'ctaBackgroundColor', 'ctaHoverColor',
    // Numbers
    'iconSize', 'logoHeight', 'mobileMenuOverlayOpacity',
    'glassBackgroundOpacity', 'smartScrollThreshold', 'smartScrollDuration',
    // Sizes
    'paddingX', 'paddingY', 'borderWidth', 'mobileMenuWidth',
    // Text
    'announcementText', 'searchPlaceholder', 'ctaText',
  ],
  standard: ['textColor', 'backgroundColor', 'sticky'],
  centered: ['textColor', 'backgroundColor', 'sticky'],
};

export const HeaderCanvas = HeaderStub;
