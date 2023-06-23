import moment from "moment";
import Image from "next/image";
import React from "react";
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

type Props = {
	project: Project | null | undefined;
	fetchProject: () => void;
};

export default function Project({ project, fetchProject }: Props) {
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
	function removeUnderscores(str: string) {
		let newStr = str.replace(/_/g, " ");
		return newStr;
	}
	const toggleProjectVisibility = async () => {
		const { data, error } = await supabase
			.from("projects")
			.update({
				status: `${
					project?.status === "verified_draft"
						? "verified_public"
						: "verified_draft"
				}`,
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
	const theme = useAppSelector((state) => state.user?.currentTheme);
	const handleEdit = () => {
		router.push(`/p/projects/${project?.id}/edit`);
	};

	return (
		<div className=''>
			<div className='flex justify-end mb-2'>
				<button
					onClick={handleEdit}
					className='p-2 rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600'
				>
					<BiPencil className='text-2xl' />
				</button>
				<button className='p-2 rounded bg-red-700 text-white font-bold transition-all hover:bg-red-600 ml-2'>
					<BiTrashAlt className='text-2xl' />
				</button>
			</div>
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
				<h4 className='text-sm px-6 py-2 border-white rounded border-[1px]'>
					{project?.status === ("verified_draft" || "verified_public") ? (
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
									{project?.status === "verified_draft"
										? "Make Public"
										: "Make Private"}
								</MenuItem>
							</Menu>
						</>
					) : project?.status === "pending_verification" ? (
						removeUnderscores(project?.status)
					) : null}
				</h4>
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
						Coordinator: {project?.projectCoordinatorContact.name},{" "}
						{project?.projectCoordinatorContact.phone}
					</p>
					<p>Address: {project?.producerProperties.address.addressLineOne}</p>
					<p>Area: {project?.totalAreaSqkm} sq ft</p>
					{/* <p>Funds collected: ${project?.fundsCollected}</p> */}
					{/* <p>Investors: {project?.investorCount}</p> */}
				</div>
				{project?.type === "Tree" ? (
					<TreeProject project={project?.treeProjects[0]} />
				) : (
					<EnergyProject project={project?.energyProjects[0]} />
				)}
			</div>
			<Milestones project={project} />
		</div>
	);
}
