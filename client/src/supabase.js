import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://aywaiyzfzcrkremalqaq.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5d2FpeXpmemNya3JlbWFscWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MzE2MTMsImV4cCI6MjA5NDQwNzYxM30.B3jhv7EzNxt0uZDqtO2EcIWNg16JwiaIbJXV6JJfrDM';

export const supabase = createClient(supabaseUrl, supabaseKey);
