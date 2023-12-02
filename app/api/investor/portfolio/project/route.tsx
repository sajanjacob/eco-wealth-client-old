import convertToCamelCase from "@/utils/convertToCamelCase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const projectId = req?.nextUrl?.searchParams.get("projectId");
	const investorId = req?.nextUrl?.searchParams.get("investorId");
	const { data: project, error } = await supabase
		.from("projects")
		.select(
			"*, tree_projects(*), energy_projects(*), producer_properties(*), project_financials(*), energy_investments(*), tree_investments(*), project_milestones(*), solar_projects(*)"
		)
		.eq("id", projectId)
		.eq("energy_investments.investor_id", investorId)
		.eq("tree_investments.investor_id", investorId)
		.single();
	if (error) {
		console.error(error);
		return NextResponse.json({ error: error }, { status: 500 });
	}
	if (project) {
		console.log("project >>> ", project);
		const percentageFunded =
			(project.project_financials?.total_amount_raised /
				project.project_financials?.final_est_project_fund_request_total) *
			100;
		// Get each project's total shares (num_of_shares) and append to totalShares array
		let totalShares: any[] = [];

		let totalProjectShares: any[] = [];
		if (project?.tree_investments?.length > 0) {
			project.tree_investments.forEach((treeInvestment: any) => {
				totalProjectShares.push(treeInvestment?.num_of_shares);
			});
		} else if (project?.energy_investments?.length > 0) {
			project.energy_investments.forEach((energyInvestment: any) => {
				totalProjectShares.push(energyInvestment?.num_of_shares);
			});
		}
		totalShares.push(totalProjectShares.reduce((a, b) => a + b, 0));
		let totalAmountInvested: any[] = [];
		let totalProjectAmountInvested: any[] = [];
		if (project?.energy_investments?.length > 0) {
			project.energy_investments.forEach((energyInvestment: any) => {
				totalProjectAmountInvested.push(energyInvestment?.amount);
			});
		} else if (project?.tree_investments?.length > 0) {
			project.tree_investments.forEach((treeInvestment: any) => {
				totalProjectAmountInvested.push(treeInvestment?.amount);
			});
		}
		totalAmountInvested.push(
			totalProjectAmountInvested.reduce((a, b) => a + b, 0)
		);
		console.log("totalShares >>> ", totalShares);
		console.log("totalAmountInvested >>> ", totalAmountInvested);
		console.log("projects >>> ", project);

		return NextResponse.json(
			{ data: project, percentageFunded, totalShares, totalAmountInvested },
			{ status: 200 }
		);
	}
}
