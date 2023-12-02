import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2023-10-16",
});
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function POST(req: NextRequest, res: any) {
	const { projectId, numOfShares } = await req.json();
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { data: project, error } = await supabase
		.from("projects")
		.select(
			"*, tree_projects(*), energy_projects(*), project_financials(*), solar_projects(*)"
		)
		.eq("id", projectId)
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	const user = await supabase.auth.getUser();
	const { data: userData, error: userDataError } = await supabase
		.from("users")
		.select("*, investors(*)")
		.eq("id", user.data.user?.id)
		.single();
	if (userDataError)
		return NextResponse.json({ error: userDataError.message }, { status: 500 });
	console.log("project >>> ", project);
	const customerEmail = userData.email;
	const investorId = userData.investors.id;
	const projectName = project.title;
	const producerId = project.producer_id;
	const fundsRequestedPerTree =
		project?.tree_projects?.funds_requested_per_tree;
	const type = project.type;
	const isNonProfit = project.is_non_profit;
	const amountPerShare = project.project_financials.amount_per_share;
	console.log("amountPerShare: ", amountPerShare);
	const adminFeeId = process.env.admin_fee_id;
	const transactionFee = 1;
	const merchantFeePercentage = 0.03;
	const feeAmount = numOfShares * amountPerShare + transactionFee;
	const feeAmountWithPercentage = feeAmount * merchantFeePercentage;
	const finalFeeAmountRounded = feeAmountWithPercentage.toFixed(2);

	console.log("req.url", req.nextUrl.origin);

	let metaData;
	if (type === "Energy") {
		console.log(
			"project?.energy_projects?.target_kwh_production_per_year ",
			project?.energy_projects?.target_kwh_production_per_year
		);
		const kwhPerShare =
			parseInt(project?.energy_projects?.target_kwh_production_per_year) /
			parseInt(project.project_financials.num_of_shares);
		console.log("kwhPerShare", kwhPerShare);

		const avgKwhPerHousePerYear = 11000;
		const homesPowered = (kwhPerShare * numOfShares) / avgKwhPerHousePerYear;
		console.log("homesPowered", homesPowered);
		const arraysInstalled =
			(project?.solar_projects[0]?.num_of_arrays /
				project.project_financials.num_of_shares) *
			numOfShares;
		console.log("arraysInstalled", arraysInstalled);
		metaData = {
			projectId: projectId,
			investorId: investorId,
			projectOwnerId: producerId,
			productName: `${projectName} - ${type} ${
				isNonProfit ? "contribution" : "investment"
			}`,
			projectType: type,
			numOfShares: numOfShares,
			kwhContributedPerYear: kwhPerShare * numOfShares,
			estKwhPerShare: kwhPerShare,
			homesPowered: homesPowered,
			arraysInstalled: arraysInstalled,
		};
	} else {
		console.log(
			"project?.tree_projects?.tree_target",
			project?.tree_projects?.tree_target
		);
		const treesPerShare =
			project?.tree_projects?.tree_target /
			project.project_financials.num_of_shares;
		console.log("treesPerShare ", treesPerShare);
		metaData = {
			projectId: projectId,
			investorId: investorId,
			projectOwnerId: producerId,
			productName: `${projectName} - ${type} ${
				isNonProfit ? "contribution" : "investment"
			}`,
			projectType: type,
			numOfShares: numOfShares,
			treesContributed: treesPerShare * numOfShares,
			fundsRequestedPerTree: fundsRequestedPerTree,
		};
	}

	console.log("metaData", metaData);
	try {
		// Create Checkout Sessions from body params.
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					price_data: {
						currency: "cad",
						product_data: {
							name: `${projectName} - ${type} ${
								isNonProfit ? "contribution" : "investment"
							}`,
						},

						unit_amount: amountPerShare * 100,
					},

					quantity: numOfShares,
				},
				{
					price_data: {
						currency: "cad",
						product_data: {
							name: `Merchant fee`,
						},

						unit_amount: Number(finalFeeAmountRounded) * 100,
					},

					quantity: 1,
				},
				{
					price_data: {
						currency: "cad",
						product_data: {
							name: `Eco Wealth Admin fee`,
						},

						unit_amount: 100,
					},
					quantity: 1,
				},
			],
			customer_email: customerEmail,
			metadata: metaData,
			mode: "payment",
			success_url: `${req.nextUrl.origin}/i/portfolio?success=true`,
			cancel_url: `${req.nextUrl.origin}/i/projects/${projectId}/invest?canceled=true`,
		});
		console.log("session", session);
		if (session) {
			return NextResponse.json({ id: session.id }, { status: 200 });
		} else {
			return NextResponse.json(
				{ message: "Error creating session" },
				{ status: 500 }
			);
		}
	} catch (err: any) {
		return NextResponse.json({ message: err.message }, { status: 500 });
	}
}
