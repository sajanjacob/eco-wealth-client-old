import React, { useEffect, useState } from "react";

type Props = {
	investmentImpact: string[];
	handleInvestmentImpactChange: (
		e: React.ChangeEvent<HTMLInputElement>
	) => void;
	otherInvestmentImpact: string;
	setOtherInvestmentImpact: React.Dispatch<React.SetStateAction<string>>;
	handleNextStep: () => void;
	handlePreviousStep: () => void;
	investmentRegions: string;
	setInvestmentRegions: React.Dispatch<React.SetStateAction<string>>;
};

export default function InvestorOnboardingImpact({
	investmentImpact,
	handleInvestmentImpactChange,
	otherInvestmentImpact,
	setOtherInvestmentImpact,
	handleNextStep,
	handlePreviousStep,
	investmentRegions,
	setInvestmentRegions,
}: Props) {
	const [disableNextStep, setDisableNextStep] = useState(true);
	useEffect(() => {
		if (investmentImpact.length > 0) {
			setDisableNextStep(false);
		} else {
			setDisableNextStep(true);
		}
	}, [investmentImpact]);

	return (
		<div>
			<fieldset className='flex flex-col'>
				<legend className='text-xl font-light mb-2'>
					What kind of impact are you looking to have through your investments?
				</legend>
				<label
					htmlFor='impact1'
					className='flex items-center m-3'
				>
					<input
						id='impact1'
						type='checkbox'
						value='Short-term profit'
						checked={investmentImpact.includes("Short-term profit")}
						onChange={handleInvestmentImpactChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Short-term profit
				</label>
				<label
					htmlFor='impact2 '
					className='flex items-center m-3'
				>
					<input
						id='impact2'
						type='checkbox'
						value='Long-term profit'
						checked={investmentImpact.includes("Long-term profit")}
						onChange={handleInvestmentImpactChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Long-term profit
				</label>
				<label
					htmlFor='impact3 '
					className='flex items-center m-3'
				>
					<input
						id='impact3'
						type='checkbox'
						value='Diversify portfolio'
						checked={investmentImpact.includes("Diversify portfolio")}
						onChange={handleInvestmentImpactChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Diversify portfolio
				</label>
				<label
					htmlFor='other '
					className='flex items-center m-3'
				>
					<input
						id='other'
						type='checkbox'
						value='other'
						checked={investmentImpact.includes("other")}
						onChange={handleInvestmentImpactChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Other
					{investmentImpact.includes("other") && (
						<input
							type='text'
							className='ml-2 rounded-md w-[500px] text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
							value={otherInvestmentImpact}
							onChange={(e) => setOtherInvestmentImpact(e.target.value)}
						/>
					)}
				</label>
				<label
					htmlFor='investmentRegions'
					className='flex flex-col m-3'
				>
					<legend className='text-xl font-light mb-2'>
						Are there any specific regions you are interested in investing in?
					</legend>
					<input
						type='text'
						className='rounded-md w-[500px] text-lg text-gray-700 p-[4px] outline-green-400 transition-colors'
						value={investmentRegions}
						onChange={(e) => setInvestmentRegions(e.target.value)}
					/>
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
