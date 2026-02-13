import React, { useRef, useEffect, useState } from 'react';

const Header17: React.FC = () => {
    const spotlightRef = useRef<HTMLDivElement>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const spotlightDiv = spotlightRef.current;
            if (!spotlightDiv) return;
            const rect = spotlightDiv.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            spotlightDiv.style.setProperty('--mouse-x', `${x}px`);
            spotlightDiv.style.setProperty('--mouse-y', `${y}px`);
        };

        // Listen on the window for a smoother effect as the mouse enters the header area
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
        <header
            className="text-white sticky top-0 z-50"
        >
            <style>
                {`
                .spotlight-header::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(
                        circle 200px at var(--mouse-x) var(--mouse-y),
                        rgba(255, 255, 255, 0.1),
                        transparent 80%
                    );
                    opacity: 0;
                    transition: opacity 0.3s ease-in-out;
                }
                .spotlight-header:hover::before {
                    opacity: 1;
                }
                `}
            </style>
            <div
                ref={spotlightRef}
                className={`
                    spotlight-header relative transition-all duration-300
                    ${isScrolled 
                        ? 'bg-gray-900/80 backdrop-blur-md border-b border-gray-700 shadow-lg' 
                        : 'bg-gray-900 border-b border-gray-800'
                    }
                `}
                style={{
                    // @ts-ignore
                    '--mouse-x': '50%',
                    '--mouse-y': '50%',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <a href="#" className="text-2xl font-bold tracking-widest uppercase z-10">NOVA</a>
                        <nav className="hidden md:flex items-center space-x-10 text-sm font-medium z-10">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Cases</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Services</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Culture</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header17;