
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedData() {
  console.log('Seeding data...');

  // 1. Get the first store (Demo Store)
  const { data: stores, error: storeError } = await supabase.from('stores').select('*').limit(1);
  if (storeError || !stores || stores.length === 0) {
    console.error('No stores found. Please create a store first (or run init-superuser).');
    return;
  }
  const storeId = stores[0].id;
  console.log(`Seeding data for store: ${stores[0].name} (${storeId})`);

  // 2. Create Customers
  const customersData = [
    { store_id: storeId, email: 'alice@example.com', first_name: 'Alice', last_name: 'Wonderland' },
    { store_id: storeId, email: 'bob@example.com', first_name: 'Bob', last_name: 'Builder' },
    { store_id: storeId, email: 'charlie@example.com', first_name: 'Charlie', last_name: 'Chocolate' },
  ];

  const { data: customers, error: custError } = await supabase
    .from('customers')
    .insert(customersData)
    .select();

  if (custError) console.error('Error creating customers:', custError);
  else console.log(`Created ${customers.length} customers.`);

  // 3. Create Orders
  if (customers && customers.length > 0) {
    const ordersData = [
      { 
        store_id: storeId, 
        customer_id: customers[0].id, 
        total_amount: 120.50, 
        status: 'paid', 
        payment_status: 'paid' 
      },
      { 
        store_id: storeId, 
        customer_id: customers[1].id, 
        total_amount: 450.00, 
        status: 'fulfilled', 
        payment_status: 'paid' 
      },
      { 
        store_id: storeId, 
        customer_id: customers[2].id, 
        total_amount: 89.99, 
        status: 'pending', 
        payment_status: 'unpaid' 
      },
       { 
        store_id: storeId, 
        customer_id: customers[0].id, 
        total_amount: 1200.00, 
        status: 'paid', 
        payment_status: 'paid' 
      },
    ];

    const { error: orderError } = await supabase.from('orders').insert(ordersData);
    if (orderError) console.error('Error creating orders:', orderError);
    else console.log('Created sample orders.');
  }

  // 4. Create Subscription
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      store_id: storeId,
      plan_id: 'pro',
      status: 'active'
    }, { onConflict: 'store_id' });

  if (subError) console.error('Error creating subscription:', subError);
  else console.log('Created/Updated subscription.');

  console.log('Seeding complete!');
}

seedData();
