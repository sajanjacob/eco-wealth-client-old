import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const projectId = req.nextUrl.searchParams.get("projectId");
	const { data, error } = await supabase
		.from("projects")
		.select(
			"*, tree_projects(*), energy_projects(*), producer_properties(*), project_financials(*), energy_investments(*), tree_investments(*), project_milestones(*)"
		)
		.eq("id", projectId)
		.single();
	if (error) {
		console.error(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
	if (data) {
		console.log("data >>> ", data);
		return NextResponse.json({ data }, { status: 200 });
	}
}
