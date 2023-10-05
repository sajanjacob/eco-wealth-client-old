import { NextApiRequest, NextApiResponse } from "next";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
type EduCardData = {
	id: string;
	title: string;
	url: string;
	imgUrl: string;
	shortDescription: string;
	category: string;
} & null;
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const supabase = createRouteHandlerClient<any>({ cookies });
	// Get category from the request query
	const category = req.query.category as string;
	const data = [
		{
			id: "1",
			title: "Save Soil",
			url: "https://savesoil.org",
			imgUrl:
				"https://th.bing.com/th/id/OIP.-O9IU5ZE0lwD_FKUhYr07wHaEo?pid=ImgDet&rs=1",
			shortDescription: "Official website of the Save Soil initiative.",
			category: "Environmental Science",
			role: "all",
		},
		{
			id: "2",
			title: "Investopedia Financial Dictionary",
			url: "https://www.investopedia.com/financial-term-dictionary-4769738",

			imgUrl:
				"https://www.investopedia.com/thmb/Y8G3oep1ipc-S-b7QbJos8DK9W4=/1000x1000/filters:fill(auto,1)/socialfallback-5c01877846e0fb00015416ff.png",
			shortDescription: "A financial dictionary from Investopedia.",
			category: "Investing",
			role: "investor",
		},
	];
	// Fetch data from Supabase
	// let { data, error } = category
	// 	? await supabase.from("education").select("*").eq("category", category)
	// 	: await supabase.from("education").select("*");

	// if (error) return res.status(500).json({ error: error.message });
	if (category !== "all") {
		console.log("returning data with a category", category);
		const filteredData = data.filter((d) => d.category === category);
		return res.status(200).json(filteredData);
	} else {
		console.log("returning data without a category");
		return res.status(200).json(data);
	}
}
