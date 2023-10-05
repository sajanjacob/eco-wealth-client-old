import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("user_id");
	console.log("userId", userId);
	if (!userId || userId === "") {
		return NextResponse.json({ error: "Missing user_id" });
	}

	try {
		const response = await supabase
			.from("producers")
			.select(
				"*, producer_properties(*), producer_verification_codes(*), projects(*)"
			)
			.eq("user_id", userId);
		const producerData = response.data;
		return NextResponse.json({ producerData });
	} catch (error) {
		return NextResponse.json({
			error: "An error occurred when fetching producer data",
		});
	}
}
