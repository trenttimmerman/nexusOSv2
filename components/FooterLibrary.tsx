
import React from 'react';
import { Facebook, Twitter, Instagram, ArrowRight, Mail, Send, Globe, ShieldCheck, MapPin } from 'lucide-react';

export interface FooterData {
  // Core Styling
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  borderColor?: string;
  
  // Layout
  paddingY?: string;
  maxWidth?: string;
  
  // Minimal Footer
  termsLabel?: string;
  privacyLabel?: string;
  contactLabel?: string;
  showInstagram?: boolean;
  showTwitter?: boolean;
  showFacebook?: boolean;
  
  // Columns Footer
  tagline?: string;
  copyrightText?: string;
  shopColumnTitle?: string;
  companyColumnTitle?: string;
  supportColumnTitle?: string;
  showPaymentIcons?: boolean;
  
  // Newsletter Footer
  heading?: string;
  subheading?: string;
  buttonText?: string;
  emailPlaceholder?: string;
  instagramLabel?: string;
  twitterLabel?: string;
  tiktokLabel?: string;
  youtubeLabel?: string;
  showSocialLinks?: boolean;
  
  // Brand Footer
  address?: string;
  email?: string;
  phone?: string;
  basedInLabel?: string;
  shippingLabel?: string;
  showContactInfo?: boolean;
  showAddress?: boolean;
  
  // Sitemap Footer
  regionText?: string;
  productsColumnTitle?: string;
  collectionsColumnTitle?: string;
  supportColumnTitle?: string;
  legalColumnTitle?: string;
  showRegionSelector?: boolean;
  showSecureCheckout?: boolean;
  secureCheckoutText?: string;
  borderTopWidth?: string;
}

interface FooterProps {
  storeName: string;
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

// =============================
// DEFAULTS
// =============================

const MINIMAL_DEFAULTS: FooterData = {
  backgroundColor: '#ffffff',
  textColor: '#171717',
  accentColor: '#737373',
  borderColor: '#f5f5f5',
  paddingY: '3rem',
  termsLabel: 'Terms',
  privacyLabel: 'Privacy',
  contactLabel: 'Contact',
  showInstagram: true,
  showTwitter: true,
  showFacebook: false,
};

const COLUMNS_DEFAULTS: FooterData = {
  backgroundColor: '#fafafa',
  textColor: '#171717',
  accentColor: '#737373',
  borderColor: '#e5e5e5',
  paddingY: '5rem',
  tagline: 'Designed for the future of commerce. We build tools that empower creators to sell without limits.',
  copyrightText: '© 2024 All rights reserved.',
  shopColumnTitle: 'Shop',
  companyColumnTitle: 'Company',
  supportColumnTitle: 'Support',
  showPaymentIcons: true,
};

const NEWSLETTER_DEFAULTS: FooterData = {
  backgroundColor: '#000000',
  textColor: '#ffffff',
  accentColor: '#ffffff',
  paddingY: '6rem',
  heading: 'Don't miss the drop.',
  subheading: 'Join 50,000+ subscribers getting exclusive access to new releases, secret sales, and design insights.',
  buttonText: 'Subscribe',
  emailPlaceholder: 'Enter your email',
  instagramLabel: 'Instagram',
  twitterLabel: 'Twitter',
  tiktokLabel: 'TikTok',
  youtubeLabel: 'YouTube',
  showSocialLinks: true,
  copyrightText: '© 2024',
};

const BRAND_DEFAULTS: FooterData = {
  backgroundColor: '#f0f0f0',
  textColor: '#171717',
  accentColor: '#171717',
  borderColor: '#d4d4d4',
  paddingY: '6rem',
  address: '100 Evolv Way\nFloor 24, Suite 100\nNew York, NY 10012',
  email: 'hello@evolv.com',
  phone: '+1 (555) 000-0000',
  basedInLabel: 'Based in NYC',
  shippingLabel: 'Worldwide Shipping',
  showContactInfo: true,
  showAddress: true,
};

const SITEMAP_DEFAULTS: FooterData = {
  backgroundColor: '#171717',
  textColor: '#ffffff',
  accentColor: '#2563eb',
  borderColor: '#262626',
  paddingY: '4rem',
  regionText: 'United States (USD $)',
  secureCheckoutText: 'Secure Checkout via Evolv Pass',
  copyrightText: '© 2024 Evolv Commerce Operating System. Powered by React.',
  productsColumnTitle: 'Products',
  collectionsColumnTitle: 'Collections',
  supportColumnTitle: 'Support',
  legalColumnTitle: 'Legal',
  showRegionSelector: true,
  showSecureCheckout: true,
  borderTopWidth: '4px',
};

// =============================
// COMPONENTS
// =============================

// 1. Minimal (Clean, barely there)
export const FooterMinimal: React.FC<FooterProps & { data?: FooterData }> = ({ storeName, data = {} }) => {
  const merged = { ...MINIMAL_DEFAULTS, ...data };
  
  return (
    <footer 
      className="border-t px-6 transition-colors"
      style={{ 
        backgroundColor: merged.backgroundColor,
        borderColor: merged.borderColor,
        paddingTop: merged.paddingY,
        paddingBottom: merged.paddingY
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-bold text-lg" style={{ color: merged.textColor }}>{storeName}</div>
        <div className="flex gap-6 text-sm" style={{ color: `${merged.textColor}99` }}>
          <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: merged.accentColor }}>{merged.termsLabel}</a>
          <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: merged.accentColor }}>{merged.privacyLabel}</a>
          <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: merged.accentColor }}>{merged.contactLabel}</a>
        </div>
        <div className="flex gap-4">
          {merged.showInstagram && <Instagram size={18} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ color: `${merged.textColor}99` }} />}
          {merged.showTwitter && <Twitter size={18} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ color: `${merged.textColor}99` }} />}
          {merged.showFacebook && <Facebook size={18} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ color: `${merged.textColor}99` }} />}
        </div>
      </div>
    </footer>
  );
};

