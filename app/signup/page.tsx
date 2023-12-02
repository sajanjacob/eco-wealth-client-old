"use client";
import React, { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BASE_URL } from "@/constants";
import Image from "next/image";
interface SignUpForm {
	email: string;
	password: string;
	confirmPassword: string;
}

const SignUp: React.FC = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordMatch, setPasswordMatch] = useState(false);
	const supabase = createClientComponentClient();
	// TODO: Add password strength meter
	// TODO: Add password requirements
	// TODO: Add password reset

	async function handleEmailSignUp(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const target = event.target as typeof event.target & SignUpForm;

		if (password !== confirmPassword) {
			alert("Passwords do not match. Please try again.");
			return;
		}

		let { error, data: userData } = (await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${BASE_URL}/auth/callback`,
			},
		})) as { error: any; data: any };
		if (error) {
			console.error("Error signing up:", error.message);
		} else if (userData) {
			console.log("new account user data >>> ", userData);
			router.push(`/thankyou?email=${email}`);
		}
	}

	const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};
	const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
	};
	const handleConfirmInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(e.target.value);
	};
	useEffect(() => {
		if (password && confirmPassword && password !== confirmPassword) {
			setPasswordMatch(false);
		} else {
			setPasswordMatch(true);
		}
	}, [password, confirmPassword]);

	const handleReturnHome = () => {
		router.push("/");
	};
	const handleGoToLogin = () => {
		router.push("/login");
	};
	if (BASE_URL === "https://ecowealth.app") return;
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
			<h2 className='mb-12 text-xl text-gray-400'>Create an Account</h2>
			<form
				className='flex flex-col space-y-4'
				onSubmit={handleEmailSignUp}
			>
				<input
					className='px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
					type='email'
					name='email'
					placeholder='Email'
					value={email}
					onChange={handleEmailInput}
					required
				/>
				<input
					className='px-2 py-2 rounded-lg border border-gray-300 text-black'
					type='password'
					name='password'
					placeholder='Password'
					value={password}
					onChange={handlePasswordInput}
					required
				/>
				{password && (
					<input
						className='px-2 py-2 rounded-lg border border-gray-300 text-black'
						type='password'
						name='confirmPassword'
						placeholder='Confirm Password'
						value={confirmPassword}
						onChange={handleConfirmInput}
						required
					/>
				)}
				{!passwordMatch && (
					<p className='text-red-500'>Passwords do not match.</p>
				)}
				<button
					className='px-2 py-2 rounded-lg bg-[var(--cta-one)] text-white cursor-pointer hover:bg-[var(--cta-one-hover)] transition-all hover:scale-105'
					type='submit'
				>
					Sign up with Email
				</button>
			</form>
			<p className='text-gray-500 dark:text-gray-400 mt-4 text-sm'>
				Have an account already?{" "}
				<span
					className='text-[var(--cta-one)] cursor-pointer transition-colors hover:text-[var(--cta-two-hover)]'
					onClick={handleGoToLogin}
				>
					Login here.
				</span>
			</p>
		</div>
	);
};

export default SignUp;
