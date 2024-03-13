"use client";
import { buttonClass, linkClass } from "@/lib/tw-styles";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { BiCookie } from "react-icons/bi";

const CookieConsent = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const cookieConsent = localStorage.getItem("cookieConsent");
		if (cookieConsent === null) {
			setIsVisible(true);
		}
		if (cookieConsent === "accepted") {
			// Add any function that initializes cookies or tracking here.
		}
		if (cookieConsent === "rejected") {
			// Optionally, disable any cookie or tracking functionality here.
		}
	}, []);

	const handleAccept = () => {
		localStorage.setItem("cookieConsent", "accepted");
		setIsVisible(false);
		// Add any function that initializes cookies or tracking here.
	};

	const handleReject = () => {
		localStorage.setItem("cookieConsent", "rejected");
		setIsVisible(false);
		// Optionally, disable any cookie or tracking functionality here.
	};

	if (!isVisible) return null;

	return (
		<div
			style={{
				position: "fixed",

				padding: "20px",
				borderRadius: "5px",
				boxShadow: "0 0 10px rgba(0,0,0,0.25)",
			}}
			className='bg-green-950 text-white md:w-1/2 m-4 bottom-1 md:bottom-5 md:right-5'
		>
			<div className='flex flex-col md:flex-row md:items-center'>
				<BiCookie className='text-gray-200 text-3xl mb-3 md:p-0 md:text-8xl flex-[0.1] md:mr-6' />
				<p className='text-gray-400 flex-1 text-xs md:text-base'>
					We use cookies to improve your experience. By continuing, you agree to
					our use of cookies. See our{" "}
					<Link
						className={`hover:!text-green-400 ${linkClass}`}
						href='/policies/privacy'
					>
						privacy policy
					</Link>{" "}
					for more info.
				</p>
			</div>
			<button
				onClick={handleAccept}
				className={`!text-sm ${buttonClass} mr-4`}
			>
				Accept
			</button>
			<button
				onClick={handleReject}
				className={`!text-sm !text-gray-400 font-bold !bg-transparent ${buttonClass}  hover:!bg-white hover:!text-white hover:!bg-opacity-5 rounded-md`}
			>
				Reject
			</button>
		</div>
	);
};

export default CookieConsent;
