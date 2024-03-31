"use client";
import React, { ReactHTML, useEffect, useState } from "react";
import { isEmailValid } from "@/utils/isEmailValid";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BiLock } from "react-icons/bi";
import Logo from "./Logo";

import ReCAPTCHA from "react-google-recaptcha";
import validator from "validator";
import addToWaitingList from "@/utils/addToWaitingList";

import ReferrerInput from "./referral/WaitingList/ReferrerInput";
import extractObjValuesToStringArray from "@/utils/extractObjValuesToStringArray";
import EmailInput from "./referral/WaitingList/EmailInput";
import Loading from "./Loading";
import ReferrerCount from "./referral/WaitingList/ReferrerCount";
type Props = {
	formHeight?: string;
	showLogo?: boolean;
};
type Referrer = {
	referrerId: string;
	referrer: {
		name: string;
		email: string;
	};
	dateAdded: string;
	pageSource: string;
	inputSource: string;
};

function WaitingListForm({ formHeight, showLogo = true }: Props) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [referralSource, setReferralSource] = useState("");
	const [referrer, setReferrer] = useState("");
	const [referrers, setReferrers] = useState<Referrer[]>([]);
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
	const [isFormValid, setIsFormValid] = useState(false);
	const searchParams = useSearchParams();
	const refIds = searchParams?.get("r");
	const [captcha, setCaptcha] = useState<string | null>("");
	const [referrerIds, setReferrerIds] = useState<string[]>([]);
	const RECAPTCHA_SITE_KEY = process.env.recaptcha_site_key;
	const [isRegistered, setIsRegistered] = useState(false);
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const path = usePathname();
	const getReferrerIds = () => {
		const storedData = localStorage.getItem("referrerData");
		if (!storedData) return null;
		const referrerIds = extractObjValuesToStringArray(
			JSON.parse(storedData),
			"referrerId"
		);
		return referrerIds;
	};
	useEffect(() => {
		if (referralSource) {
			console.log("referralSource >>> ", referralSource);
		}
	}, [referralSource]);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Validate email
		console.log("submitting...");
		setLoading(true);
		if (!validator.isEmail(email)) {
			setEmailError("Invalid email address");
			return;
		}
		setEmailError("");
		let finalReferrers = [...referrers];
		if (
			specificReferrer.referrer.name !== "" &&
			specificReferrer.referrer.name.length >= 3 &&
			!finalReferrers.some(
				(r) => r.referrer.name === specificReferrer.referrer.name
			)
		) {
			finalReferrers = [...referrers, specificReferrer];
			setReferrers([...referrers, specificReferrer]);
		} else {
			finalReferrers = referrers;
		}
		// Check if there's inputValue that hasn't been added as a referrer
		if (
			inputValueParent &&
			inputValueParent.length >= 3 &&
			!finalReferrers.some((r) => r.referrer.name === inputValueParent)
		) {
			const newReferrer = {
				referrerId: "",
				referrer: {
					name: inputValueParent,
					email: "", // If you need an email, you can adjust accordingly
				},
				dateAdded: new Date().toISOString(),
				pageSource: path || "",
				inputSource: "text",
			};
			finalReferrers.push(newReferrer);
		}

		// Check if referrerIds is present in URL or localStorage;
		const referrerIds = getReferrerIds();
		if (!name || !email || !captcha) return;
		// Send form data to the server
		if (!referrerIds) {
			// Send form data to the server
			if (referralSource !== "") {
				addToWaitingList({
					name,
					email,
					referralSource,
					referrers: finalReferrers,
					router,
					setLoading,
				});
			} else {
				addToWaitingList({
					name,
					email,
					router,
					setLoading,
				});
			}
		} else {
			addToWaitingList({
				name,
				email,
				referralSource,
				referrers: finalReferrers,
				referrerIds,
				router,
				setLoading,
			});
		}
	};

	useEffect(() => {
		// Check if all required fields are filled and valid
		const isValid =
			name.trim() !== "" &&
			isEmailValid(email) &&
			captcha !== null &&
			captcha !== "" &&
			captcha !== undefined &&
			!isRegistered;
		// Add reCaptcha validation here
		setIsFormValid(isValid);
	}, [
		name,
		email,
		captcha,
		referrers,
		referralSource,
		specificReferrer,
		isRegistered,
	]);

	if (loading)
		return (
			<div
				className={`flex flex-col items-center justify-center ${
					formHeight || "min-h-screen"
				} w-[300px] mx-auto`}
			>
				{showLogo && (
					<Logo
						width={384}
						height={150}
					/>
				)}
				<h2 className='mb-12 lg:text-xl text-gray-400 text-center'>
					Be the first to know when Eco Wealth launches!
				</h2>
				<Loading message='Adding you to the waitlist...' />
			</div>
		);
	return (
		<form
			onSubmit={handleSubmit}
			className={`flex flex-col items-center justify-center ${
				formHeight || "min-h-screen"
			} w-[300px] mx-auto`}
		>
			{/* showLogo - default is true */}
			{showLogo && (
				<Logo
					width={384}
					height={150}
				/>
			)}
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
			<EmailInput
				email={email}
				setEmail={setEmail}
				emailError={emailError}
				isRegistered={isRegistered}
				setIsRegistered={setIsRegistered}
			/>

			<ReferrerInput
				referralSource={referralSource}
				setReferralSource={setReferralSource}
				setReferrerIds={setReferrerIds}
				specificReferrer={specificReferrer}
				setSpecificReferrer={setSpecificReferrer}
				setReferrers={setReferrers}
				setInputValueParent={setInputValueParent}
			/>
			<ReCAPTCHA
				sitekey={RECAPTCHA_SITE_KEY!}
				onChange={setCaptcha}
				className='rounded-md mx-auto mt-2'
			/>
			<button
				className={
					isFormValid
						? "w-[300px] mt-8 px-4 py-2 rounded-lg bg-[var(--cta-one)] text-white cursor-pointer hover:bg-[var(--cta-one-hover)] transition-all hover:scale-105"
						: "w-[300px] mt-8 px-4 py-2 rounded-lg bg-gray-700 text-white cursor-default"
				}
				type='submit'
				disabled={!isFormValid}
			>
				Join waiting list
			</button>
			<div className='w-[300px] mt-4'>
				<p className='text-xs mt-2 text-gray-500'>
					<BiLock className='inline text-base' />
					<b>Your Privacy:</b> We promise to keep your contact information
					confidential and only contact you with news & updates regarding Eco
					Wealth, and inviting you to test the platform when opportunities
					arise.
				</p>
				<p className='text-xs mt-2 text-gray-500'>
					<b>Note:</b> More details can be found in our{" "}
					<a
						href='/privacy-policy'
						className='underline cursor-pointer hover:text-gray-400 transition-all'
					>
						privacy policy
					</a>
					.
				</p>
			</div>
			<div className='flex justify-start w-[100%] mt-4'>
				{referralSource === "" && <ReferrerCount />}
			</div>
		</form>
	);
}

export default WaitingListForm;
