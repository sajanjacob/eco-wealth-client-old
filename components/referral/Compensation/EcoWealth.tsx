import React from "react";

type Props = {};

// Define the types for your items and commissions
type Item = {
	name: string;
	commissions: number[]; // Assuming this array matches the tiers order
};

// Example data for items and their commission percentages for different tiers
const items: Item[] = [{ name: "Investor Account", commissions: [25] }];
const producerItems: Item[] = [
	{ name: "Producer Account", commissions: [100] },
];

const tiers = ["After 3 sales"];
const producerTiers = ["Every funded project"];

const TieredCommissionTable: React.FC<{ items: Item[]; tiers: string[] }> = ({
	items,
	tiers,
}) => {
	return (
		<div className='overflow-x-auto my-4'>
			<table className='min-w-1/2 divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							Item / Tier
						</th>
						{tiers.map((tier, index) => (
							<th
								key={index}
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								{tier}
							</th>
						))}
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{items.map((item, itemIndex) => (
						<tr key={itemIndex}>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
								{item.name}
							</td>
							{item.commissions.map((commission, commissionIndex) => (
								<td
									key={commissionIndex}
									className='text-green-700 font-bold px-6 py-4 whitespace-nowrap text-sm'
								>
									${commission}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default function EcoWealth({}: Props) {
	return (
		<div>
			<h3 className='text-gray-400 text-sm py-2'>
				<b>Note:</b> All Eco Wealth sales are collaborative sales meaning
				referral ambassadors can stack referral ids with other ambassadors
				before an account is created and split the sale commissions. Commissions
				are subject to change throughout alpha and beta testing, and when the
				platform is live.
			</h3>
			<TieredCommissionTable
				items={items}
				tiers={tiers}
			/>
			<TieredCommissionTable
				items={producerItems}
				tiers={producerTiers}
			/>
		</div>
	);
}
