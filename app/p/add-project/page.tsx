"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
export default function AddProject() {
	const router = useRouter();
	const user = useAppSelector((state: RootState) => state.user);
	const dispatch = useAppDispatch();

	const [title, setTitle] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [coordinatorName, setCoordinatorName] = useState("");
	const [coordinatorPhone, setCoordinatorPhone] = useState("");
	const [description, setDescription] = useState("");
	const [numTrees, setNumTrees] = useState(0);
	const [pricePerTree, setPricePerTree] = useState(0);
	const [agreements, setAgreements] = useState([false, false, false]);
	const [imageFile, setImageFile] = useState(null);
	const [imageUrlInput, setImageUrlInput] = useState("");
	const [uploadMethod, setUploadMethod] = useState(true);
	const [treeType, setTreeType] = useState("");
	const [projectType, setProjectType] = useState("");
	const [energyType, setEnergyType] = useState("");
	const [totalArea, setTotalArea] = useState(0);
	const [properties, setProperties] = useState<Property[]>([]);
	const [projectBannerUrl, setProjectBannerUrl] = useState("");

	const [energyProductionTarget, setEnergyProductionTarget] = useState(0);
	const [numOfArrays, setNumOfArrays] = useState(0);
	const [installationTeam, setInstallationTeam] = useState("");
	const [installedSystemSize, setInstalledSystemSize] = useState(0);
	const [photovoltaicCapacity, setPhotovoltaicCapacity] = useState(0);
	const [estimatedInstallationCost, setEstimatedInstallationCost] = useState(0);
	const [estimatedSystemCost, setEstimatedSystemCost] = useState(0);
	const [estimatedMaintenanceCost, setEstimatedMaintenanceCost] = useState(0);
	const [connectWithSolarPartner, setConnectWithSolarPartner] = useState("");
	const [fundsRequested, setFundsRequested] = useState(0);
	const fetchProperties = async (producerId: string) => {
		const { data: propertyData, error: propertyError } = await supabase
			.from("producer_properties")
			.select("*")
			.eq("producer_id", producerId);
		setProperties(convertToCamelCase(propertyData) as Property[]);
	};

	useEffect(() => {
		if (user) {
			fetchProperties(user.producerId || "");
		}
	}, [user]);

	const handleAgreementChange = (index: number) => {
		const newAgreements = [...agreements];
		newAgreements[index] = !newAgreements[index];
		setAgreements(newAgreements);
	};

	// TODO: TEST THIS -> Generated from Co-Pilot
	const uploadImage = async (file: File) => {
		const fileExt = file.name.split(".").pop();
		const fileName = `${Math.random()}.${fileExt}`;
		const filePath = `projects/${fileName}`;
		const { data, error } = await supabase.storage
			.from("projects")
			.upload(filePath, file);
		if (error) {
			throw error;
		}
		return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projects/${fileName}`;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!agreements.every((val) => val)) {
			toast.warning("Please accept all agreements before submitting.");
			return;
		}

		const producerId = user.producerId;
		let projectImageUrl = imageUrlInput;

		if (imageFile) {
			try {
				projectImageUrl = await uploadImage(imageFile);
				setProjectBannerUrl(projectImageUrl);
			} catch (error) {
				toast.error(`Error uploading image. ${error}`);
				return;
			}
		}

		const projectData: Project = {
			title: title,
			imageUrl: projectBannerUrl,
			projectCoordinatorContact: {
				name: coordinatorName,
				phone: coordinatorPhone,
			},
			description: description,
			treeTarget: numTrees,
			fundsRequestedPerTree: pricePerTree,
			producerId: producerId,
			status: "pending_verification",
			type: treeType,
			projectVerificationConsentGiven: true,
			adminFeeConsent: true,
			agreedToPayInvestor: true,
			createdAt: Date.now().toString(),
			updatedAt: Date.now().toString(),
			treeCount: 0,
			projectType: projectType,
			projectId: "",
			totalArea: totalArea,
			id: "",
			userId: user.id,
			treeProjectType: treeType,
			energyProjectType: energyType,
		};
		const { data: project, error } = await supabase
			.from("projects")
			.insert([
				{
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
				},
			])
			.select();
		if (projectType === "Tree" && project) {
			const { data, error } = await supabase.from("tree_projects").insert([
				{
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
		} else {
			toast.success("Project submitted successfully!");
			router.push("/p/projects");
		}
	};
	const toggleUploadMethod = () => {
		setUploadMethod(!uploadMethod);
	};

	const handleSetImage = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setImage(event.target.files[0]);
		}
	};

	return (
		<div className='container mx-auto py-6 px-4 min-h-[100vh]'>
			<h1 className='text-2xl font-semibold mb-6'>Add Project</h1>
			<form onSubmit={handleSubmit}>
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Title:</span>
					<input
						type='text'
						className='text-gray-700 border-2 border-gray-300 rounded-md p-2 w-[500px]'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</label>
				<br />
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Type:</span>
					<select
						value={projectType}
						onChange={(event) => setProjectType(event.target.value)}
						required
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
							value={treeType}
							onChange={(event) => setTreeType(event.target.value)}
							required
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
						value={totalArea}
						onChange={(e) => setTotalArea(e.target.valueAsNumber)}
						required
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
								value={numTrees}
								onChange={(e) => setNumTrees(e.target.valueAsNumber)}
								required
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
								value={pricePerTree}
								onChange={(e) => setPricePerTree(e.target.valueAsNumber)}
								required
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
								value={energyType}
								onChange={(event) => setEnergyType(event.target.value)}
								required
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
										className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
										type='number'
										required
										value={energyProductionTarget}
										onChange={(event) =>
											setEnergyProductionTarget(event.target.valueAsNumber)
										}
									/>
								</label>
								<label
									className='flex flex-col mt-[8px]'
									htmlFor=''
								>
									<span className='mb-[4px] mt-2'>
										How many arrays will be setup?
									</span>
									<input
										className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
										type='text'
										required
										value={numOfArrays}
										onChange={(event) =>
											setNumOfArrays(event.target.valueAsNumber)
										}
									/>
								</label>
								<label
									className='flex flex-col mt-[8px]'
									htmlFor=''
								>
									<span className='mb-[4px] mt-2'>
										Are you contracting a company to install the system, doing
										this with your own team of installers, or are you still
										looking for an installation team?
									</span>
									<select
										className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
										value={installationTeam}
										onChange={(event) =>
											setInstallationTeam(event.target.value)
										}
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
										<label
											className='flex flex-col mt-[8px]'
											htmlFor=''
										>
											<span className='mb-[4px] mt-2'>
												What will the size of the installed system be? (in kW)
											</span>
											<input
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
												value={installedSystemSize}
												onChange={(event) =>
													setInstalledSystemSize(event.target.valueAsNumber)
												}
											/>
										</label>
										<label
											className='flex flex-col mt-[8px]'
											htmlFor=''
										>
											<span className='mb-[4px] mt-2'>
												If known, what is the photovoltiac capacity of the
												system?
											</span>
											<input
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
												value={photovoltaicCapacity}
												onChange={(event) =>
													setPhotovoltaicCapacity(event.target.valueAsNumber)
												}
											/>
										</label>
										<label
											className='flex flex-col mt-[8px]'
											htmlFor=''
										>
											<span className='mb-[4px] mt-2'>
												What is the estimated cost of the system installation?
											</span>
											$
											<input
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
												value={estimatedInstallationCost}
												onChange={(event) =>
													setEstimatedInstallationCost(
														event.target.valueAsNumber
													)
												}
											/>
										</label>
										<label
											className='flex flex-col mt-[8px]'
											htmlFor=''
										>
											<span className='mb-[4px] mt-2'>
												What is the total cost of the system minus the labour?
											</span>
											<input
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
												value={estimatedSystemCost}
												onChange={(event) =>
													setEstimatedSystemCost(event.target.valueAsNumber)
												}
											/>
										</label>
										<label
											className='flex flex-col mt-[8px]'
											htmlFor=''
										>
											<span className='mb-[4px] mt-2'>
												If discussed, what are the estimated maintenance costs
												for the system?
											</span>
											<input
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												type='number'
												value={estimatedMaintenanceCost}
												onChange={(event) =>
													setEstimatedMaintenanceCost(
														event.target.valueAsNumber
													)
												}
											/>
										</label>
									</>
								) : installationTeam === "Needs team" ? (
									<>
										<label
											className='flex flex-col mt-[8px]'
											htmlFor=''
										>
											<span className='mb-[4px] mt-2'>
												Do you want us to connect you with a trusted solar
												installation partner in your area to handle the
												installation for this project?
											</span>
											<select
												className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
												value={connectWithSolarPartner}
												onChange={(event) =>
													setConnectWithSolarPartner(event.target.value)
												}
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
								<label
									className='flex flex-col mt-[8px]'
									htmlFor=''
								>
									<span className='mb-[4px] mt-2'>
										How much do you want to raise for this project?
									</span>
									<input
										className='text-gray-700 p-2 w-[500px] border-2 border-gray-300 rounded-md'
										type='number'
										value={fundsRequested}
										onChange={(event) =>
											setFundsRequested(event.target.valueAsNumber)
										}
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
							type='file'
							onChange={handleSetImage}
							accept='image/*'
							className='border-2 border-gray-300 rounded-md p-2 w-[500px] cursor-pointer'
						/>
					) : (
						<label className='flex flex-col'>
							<span className='mb-[4px] mt-2'>Paste direct image URL:</span>
							<input
								type='text'
								className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
								value={imageUrlInput}
								onChange={(event) => setImageUrlInput(event.target.value)}
							/>
						</label>
					)}
				</label>
				<br />

				<br />
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Coordinator Name:</span>
					<input
						type='text'
						className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
						value={coordinatorName}
						onChange={(event) => setCoordinatorName(event.target.value)}
						required
					/>
				</label>

				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Coordinator Phone:</span>
					<input
						type='tel'
						className='border-2 border-gray-300 rounded-md p-2 w-[500px]'
						value={coordinatorPhone}
						onChange={(event) => setCoordinatorPhone(event.target.value)}
						required
					/>
				</label>
				<br />
				<label className='flex flex-col'>
					<span className='mb-[4px] mt-2'>Project Description:</span>
					<textarea
						className='text-gray-700 border-2 border-gray-300 rounded-md p-2 h-[150px] w-[500px]'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</label>
				<br />

				<h3>Agreements:</h3>
				<label>
					<input
						type='checkbox'
						className='mr-2'
						checked={agreements[0]}
						onChange={() => handleAgreementChange(0)}
					/>
					Agreement 1
				</label>
				<br />
				<label>
					<input
						type='checkbox'
						className='mr-2'
						checked={agreements[1]}
						onChange={() => handleAgreementChange(1)}
					/>
					Agreement 2
				</label>
				<br />
				<label>
					<input
						type='checkbox'
						className='mr-2'
						checked={agreements[2]}
						onChange={() => handleAgreementChange(2)}
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