// 2. Columns (Standard E-commerce)
export const FooterColumns: React.FC<FooterProps & { data?: FooterData }> = ({ storeName, data = {} }) => {
  const merged = { ...COLUMNS_DEFAULTS, ...data };
  
  return (
  <footer 
    className="border-t px-6 text-sm transition-colors"
    style={{ 
      backgroundColor: merged.backgroundColor,
      borderColor: merged.borderColor,
      paddingTop: merged.paddingY,
      paddingBottom: merged.paddingY
    }}
  >
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
      <div className="col-span-2 lg:col-span-2">
        <h3 className="font-bold text-xl mb-6" style={{ color: merged.textColor }}>{storeName}</h3>
        <p className="max-w-sm mb-6 leading-relaxed" style={{ color: `${merged.textColor}99` }}>
          {merged.tagline}
        </p>
        {merged.showPaymentIcons && <div className="flex gap-2">
           <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: `${merged.textColor}30`, backgroundColor: merged.backgroundColor }}>
             <span className="font-bold text-[10px]" style={{ color: merged.textColor }}>VISA</span>
           </div>
           <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: `${merged.textColor}30`, backgroundColor: merged.backgroundColor }}>
             <span className="font-bold text-[10px]" style={{ color: merged.textColor }}>MC</span>
           </div>
           <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: `${merged.textColor}30`, backgroundColor: merged.backgroundColor }}>
             <span className="font-bold text-[10px]" style={{ color: merged.textColor }}>PAY</span>
           </div>
        </div>}
      </div>
      <div>
        <h4 className="font-bold mb-4" style={{ color: merged.textColor }}>{merged.shopColumnTitle}</h4>
        <ul className="space-y-3" style={{ color: `${merged.textColor}99` }}>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>New Arrivals</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Best Sellers</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Accessories</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Sale</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4" style={{ color: merged.textColor }}>{merged.companyColumnTitle}</h4>
        <ul className="space-y-3" style={{ color: `${merged.textColor}99` }}>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>About Us</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Careers</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Press</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Sustainability</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4" style={{ color: merged.textColor }}>{merged.supportColumnTitle}</h4>
        <ul className="space-y-3" style={{ color: `${merged.textColor}99` }}>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Help Center</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Returns</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Shipping</li>
          <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Contact</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t flex flex-col md:flex-row justify-between text-xs" style={{ borderColor: `${merged.textColor}20`, color: `${merged.textColor}80` }}>
      <p>{merged.copyrightText}</p>
      <div className="flex gap-4 mt-4 md:mt-0">
         <span>Privacy Policy</span>
         <span>Terms of Service</span>
      </div>
    </div>
  </footer>
  );
};

