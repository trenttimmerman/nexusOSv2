import React, { useState } from 'react';

interface Header5Props {
    isSticky?: boolean;
}

const Header5: React.FC<Header5Props> = ({ isSticky = false }) => {
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const headerClasses = `
        bg-white shadow-sm
        ${isSticky ? 'sticky top-0 z-50 w-full' : ''}
    `;

    return (
        <header className={headerClasses}>
            {/* Announcement Banner */}
            {isBannerVisible && (
                <div className="bg-indigo-600 text-white">
                    <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                        <p className="text-sm font-medium text-center flex-grow">
                            <span className="font-bold">New Feature Alert!</span> Check out our new dashboard analytics.
                            <a href="#" className="underline ml-2">Learn more &rarr;</a>
                        </p>
                        <button onClick={() => setIsBannerVisible(false)} className="text-white hover:bg-indigo-500 rounded-md p-1">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="#" className="text-xl font-bold text-gray-800">LOGO</a>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-600 hover:text-indigo-600">Home</a>
                        <a href="#" className="text-gray-600 hover:text-indigo-600">About</a>
                        <a href="#" className="text-gray-600 hover:text-indigo-600">Services</a>
                    </nav>
                    <div>
                        <a href="#" className="text-gray-600 hover:text-indigo-600">Login</a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header5;