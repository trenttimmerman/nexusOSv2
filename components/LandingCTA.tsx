
import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="bg-gradient-to-r from-purple-800 to-cyan-700 rounded-2xl p-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
                        Ready to Evolv?
                    </h2>
                    <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto mb-8">
                        Start building your commerce empire today. Join thousands of founders who trust Evolv to power their vision. Start free, no credit card required.
                    </p>
                    <Link to="/dashboard" className="bg-white text-gray-950 font-semibold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors shadow-lg text-lg">
                        Start Your 14-Day Free Trial
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;