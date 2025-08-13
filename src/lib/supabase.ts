import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

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