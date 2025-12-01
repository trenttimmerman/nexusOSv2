
import React from 'react';
import { Facebook, Twitter, Instagram, ArrowRight, Mail, Send, Globe, ShieldCheck, MapPin } from 'lucide-react';

interface FooterProps {
  storeName: string;
  primaryColor: string;
}

// 1. Minimal (Clean, barely there)
export const FooterMinimal: React.FC<FooterProps> = ({ storeName }) => (
  <footer className="bg-white border-t border-neutral-100 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="font-bold text-lg">{storeName}</div>
      <div className="flex gap-6 text-sm text-neutral-500">
        <a href="#" className="hover:text-black transition-colors">Terms</a>
        <a href="#" className="hover:text-black transition-colors">Privacy</a>
        <a href="#" className="hover:text-black transition-colors">Contact</a>
      </div>
      <div className="flex gap-4">
        <Instagram size={18} className="text-neutral-400 hover:text-black transition-colors" />
        <Twitter size={18} className="text-neutral-400 hover:text-black transition-colors" />
      </div>
    </div>
  </footer>
);

// 2. Columns (Standard E-commerce)
export const FooterColumns: React.FC<FooterProps> = ({ storeName, primaryColor }) => (
  <footer className="bg-neutral-50 border-t border-neutral-200 py-20 px-6 text-sm">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
      <div className="col-span-2 lg:col-span-2">
        <h3 className="font-bold text-xl mb-6">{storeName}</h3>
        <p className="text-neutral-500 max-w-sm mb-6 leading-relaxed">
          Designed for the future of commerce. We build tools that empower creators to sell without limits.
        </p>
        <div className="flex gap-2">
           <div className="w-8 h-8 rounded bg-white border border-neutral-200 flex items-center justify-center">
             <span className="font-bold text-[10px]">VISA</span>
           </div>
           <div className="w-8 h-8 rounded bg-white border border-neutral-200 flex items-center justify-center">
             <span className="font-bold text-[10px]">MC</span>
           </div>
           <div className="w-8 h-8 rounded bg-white border border-neutral-200 flex items-center justify-center">
             <span className="font-bold text-[10px]">PAY</span>
           </div>
        </div>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-neutral-900">Shop</h4>
        <ul className="space-y-3 text-neutral-500">
          <li className="hover:text-black cursor-pointer">New Arrivals</li>
          <li className="hover:text-black cursor-pointer">Best Sellers</li>
          <li className="hover:text-black cursor-pointer">Accessories</li>
          <li className="hover:text-black cursor-pointer">Sale</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-neutral-900">Company</h4>
        <ul className="space-y-3 text-neutral-500">
          <li className="hover:text-black cursor-pointer">About Us</li>
          <li className="hover:text-black cursor-pointer">Careers</li>
          <li className="hover:text-black cursor-pointer">Press</li>
          <li className="hover:text-black cursor-pointer">Sustainability</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-neutral-900">Support</h4>
        <ul className="space-y-3 text-neutral-500">
          <li className="hover:text-black cursor-pointer">Help Center</li>
          <li className="hover:text-black cursor-pointer">Returns</li>
          <li className="hover:text-black cursor-pointer">Shipping</li>
          <li className="hover:text-black cursor-pointer">Contact</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between text-xs text-neutral-400">
      <p>&copy; 2024 {storeName} Inc. All rights reserved.</p>
      <div className="flex gap-4 mt-4 md:mt-0">
         <span>Privacy Policy</span>
         <span>Terms of Service</span>
      </div>
    </div>
  </footer>
);

// 3. Newsletter (Conversion Focused)
export const FooterNewsletter: React.FC<FooterProps> = ({ storeName, primaryColor }) => (
  <footer className="bg-black text-white py-24 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <Mail size={48} className="mx-auto mb-6 text-neutral-700" />
      <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Don't miss the drop.</h2>
      <p className="text-neutral-400 text-lg mb-10 max-w-lg mx-auto">
        Join 50,000+ subscribers getting exclusive access to new releases, secret sales, and design insights.
      </p>
      
      <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-16">
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-6 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
        />
        <button 
          className="px-8 py-4 text-black font-bold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
          style={{ backgroundColor: primaryColor === '#000000' ? '#ffffff' : primaryColor }}
        >
          Subscribe
        </button>
      </div>

      <div className="flex justify-center gap-8 border-t border-white/10 pt-12 text-sm text-neutral-500 font-medium">
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
        <a href="#" className="hover:text-white transition-colors">Twitter</a>
        <a href="#" className="hover:text-white transition-colors">TikTok</a>
        <a href="#" className="hover:text-white transition-colors">YouTube</a>
      </div>
      <p className="mt-8 text-xs text-neutral-600">&copy; 2024 {storeName}.</p>
    </div>
  </footer>
);

