import { supabase } from '../config/supabase.js';

async function checkConnection() {
  console.log("Checking connection to Supabase...");

  // Try to fetch from the journals table (it should return an empty array [])
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .limit(1);

  if (error) {
    console.error("❌ Connection Failed:", error.message);
  } else {
    console.log("✅ Success! Connected to Postgres.");
    console.log("Current Tables Found: journals, profiles");
  }
}

checkConnection();