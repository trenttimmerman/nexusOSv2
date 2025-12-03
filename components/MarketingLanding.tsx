import React, { useState } from 'react';
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
  Smartphone,
  X,
  Check,
  ChevronDown,
  Menu,
  Star,
  Rocket,
  Layout,
  CreditCard
} from 'lucide-react';

export const MarketingLanding = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">E</div>
            <span className="font-bold text-xl tracking-tight">Evolv</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#comparison" className="hover:text-white transition-colors">Compare</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
              Log In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors">
              Start Building
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-black border-b border-white/10 p-6 flex flex-col gap-4">
            <a href="#features" className="text-lg font-medium text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#comparison" className="text-lg font-medium text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Compare</a>
            <a href="#pricing" className="text-lg font-medium text-neutral-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <Link to="/login" className="text-lg font-medium text-neutral-400 hover:text-white">Log In</Link>
            <Link to="/signup" className="w-full py-3 bg-white text-black text-center font-bold rounded-full">Start Building</Link>
          </div>
        )}
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
            Stop fighting with Shopify themes and Wix plugins. Build, scale, and dominate with the world's first true Commerce OS.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Link to="/signup" className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-blue-900/50">
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link to="/store" className="w-full md:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 font-bold rounded-full flex items-center justify-center gap-2 transition-all">
              View Demo Store
            </Link>
          </div>
          <div className="mt-8 text-sm text-neutral-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
        
        {/* Hero Visual */}
        <div className="mt-20 max-w-6xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="relative rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-900/20 group">
            <div className="absolute top-0 left-0 right-0 h-12 bg-black/50 border-b border-white/5 flex items-center px-4 gap-2 z-20">
              <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
              <div className="ml-4 px-3 py-1 bg-black/50 rounded-full text-[10px] text-neutral-500 font-mono border border-white/5">
                evolv.app/dashboard
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="w-full opacity-80 pt-12 transition-transform duration-700 group-hover:scale-[1.01]"
            />
            {/* Floating UI Elements */}
            <div className="absolute bottom-10 left-10 p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl transform transition-all duration-500 hover:-translate-y-2 hidden md:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-green-400">Live Sales</span>
              </div>
              <div className="text-2xl font-bold text-white">$12,450.00</div>
              <div className="text-xs text-neutral-400">+15% vs last hour</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-white/5 bg-neutral-950/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mb-8">Trusted by next-gen brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella', 'Cyberdyne'].map((brand) => (
              <span key={brand} className="text-xl md:text-2xl font-black text-white">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why settle for less?</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">See how Evolv stacks up against the legacy platforms.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-6 text-lg font-bold text-neutral-500">Feature</th>
                  <th className="p-6 text-xl font-bold text-white bg-blue-900/10 border-t-2 border-blue-500 rounded-t-xl w-1/4">Evolv</th>
                  <th className="p-6 text-lg font-bold text-neutral-400 w-1/4">Shopify</th>
                  <th className="p-6 text-lg font-bold text-neutral-400 w-1/4">Wix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  { feature: "Transaction Fees", evolv: "0%", shopify: "2.0%", wix: "Varies" },
                  { feature: "Visual Editor", evolv: "Real-time Canvas", shopify: "Basic Theme Editor", wix: "Drag & Drop (Slow)" },
                  { feature: "Performance Score", evolv: "100/100", shopify: "~60/100", wix: "~40/100" },
                  { feature: "Database Access", evolv: "Full SQL Access", shopify: "No", wix: "No" },
                  { feature: "API Limits", evolv: "Unlimited", shopify: "Restricted", wix: "Restricted" },
                  { feature: "Plugins Required", evolv: "Zero", shopify: "Many ($$$)", wix: "Many" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-medium text-neutral-300">{row.feature}</td>
                    <td className="p-6 font-bold text-blue-400 bg-blue-900/5 border-x border-blue-500/10">
                      {row.evolv === "0%" || row.evolv === "100/100" || row.evolv === "Unlimited" ? (
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} /> {row.evolv}</span>
                      ) : row.evolv}
                    </td>
                    <td className="p-6 text-neutral-500">{row.shopify}</td>
                    <td className="p-6 text-neutral-500">{row.wix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <div key={idx} className="p-8 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-blue-500/50 transition-all hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">Don't just take our word for it.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "We switched from Shopify Plus and saved $40k/year in app fees alone. The performance difference is night and day.", author: "Sarah J.", role: "CTO, FashionNova" },
              { quote: "Finally, a platform that lets designers design. No more fighting with rigid templates or begging developers for changes.", author: "Mike R.", role: "Creative Director, Nike" },
              { quote: "The API is a dream. We built a custom 3D product configurator in a weekend. You can't do this on Wix.", author: "Alex T.", role: "Lead Dev, TechStyle" }
            ].map((t, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-neutral-900 border border-white/5 relative">
                <div className="flex gap-1 text-yellow-500 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-lg text-neutral-300 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                  <div>
                    <div className="font-bold text-white">{t.author}</div>
                    <div className="text-xs text-neutral-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, transparent pricing.</h2>
            <p className="text-neutral-400">No hidden transaction fees. No revenue limits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-black border border-white/10 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-neutral-400 mb-2">Starter</h3>
                <div className="text-4xl font-bold text-white">$29<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
              </div>
              <ul className="flex-1 space-y-4 mb-8">
                {['1 Store', 'Up to 1,000 Products', 'Standard Analytics', 'Community Support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-neutral-300">
                    <Check size={16} className="text-blue-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/5 text-center font-bold transition-colors">Start Free Trial</Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl bg-blue-900/10 border border-blue-500/50 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-xs font-bold uppercase tracking-widest rounded-full">Most Popular</div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-400 mb-2">Growth</h3>
                <div className="text-4xl font-bold text-white">$79<span className="text-lg text-neutral-500 font-normal">/mo</span></div>
              </div>
              <ul className="flex-1 space-y-4 mb-8">
                {['3 Stores', 'Unlimited Products', 'Advanced Analytics', 'Priority Support', 'Custom Domains', '0% Transaction Fees'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-white">
                    <Check size={16} className="text-blue-400" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-center font-bold transition-colors shadow-lg shadow-blue-900/50">Get Started</Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl bg-black border border-white/10 flex flex-col">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-neutral-400 mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-white">Custom</div>
              </div>
              <ul className="flex-1 space-y-4 mb-8">
                {['Unlimited Stores', 'Dedicated Success Manager', 'Custom Integrations', 'SLA Guarantee', 'SSO & Advanced Security'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-neutral-300">
                    <Check size={16} className="text-blue-500" /> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/5 text-center font-bold transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Do I need to know how to code?", a: "Not at all. Evolv is designed for visual building. However, if you are a developer, you have full access to the code and database." },
              { q: "Can I migrate from Shopify?", a: "Yes! We have a one-click migration tool that imports all your products, customers, and orders in minutes." },
              { q: "Is it really faster than other platforms?", a: "Yes. We use edge computing and static generation to ensure your store loads instantly. We consistently score 100/100 on Google PageSpeed." },
              { q: "What happens if I exceed my plan limits?", a: "We'll notify you, but we won't shut you down. We believe in helping you grow, not punishing success." }
            ].map((item, idx) => (
              <details key={idx} className="group bg-neutral-900/50 rounded-xl border border-white/5 open:bg-neutral-900 open:border-blue-500/30 transition-all">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg list-none">
                  {item.q}
                  <ChevronDown className="transform group-open:rotate-180 transition-transform text-neutral-500" />
                </summary>
                <div className="px-6 pb-6 text-neutral-400 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tight">Ready to evolve?</h2>
          <p className="text-xl text-neutral-300 mb-12 max-w-2xl mx-auto">Join thousands of brands building the future of commerce. Start your 14-day free trial today.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:bg-neutral-200 transition-all hover:scale-105">
            Start Building Now <ArrowRight />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs">E</div>
              <span className="font-bold text-lg">Evolv</span>
            </div>
            <p className="text-neutral-500 mb-6">The operating system for modern commerce.</p>
            <div className="flex gap-4 text-neutral-400">
              <a href="#" className="hover:text-white"><Globe size={20} /></a>
              <a href="#" className="hover:text-white"><Zap size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><a href="#" className="hover:text-blue-400">Features</a></li>
              <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400">Showcase</a></li>
              <li><a href="#" className="hover:text-blue-400">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><a href="#" className="hover:text-blue-400">About</a></li>
              <li><a href="#" className="hover:text-blue-400">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-neutral-500">
              <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-400">Terms</a></li>
              <li><a href="#" className="hover:text-blue-400">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 text-center text-neutral-600">
          © 2025 Evolv Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
