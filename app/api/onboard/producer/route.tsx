import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: any) {
	const cookieStore = cookies();
	const supabase = createRouteHandlerClient<any>({
		cookies: () => cookieStore,
	});
	const { producerData, userId, producerId } = await req.json();
	const {
		producer_id,
		goals,
		operation_type,
		current_operations,
		property_zone_map,
		address,
	} = producerData;
	const { data: onboardingData, error: onboardingError } = await supabase
		.from("producer_onboarding")
		.insert([
			{
				producer_id,
				goals,
				operation_type,
				current_operations,
				property_zone_map,
				address,
			},
		])
		.select();

	if (onboardingError) {
		console.error(
			"Error inserting producer onboarding:",
			onboardingError.message
		);
		return NextResponse.json(
			{ error: onboardingError.message },
			{ status: 500 }
		);
	}
	if (onboardingData) {
		const { data: producerData, error: producerError } = await supabase
			.from("producers")
			.update({
				onboarding_complete: true,
				onboarding_id: onboardingData[0]?.id,
			})
			.eq("user_id", userId);
		if (producerError) {
			console.error(
				"Error updating producer onboarding status:",
				producerError
			);
			return NextResponse.json(
				{ error: producerError.message },
				{ status: 500 }
			);
		}
		await axios
			.post(`/api/properties`, {
				producerId,
				address,
			})
			.then((res) => {
				console.log("Property created: ", res.data);

				return NextResponse.json(
					{ message: "Producer onboarding complete." },
					{ status: 200 }
				);
			})
			.catch((err) => {
				console.log("Error creating property: ", err);
				return NextResponse.json({ error: err.message }, { status: 500 });
			});
	}
}
