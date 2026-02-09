// TEMPORARY COMPATIBILITY LAYER
// This file bridges legacy imports to new component system
// TODO: Remove once all files are migrated to new imports

import React from 'react';

// Simple footer stub
const FooterStub = ({ storeName, navLinks, ...props }: any) => (
  <footer className="bg-gray-900 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="font-bold text-xl mb-4">{storeName || 'Store'}</div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {storeName || 'Store'}. All rights reserved.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Shop</h3>
          <ul className="space-y-2">
            {(navLinks || []).slice(0, 4).map((link: any, i: number) => (
              <li key={i}>
                <a href={link.href || '#'} className="text-gray-400 hover:text-white text-sm">
                  {link.label || link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

// Legacy component constants (empty for now - will be populated as needed)
export const FOOTER_COMPONENTS: Record<string, any> = {
  'standard': FooterStub,
  'minimal': FooterStub,
  'columns': FooterStub,
  'centered': FooterStub,
};

export const FOOTER_OPTIONS: any[] = [
  { id: 'standard', name: 'Standard Footer' },
  { id: 'minimal', name: 'Minimal Footer' },
];

export const FOOTER_FIELDS: Record<string, any> = {};

export const FooterCanvas = FooterStub;
