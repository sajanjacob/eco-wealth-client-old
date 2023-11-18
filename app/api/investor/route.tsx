import { NextApiRequest, NextApiResponse } from "next";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import convertToCamelCase from "@/utils/convertToCamelCase";
import { NextResponse, NextRequest } from "next/server";
interface TreeInvestment {
	id: string;
	amount?: any;
	targetTrees?: number;
}
interface EnergyInvestment {
	amount?: any;
	kwhTarget?: number;
}

export async function GET(req: NextRequest, res: NextResponse): Promise<any> {
	const { userId } = await req.json();
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	// Get the investor's unique ID
	const { data, error } = await supabase
		.from("investors")
		.select("*")
		.eq("user_id", userId)
		.single();
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	const investorId = data.id;

	// Fetch the investor's transactions
	const { data: transactions, error: transactionsError } = await supabase
		.from("transactions")
		.select("project_id")
		.eq("investor_id", investorId);
	if (transactionsError) {
		return NextResponse.json(
			{ error: transactionsError.message },
			{ status: 500 }
		);
	}

	// Get the unique project IDs
	const projectIds = Array.from(
		new Set(transactions.map((transaction) => transaction.project_id))
	);

	// Fetch the project data and corresponding investment data for each project
	let portfolio = [];
	for (const projectId of projectIds) {
		const { data: project, error: projectError } = await supabase
			.from("projects")
			.select("*")
			.eq("id", projectId)
			.single();

		if (projectError) {
			return NextResponse.json(
				{ error: projectError.message },
				{ status: 500 }
			);
		}

		const investmentTable =
			(project as unknown as Project).type === "Tree"
				? "tree_investments"
				: "energy_investments";

		const { data: investments, error: investmentsError } = await supabase
			.from(investmentTable)
			.select("*")
			.eq("project_id", projectId);
		let investmentProjects: TreeInvestment[] | EnergyInvestment[] | any = [];
		if (investments) {
			investmentProjects = convertToCamelCase(investments);
		}
		if (investmentsError) {
			return NextResponse.json(
				{ error: investmentsError.message },
				{ status: 500 }
			);
		}
		// Calculate the total investment amount and add it to the project data
		const totalInvested = investmentProjects.reduce(
			(total: any, investment: { amount: any }) => total + investment.amount,
			0
		);

		console.log("investmentProjects >>> ", investmentProjects);
		// Calculate the total units contributed and add it to the project data
		let totalUnitsContributed = 0;
		if ((project as unknown as Project).type === ("Tree" || "tree")) {
			totalUnitsContributed = investmentProjects.reduce(
				(total: number, investment: any) => total + investment.targetTrees,
				0
			);
		}
		if ((project as unknown as Project).type === ("Energy" || "energy")) {
			totalUnitsContributed = investmentProjects.reduce(
				(total: number, investment: any) => total + investment.kwhTarget,
				0
			);
		}

		// Calculate the average ROI
		const totalROI = investmentProjects.reduce(
			(total: any, investment: any) => total + investment.estRoi,
			0
		);
		const averageROI = (totalROI / investmentProjects.length).toFixed(2);

		(project as unknown as Project).totalAmountRaised = totalInvested;
		// (project as unknown as Project).unitsContributed = totalUnitsContributed;
		(project as unknown as Project).averageROI = parseInt(averageROI);
		portfolio.push(project);
	}

	// Return the portfolio data
	return NextResponse.json(portfolio, { status: 200 });
}
