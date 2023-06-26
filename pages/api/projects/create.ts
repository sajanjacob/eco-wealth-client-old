import supabase from "@/utils/supabaseClient"; // Adjust the import to your Supabase client setup
import { v4 as uuidv4 } from "uuid";

export default async function createProject(req: any, res: any) {
	if (req.method === "POST") {
		try {
			const projectData = req.body;

			// Insert into projects table
			const { data: project } = await supabase
				.from("projects")
				.insert([
					{
						id: uuidv4(),
						title: projectData.title,
						image_url: projectData.imageUrl,
						project_coordinator_contact: projectData.projectCoordinatorContact,
						description: projectData.description,
						producer_id: projectData.producerId,
						status: projectData.status,
						type: projectData.projectType,
						project_verification_consent_given:
							projectData.projectVerificationConsentGiven,
						admin_fee_consent: projectData.adminFeeConsent,
						agreed_to_pay_investor: projectData.agreedToPayInvestor,
						total_area_sqkm: projectData.totalArea,
						property_address_id: projectData.propertyAddressId,
					},
				])
				.select();

			// Insert into tree_projects table if project type is Tree
			if (projectData.projectType === "Tree" && project) {
				await supabase.from("tree_projects").insert([
					{
						id: uuidv4(),
						project_id: project?.[0].id,
						tree_target: projectData.treeTarget,
						funds_requested_per_tree: projectData.fundsRequestedPerTree,
						type: projectData.treeProjectType,
						tree_count: 0,
					},
				]);
			}

			// Insert into energy_projects table if project type is Energy
			if (projectData.projectType === "Energy" && project) {
				await supabase.from("energy_projects").insert([
					{
						id: uuidv4(),
						project_id: project?.[0].id,
						funds_requested: projectData.totalFundsRequested,
						energy_production_target: projectData.energyProductionTarget,
						num_of_arrays: projectData.targetArrays,
						system_size_in_kw: projectData.systemSize,
						system_capacity: projectData.systemCapacity,
						labour_cost: projectData.labourCost,
						estimated_system_cost: projectData.systemCost,
						maintenance_cost: projectData.maintenanceCost,
						type: projectData.energyProjectType,
						installation_team: projectData.installerType,
						connect_with_solar_partner: projectData.connectWithSolarPartner,
					},
				]);
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
