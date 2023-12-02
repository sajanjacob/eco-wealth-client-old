import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
export async function PUT(req: NextRequest, res: NextResponse) {
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	const { code } = await req.json();

	const { data, error } = await supabase
		.from("producer_verification_codes")
		.select("property_id")
		.eq("verification_code", code);

	if (error) {
		console.error("Error fetching correct verification code:", error);
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	if (!data) {
		return NextResponse.json(
			{ message: "Invalid provided verification code" },
			{ status: 401 }
		);
	}
	console.log("data[0].property_id >>> ", data[0].property_id);
	const { error: updateError } = await supabase
		.from("producer_properties")
		.update({ is_verified: true })
		.eq("id", data[0].property_id);

	if (updateError) {
		console.error("Error updating user:", updateError);
		return NextResponse.json({ message: updateError.message }, { status: 501 });
	}

	return NextResponse.json({ message: "success" }, { status: 200 });
}
