import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import sanitizeHTML from "sanitize-html";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { email } = await req.json(); // Expect an array of refIds

	if (!email)
		return NextResponse.json(
			{ error: "No email provided, please provide an email." },
			{ status: 500 }
		);
	const sanitizedEmail = sanitizeHTML(email);
	const { data: waitingListData, error: waitingListError } = await supabase
		.from("waiting_list")
		.select("*")
		.eq("email", sanitizedEmail)
		.single();
	console.log("waitingListData >>> ", waitingListData);
	if (waitingListError || !waitingListData) {
		const { data: usersData, error: usersError } = await supabase
			.from("users")
			.select("*")
			.eq("email", sanitizedEmail)
			.single();
		if (usersError || !usersData) {
			return NextResponse.json(
				{ error: "No email found in waiting list." },
				{ status: 404 }
			);
		}
		return NextResponse.json(
			{ email: usersData.email, message: "Email found in waiting list." },
			{ status: 200 }
		);
	}
	return NextResponse.json(
		{ email: waitingListData.email, message: "Email found in waiting list." },
		{ status: 200 }
	);
}
