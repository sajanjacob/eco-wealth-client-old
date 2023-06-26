// pages/api/properties/delete.js
import supabase from "@/utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";
export default async function handler(req: any, res: any) {
	// Ensure this route can only be called with a POST request
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed. Use POST." });
	}

	const { addressId, producerId } = req.body;

	// Ensure addressId is provided
	if (!addressId) {
		return res.status(400).json({ error: "addressId is required." });
	}
	if (!producerId) {
		return res.status(400).json({ error: "producerId is required." });
	}

	const { data, error } = await supabase
		.from("producer_properties")
		.update({
			is_deleted: true,
			is_verified: false,
			deleted_at: new Date(),
			updated_at: new Date(),
		})
		.eq("id", addressId);

	// Handle errors from Supabase
	if (error) {
		console.error("Error deleting property:", error);
		return res.status(500).json({ error: "Error deleting property." });
	}
	if (data) {
		// Here we update the status of the producer's projects that contain the original addressId to pending_update_review
		const { data: projectData, error: projectUpdateError } = await supabase
			.from("projects")
			.update({
				status: "pending_update_review",
				updated_at: new Date(),
			})
			.eq("property_id", addressId)
			.select();
		if (projectUpdateError) {
			console.error("Error updating project status:", projectUpdateError);
			return res.status(500).json({
				error: `Error updating project status. ${projectUpdateError.message}`,
			});
		}

		// Here we create a producer_notification record for the producer to notify them that they need to update their project with a new property
		// const { data: notificationData, error } = await supabase
		// 	.from("producer_notifications")
		// 	.insert([
		// 		{
		// 			id: uuidv4(),
		// 			producer_id: producerId,
		// 			notification_type: "update_property",
		// 			notification_data: {
		// 				message:
		// 					"Your project is missing an address.  You need to update your project with a new property.",
		// 				project_id: projectData[0].id,
		// 			},
		// 		},
		// 	])
		// 	.select();
	}

	// Return message to client
	res.status(200).json({ message: "Property deleted successfully." });
}
