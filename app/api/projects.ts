import supabase from "@/utils/supabaseClient";

export default async function handler(req: any, res: any) {
	if (req.method === "GET") {
		const projectType = req.query.type;
		if (projectType === "All") {
			let { data, error } = await supabase
				.from("projects")
				.select("*")
				.eq("status", "verified_published");
			if (error) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(200).json(data);
			}
		} else {
			let { data, error } = await supabase
				.from("projects")
				.select("*")
				.eq("status", "verified_published")
				.eq("type", projectType);
			if (error) {
				res.status(400).json({ error: error.message });
			} else {
				res.status(200).json(data);
			}
		}
	} else {
		res.status(405).send("Method not allowed");
	}
}
