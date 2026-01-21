import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../LandingHeader';
import { Puzzle, Code2, Zap } from 'lucide-react';

export const Integrations: React.FC = () => {
    const integrations = [
        {
            name: "Stripe",
            category: "Payments",
            description: "Accept payments from customers worldwide",
            logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200&q=80"
        },
        {
            name: "PayPal",
            category: "Payments",
            description: "Give customers another payment option",
            logo: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=200&q=80"
        },
        {
            name: "Mailchimp",
            category: "Marketing",
            description: "Sync customers and send email campaigns",
            logo: "https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?w=200&q=80"
        },
        {
            name: "Google Analytics",
            category: "Analytics",
            description: "Track visitors and conversion events",
            logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&q=80"
        },
        {
            name: "ShipStation",
            category: "Shipping",
            description: "Automate order fulfillment and shipping",
            logo: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=200&q=80"
        },
        {
            name: "Zapier",
            category: "Automation",
            description: "Connect to 5000+ apps without code",
            logo: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=200&q=80"
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
                        Connect Your
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Favorite Tools</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        WebPilot integrates seamlessly with the tools you already use.
                    </p>
                </div>
            </section>

            {/* Integrations Grid */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {integrations.map((integration, index) => (
                            <div key={index} className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-xl p-6 hover:-translate-y-1 transition-transform">
                                <div className="w-16 h-16 bg-neutral-700 rounded-lg mb-4 overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-500" />
                                </div>
                                <div className="text-xs text-cyan-400 font-semibold mb-2">{integration.category}</div>
                                <h3 className="text-xl font-bold mb-2">{integration.name}</h3>
                                <p className="text-gray-400 text-sm">{integration.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Puzzle className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="font-semibold mb-2">One-Click Setup</h3>
                            <p className="text-gray-400 text-sm">Connect integrations in seconds without technical knowledge</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Code2 className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Powerful API</h3>
                            <p className="text-gray-400 text-sm">Build custom integrations with our developer-friendly REST API</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h3 className="font-semibold mb-2">Webhooks</h3>
                            <p className="text-gray-400 text-sm">Get real-time updates for orders, products, and customer events</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-neutral-800 py-12 px-6">
                <div className="container mx-auto max-w-7xl text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} WebPilot, Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
