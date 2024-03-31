import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	const { contactEmail, refId } = await req.json();
	const sanitizedContactEmail = sanitizeHtml(contactEmail);
	const sanitizedRefId = sanitizeHtml(refId);
	if (
		!sanitizedContactEmail ||
		sanitizedContactEmail === "" ||
		!validator.isEmail(sanitizedContactEmail)
	)
		return NextResponse.json(
			{ error: "Invalid email address" },
			{ status: 400 }
		);
	const { error } = await supabase
		.from("referral_ambassadors")
		.update({ contact_email: sanitizedContactEmail })
		.eq("id", sanitizedRefId);

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json(
		{ message: "Updated contact email successfully." },
		{ status: 200 }
	);
}
