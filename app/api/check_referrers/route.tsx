import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import moment from "moment";
import validator from "validator"; // Ensure validator is available for email validation
import extractObjValuesToStringArray from "@/utils/extractObjValuesToStringArray";
type Referrer = {
	id: string;
	name: string;
	email: string;
	inputSource: string;
};
export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const {
		urlReferrerIds = [], // Expected to be an array of strings from the URL
		urlEmail, // New: Expecting a single email string from the URL
		pageSource,
		trackingEnabled,
		refSessionId,
		referrers = [], // Provided existing referrers object
	} = await req.json();
	// Validate input: either urlReferrerIds or urlEmail must be present
	if (!urlReferrerIds.length && !urlEmail && !referrers.length)
		return NextResponse.json(
			{
				error:
					"No referral identifiers were provided, please provide referral ids or an email.",
			},
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
	const referrerMap = new Map(
		referrers.map((r: any) => [r.referrerId || r.referrer.email, { ...r }])
	);
	// Helper function to fetch referrer details by ID or email
	async function fetchAndAddReferrer(identifier: string, inputSource: string) {
		let result = null;

		if (validator.isEmail(identifier)) {
			// First, try to find a match in the referral_ambassadors table by contact_email
			let { data, error } = await supabase
				.from("referral_ambassadors")
				.select("*, users!inner(*)")
				.eq("contact_email", identifier)
				.maybeSingle();

			if (error || !data) {
				// If no match was found by contact_email, try to find a match by email in the users table
				const userQuery = await supabase
					.from("users")
					.select("*, referral_ambassadors!inner(*)")
					.eq("email", identifier)
					.maybeSingle();

				if (!userQuery.error && userQuery.data) {
					data = userQuery.data.referral_ambassadors;
					data.users = userQuery.data;
				} else {
					// Log error or handle the absence of data as needed
					console.error("No matching referrer found for email:", identifier);
					return null;
				}
			}

			// At this point, 'data' should contain the matching referrer details
			result = {
				name: data.users.name,
				userId: data.user_id,
				refId: data.id, // Use the referral ambassador's ID
				email: data.contact_email || data.users.email,
				pageSource: pageSource,
				inputSource: inputSource,
				dateAdded: moment().format(),
			};
		} else {
			// ID-based lookup remains unchanged
			const { data, error } = await supabase
				.from("referral_ambassadors")
				.select("*, users!inner(*)")
				.eq("id", identifier)
				.maybeSingle();

			if (!error && data) {
				result = {
					referrerId: identifier,
					name: data.users.name,
					userId: data.user_id,
					refId: identifier,
					email: data.contact_email,
					pageSource: pageSource,
					inputSource: inputSource,
					dateAdded: moment().format(),
				};
			}
		}

		return result;
	}
	const referrerIds = extractObjValuesToStringArray(referrers, "referrerId");
	// Process all identifiers (IDs and potentially one email)
	const identifiers = Array.from(
		new Set([...urlReferrerIds, ...referrerIds, urlEmail].filter(Boolean))
	);

	for (const identifier of identifiers) {
		const inputSource =
			urlReferrerIds.includes(identifier) || identifier === urlEmail
				? "url"
				: "search";
		if (!referrerMap.has(identifier)) {
			const referrerData = await fetchAndAddReferrer(identifier, inputSource);
			if (referrerData) {
				// Ensure the mapping to the referrer object structure expected in the response
				const referrerObject = {
					referrerId: referrerData.refId,
					referrer: {
						name: referrerData.name,
						email: referrerData.email,
					},
					dateAdded: referrerData.dateAdded,
					pageSource: referrerData.pageSource,
					inputSource: referrerData.inputSource,
				};
				referrerMap.set(identifier, referrerObject);
			}
		}
	}
	function removeEmptyReferrers(referrers: any) {
		return referrers.filter((referrer: any) => {
			// Check for the presence of an id, name, or email in the referrer object
			const hasId = referrer.referrerId && referrer.referrerId.trim() !== "";
			const hasName =
				referrer.referrer &&
				referrer.referrer.name &&
				referrer.referrer.name.trim() !== "";
			const hasEmail =
				referrer.referrer &&
				referrer.referrer.email &&
				referrer.referrer.email.trim() !== "";

			// Include the referrer if it has an id, name, or email
			return hasId || hasName || hasEmail;
		});
	}
	// Convert Map back to array
	const updatedReferrers = Array.from(referrerMap.values());
	const filteredUpdatedReferrers = removeEmptyReferrers(updatedReferrers);

	// Get referrerIds from the updated referrers
	const updatedReferrerIds = Array.from(
		filteredUpdatedReferrers,
		(r: any) => r.referrerId
	);
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
				.update({ referrers: filteredUpdatedReferrers })
				.eq("id", refSessionId)
				.maybeSingle();
		} else {
			response = await supabase
				.from("referrer_tracking")
				.insert([{ referrers: filteredUpdatedReferrers }])
				.maybeSingle();
		}

		if (response.error) {
			console.error("Error updating referrer tracking table: ", response.error);
			return NextResponse.json(
				{
					message: "Referral data processed, but tracking update failed.",
					referrers: filteredUpdatedReferrers,
					refSessionId: refSessionId || response?.data?.id,
					referrerIds: updatedReferrerIds,
				},
				{ status: 200 }
			);
		}
	}

	// Prepare the final response
	return NextResponse.json(
		{
			message: `${filteredUpdatedReferrers.length} Referral ambassador(s) found.`,
			referrers: filteredUpdatedReferrers,
			refSessionId: refSessionId || response?.data?.id,
			referrerIds: updatedReferrerIds,
		},
		{ status: 200 }
	);
}
