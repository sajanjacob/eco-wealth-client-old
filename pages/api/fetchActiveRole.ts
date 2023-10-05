// pages/api/fetchActiveRole.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function fetchActiveRole(req: any, res: any) {
	const userId = req.query.userId;
	const supabase = createRouteHandlerClient<any>({ cookies });
	if (req.method !== "GET") {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}

	if (!userId) {
		res.status(400).json({ message: "User ID is required" });
		return;
	}

	const { data, error } = await supabase
		.from("users")
		.select("active_role")
		.eq("id", userId)
		.single();

	if (error) {
		console.error("Error fetching active role:", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}

	res.status(200).json({ active_role: data?.active_role ?? null });
}
