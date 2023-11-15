// WARNING: Use this client only for server-side calls, do not use it on the client-side for any.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.supabase_public_url;
const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;

const supabase = createClient(
	SUPABASE_URL as string,
	SUPABASE_SERVICE_ROLE_KEY as string
);

export default supabase;
