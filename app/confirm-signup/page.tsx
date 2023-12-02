"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

type Props = {};

export default function ConfirmSignup({}: Props) {
	const searchParams = useSearchParams();
	const confirmation_url = searchParams?.get("confirmation_url");
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			Click or tap the button below to confirm your email address.
			<Link
				href={`${confirmation_url}`}
				className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'
			>
				Confirm Email
			</Link>
		</div>
	);
}
