import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { userId, role, name, phone } = await req.json();

	const { data, error } = await supabase
		.from("users")
		.update({
			name: name,
			roles: [role],
			phone_number: phone,
			active_role: role,
			onboarding_complete: true,
		})
		.eq("id", userId);
	if (error) {
		console.error("Error updating user role:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	if (role === "investor") {
		const { data: investorData, error: investorError } = await supabase
			.from("investors")
			.insert([
				{
					user_id: userId,
				},
			]);
		const { data: analyticData, error: analyticErr } = await supabase
			.from("analytics")
			.insert([
				{
					user_id: userId,
				},
			]);
		if (investorError) {
			console.error("Error inserting investor:", investorError.message);
			return NextResponse.json(
				{ error: investorError.message },
				{ status: 500 }
			);
		}
		if (investorData) {
			return NextResponse.json({ data: investorData });
		}
	}

	if (role === "producer") {
		const { data: producerData, error: producerError } = await supabase
			.from("producers")
			.insert([
				{
					user_id: userId,
				},
			]);
		if (producerError) {
			console.error("Error inserting producer:", producerError.message);
			return NextResponse.json(
				{ error: producerError.message },
				{ status: 500 }
			);
		}
		if (producerData) {
			return NextResponse.json({ data: producerData });
		}
	}

	if (role === "referral_ambassador") {
		const { data: referralAmbassadorData, error: referralAmbassadorError } =
			await supabase.from("referral_ambassadors").insert([
				{
					user_id: userId,
					status: "pending",
				},
			]);
		if (referralAmbassadorError) {
			console.error(
				"Error inserting referral ambassador:",
				referralAmbassadorError.message
			);
			return NextResponse.json(
				{ error: referralAmbassadorError.message },
				{ status: 500 }
			);
		}
		if (referralAmbassadorData) {
			return NextResponse.json({ data: referralAmbassadorData });
		}
	}
}
