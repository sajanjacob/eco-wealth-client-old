import supabase from "@/utils/supabaseClient"; // Adjust the import to your Supabase client setup
import { v4 as uuidv4 } from "uuid";

export default async function createProject(req: any, res: any) {
	if (req.method === "POST") {
		try {
			const projectData = req.body;
			const producerId = req.body;
			let fundsRequested = 0;
			if (projectData.projectType === "Energy") {
				fundsRequested = projectData.totalFundsRequested;
			} else if (projectData.projectType === "Tree") {
				fundsRequested =
					projectData.treeTarget * projectData.fundsRequestedPerTree;
			}

			// Insert into projects table
			const { data: project } = await supabase
				.from("projects")
				.insert([
					{
						title: projectData.title,
						image_url: projectData.imageUrl,
						project_coordinator_contact: projectData.projectCoordinatorContact,
						description: projectData.description,
						producer_id: projectData.producerId,
						status: projectData.status,
						type: projectData.projectType,
						agreement_accepted: projectData.agreementAccepted,
						total_area_sqkm: projectData.totalArea,
						property_address_id: projectData.propertyAddressId,
						requested_amount_total: fundsRequested,
					},
				])
				.select();

			// Insert into tree_projects table if project type is Tree
			if (projectData.projectType === "Tree" && project) {
				await supabase.from("tree_projects").insert([
					{
						project_id: project?.[0].id,
						tree_target: projectData.treeTarget,
						funds_requested_per_tree: projectData.fundsRequestedPerTree,
						type: projectData.treeProjectType,
						tree_count: 0,
						producer_id: producerId,
					},
				]);
			}

			// Insert into energy_projects table if project type is Energy
			if (projectData.projectType === "Energy" && project) {
				const { data, error } = await supabase
					.from("energy_projects")
					.insert([
						{
							project_id: project?.[0].id,
							energy_production_target: projectData.energyProductionTarget,
							type: projectData.energyProjectType,
							installation_team: projectData.installerType,
							producer_id: producerId,
						},
					])
					.select();

				if (projectData.energyProjectType === "Solar" && data) {
					await supabase.from("solar_projects").insert([
						{
							project_id: project?.[0].id,
							energy_project_id: (data as any).id,
							num_of_arrays: projectData.targetArrays,
							energy_production_target: projectData.energyProductionTarget,
							system_size_in_kw: projectData.systemSize,
							system_capacity: projectData.systemCapacity,
							location_type: projectData.locationType,
							estimated_labour_cost: projectData.labourCost,
							estimated_system_cost: projectData.systemCost,
							estimated_maintenance_cost: projectData.maintenanceCost,
							connect_with_solar_partner: projectData.connectWithSolarPartner,
							producer_id: producerId,
						},
					]);
				}
			}

			// Send response
			res.status(200).json({ message: "Project created successfully" });
		} catch (error) {
			console.error("Error creating project:", error);
			res
				.status(500)
				.json({ error: "An error occurred while creating the project" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
