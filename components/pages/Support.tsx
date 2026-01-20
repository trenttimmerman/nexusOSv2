import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Package, MessageCircle, RefreshCw, Shield } from 'lucide-react';
import { PublicHeader } from '../PublicHeader';

export const Support: React.FC = () => {
    const helpTopics = [
        {
            icon: <ShoppingBag className="w-6 h-6" />,
            title: "Getting Started",
            description: "Set up your first store and launch in minutes",
            articles: ["Creating your first product", "Setting up payments", "Customizing your theme"]
        },
        {
            icon: <CreditCard className="w-6 h-6" />,
            title: "Payments & Billing",
            description: "Managing transactions and subscriptions",
            articles: ["Payment gateway setup", "Understanding fees", "Managing subscriptions"]
        },
        {
            icon: <Package className="w-6 h-6" />,
            title: "Orders & Shipping",
            description: "Fulfillment and delivery management",
            articles: ["Processing orders", "Shipping integrations", "Tracking management"]
        },
        {
            icon: <MessageCircle className="w-6 h-6" />,
            title: "Customer Management",
            description: "Building customer relationships",
            articles: ["CRM features", "Email campaigns", "Customer segmentation"]
        },
        {
            icon: <RefreshCw className="w-6 h-6" />,
            title: "Integrations",
            description: "Connect with your favorite tools",
            articles: ["Available integrations", "API documentation", "Webhooks setup"]
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Security & Privacy",
            description: "Keeping your store secure",
            articles: ["SSL certificates", "GDPR compliance", "Two-factor authentication"]
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            <PublicHeader />
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
                        How Can We
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Help?</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                        Search our knowledge base or contact our support team.
                    </p>
                    <div className="max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-6 py-4 focus:outline-none focus:border-cyan-500"
                            style={{ color: '#ffffff' }}
                        />
                    </div>
                </div>
            </section>

            {/* Help Topics Grid */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {helpTopics.map((topic, index) => (
                            <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-cyan-500 transition-colors">
                                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                                    <div className="text-cyan-400">{topic.icon}</div>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                                <p className="text-gray-400 text-sm mb-4">{topic.description}</p>
                                <ul className="space-y-2">
                                    {topic.articles.map((article, idx) => (
                                        <li key={idx}>
                                            <a href="#" className="text-cyan-400 text-sm hover:underline">{article}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Support Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
                        <p className="text-gray-400 mb-8">
                            Our support team is available 24/7 to assist you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/contact" className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold">
                                Contact Support
                            </Link>
                            <a href="mailto:support@webpilot.com" className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-lg font-semibold">
                                Email Us
                            </a>
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
