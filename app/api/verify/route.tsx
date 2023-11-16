import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function PUT(req: NextRequest, res: NextResponse) {
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient(
		{ cookies: () => cookieStore },
		{ supabaseKey: SUPABASE_SERVICE_ROLE_KEY }
	);
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
	return NextResponse.json({ message: "success" }, { status: 200 });
}
