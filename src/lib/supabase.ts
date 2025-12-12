import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createSupabaseClient(key: string | undefined) {
  if (!supabaseUrl || !key) {
    console.warn('Supabase URL or key is missing. Supabase client not created.');
    return null;
  }
  return createClient(supabaseUrl, key);
}

// Client-side client
export const supabase = createSupabaseClient(supabaseAnonKey);

// Server-side admin client
export const supabaseAdmin = createSupabaseClient(supabaseServiceKey);
