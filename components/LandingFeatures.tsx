import React from 'react';
import { Store, Globe, Zap, CreditCard, Shield, TrendingUp, Package, Palette } from 'lucide-react';

const Features: React.FC = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
            
            <div className="container mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <Store className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Everything You Need</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                        Selling online <span className="text-gradient-animated">should be easy.</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        No tech skills needed. We handle the complicated stuff so you can focus on what you love — your products.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 - Smart Assistant (Large) */}
                    <div className="md:col-span-2 md:row-span-2 feature-card-glow rounded-2xl p-8 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group">
                        <div className="flex flex-col h-full">
                            <div className="mb-6 relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                                    <TrendingUp className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient-animated transition-all">Know What's Selling</h3>
                            <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                                Our smart dashboard shows you exactly what customers are buying, what's running low, and even writes product descriptions for you. No spreadsheets or complicated reports — just clear, simple insights.
                            </p>
                            
                            {/* Simple stats visualization */}
                            <div className="mt-auto p-4 rounded-xl bg-black/40 border border-white/5">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-sm text-gray-400">This week's highlights</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Best seller: Summer Candle</span>
                                        <span className="text-sm text-green-400 font-semibold">+47 sold</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-300">Revenue</span>
                                        <span className="text-sm text-cyan-400 font-semibold">$1,247</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-yellow-400">⚠️ Restock soon: Lavender Scent</span>
                                        <span className="text-sm text-gray-400">3 left</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - Sell Anywhere */}
                    <div className="feature-card-glow rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group hover:-translate-y-1 transition-transform">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Sell to Anyone, Anywhere</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your store works worldwide. Customers can pay in their currency, and your site loads fast no matter where they are.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-400">🇺🇸 🇬🇧 🇨🇦 🇦🇺 +190</span>
                        </div>
                    </div>
                    
                    {/* Card 3 - Quick Setup */}
                    <div className="feature-card-glow rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group hover:-translate-y-1 transition-transform">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Live in 5 Minutes</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Answer a few questions, pick a design, add your first product — done. Your store is live and ready to take orders.
                        </p>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <span className="text-green-400">✓</span>
                            <span className="text-gray-400">No tech skills needed</span>
                        </div>
                    </div>

                    {/* Card 4 - Easy Payments (Wide) */}
                    <div className="md:col-span-2 feature-card-glow rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group hover:-translate-y-1 transition-transform">
                        <div className="md:flex items-start gap-6">
                            <div className="mb-4 md:mb-0">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">Get Paid Your Way</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Accept credit cards, Apple Pay, Google Pay, and more. Money goes straight to your bank account — no waiting, no hassle.
                                </p>
                            </div>
                            <div className="hidden md:flex gap-2 mt-4 md:mt-0">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-pink-400" />
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                                    <Palette className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 5 - Security */}
                    <div className="feature-card-glow rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group hover:-translate-y-1 transition-transform">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your customers' payment info is protected with bank-level security. We handle all the security stuff so you don't have to worry.
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-400">Protected 24/7</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
