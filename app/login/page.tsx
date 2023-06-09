"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store"; // import your root state and dispatch types from your
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/features/userSlice";
import { toast } from "react-toastify";

export default function Login() {
	const user = useAppSelector((state: RootState) => state.user);
	const isLoggedIn = useAppSelector(
		(state: RootState) => state.user?.user?.loggedIn
	);
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const fetchUserData = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", userId)
				.single();
			if (error) {
				console.error("Error fetching user data:", error.message);

				return null;
			}
			dispatch(
				setUser({
					name: data[0]?.name,
					email: data[0]?.email,
					phone: data[0]?.phone_number,
					is_verified: data[0]?.is_verified,
					roles: data[0].roles ? data[0].roles : [],
					id: data[0]?.id,
					active_role: data[0]?.active_role,
					loggedIn: true,
				})
			); // Dispatch a redux action
		} catch (err) {
			console.error("Unexpected error fetching user data:", err);
			return null;
		}
	};

	const login = async (user: any) => {
		await fetchUserData(user.id);
	};

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}
		if (isLoggedIn && user?.user?.roles?.length === 0) {
			router.push("/onboarding");
		} else {
			if (isLoggedIn && user?.user?.activeRole === "investor") {
				router.push("/i/dashboard");
			} else if (isLoggedIn && user?.user?.activeRole === "producer") {
				router.push("/p/dashboard");
			} else if (isLoggedIn && user?.user?.activeRole === undefined) {
				router.push("/");
			}
		}
	}, [isLoggedIn, user, router]);

	async function handleEmailSignIn(event: React.FormEvent) {
		event.preventDefault();

		try {
			const { error, data } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				console.error("Error signing in:", error.message);
				toast.error(
					`Error signing you in: ${error.message}, please try again.`
				);
			} else {
				const userData = data.user;
				if (userData) {
					login(userData);
				} else {
					console.log("(login.js) No user data found in the response.");
				}
			}
		} catch (err) {
			console.error("(login.js) Unexpected error during sign in:", err);
		}
	}

	const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleCreateAccountLink = () => {
		router.push("/signup");
	};
	const handleReturnHome = () => {
		router.push("/");
	};
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-green-50 dark:bg-green-950'>
			<h1
				className='mb-2 text-green-700 text-6xl cursor-pointer transition-colors hover:text-green-600'
				onClick={handleReturnHome}
			>
				Eco Wealth
			</h1>
			<h2 className='text-gray-800 mb-32 dark:text-gray-400 text-xl'>
				Sign In
			</h2>
			<form
				className='flex flex-col w-full max-w-md'
				onSubmit={handleEmailSignIn}
			>
				<input
					type='email'
					name='email'
					placeholder='Email'
					required
					className='p-2 mb-4 rounded text-gray-500 border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
					onChange={handleEmailInput}
					value={email}
				/>
				<input
					type='password'
					name='password'
					placeholder='Password'
					required
					className='p-2 mb-4 rounded text-black border-gray-100 border-2 outline-green-300 transition-colors hover:border-green-200'
					onChange={handlePasswordInput}
					value={password}
				/>
				<button
					type='submit'
					className='p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'
				>
					Sign in with Email
				</button>
			</form>
			<p className='text-gray-500 dark:text-gray-400 mt-4 text-sm'>
				Need an account?{" "}
				<span
					className='text-green-600 cursor-pointer transition-colors hover:text-green-300'
					onClick={handleCreateAccountLink}
				>
					Create one here.
				</span>
			</p>
		</div>
	);
}
