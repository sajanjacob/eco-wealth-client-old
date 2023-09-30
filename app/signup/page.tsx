"use client";
import React, { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
				emailRedirectTo: `${location.origin}/auth/callback`,
			},
		})) as { error: any; data: any };
		if (error) {
			console.error("Error signing up:", error.message);
		} else if (userData) {
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

	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<h1
				onClick={handleReturnHome}
				className='mb-2 text-6xl text-green-700 cursor-pointer transition-colors hover:text-green-600'
			>
				Eco Wealth
			</h1>
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
					className='px-2 py-2 rounded-lg bg-green-700 text-white cursor-pointer hover:bg-green-600 transition-all hover:scale-105'
					type='submit'
				>
					Sign up with Email
				</button>
			</form>
		</div>
	);
};

export default SignUp;
