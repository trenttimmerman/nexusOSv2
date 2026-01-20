import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Terminal, Book, Webhook } from 'lucide-react';
import Header from '../../new landing page/Header';

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
        <div className="min-h-screen bg-neutral-900 text-white">
            <Header />
            {/* Header */}
            <header className="border-b border-neutral-800">
                <div className="container mx-auto max-w-7xl px-6 py-6 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold">
                        WebPilot<span className="text-cyan-400">.</span>
                    </Link>
                    <nav className="flex gap-6">
                        <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
                        <Link to="/login" className="text-gray-400 hover:text-white">Login</Link>
                        <Link to="/signup" className="bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded-lg font-medium">Get Started</Link>
                    </nav>
                </div>
            </header>

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
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
                            <Code className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">RESTful API</h3>
                            <p className="text-gray-400 text-sm">Clean, predictable endpoints</p>
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
                            <Terminal className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Rate Limiting</h3>
                            <p className="text-gray-400 text-sm">10,000 requests per hour</p>
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
                            <Webhook className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Webhooks</h3>
                            <p className="text-gray-400 text-sm">Real-time event notifications</p>
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 text-center">
                            <Book className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Full Docs</h3>
                            <p className="text-gray-400 text-sm">Complete API reference</p>
                        </div>
                    </div>

                    {/* Code Example */}
                    <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8">
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
                                <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 flex items-center gap-4">
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
            <footer className="border-t border-neutral-800 py-12 px-6 mt-24">
                <div className="container mx-auto max-w-7xl text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} WebPilot, Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
