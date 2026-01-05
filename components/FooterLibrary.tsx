
import React from 'react';
import { Facebook, Twitter, Instagram, ArrowRight, Mail, Send, Globe, ShieldCheck, MapPin, Search, User, ShoppingBag } from 'lucide-react';

interface FooterProps {
  storeName: string;
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  data?: Record<string, any>;
}

// 1. Minimal (Clean, barely there)
export const FooterMinimal: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data = {} }) => {
  const showSearch = data.showSearch ?? false;
  const showAccount = data.showAccount ?? false;
  const showCart = data.showCart ?? false;
  const showTerms = data.showTerms ?? true;
  const showPrivacy = data.showPrivacy ?? true;
  const showContact = data.showContact ?? true;
  const showInstagram = data.showInstagram ?? true;
  const showTwitter = data.showTwitter ?? true;
  
  const termsLabel = data.termsLabel || 'Terms';
  const privacyLabel = data.privacyLabel || 'Privacy';
  const contactLabel = data.contactLabel || 'Contact';
  
  // Get link URLs (support both page slugs and external URLs)
  const getLink = (linkKey: string, urlKey: string) => {
    const link = data[linkKey];
    if (link === 'external') return data[urlKey] || '#';
    return link || '#';
  };
  
  const termsHref = getLink('termsLink', 'termsLinkUrl');
  const privacyHref = getLink('privacyLink', 'privacyLinkUrl');
  const contactHref = getLink('contactLink', 'contactLinkUrl');
  
  return (
    <footer 
      className="border-t py-12 px-6 transition-colors"
      style={{ 
        backgroundColor: backgroundColor || '#ffffff',
        borderColor: textColor ? `${textColor}20` : '#f5f5f5'
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-bold text-lg" style={{ color: textColor || '#171717' }}>{storeName}</div>
        
        {/* Links */}
        <div className="flex gap-6 text-sm" style={{ color: textColor ? `${textColor}99` : '#737373' }}>
          {showTerms && <a href={termsHref} className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#737373' }}>{termsLabel}</a>}
          {showPrivacy && <a href={privacyHref} className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#737373' }}>{privacyLabel}</a>}
          {showContact && <a href={contactHref} className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#737373' }}>{contactLabel}</a>}
        </div>
        
        {/* Icons */}
        <div className="flex gap-4 items-center">
          {showSearch && <Search size={18} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }} />}
          {showAccount && <User size={18} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }} />}
          {showCart && <ShoppingBag size={18} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }} />}
          {showInstagram && <Instagram size={18} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }} />}
          {showTwitter && <Twitter size={18} className="hover:opacity-80 transition-opacity cursor-pointer" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }} />}
        </div>
      </div>
    </footer>
  );
};

