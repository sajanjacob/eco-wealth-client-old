import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const {
		name,
		email,
		phoneNumber,
		machines,
		addOns,
		referrerInfo,
		referrerIds,
		referralSource,
	} = await req.json();
	// TODO: Sanitize inputs before submitting to database
	const { data, error } = await supabase.from("enagic_orders").insert([
		{
			name,
			email,
			phone_number: phoneNumber,
			machines,
			addOns,
			referrer_info: referrerInfo,
			referrer_ids: referrerIds,
			referral_source: referralSource,
		},
	]);
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (data) {
		// TODO: Send email to referrer
		// TODO: increment all referrer's referral counts by 1
		// TODO: Send email to user to verify email & notify of enagic order received

		return NextResponse.json({ data }, { status: 200 });
	}
}
