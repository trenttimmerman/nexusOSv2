
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function initSuperuser() {
  const email = 'trent@3thirty3.ca';
  const password = 'password123'; // Temporary password

  console.log(`Creating user ${email}...`);

  // 1. Create User
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (createError) {
    console.log('User creation failed (might already exist):', createError.message);
  } else {
    console.log('User created:', user.user.id);
  }

  // 2. Assign Superuser Role & Demo Store
  // We can run the SQL logic directly via RPC if we had a function, or just rely on the migration SQL.
  // Since we can't easily run raw SQL via client without a function, we will rely on the migration file.
  // But the migration file only runs once.
  // So we should create a new migration or just run the SQL using `npx supabase db execute`.
}

initSuperuser();
