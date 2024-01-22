"use client";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

export default function Feedback({}: Props) {
	const router = useRouter();
	useEffect(() => {
		router.push(
			"https://docs.google.com/forms/d/e/1FAIpQLSd2MoR4nEC168PcXcO8GRhmEKyVAJcX2UOjM64E6vrCgzCmtw/viewform?usp=sf_link"
		);
	}, [router]);
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<Logo />
			<p className='mt-[4px]'>Redirecting you to a Google Form...</p>
		</div>
	);
}
