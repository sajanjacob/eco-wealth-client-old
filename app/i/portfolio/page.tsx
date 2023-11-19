"use client";
import PortfolioCard from "@/components/investor/portfolio/PortfolioCard";
import convertToCamelCase from "@/utils/convertToCamelCase";
import withAuth from "@/utils/withAuth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import getBasePath from "@/lib/getBasePath";
import { useAppSelector } from "@/redux/hooks";
import { set } from "react-hook-form";

type Props = {};

function Portfolio({}: Props) {
	const [projects, setProjects] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [totalShares, setTotalShares] = useState<number>(0);
	const [totalAmountInvested, setTotalAmountInvested] = useState<number>(0);
	const user = useAppSelector((state) => state.user);
	// axios call to get user portfolio
	const fetchUserPortfolio = async () => {
		const res = await axios.get(
			`${getBasePath()}/api/investor/portfolio?investorId=${user.investorId}`
		);

		if (res) {
			console.log("res.data >>> ", res.data);
			setProjects([convertToCamelCase(res.data.data[0])]);
			setTotalShares(res.data.totalShares);
			setTotalAmountInvested(res.data.totalAmountInvested);
			setLoading(false);
		}
		if (res.status === (400 || 401)) {
			console.log("error fetching investor portfolio projects");
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user.investorId) {
			fetchUserPortfolio();
		}
	}, [user]);

	console.log("projects >>> ", projects);
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
					projects.map((project: any) => {
						return (
							<PortfolioCard
								project={project}
								key={project.id}
								totalShares={totalShares}
								totalAmountInvested={totalAmountInvested}
								totalAmountRaised={
									project.projectFinancials[0].totalAmountRaised
								}
								amountRequested={
									project.projectFinancials[0].finalEstProjectFundRequestTotal
								}
							/>
						);
					})}
			</div>
		</div>
	);
}

export default withAuth(Portfolio);
