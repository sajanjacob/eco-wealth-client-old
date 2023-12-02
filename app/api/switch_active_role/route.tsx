import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { activeRole, userId } = await req.json();

	if (!userId) {
		NextResponse.json({ message: "User ID is required" });
		return;
	}

	const { data, error } = await supabase
		.from("users")
		.update({ active_role: activeRole })
		.eq("id", userId);

	if (error) {
		console.error("Error fetching active role:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{ message: "User's active role updated successfully." ?? null },
		{ status: 200 }
	);
}
