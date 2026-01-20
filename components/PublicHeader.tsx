import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const PublicHeader: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
            <nav className="container mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center">
                        <img 
                            src="/Webpilot ecommerce edmonton canada w.png" 
                            alt="WebPilot" 
                            className="h-10 w-auto"
                        />
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-6">
                            <Link to="/features" className="text-gray-300 hover:text-white transition-colors">
                                Features
                            </Link>
                            <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                                Pricing
                            </Link>
                            <div className="relative group">
                                <button className="text-gray-300 hover:text-white transition-colors">
                                    Resources
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <Link to="/docs" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700 rounded-t-lg">
                                        Documentation
                                    </Link>
                                    <Link to="/api" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700">
                                        API Reference
                                    </Link>
                                    <Link to="/integrations" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700">
                                        Integrations
                                    </Link>
                                    <Link to="/blog" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700">
                                        Blog
                                    </Link>
                                    <Link to="/support" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700 rounded-b-lg">
                                        Support
                                    </Link>
                                </div>
                            </div>
                            <div className="relative group">
                                <button className="text-gray-300 hover:text-white transition-colors">
                                    Company
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-neutral-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <Link to="/about" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700 rounded-t-lg">
                                        About Us
                                    </Link>
                                    <Link to="/case-studies" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700">
                                        Case Studies
                                    </Link>
                                    <Link to="/careers" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700">
                                        Careers
                                    </Link>
                                    <Link to="/press" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700">
                                        Press
                                    </Link>
                                    <Link to="/contact" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-700 rounded-b-lg">
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link 
                                to="/admin" 
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
                            >
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-2">
                        <Link 
                            to="/features" 
                            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link 
                            to="/pricing" 
                            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        
                        <div className="px-4 py-2 text-gray-400 text-sm font-semibold">Resources</div>
                        <Link 
                            to="/docs" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Documentation
                        </Link>
                        <Link 
                            to="/api" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            API Reference
                        </Link>
                        <Link 
                            to="/integrations" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Integrations
                        </Link>
                        <Link 
                            to="/blog" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Link 
                            to="/support" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Support
                        </Link>
                        
                        <div className="px-4 py-2 text-gray-400 text-sm font-semibold">Company</div>
                        <Link 
                            to="/about" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            About Us
                        </Link>
                        <Link 
                            to="/case-studies" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Case Studies
                        </Link>
                        <Link 
                            to="/careers" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Careers
                        </Link>
                        <Link 
                            to="/press" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Press
                        </Link>
                        <Link 
                            to="/contact" 
                            className="block px-4 py-2 pl-8 text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        
                        <div className="pt-4 space-y-2">
                            <Link 
                                to="/admin" 
                                className="block px-4 py-2 text-center text-gray-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/admin" 
                                className="block px-4 py-2 text-center bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};
