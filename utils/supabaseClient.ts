import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.supabase_public_url;
const SUPABASE_PUBLIC_API_KEY = process.env.supabase_public_key;

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_API_KEY);

export default supabase;
