import { createClient } from '@supabase/supabase-js';

// Support both VITE_ and NEXT_PUBLIC_ prefixes for compatibility
// Also check window.__NEXUS_... globals injected by vite.config.ts as a fallback
const supabaseUrl = (typeof window !== 'undefined' && (window as any).__NEXUS_SUPABASE_URL__) || import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = (typeof window !== 'undefined' && (window as any).__NEXUS_SUPABASE_KEY__) || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Missing Supabase environment variables.');
  console.log('Debug Info:', {
    urlPresent: !!supabaseUrl,
    keyPresent: !!supabaseAnonKey,
    envKeys: Object.keys(import.meta.env).filter(k => k.includes('SUPABASE')),
    mode: import.meta.env.MODE
  });
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);
