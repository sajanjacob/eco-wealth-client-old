import { setOnboarding } from "@/redux/features/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";

type Props = {
	handleNextStep: () => void;
	handlePreviousStep: () => void;
};

export default function ProducerOnboardingGoals({
	handleNextStep,
	handlePreviousStep,
}: Props) {
	const [disableNextStep, setDisableNextStep] = useState(true);

	const [producerGoal, setProducerGoal] = useState("");
	const dispatch = useAppDispatch();
	const onboarding = useAppSelector((state: RootState) => state.onboarding);
	const handleProducerGoalChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setProducerGoal(e.target.value);
	};
	const [operationType, setOperationType] = useState<string[]>([]);
	const handleOperationTypeCheckboxChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (e.target.checked && e.target.value === "Both") {
			setOperationType(["Trees", "Solar Farm", "Both"]);
		} else if (e.target.checked) {
			setOperationType([...operationType, e.target.value]);
		} else if (
			!e.target.checked &&
			e.target.value === "Both" &&
			operationType.includes("Trees") &&
			operationType.includes("Solar Farm")
		) {
			setOperationType([]);
		} else if (
			(!e.target.checked && e.target.value === "Trees") ||
			(!e.target.checked && e.target.value === "Solar Farm")
		) {
			setOperationType(
				operationType.filter(
					(sector) => sector !== e.target.value && sector !== "Both"
				)
			);
		} else {
			setOperationType(
				operationType.filter((sector) => sector !== e.target.value)
			);
		}
	};

	useEffect(() => {
		if (
			operationType.includes("Trees") &&
			operationType.includes("Solar Farm") &&
			operationType.includes("Both")
		) {
			return;
		} else if (
			operationType.includes("Trees") &&
			operationType.includes("Solar Farm")
		) {
			setOperationType([...operationType, "Both"]);
		}
	}, [operationType]);

	// Here we handle the next step button
	useEffect(() => {
		if (producerGoal !== "") {
			setDisableNextStep(true);
		} else {
			setDisableNextStep(false);
		}
	}, [producerGoal]);

	const handleContinue = () => {
		handleNextStep();
		dispatch(
			setOnboarding({
				...onboarding,
				producerGoal: producerGoal,
				operationType: operationType,
			})
		);
	};
	return (
		<>
			{/* Investor's Primary Goal */}
			<fieldset className='flex flex-col'>
				<legend className='text-xl font-light mb-2'>
					What are your goals for your property?
				</legend>
				<label
					htmlFor='goals'
					className='flex items-center m-3'
				>
					<textarea
						id='goals'
						value={producerGoal}
						onChange={handleProducerGoalChange}
						className='rounded-md text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
					/>
				</label>
				<legend className='text-xl font-light mb-2'>
					Do you want to primarily grow trees or setup a solar farm?
				</legend>
				<label
					htmlFor='treeOperation'
					className='flex items-center m-3'
				>
					<input
						id='treeOperation'
						type='checkbox'
						value='Trees'
						checked={operationType.includes("Trees")}
						onChange={handleOperationTypeCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Trees
				</label>
				<label
					htmlFor='solarOperation'
					className='flex items-center m-3'
				>
					<input
						id='solarOperation'
						type='checkbox'
						value='Solar Farm'
						checked={operationType.includes("Solar Farm")}
						onChange={handleOperationTypeCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Solar Farm
				</label>
				<label
					htmlFor='treeAndSolarOperation'
					className='flex items-center m-3'
				>
					<input
						id='treeAndSolarOperation'
						type='checkbox'
						value='Both'
						checked={operationType.includes("Both")}
						onChange={handleOperationTypeCheckboxChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Both
				</label>
			</fieldset>
			<div className='flex justify-end'>
				<button
					type='button'
					onClick={handleContinue}
					className={
						disableNextStep
							? "w-[33%] bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-default"
							: "w-[33%] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					}
					disabled={disableNextStep}
				>
					Continue
				</button>
			</div>
		</>
	);
}
