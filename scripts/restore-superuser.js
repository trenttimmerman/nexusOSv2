import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreSuperuser() {
  const email = 'trent@3thirty3.ca';

  console.log(`\n🔍 Checking for user: ${email}`);

  // Check if user exists in auth.users
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('❌ Error listing users:', listError.message);
    return;
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.log('❌ User not found in auth.users. Creating new user...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: 'temppassword123',
      email_confirm: true
    });

    if (createError) {
      console.error('❌ Failed to create user:', createError.message);
      return;
    }

    console.log('✅ User created:', newUser.user.id);
    await setupProfile(newUser.user.id);
  } else {
    console.log('✅ User found:', user.id);
    await setupProfile(user.id);
  }
}

async function setupProfile(userId) {
  console.log('\n🔧 Setting up superuser profile...');

  // Get or create Demo Store
  let { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', 'demo-store')
    .single();

  if (storeError || !store) {
    console.log('📦 Creating Demo Store...');
    const { data: newStore, error: createStoreError } = await supabase
      .from('stores')
      .insert({ name: 'Demo Store', slug: 'demo-store' })
      .select()
      .single();

    if (createStoreError) {
      console.error('❌ Failed to create store:', createStoreError.message);
      return;
    }
    store = newStore;
  }

  console.log('✅ Demo Store ID:', store.id);

  // Update profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      store_id: store.id,
      role: 'superuser'
    }, {
      onConflict: 'id'
    });

  if (profileError) {
    console.error('❌ Failed to update profile:', profileError.message);
    return;
  }

  console.log('✅ Profile updated with superuser role');
  console.log('\n🎉 Success! You can now login with:');
  console.log(`   Email: trent@3thirty3.ca`);
  console.log(`   Password: (your existing password or temppassword123 if new)`);
}

restoreSuperuser().then(() => {
  console.log('\n✨ Done!\n');
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Error:', err);
  process.exit(1);
});
