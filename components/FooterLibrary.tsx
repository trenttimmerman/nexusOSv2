
import React, { useEffect, useRef } from 'react';
import { Facebook, Twitter, Instagram, ArrowRight, Mail, Send, Globe, ShieldCheck, MapPin, Search, User, ShoppingBag } from 'lucide-react';

// Declare gsap and ScrollTrigger for CDN-loaded libraries
declare const gsap: any;
declare const ScrollTrigger: any;
// Declare THREE for CDN-loaded Three.js
declare const THREE: any;

interface FooterProps {
  storeName: string;
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  data?: Record<string, any>;
}

type FooterData = Record<string, any>;

// 1. Minimal (Clean, barely there)
export const FooterMinimal: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  const showSearch = data.showSearch ?? false;
  const showAccount = data.showAccount ?? false;
  const showCart = data.showCart ?? false;
  const showInstagram = data.showInstagram ?? true;
  const showTwitter = data.showTwitter ?? true;
  
  // Dynamic footer links array
  const footerLinks = data.footerLinks || [
    { label: 'Terms', link: '' },
    { label: 'Privacy', link: '' },
    { label: 'Contact', link: '' }
  ];
  
  // Get link URL (support both page slugs and external URLs)
  const getHref = (item: any) => {
    if (item.link === 'external') return item.externalUrl || '#';
    return item.link || '#';
  };
  
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
          {footerLinks.map((item: any, idx: number) => (
            <a key={idx} href={getHref(item)} className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#737373' }}>{item.label}</a>
          ))}
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
export const FooterColumns: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
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
export const FooterNewsletter: React.FC<FooterProps> = ({ storeName, primaryColor, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  const heading = data.heading || "Don't miss the drop.";
  const subheading = data.subheading || 'Join 50,000+ subscribers getting exclusive access to new releases, secret sales, and design insights.';
  const buttonText = data.buttonText || 'Subscribe';
  const placeholderText = data.placeholderText || 'Enter your email';
  const copyrightText = data.copyrightText || `© 2024 ${storeName}.`;
  
  // Dynamic social links array
  const socialLinks = data.socialLinks || [
    { label: 'Instagram', link: '' },
    { label: 'Twitter', link: '' },
    { label: 'TikTok', link: '' },
    { label: 'YouTube', link: '' }
  ];

  const getHref = (item: any) => {
    if (item.link === 'external') return item.externalUrl || '#';
    return item.link || '#';
  };

  return (
    <footer className="py-24 px-6 transition-colors" style={{ backgroundColor: backgroundColor || '#000000' }}>
      <div className="max-w-4xl mx-auto text-center">
        <Mail size={48} className="mx-auto mb-6" style={{ color: textColor ? `${textColor}50` : '#404040' }} />
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight" style={{ color: textColor || '#ffffff' }}>{heading}</h2>
        <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
          {subheading}
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto mb-16">
          <input 
            type="email" 
            placeholder={placeholderText}
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
            {buttonText}
          </button>
        </div>

        <div className="flex justify-center gap-8 border-t pt-12 text-sm font-medium" style={{ borderColor: textColor ? `${textColor}20` : 'rgba(255,255,255,0.1)', color: textColor ? `${textColor}80` : '#737373' }}>
          {socialLinks.map((item: any, idx: number) => (
            <a key={idx} href={getHref(item)} className="hover:opacity-80 transition-opacity" style={{ color: accentColor || textColor || '#ffffff' }}>{item.label}</a>
          ))}
        </div>
        <p className="mt-8 text-xs" style={{ color: textColor ? `${textColor}50` : '#525252' }}>{copyrightText}</p>
      </div>
    </footer>
  );
};

// 4. Sitemap (Information Dense)
export const FooterSitemap: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  const regionText = data.regionText || 'Region: United States (USD $)';
  const showSecurityBadge = data.showSecurityBadge ?? true;
  const securityBadgeText = data.securityBadgeText || 'Secure Checkout via Evolv Pass';
  const copyrightText = data.copyrightText || '© 2024 Evolv Commerce Operating System. Powered by React.';
  
  // Column 1: Products
  const col1Title = data.col1Title || 'Products';
  const col1Links = data.col1Links || [
    { label: 'New Arrivals', link: '' },
    { label: 'Best Sellers', link: '' },
    { label: 'Trends', link: '' },
    { label: 'Gift Cards', link: '' },
    { label: 'Sale', link: '' }
  ];
  
  // Column 2: Collections
  const col2Title = data.col2Title || 'Collections';
  const col2Links = data.col2Links || [
    { label: 'Summer 2024', link: '' },
    { label: 'Cyber Tech', link: '' },
    { label: 'Minimalist', link: '' },
    { label: 'Accessories', link: '' },
    { label: 'Home', link: '' }
  ];
  
  // Column 3: Support
  const col3Title = data.col3Title || 'Support';
  const col3Links = data.col3Links || [
    { label: 'Help Center', link: '' },
    { label: 'Track Order', link: '' },
    { label: 'Returns', link: '' },
    { label: 'Shipping Info', link: '' },
    { label: 'Contact Us', link: '' }
  ];
  
  // Column 4: Legal
  const col4Title = data.col4Title || 'Legal';
  const col4Links = data.col4Links || [
    { label: 'Terms', link: '' },
    { label: 'Privacy', link: '' },
    { label: 'Cookies', link: '' },
    { label: 'Licenses', link: '' }
  ];
  
  const getHref = (link: string) => link || '#';

  const renderColumn = (title: string, links: Array<{label: string, link: string}>) => (
    <div>
      <h4 className="font-bold mb-4" style={{ color: textColor || '#ffffff' }}>{title}</h4>
      <ul className="space-y-2" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
        {links.map((item, idx) => (
          <li key={idx}>
            <a href={getHref(item.link)} className="hover:opacity-80 cursor-pointer" style={{ color: accentColor || undefined }}>{item.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
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
                <span>{regionText}</span>
             </div>
             {showSecurityBadge && (
               <div className="flex items-center gap-2 text-xs" style={{ color: textColor ? `${textColor}99` : '#a3a3a3' }}>
                  <ShieldCheck size={14} /> 
                  <span>{securityBadgeText}</span>
               </div>
             )}
          </div>
          
          {renderColumn(col1Title, col1Links)}
          {renderColumn(col2Title, col2Links)}
          {renderColumn(col3Title, col3Links)}
          {renderColumn(col4Title, col4Links)}
       </div>
       
       <div className="max-w-7xl mx-auto pt-8 border-t flex justify-center" style={{ borderColor: textColor ? `${textColor}20` : '#262626' }}>
          <p className="text-xs" style={{ color: textColor ? `${textColor}50` : '#525252' }}>{copyrightText}</p>
       </div>
    </footer>
  );
};

// 5. Origami (Animated Fold-In Panels)
export const FooterOrigami: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  const footerRef = useRef<HTMLElement>(null);
  
  // Header panel
  const heading = data.heading || "Let's Connect";
  const subheading = data.subheading || "We're always open to new ideas and collaborations.";
  const copyrightText = data.copyrightText || `© ${new Date().getFullYear()} ${storeName}. All rights reserved.`;
  
  // Column 1
  const col1Title = data.col1Title || 'Product';
  const col1Links = data.col1Links || [
    { label: 'Features', link: '' },
    { label: 'Pricing', link: '' }
  ];
  
  // Column 2
  const col2Title = data.col2Title || 'Company';
  const col2Links = data.col2Links || [
    { label: 'About Us', link: '' },
    { label: 'Blog', link: '' }
  ];
  
  // Column 3
  const col3Title = data.col3Title || 'Social';
  const col3Links = data.col3Links || [
    { label: 'Twitter', link: '' },
    { label: 'LinkedIn', link: '' }
  ];
  
  // Column 4
  const col4Title = data.col4Title || 'Legal';
  const col4Links = data.col4Links || [
    { label: 'Privacy', link: '' },
    { label: 'Terms', link: '' }
  ];
  
  const getHref = (link: string) => link || '#';
  
  useEffect(() => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded for Origami footer');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.origami-panel', footer);
      
      gsap.set(panels, { autoAlpha: 0, rotationX: 90, transformOrigin: 'top center' });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top bottom-=150',
          toggleActions: 'play none none reverse',
        }
      });

      tl.to(panels, {
        autoAlpha: 1,
        rotationX: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
      });

    }, footer);

    return () => ctx.revert();
  }, []);

  const renderColumn = (title: string, links: Array<{label: string, link: string}>) => (
    <div>
      <h4 className="font-semibold" style={{ color: textColor || '#111827' }}>{title}</h4>
      <ul className="mt-3 space-y-2 text-sm" style={{ color: textColor ? `${textColor}99` : '#4B5563' }}>
        {links.map((item, idx) => (
          <li key={idx}>
            <a href={getHref(item.link)} className="hover:opacity-80 transition-opacity" style={{ color: accentColor || undefined }}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer ref={footerRef} style={{ perspective: '1000px', backgroundColor: backgroundColor || '#F3F4F6' }}>
      {/* Header Panel */}
      <div className="origami-panel border-b" style={{ backgroundColor: textColor ? `${textColor}05` : '#ffffff', borderColor: textColor ? `${textColor}15` : '#E5E7EB' }}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold" style={{ color: textColor || '#111827' }}>{heading}</h2>
          <p className="mt-2" style={{ color: textColor ? `${textColor}99` : '#4B5563' }}>{subheading}</p>
        </div>
      </div>
      
      {/* Links Panel */}
      <div className="origami-panel" style={{ backgroundColor: textColor ? `${textColor}05` : '#ffffff' }}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-sm">
            {renderColumn(col1Title, col1Links)}
            {renderColumn(col2Title, col2Links)}
            {renderColumn(col3Title, col3Links)}
            {renderColumn(col4Title, col4Links)}
          </div>
        </div>
      </div>
      
      {/* Copyright Panel */}
      <div className="origami-panel" style={{ backgroundColor: backgroundColor || '#F9FAFB' }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-xs" style={{ color: textColor ? `${textColor}60` : '#6B7280' }}>
          <p>{copyrightText}</p>
        </div>
      </div>
    </footer>
  );
};

// 6. DataScape (3D Terrain Visualization)
export const FooterDataScape: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  
  const copyrightText = data.copyrightText || `© ${new Date().getFullYear()} All rights reserved.`;
  
  // Dynamic nav links array
  const navLinks = data.navLinks || [
    { label: 'API', link: '' },
    { label: 'Status', link: '' },
    { label: 'Docs', link: '' }
  ];

  const getHref = (item: any) => {
    if (item.link === 'external') return item.externalUrl || '#';
    return item.link || '#';
  };

  useEffect(() => {
    if (!mountRef.current) return;
    if (typeof THREE === 'undefined') {
      console.warn('Three.js not loaded for DataScape footer');
      return;
    }
    
    const currentMount = mountRef.current;
    let animationFrameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.offsetWidth / currentMount.offsetHeight, 0.1, 1000);
    camera.position.set(0, 3, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.offsetWidth, currentMount.offsetHeight);
    currentMount.appendChild(renderer.domElement);
    
    const planeSize = 20;
    const segments = 100;
    const geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
    
    const vertices: number[] = [];
    const colors: number[] = [];
    
    // Parse colors from props or use defaults
    const baseColorHex = backgroundColor || '#083344';
    const peakColorHex = accentColor || '#67e8f9';
    const baseColor = new THREE.Color(baseColorHex);
    const peakColor = new THREE.Color(peakColorHex);
    
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const x = geometry.attributes.position.getX(i);
      const y = geometry.attributes.position.getY(i);
      const z = (Math.sin(x * 0.5) * Math.cos(y * 0.5)) + (Math.sin(x * 1.5) * 0.2);
      vertices.push(x, z, -y);

      const color = new THREE.Color();
      const alpha = (z + 1.2) / 2.4;
      color.lerpColors(baseColor, peakColor, alpha);
      colors.push(color.r, color.g, color.b);
    }

    const newGeo = new THREE.BufferGeometry();
    newGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    newGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({ 
      size: 0.05, 
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const points = new THREE.Points(newGeo, material);
    scene.add(points);

    let clock = 0;
    
    const animate = () => {
      clock += 0.002;
      points.rotation.y = clock;

      const colorAttribute = points.geometry.attributes.color as THREE.BufferAttribute;
      const positionAttribute = points.geometry.attributes.position as THREE.BufferAttribute;
      
      for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
        const screenPos = vertex.clone().project(camera);
        
        const distance = Math.sqrt(Math.pow(screenPos.x - mousePos.current.x, 2) + Math.pow(screenPos.y - mousePos.current.y, 2));

        const z = positionAttribute.getY(i);
        const alpha = (z + 1.2) / 2.4;
        const base = new THREE.Color().lerpColors(baseColor, peakColor, alpha);

        const highlightIntensity = Math.max(0, 1 - distance * 2);
        const finalColor = base.lerp(new THREE.Color('white'), highlightIntensity);
        
        colorAttribute.setXYZ(i, finalColor.r, finalColor.g, finalColor.b);
      }
      colorAttribute.needsUpdate = true;
      
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.offsetWidth / currentMount.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.offsetWidth, currentMount.offsetHeight);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      newGeo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [backgroundColor, accentColor]);

  return (
    <footer className="relative h-96 flex flex-col justify-end" style={{ backgroundColor: '#000000' }}>
      <div ref={mountRef} className="absolute inset-0 z-0"></div>
      <div className="relative z-10 max-w-7xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold" style={{ color: textColor || '#ffffff' }}>{storeName}</h3>
          <p className="text-sm" style={{ color: textColor ? `${textColor}60` : '#6B7280' }}>{copyrightText}</p>
        </div>
        <div className="flex space-x-6 text-sm" style={{ color: textColor ? `${textColor}99` : '#9CA3AF' }}>
          {navLinks.map((item: any, idx: number) => (
            <a key={idx} href={getHref(item)} className="hover:text-white transition-colors">{item.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// 7. Kinetic (Animated Text Links)
const AnimatedLink: React.FC<{ text: string; href: string; textColor?: string; accentColor?: string }> = ({ text, href, textColor, accentColor }) => {
  return (
    <a 
      href={href} 
      className="block overflow-hidden relative text-4xl md:text-6xl font-extrabold transition-colors duration-300 group"
      style={{ color: textColor || '#1F2937' }}
    >
      <span className="inline-block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
        {text.split('').map((char, i) => (
          <span key={i} className="inline-block transition-transform duration-500 ease-in-out" style={{ transitionDelay: `${i * 30}ms` }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      <span className="inline-block absolute left-0 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0">
        {text.split('').map((char, i) => (
          <span key={i} className="inline-block transition-transform duration-500 ease-in-out" style={{ transitionDelay: `${i * 30}ms`, color: accentColor || '#4F46E5' }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </a>
  );
};

export const FooterKinetic: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  
  const copyrightText = data.copyrightText || `© ${new Date().getFullYear()} ${storeName}.`;
  
  // Dynamic animated links array
  const animatedLinks = data.animatedLinks || [
    { label: 'Our Work', link: '' },
    { label: 'About Us', link: '' },
    { label: 'Get In Touch', link: '' }
  ];
  
  // Dynamic social links array
  const socialLinks = data.socialLinks || [
    { label: 'Twitter', link: '' },
    { label: 'LinkedIn', link: '' }
  ];

  const getHref = (item: any) => {
    if (item.link === 'external') return item.externalUrl || '#';
    return item.link || '#';
  };

  return (
    <footer className="py-24 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: backgroundColor || '#F3F4F6' }}>
      <div className="max-w-7xl mx-auto">
        <nav className="space-y-4">
          {animatedLinks.map((item: any, idx: number) => (
            <AnimatedLink key={idx} text={item.label} href={getHref(item)} textColor={textColor} accentColor={accentColor} />
          ))}
        </nav>
        <div className="mt-16 pt-8 border-t flex justify-between items-center text-sm" style={{ borderColor: textColor ? `${textColor}30` : '#D1D5DB', color: textColor ? `${textColor}70` : '#6B7280' }}>
          <p>{copyrightText}</p>
          <div className="flex space-x-4">
            {socialLinks.map((item: any, idx: number) => (
              <a key={idx} href={getHref(item)} className="hover:opacity-80 transition-opacity" style={{ color: textColor || '#111827' }}>{item.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// 8. Parallax (Mountain Layers)
export const FooterParallax: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  const footerRef = useRef<HTMLElement>(null);
  
  const heading = data.heading || 'Explore the Horizon';
  const subheading = data.subheading || 'Our journey continues beyond the peaks.';
  const buttonText = data.buttonText || 'Start Exploring';
  const buttonUrl = data.buttonUrl || '';
  const showButton = data.showButton ?? true;
  
  const bgImage1 = data.bgImage1 || 'https://images.unsplash.com/photo-1485478333490-0ab438d1a47b?q=80&w=2070&auto=format&fit=crop';
  const bgImage2 = data.bgImage2 || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop';

  // Dynamic nav links array
  const navLinks = data.navLinks || [
    { label: 'Home', link: '' },
    { label: 'About', link: '' },
    { label: 'Contact', link: '' }
  ];

  const getHref = (item: any) => {
    if (item.link === 'external') return item.externalUrl || '#';
    return item.link || '#';
  };

  useEffect(() => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded for Parallax footer');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.parallax-bg-1', 
        { yPercent: -10 }, 
        { 
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
      gsap.fromTo('.parallax-bg-2', 
        { yPercent: -25 },
        {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  const layerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '120%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <footer ref={footerRef} className="relative h-96 overflow-hidden" style={{ backgroundColor: backgroundColor || '#111827' }}>
      <div 
        className="parallax-bg-1"
        style={{
          ...layerStyle,
          backgroundImage: `url(${bgImage1})`,
          zIndex: 10,
        }}
      />
      <div 
        className="parallax-bg-2"
        style={{
          ...layerStyle,
          backgroundImage: `url(${bgImage2})`,
          zIndex: 20,
          backgroundBlendMode: 'multiply',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      />
      
      <div className="relative z-30 max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-4xl font-bold" style={{ color: textColor || '#ffffff', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>{heading}</h2>
        <p className="mt-4 max-w-lg text-lg" style={{ color: textColor ? `${textColor}cc` : '#E5E7EB', textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>{subheading}</p>
        {showButton && (
          <div className="mt-8">
            <a href={buttonUrl || '#'} className="px-6 py-3 font-semibold rounded-md shadow-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: accentColor || '#ffffff', color: backgroundColor || '#111827' }}>
              {buttonText}
            </a>
          </div>
        )}
        {/* Navigation Links */}
        {navLinks.length > 0 && (
          <div className="mt-8 flex gap-6 text-sm">
            {navLinks.map((item: any, idx: number) => (
              <a key={idx} href={getHref(item)} className="hover:opacity-80 transition-opacity" style={{ color: textColor || '#ffffff', textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>{item.label}</a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

// 9. Gooey (Blob Animation)
export const FooterGooey: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  
  const heading = data.heading || "Let's Create Something Fluid.";
  const subheading = data.subheading || 'We believe in adaptable, dynamic solutions that flow with your needs.';
  const buttonText = data.buttonText || 'Get in Touch';
  const buttonUrl = data.buttonUrl || '';
  const showButton = data.showButton ?? true;
  
  const blob1Color = data.blob1Color || '#6366F1';
  const blob2Color = data.blob2Color || '#A855F7';
  const blob3Color = data.blob3Color || '#F43F5E';

  // Dynamic nav links array
  const navLinks = data.navLinks || [
    { label: 'Home', link: '' },
    { label: 'About', link: '' },
    { label: 'Contact', link: '' }
  ];

  const getHref = (item: any) => {
    if (item.link === 'external') return item.externalUrl || '#';
    return item.link || '#';
  };

  return (
    <>
      <style>
        {`
        @keyframes blob-anim-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20%, -30%) scale(1.1); }
          50% { transform: translate(-10%, 15%) scale(0.9); }
          75% { transform: translate(30%, 10%) scale(1.05); }
        }
        @keyframes blob-anim-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-15%, 25%) scale(1.1); }
          50% { transform: translate(20%, -20%) scale(0.95); }
          75% { transform: translate(-25%, -10%) scale(1); }
        }
        `}
      </style>
      <footer className="relative overflow-hidden" style={{ backgroundColor: backgroundColor || '#312E81' }}>
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="gooey-footer">
              <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        <div className="absolute inset-0 w-full h-full" style={{ filter: 'url(#gooey-footer)' }}>
          <div 
            className="absolute w-64 h-64 rounded-full"
            style={{
              top: '10%', left: '20%',
              backgroundColor: blob1Color,
              animation: 'blob-anim-1 25s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute w-72 h-72 rounded-full"
            style={{
              top: '40%', left: '60%',
              backgroundColor: blob2Color,
              animation: 'blob-anim-2 20s ease-in-out infinite',
            }}
          />
          <div 
            className="absolute w-48 h-48 rounded-full"
            style={{
              bottom: '10%', left: '40%',
              backgroundColor: blob3Color,
              animation: 'blob-anim-1 22s ease-in-out infinite reverse',
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: textColor || '#ffffff' }}>
            {heading}
          </h2>
          <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: textColor ? `${textColor}cc` : '#C7D2FE' }}>
            {subheading}
          </p>
          {showButton && (
            <div className="mt-8">
              <a href={buttonUrl || '#'} className="inline-block px-8 py-4 font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105" style={{ backgroundColor: accentColor || '#ffffff', color: backgroundColor || '#312E81' }}>
                {buttonText}
              </a>
            </div>
          )}
          {/* Navigation Links */}
          {navLinks.length > 0 && (
            <div className="mt-8 flex justify-center gap-6 text-sm">
              {navLinks.map((item: any, idx: number) => (
                <a key={idx} href={getHref(item)} className="hover:opacity-80 transition-opacity" style={{ color: textColor || '#ffffff' }}>{item.label}</a>
              ))}
            </div>
          )}
        </div>
      </footer>
    </>
  );
};

// 10. Constellation (Interactive Stars)
export const FooterConstellation: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: -9999, y: -9999 });
  
  const heading = data.heading || 'Connect the Dots';
  const subheading = data.subheading || 'Interactive constellation map. Move your mouse.';
  
  // Dynamic nav links array
  const navLinks = data.navLinks || [
    { label: 'Home', link: '' },
    { label: 'About', link: '' },
    { label: 'Contact', link: '' }
  ];

  const getHref = (item: any) => {
    if (item.link === 'external') return item.externalUrl || '#';
    return item.link || '#';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    interface Star { x: number; y: number; radius: number; vx: number; vy: number; }
    let stars: Star[] = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1 + 0.5,
        vx: (Math.random() - 0.5) / 4,
        vy: (Math.random() - 0.5) / 4,
      });
    }
    
    let animationFrameId: number;
    const bgColor = backgroundColor || '#030712';
    const starColor = textColor || '#ffffff';

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = starColor;
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0 || star.x > width) star.vx = -star.vx;
        if (star.y < 0 || star.y > height) star.vy = -star.vy;
      });
      
      const connectRadius = 100;
      const mouseConnectRadius = 150;

      for (let i = 0; i < stars.length; i++) {
        let dMouse = Math.sqrt(Math.pow(mousePos.current.x - stars[i].x, 2) + Math.pow(mousePos.current.y - stars[i].y, 2));
        if (dMouse < mouseConnectRadius) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(mousePos.current.x, mousePos.current.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dMouse / mouseConnectRadius})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        for (let j = i; j < stars.length; j++) {
          let d = Math.sqrt(Math.pow(stars[i].x - stars[j].x, 2) + Math.pow(stars[i].y - stars[j].y, 2));
          if (d < connectRadius) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - d / (connectRadius * 10)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
    };

    const handleMouseOut = () => {
      mousePos.current.x = -9999;
      mousePos.current.y = -9999;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
    };
  }, [backgroundColor, textColor]);

  return (
    <footer className="relative h-80 flex flex-col items-center justify-center" style={{ backgroundColor: backgroundColor || '#030712' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 text-center p-4">
        <h2 className="text-4xl font-bold" style={{ color: textColor || '#ffffff' }}>{heading}</h2>
        <p style={{ color: textColor ? `${textColor}99` : '#D1D5DB' }}>{subheading}</p>
        <div className="mt-6 flex justify-center gap-6 text-sm" style={{ color: textColor || '#ffffff' }}>
          {navLinks.map((item: any, idx: number) => (
            <a key={idx} href={getHref(item)} className="hover:underline">{item.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// 11. Terminal (CRT Retro)
export const FooterTerminal: React.FC<FooterProps> = ({ storeName, backgroundColor, textColor, accentColor, data: dataRaw = {} }) => {
  const data = dataRaw as FooterData;
  
  const systemMessage = data.systemMessage || 'SYSTEM READY.';
  const copyrightText = data.copyrightText || `© ${new Date().getFullYear()} ${storeName}. All operations normal.`;
  const ipAddress = data.ipAddress || '127.0.0.1';
  const userName = data.userName || 'GUEST';
  
  // Nav column
  const col1Title = data.col1Title || '[NAV]';
  const col1Links = data.col1Links || [
    { label: '/home', link: '' },
    { label: '/about', link: '' },
    { label: '/contact', link: '' }
  ];
  
  // Data column
  const col2Title = data.col2Title || '[DATA]';
  const col2Links = data.col2Links || [
    { label: 'API_DOCS', link: '' },
    { label: 'STATUS', link: '' },
    { label: 'RESOURCES', link: '' }
  ];
  
  // Social column
  const col3Title = data.col3Title || '[SOCIAL]';
  const col3Links = data.col3Links || [
    { label: 'TWITTER', link: '' },
    { label: 'GITHUB', link: '' }
  ];

  const getHref = (link: string) => link || '#';
  const terminalColor = accentColor || '#4ade80';

  return (
    <>
      <style>
        {`
        @keyframes crt-flicker {
          0% { opacity: 0.95; }
          50% { opacity: 1; }
          100% { opacity: 0.95; }
        }
        .crt-screen-footer {
          position: relative;
          overflow: hidden;
        }
        .crt-screen-footer::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 3px, 4px 100%;
          z-index: 2;
          pointer-events: none;
        }
        .crt-screen-footer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.9) 100%);
          border-radius: 20px;
          z-index: 3;
          pointer-events: none;
        }
        .crt-content-footer {
          animation: crt-flicker 0.1s infinite;
        }
        `}
      </style>
      <footer className="crt-screen-footer font-mono p-12" style={{ backgroundColor: backgroundColor || '#0c0d0c' }}>
        <div className="crt-content-footer" style={{ color: terminalColor, textShadow: `0 0 5px ${terminalColor}, 0 0 10px ${terminalColor}` }}>
          <p className="text-lg">{systemMessage}</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-bold mb-2">{col1Title}</h4>
              <ul className="space-y-1">
                {col1Links.map((item: any, idx: number) => (
                  <li key={idx}><a href={getHref(item.link)} className="hover:bg-current hover:text-black transition-colors">{item.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">{col2Title}</h4>
              <ul className="space-y-1">
                {col2Links.map((item: any, idx: number) => (
                  <li key={idx}><a href={getHref(item.link)} className="hover:bg-current hover:text-black transition-colors">{item.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">{col3Title}</h4>
              <ul className="space-y-1">
                {col3Links.map((item: any, idx: number) => (
                  <li key={idx}><a href={getHref(item.link)} className="hover:bg-current hover:text-black transition-colors">{item.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p>IP: {ipAddress}</p>
              <p>USER: {userName}</p>
            </div>
          </div>
          <p className="mt-8 text-xs opacity-70">{copyrightText}</p>
        </div>
      </footer>
    </>
  );
};

export const FOOTER_COMPONENTS: Record<string, React.FC<FooterProps>> = {
  minimal: FooterMinimal,
  columns: FooterColumns,
  newsletter: FooterNewsletter,
  sitemap: FooterSitemap,
  origami: FooterOrigami,
  datascape: FooterDataScape,
  kinetic: FooterKinetic,
  parallax: FooterParallax,
  gooey: FooterGooey,
  constellation: FooterConstellation,
  terminal: FooterTerminal
};

export const FOOTER_OPTIONS = [
  { id: 'minimal', name: 'Minimal', description: 'Clean & Simple', date: '2024-01-01', popularity: 80 },
  { id: 'columns', name: 'Columns', description: 'Standard Ecommerce', date: '2024-02-15', popularity: 95 },
  { id: 'newsletter', name: 'Newsletter', description: 'Conversion Focused', date: '2024-05-20', popularity: 85 },
  { id: 'sitemap', name: 'Sitemap', description: 'Information Dense', date: '2024-04-05', popularity: 60 },
  { id: 'origami', name: 'Origami', description: 'Animated Fold-In', date: '2024-06-10', popularity: 75 },
  { id: 'datascape', name: 'DataScape', description: '3D Terrain', date: '2024-07-15', popularity: 70 },
  { id: 'kinetic', name: 'Kinetic', description: 'Animated Text', date: '2024-08-01', popularity: 72 },
  { id: 'parallax', name: 'Parallax', description: 'Mountain Layers', date: '2024-08-15', popularity: 78 },
  { id: 'gooey', name: 'Gooey', description: 'Blob Animation', date: '2024-09-01', popularity: 68 },
  { id: 'constellation', name: 'Constellation', description: 'Interactive Stars', date: '2024-09-15', popularity: 65 },
  { id: 'terminal', name: 'Terminal', description: 'CRT Retro', date: '2024-10-01', popularity: 62 },
];

export const FOOTER_FIELDS: Record<string, string[]> = {
  minimal: ['copyrightText', 'termsLabel', 'privacyLabel', 'contactLabel', 'showInstagram', 'showTwitter'],
  columns: ['tagline', 'copyrightText', 'shopColumnTitle', 'companyColumnTitle', 'supportColumnTitle'],
  newsletter: ['heading', 'subheading', 'buttonText', 'copyrightText', 'instagramLabel', 'twitterLabel', 'tiktokLabel', 'youtubeLabel'],
  sitemap: ['regionText', 'copyrightText', 'productsColumnTitle', 'collectionsColumnTitle', 'supportColumnTitle', 'legalColumnTitle'],
  origami: ['heading', 'subheading', 'copyrightText', 'col1Title', 'col2Title', 'col3Title', 'col4Title'],
  datascape: ['copyrightText', 'link1Label', 'link2Label', 'link3Label'],
  kinetic: ['copyrightText', 'link1Text', 'link2Text', 'link3Text', 'twitterLabel', 'linkedInLabel'],
  parallax: ['heading', 'subheading', 'buttonText', 'bgImage1', 'bgImage2'],
  gooey: ['heading', 'subheading', 'buttonText', 'blob1Color', 'blob2Color', 'blob3Color'],
  constellation: ['heading', 'subheading', 'link1Label', 'link2Label', 'link3Label'],
  terminal: ['systemMessage', 'copyrightText', 'ipAddress', 'userName', 'col1Title', 'col2Title', 'col3Title'],
};
