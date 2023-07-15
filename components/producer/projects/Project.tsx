"use client";
import moment from "moment";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import TreeProject from "./TreeProject";
import EnergyProject from "./EnergyProject";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useAppSelector } from "@/redux/hooks";
import { BiPencil, BiTrashAlt } from "react-icons/bi";
import Milestones from "./Milestones";
import { useRouter } from "next/navigation";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/material";
import { RootState } from "@/redux/store";
type Props = {
	project: Project | null | undefined;
	fetchProject?: () => void;
	adminMode: boolean;
};

export default function Project({ project, fetchProject, adminMode }: Props) {
	// Visibility Menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const router = useRouter();
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const role = useAppSelector((state: RootState) => state.user?.activeRole);
	const theme = useAppSelector((state: RootState) => state.user?.currentTheme);
	const [openModal, setOpenModal] = useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		background: `${theme === "dark" ? "rgb(12 33 0 / 90%)" : "white"}`,
		border: "2px solid #000",
		boxShadow: 24,
		p: 4,
	};

	function removeUnderscores(str: string) {
		let newStr = str.replace(/_/g, " ");
		return newStr;
	}
	const toggleProjectVisibility = async () => {
		if (!project?.isVerified) return;
		if (!fetchProject) return;
		const { data, error } = await supabase
			.from("projects")
			.update({
				status: `${project?.status === "draft" ? "published" : "draft"}`,
			})
			.eq("id", project?.id);
		if (error) {
			console.error("Error updating project:", error);
			toast.error(error.message);
		}
		if (data) {
			toast.success("Project visibility toggled");
			fetchProject();
		}
	};
	const handleEdit = () => {
		router.push(`/p/projects/${project?.id}/edit`);
	};
	const handleDelete = async () => {
		if (!checkIfProjectIsDeletable()) return;
		if (!fetchProject) return;
		const deletedAt = new Date();
		const { data, error } = await supabase
			.from("projects")
			.update({ is_deleted: true, status: "deleted", deleted_at: deletedAt })
			.eq("id", project?.id);
		if (error) {
			console.error("Error deleting project:", error);
			toast.error(error.message);
		}
		if (data) {
			toast.success("Project deleted");
			fetchProject();
		}
		if (project?.type === "Tree") {
			const { data, error } = await supabase
				.from("tree_projects")
				.update({ is_deleted: true, status: "deleted", deleted_at: deletedAt })
				.eq("project_id", project?.id);
		}

		if (project?.type === "Energy") {
			const { data, error } = await supabase
				.from("energy_projects")
				.update({ is_deleted: true, status: "deleted", deleted_at: deletedAt })
				.eq("project_id", project?.id);
		}
	};
	const checkIfProjectIsDeletable = () => {
		if (
			(project?.energyInvestments.length === 0 ||
				project?.treeInvestments.length === 0) &&
			(project?.status === "draft" ||
				project?.status === "pending_verification" ||
				project?.status === "pending_update_review" ||
				project?.status === "published" ||
				project?.status === "not_approved")
		) {
			return true;
		} else {
			toast.error(
				"Project cannot be deleted, please make sure it is private or all investors have withdrawn their investments. Contact support if you need further assistance."
			);
			return false;
		}
	};
	const [deleteConfirm, setDeleteConfirm] = useState("");
	const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true);
	const handleDeleteConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDeleteConfirm(e.target.value);
	};
	// Here we have a use effect that checks if deleteConfirm is equal to the project title, if it is, then the delete button is enabled, otherwise it is disabled.
	useEffect(() => {
		if (deleteConfirm === project?.title) {
			setDeleteButtonDisabled(false);
		} else {
			setDeleteButtonDisabled(true);
		}
	}, [deleteConfirm, project?.title]);

	const handleGoBack = () => {
		router.back();
	};
	return (
		<div className=''>
			<p
				onClick={handleGoBack}
				className='cursor-pointer mb-4 text-sm font-semibold transition-all hover:text-green-700'
			>
				{role === "investor"
					? `← Back to projects`
					: role === "producer"
					? `← Back to my projects`
					: `← Back`}
			</p>
			{adminMode && (
				<div className='flex justify-end mb-2'>
					<button
						onClick={handleEdit}
						className='p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600'
					>
						<BiPencil className='text-2xl' />
					</button>
					<button
						onClick={handleOpenModal}
						className='p-2 rounded bg-red-700 text-white font-bold transition-all hover:bg-red-600 ml-2'
					>
						<BiTrashAlt className='text-2xl' />
					</button>
					<Modal
						open={openModal}
						onClose={handleCloseModal}
						aria-labelledby='modal-modal-title'
						aria-describedby='modal-modal-description'
					>
						<Box sx={style}>
							<p>Are you sure you want to delete this project?</p>
							<p>
								Note: Any project investments made by investors must be returned
								to the original investor before deleting.
							</p>
							<div className='flex flex-col mt-4'>
								<p>Type &quot;{project?.title}&quot; to delete this project.</p>
								<input
									value={deleteConfirm}
									onChange={handleDeleteConfirm}
									className='border-2 border-gray-300 rounded-md p-2 w-auto my-2'
								/>
								<button
									disabled={deleteButtonDisabled}
									className={
										deleteButtonDisabled
											? "text-sm p-2 rounded bg-gray-400 text-white font-bold transition-all cursor-default"
											: "text-sm p-2 rounded bg-red-700 text-white font-bold transition-all hover:bg-red-600"
									}
									onClick={handleDelete}
								>
									Delete project
								</button>
							</div>
						</Box>
					</Modal>
				</div>
			)}
			<Image
				className='w-full h-64 object-cover object-top mb-4'
				src={
					project?.imageUrl
						? project?.imageUrl
						: "https://via.placeholder.com/1500x500"
				}
				alt='Banner'
				width={1500}
				height={500}
			/>

			<div className='flex items-center justify-between'>
				<h2 className='text-2xl font-bold mb-2'>
					{project?.title} - {project?.type} Project
				</h2>
				{adminMode && (
					<h4 className='text-sm px-6 py-2 border-white rounded border-[1px]'>
						{(project?.status === "draft" || project?.status === "published") &&
						project?.isVerified ? (
							<>
								<div
									className='cursor-pointer'
									id='basic-button'
									aria-controls={open ? "basic-menu" : undefined}
									aria-haspopup='true'
									aria-expanded={open ? "true" : undefined}
									onClick={handleClick}
								>
									{removeUnderscores(project?.status)}
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
														backgroundColor: "rgb(12 33 0 / 90%)",
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
										onClick={toggleProjectVisibility}
									>
										{project?.status === "draft"
											? "Make Public"
											: "Make Private"}
									</MenuItem>
								</Menu>
							</>
						) : project?.status === "pending_verification" ||
						  project?.status === "pending_update_review" ? (
							removeUnderscores(project?.status)
						) : null}
					</h4>
				)}
			</div>
			<hr className='dark:border-green-800 my-4' />
			<div className='flex justify-between'>
				<div>
					<p>
						Created at: {moment(project?.createdAt).format("MMMM DD, yyyy LT")}
					</p>
					<p>
						Last updated at:{" "}
						{project?.updatedAt
							? moment(project?.updatedAt).format("MMMM DD, yyyy LT")
							: moment(project?.createdAt).format("MMMM DD, yyyy LT")}
					</p>

					<p>
						Coordinator: {project?.projectCoordinatorContact?.name},{" "}
						{project?.projectCoordinatorContact?.phone}
					</p>
					<p>Address: {project?.producerProperties?.address?.addressLineOne}</p>
					<p>Area: {project?.totalAreaSqkm} sq ft</p>
					<p>
						Description: <br />
						{project?.description}
					</p>
					{/* <p>Funds collected: ${project?.fundsCollected}</p> */}
					{/* <p>Investors: {project?.investorCount}</p> */}
				</div>
				{project?.type === "Tree" ? (
					<TreeProject
						treeProject={project?.treeProjects[0]}
						project={project}
						treeInvestments={project?.treeInvestments}
					/>
				) : project?.type === "Energy" ? (
					<EnergyProject project={project?.energyProjects[0]} />
				) : null}
			</div>
			<Milestones
				project={project}
				adminMode={adminMode}
			/>
		</div>
	);
}
