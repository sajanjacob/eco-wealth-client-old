import moment from "moment";
import Image from "next/image";
import React from "react";
import TreeProject from "./TreeProject";
import EnergyProject from "./EnergyProject";

type Props = {
	project: Project | null | undefined;
};

export default function Project({ project }: Props) {
	return (
		<div className=''>
			<Image
				className='w-full h-64 object-cover object-top mb-4'
				src={
					project?.imageUrl
						? project?.imageUrl
						: "https://via.placeholder.com/1500x500"
				}
				alt='Banner'
				width={1500}
				height={500}
			/>

			<h2 className='text-2xl font-bold mb-2'>
				{project?.title} - {project?.type} Project
			</h2>
			<hr className='dark:border-green-800 my-4' />
			<div className='flex justify-between'>
				<div>
					<p>
						Created at: {moment(project?.createdAt).format("MMMM DD, yyyy LT")}
					</p>
					<p>
						Last updated at:{" "}
						{project?.updatedAt
							? moment(project?.updatedAt).format("MMMM DD, yyyy LT")
							: moment(project?.createdAt).format("MMMM DD, yyyy LT")}
					</p>
					<p>Status: {project?.status}</p>
					<p>
						Coordinator: {project?.projectCoordinatorContact.name},{" "}
						{project?.projectCoordinatorContact.phone}
					</p>
					<p>Address: {project?.producerProperties.address.addressLineOne}</p>
					<p>Area: {project?.totalAreaSqkm} sq ft</p>
					{/* <p>Funds collected: ${project?.fundsCollected}</p> */}
					{/* <p>Investors: {project?.investorCount}</p> */}
				</div>
				{project?.type === "Tree" ? (
					<TreeProject project={project?.treeProjects[0]} />
				) : (
					<EnergyProject project={project?.energyProjects[0]} />
				)}
			</div>
		</div>
	);
}
