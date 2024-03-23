"use client";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import validator from "validator";
import debounce from "@/utils/debounce";
type Props = {
	email: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	emailError: string;
	isRegistered: boolean;
	setIsRegistered: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EmailInput({
	email,
	setEmail,
	emailError,
	isRegistered,
	setIsRegistered,
}: Props) {
	const [loading, setLoading] = useState(false);
	const [apiCount, setApiCount] = useState(0);

	// This api checks if the email is registered on the waiting list or an alpha prototype user.
	const checkIfAlreadyRegistered = async (email: string) => {
		setLoading(true);
		setIsRegistered(false);
		await axios
			.post("/api/check/waiting_list", { email })
			.then((res) => {
				console.log("res", res);
				setApiCount((prevCount) => prevCount + 1);
				if (res.data.email === email) {
					setIsRegistered(true);
				}
				setLoading(false);
			})
			.catch((err) => {
				setApiCount((prevCount) => prevCount + 1);
				console.log(err);
				if (err.response.status === 404) {
					setIsRegistered(false);
				}
				setLoading(false);
			});
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedCheck = useCallback(
		debounce((email: string) => {
			checkIfAlreadyRegistered(email);
		}, 800),
		[]
	); // this useCallback ensures that the debounced function is created only once

	// Activate checkIfAlreadyRegistered when email is valid
	useEffect(() => {
		if (validator.isEmail(email)) {
			debouncedCheck(email);
		}
	}, [email, debouncedCheck]);

	useEffect(() => {
		console.log("apiCount: ", apiCount);
	}, [apiCount]);
	return (
		<div className='flex flex-col mb-4'>
			<label className='mb-2'>Email:</label>
			<div
				className={`flex items-center w-[300px] px-2 py-2 rounded-lg border-2 ${
					isRegistered ? "border-green-400" : "border-gray-300"
				}  bg-white`}
			>
				<input
					type='email'
					value={email}
					className={`outline-none w-[100%] bg-transparent ${
						isRegistered ? "text-green-400" : "text-gray-900"
					}`}
					onChange={(e) => setEmail(e.target.value)}
				/>
				{isRegistered && (
					<IoCheckmarkCircle className='text-green-400 text-2xl' />
				)}
				{loading && (
					<CircularProgress
						sx={{
							width: "16px !important",
							height: "16px !important",
						}}
						color='success'
					/>
				)}
			</div>
			{emailError && <p style={{ color: "red" }}>{emailError}</p>}
			{isRegistered && (
				<p className='text-green-400 text-xs mt-[2px]'>
					This email is already on the waiting list!
				</p>
			)}
		</div>
	);
}
