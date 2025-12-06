import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CustomerLogin, CustomerSignup } from './CustomerAuth';
import { CustomerProfile } from './CustomerProfile';

export const AccountPage: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (session) {
    return <CustomerProfile />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      {view === 'login' ? (
        <CustomerLogin onSwitchToSignup={() => setView('signup')} />
      ) : (
        <CustomerSignup onSwitchToLogin={() => setView('login')} />
      )}
    </div>
  );
};
