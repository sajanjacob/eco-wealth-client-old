import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
export async function PUT(req: NextRequest, res: NextResponse) {
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { token } = await req.json();
	const { data, error } = await supabase
		.from("wl_verification_tokens")
		.select("wl_user_id")
		.eq("token", token);
	if (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	if (!data) {
		return NextResponse.json({ message: "Invalid token" }, { status: 401 });
	}
	const { error: updateError } = await supabase
		.from("waiting_list")
		.update({ email_verified: true })
		.eq("id", data[0].wl_user_id);
	if (updateError) {
		console.error("Error updating user:", updateError);
		return NextResponse.json({ message: updateError.message }, { status: 501 });
	}
	const { error: deleteError } = await supabase
		.from("wl_verification_tokens")
		.delete()
		.eq("token", token);
	if (deleteError) {
		console.error("Cleanup error while deleting wl token");
		return NextResponse.json({ message: deleteError.message }, { status: 502 });
	}
	return NextResponse.json({ message: "success" }, { status: 200 });
}
