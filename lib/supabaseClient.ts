import { createClient } from '@supabase/supabase-js';

// Support both VITE_ and NEXT_PUBLIC_ prefixes for compatibility, and fallback to process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

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
