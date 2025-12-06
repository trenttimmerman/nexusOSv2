import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Store, CheckCircle2 } from 'lucide-react';

export const StoreSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');

  useEffect(() => {
    const checkUserAndLoadPendingData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Check if user already has a profile with a store
      const { data: profile } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('id', session.user.id)
        .single();

      if (profile?.store_id) {
        // User already has a store, redirect to admin
        navigate('/admin');
        return;
      }

      // Load pending store info from user metadata
      const metadata = session.user.user_metadata;
      if (metadata?.pending_store_name) {
        setStoreName(metadata.pending_store_name);
      }
      if (metadata?.pending_store_slug) {
        setStoreSlug(metadata.pending_store_slug);
      }

      setLoading(false);
    };

    checkUserAndLoadPendingData();
  }, [navigate]);

  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setStoreName(name);
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setStoreSlug(slug);
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCreating(true);

    try {
      const { error: tenantError } = await supabase.rpc('create_tenant', {
        store_name: storeName,
        store_slug: storeSlug
      });

      if (tenantError) throw tenantError;

      // Clear pending data from user metadata
      await supabase.auth.updateUser({
        data: {
          pending_store_name: null,
          pending_store_slug: null
        }
      });

      // Redirect to admin
      navigate('/admin');
    } catch (err: any) {
      console.error('Store creation error:', err);
      setError(err.message || 'Failed to create store');
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store size={32} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Complete Your Setup</h1>
          <p className="text-neutral-400">Just one more step to launch your store</p>
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateStore} className="space-y-6">
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
              <span className="pl-4 pr-2 text-neutral-500 text-sm font-mono">evolv.app/</span>
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

          <button 
            type="submit"
            disabled={creating || !storeName || !storeSlug}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {creating ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                <CheckCircle2 size={20} />
                Create My Store
              </>
            )}
          </button>
        </form>

        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-xs text-neutral-500">
            Your 14-day free trial starts immediately. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
};
