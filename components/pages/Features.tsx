import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShoppingCart, BarChart, Palette, Globe, Lock, Code, Users } from 'lucide-react';
import LandingHeader from '../LandingHeader';
import LandingFooter from '../LandingFooter';

export const Features: React.FC = () => {
    const features = [
        {
            icon: <ShoppingCart className="w-8 h-8" />,
            title: "Advanced E-Commerce",
            description: "Full-featured product management, inventory tracking, and order processing built for scale."
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: "Visual Page Builder",
            description: "Drag-and-drop interface with 100+ pre-built sections. No coding required."
        },
        {
            icon: <BarChart className="w-8 h-8" />,
            title: "Real-Time Analytics",
            description: "Track sales, customer behavior, and inventory in real-time with AI-powered insights."
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Multi-Channel Selling",
            description: "Sell everywhere - your store, social media, and marketplaces from one dashboard."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Lightning Fast",
            description: "Built on modern infrastructure for blazing-fast page loads and seamless experiences."
        },
        {
            icon: <Lock className="w-8 h-8" />,
            title: "Enterprise Security",
            description: "Bank-level encryption, PCI compliance, and SOC 2 certified infrastructure."
        },
        {
            icon: <Code className="w-8 h-8" />,
            title: "Developer Friendly",
            description: "Powerful API, webhooks, and extensibility for custom integrations."
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Customer Management",
            description: "Complete CRM with segmentation, email marketing, and loyalty programs."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Background Aurora Effect */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-50 animate-breathe"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[150px] opacity-50 animate-breathe animation-delay-[-4s]"></div>
            </div>
            <LandingHeader />

            {/* Hero Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-7xl text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        Everything You Need to<br />
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Build & Scale
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                        WebPilot comes packed with powerful features designed to help you launch faster, sell smarter, and grow bigger.
                    </p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-xl p-6 hover:-translate-y-1 transition-transform">
                                <div className="text-cyan-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Experience WebPilot?</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Start your free trial today. No credit card required.
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
