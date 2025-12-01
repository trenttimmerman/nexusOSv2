import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Load env vars from .env and .env.local
dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, '.env.local'), override: true });

// Try to get variables from any possible source
const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXUS_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_NEXUS_SUPABASE_ANON_KEY;

console.log('--- Environment Variable Check ---');
console.log('VITE_SUPABASE_URL present:', !!process.env.VITE_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_URL present:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Resolved URL:', url ? 'Found' : 'MISSING');
console.log('Resolved Key:', key ? 'Found' : 'MISSING');
console.log('----------------------------------');

const content = `
VITE_SUPABASE_URL=${url || ''}
VITE_SUPABASE_ANON_KEY=${key || ''}
`;

fs.writeFileSync(path.join(rootDir, '.env'), content);
console.log('✅ Generated .env file for Vite build');
