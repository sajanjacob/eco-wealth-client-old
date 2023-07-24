import supabase from "@/utils/supabaseClient"; // Adjust the import to your Supabase client setup
import { v4 as uuidv4 } from "uuid";

export default async function createProject(req: any, res: any) {
	if (req.method === "POST") {
		try {
			const projectData = req.body;
			const producerId = req.body;

			// Here we check if there is a title, project type, project contact details, agreement accepted, and
			// address of operation
			if (!projectData.title || projectData.title === "") {
				return res.status(400).json({ error: "Project title is required." });
			}
			if (!projectData.projectType || projectData.projectType === "") {
				return res.status(400).json({ error: "Project type is required." });
			}
			if (
				!projectData.projectCoordinatorContact.name ||
				projectData.projectCoordinatorContact.name === ""
			) {
				return res
					.status(400)
					.json({ error: "Project contact name is required." });
			}
			if (
				!projectData.projectCoordinatorContact.phone ||
				projectData.projectCoordinatorContact.phone === ""
			) {
				return res
					.status(400)
					.json({ error: "Project contact phone number is required." });
			}
			if (!projectData.agreementAccepted) {
				return res.status(400).json({
					error: "Agreement to project terms is required to submit a project.",
				});
			}
			if (!projectData.propertyAddressId) {
				return res
					.status(400)
					.json({ error: "Project address of operation is required." });
			}

			// TODO: create function to add project_id to verified_projects table on entry
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
						status: "pending_verification",
						type: projectData.projectType,
						agreement_accepted: projectData.agreementAccepted,
						total_area_sqkm: projectData.totalArea,
						property_address_id: projectData.propertyAddressId,
						requested_amount_total: projectData.totalFundsRequested,
						is_non_profit: projectData.isNonProfit,
						est_revenue: projectData.estimatedRevenue,
						est_roi_percentage: projectData.estimatedRoiPercentage,
					},
				])
				.select();

			// Insert into tree_projects table if project type is Tree
			if (projectData.projectType === "Tree" && project) {
				const fundsRequestedPerTree =
					projectData.totalFundsRequested / projectData.treeTarget;

				await supabase.from("tree_projects").insert([
					{
						project_id: project?.[0].id,
						tree_target: projectData.treeTarget,
						funds_requested_per_tree: fundsRequestedPerTree,
						type: projectData.treeProjectType,
						tree_count: 0,
						producer_id: producerId,
						est_seed_cost: projectData.seedCost,
						est_labour_cost: projectData.labourCost,
						est_maintenance_cost_per_year: projectData.maintenanceCostPerYear,
						est_maturity_date: projectData.maturityDate,
					},
				]);
			}

			// Insert into energy_projects table if project type is Energy
			if (projectData.projectType === "Energy" && project) {
				// TODO: store installation team in a separate table and provide id to installer_id in solar_projects table

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

							system_size_in_kw: projectData.systemSize,
							system_capacity: projectData.systemCapacity,
							location_type: projectData.locationType,
							est_labour_cost: projectData.labourCost,
							est_system_cost: projectData.systemCost,
							est_maintenance_cost_per_year: projectData.maintenanceCostPerYear,
							connect_with_solar_partner: projectData.connectWithSolarPartner,
							producer_id: producerId,
							est_material_cost: projectData.materialCost,
							est_installation_date: projectData.installationDate,
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
