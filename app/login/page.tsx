"use client";
import React, { useState, useEffect } from "react";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store"; // import your root state and dispatch types from your
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/features/userSlice";
import { toast } from "react-toastify";
import AuthMFA from "@/components/login/AuthMFA";
import Image from "next/image";
import { BASE_URL } from "@/constants";
import { set } from "react-hook-form";
import axios from "axios";
export default function Login() {
	const user = useAppSelector((state: RootState) => state.user);
	const isLoggedIn = useAppSelector((state: RootState) => state.user?.loggedIn);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [showMFA, setShowMFA] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [verified, setVerified] = useState(false);
	const [loading, setLoading] = useState(false);
	function isOlderThan30Days(timestamp: string) {
		if (!timestamp) return false;
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
	function isOlderThan7Days(timestamp: string) {
		if (!timestamp) return false;

		const dateFromTimestamp = new Date(timestamp);
		const now = new Date();
		const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

		return dateFromTimestamp < sevenDaysAgo;
	}

	function isOlderThan14Days(timestamp: string) {
		if (!timestamp) return false;

		const dateFromTimestamp = new Date(timestamp);
		const now = new Date();
		const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

		return dateFromTimestamp < fourteenDaysAgo;
	}

	function isOlderThan28Days(timestamp: string) {
		if (!timestamp) return false;

		const dateFromTimestamp = new Date(timestamp);
		const now = new Date();
		const twentyEightDaysAgo = new Date(
			now.getTime() - 28 * 24 * 60 * 60 * 1000
		);

		return dateFromTimestamp < twentyEightDaysAgo;
	}

	const handleUnverifiedMFA = async (userId: string, data: any) => {
		console.log("MFA is not verified...");
		setVerified(false);
		setShowMFA(true);
		setLoading(false);
		const userValues = {
			loggedIn: true,
			...getUserDetails(data),
			mfaVerified: false,
			loadingUser: false,
		};
		dispatch(setUser(userValues));
		await axios.post("/api/update_mfa", { userId });
	};
	const checkMFAReverification = (user: any) => {
		const verificationFrequency = user.mfa_frequency;
		const verificationTimestamp = user.mfa_verified_at;

		switch (verificationFrequency) {
			case "Always":
				return true; // Always reverify
			case "7 Days":
				return isOlderThan7Days(verificationTimestamp);
			case "14 Days":
				return isOlderThan14Days(verificationTimestamp);
			case "28 Days":
				return isOlderThan28Days(verificationTimestamp);
			default:
				return false;
		}
	};

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

			console.log("data >>> ", data);

			if (data.mfa_enabled && data.mfa_verified) {
				console.log("MFA is enabled and verified");
				const shouldVerify = checkMFAReverification(data);
				if (shouldVerify) {
					await handleUnverifiedMFA(userId, data);
					return;
				}
			}
			if (data.mfa_enabled && !data.mfa_verified) {
				console.log("MFA is enabled and not verified");

				await handleUnverifiedMFA(userId, data);
				return;
			}
			if (!data.mfa_verified_at) {
				await handleUnverifiedMFA(userId, data);
				return null;
			}

			setVerified(true);

			if (!data.onboarding_complete) {
				console.log("user is not onboarded");
				router.push("/onboarding");
			} else {
				redirectToDashboard(data);
			}

			setLoading(false);
			return data;
		} catch (err) {
			setLoading(false);
			console.error("Unexpected error fetching user data:", err);
			return null;
		}
	};

	const redirectToDashboard = (data: any) => {
		console.log("redirecting to dashboard...");
		const { active_role } = data;
		const dashboardPath =
			active_role === "investor" ? "/i/dashboard" : "/p/dashboard";
		router.push(dashboardPath);
	};

	const getUserDetails = (data: any) => {
		return {
			name: data?.name,
			email: data?.email,
			phoneNumber: data?.phone_number,
			isVerified: data?.is_verified,
			roles: data?.roles,
			id: data?.id,
			producerId: data?.producers?.id,
			investorId: data?.investors?.id,
			activeRole: data?.active_role,
			onboardingComplete: data?.onboarding_complete,
			investorOnboardingComplete: data?.investors?.onboarding_complete,
			producerOnboardingComplete: data?.producers?.onboarding_complete,
			emailNotification: data?.email_notification,
			smsNotification: data?.sms_notification,
			pushNotification: data?.push_notification,
			mfaEnabled: data?.mfa_enabled,
			mfaVerifiedAt: data?.mfa_verified_at,
			mfaFrequency: data?.mfa_frequency,
		};
	};

	const login = async (user: any) => {
		setLoading(true);
		const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
		await fetchUserData(user.id);
	};

	const userVerificationRouting = () => {
		if (verified && !showMFA) {
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
	};

	useEffect(() => {
		if (isLoggedIn) {
			const mfaVerificationExpired =
				!user.mfaVerified || checkMFAReverification(user);
			if (mfaVerificationExpired) {
				setShowMFA(true);
			} else {
				setShowMFA(false);
				if (verified) userVerificationRouting();
			}
		}
	}, [user, isLoggedIn, user.mfaVerifiedAt, verified]);

	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}

		if (isLoggedIn && user.mfaVerified) {
			setShowMFA(false);
			if (user.activeRole === undefined || user.activeRole === null) {
				if (user.roles.includes("investor")) {
					router.push("/i/dashboard");
					setLoading(false);
				} else if (user.roles.includes("producer")) {
					router.push("/p/dashboard");
					setLoading(false);
				}
			}
			if (user.activeRole === "investor") {
				router.push("/i/dashboard");
				setLoading(false);
			} else if (user.activeRole === "producer") {
				router.push("/p/dashboard");
				setLoading(false);
			}
		}
	}, [isLoggedIn, user, router, verified]);

	async function handleEmailSignIn(event: React.FormEvent) {
		event.preventDefault();
		setLoading(true);
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
				setLoading(false);
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
	if (BASE_URL === "https://ecowealth.app") return null;
	return (
		<>
			{showMFA ? (
				<div className='flex flex-col items-center justify-center min-h-screen'>
					<AuthMFA
						mfaEnabled={user.mfaEnabled}
						setVerified={setVerified}
						setShowMFA={setShowMFA}
					/>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center min-h-screen px-12'>
					<Image
						src='/white_logo_transparent_background.png'
						width={300}
						height={300}
						alt='Eco Wealth Logo'
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
							disabled={loading}
							className={
								loading
									? "p-2 rounded bg-gray-600 text-white font-bold transition-all cursor-default"
									: "cursor-pointer p-2 rounded bg-[var(--cta-one)] text-white font-bold transition-all hover:bg-[var(--cta-one-hover)] hover:scale-105"
							}
						>
							{loading ? "Signing you in..." : "Sign in with Email"}
						</button>
					</form>
					<p className='text-gray-500 dark:text-gray-400 mt-4 text-sm'>
						Need an account?{" "}
						<span
							className='text-[var(--cta-one)] cursor-pointer transition-colors hover:text-[var(--cta-two-hover)]'
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
