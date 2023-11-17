"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { FaHandshake } from "react-icons/fa";
import Logo from "@/components/Logo";

type Props = {};

export default function ThankYouForRegistering({}: Props) {
	const params = useSearchParams();
	return (
		<div className='flex flex-col items-center  min-h-screen p-8'>
			<Logo
				width={200}
				height={200}
			/>
			<FaHandshake className='text-[208px] text-green-500 mt-8' />
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
