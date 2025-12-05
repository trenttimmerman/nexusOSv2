import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50">
            <nav className="container mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between glass-card rounded-xl px-6 py-3">
                    <Link to="/" className="text-2xl font-bold">
                        Evolv<span className="text-cyan-400">.</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                        <Link to="#" className="text-gray-300 hover:text-white transition-colors">Docs</Link>
                        <Link to="#" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link to="/signup" className="bg-white text-gray-950 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                            Start Free Trial
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
