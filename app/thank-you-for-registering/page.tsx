"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

type Props = {};

export default function ThankYouForRegistering({}: Props) {
	const params = useSearchParams();
	const router = useRouter();
	function handleReturnHome() {
		router.push("/");
	}
	// TODO: add a route to try resending the confirmation email
	// TODO: add a update email field and route

	return (
		<div className='flex flex-col w-5/6 mx-auto justify-center min-h-screen  '>
			<div className='border-2 border-green-950 rounded-xl p-8'>
				<Image
					src='/white_logo_transparent_background.png'
					width={300}
					height={300}
					alt='Eco Wealth Logo'
					onClick={handleReturnHome}
					className='cursor-pointer mb-4'
				/>
				<h1 className='text-gray-500 text-lg font-bold mb-2'>
					Thank you for registering
					{params
						? `, ${params
								?.get("name")
								?.substring(0, params?.get("name")?.indexOf(" "))}! 🎉`
						: "! 🎉"}
				</h1>
				<h1 className='text-5xl font-bold mb-4'>
					Please confirm your registration.
				</h1>
				<p className='text-lg font-semibold text-gray-400'>
					An email with confirmation instructions was sent to your email
					address.
				</p>
			</div>
		</div>
	);
}
