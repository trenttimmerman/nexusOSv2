import React from 'react';

const MegaMenu: React.FC = () => (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-4 gap-8">
            <div>
                <h4 className="font-bold text-gray-800">For Developers</h4>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Documentation</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">API Status</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Changelog</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-gray-800">For Business</h4>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Case Studies</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Enterprise</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Security</a></li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-gray-800">Resources</h4>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Blog</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Support Center</a></li>
                    <li><a href="#" className="text-gray-600 hover:text-indigo-600">Partners</a></li>
                </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-800">Explore Our Platform</h4>
                <p className="text-sm text-gray-600 mt-2">Discover the tools and features that power modern development.</p>
                <a href="#" className="text-sm text-indigo-600 font-semibold mt-4 inline-block">Learn more &rarr;</a>
            </div>
        </div>
    </div>
);

interface Header4Props {
    isSticky?: boolean;
}

const Header4: React.FC<Header4Props> = ({ isSticky = false }) => {
    const headerClasses = `
        relative bg-white border-b border-gray-200
        ${isSticky ? 'sticky top-0 z-50 w-full' : ''}
    `;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="#" className="text-xl font-bold text-gray-800">PLATFORM</a>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-600 hover:text-indigo-600">Pricing</a>
                        <div className="relative group">
                            <button className="text-gray-600 hover:text-indigo-600 flex items-center">
                                Solutions
                                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <MegaMenu />
                        </div>
                        <a href="#" className="text-gray-600 hover:text-indigo-600">Contact</a>
                    </nav>
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

export default Header4;