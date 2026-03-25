import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// These names must match your .env file exactly
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);