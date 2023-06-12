"use client";
import React from "react";
import withAuth from "@/utils/withAuth";
import InvestorOnboarding from "@/components/onboarding/InvestorOnboarding";

function Onboarding() {
	// ... component code ...
	return (
		<div className='h-auto min-h-[100vh] w-[80%] mx-auto'>
			<h1 className='text-2xl my-6'>Investor Onboarding</h1>
			<InvestorOnboarding />
		</div>
	);
}

export default withAuth(Onboarding);
