import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const producerId = req.nextUrl.searchParams.get("producerId");
	console.log("investorId >>> ", producerId);
	try {
		// Get individual user analytics
		const { data, error } = await supabase
			.from("producer_analytics")
			.select("*")
			.eq("producer_id", producerId);
		console.log("data >>> ", data);
		// Get total analytics
		const { data: totalContributionData, error: totalErr } = await supabase.rpc(
			"total_contributions"
		);
		if (error) {
			console.log("error >>> ", error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		if (totalErr) {
			console.log("totalErr >>> ", totalErr);
			return NextResponse.json({ error: totalErr.message }, { status: 500 });
		}
		console.log("totalData >>> ", totalContributionData);

		return NextResponse.json({ data, totalContributionData }, { status: 200 });
	} catch (error) {
		console.error(`Error fetching analytics: ${error}`);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
