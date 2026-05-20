import { supabaseAdmin } from '../config/supabase.js';

export async function checkDatabaseConnection() {
  console.log('Checking connection to Supabase...');

  const { error } = await supabaseAdmin
    .from('journals')
    .select('id', { head: true, count: 'exact' })
    .limit(1);

  if (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  console.log('Connected to Supabase successfully.');
}
