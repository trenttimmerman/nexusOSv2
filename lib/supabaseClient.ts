import { createClient } from '@supabase/supabase-js';

// Support multiple prefixes and fallbacks for different deployment environments
const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_URL) ||
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) ||
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Missing Supabase environment variables.');
  console.log('Debug Info:', {
    urlPresent: !!supabaseUrl,
    keyPresent: !!supabaseAnonKey,
    envKeys: Object.keys(import.meta.env).filter(k => k.includes('SUPABASE')),
    mode: import.meta.env.MODE,
    allEnvKeys: Object.keys(import.meta.env)
  });
  
  // Provide clearer error message
  throw new Error(
    'Supabase configuration missing. Please ensure .env file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set. ' +
    'If you just added them, restart the dev server with: npm run dev'
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
