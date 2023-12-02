import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, res: NextResponse) {
	const { status, projectId } = await req.json();
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	if (status === "published")
		return NextResponse.json({
			message: "Project is already public!",
		});
	const { data: project, error: projectError } = await supabase
		.from("projects")
		.select("*")
		.eq("id", projectId)
		.single();

	if (projectError) {
		return NextResponse.json({ error: projectError.message }, { status: 500 });
	}
	if (project && project.is_verified === true) {
		// Update the project in the 'projects' table

		const { data, error } = await supabase
			.from("projects")
			.update({ status: "published" })
			.eq("id", projectId);
		if (error) {
			// Handle the error appropriately
			return NextResponse.json({ message: error.message }, { status: 500 });
		} else {
			// Show a success message or refresh the data on the page
			return NextResponse.json(
				{ message: "Project published successfully" },
				{ status: 200 }
			);
		}
	}
	return NextResponse.json({
		message: "Unable to publish. Project is not verified yet.",
	});
}
