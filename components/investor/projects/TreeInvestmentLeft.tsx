import moment from "moment";
import Image from "next/image";
import React from "react";

type Props = {
	imageUrl: string;
	title: string;
	description: string;
	estPlantingDate: string;
	estimatedMaturityDate: string;
	treeProjectType: string;
};

export default function TreeInvestmentLeft({
	imageUrl,
	title,
	description,
	estPlantingDate,
	estimatedMaturityDate,
	treeProjectType,
}: Props) {
	const estimatedPlantingDate = moment(estPlantingDate).format("MMMM Do, YYYY");
	return (
		<div>
			<span className='flex justify-center mb-2'>
				<Image
					width={400}
					height={150}
					src={imageUrl}
					alt={title}
					className='rounded-xl'
				/>
			</span>
			<h1 className='text-3xl font-light'>{title}</h1>
			<p className='text-lg font-light mb-2'>{description}</p>
			<p className='text-sm font-light mb-4'>{treeProjectType} project •</p>
			<div className='border-[1px] rounded-sm px-[8px] py-[4px] w-[max-content] mb-[8px]'>
				<p className='text-sm font-semibold'>
					🌱 Estimated planting date: {estimatedPlantingDate}
				</p>
			</div>
			<div className='border-[1px] rounded-sm px-[8px] py-[4px] w-[max-content]'>
				<p className='text-sm font-semibold'>
					🌳 Estimated maturity date: {estimatedMaturityDate}
				</p>
			</div>
		</div>
	);
}
