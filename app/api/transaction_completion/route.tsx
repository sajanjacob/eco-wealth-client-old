import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
export async function POST(req: NextRequest, res: NextResponse) {
	// TODO: notify producer of new investment
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { orderData } = await req.json();
	console.log("orderData >>> ", orderData);
	const orderAmount = parseInt(orderData.amount) * 0.01;
	const feeAmount = parseInt(orderData.fee_amount) * 0.01;
	const totalRaised = orderAmount - feeAmount;
	function addDays(date: any, days: number) {
		var result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}
	const { data, error } = await supabase
		.from("transactions")
		.insert([
			{
				investor_id: orderData.investor_id,
				amount: totalRaised,
				order_total: orderAmount,
				refund_deadline: addDays(new Date(), 28),
				product: orderData.product,
				stripe_transaction_id: orderData.stripe_transaction_id,
				project_id: orderData.project_id,
				project_owner_id: orderData.project_owner_id,
				currency: orderData.currency,
				status: orderData.status,
				payment_method: orderData.payment_method[0],
				fee_amount: feeAmount,
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
	const { data: projectFinancialsData, error: projectFinancialsError } =
		await supabase
			.from("project_financials")
			.select("*")
			.eq("project_id", orderData.project_id);
	if (projectFinancialsError) {
		console.log("projectFinancialsError >>> ", projectFinancialsError);
		return NextResponse.json(
			{ message: projectFinancialsError.message },
			{ status: 502 }
		);
	}

	const totalAmountRaised =
		totalRaised + parseInt(projectFinancialsData[0].total_amount_raised);
	const totalNumOfSharesSold =
		parseInt(orderData.num_of_shares) +
		parseInt(projectFinancialsData[0].num_of_shares_sold);
	let totalNumberOfInvestors = parseInt(
		projectFinancialsData[0].num_of_investors
	);

	const { data: uniqueInvestors, error: uniqueInvestorsError } = await supabase
		.from("view_unique_investors_per_project")
		.select()
		.eq("project_id", orderData.project_id);
	if (uniqueInvestorsError) {
		console.log("uniqueInvestorsError >>> ", uniqueInvestorsError);
		return NextResponse.json(
			{ message: uniqueInvestorsError.message },
			{ status: 502 }
		);
	}
	await supabase
		.from("project_financials")
		.update({
			total_amount_raised: totalAmountRaised,
			numOfSharesSold: totalNumOfSharesSold,
			total_number_of_investors: uniqueInvestors[0].unique_investors_count,
		})
		.eq("project_id", orderData.project_id);

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
				amount: totalRaised,
				order_amount: orderAmount,
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
		const { data: producerMetricsData, error: producerMetricsError } =
			await supabase
				.from("producer_metrics")
				.select("*")
				.eq("producer_id", orderData.project_owner_id);
		if (producerMetricsError || producerMetricsData.length === 0) {
			//
			// Create new analytics data

			const { error: producerMetricsInsertError } = await supabase
				.from("producer_metrics")
				.insert([
					{
						producer_id: orderData.project_owner_id,
						total_raised: totalAmountRaised,
						total_tree_contributions_received: 0,
						num_of_investors: 1,
						total_kwh_contributions_received:
							orderData.kwh_contributed_per_year,
						total_shares_sold: orderData.num_of_shares,
						num_of_investors_paid: 0,
						total_paid_to_investors: 0,
						total_trees_planted: 0,
						total_kwh_generated: 0,
						total_carbon_offset: 0,
						total_homes_powered: 0,
						total_arrays_installed: 0,
					},
				]);
			if (producerMetricsInsertError) {
				return NextResponse.json(
					{ message: producerMetricsInsertError.message },
					{ status: 502 }
				);
			}
		} else {
			//
			// Update existing analytics data

			const { data: investorCountData, error: investorCountDataError } =
				await supabase
					.from("view_unique_investors_per_owner")
					.select("*")
					.eq("project_owner_id", orderData.project_owner_id);
			if (investorCountDataError) {
				console.log("investorCountDataError >>> ", investorCountDataError);
				return NextResponse.json(
					{ message: investorCountDataError.message },
					{ status: 502 }
				);
			}
			console.log("investorCountData >>> ", investorCountData);
			const { error: producerMetricsUpdateError } = await supabase
				.from("producer_metrics")
				.update({
					producer_id: orderData.project_owner_id,
					num_of_investors: investorCountData[0].unique_investors_count,
					total_raised:
						parseInt(producerMetricsData[0].total_raised) + totalAmountRaised,

					total_kwh_contributions_received:
						parseInt(producerMetricsData[0].total_kwh_contributions_received) +
						parseInt(orderData.kwh_contributed_per_year),
					total_shares_sold:
						parseInt(producerMetricsData[0].total_shares_sold) +
						parseInt(orderData.num_of_shares),
				})
				.eq("producer_id", orderData.project_owner_id);
			if (producerMetricsUpdateError) {
				return NextResponse.json(
					{ message: producerMetricsUpdateError.message },
					{ status: 502 }
				);
			}
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

	if (orderData.project_type === "Tree") {
		console.log("processing tree investment api route");
		const { error } = await supabase.from("tree_investments").insert([
			{
				investor_id: orderData.investor_id,
				project_id: orderData.project_id,
				amount: totalRaised,
				order_amount: orderAmount,
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
		// Update producer metrics
		const { data: producerMetricsData, error: producerMetricsError } =
			await supabase
				.from("producer_metrics")
				.select("*")
				.eq("producer_id", orderData.project_owner_id);
		if (producerMetricsError || producerMetricsData.length === 0) {
			//
			// Create new analytics data

			const { error: producerMetricsInsertError } = await supabase
				.from("producer_metrics")
				.insert([
					{
						producer_id: orderData.project_owner_id,
						total_raised: totalAmountRaised,
						num_of_investors: 1,
						total_tree_contributions_received: orderData.trees_contributed,
						total_kwh_contributions_received: 0,
						total_shares_sold: orderData.num_of_shares,
						num_of_investors_paid: 0,
						total_paid_to_investors: 0,
						total_trees_planted: 0,
						total_kwh_generated: 0,
						total_carbon_offset: 0,
						total_homes_powered: 0,
						total_arrays_installed: 0,
					},
				]);
			if (producerMetricsInsertError) {
				console.log(
					"producerMetricsInsertError >>> ",
					producerMetricsInsertError
				);
				return NextResponse.json(
					{ message: producerMetricsInsertError.message },
					{ status: 502 }
				);
			}
		} else {
			//
			// Update existing analytics data
			console.log("updating producer metric data...");

			const { data, error } = await supabase
				.from("transactions")
				.select("*")
				.eq("project_owner_id", orderData.project_owner_id)
				.eq("investor_id", orderData.investor_id);
			if (error) {
				console.log("error pulling transaction data >>> ", error);
				return NextResponse.json({ message: error.message }, { status: 502 });
			}

			const { data: investorCountData, error: investorCountDataError } =
				await supabase
					.from("view_unique_investors_per_owner")
					.select("*")
					.eq("project_owner_id", orderData.project_owner_id);
			if (investorCountDataError) {
				console.log("investorCountDataError >>> ", investorCountDataError);
				return NextResponse.json(
					{ message: investorCountDataError.message },
					{ status: 502 }
				);
			}
			console.log("investorCountData >>> ", investorCountData);

			const { error: producerMetricsUpdateError } = await supabase
				.from("producer_metrics")
				.update({
					producer_id: orderData.project_owner_id,
					num_of_investors: investorCountData[0].unique_investors_count,
					total_raised:
						parseInt(producerMetricsData[0].total_raised) + totalAmountRaised,
					total_tree_contributions_received:
						parseInt(producerMetricsData[0].total_tree_contributions_received) +
						parseInt(orderData.trees_contributed),

					total_shares_sold:
						parseInt(producerMetricsData[0].total_shares_sold) +
						parseInt(orderData.num_of_shares),
				})
				.eq("producer_id", orderData.project_owner_id);
			if (producerMetricsUpdateError) {
				console.log(
					"producerMetricsUpdateError >>> ",
					producerMetricsUpdateError
				);
				return NextResponse.json(
					{ message: producerMetricsUpdateError.message },
					{ status: 502 }
				);
			}
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
