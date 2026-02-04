// TEMPORARY COMPATIBILITY LAYER
// This file bridges legacy imports to new component system
// TODO: Remove once all files are migrated to new imports

import React from 'react';
import { EditableText, EditableImage } from './editor';
import { HeroSection, HeroContent, HeroStyle } from './sections/HeroSections';

// Re-export editor components for legacy compatibility
export { EditableText, EditableImage };

// Adapter function: converts legacy props to new HeroSection props
const createHeroAdapter = (variant: 'centered' | 'split' | 'minimal') => {
  return ({ data, isEditable, onUpdate, storeName, primaryColor, ...props }: any) => {
    // Map legacy data structure to new HeroContent
    const content: HeroContent = {
      heading: data?.heading || storeName || 'Welcome',
      subheading: data?.subheading,
      body: data?.body,
      cta: data?.cta,
      secondaryCta: data?.secondaryCta,
      image: data?.image,
      backgroundImage: data?.backgroundImage,
    };

    // Map legacy style to new HeroStyle
    const style: HeroStyle = {
      heading: data?.style?.heading ? {
        fontFamily: data.style.heading.fontFamily,
        fontSize: data.style.heading.fontSize,
        fontWeight: data.style.heading.fontWeight,
        color: data.style.heading.color,
      } : undefined,
      subheading: data?.style?.subheading,
      body: data?.style?.body,
      background: data?.style?.background || 'bg-white',
      padding: data?.style?.padding || 'py-20 px-4',
    };

    return (
      <HeroSection
        variant={variant}
        content={content}
        style={style}
        editMode={isEditable}
        onContentUpdate={(newContent) => {
          if (onUpdate) {
            onUpdate({ ...data, ...newContent });
          }
        }}
      />
    );
  };
};

// Legacy component constants - map to new components
export const HERO_COMPONENTS: Record<string, any> = {
  // New v2 components
  'centered': createHeroAdapter('centered'),
  'split': createHeroAdapter('split'),
  'minimal': createHeroAdapter('minimal'),
  
  // Legacy fallbacks (use centered for now)
  'impact': createHeroAdapter('centered'),
  'gradient': createHeroAdapter('centered'),
  'overlay': createHeroAdapter('centered'),
};

export const HERO_OPTIONS: any[] = [
  { id: 'centered', name: 'Centered Hero', preview: '/previews/hero-centered.jpg' },
  { id: 'split', name: 'Split Hero', preview: '/previews/hero-split.jpg' },
  { id: 'minimal', name: 'Minimal Hero', preview: '/previews/hero-minimal.jpg' },
];

export const HERO_FIELDS: Record<string, any> = {
  heading: { type: 'text', label: 'Heading' },
  subheading: { type: 'text', label: 'Subheading' },
  body: { type: 'textarea', label: 'Body Text' },
  image: { type: 'image', label: 'Hero Image' },
};

// Stub for HeroCanvas component
export const HeroCanvas = () => null;
