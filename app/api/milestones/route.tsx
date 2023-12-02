import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import convertToCamelCase from "@/utils/convertToCamelCase";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
export async function POST(req: NextRequest, res: NextResponse) {
	const { projectId, title, shortDescription, body } = await req.json();
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { data, error } = await supabase
		.from("project_milestones")
		.insert([
			{
				project_id: projectId,
				title: title,
				short_description: shortDescription,
				body: DOMPurify.sanitize(body),
			},
		])
		.select();

	if (error)
		return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ data: convertToCamelCase(data) }, { status: 200 });
}

export async function PUT(req: NextRequest, res: NextResponse) {
	const { milestoneId, title, shortDescription, body } = await req.json();
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { data, error } = await supabase
		.from("project_milestones")
		.update({
			title: title,
			short_description: shortDescription,
			body: DOMPurify.sanitize(body),
		})
		.eq("id", milestoneId)
		.select();

	if (error) return NextResponse.json({ error: error.message });
	return NextResponse.json(convertToCamelCase(data));
}

export async function DELETE(req: NextRequest, res: NextResponse) {
	const { milestoneId } = await req.json();
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { data, error } = await supabase
		.from("project_milestones")
		.update({
			is_deleted: true,
			deleted_at: new Date(),
		})
		.eq("id", milestoneId)
		.select();

	if (error) return NextResponse.json({ error: error.message });
	return NextResponse.json(convertToCamelCase(data));
}
