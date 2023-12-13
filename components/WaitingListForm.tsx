"use client";
import React, { ReactHTML, useState } from "react";
import { isEmailValid } from "@/utils/isEmailValid";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BiLock } from "react-icons/bi";

function WaitingListForm() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");

	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isEmailValid(email)) {
			setEmailError("Invalid email address");
			return;
		}
		setEmailError("");

		// TODO: Integrate with Supabase here
		axios
			.post("/api/waiting_list", { name, email })
			.then((res) => {
				router.push(`/thank-you-for-registering?name=${name}&email=${email}`);
			})
			.catch((err) => {
				console.log("/api/waiting_list >> err", err);
			});
	};
	const handleReturnHome = () => {
		router.push("/");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col items-center justify-center min-h-screen'
		>
			<h1
				onClick={handleReturnHome}
				className='mb-2 text-4xl bold lg:text-6xl text-[var(--cta-one)] cursor-pointer transition-colors hover:text-[var(--cta-one-hover)]'
			>
				Eco Wealth
			</h1>
			<h2 className='mb-12 lg:text-xl text-gray-400 text-center'>
				Be the first to know when Eco Wealth launches!
			</h2>
			<div className='flex flex-col mb-4'>
				<label className='mb-2'>Name:</label>
				<input
					type='text'
					value={name}
					className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className='flex flex-col mb-4'>
				<label className='mb-2'>Email:</label>
				<input
					type='email'
					value={email}
					className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
					onChange={(e) => setEmail(e.target.value)}
				/>
				{emailError && <p style={{ color: "red" }}>{emailError}</p>}
			</div>
			<button
				className='w-[300px] mt-8 px-4 py-2 rounded-lg bg-[var(--cta-one)] text-white cursor-pointer hover:bg-[var(--cta-one-hover)] transition-all hover:scale-105'
				type='submit'
			>
				Join waiting list
			</button>
			<div className='w-[300px] mt-4'>
				<p className='text-xs mt-2 text-gray-500'>
					<BiLock className='inline text-base' /> We promise to keep your
					information confidential and only use it for notifying you of news &
					updates regarding Eco Wealth, and inviting you to test the platform
					when opportunities arise.
				</p>

				<p className='text-xs mt-2 text-gray-500'>
					Note: We anonymously share statistics publicly which will include your
					registration as part of the data.
				</p>
			</div>
		</form>
	);
}

export default WaitingListForm;
