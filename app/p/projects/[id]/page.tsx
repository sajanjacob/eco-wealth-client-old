"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import convertToCamelCase from "@/utils/convertToCamelCase";
import Project from "@/components/producer/projects/Project";
type Props = {};

export default async function Projects({}: Props) {
	const path = useParams();
	const { id } = path;
	const [project, setProject] = useState<
		Project | TreeProject | EnergyProject | null
	>(null);
	const user = useAppSelector((state: RootState) => state.user);
	const fetchProject = async () => {
		const { data, error } = await supabase
			.from("projects")
			.select(`*, tree_projects(*), energy_projects(*), producer_properties(*)`)
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
		<div className='p-4 w-[50%] mx-auto'>
			<Project project={project} />
		</div>
	);
}
