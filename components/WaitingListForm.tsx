"use client";
import React, { ReactHTML, useEffect, useState } from "react";
import { isEmailValid } from "@/utils/isEmailValid";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BiLock } from "react-icons/bi";
import Logo from "./Logo";

import ReCAPTCHA from "react-google-recaptcha";
import validator from "validator";
import addToWaitingList from "@/utils/addToWaitingList";

import ReferrerInput from "./referral/WaitingList/ReferrerInput";
import extractObjValuesToStringArray from "@/utils/extractObjValuesToStringArray";
type Props = {
	formHeight?: string;
	showLogo?: boolean;
};
function WaitingListForm({ formHeight, showLogo = true }: Props) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [referralSource, setReferralSource] = useState("");
	const [referrer, setReferrer] = useState("");
	const [referrers, setReferrers] = useState<Object[]>([{}]);
	const [referringFriend, setReferringFriend] = useState("");
	const [specificReferral, setSpecificReferral] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);
	const searchParams = useSearchParams();
	const refIds = searchParams?.get("r");
	const [captcha, setCaptcha] = useState<string | null>("");
	const [referrerIds, setReferrerIds] = useState<string[]>([]);
	const RECAPTCHA_SITE_KEY = process.env.recaptcha_site_key;

	const router = useRouter();
	const getReferrerIds = () => {
		const storedData = localStorage.getItem("referrerData");
		if (!storedData) return null;
		const referrerIds = extractObjValuesToStringArray(
			JSON.parse(storedData),
			"referrerId"
		);
		return referrerIds;
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Validate email
		console.log("submitting...");
		if (!validator.isEmail(email)) {
			setEmailError("Invalid email address");
			return;
		}
		setEmailError("");

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
					referrers,
					specificReferral: referrer !== "" ? referrer : specificReferral,
					router,
				});
			} else {
				addToWaitingList({
					name,
					email,
					router,
				});
			}
		} else {
			addToWaitingList({
				name,
				email,
				referralSource,
				referrers,
				specificReferral,
				referrerIds,
				router,
			});
		}
	};

	useEffect(() => {
		console.log("referrer >>> ", referrers);
		console.log("referralSource >>> ", referralSource);
		console.log("specificReferral >>> ", specificReferral);

		// Check if all required fields are filled and valid
		const isValid =
			name.trim() !== "" &&
			isEmailValid(email) &&
			captcha !== null &&
			captcha !== "" &&
			captcha !== undefined;
		// Add reCaptcha validation here
		setIsFormValid(isValid);
	}, [name, email, captcha, referrers, referralSource, specificReferral]);
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

			<ReferrerInput
				referralSource={referralSource}
				setReferralSource={setReferralSource}
				setReferrerIds={setReferrerIds}
				specificReferral={specificReferral}
				setSpecificReferral={setSpecificReferral}
				setReferrers={setReferrers}
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
		</form>
	);
}

export default WaitingListForm;
