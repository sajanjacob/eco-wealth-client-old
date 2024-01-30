import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, res: NextResponse) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

	// Function to check if an email contains 'test' or 'Test' in the alias
	const isTestEmail = (email: string) => {
		const localPart = email.split("@")[0];
		return localPart.includes("+test") || localPart.includes("+Test");
	};

	// Function to check if the last name contains 'Test-'
	const hasTestLastName = (name: string) => {
		return name && name.split(" ").some((part) => part.startsWith("Test-"));
	};

	try {
		// Fetch users from the "users" table
		const { data: usersData, error: usersError } = await supabase
			.from("users")
			.select("name, email, created_at")
			.eq("is_verified", true)
			.order("created_at", { ascending: false })
			.limit(5);

		// Fetch users from the "waiting_list" table
		const { data: waitingListData, error: waitingListError } = await supabase
			.from("waiting_list")
			.select("name, email, created_at")
			.eq("email_verified", true)
			.order("created_at", { ascending: false })
			.limit(5);

		if (usersError || waitingListError) {
			throw new Error(usersError?.message || waitingListError?.message);
		}

		// Combine, filter, and sort the data
		const combinedData = [...usersData, ...waitingListData]
			.filter((user) => !isTestEmail(user.email) && !hasTestLastName(user.name))
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			)
			.slice(0, 5);

		return NextResponse.json(combinedData, { status: 200 });
	} catch (error) {
		console.error("Error fetching data:", error);
		return NextResponse.json(
			{ message: (error as Error).message },
			{ status: 501 }
		);
	}
}
