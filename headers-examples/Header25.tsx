import React, { useEffect, useRef } from 'react';

declare const gsap: any;
declare const ScrollTrigger: any;

const sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'chapter-one', title: 'Chapter One: The Awakening' },
    { id: 'chapter-two', title: 'Chapter Two: The Journey' },
    { id: 'conclusion', title: 'Conclusion' },
];

const Header25: React.FC = () => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || !containerRef.current) return;

        gsap.registerPlugin(ScrollTrigger);
        
        const ctx = gsap.context(() => {
            sections.forEach(section => {
                ScrollTrigger.create({
                    trigger: `#${section.id}`,
                    start: 'top 50%',
                    end: 'bottom 50%',
                    onEnter: () => {
                        gsap.to(titleRef.current, {
                            opacity: 0, y: -10, duration: 0.3, ease: 'power2.in', onComplete: () => {
                                titleRef.current!.textContent = section.title;
                                gsap.fromTo(titleRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
                            }
                        });
                    },
                    onEnterBack: () => {
                        gsap.to(titleRef.current, {
                            opacity: 0, y: 10, duration: 0.3, ease: 'power2.in', onComplete: () => {
                                titleRef.current!.textContent = section.title;
                                gsap.fromTo(titleRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
                            }
                        });
                    },
                });
            });
        }, containerRef);
        
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef}>
            <header className="sticky top-0 z-50 h-20 bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <h2 ref={titleRef} className="text-xl font-bold text-gray-800">
                        {sections[0].title}
                    </h2>
                </div>
            </header>
            
            {/* Dummy Content Sections */}
            <div className="max-w-3xl mx-auto">
                <section id="intro" className="h-screen py-20">
                    <h3 className="text-3xl font-bold mb-4">Introduction</h3>
                    <p className="text-gray-600">Scroll down to see the header change.</p>
                </section>
                <section id="chapter-one" className="h-screen py-20">
                    <h3 className="text-3xl font-bold mb-4">Chapter One</h3>
                    <p className="text-gray-600">The header now reflects our new section.</p>
                </section>
                <section id="chapter-two" className="h-screen py-20">
                     <h3 className="text-3xl font-bold mb-4">Chapter Two</h3>
                    <p className="text-gray-600">Continuing the journey.</p>
                </section>
                <section id="conclusion" className="h-screen py-20">
                    <h3 className="text-3xl font-bold mb-4">Conclusion</h3>
                    <p className="text-gray-600">The final section.</p>
                </section>
            </div>
        </div>
    );
};

export default Header25;