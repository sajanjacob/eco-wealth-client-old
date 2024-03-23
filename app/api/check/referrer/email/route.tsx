import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import validator from "validator";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const {
		email,
		pageSource,
		refIds,
		trackingEnabled,
		refSessionId,
		referrers,
	} = await req.json(); // Expect an array of refIds

	// Check if referral ids were provided
	if (
		!email ||
		email === "" ||
		typeof email !== "string" ||
		!validator.isEmail(email)
	)
		return NextResponse.json(
			{ error: "Invalid email.  Please provide a valid email." },
			{ status: 500 }
		);
	// Check ref_ambassadors for ambassador matching the email
	const { data: ambassadorData, error: ambassadorError } = await supabase
		.from("referral_ambassadors")
		.select(
			"contact_email, id, status, user_id, created_at, agreement_accepted, users(id, name, created_at)"
		)
		.eq("contact_email", email);

	// Check users for table without returning the email (contact_email is public facing)
	if (ambassadorError || !ambassadorData || ambassadorData.length === 0) {
		const { data: usersData, error: usersError } = await supabase
			.from("users")
			.select(
				"id, name, created_at, referral_ambassadors(id, status, user_id, created_at, agreement_accepted)"
			)
			.eq("email", email)
			.single();

		if (usersError || !usersData) {
			return NextResponse.json(
				{ error: "No email found in waiting list." },
				{ status: 404 }
			);
		}
		if (usersData.referral_ambassadors.length > 0) {
			return NextResponse.json({
				data: {
					referrerId: usersData.referral_ambassadors[0].id,
					referrer: {
						name: usersData.name,
						email: "",
					},
					dateAdded: new Date().toISOString(),
					pageSource: pageSource,
					inputSource: "url",
				},
			});
		}
	}
	if (ambassadorData && ambassadorData[0].agreement_accepted) {
		return NextResponse.json(
			{
				data: {
					referrerId: ambassadorData[0].id,
					referrer: {
						name: ambassadorData[0].users[0].name,
						email: ambassadorData[0].contact_email,
					},
					dateAdded: new Date().toISOString(),
					pageSource: pageSource,
					inputSource: "url",
				},
				message: "Referral ambassadors found.",
			},
			{ status: 200 }
		);
	}
}
