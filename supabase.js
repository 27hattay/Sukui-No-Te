import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://gcuvqqymvdzldndjrede.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdXZxcXltdmR6bGRuZGpyZWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NjgzMTAsImV4cCI6MjA5MjM0NDMxMH0.NyhXz-44zNG_BlxD27sd_4rnImBl0KMkH7Q7QgV2PF8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
