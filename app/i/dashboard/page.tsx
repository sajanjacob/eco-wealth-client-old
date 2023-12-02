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
import Loading from "@/components/Loading";

interface DashboardProps {}
type MetricData = {
	data: [
		{
			totalTrees: number;
			totalPlantedTrees: number;
			treesContributed: number;
			totalEstKwhContributedPerYear: number;
			totalEnergyProduced: number;
			totalArraysInstalled: number;
			totalHomesPowered: number;
		}
	];
	totalData: {
		totalTrees: number;
		totalTreesPlanted: number;
		totalEnergyProduced: number;
		totalArraysInstalled: number;
		totalEstKwhContributedPerYear: number;
		treesContributed: number;
		totalHomesPowered: number;
	};
};

const Dashboard = ({}: DashboardProps) => {
	const user = useAppSelector((state: RootState) => state.user);
	const [loading, setLoading] = useState(false);
	const [metricData, setMetricData] = useState<MetricData | null>(null); // [TODO] - type this properly

	// State for animation
	const [totalUserTreeContributions, setTotalUserTreeContributions] =
		useState(0);
	const [totalUserTreeCount, setTotalUserTreeCount] = useState(0);
	const [totalAppTreeCount, setTotalAppTreeCount] = useState(0);
	const [estUserEnergyContributions, setEstUserEnergyContributions] =
		useState(0);
	const [totalUserEnergyProduction, setTotalUserEnergyProduction] = useState(0);
	const [totalUserHomesPowering, setTotalUserHomesPowering] = useState(0);

	const [totalAppEnergyProduction, setTotalAppEnergyProduction] = useState(0);
	const [totalAppEnergyContribution, setTotalAppEnergyContribution] =
		useState(0);
	const [totalAppTreesContributed, setTotalAppTreesContributed] = useState(0);
	const [totalAppHomesPowering, setTotalAppHomesPowering] = useState(0);

	const fetchMetrics = async () => {
		setLoading(true);

		if (user && user.investorId) {
			await axios
				.get(
					`${getBasePath()}/api/investor_metrics?investorId=${user.investorId}`
				)
				.then((res) => {
					setMetricData(convertToCamelCase(res.data));
				})
				.catch((err) => {
					console.log("metrics err >>> ", err);
				});
			setLoading(false);
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMetrics();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user.investorId]);

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
		if (!metricData) return;
		animateValue(
			"totalUserTreeContributions",
			0,
			metricData?.data[0]?.treesContributed || 0,
			baseDuration,
			setTotalUserTreeContributions
		);

		animateValue(
			"totalUserTreeCount",
			0,
			metricData?.data[0]?.totalTrees || 0,
			baseDuration,
			setTotalUserTreeCount
		);

		animateValue(
			"totalUserEnergyProduction",
			0,
			metricData?.data[0]?.totalEnergyProduced || 0,
			baseDuration,
			setTotalUserEnergyProduction
		);
		animateValue(
			"estUserEnergyContributions",
			0,
			metricData?.data[0]?.totalEstKwhContributedPerYear || 0,
			baseDuration,
			setEstUserEnergyContributions
		);
		animateValue(
			"totalUserHomesPowering",
			0,
			metricData?.data[0]?.totalHomesPowered || 0,
			metricData?.data[0]?.totalHomesPowered > 1 ? baseDuration : 75,
			setTotalUserHomesPowering
		);
		animateValue(
			"targetTotalAppTreeCount",
			0,
			metricData?.totalData?.totalTreesPlanted || 0,
			baseDuration,
			setTotalAppTreeCount
		);
		animateValue(
			"targetTotalAppEnergyProduction",
			0,
			metricData?.totalData?.totalEnergyProduced || 0,
			baseDuration,
			setTotalAppEnergyProduction
		);
		animateValue(
			"totalAppTreesContributed",
			0,
			metricData?.totalData?.treesContributed || 0,
			baseDuration,
			setTotalAppTreesContributed
		);
		animateValue(
			"totalAppEnergyContribution",
			0,
			metricData?.totalData?.totalEstKwhContributedPerYear || 0,
			baseDuration,
			setTotalAppEnergyContribution
		);

		animateValue(
			"totalHomesPowering",
			0,
			metricData?.totalData?.totalHomesPowered || 0,
			metricData?.totalData?.totalHomesPowered > 1 ? baseDuration : 75,
			setTotalAppHomesPowering
		);
		return () => {
			// Clear all animations on component unmount
			// eslint-disable-next-line react-hooks/exhaustive-deps
			Object.keys(animationIntervals.current).forEach(clearAnimation);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [metricData]);

	const CO2RemovalRate = 4.5;
	const ConvertToKGFromTonnes = 1016.04691;

	if (loading)
		return (
			<div className='lg:w-[1200px] w-[90%] h-[100vh] mx-auto'>
				<h1 className='text-3xl font-bold mt-8'>Investor Dashboard</h1>
				<Loading />
			</div>
		);

	return (
		<div className='h-[100vh] lg:w-[1200px] mx-auto w-[90%]'>
			<h1 className='text-3xl font-bold my-8 lg:ml-0'>
				Investor Dashboard | Hello {user.name}!
			</h1>
			<div className='mx-auto border border-[var(--header-border)] rounded-lg p-8 text-center'>
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
						<p className='mb-2'>Collectively We&apos;ve Planted</p>
						<h2 className='mt-0'>
							🌳 {totalAppTreeCount?.toLocaleString("en-CA")}
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collectively We&apos;ve Contributed</p>
						<h2 className='mt-0'>
							🌳 {totalAppTreesContributed?.toLocaleString("en-CA")}
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collectively We&apos;ve Offset</p>
						<h2 className='mt-0'>
							☁️{" "}
							{Math.floor(
								totalAppTreeCount * CO2RemovalRate * ConvertToKGFromTonnes
							)?.toLocaleString("en-CA")}{" "}
							kg of CO²
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;ve Offset</p>
						<h2 className='mt-0'>
							☁️{" "}
							{Math.floor(
								totalUserTreeCount * CO2RemovalRate * ConvertToKGFromTonnes
							)?.toLocaleString("en-CA")}{" "}
							kg of CO²
						</h2>
					</div>
				</div>
				<hr className='my-8 border-[var(--header-border)]' />
				<div className='grid grid-cols-3 gap-8'>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;ve Contributed</p>
						<h2 className='mt-0'>
							⚡ {estUserEnergyContributions?.toFixed(2).toLocaleString()} KWH
						</h2>
					</div>

					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;ve Generated</p>
						<h2 className='mt-0'>
							⚡ {totalUserEnergyProduction?.toFixed(2).toLocaleString()} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collectively We&apos;ve Generated</p>
						<h2 className='mt-0'>
							⚡ {totalAppEnergyProduction?.toFixed(2).toLocaleString()} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collectively We&apos;ve Contributed</p>
						<h2 className='mt-0'>
							⚡ {totalAppEnergyContribution?.toFixed(2).toLocaleString()} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>Collectively We&apos;re Powering</p>
						<h2 className='mt-0'>
							🏡 {totalAppHomesPowering.toFixed(2)}{" "}
							{totalAppHomesPowering < 1
								? "of a home for an entire year"
								: totalAppHomesPowering === 1
								? "home for an entire year"
								: "homes for an entire year"}{" "}
						</h2>
					</div>
					<div className='flex flex-col items-center p-4 hover:border-white rounded-md  transition-all hover:bg-green-50 hover:bg-opacity-5'>
						<p className='mb-2'>You&apos;re Powering</p>
						<h2 className='mt-0'>
							🏡 {totalUserHomesPowering.toFixed(2)}{" "}
							{totalUserHomesPowering < 1
								? "of a home for an entire year"
								: totalUserHomesPowering === 1
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
