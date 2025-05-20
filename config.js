const SUPABASE_URL = 'https://nzleigidbqryrhnztyzx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bGVpZ2lkYnFyeXJobnp0eXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MjUxNzcsImV4cCI6MjA2MzMwMTE3N30.QT7-2kPURyzibFwWpszjXVHB91SvtzEWPTak945DZ3g';

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY); 