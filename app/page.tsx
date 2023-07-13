"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { RootState } from "@/redux/store"; // Import RootState from your Redux store
import {
	navigateToInvestorDashboard,
	navigateToProducerDashboard,
} from "@/redux/actions"; // Import the actions from your actions file
import { useAppSelector, useAppDispatch } from "@/redux/hooks";

export default function Home() {
	const backgroundImageUrl =
		"https://storage.googleapis.com/msgsndr/6xhGkq67K123q2R9TMf0/media/644868002b9d838721622a4d.jpeg";
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [treeCount, setTreeCount] = React.useState(0);
	const [arrayCount, setArrayCount] = React.useState(0);

	const user = useAppSelector((state: RootState) => state.user);

	const fetchTreeCount = async () => {
		const res = await fetch("/api/trees");
		const data = await res.json();
		setTreeCount(data.total);
	};

	const fetchArrayCount = async () => {
		const res = await fetch("/api/solarArrays");
		const data = await res.json();
		console.log("tree count >>> ", data);
		setArrayCount(data.total);
	};

	useEffect(() => {
		fetchTreeCount();
		fetchArrayCount();
	}, []);

	// useEffect(() => {
	// 	if (user.loggedIn) {
	// 		// Dispatch the appropriate navigation action based on the user's active role
	// 		if (user.roles.includes("investor")) {
	// 			dispatch(navigateToInvestorDashboard(user.id));
	// 		} else if (user.roles.includes("producer")) {
	// 			dispatch(navigateToProducerDashboard(user.id));
	// 		}
	// 	}
	// }, [user, dispatch]);

	const handleLoginClick = () => router.push("/login");
	const handleSignupClick = () => router.push("/signup");

	return (
		<div
			className='w-[100%] mx-auto h-[95vh] bg-cover bg-center flex justify-center items-center bg-no-repeat'
			style={{
				backgroundImage: `url(${backgroundImageUrl})`,
			}}
		>
			<div className='w-full h-full flex justify-center flex-col items-center bg-black bg-opacity-50'>
				<div className=' w-[80%] m-auto items-center md:w-[50%]'>
					<h1 className='text-2xl font-light mb-4'>
						Together, we&apos;ve planted {treeCount} trees & installed{" "}
						{arrayCount} solar arrays.
					</h1>
					<h1 className='text-white text-3xl md:w-[100%]'>
						Together, we can make a positive impact all around the world by{" "}
						<span className='text-[var(--main-link-color)]'>
							{" "}
							planting trees
						</span>
						, prioritizing{" "}
						<span className='text-[var(--main-link-color)]'> soil health</span>,
						and transitioning to{" "}
						<span className='text-[var(--main-link-color)]'>
							{" "}
							renewable energy
						</span>
						.
					</h1>
					{!user.loggedIn && (
						<div className='flex flex-col '>
							<h3 className='text-white text-right font-medium'>
								By using Eco Wealth, you help make the environment cleaner,
								healthier, and last for generations to come.
							</h3>
							<h3 className='text-white text-right font-medium '>
								<span
									className='cursor-pointer transition-colors text-green-600 underline hover:text-green-300'
									onClick={handleLoginClick}
								>
									Login
								</span>{" "}
								or{" "}
								<span
									className='cursor-pointer transition-colors text-green-600 underline hover:text-green-300'
									onClick={handleSignupClick}
								>
									create an account
								</span>{" "}
								today.
							</h3>
						</div>
					)}
					{user.loggedIn && (
						<div className='flex flex-col mt-8'>
							<h3 className='text-[var(--main-link-color)] font-medium text-4xl mt-3 '>
								Make a difference today, {user.name}.
							</h3>
							<div className='flex'>
								{user.activeRole === "investor" ? (
									<button className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'>
										Search for a project
									</button>
								) : user.activeRole === "producer" ? (
									<button className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'>
										View your projects
									</button>
								) : (
									<button className='w-fit my-4 py-4 px-16 text-xl rounded bg-green-700 text-white font-bold transition-all hover:bg-green-600 hover:scale-105'>
										View your projects
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
			<h6 className='absolute bottom-0 right-0 text-white font-light mb-4 mr-4 text-xs'>
				Photo by Matthew Smith via Unsplash.
			</h6>
		</div>
	);
}
