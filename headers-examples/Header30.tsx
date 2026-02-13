import React, { useEffect, useRef } from 'react';

// Declare gsap and ScrollTrigger to avoid TypeScript errors for CDN-loaded libraries
declare const gsap: any;
declare const ScrollTrigger: any;

const Header30: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !headerRef.current) return;

        gsap.registerPlugin(ScrollTrigger);
        
        const ctx = gsap.context(() => {
            gsap.to('.parallax-bg-1', {
                yPercent: 15, ease: 'none',
                scrollTrigger: { trigger: headerRef.current, scrub: 1.5, start: 'top top', end: 'bottom top' }
            });
            gsap.to('.parallax-bg-2', {
                yPercent: 30, ease: 'none',
                scrollTrigger: { trigger: headerRef.current, scrub: 1.5, start: 'top top', end: 'bottom top' }
            });
            gsap.to('.header-content', {
                yPercent: 50, opacity: 0, ease: 'none',
                scrollTrigger: { trigger: headerRef.current, scrub: 1.5, start: 'top top', end: '80% top' }
            });
            
            // Animate to sticky nav
             ScrollTrigger.create({
                trigger: headerRef.current,
                start: 'bottom top',
                end: 'bottom top',
                onEnter: () => gsap.to('.sticky-nav', { y: 0, autoAlpha: 1 }),
                onLeaveBack: () => gsap.to('.sticky-nav', { y: '-100%', autoAlpha: 0 })
            });

        }, headerRef);

        return () => ctx.revert();
    }, []);

    const layerStyle: React.CSSProperties = {
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '120%', // Extra height to prevent gaps
        backgroundSize: 'cover', backgroundPosition: 'center',
    };

    return (
        <>
            <header ref={headerRef} className="relative h-screen bg-gray-900 text-white overflow-hidden">
                <div className="parallax-bg-1" style={{...layerStyle, backgroundImage: 'url(https://images.unsplash.com/photo-1485478333490-0ab438d1a47b?q=80&w=2070&auto=format&fit=crop)', zIndex: 10, bottom: 0 }} />
                <div className="parallax-bg-2" style={{...layerStyle, backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop)', zIndex: 20, backgroundBlendMode: 'multiply', backgroundColor: 'rgba(0,0,0,0.3)', bottom: 0 }} />
                
                <div className="header-content relative z-30 h-full flex flex-col justify-center items-center text-center p-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>HORIZON</h1>
                    <p className="mt-4 max-w-lg text-lg text-gray-200" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>Discover new peaks.</p>
                </div>
            </header>
            
            <div className="sticky-nav fixed top-0 left-0 w-full z-50 transform -translate-y-full invisible bg-white/80 backdrop-blur-md shadow-md">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex justify-between items-center h-16">
                         <a href="#" className="text-xl font-bold text-gray-800">HORIZON</a>
                         <nav className="flex space-x-6 text-sm font-medium text-gray-600">
                             <a href="#" className="hover:text-black">Peaks</a>
                             <a href="#" className="hover:text-black">Valleys</a>
                             <a href="#" className="hover:text-black">Journeys</a>
                         </nav>
                     </div>
                 </div>
            </div>
        </>
    );
};

export default Header30;