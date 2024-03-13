import React from "react";

type Props = {};

// Define the types for your items and commissions
type Item = {
	name: string;
	commissions: number[]; // Assuming this array matches the tiers order
};

// Example data for items and their commission percentages for different tiers
const items: Item[] = [
	{ name: "K8", commissions: [275, 550, 825, 1100, 1375] },
	{ name: "JR-IV", commissions: [0, 0, 0, 0, 0] },
	{ name: "SD501", commissions: [0, 0, 0, 0, 0] },
	{ name: "SD501 Platinum", commissions: [0, 0, 0, 0, 0] },
	{ name: "Super 501", commissions: [0, 0, 0, 0, 0] },
	{ name: "SD501U", commissions: [0, 0, 0, 0, 0] },
	{ name: "Anespa", commissions: [0, 0, 0, 0, 0] },
];

const tiers = [
	"1-10 sales",
	"11-25 sales",
	"26-50 sales",
	"51-100 sales",
	"100+ sales",
];

const TieredCommissionTable: React.FC = () => {
	return (
		<div className='overflow-x-auto my-4'>
			<table className='min-w-full divide-y divide-gray-200'>
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
									${commission === 0 ? "--" : commission}
									<span className='text-xs'>/sale</span>
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
				<b>Note:</b> All Enagic sales are collaborative sales meaning referral
				ambassadors can stack referral ids with other ambassadors before a sale
				is made and split the sale commissions.
			</h3>
			<TieredCommissionTable />
		</div>
	);
}
