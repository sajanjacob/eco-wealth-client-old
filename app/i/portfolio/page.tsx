"use client";
import PortfolioCard from "@/components/investor/portfolio/PortfolioCard";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import getBasePath from "@/lib/getBasePath";
import { useAppSelector } from "@/redux/hooks";

type Props = {};

function Portfolio({}: Props) {
	const [projects, setProjects] = useState<Project[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const user = useAppSelector((state) => state.user);
	// axios call to get user portfolio
	const fetchUserPortfolio = async () => {
		const res = await axios.get(
			`${getBasePath()}/api/investor/portfolio?userId=${user.id}`
		);

		if (res) {
			setProjects(convertToCamelCase(res.data as Project[]));
			setLoading(false);
		}
		if (res.status === (400 || 401)) {
			console.log("error fetching investor portfolio projects");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserPortfolio();
	}, []);
	if (loading)
		return (
			<div>
				<h1>Your Portfolio</h1>
				<p>loading...</p>
			</div>
		);
	return (
		<div>
			<h1>Your Portfolio</h1>
			<div>
				{projects &&
					projects.length > 0 &&
					projects.map((project) => {
						return (
							<PortfolioCard
								project={project}
								key={project.id}
								investmentDetails={{
									unitsContributed:
										(project.unitsContributed as unknown as number) || 0,
									estRoi: (project.averageROI as unknown as number) || 0,
								}}
							/>
						);
					})}
			</div>
		</div>
	);
}

export default withAuth(Portfolio);
