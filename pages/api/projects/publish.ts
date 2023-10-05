import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export default async function handler(req: any, res: any) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	if (req.method === "PUT") {
		const id = req.query.id; // Get project ID from URL
		const { status, projectId } = req.body;
		if (status === "verified_published")
			return res.status(504).json({
				message: "Project is already public!",
			});
		const { data: project, error: projectError } = await supabase
			.from("projects")
			.select("*")
			.eq("id", projectId)
			.single();

		if (projectError) {
			return res.status(500).json({ error: { message: projectError.message } });
		}
		if (project && project.is_verified === true) {
			// Update the project in the 'projects' table

			const { data, error } = await supabase
				.from("projects")
				.update({ status: "verified_published" })
				.eq("id", projectId);
			if (error) {
				// Handle the error appropriately
				return res.status(501).json({ message: error.message });
			} else {
				// Show a success message or refresh the data on the page
				return res
					.status(200)
					.json({ message: "Project published successfully" });
			}
		}
		return res.status(503).json({
			message: "Unable to publish. Project is not verified yet.",
		});
	}

	// If the method is not PUT
	return res.status(405).json({ message: "Method not allowed" });
}
