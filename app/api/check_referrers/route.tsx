import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refIds } = await req.json(); // Expecting an array of refIds

	// Check if referral ids were provided
	if (!refIds || refIds.length === 0)
		return NextResponse.json(
			{ error: "No referral ids were provided, please provide referral ids." },
			{ status: 500 }
		);

	let referrers = []; // To store valid referrers found

	// Iterate over each refId and get referral ambassador
	for (const refId of refIds) {
		const { data, error } = await supabase
			.from("referral_ambassadors")
			.select("*")
			.eq("id", refId);

		if (!error && data && data.length > 0) {
			// Assuming the first matching record is the correct one
			const { data: userData, error: userError } = await supabase
				.from("users")
				.select("*")
				.eq("id", data[0].user_id)
				.single();

			if (!userError && userData) {
				// Add the valid referrer to the list
				referrers.push({
					name: userData.name,
					userId: userData.id,
					refId: refId,
					email: userData.email,
				});
			}
		}
	}

	// Return error if no valid referrers were found
	if (referrers.length === 0)
		return NextResponse.json(
			{ error: "No valid referral ambassadors found." },
			{ status: 404 }
		);

	// If valid referral ambassadors exist, return them
	console.log("ambassadors found >>> ", referrers);
	return NextResponse.json(
		{
			referrers: referrers,
			message: `${referrers.length} Referral ambassador(s) found.`,
		},
		{ status: 200 }
	);
}
