import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gqeiixxtyhihsxsqkwqo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZWlpeHh0eWhpaHN4c3Frd3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTg4MjEsImV4cCI6MjA4Njg3NDgyMX0.UCKC1C15hwvm62343sY000u2F1vYBsJdGt2BZ9cuToA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
