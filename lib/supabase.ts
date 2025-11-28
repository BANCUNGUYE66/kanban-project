import { createClient } from '@supabase/supabase-js';

// 1. Load variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 2. Check if they exist (Helps debug empty screens)
if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 Supabase Keys are missing! Check .env.local");
}

// 3. Create the client
export const supabase = createClient(supabaseUrl, supabaseKey);