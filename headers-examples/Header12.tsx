
import React, { useState, useEffect } from 'react';

const Header12: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const marqueeContainerClasses = `
        absolute bottom-0 left-0 w-full bg-indigo-600 text-white overflow-hidden transition-all duration-500 ease-in-out
        ${isScrolled ? 'h-10 opacity-100' : 'h-0 opacity-0'}
    `;
    
    return (
        <header className="sticky top-0 z-50">
            <style>
                {`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-content {
                    animation: marquee 40s linear infinite;
                    display: flex;
                    width: 200%;
                }
                .marquee-container {
                     mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                `}
            </style>
            <div className="relative bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <a href="#" className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                             <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            NEXUS
                        </a>
                        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-500">
                            <a href="#" className="hover:text-gray-900 transition-colors">Home</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Culture</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Careers</a>
                        </nav>
                    </div>
                </div>
                 <div className={marqueeContainerClasses}>
                    <div className="h-10 flex items-center whitespace-nowrap marquee-container">
                        <div className="marquee-content">
                            <p className="px-4 text-sm font-semibold flex-shrink-0">
                                <span>BREAKING: NEW YORK OFFICE OPENS &bull; NEXUS RANKED #1 IN CUSTOMER SATISFACTION &bull; JOIN OUR TEAM - WE'RE HIRING! &bull; LOREM IPSUM DOLOR SIT AMET &bull; </span>
                                <span>BREAKING: NEW YORK OFFICE OPENS &bull; NEXUS RANKED #1 IN CUSTOMER SATISFACTION &bull; JOIN OUR TEAM - WE'RE HIRING! &bull; LOREM IPSUM DOLOR SIT AMET &bull; </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header12;