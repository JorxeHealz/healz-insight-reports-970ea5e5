
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Initialize Supabase client with the correct credentials
const supabaseUrl = 'https://tbsanaoztdwgljuukiaa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRic2FuYW96dGR3Z2xqdXVraWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNTYzMjksImV4cCI6MjA2MjYzMjMyOX0.Efxu-IuiFwZdXSBcJ35NdaFoCyZ9ZzQ0m0t1n5ZdPRI';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
