// /pages/api/updateProperty.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import shortid from "shortid";
export default async function updateProperty(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	if (req.method !== "PUT") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { addressId, newAddressDetails, producerId } = req.body;

	// Validation
	if (!addressId) {
		return res.status(400).json({ error: "addressId is required" });
	}

	if (!newAddressDetails || typeof newAddressDetails !== "object") {
		return res
			.status(400)
			.json({ error: "newAddressDetails is required and must be an object" });
	}

	const {
		addressLineOne,
		addressLineTwo,
		city,
		country,
		postalCode,
		stateProvince,
	} = newAddressDetails;

	try {
		const { data, error } = await supabase
			.from("producer_properties")
			.update({
				address: {
					address_line_one: addressLineOne,
					address_line_two: addressLineTwo,
					city: city,
					country: country,
					postal_code: postalCode,
					state_province: stateProvince,
				},
				is_verified: false,
				updated_at: new Date(),
			})
			.eq("id", addressId)
			.select();

		if (error) {
			return res.status(400).json({ error: error.message });
		}
		if (data) {
			const { data: verificationData, error } = await supabase
				.from("producer_verification_codes")
				.insert([
					{
						id: uuidv4(),
						producer_id: producerId,
						property_id: addressId,
						verification_code: shortid.generate(),
					},
				]);
		}
		return res.status(200).json({ data });
	} catch (error) {
		console.error("Error updating property:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
