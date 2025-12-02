
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function verifyTables() {
  console.log('Verifying tables...');
  
  // Check Discounts
  const { data: discounts, error: discountError } = await supabase.from('discounts').select('count');
  if (discountError) console.error('Error accessing discounts:', discountError);
  else console.log('Discounts table accessible.');

  // Check Shipping Zones
  const { data: zones, error: zoneError } = await supabase.from('shipping_zones').select('count');
  if (zoneError) console.error('Error accessing shipping_zones:', zoneError);
  else console.log('Shipping Zones table accessible.');
}

verifyTables();
