import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import shortid from "shortid";

export default async function handler(req: any, res: any) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	if (req.method === "POST") {
		const { producerId, address } = req.body;

		// Check if producerId and address details are provided
		if (!producerId) {
			return res.status(400).json({
				error: "Missing producerId details in request body",
			});
		}
		if (
			!address.addressLineOne ||
			!address.city ||
			!address.stateProvince ||
			!address.postalCode ||
			!address.country
		) {
			return res.status(400).json({
				error: "Missing address details in request body",
			});
		}

		// Insert a new property into the 'producer_properties' table
		const { data: propertyData, error } = await supabase
			.from("producer_properties")
			.insert([
				{
					producer_id: producerId,
					address: {
						address_line_one: address.addressLineOne,
						address_line_two: address.addressLineTwo,
						city: address.city,
						state_province: address.stateProvince,
						postal_code: address.postalCode,
						country: address.country,
					},
					is_verified: false,
				},
			])
			.select();
		if (error) {
			return res.status(500).json({ error: error.message });
		}

		// If property data is available, insert a new record into the 'producer_verification_codes' table
		if (propertyData) {
			const { data: verificationData, error } = await supabase
				.from("producer_verification_codes")
				.insert([
					{
						producer_id: producerId,
						property_id: propertyData[0].id,
						verification_code: shortid.generate(),
					},
				]);

			if (error) {
				return res.status(500).json({ error: error.message });
			}
		}

		return res.status(200).json({ message: "Property inserted successfully" });
	}

	// If the method is not POST
	return res.status(405).json({ message: "Method not allowed" });
}
