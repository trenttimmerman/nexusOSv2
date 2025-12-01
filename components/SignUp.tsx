import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2, ArrowRight, Store, Mail, Lock, CheckCircle2 } from 'lucide-react';

export const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'account' | 'store'>('account');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setStoreName(name);
    // Auto-generate slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setStoreSlug(slug);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.session) {
        // Email confirmation required
        alert('Please check your email to confirm your account before continuing.');
        setLoading(false);
        return;
      }

      // 2. Create Tenant (Store)
      const { error: tenantError } = await supabase.rpc('create_tenant', {
        store_name: storeName,
        store_slug: storeSlug
      });

      if (tenantError) throw tenantError;

      // 3. Redirect to Admin
      // Force a reload or re-fetch of data context might be needed, 
      // but navigating to /admin should trigger the AuthWrapper/DataProvider to load.
      navigate('/admin');

    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Left: Visual */}
      <div className="hidden md:flex w-1/2 bg-neutral-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-50"></div>
        <div className="relative z-10 max-w-lg">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl mb-8">E</div>
          <h1 className="text-5xl font-black tracking-tight mb-6">Build your empire.</h1>
          <p className="text-xl text-neutral-400 leading-relaxed mb-8">
            Join thousands of brands using Evolv to scale their commerce operations.
          </p>
          <div className="space-y-4">
            {[
              '14-day free trial',
              'No credit card required',
              'Cancel anytime',
              'Instant setup'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-neutral-300">
                <CheckCircle2 size={20} className="text-blue-500" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">E</div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Start your free trial</h2>
            <p className="text-neutral-500 mt-2">Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold">Log in</Link></p>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            {step === 'account' ? (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    if (email && password.length >= 6) setStep('store');
                    else setError('Please enter a valid email and password (min 6 chars)');
                  }}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Store Name</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input 
                      type="text" 
                      required
                      value={storeName}
                      onChange={handleStoreNameChange}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-blue-500 outline-none transition-colors"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Store URL</label>
                  <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                    <span className="pl-4 pr-2 text-neutral-500 text-sm font-mono">nexusos.app/</span>
                    <input 
                      type="text" 
                      required
                      value={storeSlug}
                      onChange={(e) => setStoreSlug(e.target.value)}
                      className="flex-1 bg-transparent py-3 pr-4 text-white outline-none font-mono text-sm"
                      placeholder="acme-corp"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setStep('account')}
                    className="px-6 py-4 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Store'}
                  </button>
                </div>
              </div>
            )}
          </form>
          
          <p className="text-xs text-neutral-600 text-center">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
