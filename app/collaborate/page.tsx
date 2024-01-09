"use client";
import Logo from "@/components/Logo";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

function Collaborate({}: Props) {
	const router = useRouter();
	useEffect(() => {
		router.push(
			"https://docs.google.com/forms/d/e/1FAIpQLSehoQbx5wAD44nUrl2cOciY1MBcR6vl8JixFExs5pErTmjQZg/viewform?usp=sf_link"
		);
	}, [router]);

	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<Logo />
			<p className='mt-[4px]'>Redirecting you to a Google Form...</p>
		</div>
	);
}
export default Collaborate;
