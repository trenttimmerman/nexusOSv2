import React, { useRef, useEffect, useState } from 'react';

const Header19: React.FC = () => {
    const headerRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const header = headerRef.current;
        const nav = navRef.current;
        if (!header || !nav) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { width, height, left, top } = header.getBoundingClientRect();
            
            const x = (clientX - left) / width - 0.5;
            const y = (clientY - top) / height - 0.5;

            const rotateY = x * 20; // Max rotation 10deg
            const rotateX = -y * 20; // Max rotation 10deg
            
            nav.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };
        
        const handleMouseLeave = () => {
            nav.style.transform = `rotateX(0deg) rotateY(0deg)`;
        };

        header.addEventListener('mousemove', handleMouseMove);
        header.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            header.removeEventListener('mousemove', handleMouseMove);
            header.removeEventListener('mouseleave', handleMouseLeave);
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
        transition-all duration-500 ease-in-out flex items-center justify-center
        sticky top-0 z-50
        ${isScrolled 
            ? 'h-24 bg-gray-900/80 backdrop-blur-md shadow-lg' 
            : 'h-32 bg-gray-900'
        }
    `;

    return (
        <header ref={headerRef} className={headerClasses} style={{ perspective: '800px' }}>
            <div ref={navRef} className="flex items-center space-x-12 p-8 bg-gray-800/50 border border-gray-700 rounded-xl shadow-2xl transition-transform duration-300 ease-out will-change-transform">
                <a href="#" className="text-gray-300 hover:text-white font-semibold tracking-wider uppercase transform hover:scale-110 transition-transform">Home</a>
                <a href="#" className="text-gray-300 hover:text-white font-semibold tracking-wider uppercase transform hover:scale-110 transition-transform">Work</a>
                <a href="#" className="text-gray-300 hover:text-white font-semibold tracking-wider uppercase transform hover:scale-110 transition-transform">About</a>
                <a href="#" className="text-gray-300 hover:text-white font-semibold tracking-wider uppercase transform hover:scale-110 transition-transform">Contact</a>
            </div>
        </header>
    );
};

export default Header19;