
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupStoreAndProfile() {
  const email = 'trent@3thirty3.ca';
  console.log(`Setting up store and profile for ${email}...`);

  // 1. Get User ID
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) {
    console.error('Error listing users:', userError);
    return;
  }
  
  const user = users.find(u => u.email === email);
  if (!user) {
    console.error('User not found. Please run init-superuser.js first.');
    return;
  }
  console.log('Found user:', user.id);

  // 2. Create Demo Store
  // Check if exists first
  const { data: existingStores } = await supabase.from('stores').select('*').eq('slug', 'demo-store').single();
  
  let storeId;
  if (existingStores) {
    storeId = existingStores.id;
    console.log('Demo Store already exists:', storeId);
  } else {
    const { data: newStore, error: storeError } = await supabase
      .from('stores')
      .insert({ name: 'Demo Store', slug: 'demo-store' })
      .select()
      .single();
      
    if (storeError) {
      console.error('Error creating store:', storeError);
      return;
    }
    storeId = newStore.id;
    console.log('Created Demo Store:', storeId);
  }

  // 3. Link Profile (Superuser)
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      store_id: storeId,
      role: 'superuser'
    });

  if (profileError) {
    console.error('Error updating profile:', profileError);
  } else {
    console.log('Profile updated to superuser.');
  }

  // 4. Create Store Config
  const { error: configError } = await supabase
    .from('store_config')
    .upsert({
      store_id: storeId,
      name: 'Demo Store',
      currency: 'USD',
      header_style: 'canvas',
      hero_style: 'impact',
      product_card_style: 'classic',
      footer_style: 'columns'
    }, { onConflict: 'store_id' });

  if (configError) {
    console.error('Error creating store config:', configError);
  } else {
    console.log('Store config created/updated.');
  }
}

setupStoreAndProfile();
