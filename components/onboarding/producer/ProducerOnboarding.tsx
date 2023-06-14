"use client";
import React, { use, useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import InvestorOnboardingGoals from "./ProducerOnboardingGoals";

import LinearProgress from "@mui/material/LinearProgress";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ProducerOnboardingSubmit from "./ProducerOnboardingSubmit";
import ProducerOnboardingAddress from "./ProducerOnboardingAddress";

export default function ProducerOnboarding() {
	const [investmentGoals, setInvestmentGoals] = useState<string[]>([]);
	const [otherInvestmentGoal, setOtherInvestmentGoal] = useState("");
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	const [investmentSectors, setInvestmentSectors] = useState<string[]>([]);

	const router = useRouter();

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setInvestmentGoals([...investmentGoals, e.target.value]);
		} else {
			setInvestmentGoals(
				investmentGoals.filter((goal) => goal !== e.target.value)
			);
		}
	};

	const handleSectorCheckboxChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.checked && e.target.value === "Both") {
			setInvestmentSectors(["Trees", "Renewable Energy", "Both"]);
		} else if (e.target.checked) {
			setInvestmentSectors([...investmentSectors, e.target.value]);
		} else if (
			!e.target.checked &&
			e.target.value === "Both" &&
			investmentSectors.includes("Trees") &&
			investmentSectors.includes("Renewable Energy")
		) {
			setInvestmentSectors([]);
		} else if (
			(!e.target.checked && e.target.value === "Trees") ||
			(!e.target.checked && e.target.value === "Renewable Energy")
		) {
			setInvestmentSectors(
				investmentSectors.filter(
					(sector) => sector !== e.target.value && sector !== "Both"
				)
			);
		} else {
			setInvestmentSectors(
				investmentSectors.filter((sector) => sector !== e.target.value)
			);
		}
	};

	useEffect(() => {
		if (
			investmentSectors.includes("Trees") &&
			investmentSectors.includes("Renewable Energy") &&
			investmentSectors.includes("Both")
		) {
			return;
		} else if (
			investmentSectors.includes("Trees") &&
			investmentSectors.includes("Renewable Energy")
		) {
			setInvestmentSectors([...investmentSectors, "Both"]);
		}
	}, [investmentSectors]);

	// Tree Investment Preferences
	const [preferredTreeTypes, setPreferredTreeTypes] = useState<string[]>([]);

	const handleTreeTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setPreferredTreeTypes([...preferredTreeTypes, e.target.value]);
		} else {
			setPreferredTreeTypes(
				preferredTreeTypes.filter((treeType) => treeType !== e.target.value)
			);
		}
	};

	const [preferredEnergyTypes, setPreferredEnergyTypes] = useState<string[]>(
		[]
	);

	const handleEnergyTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setPreferredEnergyTypes([...preferredEnergyTypes, e.target.value]);
		} else {
			setPreferredEnergyTypes(
				preferredEnergyTypes.filter(
					(energyType) => energyType !== e.target.value
				)
			);
		}
	};
	const city = useAppSelector((state: RootState) => state.onboarding.city);
	const stateProvince = useAppSelector(
		(state: RootState) => state.onboarding.stateProvince
	);
	const country = useAppSelector(
		(state: RootState) => state.onboarding.country
	);
	const handleUpdateProducerOnboardingStatus = async (onboardingId: string) => {
		const { data, error } = await supabase
			.from("producers")
			.update({
				onboarding_complete: true,
				onboarding_id: onboardingId,
			})
			.eq("user_id", user.id);
		if (error) {
			console.error("Error updating investor onboarding status:", error);
			toast.error(
				`Error updating investor onboarding status: ${error.message}`
			);
			return;
		}
		if (data) {
		}
		dispatch(setUser({ ...user, investorOnboardingComplete: true }));
	};

	const handleUpdateProducerOnboardingData = async () => {
		const { data, error } = await supabase
			.from("producer_onboarding")
			.insert([
				{
					id: uuidv4(),
					user_id: user.id,
				},
			])
			.select();
		if (error) {
			console.error("Error updating investor onboarding data:", error);
			toast.error(`Error updating investor onboarding data: ${error.message}`);
		}
		if (data) {
			handleUpdateProducerOnboardingStatus(data[0].id);
		}
	};

	// Here we manage the view of the onboarding steps
	const [step, setStep] = useState(1);
	const handleNextStep = () => {
		setStep(step + 1);
	};
	const handlePreviousStep = () => {
		setStep(step - 1);
	};

	const renderInvestorOnboardingContent = () => {
		switch (step) {
			case 1:
				return <ProducerOnboardingAddress handleNextStep={handleNextStep} />;

			case 5:
				return (
					<ProducerOnboardingSubmit
						handleUpdateProducerOnboardingData={
							handleUpdateProducerOnboardingData
						}
					/>
				);
		}
	};
	return (
		<div className='my-8'>
			<LinearProgress
				variant='determinate'
				color='success'
				value={(step - 1) * 25}
			/>
			<div className='flex justify-end'>
				{step !== 5 ? (
					<p className='text-xs font-light mt-[4px]'>Step {step} / 4</p>
				) : (
					<p className='text-xs font-light mt-[4px]'>Onboarding Complete</p>
				)}
			</div>
			<form>{renderInvestorOnboardingContent()}</form>
		</div>
	);
}
