import React, { useEffect, useRef } from 'react';

// Declare gsap and ScrollTrigger to avoid TypeScript errors for CDN-loaded libraries
declare const gsap: any;
declare const ScrollTrigger: any;

const Footer36: React.FC = () => {
    const footerRef = useRef<HTMLElement>(null);
    
    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('GSAP or ScrollTrigger not loaded for Footer 36');
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
    
    return (
        <footer ref={footerRef} className="bg-gray-100" style={{ perspective: '1000px' }}>
            <div className="origami-panel bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Let's Connect</h2>
                    <p className="mt-2 text-gray-600">We're always open to new ideas and collaborations.</p>
                </div>
            </div>
             <div className="origami-panel bg-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-sm">
                        <div>
                            <h4 className="font-semibold text-gray-900">Product</h4>
                            <ul className="mt-3 space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-black">Features</a></li>
                                <li><a href="#" className="hover:text-black">Pricing</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-900">Company</h4>
                            <ul className="mt-3 space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-black">About Us</a></li>
                                <li><a href="#" className="hover:text-black">Blog</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-900">Social</h4>
                            <ul className="mt-3 space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-black">Twitter</a></li>
                                <li><a href="#" className="hover:text-black">LinkedIn</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-900">Legal</h4>
                            <ul className="mt-3 space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-black">Privacy</a></li>
                                <li><a href="#" className="hover:text-black">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
             <div className="origami-panel bg-gray-50">
                 <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Unfold Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer36;