// 3. Newsletter (Conversion Focused)
export const FooterNewsletter: React.FC<FooterProps & { data?: FooterData }> = ({ storeName, primaryColor, data = {} }) => {
  const merged = { ...NEWSLETTER_DEFAULTS, ...data };
  
  return (
  <footer className="px-6 transition-colors" style={{ backgroundColor: merged.backgroundColor, paddingTop: merged.paddingY, paddingBottom: merged.paddingY }}>
    <div className="max-w-4xl mx-auto text-center">
      <Mail size={48} className="mx-auto mb-6" style={{ color: `${merged.textColor}50` }} />
      <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: merged.textColor }}>{merged.heading}</h2>
      <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: `${merged.textColor}99` }}>
        {merged.subheading}
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-16">
        <input 
          type="email" 
          placeholder={merged.emailPlaceholder}
          className="flex-1 rounded-lg px-6 py-4 focus:outline-none transition-colors"
          style={{ 
            backgroundColor: `${merged.textColor}15`,
            borderWidth: '1px',
            borderColor: `${merged.textColor}30`,
            color: merged.textColor
          }}
        />
        <button 
          className="px-8 py-4 font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ 
            backgroundColor: merged.accentColor || primaryColor, 
            color: merged.backgroundColor
          }}
        >
          {merged.buttonText}
        </button>
      </div>

      {merged.showSocialLinks && <div className="flex justify-center gap-8 border-t pt-12 text-sm font-medium" style={{ borderColor: `${merged.textColor}20`, color: `${merged.textColor}80` }}>
        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: merged.accentColor }}>{merged.instagramLabel}</a>
        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: merged.accentColor }}>{merged.twitterLabel}</a>
        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: merged.accentColor }}>{merged.tiktokLabel}</a>
        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: merged.accentColor }}>{merged.youtubeLabel}</a>
      </div>}
      <p className="mt-8 text-xs" style={{ color: `${merged.textColor}50` }}>{merged.copyrightText}</p>
    </div>
  </footer>
  );
};

// 4. Brand (Typography Heavy)
export const FooterBrand: React.FC<FooterProps & { data?: FooterData }> = ({ storeName, data = {} }) => {
  const merged = { ...BRAND_DEFAULTS, ...data };
  
  return (
  <footer className="px-6 overflow-hidden transition-colors" style={{ backgroundColor: merged.backgroundColor, paddingTop: merged.paddingY, paddingBottom: '2rem' }}>
    <div className="max-w-7xl mx-auto mb-24 grid grid-cols-1 md:grid-cols-2 gap-12">
       {merged.showAddress && <div>
          <span className="block text-xs font-bold uppercase tracking-widest mb-4" style={{ color: `${merged.textColor}80` }}>Headquarters</span>
          <p className="text-xl font-medium leading-relaxed whitespace-pre-line" style={{ color: merged.textColor }}>
             {merged.address}
          </p>
       </div>}
       {merged.showContactInfo && <div className="flex flex-col md:items-end">
          <span className="block text-xs font-bold uppercase tracking-widest mb-4" style={{ color: `${merged.textColor}80` }}>Connect</span>
          <a href={`mailto:${merged.email}`} className="text-xl font-medium hover:underline mb-2" style={{ color: merged.accentColor }}>{merged.email}</a>
          <p className="text-xl font-medium" style={{ color: merged.textColor }}>{merged.phone}</p>
       </div>}
    </div>
    
    <div className="border-t pt-8 mb-4 flex justify-between text-xs font-bold uppercase tracking-wider" style={{ borderColor: merged.borderColor, color: `${merged.textColor}80` }}>
       <span>{merged.basedInLabel}</span>
       <span>{merged.shippingLabel}</span>
    </div>
    
    <h1 className="text-[15vw] leading-none font-black tracking-tighter select-none text-center md:text-left" style={{ color: `${merged.textColor}30` }}>
       {storeName.toUpperCase()}
    </h1>
  </footer>
  );
};

