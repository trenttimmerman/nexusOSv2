import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="sticky top-0 z-50">
            <nav className="container mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between glass-card rounded-xl px-6 py-3">
                    <a href="#" className="text-2xl font-bold">
                        WebPilot<span className="text-cyan-400">.</span>
                    </a>
                    
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Docs</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
                    </div>
                    
                    <a href="/signup" className="hidden md:inline-block bg-white text-gray-950 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Start Free Trial
                    </a>
                    
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
