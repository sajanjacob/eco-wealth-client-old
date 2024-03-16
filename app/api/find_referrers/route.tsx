import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { searchTerm } = await req.json(); // Expecting an array of refIds
	const { data, error } = await supabase
		.from("referral_ambassadors")
		.select("*, users(*)")
		.or(
			`name.ilike.%${searchTerm}%,contact_email.ilike.%${searchTerm}%,id.eq.${searchTerm}`
		);
	if (error) {
		console.log("error >>> ", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json({ referrers: data }, { status: 200 });
}
