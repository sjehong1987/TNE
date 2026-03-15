/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Use placeholder values to prevent the app from crashing in the preview environment
// where the user hasn't set up their Supabase credentials yet.
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

// If the user copied the .env.example literally, it might be "your_supabase_project_url"
if (!supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://placeholder.supabase.co';
}

export const isSupabaseConnected = supabaseUrl !== 'https://placeholder.supabase.co';

if (!isSupabaseConnected) {
  console.warn('Supabase credentials missing or invalid. The app will use local fallback data. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables for production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
