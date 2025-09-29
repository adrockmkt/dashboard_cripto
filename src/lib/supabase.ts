import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create Supabase client if environment variables are properly configured
export const supabase = (supabaseUrl && supabaseKey && 
  supabaseUrl !== 'https://your-project-ref.supabase.co' && 
  supabaseKey !== 'your-anon-key-here') 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null
}

// Database schema
export interface Portfolio {
  id: string
  symbol: string
  name: string
  quantity: number
  avg_price: number
  current_price: number
  total_value: number
  pnl: number
  pnl_percentage: number
  user_id?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  read: boolean
  user_id?: string
  created_at: string
}