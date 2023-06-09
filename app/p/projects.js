import { useContext, useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import UserContext from "@/state/UserContext";
import ProjectCard from "@/components/ProjectCard";
import styled from "styled-components";
function projects(props) {
	const { state } = useContext(UserContext);
	const [projects, setProjects] = useState([]);
	const fetchProjects = async (userId) => {
		const { data, error } = await supabase
			.from("projects")
			.select("*")
			.eq("user_id", userId);

		if (error) {
			console.error("Error fetching projects:", error);
		} else {
			setProjects(data);
		}
	};
	useEffect(() => {
		if (state.context.user) {
			fetchProjects(state.context.user.id);
		}
	}, [state.context.user]);

	return (
		<Container>
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
					<>
						<ProjectCard
							key={id}
							imageUrl={image_url}
							title={title}
							description={description}
							status={status}
							projectId={id}
							projectCoordinatorContactName={
								JSON.parse(project_coordinator_contact).name
							}
							projectCoordinatorContactPhone={
								JSON.parse(project_coordinator_contact).phone
							}
							treeTarget={tree_target}
							fundsRequestedPerTree={funds_requested_per_tree}
							projectType={type}
							createdAt={created_at}
							role='owner'
						/>
					</>
				)
			)}
		</Container>
	);
}
export default projects;
const Container = styled.div``;
