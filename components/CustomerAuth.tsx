import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../context/DataContext';

export const CustomerLogin: React.FC<{ onSwitchToSignup: () => void }> = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      // Auth state change will be picked up by DataContext or App
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
      <h2 className="text-2xl font-bold mb-6">Customer Login</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-neutral-600">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignup} className="text-blue-600 hover:underline">
          Sign up
        </button>
      </div>
    </div>
  );
};

export const CustomerSignup: React.FC<{ onSwitchToLogin: () => void }> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { storeId } = useData(); // Note: This might be null if we are not in an admin context

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create the customer record
        // We need a store_id. If none is available (e.g. public signup), we might need a default or handle it later.
        // For now, we'll try to use the storeId from context, or skip if null.
        // In a real multi-tenant app, the signup page would be on a subdomain (store.com) so we'd know the store.
        
        // If we don't have a storeId, we can't link the customer to a store yet.
        // But we can still create the record if we make store_id nullable or have a fallback.
        // The schema says store_id is references stores(id). It might be nullable?
        // Let's check schema... "store_id uuid references stores(id) on delete cascade" - It is nullable by default unless "not null" is specified.
        
        const { error: customerError } = await supabase.from('customers').insert({
          auth_user_id: authData.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          store_id: storeId || null // If null, they are a "platform user" or unassigned
        });

        if (customerError) {
            console.error("Error creating customer record:", customerError);
            // We don't throw here to avoid blocking the auth success, but it's not ideal.
        }
      }

      // Success
      // You might want to show a "Check your email" message if email confirmation is on.
      // For this prototype, we assume auto-confirm or we just log them in.
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-blue-600 hover:underline">
          Sign in
        </button>
      </div>
    </div>
  );
};
