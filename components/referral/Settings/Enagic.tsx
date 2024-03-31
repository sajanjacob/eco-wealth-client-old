"use client";
import { buttonClass, inputClass } from "@/lib/tw-styles";
import React, { useEffect, useState } from "react";
import ApisComingSoon from "../ApisComingSoon";
import DonationSlider from "@/components/DonationSlider";
import axios from "axios";
import { useAppSelector } from "@/redux/hooks";
import { CircularProgress } from "@mui/material";

type Props = {};

export default function Enagic({}: Props) {
	const [enagicId, setEnagicId] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [loading, setLoading] = useState(false);
	const refId = useAppSelector((state) => state.user.referralId);
	const refEnagicId = useAppSelector((state) => state.user.enagicId);
	useEffect(() => {
		if (refEnagicId) {
			setEnagicId(refEnagicId);
		}
	}, [refEnagicId]);
	useEffect(() => {
		if (refEnagicId === enagicId) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [refEnagicId, enagicId]);
	const handleSave = async () => {
		setLoading(true);
		await axios
			.post("/api/r/settings/enagic/id", {
				enagicId,
				refId,
			})
			.then((res) => {
				console.log(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log("Unable to save Enagic Id: ", err);
				setLoading(false);
			});
	};
	return (
		<div>
			<div className='mt-4'>
				<label>Enagic Id:</label>
				<p className='text-xs text-gray-400'>
					<b>Note:</b> If you own an Enagic machine, enter your Enagic ID to
					receive direct commissions.
				</p>
				<div className='flex items-center'>
					<input
						value={enagicId}
						onChange={(e) => setEnagicId(e.target.value)}
						placeholder='Enter your Enagic Id'
						className={`${inputClass} mr-2`}
					/>
					<button
						onClick={handleSave}
						className={`${buttonClass} !py-2 ${
							disabled &&
							"!bg-gray-500 !cursor-default !hover:scale-100 !hover:bg-gray-500"
						}`}
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
			<DonationSlider
				product='Enagic'
				onChange={() => {}}
			/>
			<div>
				<ApisComingSoon />
			</div>
		</div>
	);
}
