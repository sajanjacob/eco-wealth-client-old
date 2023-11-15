"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
type Props = {};

export default function ThankYouForRegistering({}: Props) {
	const params = useSearchParams();
	console.log("params >>> ", params);
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<h1 className='text-3xl font-bold mb-4'>
				Thank you for registering for the waiting list
				{params
					? `, ${params
							?.get("name")
							?.substring(0, params?.get("name")?.indexOf(" "))}! 🎉`
					: "! 🎉"}
			</h1>
			<p>We will send you an email with more details around the launch soon.</p>
		</div>
	);
}
