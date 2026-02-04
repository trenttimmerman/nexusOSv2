// Editable Component Wrappers - For design editor mode
// Agent Phoenix + Agent Aesthetic

import React, { useMemo, useRef, useEffect } from 'react';
import { TypographyStyle, ButtonStyle } from '../primitives';

// ============================================================================
// EDITABLE TEXT COMPONENT
// ============================================================================

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  style?: TypographyStyle;
  placeholder?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  className?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  style,
  placeholder = 'Enter text...',
  as: Component = 'p',
  className = '',
  multiline = true
}) => {
  const ref = useRef<HTMLElement>(null);

  const classes = useMemo(() => {
    return [
      style?.fontFamily || 'font-inter',
      style?.fontSize || 'text-base',
      style?.fontWeight || 'font-normal',
      style?.color || 'text-gray-900',
      style?.lineHeight,
      style?.letterSpacing,
      'outline-none',
      'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'rounded',
      'transition-all duration-150',
      'cursor-text',
      className
    ].filter(Boolean).join(' ');
  }, [style, className]);

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.textContent || '';
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // Prevent new lines in single-line mode
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }

    // Save on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  // Update content if value changes externally
  useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value]);

  return (
    <Component
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={classes}
      data-placeholder={!value ? placeholder : undefined}
      style={!value ? {
        position: 'relative'
      } : undefined}
    >
      {value}
    </Component>
  );
};

// ============================================================================
// EDITABLE IMAGE COMPONENT
// ============================================================================

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (file: File) => void;
  onAltChange?: (alt: string) => void;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onChange,
  onAltChange,
  className = '',
  width,
  height,
  objectFit = 'cover'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);

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
      'transition-all duration-200',
      className
    ].filter(Boolean).join(' ');
  }, [objectFit, className]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={classes}
      />
      
      {/* Overlay on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
          <div className="text-white text-center">
            <svg 
              className="w-12 h-12 mx-auto mb-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm font-medium">Click to change image</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

// ============================================================================
// EDITABLE BUTTON COMPONENT
// ============================================================================

interface EditableButtonProps {
  text: string;
  href: string;
  onTextChange: (text: string) => void;
  onHrefChange: (href: string) => void;
  style?: ButtonStyle;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const EditableButton: React.FC<EditableButtonProps> = ({
  text,
  href,
  onTextChange,
  onHrefChange,
  style,
  className = '',
  variant = 'primary',
  size = 'md'
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedText, setEditedText] = React.useState(text);
  const [editedHref, setEditedHref] = React.useState(href);

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
      'cursor-pointer',
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

  const handleSave = () => {
    onTextChange(editedText);
    onHrefChange(editedHref);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="inline-flex flex-col gap-2 p-4 bg-white border-2 border-blue-500 rounded-lg shadow-lg">
        <input
          type="text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          placeholder="Button text"
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <input
          type="text"
          value={editedHref}
          onChange={(e) => setEditedHref(e.target.value)}
          placeholder="Button link (URL)"
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditedText(text);
              setEditedHref(href);
              setIsEditing(false);
            }}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="inline-block relative group"
      onClick={() => setIsEditing(true)}
    >
      <div className={finalClasses}>
        {text}
      </div>
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
        Edit
      </div>
    </div>
  );
};

// ============================================================================
// SECTION CONTROLS (Move, Delete, Duplicate)
// ============================================================================

interface SectionControlsProps {
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export const SectionControls: React.FC<SectionControlsProps> = ({
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  canMoveUp = true,
  canMoveDown = true
}) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      {onMoveUp && (
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Move section up"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {onMoveDown && (
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Move section down"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {onDuplicate && (
        <button
          onClick={onDuplicate}
          className="p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          title="Duplicate section"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 text-red-600"
          title="Delete section"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
};
