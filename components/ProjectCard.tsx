"use client";
import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import moment from "moment";
import { supabaseClient as supabase } from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import getBasePath from "@/lib/getBasePath";
import axios from "axios";

type Props = {
	project: Project;
	projectId?: string;
	role: string;
	projectCoordinatorContactName: string;
	projectCoordinatorContactPhone: string;

	treeProjects?: TreeProject[];
	energyProjects?: EnergyProject[];
	solarProjects?: SolarProject[];
};
const ProjectCard = ({
	role,
	projectCoordinatorContactName,
	projectCoordinatorContactPhone,
	project,
	treeProjects,
	energyProjects,
	solarProjects,
}: Props) => {
	const {
		title,
		description,
		imageUrl,
		id,
		status,
		projectType,
		createdAt,
		isVerified,
	} = project;
	const projectId = id;
	const [isFavorited, setIsFavorited] = useState(false);
	const [isFavIconHovered, setIsFavIconHovered] = useState(false);

	const [menuOpen, setMenuOpen] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const router = useRouter();
	const [favoriteCount, setFavoriteCount] = useState<number>(0);

	const user = useAppSelector((state) => state.user);

	// Toggles the favorite status of the project
	const toggleFavorite = async (event: React.MouseEvent) => {
		event.stopPropagation();
		setIsFavorited(!isFavorited);
		if (isFavorited) {
			// Delete a favorite
			const { data: favorite, error } = await supabase
				.from("favorites")
				.delete()
				.eq("user_id", user.id)
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
				.insert([{ user_id: user.id, project_id: projectId }]);
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
				.eq("user_id", user.id)
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
			if (count) {
				setFavoriteCount(count);
			}
		};
		if (user.id) {
			checkFavorite();
			checkFavoriteCount();
		}
	}, [projectId, user.id]);

	// Opens the edit project page
	const handleEdit = () => {
		// Navigate to the edit project page
		router.push(`/p/projects/${projectId}/edit`);
	};

	const userName = user?.name;
	// Publishes the project with the given ID
	const publishProject = async (projectId: string) => {
		if (!isVerified) return;
		try {
			axios.put(`${getBasePath()}/api/projects/publish`, {
				status,
				projectId,
			});
		} catch (error: any) {
			// Handle the error appropriately
			console.error("Error publishing project:", error.message);
			toast.error(`Failed to publish the project ${error.message}`);
		}
	};

	// Initiates the publish project flow
	const handlePublish = async () => {
		if (!projectId) return;
		await publishProject(projectId);
		setMenuOpen(false);
		toast.info("Publishing Project...");
	};

	const handleViewProjectClick = () => {
		if (role === "investor") router.push(`/i/projects/${projectId}`);
		if (role === "owner") router.push(`/p/projects/${projectId}`);
	};

	const theme = useAppSelector((state) => state.user?.currentTheme);

	const handleKnowMoreClick = () => router.push(`/i/projects/${projectId}`);
	const handleInvestClick = () =>
		router.push(`/i/projects/${projectId}/invest`);

	// Initiates the report project flow
	console.log("project producer id >>> ", project.producerId);
	console.log("user producer id >>> ", user.producerId);
	const handleReport = async () => {};
	const handleOnMouseEnter = () => setIsFavIconHovered(true);
	const handleOnMouseLeave = () => setIsFavIconHovered(false);
	if (role === "investor" && status === "pending_verification") return null;
	if (role === "investor" && status === "pending_update_review") return null;
	if (role === "investor" && status === "not_approved") return null;
	if (role === "investor" && status === "draft") return null;
	if (role === "investor" && !isVerified) return null;
	if (role === "investor" && status === "published")
		return (
			<div className='w-72 dark:bg-green-950 bg-white rounded-2xl shadow-md relative mx-8 my-16 z-10 h-fit pb-2 border-[1px] border-green-950 hover:border-green-800 transition-colors'>
				<a className='block text-inherit no-underline'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<Image
						width={288}
						height={150}
						className='w-full h-48 object-cover rounded-t-2xl'
						src={imageUrl}
						alt={title}
					/>
					{/* <button className='bg-transparent absolute top-2 right-1 border-none cursor-pointer text-red-500 text-right mr-2 text-5xl'>
						{isFavorited || isFavIconHovered ? (
							<AiFillHeart
								style={{ opacity: isFavorited || isFavIconHovered ? 1 : 0 }}
							/>
						) : (
							<AiOutlineHeart
								style={{ opacity: isFavorited || isFavIconHovered ? 0 : 1 }}
							/>
						)}
					</button> */}
					{/* <p className='text-white absolute top-6 right-6 font-bold text-lg text-shadow-md'>
						{favoriteCount}
					</p> */}

					<div className='p-6'>
						<div className='flex justify-between items-center mb-2'>
							<p className='text-2xl'>
								{projectType === "Tree"
									? "🌳"
									: projectType === "Energy"
									? "☀️"
									: null}
							</p>
							<div
								onClick={handleClick}
								className='cursor-pointer text-2xl dark:text-white text-gray-800 mr-[-12px] '
							>
								<BsThreeDotsVertical />
							</div>
							<Menu
								id='basic-menu'
								className=''
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								MenuListProps={{
									"aria-labelledby": "basic-button",
								}}
								disableScrollLock={true}
								sx={
									theme === "dark"
										? {
												"& .MuiPaper-root": {
													backgroundColor: "rgb(5 46 22 / 98%)",
													borderColor: "rgb(20 83 45 / 90%)",
													borderWidth: "2px",
												},
										  }
										: {
												"& .MuiPaper-root": {
													backgroundColor: "",
												},
										  }
								}
							>
								<MenuItem
									className='menu-link'
									onClick={handleKnowMoreClick}
								>
									View
								</MenuItem>
								{/* <MenuItem
								className='menu-link'
								onClick={() => router.push(`/i/projects/${projectId}/report`)}
							>
								Report
							</MenuItem> */}
							</Menu>
						</div>
						<div className='flex flex-col pb-4'>
							<Link
								href={`/i/projects/${projectId}`}
								passHref
							>
								<h3 className='font-light text-xl overflow-hidden overflow-ellipsis'>
									{title}
								</h3>
							</Link>
							<p className='text-xs'>
								{treeProjects && treeProjects.length > 0
									? `${treeProjects[0].type}`
									: null}
								{energyProjects &&
								energyProjects.length > 0 &&
								solarProjects &&
								solarProjects.length > 0
									? `${solarProjects[0].locationType}`
									: null}
							</p>
						</div>

						<Link
							href={`/i/projects/${projectId}`}
							passHref
						>
							<p className='overflow-hidden overflow-ellipsis mb-4'>
								{description}
							</p>
						</Link>
						<div
							className={
								project.producerId !== user.producerId
									? "flex justify-between"
									: "flex justify-end"
							}
						>
							<button
								onClick={handleKnowMoreClick}
								className='w-1/2 p-2 mr-4 border-none rounded-md bg-green-500 text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-green-700'
							>
								Know more
							</button>
							{project.producerId !== user.producerId ? (
								<button
									onClick={handleInvestClick}
									className='w-1/2 p-2 border-none rounded-md bg-green-500 text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-green-700'
								>
									Invest now
								</button>
							) : null}
						</div>
					</div>
				</a>
			</div>
		);

	if (role === "owner")
		return (
			<div className='w-72 dark:bg-green-900 bg-white rounded-2xl shadow-md relative m-8'>
				<div>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={imageUrl}
						alt={title}
						className='w-full h-48 object-cover rounded-t-2xl'
					/>
					<div className='flex justify-end w-full items-center'>
						<p className='bg-transparent border-none cursor-pointer text-red-400 text-right mr-2 mt-1'>
							{status}
						</p>
						<button
							className='cursor-pointer text-2xl mt-2'
							onClick={handleClick}
						>
							<BsThreeDotsVertical />
						</button>
					</div>
					<Menu
						id='basic-menu'
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
						sx={
							theme === "dark"
								? {
										"& .MuiPaper-root": {
											backgroundColor: "rgb(22 163 74/ 95%)",
											borderColor: "rgb(20 83 45 / 90%)",
											borderWidth: "2px",
											color: "white",
										},
								  }
								: {
										"& .MuiPaper-root": {
											backgroundColor: "",
										},
								  }
						}
					>
						<MenuItem onClick={handleViewProjectClick}>View</MenuItem>
						{status === "verified" && (
							<MenuItem onClick={handlePublish}>Publish</MenuItem>
						)}
						<MenuItem onClick={handleEdit}>Edit</MenuItem>
					</Menu>
				</div>
				<a
					href={`/p/projects/${project.id}`}
					className='no-underline'
				>
					<div className='p-4'>
						<h3 className='mb-2'>{title}</h3>
						<p className='text-xs'>
							{treeProjects && treeProjects.length > 0
								? `${treeProjects[0].type}`
								: null}
							{energyProjects &&
							energyProjects.length > 0 &&
							solarProjects &&
							solarProjects.length > 0
								? `${solarProjects[0].locationType}`
								: null}
						</p>
						<p className='line-clamp-5 overflow-hidden overflow-ellipsis'>
							{description.substring(0, 300)}
						</p>
						<p>Project Coordinator Contact:</p>
						<p>{projectCoordinatorContactName}</p>
						<p>{projectCoordinatorContactPhone}</p>
						<br />
						<p>Project Type: {projectType}</p>
						{treeProjects && treeProjects.length > 0 && (
							<>
								<p>
									Target:{" "}
									{Number(treeProjects[0].treeTarget).toLocaleString("en-US")}{" "}
									Trees
								</p>
								<p>
									Funds Requested: ${treeProjects[0].fundsRequestedPerTree}/Tree
								</p>
							</>
						)}
						<p>Amount raised: ${project.totalAmountRaised}</p>
						<br />
						Created on:
						<p>{moment(createdAt).format("dddd, MMMM Do YYYY, hh:mm:ss")}</p>
					</div>
				</a>
			</div>
		);
};

export default ProjectCard;
