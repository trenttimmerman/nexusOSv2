import React, { useState, useEffect } from 'react';

const GlitchLink: React.FC<{ text: string }> = ({ text }) => (
    <a href="#" className="relative text-lg font-semibold uppercase tracking-widest text-white glitch-text" data-text={text}>
        {text}
    </a>
);

const Header21: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `
        text-white transition-all duration-300 ease-in-out
        ${isScrolled 
            ? 'fixed top-0 left-0 right-0 z-50 h-20 bg-black/80 backdrop-blur-sm border-b border-fuchsia-500/30 shadow-lg' 
            : 'relative h-24 bg-black'
        }
    `;
    return (
        <>
            {isScrolled && <div className="h-24" />}
            <style>
                {`
                .glitch-text {
                    position: relative;
                }
                .glitch-text::before, .glitch-text::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: black;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    transition: all 0.2s ease-in-out;
                }
                .glitch-text:hover::before {
                    left: 2px;
                    text-shadow: -1px 0 red;
                    animation: glitch-anim-1 0.5s infinite linear alternate-reverse;
                }
                .glitch-text:hover::after {
                    left: -2px;
                    text-shadow: -1px 0 blue;
                    animation: glitch-anim-2 0.5s infinite linear alternate-reverse;
                }

                @keyframes glitch-anim-1 {
                    0% { clip: rect(42px, 9999px, 44px, 0); } 100% { clip: rect(2px, 9999px, 95px, 0); }
                }
                @keyframes glitch-anim-2 {
                    0% { clip: rect(7px, 9999px, 98px, 0); } 100% { clip: rect(80px, 9999px, 45px, 0); }
                }
                `}
            </style>
            <header className={headerClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        <div className="text-3xl font-black tracking-tighter glitch-text" data-text="CYPHER">CYPHER</div>
                        <nav className="hidden md:flex items-center space-x-10">
                            <GlitchLink text="System" />
                            <GlitchLink text="Network" />
                            <GlitchLink text="Protocol" />
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header21;
