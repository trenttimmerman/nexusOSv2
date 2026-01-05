import React, { useEffect, useRef } from 'react';

declare const gsap: any;
declare const ScrollTrigger: any;

const Header20: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);
    const svgPathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !svgPathRef.current) return;

        gsap.registerPlugin(ScrollTrigger);
        const path = svgPathRef.current;
        const pathLength = path.getTotalLength();
        
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        
        const ctx = gsap.context(() => {
            gsap.to(path, {
                strokeDashoffset: 0,
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: '+=400',
                    scrub: 1,
                }
            });
        }, headerRef);
        
        return () => ctx.revert();
    }, []);

    return (
        <header ref={headerRef} className="sticky top-0 z-50 h-20">
            <div className="absolute inset-0">
                <svg width="100%" height="100%" viewBox="0 0 1440 80" preserveAspectRatio="none">
                    <path
                        ref={svgPathRef}
                        d="M 0 79.5 L 1440 79.5 L 1440 0.5 L 0 0.5 Z"
                        stroke="black"
                        strokeWidth="1"
                        fill="rgba(255, 255, 255, 0.8)"
                        style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'}}
                    />
                </svg>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    <a href="#" className="text-xl font-bold">PATHFINDER</a>
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-gray-600 hover:text-black">Explore</a>
                        <a href="#" className="text-gray-600 hover:text-black">Create</a>
                        <a href="#" className="text-gray-600 hover:text-black">Connect</a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header20;