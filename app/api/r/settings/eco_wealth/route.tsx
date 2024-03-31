import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refId, ecoWealthContributionPercentage } = await req.json();

	const sanitizedRefId = sanitizeHtml(refId);
	const sanitizedEcoWealthContributionPercentage = sanitizeHtml(
		ecoWealthContributionPercentage
	);
	if (
		!sanitizedEcoWealthContributionPercentage ||
		sanitizedEcoWealthContributionPercentage === "" ||
		!validator.isNumeric(sanitizedEcoWealthContributionPercentage)
	)
		return NextResponse.json(
			{ error: "Invalid Eco Wealth contribution percentage" },
			{ status: 400 }
		);
	const { error } = await supabase
		.from("referral_ambassadors")
		.update({
			eco_wealth_non_profit_contribution_percentage:
				sanitizedEcoWealthContributionPercentage,
		})
		.eq("id", sanitizedRefId);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(
		{ message: "Updated Eco Wealth contribution percentage successfully." },
		{ status: 200 }
	);
}
