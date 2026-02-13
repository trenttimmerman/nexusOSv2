import React, { useEffect, useRef } from 'react';

declare const gsap: any;

const Header24: React.FC = () => {
    const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);

    useEffect(() => {
        if (typeof gsap === 'undefined') return;

        // Animate the baseFrequency of the turbulence filter on scroll
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 2,
            }
        });
        
        // Find the filter in the main document
        const turbulenceEl = document.querySelector('#liquid-filter feTurbulence');
        if (turbulenceEl) {
             turbulenceRef.current = turbulenceEl as SVGFETurbulenceElement;
             tl.to(turbulenceRef.current, {
                attr: { baseFrequency: '0.01 0.08' },
                ease: 'power1.inOut'
            });
        }

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <>
            <div className="h-screen bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1617957743097-0d20aa2ea762?w=800&q=80)'}}>
                {/* Dummy hero section */}
            </div>
            <header 
                className="sticky top-0 z-50 h-20"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px) url(#liquid-filter)',
                    WebkitBackdropFilter: 'blur(12px) url(#liquid-filter)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        <a href="#" className="text-2xl font-bold text-white" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.3)'}}>AQUA</a>
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-white">
                             <a href="#" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>Properties</a>
                             <a href="#" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>States</a>
                             <a href="#" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>Forms</a>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header24;