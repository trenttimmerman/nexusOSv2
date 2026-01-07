
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Play, Star, Upload, Image as ImageIcon, Wand2, Loader2, Sparkles, Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Palette, Minus, Plus, Check, Package } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface TextStyles {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  letterSpacing?: string;
  lineHeight?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  image_url?: string;
}

interface HeroProps {
  storeName: string;
  primaryColor: string;
  products?: Product[];
  data?: {
    heading?: string;
    heading_style?: TextStyles;
    subheading?: string;
    subheading_style?: TextStyles;
    image?: string;
    buttonText?: string;
    button_style?: TextStyles;
    showFeaturedProduct?: boolean;
    featuredProductId?: string;
    featuredProductPosition?: 'left' | 'center' | 'right';
    showProductPrice?: boolean;
    style?: {
      backgroundColor?: string;
      textColor?: string;
      padding?: 's' | 'm' | 'l' | 'xl' | 'none';
      alignment?: 'left' | 'center' | 'right';
      fullWidth?: boolean;
    };
    [key: string]: any;
  };
  isEditable?: boolean;
  onUpdate?: (data: any) => void;
  onSelectField?: (field: string) => void;
  onEditBlock?: (blockId: string) => void;
  blockId?: string;
}

export const HERO_FIELDS: Record<string, string[]> = {
  impact: [
    'heading', 'badge', 'buttonText', 'buttonLink', 'secondaryButtonText', 'secondaryButtonLink', 
    'image', 'overlayOpacity', 'backgroundColor', 'textColor', 'alignment', 'padding', 'animation',
    'showFeaturedProduct', 'featuredProductId', 'featuredProductPosition', 'showProductPrice'
  ],
  split: [
    'heading', 'subheading', 'buttonText', 'buttonLink', 'image', 'overlayOpacity', 'contentPosition', 'animation',
    'showFeaturedProduct', 'featuredProductId', 'featuredProductPosition', 'showProductPrice'
  ],
  kinetik: [
    'heading', 'buttonText', 'buttonLink', 'marqueeText', 'image', 'overlayOpacity', 'accentColor', 'animation',
    'showFeaturedProduct', 'featuredProductId', 'featuredProductPosition', 'showProductPrice'
  ],
  grid: [
    'heading', 'subheading', 'buttonText', 'buttonLink', 'secondaryButtonText', 'secondaryButtonLink', 
    'imageBadge', 'featureCardTitle', 'featureCardSubtitle', 'featureCardColor', 'image', 'sideImage', 'overlayOpacity', 'animation',
    'showFeaturedProduct', 'featuredProductId', 'featuredProductPosition', 'showProductPrice'
  ],
  typographic: [
    'heading', 'subheading', 'topBadge', 
    'link1Label', 'link1Href', 'link1Image',
    'link2Label', 'link2Href', 'link2Image',
    'link3Label', 'link3Href', 'link3Image',
    'backgroundColor', 'textColor', 'animation',
    'showFeaturedProduct', 'featuredProductId', 'featuredProductPosition', 'showProductPrice'
  ]
};

// --- EDITABLE HELPERS ---

