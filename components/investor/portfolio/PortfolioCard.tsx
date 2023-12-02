import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LinearProgress } from "@mui/material";
interface PortfolioCardProps {
	project: Project;
	totalShares?: number;
	totalAmountInvested?: number;
	totalAmountRaised?: number;
	amountRequested?: number;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({
	project,
	totalShares,
	totalAmountInvested,
	totalAmountRaised,
	amountRequested,
}) => {
	if (!project) return <div>loading...</div>;
	// TODO: Refactor /api/investor/portfolio/route.tsx to return collectiveTotalAmountRaised
	let percentFunded = 0;
	if (amountRequested && totalAmountRaised) {
		percentFunded = (totalAmountRaised / amountRequested) * 100;
	}
	// console.log("project >>> ", project);

	return (
		<div className='lg:w-[308px] w-[408px] bg-transparent rounded-2xl md:mr-2 shadow-md relative mt-8 z-10 h-fit pb-2'>
			<div>
				<Link href={`/i/portfolio/${project.id}`}>
					<Image
						src={project.imageUrl}
						width={288}
						height={150}
						className='w-full h-48 object-cover rounded-2xl relative'
						alt={project.title}
					/>
					<div className='pt-[4px]'>
						<h3 className='text-xl '>{project.title}</h3>
						<div className='text-sm text-gray-400 flex'>
							{totalShares && (
								<p className='mb-[2px] mr-[4px]'>
									{totalShares} shares{totalAmountInvested && "  • "}
								</p>
							)}
							{totalAmountInvested && (
								<p className='mb-4'>
									${totalAmountInvested.toFixed(2)} invested
								</p>
							)}
							{totalAmountRaised && (
								<p className='mb-4'>
									Amount raised: ${totalAmountRaised.toFixed(2)}
								</p>
							)}
						</div>
						{/* <LinearProgress
							variant='determinate'
							value={percentFunded}
							/>
							<p className='mb-4 text-xs text-right mt-2'>
							{percentFunded.toFixed(2)}% Funded
						</p>*/}
					</div>
				</Link>
			</div>
		</div>
	);
};

export default PortfolioCard;
