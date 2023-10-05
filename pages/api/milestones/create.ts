// pages/api/createMilestone.js

import { v4 as uuidv4 } from "uuid";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import convertToCamelCase from "@/utils/convertToCamelCase";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export default async function createMilestone(req: any, res: any) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	if (req.method === "POST") {
		const { projectId, title, shortDescription, body } = req.body;

		const { data, error } = await supabase
			.from("project_milestones")
			.insert([
				{
					id: uuidv4(),
					project_id: projectId,
					title: title,
					short_description: shortDescription,
					body: DOMPurify.sanitize(body),
				},
			])
			.select();

		if (error) return res.status(500).json({ error: error.message });
		return res.status(200).json(convertToCamelCase(data));
	} else {
		res.setHeader("Allow", "POST");
		res.status(405).end("Method Not Allowed");
	}
}
