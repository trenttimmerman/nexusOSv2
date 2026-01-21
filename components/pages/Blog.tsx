import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

export const Blog: React.FC = () => {
    const posts = [
        {
            title: "10 E-Commerce Trends to Watch in 2026",
            excerpt: "Stay ahead of the curve with these emerging trends shaping the future of online retail.",
            category: "Industry Insights",
            date: "January 15, 2026",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
        },
        {
            title: "How to Optimize Your Product Pages for Conversions",
            excerpt: "Learn the psychology and design principles that turn browsers into buyers.",
            category: "Best Practices",
            date: "January 12, 2026",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
        },
        {
            title: "From $0 to $1M: A Merchant Success Story",
            excerpt: "How one entrepreneur built a seven-figure business using WebPilot in just 18 months.",
            category: "Case Study",
            date: "January 8, 2026",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80"
        },
        {
            title: "Email Marketing Strategies That Actually Work",
            excerpt: "Proven tactics to grow your list and boost engagement with your customers.",
            category: "Marketing",
            date: "January 5, 2026",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
        },
        {
            title: "The Complete Guide to SEO for E-Commerce",
            excerpt: "Everything you need to know to rank higher and drive organic traffic to your store.",
            category: "SEO",
            date: "January 1, 2026",
            readTime: "10 min read",
            image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c2a0?w=800&q=80"
        },
        {
            title: "Introducing: AI-Powered Product Descriptions",
            excerpt: "Our latest feature uses AI to generate compelling product copy in seconds.",
            category: "Product Updates",
            date: "December 28, 2025",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Background Aurora Effect */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-50 animate-breathe"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[150px] opacity-50 animate-breathe animation-delay-[-4s]"></div>
            </div>
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
                        The WebPilot
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Blog</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Insights, tips, and strategies to help you grow your online business.
                    </p>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-xl overflow-hidden hover:-translate-y-1 transition-transform">
                        <div className="grid md:grid-cols-2">
                            <div className="h-64 md:h-auto bg-cover bg-center" style={{backgroundImage: `url(${posts[0].image})`}} />
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="text-cyan-400 text-sm font-semibold mb-2">{posts[0].category}</div>
                                <h2 className="text-3xl font-bold mb-4">{posts[0].title}</h2>
                                <p className="text-gray-400 mb-6">{posts[0].excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {posts[0].date}
                                    </span>
                                    <span>·</span>
                                    <span>{posts[0].readTime}</span>
                                </div>
                                <a href="#" className="text-cyan-400 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                    Read More <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.slice(1).map((post, index) => (
                            <article key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden hover:border-cyan-500 transition-colors">
                                <div className="h-48 bg-cover bg-center" style={{backgroundImage: `url(${post.image})`}} />
                                <div className="p-6">
                                    <div className="text-cyan-400 text-sm font-semibold mb-2">{post.category}</div>
                                    <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {post.date}
                                        </span>
                                        <span>·</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                    <a href="#" className="text-cyan-400 text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                        <p className="text-gray-400 mb-8">
                            Get the latest posts delivered straight to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
                                style={{ color: '#ffffff' }}
                            />
                            <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold">
                                Subscribe
                            </button>
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
