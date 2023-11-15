"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";
import axios, { all } from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Agreement from "@/components/producer/projects/Agreement";
import Switch from "react-switch";
import UrgentNotification from "@/components/UrgentNotification";
import { setProducer } from "@/redux/features/producerSlice";
import getBasePath from "@/lib/getBasePath";
interface FormValues {
	title: string;
	image: File | null;
	coordinatorName: string;
	coordinatorPhone: string;
	description: string;
	numTrees: number;
	pricePerTree: number;
	projectType: string;
	agreements: boolean;
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
	estimatedMaterialCost: number;
	estimatedInstallationDate: string;
	connectWithSolarPartner: string;
	fundsRequested: number;
	locationType: string;

	isNonProfit: boolean;
	estRevenue: number;
	estRoiPercentage: number;

	estimatedSeedCost: number;
	estimatedLabourCost: number;
	estimatedPlantingDate: string;
	estimatedMaturityDate: string;
}
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "50vw",
	height: "70vh",
	bgcolor: "rgb(20 83 45 / 100%)",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
function AddProject() {
	const router = useRouter();
	const user = useAppSelector((state: RootState) => state.user);
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const supabase = supabaseClient;
	const [isNonProfit, setIsNonProfit] = useState(false);
	const handleIsNonProfitChange = (checked: boolean) => {
		setIsNonProfit(checked);
		setValue("isNonProfit", checked);
	};
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
			agreements: false,
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
			estimatedMaterialCost: 0,
			estimatedInstallationDate: "",
			connectWithSolarPartner: "",
			fundsRequested: 0,
			locationType: "",
			isNonProfit: false,
			estRevenue: 0,
			estRoiPercentage: 0,
			estimatedSeedCost: 0,
			estimatedLabourCost: 0,
			estimatedPlantingDate: "",
			estimatedMaturityDate: "",
		},
	});
	const formValues = getValues();
	const [loading, setLoading] = useState({ loading: false, message: "" });
	const projectType = watch("projectType");
	const locationType = watch("locationType");
	const uploadMethod = watch("uploadMethod");
	const energyType = watch("energyType");
	const installationTeam = watch("installationTeam");
	const properties = watch("properties");
	const treeType = watch("treeType");
	const [foundProperties, setFoundProperties] = useState<Property[]>([]);
	const [agreements, setAgreements] = useState<boolean>(false);
	// Here we retrieve the properties the user submitted that are verified so
	// we can list them as options for the user to select from when adding a project.
	const fetchProperties = async (producerId: string | null) => {
		if (!producerId) return;
		setLoading({ loading: true, message: "Fetching properties..." });
		const { data: propertyData, error: propertyError } = await supabase
			.from("producer_properties")
			.select("*")
			.eq("producer_id", producerId)
			.eq("is_verified", true);
		if (propertyError) {
			console.log("error fetching properties: ", propertyError);
			setLoading({ loading: false, message: "" });
		}
		if (propertyData) {
			setFoundProperties(convertToCamelCase(propertyData) as Property[]);
			setLoading({ loading: false, message: "" });
		}
	};

	useEffect(() => {
		if (foundProperties.length > 0) {
			setValue("properties", foundProperties);
		}
	}, [foundProperties]);

	useEffect(() => {
		if (user) {
			fetchProperties(user.producerId);
		}
	}, [user]);

	let fileName = "";
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

	// Note to future me - Might need to update everything to 'watch' for react-hook-form
	const createProject = async (bannerUrl: string) => {
		const projectData = {
			title: formValues.title,
			imageUrl: bannerUrl,
			projectCoordinatorContact: {
				name: formValues.coordinatorName,
				phone: formValues.coordinatorPhone,
			},
			description: formValues.description,
			producerId: producerId,
			status: "pending_verification",
			type: formValues.projectType,
			agreementAccepted: agreements,

			totalAreaSqkm: formValues.totalArea,
			propertyAddressId: formValues.projectAddressId,

			treeTarget: formValues.numTrees,
			treeProjectType: formValues.treeType,
			estMaturityDate: formValues.estimatedMaturityDate,
			estPlantingDate: formValues.estimatedPlantingDate,
			totalFundsRequested: formValues.fundsRequested,
			energyProductionTarget: formValues.energyProductionTarget,
			targetArrays: formValues.numOfArrays,
			installationTeam: formValues.installationTeam,
			systemSizeInKw: formValues.installedSystemSize,
			systemCapacity: formValues.photovoltaicCapacity,
			estSeedCost: formValues.estimatedSeedCost,
			labourCost:
				formValues.projectType === "Tree"
					? formValues.estimatedLabourCost
					: formValues.estimatedInstallationCost,
			maintenanceCost: formValues.estimatedMaintenanceCost,
			energyProjectType: energyType,
			connectWithSolarPartner: formValues.connectWithSolarPartner,
			systemCost: formValues.estimatedSystemCost,

			createdAt: Date.now().toString(),
			updatedAt: Date.now().toString(),
			treeCount: 0,
			projectType: formValues.projectType,
			userId: user.id,
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
				createdAt: "",
				producerId: "",
				updatedAt: "",
				isVerified: false,
			},
			treeProjects: [],
			energyProjects: [],
			solarProjects: [],

			isVerified: false,
			locationType: locationType,

			isNonProfit: isNonProfit,

			estRevenue: formValues.estRevenue,
			estRoiPercentage: formValues.estRoiPercentage,
		};

		await axios
			.post("/api/projects", { projectData, producerId })
			.then((response: any) => {
				console.log("Project Created: ", response.data);
				toast.success("Project created successfully!");
				router.push("/p/projects");
			})
			.catch((error: any) => {
				console.log("Error creating project:", error);
				toast.error(`Error creating project. ${error}`);
				setLoading({ loading: false, message: "" });
			});
	};

	const onSubmit = async () => {
		setLoading({ loading: true, message: "Uploading project..." });
		const formValues = getValues();

		if (!agreements) {
			toast.warning("Please accept the agreements before submitting.");
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

	const handleAgreementButtonClick = () => {
		handleClose();
		setAgreements(true);
	};
	const dispatch = useAppDispatch();
	const producer = useAppSelector((state) => state.producer);
	const userId = user.id;

	const fetchProducerData = async () => {
		const res = await axios.get(
			`${getBasePath()}/api/producer?user_id=${userId}`
		);
		const data = await res.data;
		const producerData = convertToCamelCase(data.producerData[0]);
		dispatch(
			setProducer({
				...data,
				id: producerData.id,
				producerProperties: producerData.producerProperties,
			})
		);
	};

	useEffect(
		() => {
			if (user && userId) {
				fetchProducerData();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[user, userId]
	);
	const [urgentNotification, setUrgentNotification] = useState<{
		message: string;
		actionUrl: string;
		actionType: string;
	}>({ message: "", actionUrl: "", actionType: "" });
	const [allPropertiesUnverified, setAllPropertiesUnverified] = useState(false);

	useEffect(() => {
		if (producer && producer.id) {
			if (producer.producerProperties.length === 0) {
				setUrgentNotification({
					message: "You need to submit an address to create new projects.",
					actionUrl: "/settings?tab=addresses",
					actionType: "Resolve",
				});
			} else {
				setUrgentNotification({ message: "", actionUrl: "", actionType: "" });
			}
		}

		let numUnverifiedAddresses = 0;
		for (let i = 0; i < producer.producerProperties.length; i++) {
			if (producer.producerProperties[i].isVerified === false) {
				setUrgentNotification({
					message: `Your submitted property at ${producer.producerProperties[i].address.addressLineOne} in or near ${producer.producerProperties[i].address.city} is pending verification.`,
					actionUrl: "/settings?tab=addresses",
					actionType: "View",
				});
				setAllPropertiesUnverified(false);
				numUnverifiedAddresses++;
			}
		}
		if (numUnverifiedAddresses === producer.producerProperties.length) {
			setAllPropertiesUnverified(true);
			setUrgentNotification({
				message: `You cannot submit a project until a submitted property of yours is verified.`,
				actionUrl: "/settings?tab=addresses",
				actionType: "View",
			});
		}

		if (numUnverifiedAddresses === 0) {
			setAllPropertiesUnverified(false);
			setUrgentNotification({ message: "", actionUrl: "", actionType: "" });
		}
	}, [producer]);

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
	if (allPropertiesUnverified || producer.producerProperties.length === 0)
		return (
			<div className='container mx-auto py-6 px-4 min-h-[100vh]'>
				<h1 className='text-2xl font-semibold mb-6'>Add Project</h1>
				<div>
					{urgentNotification.message !== "" && (
						<>
							<UrgentNotification urgentNotification={urgentNotification} />
						</>
					)}
				</div>
			</div>
		);
	return (
		<div className='container mx-auto py-6 px-4 min-h-[100vh] '>
			<div className='w-[71%] mx-auto'>
				{urgentNotification.message !== "" && (
					<UrgentNotification urgentNotification={urgentNotification} />
				)}
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='flex flex-col w-[800px] mx-auto'
			>
				<h1 className='text-3xl font-semibold mb-6 flex justify-start text-left'>
					Add Project
				</h1>
				<label className='flex flex-col w-[800px]'>
					<span className='mb-[4px] mt-2'>Project Title:</span>
					<input
						type='text'
						className='text-gray-700 border-2 border-gray-300 rounded-md p-2 w-full'
						{...register("title", { required: true })}
					/>
				</label>
				<br />
				<label className='flex flex-col w-[800px]'>
					{properties.length > 0 && (
						<>
							<span className='mb-[4px] mt-2'>Project Location:</span>
							<select
								{...register("projectAddressId", { required: true })}
								className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
							>
								<option value=''>
									Select the address your project will be operated from
								</option>
								{properties.map(
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
						</>
					)}
				</label>

				<br />
				<label className='flex flex-col w-[800px]'>
					<span className='mb-[4px] mt-2'>Project Type:</span>
					<select
						{...register("projectType", { required: true })}
						className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
					>
						<option value=''>Select a project type</option>
						<option value='Tree'>Tree</option>
						<option value='Energy'>Renewable Energy</option>
					</select>
				</label>
				<label className='flex flex-col mt-[8px] w-[800px]'>
					<span className='mb-[4px] mt-2'>
						Is this a non-profit initiative?
					</span>
					<div className='flex items-center'>
						<Switch
							onChange={handleIsNonProfitChange}
							checked={isNonProfit}
							className='react-switch mr-2'
							id='isNonProfit'
							offColor='#808080'
							onColor='#66bb6a'
							height={20}
							width={48}
							uncheckedIcon={false}
							checkedIcon={false}
						/>
						{isNonProfit ? "Yes" : "No"}
					</div>
				</label>
				<label className='flex flex-col w-[800px]	'>
					<span className='mb-[4px] mt-2'>Total Project Area (km²)</span>
					<input
						type='number'
						{...register("totalArea", { required: true })}
						className='border-2 border-gray-300 rounded-md p-2 w-full'
					/>
				</label>
				<br />

				{projectType === "Tree" && (
					<>
						<label className='flex flex-col mt-[8px] w-[800px]'>
							<span className='mb-[4px] mt-2'>Tree Project Type:</span>
							<select
								{...register("treeType", { required: true })}
								className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
							>
								<option value=''>Select a tree project type</option>
								{isNonProfit && (
									<option value='Restoration'>Restoration</option>
								)}
								<option value='Timber / Lumber'>Timber / Lumber</option>
								<option value='Fruit'>Fruits</option>
								<option value='Nut'>Nuts</option>
								<option value='Bio Fuel'>Bio Fuel</option>
								<option value='Pulp'>Pulp</option>
								<option value='Syrup'>Syrup</option>
								<option value='Oil / Chemical'>Oils / Chemicals</option>
							</select>
						</label>
						<label className='flex flex-col w-[800px]'>
							<span className='mb-[4px] mt-2'>
								How many trees are you aiming to plant for this project?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								🌳{" "}
								<input
									type='number'
									{...register("numTrees", { required: true })}
									className='w-[96%] outline-none'
								/>
							</div>
						</label>
						<label className='flex flex-col w-[800px]'>
							<span className='mb-[4px] mt-2'>
								How much do you want to raise for seeds/saplings?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								${" "}
								<input
									type='number'
									step='1'
									{...register("estimatedSeedCost", { required: true })}
									className='w-[97%] outline-none'
								/>
							</div>
							<span className='mb-[4px] mt-2'>
								How much will the planting & labour cost be?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								${" "}
								<input
									type='number'
									step='1'
									{...register("estimatedLabourCost", { required: true })}
									className='w-[97%] outline-none'
								/>
							</div>
							<span className='mb-[4px] mt-2'>
								How much will the yearly maintenance cost be?
							</span>
							<div className='bg-white border-2 border-gray-300 rounded-md p-2 text-gray-400'>
								${" "}
								<input
									type='number'
									step='1'
									{...register("estimatedMaintenanceCost", { required: true })}
									className='w-[97%] outline-none'
								/>
							</div>
							<div className='flex mt-12'>
								<div>
									<span className='mb-[4px] mt-2 mr-2'>
										When is the estimated planting date?
									</span>
									<input
										type='date'
										{...register("estimatedPlantingDate", { required: true })}
										className='bg-white border-2 border-gray-300 rounded-md mt-2 p-2 text-gray-400 w-max'
									/>
								</div>
								{treeType !== "Restoration" && (
									<div>
										<span className='mb-[4px] mt-2'>
											When is the estimated harvest date?
										</span>
										<input
											type='date'
											{...register("estimatedMaturityDate", { required: true })}
											className='bg-white border-2 border-gray-300 rounded-md mt-2 p-2 text-gray-400 w-max'
										/>
									</div>
								)}
							</div>
						</label>
					</>
				)}
				{projectType === "Energy" && (
					<>
						<label className='flex flex-col mt-[8px] w-[800px]'>
							<span className='mb-[4px] mt-2'>
								Renewable Energy Project Type:
							</span>
							<select
								{...register("energyType", { required: true })}
								className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
							>
								<option value=''>Select a renewable energy project type</option>
								<option value='Solar'>Solar</option>
							</select>
						</label>
						{energyType === "Solar" && (
							<>
								<label className='flex flex-col mt-[8px] w-[800px]'>
									<span className='mb-[4px] mt-2'>
										Is this a residential, commercial, or rural project?
									</span>
									<select
										{...register("locationType", { required: true })}
										className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
									>
										<option value=''>Select the project location type</option>
										<option value='Residential'>Residential</option>
										<option value='Commercial'>Commercial</option>
										<option value='Rural'>Acreage/Rural</option>
									</select>
								</label>
								{locationType === "Residential" && (
									<div className='mt-4'>
										We encourage you to connect with a solar partner to help you
										with installing a residential solar system.
										<p>
											<a
												className='text-green-500 hover:text-green-400 transition-colors'
												href='https://forms.gle/Q5bXYmVca6qQLXuY9'
												target='_blank'
											>
												Fill out this form
											</a>{" "}
											if you want us to refer you to a solar partner vetted by
											our team.
										</p>
									</div>
								)}
								{locationType !== "Residential" && (
									<>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												What is the target yearly energy production of this
												project (kWh)?
											</span>
											<input
												{...register("energyProductionTarget", {
													required: true,
												})}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												How many arrays will be setup?
											</span>
											<input
												{...register("numOfArrays", { required: true })}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='text'
											/>
										</label>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												Are you contracting a company to install the system,
												doing this with your own team of installers, or are you
												still looking for an installation team?
											</span>
											<select
												{...register("installationTeam", { required: true })}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
											>
												<option value=''>Select one</option>
												<option value='Has company'>
													I&apos;ve hired a company.
												</option>
												<option value='Has team'>I have a team.</option>
												<option value='Needs team'>
													I&apos;m looking for a professional team to install
													the system.
												</option>
											</select>
										</label>
									</>
								)}
								{installationTeam === ("Has company" || "Has team") ? (
									<>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												What will the size of the installed system be? (in kW)
											</span>
											<input
												{...register("installedSystemSize")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-4px] mt-2'>
												If known, what is the photovoltaic capacity of the
												system?
											</span>
											<input
												{...register("photovoltaicCapacity")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												What is the estimated cost of the system installation?
											</span>
											$
											<input
												{...register("estimatedInstallationCost")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												What is the total cost of the system (do not include
												labour charges)?
											</span>
											<input
												{...register("estimatedSystemCost")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												If discussed, what are the estimated maintenance costs
												for the system?
											</span>
											<input
												{...register("estimatedMaintenanceCost")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>

										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												If discussed, what&apos;s the estimated material cost?
												(any materials beyond the arrays, inverters, and
												racking)
											</span>
											<input
												{...register("estimatedMaterialCost")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												When is the estimated installation date?
											</span>
											<input
												{...register("estimatedInstallationDate")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
												type='number'
											/>
										</label>
									</>
								) : installationTeam === "Needs team" ? (
									<>
										<label className='flex flex-col mt-[8px] w-[800px]'>
											<span className='mb-[4px] mt-2'>
												Do you want us to connect you with a trusted solar
												installation partner in your area to handle the
												installation for this project?
											</span>
											<select
												{...register("connectWithSolarPartner")}
												className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
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

								{locationType !== "Residential" && (
									<label className='flex flex-col mt-[8px] w-[800px]'>
										<span className='mb-[4px] mt-2'>
											How much do you want to raise for this project?
										</span>
										<input
											{...register("fundsRequested")}
											className='text-gray-700 p-2 w-full border-2 border-gray-300 rounded-md'
											type='number'
										/>
									</label>
								)}
							</>
						)}
					</>
				)}
				<br />
				{locationType !== "Residential" && (
					<>
						<label className='flex flex-col mt-[8px] w-[800px]'>
							<span className='mt-2'>Project Banner Image:</span>
							<br />
							<button
								type='button'
								onClick={toggleUploadMethod}
								className='mb-4 mt-2 text-left mr-2 w-fit bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
							>
								{uploadMethod
									? "Switch to image URL"
									: "Switch to image upload"}
							</button>
							<br />
							{uploadMethod ? (
								<input
									{...register("imageFile")}
									type='file'
									accept='image/png, image/jpeg'
									className='border-2 border-gray-300 rounded-md p-2 w-full cursor-pointer'
								/>
							) : (
								<label className='flex flex-col w-[800px]'>
									<span className='mb-[4px] mt-2'>Paste direct image URL:</span>
									<input
										{...register("imageUrlInput")}
										type='text'
										className='border-2 border-gray-300 rounded-md p-2 w-full'
									/>
								</label>
							)}
						</label>
						<br />
						<label className='flex flex-col w-[800px]'>
							<span className='mb-[4px] mt-2'>Project Coordinator Name:</span>
							<input
								{...register("coordinatorName", { required: true })}
								type='text'
								className='border-2 border-gray-300 rounded-md p-2 w-full'
							/>
						</label>
						<label className='flex flex-col w-[800px]'>
							<span className='mb-[4px] mt-2'>Project Coordinator Phone:</span>
							<input
								{...register("coordinatorPhone", { required: true })}
								type='tel'
								className='border-2 border-gray-300 rounded-md p-2 w-full'
							/>
						</label>
						<br />
						<label className='flex flex-col w-[800px]'>
							<span className='mb-[4px] mt-2'>Project Description:</span>
							<textarea
								{...register("description", { required: true })}
								className='text-gray-700 border-2 border-gray-300 rounded-md p-2 h-[150px] w-full'
							/>
						</label>
					</>
				)}
				<br />
				{!isNonProfit && locationType !== "Residential" && (
					<>
						<label className='flex flex-col w-[800px]'>
							{projectType === "Tree" ? (
								<span className='mb-[4px] mt-2'>
									What do you estimate the revenue{" "}
									{treeType === "Timber / Lumber" ? "" : "per year"} will be?
								</span>
							) : (
								<span className='mb-[4px] mt-2'>
									What do you estimate the revenue per year will be?
								</span>
							)}
							<div className='border-2 border-gray-300 rounded-md p-2 bg-white text-gray-400'>
								${" "}
								<input
									{...register("estRevenue", { required: true })}
									type='number'
									className='w-[98%] outline-none'
								/>
							</div>
						</label>
						<br />
						<label className='flex flex-col w-[800px]'>
							<span className='mb-[4px] mt-2'>
								What percentage of the profits will you offer investors for
								investing into your project?
							</span>
							<div className='border-2 border-gray-300 rounded-md p-2 bg-white text-gray-400'>
								%{" "}
								<input
									{...register("estRoiPercentage", { required: true })}
									type='number'
									className='w-[97%] outline-none'
									min={0}
									max={100}
								/>
							</div>
						</label>
						<br />
					</>
				)}
				{locationType !== "Residential" && (
					<div className='flex justify-between '>
						{!agreements ? (
							<div>
								<h3>Agreements:</h3>{" "}
								<button
									onClick={handleOpen}
									className='my-2 text-left w-[300px] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
								>
									View agreement
								</button>
								<Modal
									open={open}
									onClose={handleClose}
									aria-labelledby='modal-modal-title'
									aria-describedby='modal-modal-description'
								>
									<Box sx={style}>
										<Agreement
											handleAgreementButtonClick={handleAgreementButtonClick}
										/>
									</Box>
								</Modal>
							</div>
						) : (
							<>
								<h3>✅ Agreements</h3>
							</>
						)}
					</div>
				)}
				<br />
				<div className='flex justify-end'>
					<button
						type='submit'
						className={
							locationType !== "Residential"
								? "mt-[16px] bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer w-full"
								: "bg-gray-500 text-white font-bold py-2 px-4 rounded w-full"
						}
						disabled={locationType === "Residential"}
					>
						Submit Project
					</button>
				</div>
			</form>
		</div>
	);
}

export default withAuth(AddProject);
