"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import withAuth from "@/utils/withAuth";
import convertToCamelCase from "@/utils/convertToCamelCase";
import { set } from "react-hook-form";
import getBasePath from "@/lib/getBasePath";
import axios from "axios";

function Discover() {
	const filters = [
		{ label: "All", value: "All" },
		{ label: "🌳 Timber / Lumber", value: "Timber / Lumber" },
		{ label: "🌳 Fruit", value: "Fruit" },
		{ label: "🌳 Nut", value: "Nut" },
		{ label: "🌳 Bio Fuel", value: "Bio Fuel" },
		{ label: "🌳 Pulp", value: "Pulp" },
		{ label: "🌳 Syrup", value: "Syrup" },
		{ label: "🌳 Oil / Chemical", value: "Oil / Chemical" },
		{ label: "☀️ Solar", value: "Solar" },
	];

	const router = useRouter();
	const searchParams = useSearchParams();
	const activeFilter = searchParams?.get("filter") ?? "All";
	const [projects, setProjects] = useState<Projects>([]);
	const nonProfitFilter = searchParams?.get("nonProfit") ?? "false";
	const [loading, setLoading] = useState<boolean>(false);
	// Here we fetch the projects from supabase
	useEffect(() => {
		setLoading(true);
		const fetchProjects = async (type: string, nonProfit: string) => {
			await axios
				.get(
					`/api/projects?type=${type}${
						nonProfit === "true" ? "&nonProfit=true" : ""
					}`
				)
				.then((res) => {
					console.log(res.data);
					setProjects(convertToCamelCase(res.data));
					setLoading(false);
				})
				.catch((err) => {
					console.log("error fetching projects: ", err);
					setLoading(false);
				});
		};

		fetchProjects(activeFilter, nonProfitFilter);
	}, [activeFilter, nonProfitFilter]);

	// Here we handle the filter click by pushing the filter type to the url
	const handleFilterClick = (e: any) => {
		const filterType = e.target.value;
		if (filterType !== activeFilter) {
			if (filterType === "All") {
				if (nonProfitFilter === "true")
					router.push(`/i/discover?nonProfit=true`);
				else router.push(`/i/discover`);
			} else {
				if (nonProfitFilter === "true")
					router.push(`/i/discover?filter=${filterType}&nonProfit=true`);
				else router.push(`/i/discover?filter=${filterType}`);
			}
		}
	};

	const [nonProfit, setNonProfit] = useState<boolean>(false);

	const handleNonProfitFilterClick = () => {
		setNonProfit(!nonProfit);
		console.log("(discover.tsx) nonProfit: ", nonProfit);
		if (nonProfit) {
			if (activeFilter !== "All")
				router.push(`/i/discover?filter=${activeFilter}`);
			if (activeFilter === "All") router.push(`/i/discover`);
		} else {
			if (activeFilter !== "All")
				router.push(`/i/discover?filter=${activeFilter}&nonProfit=true`);
			if (activeFilter === "All") router.push(`/i/discover?nonProfit=true`);
		}
	};

	console.log("projects: ", projects);
	return (
		<div className='w-3/4 mx-auto py-8 h-[100%]'>
			<h1 className='text-2xl font-bold'>Discover Projects</h1>
			<h2 className='font-light text-lg mb-8'>
				Instantly find tree-based agriculture and renewable energy projects to
				invest into.
			</h2>
			<div className='flex flex-wrap gap-4 mb-8'>
				{filters.map((item, index) => (
					<button
						key={index}
						value={`${item.value}`}
						onClick={handleFilterClick}
						className={`px-4 py-2 rounded transition-colors border border-black ${
							item.value === activeFilter
								? "bg-green-500 text-white"
								: "bg-gray-800 text-white hover:bg-gray-700"
						}`}
					>
						{item.label}
					</button>
				))}
				<button
					onClick={handleNonProfitFilterClick}
					className={`px-4 py-2 rounded transition-colors border border-black ${
						nonProfitFilter === "true"
							? "bg-green-500 text-white"
							: "bg-gray-800 text-white hover:bg-gray-700"
					}`}
				>
					Non-Profit
				</button>
			</div>
			{loading ? (
				<div className='mx-auto flex flex-col items-center text-center mt-48'>
					<h3 className='mb-4'>Loading...</h3>{" "}
				</div>
			) : (
				<div className='flex flex-wrap w-full min-h-screen'>
					{projects.length > 0 ? (
						projects.map((project) => {
							const {
								id,
								createdAt,
								title,
								description,
								type,
								imageUrl,
								treeTarget,
								fundsRequestedPerTree,
								status,
								projectCoordinatorContact,
								isVerified,
								treeProjects,
								energyProjects,
							} = project;
							return (
								<ProjectCard
									key={id}
									project={project}
									imageUrl={imageUrl}
									title={title}
									description={description}
									projectId={id}
									createdAt={createdAt}
									projectType={type}
									treeTarget={treeTarget}
									fundsRequestedPerTree={fundsRequestedPerTree}
									status={status}
									role={"investor"}
									projectCoordinatorContactName={projectCoordinatorContact.name}
									projectCoordinatorContactPhone={
										projectCoordinatorContact.phone
									}
									isVerified={isVerified}
									treeProjects={treeProjects}
									energyProjects={energyProjects}
								/>
							);
						})
					) : (
						<div className='mx-auto flex flex-col items-center text-center mt-48'>
							<h3 className='mb-4'>
								No {nonProfitFilter === "true" ? "non-profit" : null}{" "}
								{activeFilter !== "All" ? activeFilter : null} Projects Found.
							</h3>{" "}
							<br />
							<p>
								<br /> Invite a{" "}
								{nonProfitFilter === "true" ? "non-profit" : null} Producer to
								join Eco Wealth or <br />
								become a Producer and start a{" "}
								{nonProfitFilter === "true" ? "non-profit" : null}{" "}
								{activeFilter !== "All" ? activeFilter : null} project today!
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default withAuth(Discover);
