import React, { useEffect, useRef, useState } from 'react';

declare const gsap: any;

const DropdownMenu: React.FC = () => {
    const menuRef = useRef<HTMLDivElement>(null);
    const tl = useRef<any>(null);

    useEffect(() => {
        if (typeof gsap === 'undefined' || !menuRef.current) return;
        const items = gsap.utils.toArray('.dropdown-item', menuRef.current);
        
        tl.current = gsap.timeline({ paused: true })
            .fromTo(menuRef.current, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power1.out' })
            .fromTo(items, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.05, ease: 'power2.out' }, '-=0.1');
            
    }, []);

    const onEnter = () => tl.current?.play();
    const onLeave = () => tl.current?.reverse();

    return (
        <div className="relative group" onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <button className="text-gray-600 hover:text-black transition-colors flex items-center">
                Products
                <svg className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div ref={menuRef} className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-2xl z-10 invisible">
                <div className="p-2">
                    <a href="#" className="dropdown-item block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">Analytics Suite</a>
                    <a href="#" className="dropdown-item block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">Developer API</a>
                    <a href="#" className="dropdown-item block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">Enterprise Cloud</a>
                    <a href="#" className="dropdown-item block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">Collaboration Tools</a>
                </div>
            </div>
        </div>
    );
};

const Header26: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `
        transition-all duration-300 ease-in-out w-full sticky top-0 z-50
        ${isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg' 
            : 'bg-white border-b border-gray-200'
        }
    `;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="#" className="text-xl font-bold">REFINED</a>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-600 hover:text-black">Features</a>
                        <DropdownMenu />
                        <a href="#" className="text-gray-600 hover:text-black">Company</a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header26;