import React from 'react';

const Header33: React.FC = () => {
    return (
        <>
            <style>
                {`
                @keyframes crt-flicker { 0% { opacity: 0.95; } 50% { opacity: 1; } 100% { opacity: 0.95; } }
                .crt-screen {
                    position: relative;
                    background: #0c0d0c;
                    overflow: hidden;
                }
                .crt-screen::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    background-size: 100% 3px, 4px 100%;
                    z-index: 2;
                    pointer-events: none;
                }
                .crt-screen::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.8) 100%);
                    z-index: 3;
                    pointer-events: none;
                }
                .crt-content {
                    animation: crt-flicker 0.1s infinite;
                    color: #4ade80; /* green-400 */
                    text-shadow: 0 0 5px #4ade80, 0 0 10px #4ade80;
                }
                `}
            </style>
            <header className="sticky top-0 z-50 crt-screen font-mono border-b-2 border-green-900">
                <div className="crt-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <p className="text-lg">[SYSTEM_NAV]</p>
                        <nav className="flex space-x-6 text-sm">
                            <a href="#" className="hover:bg-green-400 hover:text-black px-1">/root</a>
                            <a href="#" className="hover:bg-green-400 hover:text-black px-1">/docs</a>
                            <a href="#" className="hover:bg-green-400 hover:text-black px-1">/login</a>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header33;