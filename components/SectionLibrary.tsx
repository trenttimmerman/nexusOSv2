
import React, { useState } from 'react';
import { EditableText } from './HeroLibrary';
import { Plus, Minus, ChevronDown, ChevronUp, Mail, ArrowRight, Check, Star } from 'lucide-react';

// --- RICH TEXT ---
export const RICH_TEXT_OPTIONS = [
  { id: 'rt-centered', name: 'Centered Minimal', description: 'Clean centered text block' },
  { id: 'rt-left', name: 'Left Aligned', description: 'Standard left-aligned content' },
  { id: 'rt-bordered', name: 'Bordered Box', description: 'Text inside a bordered container' },
  { id: 'rt-wide', name: 'Wide Display', description: 'Full width large typography' },
];

export const RICH_TEXT_COMPONENTS: Record<string, React.FC<any>> = {
  'rt-centered': ({ data, isEditable, onUpdate }) => {
    const textAlign = data?.textAlign || 'center';
    const maxWidth = data?.maxWidth || 'max-w-3xl';
    const alignmentClass = textAlign === 'center' ? 'mx-auto text-center' : textAlign === 'right' ? 'ml-auto text-right' : '';
    
    return (
      <div 
        className="py-20 px-6"
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
      >
        <div className={`${maxWidth} ${alignmentClass}`}>
          <EditableText
            value={data?.heading || 'Tell Your Story'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-3xl font-bold mb-6"
            style={{ color: data?.headingColor || '#000000' }}
          />
          {data?.subheading && (
            <div className="text-lg mb-4" style={{ color: data?.contentColor || '#6b7280' }}>
              {data.subheading}
            </div>
          )}
          <EditableText
            value={data?.content || 'Share information about your brand with your customers. Describe a product, make announcements, or welcome customers to your store.'}
            onChange={(val) => onUpdate?.({ ...data, content: val })}
            isEditable={isEditable}
            className="leading-relaxed mb-6"
            style={{ color: data?.contentColor || '#6b7280' }}
          />
          {data?.buttonText && (
            <a 
              href={data?.buttonLink === 'external' ? (data?.buttonExternalUrl || '#') : (data?.buttonLink || '#')} 
              className="inline-block px-6 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: data?.buttonBackground || '#000000',
                color: data?.buttonTextColor || '#ffffff'
              }}
            >
              {data.buttonText}
            </a>
          )}
        </div>
      </div>
    );
  },
  'rt-left': ({ data, isEditable, onUpdate }) => {
    const textAlign = data?.textAlign || 'left';
    const maxWidth = data?.maxWidth || 'max-w-4xl';
    const alignmentClass = textAlign === 'center' ? 'mx-auto text-center' : textAlign === 'right' ? 'ml-auto text-right' : 'mx-auto';
    
    return (
      <div 
        className="py-20 px-6"
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
      >
        <div className={`${maxWidth} ${alignmentClass}`}>
          <EditableText
            value={data?.heading || 'Our Mission'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-3xl font-bold mb-6"
            style={{ color: data?.headingColor || '#000000' }}
          />
          {data?.subheading && (
            <div className="text-lg mb-4" style={{ color: data?.contentColor || '#6b7280' }}>
              {data.subheading}
            </div>
          )}
          <EditableText
            value={data?.content || 'We believe in quality craftsmanship and sustainable practices. Every piece is designed with longevity in mind, ensuring that your purchase is an investment in the future.'}
            onChange={(val) => onUpdate?.({ ...data, content: val })}
            isEditable={isEditable}
            className="leading-relaxed mb-6"
            style={{ color: data?.contentColor || '#6b7280' }}
          />
          {data?.buttonText && (
            <a 
              href={data?.buttonLink === 'external' ? (data?.buttonExternalUrl || '#') : (data?.buttonLink || '#')} 
              className="inline-block px-6 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: data?.buttonBackground || '#000000',
                color: data?.buttonTextColor || '#ffffff'
              }}
            >
              {data.buttonText}
            </a>
          )}
        </div>
      </div>
    );
  },
  'rt-bordered': ({ data, isEditable, onUpdate }) => {
    const textAlign = data?.textAlign || 'center';
    const maxWidth = data?.maxWidth || 'max-w-4xl';
    const alignmentClass = textAlign === 'center' ? 'mx-auto text-center' : textAlign === 'right' ? 'ml-auto text-right' : 'mx-auto';
    
    return (
      <div 
        className="py-20 px-6"
        style={{ backgroundColor: data?.backgroundColor || '#ffffff' }}
      >
        <div 
          className={`${maxWidth} ${alignmentClass} p-12 rounded-2xl`}
          style={{ 
            borderWidth: '1px',
            borderColor: data?.borderColor || '#e5e5e5',
            backgroundColor: data?.containerBackground || '#ffffff'
          }}
        >
          <EditableText
            value={data?.heading || 'Special Announcement'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-2xl font-bold mb-4"
            style={{ color: data?.headingColor || '#000000' }}
          />
          {data?.subheading && (
            <div className="text-lg mb-4" style={{ color: data?.contentColor || '#6b7280' }}>
              {data.subheading}
            </div>
          )}
          <EditableText
            value={data?.content || 'Join us this weekend for an exclusive pop-up event at our downtown location. Free refreshments and exclusive merchandise available.'}
            onChange={(val) => onUpdate?.({ ...data, content: val })}
            isEditable={isEditable}
            className="mb-6"
            style={{ color: data?.contentColor || '#6b7280' }}
          />
          {data?.buttonText && (
            <a 
              href={data?.buttonLink === 'external' ? (data?.buttonExternalUrl || '#') : (data?.buttonLink || '#')} 
              className="inline-block px-6 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: data?.buttonBackground || '#000000',
                color: data?.buttonTextColor || '#ffffff'
              }}
            >
              {data.buttonText}
            </a>
          )}
        </div>
      </div>
    );
  },
  'rt-wide': ({ data, isEditable, onUpdate }) => {
    const textAlign = data?.textAlign || 'center';
    const maxWidth = data?.maxWidth || 'max-w-6xl';
    const alignmentClass = textAlign === 'center' ? 'mx-auto text-center' : textAlign === 'right' ? 'ml-auto text-right' : 'mx-auto';
    
    return (
      <div 
        className="py-32 px-6"
        style={{ backgroundColor: data?.backgroundColor || '#f5f5f5' }}
      >
        <div className={`${maxWidth} ${alignmentClass}`}>
          <EditableText
            value={data?.heading || 'The Future of Fashion'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase"
            style={{ color: data?.headingColor || '#000000' }}
          />
          {data?.subheading && (
            <div className="text-2xl mb-6" style={{ color: data?.contentColor || '#6b7280' }}>
              {data.subheading}
            </div>
          )}
          <EditableText
            value={data?.content || 'Redefining style for the digital age.'}
            onChange={(val) => onUpdate?.({ ...data, content: val })}
            isEditable={isEditable}
            className="text-xl font-medium mb-8"
            style={{ color: data?.contentColor || '#737373' }}
          />
          {data?.buttonText && (
            <a 
              href={data?.buttonLink === 'external' ? (data?.buttonExternalUrl || '#') : (data?.buttonLink || '#')} 
              className="inline-block px-8 py-4 rounded-lg font-bold text-lg hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: data?.buttonBackground || '#000000',
                color: data?.buttonTextColor || '#ffffff'
              }}
            >
              {data.buttonText}
            </a>
          )}
        </div>
      </div>
    );
  },
};

