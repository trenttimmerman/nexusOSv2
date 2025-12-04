
import React from 'react';
import Hero3DCanvas from './Hero3DCanvas';

const Hero: React.FC = () => {
    return (
        <section className="container mx-auto max-w-7xl px-6 py-24 md:py-40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
                        Build Your <span className="text-gradient">Commerce-Verse</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto md:mx-0 mb-8">
                        The next-generation platform for visionaries. Launch, scale, and manage your e-commerce empire with AI-powered tools and limitless customization.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <a href="#/dashboard" className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg">
                            Get Started Free
                        </a>
                        <a href="/store" className="bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors">
                            Book a Demo
                        </a>
                    </div>
                </div>
                
                <div className="w-full h-80 md:h-full min-h-[300px]">
                    <Hero3DCanvas />
                </div>
            </div>
        </section>
    );
};

export default Hero;