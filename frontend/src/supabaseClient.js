import { createClient } from '@supabase/supabase-js'

// Vite 사용 시import.meta.env 사용 / CRA 사용 시 process.env 사용
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);