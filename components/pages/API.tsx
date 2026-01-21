import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Terminal, Book, Webhook } from 'lucide-react';
import LandingHeader from '../LandingHeader';
import LandingFooter from '../LandingFooter';
import FadeInSection from '../FadeInSection';

export const API: React.FC = () => {
    const endpoints = [
        {
            method: "GET",
            path: "/api/products",
            description: "List all products"
        },
        {
            method: "POST",
            path: "/api/products",
            description: "Create a new product"
        },
        {
            method: "GET",
            path: "/api/orders",
            description: "List all orders"
        },
        {
            method: "GET",
            path: "/api/customers",
            description: "List all customers"
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
                        Build Anything with
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Our API</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Powerful REST API to extend WebPilot and build custom integrations.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <a href="#" className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold">
                            View Documentation
                        </a>
                        <a href="#" className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-lg font-semibold">
                            Get API Key
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                <Code className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">RESTful API</h3>
                            <p className="text-gray-400 text-sm">Clean, predictable endpoints</p>
                        </div>
                        <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                <Terminal className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">Rate Limiting</h3>
                            <p className="text-gray-400 text-sm">10,000 requests per hour</p>
                        </div>
                        <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                <Webhook className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">Webhooks</h3>
                            <p className="text-gray-400 text-sm">Real-time event notifications</p>
                        </div>
                        <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                <Book className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2">Full Docs</h3>
                            <p className="text-gray-400 text-sm">Complete API reference</p>
                        </div>
                    </div>

                    {/* Code Example */}
                    <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-4">Quick Start</h3>
                        <div className="bg-neutral-900 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                            <pre className="text-gray-300">
{`// Initialize WebPilot API
const api = new WebPilot({
  apiKey: 'your_api_key_here'
});

// Fetch all products
const products = await api.products.list();

// Create a new product
const product = await api.products.create({
  name: 'New Product',
  price: 29.99,
  inventory: 100
});`}
                            </pre>
                        </div>
                    </div>

                    {/* Endpoints */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-6">Popular Endpoints</h3>
                        <div className="space-y-2">
                            {endpoints.map((endpoint, index) => (
                                <div key={index} className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-lg p-4 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
                                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                        {endpoint.method}
                                    </span>
                                    <code className="text-cyan-400 font-mono">{endpoint.path}</code>
                                    <span className="text-gray-400 text-sm ml-auto">{endpoint.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
};
