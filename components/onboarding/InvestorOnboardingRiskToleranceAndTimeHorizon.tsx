import React from "react";

type Props = {
	riskTolerance: string;
	setRiskTolerance: React.Dispatch<React.SetStateAction<string>>;
};

export default function InvestorOnboardingRiskToleranceAndTimeHorizon({
	riskTolerance,
	setRiskTolerance,
}: Props) {
	return (
		<fieldset>
			<label htmlFor='riskTolerance'>
				On a scale of 1-10, how would you rate your tolerance for risk?
			</label>
			<input
				id='riskTolerance'
				type='text'
				value={riskTolerance}
				onChange={(e) => setRiskTolerance(e.target.value)}
				required
			/>
		</fieldset>
	);
}
