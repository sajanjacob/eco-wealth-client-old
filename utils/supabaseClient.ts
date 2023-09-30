import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SUPABASE_URL = process.env.supabase_public_url;
const SUPABASE_PUBLIC_API_KEY = process.env.supabase_public_key;

// Without Next.js auth helpers (Use this when you don't need auth or when running a SELECT query)
const supabase = createClient(
	SUPABASE_URL as string,
	SUPABASE_PUBLIC_API_KEY as string
);
export default supabase;

// With Next.js auth helpers (use this when running a INSERT/UPDATE/DELETE query)
const supabaseClient = createClientComponentClient({
	supabaseUrl: SUPABASE_URL,
	supabaseKey: SUPABASE_PUBLIC_API_KEY,
});
export { supabaseClient };
