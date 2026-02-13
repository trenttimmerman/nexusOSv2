
import React, { useEffect, useRef, useState } from 'react';

// Declare GSAP and ScrollTrigger to avoid TypeScript errors for CDN-loaded libraries
declare const gsap: any;
declare const ScrollTrigger: any;

const Header15: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !headerRef.current) {
            return;
        }
        
        gsap.registerPlugin(ScrollTrigger);

        const chars = headerRef.current.querySelectorAll('.char');
        const navLinks = headerRef.current.querySelectorAll('.nav-link');
        if (chars.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.from(chars, {
                opacity: 0.1,
                yPercent: 50,
                stagger: 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: '+=500',
                    scrub: 1,
                    onUpdate: (self) => setHasScrolled(self.progress > 0.02),
                },
            });

            gsap.from(navLinks, {
                opacity: 0,
                y: -10,
                stagger: 0.1,
                delay: 0.2, // Start slightly after the main text
                ease: 'power2.out',
                 scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: '+=300',
                    scrub: 1,
                },
            });
        }, headerRef);

        return () => ctx.revert();
    }, []);

    const title = "EPHEMERAL";

    return (
        <header ref={headerRef} className="sticky top-0 z-50 h-32 flex items-center justify-center bg-gradient-to-b from-white to-gray-50 shadow-sm">
            <div className="absolute top-4 right-8 hidden md:flex items-center space-x-6 text-sm">
                 <a href="#" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">Projects</a>
                 <a href="#" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">Journal</a>
                 <a href="#" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-800 tracking-widest text-center">
                {title.split('').map((char, index) => (
                    <span key={index} className="char inline-block">{char}</span>
                ))}
            </h1>
            {!hasScrolled && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            )}
        </header>
    );
};

export default Header15;