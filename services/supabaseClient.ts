
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION REAL DB ---
// Instructions:
// 1. Créez un projet sur https://supabase.com
// 2. Copiez l'URL et la clé ANON publique ici
// 3. L'application basculera automatiquement sur la vraie DB

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Si les clés sont présentes, on active le mode CLOUD, sinon mode LOCAL
export const isCloudMode = !!(SUPABASE_URL && SUPABASE_KEY);

export const supabase = isCloudMode 
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;