// --- EMAIL SIGNUP ---
export const EMAIL_SIGNUP_OPTIONS = [
  { id: 'email-minimal', name: 'Minimal', description: 'Simple input field' },
  { id: 'email-split', name: 'Split Image', description: 'Image on side, form on other' },
  { id: 'email-card', name: 'Floating Card', description: 'Card style with shadow' },
];

export const EMAIL_SIGNUP_COMPONENTS: Record<string, React.FC<any>> = {
  'email-minimal': ({ data, isEditable, onUpdate }) => (
    <div 
      className="py-24 px-6 text-center"
      style={{ 
        backgroundColor: data?.backgroundColor || '#171717',
      }}
    >
      <div className="max-w-xl mx-auto">
        <div className="mb-8 flex justify-center" style={{ color: data?.headingColor || '#ffffff' }}>
          <Mail size={32} />
        </div>
        <EditableText
          value={data?.heading || 'Join the Newsletter'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold mb-4"
          style={{ color: data?.headingColor || '#ffffff' }}
        />
        <EditableText
          value={data?.subheading || 'Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.'}
          onChange={(val) => onUpdate?.({ ...data, subheading: val })}
          isEditable={isEditable}
          className="mb-8"
          style={{ color: data?.subheadingColor || '#737373' }}
        />
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder={data?.placeholderText || 'Enter your email'} 
            className="flex-1 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: data?.inputBgColor || 'rgba(255,255,255,0.1)',
              borderWidth: '1px',
              borderColor: data?.inputBorderColor || 'rgba(255,255,255,0.2)',
              color: data?.inputTextColor || '#ffffff'
            }}
          />
          <button 
            className="px-6 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: data?.buttonBgColor || '#ffffff',
              color: data?.buttonTextColor || '#000000'
            }}
          >
            {data?.buttonText || 'Subscribe'}
          </button>
        </div>
      </div>
    </div>
  ),
  'email-split': ({ data, isEditable, onUpdate }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
      <div className="bg-neutral-100 relative">
        <img src={data?.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div 
        className="flex items-center justify-center p-12 md:p-24"
        style={{ 
          backgroundColor: data?.backgroundColor || '#ffffff',
        }}
      >
        <div className="w-full max-w-md">
          <EditableText
            value={data?.heading || 'Stay in the loop'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl font-bold mb-4"
            style={{ color: data?.headingColor || '#000000' }}
          />
          <EditableText
            value={data?.subheading || 'Be the first to know about new collections and exclusive offers.'}
            onChange={(val) => onUpdate?.({ ...data, subheading: val })}
            isEditable={isEditable}
            className="mb-8"
            style={{ color: data?.subheadingColor || '#737373' }}
          />
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder={data?.placeholderText || 'Email address'} 
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: data?.inputBgColor || '#fafafa',
                borderWidth: '1px',
                borderColor: data?.inputBorderColor || '#e5e5e5',
                color: data?.inputTextColor || '#000000'
              }}
            />
            <button 
              className="w-full px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{
                backgroundColor: data?.buttonBgColor || '#000000',
                color: data?.buttonTextColor || '#ffffff'
              }}
            >
              {data?.buttonText || 'Sign Up'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
  'email-card': ({ data, isEditable, onUpdate }) => (
    <div className="py-24 px-6 bg-neutral-50">
      <div 
        className="max-w-4xl mx-auto rounded-2xl shadow-xl p-12 md:p-16 text-center relative overflow-hidden"
        style={{ 
          backgroundColor: data?.backgroundColor || '#ffffff',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <EditableText
          value={data?.heading || 'Unlock 10% Off'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-4xl font-bold mb-4"
          style={{ color: data?.headingColor || '#000000' }}
        />
        <EditableText
          value={data?.subheading || 'Join our mailing list and get 10% off your first order.'}
          onChange={(val) => onUpdate?.({ ...data, subheading: val })}
          isEditable={isEditable}
          className="mb-8"
          style={{ color: data?.subheadingColor || '#737373' }}
        />
        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder={data?.placeholderText || 'Your email'} 
            className="flex-1 rounded-lg px-4 py-3 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: data?.inputBgColor || '#fafafa',
              borderWidth: '1px',
              borderColor: data?.inputBorderColor || '#e5e5e5',
              color: data?.inputTextColor || '#000000'
            }}
          />
          <button 
            className="px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: data?.buttonBgColor || '#000000',
              color: data?.buttonTextColor || '#ffffff'
            }}
          >
            {data?.buttonText || 'Get Code'}
          </button>
        </div>
        <p 
          className="text-xs mt-4"
          style={{ color: data?.disclaimerColor || '#a3a3a3' }}
        >
          {data?.disclaimer || 'No spam, unsubscribe anytime.'}
        </p>
      </div>
    </div>
  ),
};

