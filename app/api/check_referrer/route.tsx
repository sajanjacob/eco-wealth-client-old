import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refIds } = await req.json(); // Expect an array of refIds

	// Check if referral ids were provided
	if (!refIds || refIds.length === 0)
		return NextResponse.json(
			{ error: "No referral ids were provided, please provide referral ids." },
			{ status: 500 }
		);

	// Function to get referrer details by refId
	async function getReferrerDetails(refId: string) {
		const { data: ambassadorData, error: ambassadorError } = await supabase
			.from("referral_ambassadors")
			.select("*")
			.eq("id", refId);

		if (ambassadorError || !ambassadorData || ambassadorData.length === 0) {
			return null; // Return null if not found or error
		}

		const ambassador = ambassadorData[0];
		const { data: userData, error: userError } = await supabase
			.from("users")
			.select("*")
			.eq("id", ambassador.user_id)
			.single();

		if (userError || !userData) {
			return null; // Return null if not found or error
		}

		return {
			name: userData.name,
			userId: userData.id,
			refId: refId,
			email: ambassador.contact_email,
		};
	}

	// Get details for all refIds provided
	const referrerDetails = await Promise.all(refIds.map(getReferrerDetails));

	// Filter out any null results (in case of errors or not found)
	const validReferrers = referrerDetails.filter((details) => details !== null);

	// Return the array of referrer objects
	return NextResponse.json(
		{ referrers: validReferrers, message: "Referral ambassadors found." },
		{ status: 200 }
	);
}
