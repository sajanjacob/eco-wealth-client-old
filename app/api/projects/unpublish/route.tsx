import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function PATCH(req: NextRequest, res: NextResponse) {
	const { projectId } = await req.json();
	console.log("projectId >>> ", projectId);
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { data: project, error } = await supabase
		.from("projects")
		.update({ status: "approved" })
		.eq("id", projectId)
		.single();
	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ data: project }, { status: 200 });
}
