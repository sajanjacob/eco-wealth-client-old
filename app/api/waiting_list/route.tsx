import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { name, email } = await req.json();

	const { error } = await supabase
		.from("waiting_list")
		.insert([
			{
				name,
				email,
			},
		])
		.select();

	if (error) {
		return NextResponse.json({ message: error.message }, { status: 501 });
	}
	return NextResponse.json({ message: "success" }, { status: 200 });
	// TODO: Send email
	// TODO: Add to mailing list
}
