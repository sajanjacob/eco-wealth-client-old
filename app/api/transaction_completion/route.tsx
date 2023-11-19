import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
export async function POST(req: NextRequest, res: NextResponse) {
	// TODO: notify producer of new investment
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { orderData } = await req.json();
	console.log("orderData >>> ", orderData);
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
				payment_method: orderData.payment_method[0],
				fee_amount: orderData.fee_amount * 0.01,
				num_of_shares: orderData.num_of_shares,
			},
		])
		.select();
	if (error) {
		console.log("transaction error >>> ", error);
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	// console.log("transaction data >>> ", data);
	console.log("orderData.project_type >>> ", orderData.project_type);
	const transactionData = data && data[0];
	// /////////////////  ////        ///  ///////////////// //////////////   /////////////////  ///      ///
	// ///		  		  //////      ///  ///               ///  		 ///  ///                 ///    ///
	// ///	              ///  ///    ///  ///               ///  	     ///  ///                  ///  ///
	// /////////////	  ///    ///  ///  /////////////     //////////////   ///                   //////
	// ///                ///     /// ///  ///               ///       ///    ///       ///////      ////
	// ///		  		  ///      //////  ///               ///		 ///  ///           ///      ////
	// /////////////////  ///  	     ////  ///////////////// ///    	  /// /////////////////      //// :)
	if (orderData.project_type === "Energy") {
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
			console.log("error inserting energy investment data >>> ", error);
			return NextResponse.json({ message: error.message }, { status: 502 });
		}
		//
		// Here we look for the investor's metrics and update it if it exists, otherwise we create it.
		const { data: metricsData, error: metricsError } = await supabase
			.from("investor_metrics")
			.select("*")
			.eq("investor_id", orderData.investor_id);
		if (metricsError || metricsData.length === 0) {
			//
			// Create new analytics data
			const { error: metricsInsertError } = await supabase
				.from("investor_metrics")
				.insert([
					{
						investor_id: orderData.investor_id,
						total_est_kwh_contributed_per_year:
							orderData.kwh_contributed_per_year,
					},
				]);
			if (metricsInsertError) {
				return NextResponse.json(
					{ message: metricsInsertError.message },
					{ status: 502 }
				);
			}
		} else {
			//
			// Update existing analytics data
			const totalEstKwhContributedPerYear =
				parseInt(orderData.kwh_contributed_per_year) +
				parseInt(metricsData[0].total_est_kwh_contributed_per_year);
			const { error: metricsUpdateError } = await supabase
				.from("investor_metrics")
				.update({
					total_est_kwh_contributed_per_year: totalEstKwhContributedPerYear,
				})
				.eq("investor_id", orderData.investor_id);
			if (metricsUpdateError) {
				return NextResponse.json(
					{ message: metricsUpdateError.message },
					{ status: 502 }
				);
			}
		}
		// Update producer metrics
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

	if (orderData.project_type === "Tree") {
		console.log("processing tree investment api route");
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
			console.log("error inserting tree investment data >>> ", error);
			return NextResponse.json({ message: error.message }, { status: 502 });
		}
		console.log(
			"orderData.trees_contributed >>> ",
			orderData.trees_contributed
		);
		//
		// Here we look for the investor's analytics data and update it if it exists, otherwise we create it.
		const { data: metricsData, error: metricsError } = await supabase
			.from("investor_metrics")
			.select("*")
			.eq("investor_id", orderData.investor_id);
		console.log("metricsData.length >>> ", metricsData?.length);
		console.log("metricsError >>> ", metricsError);
		if (metricsError || metricsData?.length === 0) {
			//
			// Create new metrics data
			const { error: metricsInsertError } = await supabase
				.from("investor_metrics")
				.insert([
					{
						investor_id: orderData.investor_id,
						trees_contributed: orderData.trees_contributed,
					},
				]);
			if (metricsInsertError) {
				console.log("metricsInsertError >>> ", metricsInsertError);
				return NextResponse.json(
					{ message: metricsInsertError.message },
					{ status: 502 }
				);
			}
		} else {
			//
			// Update existing metrics data
			const totalTreesContributed =
				parseInt(orderData.trees_contributed) +
				parseInt(metricsData[0].trees_contributed);
			const { error: metricsUpdateError } = await supabase
				.from("investor_metrics")
				.update({
					trees_contributed: totalTreesContributed,
				})
				.eq("investor_id", orderData.investor_id);
			if (metricsUpdateError) {
				console.log("metricsUpdateError >>> ", metricsUpdateError);

				return NextResponse.json(
					{ message: metricsUpdateError.message },
					{ status: 502 }
				);
			}
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
