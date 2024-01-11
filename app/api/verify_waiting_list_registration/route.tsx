import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { email } = await req.json();
	if (!email)
		return NextResponse.json(
			{ onWaitlist: false, message: "No email was provided." },
			{ status: 200 }
		);
	const { data, error } = await supabase
		.from("waiting_list")
		.select("id")
		.eq("email", email)
		.eq("email_verified", true)
		.single();
	if (error) {
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("id")
			.eq("email", email)
			.eq("is_verified", true)
			.single();
		if (userError) {
			console.error("Error fetching user:", userError);
			return NextResponse.json(
				{ onWaitlist: false, message: userError.message },
				{ status: 501 }
			);
		}
		if (userData) {
			return NextResponse.json(
				{ onWaitlist: true, message: "User account registration found." },
				{ status: 200 }
			);
		}
	}
	if (data) {
		return NextResponse.json(
			{ onWaitlist: true, message: "Waiting list registration found." },
			{ status: 200 }
		);
	}
	return NextResponse.json({ onWaitlist: false }, { status: 200 });
}
