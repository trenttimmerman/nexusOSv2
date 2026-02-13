import React, { useState, useEffect } from 'react';

const Header3: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'bg-white shadow-md text-gray-800' : 'bg-transparent text-white'}
    `;

    return (
        <>
            {/* Dummy hero section for demonstration */}
            <div className="h-screen bg-cover bg-center flex items-center justify-center text-white" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80)'}}>
                <h1 className="text-6xl font-bold text-center" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.6)'}}>Scroll Down to See the Effect</h1>
            </div>
            <header className={headerClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <a href="#" className="text-2xl font-bold">AURA</a>
                        <nav className="hidden md:flex space-x-6">
                            <a href="#" className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-600' : 'text-white'}`}>Home</a>
                            <a href="#" className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-600' : 'text-white'}`}>Gallery</a>
                            <a href="#" className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-600' : 'text-white'}`}>About</a>
                            <a href="#" className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-600' : 'text-white'}`}>Contact</a>
                        </nav>
                         <div className="md:hidden">
                            <button className={`hover:opacity-80 transition-opacity ${isScrolled ? 'text-gray-600' : 'text-white'}`}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header3;