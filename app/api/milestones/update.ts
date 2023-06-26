// pages/api/updateMilestone.js

import convertToCamelCase from "@/utils/convertToCamelCase";
import supabase from "@/utils/supabaseClient";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export default async function updateMilestone(req: any, res: any) {
	if (req.method === "PUT") {
		const { milestoneId, title, shortDescription, body } = req.body;

		const { data, error } = await supabase
			.from("project_milestones")
			.update({
				title: title,
				short_description: shortDescription,
				body: DOMPurify.sanitize(body),
			})
			.eq("id", milestoneId)
			.select();

		if (error) return res.status(500).json({ error: error.message });
		return res.status(200).json(convertToCamelCase(data));
	} else {
		res.setHeader("Allow", "PUT");
		res.status(405).end("Method Not Allowed");
	}
}
