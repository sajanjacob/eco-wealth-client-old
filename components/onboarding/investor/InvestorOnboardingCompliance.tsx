import React, { useEffect, useState } from "react";

type Props = {
	handleNextStep: () => void;
	handlePreviousStep: () => void;
	accreditedInvestor: string;
	handleAccreditedInvestorChange: (
		e: React.ChangeEvent<HTMLInputElement>
	) => void;
	investmentRiskAgreement: string;
	handleInvestmentRiskAgreementChange: (
		e: React.ChangeEvent<HTMLInputElement>
	) => void;
};

export default function InvestorOnboardingCompliance({
	handleNextStep,
	handlePreviousStep,
	accreditedInvestor,
	handleAccreditedInvestorChange,
	investmentRiskAgreement,
	handleInvestmentRiskAgreementChange,
}: Props) {
	const [disableNextStep, setDisableNextStep] = useState(true);
	useEffect(() => {
		if (
			accreditedInvestor !== "" &&
			investmentRiskAgreement !== "" &&
			investmentRiskAgreement === "Yes"
		) {
			setDisableNextStep(false);
		} else {
			setDisableNextStep(true);
		}
	}, [accreditedInvestor, investmentRiskAgreement]);

	return (
		<div>
			<fieldset className='flex flex-col'>
				<legend className='text-xl font-light mb-2'>
					Are you an accredited investor according to the regulations in your
					country?
				</legend>
				<label
					htmlFor='accreditedInvestor'
					className='flex items-center m-3'
				>
					<input
						id='accreditedInvestorYes'
						type='radio'
						value='Yes'
						checked={accreditedInvestor === "Yes"}
						onChange={handleAccreditedInvestorChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Yes
				</label>
				<label
					htmlFor='accreditedInvestorNo'
					className='flex items-center m-3'
				>
					<input
						id='accreditedInvestorNo'
						type='radio'
						value='No'
						checked={accreditedInvestor === "No"}
						onChange={handleAccreditedInvestorChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					No
				</label>
				<label>
					There are many risks associated with investing into Tree-Based
					Agriculture and Renewable Energy such as environmental, market,
					regulatory, management, time horizon, technological, and operational
					risks.
				</label>
				<div className='h-[400px] overflow-y-auto border-2 border-white p-4 rounded-md my-3 text-sm text-gray-300'>
					<h3 className='font-bold text-3xl !text-white'>
						Here are risks with investing in Trees:
					</h3>
					<hr className='mt-3 border-gray-500' />
					<h5 className='font-semibold text-xl mt-3'>Environmental Risks:</h5>
					<p>
						Natural disasters like forest fires, hurricanes, pests, or diseases
						can cause significant damage to the trees, leading to losses.
						Initial investments will be covered under Government backed
						insurance schemes but there is no guarantee that the insurance will
						cover the full amount of the investment. Every effort will be made
						to minimize risks while maximizing returns.
					</p>
					<h5 className='font-semibold text-xl mt-3'>Market Risks:</h5>
					<p>
						The market for timber and other tree-derived products can be
						unpredictable. Prices for these commodities can fluctuate due to
						changes in supply and demand. Eco Wealth will vet and select ideal
						candidates to produce and manage trees however there is no guarantee
						that the trees will be sold for a profit.
					</p>
					<h5 className='font-semibold text-xl mt-3'>Regulatory Risks:</h5>
					<p>
						Regulations related to forestry, environmental protection, and land
						use can change, potentially impacting the profitability of tree
						investments. By working with policy makers, we will push for a more
						stable market for tree-derived products and premium returns for
						products coming from soils with high soil organic matter content but
						policies are ultimately in the hands of the people to voice their
						collective desire and need for policies that encourage profitable
						investments into environmental projects.
					</p>
					<h5 className='font-semibold text-xl mt-3'>Management Risks:</h5>
					<p>
						The health and growth of trees depend significantly on good forest
						management. Ineffective management can lead to reduced growth rates
						and lower returns. Eco Wealth will vet and select ideal candidates
						to produce and manage trees however there is no guarantee that the
						trees will be managed effectively by third party producers.
						Producers are provided with a management plan, education, access to
						soil experts, and are required to provide regular updates on the
						progress of the trees. Investors are put first and will be backed by
						Eco Wealth in the event of a loss due to fraudulent behaviour
						meaning that the initial investment will be returned to the
						investor.
					</p>
					<h5 className='font-semibold text-xl mt-3'>Time Horizon Risk:</h5>
					<p>
						Trees take a long time to grow before they can be harvested for
						profit. Investors need to have a long-term investment horizon and be
						aware that returns will not be immediate.
					</p>
					<h4 className='font-bold text-3xl mt-4 !text-white'>
						Here are risks with investing in Renewable Energy:
					</h4>
					<hr className='mt-3 border-gray-500' />
					<h5 className='font-semibold text-xl mt-3'>Technological Risks:</h5>
					<p>
						Renewable energy technologies are still evolving. There&apos;s a
						risk that a given technology may become obsolete, or a more
						efficient technology might emerge. Eco Wealth will provide as much
						information as possible about the technology and the company behind
						it to help investors make informed decisions however it is up to
						each individual investor to do their own due diligence before
						investing.
					</p>
					<h5 className='font-semibold text-xl mt-3'>Regulatory Risks:</h5>
					<p>
						Policies and regulations related to renewable energy can change. For
						example, changes in government incentives or subsidies can directly
						impact the profitability of renewable energy investments.
					</p>
					<h5 className='font-semibold text-xl mt-3'>Market Risks:</h5>
					<p>
						Energy prices fluctuate due to various factors, including
						geopolitical events, changes in supply and demand, and shifts in
						energy policy. This volatility can impact the return on investment
						from renewable energy projects.
					</p>
					<h5 className='font-semibold text-xl mt-3'>Environmental Risks: </h5>
					<p>
						While renewable energy is generally more environmentally friendly
						than fossil fuels, projects can still face opposition due to their
						impact on local ecosystems. For example, wind farms can be
						controversial due to their impact on bird populations, and
						hydroelectric projects can disrupt aquatic ecosystems.
					</p>
					<h5 className='font-semibold text-xl mt-3'>Operational Risks: </h5>
					<p>
						As with any infrastructure project, renewable energy installations
						come with operational risks, including maintenance issues, equipment
						failure, and potential for accidents. Eco Wealth will vet and select
						ideal candidates to produce and manage renewable energy projects
						however there is no guarantee that the projects will be managed
						effectively by third party producers. Producers are provided with a
						management plan, education, access to energy experts, and are
						required to provide regular updates on the progress of the projects.
						Investors are put first and will be backed by Eco Wealth in the
						event of a loss due to fraudulent behaviour meaning that the initial
						investment will be returned to the investor.
					</p>
				</div>
				<legend className='text-xl font-light mb-2'>
					After reading the above, do you understand the risks associated with
					investing in trees & renewable energy, and agree to continue with
					creating an investor account despite the risks?
				</legend>
				<label
					htmlFor='accreditedInvestor'
					className='flex items-center m-3'
				>
					<input
						id='accreditedInvestorYes'
						type='radio'
						value='Yes'
						checked={investmentRiskAgreement === "Yes"}
						onChange={handleInvestmentRiskAgreementChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					Yes
				</label>
				<label
					htmlFor='accreditedInvestorNo'
					className='flex items-center m-3'
				>
					<input
						id='accreditedInvestorNo'
						type='radio'
						value='No'
						checked={investmentRiskAgreement === "No"}
						onChange={handleInvestmentRiskAgreementChange}
						className='mr-2 w-5 h-5 cursor-pointer'
					/>
					No
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
