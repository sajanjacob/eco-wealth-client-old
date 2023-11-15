import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	let { data, error } = await supabase
		.from("waiting_list")
		.select("name, created_at")
		.order("created_at", { ascending: false })
		.limit(5);

	if (error) {
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	return NextResponse.json(data, { status: 200 });
}
