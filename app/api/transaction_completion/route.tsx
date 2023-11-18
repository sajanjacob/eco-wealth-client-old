import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: NextRequest, res: NextResponse) {
	// TODO: notify producer of new investment
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
				num_of_shares: orderData.num_of_shares,
			},
		])
		.select();
	if (error) {
		return NextResponse.json({ message: error.message }, { status: 501 });
	}

	const transactionData = data && data[0];
	// /////////////////  ////        ///  ///////////////// //////////////   /////////////////  ///      ///
	// ///		  		  //////      ///  ///               ///  		 ///  ///                 ///    ///
	// ///	              ///  ///    ///  ///               ///  	     ///  ///                  ///  ///
	// /////////////	  ///    ///  ///  /////////////     //////////////   ///                   //////
	// ///                ///     /// ///  ///               ///       ///    ///       ///////      ////
	// ///		  		  ///      //////  ///               ///		 ///  ///           ///      ////
	// /////////////////  ///  	     ////  ///////////////// ///    	  /// /////////////////      //// :)
	if (orderData.project_type === "energy") {
		const { error } = await supabase.from("energy_investments").insert([
			{
				investor_id: orderData.investor_id,
				project_id: orderData.project_id,
				amount: orderData.amount * 0.01,
				num_of_shares: orderData.num_of_shares,
				transaction_id: transactionData?.id,
				kwh_contributed_per_year: orderData.kwh_contributed_per_year,
			},
		]);
		if (error) {
			return NextResponse.json({ message: error.message }, { status: 502 });
		}
		//
		// Here we look for the investor's analytics data and update it if it exists, otherwise we create it.
		const { data: analyticsData, error: analyticsError } = await supabase
			.from("investor_analytics")
			.select("*")
			.eq("investor_id", orderData.investor_id);
		if (analyticsError || analyticsData.length === 0) {
			//
			// Create new analytics data
			const { error: analyticsInsertError } = await supabase
				.from("investor_analytics")
				.insert([
					{
						investor_id: orderData.investor_id,
						total_est_kwh_contributed_per_year:
							orderData.kwh_contributed_per_year,
					},
				]);
		} else {
			//
			// Update existing analytics data
			const totalEstKwhContributedPerYear =
				orderData.kwh_contributed_per_year +
				analyticsData[0].total_est_kwh_contributed_per_year;
			const { error: analyticsUpdateError } = await supabase
				.from("investor_analytics")
				.update({
					total_est_kwh_contributed_per_year: totalEstKwhContributedPerYear,
				})
				.eq("investor_id", orderData.investor_id);
		}
		return NextResponse.json(
			{
				message:
					"Order successfully completed. Thank you for investing in energy and the environment.",
			},
			{ status: 200 }
		);
	}

	// /////////////////  //////////////    /////////////////  /////////////////
	//       ///		  ///  		 ///    ///                ///
	//       ///	      ///  	     ///    ///                ///
	//       ///	      //////////////    //////////         //////////
	//       ///          ///       ///     ///                ///
	//       ///		  ///		 ///    ///                ///
	//       ///          ///    	  ///   /////////////////  ///////////////// :)

	if (orderData.project_type === "tree") {
		const { error } = await supabase.from("tree_investments").insert([
			{
				investor_id: orderData.investor_id,
				project_id: orderData.project_id,
				amount: orderData.amount * 0.01,
				num_of_shares: orderData.num_of_shares,
				transaction_id: transactionData?.id,
				trees_contributed: orderData.trees_contributed,
			},
		]);
		if (error) {
			return NextResponse.json({ message: error.message }, { status: 502 });
		}
		//
		// Here we look for the investor's analytics data and update it if it exists, otherwise we create it.
		const { data: analyticsData, error: analyticsError } = await supabase
			.from("investor_analytics")
			.select("*")
			.eq("investor_id", orderData.investor_id);
		if (analyticsError || analyticsData.length === 0) {
			//
			// Create new analytics data
			const { error: analyticsInsertError } = await supabase
				.from("investor_analytics")
				.insert([
					{
						investor_id: orderData.investor_id,
						trees_contributed: orderData.trees_contributed,
					},
				]);
		} else {
			//
			// Update existing analytics data
			const totalTreesContributed =
				orderData.trees_contributed + analyticsData[0].trees_contributed;
			const { error: analyticsUpdateError } = await supabase
				.from("investor_analytics")
				.update({
					trees_contributed: totalTreesContributed,
				})
				.eq("investor_id", orderData.investor_id);
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
