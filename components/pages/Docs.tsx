import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Code, Layout } from 'lucide-react';
import LandingHeader from '../LandingHeader';
import LandingFooter from '../LandingFooter';
import FadeInSection from '../FadeInSection';

export const Docs: React.FC = () => {
    const sections = [
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: "Getting Started",
            description: "Your first steps with WebPilot",
            articles: [
                "Quick Start Guide",
                "Creating Your First Store",
                "Adding Products",
                "Customizing Your Theme"
            ]
        },
        {
            icon: <Layout className="w-6 h-6" />,
            title: "Page Builder",
            description: "Build beautiful pages",
            articles: [
                "Understanding Sections",
                "Header Customization",
                "Footer Options",
                "Hero Sections Guide"
            ]
        },
        {
            icon: <Code className="w-6 h-6" />,
            title: "API Reference",
            description: "Technical documentation",
            articles: [
                "Authentication",
                "Products API",
                "Orders API",
                "Webhooks"
            ]
        },
        {
            icon: <Search className="w-6 h-6" />,
            title: "SEO & Marketing",
            description: "Grow your traffic",
            articles: [
                "SEO Best Practices",
                "Email Marketing",
                "Social Media Integration",
                "Analytics Setup"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 cursor-default">
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
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Documentation
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Everything you need to know to build and grow your store.
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:border-cyan-500"
                                style={{ color: '#ffffff' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Documentation Sections */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-xl p-8 hover:-translate-y-1 transition-transform">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <div className="text-cyan-400">{section.icon}</div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{section.title}</h3>
                                        <p className="text-gray-400 text-sm">{section.description}</p>
                                    </div>
                                </div>
                                <ul className="space-y-3">
                                    {section.articles.map((article, idx) => (
                                        <li key={idx}>
                                            <a href="#" className="text-cyan-400 hover:underline flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                                {article}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Guides */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-3xl font-bold mb-8">Popular Guides</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <a href="#" className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-cyan-500 transition-colors">
                            <h3 className="font-bold mb-2">Launch Your Store in 30 Minutes</h3>
                            <p className="text-gray-400 text-sm">Step-by-step guide to going live quickly</p>
                        </a>
                        <a href="#" className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-cyan-500 transition-colors">
                            <h3 className="font-bold mb-2">Shopify to WebPilot Migration</h3>
                            <p className="text-gray-400 text-sm">How to migrate your existing store</p>
                        </a>
                        <a href="#" className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-cyan-500 transition-colors">
                            <h3 className="font-bold mb-2">Optimizing for Conversions</h3>
                            <p className="text-gray-400 text-sm">Best practices to increase sales</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
};
