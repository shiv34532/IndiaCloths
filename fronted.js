<script src="https://unpkg.com/@supabase/supabase-js">const supabaseUrl = "https://YOUR_PROJECT_ID.supabase.co";
const supabaseKey = "YOUR_PUBLIC_ANON_KEY";

const supabase = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
</script>

await supabase.from("products").insert([
  {
    name: "Wireless Mouse",
    price: 999,
    description: "Gaming mouse with RGB",
    category: "Electronics"
  }
]);
const { data, error } = await supabase
  .from("products")
  .select("*");

console.log(data);
await supabase.auth.signUp({
  email,
  password
});
await supabase.auth.signInWithPassword({
  email,
  password
});


<script src="https://unpkg.com/@supabase/supabase-js"></script>
const supabaseUrl = "https://abcd1234.supabase.co";
const supabaseKey = "YOUR_ANON_PUBLIC_KEY";

const supabase = supabase.createClient(
  supabaseUrl,
  supabaseKey
);
