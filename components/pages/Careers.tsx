import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

export const Careers: React.FC = () => {
    const positions = [
        {
            title: "Senior Full-Stack Engineer",
            department: "Engineering",
            location: "San Francisco, CA / Remote",
            type: "Full-time",
            description: "Build the next generation of e-commerce infrastructure with React, TypeScript, and Node.js."
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "Remote",
            type: "Full-time",
            description: "Create beautiful, intuitive experiences for merchants and shoppers worldwide."
        },
        {
            title: "Customer Success Manager",
            department: "Customer Success",
            location: "New York, NY / Remote",
            type: "Full-time",
            description: "Help our merchants succeed and grow their businesses on the WebPilot platform."
        },
        {
            title: "Content Marketing Lead",
            department: "Marketing",
            location: "Remote",
            type: "Full-time",
            description: "Lead our content strategy and create compelling stories that resonate with entrepreneurs."
        },
        {
            title: "DevOps Engineer",
            department: "Engineering",
            location: "San Francisco, CA / Remote",
            type: "Full-time",
            description: "Scale our infrastructure to support millions of transactions with reliability and performance."
        }
    ];

    const benefits = [
        "Competitive salary & equity",
        "Health, dental & vision insurance",
        "Unlimited PTO",
        "Remote-first culture",
        "Learning & development budget",
        "Home office stipend",
        "401(k) with matching",
        "Parental leave"
    ];

    return (
        <div className="min-h-screen bg-neutral-900 text-white">
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
                        Build the Future of
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Commerce</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Join our mission to empower entrepreneurs and democratize e-commerce for everyone.
                    </p>
                </div>
            </section>

            {/* Culture Section */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Life at WebPilot</h2>
                            <div className="space-y-4 text-gray-400">
                                <p>
                                    We're a team of builders, dreamers, and problem solvers who believe that everyone should have the tools to build a successful online business.
                                </p>
                                <p>
                                    Our remote-first culture values flexibility, autonomy, and work-life balance. We hire globally and celebrate diverse perspectives.
                                </p>
                                <p>
                                    Whether you're working on infrastructure, design, or customer success, your work directly impacts thousands of merchants every day.
                                </p>
                            </div>
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8">
                            <h3 className="text-xl font-bold mb-6">Benefits & Perks</h3>
                            <ul className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-400">
                                        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-3xl font-bold mb-12 text-center">Open Positions</h2>
                    <div className="space-y-4">
                        {positions.map((position, index) => (
                            <div key={index} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 hover:border-cyan-500 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{position.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                {position.department}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {position.location}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {position.type}
                                            </span>
                                        </div>
                                    </div>
                                    <a 
                                        href="#" 
                                        className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        Apply Now <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold mb-6">Don't See a Role for You?</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        We're always looking for talented people. Send us your resume and let's talk.
                    </p>
                    <a 
                        href="mailto:careers@webpilot.com" 
                        className="inline-block bg-neutral-700 hover:bg-neutral-600 px-8 py-4 rounded-lg font-semibold"
                    >
                        Get in Touch
                    </a>
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
