import React from "react";

type Props = {
	investmentAmount: string;
	setInvestmentAmount: React.Dispatch<React.SetStateAction<string>>;
};

export default function InvestorOnboardingAmount({
	investmentAmount,
	setInvestmentAmount,
}: Props) {
	return (
		<fieldset>
			<label htmlFor='investmentAmount'>
				How much do you plan to invest in this sector?
			</label>
			<input
				id='investmentAmount'
				type='number'
				value={investmentAmount}
				onChange={(e) => setInvestmentAmount(e.target.value)}
				required
			/>
		</fieldset>
	);
}
