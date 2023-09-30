import supabase from "@/utils/supabaseClient";

export default async function producers(req: any, res: any) {
	const userId = req.query.user_id;
	if (!userId || userId === "") {
		return res.status(400).json({ error: "Missing user_id" });
	}

	if (req.method === "GET") {
		try {
			const response = await supabase
				.from("producers")
				.select(
					"*, producer_properties(*), producer_verification_codes(*), projects(*)"
				)
				.eq("user_id", userId);
			const producerData = response.data;
			return res.status(200).json({ producerData });
		} catch (error) {
			return res
				.status(500)
				.json({ error: "An error occurred when fetching producer data" });
		}
	} else {
		return res.status(400).json({ error: "Only GET requests are accepted" });
	}
}
