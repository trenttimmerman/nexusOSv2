
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Play, Star, Upload, Image as ImageIcon, Wand2, Loader2, Sparkles } from 'lucide-react';

interface HeroProps {
  storeName: string;
  primaryColor: string;
  data?: {
    heading?: string;
    subheading?: string;
    image?: string;
    buttonText?: string;
    [key: string]: any;
  };
  isEditable?: boolean;
  onUpdate?: (data: any) => void;
}

export const HERO_FIELDS: Record<string, string[]> = {
  impact: ['heading', 'image', 'buttonText', 'badge', 'secondaryButtonText'],
  split: ['heading', 'subheading', 'image', 'buttonText', 'topLabel', 'floatingCardTitle', 'floatingCardPrice'],
  kinetik: ['heading', 'image', 'buttonText', 'marqueeText'],
  grid: ['heading', 'subheading', 'image', 'buttonText', 'secondaryButtonText', 'imageBadge', 'featureCardTitle', 'featureCardSubtitle'],
  typographic: ['heading', 'subheading', 'topBadge', 'link1Label', 'link2Label', 'link3Label']
};

// --- EDITABLE HELPERS ---

const EditableText: React.FC<{
  value: string;
  onChange: (val: string) => void;
  isEditable?: boolean;
  className?: string;
  tagName?: 'h1' | 'h2' | 'p' | 'span' | 'div';
  placeholder?: string;
}> = ({ value, onChange, isEditable, className, tagName = 'p', placeholder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleBlur = () => {
    // Delay hiding to allow clicking the AI button
    setTimeout(() => {
      setIsEditing(false);
      onChange(tempValue);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  const handleAiGenerate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsGenerating(true);
    
    // Simulate AI
    setTimeout(() => {
      const suggestions = [
        "Elevate Your Digital Presence",
        "Crafted for the Modern Creator",
        "Unleash Your Potential",
        "Future-Ready Design",
        "Experience the Extraordinary"
      ];
      const random = suggestions[Math.floor(Math.random() * suggestions.length)];
      setTempValue(random);
      setIsGenerating(false);
    }, 1000);
  };

  if (isEditing && isEditable) {
    return (
      <div className="relative inline-block w-full">
        <textarea
            autoFocus
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white/20 outline-none ring-2 ring-blue-500 rounded px-1 resize-none overflow-hidden min-h-[1.2em] w-full`}
            style={{ height: 'auto' }}
            rows={tagName === 'p' ? 3 : 1}
        />
        <button 
          onMouseDown={handleAiGenerate} // Use onMouseDown to prevent blur
          className="absolute -top-8 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 hover:bg-blue-700 transition-colors shadow-lg z-50"
        >
          {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Wand2 size={10} />}
          AI Rewrite
        </button>
      </div>
    );
  }

  const Tag = tagName as any;
  
  return (
    <Tag 
      onClick={(e: React.MouseEvent) => {
        if (isEditable) {
            e.stopPropagation();
            setIsEditing(true);
        }
      }}
      className={`${className} ${isEditable ? 'cursor-text hover:outline-dashed hover:outline-2 hover:outline-blue-500/50 rounded px-1 -mx-1 transition-all relative group/edit' : ''}`}
    >
      {value || <span className="opacity-50 italic">{placeholder}</span>}
      {isEditable && !value && (
        <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover/edit:opacity-100 transition-opacity pointer-events-none">
          Edit Text
        </span>
      )}
    </Tag>
  );
};

const EditableImage: React.FC<{
  src: string;
  onChange: (src: string) => void;
  isEditable?: boolean;
  className?: string;
  alt?: string;
}> = ({ src, onChange, isEditable, className, alt }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomId = Math.floor(Math.random() * 1000);
      onChange(`https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop&random=${randomId}`);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className={`relative group ${className}`}>
      {src ? (
        <img src={src} className="w-full h-full object-cover" alt={alt} />
      ) : (
        <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400">
          <ImageIcon size={24} />
        </div>
      )}
      {isEditable && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
           <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-neutral-200 transition-colors shadow-lg transform hover:scale-105">
              <Upload size={14} /> Upload
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
           </label>
           <button 
             onClick={handleAiGenerate}
             className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-purple-700 transition-colors shadow-lg transform hover:scale-105"
           >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              AI Generate
           </button>
        </div>
      )}
    </div>
  );
}

// ------------------------

// 1. Impact (Classic, Full Screen, Centered)
export const HeroImpact: React.FC<HeroProps> = ({ storeName, data, isEditable, onUpdate }) => {
  const heading = data?.heading || "REDEFINE REALITY";
  const image = data?.image || "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2940&auto=format&fit=crop";
  const buttonText = data?.buttonText || "Shop The Drop";
  const badge = data?.badge || "New Collection 2024";
  const secondaryButtonText = data?.secondaryButtonText || "View Lookbook";

  return (
    <section className="relative w-full h-[90vh] bg-black overflow-hidden flex items-center justify-center group/hero">
      <div className="absolute inset-0">
        <EditableImage 
            src={image} 
            onChange={(val) => onUpdate && onUpdate({ image: val })} 
            isEditable={isEditable}
            className="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none"></div>
      </div>
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <span className="inline-block px-4 py-1.5 text-xs font-bold tracking-[0.2em] uppercase text-white border border-white/30 backdrop-blur-md rounded-full">
            <EditableText 
               tagName="span" 
               value={badge} 
               onChange={(val) => onUpdate && onUpdate({ badge: val })} 
               isEditable={isEditable} 
               placeholder="Badge Text"
            />
          </span>
        </div>
        <div className="text-6xl md:text-9xl font-black text-white mb-8 leading-none tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 uppercase">
          <EditableText 
             tagName="h1" 
             value={heading} 
             onChange={(val) => onUpdate && onUpdate({ heading: val })} 
             isEditable={isEditable} 
             placeholder="Enter Headline"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <button className="px-8 py-4 bg-white text-black font-bold tracking-wide rounded-full hover:scale-105 transition-transform flex items-center gap-2">
             <EditableText 
                 tagName="span"
                 value={buttonText}
                 onChange={(val) => onUpdate && onUpdate({ buttonText: val })}
                 isEditable={isEditable}
                 placeholder="Button Text"
             />
             <ArrowRight size={18} />
          </button>
          <button className="px-8 py-4 bg-transparent text-white border border-white/30 hover:bg-white/10 font-bold tracking-wide rounded-full transition-colors backdrop-blur-sm">
             <EditableText 
                 tagName="span"
                 value={secondaryButtonText}
                 onChange={(val) => onUpdate && onUpdate({ secondaryButtonText: val })}
                 isEditable={isEditable}
                 placeholder="Secondary Button"
             />
          </button>
        </div>
      </div>
    </section>
  );
};

// 2. Split (Modern, Editorial, 50/50)
export const HeroSplit: React.FC<HeroProps> = ({ storeName, primaryColor, data, isEditable, onUpdate }) => {
  const heading = data?.heading || "Essential gear for the modern era.";
  const subheading = data?.subheading || "Crafted with precision, designed for utility. Explore our latest arrival of technical apparel and accessories.";
  const image = data?.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop";
  const buttonText = data?.buttonText || "Explore Collection";
  const topLabel = data?.topLabel || `Est. 2024 — ${storeName}`;
  const floatingCardTitle = data?.floatingCardTitle || "Cyber Shell Jacket";
  const floatingCardPrice = data?.floatingCardPrice || "$185.00 — In Stock";

  return (
    <section className="relative w-full min-h-[90vh] bg-white flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center order-2 md:order-1">
        <div className="mb-auto">
           <span className="font-bold text-sm tracking-widest uppercase text-neutral-500">
             <EditableText 
                 tagName="span"
                 value={topLabel}
                 onChange={(val) => onUpdate && onUpdate({ topLabel: val })}
                 isEditable={isEditable}
             />
           </span>
        </div>
        
        <div className="text-5xl md:text-7xl font-serif italic mb-8 leading-[1.1]">
           <EditableText 
             tagName="h1" 
             value={heading} 
             onChange={(val) => onUpdate && onUpdate({ heading: val })} 
             isEditable={isEditable}
             className="block"
           />
        </div>
        <div className="text-lg text-neutral-600 mb-12 max-w-md leading-relaxed">
            <EditableText 
             tagName="p" 
             value={subheading} 
             onChange={(val) => onUpdate && onUpdate({ subheading: val })} 
             isEditable={isEditable}
           />
        </div>
        
        <div className="flex items-center gap-4 mb-auto">
          <button 
            className="px-8 py-4 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <EditableText 
                 tagName="span"
                 value={buttonText}
                 onChange={(val) => onUpdate && onUpdate({ buttonText: val })}
                 isEditable={isEditable}
                 placeholder="Button Text"
             />
          </button>
          <div className="flex -space-x-4">
             {[1,2,3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-bold text-neutral-500">
                 <img src={`https://picsum.photos/100?random=${i}`} className="w-full h-full rounded-full object-cover" />
               </div>
             ))}
             <div className="w-10 h-10 rounded-full bg-black text-white border-2 border-white flex items-center justify-center text-[10px] font-bold">
               +2k
             </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 h-[50vh] md:h-auto relative order-1 md:order-2">
         <EditableImage 
            src={image} 
            onChange={(val) => onUpdate && onUpdate({ image: val })} 
            isEditable={isEditable}
            className="absolute inset-0 w-full h-full"
         />
         <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl max-w-xs pointer-events-none md:pointer-events-auto">
            <p className="font-bold text-sm mb-1">
              <EditableText 
                 tagName="span"
                 value={floatingCardTitle}
                 onChange={(val) => onUpdate && onUpdate({ floatingCardTitle: val })}
                 isEditable={isEditable}
             />
            </p>
            <p className="text-xs text-neutral-500">
              <EditableText 
                 tagName="span"
                 value={floatingCardPrice}
                 onChange={(val) => onUpdate && onUpdate({ floatingCardPrice: val })}
                 isEditable={isEditable}
             />
            </p>
         </div>
      </div>
    </section>
  );
};

// 3. Kinetik (Hypebeast, Marquee, High Energy)
export const HeroKinetik: React.FC<HeroProps> = ({ storeName, data, isEditable, onUpdate }) => {
  const heading = data?.heading || "FUTURE WEAR";
  const image = data?.image || "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2000&auto=format&fit=crop";
  const buttonText = data?.buttonText || "Shop Collection 01";
  const marqueeText = data?.marqueeText || "LIMITED DROP • DO NOT SLEEP • WORLDWIDE SHIPPING • SECURE CHECKOUT • NEXUS OS • LIMITED DROP • DO NOT SLEEP •";

  return (
    <section className="relative w-full h-[85vh] bg-[#ccff00] overflow-hidden flex flex-col border-b-4 border-black">
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
                 isEditable={isEditable}
             />
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
         <div className="text-[12vw] font-black leading-none tracking-tighter text-black mix-blend-multiply text-center uppercase relative z-20 pointer-events-none md:pointer-events-auto">
            <EditableText 
             tagName="h1" 
             value={heading} 
             onChange={(val) => onUpdate && onUpdate({ heading: val })} 
             isEditable={isEditable} 
             className="block"
           />
         </div>
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[450px] md:h-[600px] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-[-4deg] hover:rotate-0 transition-transform duration-500 z-10">
            <EditableImage 
                src={image} 
                onChange={(val) => onUpdate && onUpdate({ image: val })} 
                isEditable={isEditable}
                className="w-full h-full"
            />
         </div>
      </div>

      <div className="absolute bottom-12 left-0 w-full flex justify-center z-30">
         <button className="bg-black text-[#ccff00] text-xl font-black uppercase italic px-12 py-4 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all border-2 border-white">
            <EditableText 
                 tagName="span"
                 value={buttonText}
                 onChange={(val) => onUpdate && onUpdate({ buttonText: val })}
                 isEditable={isEditable}
             />
         </button>
      </div>
    </section>
  );
};

// 4. Grid (Masonry, Lifestyle, Collage)
export const HeroGrid: React.FC<HeroProps> = ({ storeName, data, isEditable, onUpdate }) => {
  const heading = data?.heading || storeName;
  const subheading = data?.subheading || "Curating the finest digital and physical goods for the forward-thinking creator.";
  const image = data?.image || "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop";
  const buttonText = data?.buttonText || "Shop All Products";
  const secondaryButtonText = data?.secondaryButtonText || "Read Our Story";
  const imageBadge = data?.imageBadge || "FW24 Lookbook";
  const featureCardTitle = data?.featureCardTitle || "-20%";
  const featureCardSubtitle = data?.featureCardSubtitle || "On all Accessories";

  return (
    <section className="w-full min-h-screen bg-neutral-50 p-4 pt-8">
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
                     isEditable={isEditable} 
                   />
                </div>
                <div className="text-neutral-500 font-medium">
                   <EditableText 
                     tagName="p" 
                     value={subheading} 
                     onChange={(val) => onUpdate && onUpdate({ subheading: val })} 
                     isEditable={isEditable} 
                   />
                </div>
             </div>
             <div className="space-y-2">
                <button className="w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors">
                   <EditableText 
                     tagName="span"
                     value={buttonText}
                     onChange={(val) => onUpdate && onUpdate({ buttonText: val })}
                     isEditable={isEditable}
                   />
                </button>
                <button className="w-full py-4 bg-neutral-100 text-black rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                   <EditableText 
                     tagName="span"
                     value={secondaryButtonText}
                     onChange={(val) => onUpdate && onUpdate({ secondaryButtonText: val })}
                     isEditable={isEditable}
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
            />
             <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold pointer-events-none md:pointer-events-auto">
                <EditableText 
                     tagName="span"
                     value={imageBadge}
                     onChange={(val) => onUpdate && onUpdate({ imageBadge: val })}
                     isEditable={isEditable}
                   />
             </div>
          </div>

          {/* Stacked Images */}
          <div className="md:col-span-3 flex flex-col gap-4">
             <div className="flex-1 relative rounded-3xl overflow-hidden group">
                <img 
                   src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop" 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
             </div>
             <div className="h-48 bg-[#FF5F56] rounded-3xl p-6 text-white flex flex-col justify-center relative overflow-hidden group cursor-pointer">
                <div className="relative z-10 text-4xl font-black mb-1">
                    <EditableText 
                     tagName="span"
                     value={featureCardTitle}
                     onChange={(val) => onUpdate && onUpdate({ featureCardTitle: val })}
                     isEditable={isEditable}
                   />
                </div>
                <div className="relative z-10 font-medium opacity-80">
                    <EditableText 
                     tagName="span"
                     value={featureCardSubtitle}
                     onChange={(val) => onUpdate && onUpdate({ featureCardSubtitle: val })}
                     isEditable={isEditable}
                   />
                </div>
                <ArrowRight className="absolute bottom-6 right-6 z-10 group-hover:translate-x-2 transition-transform" />
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
             </div>
          </div>
       </div>
    </section>
  );
};

// 5. Typographic (Text First, Minimal)
export const HeroTypographic: React.FC<HeroProps> = ({ storeName, data, isEditable, onUpdate }) => {
  const heading = data?.heading || "We Build The Future Of Commerce";
  const subheading = data?.subheading || "Discover a collection inspired by the intersection of technology, fashion, and utility. Designed in Tokyo, worn worldwide.";
  const topBadge = data?.topBadge || "New Arrivals";
  const link1Label = data?.link1Label || "Shop Apparel";
  const link2Label = data?.link2Label || "Shop Tech";
  const link3Label = data?.link3Label || "Shop Footwear";
  
  return (
    <section className="w-full min-h-[80vh] bg-white flex flex-col items-center justify-center py-20">
       <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
             <Star size={12} className="text-neutral-400" />
             <span className="text-xs font-medium text-neutral-400 uppercase tracking-[0.3em]">
                 <EditableText 
                     tagName="span"
                     value={topBadge}
                     onChange={(val) => onUpdate && onUpdate({ topBadge: val })}
                     isEditable={isEditable}
                   />
             </span>
             <Star size={12} className="text-neutral-400" />
          </div>
          
          <div className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
             <EditableText 
                 tagName="h1" 
                 value={heading} 
                 onChange={(val) => onUpdate && onUpdate({ heading: val })} 
                 isEditable={isEditable} 
             />
          </div>

          <div className="max-w-xl mx-auto text-neutral-500 text-lg mb-12">
             <EditableText 
                 tagName="p" 
                 value={subheading} 
                 onChange={(val) => onUpdate && onUpdate({ subheading: val })} 
                 isEditable={isEditable} 
             />
          </div>

          <div className="flex justify-center gap-6">
             <a href="#" className="group flex flex-col items-center gap-2">
                <div className="w-48 h-64 bg-neutral-100 rounded-lg overflow-hidden mb-2 relative">
                   <img src="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="text-sm font-bold border-b border-black pb-0.5">
                    <EditableText 
                     tagName="span"
                     value={link1Label}
                     onChange={(val) => onUpdate && onUpdate({ link1Label: val })}
                     isEditable={isEditable}
                   />
                </div>
             </a>
             <a href="#" className="group flex flex-col items-center gap-2 mt-12 md:mt-24">
                <div className="w-48 h-64 bg-neutral-100 rounded-lg overflow-hidden mb-2 relative">
                   <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="text-sm font-bold border-b border-black pb-0.5">
                    <EditableText 
                     tagName="span"
                     value={link2Label}
                     onChange={(val) => onUpdate && onUpdate({ link2Label: val })}
                     isEditable={isEditable}
                   />
                </div>
             </a>
             <a href="#" className="group flex flex-col items-center gap-2">
                <div className="w-48 h-64 bg-neutral-100 rounded-lg overflow-hidden mb-2 relative">
                   <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="text-sm font-bold border-b border-black pb-0.5">
                    <EditableText 
                     tagName="span"
                     value={link3Label}
                     onChange={(val) => onUpdate && onUpdate({ link3Label: val })}
                     isEditable={isEditable}
                   />
                </div>
             </a>
          </div>
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
  { id: 'impact', name: 'Impact', description: 'Full Screen Immersion', date: '2024-01-10', popularity: 98 },
  { id: 'split', name: 'Split', description: 'Modern 50/50 Layout', date: '2024-03-20', popularity: 85 },
  { id: 'kinetik', name: 'Kinetik', description: 'High Energy Marquee', date: '2024-08-15', popularity: 90 },
  { id: 'grid', name: 'Grid', description: 'Editorial Collage', date: '2024-05-10', popularity: 75 },
  { id: 'typographic', name: 'Typographic', description: 'Text-First Minimal', date: '2024-11-20', popularity: 60 }
];
