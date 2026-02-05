// SINGLE HERO VARIANT - Full Image with Text Overlay
// Building one perfect component before expanding

import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface HeroData {
  // Content
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
  
  // Colors
  textColor?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  
  // Visibility toggles
  showSubheading?: boolean;
  showButton?: boolean;
}

interface HeroProps {
  data: HeroData;
  onUpdate?: (data: HeroData) => void;
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const FULLIMAGE_DEFAULTS: HeroData = {
  heading: 'Welcome to Our Store',
  subheading: 'Discover amazing products at incredible prices',
  buttonText: 'Shop Now',
  buttonLink: '/products',
  backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
  textColor: '#FFFFFF',
  buttonBackgroundColor: '#000000',
  buttonTextColor: '#FFFFFF',
  buttonHoverColor: '#333333',
  overlayColor: '#000000',
  overlayOpacity: 0.4,
  showSubheading: true,
  showButton: true,
};

// ============================================================================
// FULL IMAGE HERO COMPONENT
// ============================================================================

const HeroFullImage: React.FC<HeroProps> = ({ data, onUpdate }) => {
  const merged = { ...FULLIMAGE_DEFAULTS, ...data };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${merged.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: merged.overlayColor,
          opacity: merged.overlayOpacity,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Heading */}
        <h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{ color: merged.textColor }}
        >
          {merged.heading}
        </h1>

        {/* Subheading */}
        {merged.showSubheading && merged.subheading && (
          <p 
            className="text-xl md:text-2xl mb-10"
            style={{ color: merged.textColor }}
          >
            {merged.subheading}
          </p>
        )}

        {/* CTA Button */}
        {merged.showButton && merged.buttonText && (
          <a
            href={merged.buttonLink}
            className="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition-colors"
            style={{
              backgroundColor: isHovered ? merged.buttonHoverColor : merged.buttonBackgroundColor,
              color: merged.buttonTextColor,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {merged.buttonText}
          </a>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EXPORTS
// ============================================================================

export const HERO_COMPONENTS: Record<string, React.FC<HeroProps>> = {
  fullimage: HeroFullImage,
};

export const HERO_OPTIONS = [
  { 
    id: 'fullimage', 
    name: 'Full Image', 
    description: 'Full-screen background image with centered text overlay',
    popularity: 100,
    recommended: true
  },
];

export const HERO_FIELDS: Record<string, string[]> = {
  fullimage: [
    'heading',
    'subheading',
    'buttonText',
    'buttonLink',
    'backgroundImage',
    'textColor',
    'buttonBackgroundColor',
    'buttonTextColor',
    'buttonHoverColor',
    'overlayColor',
    'overlayOpacity',
    'showSubheading',
    'showButton',
  ],
};
