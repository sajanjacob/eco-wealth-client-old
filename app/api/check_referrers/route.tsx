import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import extractObjValuesToStringArray from "@/utils/extractObjValuesToStringArray";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refIds, pageSource, trackingEnabled, refSessionId } =
		await req.json(); // Expecting an array of refIds

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
			// Check user details for found referrer
			const { data: userData, error: userError } = await supabase
				.from("users")
				.select("*")
				.eq("id", data[0].user_id)
				.single();

			if (!userError && userData) {
				referrers.push({
					name: userData.name,
					userId: userData.id,
					refId: refId,
					email: data[0].email,
					pageSource,
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
	/**
	 *
	 * TODO: update referrer info in referrer tracking table already exists
	 * TODO: push dateAdded to response data
	 * Add the valid referrer to the list
	 *
	 * */
	if (trackingEnabled) {
		// Add referrer info to referrer tracking table
		// Note: include referrerId, userId, email, dateAdded with unique session token
		const referrerIds = extractObjValuesToStringArray(referrers, "refId");
		if (!refSessionId) {
			const { data: refSession, error: refSessionError } = await supabase
				.from("referrer_tracking")
				.insert({ referrers: referrers, referrer_ids: referrerIds })
				.select()
				.single();
			if (refSessionError) {
				console.error(
					"Error adding referrer to referrer tracking table: ",
					refSessionError
				);
				return NextResponse.json(
					{
						referrers: referrers,
						message: `${referrers.length} Referral ambassador(s) found.`,
					},
					{ status: 200 }
				);
			}
			return NextResponse.json(
				{
					referrers: referrers,
					refSessionId: refSession.id,

					message: `${referrers.length} Referral ambassador(s) found.`,
				},
				{ status: 200 }
			);
		} else {
			const { data: refSession, error: refSessionError } = await supabase
				.from("referrer_tracking")
				.update({ referrers: referrers, referrer_ids: referrerIds })
				.eq("id", refSessionId)
				.select()
				.single();
			if (refSessionError) {
				console.error(
					"Error adding referrer to referrer tracking table: ",
					refSessionError
				);
				return NextResponse.json(
					{
						referrers: referrers,
						message: `${referrers.length} Referral ambassador(s) found.`,
					},
					{ status: 200 }
				);
			}
			return NextResponse.json(
				{
					referrers: referrers,
					refSessionId: refSession.id,
					message: `${referrers.length} Referral ambassador(s) found.`,
				},
				{ status: 200 }
			);
		}
	}
	console.log("ambassadors found >>> ", referrers);
}
