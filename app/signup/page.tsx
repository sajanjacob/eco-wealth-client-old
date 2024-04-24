"use client";
import React, { FormEvent, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { BASE_URL } from "@/constants";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import handleReferrerIds from "@/utils/handleReferrerIds";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { isEmailValid } from "@/utils/isEmailValid";
import DOMPurify, { sanitize } from "dompurify";
import sanitizeJsonObject from "@/utils/sanitizeJsonObject";
import sanitizeStringArray from "@/utils/sanitizeStringArray";
import ReferrerInput from "@/components/referral/WaitingList/ReferrerInput";
import sanitizeArrayOfObjects from "@/utils/sanitizeArrayOfObjects";
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
	const [referralSource, setReferralSource] = useState("");
	const [referrer, setReferrer] = useState("");
	const supabase = createClientComponentClient();
	const searchParams = useSearchParams();
	const ref = searchParams?.get("r");
	const [specificReferral, setSpecificReferral] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);
	const [referrerIds, setReferrerIds] = useState<string[]>([]);
	const [specificReferrer, setSpecificReferrer] = useState<Referrer>({
		referrerId: "",
		referrer: {
			name: "",
			email: "",
		},
		dateAdded: "",
		pageSource: "",
		inputSource: "",
	});
	const [inputValueParent, setInputValueParent] = useState("");
	const [referrers, setReferrers] = useState<Referrer[]>([]);
	const RECAPTCHA_SITE_KEY = process.env.recaptcha_site_key;
	const [captcha, setCaptcha] = useState<string | null>("");

	const path = usePathname();
	// TODO: Add password strength meter
	// TODO: Add password requirements
	// TODO: Add password reset
	const handleCheckReferral = () => {
		if (typeof window !== "undefined") {
			// The code now runs only on the client side

			if (ref) {
				setReferralSource("Friend/Someone referred");
				handleExistingReferral(JSON.parse(ref as string));
				return;
			} else {
				const storedData = localStorage.getItem("referrerData");
				if (!storedData) return;
				const { referrerIds } = JSON.parse(storedData as string);
				setReferralSource("Friend/Someone referred");
				handleExistingReferral(referrerIds);
			}
		}
	};

	// Check if referrerIds is present in URL or localStorage
	useEffect(() => {
		// Check if referrerIds are present in URL
		handleCheckReferral();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref]);

	// Check if referrerIds is present in localStorage
	const handleExistingReferral = async (referrerIds: string[]) => {
		await handleReferrerIds({
			urlReferrerIds: referrerIds,
			setReferrers,
			pageSource: path!,
		});
	};

	// Handle referral source change
	const handleReferralChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setReferralSource(e.target.value);
		setSpecificReferral(""); // Reset specific referral if the referral source is changed
		if (e.target.value !== "Friend/Someone referred") {
			setReferrer("");
		}
	};

	async function handleEmailSignUp(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		console.log("signing up user...");

		if (password !== confirmPassword) {
			alert("Passwords do not match. Please try again.");
			return;
		}
		// Check if there's stored referral data in localStorage
		const storedData = localStorage.getItem("referrerData");

		// Sanitize inputs
		const sanitizedEmail = DOMPurify.sanitize(email);
		const sanitizedPassword = DOMPurify.sanitize(password);
		const sanitizedReferralSource = DOMPurify.sanitize(referralSource || "");
		const sanitizedReferrers = sanitizeArrayOfObjects(referrers);
		const sanitizedSpecificReferral = DOMPurify.sanitize(
			specificReferral || ""
		);
		const sanitizedReferrerIds = sanitizeStringArray(referrerIds);
		if (storedData) {
			const { referrerIds } = JSON.parse(storedData as string);
			await axios
				.post("/api/signup", {
					email: sanitizedEmail,
					password: sanitizedPassword,
					referrerIds: sanitizedReferrerIds,
					referrers: sanitizedReferrers,
					referralSource: sanitizedReferralSource,
					specificReferral: sanitizedSpecificReferral,
				})
				.then((res) => {
					console.log("res >>> ", res);
					router.push(`/thankyou?email=${email}`);
				})
				.catch((err) => {
					console.log("err >>> ", err);
				});
		} else {
			// If no stored referral, signup with static referral info or with email & password
			if (referralSource !== "") {
				await axios
					.post("/api/signup", {
						email: sanitizedEmail,
						password: sanitizedPassword,
						referralSource: sanitizedReferralSource,
						referrers: sanitizedReferrers,
						referrerIds: sanitizedReferrerIds,
						specificReferral: sanitizedSpecificReferral,
					})
					.then((res) => {
						console.log("res >>> ", res);
						router.push(`/thankyou?email=${email}`);
					})
					.catch((err) => {
						console.log("err >>> ", err);
					});
				return;
			}
			await axios
				.post("/api/signup", {
					email: sanitizedEmail,
					password: sanitizedPassword,
				})
				.then((res) => {
					console.log("res >>> ", res);
					router.push(`/thankyou?email=${email}`);
				})
				.catch((err) => {
					console.log("err >>> ", err);
				});
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
	// Render specific referral input based on referral source
	// const renderSpecificReferralInput = () => {
	// 	if (referralSource === "Friend/Someone referred") {
	// 		return (
	// 			<div className='flex flex-col mb-4'>
	// 				<label className='mb-2'>Who referred you?</label>
	// 				<input
	// 					type='text'
	// 					value={referrer}
	// 					placeholder='Name and/or email'
	// 					className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
	// 					onChange={(e) => setReferrer(e.target.value)}
	// 				/>
	// 			</div>
	// 		);
	// 	} else if (
	// 		[
	// 			"Instagram",
	// 			"Facebook",
	// 			"YouTube",
	// 			"TikTok",
	// 			"Threads",
	// 			"Blog/Website",
	// 		].includes(referralSource)
	// 	) {
	// 		return (
	// 			<div className='flex flex-col mb-4 w-[300px]'>
	// 				<label className='mb-2'>
	// 					Which {referralSource} account did you hear about Eco Wealth from?
	// 				</label>
	// 				<input
	// 					type='text'
	// 					value={specificReferral}
	// 					placeholder={
	// 						referralSource === "Blog/Website"
	// 							? "Blog/Website name"
	// 							: "@username"
	// 					}
	// 					className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
	// 					onChange={(e) => setSpecificReferral(e.target.value)}
	// 				/>
	// 			</div>
	// 		);
	// 	}
	// };
	useEffect(() => {
		// Check if all required fields are filled and valid
		const isValid =
			isEmailValid(email) &&
			captcha !== null &&
			captcha !== "" &&
			captcha !== undefined &&
			passwordMatch;
		// Add reCaptcha validation here
		setIsFormValid(isValid);
	}, [name, email, referralSource, referrer, specificReferral, captcha]);
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
				{/* Referral source dropdown */}
				{/* <div className='flex flex-col mb-4'>
					<label className='mb-2'>How did you hear about Eco Wealth?</label>
					<select
						value={referralSource}
						className='w-[300px] px-2 py-2 rounded-lg border border-gray-300 text-gray-900'
						onChange={handleReferralChange}
					>
						<option value=''>Select</option>
						<option value='Instagram'>Instagram</option>
						<option value='Facebook'>Facebook</option>
						<option value='YouTube'>YouTube</option>
						<option value='TikTok'>TikTok</option>
						<option value='Threads'>Threads</option>
						<option value='Blog/Website'>Blog/Website</option>
						<option value='Friend/Someone referred'>
							Friend/Someone referred me
						</option>
					</select>
				</div> */}

				<ReferrerInput
					referralSource={referralSource}
					setReferralSource={setReferralSource}
					setReferrerIds={setReferrerIds}
					specificReferrer={specificReferrer}
					setSpecificReferrer={setSpecificReferrer}
					setReferrers={setReferrers}
					setInputValueParent={setInputValueParent}
				/>
				{/* Conditional text input for referrer
				{renderSpecificReferralInput()} */}
				<ReCAPTCHA
					sitekey={RECAPTCHA_SITE_KEY!}
					onChange={setCaptcha}
				/>
				<button
					className={
						isFormValid
							? "px-2 py-2 rounded-lg bg-[var(--cta-one)] text-white cursor-pointer hover:bg-[var(--cta-one-hover)] transition-all hover:scale-105"
							: "px-2 py-2 rounded-lg bg-gray-500 text-white cursor-default "
					}
					type='submit'
					disabled={!isFormValid}
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
