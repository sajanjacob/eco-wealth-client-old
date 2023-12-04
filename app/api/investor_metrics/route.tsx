import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const investorId = req?.nextUrl?.searchParams.get("investorId");
	try {
		// Get individual investor metrics
		const { data, error } = await supabase
			.from("investor_metrics")
			.select("*")
			.eq("investor_id", investorId);
		// Get total metrics
		const { data: totalData, error: totalErr } = await supabase.rpc(
			"total_contributions"
		);
		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		if (totalErr) {
			return NextResponse.json({ error: totalErr.message }, { status: 500 });
		}

		return NextResponse.json({ data, totalData }, { status: 200 });
	} catch (error) {
		console.error(`Error fetching metrics: ${error}`);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
