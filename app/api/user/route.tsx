import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { userId } = await req.json();

	const { data, error } = await supabase
		.from("users")
		.select("*, producers(*), investors(*)")
		.eq("id", userId)
		.single();
	if (error) {
		console.error("Error fetching user data:", error.message);

		return NextResponse.json(
			{ error: "Error fetching user data" },
			{ status: 500 }
		);
	}
	const { data: refUser, error: refError } = await supabase
		.from("referral_ambassadors")
		.select("*")
		.eq("user_id", userId)
		.single();
	if (refError) {
		console.error("Error fetching referral data:", refError.message);
		return NextResponse.json(
			{ error: "Error fetching referral data" },
			{ status: 500 }
		);
	}
	return NextResponse.json({ data, refUser }, { status: 200 });
}
