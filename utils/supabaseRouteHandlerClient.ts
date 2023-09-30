import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
const SUPABASE_URL = process.env.supabase_public_url;
const SUPABASE_PUBLIC_API_KEY = process.env.supabase_public_key;

const supabaseRouteHandlerClient = createRouteHandlerClient(
	{
		cookies,
	},
	{ supabaseUrl: SUPABASE_URL, supabaseKey: SUPABASE_PUBLIC_API_KEY }
);
export default supabaseRouteHandlerClient;