// 2. Columns (Standard E-commerce)
export const FooterColumns: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data = {} }) => {
  const tagline = data.tagline || 'Designed for the future of commerce. We build tools that empower creators to sell without limits.';
  const copyrightText = data.copyrightText || `© 2024 ${storeName} Inc. All rights reserved.`;
  const showPaymentBadges = data.showPaymentBadges ?? true;
  
  // Column 1: Shop
  const shopTitle = data.shopTitle || 'Shop';
  const shopLinks = data.shopLinks || [
    { label: 'New Arrivals', link: '' },
    { label: 'Best Sellers', link: '' },
    { label: 'Accessories', link: '' },
    { label: 'Sale', link: '' },
  ];
  
  // Column 2: Company
  const companyTitle = data.companyTitle || 'Company';
  const companyLinks = data.companyLinks || [
    { label: 'About Us', link: '' },
    { label: 'Careers', link: '' },
    { label: 'Press', link: '' },
    { label: 'Sustainability', link: '' },
  ];
  
  // Column 3: Support
  const supportTitle = data.supportTitle || 'Support';
  const supportLinks = data.supportLinks || [
    { label: 'Help Center', link: '' },
    { label: 'Returns', link: '' },
    { label: 'Shipping', link: '' },
    { label: 'Contact', link: '' },
  ];
  
  // Bottom links
  const showPrivacyPolicy = data.showPrivacyPolicy ?? true;
  const privacyPolicyLabel = data.privacyPolicyLabel || 'Privacy Policy';
  const privacyPolicyLink = data.privacyPolicyLink || '';
  const showTermsOfService = data.showTermsOfService ?? true;
  const termsOfServiceLabel = data.termsOfServiceLabel || 'Terms of Service';
  const termsOfServiceLink = data.termsOfServiceLink || '';

  const getHref = (link: string, urlKey?: string) => {
    if (link === 'external' && urlKey) return data[urlKey] || '#';
    return link || '#';
  };

  return (
    <footer 
      className="border-t py-20 px-6 text-sm transition-colors"
      style={{ 
        backgroundColor: backgroundColor || '#fafafa',
        borderColor: textColor ? `${textColor}20` : '#e5e5e5'
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="col-span-2 lg:col-span-2">
          <h3 className="font-bold text-xl mb-6" style={{ color: textColor || '#171717' }}>{storeName}</h3>
          <p className="max-w-sm mb-6 leading-relaxed" style={{ color: textColor ? `${textColor}99` : '#737373' }}>
            {tagline}
          </p>
          {showPaymentBadges && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: textColor ? `${textColor}30` : '#e5e5e5', backgroundColor: backgroundColor || '#ffffff' }}>
                <span className="font-bold text-[10px]" style={{ color: textColor || '#171717' }}>VISA</span>
              </div>
              <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: textColor ? `${textColor}30` : '#e5e5e5', backgroundColor: backgroundColor || '#ffffff' }}>
                <span className="font-bold text-[10px]" style={{ color: textColor || '#171717' }}>MC</span>
              </div>
              <div className="w-8 h-8 rounded border flex items-center justify-center" style={{ borderColor: textColor ? `${textColor}30` : '#e5e5e5', backgroundColor: backgroundColor || '#ffffff' }}>
                <span className="font-bold text-[10px]" style={{ color: textColor || '#171717' }}>PAY</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold mb-4" style={{ color: textColor || '#171717' }}>{shopTitle}</h4>
          <ul className="space-y-3" style={{ color: textColor ? `${textColor}99` : '#737373' }}>
            {shopLinks.map((item: any, i: number) => (
              <li key={i}><a href={item.link || '#'} className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>{item.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4" style={{ color: textColor || '#171717' }}>{companyTitle}</h4>
          <ul className="space-y-3" style={{ color: textColor ? `${textColor}99` : '#737373' }}>
            {companyLinks.map((item: any, i: number) => (
              <li key={i}><a href={item.link || '#'} className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>{item.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4" style={{ color: textColor || '#171717' }}>{supportTitle}</h4>
          <ul className="space-y-3" style={{ color: textColor ? `${textColor}99` : '#737373' }}>
            {supportLinks.map((item: any, i: number) => (
              <li key={i}><a href={item.link || '#'} className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>{item.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t flex flex-col md:flex-row justify-between text-xs" style={{ borderColor: textColor ? `${textColor}20` : '#e5e5e5', color: textColor ? `${textColor}80` : '#a3a3a3' }}>
        <p>{copyrightText}</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          {showPrivacyPolicy && <a href={getHref(privacyPolicyLink, 'privacyPolicyLinkUrl')} className="hover:opacity-80">{privacyPolicyLabel}</a>}
          {showTermsOfService && <a href={getHref(termsOfServiceLink, 'termsOfServiceLinkUrl')} className="hover:opacity-80">{termsOfServiceLabel}</a>}
        </div>
      </div>
    </footer>
  );
};

// 3. Newsletter (Conversion Focused)
export const FooterNewsletter: React.FC<FooterProps> = ({ storeName, primaryColor, backgroundColor, textColor, accentColor }) => (
  <footer className="py-24 px-6 transition-colors" style={{ backgroundColor: backgroundColor || '#000000' }}>
    <div className="max-w-4xl mx-auto text-center">
      <Mail size={48} className="mx-auto mb-6" style={{ color: textColor ? `${textColor}50` : '#404040' }} />
      <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: textColor || '#ffffff' }}>Don't miss the drop.</h2>
      <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
        Join 50,000+ subscribers getting exclusive access to new releases, secret sales, and design insights.
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-16">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="flex-1 rounded-lg px-6 py-4 focus:outline-none transition-colors"
          style={{ 
            backgroundColor: textColor ? `${textColor}15` : 'rgba(255,255,255,0.1)',
            borderWidth: '1px',
            borderColor: textColor ? `${textColor}30` : 'rgba(255,255,255,0.2)',
            color: textColor || '#ffffff'
          }}
        />
        <button 
          className="px-8 py-4 font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ 
            backgroundColor: accentColor || primaryColor || '#ffffff', 
            color: backgroundColor || '#000000'
          }}
        >
          Subscribe
        </button>
      </div>

      <div className="flex justify-center gap-8 border-t pt-12 text-sm font-medium" style={{ borderColor: textColor ? `${textColor}20` : 'rgba(255,255,255,0.1)', color: textColor ? `${textColor}80` : '#737373' }}>
        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#ffffff' }}>Instagram</a>
        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#ffffff' }}>Twitter</a>
        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#ffffff' }}>TikTok</a>
        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#ffffff' }}>YouTube</a>
      </div>
      <p className="mt-8 text-xs" style={{ color: textColor ? `${textColor}50` : '#525252' }}>&copy; 2024 {storeName}.</p>
    </div>
  </footer>
);

// 4. Sitemap (Information Dense)
export const FooterSitemap: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor }) => (
  <footer 
    className="py-16 px-6 text-sm border-t-4 transition-colors" 
    style={{ 
      backgroundColor: backgroundColor || '#171717',
      borderTopColor: accentColor || '#2563eb'
    }}
  >
     <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
        <div className="col-span-2 lg:col-span-2 pr-8">
           <div className="font-bold text-2xl mb-6" style={{ color: textColor || '#ffffff' }}>{storeName}</div>
           <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
              <Globe size={14} /> 
              <span>Region: United States (USD $)</span>
           </div>
           <div className="flex items-center gap-2 text-xs" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
              <ShieldCheck size={14} /> 
              <span>Secure Checkout via Evolv Pass</span>
           </div>
        </div>
        
        <div>
           <h4 className="font-bold mb-4" style={{ color: textColor || '#ffffff' }}>Products</h4>
           <ul className="space-y-2" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>New Arrivals</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Best Sellers</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Trends</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Gift Cards</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Sale</li>
           </ul>
        </div>

        <div>
           <h4 className="font-bold mb-4" style={{ color: textColor || '#ffffff' }}>Collections</h4>
           <ul className="space-y-2" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Summer 2024</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Cyber Tech</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Minimalist</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Accessories</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Home</li>
           </ul>
        </div>

        <div>
           <h4 className="font-bold mb-4" style={{ color: textColor || '#ffffff' }}>Support</h4>
           <ul className="space-y-2" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Help Center</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Track Order</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Returns</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Shipping Info</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Contact Us</li>
           </ul>
        </div>

        <div>
           <h4 className="font-bold mb-4" style={{ color: textColor || '#ffffff' }}>Legal</h4>
           <ul className="space-y-2" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Terms</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Privacy</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Cookies</li>
              <li className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>Licenses</li>
           </ul>
        </div>
     </div>
     
     <div className="max-w-7xl mx-auto pt-8 border-t flex justify-center" style={{ borderColor: textColor ? `${textColor}20` : '#262626' }}>
        <p className="text-xs" style={{ color: textColor ? `${textColor}50` : '#525252' }}>&copy; 2024 Evolv Commerce Operating System. Powered by React.</p>
     </div>
  </footer>
);

export const FOOTER_COMPONENTS = {
  minimal: FooterMinimal,
  columns: FooterColumns,
  newsletter: FooterNewsletter,
  sitemap: FooterSitemap
};

export const FOOTER_OPTIONS = [
  { id: 'minimal', name: 'Minimal', description: 'Clean & Simple', date: '2024-01-01', popularity: 80 },
  { id: 'columns', name: 'Columns', description: 'Standard Ecommerce', date: '2024-02-15', popularity: 95 },
  { id: 'newsletter', name: 'Newsletter', description: 'Conversion Focused', date: '2024-05-20', popularity: 85 },
  { id: 'sitemap', name: 'Sitemap', description: 'Information Dense', date: '2024-04-05', popularity: 60 },
];

export const FOOTER_FIELDS: Record<string, string[]> = {
  minimal: ['copyrightText', 'termsLabel', 'privacyLabel', 'contactLabel', 'showInstagram', 'showTwitter'],
  columns: ['tagline', 'copyrightText', 'shopColumnTitle', 'companyColumnTitle', 'supportColumnTitle'],
  newsletter: ['heading', 'subheading', 'buttonText', 'copyrightText', 'instagramLabel', 'twitterLabel', 'tiktokLabel', 'youtubeLabel'],
  sitemap: ['regionText', 'copyrightText', 'productsColumnTitle', 'collectionsColumnTitle', 'supportColumnTitle', 'legalColumnTitle'],
};
