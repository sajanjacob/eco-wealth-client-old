import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const { projectId } = await req.json();
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	// Check project ID
	if (!projectId)
		return NextResponse.json(
			{ error: "Project ID is required" },
			{ status: 400 }
		);
	// Fetch project
	const { data, error } = await supabase
		.from("projects")
		.select(
			"*, tree_projects(*), energy_projects(*), project_financials(*), tree_investments(*), energy_investments(*), solar_projects(*)"
		)
		.eq("id", projectId)
		.single();
	// Handle errors
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	if (!data)
		return NextResponse.json({ error: "Project not found" }, { status: 404 });
	// Return project data
	return NextResponse.json({ data });
}
