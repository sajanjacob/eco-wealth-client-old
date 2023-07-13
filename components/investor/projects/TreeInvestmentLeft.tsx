import Image from "next/image";
import React from "react";

type Props = {
	imageUrl: string;
	title: string;
	description: string;
};

export default function TreeInvestmentLeft({
	imageUrl,
	title,
	description,
}: Props) {
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
			<p className='text-lg font-light mb-4'>{description}</p>
		</div>
	);
}
