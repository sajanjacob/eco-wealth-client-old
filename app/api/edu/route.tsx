import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	// Get category from the request query
	try {
		const category = req?.nextUrl?.searchParams.get("category");
		console.log("category >>> ", category);
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
			const filteredData = data.filter((d) => d.category === category);
			console.log("category >> ", category);
			if (filteredData.length === 0) {
				console.log("returning data with a category >> ", filteredData.length);
				return NextResponse.json(
					{ error: "No lessons under that category found" },
					{ status: 404 }
				);
			}
			return NextResponse.json(filteredData, { status: 200 });
		} else {
			console.log("returning data without a category >> ", data);

			return NextResponse.json(data, { status: 200 });
		}
	} catch (error) {
		// Handle JSON parsing errors
		console.error("Error parsing JSON from request:", error);
		return NextResponse.json(
			{ error: "Invalid JSON payload" },
			{ status: 400 }
		);
	}
}
