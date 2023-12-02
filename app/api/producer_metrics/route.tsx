import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const producerId = req?.nextUrl?.searchParams.get("producerId");
	console.log("investorId >>> ", producerId);
	try {
		// Get individual investor metrics
		const { data, error } = await supabase
			.from("producer_metrics")
			.select("*")
			.eq("producer_id", producerId);
		console.log("data >>> ", data);
		// TODO: Get total metrics

		return NextResponse.json({ data }, { status: 200 });
	} catch (error) {
		console.error(`Error fetching metrics: ${error}`);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
