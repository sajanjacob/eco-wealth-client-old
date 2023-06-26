"use client";
import React, { useRef, useState, useEffect, useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import Link from "next/link";
import moment from "moment";
import supabase from "@/utils/supabaseClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ListenerEffect } from "@reduxjs/toolkit";
import { useAppSelector } from "@/redux/hooks";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

type Props = {
	imageUrl: string;
	title: string;
	description: string;
	projectId: string;
	status: string;
	role: string;
	projectCoordinatorContactName: string;
	projectCoordinatorContactPhone: string;
	treeTarget: number;
	fundsRequestedPerTree: number;
	projectType: string;
	createdAt: string;
	isVerified: boolean;
};
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
	isVerified,
}: Props) => {
	const [isFavorited, setIsFavorited] = useState(false);
	const [isFavIconHovered, setIsFavIconHovered] = useState(false);

	const [menuOpen, setMenuOpen] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
		} catch (error: any) {
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

	const handleViewProjectClick = () => {
		if (role === "investor") router.push(`/i/projects/${projectId}`);
		if (role === "owner") router.push(`/p/projects/${projectId}`);
	};

	const theme = useAppSelector((state) => state.user?.currentTheme);

	const handleLearnMoreClick = () => router.push(`/i/projects/${projectId}`);
	const handleInvestClick = () =>
		router.push(`/i/projects/${projectId}/invest`);

	// Initiates the report project flow
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
			<div className='w-72 dark:bg-green-950 bg-white rounded-2xl shadow-md relative mx-8 my-16 max-h-full z-10'>
				<a className='block text-inherit no-underline'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						className='w-full h-48 object-cover'
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
					<div className='p-4'>
						<p className='border border-gray-300 inline-block px-2 py-1 rounded-md'>
							{projectType}
						</p>
						<div className='flex justify-between w-full items-center'>
							<Link
								href={`/i/projects/${projectId}`}
								passHref
							>
								<h3 className='mb-2'>{title}</h3>
							</Link>
							<div className='cursor-pointer text-2xl mt-2 text-gray-800'>
								<BsThreeDotsVertical />
							</div>
						</div>
						{menuOpen && (
							<div className='fixed top-0 left-0 bg-white border border-gray-300 rounded-md p-2 flex flex-col gap-2 z-50'>
								<button className='bg-transparent border-none text-gray-800 text-sm cursor-pointer text-left'>
									View
								</button>
								<button className='bg-transparent border-none text-gray-800 text-sm cursor-pointer text-left'>
									Report
								</button>
							</div>
						)}
						<Link
							href={`/i/projects/${projectId}`}
							passHref
						>
							<p className='overflow-hidden overflow-ellipsis'>{description}</p>
						</Link>
						<div className='flex justify-between'>
							<button className='w-1/2 p-2 border-none rounded-md bg-green-500 text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-green-700'>
								Learn More
							</button>
							<button className='w-1/2 p-2 border-none rounded-md bg-green-500 text-white cursor-pointer transition-all duration-300 ease-in-out hover:bg-green-700'>
								Invest
							</button>
						</div>
					</div>
				</a>
			</div>
		);

	if (role === "owner")
		return (
			<div className='w-72 dark:bg-green-800 bg-white rounded-2xl shadow-md relative m-8'>
				<div>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={imageUrl}
						alt={title}
						className='w-full h-48 object-cover'
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
					href={`/p/projects/${projectId}`}
					className='no-underline'
				>
					<div className='p-4'>
						<h3 className='mb-2'>{title}</h3>
						<p className='line-clamp-5 overflow-hidden overflow-ellipsis'>
							{description.substring(0, 300)}
						</p>
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
					</div>
				</a>
			</div>
		);
};

export default ProjectCard;
