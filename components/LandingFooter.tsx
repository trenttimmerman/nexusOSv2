
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="py-24">
            <div className="container mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-2">
                        <Link to="/" className="text-3xl font-bold">
                            Evolv<span className="text-cyan-400">.</span>
                        </Link>
                        <p className="text-gray-400 mt-4 max-w-xs">The operating system for the next generation of commerce.</p>
                        <p className="text-gray-500 text-sm mt-6">&copy; 2025 Evolv, Inc. All rights reserved.</p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-400 hover:text-white">Features</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Pricing</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Integrations</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">API</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-400 hover:text-white">Blog</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Docs</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Support</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Case Studies</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-400 hover:text-white">About Us</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Careers</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Press</Link></li>
                            <li><Link to="#" className="text-gray-400 hover:text-white">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
