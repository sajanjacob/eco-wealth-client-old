"use client";
import UserInvestments from "@/components/UserInvestments";
import Project from "@/components/producer/projects/Project";
import { useAppSelector } from "@/redux/hooks";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

function PortfolioProject({}: Props) {
	const params = useParams();
	const projectId = params?.id;
	const user = useAppSelector((state) => state.user);
	const [project, setProject] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const fetchProject = async () => {
		setLoading(true);
		await axios
			.get(`/api/investor/portfolio/project?projectId=${projectId}`)
			.then((res) => {
				setLoading(false);
				console.log("res.data >>> ", res.data);
				setProject(convertToCamelCase(res.data.data));
			})
			.catch((err) => {
				setLoading(false);
				console.log("error fetching project >>> ", err);
			});
	};
	useEffect(() => {
		console.log("projectId >>> ", projectId);
		if (projectId && user) {
			fetchProject();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectId, user]);
	return (
		<div className='w-[800px] mx-auto mt-4'>
			<Project
				adminMode={false}
				project={project}
			/>
			<UserInvestments />
		</div>
	);
}

export default withAuth(PortfolioProject);
