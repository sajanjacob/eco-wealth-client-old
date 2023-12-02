import convertToCamelCase from "@/utils/convertToCamelCase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const investorId = req?.nextUrl?.searchParams.get("investorId");

	// Check transaction records for all projects the investor has invested in
	// return projects according to the returned transaction records
	try {
		const { data, error } = await supabase
			.from("transactions")
			.select("project_id")
			.eq("investor_id", investorId);

		if (error) {
			console.error("Error fetching transaction records:", error.message);
			return NextResponse.json({ error: error }, { status: 500 });
		}
		if (data.length === 0) {
			return NextResponse.json({ data: [] }, { status: 200 });
		}
		// Get all projects the investor has invested in
		const projectIds = data.map((transaction: any) => transaction.project_id);
		const { data: projects, error: projectsError } = await supabase
			.from("projects")
			.select(
				"*, tree_projects(*), energy_projects(*), project_financials(*), tree_investments(*), energy_investments(*), solar_projects(*)"
			)
			.in("id", projectIds)
			.eq("tree_investments.investor_id", investorId)
			.eq("energy_investments.investor_id", investorId);
		if (projectsError) {
			console.error("Error fetching projects:", projectsError.message);
			return NextResponse.json({ error: projectsError }, { status: 500 });
		}
		// Get each project's total shares (num_of_shares) and append to totalShares array
		let totalShares: any[] = [];
		convertToCamelCase(projects).forEach((project: Project) => {
			let totalProjectShares: any[] = [];
			if (project?.treeInvestments?.length > 0) {
				project.treeInvestments.forEach((treeInvestment: any) => {
					totalProjectShares.push(treeInvestment?.numOfShares);
				});
			} else if (project?.energyInvestments?.length > 0) {
				project.energyInvestments.forEach((energyInvestment: any) => {
					totalProjectShares.push(energyInvestment?.numOfShares);
				});
			}
			totalShares.push(totalProjectShares.reduce((a, b) => a + b, 0));
		});
		let totalAmountInvested: any[] = [];
		convertToCamelCase(projects).forEach((project: Project) => {
			let totalProjectAmountInvested: any[] = [];
			if (project?.energyInvestments?.length > 0) {
				project.energyInvestments.forEach((energyInvestment: any) => {
					totalProjectAmountInvested.push(energyInvestment?.amount);
				});
			} else if (project?.treeInvestments?.length > 0) {
				project.treeInvestments.forEach((treeInvestment: any) => {
					totalProjectAmountInvested.push(treeInvestment?.amount);
				});
			}
			totalAmountInvested.push(
				totalProjectAmountInvested.reduce((a, b) => a + b, 0)
			);
		});
		console.log("totalShares >>> ", totalShares);
		console.log("totalAmountInvested >>> ", totalAmountInvested);
		// console.log("projects >>> ", projects);
		return NextResponse.json(
			{ data: projects, totalShares, totalAmountInvested },
			{ status: 200 }
		);
	} catch (error) {
		console.error(`Error fetching metrics: ${error}`);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
