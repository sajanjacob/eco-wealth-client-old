import supabase from "@/utils/supabaseClient";

export default async function handler(req: any, res: any) {
	if (req.method === "GET") {
		const projectType = req.query.type;
		const nonProfit = req.query.nonProfit === "true"; // convert string to boolean

		console.log("projectType >>> ", projectType);
		console.log("nonProfit >>> ", nonProfit);
		if (!projectType) {
			return res.status(400).json({ error: "Missing projectType" });
		}
		if (typeof nonProfit !== "boolean") {
			return res.status(400).json({ error: "Missing nonProfit" });
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
			res.status(400).json({ message: error.message });
		} else {
			res.status(200).json(data);
		}
	} else {
		res.status(405).send("Method not allowed");
	}
}
