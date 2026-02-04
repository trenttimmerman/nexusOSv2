// Primitive Components - Base building blocks for all sections
// Agent Phoenix + Agent Aesthetic

import React, { useMemo } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TypographyStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
}

export interface ButtonStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
}

// ============================================================================
// TEXT COMPONENT
// ============================================================================

interface TextProps {
  children: React.ReactNode;
  style?: TypographyStyle;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = React.memo(({ 
  children, 
  style, 
  className = '',
  as: Component = 'p' 
}) => {
  const classes = useMemo(() => {
    return [
      style?.fontFamily || 'font-inter',
      style?.fontSize || 'text-base',
      style?.fontWeight || 'font-normal',
      style?.color || 'text-gray-900',
      style?.lineHeight,
      style?.letterSpacing,
      className
    ].filter(Boolean).join(' ');
  }, [style, className]);

  return <Component className={classes}>{children}</Component>;
});

Text.displayName = 'Text';

// ============================================================================
// HEADING COMPONENT
// ============================================================================

interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  style?: TypographyStyle;
  className?: string;
}

const DEFAULT_HEADING_SIZES = {
  1: 'text-5xl',
  2: 'text-4xl',
  3: 'text-3xl',
  4: 'text-2xl',
  5: 'text-xl',
  6: 'text-lg'
} as const;

export const Heading: React.FC<HeadingProps> = React.memo(({ 
  children, 
  level, 
  style,
  className = '' 
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  const classes = useMemo(() => {
    return [
      style?.fontFamily || 'font-inter',
      style?.fontSize || DEFAULT_HEADING_SIZES[level],
      style?.fontWeight || 'font-bold',
      style?.color || 'text-gray-900',
      style?.lineHeight,
      style?.letterSpacing,
      className
    ].filter(Boolean).join(' ');
  }, [level, style, className]);

  return <Component className={classes}>{children}</Component>;
});

Heading.displayName = 'Heading';

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  style?: ButtonStyle;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = React.memo(({ 
  children,
  onClick,
  href,
  style,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = useMemo(() => {
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    };

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      ghost: 'bg-transparent text-blue-600 hover:bg-blue-50'
    };

    return [
      'inline-flex items-center justify-center',
      'rounded-lg',
      'font-medium',
      'transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses[size],
      variantClasses[variant]
    ].join(' ');
  }, [size, variant]);

  const customClasses = useMemo(() => {
    return [
      style?.backgroundColor,
      style?.textColor,
      style?.borderColor && `border-[${style.borderColor}]`,
      style?.borderWidth,
      style?.borderRadius,
      style?.padding,
      style?.fontSize,
      style?.fontWeight,
      className
    ].filter(Boolean).join(' ');
  }, [style, className]);

  const finalClasses = `${baseClasses} ${customClasses}`;

  if (href) {
    return (
      <a 
        href={href} 
        className={finalClasses}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClasses}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

// ============================================================================
// CONTAINER COMPONENT
// ============================================================================

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Container: React.FC<ContainerProps> = React.memo(({ 
  children, 
  className = '',
  maxWidth = 'xl'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full'
  };

  const classes = useMemo(() => {
    return [
      'mx-auto',
      'px-4 sm:px-6 lg:px-8',
      maxWidthClasses[maxWidth],
      className
    ].filter(Boolean).join(' ');
  }, [maxWidth, className]);

  return <div className={classes}>{children}</div>;
});

Container.displayName = 'Container';

// ============================================================================
// IMAGE COMPONENT
// ============================================================================

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const Image: React.FC<ImageProps> = React.memo(({ 
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  loading = 'lazy',
  priority = false
}) => {
  const objectFitClasses = {
    contain: 'object-contain',
    cover: 'object-cover',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  };

  const classes = useMemo(() => {
    return [
      objectFitClasses[objectFit],
      className
    ].filter(Boolean).join(' ');
  }, [objectFit, className]);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : loading}
      className={classes}
    />
  );
});

Image.displayName = 'Image';

// ============================================================================
// SECTION COMPONENT (Wrapper for all sections)
// ============================================================================

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: string;
  padding?: string;
  id?: string;
  ariaLabel?: string;
}

export const Section: React.FC<SectionProps> = React.memo(({ 
  children,
  className = '',
  background = 'bg-white',
  padding = 'py-16 px-4',
  id,
  ariaLabel
}) => {
  const classes = useMemo(() => {
    return [
      'relative',
      background,
      padding,
      className
    ].filter(Boolean).join(' ');
  }, [background, padding, className]);

  return (
    <section 
      id={id}
      aria-label={ariaLabel}
      className={classes}
    >
      {children}
    </section>
  );
});

Section.displayName = 'Section';
