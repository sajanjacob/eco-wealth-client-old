import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { data, count, error } = await supabase
		.from("waiting_list")
		.select("*", { count: "exact" });
	if (error) {
		console.error("Error fetching count:", error);
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	console.log("waiting list data >>> ", count);
	if (count) return NextResponse.json({ count }, { status: 200 });
}
