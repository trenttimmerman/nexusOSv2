import React from 'react';

const AnimatedLink: React.FC<{ text: string }> = ({ text }) => {
    return (
        <a href="#" className="block overflow-hidden relative text-4xl md:text-6xl font-extrabold text-gray-800 hover:text-indigo-600 transition-colors duration-300 group">
            <span className="inline-block transition-transform duration-500 ease-in-out group-hover:-translate-y-full">
                {text.split('').map((char, i) => (
                    <span key={i} className="inline-block transition-transform duration-500 ease-in-out" style={{ transitionDelay: `${i * 30}ms` }}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
            </span>
             <span className="inline-block absolute left-0 translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                {text.split('').map((char, i) => (
                    <span key={i} className="inline-block transition-transform duration-500 ease-in-out text-indigo-600" style={{ transitionDelay: `${i * 30}ms` }}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
            </span>
        </a>
    );
};


const Footer34: React.FC = () => {
    return (
        <footer className="bg-gray-100 py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <nav className="space-y-4">
                    <AnimatedLink text="Our Work" />
                    <AnimatedLink text="About Us" />
                    <AnimatedLink text="Get In Touch" />
                </nav>
                <div className="mt-16 pt-8 border-t border-gray-300 flex justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Kinetic Co.</p>
                    <div className="flex space-x-4">
                        <a href="#" className="hover:text-gray-900">Twitter</a>
                        <a href="#" className="hover:text-gray-900">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer34;