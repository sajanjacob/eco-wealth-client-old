import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LinearProgress } from "@mui/material";

interface PortfolioCardProps {
	project: Project;

	totalShares?: number;
	totalAmountInvested?: number;
	totalAmountRaised: number;
	amountRequested: number;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
	project,
	totalShares,
	totalAmountInvested,
	totalAmountRaised,
	amountRequested,
}) => {
	if (!project) return <div>loading...</div>;
	let percentFunded = 0;
	if (amountRequested && totalAmountRaised) {
		percentFunded = (totalAmountRaised / amountRequested) * 100;
	}
	// console.log("project >>> ", project);

	return (
		<Link href={`/i/portfolio/${project.id}`}>
			<div className='w-72 dark:bg-green-950 bg-white rounded-2xl shadow-md relative mx-8 my-16 z-10 h-fit pb-2 border-[1px] border-green-950 hover:border-green-800 transition-colors'>
				<Image
					src={project.imageUrl}
					width={288}
					height={150}
					className='w-full h-48 object-cover rounded-t-2xl'
					alt={project.title}
				/>
				<div className='p-6'>
					<h3 className='text-xl mb-2'>{project.title}</h3>

					{totalShares && (
						<p className='mb-[2px]'>Shares owned: {totalShares}</p>
					)}
					{totalAmountInvested && (
						<p className='mb-4'>
							Invested total: ${totalAmountInvested.toFixed(2)}
						</p>
					)}
					{totalAmountRaised && (
						<p className='mb-4'>
							Amount raised: ${totalAmountRaised.toFixed(2)}
						</p>
					)}
					<LinearProgress
						variant='determinate'
						value={percentFunded}
					/>
					<p className='mb-4 text-xs text-right mt-2'>
						{percentFunded.toFixed(2)}% Funded
					</p>
				</div>
			</div>
		</Link>
	);
};

export default PortfolioCard;
