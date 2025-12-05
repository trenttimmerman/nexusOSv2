import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const SignUpConfirm = () => {
  const location = useLocation();
  const state = location.state as { email?: string; storeName?: string; message?: string } | null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto">
          <Mail size={32} className="text-green-500" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Check your email</h1>
          <p className="text-neutral-400 leading-relaxed">
            {state?.message || "We've sent a confirmation link to your email address. Please click the link to verify your account."}
          </p>
        </div>

        {state?.email && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <p className="text-sm text-neutral-500 mb-1">Confirmation sent to:</p>
            <p className="font-bold text-white">{state.email}</p>
          </div>
        )}

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 text-left space-y-4">
          <h3 className="font-bold text-sm uppercase text-neutral-500">Next Steps</h3>
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-neutral-300">Open the email and click the confirmation link</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-neutral-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-neutral-400">Log in with your credentials</p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="text-neutral-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-neutral-400">Your store "{state?.storeName || 'your store'}" will be created automatically</p>
          </div>
        </div>

        <div className="pt-4">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold transition-colors"
          >
            Go to Login <ArrowRight size={18} />
          </Link>
        </div>

        <p className="text-xs text-neutral-600">
          Didn't receive the email? Check your spam folder or{' '}
          <Link to="/signup" className="text-blue-500 hover:text-blue-400">try again</Link>.
        </p>
      </div>
    </div>
  );
};
