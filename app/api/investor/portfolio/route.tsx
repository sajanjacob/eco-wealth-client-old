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

	function sumOfShares(treeInvestments: any) {
		console.log("treeInvestments >>> ", treeInvestments);
		return treeInvestments.reduce(
			(accumulator: any, currentInvestment: any) => {
				return accumulator + (currentInvestment.num_of_shares || 0);
			},
			0
		);
	}

	function sumOfAmountInvested(treeInvestments: any) {
		console.log("treeInvestments >>> ", treeInvestments);
		return treeInvestments.reduce(
			(accumulator: any, currentInvestment: any) => {
				return accumulator + (currentInvestment.amount || 0);
			},
			0
		);
	}
	// Check transaction records for all projects the investor has invested in
	// return projects according to the returned transaction records
	try {
		// Get individual user metrics
		let { data, error } = await supabase.rpc("get_projects_by_investor", {
			investor_id_param: investorId,
		});
		if (error) console.error(error);
		else console.log(data);
		console.log("data >>> ", data);
		let totalShares = 0;
		let totalAmountInvested = 0;
		if (data.length > 0) {
			totalShares = sumOfShares(data[0].tree_investments);
			totalAmountInvested = sumOfAmountInvested(data[0].tree_investments);
		}
		return NextResponse.json(
			{ data, totalShares, totalAmountInvested },
			{ status: 200 }
		);
	} catch (error) {
		console.error(`Error fetching metrics: ${error}`);
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
