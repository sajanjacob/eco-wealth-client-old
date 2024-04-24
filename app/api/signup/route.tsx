import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "@/constants";
import { createClient } from "@supabase/supabase-js";
import sanitizeHtml from "sanitize-html";
import sanitizeJsonObject from "@/utils/sanitizeJsonObject";
import sanitizeStringArray from "@/utils/sanitizeStringArray";
import sanitizeArrayOfObjects from "@/utils/sanitizeArrayOfObjects";
import { deduplicateReferrers } from "@/utils/deduplicateReferrers";
export async function POST(req: NextRequest) {
	const cookieStore = cookies();
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const {
		email,
		password,
		referralSource,
		referrers,
		referrerIds,
		specificReferral,
	} = await req.json();

	const sanitizedEmail = sanitizeHtml(email);
	const sanitizedReferralSource = sanitizeHtml(referralSource);
	console.log("referrers >>> ", referrers);
	let sanitizedReferrers = referrers && sanitizeArrayOfObjects(referrers);
	sanitizedReferrers = deduplicateReferrers(sanitizedReferrers);
	const sanitizedSpecificReferral = sanitizeHtml(specificReferral);
	let sanitizedReferrerIds = referrerIds && sanitizeStringArray(referrerIds);
	sanitizedReferrerIds = sanitizedReferrerIds.filter(
		(item: string) => item !== ""
	); // Remove empty strings within the referrerIds array
	console.log("sanitizedReferrerIds >>> ", sanitizedReferrerIds);

	console.log("referrer >>> ", referrers);
	console.log("referralSource >>> ", referralSource);
	console.log("specificReferral >>> ", specificReferral);

	const { error, data } = await supabase.auth.signUp({
		email: sanitizedEmail,
		password,
		options: {
			emailRedirectTo: `${BASE_URL}/auth/callback`,
		},
	});

	if (error) {
		console.error("Error signing up:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	// Update referrer data
	if (data) {
		console.log("new account user data >>> ", data);
		if (!referrers || !referrers.length) {
			return NextResponse.json({ data });
		}
		const { data: userData, error: userError } = await supabase
			.from("users")
			.update({
				referrer_ids: sanitizedReferrerIds,
				referrers: sanitizedReferrers,
				referral_source_type: sanitizedReferralSource,
				specific_referral: sanitizedSpecificReferral,
			})
			.eq("id", data.user?.id);

		if (userError) {
			console.error("Error updating user:", userError.message);
			return NextResponse.json({ error: userError.message }, { status: 500 });
		}
		console.log("user data >>> ", userData);
		return NextResponse.json({ data: userData });
	}
	return NextResponse.json(
		{ error: "User signup could not be completed." },
		{ status: 500 }
	);
}
