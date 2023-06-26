"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import withAuth from "@/utils/withAuth";
import convertToCamelCase from "@/utils/convertToCamelCase";

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
		{ label: "🌳 Non-Profit Initiative", value: "Non-Profit Initiative" },
		{ label: "☀️ Solar", value: "Solar" },
		{ label: "☀️ Non-Profit Initiative", value: "Non-Profit Initiative" },
	];

	const router = useRouter();
	const searchParams = useSearchParams();
	const activeFilter = searchParams.get("filter") ?? "All";

	const [projects, setProjects] = useState<Projects>([]);

	// Here we fetch the projects from supabase
	useEffect(() => {
		const fetchProjects = async (type: string) => {
			const res = await fetch(`/api/projects?type=${type}`)
				.then((res) => res.json())
				.catch((err) => console.log(err));
			if (res) {
				setProjects(convertToCamelCase(res));
			}
		};

		fetchProjects(activeFilter);
	}, [activeFilter]);

	// Here we handle the filter click by pushing the filter type to the url
	const handleFilterClick = (e: any) => {
		const filterType = e.target.value;
		if (filterType !== activeFilter) {
			router.push(`/i/discover?filter=${filterType}`);
		}
	};

	return (
		<div className='w-3/4 mx-auto py-8 h-[100%]'>
			<h1 className='text-2xl font-bold'>Discover Projects</h1>
			<h2 className='font-light text-lg mb-8'>
				Find projects for investing instantly into tree-based agriculture and
				renewable energy.
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
			</div>
			<div className='flex flex-wrap w-full min-h-screen'>
				{projects.length > 0 ? (
					projects.map(
						(
							{
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
							},
							index
						) => (
							<ProjectCard
								key={index}
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
								projectCoordinatorContactPhone={projectCoordinatorContact.phone}
								isVerified={isVerified}
							/>
						)
					)
				) : (
					<div className='mx-auto flex flex-col items-center text-center mt-48'>
						<h3 className='mb-4'>
							No {activeFilter !== "All" ? activeFilter : null} Projects Found.
						</h3>{" "}
						<br />
						<p>
							<br /> Invite a Producer to join Eco Wealth or <br />
							become a Producer and start a{" "}
							{activeFilter !== "All" ? activeFilter : null} project today!
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default withAuth(Discover);
