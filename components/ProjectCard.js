import React, { useRef, useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import moment from "moment";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import UserContext from "@/state/UserContext";
import { useRouter } from "next/router";
const ProjectCard = ({
	imageUrl,
	title,
	description,
	projectId,
	status,
	role,
	projectCoordinatorContactName,
	projectCoordinatorContactPhone,
	treeTarget,
	fundsRequestedPerTree,
	projectType,
	createdAt,
}) => {
	const [isFavorited, setIsFavorited] = useState(false);
	const [isFavIconHovered, setIsFavIconHovered] = useState(false);

	const [menuOpen, setMenuOpen] = useState(false);
	const buttonRef = useRef();
	const menuRef = useRef();
	const router = useRouter();
	const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
	const [favoriteCount, setFavoriteCount] = useState(0);
	const { state } = useContext(UserContext);

	const handleMenuToggle = () => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setMenuPosition({
				top: rect.top, // Adjust this value if you need extra spacing
				left: rect.left, // Adjust this value if you need extra spacing
			});
		}
		setMenuOpen(!menuOpen);
	};
	// Close the menu if the user clicks outside of the button
	const handleClickOutside = (event) => {
		// Check if the clicked target is the menu button or a child of the menu
		if (
			buttonRef.current &&
			!buttonRef.current.contains(event.target) &&
			menuRef.current &&
			!menuRef.current.contains(event.target)
		) {
			setMenuOpen(false);
		}
	};

	// Add a event listener for clicks outside the menu button
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Toggles the favorite status of the project
	const toggleFavorite = async (event) => {
		event.stopPropagation();
		setIsFavorited(!isFavorited);
		if (isFavorited) {
			// Delete a favorite
			const { data: favorite, error } = await supabase
				.from("favorites")
				.delete()
				.eq("user_id", state.context.user.id)
				.eq("project_id", projectId);
			if (error) {
				return toast.error(error.message);
			}
			setFavoriteCount(favoriteCount - 1);
			toast.success("Removed from favorites");
		} else {
			// Add a favorite
			const { data: favorite, error } = await supabase
				.from("favorites")
				.insert([{ user_id: state.context.user.id, project_id: projectId }]);
			if (error) {
				return toast.error(error.message);
			}
			setFavoriteCount(favoriteCount + 1);
			toast.success("Added to favorites");
		}
	};

	useEffect(() => {
		// Check if the project is favorited
		const checkFavorite = async () => {
			const { data: favorites, error } = await supabase
				.from("favorites")
				.select("project_id")
				.eq("user_id", state.context?.user?.id)
				.eq("project_id", projectId);
			if (error) {
				return console.log(error.message);
			}
			if (favorites.length > 0) {
				setIsFavorited(true);
			}
		};
		const checkFavoriteCount = async () => {
			// Get the number of favorites for a project
			const { count, error } = await supabase
				.from("favorites")
				.select("*", { count: "exact" })
				.eq("project_id", projectId);
			if (error) {
				return console.log(error.message);
			}
			setFavoriteCount(count);
		};
		if (state?.context?.user?.id) {
			checkFavorite();
			checkFavoriteCount();
		}
	}, [projectId, state]);

	// Opens the edit project page
	const handleEdit = () => {
		// Navigate to the edit project page
		router.push(`/p/projects/${projectId}/edit`);
	};

	// Deletes the project with the given ID
	const deleteProject = async (projectId) => {
		const confirmation = window.confirm(
			"Are you sure you want to delete this project?"
		);

		if (confirmation) {
			try {
				const { error } = await supabase
					.from("projects")
					.delete()
					.eq("id", projectId);

				if (error) {
					throw error;
				}

				// Show a success message or refresh the data on the page
				toast.success("Project deleted successfully");
			} catch (error) {
				// Handle the error appropriately
				console.error("Error deleting project:", error.message);
				toast.error("Failed to delete the project");
			}
		}
	};

	// Initiates the delete project flow
	const handleDelete = async () => {
		// Delete the project and close the menu
		await deleteProject(projectId);
		setMenuOpen(false);
	};

	const userName = state?.context?.user?.name;
	// Publishes the project with the given ID
	const publishProject = async (projectId) => {
		try {
			const { data, error } = await supabase
				.from("projects")
				.update({ status: "verified_published" })
				.eq("id", projectId);

			if (error) {
				// Handle the error appropriately
				console.error("Error publishing project:", error.message);
				toast.error("Failed to publish the project");
			} else {
				// Show a success message or refresh the data on the page
				toast.success(
					`🎉 Congrats ${userName}! Your project published successfully!`
				);
			}
		} catch (error) {
			// Handle the error appropriately
			console.error("Error publishing project:", error.message);
			toast.error("Failed to publish the project");
		}
	};

	// Initiates the publish project flow
	const handlePublish = async () => {
		await publishProject(projectId);
		setMenuOpen(false);
		toast.info("Publishing Project...");
	};

	const handleViewProjectClick = () => router.push(`/i/projects/${projectId}`);
	const handleLearnMoreClick = () => router.push(`/i/projects/${projectId}`);
	const handleInvestClick = () =>
		router.push(`/i/projects/${projectId}/invest`);

	// Initiates the report project flow
	const handleReport = async () => {};
	const handleOnMouseEnter = () => setIsFavIconHovered(true);
	const handleOnMouseLeave = () => setIsFavIconHovered(false);
	if (role === "investor" && status === "draft") return null;
	if (role === "investor" && status === "pending") return null;
	if (role === "investor" && status === "not_approved") return null;
	if (role === "investor" && status === "verified") return null;
	if (role === "investor" && status === "verified_published")
		return (
			<Card>
				<CardContentWrapper>
					<CardImage src={imageUrl} alt={title} />
					<FavoriteButton
						onClick={toggleFavorite}
						onMouseEnter={handleOnMouseEnter}
						onMouseLeave={handleOnMouseLeave}
					>
						{isFavorited || isFavIconHovered ? (
							<AiFillHeart
								style={{ opacity: isFavorited || isFavIconHovered ? 1 : 0 }}
							/>
						) : (
							<AiOutlineHeart
								style={{ opacity: isFavorited || isFavIconHovered ? 0 : 1 }}
							/>
						)}
					</FavoriteButton>
					<FavoriteCount>{favoriteCount}</FavoriteCount>
					<CardContent>
						<ProjectTypeText>{projectType}</ProjectTypeText>
						<TopContainer justifyContent={"space-between"}>
							<Link href={`/i/projects/${projectId}`} passHref>
								<CardTitle>{title}</CardTitle>
							</Link>
							<MenuButton ref={buttonRef} onClick={handleMenuToggle}>
								<BsThreeDotsVertical />
							</MenuButton>
							{menuOpen && (
								<Menu
									ref={menuRef}
									top={menuPosition.top}
									left={menuPosition.left}
								>
									<MenuItem onClick={handleViewProjectClick}>View</MenuItem>
									{/* <MenuItem onClick={handleReport}>Report</MenuItem> */}
								</Menu>
							)}
						</TopContainer>
						<Link href={`/i/projects/${projectId}`} passHref>
							<CardDescription>{description}</CardDescription>
						</Link>
						<ButtonContainer>
							<button onClick={handleLearnMoreClick}>Learn More</button>
							<button onClick={handleInvestClick}>Invest</button>
						</ButtonContainer>
					</CardContent>
				</CardContentWrapper>
			</Card>
		);
	if (role === "owner")
		return (
			<Card>
				<CardContentWrapper>
					<CardImage src={imageUrl} alt={title} />
					<TopContainer>
						<StatusText>
							<p>{status}</p>
						</StatusText>
						<MenuButton ref={buttonRef} onClick={handleMenuToggle}>
							<BsThreeDotsVertical />
						</MenuButton>
						{menuOpen && (
							<Menu
								ref={menuRef}
								top={menuPosition.top}
								left={menuPosition.left}
							>
								<MenuItem onClick={handleViewProjectClick}>View</MenuItem>
								{status === "verified" && (
									<MenuItem onClick={handlePublish}>Publish</MenuItem>
								)}
								<MenuItem onClick={handleEdit}>Edit</MenuItem>
								<MenuItem onClick={handleDelete}>Delete</MenuItem>
							</Menu>
						)}
					</TopContainer>
					<Link href={`/p/projects/${projectId}`} passHref>
						<CardContent>
							<CardTitle>{title}</CardTitle>
							<CardDescription>{description.substring(0, 300)}</CardDescription>
							<p>Project Coordinator Contact:</p>
							<p>{projectCoordinatorContactName}</p>
							<p>{projectCoordinatorContactPhone}</p>
							<br />
							<p>Project Type: {projectType}</p>
							<p>Target: {Number(treeTarget).toLocaleString("en-US")} Trees</p>
							<p>Funds Requested: ${fundsRequestedPerTree}/Tree</p>
							<br />
							Created on:
							<p>{moment(createdAt).format("dddd, MMMM Do YYYY, hh:mm:ss")}</p>
						</CardContent>
					</Link>
				</CardContentWrapper>
			</Card>
		);
};

