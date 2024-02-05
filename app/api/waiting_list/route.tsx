import { NextRequest, NextResponse } from "next/server";
import { gen } from "n-digit-token";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { BASE_URL } from "@/constants";
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function POST(req: NextRequest, res: NextResponse) {
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { name, email, referralSource, referrer, specificReferral } =
		await req.json();

	const token: string = gen(333);

	const waitingListData = {
		name,
		email,
		referral_source: referralSource,
		referrer: specificReferral,
		referred_by: referrer,
	};

	const { data, error } = await supabase
		.from("waiting_list")
		.insert([waitingListData])
		.select();

	if (error) {
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	const { error: verificationTokenError } = await supabase
		.from("wl_verification_tokens")
		.insert([
			{
				token,
				wl_user_id: data[0].id,
			},
		])
		.select();
	if (verificationTokenError) {
		return NextResponse.json(
			{ message: verificationTokenError.message },
			{ status: 501 }
		);
	}

	// TODO: Send verification email
	const msg = {
		to: email,
		from: { email: "info@ecowealth.app", name: "Eco Wealth Notifications" },
		subject: "Verify your email to join Eco Wealth's waiting list!",
		html: `<p>Please verify your email now by clicking on this link or copying it to your browser: <a href="${BASE_URL}/verify?token=${token}">${BASE_URL}/verify?token=${token}</a></p>`,
	};

	await sgMail
		.send(msg)
		.then(() => {
			console.log("verification email sent");
		})
		.catch((error: any) => {
			console.log("error", error);
			return NextResponse.json({ message: error.message }, { status: 501 });
		});

	// TODO: Add to mailing list
	return NextResponse.json({ message: "success" }, { status: 200 });
}
