"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RootState } from "@/redux/store"; // Import RootState from your Redux store

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import About from "@/components/home/About";
import Strategy from "@/components/home/Strategy";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import RecentRegistrations from "@/components/RecentRegistrations";
import WaitingListGoalTracker from "@/components/WaitingListGoalTracker";
import Disclaimer from "@/components/home/Disclaimer";
import Footer from "@/components/home/Footer";
import { setUser } from "@/redux/features/userSlice";
import handleReferrerIds from "@/utils/handleReferrerIds";
import PrototypePreview from "@/components/home/PrototypePreview";
import JoinWaitlistButton from "@/components/home/JoinWaitlistButton";
import { buttonClass } from "@/lib/tw-styles";

// TODO: remove guard statements in login & sign up pages when launching beta
export default function Home() {
	const backgroundImageUrl = "/images/matthew-smith-rFBA42UFpLs-unsplash.jpg";
	const router = useRouter();
	// const [treeCount, setTreeCount] = React.useState(0);
	// const [arrayCount, setArrayCount] = React.useState(0);

	const searchParams = useSearchParams();
	const referrerIds = searchParams?.get("r");
	const path = usePathname();
	// Store referrerIds in localStorage
	useEffect(() => {
		if (referrerIds) {
			handleReferrerIds({
				urlReferrerIds: JSON.parse(referrerIds as string),
				pageSource: path!,
			});
		} else {
			handleReferrerIds({ pageSource: path! });
		}
	}, [referrerIds, path]);

	const user = useAppSelector((state: RootState) => state.user);

	// const fetchTreeCount = async () => {
	// 	const res = await fetch("/api/trees");
	// 	const data = await res.json();
	// 	setTreeCount(data.total);
	// };

	// const fetchArrayCount = async () => {
	// 	const res = await fetch("/api/solarArrays");
	// 	const data = await res.json();
	// 	setArrayCount(data.total);
	// };

	// useEffect(() => {
	// 	fetchTreeCount();
	// 	fetchArrayCount();
	// }, []);
	const [pinnedQuestions, setPinnedQuestions] = useState([]);

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
	const handleWaitingListClick = () => router.push("/register");
	const dispatch = useAppDispatch();
	const handleInvestorClick = () => router.push("/i/discover");
	const handleProducerClick = () => router.push("/p/projects");
	useEffect(() => {
		dispatch(setUser({ ...user, loadingUser: false }));
	}, [user, dispatch]);

	return (
		<>
			<div
				className='z-0 absolute top-0 w-[100%] mx-auto h-[100vh] bg-cover bg-center flex justify-center items-center bg-no-repeat'
				style={{
					backgroundImage: `url(${backgroundImageUrl})`,
				}}
			>
				<div className='z-[1000] w-full h-full flex justify-center flex-col items-center bg-black bg-opacity-75'>
					<div className='z-[1000] w-[80%] m-auto items-center md:w-[50%]'>
						{/* <h1 className='text-2xl font-light mb-4'>
						Together, we&apos;ve planted {treeCount} trees & installed{" "}
						{arrayCount} solar arrays.
					</h1> */}
						<h1 className='text-2xl font-bold mb-4'>
							Empower sustainable solutions today.
						</h1>
						{!user.loggedIn && (
							<div>
								<h3 className='text-gray-400 font-bold text-lg md:text-2xl md:w-[100%] mt-8 md:mt-0'>
									Participate in funding or running
									<span
										className='text-[var(--h-one)] cursor-pointer'
										onClick={(e) => {
											e.preventDefault();
											router.push("/#about");
										}}
									>
										{" "}
										tree-based agriculture
									</span>{" "}
									or{" "}
									<span
										className='text-[var(--h-one)] cursor-pointer'
										onClick={(e) => {
											e.preventDefault();
											router.push("/#about");
										}}
									>
										renewable energy
									</span>{" "}
									projects.
								</h3>
								<h4 className='mt-4 text-gray-300 text-lg font-light'>
									Join the waiting list today and help unite ecology and
									economy.
								</h4>
								<button
									className='z-[1000] pulsate mb-4 cursor-pointer transition-all bg-[var(--cta-one)] hover:bg-[var(--cta-one-hover)] text-white font-medium rounded-md text-sm lg:text-lg lg:px-8 px-4 py-2 mt-8'
									onClick={handleWaitingListClick}
								>
									Join the waiting list today
								</button>
								<WaitingListGoalTracker />
								{/* <h3 className='text-white text-right font-medium '>
								<span
									className='cursor-pointer transition-colors text-[var(--cta-one)] underline hover:text-[var(--cta-one-hover)]'
									onClick={handleLoginClick}
								>
									Login
								</span>{" "}
								or{" "}
								<span
									className='cursor-pointer transition-colors text-[var(--cta-one)] underline hover:text-[var(--cta-one-hover)]'
									onClick={handleSignupClick}
								>
									create an account
								</span>{" "}
								today.
							</h3> */}
							</div>
						)}
						{user.loggedIn && (
							<div className='flex flex-col mt-8'>
								<h3 className='text-[var(--main-link-color)] font-medium text-4xl mt-3 '>
									Make a difference today, {user.name?.split(" ")[0]}.
								</h3>
								<div className='flex'>
									{user.activeRole === "investor" ? (
										<button
											onClick={handleInvestorClick}
											className={buttonClass}
										>
											Search for a project
										</button>
									) : user.activeRole === "producer" ? (
										<button
											onClick={handleProducerClick}
											className={buttonClass}
										>
											View your projects
										</button>
									) : null}
								</div>
							</div>
						)}
					</div>
					<div className='flex justify-end w-[100%]'>
						<h6 className='text-right text-white font-light mb-4 mr-4 text-xs opacity-50'>
							Photo credits — Matthew Smith (Unsplash).
						</h6>
					</div>
				</div>
			</div>
			<div className='2xl:w-[1200px] md:mx-auto mt-[90vh]'>
				<About />
				<PrototypePreview />
				<Strategy />
				<HowItWorks />
				<Pricing handleWaitingListClick={handleWaitingListClick} />
				<div className='flex justify-center'>
					<JoinWaitlistButton />
				</div>
				<RecentRegistrations />
				<Disclaimer />
				<Footer />
			</div>
		</>
	);
}
