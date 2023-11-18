"use client";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // import the root state from your redux store
import { setTotalUserTreeCount, setUserTreeCount } from "@/redux/actions"; // import actions from your redux store
import withAuth from "@/utils/withAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axios from "axios";
import getBasePath from "@/lib/getBasePath";
import convertToCamelCase from "@/utils/convertToCamelCase";

interface DashboardProps {}
type AnalyticData = {
	data: [
		{
			totalTrees: number;
			totalPlantedTrees: number;
			treesContributed: number;
			totalEstKwhContributedPerYear: number;
			totalEnergyProduced: number;
			totalArraysInstalled: number;
		}
	];
	totalData: {
		totalTrees: number;
		totalTreesPlanted: number;
		totalEnergyProduced: number;
		totalArraysInstalled: number;
		totalEstKwhContributedPerYear: number;
		treesContributed: number;
	};
};

const Dashboard = ({}: DashboardProps) => {
	const user = useAppSelector((state: RootState) => state.user);
	const [loading, setLoading] = useState(false);
	const [analyticData, setAnalyticData] = useState<AnalyticData | null>(null); // [TODO] - type this properly

	// State for animation
	const [totalUserTreeContributions, setTotalUserTreeContributions] =
		useState(0);
	const [totalUserTreeCount, setTotalUserTreeCount] = useState(0);
	const [totalAppTreeCount, setTotalAppTreeCount] = useState(0);
	const [estUserEnergyContributions, setEstUserEnergyContributions] =
		useState(0);

	const [totalUserEnergyProduction, setTotalUserEnergyProduction] = useState(0);
	const [totalAppEnergyProduction, setTotalAppEnergyProduction] = useState(0);
	const [totalAppEnergyContribution, setTotalAppEnergyContribution] =
		useState(0);
	const [totalAppTreesContributed, setTotalAppTreesContributed] = useState(0);

	const fetchAnalytics = async () => {
		setLoading(true);

		if (user && user.investorId) {
			await axios
				.get(
					`${getBasePath()}/api/investor_analytics?investorId=${
						user.investorId
					}`
				)
				.then((res) => {
					setAnalyticData(convertToCamelCase(res.data));
				})
				.catch((err) => {
					console.log("analytics err >>> ", err);
				});
			setLoading(false);
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAnalytics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	// This is for animation
	// Refs to keep track of intervals
	const animationIntervals = useRef<Record<string, number | null>>({});

	const clearAnimation = (key: string) => {
		if (animationIntervals.current[key]) {
			clearInterval(animationIntervals.current[key]!);
			animationIntervals.current[key] = null;
		}
	};

	// main animation function
	const animateValue = (
		key: string,
		start: number,
		end: number,
		baseDuration: number,
		callback: (value: number) => void
	) => {
		clearAnimation(key); // Clear any ongoing animation for this key

		let current = start;
		const range = end - start;
		const increment = range / (baseDuration / 100); // Adjust this for smoother animation
		const stepTime = Math.abs(baseDuration / range);

		animationIntervals.current[key] = setInterval(() => {
			current += increment;
			callback(current); // Update state

			if (
				(increment > 0 && current >= end) ||
				(increment < 0 && current <= end)
			) {
				callback(end); // Ensure the final value is set correctly
				clearAnimation(key);
			}
		}, stepTime) as unknown as number;
	};

	useEffect(() => {
		const baseDuration = 2000;
		if (!analyticData) return;
		animateValue(
			"totalUserTreeContributions",
			0,
			analyticData?.data[0]?.treesContributed || 0,
			baseDuration,
			setTotalUserTreeContributions
		);

		animateValue(
			"totalUserTreeCount",
			0,
			analyticData?.data[0]?.totalTrees || 0,
			baseDuration,
			setTotalUserTreeCount
		);

		animateValue(
			"totalUserEnergyProduction",
			0,
			analyticData?.data[0]?.totalEnergyProduced || 0,
			baseDuration,
			setTotalUserEnergyProduction
		);
		animateValue(
			"estUserEnergyContributions",
			0,
			analyticData?.data[0]?.totalEstKwhContributedPerYear || 0,
			baseDuration,
			setEstUserEnergyContributions
		);
		animateValue(
			"targetTotalAppTreeCount",
			0,
			analyticData?.totalData?.totalTreesPlanted || 0,
			baseDuration,
			setTotalAppTreeCount
		);
		animateValue(
			"targetTotalAppEnergyProduction",
			0,
			analyticData?.totalData?.totalEnergyProduced || 0,
			baseDuration,
			setTotalAppEnergyProduction
		);
		animateValue(
			"totalAppTreesContributed",
			0,
			analyticData?.totalData?.treesContributed || 0,
			baseDuration,
			setTotalAppTreesContributed
		);
		animateValue(
			"totalAppEnergyContribution",
			0,
			analyticData?.totalData?.totalEstKwhContributedPerYear || 0,
			baseDuration,
			setTotalAppEnergyContribution
		);
		return () => {
			// Clear all animations on component unmount
			Object.keys(animationIntervals.current).forEach(clearAnimation);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [analyticData]);

	const CO2RemovalRate = 4.5;
	const ConvertToKGFromTonnes = 1016.04691;
	const averageHomeEnergyConsumption = 11000;
	if (loading) return <div>Loading...</div>;

	return (
		<div className='h-[100vh] w-[100%]'>
			<h1 className='mb-12 pt-12 ml-8 text-2xl'>
				Investor Dashboard | Hello {user.name}!
			</h1>
			<div className='w-3/4 mx-auto border border-gray-700  rounded-lg p-8 text-center'>
				<div className='grid grid-cols-3 gap-8'>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;ve Contributed</p>
						<h2 className='mt-0'>
							🌳 {totalUserTreeContributions?.toLocaleString("en-CA")}
						</h2>
					</div>

					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;ve Planted</p>
						<h2 className='mt-0'>
							🌳 {totalUserTreeCount?.toLocaleString("en-CA")}
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collective Planted</p>
						<h2 className='mt-0'>
							🌳 {totalAppTreeCount?.toLocaleString("en-CA")}
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collective Contributed</p>
						<h2 className='mt-0'>
							🌳 {totalAppTreesContributed?.toLocaleString("en-CA")}
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Together We&apos;ve Offset:</p>
						<h2 className='mt-0'>
							☁️{" "}
							{Math.floor(
								totalAppTreeCount * CO2RemovalRate * ConvertToKGFromTonnes
							)?.toLocaleString("en-CA")}{" "}
							kg of CO²
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;ve Offset:</p>
						<h2 className='mt-0'>
							☁️{" "}
							{Math.floor(
								totalUserTreeCount * CO2RemovalRate * ConvertToKGFromTonnes
							)?.toLocaleString("en-CA")}{" "}
							kg of CO²
						</h2>
					</div>

					{/* Add two more elements here */}
				</div>
				<hr className='my-8' />
				<div className='grid grid-cols-3 gap-8'>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;ve Contributed:</p>
						<h2 className='mt-0'>
							⚡ {estUserEnergyContributions?.toLocaleString("en-CA")} KWH
						</h2>
					</div>

					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;ve Generated:</p>
						<h2 className='mt-0'>
							⚡ {totalUserEnergyProduction?.toLocaleString()} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collective Generated:</p>
						<h2 className='mt-0'>
							⚡ {totalAppEnergyProduction?.toLocaleString("en-CA")} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collective Contributed:</p>
						<h2 className='mt-0'>
							⚡ {totalAppEnergyContribution?.toLocaleString("en-CA")} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Together We&apos;re Powering:</p>
						<h2 className='mt-0'>
							🏡{" "}
							{Math.floor(
								totalAppEnergyProduction / averageHomeEnergyConsumption
							).toLocaleString("en-CA")}{" "}
							Homes for an entire year
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;re Powering:</p>
						<h2 className='mt-0'>
							🏡{" "}
							{totalUserEnergyProduction / averageHomeEnergyConsumption < 10
								? (
										totalUserEnergyProduction / averageHomeEnergyConsumption
								  ).toFixed(2)
								: Math.floor(
										totalUserEnergyProduction / averageHomeEnergyConsumption
								  ).toLocaleString("en-CA")}{" "}
							{totalUserEnergyProduction / averageHomeEnergyConsumption < 1
								? "of a home for an entire year"
								: totalUserEnergyProduction / averageHomeEnergyConsumption === 1
								? "home for an entire year"
								: "homes for an entire year"}{" "}
						</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default withAuth(Dashboard);
