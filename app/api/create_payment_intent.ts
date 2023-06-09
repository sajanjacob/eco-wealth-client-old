import Stripe from "stripe";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
	apiVersion: '2022-11-15'
});

const CreatePaymentIntent = async (req: any, res: any) => {
	if (req.method === "POST") {
		try {
			const { amount } = req.body;
			const paymentIntent = await stripe.paymentIntents.create({
				amount: Math.round(amount * 100),
				currency: "cad",
			});

			res.status(200).json({ clientSecret: paymentIntent.client_secret });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
};

export default CreatePaymentIntent;