// --- COLLAPSIBLE CONTENT ---
export const COLLAPSIBLE_OPTIONS = [
  { id: 'col-simple', name: 'Simple Accordion', description: 'Clean expandable list' },
  { id: 'col-faq', name: 'FAQ Style', description: 'Questions and answers' },
];

export const COLLAPSIBLE_COMPONENTS: Record<string, React.FC<any>> = {
  'col-simple': ({ data, isEditable, onUpdate }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const items = data?.items || [
      { title: 'Materials', content: 'We use only the finest organic cotton and recycled polyester.' },
      { title: 'Shipping', content: 'Free shipping on all orders over $100. International shipping available.' },
      { title: 'Returns', content: '30-day return policy for all unworn items with original tags.' },
    ];

    return (
      <div className="py-20 px-6 max-w-2xl mx-auto">
        <EditableText
          value={data?.heading || 'Details'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-2xl font-bold mb-8"
        />
        <div className="space-y-4">
          {items.map((item: any, i: number) => (
            <div key={i} className="border-b border-neutral-200 pb-4">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex justify-between items-center text-left py-2">
                <span className="font-bold text-lg">{item.title}</span>
                {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <p className="text-neutral-600">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
  'col-faq': ({ data, isEditable, onUpdate }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const items = data?.items || [
      { title: 'How do I track my order?', content: 'You will receive a tracking number via email once your order ships.' },
      { title: 'Do you ship internationally?', content: 'Yes, we ship to over 50 countries worldwide.' },
      { title: 'What payment methods do you accept?', content: 'We accept Visa, Mastercard, Amex, PayPal, and Apple Pay.' },
      { title: 'Can I change my order?', content: 'Orders can be modified within 1 hour of placement.' },
    ];

    return (
      <div className="py-24 px-6 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <EditableText
              value={data?.heading || 'Frequently Asked Questions'}
              onChange={(val) => onUpdate?.({ ...data, heading: val })}
              isEditable={isEditable}
              className="text-3xl font-bold mb-4"
            />
            <p className="text-neutral-500">Everything you need to know about the product and billing.</p>
          </div>
          <div className="space-y-4">
            {items.map((item: any, i: number) => (
              <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex justify-between items-center text-left p-6 hover:bg-neutral-50 transition-colors">
                  <span className="font-bold text-neutral-900">{item.title}</span>
                  {openIndex === i ? <ChevronUp size={20} className="text-neutral-400" /> : <ChevronDown size={20} className="text-neutral-400" />}
                </button>
                <div className={`transition-all duration-300 bg-neutral-50/50 ${openIndex === i ? 'max-h-40 opacity-100 border-t border-neutral-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-neutral-600 p-6 pt-4">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

// --- LOGO LIST ---
export const LOGO_LIST_OPTIONS = [
  { id: 'logo-grid', name: 'Simple Grid', description: 'Grid of partner logos' },
  { id: 'logo-ticker', name: 'Scrolling Ticker', description: 'Animated infinite scroll' },
];

export const LOGO_LIST_COMPONENTS: Record<string, React.FC<any>> = {
  'logo-grid': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto text-center">
        <EditableText
          value={data?.heading || 'Trusted by industry leaders'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-12"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-center">
              <div className="w-24 h-8 bg-neutral-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  'logo-ticker': ({ data, isEditable, onUpdate }) => (
    <div className="py-12 bg-black text-white overflow-hidden">
      <div className="flex gap-16 animate-scroll whitespace-nowrap items-center">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="text-2xl font-bold tracking-tighter opacity-50 hover:opacity-100 transition-opacity cursor-default">
            BRAND_LOGO_{i + 1}
          </div>
        ))}
      </div>
    </div>
  )
};

// --- PROMO BANNER ---
export const PROMO_BANNER_OPTIONS = [
  { id: 'promo-top', name: 'Top Bar', description: 'Thin announcement bar' },
  { id: 'promo-hero', name: 'Hero Banner', description: 'Large promotional area' },
];

export const PROMO_BANNER_COMPONENTS: Record<string, React.FC<any>> = {
  'promo-top': ({ data, isEditable, onUpdate }) => (
    <div className="bg-blue-600 text-white py-3 px-4 text-center text-sm font-medium flex justify-center items-center gap-2">
      <EditableText
        value={data?.text || 'Free shipping on all orders over $100'}
        onChange={(val) => onUpdate?.({ ...data, text: val })}
        isEditable={isEditable}
        tagName="span"
      />
      <ArrowRight size={14} />
    </div>
  ),
  'promo-hero': ({ data, isEditable, onUpdate }) => (
    <div className="py-12 px-6">
      <div className="max-w-7xl mx-auto bg-neutral-900 rounded-2xl overflow-hidden relative min-h-[300px] flex items-center">
        <div className="absolute inset-0 opacity-50">
          <img src={data?.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80'} className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 p-12 w-full md:w-1/2 text-white">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold mb-4">LIMITED TIME</div>
          <EditableText
            value={data?.heading || 'End of Season Sale'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl md:text-5xl font-bold mb-4"
          />
          <EditableText
            value={data?.subheading || 'Up to 50% off selected items. While stocks last.'}
            onChange={(val) => onUpdate?.({ ...data, subheading: val })}
            isEditable={isEditable}
            className="text-neutral-300 mb-8 text-lg"
          />
          <button 
            onClick={() => {
              if (isEditable) return;
              const link = data?.buttonLink === 'external' ? data?.buttonExternalUrl : data?.buttonLink;
              if (link) window.location.href = link;
            }}
            className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-neutral-200 transition-colors"
          >
            {data?.buttonText || 'Shop Sale'}
          </button>
        </div>
      </div>
    </div>
  )
};
