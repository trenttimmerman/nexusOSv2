import React from 'react';

interface Header1Props {
    isSticky?: boolean;
}

const Header1: React.FC<Header1Props> = ({ isSticky = false }) => {
    const headerClasses = `
        bg-white shadow-md
        ${isSticky ? 'sticky top-0 z-50 w-full' : ''}
    `;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left section: Logo */}
                    <div className="flex-shrink-0">
                        <a href="#" className="flex items-center space-x-2">
                             <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-3.866 2.582-7 5.75-7s5.75 3.134 5.75 7-2.582 7-5.75 7-5.75-3.134-5.75-7zM3 11c0-3.866 2.582-7 5.75-7s5.75 3.134 5.75 7-2.582 7-5.75 7S3 14.866 3 11z" />
                            </svg>
                            <span className="text-xl font-bold text-gray-800">Logo</span>
                        </a>
                    </div>
                    
                    {/* Middle section: Navigation Links */}
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Products</a>
                        <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">About</a>
                        <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">Contact</a>
                    </nav>
                    
                    {/* Right section: CTA Button */}
                    <div className="hidden md:block">
                        <a href="#" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                            Get Started
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-gray-600 hover:text-gray-800">
                             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header1;