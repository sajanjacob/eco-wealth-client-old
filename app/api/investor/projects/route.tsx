import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	// Get project data
	const projectId = req?.nextUrl?.searchParams.get("projectId");
	const { data, error } = await supabase
		.from("projects")
		.select(
			"*, tree_projects(*), energy_projects(*), producer_properties(*), project_financials(*), project_milestones(*), solar_projects(*)"
		)
		.eq("id", projectId)
		.single();
	if (error) {
		console.error(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
	// Get unique investors
	const { data: investorCountData, error: investorCountDataError } =
		await supabase
			.from("view_unique_investors_per_project")
			.select("*")
			.eq("project_id", projectId);
	if (investorCountDataError) {
		console.log("investorCountDataError >>> ", investorCountDataError);
		return NextResponse.json(
			{ message: investorCountDataError.message },
			{ status: 502 }
		);
	}
	const projectType = data.type;
	const uniqueInvestors = investorCountData[0]?.unique_investors_count || 0;

	// Get percentFunded
	console.log("data >>> ", data);
	const percentageFunded =
		(data.project_financials?.total_amount_raised /
			data.project_financials?.final_est_project_fund_request_total) *
		100;
	if (data) {
		return NextResponse.json(
			{ data, uniqueInvestors, percentageFunded },
			{ status: 200 }
		);
	}
}
