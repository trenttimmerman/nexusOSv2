import React from 'react';

const Features: React.FC = () => {
    return (
        <section id="features" className="py-24">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">All the power. None of the limits.</h2>
                    <p className="text-lg text-gray-300">
                        Evolv is more than a platform. It's an ecosystem of tools designed for hyper-growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 (Large) */}
                    <div className="md:col-span-2 md:row-span-2 glass-card bento-box rounded-2xl p-8">
                        <div className="flex flex-col h-full">
                            <div className="mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-cyan-400">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">AI-Powered Insights Engine</h3>
                            <p className="text-gray-300 mb-4 flex-grow">
                                Our "Evolv AI" co-pilot analyzes trends, suggests inventory optimizations, and even generates high-converting product descriptions for you. Stop guessing, start growing.
                            </p>
                            <a href="#" className="text-cyan-400 font-semibold hover:text-cyan-300">Learn about AI tools &rarr;</a>
                        </div>
                    </div>

                    {/* Card 2 (Small) */}
                    <div className="glass-card bento-box rounded-2xl p-8">
                        <div className="mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-purple-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Global-First Infrastructure</h3>
                        <p className="text-gray-300">
                            Deploy instantly to a global CDN. Localized payments, currencies, and languages out of the box.
                        </p>
                    </div>
                    
                    {/* Card 3 (Small) */}
                    <div className="glass-card bento-box rounded-2xl p-8">
                        <div className="mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-purple-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Instant Deployment</h3>
                        <p className="text-gray-300">
                            Go from idea to live in minutes. Our CLI and Git-based workflows make development a breeze.
                        </p>
                    </div>

                    {/* Card 4 (Wide) */}
                    <div className="md:col-span-3 glass-card bento-box rounded-2xl p-8">
                        <div className="md:flex items-center gap-6">
                            <div className="mb-4 md:mb-0">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-cyan-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m3 0l3 2.25-3 2.25M6.75 12l3-2.25m3 2.25l3 2.25-3 2.25M12 13.5l3-2.25m3 2.25l3 2.25-3 2.25M12 13.5l3 2.25-3 2.25M12 13.5l3-2.25" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-6-12h12" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Limitless Customization</h3>
                                <p className="text-gray-300">
                                    Total control. Bring your own frontend, use our headless APIs, or build on our composable component-based theme architecture. If you can dream it, you can build it.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;