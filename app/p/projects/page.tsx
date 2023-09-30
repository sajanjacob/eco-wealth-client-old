"use client";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import supabase from "@/utils/supabaseClient";
import { RootState } from "@/redux/store";
import { useAppSelector } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";

type Props = {};
function Projects({}: Props) {
	const router = useRouter();
	const user = useAppSelector((state: RootState) => state.user); // Assuming you have a userContext reducer
	const [projects, setProjects] = useState<
		Project[] | TreeProject[] | EnergyProject[] | SolarProject[]
	>([]);

	const fetchProjects = async () => {
		const { data, error } = await supabase
			.from("projects")
			.select(
				"*, project_milestones(*), tree_projects(*), energy_projects(*), solar_projects(*)"
			)
			.eq("producer_id", user.producerId)
			.neq("is_deleted", true);

		if (error) {
			console.error("Error fetching projects:", error);
		} else {
			console.log("projects >>> ", data);
			setProjects(convertToCamelCase(data) as Project[]);
		}
	};
	useEffect(() => {
		if (user) {
			fetchProjects();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	return (
		<div>
			<h1 className='font-bold text-3xl mx-8 mt-6'>Your Projects</h1>
			<div className='flex flex-wrap'>
				{projects.length > 0 ? (
					projects.map((project) => {
						const {
							id,
							projectCoordinatorContact,
							treeProjects,
							energyProjects,
							solarProjects,
						} = project;
						return (
							<ProjectCard
								key={id}
								projectCoordinatorContactName={projectCoordinatorContact.name}
								projectCoordinatorContactPhone={projectCoordinatorContact.phone}
								role='owner'
								project={project}
								treeProjects={treeProjects}
								energyProjects={energyProjects}
								solarProjects={solarProjects}
							/>
						);
					})
				) : (
					<div className='flex justify-center items-center w-[80%] mx-auto h-[80vh]'>
						<p className='text-center mr-4'>
							You have no projects yet. Add a new project today!
						</p>
						<button
							onClick={() => router.push("/p/add-project")}
							className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer'
						>
							Add project
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
export default withAuth(Projects);
