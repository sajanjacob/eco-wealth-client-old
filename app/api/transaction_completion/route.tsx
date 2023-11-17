import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: NextRequest, res: NextResponse) {
	console.log("req", req);
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { orderData } = await req.json();
	const { data, error } = await supabase
		.from("transactions")
		.insert([
			{
				investor_id: orderData.investor_id,
				amount: orderData.amount * 0.01,
				product: orderData.product,
				stripe_transaction_id: orderData.stripe_transaction_id,
				project_id: orderData.project_id,
				project_owner_id: orderData.project_owner_id,
				currency: orderData.currency,
				status: orderData.status,
				payment_method: orderData.payment_method_types,
				fee_amount: orderData.fee_amount,
			},
		])
		.select();
	if (error) {
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	// here we get the project from supabase to get the kwhTarget or targetTrees
	const { data: projectData, error: projectError } = await supabase
		.from("projects")
		.select(
			"tree_projects(id, tree_target), energy_projects(id, energy_production_target)"
		)
		.eq("id", orderData.project_id);
	if (projectError) {
		return NextResponse.json(
			{ message: projectError.message },
			{ status: 502 }
		);
	}
	console.log("(transaction_completion) projectData >> ", projectData);
	const transactionData = data && data[0];
	// TODO: add kwhTarget to metadata
	if (orderData.project_type === "energy") {
		// take total est energy production and divide by 1000 to get kwh
		// divide by the number of shares to get the kwh per share
		// multiply by the number of shares the investor bought to get the total kwh contribution
		const { data, error } = await supabase.from("energy_investments").insert([
			{
				investor_id: orderData.investor_id,
				project_id: orderData.project_id,
				amount: orderData.amount * 0.01,
				num_of_shares: orderData.num_of_shares,
				transaction_id: transactionData?.id,
			},
		]);
		if (error) {
			return NextResponse.json({ message: error.message }, { status: 502 });
		}
		return NextResponse.json(
			{
				message:
					"Order successfully completed. Thank you for investing in energy and the environment.",
			},
			{ status: 200 }
		);
	}

	// TODO: add targetTrees to metadata
	if (orderData.project_type === "tree") {
		// take tree target and divide by the number of shares to get the number of trees planted per share, round to nearest whole number
		// multiply by the number of shares the investor bought to get the total trees contributed
		const { data, error } = await supabase.from("tree_investments").insert([
			{
				investor_id: orderData.investor_id,
				project_id: orderData.project_id,
				amount: orderData.amount * 0.01,
				num_of_shares: orderData.num_of_shares,
				transaction_id: transactionData?.id,
			},
		]);
		if (error) {
			return NextResponse.json({ message: error.message }, { status: 502 });
		}
		return NextResponse.json(
			{
				message:
					"Order successfully completed. Thank you for investing in the environment.",
			},
			{ status: 200 }
		);
	}
}
