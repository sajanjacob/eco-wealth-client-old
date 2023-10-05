import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2022-11-15",
});

export async function POST(req: any, res: any) {
	const { projectId } = req.body;
	const unitAmount = amountPerUnit * 1.03;
	const adminFeeId = process.env.admin_fee_id;
	console.log("adminFeeId", adminFeeId);
	console.log("req.body", req.body);
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

						unit_amount: unitAmount * 100,
					},

					quantity: numOfUnits,
				},
				{
					price: `${adminFeeId}`,
					quantity: 1,
				},
			],
			customer_email: user.email,
			metadata: {
				projectId: projectId,
				investorId: user.investorId,
				projectOwnerId: project.producerId,
				productName: `${projectName} - ${type} ${
					isNonProfit ? "contribution" : "investment"
				}`,
				projectType: project.type,
			},
			mode: "payment",
			success_url: `${req.headers.origin}/i/portfolio?success=true`,
			cancel_url: `${req.headers.origin}/i/projects/${projectId}/invest?canceled=true`,
		});
		console.log("session", session);
		if (session) {
			res.status(200).json({ id: session.id });
		}
	} catch (err: any) {
		res.status(err.statusCode || 500).json(err.message);
	}
}
