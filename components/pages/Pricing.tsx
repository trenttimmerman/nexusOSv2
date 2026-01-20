import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Header from '../../new landing page/Header';
export const Pricing: React.FC = () => {
    const plans = [
        {
            name: "Starter",
            price: "$29",
            period: "/month",
            description: "Perfect for new stores getting started",
            features: [
                "Up to 100 products",
                "5 pages",
                "Basic analytics",
                "Email support",
                "Mobile optimized",
                "SSL certificate"
            ]
        },
        {
            name: "Professional",
            price: "$99",
            period: "/month",
            description: "For growing businesses",
            featured: true,
            features: [
                "Unlimited products",
                "Unlimited pages",
                "Advanced analytics",
                "Priority support",
                "Custom domain",
                "Email marketing",
                "Customer segmentation",
                "API access"
            ]
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "For high-volume businesses",
            features: [
                "Everything in Professional",
                "Dedicated account manager",
                "Custom integrations",
                "White-label options",
                "SLA guarantee",
                "Advanced security",
                "Multi-store support",
                "Custom contracts"
            ]
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
                        Simple, Transparent
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Pricing</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose the plan that fits your business. All plans include a 14-day free trial.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <div 
                                key={index} 
                                className={`rounded-xl p-8 ${
                                    plan.featured 
                                        ? 'bg-gradient-to-b from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500 scale-105' 
                                        : 'bg-neutral-800 border border-neutral-700'
                                }`}
                            >
                                {plan.featured && (
                                    <div className="bg-cyan-500 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-gray-400">{plan.period}</span>
                                </div>
                                <Link 
                                    to="/signup" 
                                    className={`block text-center py-3 rounded-lg font-semibold mb-8 ${
                                        plan.featured 
                                            ? 'bg-cyan-500 hover:bg-cyan-600' 
                                            : 'bg-neutral-700 hover:bg-neutral-600'
                                    }`}
                                >
                                    Start Free Trial
                                </Link>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                            <h3 className="font-semibold mb-2">Can I change plans later?</h3>
                            <p className="text-gray-400 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                            <h3 className="font-semibold mb-2">Is there a setup fee?</h3>
                            <p className="text-gray-400 text-sm">No, there are no setup fees or hidden charges. You only pay the monthly subscription.</p>
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-400 text-sm">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
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
