"use client";
import { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store"; // import the root state from your redux store
import { setTotalUserTreeCount, setUserTreeCount } from "@/redux/actions"; // import actions from your redux store
import withAuth from "@/utils/withAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
	const user = useAppSelector((state) => state.user);
	// Tree count values
	const targetTotalUserTreeCount = 333333;
	const targetTotalAppTreeCount = 1111111111111;
	const targetUserTreeCount = 45;

	// This is for animation
	const [totalUserTreeCount, setTotalUserTreeCount] = useState(0);
	const [totalAppTreeCount, setTotalAppTreeCount] = useState(0);
	const [userTreeContributionCount, setUserTreeCount] = useState(0);

	// Energy production values
	const targetTotalUserEnergyProduction = 10000;
	const targetTotalAppEnergyProduction = 33333333333;
	const targetUserEnergyProduction = 8888888;

	const [totalUserEnergyProduction, setTotalUserEnergyProduction] = useState(0);
	const [totalAppEnergyProduction, setTotalAppEnergyProduction] = useState(0);
	const [userEnergyProduction, setUserEnergyProduction] = useState(0);

	// This is for animation
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
		animateValue(
			0,
			targetTotalAppTreeCount,
			baseDuration,
			setTotalAppTreeCount
		);
		animateValue(
			0,
			targetTotalUserEnergyProduction,
			baseDuration,
			setTotalUserEnergyProduction
		);
		animateValue(
			0,
			targetUserEnergyProduction,
			baseDuration,
			setUserEnergyProduction
		);
		animateValue(
			0,
			targetTotalAppEnergyProduction,
			baseDuration,
			setTotalAppEnergyProduction
		);
	}, [
		targetTotalUserTreeCount,
		targetUserTreeCount,
		targetTotalAppTreeCount,
		targetTotalUserEnergyProduction,
		targetUserEnergyProduction,
		targetTotalAppEnergyProduction,
	]);

	const CO2RemovalRate = 4.5;
	const ConvertToKGFromTonnes = 1016.04691;
	const averageHomeEnergyConsumption = 11000;
	return (
		<div className='h-[100vh] w-[100%]'>
			<h1 className='mb-12 pt-12 ml-8 text-2xl'>
				Producer Dashboard | Hello {user.name}!
			</h1>
			<div className='w-3/4 mx-auto border border-gray-700  rounded-lg p-8 '>
				<div className='grid grid-cols-2 gap-8'>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>Total Trees Planted</p>
						<h2 className='mt-0'>
							🌳 {totalAppTreeCount.toLocaleString("en-CA")}
						</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>Your Trees Planted</p>
						<h2 className='mt-0'>
							🌳 {userTreeContributionCount.toLocaleString("en-CA")}
						</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>Together We&apos;ve Offset:</p>
						<h2 className='mt-0'>
							☁️{" "}
							{Math.floor(
								totalAppTreeCount * CO2RemovalRate * ConvertToKGFromTonnes
							).toLocaleString("en-CA")}{" "}
							kg of CO²
						</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>You&apos;ve Offset:</p>
						<h2 className='mt-0'>
							☁️{" "}
							{Math.floor(
								userTreeContributionCount *
									CO2RemovalRate *
									ConvertToKGFromTonnes
							).toLocaleString("en-CA")}{" "}
							kg of CO²
						</h2>
					</div>

					{/* Add two more elements here */}
				</div>
				<hr className='my-8' />
				<div className='grid grid-cols-2 gap-8'>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>Total Energy Generated:</p>
						<h2 className='mt-0'>
							⚡ {totalAppEnergyProduction.toLocaleString("en-CA")} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>You&apos;ve Generated:</p>
						<h2 className='mt-0'>
							⚡ {userEnergyProduction.toLocaleString()} KWH
						</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>Together We&apos;re Powering:</p>
						<h2 className='mt-0'>
							🏡{" "}
							{Math.floor(
								totalAppEnergyProduction / averageHomeEnergyConsumption
							).toLocaleString("en-CA")}{" "}
							Homes for an entire year
						</h2>
					</div>
					<div className='flex flex-col items-center'>
						<p className='mb-2'>You&apos;re Powering:</p>
						<h2 className='mt-0'>
							🏡{" "}
							{userEnergyProduction / averageHomeEnergyConsumption < 10
								? (userEnergyProduction / averageHomeEnergyConsumption).toFixed(
										2
								  )
								: Math.floor(
										userEnergyProduction / averageHomeEnergyConsumption
								  ).toLocaleString("en-CA")}{" "}
							{userEnergyProduction / averageHomeEnergyConsumption < 1
								? "of a home for an entire year"
								: userEnergyProduction / averageHomeEnergyConsumption === 1
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
