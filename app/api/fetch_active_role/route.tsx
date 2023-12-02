import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	const userId = req.nextUrl.searchParams.get("userId");
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	if (!userId) {
		return NextResponse.json(
			{ message: "User ID is required" },
			{ status: 400 }
		);
	}

	const { data, error } = await supabase
		.from("users")
		.select("active_role")
		.eq("id", userId)
		.single();

	if (error) {
		console.error("Error fetching active role:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{ active_role: data?.active_role ?? null },
		{ status: 200 }
	);
}
