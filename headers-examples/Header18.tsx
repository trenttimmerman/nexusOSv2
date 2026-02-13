import React, { useEffect, useRef } from 'react';

declare const gsap: any;
declare const ScrollTrigger: any;

const Header18: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);
    const topBarRef = useRef<HTMLDivElement>(null);
    const bottomBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !headerRef.current) return;
        
        gsap.registerPlugin(ScrollTrigger);
        
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: '+=150',
                    scrub: 1.5,
                }
            });
            
            tl.from(topBarRef.current, { yPercent: -100, ease: 'none' })
              .from(bottomBarRef.current, { yPercent: 100, ease: 'none' }, '<');

        }, headerRef);

        return () => ctx.revert();
    }, []);

    return (
        <header ref={headerRef} className="fixed top-0 left-0 w-full h-24 z-50 pointer-events-none">
            {/* Top half */}
            <div ref={topBarRef} className="absolute top-0 left-0 w-full h-1/2 bg-white pointer-events-auto shadow-md">
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-2">
                    <a href="#" className="text-xl font-bold text-gray-800">ECLIPSE</a>
                </div>
            </div>
            
            {/* Bottom half */}
            <div ref={bottomBarRef} className="absolute bottom-0 left-0 w-full h-1/2 bg-white pointer-events-auto shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-end items-start pt-2">
                    <nav className="flex items-center space-x-8 text-sm font-medium">
                        <a href="#" className="text-gray-500 hover:text-gray-900">Portfolio</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900">About</a>
                        <a href="#" className="text-gray-500 hover:text-gray-900">Contact</a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header18;