// 4. Brand (Typography Heavy)
export const FooterBrand: React.FC<FooterProps> = ({ storeName }) => (
  <footer className="bg-[#f0f0f0] pt-24 pb-8 px-6 overflow-hidden">
    <div className="max-w-7xl mx-auto mb-24 grid grid-cols-1 md:grid-cols-2 gap-12">
       <div>
          <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Headquarters</span>
          <p className="text-xl font-medium leading-relaxed">
             100 Nexus Way<br/>
             Floor 24, Suite 100<br/>
             New York, NY 10012
          </p>
       </div>
       <div className="flex flex-col md:items-end">
          <span className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Connect</span>
          <a href="mailto:hello@nexus.com" className="text-xl font-medium hover:underline mb-2">hello@{storeName.toLowerCase()}.com</a>
          <p className="text-xl font-medium">+1 (555) 000-0000</p>
       </div>
    </div>
    
    <div className="border-t border-neutral-300 pt-8 mb-4 flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
       <span>Based in NYC</span>
       <span>Worldwide Shipping</span>
    </div>
    
    <h1 className="text-[15vw] leading-none font-black tracking-tighter text-neutral-300 select-none text-center md:text-left">
       {storeName.toUpperCase()}
    </h1>
  </footer>
);

// 5. Sitemap (Information Dense)
export const FooterSitemap: React.FC<FooterProps> = ({ storeName }) => (
  <footer className="bg-neutral-900 text-neutral-400 py-16 px-6 text-sm border-t-4 border-blue-600">
     <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
        <div className="col-span-2 lg:col-span-2 pr-8">
           <div className="text-white font-bold text-2xl mb-6">{storeName}</div>
           <div className="flex items-center gap-2 mb-4 text-xs">
              <Globe size={14} /> 
              <span>Region: United States (USD $)</span>
           </div>
           <div className="flex items-center gap-2 text-xs">
              <ShieldCheck size={14} /> 
              <span>Secure Checkout via Nexus Pass</span>
           </div>
        </div>
        
        <div>
           <h4 className="text-white font-bold mb-4">Products</h4>
           <ul className="space-y-2">
              <li className="hover:text-blue-500 cursor-pointer">New Arrivals</li>
              <li className="hover:text-blue-500 cursor-pointer">Best Sellers</li>
              <li className="hover:text-blue-500 cursor-pointer">Trends</li>
              <li className="hover:text-blue-500 cursor-pointer">Gift Cards</li>
              <li className="hover:text-blue-500 cursor-pointer">Sale</li>
           </ul>
        </div>

        <div>
           <h4 className="text-white font-bold mb-4">Collections</h4>
           <ul className="space-y-2">
              <li className="hover:text-blue-500 cursor-pointer">Summer 2024</li>
              <li className="hover:text-blue-500 cursor-pointer">Cyber Tech</li>
              <li className="hover:text-blue-500 cursor-pointer">Minimalist</li>
              <li className="hover:text-blue-500 cursor-pointer">Accessories</li>
              <li className="hover:text-blue-500 cursor-pointer">Home</li>
           </ul>
        </div>

        <div>
           <h4 className="text-white font-bold mb-4">Support</h4>
           <ul className="space-y-2">
              <li className="hover:text-blue-500 cursor-pointer">Help Center</li>
              <li className="hover:text-blue-500 cursor-pointer">Track Order</li>
              <li className="hover:text-blue-500 cursor-pointer">Returns</li>
              <li className="hover:text-blue-500 cursor-pointer">Shipping Info</li>
              <li className="hover:text-blue-500 cursor-pointer">Contact Us</li>
           </ul>
        </div>

        <div>
           <h4 className="text-white font-bold mb-4">Legal</h4>
           <ul className="space-y-2">
              <li className="hover:text-blue-500 cursor-pointer">Terms</li>
              <li className="hover:text-blue-500 cursor-pointer">Privacy</li>
              <li className="hover:text-blue-500 cursor-pointer">Cookies</li>
              <li className="hover:text-blue-500 cursor-pointer">Licenses</li>
           </ul>
        </div>
     </div>
     
     <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-800 flex justify-center">
        <p className="text-xs opacity-50">&copy; 2024 Nexus Commerce Operating System. Powered by React.</p>
     </div>
  </footer>
);

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
