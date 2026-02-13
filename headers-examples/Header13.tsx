
import React, { useState, useEffect } from 'react';

const Header13: React.FC = () => {
    const [isShrunk, setIsShrunk] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsShrunk(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `
        sticky top-0 z-50 bg-white transition-all duration-300 ease-in-out
        ${isShrunk ? 'h-16 shadow-lg' : 'h-24 shadow-md'}
    `;

    const logoWrapperClasses = `
        flex items-center gap-2 font-extrabold text-gray-900 transition-all duration-300 ease-in-out
        ${isShrunk ? 'text-2xl' : 'text-4xl'}
    `;
    
    const logoIconClasses = `
        transition-all duration-300 ease-in-out
        ${isShrunk ? 'w-6 h-6' : 'w-8 h-8'}
    `;

    const navLinkClasses = `
        text-gray-500 hover:text-gray-900 transition-all duration-300 ease-in-out relative
        after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:w-full after:bg-teal-500
        after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100
        ${isShrunk ? 'text-sm' : 'text-base'}
    `;

    const ctaButtonClasses = `
        text-white rounded-md transition-all duration-300 ease-in-out font-semibold
        ${isShrunk ? 'px-4 py-2 text-xs bg-teal-600 hover:bg-teal-700' : 'px-5 py-2.5 text-sm bg-teal-500 hover:bg-teal-600'}
    `;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    <a href="#" className={logoWrapperClasses}>
                         <svg className={logoIconClasses} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 15a5 5 0 100-10 5 5 0 000 10z"></path></svg>
                        <span>MORPH</span>
                    </a>
                    
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className={navLinkClasses}>Home</a>
                        <a href="#" className={navLinkClasses}>About</a>
                        <a href="#" className="font-semibold text-gray-900">Portfolio</a>
                    </nav>
                    
                    <a href="#" className={ctaButtonClasses}>
                        Contact Us
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header13;