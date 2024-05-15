"use client";
import Logo from "@/components/Logo";
import PrivacyPolicySnippet from "@/components/PrivacyPolicySnippet";
import ReferrerInput from "@/components/referral/WaitingList/ReferrerInput";
import { buttonClass, inputClass } from "@/lib/tw-styles";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

export default function Page({}: Props) {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [emailError, setEmailError] = useState("");
	const [nameError, setNameError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [captcha, setCaptcha] = useState<string | null>("");
	const [referralSource, setReferralSource] = useState("");
	const [referrers, setReferrers] = useState<Referrer[]>([]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// Validate email
		// Validate name
		// Submit form
	};
	const router = useRouter();
	useEffect(() => {
		router.push("/");
	}, []);
	return (
		<div className='blog-content w-[60vw] mx-auto'>
			<div className='pt-12 pb-4 [&>p]:text-gray-400'>
				<Logo width={144} />
				<h1 className='mt-4'>
					Get an eco email tip a day for 30 days to make your lifestyle a little
					more sustainable. 🌱
				</h1>
				<p>It&apos;s free and you can unsubscribe anytime.</p>
				<p>Sign up with your name and email below! 👇</p>
			</div>
			<form
				action=''
				onSubmit={(e) => handleSubmit(e)}
				className=''
			>
				<label className='text-sm text-gray-500'>🌱 Eco Tip a Day Signup</label>
				<div>
					<div className='flex w-[100%]'>
						<input
							type='name'
							placeholder='Enter your name'
							className={inputClass + " !w-[100%]"}
							value={name}
						/>
						<input
							type='email'
							placeholder='Enter your email'
							className={inputClass + " ml-2 !w-[100%]"}
							value={email}
						/>
					</div>
					<div className='flex justify-end'>
						<button
							type='submit'
							className={buttonClass}
						>
							Start getting eco tips now 🌱
						</button>
					</div>
					<PrivacyPolicySnippet />
				</div>
			</form>
		</div>
	);
}
