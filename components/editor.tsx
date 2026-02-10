// editor.tsx - Minimal editable components for Designer V3
import React from 'react';

interface EditableTextProps {
  tagName: string;
  value: string;
  onChange: (value: string) => void;
  onStyleChange?: (style: any) => void;
  style?: any;
  isEditable: boolean;
  onSelect?: () => void;
  className?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  tagName,
  value,
  onChange,
  isEditable,
  onSelect,
  className = '',
  style = {}
}) => {
  const Tag = tagName as keyof JSX.IntrinsicElements;
  
  if (!isEditable) {
    return React.createElement(Tag, { className, style }, value);
  }
  
  return React.createElement(Tag, {
    className,
    style,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: (e: React.FocusEvent<HTMLElement>) => onChange(e.currentTarget.textContent || ''),
    onClick: onSelect,
    children: value
  });
};

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (src: string) => void;
  isEditable: boolean;
  onSelect?: () => void;
  className?: string;
  style?: any;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onChange,
  isEditable,
  onSelect,
  className = '',
  style = {}
}) => {
  const handleClick = () => {
    if (isEditable && onSelect) {
      onSelect();
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onClick={handleClick}
    />
  );
};
