import React, { useState } from 'react';

interface Header6Props {
    isSticky?: boolean;
}

const Header6: React.FC<Header6Props> = ({ isSticky = false }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const headerClasses = `
        bg-white shadow-sm
        ${isSticky ? 'sticky top-0 z-50 w-full' : ''}
    `;

    const sidebarClasses = `
        fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
    `;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <a href="#" className="text-xl font-bold text-gray-800">BRAND</a>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex space-x-8">
                        <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a>
                        <a href="#" className="text-gray-600 hover:text-gray-900">Blog</a>
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden lg:block">
                        <a href="#" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900">
                            Sign Up
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}></div>
            )}
            <div className={sidebarClasses}>
                <div className="p-5 flex justify-between items-center border-b">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-800">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <nav className="p-5 space-y-4">
                    <a href="#" className="block text-gray-600 hover:text-gray-900">Home</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-900">Features</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-900">Pricing</a>
                    <a href="#" className="block text-gray-600 hover:text-gray-900">Blog</a>
                    <a href="#" className="mt-4 block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900">
                        Sign Up
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header6;