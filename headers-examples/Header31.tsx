import React, { useState, useEffect } from 'react';

const Header31: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `
        text-white overflow-hidden transition-all duration-500 ease-in-out sticky top-0 z-50
        ${isScrolled 
            ? 'h-20 bg-indigo-900/80 backdrop-blur-sm shadow-lg' 
            : 'h-28 bg-indigo-900'
        }
    `;
    return (
        <>
            <style>
                {`
                @keyframes blob-anim-1 { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(20%, -30%) scale(1.1); } 50% { transform: translate(-10%, 15%) scale(0.9); } 75% { transform: translate(30%, 10%) scale(1.05); } }
                @keyframes blob-anim-2 { 0%, 100% { transform: translate(0, 0) scale(1); } 25% { transform: translate(-15%, 25%) scale(1.1); } 50% { transform: translate(20%, -20%) scale(0.95); } 75% { transform: translate(-25%, -10%) scale(1); } }
                `}
            </style>
            <header className={headerClasses}>
                <div className="absolute inset-0 w-full h-full" style={{ filter: 'url(#gooey)' }}>
                    <div 
                        className="absolute w-48 h-48 bg-indigo-500 rounded-full"
                        style={{ top: '-20%', left: '10%', animation: 'blob-anim-1 25s ease-in-out infinite' }}
                    />
                    <div 
                        className="absolute w-56 h-56 bg-purple-500 rounded-full"
                        style={{ top: '10%', left: '70%', animation: 'blob-anim-2 20s ease-in-out infinite' }}
                    />
                    <div 
                        className="absolute w-32 h-32 bg-rose-500 rounded-full"
                        style={{ bottom: '-10%', left: '40%', animation: 'blob-anim-1 22s ease-in-out infinite reverse' }}
                    />
                </div>
                 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                         <a href="#" className="text-3xl font-bold">FLUID</a>
                        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-indigo-100">
                             <a href="#" className="hover:text-white">Motion</a>
                             <a href="#" className="hover:text-white">Form</a>
                             <a href="#" className="hover:text-white">Function</a>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header31;