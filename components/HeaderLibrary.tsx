// TEMPORARY COMPATIBILITY LAYER
// This file bridges legacy imports to new component system
// TODO: Remove once all files are migrated to new imports

import React from 'react';
import { HeaderSection, HeaderContent, HeaderStyle } from './sections/HeaderSections';

// Adapter function: converts legacy props to new HeaderSection props
const createHeaderAdapter = (variant: 'standard' | 'centered') => {
  return ({ storeName, navLinks, primaryColor, logo, ...props }: any) => {
    const content: HeaderContent = {
      logoText: storeName,
      logo: logo,
      navigation: navLinks || [],
      cta: { text: 'Get Started', href: '/signup' },
    };

    const style: HeaderStyle = {
      background: 'bg-white border-b border-gray-200',
      sticky: true,
    };

    return (
      <HeaderSection
        variant={variant}
        content={content}
        style={style}
        editMode={false}
      />
    );
  };
};

// Legacy component constants - map to new components
export const HEADER_COMPONENTS: Record<string, any> = {
  'standard': createHeaderAdapter('standard'),
  'centered': createHeaderAdapter('centered'),
  // Legacy fallbacks
  'canvas': createHeaderAdapter('standard'),
  'orbit': createHeaderAdapter('standard'),
  'studio': createHeaderAdapter('centered'),
};

export const HEADER_OPTIONS: any[] = [
  { id: 'standard', name: 'Standard Header' },
  { id: 'centered', name: 'Centered Header' },
];

export const HEADER_FIELDS: Record<string, any> = {};

export const HeaderCanvas = createHeaderAdapter('standard');
