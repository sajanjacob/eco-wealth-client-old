"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // import the root state from your redux store
import { setTotalUserTreeCount, setUserTreeCount } from "@/redux/actions"; // import actions from your redux store
import withAuth from "@/utils/withAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
	const targetTotalUserTreeCount = 5000;
	const targetUserTreeCount = 45;

	// This is for animation
	const [totalUserTreeCount, setTotalUserTreeCount] = useState(0);
	const [userTreeContributionCount, setUserTreeCount] = useState(0);

	const animateValue = (
		start: number,
		end: number,
		baseDuration: number,
		callback: (value: number) => void
	) => {
		const range = end - start;
		let current = start;
		const increment = range / Math.abs(baseDuration / 10);
		const stepTime = baseDuration / (range / increment);
		const timer = setInterval(() => {
			current += increment;
			if (current >= end) {
				current = end;
				clearInterval(timer);
			}
			callback(Math.floor(current));
		}, stepTime);
	};

	useEffect(() => {
		const baseDuration = 2000;

		animateValue(0, targetTotalUserTreeCount, baseDuration, setUserTreeCount);
		animateValue(0, targetUserTreeCount, baseDuration, setTotalUserTreeCount);
	}, [targetTotalUserTreeCount, targetUserTreeCount]);

	const CO2RemovalRate = 4.5;
	const ConvertToKGFromTonness = 1016.04691;

	return (
		<div className='dark:bg-green-950 h-[100vh] w-[100vw]'>
			<h1 className='mb-12 pt-12 ml-8 text-2xl'>Investor Dashboard</h1>
			<div className='w-3/4 mx-auto border border-gray-100  rounded-lg p-8 '>
				<div className='grid grid-cols-2 gap-8'>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>Total Trees Planted</p>
						<h2 className='mt-0'>{totalUserTreeCount}</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>Your Trees Planted</p>
						<h2 className='mt-0'>{userTreeContributionCount}</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>Together We&apos;ve Offset:</p>
						<h2 className='mt-0'>
							{Math.floor(
								totalUserTreeCount * CO2RemovalRate * ConvertToKGFromTonness
							)}{" "}
							kg of CO²
						</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>You&apos;ve Offset:</p>
						<h2 className='mt-0'>
							{Math.floor(
								userTreeContributionCount *
									CO2RemovalRate *
									ConvertToKGFromTonness
							)}{" "}
							kg of CO²
						</h2>
					</div>
					{/* Add two more elements here */}
				</div>
			</div>
		</div>
	);
};

export default withAuth(Dashboard);
