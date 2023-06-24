"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Project from "@/components/producer/projects/Project";
type Props = {};

export default async function Projects({}: Props) {
	const path = useParams();
	const { id } = path;
	const [project, setProject] = useState<
		Project | TreeProject | EnergyProject | null
	>(null);
	const fetchProject = async () => {
		const { data, error } = await supabase
			.from("projects")
			.select(
				`*, tree_projects(*), energy_projects(*), producer_properties(*), project_milestones(*)`
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
			console.log("project details >>> ", data[0] as Project);
		}
	};
	useEffect(() => {
		fetchProject();
	}, []);

	return (
		<div className='p-4 w-[50%] mx-auto max-[960px]:w-[80%]'>
			<Project
				project={project}
				fetchProject={fetchProject}
			/>
		</div>
	);
}
