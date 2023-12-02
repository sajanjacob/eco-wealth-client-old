"use client";
import React, { useEffect } from "react";
import withAuth from "@/utils/withAuth";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import ProducerOnboarding from "@/components/onboarding/producer/ProducerOnboarding";

function Onboarding() {
	// ... component code ...
	const user = useAppSelector((state: RootState) => state.user);
	const router = useRouter();
	useEffect(() => {
		if (user.producerOnboardingComplete && user.activeRole === "producer") {
			router.push("/p/dashboard");
		}
		if (user.activeRole === "investor") {
			if (user.investorOnboardingComplete) {
				router.push("/i/dashboard");
			} else {
				router.push("/i/onboarding");
			}
		}
	}, [user, router]);

	return (
		<div className='h-auto min-h-[100vh] w-[80%] lg:w-[800px] mx-auto pt-8'>
			<h1 className='text-4xl mt-6 mb-2 font-light'>Eco Wealth</h1>
			<h2 className='text-2xl lg:mb-6 text-gray-400'>Producer Onboarding</h2>
			<p className='text-gray-400'>
				Complete your onboarding to activate your Eco Wealth Producer account
				today.
			</p>
			<ProducerOnboarding />
		</div>
	);
}

export default withAuth(Onboarding);
