import React from 'react';

interface Header10Props {
    isSticky?: boolean;
}

const Header10: React.FC<Header10Props> = ({ isSticky = false }) => {
    const headerClasses = `
        relative bg-gray-900 text-white
        ${isSticky ? 'sticky top-0 z-50 w-full' : ''}
    `;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="#" className="font-bold text-xl tracking-widest uppercase">SPECTRUM</a>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">API</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Docs</a>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                    </nav>
                </div>
            </div>
            {/* Animated Gradient Border */}
            <div 
                className="absolute bottom-0 left-0 w-full h-0.5"
                style={{
                    background: 'linear-gradient(90deg, #ff00c1, #00fff9, #ffb300, #ff00c1)',
                    backgroundSize: '400% 100%',
                    animation: 'animated-gradient 8s linear infinite',
                }}
            />
        </header>
    );
};

export default Header10;