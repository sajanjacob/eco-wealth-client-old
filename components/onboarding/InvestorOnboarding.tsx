"use client";
import React, { use, useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import InvestorOnboardingGoals from "./InvestorOnboardingGoals";
import InvestorOnboardingRiskToleranceAndTimeHorizon from "./InvestorOnboardingRiskToleranceAndTimeHorizon";

export default function InvestorOnboarding() {
	const [investmentExperience, setInvestmentExperience] = useState("");
	const [investmentAmount, setInvestmentAmount] = useState("");
	const [investmentSector, setInvestmentSector] = useState("");
	const [investmentGoals, setInvestmentGoals] = useState<string[]>([]);
	const [otherInvestmentGoal, setOtherInvestmentGoal] = useState("");
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	const [investmentSectors, setInvestmentSectors] = useState<string[]>([]);

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const { error } = await supabase
			.from("users")
			.update({
				investment_goal: investmentGoals,
				investment_experience: investmentExperience,
				investment_amount: investmentAmount,
				investment_sector: investmentSector,
			})
			.eq("id", user.id);

		if (error) {
			console.error("Error updating user data:", error);
		} else {
			const goals = {
				investment_goal: investmentGoals,
				investment_experience: investmentExperience,
				investment_amount: investmentAmount,
				investment_sector: investmentSector,
			};
			// const { data, error } = await supabase
			//     .from("investors")
			//     .update({})
			// const { data, error } = await supabase
			//     .from("users")
			//     .update({investor_onboarding_complete: true})
			//     .eq("id", user.id);
			dispatch(setUser({ ...user, investorOnboardingComplete: true }));
		}
	};

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
	const [step, setStep] = useState(1);

	const handleNextStep = () => {
		setStep(step + 1);
	};
	const handlePreviousStep = () => {
		setStep(step - 1);
	};

	const [riskTolerance, setRiskTolerance] = useState("");
	const [timeHorizon, setTimeHorizon] = useState("");
	const renderInvestorOnboardingContent = () => {
		switch (step) {
			case 1:
				return (
					<InvestorOnboardingGoals
						investmentGoals={investmentGoals}
						handleCheckboxChange={handleCheckboxChange}
						otherInvestmentGoal={otherInvestmentGoal}
						investmentSectors={investmentSectors}
						setOtherInvestmentGoal={setOtherInvestmentGoal}
						handleSectorCheckboxChange={handleSectorCheckboxChange}
						preferredEnergyTypes={preferredEnergyTypes}
						handleEnergyTypeChange={handleEnergyTypeChange}
						preferredTreeTypes={preferredTreeTypes}
						handleTreeTypeChange={handleTreeTypeChange}
						handleNextStep={handleNextStep}
					/>
				);
			case 2:
				return (
					<InvestorOnboardingRiskToleranceAndTimeHorizon
						riskTolerance={riskTolerance}
						setRiskTolerance={setRiskTolerance}
					/>
				);
		}
	};
	return (
		<div className='my-8'>
			<form onSubmit={handleFormSubmit}>
				{renderInvestorOnboardingContent()}
			</form>
		</div>
	);
}
