import React, { useState, useEffect } from 'react';

const GlitchLink: React.FC<{ text: string }> = ({ text }) => (
    <a href="#" className="glitch-link" data-text={text}>
        <span className="glitch-link-text">{text}</span>
    </a>
);

const Header29: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClasses = `
        transition-all duration-300 ease-in-out font-mono sticky top-0 z-50
        ${isScrolled
            ? 'h-20 bg-gray-900/80 backdrop-blur-sm border-b-2 border-fuchsia-500 shadow-lg shadow-fuchsia-500/20'
            : 'h-24 bg-gray-900 border-b-2 border-gray-800'
        }
    `;

    return (
        <>
            <style>
                {`
                @keyframes glitch-skew {
                    0% { transform: skew(0); } 25% { transform: skew(2deg, -1deg); } 50% { transform: skew(-3deg, 1deg); } 75% { transform: skew(1deg, 2deg); } 100% { transform: skew(0); }
                }
                @keyframes glitch-clip {
                    0% { clip-path: inset(5% 0 85% 0); } 20% { clip-path: inset(40% 0 40% 0); } 40% { clip-path: inset(80% 0 10% 0); } 60% { clip-path: inset(20% 0 70% 0); } 80% { clip-path: inset(90% 0 5% 0); } 100% { clip-path: inset(30% 0 60% 0); }
                }
                .glitch-link {
                    position: relative;
                    text-transform: uppercase;
                    color: white;
                    text-decoration: none;
                }
                .glitch-link-text {
                    display: inline-block;
                }
                .glitch-link:hover .glitch-link-text {
                    animation: glitch-skew 0.5s steps(1, end) infinite;
                }
                .glitch-link::before, .glitch-link::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #111827;
                    display: none;
                }
                .glitch-link:hover::before {
                    display: block;
                    left: 2px;
                    text-shadow: -2px 0 #00fff9; /* cyan */
                    animation: glitch-clip 0.8s infinite linear alternate-reverse;
                }
                .glitch-link:hover::after {
                    display: block;
                    left: -2px;
                    text-shadow: 2px 0 #ff00c1; /* fuchsia */
                    animation: glitch-clip 0.9s infinite linear alternate-reverse;
                }
                `}
            </style>
            <header className={headerClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between items-center h-full">
                        <a href="#" className="text-3xl font-bold glitch-link" data-text="[NEONET]">
                            <span className="glitch-link-text">[NEONET]</span>
                        </a>
                        <nav className="hidden md:flex items-center space-x-10 text-lg">
                            <GlitchLink text="<Grid>" />
                            <GlitchLink text="<Core>" />
                            <GlitchLink text="<Nexus>" />
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header29;