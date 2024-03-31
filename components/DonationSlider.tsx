"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { buttonClass } from "@/lib/tw-styles";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

type Props = {
	onChange: (value: number) => void;
	product: string;
};

const DonationSlider = ({ onChange, product }: Props) => {
	const [value, setValue] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);
	const refId = useAppSelector((state) => state.user.referralId);
	const ecoWealthContributionPercentage = useAppSelector(
		(state) => state.user.ecoWealthContributionPercentage
	);
	const enagicContributionPercentage = useAppSelector(
		(state) => state.user.enagicContributionPercentage
	);
	const ecoXSolarContributionPercentage = useAppSelector(
		(state) => state.user.ecoXSolarContributionPercentage
	);
	const handleChange = (event: any, newValue: any) => {
		setValue(newValue);
		onChange(newValue); // Propagate the change to the parent component or store
	};
	useEffect(() => {
		if (product === "Enagic") {
			setValue(enagicContributionPercentage);
		}
		if (product === "Eco Wealth") {
			setValue(ecoWealthContributionPercentage);
		}
		if (product === "Eco X Solar") {
			setValue(ecoXSolarContributionPercentage);
		}
	}, [
		product,
		enagicContributionPercentage,
		ecoWealthContributionPercentage,
		ecoXSolarContributionPercentage,
	]);
	useEffect(() => {
		if (product === "Enagic" && enagicContributionPercentage === value)
			setDisabled(true);
		else if (
			product === "Eco Wealth" &&
			ecoWealthContributionPercentage === value
		)
			setDisabled(true);
		else if (
			product === "Eco X Solar" &&
			ecoXSolarContributionPercentage === value
		)
			setDisabled(true);
		else setDisabled(false);
	}, [
		value,
		product,
		enagicContributionPercentage,
		ecoWealthContributionPercentage,
		ecoXSolarContributionPercentage,
	]);
	const enagicQuery = async () =>
		await axios
			.post("/api/r/settings/enagic", {
				enagicContributionPercentage: value,
				refId,
			})
			.then((res) => {
				console.log(res.data);
				toast.success(
					"Your contribution percentage for Enagic sales has been saved successfully"
				);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log("Unable to save Enagic contribution percentage: ", err);
			});

	const ecoWealthQuery = async () =>
		await axios
			.post("/api/r/settings/eco_wealth", {
				ecoWealthContributionPercentage: value,
				refId,
			})
			.then((res) => {
				console.log(res.data);
				toast.success(
					"Your contribution percentage for Eco Wealth sales has been saved successfully"
				);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log("Unable to save Eco Wealth contribution percentage: ", err);
			});

	const ecoXSolarQuery = async () =>
		await axios
			.post("/api/r/settings/eco_x_solar", {
				ecoXSolarContributionPercentage: value,
				refId,
			})
			.then((res) => {
				console.log(res.data);
				toast.success(
					"Your contribution percentage for Eco XSolar sales has been saved successfully"
				);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log("Unable to save Eco XSolar contribution percentage: ", err);
			});
	const handleSave = async () => {
		setLoading(true);
		if (product === "Enagic") {
			enagicQuery();
		}
		if (product === "Eco Wealth") {
			ecoWealthQuery();
		}
		if (product === "Eco X Solar") {
			ecoXSolarQuery();
		}
	};
	return (
		<Box
			width={400}
			className='my-4'
		>
			<Typography
				id='donation-slider'
				gutterBottom
				className='text-gray-300'
			>
				Non-Profit Contribution Percentage (%)
			</Typography>
			<h4 className='text-gray-500 text-sm'>
				Set how much you want to contribute to non-profit initiatives selected
				by Eco Wealth whenever you sell {product} products.
			</h4>
			<p
				className='text-xs text-gray-500 font-bold cursor-pointer hover:text-gray-400 mt-2 transition-colors'
				onClick={() => setShowMore(!showMore)}
			>
				Show More
			</p>
			{showMore && (
				<>
					<p className='text-gray-500 text-sm mt-2'>
						You can change this percentage at any time and will apply to all
						future sales.
					</p>
					<p className='text-gray-500 text-sm mt-2'>
						Current non-profit initiatives include:
						<ul>
							<li>— Cauvery Calling</li>
							<li>— Project Green Hands</li>
						</ul>
					</p>
				</>
			)}
			<div className='flex items-center'>
				<Slider
					aria-labelledby='donation-slider'
					value={value}
					onChange={handleChange}
					valueLabelDisplay='auto'
					// @ts-ignore
					color='success' // This works but throws a ts error
				/>
				<p className='text-gray-400 ml-4'>{value}%</p>
				<button
					className={`${buttonClass} ml-4 !py-2 ${
						disabled &&
						"bg-gray-500 !cursor-default !hover:scale-100 !hover:bg-gray-500"
					}`}
					onClick={handleSave}
				>
					{loading ? (
						<CircularProgress
							size={20}
							color='success'
						/>
					) : (
						"Save"
					)}
				</button>
			</div>
		</Box>
	);
};

export default DonationSlider;
