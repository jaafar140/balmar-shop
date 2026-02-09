import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION REAL DB ---
// Note : Avec Vite, on utilise import.meta.env et le préfixe VITE_

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Si les clés sont présentes, on active le mode CLOUD
export const isCloudMode = !!(SUPABASE_URL && SUPABASE_KEY);

export const supabase = isCloudMode 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;