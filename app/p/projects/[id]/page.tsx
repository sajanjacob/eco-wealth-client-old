"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Project from "@/components/producer/projects/Project";
import withAuth from "@/utils/withAuth";

function Projects() {
	const path: any = useParams();
	const { id } = path;
	const [project, setProject] = useState<
		Project | TreeProject | EnergyProject | null
	>(null);
	const fetchProject = async () => {
		const { data, error } = await supabase
			.from("projects")
			.select(
				`*, tree_projects(*), energy_projects(*), solar_projects(*), producer_properties(*), project_milestones(*), tree_investments(*), energy_investments(*), project_financials(*)`
			)
			.eq("id", id)
			.neq("is_deleted", true);
		if (error) {
			console.error("Error fetching projects:", error);
			toast.error(error.message);
		}
		if (data) {
			setProject(
				convertToCamelCase(data[0]) as Project | TreeProject | EnergyProject
			);
		}
	};
	useEffect(() => {
		fetchProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='p-4 w-[50%] mx-auto max-[960px]:w-[80%]'>
			<Project
				project={project}
				fetchProject={fetchProject}
				adminMode={true}
			/>
		</div>
	);
}

export default withAuth(Projects);
