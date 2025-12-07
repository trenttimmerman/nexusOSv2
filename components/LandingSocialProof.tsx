import React from 'react';

const SocialProof: React.FC = () => {
    return (
        <section className="py-16 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl px-6 mb-8">
                <p className="text-center text-sm text-gray-500">Join thousands of small businesses already selling online</p>
            </div>
            
            {/* Stats bar - friendly version */}
            <div className="container mx-auto max-w-4xl px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-bold text-white mb-1">10,000+</div>
                        <div className="text-xs text-gray-500">Happy Store Owners</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-bold text-white mb-1">$50M+</div>
                        <div className="text-xs text-gray-500">Sales Made</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-bold text-white mb-1">150+</div>
                        <div className="text-xs text-gray-500">Countries Reached</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="text-2xl font-bold text-white mb-1">4.9 ⭐</div>
                        <div className="text-xs text-gray-500">Customer Rating</div>
                    </div>
                </div>
            </div>
            
            {/* Real business types instead of fake brand logos */}
            <div className="container mx-auto max-w-4xl px-6 mt-8">
                <div className="flex flex-wrap justify-center gap-3">
                    <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">Handmade Jewelry</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">Candles & Soaps</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300">Art Prints</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">Custom T-Shirts</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 border border-green-500/20 text-green-300">Baked Goods</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300">Pet Supplies</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">Home Decor</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-red-500/10 border border-red-500/20 text-red-300">Vintage Clothing</span>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
