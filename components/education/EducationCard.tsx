"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface EducationCardProps {
	title: string;
	url: string;
	imgUrl: string;
	shortDescription: string;
	lessonId?: string;
	resourceId?: string;
	category: string;
}

const EducationCard: React.FC<EducationCardProps> = ({
	title,
	url,
	imgUrl,
	shortDescription,
	lessonId,
	resourceId,
	category,
}) => {
	const router = useRouter();
	const handleCardClick = () => {
		if (url) {
			window.open(url, "_blank");
		} else if (lessonId) {
			// Assuming react-router is used for routing
			// replace "/lesson" with your actual in-app lesson route
			router.push(`/lesson/${lessonId}`);
		}
	};

	return (
		<div
			className={`education-card .${category} bg-transparent rounded-xl shadow-md mr-4 w-[408px] lg:w-[308px] mb-4 h-fit flex flex-col justify-between`}
			onClick={handleCardClick}
		>
			<a
				href={url}
				target='_blank'
				rel='noopener noreferrer'
			>
				<Image
					width={288}
					height={150}
					src={imgUrl}
					alt={title}
					className='w-full h-48 object-cover rounded-2xl relative'
				/>

				<div className='card-content mt-2'>
					<h2 className='font-semibold'>{title}</h2>
					<p className='text-sm text-gray-400'>{category}</p>
					<p className='text-sm text-gray-400'>{shortDescription}</p>
				</div>
			</a>
		</div>
	);
};
export default EducationCard;
