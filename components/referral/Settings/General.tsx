"use client";
import { buttonClass, inputClass } from "@/lib/tw-styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ApisComingSoon from "../ApisComingSoon";
import validator from "validator";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/hooks";
import sanitizeHtml from "sanitize-html";
import { CircularProgress } from "@mui/material";
type Props = {};

export default function General({}: Props) {
	const [contactEmail, setContactEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(false);
	// fetch contact email and ref id from redux store
	const refId = useAppSelector((state) => state.user.referralId);
	const refContactEmail = useAppSelector((state) => state.user.contactEmail);

	useEffect(() => {
		if (refContactEmail) {
			setContactEmail(refContactEmail);
		}
	}, [refContactEmail]);
	useEffect(() => {
		if (contactEmail === refContactEmail) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [refContactEmail, contactEmail]);
	const handleSave = async () => {
		if (!contactEmail || contactEmail === "") return;
		if (validator.isEmail(contactEmail)) {
			const sanitizedContactEmail = sanitizeHtml(contactEmail);
			axios
				.post("/api/r/settings/general", {
					contactEmail: sanitizedContactEmail,
					refId,
				})
				.then((res) => {
					console.log(res.data);
					toast.success("Contact email saved successfully", {
						position: "top-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
					});
				})
				.catch((err) => {
					console.log("Unable to save contact email: ", err);
				});
		}
	};

	return (
		<div>
			<div className='mt-4'>
				<label>Contact Email</label>
				<p className='text-xs text-gray-400'>
					<b>Note:</b> When empty, potential clients cannot search you by email.
				</p>
				<div className='flex items-center'>
					<input
						value={contactEmail}
						onChange={(e) => setContactEmail(e.target.value)}
						placeholder='Enter your public contact email'
						className={`${inputClass} mr-2 `}
					/>
					<button
						onClick={handleSave}
						className={`${buttonClass} ${
							disabled &&
							"!bg-gray-500 !cursor-default !hover:scale-100 !hover:bg-gray-500"
						} !py-2`}
						disabled={disabled}
					>
						{loading ? (
							<CircularProgress
								color='success'
								size={20}
							/>
						) : (
							"Save"
						)}
					</button>
				</div>
			</div>
			<div>
				<ApisComingSoon />
			</div>
		</div>
	);
}
