import { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/utils/supabaseClient";
import convertToCamelCase from "@/utils/convertToCamelCase";
interface TreeInvestment {
	id: string;
	amount?: any;
	targetTrees?: number;
}
interface EnergyInvestment {
	amount?: any;
	kwhTarget?: number;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
): Promise<void> {
	const userId = req.query.userId;

	// Get the investor's unique ID
	const { data, error } = await supabase
		.from("investors")
		.select("*")
		.eq("user_id", userId)
		.single();
	if (!data) return;

	const investorId = data.id;

	// Fetch the investor's transactions
	const { data: transactions, error: transactionsError } = await supabase
		.from("transactions")
		.select("project_id")
		.eq("investor_id", investorId);
	if (transactionsError) {
		return res.status(500).json({ error: "Failed to fetch transactions" });
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
			return res.status(500).json({ error: "Failed to fetch project data" });
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
			return res.status(500).json({ error: "Failed to fetch investment data" });
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
		(project as unknown as Project).unitsContributed = totalUnitsContributed;
		(project as unknown as Project).averageROI = parseInt(averageROI);
		portfolio.push(project);
	}

	// Return the portfolio data
	return res.status(200).json(portfolio);
}
