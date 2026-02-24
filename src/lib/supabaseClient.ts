
import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bqfvyrcnbgkzmwlmlhmu.supabase.co'
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZnZ5cmNuYmdrem13bG1saG11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzg4OTMsImV4cCI6MjA4NjY1NDg5M30.EXVdC6uD6pKpFV1DlCEY0xEWMjkGF9K6udhaYv8GkPs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
