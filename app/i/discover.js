import ProjectCard from "@/components/ProjectCard";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
function Discover(props) {
	const treeProduce = [
		"All",
		"Timber / Lumber",
		"Fruit",
		"Nut",
		"Bio Fuel",
		"Pulp",
		"Syrup",
		"Oil / Chemical",
		"Non-Profit Initiative",
	];

	const router = useRouter();
	const activeFilterFromQuery = router.query.filter || "All";
	const [activeFilter, setActiveFilter] = useState(activeFilterFromQuery);

	const handleFilterClick = async (e) => {
		const filterType = e.target.value;
		if (filterType !== activeFilter) {
			setActiveFilter(filterType);

			// Update the URL with the new filter value
			await router.push({
				pathname: "/i/discover",
				query: { filter: filterType },
			});
		}
	};
	const [projects, setProjects] = useState([]);
	useEffect(() => {
		const fetchProjects = async (type) => {
			const res = await fetch(`/api/projects?type=${type}`);
			const data = await res.json();
			// Do something with the data, e.g., update state or display it
			setProjects(data);
		};

		fetchProjects(activeFilter);
	}, [activeFilter]);

	return (
		<Container>
			<h1>Discover Agroforestry Projects</h1>
			<ButtonContainer>
				{treeProduce.map((produce, index) => (
					<ProduceButton
						key={index}
						value={`${produce}`}
						onClick={handleFilterClick}
						active={produce === activeFilter}
					>
						{produce}
					</ProduceButton>
				))}
			</ButtonContainer>
			<CardContainer>
				{projects.length > 0 ? (
					projects.map(
						(
							{
								id,
								created_at,
								title,
								description,
								type,
								image_url,
								tree_target,
								funds_requested_per_tree,
								status,
							},
							index
						) => (
							<ProjectCard
								key={index}
								imageUrl={image_url}
								title={title}
								description={description}
								projectId={id}
								created_at={created_at}
								projectType={type}
								tree_target={tree_target}
								funds_requested_per_tree={funds_requested_per_tree}
								status={status}
								role={"investor"}
							/>
						)
					)
				) : (
					<NoProjectsFoundTextContainer>
						<h3>
							No {activeFilter !== "All" ? activeFilter : null} Projects Found.
						</h3>{" "}
						<br />
						<p>
							<br /> Invite a Producer to join Eco Wealth or <br />
							become a Producer and start a{" "}
							{activeFilter !== "All" ? activeFilter : null} project today!
						</p>
					</NoProjectsFoundTextContainer>
				)}
			</CardContainer>
		</Container>
	);
}

export default Discover;

const Container = styled.div`
	width: 75%;
	margin: 0 auto;
	padding: 2rem 0;
`;
const CardContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	min-height: 80vh;
`;
const ButtonContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
`;

const ProduceButton = styled.button`
	background-color: ${({ active }) => (active ? "#a0d6b4" : "#3a3a3a")};
	color: #ffffff;
	border: none;
	border-radius: 4px;
	padding: 0.5rem 1rem;
	transition: background-color 0.3s;
	border: 1px solid #3a3a3a;

	cursor: ${({ active }) => (active ? "default" : "pointer")};
	&:hover {
		background-color: ${({ active }) => (active ? "#a0d6b4" : "#5a5a5a")};
		border: 1px solid green;
	}
`;

const NoProjectsFoundTextContainer = styled.div`
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
`;
