
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CallToAction: React.FC = () => {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="relative rounded-3xl overflow-hidden">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-violet-800 to-cyan-800 animate-gradient-xy" />
                    
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />
                    
                    {/* Floating orbs */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-float-slow" />
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl animate-float-slower" />
                    
                    <div className="relative z-10 p-12 md:p-16 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm text-white/90">No credit card required</span>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
                            Ready to <span className="text-gradient-animated">Evolv</span>?
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
                            Start building your commerce empire today. Join thousands of founders who trust Evolv to power their vision.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/signup" 
                                className="group relative bg-white text-gray-950 font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 text-lg flex items-center gap-2"
                            >
                                Start Your Free Trial
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <span className="text-white/60 text-sm">14-day free trial • Cancel anytime</span>
                        </div>
                        
                        {/* Trust badges */}
                        <div className="flex flex-wrap justify-center items-center gap-6 mt-12 pt-8 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-white/70">SOC 2 Compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-white/70">GDPR Ready</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-white/70">99.9% Uptime SLA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;