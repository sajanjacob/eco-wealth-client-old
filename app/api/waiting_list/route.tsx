import { NextRequest, NextResponse } from "next/server";
import { gen } from "n-digit-token";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { name, email } = await req.json();

	const token: string = gen(333);

	const { data, error } = await supabase
		.from("waiting_list")
		.insert([
			{
				name,
				email,
			},
		])
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
		from: "info@ecowealth.app",
		subject: "Verify your email to join Eco Wealth's waiting list!",
		text: `Please verify your email now by clicking on this link: ${process.env.FRONTEND_URL}/verify?token=${token}`,
	};
	// TODO: Add to mailing list
	return NextResponse.json({ message: "success" }, { status: 200 });
}
