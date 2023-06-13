import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
type Props = {
	handleUpdateInvestorOnboardingData: () => void;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function InvestorOnboardingSubmit({
	handleUpdateInvestorOnboardingData,
	loading,
	setLoading,
}: Props) {
	const router = useRouter();
	const user = useAppSelector((state) => state.user);
	const [loadingMessage, setLoadingMessage] =
		useState(`Submitting your answers and activating
	your investor account...`);
	useEffect(() => {
		setLoading(true);
		handleUpdateInvestorOnboardingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (user.investorOnboardingComplete && !loading) {
			setLoadingMessage("Redirecting you to the investor dashboard...");
			setTimeout(() => {
				router.push("/i/dashboard");
			}, 2000);
		}
	}, [user, router, loading]);

	return (
		<div className='flex flex-col justify-center items-center h-[60vh] text-center'>
			<CircularProgress
				className='mb-8'
				color='success'
			/>
			{loadingMessage}
		</div>
	);
}
