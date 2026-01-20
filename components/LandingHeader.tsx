import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="sticky top-0 z-50">
            <nav className={`container mx-auto max-w-7xl px-6 transition-all duration-300 ${
                isScrolled ? 'py-3' : 'py-5'
            }`}>
                <div className={`flex items-center justify-between rounded-xl transition-all duration-300 ${
                    isScrolled ? 'px-6 py-2 glass-card backdrop-blur-md bg-neutral-900/80' : 'px-7 py-4 glass-card'
                }`}>
                    <Link to="/" className="text-2xl font-bold">
                        Evolv<span className="text-cyan-400">.</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
                        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                        <Link to="#" className="text-gray-300 hover:text-white transition-colors">Examples</Link>
                        <Link to="#" className="text-gray-300 hover:text-white transition-colors">Help</Link>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login" className="text-gray-300 hover:text-white transition-colors px-4 py-2">
                            Sign In
                        </Link>
                        <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-5 py-2 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all">
                            Start Free
                        </Link>
                    </div>
                    
                    <button className="md:hidden text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
