import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const investorId = req.nextUrl.searchParams.get("investorId");
	console.log("investorId >>> ", investorId);
	try {
		// Get individual investor metrics
		const { data, error } = await supabase
			.from("investor_metrics")
			.select("*")
			.eq("investor_id", investorId);
		console.log("data >>> ", data);
		// Get total metrics
		const { data: totalData, error: totalErr } = await supabase.rpc(
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
		console.log("totalData >>> ", totalData);

		return NextResponse.json({ data, totalData }, { status: 200 });
	} catch (error) {
		console.error(`Error fetching metrics: ${error}`);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}