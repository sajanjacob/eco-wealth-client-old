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
			className={`education-card .${category} bg-green-800 rounded-xl shadow-md m-4 w-72 h-max flex flex-col justify-between`}
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
					style={{ objectFit: "contain" }}
					className='rounded-t-xl '
				/>

				<div className='card-content p-4'>
					<h2>{title}</h2>
					<p className='text-sm'>{category}</p>
					<p>{shortDescription}</p>
				</div>
			</a>
		</div>
	);
};
export default EducationCard;
