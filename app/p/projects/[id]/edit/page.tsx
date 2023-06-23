"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import supabase from "@/utils/supabaseClient";
import { BiSave } from "react-icons/bi";
import DOMPurify from "isomorphic-dompurify";
import { useParams } from "next/navigation";
import convertToCamelCase from "@/utils/convertToCamelCase";

type Inputs = {
	title: string;
	description: string;
	updatedAt: string;
	treeTarget: number;
	imageUrl: string;
	fundsRequestedPerTree: number;
	projectType: string;
	treeProjectType: string;
	energyProjectType: string;
	projectCoordinatorContactName: string;
	projectCoordinatorContactPhone: string;
	propertyId: string;
	totalAreaSqkm: number;
	// Fields for milestones
	milestoneTitle: string;
	milestoneDescription: string;
	milestoneUpdatedAt: string;
	milestoneBody: string;
	// Fields for energy projects
	totalFundsRequested: number;
	totalFundsRaised: number;
	energyProductionTarget: number;
	actualEnergyProduction: number;
	energyProductionUnit: string;
	energyProductionUnitValue: number;
	averageYearlyProduction: number;
	targetArrays: number;
	systemSize: number;
	systemCapacity: number;
	labourCost: number;
	systemCost: number;
	maintenanceCost: number;
	installerDetailsName: string;
	installerType: string;
	// Fields for tree projects
	treeCount: number;
};

export default function EditProject() {
	const { register, handleSubmit, setValue } = useForm<Inputs>();
	const [project, setProject] = useState<Project | null>(null);
	const path = useParams();
	const { id } = path;
	// Fetch project details on component mount
	useEffect(() => {
		const fetchProject = async () => {
			const { data, error } = await supabase
				.from("projects")
				.select(
					`*, tree_projects(*), energy_projects(*), producer_properties(*), project_milestones(*)`
				)
				.eq("id", id);

			if (error) {
				console.error("Error fetching project:", error);
				toast.error(error.message);
			}
			if (data) {
				setProject(convertToCamelCase(data[0]) as Project);
			}
		};

		fetchProject();
	}, [id]);

	// Set form fields when project state changes
	useEffect(() => {
		if (project) {
			setValue("title", project.title);
			setValue("description", project.description);
			setValue("updatedAt", project.updatedAt);
			setValue("treeTarget", project.treeTarget);
			setValue("imageUrl", project.imageUrl);
			setValue("fundsRequestedPerTree", project.fundsRequestedPerTree);
			setValue("projectType", project.projectType);
			setValue("treeProjectType", project.treeProjectType);
			setValue("energyProjectType", project.energyProjectType);
			setValue(
				"projectCoordinatorContactName",
				project.projectCoordinatorContact.name
			);
			setValue(
				"projectCoordinatorContactPhone",
				project.projectCoordinatorContact.phone
			);
			setValue("propertyId", project.producerProperties.id);
			setValue("totalAreaSqkm", project.totalAreaSqkm);
			// Set other fields as needed
		}
	}, [project, setValue]);

	const onSubmit = async (data: Inputs) => {
		const { data: updatedData, error } = await supabase
			.from("projects")
			.update(data)
			.eq("id", id);

		if (error) {
			console.error("Error updating project:", error);
			toast.error(error.message);
		}
		if (updatedData) {
			toast.success("Project updated successfully");
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label htmlFor='title'>Title</label>
				<input
					id='title'
					type='text'
					{...register("title")}
				/>
			</div>
			<div>
				<label htmlFor='description'>Description</label>
				<textarea
					id='description'
					{...register("description")}
				/>
			</div>
			<div>
				<label htmlFor='imageUrl'>Image URL</label>
				<input
					id='imageUrl'
					type='text'
					{...register("imageUrl")}
				/>
			</div>
			<div>
				<label htmlFor='projectCoordinatorContactName'>Coordinator Name</label>
				<input
					id='projectCoordinatorContactName'
					type='text'
					{...register("projectCoordinatorContactName")}
				/>
			</div>
			<div>
				<label htmlFor='projectCoordinatorContactPhone'>
					Coordinator Phone
				</label>
				<input
					id='projectCoordinatorContactPhone'
					type='text'
					{...register("projectCoordinatorContactPhone")}
				/>
			</div>
			<div>
				<label htmlFor='propertyId'>Property ID</label>
				<input
					id='propertyId'
					type='text'
					{...register("propertyId")}
				/>
			</div>
			<div>
				<label htmlFor='totalAreaSqkm'>Total Area (sq km)</label>
				<input
					id='totalAreaSqkm'
					type='text'
					{...register("totalAreaSqkm")}
				/>
			</div>
			{/* Add more form fields as needed for each project type */}
			{project?.projectType === "Energy" && (
				<>
					<div>
						<label htmlFor='totalFundsRequested'>Total Funds Requested</label>
						<input
							id='totalFundsRequested'
							type='text'
							{...register("totalFundsRequested")}
						/>
					</div>
					<div>
						<label htmlFor='totalFundsRaised'>Total Funds Raised</label>
						<input
							id='totalFundsRaised'
							type='text'
							{...register("totalFundsRaised")}
						/>
					</div>
					<div>
						<label htmlFor='energyProductionTarget'>
							Energy Production Target
						</label>
						<input
							id='energyProductionTarget'
							type='text'
							{...register("energyProductionTarget")}
						/>
					</div>
					{/* Add remaining form fields for energy projects */}
				</>
			)}
			{project?.projectType === "Tree" && (
				<>
					<div>
						<label htmlFor='treeTarget'>Tree Target</label>
						<input
							id='treeTarget'
							type='text'
							{...register("treeTarget")}
						/>
					</div>
					<div>
						<label htmlFor='treeCount'>Tree Count</label>
						<input
							id='treeCount'
							type='text'
							{...register("treeCount")}
						/>
					</div>
					<div>
						<label htmlFor='fundsRequestedPerTree'>
							Funds Requested Per Tree
						</label>
						<input
							id='fundsRequestedPerTree'
							type='text'
							{...register("fundsRequestedPerTree")}
						/>
					</div>
					{/* Add remaining form fields for tree projects */}
				</>
			)}
			<div>
				<button type='submit'>
					<BiSave className='text-2xl' />
					Save
				</button>
			</div>
		</form>
	);
}
