import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export default async function handler(req: any, res: any) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	if (req.method === "PUT") {
		const id = req.query.id; // Get project ID from URL
		const {
			title,
			bannerUrl,
			coordinatorName,
			coordinatorPhone,
			description,
			status,
			projectType,
			totalArea,
			projectAddressId,
			treeTarget,
			fundsRequestedPerTree,
			treeType,
			fundsRequested,
			energyProductionTarget,
			numOfArrays,
			installedSystemSize,
			photovoltaicCapacity,
			estimatedInstallationCost,
			estimatedSystemCost,
			estimatedMaintenanceCost,
			installationTeam,
			connectWithSolarPartner,
			energyType,
		} = req.body;

		// Update the project in the 'projects' table
		let { data, error } = await supabase
			.from("projects")
			.update({
				title,
				updated_at: new Date().toISOString(),
				image_url: bannerUrl,
				project_coordinator_contact: {
					name: coordinatorName,
					phone: coordinatorPhone,
				},
				description,
				status,
				type: projectType,
				total_area_sqkm: totalArea,
				property_address_id: projectAddressId,
				is_verified: false,
			})
			.eq("id", id);

		if (error) {
			return res.status(500).json({ error: error.message });
		}

		// If the project type is 'Tree', update the 'tree_projects' table
		if (projectType === "Tree" && data) {
			const { data, error } = await supabase
				.from("tree_projects")
				.update({
					tree_target: treeTarget,
					funds_requested_per_tree: fundsRequestedPerTree,
					type: treeType,
				})
				.eq("id", id);

			if (error) {
				return res.status(500).json({ error: error.message });
			}
		}

		// If the project type is 'Energy', update the 'energy_projects' table
		if (projectType === "Energy" && data) {
			const { data, error } = await supabase
				.from("energy_projects")
				.update({
					funds_requested: fundsRequested,
					energy_production_target: energyProductionTarget,
					num_of_arrays: numOfArrays,
					system_size_in_kw: installedSystemSize,
					system_capacity: photovoltaicCapacity,
					labour_cost: estimatedInstallationCost,
					estimated_system_cost: estimatedSystemCost,
					maintenance_cost: estimatedMaintenanceCost,
					type: energyType,
					installation_team: installationTeam,
					connect_with_solar_partner: connectWithSolarPartner,
				})
				.eq("id", id);

			if (error) {
				return res.status(500).json({ error: error.message });
			}
		}

		return res.status(200).json({ message: "Project updated successfully" });
	}

	// If the method is not PUT
	return res.status(405).json({ message: "Method not allowed" });
}
