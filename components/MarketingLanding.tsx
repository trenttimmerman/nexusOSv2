import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  Layers, 
  ArrowRight, 
  CheckCircle2,
  Code2,
  Smartphone
} from 'lucide-react';

export const MarketingLanding = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">E</div>
            <span className="font-bold text-xl tracking-tight">Evolv</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            v2.0 Now Available
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            Commerce,<br />
            <span className="text-blue-600">Evolved.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            The headless commerce platform for brands that refuse to compromise. Build, scale, and dominate with the world's most advanced visual editor.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link to="/signup" className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link to="/store" className="w-full md:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 font-bold rounded-full flex items-center justify-center gap-2 transition-all">
              View Demo Store
            </Link>
          </div>
        </div>
        
        {/* Hero Visual */}
        <div className="mt-20 max-w-6xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="relative rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 left-0 right-0 h-12 bg-black/50 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="w-full opacity-80 pt-12"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to scale.</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Stop wrestling with plugins and themes. Evolv gives you a complete operating system for modern commerce.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: "Visual Builder", desc: "Drag, drop, and design without writing a single line of code. Real-time preview included." },
              { icon: Zap, title: "Lightning Fast", desc: "Built on the edge. Your store loads instantly, anywhere in the world." },
              { icon: Globe, title: "Global Ready", desc: "Multi-currency, multi-language, and tax compliance built right in." },
              { icon: BarChart3, title: "Deep Analytics", desc: "Know your customers better than they know themselves with our AI-powered insights." },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and automated fraud detection keep your business safe." },
              { icon: Smartphone, title: "Mobile First", desc: "Every store is optimized for mobile devices automatically. No extra effort required." }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-blue-500/50 transition-colors group">
                <div className="w-12 h-12 bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-24 border-y border-white/5 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Code2 size={14} /> Developers First
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Headless without the headache.</h2>
            <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
              Use our React-based SDK to build custom storefronts while your marketing team manages content in the visual editor. It's the best of both worlds.
            </p>
            <ul className="space-y-4 mb-8">
              {['React & TypeScript Support', 'GraphQL & REST APIs', 'Webhooks & Events', 'Custom Data Models'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-neutral-300">
                  <CheckCircle2 size={20} className="text-purple-500" /> {item}
                </li>
              ))}
            </ul>
            <button className="text-white font-bold border-b border-purple-500 pb-1 hover:text-purple-400 transition-colors">Read the Documentation</button>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative bg-[#1e1e1e] rounded-xl p-6 border border-white/10 shadow-2xl font-mono text-sm">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="space-y-2 text-blue-300">
                <p><span className="text-purple-400">const</span> <span className="text-yellow-300">store</span> = <span className="text-purple-400">new</span> <span className="text-blue-400">EvolvClient</span>({'{'}</p>
                <p className="pl-4">apiKey: <span className="text-green-400">'ev_live_...'</span>,</p>
                <p className="pl-4">region: <span className="text-green-400">'us-east-1'</span></p>
                <p>{'});'}</p>
                <p className="text-neutral-500">// Fetch products with one line</p>
                <p><span className="text-purple-400">const</span> products = <span className="text-purple-400">await</span> store.products.<span className="text-yellow-300">list</span>();</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready to evolve?</h2>
          <p className="text-xl text-neutral-400 mb-12">Join thousands of high-growth brands building on Evolv today.</p>
          <Link to="/signup" className="inline-flex items-center justify-center px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-neutral-200 transition-colors">
            Start Your Free Trial
          </Link>
          <p className="mt-6 text-sm text-neutral-600">No credit card required. 14-day free trial.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">E</div>
            <span className="font-bold text-lg tracking-tight">Evolv</span>
          </div>
          <div className="text-neutral-500 text-sm">
            &copy; 2025 Evolv Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
