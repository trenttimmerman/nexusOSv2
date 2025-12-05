
import React from 'react';
import { Link } from 'react-router-dom';
import Hero3DCanvas from './Hero3DCanvas';

const Hero: React.FC = () => {
    return (
        <section className="relative container mx-auto max-w-7xl px-6 py-24 md:py-40 overflow-hidden">
            {/* Animated background orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/30 rounded-full blur-[120px] animate-float-slow" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-[150px] animate-float-slower" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-purple-900/20 via-transparent to-transparent rounded-full" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-sm text-gray-300">Now with AI-powered automation</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 animate-fade-in-up animation-delay-100">
                        Build Your <span className="text-gradient-animated">Commerce-Verse</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto md:mx-0 mb-8 animate-fade-in-up animation-delay-200">
                        The next-generation platform for visionaries. Launch, scale, and manage your e-commerce empire with AI-powered tools and limitless customization.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up animation-delay-300">
                        <Link to="/signup" className="group relative bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl hover:shadow-glow transition-all duration-300 overflow-hidden">
                            <span className="relative z-10">Get Started Free</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[radial-gradient(circle_at_50%_50%,white,transparent_70%)]" />
                        </Link>
                    </div>
                    
                    {/* Stats row */}
                    <div className="flex flex-wrap gap-8 mt-12 justify-center md:justify-start animate-fade-in-up animation-delay-400">
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-bold text-gradient-animated">10k+</div>
                            <div className="text-sm text-gray-500">Active Stores</div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-bold text-gradient-animated">$50M+</div>
                            <div className="text-sm text-gray-500">GMV Processed</div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="text-3xl font-bold text-gradient-animated">99.9%</div>
                            <div className="text-sm text-gray-500">Uptime</div>
                        </div>
                    </div>
                </div>
                
                <div className="relative w-full h-80 md:h-full min-h-[400px]">
                    <Hero3DCanvas />
                </div>
            </div>
        </section>
    );
};

export default Hero;