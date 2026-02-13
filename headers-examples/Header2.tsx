import React from 'react';

const DropdownLink: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="relative group">
        <button className="text-gray-600 hover:text-black transition-colors flex items-center">
            {title}
            <svg className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-10">
            <div className="py-1">
                {children}
            </div>
        </div>
    </div>
);

interface Header2Props {
    isSticky?: boolean;
}

const Header2: React.FC<Header2Props> = ({ isSticky = false }) => {
    const headerClasses = `
        bg-white border-b border-gray-200
        ${isSticky ? 'sticky top-0 z-50 w-full' : ''}
    `;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Left Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <DropdownLink title="Products">
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Product A</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Product B</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Product C</a>
                        </DropdownLink>
                        <a href="#" className="text-gray-600 hover:text-black transition-colors">Features</a>
                    </nav>

                    {/* Centered Logo */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                         <a href="#" className="text-2xl font-bold text-gray-900">ACME</a>
                    </div>
                    
                    {/* Right Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-gray-600 hover:text-black transition-colors">Company</a>
                        <a href="#" className="text-gray-600 hover:text-black transition-colors">Pricing</a>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex-1">
                         <button className="text-gray-600 hover:text-gray-800">
                             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                    <div className="md:hidden flex-1 flex justify-end">
                        <a href="#" className="text-gray-600 hover:text-black">Login</a>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header2;