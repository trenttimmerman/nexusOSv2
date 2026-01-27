import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.session) {
        // Email confirmation required
        navigate('/signup/confirm', { 
          state: { 
            email,
            message: 'Please check your email to confirm your account.'
          } 
        });
        setLoading(false);
        return;
      }

      // Session exists - redirect to admin (AI Website Generator will show for new users)
      navigate('/admin');

    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col md:flex-row">
      {/* Left: Visual */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-900/20 via-gray-900 to-cyan-900/20 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-50"></div>
        <div className="relative z-10 max-w-lg">
          <div className="text-4xl font-bold mb-2">
            Evolv<span className="text-cyan-400">.</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-6">Start selling in minutes.</h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Create your online store for free. No coding required. We'll guide you every step of the way.
          </p>
          <div className="space-y-4">
            {[
              'Free forever for basic stores',
              'No credit card required',
              'Set up in 5 minutes',
              'Beautiful templates included'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 size={20} className="text-cyan-500" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden text-2xl font-bold mb-4">
            Evolv<span className="text-cyan-400">.</span>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-gray-500 mt-2">
              Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">Log in</Link>
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
          <p className="text-xs text-gray-600 text-center">
            By creating an account, you agree to our <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a> and <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
