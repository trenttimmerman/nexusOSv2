import React, { useState, useEffect } from 'react';

const KineticLink: React.FC<{ text: string }> = ({ text }) => {
    return (
        <a href="#" className="block overflow-hidden relative font-extrabold text-gray-800 hover:text-indigo-600 transition-colors duration-300 group">
            <span className="inline-block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
                {text.split('').map((char, i) => (
                    <span key={i} className="inline-block" style={{ transition: `transform 0.5s ${i * 30}ms cubic-bezier(0.6, 0, 0.4, 1)` }}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
            </span>
             <span className="inline-block absolute left-0 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                {text.split('').map((char, i) => (
                    <span key={i} className="inline-block text-indigo-600" style={{ transition: `transform 0.5s ${i * 30}ms cubic-bezier(0.6, 0, 0.4, 1)` }}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
            </span>
        </a>
    );
};

const Header34: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 200); // Trigger after scrolling a bit
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={`
                transition-all duration-700 ease-in-out
                ${isScrolled ? 'h-0' : 'h-[40vh] min-h-[300px]'}
            `}>
                <div className="h-full flex flex-col justify-center items-center bg-gray-100">
                    <nav className={`
                        space-y-4 text-center text-5xl md:text-7xl transition-opacity duration-500
                        ${isScrolled ? 'opacity-0' : 'opacity-100'}
                    `}>
                        <KineticLink text="Our Work" />
                        <KineticLink text="About Us" />
                        <KineticLink text="Get In Touch" />
                    </nav>
                </div>
            </div>
            
            <header className={`
                sticky top-0 z-50 transition-all duration-500 ease-in-out
                ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : ''}
            `}>
                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex justify-between items-center h-20">
                         <a href="#" className="text-2xl font-bold text-gray-800">KINETIC</a>
                         <nav className={`
                            flex items-center space-x-8 text-sm font-semibold text-gray-600 transition-opacity duration-500
                            ${isScrolled ? 'opacity-100' : 'opacity-0'}
                         `}>
                            <a href="#" className="hover:text-black">Work</a>
                            <a href="#" className="hover:text-black">About</a>
                            <a href="#" className="hover:text-black">Contact</a>
                         </nav>
                     </div>
                 </div>
            </header>
        </>
    );
};

export default Header34;