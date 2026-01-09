import React from 'react';
import { EditableText } from './HeroLibrary';

export type ScrollStyleId = 'logo-marquee' | 'text-ticker';

export interface ScrollSectionProps {
    data?: any;
    isEditable?: boolean;
    onUpdate?: (data: any) => void;
}

export const SCROLL_OPTIONS = [
    { id: 'logo-marquee', name: 'Logo Marquee', description: 'Infinite scrolling partner logos' },
    { id: 'text-ticker', name: 'Text Ticker', description: 'Scrolling announcement text' },
];

// --- COMPONENTS ---

const LogoMarquee: React.FC<ScrollSectionProps> = ({ data }) => {
    const rawLogos = data?.logos || [
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png'
    ];
    
    const logos = rawLogos.filter((l: string) => l && l.trim() !== '');
    const backgroundColor = data?.backgroundColor || '#ffffff';
    const borderColor = data?.borderColor || '#f5f5f5';

    return (
        <div 
            className="py-12 border-y overflow-hidden" 
            style={{ 
                backgroundColor,
                borderColor
            }}
        >
            <div className="relative w-full flex overflow-x-hidden">
                <div className="animate-marquee whitespace-nowrap flex items-center gap-16 px-8">
                    {logos.map((logo: string, i: number) => (
                        <img key={i} src={logo} className="h-8 w-auto object-contain opacity-40 grayscale hover:grayscale-0 transition-all duration-500" alt="Logo" />
                    ))}
                    {logos.map((logo: string, i: number) => (
                        <img key={`dup-${i}`} src={logo} className="h-8 w-auto object-contain opacity-40 grayscale hover:grayscale-0 transition-all duration-500" alt="Logo" />
                    ))}
                    {logos.map((logo: string, i: number) => (
                        <img key={`dup2-${i}`} src={logo} className="h-8 w-auto object-contain opacity-40 grayscale hover:grayscale-0 transition-all duration-500" alt="Logo" />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TextTicker: React.FC<ScrollSectionProps> = ({ data, isEditable, onUpdate }) => {
    const text = data?.text || "LIMITED TIME OFFER • FREE SHIPPING WORLDWIDE • NEW COLLECTION DROPPING SOON •";
    const backgroundColor = data?.backgroundColor || '#171717';
    const textColor = data?.textColor || '#ffffff';

    return (
        <div className="py-4 overflow-hidden" style={{ backgroundColor }}>
            <div className="animate-marquee whitespace-nowrap flex gap-8">
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: textColor }}>
                    <EditableText 
                        tagName="span" 
                        value={text} 
                        onChange={(val) => onUpdate && onUpdate({ text: val })} 
                        onStyleChange={(style) => onUpdate && onUpdate({ text_style: style })}
                        style={data?.text_style}
                        isEditable={isEditable} 
                    />
                </span>
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: textColor }}>{text}</span>
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: textColor }}>{text}</span>
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: textColor }}>{text}</span>
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: textColor }}>{text}</span>
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: textColor }}>{text}</span>
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: textColor }}>{text}</span>
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: textColor }}>{text}</span>
            </div>
        </div>
    );
};

export const SCROLL_COMPONENTS: Record<string, React.FC<ScrollSectionProps>> = {
    'logo-marquee': LogoMarquee,
    'text-ticker': TextTicker,
};

export const SCROLL_FIELDS: Record<string, string[]> = {
    'logo-marquee': ['logos'],
    'text-ticker': ['text'],
};