export default ProjectCard;

const Card = styled.div`
	width: 300px;
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	position: relative;
	margin: 32px 16px;
	height: max-content;
	a {
		text-decoration: none;
		color: black;
	}
`;
const CardContentWrapper = styled.a`
	display: block;
	color: inherit;
	text-decoration: none;
`;
const CardImage = styled.img`
	width: 100%;
	height: 200px;
	object-fit: cover;
`;

const CardContent = styled.div`
	padding: 1rem;
`;

const CardTitle = styled.h3`
	margin: 0;
	margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
	display: -webkit-box;
	-webkit-line-clamp: 5;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	> button {
		width: 48%;
		padding: 0.5rem;
		border: none;
		border-radius: 4px;
		background-color: forestgreen;
		color: white;
		cursor: pointer;
		transition: 0.333s ease;
		:hover {
			background-color: darkgreen;
		}
	}
`;
const ProjectTypeText = styled.p`
	border: 1px solid lightgrey;
	width: max-content;
	padding: 4px 8px;
	border-radius: 4px;
`;
const TopContainer = styled.div`
	display: flex;
	justify-content: ${(props) => props.justifyContent || "flex-end"};
	width: 100%;
	align-items: center;
`;
const StatusText = styled.p`
	background: none;
	border: none;
	cursor: pointer;
	color: #fc6868;
	text-align: right;
	margin-right: 8px;
	margin-top: 2px;
`;
const FavoriteButton = styled.button`
	background: none;
	top: 8px;
	right: -2px;
	position: absolute;
	border: none;
	cursor: pointer;
	color: #fc6868;
	text-align: right;
	margin-right: 8px;
	font-size: xx-large;
`;
const FavoriteCount = styled.p`
	color: #fff;
	top: 24px;
	right: 24px;
	position: absolute;
	font-weight: bold;
	/* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
	font-size: 16px;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
`;
const MenuButton = styled.div`
	cursor: pointer;
	font-size: x-large;
	margin-top: -8px;
	color: #333;
`;
const Menu = styled.div`
	position: fixed;
	top: ${(props) => props.top + 10}px;
	left: ${(props) => props.left + 20}px;
	background-color: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 4px;
	padding: 8px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	z-index: 1000; // Set a high z-index value to ensure the menu appears above other elements
`;

const MenuItem = styled.button`
	background-color: transparent;
	border: none;
	color: #333;
	font-size: 14px;
	cursor: pointer;
	text-align: left;

	&:hover {
		color: #0070f3;
	}
`;
