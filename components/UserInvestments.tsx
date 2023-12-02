import moment from "moment";
import React, { use, useEffect } from "react";
import ManageInvestmentButton from "./ManageInvestmentButton";

type Props = {
	energyInvestments?: any[];
	treeInvestments?: any[];
	treeProjectType?: string;
	totalAmountInvested?: number;
	totalShares?: number;
};

export default function UserInvestments({
	energyInvestments,
	treeInvestments,
	treeProjectType,
	totalAmountInvested,
	totalShares,
}: Props) {
	useEffect(() => {
		console.log("treeInvestments >> ", treeInvestments);
	}, [treeInvestments]);
	return (
		<div className='mt-8 mb-12'>
			<h3 className='text-xl mb-2 font-semibold '>Your Investments</h3>
			<div className='flex mb-4'>
				<p className='text-2xl text-gray-400 mb-2 mr-2'>
					{totalShares && `${totalShares} shares owned`}
					{totalAmountInvested && `, $${totalAmountInvested} invested`}
				</p>
				<button className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors py-2 px-4 rounded text-white mr-2'>
					Sell
				</button>
				<button className='bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors py-2 px-4 rounded text-white'>
					Transfer
				</button>
			</div>
			<div className='mb-4'>
				{energyInvestments?.[0]?.estReturnPerYearUntilRepayment && (
					<p className='text-3xl text-gray-400 mb-2 mr-2 flex items-center'>
						${energyInvestments?.[0]?.estReturnPerYearUntilRepayment.toFixed(2)}{" "}
						<span className='!text-xs ml-2'>
							est. yearly ROI <br />
							until repayment
						</span>
					</p>
				)}
				{energyInvestments?.[0]?.estReturnPerYearAfterRepayment && (
					<p className='text-3xl text-gray-400 mb-2 mr-2 flex items-center'>
						${energyInvestments?.[0]?.estReturnPerYearAfterRepayment.toFixed(2)}{" "}
						<span className='!text-xs ml-2'>
							est. yearly ROI <br />
							after repayment
						</span>
					</p>
				)}
				<p className='text-sm text-gray-400'>
					Note: Return payouts commence after project completed & turning
					profit.
				</p>
			</div>
			{/* 
			TODO: Refactor this to show transaction history instead of investment history 
			
			{energyInvestments?.length !== 0 && (
				<table className='min-w-full divide-y divide-green-800 '>
					<thead className='dark:bg-green-900 dark:bg-opacity-25'>
						<tr>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Amount Invested
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Number of Shares
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Est Yearly ROI Until Repayment
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Est Yearly ROI After Repayment
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Investment Date
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Manage
							</th>
						</tr>
					</thead>
					<tbody className='dark:bg-green-900 dark:bg-opacity-25 divide-y divide-green-800'>
						{energyInvestments?.map((investment, index) => (
							<tr
								key={index}
								className='hover:bg-green-700 hover:bg-opacity-5 transition-colors text-gray-200'
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									${investment?.amount}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									{investment?.numOfShares}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									${investment?.estReturnPerYearUntilRepayment}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									${investment?.estReturnPerYearAfterRepayment}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									{moment(investment?.createdAt).toDate().toDateString()}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
									<ManageInvestmentButton investment={investment} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			{treeInvestments?.length !== 0 && (
				<table className='min-w-full divide-y divide-green-800 '>
					<thead className='dark:bg-green-900 dark:bg-opacity-25'>
						<tr>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Amount Invested
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Number of Shares
							</th>
							{treeProjectType === "Timber / Lumber" ? (
								<>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
									>
										Est Harvest ROI
									</th>
								</>
							) : (
								<>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
									>
										Est ROI Until Repayment
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
									>
										Est ROI After Repayment
									</th>
								</>
							)}
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Investment Date
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'
							>
								Manage
							</th>
						</tr>
					</thead>
					<tbody className='dark:bg-green-900 dark:bg-opacity-25 divide-y divide-green-800'>
						{treeInvestments?.map((investment, index) => (
							<tr
								key={index}
								className='hover:bg-green-900 hover:bg-opacity-5 transition-colors text-gray-200'
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									${investment?.amount}
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									{investment?.numOfShares}
								</td>
								{treeProjectType === "Timber / Lumber" ? (
									<>
										<td className='px-6 py-4 whitespace-nowrap'>
											${investment?.estReturnPerYearUntilRepayment}
										</td>
									</>
								) : (
									<>
										<td className='px-6 py-4 whitespace-nowrap'>
											${investment?.estReturnPerYearUntilRepayment}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											${investment?.estReturnPerYearAfterRepayment}
										</td>
									</>
								)}
								<td className='px-6 py-4 whitespace-nowrap'>
									{moment(investment?.createdAt).toDate().toDateString()}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
									<ManageInvestmentButton investment={investment} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)} */}
		</div>
	);
}
