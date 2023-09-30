import convertToCamelCase from "@/utils/convertToCamelCase";
import supabase from "@/utils/supabaseClient";
import shortid from "shortid";

export default async function handler(req: any, res: any) {
	const producerId = req.query.producer_id;
	console.log("received request");
	if (!producerId || producerId === "") {
		return res.status(400).json({ error: "Missing producer_id" });
	}

	if (req.method === "GET") {
		console.log("received get request");
		try {
			const { data, error } = await supabase
				.from("producer_properties")
				.select("*")
				.eq("producer_id", producerId)
				.eq("is_deleted", false);

			if (error) {
				return res.status(500).json({ error: error.message });
			} else {
				const propertyData = convertToCamelCase(data) as Property[];

				// Here we check producer_verification_codes to see if a code has been created, if not, we create one
				const { data: verificationData, error } = await supabase
					.from("producer_verification_codes")
					.select("*")
					.eq("producer_id", producerId)
					.eq("is_deleted", false);
				if (error) {
					res.status(501).json({ error: error.message });
				} else {
					if (verificationData.length === 0) {
						console.log("propertyData[0].id >>> ", propertyData[0].id);
						console.log("producerId >>> ", producerId);
						// TODO: fix verification code RLS
						const { data: verificationDataTwo, error } = await supabase
							.from("producer_verification_codes")
							.insert([
								{
									producer_id: producerId,
									verification_code: shortid.generate(),
									property_id: propertyData[0].id,
								},
							]);
						if (error) {
							console.log("error >>> ", error);
						}
					}
					return res.status(200).json({ propertyData });
				}
			}
		} catch (error) {
			return res
				.status(500)
				.json({ error: "An error occurred when fetching producer data" });
		}
	} else {
		return res.status(400).json({ error: "Only GET requests are accepted" });
	}
}
