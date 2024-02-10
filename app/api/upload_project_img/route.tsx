import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { filePath, file } = await req.json();
	const { data, error } = await supabase.storage
		.from("projects")
		.upload(filePath, file);
	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
	return NextResponse.json(
		{ data, message: "File uploaded successfully" },
		{ status: 200 }
	);
}
