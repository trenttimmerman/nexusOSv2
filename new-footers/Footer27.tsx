import React from 'react';

const Footer27: React.FC = () => {
    const auroraContainerStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'blur(80px)', // This is the key enhancement for a soft, blended look
    };

    return (
        <footer className="relative bg-gray-900 text-gray-300 overflow-hidden">
            <style>
                {`
                @keyframes aurora-anim-1 {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                    50% { transform: translate(-30%, -60%) scale(1.5); opacity: 0.5; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                }
                @keyframes aurora-anim-2 {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
                    50% { transform: translate(-70%, -40%) scale(1.5); opacity: 0.4; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
                }
                @keyframes aurora-anim-3 {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
                    50% { transform: translate(-40%, -30%) scale(1.3); opacity: 0.3; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
                }
                `}
            </style>
            <div style={auroraContainerStyle}>
                <div 
                    className="absolute top-1/2 left-1/2 w-[150%] h-[150%]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #9333ea, transparent, transparent)', // purple-600
                        animation: 'aurora-anim-1 20s ease-in-out infinite',
                    }}
                />
                <div 
                    className="absolute top-1/2 left-1/2 w-[150%] h-[150%]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #14b8a6, transparent, transparent)', // teal-500
                        animation: 'aurora-anim-2 25s ease-in-out infinite',
                    }}
                />
                 <div 
                    className="absolute top-1/2 left-1/2 w-[150%] h-[150%]"
                    style={{
                         backgroundImage: 'radial-gradient(circle, #f43f5e, transparent, transparent)', // rose-500
                        animation: 'aurora-anim-3 18s ease-in-out infinite',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-white">Northern Lights Inc.</h2>
                <p className="mt-4 max-w-xl mx-auto">Navigating the digital cosmos with grace and style.</p>
                <div className="mt-8 flex justify-center gap-x-8 gap-y-4 flex-wrap">
                    <a href="#" className="font-semibold hover:text-white transition-colors">Products</a>
                    <a href="#" className="font-semibold hover:text-white transition-colors">Showcase</a>
                    <a href="#" className="font-semibold hover:text-white transition-colors">About Us</a>
                    <a href="#" className="font-semibold hover:text-white transition-colors">Contact</a>
                </div>
                <div className="mt-12 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer27;