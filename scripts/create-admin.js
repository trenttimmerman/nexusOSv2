
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file
const envPath = path.resolve(__dirname, '../.env');
let envContent = '';

try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
  console.error('Could not read .env file at', envPath);
  process.exit(1);
}

const parseEnv = (content) => {
  const env = {};
  content.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      // Remove quotes if present
      let cleanValue = value.trim();
      if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) || 
          (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
        cleanValue = cleanValue.slice(1, -1);
      }
      env[key.trim()] = cleanValue;
    }
  });
  return env;
};

const env = parseEnv(envContent);
const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXUS_SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const isServiceRole = !!env.NEXUS_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const email = process.argv[2] || 'admin@evolv.os';
const password = process.argv[3] || 'evolv-admin-123';

console.log(`Attempting to create user: ${email}`);
console.log(`Using Service Role: ${isServiceRole}`);

async function createAdmin() {
  let data, error;

  if (isServiceRole) {
    // Use admin API to create user with auto-confirm
    const result = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    data = result.data;
    error = result.error;
  } else {
    // Fallback to regular sign up
    const result = await supabase.auth.signUp({
      email,
      password,
    });
    data = result.data;
    error = result.error;
  }

  if (error) {
    console.error('Error creating user:', error.message);
    return;
  }

  console.log('User created successfully!');
  console.log('User ID:', data.user?.id);
  
  if (isServiceRole) {
      console.log('User auto-confirmed. You can log in immediately.');
  } else if (data.session) {
      console.log('Session created. You can now log in.');
  } else {
      console.log('User created. Please check email for confirmation.');
  }
}

createAdmin();
