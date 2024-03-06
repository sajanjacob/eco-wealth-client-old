// components/PricingTable.tsx

import Link from "next/link";
import React from "react";
import { BiCheckCircle } from "react-icons/bi";
import { FaCreditCard, FaBitcoin, FaEthereum } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { RiCoinLine } from "react-icons/ri"; // Assuming RiCoinLine for Monero, adjust as needed

interface PriceDetail {
	amount: string;
	method: "Credit/Debit" | "Bank Wire/Transfer" | "BTC" | "Ethereum" | "Monero";
	comingSoon?: boolean;
}

interface PricingPlan {
	title: string;
	subtitle?: string;
	prices: PriceDetail[];
	features: (string | { subtitle: string })[];
	ctaAction: () => void;
	ctaText: string;
	externalCtaLink?: string;
	externalCta?: string;
	externalCtaText?: string;
}

interface PricingPlanComponentProps {
	plan: PricingPlan;
}

interface PricingTableProps {
	plans: PricingPlan[];
}
const PaymentIcon = ({ method }: { method: PriceDetail["method"] }) => {
	switch (method) {
		case "Credit/Debit":
			return <FaCreditCard />;
		case "Bank Wire/Transfer":
			return <AiFillBank />;
		case "BTC":
			return <FaBitcoin />;
		case "Ethereum":
			return <FaEthereum />;
		case "Monero":
			return <RiCoinLine />;
		default:
			return null;
	}
};

const PricingPlanComponent: React.FC<PricingPlanComponentProps> = ({
	plan,
}) => {
	const [activePaymentMethod, setActivePaymentMethod] = React.useState(
		plan.prices[0].method
	);

	const activePriceDetail = plan.prices.find(
		(p) => p.method === activePaymentMethod
	);
	const comingSoonMessage = activePriceDetail?.comingSoon ? "Coming Soon" : "";

	return (
		<div className='bg-gradient-to-r from-[#000308] to-[#0C2100] hover:border-green-400 border-gray-700 border-[2px] text-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg hover:shadow-green-700 transition-all hover:scale-105'>
			<h2 className='text-lg font-semibold'>{plan.title}</h2>
			<h3 className='font-semibold mb-4'>{plan.subtitle}</h3>
			<div className='mb-4'>
				<p className='text-2xl font-bold mb-2'>{activePriceDetail?.amount}</p>
				<p className='text-xs font-bold text-green-500 '>{comingSoonMessage}</p>
			</div>
			<div className='flex mb-4'>
				{plan.prices.map((price) => (
					<button
						key={price.method}
						className={`py-2 mr-2 ${
							activePaymentMethod === price.method
								? "text-green-400 cursor-default"
								: "text-gray-500"
						}`}
						onClick={() => setActivePaymentMethod(price.method)}
						title={price.method}
					>
						<PaymentIcon method={price.method} />
					</button>
				))}
			</div>
			<hr className='border-gray-200 mb-4' />
			<ul className='text-sm mb-6'>
				{plan.features.map((feature, i) => (
					<React.Fragment key={i}>
						{typeof feature === "string" ? (
							<li className='flex items-center mb-2'>
								<BiCheckCircle className='text-green-400 m-2 text-lg flex-[0.2]' />
								<span className='flex-1'>{feature}</span>
							</li>
						) : (
							<h3 className='text-green-400 font-semibold mt-4 mb-2'>
								{feature.subtitle}
							</h3>
						)}
					</React.Fragment>
				))}
			</ul>
			<button
				onClick={plan.ctaAction}
				className='mb-2 bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] transition-colors text-white font-semibold py-2 px-4 rounded-lg w-full'
			>
				{plan.ctaText}
			</button>
			{plan.externalCtaText && (
				<span className='text-xs text-gray-500'>
					{plan.externalCtaText}
					{plan.externalCtaLink && plan.externalCta && (
						<Link
							href={plan.externalCtaLink}
							passHref
							className='text-green-400 hover:text-green-500 transition-colors ml-1 underline'
						>
							{plan.externalCta}
						</Link>
					)}
				</span>
			)}
		</div>
	);
};

const PricingTable: React.FC<PricingTableProps> = ({ plans }) => {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
			{plans.map((plan, index) => (
				<PricingPlanComponent
					key={index}
					plan={plan}
				/>
			))}
		</div>
	);
};

export default PricingTable;
