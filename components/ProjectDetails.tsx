import React, { useState, useEffect, FC } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Project from "./producer/projects/Project";
import InvestButton from "./investor/projects/InvestButton";

type Props = {};

const ProjectDetails = ({}: Props) => {
	const router = useRouter();
	const path: any = useParams();
	const { id } = path;
	const [project, setProject] = useState(
		{} as Project | TreeProject | EnergyProject
	);

	useEffect(() => {
		if (!id) {
			// The id is not available yet; wait for it to be populated.
			return;
		}

		const fetchProject = async () => {
			try {
				const { data, error } = await supabase
					.from("projects")
					.select(
						"*, tree_projects(*), energy_projects(*), project_milestones(*), tree_investments(*), energy_investments(*)"
					)
					.eq("id", id)
					.single();

				if (error) {
					throw new Error(error.message);
				}
				setProject(convertToCamelCase(data as Project));
			} catch (error: any) {
				console.error(
					"(ProjectDetails.js) Error fetching project: ",
					error.message
				);
			}
		};

		fetchProject();
	}, [id]);

	// Handle the back button click event
	const handleBackButtonClick = () => {
		router.back();
	};

	// Handle the invest button click event
	const handleInvestButtonClick = () => {
		router.push(`/i/projects/${id}/invest`);
	};
	// Render the project details or a loading message if the data is not yet available
	return (
		<div className='mt-4 h-[1000px]'>
			{project ? (
				<div className='flex'>
					<div className='w-[60%] mx-auto'>
						<Project
							adminMode={false}
							project={project}
						/>
					</div>
					<div className='sticky lg:right-28 md:right-8  top-20 bg-green-900 h-min px-12 py-6 rounded-md'>
						<InvestButton id={project.id} />
					</div>
				</div>
			) : (
				<>
					<p>Loading project details...</p>
				</>
			)}
		</div>
	);
};

export default ProjectDetails;
