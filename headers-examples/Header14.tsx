
import React, { useState, useEffect } from 'react';

const Header14: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPosition = window.scrollY;
            setProgress(totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Set initial progress
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <a href="#" className="flex items-center gap-2 text-xl font-bold text-gray-800 tracking-wider">
                         <svg className="w-7 h-7 text-rose-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-7h2v4h-2v-4zm0-6h2v2h-2V7z"></path></svg>
                        INSIGHT
                    </a>
                    <nav className="hidden md:flex space-x-8 text-sm text-gray-500 font-medium">
                        <a href="#" className="hover:text-gray-900 transition-colors">Article</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Author</a>
                        <a href="#" className="hover:text-gray-900 transition-colors">Subscribe</a>
                    </nav>
                </div>
            </div>
            <div className="w-full bg-gray-200 h-1">
                <div 
                    className="bg-gradient-to-r from-rose-400 to-red-500 h-1" 
                    style={{ 
                        width: `${progress}%`,
                        boxShadow: `0 0 10px rgba(239, 68, 68, 0.7)`, // red-500
                        transition: 'width 100ms linear',
                    }}
                />
            </div>
        </header>
    );
};

export default Header14;