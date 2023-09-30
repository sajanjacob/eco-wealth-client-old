import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server'

const supabase = createRouteHandlerClient({
	cookies,
});
export async function POST(req: any) {
	
	try {
		const { projectData, producerId } = req.body;

		console.log("projectData >>> ", projectData);
		console.log("producerId >>> ", producerId);

		// Here we check if there is a title, project type, project contact details, agreement accepted, and
		// address of operation
		if (!projectData.title || projectData.title === "") {
			return NextResponse.json({ error: "Project title is required." }, { status: 400 });
		}
		if (!projectData.projectType || projectData.projectType === "") {
			return NextResponse.json({ error: "Project type is required." }, { status: 401 });
		}
		if (
			!projectData.projectCoordinatorContact.name ||
			projectData.projectCoordinatorContact.name === ""
		) {
			return NextResponse
				
				.json({ error: "Project contact name is required." }, { status: 402 });
		}
		if (
			!projectData.projectCoordinatorContact.phone ||
			projectData.projectCoordinatorContact.phone === ""
		) {
			return NextResponse
				
				.json({ error: "Project contact phone number is required." }, { status: 403 });
		}
		if (!projectData.agreementAccepted) {
			return NextResponse.json({
				error: "Agreement to project terms is required to submit a project.",
			}, { status: 404 });
		}
		if (!projectData.propertyAddressId) {
			return NextResponse
				
				.json({ error: "Project address of operation is required." }, { status: 405 });
		}
		let totalFundsRequested = 0;
		if (projectData.isNonProfit) {
			if (projectData.projectType === "Tree") {
				totalFundsRequested =
					projectData.seedCost +
					projectData.labourCost +
					projectData.maintenanceCostPerYear;
			}
			if (
				projectData.projectType === "Energy" &&
				projectData.energyProjectType === "Solar"
			) {
				totalFundsRequested =
					projectData.systemCost +
					projectData.materialCost +
					projectData.labourCost +
					projectData.maintenanceCostPerYear;
			}
		} else {
			totalFundsRequested = projectData.totalFundsRequested;
		}
		// TODO: create function to add project_id to verified_projects table on entry
		// Insert into projects table
		const { data: project, error } = await supabase
			.from("projects")
			.insert([
				{
					title: projectData.title,
					image_url: projectData.imageUrl,
					project_coordinator_contact: projectData.projectCoordinatorContact,
					description: projectData.description,
					producer_id: producerId,
					status: "pending_verification",
					type: projectData.projectType,
					agreement_accepted: projectData.agreementAccepted,
					total_area_sqkm: projectData.totalArea,
					property_address_id: projectData.propertyAddressId,
					funds_requested: totalFundsRequested,
					is_non_profit: projectData.isNonProfit,
					est_revenue: projectData.estimatedRevenue,
					est_roi_percentage: projectData.estimatedRoiPercentage,
				},
			])
			.select();

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		console.log("project >>> ", project);
		// Insert into tree_projects table if project type is Tree
		if (projectData.projectType === "Tree" && project) {
			const fundsRequestedPerTree =
				projectData.totalFundsRequested / projectData.treeTarget;

			const { error } = await supabase.from("tree_projects").insert([
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
			if (error) {
				return NextResponse.json({ error: error.message }, { status: 501 } );
			}
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
			if (error) {
				return NextResponse.json({ error: error.message }, { status: 502 });
			}
			if (projectData.energyProjectType === "Solar" && data) {
				const { error } = await supabase.from("solar_projects").insert([
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
				if (error) {
					return NextResponse.json({ error: error.message }, { status: 503 });
				}
			}
		}

		// Send response
		NextResponse.json({ message: "Project created successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error creating project:", error);
		NextResponse
			
			.json({ error: "An error occurred while creating the project" }, { status: 504 });
	}
}


export async function GET(req: any, res: any) {
		const projectType = req.query.type;
		const nonProfit = req.query.nonProfit === "true"; // convert string to boolean

		console.log("projectType >>> ", projectType);
		console.log("nonProfit >>> ", nonProfit);
		if (!projectType) {
			return NextResponse.json({ error: "Missing projectType" }, { status: 400 });
		}
		if (typeof nonProfit !== "boolean") {
			return NextResponse.json({ error: "Missing nonProfit" }, { status: 401 });
		}
		let query;

		query = supabase
			.from("projects")
			.select(
				"*, project_milestones(*), tree_projects(*), energy_projects(*), solar_projects(*)"
			)
			.eq("status", "published")
			.eq("is_verified", true)
			.eq("is_deleted", false);
		if (
			projectType === "Restoration" ||
			projectType === "Timber / Lumber" ||
			projectType === "Fruit" ||
			projectType === "Nut" ||
			projectType === "Bio Fuel" ||
			projectType === "Pulp" ||
			projectType === "Syrup" ||
			projectType === "Oil / Chemical"
		) {
			query = supabase
				.from("projects")
				.select("*, project_milestones(*), tree_projects!inner(*)")
				.eq("status", "published")
				.eq("is_verified", true)
				.eq("is_deleted", false)
				.eq("tree_projects.type", projectType);
		} else if (
			projectType === "Solar"
			// ||
			// projectType === "Wind" ||
			// projectType === "Hydro" ||
			// projectType === "Geothermal" ||
			// projectType === "Nuclear" ||
			// projectType === "Biomass" ||
		) {
			query = supabase
				.from("projects")
				.select(
					"*, project_milestones(*), energy_projects!inner(*), solar_projects(*)"
				)
				.eq("status", "published")
				.eq("is_verified", true)
				.eq("is_deleted", false)
				.eq("energy_projects.type", projectType);
		}

		// Check if nonProfit is true, if so, add a filter on is_non_profit
		if (nonProfit) {
			query = query.eq("is_non_profit", true);
		}

		let { data, error } = await query;
		console.log("data >>> ", data);
		console.log("error >>> ", error);
		if (error) {
			NextResponse.json({ message: error.message }, { status: 403 });
		} else {
			NextResponse.json(data, { status: 200 });
		}
	} 