export const EditableText: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onStyleChange?: (style: TextStyles) => void;
  style?: TextStyles;
  isEditable?: boolean;
  className?: string;
  tagName?: 'h1' | 'h2' | 'p' | 'span' | 'div';
  placeholder?: string;
  elementId?: string;
  onSelect?: () => void;
}> = ({ value, onChange, onStyleChange, style, isEditable, className, tagName = 'p', placeholder, elementId, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [tempValue, isEditing]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isEditing) {
          setIsEditing(false);
          onChange(tempValue);
        }
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, tempValue, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      onChange(tempValue);
    }
  };

  if (isEditing && isEditable) {
    return (
      <div ref={containerRef} className="relative inline-block w-full group/editor z-50">
        <textarea
            id={elementId}
            ref={textareaRef}
            autoFocus
            value={tempValue}
            onChange={(e) => {
              setTempValue(e.target.value);
              onChange(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            className={`${className} bg-transparent outline-none resize-none overflow-hidden min-h-[1.2em] w-full selection:bg-blue-500/30 shadow-[0_0_0_4px_rgba(59,130,246,0.5),0_0_30px_rgba(59,130,246,0.6)] rounded px-1 -mx-1 relative z-50`}
            style={{ 
              height: 'auto',
              fontSize: style?.fontSize,
              fontWeight: style?.fontWeight,
              color: style?.color,
              textAlign: style?.textAlign,
              fontFamily: style?.fontFamily,
              textTransform: style?.textTransform,
              letterSpacing: style?.letterSpacing,
              lineHeight: style?.lineHeight,
              whiteSpace: 'pre-wrap'
            }}
            rows={1}
        />
      </div>
    );
  }

  const Tag = tagName as any;
  
  return (
    <Tag 
      id={elementId}
      tabIndex={isEditable ? 0 : undefined}
      onClick={(e: React.MouseEvent) => {
        if (isEditable) {
            e.stopPropagation();
            setIsEditing(true);
            onSelect?.();
        }
      }}
      className={`${className} ${isEditable ? 'cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-500/50 focus:outline-none focus:shadow-[0_0_0_4px_rgba(59,130,246,0.5),0_0_30px_rgba(59,130,246,0.6)] focus:z-50 rounded px-1 -mx-1 transition-all relative group/edit' : ''}`}
      style={{
        fontSize: style?.fontSize,
        fontWeight: style?.fontWeight,
        color: style?.color,
        textAlign: style?.textAlign,
        fontFamily: style?.fontFamily,
        textTransform: style?.textTransform,
        letterSpacing: style?.letterSpacing,
        lineHeight: style?.lineHeight
      }}
    >
      {value || <span className="opacity-50 italic">{placeholder}</span>}
    </Tag>
  );
};
export const EditableImage: React.FC<{
  src: string;
  onChange: (src: string) => void;
  isEditable?: boolean;
  className?: string;
  alt?: string;
  overlayOpacity?: number;
  onOverlayOpacityChange?: (val: number) => void;
  elementId?: string;
  onSelect?: () => void;
}> = ({ src, onChange, isEditable, className, alt, overlayOpacity = 0, onOverlayOpacityChange, elementId, onSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `hero_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        // Fallback to local URL if upload fails
        const localUrl = URL.createObjectURL(file);
        onChange(localUrl);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      console.log('[EditableImage] Uploaded to:', publicUrl);
      onChange(publicUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      // Fallback to local URL
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      id={elementId} 
      tabIndex={isEditable ? 0 : undefined}
      onClick={(e) => {
        if (isEditable) {
          e.stopPropagation();
          onSelect?.();
        }
      }}
      className={`relative group ${className} ${isEditable ? 'focus:outline-none focus:shadow-[0_0_0_4px_rgba(59,130,246,0.5),0_0_30px_rgba(59,130,246,0.6)] focus:z-50 rounded-lg transition-all duration-300' : ''}`}
    >
      {/* Upload loading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
          <div className="flex flex-col items-center gap-2 text-white">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        </div>
      )}
      {src ? (
        <>
          <img src={src} className="w-full h-full object-cover" alt={alt} />
          {overlayOpacity > 0 && (
            <div 
              className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
              style={{ opacity: overlayOpacity }}
            />
          )}
          {isEditable && !isUploading && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-lg"
                title="Replace Image"
              >
                <ImageIcon size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
          <ImageIcon size={24} />
          {isEditable && (
            <button 
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>
      )}
    </div>
  );
}

// Featured Product Overlay Component
const FeaturedProductOverlay: React.FC<{
  products?: Product[];
  productId?: string;
  position?: 'left' | 'center' | 'right';
  showPrice?: boolean;
  primaryColor?: string;
}> = ({ products, productId, position = 'right', showPrice = true, primaryColor = '#3B82F6' }) => {
  if (!productId || !products || products.length === 0) return null;
  
  const product = products.find(p => p.id === productId);
  if (!product) return null;
  
  // Get the primary image - handle both array and JSONB formats from database
  const imagesArray = Array.isArray(product.images) ? product.images : [];
  const productImage = imagesArray.find(img => img?.isPrimary)?.url 
    || imagesArray[0]?.url 
    || product.image 
    || '';
  
  // Debug: log to see what we're getting
  console.log('[FeaturedProduct] Product:', product.name, 'image:', product.image, 'images:', product.images, 'resolved:', productImage);
  
  const positionClasses = {
    left: 'left-6 md:left-12',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-6 md:right-12'
  };
  
  return (
    <a 
      href={`/product/${product.id}`}
      className={`absolute bottom-6 md:bottom-12 ${positionClasses[position]} z-20 group cursor-pointer`}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-3 max-w-[280px]">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 flex items-center justify-center">
          {productImage ? (
            <img src={productImage} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package size={24} className="text-neutral-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-0.5">Featured</p>
          <p className="text-sm font-bold text-neutral-900 truncate">{product.name}</p>
          {showPrice && (
            <p className="text-sm font-bold" style={{ color: primaryColor }}>
              ${product.price?.toFixed(2)}
            </p>
          )}
        </div>
        <ArrowRight size={16} className="text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </a>
  );
};

// ------------------------

// 1. Impact (Classic, Full Screen, Centered)
export const HeroImpact: React.FC<HeroProps> = ({ storeName, primaryColor, data, isEditable, onUpdate, blockId, onSelectField, onEditBlock, products }) => {
  const heading = data?.heading || "REDEFINE REALITY";
  const image = data?.image || "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2940&auto=format&fit=crop";
  const buttonText = data?.buttonText || "Shop The Drop";
  const badge = data?.badge || "New Collection 2024";
  const secondaryButtonText = data?.secondaryButtonText || "View Lookbook";
  
  const style = data?.style || {};
  const bgColor = style.backgroundColor || 'black';
  const textColor = style.textColor || 'white';
  const alignment = style.alignment || 'center';
  const padding = style.padding === 'none' ? 'py-0' : style.padding === 's' ? 'py-12' : style.padding === 'l' ? 'py-32' : style.padding === 'xl' ? 'py-40' : 'py-24';
  const overlayOpacity = data?.overlayOpacity !== undefined ? data.overlayOpacity : 0.3;
  const animation = data?.animation || 'fade';
  const animClass = animation === 'fade' ? 'animate-in fade-in duration-1000' :
    animation === 'slide' ? 'animate-in slide-in-from-bottom-8 duration-1000' :
    animation === 'zoom' ? 'animate-in zoom-in-95 duration-1000' : '';

  const handleSelect = (field: string) => {
    if (isEditable) {
      onEditBlock?.(blockId || '');
      onSelectField?.(field);
    }
  };

  return (
    <section 
      className={`relative w-full min-h-[90vh] overflow-hidden flex items-center justify-center group/hero ${padding}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="absolute inset-0">
        <EditableImage 
            elementId={`editable-${blockId}-image`}
            src={image} 
            onChange={(val) => onUpdate && onUpdate({ image: val })} 
            isEditable={isEditable}
            className="w-full h-full"
            overlayOpacity={overlayOpacity}
            onOverlayOpacityChange={(val) => onUpdate && onUpdate({ overlayOpacity: val })}
            onSelect={() => handleSelect('image')}
        />
        {/* Removed hardcoded gradient to allow user controlled overlay */}
      </div>
      
      <div className={`relative z-10 px-6 max-w-4xl mx-auto flex flex-col ${alignment === 'left' ? 'items-start text-left' : alignment === 'right' ? 'items-end text-right' : 'items-center text-center'} ${animClass}`}>
        <div className="mb-6">
           <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase border border-white/30 backdrop-blur-md rounded-full" style={{ color: textColor, borderColor: textColor }}>
            <EditableText 
               elementId={`editable-${blockId}-badge`}
               tagName="span" 
               value={badge} 
               onChange={(val) => onUpdate && onUpdate({ badge: val })} 
               onStyleChange={(style) => onUpdate && onUpdate({ badge_style: style })}
               style={data?.badge_style}
               isEditable={isEditable} 
               placeholder="Badge Text"
               onSelect={() => handleSelect('badge')}
            />
          </span>
        </div>
        <div className="text-6xl md:text-9xl font-black mb-8 leading-none tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 uppercase" style={{ color: textColor }}>
          <EditableText 
             elementId={`editable-${blockId}-heading`}
             tagName="h1" 
             value={heading} 
             onChange={(val) => onUpdate && onUpdate({ heading: val })} 
             onStyleChange={(style) => onUpdate && onUpdate({ heading_style: style })}
             style={data?.heading_style}
             isEditable={isEditable} 
             placeholder="Enter Headline"
             onSelect={() => handleSelect('heading')}
          />
        </div>
        <div className={`flex flex-col md:flex-row gap-4 ${alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center'} items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300`}>
          <button 
            onClick={() => {
              if (isEditable) return;
              const link = data?.buttonLink === 'external' ? data?.buttonExternalUrl : data?.buttonLink;
              if (link) window.location.href = link;
            }}
            className="px-8 py-4 bg-white text-black font-bold tracking-wide rounded-full hover:scale-105 transition-transform flex items-center gap-2"
          >
             <EditableText 
                 elementId={`editable-${blockId}-buttonText`}
                 tagName="span"
                 value={buttonText}
                 onChange={(val) => onUpdate && onUpdate({ buttonText: val })}
                 onStyleChange={(style) => onUpdate && onUpdate({ button_style: style })}
                 style={data?.button_style}
                 isEditable={isEditable}
                 placeholder="Button Text"
                 onSelect={() => handleSelect('buttonText')}
             />
             <ArrowRight size={18} />
          </button>
          {secondaryButtonText && (
            <button 
              onClick={() => {
                if (isEditable) return;
                const link = data?.secondaryButtonLink === 'external' ? data?.secondaryButtonExternalUrl : data?.secondaryButtonLink;
                if (link) window.location.href = link;
              }}
              className="px-8 py-4 bg-transparent border border-white/30 hover:bg-white/10 font-bold tracking-wide rounded-full transition-colors backdrop-blur-sm" 
              style={{ color: textColor, borderColor: textColor }}
            >
               <EditableText 
                   elementId={`editable-${blockId}-secondaryButtonText`}
                   tagName="span"
                   value={secondaryButtonText}
                   onChange={(val) => onUpdate && onUpdate({ secondaryButtonText: val })}
                   onStyleChange={(style) => onUpdate && onUpdate({ secondary_button_style: style })}
                   style={data?.secondary_button_style}
                   isEditable={isEditable}
                   placeholder="Secondary Button"
                   onSelect={() => handleSelect('secondaryButtonText')}
               />
            </button>
          )}
        </div>
      </div>
      
      {/* Featured Product Overlay */}
      {data?.showFeaturedProduct && (
        <FeaturedProductOverlay
          products={products}
          productId={data.featuredProductId}
          position={data.featuredProductPosition}
          showPrice={data.showProductPrice !== false}
          primaryColor={primaryColor}
        />
      )}
    </section>
  );
};// 2. Split (Modern 50/50)
export const HeroSplit: React.FC<HeroProps> = ({ storeName, primaryColor, data, isEditable, onUpdate, blockId, onSelectField, onEditBlock, products }) => {
  const heading = data?.heading || storeName;
  const subheading = data?.subheading || "Elevating the standard of modern living through curated design.";
  const image = data?.image || "https://images.unsplash.com/photo-1529139574466-a302c27e3844?q=80&w=2070&auto=format&fit=crop";
  const buttonText = data?.buttonText || "Explore Collection";
  const overlayOpacity = data?.overlayOpacity !== undefined ? data.overlayOpacity : 0;
  const contentPosition = data?.contentPosition || 'left';
  const animation = data?.animation || 'fade';
  const animClass = animation === 'fade' ? 'animate-in fade-in duration-1000' :
    animation === 'slide' ? 'animate-in slide-in-from-bottom-8 duration-1000' :
    animation === 'zoom' ? 'animate-in zoom-in-95 duration-1000' : '';

  const handleSelect = (field: string) => {
    if (isEditable) {
      onEditBlock?.(blockId || '');
      onSelectField?.(field);
    }
  };

  return (
    <section className={`w-full min-h-[80vh] flex flex-col ${contentPosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white`}>
       <div className={`w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center items-start border-b md:border-b-0 ${contentPosition === 'right' ? 'md:border-l' : 'md:border-r'} border-neutral-200 ${animClass}`}>
          <div className="mb-8">
             <div className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-6 text-neutral-900">
                <EditableText 
                 tagName="h1" 
                 value={heading} 
                 onChange={(val) => onUpdate && onUpdate({ heading: val })} 
                 onStyleChange={(style) => onUpdate && onUpdate({ heading_style: style })}
                 style={data?.heading_style}
                 isEditable={isEditable} 
                 elementId={blockId ? `editable-${blockId}-heading` : undefined}
                 onSelect={() => handleSelect('heading')}
               />
             </div>
             <div className="text-xl text-neutral-500 max-w-md leading-relaxed">
                <EditableText 
                 tagName="p" 
                 value={subheading} 
                 onChange={(val) => onUpdate && onUpdate({ subheading: val })} 
                 onStyleChange={(style) => onUpdate && onUpdate({ subheading_style: style })}
                 style={data?.subheading_style}
                 isEditable={isEditable} 
                 elementId={blockId ? `editable-${blockId}-subheading` : undefined}
                 onSelect={() => handleSelect('subheading')}
               />
             </div>
          </div>
          <button 
            onClick={() => {
              if (isEditable) return;
              const link = data?.buttonLink === 'external' ? data?.buttonExternalUrl : data?.buttonLink;
              if (link) window.location.href = link;
            }}
            className="group flex items-center gap-3 text-lg font-medium text-black border-b-2 border-black pb-1 hover:gap-5 transition-all"
          >
             <EditableText 
                 tagName="span"
                 value={buttonText}
                 onChange={(val) => onUpdate && onUpdate({ buttonText: val })}
                 onStyleChange={(style) => onUpdate && onUpdate({ button_style: style })}
                 style={data?.button_style}
                 isEditable={isEditable}
                 elementId={blockId ? `editable-${blockId}-buttonText` : undefined}
                 onSelect={() => handleSelect('buttonText')}
             />
             <ArrowRight size={20} />
          </button>
       </div>
       <div className="w-full md:w-1/2 relative overflow-hidden group">
          <EditableImage 
             src={image} 
             onChange={(val) => onUpdate && onUpdate({ image: val })} 
             isEditable={isEditable}
             className="w-full h-full"
             overlayOpacity={overlayOpacity}
             onOverlayOpacityChange={(val) => onUpdate && onUpdate({ overlayOpacity: val })}
             elementId={blockId ? `editable-${blockId}-image` : undefined}
             onSelect={() => handleSelect('image')}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
          
          {/* Featured Product Overlay */}
          {data?.showFeaturedProduct && (
            <FeaturedProductOverlay
              products={products}
              productId={data.featuredProductId}
              position={data.featuredProductPosition}
              showPrice={data.showProductPrice !== false}
              primaryColor={primaryColor}
            />
          )}
       </div>
    </section>
  );
};

// 3. Kinetik (High Energy, Streetwear)
export const HeroKinetik: React.FC<HeroProps> = ({ storeName, primaryColor, data, isEditable, onUpdate, blockId, onSelectField, onEditBlock, products }) => {
  const heading = data?.heading || "NEXUS";
  const image = data?.image || "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop";
  const buttonText = data?.buttonText || "Shop Collection 01";
  const marqueeText = data?.marqueeText || "LIMITED DROP • DO NOT SLEEP • WORLDWIDE SHIPPING • SECURE CHECKOUT • NEXUS OS • LIMITED DROP • DO NOT SLEEP •";
  const overlayOpacity = data?.overlayOpacity !== undefined ? data.overlayOpacity : 0;
  const accentColor = data?.accentColor || '#ccff00';
  const animation = data?.animation || 'none';
  const animClass = animation === 'fade' ? 'animate-in fade-in duration-1000' :
    animation === 'slide' ? 'animate-in slide-in-from-bottom-8 duration-1000' :
    animation === 'zoom' ? 'animate-in zoom-in-95 duration-1000' : '';

  const handleSelect = (field: string) => {
    if (isEditable) {
      onEditBlock?.(blockId || '');
      onSelectField?.(field);
    }
  };

  return (
    <section className={`relative w-full h-[85vh] overflow-hidden flex flex-col border-b-4 border-black ${animClass}`} style={{ backgroundColor: accentColor }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="grid grid-cols-12 h-full w-full">
            {[...Array(12)].map((_, i) => <div key={i} className="border-r border-black h-full"></div>)}
         </div>
      </div>

      {/* Top Marquee */}
      <div className="bg-black text-white py-2 border-b-4 border-black overflow-hidden whitespace-nowrap rotate-1 absolute top-12 left-[-10%] w-[120%] z-20 shadow-xl pointer-events-auto">
         <div className="animate-marquee inline-block font-mono font-bold text-xl">
            <EditableText 
                 tagName="span"
                 value={marqueeText}
                 onChange={(val) => onUpdate && onUpdate({ marqueeText: val })}
                 onStyleChange={(style) => onUpdate && onUpdate({ marqueeText_style: style })}
                 style={data?.marqueeText_style}
                 isEditable={isEditable}
                 elementId={blockId ? `editable-${blockId}-marqueeText` : undefined}
                 onSelect={() => handleSelect('marqueeText')}
             />
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
         <div className="text-[12vw] font-black leading-none tracking-tighter text-black mix-blend-multiply text-center uppercase relative z-20 pointer-events-none md:pointer-events-auto">
            <EditableText 
             tagName="h1" 
             value={heading} 
             onChange={(val) => onUpdate && onUpdate({ heading: val })} 
             onStyleChange={(style) => onUpdate && onUpdate({ heading_style: style })}
             style={data?.heading_style}
             isEditable={isEditable} 
             className="block"
             elementId={blockId ? `editable-${blockId}-heading` : undefined}
             onSelect={() => handleSelect('heading')}
           />
         </div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[450px] md:h-[600px] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-[-4deg] hover:rotate-0 transition-transform duration-500 z-10">
            <EditableImage 
                src={image} 
                onChange={(val) => onUpdate && onUpdate({ image: val })} 
                isEditable={isEditable}
                className="w-full h-full"
                overlayOpacity={overlayOpacity}
                onOverlayOpacityChange={(val) => onUpdate && onUpdate({ overlayOpacity: val })}
                elementId={blockId ? `editable-${blockId}-image` : undefined}
                onSelect={() => handleSelect('image')}
            />
         </div>
      </div>

      <div className="absolute bottom-12 left-0 w-full flex justify-center z-30">
         <button 
            onClick={() => {
              if (isEditable) return;
              const link = data?.buttonLink === 'external' ? data?.buttonExternalUrl : data?.buttonLink;
              if (link) window.location.href = link;
            }}
            className="bg-black text-xl font-black uppercase italic px-12 py-4 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all border-2 border-white" style={{ color: accentColor }}
         >
            <EditableText 
                 tagName="span"
                 value={buttonText}
                 onChange={(val) => onUpdate && onUpdate({ buttonText: val })}
                 onStyleChange={(style) => onUpdate && onUpdate({ button_style: style })}
                 style={data?.button_style}
                 isEditable={isEditable}
                 elementId={blockId ? `editable-${blockId}-buttonText` : undefined}
                 onSelect={() => handleSelect('buttonText')}
             />
         </button>
      </div>

      {/* Featured Product Overlay */}
      {data?.showFeaturedProduct && (
        <FeaturedProductOverlay
          products={products}
          productId={data.featuredProductId}
          position={data.featuredProductPosition}
          showPrice={data.showProductPrice !== false}
          primaryColor={primaryColor}
        />
      )}
    </section>
  );
};

// 4. Grid (Masonry, Lifestyle, Collage)
export const HeroGrid: React.FC<HeroProps> = ({ storeName, primaryColor, data, isEditable, onUpdate, blockId, onSelectField, onEditBlock, products }) => {
  const heading = data?.heading || storeName;
  const subheading = data?.subheading || "Curating the finest digital and physical goods for the forward-thinking creator.";
  const image = data?.image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop";
  const buttonText = data?.buttonText || "Shop All Products";
  const secondaryButtonText = data?.secondaryButtonText || "Read Our Story";
  const imageBadge = data?.imageBadge || "FW24 Lookbook";
  const featureCardTitle = data?.featureCardTitle || "-20%";
  const featureCardSubtitle = data?.featureCardSubtitle || "On all Accessories";
  const overlayOpacity = data?.overlayOpacity !== undefined ? data.overlayOpacity : 0;
  const featureCardColor = data?.featureCardColor || '#FF5F56';
  const animation = data?.animation || 'fade';
  const animClass = animation === 'fade' ? 'animate-in fade-in duration-1000' :
    animation === 'slide' ? 'animate-in slide-in-from-bottom-8 duration-1000' :
    animation === 'zoom' ? 'animate-in zoom-in-95 duration-1000' : '';

  const handleSelect = (field: string) => {
    if (isEditable) {
      onEditBlock?.(blockId || '');
      onSelectField?.(field);
    }
  };

  return (
    <section className={`w-full min-h-screen bg-neutral-50 p-4 pt-8 relative ${animClass}`}>
       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[85vh]">
          {/* Main Text Block */}
          <div className="md:col-span-4 bg-white rounded-3xl p-8 flex flex-col justify-between shadow-sm">
             <div>
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white mb-6">
                   <ArrowRight className="-rotate-45" />
                </div>
                <div className="text-5xl font-bold tracking-tight mb-4">
                     <EditableText 
                     tagName="h1" 
                     value={heading} 
                     onChange={(val) => onUpdate && onUpdate({ heading: val })} 
                     onStyleChange={(style) => onUpdate && onUpdate({ heading_style: style })}
                     style={data?.heading_style}
                     isEditable={isEditable} 
                     elementId={blockId ? `editable-${blockId}-heading` : undefined}
                     onSelect={() => handleSelect('heading')}
                   />
                </div>
                <div className="text-neutral-500 font-medium">
                   <EditableText 
                     tagName="p" 
                     value={subheading} 
                     onChange={(val) => onUpdate && onUpdate({ subheading: val })} 
                     onStyleChange={(style) => onUpdate && onUpdate({ subheading_style: style })}
                     style={data?.subheading_style}
                     isEditable={isEditable} 
                     elementId={blockId ? `editable-${blockId}-subheading` : undefined}
                     onSelect={() => handleSelect('subheading')}
                   />
                </div>
             </div>
             <div className="space-y-2">
                <button 
                  onClick={() => {
                    if (isEditable) return;
                    const link = data?.buttonLink === 'external' ? data?.buttonExternalUrl : data?.buttonLink;
                    if (link) window.location.href = link;
                  }}
                  className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
                >
                   <EditableText 
                     tagName="span"
                     value={buttonText}
                     onChange={(val) => onUpdate && onUpdate({ buttonText: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ button_style: style })}
                     style={data?.button_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-buttonText` : undefined}
                     onSelect={() => handleSelect('buttonText')}
                   />
                </button>
                <button 
                  onClick={() => {
                    if (isEditable) return;
                    const link = data?.secondaryButtonLink === 'external' ? data?.secondaryButtonExternalUrl : data?.secondaryButtonLink;
                    if (link) window.location.href = link;
                  }}
                  className="w-full py-4 bg-neutral-100 text-black rounded-xl font-bold hover:bg-neutral-200 transition-colors"
                >
                   <EditableText 
                     tagName="span"
                     value={secondaryButtonText}
                     onChange={(val) => onUpdate && onUpdate({ secondaryButtonText: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ secondary_button_style: style })}
                     style={data?.secondary_button_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-secondaryButtonText` : undefined}
                     onSelect={() => handleSelect('secondaryButtonText')}
                   />
                </button>
             </div>
          </div>

          {/* Large Image */}
          <div className="md:col-span-5 relative group overflow-hidden rounded-3xl">
             <EditableImage 
                src={image} 
                onChange={(val) => onUpdate && onUpdate({ image: val })} 
                isEditable={isEditable}
                className="w-full h-full"
                overlayOpacity={overlayOpacity}
                onOverlayOpacityChange={(val) => onUpdate && onUpdate({ overlayOpacity: val })}
                elementId={blockId ? `editable-${blockId}-image` : undefined}
                onSelect={() => handleSelect('image')}
            />
             <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold pointer-events-none md:pointer-events-auto">
                <EditableText 
                     tagName="span"
                     value={imageBadge}
                     onChange={(val) => onUpdate && onUpdate({ imageBadge: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ imageBadge_style: style })}
                     style={data?.imageBadge_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-imageBadge` : undefined}
                     onSelect={() => handleSelect('imageBadge')}
                   />
             </div>
          </div>

          {/* Stacked Images */}
          <div className="md:col-span-3 flex flex-col gap-4">
             <div className="flex-1 relative rounded-3xl overflow-hidden group">
                <EditableImage 
                   src={data?.sideImage || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"}
                   onChange={(val) => onUpdate && onUpdate({ sideImage: val })}
                   isEditable={isEditable}
                   className="w-full h-full"
                   elementId={blockId ? `editable-${blockId}-sideImage` : undefined}
                   onSelect={() => handleSelect('sideImage')}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none"></div>
             </div>
             <div className="h-48 rounded-3xl p-6 text-white flex flex-col justify-center relative overflow-hidden group cursor-pointer" style={{ backgroundColor: featureCardColor }}>
                <div className="relative z-10 text-4xl font-black mb-1">
                    <EditableText 
                     tagName="span"
                     value={featureCardTitle}
                     onChange={(val) => onUpdate && onUpdate({ featureCardTitle: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ featureCardTitle_style: style })}
                     style={data?.featureCardTitle_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-featureCardTitle` : undefined}
                     onSelect={() => handleSelect('featureCardTitle')}
                   />
                </div>
                <div className="relative z-10 font-medium opacity-80">
                    <EditableText 
                     tagName="span"
                     value={featureCardSubtitle}
                     onChange={(val) => onUpdate && onUpdate({ featureCardSubtitle: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ featureCardSubtitle_style: style })}
                     style={data?.featureCardSubtitle_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-featureCardSubtitle` : undefined}
                     onSelect={() => handleSelect('featureCardSubtitle')}
                   />
                </div>
                <ArrowRight className="absolute bottom-6 right-6 z-10 group-hover:translate-x-2 transition-transform" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
             </div>
          </div>
       </div>

      {/* Featured Product Overlay */}
      {data?.showFeaturedProduct && (
        <FeaturedProductOverlay
          products={products}
          productId={data.featuredProductId}
          position={data.featuredProductPosition}
          showPrice={data.showProductPrice !== false}
          primaryColor={primaryColor}
        />
      )}
    </section>
  );
};

// 5. Typographic (Text First, Minimal)
export const HeroTypographic: React.FC<HeroProps> = ({ 
  storeName, 
  primaryColor, 
  data, 
  isEditable, 
  onUpdate, 
  blockId, 
  onSelectField, 
  onEditBlock,
  products 
}) => {
  const heading = data?.heading || "We Build The Future Of Commerce";
  const subheading = data?.subheading || "Discover a collection inspired by the intersection of technology, fashion, and utility. Designed in Tokyo, worn worldwide.";
  const topBadge = data?.topBadge || "New Arrivals";
  const link1Label = data?.link1Label || "Shop Apparel";
  const link2Label = data?.link2Label || "Shop Tech";
  const link3Label = data?.link3Label || "Shop Footwear";
  const bgColor = data?.style?.backgroundColor || '#ffffff';
  const textColor = data?.style?.textColor || '#000000';
  const animation = data?.animation || 'fade';

  const handleSelect = (field: string) => {
    if (isEditable) {
      onEditBlock?.(blockId || '');
      onSelectField?.(field);
    }
  };

  const animClass = animation === 'fade' ? 'animate-in fade-in duration-1000' :
    animation === 'slide' ? 'animate-in slide-in-from-bottom-8 duration-1000' :
    animation === 'zoom' ? 'animate-in zoom-in-95 duration-1000' : '';
  
  return (
    <section className={`relative w-full min-h-[80vh] flex flex-col items-center justify-center py-20 ${animClass}`} style={{ backgroundColor: bgColor, color: textColor }}>
       <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
             <Star size={12} style={{ color: textColor, opacity: 0.4 }} />
             <span className="text-xs font-medium uppercase tracking-[0.3em]" style={{ color: textColor, opacity: 0.4 }}>
                 <EditableText 
                     tagName="span"
                     value={topBadge}
                     onChange={(val) => onUpdate && onUpdate({ topBadge: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ topBadge_style: style })}
                     style={data?.topBadge_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-topBadge` : undefined}
                     onSelect={() => handleSelect('topBadge')}
                   />
             </span>
             <Star size={12} style={{ color: textColor, opacity: 0.4 }} />
          </div>
          
          <div className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
             <EditableText 
                 tagName="h1" 
                 value={heading} 
                 onChange={(val) => onUpdate && onUpdate({ heading: val })} 
                 onStyleChange={(style) => onUpdate && onUpdate({ heading_style: style })}
                 style={data?.heading_style}
                 isEditable={isEditable} 
                 elementId={blockId ? `editable-${blockId}-heading` : undefined}
                 onSelect={() => handleSelect('heading')}
             />
          </div>

          <div className="max-w-xl mx-auto text-lg mb-12" style={{ color: textColor, opacity: 0.5 }}>
             <EditableText 
                 tagName="p" 
                 value={subheading} 
                 onChange={(val) => onUpdate && onUpdate({ subheading: val })} 
                 onStyleChange={(style) => onUpdate && onUpdate({ subheading_style: style })}
                 style={data?.subheading_style}
                 isEditable={isEditable} 
                 elementId={blockId ? `editable-${blockId}-subheading` : undefined}
                 onSelect={() => handleSelect('subheading')}
             />
          </div>

          <div className="flex justify-center gap-6">
             <div 
                onClick={() => {
                  if (isEditable) {
                    handleSelect('link1Label');
                    return;
                  }
                  const link = data?.link1Href === 'external' ? data?.link1ExternalUrl : data?.link1Href;
                  if (link) window.location.href = link;
                }}
                className="group flex flex-col items-center gap-2 cursor-pointer"
             >
                <div className="w-48 h-64 rounded-lg overflow-hidden mb-2 relative" style={{ backgroundColor: textColor === '#ffffff' ? '#333' : '#f5f5f5' }}>
                   <EditableImage 
                      src={data?.link1Image || "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop"}
                      onChange={(val) => onUpdate && onUpdate({ link1Image: val })}
                      isEditable={isEditable}
                      className="w-full h-full"
                      elementId={blockId ? `editable-${blockId}-link1Image` : undefined}
                      onSelect={() => handleSelect('link1Image')}
                   />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                </div>
                <div className="text-sm font-bold pb-0.5" style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: textColor }}>
                    <EditableText 
                     tagName="span"
                     value={link1Label}
                     onChange={(val) => onUpdate && onUpdate({ link1Label: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ link1Label_style: style })}
                     style={data?.link1Label_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-link1Label` : undefined}
                     onSelect={() => handleSelect('link1Label')}
                   />
                </div>
             </div>
             <div 
                onClick={() => {
                  if (isEditable) {
                    handleSelect('link2Label');
                    return;
                  }
                  const link = data?.link2Href === 'external' ? data?.link2ExternalUrl : data?.link2Href;
                  if (link) window.location.href = link;
                }}
                className="group flex flex-col items-center gap-2 mt-12 md:mt-24 cursor-pointer"
             >
                <div className="w-48 h-64 rounded-lg overflow-hidden mb-2 relative" style={{ backgroundColor: textColor === '#ffffff' ? '#333' : '#f5f5f5' }}>
                   <EditableImage 
                      src={data?.link2Image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"}
                      onChange={(val) => onUpdate && onUpdate({ link2Image: val })}
                      isEditable={isEditable}
                      className="w-full h-full"
                      elementId={blockId ? `editable-${blockId}-link2Image` : undefined}
                      onSelect={() => handleSelect('link2Image')}
                   />
                </div>
                <div className="text-sm font-bold pb-0.5" style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: textColor }}>
                    <EditableText 
                     tagName="span"
                     value={link2Label}
                     onChange={(val) => onUpdate && onUpdate({ link2Label: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ link2Label_style: style })}
                     style={data?.link2Label_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-link2Label` : undefined}
                     onSelect={() => handleSelect('link2Label')}
                   />
                </div>
             </div>
             <div 
                onClick={() => {
                  if (isEditable) {
                    handleSelect('link3Label');
                    return;
                  }
                  const link = data?.link3Href === 'external' ? data?.link3ExternalUrl : data?.link3Href;
                  if (link) window.location.href = link;
                }}
                className="group flex flex-col items-center gap-2 cursor-pointer"
             >
                <div className="w-48 h-64 rounded-lg overflow-hidden mb-2 relative" style={{ backgroundColor: textColor === '#ffffff' ? '#333' : '#f5f5f5' }}>
                   <EditableImage 
                      src={data?.link3Image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"}
                      onChange={(val) => onUpdate && onUpdate({ link3Image: val })}
                      isEditable={isEditable}
                      className="w-full h-full"
                      elementId={blockId ? `editable-${blockId}-link3Image` : undefined}
                      onSelect={() => handleSelect('link3Image')}
                   />
                </div>
                <div className="text-sm font-bold pb-0.5" style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: textColor }}>
                    <EditableText 
                     tagName="span"
                     value={link3Label}
                     onChange={(val) => onUpdate && onUpdate({ link3Label: val })}
                     onStyleChange={(style) => onUpdate && onUpdate({ link3Label_style: style })}
                     style={data?.link3Label_style}
                     isEditable={isEditable}
                     elementId={blockId ? `editable-${blockId}-link3Label` : undefined}
                     onSelect={() => handleSelect('link3Label')}
                   />
                </div>
             </div>
          </div>

          {/* Featured Product Overlay */}
          {data?.showFeaturedProduct && (
            <FeaturedProductOverlay
              products={products}
              productId={data.featuredProductId}
              position={data.featuredProductPosition}
              showPrice={data.showProductPrice !== false}
              primaryColor={primaryColor}
            />
          )}
       </div>
    </section>
  );
};

export const HERO_COMPONENTS = {
  impact: HeroImpact,
  split: HeroSplit,
  kinetik: HeroKinetik,
  grid: HeroGrid,
  typographic: HeroTypographic
};

export const HERO_OPTIONS = [
  { id: 'impact', name: 'Full Screen', description: 'Large image fills the screen - great for visual impact', date: '2024-01-10', popularity: 98, recommended: true },
  { id: 'split', name: 'Side by Side', description: 'Image on one side, text on other - balanced and professional', date: '2024-03-20', popularity: 85, recommended: true },
  { id: 'kinetik', name: 'Animated Banner', description: 'Eye-catching scrolling text effect', date: '2024-08-15', popularity: 90 },
  { id: 'grid', name: 'Image Collage', description: 'Multiple images in a grid layout', date: '2024-05-10', popularity: 75 },
  { id: 'typographic', name: 'Text Only', description: 'Bold text without images - minimal and clean', date: '2024-11-20', popularity: 60 }
];
