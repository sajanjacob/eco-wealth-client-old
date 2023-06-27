"use client";

import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabaseClient";
import TreeInvestmentForm from "@/components/investor/projects/TreeInvestmentForm";
import EnergyInvestmentForm from "@/components/investor/projects/EnergyInvestmentForm";
function Invest() {
	const path: any = useParams();
	const { id } = path;
	const [project, setProject] = useState<Project>({} as Project);
	useEffect(() => {
		const fetchProject = async () => {
			const { data, error } = await supabase
				.from("projects")
				.select("*, tree_projects(*), energy_projects(*)")
				.eq("id", id)
				.single();
			if (error) {
				console.error("Error fetching project:", error.message);
			} else {
				setProject(convertToCamelCase(data as Project));
			}
		};
		if (id) {
			fetchProject();
		}
	}, [id]);
	return (
		<div className='flex p-8'>
			{project?.type === "Tree" ? (
				<TreeInvestmentForm project={project} />
			) : project?.type === "Energy" ? (
				<EnergyInvestmentForm project={project} />
			) : null}
		</div>
	);
}

export default withAuth(Invest);

// Styled components
