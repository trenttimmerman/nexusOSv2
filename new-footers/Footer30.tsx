import React, { useEffect, useRef } from 'react';

// Declare gsap and ScrollTrigger to avoid TypeScript errors for CDN-loaded libraries
declare const gsap: any;
declare const ScrollTrigger: any;

const Footer30: React.FC = () => {
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('GSAP or ScrollTrigger not loaded for Footer 30');
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
        height: '120%', // Make taller to avoid gaps during transform
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }

    return (
        <footer ref={footerRef} className="relative bg-gray-900 text-white h-96 overflow-hidden">
            <div 
                className="parallax-bg-1"
                style={{
                    ...layerStyle,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1485478333490-0ab438d1a47b?q=80&w=2070&auto=format&fit=crop)',
                    zIndex: 10,
                }}
            />
            <div 
                className="parallax-bg-2"
                style={{
                    ...layerStyle,
                    backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop)',
                    zIndex: 20,
                    backgroundBlendMode: 'multiply',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                }}
            />
            
            <div className="relative z-30 max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center p-4">
                <h2 className="text-4xl font-bold" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>Explore the Horizon</h2>
                <p className="mt-4 max-w-lg text-lg text-gray-200" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>Our journey continues beyond the peaks.</p>
                <div className="mt-8">
                     <a href="#" className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-md shadow-lg hover:bg-gray-200 transition-colors">
                        Start Exploring
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer30;