"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import { setUser } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import InvestorOnboardingGoals from "./InvestorOnboardingGoals";
import InvestorOnboardingRiskToleranceAndTimeHorizon from "./InvestorOnboardingRiskToleranceAndTimeHorizon";
import LinearProgress from "@mui/material/LinearProgress";
import InvestorOnboardingImpact from "./InvestorOnboardingImpact";
import InvestorOnboardingCompliance from "./InvestorOnboardingCompliance";
import InvestorOnboardingSubmit from "./InvestorOnboardingSubmit";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function InvestorOnboarding() {
	const [investmentGoals, setInvestmentGoals] = useState<string[]>([]);
	const [otherInvestmentGoal, setOtherInvestmentGoal] = useState("");
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user);
	const [investmentSectors, setInvestmentSectors] = useState<string[]>([]);

	const router = useRouter();

	// redundant id check to prevent no investor user profile from not being created
	const createInvestorProfile = async () => {
		const { data, error } = await supabase
			.from("investors")
			.insert([
				{
					user_id: user.id,
				},
			])
			.select();
		if (error) {
			console.error("Error inserting investor:", error.message);
		}
		if (data) {
			dispatch(setUser({ ...user, investorId: data[0].id }));
		}
	};

	useEffect(() => {
		if (user.id && user.investorId === "" && user.roles.includes("investor")) {
			createInvestorProfile();
		}
	}, [user.id]);

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setInvestmentGoals([...investmentGoals, e.target.value]);
		} else {
			setInvestmentGoals(
				investmentGoals.filter((goal) => goal !== e.target.value)
			);
		}
	};

	// Here we manage the logic for the "Both" checkbox.
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

	// If the user selects both Trees and Renewable Energy, we add "Both" to the investmentSectors array.
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

	const [riskTolerance, setRiskTolerance] = useState(5);
	const [timeHorizon, setTimeHorizon] = useState("");

	const handleTimeHorizonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTimeHorizon(e.target.value);
	};

	const [investmentFluctuations, setInvestmentFluctuations] = useState("");

	const handleInvestmentFluctuationsChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setInvestmentFluctuations(e.target.value);
	};

	const [investmentImpact, setInvestmentImpact] = useState<string[]>([]);
	const [otherInvestmentImpact, setOtherInvestmentImpact] = useState("");

	const handleInvestmentImpactChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.checked) {
			setInvestmentImpact([...investmentImpact, e.target.value]);
		} else {
			setInvestmentImpact(
				investmentImpact.filter((impact) => impact !== e.target.value)
			);
		}
	};

	const [investmentRegions, setInvestmentRegions] = useState<string>("");

	const [accreditedInvestor, setAccreditedInvestor] = useState("");

	const handleAccreditedInvestorChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setAccreditedInvestor(e.target.value);
	};

	const [investmentRiskAgreement, setInvestmentRiskAgreement] = useState("");

	const handleInvestmentRiskAgreementChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setInvestmentRiskAgreement(e.target.value);
	};

	// As the onboarding data is submitted, we update the investor's onboarding status
	// along with the onboarding_survey id that's related to the investor_onboarding table in supabase.
	const handleUpdateInvestorOnboardingStatus = async (onboardingId: string) => {
		const { data, error } = await supabase
			.from("investors")
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

	// Here we submit the onboarding survey data to supabase.
	// TODO: Convert to redux.
	const handleUpdateInvestorOnboardingData = async () => {
		let allGoals = [...investmentGoals];
		if (otherInvestmentGoal !== "") {
			allGoals = [...investmentGoals, otherInvestmentGoal];
		}
		let allImpact = [...investmentImpact];
		if (otherInvestmentImpact !== "") {
			allImpact = [...investmentImpact, otherInvestmentImpact];
		}
		console.log(
			`allGoals: ${allGoals}, allImpact ${allImpact}, user: ${user.id}, accreditedInvestor: ${accreditedInvestor}, investmentRiskAgreement: ${investmentRiskAgreement},
			investmentSector: ${investmentSectors}, investmentRegions: ${investmentRegions}, investmentFluctuations: ${investmentFluctuations}, timeHorizon: ${timeHorizon}, riskTolerance: ${riskTolerance}, preferredTreeTypes: ${preferredTreeTypes}, preferredEnergyTypes: ${preferredEnergyTypes}
			`
		);
		const { data, error } = await supabase
			.from("investor_onboarding")
			.insert([
				{
					id: uuidv4(),
					user_id: user.id,
					goals: allGoals,
					sectors: investmentSectors,
					renewable_energy_preferences: preferredEnergyTypes,
					tree_preferences: preferredTreeTypes,
					risk_tolerance: riskTolerance,
					time_horizon: timeHorizon,
					okay_with_investment_fluctuations: investmentFluctuations,
					impact: allImpact,
					regions: investmentRegions,
					is_accredited_investor: accreditedInvestor,
					agreed_to_risk: investmentRiskAgreement,
				},
			])
			.select();
		if (error) {
			console.error("Error updating investor onboarding data:", error);
			toast.error(`Error updating investor onboarding data: ${error.message}`);
		}
		if (data) {
			handleUpdateInvestorOnboardingStatus(data[0].id);
		}
	};

	// Here we manage the view of the onboarding steps.
	const [step, setStep] = useState(1);
	const handleNextStep = () => {
		setStep(step + 1);
	};
	const handlePreviousStep = () => {
		setStep(step - 1);
	};

	// Here we render the onboarding content based on the step.
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
						handleNextStep={handleNextStep}
						handlePreviousStep={handlePreviousStep}
						timeHorizon={timeHorizon}
						setTimeHorizon={setTimeHorizon}
						handleTimeHorizonChange={handleTimeHorizonChange}
						investmentFluctuations={investmentFluctuations}
						handleInvestmentFluctuationsChange={
							handleInvestmentFluctuationsChange
						}
					/>
				);
			case 3:
				return (
					<InvestorOnboardingImpact
						investmentImpact={investmentImpact}
						handleInvestmentImpactChange={handleInvestmentImpactChange}
						otherInvestmentImpact={otherInvestmentImpact}
						setOtherInvestmentImpact={setOtherInvestmentImpact}
						handleNextStep={handleNextStep}
						handlePreviousStep={handlePreviousStep}
						investmentRegions={investmentRegions}
						setInvestmentRegions={setInvestmentRegions}
					/>
				);
			case 4:
				return (
					<InvestorOnboardingCompliance
						accreditedInvestor={accreditedInvestor}
						handleAccreditedInvestorChange={handleAccreditedInvestorChange}
						handleNextStep={handleNextStep}
						handlePreviousStep={handlePreviousStep}
						investmentRiskAgreement={investmentRiskAgreement}
						handleInvestmentRiskAgreementChange={
							handleInvestmentRiskAgreementChange
						}
					/>
				);

			case 5:
				return (
					<InvestorOnboardingSubmit
						handleUpdateInvestorOnboardingData={
							handleUpdateInvestorOnboardingData
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
