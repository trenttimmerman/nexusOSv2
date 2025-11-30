
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Using anon key might be restricted by RLS if I didn't fix it yet.
// Actually, I should use the service role key if I want to bypass RLS to see everything, but I don't have it in .env usually?
// Let's try anon key.

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getStores() {
  const { data, error } = await supabase.from('stores').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Stores:', data);
  }
}

getStores();
