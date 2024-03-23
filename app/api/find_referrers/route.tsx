import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import validate from "uuid-validate";
import validator from "validator";

export async function POST(req: NextRequest) {
	const SUPABASE_URL = process.env.supabase_public_url;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.supabase_service_role_key;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
	const { searchTerm } = await req.json();

	// Fetch all referral ambassadors and their associated users
	const { data, error } = await supabase
		.from("referral_ambassadors")
		.select(
			"contact_email, id, status, user_id, created_at, users(id, name, created_at)"
		);

	if (error) {
		console.log("error >>> ", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// Ensure ambassador.users is treated as an array
	const ensureArray = (possibleArray: any[]) =>
		Array.isArray(possibleArray) ? possibleArray : [];

	// Filter function
	const filteredData = data.filter((ambassador: any) => {
		const searchTermIsUUID = validate(searchTerm, 4); // Validate the UUID
		const searchTermIsEmail = validator.isEmail(searchTerm); // Validate the email

		if (searchTermIsUUID) {
			console.log("searchTerm is UUID");
			return ambassador.id === searchTerm;
		} else if (searchTermIsEmail) {
			console.log("searchTerm is email");

			return ambassador.contact_email.includes(searchTerm);
		} else {
			console.log(
				"searchTerm is neither UUID nor email",
				searchTerm,
				ambassador.users.name
					.toLowerCase()
					.trim()
					.includes(searchTerm.toLowerCase().trim())
			);

			// For non-UUID or email searchTerms, directly check the user object
			return ambassador.users.name
				.toLowerCase()
				.trim()
				.includes(searchTerm.toLowerCase().trim());
		}
	});

	console.log("filteredData >>> ", filteredData);

	// Return filtered data
	return NextResponse.json({ referrers: filteredData }, { status: 200 });
}