// 5. Sitemap (Information Dense)
export const FooterSitemap: React.FC<FooterProps & { data?: FooterData }> = ({ storeName, data = {} }) => {
  const merged = { ...SITEMAP_DEFAULTS, ...data };
  
  return (
  <footer 
    className="px-6 text-sm border-t transition-colors" 
    style={{ 
      backgroundColor: merged.backgroundColor,
      borderTopColor: merged.accentColor,
      borderTopWidth: merged.borderTopWidth,
      paddingTop: merged.paddingY,
      paddingBottom: merged.paddingY
    }}
  >
     <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
        <div className="col-span-2 lg:col-span-2 pr-8">
           <div className="font-bold text-2xl mb-6" style={{ color: merged.textColor }}>{storeName}</div>
           {merged.showRegionSelector && <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: `${merged.textColor}99` }}>
              <Globe size={14} /> 
              <span>Region: {merged.regionText}</span>
           </div>}
           {merged.showSecureCheckout && <div className="flex items-center gap-2 text-xs" style={{ color: `${merged.textColor}99` }}>
              <ShieldCheck size={14} /> 
              <span>{merged.secureCheckoutText}</span>
           </div>}
        </div>
        
        <div>
           <h4 className="font-bold mb-4" style={{ color: merged.textColor }}>{merged.productsColumnTitle}</h4>
           <ul className="space-y-2" style={{ color: `${merged.textColor}99` }}>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>New Arrivals</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Best Sellers</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Trends</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Gift Cards</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Sale</li>
           </ul>
        </div>

        <div>
           <h4 className="font-bold mb-4" style={{ color: merged.textColor }}>{merged.collectionsColumnTitle}</h4>
           <ul className="space-y-2" style={{ color: `${merged.textColor}99` }}>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Summer 2024</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Cyber Tech</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Minimalist</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Accessories</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Home</li>
           </ul>
        </div>

        <div>
           <h4 className="font-bold mb-4" style={{ color: merged.textColor }}>{merged.supportColumnTitle}</h4>
           <ul className="space-y-2" style={{ color: `${merged.textColor}99` }}>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Help Center</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Track Order</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Returns</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Shipping Info</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Contact Us</li>
           </ul>
        </div>

        <div>
           <h4 className="font-bold mb-4" style={{ color: merged.textColor }}>{merged.legalColumnTitle}</h4>
           <ul className="space-y-2" style={{ color: `${merged.textColor}99` }}>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Terms</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Privacy</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Cookies</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: merged.accentColor }}>Licenses</li>
           </ul>
        </div>
     </div>
     
     <div className="max-w-7xl mx-auto pt-8 border-t flex justify-center" style={{ borderColor: merged.borderColor }}>
        <p className="text-xs" style={{ color: `${merged.textColor}50` }}>{merged.copyrightText}</p>
     </div>
  </footer>
  );
};

export const FOOTER_COMPONENTS = {
  minimal: FooterMinimal,
  columns: FooterColumns,
  newsletter: FooterNewsletter,
  brand: FooterBrand,
  sitemap: FooterSitemap
};

export const FOOTER_OPTIONS = [
  { id: 'minimal', name: 'Minimal', description: 'Clean & Simple', date: '2024-01-01', popularity: 80 },
  { id: 'columns', name: 'Columns', description: 'Standard Ecommerce', date: '2024-02-15', popularity: 95 },
  { id: 'newsletter', name: 'Newsletter', description: 'Conversion Focused', date: '2024-05-20', popularity: 85 },
  { id: 'brand', name: 'Brand', description: 'Big Typography', date: '2024-08-10', popularity: 70 },
  { id: 'sitemap', name: 'Sitemap', description: 'Information Dense', date: '2024-04-05', popularity: 60 },
];

export const FOOTER_FIELDS: Record<string, string[]> = {
  minimal: [
    'backgroundColor', 'textColor', 'accentColor', 'borderColor', 'paddingY',
    'termsLabel', 'privacyLabel', 'contactLabel',
    'showInstagram', 'showTwitter', 'showFacebook'
  ],
  columns: [
    'backgroundColor', 'textColor', 'accentColor', 'borderColor', 'paddingY',
    'tagline', 'copyrightText',
    'shopColumnTitle', 'companyColumnTitle', 'supportColumnTitle',
    'showPaymentIcons'
  ],
  newsletter: [
    'backgroundColor', 'textColor', 'accentColor', 'paddingY',
    'heading', 'subheading', 'buttonText', 'emailPlaceholder',
    'instagramLabel', 'twitterLabel', 'tiktokLabel', 'youtubeLabel',
    'showSocialLinks', 'copyrightText'
  ],
  brand: [
    'backgroundColor', 'textColor', 'accentColor', 'borderColor', 'paddingY',
    'address', 'email', 'phone',
    'basedInLabel', 'shippingLabel',
    'showContactInfo', 'showAddress'
  ],
  sitemap: [
    'backgroundColor', 'textColor', 'accentColor', 'borderColor', 'paddingY',
    'regionText', 'secureCheckoutText', 'copyrightText',
    'productsColumnTitle', 'collectionsColumnTitle', 'supportColumnTitle', 'legalColumnTitle',
    'showRegionSelector', 'showSecureCheckout', 'borderTopWidth'
  ],
};
