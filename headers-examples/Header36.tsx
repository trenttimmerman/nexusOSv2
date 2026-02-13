import React, { useEffect, useRef } from 'react';

// Declare gsap and ScrollTrigger to avoid TypeScript errors for CDN-loaded libraries
declare const gsap: any;
declare const ScrollTrigger: any;

const Header36: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);
    
    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);
        const header = headerRef.current;
        if (!header) return;

        const ctx = gsap.context(() => {
            const panels = gsap.utils.toArray('.origami-panel', header);
            
            gsap.set(panels, { autoAlpha: 0, rotationX: 90, transformOrigin: 'top center' });

            // This trigger handles pinning the header for the entire page scroll.
            ScrollTrigger.create({
                trigger: header,
                start: 'top top',
                pin: true,
                pinSpacing: false, // Essential for a header to not push content down
                end: 'max'
            });

            // This timeline handles the unfolding animation over the first 300px of scroll.
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: document.documentElement,
                    start: 'top top',
                    end: '+=300',
                    scrub: 1.5,
                }
            });

            tl.to(panels, {
                autoAlpha: 1,
                rotationX: 0,
                duration: 1,
                stagger: 0.3,
                ease: 'power2.out',
            });
            
        }, header);

        return () => ctx.revert();
    }, []);
    
    return (
        <header ref={headerRef} className="h-[224px] z-50" style={{ perspective: '1000px' }}>
            <div className="origami-panel absolute top-0 left-0 w-full h-24 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <a href="#" className="text-2xl font-bold">UNFOLD</a>
                    <nav className="flex space-x-6 text-sm">
                        <a href="#" className="text-gray-600 hover:text-black">Features</a>
                        <a href="#" className="text-gray-600 hover:text-black">Pricing</a>
                        <a href="#" className="text-gray-600 hover:text-black">Company</a>
                    </nav>
                </div>
            </div>
             <div className="origami-panel absolute top-24 left-0 w-full h-32 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto h-full p-4 flex items-center justify-center text-center">
                     <p className="text-gray-600">A header that reveals itself one layer at a time.</p>
                </div>
            </div>
        </header>
    );
};

export default Header36;