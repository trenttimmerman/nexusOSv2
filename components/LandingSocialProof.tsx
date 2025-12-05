
import React from 'react';

const brands = ['Quantum', 'Apex', 'Nova', 'Forge', 'Zenith', 'Pulse', 'Vertex', 'Helix'];

const SocialProof: React.FC = () => {
    return (
        <section className="py-16 relative overflow-hidden">
            {/* Gradient overlays for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
            
            <div className="container mx-auto max-w-7xl px-6 mb-8">
                <p className="text-center text-sm text-gray-500">Trusted by the world's most innovative brands</p>
            </div>
            
            {/* Infinite scrolling marquee */}
            <div className="flex animate-marquee whitespace-nowrap">
                {[...brands, ...brands, ...brands].map((brand, i) => (
                    <div key={i} className="mx-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-white/5 flex items-center justify-center">
                            <span className="text-lg font-bold text-gradient-animated">{brand[0]}</span>
                        </div>
                        <span className="font-semibold text-gray-500 text-xl hover:text-white transition-colors cursor-default">{brand}</span>
                    </div>
                ))}
            </div>
            
            {/* Stats bar */}
            <div className="container mx-auto max-w-4xl px-6 mt-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-bold text-white mb-1">10K+</div>
                        <div className="text-xs text-gray-500">Active Stores</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-bold text-white mb-1">$50M+</div>
                        <div className="text-xs text-gray-500">GMV Processed</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-bold text-white mb-1">150+</div>
                        <div className="text-xs text-gray-500">Countries</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                        <div className="text-xs text-gray-500">Uptime</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
