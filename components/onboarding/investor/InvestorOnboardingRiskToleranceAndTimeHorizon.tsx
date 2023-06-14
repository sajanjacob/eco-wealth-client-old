import React, { useEffect, useState } from "react";

type Props = {
	riskTolerance: number;
	setRiskTolerance: React.Dispatch<React.SetStateAction<number>>;
	handleNextStep: () => void;
	handlePreviousStep: () => void;
	timeHorizon: string;
	setTimeHorizon: React.Dispatch<React.SetStateAction<string>>;
	handleTimeHorizonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	investmentFluctuations: string;
	handleInvestmentFluctuationsChange: (
		e: React.ChangeEvent<HTMLInputElement>
	) => void;
};

export default function InvestorOnboardingRiskToleranceAndTimeHorizon({
	riskTolerance,
	setRiskTolerance,
	handleNextStep,
	handlePreviousStep,
	timeHorizon,
	handleTimeHorizonChange,
	investmentFluctuations,
	handleInvestmentFluctuationsChange,
}: Props) {
	const [disableNextStep, setDisableNextStep] = useState(true);
	useEffect(() => {
		if (timeHorizon !== "" && investmentFluctuations !== "") {
			setDisableNextStep(false);
		} else {
			setDisableNextStep(true);
		}
	}, [riskTolerance, timeHorizon, investmentFluctuations]);

	return (
		<div>
			<fieldset>
				<label
					htmlFor='riskTolerance'
					className='flex flex-col'
				>
					<p>On a scale of 0-10, how would you rate your tolerance for risk?</p>
					<div className='flex items-center'>
						<input
							id='riskTolerance'
							type='range'
							min={0}
							max={10}
							value={riskTolerance}
							onChange={(e) => setRiskTolerance(e.target.valueAsNumber)}
							required
							className='mt-4 mb-2 flex-1'
						/>
						<span className='text-lg m-2 mt-3'>{riskTolerance}</span>
					</div>
					<div className='flex justify-between items-center'>
						<span className='text-sm text-red-400'>Not tolerant</span>

						<span className='text-sm text-green-400'>Extremely tolerant</span>
					</div>
				</label>
				<label htmlFor='timeHorizon'>
					<p className='mt-6'>What is your expected investment time horizon?</p>
					<label
						htmlFor='time1'
						className='flex items-center m-3'
					>
						<input
							id='time1'
							type='radio'
							value='Short-term (1-3 years)'
							checked={timeHorizon === "Short-term (1-3 years)"}
							onChange={handleTimeHorizonChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Short-term (1-3 years)
					</label>
					<label
						htmlFor='time2 '
						className='flex items-center m-3'
					>
						<input
							id='time2'
							type='radio'
							value='Medium-term (4-6 years)'
							checked={timeHorizon === "Medium-term (4-6 years)"}
							onChange={handleTimeHorizonChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Medium-term (4-6 years)
					</label>
					<label
						htmlFor='time3 '
						className='flex items-center m-3'
					>
						<input
							id='time3'
							type='radio'
							value='Long-term (7+ years)'
							checked={timeHorizon === "Long-term (7+ years)"}
							onChange={handleTimeHorizonChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Long-term (7+ years)
					</label>
				</label>

				<label htmlFor='investmentFluctuations'>
					<p className='mt-6'>
						Are you comfortable with potential fluctuations in your investment
						value?
					</p>
					<label
						htmlFor='investmentFluctuations1'
						className='flex items-center m-3'
					>
						<input
							id='investmentFluctuations1'
							type='radio'
							value='Yes'
							checked={investmentFluctuations === "Yes"}
							onChange={handleInvestmentFluctuationsChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						Yes
					</label>
					<label
						htmlFor='investmentFluctuations2 '
						className='flex items-center m-3'
					>
						<input
							id='investmentFluctuations2'
							type='radio'
							value='Yes'
							checked={investmentFluctuations === "No"}
							onChange={handleInvestmentFluctuationsChange}
							className='mr-2 w-5 h-5 cursor-pointer'
						/>
						No
					</label>
				</label>
			</fieldset>
			<div className='flex justify-between mt-12'>
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
					onClick={handleNextStep}
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
