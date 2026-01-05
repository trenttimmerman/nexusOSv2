import React from 'react';

const Footer33: React.FC = () => {
    return (
        <>
            <style>
                {`
                @keyframes crt-flicker {
                    0% { opacity: 0.95; }
                    50% { opacity: 1; }
                    100% { opacity: 0.95; }
                }
                @keyframes crt-scanline {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100%); }
                }
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
                    background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.9) 100%);
                    border-radius: 20px;
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
            <footer className="crt-screen font-mono p-12">
                <div className="crt-content">
                    <p className="text-lg">SYSTEM READY.</p>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                        <div>
                            <h4 className="font-bold mb-2">[NAV]</h4>
                            <ul className="space-y-1">
                                <li><a href="#" className="hover:bg-green-400 hover:text-black">/home</a></li>
                                <li><a href="#" className="hover:bg-green-400 hover:text-black">/about</a></li>
                                <li><a href="#" className="hover:bg-green-400 hover:text-black">/contact</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-bold mb-2">[DATA]</h4>
                            <ul className="space-y-1">
                                <li><a href="#" className="hover:bg-green-400 hover:text-black">API_DOCS</a></li>
                                <li><a href="#" className="hover:bg-green-400 hover:text-black">STATUS</a></li>
                                <li><a href="#" className="hover:bg-green-400 hover:text-black">RESOURCES</a></li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-bold mb-2">[SOCIAL]</h4>
                            <ul className="space-y-1">
                                <li><a href="#" className="hover:bg-green-400 hover:text-black">TWITTER</a></li>
                                <li><a href="#" className="hover:bg-green-400 hover:text-black">GITHUB</a></li>
                            </ul>
                        </div>
                        <div>
                            <p>IP: 127.0.0.1</p>
                            <p>USER: GUEST</p>
                        </div>
                    </div>
                    <p className="mt-8 text-xs opacity-70">&copy; 1985 RetroNet Inc. All operations normal.</p>
                </div>
            </footer>
        </>
    );
};

export default Footer33;