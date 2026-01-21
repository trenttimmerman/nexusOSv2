import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../LandingHeader';
import LandingFooter from '../LandingFooter';
import { Target, Heart, Zap, Users } from 'lucide-react';

export const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Background Aurora Effect */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-50 animate-breathe"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[150px] opacity-50 animate-breathe animation-delay-[-4s]"></div>
            </div>
            <LandingHeader />

            {/* Hero Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Building the Future of
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Commerce</span>
                        </h1>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            WebPilot was founded with a simple mission: empower everyone to build and scale their online business without technical barriers or expensive developers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-400">
                                <p>
                                    Founded in 2025, WebPilot emerged from a simple observation: building an online store shouldn't require a computer science degree or a six-figure budget.
                                </p>
                                <p>
                                    Our founders, experienced engineers and entrepreneurs, witnessed countless brilliant business ideas fail—not because the products weren't good, but because the technology was too complex, too expensive, or too rigid.
                                </p>
                                <p>
                                    Today, WebPilot powers thousands of stores worldwide, from solo entrepreneurs to fast-growing brands doing millions in revenue. We're proud to be the platform that democratizes e-commerce.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-12 border border-cyan-500/30">
                            <div className="space-y-8">
                                <div>
                                    <div className="text-4xl font-bold text-cyan-400 mb-2">10,000+</div>
                                    <div className="text-gray-400">Active Stores</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-cyan-400 mb-2">$500M+</div>
                                    <div className="text-gray-400">GMV Processed</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-cyan-400 mb-2">150+</div>
                                    <div className="text-gray-400">Countries</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Simplicity</h3>
                            <p className="text-gray-400 text-sm">Complex technology, simple experience</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Customer First</h3>
                            <p className="text-gray-400 text-sm">Your success is our success</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Innovation</h3>
                            <p className="text-gray-400 text-sm">Always pushing boundaries</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Community</h3>
                            <p className="text-gray-400 text-sm">Together we grow stronger</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold mb-6">Join Thousands of Successful Merchants</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Start your free trial today and see why businesses choose WebPilot.
                    </p>
                    <Link to="/signup" className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg">
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
};
