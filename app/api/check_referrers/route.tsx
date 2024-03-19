import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import moment from "moment";

export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const {
		urlReferrerIds = [], // Expected to be an array of strings from the URL
		refIds = [], // Expected to be an array of strings from user input
		pageSource,
		trackingEnabled,
		refSessionId,
		referrers = [], // Provided existing referrers object
	} = await req.json();

	if (!urlReferrerIds.length && !refIds.length && !referrers.length)
		return NextResponse.json(
			{ error: "No referral ids were provided, please provide referral ids." },
			{ status: 500 }
		);

	let existingReferrerTracking;
	if (trackingEnabled && refSessionId) {
		const { data, error } = await supabase
			.from("referrer_tracking")
			.select("*")
			.eq("id", refSessionId)
			.single();
		if (error) {
			console.error("Error fetching referrer tracking data: ", error);
			return NextResponse.json(
				{ error: "Error fetching referrer tracking data." },
				{ status: 500 }
			);
		}
		existingReferrerTracking = data;
	}

	// Use a Map to efficiently manage referrers
	const referrerMap = new Map(referrers.map((r: any) => [r.refId, { ...r }]));

	// Helper function to fetch referrer details
	async function fetchAndAddReferrer(id: string, inputSource: string) {
		const { data, error } = await supabase
			.from("referral_ambassadors")
			.select("*")
			.eq("id", id)
			.maybeSingle();

		if (!error && data) {
			const { data: userData, error: userError } = await supabase
				.from("users")
				.select("*")
				.eq("id", data.user_id)
				.maybeSingle();

			if (!userError && userData) {
				return {
					name: userData.name,
					userId: userData.id,
					refId: id,
					email: data.email,
					pageSource: pageSource,
					inputSource: inputSource,
					dateAdded: moment().format(),
				};
			}
		}
		return null;
	}

	// Process all IDs
	for (const id of Array.from(new Set([...urlReferrerIds, ...refIds]))) {
		const inputSource = urlReferrerIds.includes(id) ? "url" : "search";
		if (!referrerMap.has(id)) {
			const referrerData = await fetchAndAddReferrer(id, inputSource);
			if (referrerData) {
				referrerMap.set(id, referrerData);
			}
		} else if (inputSource === "url") {
			const referrer: any = referrerMap.get(id);
			referrer.inputSource = "url"; // Prioritize URL source
		}
	}

	// Convert Map back to array
	const updatedReferrers = Array.from(referrerMap.values());

	if (!updatedReferrers.length)
		return NextResponse.json(
			{ error: "No valid referral ambassadors found." },
			{ status: 404 }
		);

	// Update or insert referrer tracking session
	let response: any;
	if (trackingEnabled) {
		if (refSessionId) {
			response = await supabase
				.from("referrer_tracking")
				.update({ referrers: updatedReferrers })
				.eq("id", refSessionId)
				.maybeSingle();
		} else {
			response = await supabase
				.from("referrer_tracking")
				.insert([{ referrers: updatedReferrers }])
				.maybeSingle();
		}

		if (response.error) {
			console.error("Error updating referrer tracking table: ", response.error);
			return NextResponse.json(
				{
					message: "Referral data processed, but tracking update failed.",
					referrers: updatedReferrers,
				},
				{ status: 200 }
			);
		}
	}

	return NextResponse.json(
		{
			message: `${updatedReferrers.length} Referral ambassador(s) found.`,
			referrers: updatedReferrers,
			refSessionId: refSessionId || response?.data?.id, // Update this line to properly fetch the ID from the response if needed
		},
		{ status: 200 }
	);
}
