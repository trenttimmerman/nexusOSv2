import React from 'react';

const Footer31: React.FC = () => {
    return (
        <>
            <style>
                {`
                @keyframes blob-anim-1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20%, -30%) scale(1.1); }
                    50% { transform: translate(-10%, 15%) scale(0.9); }
                    75% { transform: translate(30%, 10%) scale(1.05); }
                }
                @keyframes blob-anim-2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(-15%, 25%) scale(1.1); }
                    50% { transform: translate(20%, -20%) scale(0.95); }
                    75% { transform: translate(-25%, -10%) scale(1); }
                }
                `}
            </style>
            <footer className="relative bg-indigo-900 text-indigo-100 overflow-hidden">
                <svg className="absolute w-0 h-0">
                    <defs>
                        <filter id="gooey">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
                            <feBlend in="SourceGraphic" in2="goo" />
                        </filter>
                    </defs>
                </svg>

                <div 
                    className="absolute inset-0 w-full h-full"
                    style={{ filter: 'url(#gooey)' }}
                >
                     <div 
                        className="absolute w-64 h-64 bg-indigo-500 rounded-full"
                        style={{
                            top: '10%', left: '20%',
                            animation: 'blob-anim-1 25s ease-in-out infinite',
                        }}
                    />
                    <div 
                        className="absolute w-72 h-72 bg-purple-500 rounded-full"
                         style={{
                            top: '40%', left: '60%',
                            animation: 'blob-anim-2 20s ease-in-out infinite',
                        }}
                    />
                     <div 
                        className="absolute w-48 h-48 bg-rose-500 rounded-full"
                         style={{
                            bottom: '10%', left: '40%',
                            animation: 'blob-anim-1 22s ease-in-out infinite reverse',
                        }}
                    />
                </div>
                
                <div className="relative z-10 max-w-5xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Let's Create Something Fluid.
                    </h2>
                    <p className="mt-4 text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto">
                       We believe in adaptable, dynamic solutions that flow with your needs.
                    </p>
                    <div className="mt-8">
                        <a href="#" className="inline-block px-8 py-4 bg-white text-indigo-700 font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105">
                            Get in Touch
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer31;