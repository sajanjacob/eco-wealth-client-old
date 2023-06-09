"use client";
import React from "react";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";

const ThankYou = () => {
	const params = useSearchParams();
	const email = params.get("email");

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-green-950'>
			<h1 className='mb-8'>Thank you for creating an account!</h1>
			<p>
				Please check your email at <strong>{email}</strong> to verify your
				account.
			</p>
		</div>
	);
};

export default ThankYou;
