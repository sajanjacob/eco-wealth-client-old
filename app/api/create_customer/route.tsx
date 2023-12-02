const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const { name, email, phoneNumber } = await req.json();

		const customer = await stripe.customers.create({
			name: name,
			email: email,
			phone: phoneNumber,
			description:
				"My First Test Customer (created for API docs at https://www.stripe.com/docs/api)",
		});
		return NextResponse.json({ data: customer }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message });
	}
}
