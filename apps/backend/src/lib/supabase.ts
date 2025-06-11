import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://ceqapbmoaspmhshyfmkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcWFwYm1vYXNwbWhzaHlmbWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODAwMTQsImV4cCI6MjA2MDI1NjAxNH0.nqL6jx9JPkL-NSAVY0YUiNpuecRwocSlKfxE3CItmJk';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey); 