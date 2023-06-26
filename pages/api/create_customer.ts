const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

const CreateCustomer = async (req: any, res: any) => {
	if (req.method === "POST") {
		try {
			const { name, email, phoneNumber } = req.body;

			const customer = await stripe.customers.create({
				name: name,
				email: email,
				phone: phoneNumber,
				description:
					"My First Test Customer (created for API docs at https://www.stripe.com/docs/api)",
			});
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
};

export default CreateCustomer;
