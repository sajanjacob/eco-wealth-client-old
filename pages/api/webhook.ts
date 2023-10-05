import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2022-11-15",
});

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	if (req.method === "POST") {
		console.log("webhook called");
		// Stripe requires the raw body to construct the event.
		const buf = await buffer(req);
		const sig = req.headers["stripe-signature"]!;

		let event: Stripe.Event;

		try {
			event = stripe.webhooks.constructEvent(
				buf.toString(),
				sig,
				process.env.stripe_webhook_secret!
			);
		} catch (err: any) {
			// On error, log and return the error message
			console.log(`Error message: ${err.message}`);
			res.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}
		console.log("webhook event type >>> ", event.type);
		console.log("webhook event data object >>> ", event.data.object);
		// Handle the checkout.session.completed event
		if (event.type === "checkout.session.completed") {
			const session = event.data.object as Stripe.Checkout.Session;
			console.log("webhook session >>> ", session);
			const {
				id,
				amount_subtotal,
				amount_total,
				customer_details,
				payment_method_types,
				status,
				metadata,
				currency,
			} = session;
			console.log(`Successful purchase! Customer: ${session.customer}`);
			if (!amount_total) return;
			if (!metadata) return;
			const feeAmount = amount_total * 0.03 + 1;
			const { data, error } = await supabase
				.from("transactions")
				.insert([
					{
						investor_id: metadata.investorId,
						amount: amount_total,
						product: metadata.productName,
						stripe_transaction_id: id,
						project_id: metadata.projectId,
						project_owner_id: metadata.projectOwnerId,
						currency: currency,
						status: status,
						payment_method: payment_method_types,
						fee_amount: feeAmount,
					},
				])
				.select();
			const transactionData = data && data[0];
			// TODO: add kwhTarget to metadata
			if (metadata.projectType === "energy") {
				const { data, error } = await supabase
					.from("energy_investments")
					.insert([
						{
							investor_id: metadata.investorId,
							project_id: metadata.projectId,
							amount: amount_total,
							kwh_target: metadata.kwhTarget,
							transaction_id: transactionData?.id,
						},
					]);
			}

			// TODO: add targetTrees to metadata
			if (metadata.projectType === "tree") {
				const { data, error } = await supabase.from("tree_investments").insert([
					{
						investor_id: metadata.investorId,
						project_id: metadata.projectId,
						amount: amount_total,
						target_trees: metadata.targetTrees,
						transaction_id: transactionData?.id,
					},
				]);
			}

			// Here you should handle the checkout session. For example, you could fulfill the order.
		}

		// Return a response to acknowledge receipt of the event
		res.json({ received: true });
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}

export const config = {
	api: {
		bodyParser: false,
	},
};
