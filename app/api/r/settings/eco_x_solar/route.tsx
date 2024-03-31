import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refId, ecoXSolarContributionPercentage } = await req.json();

	const sanitizedRefId = sanitizeHtml(refId);
	const sanitizedEcoXSolarContributionPercentage = sanitizeHtml(
		ecoXSolarContributionPercentage
	);
	if (
		!sanitizedEcoXSolarContributionPercentage ||
		sanitizedEcoXSolarContributionPercentage === "" ||
		!validator.isNumeric(sanitizedEcoXSolarContributionPercentage)
	)
		return NextResponse.json(
			{ error: "Invalid Eco X Solar contribution percentage" },
			{ status: 400 }
		);
	const { error } = await supabase
		.from("referral_ambassadors")
		.update({
			eco_x_solar_non_profit_contribution_percentage:
				sanitizedEcoXSolarContributionPercentage,
		})
		.eq("id", sanitizedRefId);
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json(
		{ message: "Updated Eco X Solar contribution percentage successfully." },
		{ status: 200 }
	);
}
