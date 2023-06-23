"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";
interface FormValues {
	title: string;
	image: File | null;
	coordinatorName: string;
	coordinatorPhone: string;
	description: string;
	numTrees: number;
	pricePerTree: number;
	projectType: string;
	agreements: boolean[];
	imageFile: FileList | null;
	imageUrlInput: string;
	uploadMethod: boolean;
	treeType: string;
	energyType: string;
	totalArea: number;
	properties: Property[]; // Replace 'Property' with the actual type
	projectAddressId: string;
	projectBannerUrl: string;
	energyProductionTarget: number;
	numOfArrays: number;
	installationTeam: string;
	installedSystemSize: number;
	photovoltaicCapacity: number;
	estimatedInstallationCost: number;
	estimatedSystemCost: number;
	estimatedMaintenanceCost: number;
	connectWithSolarPartner: string;
	fundsRequested: number;
}

function AddProject() {
	const router = useRouter();
	const user = useAppSelector((state: RootState) => state.user);
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<FormValues>({
		defaultValues: {
			title: "",
			image: null,
			coordinatorName: "",
			coordinatorPhone: "",
			description: "",
			numTrees: 0,
			pricePerTree: 0,
			projectType: "",
			agreements: [false, false, false],
			imageFile: null,
			imageUrlInput: "",
			uploadMethod: true,
			treeType: "",
			energyType: "",
			totalArea: 0,
			properties: [],
			projectAddressId: "",
			projectBannerUrl: "",
			energyProductionTarget: 0,
			numOfArrays: 0,
			installationTeam: "",
			installedSystemSize: 0,
			photovoltaicCapacity: 0,
			estimatedInstallationCost: 0,
			estimatedSystemCost: 0,
			estimatedMaintenanceCost: 0,
			connectWithSolarPartner: "",
			fundsRequested: 0,
		},
	});
	const formValues = getValues();
	const [loading, setLoading] = useState({ loading: false, message: "" });
	const projectType = watch("projectType");
	const uploadMethod = watch("uploadMethod");
	const energyType = watch("energyType");
	const installationTeam = watch("installationTeam");
	const properties = watch("properties");
	// Here we retrieve the properties the user submitted that are verified so
	// we can list them as options for the user to select from when adding a project.
	const fetchProperties = async (producerId: string) => {
		setLoading({ loading: true, message: "Fetching properties..." });
		const { data: propertyData, error: propertyError } = await supabase
			.from("producer_properties")
			.select("*")
			.eq("producer_id", producerId)
			.eq("is_verified", true);
		if (propertyError) {
			toast.error(`Error fetching properties. ${propertyError.message}`);
			console.log("error fetching properties: ", propertyError);
			setLoading({ loading: false, message: "" });
		}
		if (propertyData) {
			setValue("properties", convertToCamelCase(propertyData) as Property[]);
			setLoading({ loading: false, message: "" });
		}
	};

	useEffect(() => {
		if (user) {
			fetchProperties(user.producerId || "");
		}
	}, [user]);

	let fileName = "";
	// TODO: TEST THIS -> Generated from Co-Pilot
	const uploadImage = async (file: File) => {
		const fileExt = file.name.split(".").pop();
		fileName = `${Math.random()}.${fileExt}`;
		const filePath = `projects/${user.id}/${fileName}`;
		const { data, error } = await supabase.storage
			.from("projects")
			.upload(filePath, file);
		if (error) {
			throw error;
		}
	};
	const producerId = user.producerId;

	const createProject = async (bannerUrl: string) => {
		const projectData: Project = {
			title: formValues.title,
			imageUrl: bannerUrl,
			projectCoordinatorContact: {
				name: formValues.coordinatorName,
				phone: formValues.coordinatorPhone,
			},
			description: formValues.description,
			treeTarget: formValues.numTrees,
			fundsRequestedPerTree: formValues.pricePerTree,
			producerId: producerId,
			status: "pending_verification",
			type: formValues.treeType,
			projectVerificationConsentGiven: true,
			adminFeeConsent: true,
			agreedToPayInvestor: true,
			createdAt: Date.now().toString(),
			updatedAt: Date.now().toString(),
			treeCount: 0,
			projectType: formValues.projectType,
			projectId: "",
			totalArea: formValues.totalArea,
			id: "",
			userId: user.id,
			treeProjectType: formValues.treeType,
			energyProjectType: energyType,
			propertyId: formValues.projectAddressId,
			fundsCollected: 0,
			producerProperties: {
				id: "",
				address: {
					addressLineOne: "",
					addressLineTwo: "",
					city: "",
					country: "",
					postalCode: "",
					stateProvince: "",
				},
			},
			investorCount: 0,
			totalAreaSqkm: 0,
			treeProjects: [],
			energyProjects: [],
			projectMilestones: [],
		};
		const { data: project, error } = await supabase
			.from("projects")
			.insert([
				{
					id: uuidv4(),
					title: projectData.title,
					image_url: projectData.imageUrl,
					project_coordinator_contact: projectData.projectCoordinatorContact,
					description: projectData.description,
					producer_id: projectData.producerId,
					status: projectData.status,
					type: projectData.projectType,
					project_verification_consent_given:
						projectData.projectVerificationConsentGiven,
					admin_fee_consent: projectData.adminFeeConsent,
					agreed_to_pay_investor: projectData.agreedToPayInvestor,
					total_area_sqkm: projectData.totalArea,
					property_address_id: projectData.propertyId,
				},
			])
			.select();
		if (projectType === "Tree" && project) {
			const { data, error } = await supabase.from("tree_projects").insert([
				{
					id: uuidv4(),
					project_id: project?.[0].id,
					tree_target: projectData.treeTarget,
					funds_requested_per_tree: projectData.fundsRequestedPerTree,
					type: projectData.treeProjectType,
					tree_count: 0,
				},
			]);
		}
		if (projectType === "Energy" && project) {
			const { data, error } = await supabase.from("energy_projects").insert([
				{
					id: uuidv4(),
					project_id: project?.[0].id,
					tree_target: projectData.treeTarget,
					funds_requested_per_tree: projectData.fundsRequestedPerTree,
					type: projectData.treeProjectType,
					tree_count: 0,
				},
			]);
		}
		if (error) {
			toast.error(`Error submitting project. ${error.message}`);
			setLoading({ loading: false, message: "" });
		} else {
			toast.success("Project submitted successfully!");
			setLoading({ loading: false, message: "" });
			router.push("/p/projects");
		}
	};
	const onSubmit = async () => {
		setLoading({ loading: true, message: "Uploading project..." });
		const formValues = getValues();

		if (!formValues.agreements.every((val) => val)) {
			toast.warning("Please accept all agreements before submitting.");
			setLoading({ loading: false, message: "" });
			return;
		}

		if ((formValues.imageFile as FileList).length > 0) {
			try {
				await uploadImage((formValues.imageFile as FileList)[0]);
			} catch (error) {
				toast.error(`Error uploading image. ${error}`);
				console.log("error uploading image: ", error);

				setLoading({ loading: false, message: "" });
				return;
			} finally {
				const fileExt = (formValues.imageFile as FileList)[0].name
					.split(".")
					.pop();
				if (fileName === "") {
					fileName = `${Math.random()}.${fileExt}`;
				}
				const filePath = `projects/${user.id}/${fileName}`;
				const { data: publicURL } = supabase.storage
					.from("projects")
					.getPublicUrl(filePath);
				if (!publicURL) {
					throw new Error("Error uploading image");
				}
				if (publicURL.publicUrl) {
					console.log("publicURL: ", publicURL.publicUrl);
					createProject(publicURL.publicUrl);
				}
			}
		} else if (formValues.imageUrlInput) {
			createProject(formValues.imageUrlInput);
		}
	};
	const toggleUploadMethod = () => {
		setValue("uploadMethod", !getValues("uploadMethod"));
	};

	if (loading.loading)
		return (
			<div className='container mx-auto py-6 px-4 min-h-[100vh]'>
				<h1 className='text-2xl font-semibold mb-6'>Add Project</h1>
				<div className='flex justify-center items-center flex-col'>
					<CircularProgress
						className='mb-8'
						color='success'
					/>
					<p>{loading.message}</p>
				</div>
			</div>
		);

	return (
		<div className='container mx-auto py-6 px-4 min-h-[100vh]'>
			<h1 className='text-2xl font-semibold mb-6'>Add Project</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Title:</span>
					<input
						type='text'
						className='text-gray-700 border-2 border-gray-300 rounded-md p-2 w-[500px]'
						{...register("title", { required: true })}
					/>
				</label>
				<br />
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Location:</span>
					<select
						{...register("projectAddressId", { required: true })}
						className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
					>
						<option value=''>
							Select the address your project will be operated from
						</option>
						{properties &&
							properties.map(
								(property: {
									id: React.Key | null | undefined;
									address: {
										addressLineOne:
											| string
											| number
											| boolean
											| React.ReactElement<
													any,
													string | React.JSXElementConstructor<any>
											  >
											| React.ReactFragment
											| React.ReactPortal
											| React.PromiseLikeOfReactNode
											| null
											| undefined;
										addressLineTwo: any;
										city:
											| string
											| number
											| boolean
											| React.ReactElement<
													any,
													string | React.JSXElementConstructor<any>
											  >
											| React.ReactFragment
											| React.ReactPortal
											| React.PromiseLikeOfReactNode
											| null
											| undefined;
										stateProvince:
											| string
											| number
											| boolean
											| React.ReactElement<
													any,
													string | React.JSXElementConstructor<any>
											  >
											| React.ReactFragment
											| React.ReactPortal
											| React.PromiseLikeOfReactNode
											| null
											| undefined;
										country:
											| string
											| number
											| boolean
											| React.ReactElement<
													any,
													string | React.JSXElementConstructor<any>
											  >
											| React.ReactFragment
											| React.ReactPortal
											| React.PromiseLikeOfReactNode
											| null
											| undefined;
									};
								}) => (
									<option
										key={property.id}
										value={property.id ? property.id.toString() : undefined}
									>
										{property.address.addressLineOne},{" "}
										{property.address.addressLineTwo &&
											`${property.address.addressLineTwo}, `}{" "}
										{property.address.city}, {property.address.stateProvince},{" "}
										{property.address.country}
									</option>
								)
							)}
					</select>
				</label>
				<br />
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Type:</span>
					<select
						{...register("projectType", { required: true })}
						className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
					>
						<option value=''>Select a project type</option>
						<option value='Tree'>Tree</option>
						<option value='Energy'>Renewable Energy</option>
					</select>
				</label>

				{projectType === "Tree" && (
					<label className='flex flex-col mt-[8px]'>
						<span className='mb-[4px] mt-2'>Tree Project Type:</span>
						<select
							{...register("treeType", { required: true })}
							className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
						>
							<option value=''>Select a tree project type</option>
							<option value='Timber / Lumber'>Timber / Lumber</option>
							<option value='Fruit'>Fruits</option>
							<option value='Nut'>Nuts</option>
							<option value='Bio Fuel'>Bio Fuel</option>
							<option value='Pulp'>Pulp</option>
							<option value='Syrup'>Syrup</option>
							<option value='Oil / Chemical'>Oils / Chemicals</option>
							<option value='Non-Profit Initiative'>
								Non-Profit Initiatives
							</option>
						</select>
					</label>
				)}
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Total Project Area (km²)</span>
					<input
						type='number'
						{...register("totalArea", { required: true })}
						className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
					/>
				</label>
				{projectType === "Tree" && (
					<>
						<label className='flex flex-col'>
							<span className='mb-[4px] mt-2'>
								How many trees are you aiming to plant for this project?
							</span>
							<input
								type='number'
								{...register("numTrees", { required: true })}
								className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
							/>
						</label>
						<label className='flex flex-col'>
							<span className='mb-[4px] mt-2'>
								How much do you want to raise per tree?
							</span>
							$
							<input
								type='number'
								step='1'
								{...register("pricePerTree", { required: true })}
								className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
							/>
						</label>
					</>
				)}
				{projectType === "Energy" && (
					<>
						<label className='flex flex-col mt-[8px]'>
							<span className='mb-[4px] mt-2'>
								Renewable Energy Project Type:
							</span>
							<select
								{...register("energyType", { required: true })}
								className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
							>
								<option value=''>Select a renewable energy project type</option>
								<option value='Solar'>Solar</option>
							</select>
						</label>
						{energyType === "Solar" && (
							<>
								<label className='flex flex-col mt-[8px]'>
									<span className='mb-[4px] mt-2'>
										What is the target yearly energy production of this project
										(kWh)?
									</span>
									<input
										{...register("energyProductionTarget", { required: true })}
										className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
										type='number'
									/>
								</label>
								<label className='flex flex-col mt-[8px]'>
									<span className='mb-[4px] mt-2'>
										How many arrays will be setup?
									</span>
									<input
										{...register("numOfArrays", { required: true })}
										className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
										type='text'
									/>
								</label>
								<label className='flex flex-col mt-[8px]'>
									<span className='mb-[4px] mt-2'>
										Are you contracting a company to install the system, doing
										this with your own team of installers, or are you still
										looking for an installation team?
									</span>
									<select
										{...register("installationTeam", { required: true })}
										className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
									>
										<option value=''>Select one</option>
										<option value='Has company'>
											I&apos;ve hired a company.
										</option>
										<option value='Has team'>I have a team.</option>
										<option value='Needs team'>
											I&apos;m looking for a professional team to install the
											system.
										</option>
									</select>
								</label>
								{installationTeam === ("Has company" || "Has team") ? (
									<>
										<label className='flex flex-col mt-[8px]'>
											<span className='mb-[4px] mt-2'>
												What will the size of the installed system be? (in kW)
											</span>
											<input
												{...register("installedSystemSize")}
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px]'>
											<span className='mb-4px] mt-2'>
												If known, what is the photovoltaic capacity of the
												system?
											</span>
											<input
												{...register("photovoltaicCapacity")}
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px]'>
											<span className='mb-[4px] mt-2'>
												What is the estimated cost of the system installation?
											</span>
											$
											<input
												{...register("estimatedInstallationCost")}
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px]'>
											<span className='mb-[4px] mt-2'>
												What is the total cost of the system minus the labour?
											</span>
											<input
												{...register("estimatedSystemCost")}
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px]'>
											<span className='mb-[4px] mt-2'>
												If discussed, what are the estimated maintenance costs
												for the system?
											</span>
											<input
												{...register("estimatedMaintenanceCost")}
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
									</>
								) : installationTeam === "Needs team" ? (
									<>
										<label className='flex flex-col mt-[8px]'>
											<span className='mb-[4px] mt-2'>
												Do you want us to connect you with a trusted solar
												installation partner in your area to handle the
												installation for this project?
											</span>
											<select
												{...register("connectWithSolarPartner")}
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
											>
												<option value=''>Select one</option>
												<option value='Connect with partner'>
													Yes, connect me with a trusted Solar Installation
													Partner.
												</option>
												<option value='Do not connect with partner'>
													No, I will look for a team on my own.
												</option>
											</select>
										</label>
									</>
								) : null}
								<label className='flex flex-col mt-[8px]'>
									<span className='mb-[4px] mt-2'>
										How much do you want to raise for this project?
									</span>
									<input
										{...register("fundsRequested")}
										className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
										type='number'
									/>
								</label>
							</>
						)}
					</>
				)}
				<br />
				<label>
					<span className='mt-2'>Project Banner Image:</span>
					<br />
					<button
						type='button'
						onClick={toggleUploadMethod}
						className='mb-4 mt-2 text-left mr-2 w-fit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
					>
						{uploadMethod ? "Switch to image URL" : "Switch to image upload"}
					</button>
					<br />
					{uploadMethod ? (
						<input
							{...register("imageFile")}
							type='file'
							accept='image/png, image/jpeg'
							className='border-2 border-gray-300 rounded-md p-2 w-[500px] cursor-pointer'
						/>
					) : (
						<label className='flex flex-col'>
							<span className='mb-[4px] mt-2'>Paste direct image URL:</span>
							<input
								{...register("imageUrlInput")}
								type='text'
								className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
							/>
						</label>
					)}
				</label>
				<br />

				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Coordinator Name:</span>
					<input
						{...register("coordinatorName", { required: true })}
						type='text'
						className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
					/>
				</label>

				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Coordinator Phone:</span>
					<input
						{...register("coordinatorPhone", { required: true })}
						type='tel'
						className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
					/>
				</label>
				<br />
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Description:</span>
					<textarea
						{...register("description", { required: true })}
						className='text-gray-700 border-2 border-gray-300 rounded-md p-2 h-[150px] w-[500px]'
					/>
				</label>
				<br />

				<h3>Agreements:</h3>
				<label>
					<input
						{...register("agreements.0")}
						type='checkbox'
						className='mr-2'
					/>
					Agreement 1
				</label>
				<br />
				<label>
					<input
						{...register("agreements.1")}
						type='checkbox'
						className='mr-2'
					/>
					Agreement 2
				</label>
				<br />
				<label>
					<input
						{...register("agreements.2")}
						type='checkbox'
						className='mr-2'
					/>
					Agreement 3
				</label>
				<br />
				<button
					type='submit'
					className='mt-[16px] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
				>
					Submit Project
				</button>
			</form>
		</div>
	);
}

export default withAuth(AddProject);
