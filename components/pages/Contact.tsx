import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { PublicHeader } from '../PublicHeader';

export const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to your backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

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
                        Get in
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Touch</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Have a question or need help? We're here for you.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">Let's Talk</h2>
                                <p className="text-gray-400">
                                    Whether you're a new customer, existing merchant, or just curious about WebPilot, we'd love to hear from you.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-gray-400 text-sm">hello@webpilot.com</p>
                                        <p className="text-gray-400 text-sm">support@webpilot.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                                        <p className="text-gray-400 text-sm">Mon-Fri 9am-6pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Office</h3>
                                        <p className="text-gray-400 text-sm">123 Commerce Street</p>
                                        <p className="text-gray-400 text-sm">San Francisco, CA 94102</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
                                        style={{ color: '#000000' }}
                                        placeholder="Your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
                                        style={{ color: '#000000' }}
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500"
                                        style={{ color: '#000000' }}
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 resize-none"
                                        style={{ color: '#000000' }}
                                        placeholder="Your message..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    {submitted ? 'Message Sent!' : 'Send Message'}
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
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
