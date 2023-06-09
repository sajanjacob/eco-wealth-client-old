import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/utils/supabaseClient";
import styled from "styled-components";
import moment from "moment";
const ProjectDetails = () => {
	const router = useRouter();
	const { id } = router.query;
	const [project, setProject] = useState(null);

	useEffect(() => {
		if (!id) {
			// The id is not available yet; wait for it to be populated.
			return;
		}

		const fetchProject = async () => {
			try {
				const { data, error } = await supabase
					.from("projects")
					.select("*")
					.eq("id", id)
					.single();

				if (error) {
					throw new Error(error.message);
				}
				setProject(data);
			} catch (error) {
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
		<div>
			<BackButton onClick={handleBackButtonClick}>Back</BackButton>
			{project ? (
				<>
					{/* Render project details here */}
					<ProjectImage src={project.image_url} alt={project.title} />
					<ContentContainer>
						<CreationDate>
							Project created {moment(project.created_at).fromNow()}
						</CreationDate>
						<Title>{project.title}</Title>
						<h3>About the project</h3>
						<Type>
							<b>Type:</b> {project.type}
						</Type>
						<Description>{project.description}</Description>
						<TreeTarget>
							<b>Target:</b>{" "}
							{Number(project.tree_target).toLocaleString("en-us")} Trees
						</TreeTarget>
						<FundsRequested>
							<b>Funds Requested:</b> ${project.funds_requested_per_tree} per
							Tree
						</FundsRequested>
						<SoilContentPercentage>
							{project.current_soil_organic_content_percentage && (
								<>
									<b>Current Soil Organic Content Percentage:</b>{" "}
									{project.current_soil_organic_content_percentage}%
									<br />
								</>
							)}
							{project.target_soil_organic_content_percentage && (
								<>
									<b>Target Soil Organic Content Percentage:</b>{" "}
									{project.target_soil_organic_content_percentage}%
								</>
							)}
						</SoilContentPercentage>
						<NumOfFavorites></NumOfFavorites>
						<NumOfInvestors></NumOfInvestors>
						<InvestButton onClick={handleInvestButtonClick}>
							Invest in this Project
						</InvestButton>
					</ContentContainer>
				</>
			) : (
				<>
					<p>Loading project details...</p>
				</>
			)}
		</div>
	);
};

export default ProjectDetails;

const ProjectImage = styled.img`
	width: 100%;
	height: 40vh;
	object-fit: cover;
`;
const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	width: 75%;
`;
const CreationDate = styled.p`
	color: gray;
`;

const Title = styled.h1``;
const Type = styled.p`
	margin-bottom: 0;
`;
const Description = styled.p`
	margin-top: 4px;
`;
const TreeTarget = styled.p`
	margin-bottom: 0;
`;
const FundsRequested = styled.p`
	margin-top: 4px;
`;
const InvestButton = styled.button`
	background-color: forestgreen;
	color: white;
	border: none;
	border-radius: 5px;
	padding: 12px 64px;
	font-size: 1.2rem;
	font-weight: bold;
	cursor: pointer;
	/* width: 98%; */
	margin: 10px 8px;
	transition: 0.333s ease;
	&:hover {
		background-color: darkgreen;
	}
`;
const NumOfFavorites = styled.p``;
const NumOfInvestors = styled.p``;
const BackButton = styled.button`
	margin: 10px 8px;
`;
const SoilContentPercentage = styled.p``;
