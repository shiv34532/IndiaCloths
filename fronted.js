<script src="https://unpkg.com/@supabase/supabase-js"></script>
const supabaseUrl = "https://abcd1234.supabase.co";
const supabaseKey = "YOUR_ANON_PUBLIC_KEY";

const supabase = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
