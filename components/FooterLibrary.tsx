// TEMPORARY COMPATIBILITY LAYER
// This file bridges legacy imports to new component system
// TODO: Remove once all files are migrated to new imports

import React from 'react';
import { FooterSection, FooterContent, FooterStyle } from './sections/FooterSections';

// Adapter function: converts legacy props to new FooterSection props
const createFooterAdapter = (variant: 'standard' | 'minimal') => {
  return ({ storeName, navLinks, ...props }: any) => {
    const content: FooterContent = {
      logoText: storeName,
      copyright: `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`,
      columns: [
        {
          title: 'Shop',
          links: navLinks?.slice(0, 4) || [],
        },
        {
          title: 'Support',
          links: [
            { text: 'Contact', href: '/contact' },
            { text: 'FAQ', href: '/faq' },
          ],
        },
      ],
      socialLinks: [],
    };

    const style: FooterStyle = {
      background: 'bg-gray-900 text-white',
    };

    return (
      <FooterSection
        variant={variant}
        content={content}
        style={style}
        editMode={false}
      />
    );
  };
};

// Legacy component constants - map to new components
export const FOOTER_COMPONENTS: Record<string, any> = {
  'standard': createFooterAdapter('standard'),
  'minimal': createFooterAdapter('minimal'),
  // Legacy fallbacks
  'columns': createFooterAdapter('standard'),
  'centered': createFooterAdapter('minimal'),
};

export const FOOTER_OPTIONS: any[] = [
  { id: 'standard', name: 'Standard Footer' },
  { id: 'minimal', name: 'Minimal Footer' },
];

export const FOOTER_FIELDS: Record<string, any> = {};

export const FooterCanvas = createFooterAdapter('standard');
