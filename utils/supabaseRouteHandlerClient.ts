import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.supabase_public_url;
const SUPABASE_PUBLIC_API_KEY = process.env.supabase_public_key;
const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
const cookieStore = cookies();
const supabaseRouteHandlerClient = createRouteHandlerClient(
	{ cookies: () => cookieStore },
	{ supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_PUBLIC_API_KEY }
);
export default supabaseRouteHandlerClient;

export const supabaseRouteHandlerAdminClient = createRouteHandlerClient(
	{ cookies: () => cookieStore },
	{ supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_SERVICE_ROLE_KEY }
);
