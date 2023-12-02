"use client";
import React from "react";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const ThankYou = () => {
	const params = useSearchParams();
	const email = params?.get("email");
	const router = useRouter();
	function handleReturnHome() {
		router.push("/");
	}
	function handleGoToLogin() {
		router.push("/login");
	}
	return (
		<div className='flex flex-col items-center justify-center min-h-screen px-12'>
			<Image
				src='/white_logo_transparent_background.png'
				width={300}
				height={300}
				alt='Eco Wealth Logo'
				onClick={handleReturnHome}
				className='cursor-pointer'
			/>
			<h1 className='mb-2 text-3xl font-bold'>
				Thank you for creating an account!
			</h1>
			<p>
				Please check your email at <strong>{email}</strong> to verify your
				account.
			</p>
			<button
				onClick={handleGoToLogin}
				className='mt-4 cursor-pointer p-2 rounded bg-[var(--cta-one)] text-white font-bold transition-all hover:bg-[var(--cta-one-hover)] hover:scale-105'
			>
				Return to login
			</button>
		</div>
	);
};

export default ThankYou;
