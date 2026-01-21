import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from '../LandingHeader';
import LandingFooter from '../LandingFooter';
import FadeInSection from '../FadeInSection';
import { TrendingUp, DollarSign, Users, Star } from 'lucide-react';

export const CaseStudies: React.FC = () => {
    const caseStudies = [
        {
            company: "Urban Threads Co.",
            industry: "Fashion",
            metric: "$1.2M ARR",
            growth: "+450% YoY",
            quote: "WebPilot helped us scale from a side project to a full-time business in 8 months.",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
        },
        {
            company: "HomeScape Living",
            industry: "Home Goods",
            metric: "50K Orders",
            growth: "+320% Conversion",
            quote: "The visual builder made it easy to create high-converting landing pages without a developer.",
            image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80"
        },
        {
            company: "TechGear Pro",
            industry: "Electronics",
            metric: "$500K Monthly",
            growth: "+200% Traffic",
            quote: "Moving to WebPilot cut our operating costs by 40% while doubling our revenue.",
            image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&q=80"
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
                        Success
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Stories</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Real businesses achieving extraordinary results with WebPilot.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-8 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-3xl font-bold mb-1 text-gradient-animated">300%</div>
                            <div className="text-gray-400 text-sm">Average Growth</div>
                        </div>
                        <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-8 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                <DollarSign className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-3xl font-bold mb-1 text-gradient-animated">$2B+</div>
                            <div className="text-gray-400 text-sm">GMV Processed</div>
                        </div>
                        <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-8 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-3xl font-bold mb-1 text-gradient-animated">10K+</div>
                            <div className="text-gray-400 text-sm">Active Merchants</div>
                        </div>
                        <div className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl p-8 text-center hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
                                <Star className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-3xl font-bold mb-1 text-gradient-animated">4.9/5</div>
                            <div className="text-gray-400 text-sm">Customer Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Case Studies */}
            <section className="py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="space-y-12">
                        {caseStudies.map((study, index) => (
                            <div key={index} className="group feature-card-glow bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-white/5 backdrop-blur-xl rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300">
                                <div className="grid md:grid-cols-2">
                                    <div className="h-64 md:h-auto bg-cover bg-center" style={{backgroundImage: `url(${study.image})`}} />
                                    <div className="p-8 md:p-12 flex flex-col justify-center">
                                        <div className="text-cyan-400 text-sm font-semibold mb-2">{study.industry}</div>
                                        <h2 className="text-3xl font-bold mb-4">{study.company}</h2>
                                        <p className="text-gray-400 text-lg mb-6 italic">"{study.quote}"</p>
                                        <div className="flex gap-8">
                                            <div>
                                                <div className="text-2xl font-bold text-cyan-400">{study.metric}</div>
                                                <div className="text-gray-500 text-sm">Revenue</div>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-cyan-400">{study.growth}</div>
                                                <div className="text-gray-500 text-sm">Growth</div>
                                            </div>
                                        </div>
                                        <a href="#" className="mt-6 text-cyan-400 font-semibold hover:underline">
                                            Read Full Story →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Write Your Success Story?</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Join thousands of successful merchants on WebPilot.
                    </p>
                    <Link to="/signup" className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg">
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
};
