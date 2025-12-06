import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Features from './components/Features';
import Testimonial from './components/Testimonial';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import FadeInSection from './components/FadeInSection';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
    const [route, setRoute] = useState(window.location.hash);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    if (route.startsWith('#/dashboard') || route.startsWith('#/products') || route.startsWith('#/orders') || route.startsWith('#/customers') || route.startsWith('#/analytics') || route.startsWith('#/settings')) {
        return <Dashboard route={route} />;
    }

    return (
        <div className="antialiased bg-gray-950 text-white">
            {/* Background Aurora Effect */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-50 animate-breathe"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-[150px] opacity-50 animate-breathe animation-delay-[-4s]"></div>
                <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-violet-800 rounded-full filter blur-[120px] opacity-40 animate-breathe animation-delay-[-2s]"></div>
            </div>

            {/* Wrapper */}
            <div className="relative z-10">
                <Header />
                <main>
                    <Hero />
                    <FadeInSection>
                        <SocialProof />
                    </FadeInSection>
                    <FadeInSection>
                        <Features />
                    </FadeInSection>
                    <FadeInSection>
                        <Testimonial />
                    </FadeInSection>
                    <FadeInSection>
                        <CallToAction />
                    </FadeInSection>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;