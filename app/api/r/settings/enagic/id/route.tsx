import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refId, enagicId } = await req.json();

	const sanitizedRefId = sanitizeHtml(refId);
	const sanitizedEnagicId = sanitizeHtml(enagicId);
	if (
		!sanitizedEnagicId ||
		sanitizedEnagicId === "" ||
		!validator.isNumeric(sanitizedEnagicId)
	)
		return NextResponse.json({ error: "Invalid Enagic ID" }, { status: 400 });
	const { error } = await supabase
		.from("referral_ambassadors")
		.update({
			enagic_id: sanitizedEnagicId,
		})
		.eq("id", sanitizedRefId);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(
		{ message: "Updated Enagic ID successfully." },
		{ status: 200 }
	);
}
