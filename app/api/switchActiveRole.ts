// pages/api/fetchActiveRole.ts
import supabase from "@/utils/supabaseClient"; // Import your Supabase client

export default async function switchActiveRole(req: any, res: any) {
	const userId = req.body.userId;

	if (req.method !== "POST") {
		res.status(405).json({ message: "Method not allowed" });
		return;
	}

	if (!userId) {
		res.status(400).json({ message: "User ID is required" });
		return;
	}

	const { data, error } = await supabase
		.from("users")
		.update({ active_role: req.body.role })
		.eq("id", userId);

	if (error) {
		console.error("Error fetching active role:", error);
		res.status(500).json({ message: "Internal server error" });
		return;
	}

	res
		.status(200)
		.json({ message: "User's active role updated successfully." ?? null });
}
