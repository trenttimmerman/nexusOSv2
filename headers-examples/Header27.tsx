import React, { useState, useEffect } from 'react';

const Header27: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const headerClasses = `
        transition-all duration-500 ease-in-out text-white sticky top-0 z-50
        ${isScrolled 
            ? 'h-20 bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-700'
            : 'h-24 bg-gray-900'
        }
    `;

    return (
        <header className={headerClasses}>
            <style>
                {`
                @keyframes aurora-anim {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    25% { transform: translate(-40%, -60%) rotate(90deg) scale(1.2); }
                    50% { transform: translate(-60%, -40%) rotate(180deg) scale(1); }
                    75% { transform: translate(-50%, -50%) rotate(270deg) scale(0.8); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
                `}
            </style>
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div 
                    className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-purple-600 via-teal-500 to-rose-500 opacity-20"
                    style={{
                        animation: 'aurora-anim 30s linear infinite',
                        filter: 'blur(100px)',
                    }}
                />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    <a href="#" className="text-2xl font-bold tracking-widest uppercase">AURORA</a>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Showcase</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Labs</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Mission</a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header27;