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
];

export const HEADER_FIELDS: Record<string, any> = {};

export const HeaderCanvas = HeaderStub;
