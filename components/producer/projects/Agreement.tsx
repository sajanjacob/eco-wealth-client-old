import React from "react";

type Props = {
	handleAgreementButtonClick: () => void;
	isNonProfit: boolean;
};

export default function Agreement({
	handleAgreementButtonClick,
	isNonProfit,
}: Props) {
	if (isNonProfit)
		return (
			<div>
				<div className='h-[55vh] overflow-y-scroll custom-scrollbar'>
					<h1 className='text-white text-2xl'>
						Non-Profit Project Owner Agreement
					</h1>
					<h2 className='text-xl my-2'>INTRODUCTION</h2>
					<p>
						This Non-Profit Project Owner Agreement (&ldquo;Agreement&ldquo;) is
						between non-profit project owners (&ldquo;Project Owners&ldquo;) and
						Eco Apps and Automation Inc., operating as Eco Wealth App
						(&ldquo;Platform&ldquo;). This Agreement serves as a binding legal
						contract. Project Owners should review it thoroughly before
						initiating a project on the Platform.
					</p>
					<h3 className='text-xl my-2'>DEFINITIONS</h3>
					<p>
						&ldquo;Project Owners&ldquo; refer to users who initiate and manage
						non-profit projects on the Platform.
					</p>
					<h3 className='text-xl my-2'>TERMS OF USE</h3>
					<p>
						<span className='font-bold'>Use of Funds:</span> Project Owners
						agree to utilize the funds exclusively for the development and
						execution of their projects. Funds are not to be used for personal
						gain or unrelated activities.
					</p>
					<ul className='my-2'>
						<li>1. Detailed budget and expenditure plan for the project.</li>
						<li>
							2. Regular financial reporting to showcase the proper use of
							funds.
						</li>
					</ul>
					<p className='my-2'>
						<span className='font-bold'>Verification:</span> Similar to
						for-profit projects, non-profit Project Owners must undergo property
						verification and provide a comprehensive plan for project
						implementation and fund usage.
					</p>
					<p className='my-2'>
						<span className='font-bold'>No ROI Obligation:</span> Unlike
						for-profit projects, non-profit Project Owners are not required to
						provide a return on investment (ROI) to investors. However, they
						must ensure transparency regarding fund utilization.
					</p>
					<p className='my-2'>
						<span className='font-bold'>Failure to Comply:</span> Non-compliance
						with these terms, including misuse of funds or providing false
						information, will lead to appropriate actions based on the severity
						of the breach. This may include removal from the platform and legal
						action.
					</p>
					<p className='my-2'>
						<span className='font-bold'>Transparency and Reporting:</span>{" "}
						Project Owners are required to provide regular updates and reports
						on project progress and financial management, ensuring transparency
						and accountability.
					</p>
					<p className='my-2'>
						[Include additional clauses as applicable, similar to the for-profit
						agreement, tailored to non-profit projects. This could cover areas
						like dispute resolution, governing law, updates to the agreement,
						representations and warranties, etc.]
					</p>
					<p className='my-2'>
						This Agreement is effective upon the Project Owner&apos;s
						acceptance. By initiating a project on our Platform, you agree to
						these terms.
					</p>
					<p className='my-2'>
						For further inquiries or concerns about this Agreement, please
						contact us at support@ecowealth.app.
					</p>
					<p className='my-2'>
						Eco Apps and Automation Inc. reserves the right to modify this
						Agreement at any time without prior notice.
					</p>
					<div className='flex justify-center'>
						<button
							onClick={handleAgreementButtonClick}
							className='my-8 text-left w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
						>
							I agree to these terms and conditions
						</button>
					</div>
				</div>
			</div>
		);
	if (!isNonProfit)
		return (
			<div>
				<div className='h-[55vh] overflow-y-scroll custom-scrollbar'>
					<h1 className='text-white text-2xl'>
						Producer Agreement (for-profit project)
					</h1>
					<h2 className='text-xl my-2'>INTRODUCTION</h2>
					<p>
						This Producer Agreement (&quot;Agreement&quot;) governs the
						relationship between Producers and Eco Apps and Automation Inc.
						operating as Eco Wealth App (&quot;Platform&quot;). This Agreement
						is a legally binding contract and Producers are encouraged to read
						it carefully before creating a project on the Platform.
					</p>
					<h3 className='text-xl my-2'>DEFINITIONS</h3>
					<p>
						&quot;Producers&quot; refer to users who start and operate projects
						on the Platform.
					</p>
					<h3 className='text-xl my-2'>TERMS OF USE</h3>
					<p>
						<span className='font-bold'>Funding & Profits:</span> Producers who
						receive funds from Investors agree to pay Investors a return on
						investment (&quot;ROI&quot;) each year, once they generate profits.
						Producers also agree to share the following financial information
						related to their projects:
					</p>
					<ul className='my-2'>
						<li>1. The total requested amount for the project.</li>
						<li>
							2. For tree-based agriculture projects, the amount of produce sold
							and the revenue generated.
						</li>
						<li>
							3. For renewable energy projects, the amount of energy sold back
							to the grid and the revenue generated.
						</li>
					</ul>
					<p className='my-2'>
						<span className='font-bold'>Verification:</span> Producers agree to
						undergo property verification and credit checks. The verification
						process will involve a tour of the operation site, assessment
						questions to determine the project operation plan, and revenue
						generation.
					</p>
					<p className='my-2'>
						<span className='font-bold'>
							Use of Funds & Administrative Fee:
						</span>{" "}
						Producers agree to use the funds solely for their business
						operations. Producers acknowledge that an administrative fee of $1
						will be charged for collecting investments from investors. In
						certain cases, the administrative fee will also apply to refunds,
						which will include the $1 fee plus any third-party merchant fees.
					</p>
					<p className='my-2'>
						<span className='font-bold'>Failure to Meet Obligations:</span> In
						the event a Producer fails to meet any obligations outlined in this
						Agreement (including but not limited to, failure to pay the
						administrative fee, failure to provide necessary financial
						information, or failure to pass the verification process), the
						consequence will be determined according to the context and severity
						of the breach. Failure to pass the verification process will result
						in the project not being publicly published and unavailable for
						investments.
					</p>
					<p className='my-2'>
						<span className='font-bold'>Acknowledgement of Risk:</span>{" "}
						Producers acknowledge that there are inherent risks in any business
						venture. While Eco Apps and Automation Inc. will act in good faith
						to facilitate the success of each project, it does not guarantee any
						specific outcomes.
					</p>
					<p className='my-2'>
						<span className='font-bold'>Dispute Resolution:</span> Any disputes
						arising out of this Agreement shall be resolved by mediation,
						arbitration, or court litigation, depending on the severity of the
						dispute. These proceedings shall fall under the jurisdiction of
						Alberta, Canada.
					</p>
					<p className='my-2'>
						<span className='font-bold'>Governing Law:</span> This Agreement
						will be governed by the laws of Alberta, Canada.
					</p>
					<p className='my-2'>
						<span className='font-bold'>Updates to the Agreement:</span> Changes
						to this Agreement will be communicated by email and in-app
						notifications.
					</p>
					<p className='my-2'>
						<span className='font-bold'>Representations and Warranties:</span>{" "}
						Each Producer represents and warrants that they are legitimate and
						capable of entering into this Agreement.
					</p>
					<p className='my-2'>
						This Agreement is effective as of the date the Producer agrees to
						the agreement. By creating a project on our Platform, you agree to
						these terms.
					</p>
					<p className='my-2'>
						For any further queries or concerns about this Agreement, please
						contact us at support@ecowealth.app.
					</p>
					<p className='my-2'>
						Eco Apps and Automation Inc. reserves the right to modify this
						Agreement at any time without prior notice.
					</p>
					<div className='flex justify-center'>
						<button
							onClick={handleAgreementButtonClick}
							className='my-8 text-left w-fit bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
						>
							I agree to these terms and conditions
						</button>
					</div>
				</div>
			</div>
		);
}
