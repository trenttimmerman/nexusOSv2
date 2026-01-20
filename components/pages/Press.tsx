import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageCircle } from 'lucide-react';
import { PublicHeader } from '../PublicHeader';

export const Press: React.FC = () => {
    const pressReleases = [
        {
            title: "WebPilot Raises $50M Series B to Democratize E-Commerce",
            date: "January 15, 2026",
            excerpt: "Leading venture capital firms invest in mission to make online selling accessible to everyone."
        },
        {
            title: "WebPilot Surpasses 10,000 Active Merchants Milestone",
            date: "December 20, 2025",
            excerpt: "Platform celebrates rapid growth and $2B in GMV processed across 150 countries."
        },
        {
            title: "Introducing AI-Powered Product Descriptions",
            date: "December 1, 2025",
            excerpt: "New feature uses machine learning to generate high-converting product copy in seconds."
        }
    ];

    const media = [
        {
            publication: "TechCrunch",
            headline: "WebPilot is reimagining e-commerce for the next generation"
        },
        {
            publication: "Forbes",
            headline: "The platform helping small businesses compete with Amazon"
        },
        {
            publication: "The Verge",
            headline: "Inside the no-code revolution transforming online retail"
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
                <div className="container mx-auto max-w-7xl">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Press &
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Media</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-8">
                            The latest news, updates, and announcements from WebPilot.
                        </p>
                    </div>
                </div>
            </section>

            {/* Press Contact */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <MessageCircle className="w-6 h-6 text-cyan-400" />
                                    <h3 className="text-xl font-bold">Media Inquiries</h3>
                                </div>
                                <p className="text-gray-400 mb-2">For press and media questions:</p>
                                <a href="mailto:press@webpilot.com" className="text-cyan-400 hover:underline">press@webpilot.com</a>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <FileText className="w-6 h-6 text-cyan-400" />
                                    <h3 className="text-xl font-bold">Press Kit</h3>
                                </div>
                                <p className="text-gray-400 mb-2">Download our brand assets and media kit:</p>
                                <a href="#" className="text-cyan-400 hover:underline">Download Press Kit</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Press Releases */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-3xl font-bold mb-8">Recent Announcements</h2>
                    <div className="space-y-6">
                        {pressReleases.map((release, index) => (
                            <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-cyan-500 transition-colors">
                                <div className="text-cyan-400 text-sm mb-2">{release.date}</div>
                                <h3 className="text-xl font-bold mb-3">{release.title}</h3>
                                <p className="text-gray-400 mb-4">{release.excerpt}</p>
                                <a href="#" className="text-cyan-400 hover:underline font-semibold">Read More →</a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Media Coverage */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-3xl font-bold mb-8">In the News</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {media.map((item, index) => (
                            <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                                <div className="text-cyan-400 font-semibold mb-2">{item.publication}</div>
                                <p className="text-gray-300">{item.headline}</p>
                            </div>
                        ))}
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
