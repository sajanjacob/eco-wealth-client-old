"use client";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import supabase from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";

type Props = {};
function Projects({}: Props) {
	const user = useAppSelector((state: RootState) => state.user); // Assuming you have a userContext reducer
	const [projects, setProjects] = useState<Project[]>([]);

	const fetchProjects = async () => {
		const { data, error } = await supabase
			.from("projects")
			.select(
				"*, project_milestones(*), tree_projects(*), energy_projects(*), solar_projects(*)"
			)
			.eq("producer_id", user.producerId)
			.neq("is_deleted", true);

		if (error) {
			console.error("Error fetching projects:", error);
		} else {
			console.log("projects >>> ", data);
			setProjects(convertToCamelCase(data) as Project[]);
		}
	};
	useEffect(() => {
		if (user) {
			fetchProjects();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<div>
			<h1 className='font-bold text-3xl mx-8 mt-6'>Your Projects</h1>
			<div className='flex flex-wrap'>
				{projects.map((project) => {
					const {
						imageUrl,
						title,
						description,
						status,
						id,
						projectCoordinatorContact,
						treeTarget,
						fundsRequestedPerTree,
						type,
						createdAt,
						isVerified,
						treeProjects,
						energyProjects,
						solarProjects,
					} = project;
					return (
						<ProjectCard
							key={id}
							imageUrl={imageUrl}
							title={title}
							description={description}
							status={status}
							projectId={id}
							projectCoordinatorContactName={projectCoordinatorContact.name}
							projectCoordinatorContactPhone={projectCoordinatorContact.phone}
							treeTarget={treeTarget}
							fundsRequestedPerTree={fundsRequestedPerTree}
							projectType={type}
							createdAt={createdAt}
							isVerified={isVerified}
							role='owner'
							project={project}
							treeProjects={treeProjects}
							energyProjects={energyProjects}
							solarProjects={solarProjects}
						/>
					);
				})}
			</div>
		</div>
	);
}
export default Projects;
