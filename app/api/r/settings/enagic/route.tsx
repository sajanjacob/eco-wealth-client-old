import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refId, enagicContributionPercentage } = await req.json();

	const sanitizedRefId = sanitizeHtml(refId);
	const sanitizedEnagicContributionPercentage = sanitizeHtml(
		enagicContributionPercentage
	);
	if (
		!sanitizedEnagicContributionPercentage ||
		sanitizedEnagicContributionPercentage === "" ||
		!validator.isNumeric(sanitizedEnagicContributionPercentage)
	)
		return NextResponse.json(
			{ error: "Invalid Enagic contribution percentage" },
			{ status: 400 }
		);
	const { error } = await supabase
		.from("referral_ambassadors")
		.update({
			enagic_non_profit_contribution_percentage:
				sanitizedEnagicContributionPercentage,
		})
		.eq("id", sanitizedRefId);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(
		{ message: "Updated Enagic contribution percentage successfully." },
		{ status: 200 }
	);
}
