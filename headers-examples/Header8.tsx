import React from 'react';

const Header8: React.FC = () => {
    // This component is designed to be sticky by default to showcase the effect.
    // The sticky toggle is disabled in DemoPage.tsx for this component.
    const headerClasses = `
        fixed top-0 left-0 right-0 z-50 
        bg-white/30 backdrop-blur-lg 
        border-b border-white/20 shadow-sm
    `;

    return (
        <>
            <div className="h-screen bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1619468129361-605ebea04b44?w=800&q=80)'}}>
                {/* Dummy hero section for demonstration */}
            </div>
             <header className={headerClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 text-white">
                        <a href="#" className="text-2xl font-bold tracking-tight" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.3)'}}>GLASS</a>
                        <nav className="hidden md:flex space-x-8 text-sm font-medium">
                            <a href="#" className="hover:opacity-80 transition-opacity">Showcase</a>
                            <a href="#" className="hover:opacity-80 transition-opacity">Features</a>
                            <a href="#" className="hover:opacity-80 transition-opacity">Community</a>
                        </nav>
                         <div>
                            <a href="#" className="px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded-lg border border-white/30 hover:bg-white/30 transition-colors">
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header8;