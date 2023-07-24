"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store"; // import your root state and dispatch types from your
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/features/userSlice";
import { toast } from "react-toastify";
import AuthMFA from "@/components/login/AuthMFA";
import Image from "next/image";
export default function Login() {
	const user = useAppSelector((state: RootState) => state.user);
	const isLoggedIn = useAppSelector((state: RootState) => state.user?.loggedIn);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [showMFA, setShowMFA] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [verified, setVerified] = useState(false);
	const [loggedInUser, setLoggedInUser] = useState({});

	function isOlderThan30Days(timestamp: string) {
		// Parse the input timestamp into a Date object
		const dateFromTimestamp = new Date(timestamp);

		// Get the current date and time
		const now = new Date();

		// Subtract 30 days from the current date
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		// If dateFromTimestamp is older than thirtyDaysAgo, return true
		// otherwise, return false
		return dateFromTimestamp < thirtyDaysAgo;
	}

	const fetchUserData = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from("users")
				.select("*, producers(*), investors(*)")
				.eq("id", userId)
				.single();
			if (error) {
				console.error("Error fetching user data:", error.message);

				return null;
			}
			console.log("User data fetched successfully:", data);
			setLoggedInUser(data);
			dispatch(
				setUser({
					loggedIn: true,
					name: data.name,
					email: data.email,
					phoneNumber: data.phone_number,
					isVerified: data.is_verified,
					roles: data.roles,
					id: data.id,
					activeRole: data.active_role,
					onboardingComplete: data.onboarding_complete,
					investorOnboardingComplete: data.investors.onboarding_complete,
					producerOnboardingComplete: data.producers.onboarding_complete,
					emailNotification: data.email_notification,
					smsNotification: data.sms_notification,
					pushNotification: data.push_notification,
					mfaEnabled: data.mfa_enabled,
					mfaVerified: data.mfa_verified,
					mfaVerifiedAt: data.mfa_verified_at,
				})
			); // Dispatch a redux action
			return data;
		} catch (err) {
			console.error("Unexpected error fetching user data:", err);
			return null;
		}
	};

	const login = async (user: any) => {
		const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
		await fetchUserData(user.id);
		if (user.loggedIn) {
			if (user.mfaVerified) {
				if (isOlderThan30Days(user.mfaVerifiedAt)) {
					if (
						data &&
						data.nextLevel === "aal2" &&
						data.nextLevel !== data.currentLevel
					) {
						setShowMFA(true);
						const mfaEnabled = true;
					} else {
						setShowMFA(false);
						const mfaEnabled = false;
						router.push("/setup-mfa");
					}
				} else {
					setShowMFA(false);
				}
			}
		}
	};

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}
		if (isLoggedIn && !user.mfaVerified) {
			setShowMFA(true);
		}
		if (verified) {
			if (isLoggedIn && user?.roles?.length === 0) {
				router.push("/onboarding");
			} else {
				if (isLoggedIn && user?.activeRole === "investor") {
					router.push("/i/dashboard");
				} else if (isLoggedIn && user?.activeRole === "producer") {
					router.push("/p/dashboard");
				} else if (isLoggedIn && user?.activeRole === undefined) {
					router.push("/");
				}
			}
		}
	}, [isLoggedIn, user, router, verified]);

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
		<>
			{showMFA ? (
				<div className='flex flex-col items-center justify-center min-h-screen'>
					<AuthMFA setVerified={setVerified} />
				</div>
			) : (
				<div className='flex flex-col items-center justify-center min-h-screen'>
					<Image
						src='/white_logo_transparent_background.png'
						width={300}
						height={300}
						alt='EcoWealth Logo'
						onClick={handleReturnHome}
						className='cursor-pointer'
					/>
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
			)}
		</>
	);
}
