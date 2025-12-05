import React from 'react';
import { Sparkles, Globe, Zap, Layers, Shield, BarChart3, Cpu, Palette } from 'lucide-react';

const Features: React.FC = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
            
            <div className="container mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">Next-Gen Platform</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                        All the power. <span className="text-gradient-animated">None of the limits.</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Evolv is more than a platform. It's an ecosystem of tools designed for hyper-growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 - AI Engine (Large) */}
                    <div className="md:col-span-2 md:row-span-2 feature-card-glow rounded-2xl p-8 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group">
                        <div className="flex flex-col h-full">
                            <div className="mb-6 relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                                    <Cpu className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient-animated transition-all">AI-Powered Insights Engine</h3>
                            <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                                Our "Evolv AI" co-pilot analyzes trends, suggests inventory optimizations, and even generates high-converting product descriptions for you. Stop guessing, start growing.
                            </p>
                            
                            {/* AI Demo visualization */}
                            <div className="mt-auto p-4 rounded-xl bg-black/40 border border-white/5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex -space-x-1">
                                        <div className="w-6 h-6 rounded-full bg-purple-500 ring-2 ring-black" />
                                        <div className="w-6 h-6 rounded-full bg-cyan-500 ring-2 ring-black" />
                                        <div className="w-6 h-6 rounded-full bg-pink-500 ring-2 ring-black" />
                                    </div>
                                    <span className="text-xs text-gray-500">AI analyzing 3 data streams</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 rounded-full bg-gray-800 overflow-hidden">
                                            <div className="h-full w-[85%] bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full animate-pulse-slow" />
                                        </div>
                                        <span className="text-xs text-cyan-400 font-mono">85%</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 flex-1 rounded-full bg-gray-800 overflow-hidden">
                                            <div className="h-full w-[92%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse-slow animation-delay-200" />
                                        </div>
                                        <span className="text-xs text-purple-400 font-mono">92%</span>
                                    </div>
                                </div>
                            </div>
                            
                            <a href="#" className="inline-flex items-center gap-2 text-cyan-400 font-semibold hover:text-cyan-300 mt-4 group/link">
                                Learn about AI tools 
                                <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                            </a>
                        </div>
                    </div>

                    {/* Card 2 - Global Infrastructure */}
                    <div className="feature-card-glow rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group hover:-translate-y-1 transition-transform">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Global-First Infrastructure</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Deploy instantly to a global CDN. Localized payments, currencies, and languages out of the box.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-400">200+ Regions</span>
                            <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-gray-400">&lt;50ms</span>
                        </div>
                    </div>
                    
                    {/* Card 3 - Instant Deployment */}
                    <div className="feature-card-glow rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group hover:-translate-y-1 transition-transform">
                        <div className="mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Instant Deployment</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Go from idea to live in minutes. Our CLI and Git-based workflows make development a breeze.
                        </p>
                        <div className="mt-4 font-mono text-xs text-gray-500 bg-black/40 rounded-lg p-2 border border-white/5">
                            <span className="text-green-400">$</span> npx evolv deploy <span className="animate-blink">|</span>
                        </div>
                    </div>

                    {/* Card 4 - Customization (Wide) */}
                    <div className="md:col-span-2 feature-card-glow rounded-2xl p-6 bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl group hover:-translate-y-1 transition-transform">
                        <div className="md:flex items-start gap-6">
                            <div className="mb-4 md:mb-0">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                                    <Palette className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">Limitless Customization</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Total control. Bring your own frontend, use our headless APIs, or build on our composable component-based theme architecture.
                                </p>
                            </div>
                            <div className="hidden md:flex gap-2 mt-4 md:mt-0">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center">
                                    <Layers className="w-5 h-5 text-pink-400" />
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-green-400" />
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
                        <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            SOC 2 compliant. End-to-end encryption. Your data is protected by industry-leading security standards.
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-green-400">All systems operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;