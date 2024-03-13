import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import moment from "moment";
interface DataObject {
	id: string;
	created_at: string;
	name: string;
	email: string;
	email_verified: boolean;
	phone_number: string;
	machines: object[];
	add_ons: object[];
	referrer_ids: string[];
	referrer_info: string;
	referral_source: string;
	status: string;
}
export async function POST(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
	const { refId } = await req.json();
	if (!refId)
		return NextResponse.json(
			{ error: "No referral id was provided, please provide a referral id." },
			{ status: 500 }
		);
	const { data, error } = await supabase.from("enagic_orders").select("*");

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	function findObjectsByreferrerIds(
		data: DataObject[],
		referrerIds: string
	): DataObject[] {
		return data.filter((obj) => obj.referrer_ids.includes(referrerIds));
	}
	const modifiedData = findObjectsByreferrerIds(data, refId);
	return NextResponse.json(modifiedData, { status: 200 });
}
