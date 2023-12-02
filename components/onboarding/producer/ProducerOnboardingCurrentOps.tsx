import { setOnboarding } from "@/redux/features/onboardingSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";

type Props = { handleNextStep: () => void; handlePreviousStep: () => void };

export default function ProducerOnboardingCurrentOps({
	handleNextStep,
	handlePreviousStep,
}: Props) {
	const operationType = useAppSelector(
		(state: RootState) => state.onboarding.operationType
	);
	const dispatch = useAppDispatch();
	const [treeTypes, setTreeTypes] = useState<string>("");
	const [solarTypes, setSolarTypes] = useState<string>("");
	const handleTreeTypesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTreeTypes(e.target.value);
	};
	const handleSolarTypesChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setSolarTypes(e.target.value);
	};
	const onboarding = useAppSelector((state: RootState) => state.onboarding);

	const [treeOpSize, setTreeOpSize] = useState<number>(0);
	const [solarOpSize, setSolarOpSize] = useState<number>(0);
	const [hasTreeFarmOperation, setHasTreeFarmOperation] = useState<string>("");
	const [hasSolarFarmOperation, setHasSolarFarmOperation] =
		useState<string>("");
	const handleHasTreeFarmOperationChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setHasTreeFarmOperation(e.target.value);
	};
	const handleHasSolarFarmOperationChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setHasSolarFarmOperation(e.target.value);
	};

	const [disableNextStep, setDisableNextStep] = useState(true);
	useEffect(() => {
		if (operationType.includes("Trees") && hasTreeFarmOperation === "")
			return setDisableNextStep(true);
		if (operationType.includes("Solar Farm") && hasSolarFarmOperation === "")
			return setDisableNextStep(true);
		if (
			operationType.includes("Trees") &&
			hasTreeFarmOperation === "Yes" &&
			treeTypes === "" &&
			treeOpSize === 0
		)
			return setDisableNextStep(true);
		if (
			operationType.includes("Solar Farm") &&
			hasSolarFarmOperation === "Yes" &&
			solarTypes === "" &&
			solarOpSize === 0
		)
			return setDisableNextStep(true);
		setDisableNextStep(false);
	}, [
		hasTreeFarmOperation,
		hasSolarFarmOperation,
		operationType,
		treeTypes,
		treeOpSize,
		solarTypes,
		solarOpSize,
	]);
	const handleContinue = () => {
		if (operationType.includes("Trees")) {
			dispatch(
				setOnboarding({
					...onboarding,
					treeTypes: treeTypes,
					treeOpSize: treeOpSize.toString(),
				})
			);
		}
		if (operationType.includes("Solar Farm")) {
			dispatch(
				setOnboarding({
					...onboarding,
					solarTypes: solarTypes,
					solarOpSize: solarOpSize.toString(),
				})
			);
		}
		handleNextStep();
	};
	return (
		<div>
			<fieldset className='flex flex-col'>
				{operationType.includes("Trees") && (
					<>
						<legend className='lg:text-xl font-light mb-2'>
							Do you have trees you&apos;re currently growing to earn income
							with?
						</legend>
						<label
							htmlFor='hasTreeFarmOperation'
							className='flex items-center mb-2'
						>
							<input
								id='hasTreeFarmOperationYes'
								type='radio'
								value='Yes'
								checked={hasTreeFarmOperation === "Yes"}
								onChange={handleHasTreeFarmOperationChange}
								className='mr-2 w-5 h-5 cursor-pointer'
							/>
							Yes
						</label>
						<label
							htmlFor='hasTreeFarmOperationNo'
							className='flex items-center'
						>
							<input
								id='hasTreeFarmOperationNo'
								type='radio'
								value='No'
								checked={hasTreeFarmOperation === "No"}
								onChange={handleHasTreeFarmOperationChange}
								className='mr-2 w-5 h-5 cursor-pointer'
							/>
							No
						</label>
						{hasTreeFarmOperation === "Yes" && (
							<>
								<legend className='lg:text-xl font-light mb-2 mt-3'>
									What types of trees do you currently have on your property?
								</legend>
								<label
									htmlFor='currentTreesOrSystems'
									className='flex items-center'
								>
									<textarea
										id='currentTreesOrSystems'
										value={treeTypes}
										onChange={handleTreeTypesChange}
										className='w-full mt-3 min-h-[120px] rounded-md text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
									/>
								</label>
							</>
						)}

						{treeTypes !== "" && (
							<>
								<label
									htmlFor='treeOpSize'
									className='flex flex-col mt-3'
								>
									<div className='flex justify-between items-center'>
										<p className='lg:text-xl font-light'>
											How many trees do you have on your property?
										</p>
										<span className='m-2 text-2xl'>
											🌳 {treeOpSize === 20000 ? "20,000+" : treeOpSize}
										</span>
									</div>
									<input
										id='treeOpSize'
										type='range'
										min={0}
										max={20000}
										step={100}
										value={treeOpSize}
										onChange={(e) => setTreeOpSize(e.target.valueAsNumber)}
										required
										className='mt-[4px] mb-2'
									/>
								</label>
							</>
						)}
					</>
				)}
				<hr className='my-6 border-green-800' />
				{operationType.includes("Solar Farm") && (
					<>
						{" "}
						<legend className='lg:text-xl font-light mb-2'>
							Do you have solar panels you&apos;re currently operating to earn
							income with?
						</legend>
						<label
							htmlFor='hasSolarFarmOperation'
							className='flex items-center m-3'
						>
							<input
								id='hasSolarFarmOperationYes'
								type='radio'
								value='Yes'
								checked={hasSolarFarmOperation === "Yes"}
								onChange={handleHasSolarFarmOperationChange}
								className='mr-2 w-5 h-5 cursor-pointer'
							/>
							Yes
						</label>
						<label
							htmlFor='hasSolarFarmOperationNo'
							className='flex items-center m-3'
						>
							<input
								id='hasSolarFarmOperationNo'
								type='radio'
								value='No'
								checked={hasSolarFarmOperation === "No"}
								onChange={handleHasSolarFarmOperationChange}
								className='mr-2 w-5 h-5 cursor-pointer'
							/>
							No
						</label>
						{hasSolarFarmOperation === "Yes" && (
							<>
								<legend className='lg:text-xl font-light mb-2 mt-6'>
									What type(s) of solar panel systems do you currently have
									setup?
								</legend>
								<label
									htmlFor='currentTreesOrSystems'
									className='flex items-center'
								>
									<textarea
										id='currentTreesOrSystems'
										value={solarTypes}
										onChange={handleSolarTypesChange}
										className='w-full mt-3 min-h-[120px] rounded-md text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
									/>
								</label>
							</>
						)}
					</>
				)}
				{solarTypes !== "" && (
					<>
						<label
							htmlFor='solarOpSize'
							className='flex flex-col mt-3'
						>
							<div className='flex justify-between items-center'>
								<p className='lg:text-xl font-light'>
									How many solar panels do you have on your property?
								</p>
								<span className='m-2 text-2xl'>
									🔆 {solarOpSize === 10000 ? "10,000+" : solarOpSize}
								</span>
							</div>
							<input
								id='solarOpSize'
								type='range'
								min={0}
								max={10000}
								step={100}
								value={solarOpSize}
								onChange={(e) => setSolarOpSize(e.target.valueAsNumber)}
								required
								className='mt-[4px] mb-2'
							/>
						</label>
					</>
				)}
			</fieldset>
			<div className='flex justify-between mt-6'>
				<button
					type='button'
					onClick={handlePreviousStep}
					className={
						"w-[33%] bg-transparent border-green-700 border-[1px] hover:bg-green-700 text-green-700 hover:text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors"
					}
				>
					Go Back
				</button>
				<button
					type='button'
					onClick={handleContinue}
					className={
						disableNextStep
							? "w-[33%] bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-default"
							: "w-[33%] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
					}
					disabled={disableNextStep}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
