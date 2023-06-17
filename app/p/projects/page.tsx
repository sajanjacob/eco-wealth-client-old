"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProjectCard from "@/components/ProjectCard";
import supabase from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
type ProjectType = {
	image_url: string;
	title: string;
	description: string;
	status: string;
	id: string;
	project_coordinator_contact: string;
	tree_target: number;
	funds_requested_per_tree: number;
	type: string;
	created_at: Date;
};

type UserType = {
	id: string;
};
type Props = {};
function Projects({}: Props) {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state: RootState) => state.user); // Assuming you have a userContext reducer
	const [projects, setProjects] = useState<Project[]>([]);

	const fetchProjects = async (userId: string) => {
		if (userId === "") return;
		const { data, error } = await supabase
			.from("projects")
			.select("*")
			.eq("user_id", userId);

		if (error) {
			console.error("Error fetching projects:", error);
		} else {
			setProjects(data as Project[]);
		}
	};
	useEffect(() => {
		if (user) {
			fetchProjects(user.id || "");
		}
	}, [user]);

	return (
		<div>
			<h1>Your Projects</h1>
			{projects.map(
				({
					image_url,
					title,
					description,
					status,
					id,
					project_coordinator_contact,
					tree_target,
					funds_requested_per_tree,
					type,
					created_at,
				}) => (
					<ProjectCard
						key={id}
						imageUrl={image_url}
						title={title}
						description={description}
						status={status}
						projectId={id}
						projectCoordinatorContactName={project_coordinator_contact.name}
						projectCoordinatorContactPhone={project_coordinator_contact.phone}
						treeTarget={tree_target}
						fundsRequestedPerTree={funds_requested_per_tree}
						projectType={type}
						createdAt={created_at}
						role='owner'
					/>
				)
			)}
		</div>
	);
}
export default Projects;
