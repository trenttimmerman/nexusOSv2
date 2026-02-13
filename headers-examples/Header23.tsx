import React, { useRef, useEffect, useState } from 'react';

const Header23: React.FC = () => {
    const headerRef = useRef<HTMLElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = header.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            header.style.setProperty('--mouse-x', `${x}px`);
            header.style.setProperty('--mouse-y', `${y}px`);
        };

        header.addEventListener('mousemove', handleMouseMove);

        return () => {
            header.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `
        text-white overflow-hidden transition-all duration-300 ease-in-out sticky top-0 z-50
        ${isScrolled 
            ? 'h-20 bg-black/80 backdrop-blur-sm border-b border-gray-800 shadow-lg' 
            : 'h-24 bg-black border-b border-gray-900'
        }
    `;

    return (
        <header
            ref={headerRef}
            className={headerClasses}
            style={{
                // @ts-ignore
                '--mouse-x': '50%',
                '--mouse-y': '50%',
            }}
        >
             <div 
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                    background: `radial-gradient(
                        ellipse 400px 50px at var(--mouse-x) var(--mouse-y),
                        rgba(100, 116, 139, 0.2), 
                        transparent 80%
                    )`
                }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full relative z-20">
                    <span className="text-2xl font-bold tracking-widest">LUMINA</span>
                     <nav className="hidden md:flex items-center space-x-10 text-sm uppercase tracking-wider text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Vision</a>
                        <a href="#" className="hover:text-white transition-colors">Craft</a>
                        <a href="#" className="hover:text-white transition-colors">Legacy</a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header23;