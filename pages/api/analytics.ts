import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function analytics(req: any, res: any) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	const userId = req.query.userId;
	if (req.method === "GET") {
		try {
			// Get individual user analytics
			const { data, error } = await supabase
				.from("analytics")
				.select("*")
				.eq("user_id", userId);

			// Get total analytics
			const { data: totalData, error: totalErr } = await supabase.rpc(
				"total_contributions"
			);

			if (error) {
				return res
					.status(500)
					.json({ error: "An error occurred while fetching analytics data." });
			}
			if (totalErr) {
				return res.status(501).json({
					error: "An error occurred while fetching analytics data.",
					message: totalErr.message,
				});
			}

			return res.status(200).json({ data, totalData });
		} catch (error) {
			console.error(`Error fetching analytics: ${error}`);
			return res
				.status(502)
				.json({ error: "An error occurred while fetching analytics data." });
		}
	}
	return res.status(405).json({ message: "Method not allowed" });
}
